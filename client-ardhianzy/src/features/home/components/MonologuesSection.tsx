// src/features/home/components/MonologuesSection.tsx
import { type FC, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { contentApi } from "@/lib/content/api";
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
      Continue Read&nbsp;→
    </span>
  );
}

function truncateByWords(text: string, maxWords: number) {
  const safe = (text ?? "").trim();
  if (!safe) return ["", false] as const;
  const words = safe.split(/\s+/);
  if (words.length <= maxWords) return [safe, false] as const;
  return [words.slice(0, maxWords).join(" "), true] as const;
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

const MonologuesSection: FC = () => {
  const [big, setBig] = useState<MonologueCardVM | null>(null);
  const [loading, setLoading] = useState(true);

  const FEATURED_BG = "/assets/monologues/Group 5020.svg";
  const FEATURED_IMG = "/assets/monologues/mono3.png";
  const RIGHT_CARD = {
    href: ROUTES.MONOLOGUES_COMING_SOON,
    bg: FEATURED_BG,
    img: FEATURED_IMG,
    title: "Coming Soon",
    description: "Monologues in Progress",
  };

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const list = await contentApi.monologues.list();
        const first = list?.[0];
        if (alive && first) setBig(toCardVM(first));
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const dateHuman = big?.dateISO ? formatDate(big.dateISO) : "";
  const [descCut, descTrimmed] = truncateByWords(big?.description ?? "", 55);

  return (
    <section id="monologues" aria-labelledby="mono_heading" className="relative mb-50">
      <div
        aria-hidden
        className="absolute inset-y-0 left-1/2 -z-10 w-screen -translate-x-1/2 bg-black"
      />

      <div className="relative z-[1] mx-auto max-w-[1560px] px-16 py-8 max-[768px]:px-4">
        <div className="mb-[2.5rem] flex items-center justify-between">
          <div className="flex items-center">
            <h2
              className="m-0 text-[3rem] text-white"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            >
              Monologues
            </h2>
            <img
              src="/assets/icon/Monologues_Logo.png"
              alt="Ardhianzy Monologues"
              className="ml-4 hidden sm:inline-block h-[clamp(38px,4vw,70px)] w-auto object-contain select-none"
              draggable={false}
            />
          </div>

          <a
            href={ROUTES.MONOLOGUES}
            aria-label="Open research collection"
            className="inline-flex items-center rounded-[50px] border border-white px-[1.5rem] py-[0.7rem] text-[1rem] text-white no-underline transition-colors focus:outline-none focus:ring-2 focus:ring-white/60 hover:text-black hover:bg-white hover:border-black"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            MORE MONOLOGUES <span className="ml-[0.3rem]">→</span>
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
            to={big ? `/monologues/${big.slug}` : ROUTES.MONOLOGUES}
            className={[
              "group relative overflow-hidden rounded-[16px] bg-transparent",
              "flex max-[768px]:pl-0",
              "border-l-2 border-[#444444]",
              "transition duration-300 ease-out",
              "hover:shadow-[0_12px_40px_rgba(255,255,255,0.15)] transition-shadow",
              "focus:outline-none0",
              "max-[992px]:col-span-full max-[992px]:mb-[1.25rem]",
              "max-[768px]:flex-col",
              "max-[768px]:rounded-none max-[768px]:rounded-b-[24px]",
            ].join(" ")}
          >
            <div
              aria-hidden
              className="absolute right-0 top-0 z-0 h-full w-[180%]"
              style={{
                background:
                  "linear-gradient(180deg, #000 0%, #0d0d0d 25%, #151515 60%, #1a1a1a 100%)",
                borderRadius: "inherit",
                pointerEvents: "none",
              }}
            />

            <div
              className="z-[1] mr-[2rem] w-[48%] h-[614px] max-[768px]:mr-0 max-[768px]:w-full"
              style={{ minHeight: BIG_MIN_H }}
            >
              {loading ? (
                <div className="h-full w-full animate-pulse rounded-xl bg-white/10" />
              ) : (
                <img
                  loading="lazy"
                  src={big?.imageUrl}
                  alt={big?.title}
                  className="h-full w-full border-r-1 border-[#444444] object-cover transition duration-300 group-hover:saturate-[1.1]"
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

              <p className="mb-[2rem] font-semibold text[1.1rem] text-[#aaa]">
                Ardhianzy{dateHuman ? ` • ${dateHuman}` : ""}
              </p>

              <p className="mt-10 text-[1rem] leading-[2] text-white/80 line-clamp-10">
                {loading ? "Please wait while fetching the monologue..." : descCut}
                {descTrimmed ? "..." : ""} <ContinueReadInline />
              </p>
            </div>
          </Link>

         <Link
            to={RIGHT_CARD.href}
            className="
              relative overflow-hidden rounded-[16px]
              block !bg-transparent
              hover:shadow-[0_12px_40px_rgba(255,255,255,0.15)]
              border-l-2 border-[#444444]
            "
            aria-label={RIGHT_CARD.title}
          >
            <img
              aria-hidden
              src={RIGHT_CARD.bg}
              alt=""
              className="pointer-events-none absolute inset-0 h-full w-full object-cover"
            />

            <div className="relative w-full min-h-[clamp(614px,64vw,614px)] flex flex-col items-center justify-start pt-6">
              <h3
                className="mt-0 mb-4 text-[2.4rem] text-white text-center"
                style={{ fontFamily: "'Bebas Neue', sans-serif" }}
              >
                {RIGHT_CARD.title}
              </h3>

              <div className="mx-auto mb-4 h-[249px] w-[249px] overflow-hidden">
                {/* <img
                  loading="lazy"
                  decoding="async"
                  src={RIGHT_CARD.img}
                  alt="Featured"
                  className="h-full w-full object-cover rounded-[16px]"
                /> */}
              </div>

              <p
                className="mx-auto mt-4 mb-2 px-4 text-[1rem] leading-[1.4] text-white text-center"
                style={{ opacity: 0.85 }}
              >
                {RIGHT_CARD.description}
                <span
                  className="ml-2 inline-flex items-center underline underline-offset-4
                            decoration-white/60 group-hover:decoration-white"
                >
                  Continue Read&nbsp;→
                </span>
              </p>

              <p className="mt-2 text-[1rem] italic text-white" style={{ opacity: 0.8 }}>
                By Ardhianzy
              </p>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default MonologuesSection;