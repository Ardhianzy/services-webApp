// src/features/magazine/pages/MagazineComingSoonPage.tsx
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/common/Navbar";
import SectionNavLinks from "@/features/layout/components/SectionNavLinks";
import MagazineCollectionSection from "@/features/magazine/components/MagazineCollectionSection";

export default function MagazineComingSoonPage() {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <SectionNavLinks />

      <main className="bg-black text-white min-h-screen left-0 pt-[70px] pb-[80px]">
        <style>{`
          /* Mobile-only: hero lebih proporsional + judul 2.4rem */
          @media (max-width: 640px) {
            .mag-cs__hero { height: 45vh !important; min-height: 260px !important; }
            .mag-cs__h1 { bottom: 46% !important; }
            .mag-cs__btnWrap { width: 92% !important; margin-left: auto !important; margin-right: auto !important; }
            .mag-cs__back {
              font-size: 14px !important;
              padding: 10px 12px !important;
              gap: 8px !important;
              line-height: 1.15 !important;
              flex-wrap: wrap !important;
              max-width: 100% !important;
            }
            .mag-cs__backIcon { width: 22px !important; height: 22px !important; }
          }
        `}</style>

        <section
          className="mag-cs__hero relative w-[100vw] left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] h-[60vh] max-h-[620px] min-h-[320px] bg-black overflow-hidden"
          aria-label="Magazine hero"
        >
          <img
            src="/assets/magazine/smdamdla.png"
            alt="Coming Soon"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ filter: "grayscale(100%)", mixBlendMode: "luminosity" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
          <h1
            className="mag-cs__h1 absolute inset-x-0 bottom-[44%] m-0 text-center text-white"
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(2.4rem,6vw,5rem)",
              lineHeight: 1.05,
            }}
          >
            Coming Soon
          </h1>
        </section>

        <section className="mag-cs__btnWrap container-fluid mt-[32px]">
          <button
            onClick={() => navigate(-1)}
            className="
              mag-cs__back
              font-roboto mb-4 underline text-white cursor-pointer
              inline-flex items-center gap-[10px]
              rounded-full px-4 py-2 text-[15px] font-semibold bg-transparent
              transition-colors hover:text-black hover:bg-white hover:border-black focus:bg-[#191919] active:bg-[#191919]
              border border-white
            "
            aria-label="Go back"
            title="Back"
          >
            <span
              className="mag-cs__backIcon inline-grid place-items-center w-[24px] h-[24px] leading-none"
              aria-hidden
            >
              <span className="pointer-events-none select-none text-[20px]">←</span>
            </span>
            <span>Back to "Magazine Section"</span>
          </button>
        </section>

        <MagazineCollectionSection />
      </main>
    </>
  );
}