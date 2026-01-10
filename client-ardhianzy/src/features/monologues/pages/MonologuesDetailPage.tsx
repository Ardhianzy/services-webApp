// src/features/monologues/pages/MonologuesDetailPage.tsx
import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { Navbar } from "@/components/common/Navbar";
import SectionNavLinks from "@/features/layout/components/SectionNavLinks";
import { contentApi } from "@/lib/content/api";
import type { MonologueDTO } from "@/lib/content/types";
import MonologuesArticleGridSection from "../components/MonologuesArticleGridSection";

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

        for (let i = 1; i <= pdf.numPages; i++) {
          if (canceled) return;
          const page = await pdf.getPage(i);

          const baseViewport = page.getViewport({ scale: 1 });
          const cssWidth = container.clientWidth || baseViewport.width;
          const scale = (cssWidth / baseViewport.width) * 1.5;
          const viewport = page.getViewport({ scale });

          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          canvas.width = Math.floor(viewport.width);
          canvas.height = Math.floor(viewport.height);
          canvas.style.width = "100%";
          canvas.style.height = "auto";
          canvas.style.display = "block";
          canvas.style.margin = i === pdf.numPages ? "0 auto 0" : "0 auto 24px";
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
    <div className="mlgdet__pdf w-full rounded-xl border border-white/10 bg-black py-6">
      <div ref={ref} className="mlgdet__pdfInner w-[90%] mx-auto" />
      {err ? (
        <div className="w-[90%] mx-auto mt-4 text-white/80">{err}</div>
      ) : null}
    </div>
  );
}

export default function MonologuesDetailPage() {
  const { slug = "" } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState<MonologueDTO | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const list = await contentApi.monologues.list();
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

  const title = item?.title ?? "Monologues";
  const pdfUrl = item?.pdf_url;

  return (
    <>
      <Navbar />
      <SectionNavLinks />

      <main className="bg-black text-white min-h-screen pt-[70px] pb-[80px]">
        <style>{`
          @media (max-width: 640px) {
            .mlgdet__wrap { width: 92% !important; margin-top: 20px !important; }
            .mlgdet__back {
              width: 100% !important;
              justify-content: center !important;
              text-align: center !important;
              white-space: normal !important;
            }
            .mlgdet__pdf { padding-top: 18px !important; padding-bottom: 18px !important; border-radius: 16px !important; }
            .mlgdet__pdfInner { width: 92% !important; }
          }
        `}</style>

        {/* <section
          className="relative w-[100vw] left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] h-[60vh] max-h-[620px] min-h-[320px] bg-black overflow-hidden"
          aria-label="Monologues hero"
        >
          <img
            src="/assets/Group 515432_waifu2x_art_noise3_scale.png"
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
        </section> */}

        <section className="mlgdet__wrap w-[95%] mx-auto mt-[32px]">
          <button
            onClick={() => navigate(-1)}
            className="
              mlgdet__back
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
            Back to "Monologues Section"
          </button>

          <div className="h-[24px]" />

          {loading ? (
            <div className="w-full h-[80vh] rounded-xl bg-white/10 animate-pulse" />
          ) : pdfUrl ? (
            <PdfInlineViewer url={pdfUrl} title={title} />
          ) : (
            <div className="text-white/80">PDF tidak tersedia.</div>
          )}

          <div className="mt-1">
            <MonologuesArticleGridSection />
          </div>
        </section>
      </main>
    </>
  );
}