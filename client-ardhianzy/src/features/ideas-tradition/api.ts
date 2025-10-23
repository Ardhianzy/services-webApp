import type { IdeaArticle } from "./types";
import { dummyIdeaDetail } from "./dummy-detail";

// stub aman; nanti tinggal ganti ke endpoint BE
export async function fetchIdeaBySlug(slug: string): Promise<IdeaArticle | null> {
  // Contoh integrasi nanti:
  // const res = await fetch(endpoints.ideasTradition.bySlug(slug));
  // if (!res.ok) return null;
  // return (await res.json()) as IdeaArticle;

  return slug === dummyIdeaDetail.slug ? dummyIdeaDetail : null;
}