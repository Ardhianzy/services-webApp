// src/config/endpoints.ts
const DEFAULT_BASE = "https://services-api.ardhianzy.com"; // fallback dari YAML/env
export const API_BASE =
  (import.meta as any)?.env?.VITE_API_URL ??
  DEFAULT_BASE;

export const endpoints = {
  // AUTH
  login:    () => `${API_BASE}/api/auth/login`,
  profile:  () => `${API_BASE}/api/auth/profile`,
  register: () => `${API_BASE}/api/auth/register`,
  logout:   () => `${API_BASE}/api/auth/logout`,

  // ARTICLES
  articles: {
    list:    () => `${API_BASE}/api/articel`,
    create:  () => `${API_BASE}/api/articel`,
    byId:    (id: string|number) => `${API_BASE}/api/articel/${encodeURIComponent(String(id))}`,
    byTitle: (title: string) => `${API_BASE}/api/articel/title/${encodeURIComponent(title)}`,
    update:  (id: string|number) => `${API_BASE}/api/articel/${encodeURIComponent(String(id))}`,
    delete:  (id: string|number) => `${API_BASE}/api/articel/${encodeURIComponent(String(id))}`,
  },

  // ToT
  tot: {
    list:   () => `${API_BASE}/api/tot`,
    byId:   (id: string|number) => `${API_BASE}/api/tot/${encodeURIComponent(String(id))}`,
    create: () => `${API_BASE}/api/ToT`,
    update: (id: string|number) => `${API_BASE}/api/tot/${encodeURIComponent(String(id))}`,
    delete: (id: string|number) => `${API_BASE}/api/tot/${encodeURIComponent(String(id))}`,
  },

  // ToT Meta
  totMeta: {
    list:   () => `${API_BASE}/api/tot-meta`,
    byTotId:(totId: string|number) => `${API_BASE}/api/tot-meta/tot/${encodeURIComponent(String(totId))}`,
    byId:   (id: string|number) => `${API_BASE}/api/tot-meta/${encodeURIComponent(String(id))}`,
    create: () => `${API_BASE}/api/tot-meta`,
    update: (id: string|number) => `${API_BASE}/api/tot-meta/${encodeURIComponent(String(id))}`,
    delete: (id: string|number) => `${API_BASE}/api/tot-meta/${encodeURIComponent(String(id))}`,
  },

  // Shop
    shop: {
    list:    () => `${API_BASE}/api/shop`,
    create:  () => `${API_BASE}/api/shop`,
    byId:    (id: string|number) => `${API_BASE}/api/shop/${encodeURIComponent(String(id))}`,
    byTitle: (title: string) => `${API_BASE}/api/shop/title/${encodeURIComponent(title)}`,
    update:  (id: string|number) => `${API_BASE}/api/shop/${encodeURIComponent(String(id))}`,
    delete:  (id: string|number) => `${API_BASE}/api/shop/${encodeURIComponent(String(id))}`,
    },

    // Collected
    collected: {
    list:    () => `${API_BASE}/api/collected`,
    create:  () => `${API_BASE}/api/collected`,
    byId:    (id: string|number) => `${API_BASE}/api/collected/${encodeURIComponent(String(id))}`,
    byTitle: (title: string) => `${API_BASE}/api/collected/judul/${encodeURIComponent(title)}`,
    update:  (id: string|number) => `${API_BASE}/api/collected/${encodeURIComponent(String(id))}`,
    delete:  (id: string|number) => `${API_BASE}/api/collected/${encodeURIComponent(String(id))}`,
    },

  // RESEARCH (dari research.yaml)
  research: {
    list:   () => `${API_BASE}/api/research`,
    create: () => `${API_BASE}/api/research`,
  },
} as const;