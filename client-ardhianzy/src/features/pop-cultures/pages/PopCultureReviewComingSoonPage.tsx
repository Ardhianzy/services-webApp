import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/common/Navbar";
import SectionNavLinks from "@/features/layout/components/SectionNavLinks";
import PopCultureReviewArticlesSection from "@/features/pop-cultures/components/PopCultureReviewArticlesSection";

export default function PopCultureReviewComingSoonPage() {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <SectionNavLinks />

      <main className="bg-black text-white min-h-screen left-0 pt-[70px] pb-[80px] pcr-coming-main">
        <style>{`
          @media (max-width: 768px) {
            .pcr-coming-main .pcr-coming-hero {
              height: 52vh !important;
              max-height: 520px !important;
              min-height: 280px !important;
            }

            .pcr-coming-main .pcr-coming-backbtn {
              font-size: 13px !important;
              line-height: 1.25 !important;
              padding: 10px 14px !important;
              gap: 10px !important;
              white-space: normal !important;
              flex-wrap: wrap !important;
              max-width: calc(100vw - 32px) !important;
            }
          }
        `}</style>

        <section
          className="relative w-[100vw] left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] h-[60vh] max-h-[620px] min-h-[320px] bg-black overflow-hidden pcr-coming-hero"
          aria-label="Pop Culture Review hero"
        >
          <img
            src="/assets/popCulture/dadasdfe.png"
            alt="Coming Soon"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ filter: "grayscale(100%)", mixBlendMode: "luminosity" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
          <h1
            className="absolute inset-x-0 bottom-[44%] m-0 text-center text-white uppercase"
            style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.5rem,6vw,5rem)", lineHeight: 1.05 }}
          >
            COMING SOON
          </h1>
        </section>

        <section className="container-fluid mt-[32px]">
          <button
            onClick={() => navigate(-1)}
            className="
              font-roboto mb-4 underline text-white cursor-pointer
              inline-flex items-center gap-[10px]
              rounded-full px-4 py-2 text-[15px] font-semibold bg-transparent
              transition-colors hover:text-black hover:bg-white hover:border-black focus:bg-[#191919] active:bg-[#191919]
              border border-white
              pcr-coming-backbtn
            "
            aria-label="Go back"
            title="Back"
          >
            <span className="inline-grid place-items-center w-[24px] h-[24px] leading-none" aria-hidden>
              <span className="pointer-events-none select-none text-[20px]">←</span>
            </span>
            Back to "Pop-Culture Review Section"
          </button>
        </section>

        <div className="mt-[60px]">
          <PopCultureReviewArticlesSection />
        </div>
      </main>
    </>
  );
}