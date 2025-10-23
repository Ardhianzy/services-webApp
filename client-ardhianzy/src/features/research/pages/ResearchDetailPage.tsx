import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { Navbar } from "@/components/common/Navbar";
import SectionNavLinks from "@/features/layout/components/SectionNavLinks";
import ResearchArticlesSection from "@/features/research/components/ResearchArticlesSection";
import { contentApi } from "@/lib/content/api";
import type { ResearchDTO } from "@/lib/content/types";

export default function ResearchDetailPage() {
  const { slug = "" } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState<ResearchDTO | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const list = await contentApi.research.list();
        const found = list.find((x) => (x.slug ?? "") === slug) ?? null;
        if (alive) setItem(found);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [slug]);

  const title = item?.research_title ?? "Research";
  const pdfUrl = item?.pdf_url;

  return (
    <>
      <Navbar />
      <SectionNavLinks />

      <main className="bg-black text-white min-h-screen pt-[70px] pb-[80px]">
        <section
          className="relative w-[100vw] left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] h-[60vh] max-h-[620px] min-h-[320px] bg-black overflow-hidden"
          aria-label="Research hero"
        >
          <img
            src="/assets/Group 4981.svg"
            alt={title}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ filter: "grayscale(100%)", mixBlendMode: "luminosity" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
          <h1
            className="absolute inset-x-0 bottom-[44%] m-0 text-center text-white"
            style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.5rem,6vw,5rem)", lineHeight: 1.05 }}
          >
            {title}
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
            "
            aria-label="Go back"
            title="Back"
          >
            <span className="inline-grid place-items-center w-[24px] h-[24px] leading-none" aria-hidden>
              <span className="pointer-events-none select-none text-[20px]">←</span>
            </span>
            Back to "Research Section"
          </button>

          <div className="h-[24px]" />

          {loading ? (
            <div className="w-full h-[80vh] rounded-xl bg-white/10 animate-pulse" />
          ) : pdfUrl ? (
            <iframe title={title} src={pdfUrl} className="w-full h-[85vh] rounded-xl border border-white/10 bg-black" />
          ) : (
            <div className="text-white/80">PDF tidak tersedia.</div>
          )}

          <div className="mt-[60px]">
            <ResearchArticlesSection />
          </div>
        </section>
      </main>
    </>
  );
}