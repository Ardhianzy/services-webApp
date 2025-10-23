export type IdeaBlock =
  | { type: "paragraph"; html: string }
  | { type: "h2"; text: string }
  | { type: "image"; src: string; alt?: string; caption?: string };

export type IdeaArticle = {
  id: string;
  slug: string;
  title: string;
  hero?: { src: string; alt?: string };
  blocks: IdeaBlock[];
};