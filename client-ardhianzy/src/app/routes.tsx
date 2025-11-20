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
  IDEAS_TRADITION: "/ideas-tradition",
  IDEAS_TRADITION_DETAIL: "/ideas-tradition/:slug",
  IDEAS_TRADITION_COMING_SOON: "/ideas-tradition/coming-soon",
  POP_CULTURE_REVIEW: "/pop-culture-review",
  POP_CULTURE_REVIEW_DETAIL: "/pop-culture-review/:slug",
  POP_CULTURE_REVIEW_COMING_SOON: "/pop-culture-review/coming-soon",
  READING_GUIDE: "/reading-guide",
  READING_GUIDE_DETAIL: "/reading-guide/:slug",
  READING_GUIDE_COMING_SOON: "/reading-guide/coming-soon",
  READ: "/read/:articleId",
  GUIDE: "/guide/:guideId",
  PROFILE: "/profile",
  READ_HISTORY: "/read-history",

  ADMIN: {
    ROOT: "/admin",
    LOGIN: "/admin-ardhianzy/login",
    DASHBOARD: "/admin/dashboard",

    ARTICLES: "/admin/articles",
    ARTICLES_ADD: "/admin/articles/add",
    ARTICLES_EDIT: (id: string) => `/admin/articles/${id}`,

    MAGAZINES: "/admin/magazines",
    MAGAZINES_ADD: "/admin/magazines/add",
    MAGAZINES_EDIT: (id: string) => `/admin/magazines/${id}`,

    RESEARCH: "/admin/research",
    RESEARCH_ADD: "/admin/research/add",
    RESEARCH_EDIT: (id: string) => `/admin/research/${id}`,

    MONOLOGUES: "/admin/monologues",
    MONOLOGUES_ADD: "/admin/monologues/add",
    MONOLOGUES_EDIT: (id: string) => `/admin/monologues/${id}`,

    SHOP: "/admin/shop",
    SHOP_ADD: "/admin/shop/add",
    SHOP_EDIT: (id: string) => `/admin/shop/${id}`,

    TOT_LIST: "/admin/tot/list",
    TOT_ADD: "/admin/tot/add",
    TOT_EDIT: (id: string) => `/admin/tot/${id}`,

    TOT_META_LIST: "/admin/meta-tot/list",
    TOT_META_ADD: "/admin/meta-tot/add",
    TOT_META_EDIT: (id: string) => `/admin/meta-tot/${id}`,
  },

  LEGACY: {
    IDEAS_TRADITION: "/IdeasTradition",
    POP_CULTURE_REVIEW: "/PopCultureReview",
    READING_GUIDE: "/ReadingGuide",
  },
} as const;