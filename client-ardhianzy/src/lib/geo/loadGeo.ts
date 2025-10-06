// src/lib/geo/loadGeo.ts
export async function loadWorldGeo(year: number) {
  const url = `${import.meta.env.BASE_URL}data/geo/world/world_${year}.geo.json`;
  const res = await fetch(url, { cache: "force-cache" });
  if (!res.ok) throw new Error(`Failed to load geo ${year}`);
  return res.json();
}