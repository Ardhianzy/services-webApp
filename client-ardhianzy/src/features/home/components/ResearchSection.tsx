// src/features/home/components/ResearchSection.tsx
import { type FC, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { contentApi } from "@/lib/content/api";
import type { ResearchCardVM, ResearchDTO } from "@/lib/content/types";
import { ROUTES } from "@/app/routes";

function normalizeBackendHtml(payload?: string | null): string {
  if (!payload) return "";
  let s = String(payload).trim();
  s = s.replace(/\\u003C/gi, "<").replace(/\\u003E/gi, ">").replace(/\\u0026/gi, "&");
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) s = s.slice(1, -1);
  s = s.replace(/<p>\s*<\/p>/gi, "");
  return s.trim();
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

function htmlToText(html?: string): string {
  if (!html) return "";
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function makePreview(
  html: string,
  phrase: string,
  maxWords: number
): { preview: string; truncated: boolean } {
  const text = htmlToText(sanitizeBasicHtml(normalizeBackendHtml(html)));
  if (!text) return { preview: "", truncated: false };

  const idx = text.toLowerCase().indexOf(phrase.toLowerCase());
  let preview = "";
  let truncated = false;

  if (idx > 0) {
    preview = text.slice(0, idx).trim();
    truncated = idx < text.length;
  } else {
    const words = text.split(/\s+/);
    truncated = words.length > maxWords;
    preview = words.slice(0, Math.max(0, maxWords)).join(" ");
  }

  preview = preview.replace(/[,\.;:!?\-—]+$/g, "");
  return { preview, truncated };
}

function ContinueReadInline() {
  return (
    <span
      className="
        ml-2 inline-flex items-center underline underline-offset-4
        decoration-white/60 group-hover:decoration-white
      "
    >
      Continue to Read&nbsp;→
    </span>
  );
}

function toCardVM(dto: ResearchDTO): ResearchCardVM {
  const href = `/research/${dto.slug}`;
  return {
    id: dto.id,
    title: dto.research_title,
    description: dto.research_sum,
    imageUrl: dto.image,
    researcher: dto.researcher,
    dateISO: dto.research_date,
    slug: dto.slug,
    href,
  };
}

function formatDate(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { day: "2-digit", month: "long", year: "numeric" });
}

const BIG_MIN_H = 450;

const ResearchSection: FC = () => {
  const [big, setBig] = useState<ResearchCardVM | null>(null);
  const [right, setRight] = useState<ResearchCardVM | null>(null);
  const [loading, setLoading] = useState(true);

  const RIGHT_CARD_PLACEHOLDER = {
    href: ROUTES.RESEARCH_COMING_SOON,
    image: "/assets/icon/Ardhianzy_Logo_2.png",
    title: "NEXT: SOON",
    description: "Research in Progress",
  };

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const list = await contentApi.research.list();

        const sorted = (list ?? []).slice().sort((a, b) => {
          const da = new Date((a.research_date || a.pdf_uploaded_at || a.created_at || "") as string).getTime();
          const db = new Date((b.research_date || b.pdf_uploaded_at || b.created_at || "") as string).getTime();
          return (db || 0) - (da || 0);
        });

        const first = sorted[0];
        const second = sorted[1];

        if (!alive) return;
        if (first) setBig(toCardVM(first));
        if (second) setRight(toCardVM(second));
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  const dateHuman = big?.dateISO ? formatDate(big.dateISO) : "";

  const { preview: descPreview, truncated: isTruncated } = loading
    ? { preview: "", truncated: false }
    : makePreview(big?.description ?? "", "Harapan kami", 50);

  const rightTitle = right?.title ?? RIGHT_CARD_PLACEHOLDER.title;
  const rightImage = right?.imageUrl ?? RIGHT_CARD_PLACEHOLDER.image;
  const rightDesc =
    right ? makePreview(right.description ?? "", "", 24).preview || "Continue to Read →"
          : RIGHT_CARD_PLACEHOLDER.description;

  return (
    <section id="research" className="relative w-full overflow-hidden bg-black py-[120px]">
      <div className="relative z-[2] mx-auto w-full max-w-[1560px] px-[80px] max-[1200px]:px-[40px]">
        <div className="mb-[2.5rem] flex items-center justify-between">
          <div className="flex items-center">
            <img
              src="/assets/icon/Research_Logo.png"
              alt="Ardhianzy Research"
              className="hidden sm:inline-block h-[clamp(38px,4vw,70px)] w-auto object-contain select-none"
              draggable={false}
            />
            <h2
              className="ml-4 text-[3rem] text-white"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            >
              Ardhianzy Research
            </h2>
          </div>

          <a
            href={ROUTES.RESEARCH}
            aria-label="Open research collection"
            className="inline-flex items-center rounded-[50px] border border-white px-[1.5rem] py-[0.7rem] text-[1rem] text-white no-underline transition-colors focus:outline-none focus:ring-2 focus:ring-white/60 hover:text-black hover:bg-white hover:border-black"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            MORE RESEARCH <span className="ml-[0.3rem]">→</span>
          </a>
        </div>

        <div
          className={[
            "relative z-[2] grid items-start",
            "grid-cols-[2.4fr_1fr]",
            "gap-[1.5rem]",
            "max-[1200px]:gap-[1rem]",
            "max-[992px]:grid-cols-1",
          ].join(" ")}
        >
          <Link
            to={big ? `/research/${big.slug}` : ROUTES.RESEARCH}
            className={[
              "group relative overflow-hidden bg-transparent",
              "flex max-[768px]:pl-0",
              "border-l-2 border-[#444444]",
              "transition duration-300 ease-out",
              "shadow-[0_12px_40px_rgba(255,255,255,0.10)]",
              "hover:shadow-[0_12px_40px_rgba(255,255,255,0.15)] transition-shadow",
              "focus:outline-none0",
              "max-[992px]:col-span-full max-[992px]:mb-[1.25rem]",
              "max-[768px]:flex-col",
              "max-[768px]:rounded-none",
            ].join(" ")}
          >
            <div
              aria-hidden
              className="absolute right-0 top-0 z-0 h-full w-[180%]"
              style={{
                background:
                  "linear-gradient(180deg, #000 100%)",
                borderRadius: "inherit",
                pointerEvents: "none",
              }}
            />

            <div
              className="z-[1] mr-[2rem] w-[48%] h-[614px] max-[768px]:mr-0 max-[768px]:w-full
                         flex items-center justify-center bg-black border-r-1 border-[#444444]"
              style={{ minHeight: BIG_MIN_H }}
            >
              {loading ? (
                <div className="h-full w-full animate-pulse rounded-xl bg-white/10" />
              ) : (
                <img
                  loading="lazy"
                  src={big?.imageUrl}
                  alt={big?.title}
                  className="max-h-full max-w-full object-contain transition duration-300 group-hover:saturate-[1.1]"
                  style={{ mixBlendMode: "luminosity", filter: "grayscale(100%)" }}
                  draggable={false}
                />
              )}
            </div>

            <div className="z-[1] w-1/2 pt-[80px] pb-[40px] pr-[40px] pl-0 text-white text-left max-[768px]:w-full max-[768px]:px-[24px] max-[768px]:py-[32px]">
              <h3
                className="mb-[18px] text-white"
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "clamp(2.1rem, 3.2vw, 2.8rem)",
                  lineHeight: 1.1,
                }}
              >
                {loading ? "Loading..." : (big?.title ?? "Coming soon")}
              </h3>

              <p className="mb-[2rem] font-semibold text[1.1rem] text-[#aaa]">
                {big?.researcher}
                {dateHuman ? ` • ${dateHuman}` : ""}
              </p>

              <p className="mt-10 text-justify text-[1rem] leading-[1.5] text-white/80 line-clamp-14">
                {loading
                  ? "Please wait while fetching the research..."
                  : (descPreview || "Content will be available soon.")}
                {!loading && isTruncated && (
                  <>
                    {"…"}<ContinueReadInline />
                  </>
                )}
              </p>
            </div>
          </Link>

          <div
            className="
              group relative overflow-hidden
              shadow-[0_12px_40px_rgba(255,255,255,0.10)]
              hover:shadow-[0_12px_40px_rgba(255,255,255,0.15)] transition-shadow
              block
              border-l-2 border-r-1 border-[#444444]
            "
            aria-label={rightTitle}
          >
            <div className="relative w-full h-[clamp(240px,37vw,487px)] bg-black flex items-center justify-center">
              <img
                src={rightImage}
                alt={rightTitle}
                className="max-h-full max-w-full object-contain"
              />
              <div className="pointer-events-none absolute inset-0" />
            </div>

            <div className="px-4 py-5 text-left ml-4">
              <h3
                className="mt-[9px] text-white"
                style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(1.6rem,2.6vw,2.1rem)" }}
              >
                {rightTitle}
              </h3>
              <p className="mt-1 mb-0 text-white/85" style={{ fontFamily: "Roboto, sans-serif" }}>
                {rightDesc}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResearchSection;