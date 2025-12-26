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

type Props = { philosopher?: DetailPhilosopher | null; onClose?: () => void; };

const DEFAULT_HERO = "/assets/Group 5117.png";
const MEA_ICON = "/assets/icon/MEA_icon_nt.png";

export default function PhilosopherDetailCard({ philosopher, onClose }: Props) {
  const [loading, setLoading] = useState(false);
  const [meta, setMeta] = useState<{ metafisika?: string; epsimologi?: string; aksiologi?: string; conclusion?: string; } | null>(null);
  
  const cardRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose?.(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    let alive = true;
    (async () => {
      if (!philosopher?.id) { setMeta(null); return; }
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
      } finally { if (alive) setLoading(false); }
    })();
    return () => { alive = false; };
  }, [philosopher?.id]);

  const scrollToSection = (id: string) => {
    const container = cardRef.current;
    const target = document.getElementById(id);

    if (container && target) {
      const containerRect = container.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();
      
      const offsetPosition = targetRect.top - containerRect.top + container.scrollTop;

      container.scrollTo({
        top: offsetPosition - 20, 
        behavior: "smooth"
      });
    }
  };

  if (!philosopher) return null;

  const hero = philosopher.cardImage || philosopher.hero || DEFAULT_HERO;
  const dateText = philosopher.fullDates || philosopher.years || "";
  const locationText = philosopher.detail_location || philosopher.geoorigin || "";
  const infoLine = [dateText, locationText].filter(Boolean).join(" | ");

  return (
    <aside
      ref={cardRef}
      role="dialog"
      aria-label={philosopher.name || "Philosopher detail"}
      aria-modal={false}
      aria-live="polite"
      className={[
        "absolute left-0 top-0 z-[1003] flex flex-col",
        "border-r border-[#2a2a2a] shadow-[0_0_24px_rgba(0,0,0,6)]",
        "text-white",
      ].join(" ")}
      style={{
        width: "min(720px, 48vw)",
        bottom: "150px",
        background: "linear-gradient(to top, #000 30%, #1a1a1a 70%, #2a2a2a 100%)",
        padding: "16px 16px 12px",
        gap: "14px",
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
          "sticky top-0 self-end mr-2 z-[3] inline-flex h-9 w-9 shrink-0 items-center justify-center cursor-pointer",
          "rounded-full border border-[#666] bg-[#111] text-white",
          "shadow-[0_4px_10px_rgba(0,0,0,4)] hover:bg-[#151515]",
        ].join(" ")}
      >
        ×
      </button>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="relative">
          <img
            src={hero}
            alt={philosopher.name || "philosopher"}
            draggable={false}
            className="block w-full h-[260px] md:h-[300px] object-cover select-none rounded-br-[16px]"
            onError={(e) => { (e.currentTarget as HTMLImageElement).src = DEFAULT_HERO; }}
          />
        </div>

        <div className="flex flex-col">
          <h3
            className="text-center text-[36px] md:text-[40px] text-white"
            style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: ".3px" }}
          >
            {philosopher.name ?? "Unknown"}
          </h3>

          <div className="mt-2 flex-1 grid place-items-center">
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
          className="mt-0 mb-0 text-left text-white/80 text-[26px]"
          style={{ fontFamily: "'Bebas Neue', sans-serif" }}
        >
          {infoLine}
        </p>
      )}

      <style>{`
        .card-typography{
          font-family: Roboto, ui-sans-serif, system-ui;
          font-size: 1.02rem;
          line-height: 1.25;
          color: #fff;
          text-align: justify;
          text-justify: inter-word;
          hyphens: auto;
          word-break: break-word;
        }
        .card-typography em, .card-typography i {
          font-style: italic;
        }
        .card-typography h1,.card-typography h2,.card-typography h3,.card-typography h4{
          font-family: Roboto, ui-sans-serif, system-ui;
          font-weight: 700;
          line-height: 1.25;
          margin: .85em 0 .45em;
          letter-spacing: .2px;
        }
        .card-typography h1{font-size:1.15rem}
        .card-typography h2{font-size:1.08rem}
        .card-typography h3{font-size:1.04rem}
        .card-typography h4{font-size:1.02rem}
        .card-typography p{margin:0 0 1em}
        .card-typography blockquote{margin:1em 0;padding:.75em 1em;border-left:3px solid rgba(255,255,255,.35);background:rgba(255,255,255,.04);border-radius:8px}
        .card-typography blockquote p{margin:.4em 0}
        .card-typography blockquote footer{margin-top:.55em;opacity:.85;font-size:.92em}
        .card-typography ul,.card-typography ol{margin:.6em 0 1.1em;padding-left:1.3em}
        .card-typography ul{list-style:disc}
        .card-typography ol{list-style:decimal}
        .card-typography img,.card-typography video,.card-typography iframe{max-width:100%;height:auto}
        .card-typography a{color:#fff;text-decoration:underline;text-underline-offset:2px;text-decoration-color:rgba(255,255,255,.6)}

        .card-typography table{
          width: 100%;
          border-collapse: collapse;
          margin: 1.1em 0;
          font-size: 0.98rem;
          text-align: left;
        }
        .card-typography thead th{
          background: rgba(255,255,255,.06);
          font-weight: 700;
        }
        .card-typography th,
        .card-typography td{
          border: 1px solid rgba(255,255,255,.28);
          padding: .55em .8em;
          vertical-align: top;
          text-align: left;
          text-justify: auto;
          hyphens: auto;
          word-break: break-word;
        }
        .card-typography tbody tr:nth-child(even){
          background: rgba(255,255,255,.02);
        }

        @media (max-width: 768px){
          .card-typography{
            font-size:1rem;
            line-height:1.8;
          }
          .card-typography table{
            display: block;
            width: 100%;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
          }
        }
      `}</style>

      <section id="section-metafisika" className="mt-2 mb-3">
        <h4 className="text-left text-[24px] font-semibold mb-1" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
          Metafisika
        </h4>
        <div className="card-typography" dangerouslySetInnerHTML={{ __html: meta?.metafisika || (loading ? "Loading..." : "—") }} />
      </section>

      <section id="section-epistemologi" className="mb-3">
        <h4 className="text-left text-[24px] font-semibold mb-1" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
          Epistemologi
        </h4>
        <div className="card-typography" dangerouslySetInnerHTML={{ __html: meta?.epsimologi || (loading ? "Loading..." : "—") }} />
      </section>

      <section id="section-aksiologi" className="mb-3">
        <h4 className="text-left text-[24px] font-semibold mb-1" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
          Aksiologi
        </h4>
        <div className="card-typography" dangerouslySetInnerHTML={{ __html: meta?.aksiologi || (loading ? "Loading..." : "—") }} />
      </section>

      <section className="mb-1 pb-2">
        <h4 className="text-left text-[24px] font-semibold mb-1" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
          Kesimpulan
        </h4>
        <div className="card-typography" dangerouslySetInnerHTML={{ __html: meta?.conclusion || (loading ? "Loading..." : "—") }} />
      </section>
    </aside>
  );
}