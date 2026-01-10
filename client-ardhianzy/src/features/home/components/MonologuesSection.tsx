// src/features/home/components/MonologuesSection.tsx
import { type FC, useEffect, useRef, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { contentApi, normalizeBackendHtml } from "@/lib/content/api";
import type { MonologueDTO, MonologueCardVM } from "@/lib/content/types";
import { ROUTES } from "@/app/routes";

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

function textWithParagraphs(html?: string): string {
  if (!html) return "";
  let s = sanitizeBasicHtml(normalizeBackendHtml(html));
  s = s.replace(/<\s*br\s*\/?\s*>/gi, "\n");
  s = s.replace(/<\/\s*p\s*>/gi, "\n\n");
  s = s.replace(/<[^>]+>/g, "");
  s = s.replace(/\s+\n/g, "\n");
  s = s.replace(/\n{3,}/g, "\n\n");
  return s.trim();
}

function escapeHtml(t: string) {
  return t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function makeStructuredPreview(
  html: string,
  phrase: string,
  maxWords: number
): { html: string; truncated: boolean } {
  const text = textWithParagraphs(html);
  if (!text) return { html: "", truncated: false };

  const lower = text.toLowerCase();
  const pLower = phrase.toLowerCase();
  let cut = "";
  let truncated = false;

  if (pLower && lower.includes(pLower)) {
    const idx = lower.indexOf(pLower);
    cut = text.slice(0, Math.max(0, idx)).trimEnd();
    truncated = idx < text.length;
  } else {
    const words = text.split(/\s+/);
    truncated = words.length > maxWords;
    cut = words.slice(0, Math.max(0, maxWords)).join(" ");
  }

  const parts = cut.split(/\n{2,}/).map((p) => escapeHtml(p));
  const htmlOut = parts.join("<br/><br/>");
  return { html: htmlOut, truncated };
}

function formatDate(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { day: "2-digit", month: "long", year: "numeric" });
}

function toCardVM(dto: MonologueDTO): MonologueCardVM {
  return {
    id: dto.id,
    title: dto.title,
    description: dto.dialog,
    imageUrl: dto.image,
    author: "Ardhianzy",
    dateISO: dto.pdf_uploaded_at || dto.created_at || undefined,
    slug: dto.slug,
    href: dto.pdf_url || ROUTES.MONOLOGUES,
  };
}

const BIG_MIN_H = 450;

const getMonoPanSize = (container: HTMLElement | null) => {
  if (!container || typeof window === "undefined") return 520;
  const first = container.querySelector<HTMLElement>("[data-mono-card]");
  if (!first) return 520;
  const styles = window.getComputedStyle(container);
  const gap = parseFloat((styles as any).gap || (styles as any).columnGap || "0") || 0;
  return first.offsetWidth + gap;
};

const MonologuesSection: FC = () => {
  const [big, setBig] = useState<MonologueCardVM | null>(null);
  const [right, setRight] = useState<MonologueCardVM | null>(null);
  const [loading, setLoading] = useState(true);

  const RIGHT_CARD_PLACEHOLDER = {
    href: ROUTES.MONOLOGUES_COMING_SOON,
    image: "/assets/icon/Ardhianzy_Logo_2.png",
    title: "PRODUCT: COMING SOON",
    description: "Rp. -",
  };

  const mobileCarouselRef = useRef<HTMLDivElement | null>(null);
  const [mobileActiveDot, setMobileActiveDot] = useState(0);
  const mobileDotCount = 2;
  const monoPanRef = useRef<number>(520);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);

        const [monologueList, shopList] = await Promise.all([
          contentApi.monologues.list(),
          contentApi.shops.list(),
        ]);

        const sortedMonologues = (monologueList ?? []).slice().sort((a, b) => {
          const da = new Date((a.pdf_uploaded_at || a.created_at || "") as string).getTime();
          const db = new Date((b.pdf_uploaded_at || b.created_at || "") as string).getTime();
          return (db || 0) - (da || 0);
        });
        const first = sortedMonologues[0];

        const monologuesShops = (shopList ?? []).filter((item: any) => {
          const cat = (item.category ?? "").toString().trim().toLowerCase();
          return cat === "monologues";
        });

        const sortedShops = monologuesShops.slice().sort((a: any, b: any) => {
          const da = new Date((a.created_at || "") as string).getTime();
          const db = new Date((b.created_at || "") as string).getTime();
          return (db || 0) - (da || 0);
        });

        const latestShop = sortedShops[0];

        if (!alive) return;

        if (first) setBig(toCardVM(first));

        if (latestShop) {
          const priceText =
            latestShop?.price != null && String(latestShop.price).trim() !== ""
              ? `Rp ${latestShop.price}`
              : null;

          setRight({
            id: latestShop.id,
            title: latestShop.title,
            description: [priceText ?? ""].filter(Boolean).join(" "),
            imageUrl: latestShop.image || "/assets/icon/Ardhianzy_Logo_2.png",
            author: "Ardhianzy",
            dateISO: latestShop.created_at ?? undefined,
            slug: latestShop.slug ?? latestShop.id,
            href: latestShop.link || ROUTES.MONOLOGUES,
          } as MonologueCardVM);
        } else {
          setRight(null);
        }
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const dateHuman = big?.dateISO ? formatDate(big.dateISO) : "";

  const { html: descPreviewHtml, truncated: isTruncated } = loading
    ? { html: "", truncated: false }
    : makeStructuredPreview(big?.description ?? "", "", 95);

  const rightTitle = right?.title ?? RIGHT_CARD_PLACEHOLDER.title;
  const rightImage = right?.imageUrl ?? RIGHT_CARD_PLACEHOLDER.image;
  const rightDesc = right
    ? textWithParagraphs(right.description || "").split(/\s+/).slice(0, 28).join(" ")
    : RIGHT_CARD_PLACEHOLDER.description;

  const clampDot = useCallback((idx: number) => {
    const max = Math.max(0, mobileDotCount - 1);
    return Math.max(0, Math.min(max, idx));
  }, []);

  const updateMonoPan = useCallback(() => {
    monoPanRef.current = getMonoPanSize(mobileCarouselRef.current);
  }, []);

  const updateMonoActive = useCallback(() => {
    const el = mobileCarouselRef.current;
    if (!el) return;
    const p = monoPanRef.current || 520;
    const idx = Math.round(el.scrollLeft / p);
    setMobileActiveDot(clampDot(idx));
  }, [clampDot]);

  useEffect(() => {
    const el = mobileCarouselRef.current;
    if (!el) return;

    updateMonoPan();
    updateMonoActive();

    const onScroll = () => updateMonoActive();
    const onResize = () => {
      updateMonoPan();
      updateMonoActive();
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });

    const ro = "ResizeObserver" in window ? new ResizeObserver(onResize) : null;
    if (ro) ro.observe(el);

    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (ro) ro.disconnect();
    };
  }, [updateMonoPan, updateMonoActive]);

  const goMonoDot = (idx: number) => {
    const el = mobileCarouselRef.current;
    if (!el) return;
    const p = monoPanRef.current || 520;
    el.scrollTo({ left: idx * p, behavior: "smooth" });
  };

  return (
    <section id="monologues" aria-labelledby="mono_heading" className="relative mb-50">
      <div aria-hidden className="absolute inset-y-0 left-1/2 -z-10 w-screen -translate-x-1/2 bg-black" />

      <div className="relative z-[1] mx-auto max-w-[1560px] px-16 py-8 max-[768px]:px-4">
        {/* =========================
            HEADER (DESKTOP/TABLET) 
            ========================= */}
        <div className="mb-[2.5rem] hidden min-[768px]:flex items-center justify-between">
          <div className="flex items-center">
            <img
              src="/assets/icon/Monologues_Logo.png"
              alt="Ardhianzy Monologues"
              className="hidden sm:inline-block h-[clamp(38px,4vw,70px)] w-auto object-contain select-none"
              draggable={false}
            />
            <h2
              className="ml-4 text-[3rem] text-white"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            >
              Monologues
            </h2>
          </div>

          <a
            href={ROUTES.MONOLOGUES}
            aria-label="Open monologues collection"
            className="inline-flex items-center rounded-[50px] border border-white px-[1.5rem] py-[0.7rem] text-[1rem] text-white no-underline transition-colors focus:outline-none focus:ring-2 focus:ring-white/60 hover:text-black hover:bg-white hover:border-black"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            MORE MONOLOGUES <span className="ml-[0.3rem]">→</span>
          </a>
        </div>

        {/* =========================
            HEADER (MOBILE)
            ========================= */}
        <div className="mb-[2rem] flex min-[768px]:hidden items-center">
          <img
            src="/assets/icon/Monologues_Logo.png"
            alt="Ardhianzy Monologues"
            className="inline-block h-[clamp(34px,10vw,54px)] w-auto object-contain select-none"
            draggable={false}
          />
          <h2
            id="mono_heading"
            className="ml-3 text-[2.4rem] text-white leading-none"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            Monologues
          </h2>
        </div>

        {/* =========================
            GRID (DESKTOP/TABLET)
            ========================= */}
        <div className="hidden min-[768px]:block">
          <div
            className={[
              "relative z-[2] grid items-start",
              "grid-cols-[2.4fr_1fr]",
              "gap-[1.5rem]",
              "max-[1200px]:gap-[1rem]",
              "max-[992px]:grid-cols-1",
            ].join(" ")}
          >
            {/* LEFT CARD */}
            <Link
              to={big ? `/monologues/${big.slug}` : ROUTES.MONOLOGUES}
              className={[
                "group relative overflow-hidden bg-transparent",
                "flex max-[768px]:pl-0",
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
                  background: "linear-gradient(180deg, #000 100%)",
                  borderRadius: "inherit",
                  pointerEvents: "none",
                }}
              />

              <div
                className="z-[1] mr-[2rem] w-[43%] h-[614px] max-[768px]:mr-0 max-[768px]:w-full flex items-center justify-center bg-transparent"
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

              <div className="z-[1] w-1/2 pt-[80px] pb-[40px] pl-0 text-white text-left max-[768px]:w-full max-[768px]:px-[24px] max-[768px]:py-[32px]">
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
                  Ardhianzy{dateHuman ? ` • ${dateHuman}` : ""}
                </p>

                <p className="mt-10 text-justify text-[1rem] leading-[1.5] text-white/80 line-clamp-14">
                  {loading ? (
                    "Please wait while fetching the monologue..."
                  ) : (
                    <span
                      dangerouslySetInnerHTML={{
                        __html: descPreviewHtml || "Content will be available soon.",
                      }}
                    />
                  )}
                  {!loading && isTruncated && (
                    <>
                      {"…"}<ContinueReadInline />
                    </>
                  )}
                </p>
              </div>
            </Link>

            {/* RIGHT CARD */}
            {right ? (
              <a
                href={right.href}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  group relative overflow-hidden
                  shadow-[0_12px_40px_rgba(255,255,255,0.10)]
                  hover:shadow-[0_12px_40px_rgba(255,255,255,0.15)] transition-shadow
                  block
                  border-l-2 border-r-1 border-[#444444]
                "
                aria-label={rightTitle}
                title={rightTitle}
              >
                <div className="relative w-full h-[clamp(240px,37vw,457px)] bg-black flex items-center justify-center">
                  <img
                    src={rightImage}
                    alt={rightTitle}
                    className="max-h-full w-[40%] object-contain"
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
                    By {big?.author}
                  </p>
                  <p className="mt-1 mb-0 text-white/85" style={{ fontFamily: "Roboto, sans-serif" }}>
                    {rightDesc}
                  </p>
                </div>
              </a>
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
                <div className="relative w-full h-[clamp(240px,37vw,457px)] bg-black flex items-center justify-center">
                  <img
                    src={rightImage}
                    alt={rightTitle}
                    className="max-h-full w-[40%] object-contain"
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
                    By {big?.author}
                  </p>
                  <p className="mt-1 mb-0 text-white/85" style={{ fontFamily: "Roboto, sans-serif" }}>
                    {rightDesc}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* =========================
            MOBILE: 2 CARD SLIDER + DOTS ABOVE BUTTON
            ========================= */}
        <div className="min-[768px]:hidden">
          <style>{`.no-scrollbar::-webkit-scrollbar{display:none}`}</style>

          <div className="mono-carousel relative z-[2]">
            <div
              ref={mobileCarouselRef}
              className={[
                "no-scrollbar",
                "flex gap-6 overflow-x-auto pb-4",
                "snap-x snap-mandatory",
              ].join(" ")}
              aria-label="Monologues mobile carousel"
            >
              <Link
                to={big ? `/monologues/${big.slug}` : ROUTES.MONOLOGUES}
                data-mono-card
                className={[
                  "mx-auto",
                  "w-[88vw] max-w-[520px]",
                  "shrink-0 snap-start",
                  "group relative overflow-hidden bg-transparent",
                  "flex max-[768px]:pl-0",
                  "border-l-2 border-[#444444]",
                  "transition duration-300 ease-out",
                  "shadow-[0_12px_40px_rgba(255,255,255,0.10)]",
                  "hover:shadow-[0_12px_40px_rgba(255,255,255,0.15)] transition-shadow",
                  "focus:outline-none0",
                  "max-[768px]:flex-col",
                  "max-[768px]:rounded-none",
                ].join(" ")}
              >
                <div
                  aria-hidden
                  className="absolute right-0 top-0 z-0 h-full w-[180%]"
                  style={{
                    background: "linear-gradient(180deg, #000 100%)",
                    borderRadius: "inherit",
                    pointerEvents: "none",
                  }}
                />

                <div
                  className="z-[1] mr-[2rem] w-[43%] h-[614px] max-[768px]:mr-0 max-[768px]:w-full flex items-center justify-center bg-transparent"
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

                <div className="z-[1] w-1/2 pt-[80px] pb-[40px] pl-0 text-white text-left max-[768px]:w-full max-[768px]:px-[24px] max-[768px]:py-[32px]">
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
                    Ardhianzy{dateHuman ? ` • ${dateHuman}` : ""}
                  </p>

                  <p className="mt-10 text-justify text-[1rem] leading-[1.5] text-white/80 line-clamp-14">
                    {loading ? (
                      "Please wait while fetching the monologue..."
                    ) : (
                      <span
                        dangerouslySetInnerHTML={{
                          __html: descPreviewHtml || "Content will be available soon.",
                        }}
                      />
                    )}
                    {!loading && isTruncated && (
                      <>
                        {"…"}<ContinueReadInline />
                      </>
                    )}
                  </p>
                </div>
              </Link>

              {right ? (
                <a
                  href={right.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-mono-card
                  className={[
                    "mx-auto",
                    "w-[88vw] max-w-[520px]",
                    "shrink-0 snap-start",
                    "group relative overflow-hidden",
                    "shadow-[0_12px_40px_rgba(255,255,255,0.10)]",
                    "hover:shadow-[0_12px_40px_rgba(255,255,255,0.15)] transition-shadow",
                    "block",
                    "border-l-2 border-[#444444]",
                  ].join(" ")}
                  aria-label={rightTitle}
                  title={rightTitle}
                >
                  <div className="relative w-full h-[614px] bg-black flex items-center justify-center">
                    <img
                      src={rightImage}
                      alt={rightTitle}
                      className="max-h-full w-[40%] object-contain"
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
                      By {big?.author}
                    </p>
                    <p className="mt-1 mb-0 text-white/85" style={{ fontFamily: "Roboto, sans-serif" }}>
                      {rightDesc}
                    </p>
                  </div>
                </a>
              ) : (
                <div
                  data-mono-card
                  className={[
                    "mx-auto",
                    "w-[88vw] max-w-[520px]",
                    "shrink-0 snap-start",
                    "group relative overflow-hidden",
                    "shadow-[0_12px_40px_rgba(255,255,255,0.10)]",
                    "hover:shadow-[0_12px_40px_rgba(255,255,255,0.15)] transition-shadow",
                    "block",
                    "border-l-2 border-[#444444]",
                  ].join(" ")}
                  aria-label={rightTitle}
                >
                  <div className="relative w-full h-[614px] bg-black flex items-center justify-center">
                    <img
                      src={rightImage}
                      alt={rightTitle}
                      className="max-h-full w-[40%] object-contain"
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
                      By {big?.author}
                    </p>
                    <p className="mt-1 mb-0 text-white/85" style={{ fontFamily: "Roboto, sans-serif" }}>
                      {rightDesc}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 flex justify-center gap-2" aria-label="Monologues slider pagination">
            {Array.from({ length: mobileDotCount }).map((_, idx) => {
              const active = idx === mobileActiveDot;
              return (
                <button
                  key={`mono-dot-${idx}`}
                  type="button"
                  aria-label={`Go to monologue card ${idx + 1}`}
                  onClick={() => goMonoDot(idx)}
                  className={[
                    "h-2 w-2 rounded-full transition-opacity",
                    active ? "bg-white opacity-100" : "bg-white/40 opacity-60",
                  ].join(" ")}
                />
              );
            })}
          </div>

          <div className="mt-[18px] flex justify-center">
            <a
              href={ROUTES.MONOLOGUES}
              aria-label="Open monologues collection"
              className="inline-flex items-center rounded-[50px] border border-white px-[1.5rem] py-[0.7rem] text-[1rem] text-white no-underline transition-colors focus:outline-none focus:ring-2 focus:ring-white/60 hover:text-black hover:bg-white hover:border-black"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            >
              MORE MONOLOGUES <span className="ml-[0.3rem]">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MonologuesSection;