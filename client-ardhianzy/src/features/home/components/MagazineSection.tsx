// src/features/home/components/MagazineSection.tsx
import { type FC, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { contentApi } from "@/lib/content/api";
import type { MagazineCardVM, MagazineDTO } from "@/lib/content/types";
import { ROUTES } from "@/app/routes";

function normalizeBackendHtml(payload?: string | null): string {
  if (!payload) return "";
  let s = String(payload).trim();
  s = s.replace(/\\u003C/gi, "<").replace(/\\u003E/gi, ">").replace(/\\u0026/gi, "&");
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
    s = s.slice(1, -1);
  }
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

function toVM(dto: MagazineDTO): MagazineCardVM {
  const href = dto.pdf_url || `${ROUTES.MAGAZINE}`;
  return {
    id: dto.id,
    title: dto.title,
    author: "Ardhianzy",
    description: dto.description,
    imageUrl: dto.image,
    slug: dto.slug,
    href,
  };
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

const BIG_MIN_H = 450;

const MagazineSection: FC = () => {
  const [big, setBig] = useState<MagazineCardVM | null>(null);
  const [right, setRight] = useState<MagazineCardVM | null>(null);
  const [loading, setLoading] = useState(true);

  const RIGHT_CARD_PLACEHOLDER = {
    href: ROUTES.MAGAZINE_COMING_SOON,
    image: "/assets/magazine/Magazine_Soon.png",
    title: "ISSUE 2: SOON",
    description: "Issue in Progress",
  };

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const list = await contentApi.magazines.list();

        const sorted = (list ?? []).slice().sort((a, b) => {
          const da = new Date((a.pdf_uploaded_at || a.created_at || "") as string).getTime();
          const db = new Date((b.pdf_uploaded_at || b.created_at || "") as string).getTime();
          return (db || 0) - (da || 0);
        });

        const first = sorted[0];
        const second = sorted[1];

        if (!alive) return;
        if (first) setBig(toVM(first));
        if (second) setRight(toVM(second));
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  const hasBig = !!big;
  const hasRight = !!right;

  const { preview: descPreview, truncated: isTruncated } = loading
    ? { preview: "", truncated: false }
    : makePreview(big?.description ?? "", "", 45);

  const rightTitle = right?.title ?? RIGHT_CARD_PLACEHOLDER.title;
  const rightImage = right?.imageUrl ?? RIGHT_CARD_PLACEHOLDER.image;

  const rightPreview = right
    ? makePreview(right.description ?? "", "", 3)
    : { preview: "", truncated: false };
  const rightDesc = right ? rightPreview.preview : RIGHT_CARD_PLACEHOLDER.description;
  const rightTruncated = right ? rightPreview.truncated : false;

  return (
    <section id="magazine" className="relative w-full overflow-hidden bg-black py-[120px]">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 z-[1] h-[80%] w-[90%] -translate-x-1/2 -translate-y-1/2"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(74,158,255,0.10) 0%, rgba(74,158,255,0.05) 40%, transparent 40%)",
          filter: "blur(100px)",
        }}
      />

      <div className="relative z-[2] mx-auto w-full max-w-[1560px] px-[80px] max-[1200px]:px-[40px]">
        <div className="mb-[2.5rem] flex items-center justify-between">
          <div className="flex items-center">
            <img
              src="/assets/icon/Magazine_Logo.png"
              alt="Ardhianzy Magazines"
              className="hidden sm:inline-block h-[clamp(38px,4vw,70px)] w-auto object-contain select-none"
              draggable={false}
            />
            <h2
              className="ml-4 text-[3rem] text-white"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            >
              Ardhianzy Magazines
            </h2>
          </div>

          <a
            href={ROUTES.MAGAZINE}
            aria-label="Open magazine collection"
            className="inline-flex items-center rounded-[50px] border border-white px-[1.5rem] py-[0.7rem] text-[1rem] text-white no-underline transition-colors focus:outline-none focus:ring-2 focus:ring-white/60 hover:text-black hover:bg-white hover:border-black"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            MORE MAGAZINE <span className="ml-[0.3rem]">→</span>
          </a>
        </div>

        <div
          className={[
            "relative z-[2] grid items-start",
            "grid-cols-[2fr_1fr]",
            "gap-[1.5rem]",
            "max-[1200px]:gap-[1rem]",
            "max-[992px]:grid-cols-1",
          ].join(" ")}
        >
          {/* LEFT CARD */}
          <Link
            to={big ? `/magazine/${big.slug}` : ROUTES.MAGAZINE}
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
              className="z-[1] mr-[2rem] w-[48%] h-[614px] max-[768px]:mr-0 max-[768px]:w-full"
              style={{ minHeight: BIG_MIN_H }}
            >
              {loading && (
                <div className="h-full w-full animate-pulse rounded-xl bg-white/10" />
              )}
              {!loading && hasBig && (
                <img
                  loading="lazy"
                  src={big!.imageUrl}
                  alt={big!.title}
                  className="h-full w-full object-cover transition duration-300 group-hover:saturate-[1.1]"
                  style={{ mixBlendMode: "luminosity", filter: "grayscale(100%)" }}
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

              <p className="mb-[2rem] font-semibold text[1.1rem] text-[#aaa]">By {big?.author}</p>

              <p className="mt-10 text-justify text-[1rem] leading-[1.5] text-white/80 line-clamp-14">
                {loading
                  ? "Please wait while fetching the magazine..."
                  : (descPreview || "Content will be available soon.")}
                {!loading && isTruncated && (
                  <>
                    {"…"}<ContinueReadInline />
                  </>
                )}
              </p>
            </div>
          </Link>

          {/* RIGHT CARD */}
          {hasRight ? (
            <Link
              to={`/magazine/${right!.slug}`}
              className="
                group relative overflow-hidden cursor-pointer
                shadow-[0_12px_40px_rgba(255,255,255,0.10)] 
                hover:shadow-[0_12px_40px_rgba(255,255,255,0.15)] transition-shadow
                block
                border-l-2 border-r-1 border-[#444444]
              "
              aria-label={rightTitle}
            >
              <div className="relative w-full h-[clamp(240px,37vw,487px)] bg-black">
                <img
                  src={rightImage}
                  alt={rightTitle}
                  className="h-full w-full object-contain"
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
                  <>
                    {rightDesc}
                    {rightTruncated && rightDesc && (
                      <>
                        {"…"}<ContinueReadInline />
                      </>
                    )}
                  </>
                </p>
              </div>
            </Link>
          ) : (
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
                  {RIGHT_CARD_PLACEHOLDER.description}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default MagazineSection;