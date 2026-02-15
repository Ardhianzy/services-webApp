// src/features/home/components/LatestVideosSection.tsx
import { useEffect, useRef, useState, type FC, useCallback } from "react";
import { contentApi } from "@/lib/content/api";
import type { LatestYoutubeDTO } from "@/lib/content/types";

type VideoItem = {
  id: number;
  thumb: string;
  title: string;
  date: string;
  link: string;
};

type LatestVideosSectionProps = { onSeeAll?: () => void };

function extractYouTubeId(url: string): string {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtube.com")) return u.searchParams.get("v") || "";
    if (u.hostname === "youtu.be") return u.pathname.replace("/", "");
  } catch {}
  const m = url.match(/v=([A-Za-z0-9_\-]+)/);
  return m?.[1] ?? "";
}

function normalizeUrl(raw?: string): string {
  const url = (raw ?? "").trim();
  if (!url) return "";
  if (/^https?:\/\//i.test(url)) return url;
  if (/^youtu\.be\//i.test(url)) return `https://${url}`;
  if (/^www\./i.test(url)) return `https://${url}`;
  return url;
}

function formatDateShort(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
}

const getPanSize = (container: HTMLElement | null) => {
  if (!container) return 300;
  const first = container.querySelector<HTMLElement>("[data-video-card]");
  if (!first) return 300;
  const styles = window.getComputedStyle(container);
  const gap = parseFloat((styles as any).gap || (styles as any).columnGap || "0") || 0;
  return first.offsetWidth + gap;
};

const LatestVideosSection: FC<LatestVideosSectionProps> = () => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [panSize, setPanSize] = useState<number>(300);

  const [videos, setVideos] = useState<VideoItem[]>([]);

  const [vw, setVw] = useState<number>(() =>
    typeof window !== "undefined" ? window.innerWidth : 1920
  );
  const isMobile = vw < 768;

  const [activeDot, setActiveDot] = useState(0);
  const dotCount = Math.max(1, videos.length || 0);

  const dragging = useRef(false);
  const dragMoved = useRef(false);
  const dragStartX = useRef(0);
  const dragStartLeft = useRef(0);
  const CLICK_MOVE_THRESHOLD = 6;

  useEffect(() => {
    const onResize = () => setVw(window.innerWidth);
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const canAbort = typeof AbortController !== "undefined";
    const abort = canAbort ? new AbortController() : null;

    (async () => {
      try {
        const rows = await contentApi.youtube.latest((abort?.signal as any) ?? undefined);

        const safeRows: LatestYoutubeDTO[] = Array.isArray(rows) ? rows : [];

        // Mengambil hanya 5 data teratas
        const mapped: VideoItem[] = safeRows.slice(0, 5).map((it: LatestYoutubeDTO, idx) => {
          const link = normalizeUrl((it as any).url);
          const vid = extractYouTubeId(link);
          const thumb = vid ? `https://img.youtube.com/vi/${vid}/hqdefault.jpg` : "/assets/course/01.png";
          return {
            id: idx + 1,
            thumb,
            title: (it as any).title ?? "",
            date: formatDateShort((it as any).created_at),
            link,
          };
        });

        setVideos(mapped);
      } catch {
        setVideos([]);
      }
    })();

    return () => {
      abort?.abort();
    };
  }, []);

  const updateActiveDot = useCallback(() => {
    const el = carouselRef.current;
    if (!el) return;
    const p = panSize || 300;
    const idx = Math.round(el.scrollLeft / p);
    const max = Math.max(0, dotCount - 1);
    setActiveDot(Math.max(0, Math.min(max, idx)));
  }, [panSize, dotCount]);

  const updatePanSize = useCallback(() => {
    setPanSize(getPanSize(carouselRef.current));
  }, []);

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    updatePanSize();
    updateActiveDot();

    const onScroll = () => {
      updateActiveDot();
    };

    const onResize = () => {
      updatePanSize();
      updateActiveDot();
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });

    const ro = "ResizeObserver" in window ? new ResizeObserver(onResize) : null;
    if (ro) ro.observe(el);

    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (ro) ro.disconnect();
    };
  }, [updatePanSize, updateActiveDot]);

  const goToDot = (idx: number) => {
    const el = carouselRef.current;
    if (!el) return;
    el.scrollTo({ left: idx * (panSize || 300), behavior: "smooth" });
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const el = carouselRef.current;
    if (!el) return;
    
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      el.scrollBy({ left: -panSize, behavior: "smooth" });
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      el.scrollBy({ left: panSize, behavior: "smooth" });
    } else if (e.key === "Home") {
      e.preventDefault();
      el.scrollTo({ left: 0, behavior: "smooth" });
    } else if (e.key === "End") {
      e.preventDefault();
      el.scrollTo({ left: el.scrollWidth, behavior: "smooth" });
    }
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = carouselRef.current;
    if (!el) return;
    dragging.current = true;
    dragMoved.current = false;
    dragStartX.current = e.clientX;
    dragStartLeft.current = el.scrollLeft;
    el.setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = carouselRef.current;
    if (!el || !dragging.current) return;
    const dx = e.clientX - dragStartX.current;
    if (!dragMoved.current && Math.abs(dx) > CLICK_MOVE_THRESHOLD) dragMoved.current = true;
    el.scrollLeft = dragStartLeft.current - dx;
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = carouselRef.current;
    if (!el) return;
    dragging.current = false;
    el.releasePointerCapture?.(e.pointerId);
    updateActiveDot();
  };

  const openVideo = (url: string) => {
    if (!url) return;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const carouselId = "latest-videos-carousel";

  return (
    <section id="latest-videos" className="mx-0 mb-0 mt-50 bg-black pb-16">
      <style>{`.no-scrollbar::-webkit-scrollbar{display:none}`}</style>

      <div className="mx-auto max-w-[1560px] px-8 py-6 max-[768px]:px-4">
        <div className="mb-16 flex items-center justify-between">
          <div className="flex items-center">
            <img
              src="/assets/icon/LatestVideo_Logo.png"
              alt="Ardhianzy Latest Video"
              className="hidden sm:inline-block h-[clamp(38px,4vw,70px)] w-auto object-contain select-none"
              draggable={false}
            />
            <h2
              className="ml-4 text-[3rem] max-[768px]:text-[2.4rem] text-white"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            >
              Check Our Latest Videos
            </h2>
          </div>

          <a
            href="https://www.youtube.com/@ardhianzy/videos"
            className="hidden min-[768px]:inline-flex items-center rounded-[50px] border border-white px-6 py-[0.7rem] text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white/60 hover:text-black hover:bg-white hover:border-black"
            style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1rem", textDecoration: "none" }}
            aria-label="See all videos on YouTube"
            target="_blank"
            rel="noopener noreferrer"
          >
            SEE ALL <span className="ml-[0.3rem]">→</span>
          </a>
        </div>

        <div className="relative" role="region" aria-label="Latest videos carousel">
          <div
            id={carouselId}
            ref={carouselRef}
            role="list"
            aria-roledescription="carousel"
            aria-label="Latest videos"
            tabIndex={0}
            onKeyDown={onKeyDown}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            className={[
              "no-scrollbar",
              "flex gap-10 overflow-x-auto pb-4",
              "snap-x snap-mandatory",
              "cursor-grab",
              dragging.current ? "cursor-grabbing" : "",
            ].join(" ")}
            style={{ WebkitOverflowScrolling: "touch", msOverflowStyle: "none", scrollbarWidth: "none" }}
          >
            {videos.map((v) => (
              <article
                role="listitem"
                key={v.id}
                data-video-card
                className="flex w-[260px] shrink-0 snap-start flex-col overflow-hidden rounded-b-[1rem] bg-transparent"
                style={{ boxShadow: "0 4px 6px rgba(0,0,0,0.3)" }}
                title={v.title}
              >
                <a
                  href={v.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/60"
                  aria-label={`Open video: ${v.title}`}
                  style={{ textDecoration: "none" }}
                  onClick={(e) => {
                    if (dragMoved.current) {
                      e.preventDefault();
                      return;
                    }
                    e.preventDefault();
                    e.stopPropagation();
                    openVideo(v.link);
                  }}
                >
                  <div className="relative mb-6 block aspect-video w-full overflow-hidden hover:shadow-[0_12px_40px_rgba(255,255,255,0.15)] transition-shadow">
                    <img src={v.thumb} alt="" className="h-full w-full object-cover" />
                    <span
                      aria-hidden
                      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[2rem] text-white/80"
                    >
                      ▶
                    </span>
                  </div>

                  <div className="flex flex-col items-start px-4 pb-4 text-left">
                    <div className="mb-2 text-[0.85rem] text-[#aaa]" style={{ fontFamily: "'Roboto', sans-serif" }}>
                      {v.date}
                    </div>
                    <div className="mb-1 block text-[1.1rem] leading-[1.3] text-white" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                      {v.title}
                    </div>
                  </div>
                </a>
              </article>
            ))}
          </div>

          {isMobile && (
            <div className="mt-6 flex justify-center gap-2" aria-label="Latest videos slider pagination">
              {Array.from({ length: dotCount }).map((_, idx) => {
                const active = idx === activeDot;
                return (
                  <button
                    key={`video-dot-${idx}`}
                    type="button"
                    aria-label={`Go to video ${idx + 1}`}
                    onClick={() => goToDot(idx)}
                    className={[
                      "h-2 w-2 rounded-full transition-opacity",
                      active ? "bg-white opacity-100" : "bg-white/40 opacity-60",
                    ].join(" ")}
                  />
                );
              })}
            </div>
          )}

          {isMobile && (
            <div className="mt-6 flex justify-center">
              <a
                href="https://www.youtube.com/@ardhianzy/videos"
                className="inline-flex items-center rounded-[50px] border border-white px-6 py-[0.7rem] text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white/60 hover:text-black hover:bg-white hover:border-black"
                style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1rem", textDecoration: "none" }}
                aria-label="See all videos on YouTube"
                target="_blank"
                rel="noopener noreferrer"
              >
                SEE ALL <span className="ml-[0.3rem]">→</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default LatestVideosSection