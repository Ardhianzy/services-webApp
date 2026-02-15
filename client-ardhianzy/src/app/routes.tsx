// src/app/routes.tsx
export const ROUTES = {
  HOME: "/",

  MAGAZINE: "/magazine",
  MAGAZINE_DETAIL: "/magazine/:slug",
  MAGAZINE_COMING_SOON: "/magazine/coming-soon",
  SHOP: "/shop",
  RESEARCH: "/research",
  RESEARCH_DETAIL: "/research/:slug", 
  RESEARCH_COMING_SOON: "/research/coming-soon",
  MONOLOGUES: "/monologues",
  MONOLOGUES_DETAIL: "/monologues/:slug", 
  MONOLOGUES_COMING_SOON: "/monologues/coming-soon",
  // IDEAS_TRADITION: "/ideas-tradition",
  // IDEAS_TRADITION_DETAIL: "/ideas-tradition/:slug",
  // IDEAS_TRADITION_COMING_SOON: "/ideas-tradition/coming-soon",
  // POP_CULTURE_REVIEW: "/pop-culture-review",
  // POP_CULTURE_REVIEW_DETAIL: "/pop-culture-review/:slug",
  // POP_CULTURE_REVIEW_COMING_SOON: "/pop-culture-review/coming-soon",
  ESSAY: "/essay",
  ESSAY_DETAIL: "/essay/:slug",
  ESSAY_COMING_SOON: "/essay/coming-soon",
  // READ: "/read/:articleId",
  // GUIDE: "/guide/:guideId",
  // PROFILE: "/profile",
  // READ_HISTORY: "/read-history",

  ADMIN: {
    ROOT: "/admin",
    LOGIN: "/admin-ardhianzy/login",
    DASHBOARD: "/admin/dashboard",

    ARTICLES: "/admin/articles",
    ARTICLES_ADD: "/admin/articles/add",
    ARTICLES_EDIT: (id: string) => `/admin/articles/${id}/edit`,

    MAGAZINES: "/admin/magazines",
    MAGAZINES_ADD: "/admin/magazines/add",
    MAGAZINES_EDIT: (id: string) => `/admin/magazines/${id}/edit`,

    RESEARCH: "/admin/research",
    RESEARCH_ADD: "/admin/research/add",
    RESEARCH_EDIT: (id: string) => `/admin/research/${id}/edit`,

    MONOLOGUES: "/admin/monologues",
    MONOLOGUES_ADD: "/admin/monologues/add",
    MONOLOGUES_EDIT: (id: string) => `/admin/monologues/${id}/edit`,

    SHOP: "/admin/shop",
    SHOP_ADD: "/admin/shop/add",
    SHOP_EDIT: (id: string) => `/admin/shop/${id}/edit`,

    TOT_LIST: "/admin/tot",
    TOT_ADD: "/admin/tot/add",
    TOT_EDIT: (id: string) => `/admin/tot/${id}/edit`,

    TOT_META_LIST: "/admin/meta-tot",
    TOT_META_ADD: "/admin/meta-tot/add",
    TOT_META_EDIT: (id: string) => `/admin/meta-tot/${id}/edit`,

    YOUTUBE: "/admin/youtube",
    YOUTUBE_ADD: "/admin/youtube/add",
    YOUTUBE_EDIT: (id: string) => `/admin/youtube/${id}/edit`,

  },

  LEGACY: {
    // IDEAS_TRADITION: "/IdeasTradition",
    // POP_CULTURE_REVIEW: "/PopCultureReview",
    ESSAY: "/essay",
  },
} as const;