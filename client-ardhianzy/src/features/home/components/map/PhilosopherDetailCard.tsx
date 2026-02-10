// src/features/home/components/map/PhilosopherDetailCard.tsx
import { useEffect, useState, useRef } from "react";
import { contentApi, normalizeBackendHtml } from "@/lib/content/api";

export type DetailPhilosopher = {
  id: string | number;
  name?: string;
  years?: string;
  fullDates?: string;
  cardImage?: string;
  hero?: string;
  geoorigin?: string;
  detail_location?: string;
};

type Props = { philosopher?: DetailPhilosopher | null; onClose?: () => void };

const DEFAULT_HERO = "/assets/Group 5117.png";
const MEA_ICON = "/assets/icon/MEA_icon_nt.png";

export default function PhilosopherDetailCard({ philosopher, onClose }: Props) {
  const [loading, setLoading] = useState(false);
  const [meta, setMeta] = useState<{
    metafisika?: string;
    epsimologi?: string;
    aksiologi?: string;
    conclusion?: string;
  } | null>(null);

  const cardRef = useRef<HTMLElement>(null);

  const [vw, setVw] = useState<number>(() =>
    typeof window !== "undefined" ? window.innerWidth : 1920
  );
  const isMobile = vw < 768;

  useEffect(() => {
    const onResize = () => setVw(window.innerWidth);
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    let alive = true;
    (async () => {
      if (!philosopher?.id) {
        setMeta(null);
        return;
      }
      try {
        setLoading(true);
        const res = await contentApi.totMeta.byTotId(String(philosopher.id));
        if (!alive) return;
        if (!res) {
          setMeta(null);
          return;
        }
        setMeta({
          metafisika: normalizeBackendHtml(res?.metafisika),
          epsimologi: normalizeBackendHtml(res?.epsimologi),
          aksiologi: normalizeBackendHtml(res?.aksiologi),
          conclusion: normalizeBackendHtml(res?.conclusion),
        });
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [philosopher?.id]);

  const scrollToSection = (id: string) => {
    const container = cardRef.current;
    const target = document.getElementById(id);

    if (container && target) {
      const containerRect = container.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();
      const offsetPosition = targetRect.top - containerRect.top + container.scrollTop;

      container.scrollTo({
        top: offsetPosition - 16,
        behavior: "smooth",
      });
    }
  };

  if (!philosopher) return null;

  const hero = philosopher.cardImage || philosopher.hero || DEFAULT_HERO;
  const dateText = philosopher.fullDates || philosopher.years || "";
  const locationText = philosopher.detail_location || philosopher.geoorigin || "";
  const infoLine = [dateText, locationText].filter(Boolean).join(" | ");

  const canMeta = !!meta?.metafisika;
  const canEpi = !!meta?.epsimologi;
  const canAxi = !!meta?.aksiologi;

  return (
    <aside
      ref={cardRef}
      role="dialog"
      aria-label={philosopher.name || "Philosopher detail"}
      aria-modal={false}
      aria-live="polite"
      className={[
        isMobile ? "fixed left-0 right-0 bottom-0" : "absolute left-0 top-0",
        "z-[1003] flex flex-col",
        isMobile ? "border-t border-[#2a2a2a]" : "border-r border-[#2a2a2a]",
        "shadow-[0_0_24px_rgba(0,0,0,0.6)]",
        "text-white",
      ].join(" ")}
      style={{
        width: isMobile ? "100vw" : "min(720px, 48vw)",
        height: isMobile ? "78vh" : undefined,
        bottom: isMobile ? "0px" : "150px",
        background: "linear-gradient(to top, #000 30%, #1a1a1a 70%, #2a2a2a 100%)",
        padding: isMobile ? "12px 12px 10px" : "16px 16px 12px",
        gap: isMobile ? "10px" : "14px",
        overflowY: "auto",
        scrollbarGutter: "stable both-edges" as any,
        overscrollBehavior: "contain",
      }}
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className={[
          "sticky top-0 self-end z-[3] inline-flex shrink-0 items-center justify-center cursor-pointer",
          "rounded-full border border-[#666] bg-[#111] text-white",
          "shadow-[0_4px_10px_rgba(0,0,0,0.4)] hover:bg-[#151515]",
          isMobile ? "h-10 w-10" : "h-9 w-9 mr-2",
        ].join(" ")}
      >
        ×
      </button>

      <div className="mt-1 grid grid-cols-2 gap-4 max-[768px]:grid-cols-1 max-[768px]:gap-3">
        <div className="relative">
          <img
            src={hero}
            alt={philosopher.name || "philosopher"}
            draggable={false}
            className={[
              "block w-full object-cover select-none",
              "rounded-br-[16px]",
              isMobile ? "h-[190px]" : "h-[260px] md:h-[300px]",
            ].join(" ")}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = DEFAULT_HERO;
            }}
          />
        </div>

        <div className="flex flex-col">
          <h3
            className={[
              "text-center text-white",
              isMobile ? "text-[28px] leading-[1.05]" : "text-[36px] md:text-[40px]",
            ].join(" ")}
            style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: ".3px" }}
          >
            {philosopher.name ?? "Unknown"}
          </h3>

          <div className="mt-3 flex flex-wrap items-center justify-center gap-2 min-[768px]:hidden">
            <button
              type="button"
              onClick={() => canMeta && scrollToSection("section-metafisika")}
              className={[
                "rounded-full border px-3 py-1 text-[0.9rem]",
                canMeta ? "border-white/60 text-white hover:bg-white/10" : "border-white/20 text-white/40",
              ].join(" ")}
              style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.8px" }}
            >
              METAFISIKA
            </button>
            <button
              type="button"
              onClick={() => canEpi && scrollToSection("section-epistemologi")}
              className={[
                "rounded-full border px-3 py-1 text-[0.9rem]",
                canEpi ? "border-white/60 text-white hover:bg-white/10" : "border-white/20 text-white/40",
              ].join(" ")}
              style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.8px" }}
            >
              EPISTEMOLOGI
            </button>
            <button
              type="button"
              onClick={() => canAxi && scrollToSection("section-aksiologi")}
              className={[
                "rounded-full border px-3 py-1 text-[0.9rem]",
                canAxi ? "border-white/60 text-white hover:bg-white/10" : "border-white/20 text-white/40",
              ].join(" ")}
              style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.8px" }}
            >
              AKSIOLOGI
            </button>
          </div>

          <div className="mt-2 flex-1 grid place-items-center max-[768px]:hidden">
            <div className="relative ml-4 mt-5 w-full max-w-[250px]">
              <img
                src={MEA_ICON}
                alt="MEA icon"
                draggable={false}
                className="block w-full h-auto object-contain select-none"
              />

              <button
                type="button"
                onClick={() => meta?.metafisika && scrollToSection("section-metafisika")}
                className={`absolute top-[-25px] left-32 -translate-x-1/2 z-10 transition-colors ${
                  meta?.metafisika ? "cursor-pointer hover:text-white/80" : "cursor-default opacity-50"
                }`}
                style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "18px", letterSpacing: "1px" }}
              >
                METAFISIKA
              </button>

              <button
                type="button"
                onClick={() => meta?.epsimologi && scrollToSection("section-epistemologi")}
                className={`absolute bottom-[75px] left-[-20px] -translate-x-1/4 z-10 transition-colors ${
                  meta?.epsimologi ? "cursor-pointer hover:text-white/80" : "cursor-default opacity-50"
                }`}
                style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "18px", letterSpacing: "1px" }}
              >
                EPISTEMOLOGI
              </button>

              <button
                type="button"
                onClick={() => meta?.aksiologi && scrollToSection("section-aksiologi")}
                className={`absolute bottom-[75px] right-[-15px] translate-x-1/4 z-10 transition-colors ${
                  meta?.aksiologi ? "cursor-pointer hover:text-white/80" : "cursor-default opacity-50"
                }`}
                style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "18px", letterSpacing: "1px" }}
              >
                AKSIOLOGI
              </button>
            </div>
          </div>
        </div>
      </div>

      {infoLine && (
        <p
          className={[
            "mt-0 mb-0 text-left text-white/80",
            isMobile ? "text-[18px]" : "text-[26px]",
          ].join(" ")}
          style={{ fontFamily: "'Bebas Neue', sans-serif" }}
        >
          {infoLine}
        </p>
      )}

      <section id="section-metafisika" className="mt-2 mb-3">
        <h4
          className={[
            "text-left font-semibold mb-1",
            isMobile ? "text-[18px]" : "text-[24px]",
          ].join(" ")}
          style={{ fontFamily: "'Bebas Neue', sans-serif" }}
        >
          Metafisika
        </h4>
        <div
          className="card-typography richtext text-left"
          style={{ textAlign: "justify", textJustify: "inter-word" as any }}
          dangerouslySetInnerHTML={{ __html: meta?.metafisika || (loading ? "Loading..." : "—") }}
        />
      </section>

      <section id="section-epistemologi" className="mb-3">
        <h4
          className={[
            "text-left font-semibold mb-1",
            isMobile ? "text-[18px]" : "text-[24px]",
          ].join(" ")}
          style={{ fontFamily: "'Bebas Neue', sans-serif" }}
        >
          Epistemologi
        </h4>
        <div
          className="card-typography richtext text-left"
          style={{ textAlign: "justify", textJustify: "inter-word" as any }}
          dangerouslySetInnerHTML={{ __html: meta?.epsimologi || (loading ? "Loading..." : "—") }}
        />
      </section>

      <section id="section-aksiologi" className="mb-3">
        <h4
          className={[
            "text-left font-semibold mb-1",
            isMobile ? "text-[18px]" : "text-[24px]",
          ].join(" ")}
          style={{ fontFamily: "'Bebas Neue', sans-serif" }}
        >
          Aksiologi
        </h4>
        <div
          className="card-typography richtext text-left"
          style={{ textAlign: "justify", textJustify: "inter-word" as any }}
          dangerouslySetInnerHTML={{ __html: meta?.aksiologi || (loading ? "Loading..." : "—") }}
        />
      </section>

      {/* <section className="mb-1 pb-2">
        <h4
          className={[
            "text-left font-semibold mb-1",
            isMobile ? "text-[18px]" : "text-[24px]",
          ].join(" ")}
          style={{ fontFamily: "'Bebas Neue', sans-serif" }}
        >
          Kesimpulan
        </h4>
        <div
          className="card-typography richtext text-left"
          style={{ textAlign: "justify", textJustify: "inter-word" as any }}
          dangerouslySetInnerHTML={{ __html: meta?.conclusion || (loading ? "Loading..." : "—") }}
        />
      </section> */}
    </aside>
  );
}