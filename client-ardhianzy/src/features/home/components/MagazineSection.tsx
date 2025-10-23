// src/features/home/components/MagazineSection.tsx
import { type FC, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { contentApi } from "@/lib/content/api";
import type { MagazineCardVM, MagazineDTO } from "@/lib/content/types";
import { ROUTES } from "@/app/routes";

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
      Continue Read&nbsp;→
    </span>
  );
}

const BIG_MIN_H = 450;

const MagazineSection: FC = () => {
  const [big, setBig] = useState<MagazineCardVM | null>(null);
  const [loading, setLoading] = useState(true);

  const RIGHT_CARD = {
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
        const first = list?.[0];
        if (alive && first) setBig(toVM(first));
      } catch {
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  const hasBig = !!big;

  return (
    <section id="magazine" className="relative w-full overflow-hidden bg-black py-[120px]">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 z-[1] h-[80%] w-[90%] -translate-x-1/2 -translate-y-1/2"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(74,158,255,0.10) 0%, rgba(74,158,255,0.05) 40%, transparent 70%)",
          filter: "blur(100px)",
        }}
      />

      <div className="relative z-[2] mx-auto w-full max-w-[1560px] px-[80px] max-[1200px]:px-[40px]">
        <div className="mb-[2.5rem] flex items-center justify-between">
          <div className="flex items-center">
            <h2
              className="m-0 text-[3rem] text-white"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            >
              Ardhianzy Magazines
            </h2>
            <img
              src="/assets/icon/Magazine_Logo.png"
              alt="Ardhianzy Magazines"
              className="ml-4 hidden sm:inline-block h-[clamp(38px,4vw,70px)] w-auto object-contain select-none"
              draggable={false}
            />
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
          <Link
            to={big ? `/magazine/${big.slug}` : ROUTES.MAGAZINE}
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

              <p className="mt-10 text-[1rem] leading-[2.4] text-white/80 line-clamp-10">
                {loading
                  ? "Please wait while fetching the magazine..."
                  : (big?.description ?? "Content will be available soon.")}
                  <ContinueReadInline />
              </p>
            </div>
          </Link>

        <Link
            to={RIGHT_CARD.href}
            className="
              group relative overflow-hidden rounded-[16px]
              shadow-[0_12px_40px_rgba(255,255,255,0.10)] 
              hover:shadow-[0_12px_40px_rgba(255,255,255,0.15)] transition-shadow
              block
              border-l-2 border-r-1 border-[#444444]
            "
            aria-label={RIGHT_CARD.title}
          >
            <div className="relative w-full h-[clamp(240px,37vw,487px)] bg-black flex items-center justify-center">
              <img
                src={RIGHT_CARD.image}
                alt={RIGHT_CARD.title}
                className="max-h-full max-w-full object-contain"
              />
              <div className="pointer-events-none absolute inset-0" />
            </div>

            <div className="px-4 py-5 text-left ml-4">
              <h3
                className="mt-[9px] text-white"
                style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(1.6rem,2.6vw,2.1rem)" }}
              >
                {RIGHT_CARD.title}
              </h3>
              <p className="mt-1 mb-0 text-white/85" style={{ fontFamily: "Roboto, sans-serif" }}>
                {RIGHT_CARD.description}
                <ContinueReadInline />
              </p>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default MagazineSection;