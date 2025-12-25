// src/features/home/components/TimelineOfThoughtSection.tsx
import { useEffect, useMemo, useRef, useState, Fragment } from "react";
import { MapContainer, TileLayer, GeoJSON, useMap, Polyline, useMapEvents, Pane } from "react-leaflet";
import type { FeatureCollection, Geometry, Feature } from "geojson";
import "leaflet/dist/leaflet.css";

import PhilosopherMarker from "./map/PhilosopherMarker";
import PhilosopherDetailCard, { type DetailPhilosopher } from "./map/PhilosopherDetailCard";
import TimelineSearch from "./TImelineSearch";
import { contentApi } from "@/lib/content/api";
import type { ToTDTO } from "@/lib/content/types";

import maplibregl from "maplibre-gl";
import "@openhistoricalmap/maplibre-gl-dates";
import "@maplibre/maplibre-gl-leaflet";
import L from "leaflet";

if (typeof window !== "undefined") {
  (window as any).maplibregl = (window as any).maplibregl || maplibregl;
}

export type TimelinePhilosopher = {
  id: string | number;
  name: string;
  years: string;
  lat: number;
  lng: number;
  image?: string;
  flag?: string;
  geoorigin?: string | null;
  detail_location?: string | null;
};

type Props = {
  philosophers?: TimelinePhilosopher[];
  onMarkerClick?: (p: TimelinePhilosopher) => void;
};

const WORLD_BOUNDS: [[number, number], [number, number]] = [
  [-85, -180],
  [85, 180],
];

const START_YEAR = -700;
const END_YEAR = 2005;
const PIXELS_PER_YEAR = 2;

const fmtYear = (y: number) => (y < 0 ? `${Math.abs(y)} BC` : `${y}`);
const isoFromYear = (y: number) => {
  const s = Math.abs(y).toString().padStart(4, "0");
  return `${y < 0 ? "-" : ""}${s}-01-01`;
};

const TILE_SIZE = 256;

function projectLatLngToPoint(lat: number, lng: number, zoom: number) {
  const scale = TILE_SIZE * Math.pow(2, zoom);
  const x = ((lng + 180) / 360) * scale;

  const latRad = (lat * Math.PI) / 180;
  const y =
    ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * scale;

  return { x, y };
}

function unprojectPointToLatLng(x: number, y: number, zoom: number): [number, number] {
  const scale = TILE_SIZE * Math.pow(2, zoom);
  const lng = (x / scale) * 360 - 180;

  const n = Math.PI - (2 * Math.PI * y) / scale;
  const lat = (180 / Math.PI) * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)));

  return [lat, lng];
}

