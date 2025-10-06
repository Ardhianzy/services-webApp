import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import RelatedArticles from "@/features/articles/components/RelatedArticles";
import * as ArticlesData from "@/data/articles";

type ContentBlock = { type: "paragraph" | "subheading" | "blockquote"; text: string };
type AuthorLike = string | { name: string; avatar?: string };

type AnyArticle = {
  id: string | number;
  title: string;
  date?: string;
  author?: AuthorLike;
  category?: string;
  image?: string;
  content?: ContentBlock[];

  section?: string;
  publishedAt?: string;
  cover?: string;
  thumbnail?: string;
  excerpt?: string;
  highlightQuote?: string;
};

function isContentBlocks(v: unknown): v is ContentBlock[] {
  return Array.isArray(v) && v.every(b => b && typeof (b as any).type === "string");
}

function formatDate(iso?: string): string | undefined {
  if (!iso) return undefined;
  const d = new Date(iso);
  if (isNaN(d.getTime())) return undefined;
  const day = d.getDate().toString().padStart(2, "0");
  const month = d.toLocaleString("en-US", { month: "short" });
  const year = d.getFullYear();
  return `${day} ${month}, ${year}`;
}

function sectionToDisplay(section?: string): string | undefined {
  switch (section) {
    case "ideas-tradition": return "Ideas & Tradition";
    case "magazine":        return "Magazine";
    case "monologues":      return "Monologues";
    case "pop-cultures":    return "Pop-Culture Review";
    case "reading-guides":  return "Reading Guides";
    case "research":        return "Research";
    default:                return undefined;
  }
}

function buildContentBlocks(a: AnyArticle): ContentBlock[] {
  if (isContentBlocks(a.content) && a.content.length) return a.content;

  const blocks: ContentBlock[] = [];
  const ex = (a.excerpt ?? "").trim();
  if (ex) {
    if (ex.length > 400) {
      const cut = ex.indexOf(".", 250) > 0 ? ex.indexOf(".", 250) + 1 : 300;
      blocks.push({ type: "paragraph", text: ex.slice(0, cut).trim() });
      blocks.push({ type: "paragraph", text: ex.slice(cut).trim() });
    } else {
      blocks.push({ type: "paragraph", text: ex });
    }
  }
  if (a.highlightQuote) {
    blocks.push({ type: "blockquote", text: a.highlightQuote });
  }
  if (blocks.length === 0) {
    blocks.push({ type: "paragraph", text: "No content available." });
  }
  return blocks;
}

function getAuthorName(author?: AuthorLike): string | undefined {
  if (!author) return undefined;
  return typeof author === "string" ? author : author.name;
}

function getImageSrc(a: AnyArticle): string | undefined {
  return a.image ?? a.cover ?? a.thumbnail;
}

