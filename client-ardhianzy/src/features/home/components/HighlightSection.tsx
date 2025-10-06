// src/features/home/components/HighlightSection.tsx
import { type FC } from "react";

const BG_IMAGE = "url('/assets/Rectangle 4553.svg')";
const BG_BASE = "#2c2c2c";
const BLUR_PX = 8;

const MASK_GRADIENT =
  "linear-gradient(90deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 40%, rgba(0,0,0,0) 100%)";
const DARK_GRADIENT =
  "linear-gradient(90deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.3) 40%, transparent 100%)";

const PRETITLE_STYLE: React.CSSProperties = {
  fontFamily: "'Estonia', serif",
  fontWeight: 400,
  fontSize: "clamp(1.5rem, 3.5vw, 3.5rem)",
  color: "rgba(255,255,255,0.9)",
  letterSpacing: "2px",
};

const TITLE_STYLE: React.CSSProperties = {
  fontFamily: "'Bebas Neue', cursive",
  fontSize: "clamp(2rem, 6vw, 5rem)",
  lineHeight: 0.9,
  color: "#fff",
  letterSpacing: "3px",
  textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
};

const META_STYLE: React.CSSProperties = {
  fontFamily: "'Roboto Condensed', sans-serif",
  fontWeight: 300,
  fontSize: "clamp(1rem, 2.5vw, 1.5rem)",
  color: "rgba(255,255,255,0.85)",
  letterSpacing: "1px",
};

const HighlightSection: FC = () => {
  return (
    <section
      id="highlight"
      aria-labelledby="highlight-title"
      className={[
        "relative w-full overflow-hidden",
        "flex items-center",
        "h-[600px] max-[1024px]:h-[500px] max-[768px]:h-[400px] max-[480px]:h-[350px]",
        "bg-black bg-cover bg-center bg-blend-luminosity",
      ].join(" ")}
      style={{ backgroundImage: BG_IMAGE, backgroundColor: BG_BASE }}
    >
      <div
        aria-hidden
        className="absolute inset-y-0 left-0 z-[1] w-1/2"
        style={{
          backdropFilter: `blur(${BLUR_PX}px)`,
          WebkitBackdropFilter: `blur(${BLUR_PX}px)`,
          maskImage: MASK_GRADIENT,
          WebkitMaskImage: MASK_GRADIENT,
        }}
      />

      <div
        aria-hidden
        className="absolute inset-y-0 left-0 z-[1] w-1/2"
        style={{ background: DARK_GRADIENT }}
      />

      <div
        className={[
          "relative z-[2] text-white",
          "ml-[50%] max-w-[60%]",
          "pl-[50px]",
          "max-[1440px]:pl-[200px]",
          "max-[1024px]:pl-[150px]",
          "max-[768px]:pl-[100px]",
          "max-[480px]:pl-[60px]",
        ].join(" ")}
      >
        <div>
          <div className="mb-[-10px]" style={PRETITLE_STYLE}>
            Reading Session
          </div>

          <h2 id="highlight-title" className="my-[10px] mb-[20px] uppercase" style={TITLE_STYLE}>
            BEYOND GOOD &amp; EVIL
          </h2>

          <div style={META_STYLE}>Friday, May 16 at 8:00 PM</div>
        </div>
      </div>
    </section>
  );
};

export default HighlightSection;