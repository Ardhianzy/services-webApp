// src/app/routes.tsx
export const ROUTES = {
  HOME: "/",

  MAGAZINE: "/magazine",
  SHOP: "/shop",
  RESEARCH: "/research",
  MONOLOGUES: "/monologues",
  IDEAS_TRADITION: "/ideas-tradition",
  POP_CULTURE_REVIEW: "/pop-culture-review",
  READING_GUIDE: "/reading-guide",
  READ: "/read/:articleId",
  GUIDE: "/guide/:guideId",
  PROFILE: "/profile",
  READ_HISTORY: "/read-history",
  LOGIN: "/login",
  SIGNUP: "/signup",

  ADMIN: {
    LOGIN: "/admin/login",
    ROOT: "/admin",
    DASHBOARD: "/admin/dashboard",
    ARTICLES_LIST: "/admin/articles/list",
    ARTICLES_ADD: "/admin/articles/add",
    SHOP_LIST: "/admin/shop/list",
    SHOP_ADD: "/admin/shop/add",
    ANALYTICS: "/admin/analytics",
  },

  LEGACY: {
    IDEAS_TRADITION: "/IdeasTradition",
    POP_CULTURE_REVIEW: "/PopCultureReview",
    READING_GUIDE: "/ReadingGuide",
  },
} as const;