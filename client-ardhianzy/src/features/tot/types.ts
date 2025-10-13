// src/features/tot/types.ts
export type BackendToT = {
  id?: string | number;
  philosofer?: string;          // (typo di BE, FE map -> name)
  years?: string;               // contoh "1844–1900" atau "470-399 BC"
  image?: string;               // URL
  geoorigin?: string;           // contoh "Germany" (dipakai ke flag)
  detail_location?: string;     // "lat,lng" atau "City, Country"
  lat?: number;                 // kalau BE nambah field ini
  lng?: number;                 // kalau BE nambah field ini
};

export type BackendToTMeta = {
  id?: string | number;
  ToT_id?: string | number;
  metafisika?: string;
  epsimologi?: string;          // (typo di BE, FE map -> epistemology)
  epistemologi?: string;        // kalau BE sudah betul
  aksiologi?: string;
  conclusion?: string;
};

export type TimelinePhilosopher = {
  id: string | number;
  name: string;
  years: string;
  lat: number;
  lng: number;
  image?: string;
  flag?: string;
};

export type ToTMeta = {
  metaPhysics?: string;
  epistemology?: string;
  axiology?: string;
  conclusion?: string;
  raw?: BackendToTMeta;         // simpan mentahnya buat debug
};