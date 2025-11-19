// src/features/magazine/components/MagazineHeadlineSection.tsx
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { contentApi } from "@/lib/content/api";
import type { MagazineDTO } from "@/lib/content/types";

type FeaturedContent = {
  title: string;
  author: string;
  excerptPlain: string;
  publishedAt: string;
  heroImage: string;
  image: string;
  slug: string;
};

function formatDateISOToLong(dateISO: string): string {
  if (!dateISO || Number.isNaN(Date.parse(dateISO))) return "—";
  const d = new Date(dateISO);
  return new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" }).format(d);
}

function normalizeBackendHtml(payload?: string | null): string {
  if (!payload) return "";
  let s = String(payload).trim();
  s = s.replace(/\\u003C/gi, "<").replace(/\\u003E/gi, ">").replace(/\\u0026/gi, "&");
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) s = s.slice(1, -1);
  return s;
}
function sanitizeBasicHtml(html: string): string {
  let out = html;
  out = out.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "");
  out = out.replace(/\son[a-z]+\s*=\s*"(?:[^"]*)"/gi, "");
  out = out.replace(/\son[a-z]+\s*=\s*'(?:[^']*)'/gi, "");
  out = out.replace(/\son[a-z]+\s*=\s*[^>\s]+/gi, "");
  out = out.replace(/(href|src)\s*=\s*"(?:\s*javascript:[^"]*)"/gi, '$1="#"');
  out = out.replace(/(href|src)\s*=\s*'(?:\s*javascript:[^']*)'/gi, '$1="#"');
  return out;
}
function htmlToPlainText(html?: string | null): string {
  const s = sanitizeBasicHtml(normalizeBackendHtml(html || ""));
  return s
    .replace(/<\s*br\s*\/?\s*>/gi, "\n")
    .replace(/<\/\s*p\s*>/gi, "\n\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
function makePreviewByWords(text: string, maxWords: number) {
  const words = text.split(/\s+/).filter(Boolean);
  const truncated = words.length > maxWords;
  const preview = truncated ? words.slice(0, maxWords).join(" ") : text;
  return { preview, truncated };
}

function ContinueReadInline() {
  return (
    <span
      className="ml-2 inline-flex items-center underline underline-offset-4 decoration-white/60"
      style={{ cursor: "pointer" }}
    >
      Continue to Read&nbsp;→
    </span>
  );
}

export default function MagazineHeadlineSection() {
  const [item, setItem] = useState<MagazineDTO | null>(null);
  const [, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const list = await contentApi.magazines.list();
        const sorted = (list ?? []).slice().sort((a, b) => {
          const ta = new Date((a.pdf_uploaded_at || a.created_at || "") as string).getTime();
          const tb = new Date((b.pdf_uploaded_at || b.created_at || "") as string).getTime();
          return (tb || 0) - (ta || 0);
        });
        const first = sorted?.[0] ?? null;
        if (alive) setItem(first);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  const featured = useMemo<FeaturedContent>(() => {
    if (item) {
      return {
        title: item.title,
        author: "Ardhianzy",
        excerptPlain: htmlToPlainText(item.description ?? ""),
        publishedAt: item.pdf_uploaded_at ?? item.created_at ?? "",
        heroImage: "/assets/magazine/smdamdla.png",
        image: item.image ?? "/assets/magazine/Rectangle 4528.png",
        slug: item.slug ?? "rise-of-the-soul",
      };
    }
    return {
      title: "Ardhianzy Magazine",
      author: "Ardhianzy",
      excerptPlain: "—",
      publishedAt: "",
      heroImage: "/assets/magazine/smdamdla.png",
      image: "/assets/magazine/Rectangle 4528.png",
      slug: "rise-of-the-soul",
    };
  }, [item]);

  const dateHuman = formatDateISOToLong(featured.publishedAt);

  const { preview, truncated } = makePreviewByWords(featured.excerptPlain, 140);

  const LEDE =
    "Ardhianzy Magazine merupakan publikasi utama Ardhianzy yang dirilis setiap kuartal. Majalah ini menyatukan esai, refleksi, dan kritik budaya dalam satu edisi tematik yang utuh. Setiap edisi dikurasi secara filosofis dan estetik untuk menjadi dokumentasi pemikiran kolektif, sekaligus respons atas kegelisahan zaman";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');

        .mag-head__hero {
          position: relative !important;
          width: 100vw !important;
          height: 55vh !important;
          background-color: #000 !important;
          background-size: cover !important;
          background-position: start !important;
          background-blend-mode: luminosity !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          left: 50% !important;
          right: 50% !important;
          margin-left: -50vw !important;
          margin-right: -50vw !important;
          overflow: hidden !important;
        }
        .mag-head__overlay {
          position: absolute !important;
          inset: 0 !important;
          background: linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.9) 20%, rgba(0,0,0,0.3) 70%, transparent 100%) !important;
          z-index: 1 !important;
        }
        .mag-head__title {
          position: relative !important;
          z-index: 2 !important;
          color: #fff !important;
          font-family: 'Bebas Neue', cursive !important;
          font-size: 5rem !important;
          text-align: center !important;
          text-transform: uppercase !important;
          letter-spacing: 0 !important;
          margin-top: 0 !important;
          margin-right: 0 !important;
          margin-left: 0 !important;
          padding-bottom: 80px !important;
        }

        .mag-head__dekWrap{
          position: absolute !important;
          z-index: 2 !important;
          left: 50% !important;
          transform: translateX(-50%) !important;
          bottom: clamp(18px, 6vh, 0px) !important;
          width: min(150ch, 100vw) !important;
          max-width: min(250ch, 100vw) !important;
          pointer-events: none !important;
          text-align: center !important;
        }
        .mag-head__dek{
          position: relative !important;
          pointer-events: auto !important;
          margin: 0 auto !important;
          width: 100% !important;
          font-family: Roboto, ui-sans-serif, system-ui !important;
          font-size: clamp(0.95rem, 1.2vw, 1.05rem) !important;
          line-height: 1.7 !important;
          color: #ECECEC !important;
          text-align: center !important;
          letter-spacing: .1px !important;

          border-top: 2px solid rgba(255,255,255,.22) !important;
          border-left: 0 !important;
          border-right: 0 !important;

          padding: 0.85rem 1.15rem !important;
          background: linear-gradient(180deg, rgba(0,0,0,.55), rgba(0,0,0,.28)) !important;
          backdrop-filter: blur(2px);
          border-radius: 0px !important;
          box-shadow: 0 12px 30px rgba(0,0,0,.18);
        }

        @media (max-width: 968px) {
          .mag-head__dekWrap{
            left: 50% !important;
            transform: translateX(-50%) !important;
            right: auto !important;
            width: auto !important;
            max-width: min(86vw, 78ch) !important;
            bottom: 20px !important;
          }
          .mag-head__dek{
            border-top-width: 1px !important;
            padding: .7rem .9rem !important;
          }
        }

        .mag-head__section {
          width: 100% !important;
          background-color: #000 !important;
          color: #fff !important;
          padding: 4rem 2rem !important;
          position: relative !important;
          overflow: hidden !important;
          margin: 32px auto 56px auto !important;
        }
        .mag-head__section::before {
          content: "" !important;
          position: absolute !important;
          inset: 0 !important;
          background-image: url('/assets/magazine/highlightMagazine.png') !important;
          background-position: start !important;
          background-repeat: no-repeat !important;
          background-size: cover !important;
          pointer-events: none !important;
        }

        .mag-head__grid {
          max-width: 1200px !important;
          margin: 0 auto !important;
          display: grid !important;
          grid-template-columns: 1fr 1fr !important;
          gap: 4rem !important;
          align-items: center !important;
          position: relative !important;
          z-index: 1 !important;
          text-decoration: none !important;
        }
        .mag-head__imgwrap {
          position: relative !important;
          width: 470px !important;
          height: 650px !important;
          left: 2rem !important;
          background-color: #111 !important;
          overflow: hidden !important;
          border-left-style: var(--tw-border-style);
          border-left-width: 2px;
          border-color: #444444;
        }
        .mag-head__img {
          width: 100% !important;
          height: 100% !important;
          object-fit: cover !important;
          filter: grayscale(100%) !important;
          display: block !important;
          object-position: top center !important;
        }
        .mag-head__article { padding: 2rem !important; text-align: justify !important; }
        .mag-head__h2 {
          font-family: 'Bebas Neue', sans-serif !important;
          font-size: 3.5rem !important;
          line-height: 1.1 !important;
          margin: 0 0 1rem 0 !important;
          letter-spacing: 1px !important;
          color: #fff !important;
        }
        .mag-head__author { font-size: 1.1rem !important; color: #aaa !important; margin-bottom: 2rem !important; }

        .mag-head__desc {
          font-size: 1.25rem !important;
          line-height: 1.5 !important;
          color: #ddd !important;
          margin-bottom: 3rem !important;
          display: -webkit-box !important;
          -webkit-line-clamp: 14 !important;
          -webkit-box-orient: vertical !important;
          overflow: hidden !important;
          text-overflow: ellipsis !important;
        }

        .mag-head__date { font-size: 1rem !important; color: #888 !important; font-style: italic !important; }

        @media (max-width: 968px) {
          .mag-head__grid { grid-template-columns: 1fr !important; gap: 2rem !important; }
          .mag-head__imgwrap { height: 400px !important; left: 0 !important; width: 100% !important; }
          .mag-head__h2 { font-size: 2.5rem !important; }
          .mag-head__desc { font-size: 1.1rem !important; }
        }
        @media (max-width: 640px) {
          .mag-head__section { padding: 3rem 1rem !important; }
          .mag-head__article { padding: 1rem 0 !important; }
          .mag-head__h2 { font-size: 2rem !important; }
          .mag-head__desc { font-size: 1rem !important; }
        }
      `}</style>

      <section
        className="mag-head__hero"
        style={{ backgroundImage: `url('${featured.heroImage}')` }}
        aria-label="Magazine hero section"
      >
        <div aria-hidden className="mag-head__overlay" />
        <h1 className="mag-head__title">MAGAZINE</h1>

        <div className="mag-head__dekWrap">
          <p className="mag-head__dek">{LEDE}</p>
        </div>
      </section>

      <section className="mag-head__section">
        <Link
          to={`/magazine/${featured.slug || "rise-of-the-soul"}`}
          className="mag-head__grid"
          aria-label={featured.title}
        >
          <div className="mag-head__imgwrap" aria-hidden={false}>
            <img src={featured.image} alt={featured.title} className="mag-head__img" loading="eager" />
          </div>

          <article className="mag-head__article">
            <h2 className="mag-head__h2">{featured.title}</h2>
            <p className="mag-head__author">By {featured.author}</p>

            <p className="mag-head__desc">
              {preview}
              {truncated && (
                <>
                  {"…"}
                  <ContinueReadInline />
                </>
              )}
            </p>

            <time className="mag-head__date" dateTime={featured.publishedAt}>
              {dateHuman}
            </time>
          </article>
        </Link>
      </section>
    </>
  );
}