export default function ReadPage() {
  const { articleId } = useParams<{ articleId: string }>();
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);

  const articleList: AnyArticle[] = useMemo(
    () => ((ArticlesData as any).allArticles ?? (ArticlesData as any).articles ?? []) as AnyArticle[],
    []
  );

  const article = articleList.find((a) => String(a.id) === String(articleId));

  if (!article) {
    return (
      <main className="bg-black text-white pb-[60px] relative pt-[164px]">
        <div className="max-w-[1203px] mx-auto px-5">
          <button
            onClick={() => navigate(-1)}
            className="absolute top-[150px] left-[27px] inline-flex items-center gap-[10px] text-white underline cursor-pointer mb-0"
            style={{ fontFamily: "'Roboto', sans-serif", fontWeight: 600, fontSize: 20 }}
          >
            <span className="text-[24px]">←</span> Back
          </button>
          <h1>Artikel Tidak Ditemukan</h1>
        </div>
      </main>
    );
  }

  const displayAuthor = getAuthorName(article.author);
  const displayDate = article.date ?? formatDate(article.publishedAt) ?? "";
  const displayCategory = article.category ?? sectionToDisplay(article.section) ?? "";

  const contentBlocks = buildContentBlocks(article);
  const visibleContent = isExpanded ? contentBlocks : contentBlocks.slice(0, 2);
  const canLoadMore = !isExpanded && contentBlocks.length > 2;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Roboto:wght@300;400;500;600;700&family=Petit+Formal+Script&display=swap');
        .read-quote { position: relative; border: none; }
        .read-quote::before, .read-quote::after {
          font-family: 'Petit Formal Script', cursive;
          font-size: 96px;
          position: absolute;
          color: #FFFFFF;
        }
        .read-quote::before { content: '“'; left: 0; top: 0; }
        .read-quote::after  { content: '”'; right: 0; bottom: -40px; }
      `}</style>

      <main className="bg-black text-white pb-[60px] relative pt-[164px]">
        <div className="max-w-[1203px] mx-auto px-5">
          <button
            onClick={() => navigate(-1)}
            className="absolute top-[150px] left-[27px] inline-flex items-center gap-[10px] text-white underline cursor-pointer mb-0"
            style={{ fontFamily: "'Roboto', sans-serif", fontWeight: 600, fontSize: 20 }}
          >
            <span className="text-[24px]">←</span> Back{displayCategory ? ` to "${displayCategory}"` : ""}
          </button>

          <header className="text-center mb-10">
            <h1
              className="m-0 mb-5 leading-[1.1] text-[96px]"
              style={{ fontFamily: "'Bebas Neue', cursive", fontWeight: 400 }}
            >
              {article.title}
            </h1>
            {(displayDate || displayAuthor) && (
              <div
                className="flex justify-center items-center gap-[15px]"
                style={{ fontFamily: "'Roboto', sans-serif", fontWeight: 300, fontSize: 20 }}
              >
                {displayDate && <span className="meta-date">{displayDate}</span>}
                {displayDate && displayAuthor && <span className="w-[7px] h-[7px] bg-white rounded-full inline-block" />}
                {displayAuthor && <span className="meta-author">By {displayAuthor}</span>}
              </div>
            )}
          </header>

          {getImageSrc(article) && (
            <img
              src={getImageSrc(article)}
              alt={article.title}
              className="w-full h-[502px] object-cover mb-[60px] mix-blend-luminosity"
            />
          )}

          <div
            className="max-w-[1036px] mx-auto text-justify"
            style={{ fontFamily: "'Roboto', sans-serif", fontSize: 32, lineHeight: 1.5 }}
          >
            {visibleContent.map((item, idx) => {
              if (item.type === "paragraph") {
                return (
                  <p key={idx} className="mb-[2em]">
                    {item.text}
                  </p>
                );
              }
              if (item.type === "subheading") {
                return (
                  <h2
                    key={idx}
                    className="mb-[0.5em]"
                    style={{ fontWeight: 700, fontSize: 36, lineHeight: 1.4 }}
                  >
                    {item.text}
                  </h2>
                );
              }
              if (item.type === "blockquote") {
                return (
                  <blockquote
                    key={idx}
                    className="read-quote italic font-medium mb-[2em] px-[60px]"
                    style={{ fontSize: 24, lineHeight: 1.6 }}
                  >
                    {item.text}
                  </blockquote>
                );
              }
              return null;
            })}
          </div>

          {canLoadMore && (
            <div
              className="relative h-[150px] -mt-[100px] flex items-end justify-center pointer-events-none"
              style={{ background: "linear-gradient(to bottom, transparent 0%, #000 80%)" }}
            >
              <button
                className="pointer-events-auto bg-transparent border-0 cursor-pointer transition-opacity duration-300 pb-5"
                style={{
                  fontFamily: "'Bebas Neue', cursive",
                  fontWeight: 400,
                  fontSize: 42,
                  lineHeight: "48px",
                  letterSpacing: "0.05em",
                  color: "#FFFFFF",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                onClick={() => setIsExpanded(true)}
              >
                LOAD MORE...
              </button>
            </div>
          )}
        </div>
      </main>

      <RelatedArticles
        articles={articleList.filter(
          (a) => a.category === article.category && String(a.id) !== String(article.id)
        ) as any}
      />
    </>
  );
}