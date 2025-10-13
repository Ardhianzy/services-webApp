import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import RelatedArticles from "@/features/articles/components/RelatedArticles";
import { useHybridArticles, findArticleByParam } from "@/features/articles/hooks";

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
  if (a.highlightQuote) blocks.push({ type: "blockquote", text: a.highlightQuote });
  if (blocks.length === 0) blocks.push({ type: "paragraph", text: "No content available." });
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

  const { list: hybridList } = useHybridArticles();
  const articleList: AnyArticle[] = useMemo(() => hybridList as unknown as AnyArticle[], [hybridList]);

  const article = useMemo(
    () => findArticleByParam(articleList as any, articleId) as AnyArticle | undefined,
    [articleList, articleId]
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Roboto:wght@300;400;500;600;700&family=Petit+Formal+Script&display=swap');
        .rp__bebas { font-family: 'Bebas Neue', cursive !important; }
        .rp__roboto { font-family: 'Roboto', sans-serif !important; }
        .read-quote { position: relative !important; border: none !important; }
        .read-quote::before, .read-quote::after {
          font-family: 'Petit Formal Script', cursive !important;
          font-size: 96px !important;
          position: absolute !important;
          color: #FFFFFF !important;
        }
        .read-quote::before { content: '“' !important; left: 0 !important; top: 0 !important; }
        .read-quote::after  { content: '”' !important; right: 0 !important; bottom: -40px !important; }
      `}</style>

      {!article ? (
        <main className="bg-black text-white pb-[60px] relative pt-[164px]">
          <div className="max-w-[1203px] mx-auto px-5">
            <button
              onClick={() => navigate(-1)}
              className="
                rp__roboto !border-white
                absolute top-[150px] left-[27px]
                inline-flex !items-center gap-[10px]
                text-white underline cursor-pointer mb-0
                !rounded-full !px-4 !py-2
                !text-[18px] !font-semibold
                !bg-transparent transition-colors
                hover:!bg-[#191919] focus:!bg-[#191919] active:!bg-[#191919]
              "
            >
              <span className="inline-grid !place-items-center !w-[24px] !h-[24px] !leading-[0]">
                <span className="pointer-events-none select-none !text-[18px]" aria-hidden>←</span>
              </span>
              Back
            </button>

            <h1>Artikel Tidak Ditemukan</h1>
          </div>
        </main>
      ) : (
        <>
          <main className="bg-black text-white pb-[60px] relative pt-[164px]">
            <div className="max-w-[1203px] mx-auto px-5">
              <button
                onClick={() => navigate(-1)}
                className="
                  rp__roboto !border-white
                  absolute !top-[150px] !left-[27px]
                  inline-flex !items-center gap-[10px]
                  text-white underline cursor-pointer mb-0
                  !rounded-full !px-4 !py-2
                  !text-[18px] !font-semibold
                  !bg-transparent transition-colors
                  hover:!bg-[#191919] focus:!bg-[#191919] active:!bg-[#191919]
                "
              >
                <span className="inline-grid !place-items-center !w-[24px] !h-[24px] !leading-[0]">
                  <span className="pointer-events-none select-none !text-[24px]" aria-hidden>←</span>
                </span>
                Back{article.section || article.category ? ` to "${sectionToDisplay(article.section) ?? article.category}"` : ""}
              </button>

              <header className="text-center !mb-10 mt-6">
                <h1 className="rp__bebas m-0 !mb-5 !leading-[1.1] !text-[96px] !font-normal">
                  {article.title}
                </h1>

                {(formatDate(article.publishedAt) || article.date || getAuthorName(article.author)) && (
                  <div
                    className="
                      rp__roboto
                      flex justify-center items-center
                      !gap-[15px] !text-[20px] !font-light
                    "
                  >
                    {(article.date ?? formatDate(article.publishedAt)) && (
                      <span>{article.date ?? formatDate(article.publishedAt)}</span>
                    )}
                    {(article.date ?? formatDate(article.publishedAt)) && getAuthorName(article.author) && (
                      <span className="inline-block !w-[7px] !h-[7px] bg-white !rounded-full" />
                    )}
                    {getAuthorName(article.author) && <span>By {getAuthorName(article.author)}</span>}
                  </div>
                )}
              </header>

              {getImageSrc(article) && (
                <img
                  src={getImageSrc(article)}
                  alt={article.title}
                  className="w-full !h-[502px] object-cover mb-[60px] filter !grayscale"
                />
              )}

              <ArticleBody
                initialExpanded={isExpanded}
                onExpand={() => setIsExpanded(true)}
                blocks={buildContentBlocks(article)}
              />
            </div>
          </main>

          <RelatedArticles
            articles={articleList.filter(
              (a) => a.category === article.category && String(a.id) !== String(article.id)
            ) as any}
            section={article.section as any}
          />
        </>
      )}
    </>
  );
}

function ArticleBody({
  blocks,
  initialExpanded,
  onExpand,
}: {
  blocks: ContentBlock[];
  initialExpanded: boolean;
  onExpand: () => void;
}) {
  const isExpanded = initialExpanded;
  const visible = isExpanded ? blocks : blocks.slice(0, 2);
  const canLoadMore = !isExpanded && blocks.length > 2;

  return (
    <>
      <div className="max-w-[1036px] mx-auto text-justify rp__roboto !text-[32px] !leading-[1.5]">
        {visible.map((item, idx) => {
          if (item.type === "paragraph") {
            return <p key={idx} className="!mb-[2em]">{item.text}</p>;
          }
          if (item.type === "subheading") {
            return (
              <h2 key={idx} className="rp__roboto !font-bold !text-[36px] !leading-[1.4] !mb-[0.5em]">
                {item.text}
              </h2>
            );
          }
          if (item.type === "blockquote") {
            return (
              <blockquote key={idx} className="read-quote rp__roboto italic !font-medium !text-[24px] !leading-[1.6] !px-[60px] !mb-[2em]">
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
            className="pointer-events-auto bg-transparent border-0 cursor-pointer transition-opacity duration-300 pb-5 rp__bebas !text-[42px] !leading-[48px] tracking-[0.05em] text-white"
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            onClick={onExpand}
          >
            LOAD MORE...
          </button>
        </div>
      )}
    </>
  );
}