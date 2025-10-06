export type ArticleContentBlock = {
  type: 'paragraph' | string;
  text: string;
};

export type Article = {
  id: string | number;
  category: string; // e.g., 'Research' | 'Monologues' | ...
  title: string;
  date: string;
  image: string;
  author?: string;
  content: ArticleContentBlock[];
};