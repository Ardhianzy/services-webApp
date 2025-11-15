export type ToTDTO = {
  id: string;
  admin_id?: string | null;
  image?: string | null;
  philosofer?: string | null;
  geoorigin?: string | null;
  detail_location?: string | null;
  years?: string | null;
  slug?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
  keywords?: string | null;
  is_published?: boolean | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type ToTMetaDTO = {
  id: string;
  ToT_id: string;
  metafisika?: string | null;
  epsimologi?: string | null;
  aksiologi?: string | null;
  conclusion?: string | null;
  tot?: Partial<ToTDTO> | null;
};

export type ArticleCategory =
  | "POP_CULTURE"
  | "IDEAS_AND_TRADITIONS"
  | "READING_GUIDLINE"
  | string;

export interface ArticleDTO {
  id: string;
  admin_id: string;
  title: string;
  slug: string;
  image: string | null;
  content: string | null;
  author: string | null;
  date: string | null;
  category: ArticleCategory | string | null;
  meta_title: string | null;
  meta_description: string | null;
  keywords: string | null;
  excerpt: string | null;
  canonical_url: string | null;
  created_at: string;
  updated_at: string;
  is_published: boolean;
  is_featured: boolean;
  view_count: number;
}

export type ArticleListResponse = ListResponse<ArticleDTO>;

export type MagazineDTO = {
  id: string;
  admin_id: string;
  title: string;
  description: string;
  megazine_isi: string;
  image: string;
  slug: string;
  meta_title?: string | null;
  meta_description?: string | null;
  keywords?: string | null;
  pdf_file_id?: string | null;
  pdf_url?: string | null;
  pdf_filename?: string | null;
  pdf_mime?: string | null;
  pdf_size?: number | null;
  pdf_uploaded_at?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type MagazineCardVM = {
  id: string;
  title: string;
  author: string;
  description: string;
  imageUrl: string;
  slug: string;
  href: string;
};

export type ResearchDTO = {
  id: string;
  admin_id: string;
  research_title: string;
  slug: string;
  research_sum: string;
  image: string;
  researcher: string;
  research_date: string;
  fiel?: string | null;
  pdf_file_id?: string | null;
  pdf_url?: string | null;
  pdf_filename?: string | null;
  pdf_mime?: string | null;
  pdf_size?: number | null;
  pdf_uploaded_at?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
  keywords?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  is_published?: boolean | null;
};

export type ResearchCardVM = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  researcher: string;
  dateISO?: string;
  slug: string;
  href: string;
};

export type MonologueDTO = {
  id: string;
  admin_id: string;
  title: string;
  image: string;
  dialog: string;
  judul?: string | null;
  slug: string;
  meta_title?: string | null;
  meta_description?: string | null;
  is_published?: boolean | null;
  pdf_file_id?: string | null;
  pdf_url?: string | null;
  pdf_filename?: string | null;
  pdf_mime?: string | null;
  pdf_size?: number | null;
  pdf_uploaded_at?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type ShopDTO = {
  id: string;
  admin_id?: string | null;
  stock?: string | number | null;
  title: string;
  category?: string | null;
  price?: string | number | null;
  link?: string | null;
  desc?: string | null;
  image?: string | null;
  slug?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
  is_available?: boolean | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type MonologueCardVM = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  author: string;
  dateISO?: string;
  slug: string;
  href: string;
};

export type LatestYoutubeDTO = {
  id: string;
  title: string;
  url: string;
  description?: string | null;
  created_at: string;
};

export type Pagination = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export type ListResponse<T> = {
  success: boolean;
  message?: string;
  data: T[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
};

export type DetailResponse<T> = {
  success: boolean;
  message?: string;
  data: T;
};