function ZoomButtons({ onSearchClick }: { onSearchClick: () => void }) {
  const map = useMap();
  const bounds: [[number, number], [number, number]] = [
    [90, -180],
    [-90, 180],
  ];
  
  const btnClass = "flex h-10 w-10 items-center justify-center !border-b !border-b-white last:!border-b-0 text-white transition-colors !bg-black hover:bg-white/15 font-sans leading-none text-[18px] cursor-pointer";

  return (
    <div className="absolute left-5 top-1/2 z-[1000] -translate-y-1/2 flex flex-col overflow-hidden rounded-[10px] text-[18px] border border-white bg-black shadow-[0_4px_10px_rgba(0,0,0,0.3)]">
      <button
        onClick={onSearchClick}
        className={btnClass}
        title="Search Philosopher"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </button>

      {["+", "−", "⟳"].map((label) => (
        <button
          key={label}
          onClick={() => {
            if (label === "+") map.zoomIn();
            else if (label === "−") map.zoomOut();
            else map.fitBounds(bounds as any);
          }}
          className={btnClass}
          title={label === "⟳" ? "Reset" : label === "+" ? "Zoom In" : "Zoom Out"}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

function EnsureFullWidthNoWrap() {
  const map = useMap();
  useEffect(() => {
    const TILE = 256;
    const apply = () => {
      const el = map.getContainer();
      const w = el?.clientWidth || window.innerWidth || 1920;
      let z = Math.ceil(Math.log2(w / TILE));
      z = Math.max(2, z);

      const isTabletOrMobile = window.innerWidth < 1024;
      const center = isTabletOrMobile ? ([54, 15] as any) : ([20, 0] as any);

      map.setMinZoom(z);
      map.setMaxBounds(WORLD_BOUNDS as any);

      if (map.getZoom() < z) {
        map.setView(center, z, { animate: false });
      } else {
        map.panTo(center, { animate: false });
      }

      map.invalidateSize();
    };

    map.whenReady(() => {
      apply();
    });
    const onResize = () => requestAnimationFrame(apply);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [map]);

  return null;
}

function OHMOverlay({ dateISO }: { dateISO: string }) {
  const map = useMap();

  useEffect(() => {
    const styleUrl = "https://openhistoricalmap.github.io/map-styles/ohm/style.json";
    const gl = (L as any).maplibreGL({
      style: styleUrl,
      attribution: "© OpenHistoricalMap contributors",
      interactive: false,
    }).addTo(map);

    const m = gl.getMaplibreMap?.();
    m?.once?.("styledata", () => (m as any)?.filterByDate?.(dateISO));

    return () => {
      try {
        map.removeLayer(gl);
      } catch {
      }
    };
  }, [map]);

  useEffect(() => {
    const layers = (map as any)?._layers || {};
    const gl = Object.values(layers).find((x: any) => x?.getMaplibreMap);
    const m = (gl as any)?.getMaplibreMap?.();
    try {
      (m as any)?.filterByDate?.(dateISO);
    } catch {
    }
  }, [map, dateISO]);

  return null;
}

const mapSourceCandidates: Record<number, string[]> = {
  600: ["/data/geoworld/world_600.geo.json"],
  700: ["/data/geoworld/world_700.geo.json"],
  800: ["/data/geoworld/world_800.geo.json"],
  900: ["/data/geoworld/world_900.geo.json"],
  1000: ["/data/geoworld/world_1000.geo.json"],
  1100: ["/data/geoworld/world_1100.geo.json"],
  1200: ["/data/geoworld/world_1200.geo.json"],
  1279: ["/data/geoworld/world_1279.geo.json"],
  1300: ["/data/geoworld/world_1300.geo.json"],
  1400: ["/data/geoworld/world_1400.geo.json"],
  1492: ["/data/geoworld/world_1492.geo.json"],
  1500: ["/data/geoworld/world_1500.geo.json"],
  1530: ["/data/geoworld/world_1530.geo.json"],
  1600: ["/data/geoworld/world_1600.geo.json"],
  1650: ["/data/geoworld/world_1650.geo.json"],
  1700: ["/data/geoworld/world_1700.geo.json"],
  1715: ["/data/geoworld/world_1715.geo.json"],
  1783: ["/data/geoworld/world_1783.geo.json"],
  1800: ["/data/geoworld/world_1800.geo.json"],
  1815: ["/data/geoworld/world_1815.geo.json"],
  1880: ["/data/geoworld/world_1880.geo.json"],
  1900: ["/data/geoworld/world_1900.geo.json"],
  1914: ["/data/geoworld/world_1914.geo.json"],
  1920: ["/data/geoworld/world_1920.geo.json"],
  1930: ["/data/geoworld/world_1930.geo.json"],
  1938: ["/data/geoworld/world_1938.geo.json"],
  1945: ["/data/geoworld/world_1945.geo.json"],
  1960: ["/data/geoworld/world_1960.geo.json"],
  1994: ["/data/geoworld/world_1994.geo.json"],
  2005: ["/data/geoworld/countries.geo.json"],
};

function parseYears(raw: string | undefined | null): [number, number] {
  if (!raw) return [NaN, NaN];
  let norm = String(raw).trim().replace(/[–—]/g, "-").toUpperCase();

  const isBC = /\bBCE?\b/.test(norm);
  const isBE = /\bBE\b/.test(norm);

  norm = norm.replace(/\b(BCE?|CE|AD|BE)\b/g, "").trim();

  const parts = norm
    .split("-")
    .map((s) => s.trim())
    .filter(Boolean);

  const toNum = (s: string) => {
    const n = Number(s);
    if (Number.isNaN(n)) return NaN;
    if (isBC) return -Math.abs(n);
    if (isBE) {
      return n;
    }
    return n;
  };

  if (parts.length === 1) {
    const a = toNum(parts[0]);
    return [a, a];
  }
  if (parts.length >= 2) {
    const a = toNum(parts[0]);
    const b = toNum(parts[1]);
    return [a, b];
  }
  return [NaN, NaN];
}

type CountriesFC = FeatureCollection<Geometry, any> | null;
function bboxCentroid(feature: Feature<Geometry, any>): [number, number] | null {
  try {
    const coords: number[][] = [];
    const walk = (g: any) => {
      if (!g) return;
      if (g.type === "Point") coords.push(g.coordinates);
      else if (g.type === "MultiPoint" || g.type === "LineString") g.coordinates.forEach((c: number[]) => coords.push(c));
      else if (g.type === "MultiLineString" || g.type === "Polygon") g.coordinates.flat().forEach((c: number[]) => coords.push(c));
      else if (g.type === "MultiPolygon") g.coordinates.flat(2).forEach((c: number[]) => coords.push(c));
      else if (g.type === "GeometryCollection") (g.geometries || []).forEach(walk);
    };
    walk(feature.geometry);
    if (!coords.length) return null;
    const xs = coords.map((c) => c[0]);
    const ys = coords.map((c) => c[1]);
    const cx = (Math.min(...xs) + Math.max(...xs)) / 2;
    const cy = (Math.min(...ys) + Math.max(...ys)) / 2;
    return [cy, cx];
  } catch {
    return null;
  }
}
const SYNONYM: Record<string, string> = {
  macedon: "greece",
  macedonia: "north macedonia",
  persia: "iran",
  byzantine: "turkey",
  gaul: "france",
};
const MANUAL_XY: Record<string, [number, number]> = {
  stagira: [40.5, 23.8],
  athens: [37.98, 23.72],
  rome: [41.9, 12.5],
  jerusalem: [31.78, 35.22],
  baghdad: [33.3, 44.38],
  cordoba: [37.88, -4.77],
  basra: [30.5, 47.8],
  alexandria: [31.2, 29.9],
  konya: [37.87, 32.48],
  delhi: [28.7, 77.1],
  beijing: [39.9, 116.4],
};
const normName = (s?: string | null) => (s ?? "").toLowerCase().replace(/[^a-z0-9\s\-]/g, "").trim();

function useCountries(): CountriesFC {
  const [fc, setFc] = useState<CountriesFC>(null);
  useEffect(() => {
    let alive = true;
    const base = (import.meta as any)?.env?.BASE_URL ?? "/";
    const path = `${base}${"/data/geoworld/countries.geo.json".replace(/^\/+/, "")}`;
    fetch(path)
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => alive && setFc(j))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);
  return fc;
}

function findFeature(features: any[], target: string) {
  return features.find((f: any) => {
    const props = f.properties || {};
    const name = String(props?.name ?? props?.NAME ?? props?.NAME_EN ?? props?.ADMIN ?? "").toLowerCase();
    return !!name && (name.includes(target) || target.includes(name));
  });
}

function resolveLatLng(t: ToTDTO, currentMap: FeatureCollection | null, modernMap: CountriesFC): [number, number] | null {
  const priorities = [t.detail_location, t.geoorigin, t.modern_country];

  for (const raw of priorities) {
    let cand = normName(raw);
    if (!cand) continue;

    if (MANUAL_XY[cand]) return MANUAL_XY[cand];

    for (const [k, v] of Object.entries(SYNONYM)) {
      if (cand.includes(k)) cand = v;
    }

    if (currentMap?.features) {
      const hit = findFeature(currentMap.features as any[], cand);
      if (hit) {
        const xy = bboxCentroid(hit as Feature<Geometry, any>);
        if (xy) return xy;
      }
    }

    if (modernMap?.features) {
      const hit = findFeature(modernMap.features as any[], cand);
      if (hit) {
        const xy = bboxCentroid(hit as Feature<Geometry, any>);
        if (xy) return xy;
      }
    }
  }

  return null;
}

function MapZoomWatcher({ onZoomChange }: { onZoomChange: (z: number) => void }) {
  const map = useMapEvents({
    zoomend: () => {
      onZoomChange(map.getZoom());
    },
  });

  useEffect(() => {
    onZoomChange(map.getZoom());
  }, [map, onZoomChange]);

  return null;
}

type PositionedTimelinePhilosopher = TimelinePhilosopher & {
  anchorLat: number;
  anchorLng: number;
  mapLat: number;
  mapLng: number;
};

export default function TimelineOfThoughtSection({
  philosophers: overridePhilos = undefined,
  onMarkerClick,
}: Props) {
  const minYear = START_YEAR;
  const maxYear = END_YEAR;
  const [year, setYear] = useState(START_YEAR);

  const [mapData, setMapData] = useState<FeatureCollection | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  const [currentMapFile, setCurrentMapFile] = useState<string>("");

  const [philosophers, setPhilosophers] = useState<TimelinePhilosopher[]>([]);
  const [selected, setSelected] = useState<DetailPhilosopher | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const countries = useCountries();

  const trackRef = useRef<HTMLDivElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const [mapZoom, setMapZoom] = useState<number>(3);

  const centerToYear = (y: number, smooth: boolean) => {
    const track = trackRef.current;
    const wrap = wrapperRef.current;
    if (!track || !wrap) return;
    const wTrack = track.scrollWidth;
    const wWrap = wrap.clientWidth;
    const pos = ((y - minYear) / (maxYear - minYear)) * wTrack - wWrap / 2;
    wrap.scrollTo({
      left: Math.max(0, Math.min(pos, wTrack - wWrap)),
      behavior: smooth ? "smooth" : "auto",
    });
  };

  const [showGuide, setShowGuide] = useState(false);

  const topTimerRef = useRef<number | null>(null);
  const isAtTopRef = useRef(false);
  const dismissedSinceTopRef = useRef(false);

  useEffect(() => {
    if (showGuide) {
      const y = window.scrollY || document.documentElement.scrollTop || 0;
      document.body.setAttribute("data-lock-scroll", String(y));
      document.body.style.position = "fixed";
      document.body.style.top = `-${y}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
      document.body.style.width = "100%";
    } else {
      const y = Number(document.body.getAttribute("data-lock-scroll") || "0");
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.width = "";
      if (!Number.isNaN(y)) window.scrollTo(0, y);
      document.body.removeAttribute("data-lock-scroll");
    }
  }, [showGuide]);

  useEffect(() => {
    const getY = () =>
      window.scrollY ||
      document.documentElement.scrollTop ||
      (document.scrollingElement as any)?.scrollTop ||
      0;
    const isTop = () => getY() <= 1;

    const startTimer = () => {
      if (topTimerRef.current != null || showGuide || dismissedSinceTopRef.current) return;
      topTimerRef.current = window.setTimeout(() => {
        topTimerRef.current = null;
        setShowGuide(true);
      }, 15_000);
    };

    const clearTimer = () => {
      if (topTimerRef.current != null) {
        window.clearTimeout(topTimerRef.current);
        topTimerRef.current = null;
      }
    };

    const onScroll = () => {
      if (isTop()) {
        if (!isAtTopRef.current) {
          isAtTopRef.current = true;
          dismissedSinceTopRef.current = false;
        }
        startTimer();
      } else {
        isAtTopRef.current = false;
        clearTimer();
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    isAtTopRef.current = isTop();
    if (isAtTopRef.current) startTimer();

    return () => {
      clearTimer();
      window.removeEventListener("scroll", onScroll);
    };
  }, [showGuide]);

  const dismissGuide = () => {
    setShowGuide(false);
    dismissedSinceTopRef.current = true;
  };

  useEffect(() => {
    centerToYear(year, false);
  }, []);
  useEffect(() => {
    centerToYear(year, true);
  }, [year]);

  const trackWidth = useMemo(() => (END_YEAR - START_YEAR) * PIXELS_PER_YEAR, []);
  const marks = useMemo(() => {
    const arr: number[] = [];
    for (let m = START_YEAR; m <= END_YEAR; m += 100) arr.push(m);
    return arr;
  }, []);

  useEffect(() => {
    const years = Object.keys(mapSourceCandidates)
      .map((n) => parseInt(n, 10))
      .sort((a, b) => a - b);

    let picked = years[0];
    for (const y of years) {
      if (year >= y) picked = y;
      else break;
    }

    const rawCandidates = mapSourceCandidates[picked];
    if (!rawCandidates || rawCandidates.length === 0) return;

    const base = (import.meta as any)?.env?.BASE_URL ?? "/";
    const candidates = rawCandidates.map((p) => `${base}${p.replace(/^\/+/, "")}`);

    let cancelled = false;
    (async () => {
      for (const path of candidates) {
        try {
          if (cancelled) return;
          setMapError(null);
          setCurrentMapFile(path);
          const res = await fetch(path);
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const data = (await res.json()) as FeatureCollection;
          if (cancelled) return;
          setMapData(data);
          return;
        } catch {
        }
      }
      if (!cancelled) {
        setMapData(null);
        setMapError(`Gagal memuat peta untuk tahun ~${picked}. Pastikan file GeoJSON tersedia.`);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [year]);

  useEffect(() => {
    if (overridePhilos) {
      setPhilosophers(overridePhilos);
      return;
    }
    const ac = new AbortController();
    (async () => {
      try {
        const list = await contentApi.tot.list(ac.signal);
        const mapped: TimelinePhilosopher[] = [];

        for (const t of list) {
          const xy = resolveLatLng(t, mapData, countries);
          if (!xy) continue;

          mapped.push({
            id: t.id,
            name: t.philosofer ?? "Unknown",
            years: t.years ?? "",
            lat: xy[0],
            lng: xy[1],
            image: t.image ?? undefined,
            geoorigin: t.geoorigin,
            detail_location: t.detail_location,
          } as TimelinePhilosopher);
        }

        setPhilosophers(mapped);
      } catch (e) {
        console.error(e);
      }
    })();
    return () => ac.abort();
  }, [overridePhilos, countries, mapData]);

  const handleYear: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const y = Number(e.target.value);
    setYear(y);
    centerToYear(y, true);

    if (selected?.years || (selected as any)?.fullDates) {
      const [a, b] = parseYears((selected as any).fullDates ?? selected?.years ?? "");
      if (Number.isFinite(a) && Number.isFinite(b) && !(y >= a && y <= b)) {
        setSelected(null);
      }
    }

    const track = trackRef.current;
    const wrap = wrapperRef.current;
    if (track && wrap) {
      const wTrack = track.scrollWidth;
      const wWrap = wrap.clientWidth;
      const pos = ((y - minYear) / (maxYear - minYear)) * wTrack - wWrap / 2;
      wrap.scrollTo({ left: Math.max(0, Math.min(pos, wTrack - wWrap)), behavior: "smooth" });
    }
  };

  const visiblePhilosophers = useMemo(() => {
    return philosophers.filter((p) => {
      const [a, b] = parseYears(p.years);
      return Number.isFinite(a) && Number.isFinite(b) && year >= a && year <= b;
    });
  }, [philosophers, year]);

  const positionedVisiblePhilosophers = useMemo<PositionedTimelinePhilosopher[]>(() => {
    if (!visiblePhilosophers.length) return [];

    const zoom = Number.isFinite(mapZoom) ? mapZoom : 3;

    const CARD_WIDTH_PX = 120;
    const CARD_HEIGHT_PX = 160;
    const CARD_RADIUS_PX = Math.max(CARD_WIDTH_PX, CARD_HEIGHT_PX) * 0.55;
    const MIN_DIST = CARD_RADIUS_PX * 2;

    type Node = {
      p: TimelinePhilosopher;
      anchorLat: number;
      anchorLng: number;
      x: number;
      y: number;
    };

    const nodes: Node[] = visiblePhilosophers.map((p) => {
      const anchorLat = p.lat;
      const anchorLng = p.lng;
      const { x, y } = projectLatLngToPoint(anchorLat, anchorLng, zoom);
      return { p, anchorLat, anchorLng, x, y };
    });

    const ITERATIONS = 6;

    for (let iter = 0; iter < ITERATIONS; iter++) {
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];

          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 0.0001;

          if (dist >= MIN_DIST) continue;

          const overlap = (MIN_DIST - dist) / 2;

          const ux = (dx / dist) * overlap;
          const uy = (dy / dist) * overlap;

          a.x -= ux;
          a.y -= uy;
          b.x += ux;
          b.y += uy;
        }
      }
    }

    const result: PositionedTimelinePhilosopher[] = nodes.map((n) => {
      const [mapLat, mapLng] = unprojectPointToLatLng(n.x, n.y, zoom);
      return {
        ...n.p,
        anchorLat: n.anchorLat,
        anchorLng: n.anchorLng,
        mapLat,
        mapLng,
      };
    });

    return result;
  }, [visiblePhilosophers, mapZoom]);

  const countryStyle = { fillColor: "#333", fillOpacity: 0.5, color: "#888", weight: 1 } as const;
  const onEachCountry: Parameters<typeof GeoJSON>[0]["onEachFeature"] = (feature, layer) => {
    const props = (feature as any)?.properties as any;
    const name = props?.name ?? props?.NAME;
    if (name && layer) {
      layer.bindPopup(name);
      layer.on({
        mouseover: (ev: any) => ev.target.setStyle({ fillColor: "#666" }),
        mouseout: (ev: any) => ev.target.setStyle({ fillColor: "#333" }),
      });
    }
  };

  const openDetailFromMarker = (p: TimelinePhilosopher) => {
    setSelected({
      id: p.id,
      name: p.name,
      years: p.years,
      hero: p.image,
      geoorigin: p.geoorigin ?? undefined,
      detail_location: p.detail_location ?? undefined,
    } as any);
    onMarkerClick?.(p);
  };

  const handleSearchSelect = (p: TimelinePhilosopher) => {
    const [start, end] = parseYears(p.years);
    if (Number.isFinite(start)) {
      const targetYear = Number.isFinite(end) ? Math.floor((start + end) / 2) : start;
      
      const clampedYear = Math.max(minYear, Math.min(targetYear, maxYear));
      
      setYear(clampedYear);
      centerToYear(clampedYear, true);
    }
    // Opsional: Jika ingin membuka kartu detail otomatis, uncomment baris ini
    openDetailFromMarker(p);
  };

  return (
    <section id="timeline-of-thought" className="relative h-full w-full bg-[#1a1a1a] text-white">
      <TimelineSearch 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
        data={philosophers}
        onSelect={handleSearchSelect}
      />

      <div className="relative flex h-full flex-col">
        {selected && <PhilosopherDetailCard philosopher={selected} onClose={() => setSelected(null)} />}

        <div className="relative flex-1 overflow-hidden bg-black">
          {mapError && (
            <div
              role="alert"
              aria-live="polite"
              className="absolute inset-0 z-[2000] flex items-center justify-center bg-black/70 px-5 text-center text-[1.05rem] text-red-100"
            >
              {mapError}
            </div>
          )}

          <MapContainer
            center={[20, 0]}
            zoom={3}
            minZoom={2}
            maxZoom={19}
            style={{ width: "100%", height: "100%" }}
            attributionControl={false}
            zoomControl={false}
            maxBounds={WORLD_BOUNDS}
            maxBoundsViscosity={1.0}
            className="leaflet-black-bg"
          >
            <EnsureFullWidthNoWrap />
            <MapZoomWatcher onZoomChange={setMapZoom} />
            
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
              noWrap
              bounds={WORLD_BOUNDS}
            />

            {year < 600 && <OHMOverlay dateISO={isoFromYear(year)} />}

            {mapData?.features && (
              <GeoJSON
                key={currentMapFile}
                data={mapData.features as any}
                style={() => countryStyle}
                onEachFeature={onEachCountry}
              />
            )}

            <Pane name="labels" style={{ zIndex: 650, pointerEvents: 'none' }}>
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png"
                noWrap
                bounds={WORLD_BOUNDS}
              />
            </Pane>

            {positionedVisiblePhilosophers.map((p) => {
              const hasOffset =
                Math.abs(p.anchorLat - p.mapLat) > 1e-6 ||
                Math.abs(p.anchorLng - p.mapLng) > 1e-6;
              
              if (!hasOffset) return null;

              return (
                <Fragment key={`line-${p.id}`}>
                    <Polyline
                      positions={[
                        [p.anchorLat, p.anchorLng],
                        [p.mapLat, p.mapLng],
                      ]}
                      pathOptions={{
                        color: "#C0C0C0",
                        weight: 5,
                        opacity: 0.8,
                        lineCap: "round",
                        lineJoin: "round",
                      }}
                    />
                    <Polyline
                      positions={[
                        [p.anchorLat, p.anchorLng],
                        [p.mapLat, p.mapLng],
                      ]}
                      pathOptions={{
                        color: "#000000",
                        weight: 2.5,
                        opacity: 0.95,
                        lineCap: "round",
                        lineJoin: "round",
                      }}
                    />
                </Fragment>
              );
            })}

            <Pane name="top-markers" style={{ zIndex: 800 }}>
                {positionedVisiblePhilosophers.map((p) => (
                    <PhilosopherMarker
                        key={`marker-${p.id}`}
                        philosopher={{
                          ...p,
                          lat: p.mapLat,
                          lng: p.mapLng,
                        }}
                        onMarkerClick={openDetailFromMarker}
                    />
                ))}
            </Pane>

            <ZoomButtons onSearchClick={() => setIsSearchOpen(true)} />
          </MapContainer>

          <div
            id="tot-down-cta"
            className={`pointer-events-auto absolute bottom-40 right-4 ${
              showGuide ? "z-[3002]" : "z-[1101]"
            } cursor-pointer`}
          >
            <button
              type="button"
              aria-label="Scroll ke bagian berikutnya"
              title="Scroll ke bawah"
              onClick={() => {
                document.getElementById("below-map")?.scrollIntoView({ behavior: "smooth" });
              }}
              className={`cursor-pointer rounded-lg border border-white/50 bg-black/60 backdrop-blur-sm p-3 hover:bg-white/10 transition focus:outline-none focus:ring-2 focus:ring-white/60 ${
                showGuide ? "ring-4 ring-white/70 animate-pulse" : ""
              }`}
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
          </div>

          <div
            className="pointer-events-none absolute left-1/2 bottom-[170px] z-[1002] -translate-x-1/2 rounded-[10px] border-2 border-[#555] bg-black px-5 py-[5px] text-center text-[36px] leading-[43px] shadow-[0_4px_10px_rgba(0,0,0,0.25)]"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            {fmtYear(year)}
          </div>

          {showGuide && (
            <>
              <div className="fixed inset-0 z-[5000] bg-black/70 backdrop-blur-[2px]" />
              <div
                id="tot-guide-callout"
                className="fixed z-[5001] text-left right-4 bottom-[15rem] max-w-[420px] rounded-xl border border-white/70 bg-black/85 p-4 shadow-[0_8px_30px_rgba(0,0,0,0.5)]"
              >
                <p className="font-roboto text-[0.98rem] leading-relaxed">
                  Masih banyak yang bisa digali. Klik panah bawah untuk menemukan wawasan lebih dalam!
                </p>
                <div className="mt-3 flex justify-end">
                  <button
                    onClick={dismissGuide}
                    className="rounded-md cursor-pointer border border-white px-4 py-1 text-white hover:bg-white hover:text-black transition"
                    aria-label="Tutup panduan"
                  >
                    OK
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="absolute bottom-0 left-0 z-[1001] flex h-[120px] md:h-[150px] w-full items-center border-t border-white/10 bg-[rgba(40,40,40,0.3)] backdrop-blur-[10px]">
          <div className="tol-fade-left pointer-events-none absolute left-0 top-0 h-full w-[100px] z-[1002]" />
          <div className="tol-fade-right pointer-events-none absolute right-0 top-0 h-full w-[100px] z-[1002]" />

          <div ref={wrapperRef} className="tol-scroll w-full overflow-x-auto overflow-y-hidden">
            <div
              ref={trackRef}
              className="tol-track relative box-border flex h-[60px] items-center px-[100px]"
              style={{ width: `${trackWidth}px` }}
            >
              {marks.map((m) => (
                <div
                  key={m}
                  className="absolute top-1/2 flex -translate-x-1/2 -translate-y-1/2 transform flex-col items-center justify-center"
                  style={{ left: `${((m - minYear) / (maxYear - minYear)) * 100}%` }}
                >
                  <div className="h-5 w-[2px] bg-[#D9D9D9]" />
                  <div
                    className="absolute whitespace-nowrap text-[22px] text-white bottom-[-24px]"
                    style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                  >
                    {fmtYear(m)}
                  </div>
                </div>
              ))}

              <input
                type="range"
                min={minYear}
                max={maxYear}
                step={1}
                value={year}
                onChange={handleYear}
                className="tol-slider absolute left-0 top-0 h-full w-full cursor-pointer appearance-none bg-transparent outline-none z-20"
              />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .leaflet-black-bg { background: #000 !important; }

        .tol-track {
          background-image: linear-gradient(#888, #888);
          background-repeat: no-repeat;
          background-size: 100% 2px;
          background-position: center;
        }
        .tol-track::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: repeating-linear-gradient(
            to right,
            #888 0, #888 1px,
            transparent 1px, transparent 2%
          );
          background-size: 100% 10px;
          background-position: center;
          pointer-events: none;
        }

        .tol-scroll::-webkit-scrollbar { display: none; }
        .tol-scroll { scrollbar-width: none; -ms-overflow-style: none; }

        .tol-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 40px; height: 40px; border-radius: 50%;
          background: #FFFFFF; border: 10px solid #000000;
          box-shadow: 0px 4px 4px rgba(0,0,0,0.25);
          margin-top: -1px; cursor: pointer;
        }
        .tol-slider::-moz-range-thumb {
          width: 40px; height: 40px; border-radius: 50%;
          background: #FFFFFF; border: 10px solid #000000;
          box-shadow: 0px 4px 4px rgba(0,0,0,0.25);
          cursor: pointer;
        }

        .tol-fade-left {
          background: linear-gradient(to right, #1a1a1a 30%, transparent 100%);
        }
        .tol-fade-right {
          background: linear-gradient(to left, #1a1a1a 30%, transparent 100%);
        }

        #tot-guide-callout {
          position: fixed;
        }
          
        #tot-guide-callout::before {
          content: "";
          position: absolute;
          right: 2.25rem;
          bottom: -12px;
          width: 0; height: 0;
          border-left: 12px solid transparent;
          border-right: 12px solid transparent;
          border-top: 12px solid rgba(255,255,255,0.7);
        }

        #tot-guide-callout::after {
          content: "";
          position: absolute;
          right: 2.25rem;
          bottom: -10px;
          width: 0; height: 0;
          border-left: 10px solid transparent;
          border-right: 10px solid transparent;
          border-top: 10px solid rgba(0,0,0,0.85);
        }

        @media (max-width: 768px) {
          .tol-slider::-webkit-slider-thumb { width: 32px; height: 32px; border-width: 8px; }
          .tol-slider::-moz-range-thumb { width: 32px; height: 32px; border-width: 8px; }
        }
      `}</style>
    </section>
  );
}