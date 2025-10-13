// src/features/home/components/TimelineOfThoughtSection.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import type { FeatureCollection } from "geojson";
import "leaflet/dist/leaflet.css";

import PhilosopherMarker from "./map/PhilosopherMarker";
import PhilosopherDetailCard, { type DetailPhilosopher } from "./map/PhilosopherDetailCard";
import { timelinePhilosophers as defaultPhilosophers } from "@/data/philosophers";

export type TimelinePhilosopher = {
  id: string | number;
  name: string;
  years: string;
  lat: number;
  lng: number;
  image?: string;
  flag?: string;
};

type Props = {
  philosophers?: TimelinePhilosopher[];
  onMarkerClick?: (p: TimelinePhilosopher) => void;
};

function ZoomButtons() {
  const map = useMap();
  const bounds: [[number, number], [number, number]] = [
    [90, -180],
    [-90, 180],
  ];
  return (
    <div
      className="absolute left-5 top-1/2 z-[1000] -translate-y-1/2 flex flex-col overflow-hidden rounded-[10px] text-[18px] border border-white bg-black shadow-[0_4px_10px_rgba(0,0,0,0.3)]"
    >
      {["+", "−", "⟳"].map((label) => (
        <button
          key={label}
          onClick={() => {
            if (label === "+") map.zoomIn();
            else if (label === "−") map.zoomOut();
            else map.fitBounds(bounds);
          }}
          className="flex h-10 w-10 items-center justify-center !border-b !border-b-white last:!border-b-0 text-white transition-colors !bg-black hover:bg-white/15 font-sans leading-none text-[18px]" 
          title={label === "⟳" ? "Reset" : label === "+" ? "Zoom In" : "Zoom Out"}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

const mapSourceCandidates: Record<number, string[]> = {
  600:  ["/data/geoworld/world_600.geo.json"],
  700:  ["/data/geoworld/world_700.geo.json"],
  800:  ["/data/geoworld/world_800.geo.json"],
  900:  ["/data/geoworld/world_900.geo.json"],
  1000: ["/data/geoworld/world_1000.geo.json"],
  1100: ["/data/geoworld/world_1100.geo.json"],
  1200: ["/data/geoworld/world_1200.geo.json"],
  1300: ["/data/geoworld/world_1300.geo.json"],
  1400: ["/data/geoworld/world_1400.geo.json"],
  1500: ["/data/geoworld/world_1500.geo.json"],
  1600: ["/data/geoworld/world_1600.geo.json"],
  1700: ["/data/geoworld/world_1700.geo.json"],
  1800: ["/data/geoworld/countries.geo.json"],
  1900: ["/data/geoworld/countries.geo.json"],
};

const START_YEAR = 600;
const END_YEAR = 2000;
const PIXELS_PER_YEAR = 2;

function parseYears(raw: string | undefined | null): [number, number] {
  if (!raw) return [NaN, NaN];
  const norm = String(raw).trim().replace(/[–—]/g, "-").toUpperCase();
  const hasBC = norm.includes("BC");
  const parts = norm.replace(/\s*BC/g, "").split("-").map((s) => s.trim()).filter(Boolean);
  const toNum = (s: string) => {
    const n = Number(s);
    if (Number.isNaN(n)) return NaN;
    return hasBC ? -Math.abs(n) : n;
  };
  if (parts.length === 1) {
    const a = toNum(parts[0]); return [a, a];
  }
  if (parts.length >= 2) {
    const a = toNum(parts[0]); const b = toNum(parts[1]); return [a, b];
  }
  return [NaN, NaN];
}

export default function TimelineOfThoughtSection({
  philosophers = defaultPhilosophers,
  onMarkerClick,
}: Props) {
  const [isClient, setIsClient] = useState(false);
  const [year, setYear] = useState(START_YEAR);
  const [mapData, setMapData] = useState<FeatureCollection | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  const [currentMapFile, setCurrentMapFile] = useState<string>("");

  const [selected, setSelected] = useState<DetailPhilosopher | null>(null);

  const trackRef = useRef<HTMLDivElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const trackWidth = useMemo(() => (END_YEAR - START_YEAR) * PIXELS_PER_YEAR, []);
  const marks = useMemo(
    () => Array.from({ length: Math.floor((END_YEAR - START_YEAR) / 100) + 1 }, (_, i) => START_YEAR + i * 100),
    []
  );

  useEffect(() => setIsClient(true), []);

  useEffect(() => {
    const century = Math.floor(year / 100) * 100;
    const rawCandidates = mapSourceCandidates[century];
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
          continue;
        }
      }
      if (!cancelled) {
        setMapData(null);
        setMapError(
          `Gagal memuat peta untuk abad ${century}. Pastikan file GeoJSON tersedia di salah satu path kandidat.`
        );
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [year]);

  const handleYear: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const y = Number(e.target.value);
    setYear(y);

    if (selected?.years || selected?.fullDates) {
      const [a, b] = parseYears(selected.fullDates ?? selected.years ?? "");
      if (Number.isFinite(a) && Number.isFinite(b) && !(y >= a && y <= b)) {
        setSelected(null);
      }
    }

    const track = trackRef.current;
    const wrap = wrapperRef.current;
    if (track && wrap) {
      const wTrack = track.scrollWidth;
      const wWrap = wrap.clientWidth;
      const pos = ((y - START_YEAR) / (END_YEAR - START_YEAR)) * wTrack - wWrap / 2;
      wrap.scrollTo({
        left: Math.max(0, Math.min(pos, wTrack - wWrap)),
        behavior: "smooth",
      });
    }
  };

  const visiblePhilosophers = useMemo(() => {
    return philosophers.filter((p) => {
      const [a, b] = parseYears(p.years);
      return Number.isFinite(a) && Number.isFinite(b) && year >= a && year <= b;
    });
  }, [philosophers, year]);

  const mapBounds: [[number, number], [number, number]] = [
    [90, -180],
    [-90, 180],
  ];
  const countryStyle = { fillColor: "#333", fillOpacity: 0.5, color: "#888", weight: 1 } as const;
  const onEachCountry: Parameters<typeof GeoJSON>[0]["onEachFeature"] = (feature, layer) => {
    const props = feature?.properties as any;
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
    });
    onMarkerClick?.(p);
  };

  return (
    <section id="timeline-of-thought" className="relative h-full w-full bg-[#1a1a1a] text-white">
      <div className="relative flex h-full flex-col">
        {selected && (
          <PhilosopherDetailCard
            philosopher={selected}
            onClose={() => setSelected(null)}
          />
        )}

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

          {!mapError && isClient && (
            <MapContainer
              center={[20, 0]}
              zoom={3}
              minZoom={3}
              maxZoom={19}
              style={{ width: "100%", height: "100%" }}
              attributionControl={false}
              zoomControl={false}
              maxBounds={mapBounds}
              maxBoundsViscosity={1.0}
            >
              <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" noWrap />

              {mapData?.features && (
                <GeoJSON
                  key={currentMapFile}
                  data={mapData.features as any}
                  style={() => countryStyle}
                  onEachFeature={onEachCountry}
                />
              )}

              {visiblePhilosophers.map((p) => (
                <PhilosopherMarker
                  key={p.id}
                  philosopher={p}
                  onMarkerClick={openDetailFromMarker}
                />
              ))}

              <ZoomButtons />
            </MapContainer>
          )}

          <div
            className="pointer-events-none absolute left-1/2 bottom-[170px] z-[1002] -translate-x-1/2 rounded-[10px] border-2 border-[#555] bg-black px-5 py-[5px] text-center text-[36px] leading-[43px] shadow-[0_4px_10px_rgba(0,0,0,0.25)]"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            {year}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 z-[1001] flex h-[150px] w-full items-center border-t border-white/10 bg-[rgba(40,40,40,0.3)] backdrop-blur-[10px]">
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
                  style={{ left: `${((m - START_YEAR) / (END_YEAR - START_YEAR)) * 100}%` }}
                >
                  <div className="h-5 w-[2px] bg-[#D9D9D9]" />
                  <div
                    className="absolute whitespace-nowrap text-[22px] text-white bottom-[-24px]" 
                    style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                  >
                    {m}
                  </div>
                </div>
              ))}

              <input
                type="range"
                min={START_YEAR}
                max={END_YEAR}
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
        /* Track garis di tengah + ticks, cocok dengan CSS lama */
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

        /* Thumb slider persis: 40px, border 10px hitam, shadow */
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

        /* CHANGED: gradient fade kiri/kanan sesuai legacy: 30% solid #1a1a1a → transparan */
        .tol-fade-left {
          background: linear-gradient(to right, #1a1a1a 30%, transparent 100%);
        }
        .tol-fade-right {
          background: linear-gradient(to left, #1a1a1a 30%, transparent 100%);
        }

        @media (max-width: 768px) {
          .tol-slider::-webkit-slider-thumb { width: 32px; height: 32px; border-width: 8px; }
          .tol-slider::-moz-range-thumb { width: 32px; height: 32px; border-width: 8px; }
        }
      `}</style>
    </section>
  );
}