// src/features/research/pages/ResearchDetailPage.tsx
import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/common/Navbar";
import SectionNavLinks from "@/features/layout/components/SectionNavLinks";
import ResearchArticlesSection from "@/features/research/components/ResearchArticlesSection";
import { contentApi } from "@/lib/content/api";
import type { ResearchDTO } from "@/lib/content/types";

declare global {
  interface Window {
    pdfjsLib?: any;
  }
}

async function ensurePdfJsLoaded(): Promise<void> {
  if (window.pdfjsLib) return;
  await new Promise<void>((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Failed to load pdf.js"));
    document.head.appendChild(s);
  });
  if (window.pdfjsLib?.GlobalWorkerOptions) {
    window.pdfjsLib.GlobalWorkerOptions.workerSrc =
      "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
  }
}

function PdfInlineViewer({ url, title }: { url: string; title: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let canceled = false;

    async function run() {
      try {
        setErr(null);
        await ensurePdfJsLoaded();
        if (!window.pdfjsLib) throw new Error("pdf.js not available");

        const container = ref.current;
        if (!container) return;
        container.innerHTML = "";

        const loadingTask = window.pdfjsLib.getDocument({ url });
        const pdf = await loadingTask.promise;

        const isMobile =
          typeof window !== "undefined" &&
          typeof window.matchMedia === "function" &&
          window.matchMedia("(max-width: 640px)").matches;

        const scaleBoost = isMobile ? 1.15 : 1.5;
        const pageGap = isMobile ? 16 : 24;

        for (let i = 1; i <= pdf.numPages; i++) {
          if (canceled) return;
          const page = await pdf.getPage(i);

          const baseViewport = page.getViewport({ scale: 1 });
          const cssWidth = container.clientWidth || baseViewport.width;
          const scale = (cssWidth / baseViewport.width) * scaleBoost;
          const viewport = page.getViewport({ scale });

          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          canvas.width = Math.floor(viewport.width);
          canvas.height = Math.floor(viewport.height);
          canvas.style.width = "100%";
          canvas.style.height = "auto";
          canvas.style.display = "block";
          canvas.style.margin = i === pdf.numPages ? "0 auto 0" : `0 auto ${pageGap}px`;
          canvas.style.backgroundColor = "#fff";
          canvas.style.boxShadow = "0 10px 40px rgba(0,0,0,0.35)";
          canvas.setAttribute("role", "img");
          canvas.setAttribute("aria-label", `${title} — Page ${i}`);

          container.appendChild(canvas);

          await page.render({ canvasContext: ctx, viewport }).promise;
        }
      } catch (e) {
        setErr("Gagal merender PDF.");
      }
    }

    if (url) run();
    return () => {
      canceled = true;
    };
  }, [url, title]);

  return (
    <div className="rs-pdf w-full rounded-xl border border-white/10 bg-black py-6">
      <style>{`
        @media (max-width: 640px) {
          .rs-pdf { padding-top: 14px !important; padding-bottom: 14px !important; border-radius: 16px !important; }
          .rs-pdf__inner { width: 94% !important; }
        }
      `}</style>

      <div ref={ref} className="rs-pdf__inner w-[90%] mx-auto" />
      {err ? <div className="w-[90%] mx-auto mt-4 text-white/80">{err}</div> : null}
    </div>
  );
}

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
        <style>{`
          @media (max-width: 640px) {
            .rs-detail__wrap { width: 92% !important; margin-top: 22px !important; }
            .rs-detail__back {
              font-size: 14px !important;
              padding: 10px 12px !important;
              gap: 8px !important;
              line-height: 1.15 !important;
              flex-wrap: wrap !important;
              max-width: 100% !important;
            }
            .rs-detail__backIcon { width: 22px !important; height: 22px !important; }
            .rs-detail__related { margin-top: 60px !important; }
          }
        `}</style>

        <section className="rs-detail__wrap w-[95%] mx-auto mt-[32px]">
          <button
            onClick={() => navigate(-1)}
            className="
              rs-detail__back
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
              className="rs-detail__backIcon inline-grid place-items-center w-[24px] h-[24px] leading-none"
              aria-hidden
            >
              <span className="pointer-events-none select-none text-[20px]">←</span>
            </span>
            <span>Back to "Research Section"</span>
          </button>

          <div className="h-[24px]" />

          {loading ? (
            <div className="w-full h-[80vh] rounded-xl bg-white/10 animate-pulse" />
          ) : pdfUrl ? (
            <PdfInlineViewer url={pdfUrl} title={title} />
          ) : (
            <div className="text-white/80">PDF tidak tersedia.</div>
          )}

          <div className="rs-detail__related mt-1">
            <ResearchArticlesSection />
          </div>
        </section>
      </main>
    </>
  );
}