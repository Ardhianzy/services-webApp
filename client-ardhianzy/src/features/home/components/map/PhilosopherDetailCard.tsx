// src/features/home/components/map/PhilosopherDetailCard.tsx
import { useEffect } from "react";

export type DetailPhilosopher = {
  id: string | number;
  name?: string;
  years?: string;
  fullDates?: string;
  cardImage?: string;
  hero?: string;
  description?: string;
};

type Props = {
  philosopher?: DetailPhilosopher | null;
  onClose?: () => void;
};

const DEFAULT_HERO = "/assets/Group 5117.png";

export default function PhilosopherDetailCard({ philosopher, onClose }: Props) {
  if (!philosopher) return null;

  const hero =
    philosopher.cardImage ||
    philosopher.hero ||
    DEFAULT_HERO;

  const dateLine = philosopher.fullDates || philosopher.years || "";
  const description =
    philosopher.description ||
    "Tidak ada deskripsi yang disediakan.";

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <aside
      role="dialog"
      aria-label={philosopher.name || "Philosopher detail"}
      aria-modal={false}
      aria-live="polite"
      className={[
        "absolute left-0 top-0 z-[1003] flex flex-col",
        "border-r border-[#2a2a2a] shadow-[0_0_24px_rgba(0,0,0,.6)]",
        "text-white",
      ].join(" ")}
      style={{
        width: "min(500px, 40vw)",
        bottom: "150px",
        background:
          "linear-gradient(to top, #000 30%, #1a1a1a 70%, #2a2a2a 100%)",
        padding: "16px 16px 12px",
        gap: "14px",
      }}
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className={[
          "absolute right-2 top-2 z-[1] inline-flex h-9 w-9 items-center justify-center",
          "rounded-full border border-[#666] bg-[#111] text-white",
          "shadow-[0_4px_10px_rgba(0,0,0,.4)] hover:bg-[#151515]",
        ].join(" ")}
      >
        ×
      </button>

      <div
        className="mt-10 w-[90%] overflow-hidden rounded-[16px] border border-white/10"
      >
        <img
          src={hero}
          alt={philosopher.name || "philosopher"}
          draggable={false}
          className="block h-auto w-[95%] select-none"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = DEFAULT_HERO;
          }}
        />
      </div>

      <div className="mt-1 max-h-[40vh] overflow-auto px-[6px] pb-3 text-left">
        <h3
          className="mb-2 mt-[6px] text-left text-[24px] text-white"
          style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: ".3px" }}
        >
          Deskripsi
        </h3>
        <p className="text-[15.5px] leading-[1.6] text-[#e0e0e0]">
          {description}
        </p>

        {dateLine ? (
          <p
            className="mt-3 text-center text-white/80"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            {dateLine}
          </p>
        ) : null}
      </div>
    </aside>
  );
}