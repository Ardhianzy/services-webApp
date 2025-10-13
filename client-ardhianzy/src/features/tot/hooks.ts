// src/features/tot/hooks.ts
import { useEffect, useMemo, useState } from "react";
import { listToT, listToTMetaByTotId } from "./api";
import type { BackendToT, BackendToTMeta, TimelinePhilosopher, ToTMeta } from "./types";
import { timelinePhilosophers as dummyPhilos, type TimelinePhilosopher as DummyTLP } from "@/data/philosophers";

/* ------------- util ------------- */
function normalizeName(s?: string) {
  return (s || "").trim().toLowerCase();
}
function parseYearsWithBC(raw?: string | null): string {
  if (!raw) return "";
  return String(raw).replace(/[–—]/g, "-").trim();
}
function extractLatLng(x: BackendToT): { lat?: number; lng?: number } {
  if (typeof x.lat === "number" && typeof x.lng === "number") return { lat: x.lat, lng: x.lng };
  const s = x.detail_location?.trim() || "";
  const m = s.match(/^\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*$/);
  if (m) return { lat: Number(m[1]), lng: Number(m[2]) };
  return {};
}
const FLAG_ASSET_BY_COUNTRY: Record<string, string> = {
  germany: "/assets/philosophers/GERMANY.jpg",
  france: "/assets/philosophers/FRANCE.jpg",
  // tambahkan sesuai kebutuhan: italy, algeria, dsb.
};

/* ------------- mapping ------------- */
function mapBackendToTimeline(item: BackendToT): TimelinePhilosopher | null {
  const name = item.philosofer?.trim();
  if (!name) return null;

  const years = parseYearsWithBC(item.years);
  const { lat, lng } = extractLatLng(item);
  if (typeof lat !== "number" || typeof lng !== "number") return null; // butuh koordinat untuk marker

  const flag =
    FLAG_ASSET_BY_COUNTRY[normalizeName(item.geoorigin)] || undefined;

  return {
    id: item.id ?? name,
    name,
    years,
    lat,
    lng,
    image: item.image,
    flag,
  };
}

function mapMeta(raw: BackendToTMeta | undefined): ToTMeta | null {
  if (!raw) return null;
  const ep = raw.epistemologi ?? raw.epsimologi;
  if (!raw.metafisika && !ep && !raw.aksiologi && !raw.conclusion) return null;
  return {
    metaPhysics: raw.metafisika,
    epistemology: ep,
    axiology: raw.aksiologi,
    conclusion: raw.conclusion,
    raw,
  };
}

/* ------------- hooks ------------- */

/** Ambil list philosopher untuk timeline (hybrid: gabungkan BE + dummy) */
export function useHybridTimelinePhilosophers() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<TimelinePhilosopher[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const be = await listToT();
        const mapped = be.map(mapBackendToTimeline).filter(Boolean) as TimelinePhilosopher[];

        // Fallback dari dummy untuk yang tidak ada di BE
        const byKey = new Map<string, TimelinePhilosopher>();
        mapped.forEach((m) => byKey.set(`${normalizeName(m.name)}|${m.years}`, m));

        const merged: TimelinePhilosopher[] = [...mapped];
        (dummyPhilos as DummyTLP[]).forEach((d) => {
          const k = `${normalizeName(d.name)}|${d.years}`;
          if (!byKey.has(k)) {
            merged.push({
              id: d.id,
              name: d.name,
              years: d.years,
              lat: d.lat,
              lng: d.lng,
              image: d.image,
              flag: d.flag,
            });
          }
        });

        if (!cancelled) setItems(merged);
      } catch (e: any) {
        if (!cancelled) setError(e?.message || "Gagal memuat ToT");
        if (!cancelled)
          setItems((dummyPhilos as DummyTLP[]).map((d) => ({
            id: d.id, name: d.name, years: d.years, lat: d.lat, lng: d.lng, image: d.image, flag: d.flag,
          })));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return { philosophers: items, loading, error };
}

/** Ambil ToT Meta berdasarkan nama philosopher (hybrid: cari ToT dulu) */
export function useToTMetaByName(name?: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [metaList, setMetaList] = useState<ToTMeta[]>([]);

  useEffect(() => {
    if (!name) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const tot = await listToT();
        const hit = tot.find((x) => normalizeName(x.philosofer) === normalizeName(name));
        if (!hit?.id) {
          setMetaList([]);
          setLoading(false);
          return;
        }
        const metas = await listToTMetaByTotId(hit.id);
        const mapped = metas.map(mapMeta).filter(Boolean) as ToTMeta[];
        if (!cancelled) setMetaList(mapped);
      } catch (e: any) {
        if (!cancelled) {
          setError(e?.message || "Gagal memuat ToT Meta");
          setMetaList([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [name]);

  // gabungkan entri meta menjadi satu ringkasan
  const combined = useMemo<ToTMeta | null>(() => {
    if (!metaList.length) return null;
    const acc: ToTMeta = {};
    for (const m of metaList) {
      acc.metaPhysics = acc.metaPhysics || m.metaPhysics;
      acc.epistemology = acc.epistemology || m.epistemology;
      acc.axiology = acc.axiology || m.axiology;
      acc.conclusion = acc.conclusion || m.conclusion;
    }
    return acc;
  }, [metaList]);

  return { meta: combined, list: metaList, loading, error };
}