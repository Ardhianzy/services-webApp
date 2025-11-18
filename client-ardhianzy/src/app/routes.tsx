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
    ARTICLES_EDIT: (id: string | number) => `/admin/articles/${id}`,
  },

  LEGACY: {
    IDEAS_TRADITION: "/IdeasTradition",
    POP_CULTURE_REVIEW: "/PopCultureReview",
    READING_GUIDE: "/ReadingGuide",
  },
} as const;