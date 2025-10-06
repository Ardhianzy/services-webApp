// src/features/home/components/LatestVideosSection.tsx
import { useEffect, useRef, useState, type FC, useCallback } from "react";

type VideoItem = {
  id: number;
  thumb: string;
  date: string;
  title: string;
  description: string;
  link: string;
};

type LatestVideosSectionProps = {
  onSeeAll?: () => void;
};

const VIDEOS: VideoItem[] = [
  {
    id: 1,
    thumb: "/assets/course/01.png",
    date: "08 Feb 2024",
    title: "Pemilu dan Demokrasi itu Salah! Menurut Para Filsuf",
    description:
      "Sebuah pengantar singkat tentang pemikiran para filsuf mengenai demokrasi dan pemilu.",
    link: "https://www.youtube.com/watch?v=_AiEQlK-ec0",
  },
  {
    id: 2,
    thumb: "/assets/course/02.png",
    date: "08 Feb 2024",
    title: "Kebangkitan Penghancur Dunia",
    description: "Biografi singkat Adolf Hitler dan dampak historisnya.",
    link: "https://www.youtube.com/watch?v=gzv5A7v4ymI",
  },
  {
    id: 3,
    thumb: "/assets/course/03.png",
    date: "08 Feb 2024",
    title: "Anime Terbaik 2023: Vinland Saga Season 2",
    description:
      "Ulasan tentang anime Vinland Saga musim kedua yang sangat dinantikan.",
    link: "https://www.youtube.com/watch?v=M13URqx_WzQ",
  },
  {
    id: 4,
    thumb: "/assets/course/04.png",
    date: "08 Feb 2024",
    title: "“Tuhan Telah Mati” – Nietzsche",
    description:
      "Penjelasan konteks dari kutipan terkenal Friedrich Nietzsche.",
    link: "https://www.youtube.com/watch?v=BS-HtBfH3nw",
  },
  {
    id: 5,
    thumb: "/assets/course/05.png",
    date: "08 Feb 2024",
    title: "Bagaimana Kekaisaran Mongol Hancur?",
    description:
      "Membedah faktor-faktor yang menyebabkan runtuhnya Kekaisaran Mongol.",
    link: "https://www.youtube.com/watch?v=U7sBVFMVLjw",
  },
];

const getPanSize = (container: HTMLElement | null) => {
  if (!container) return 300; // fallback aman
  const first = container.querySelector<HTMLElement>("[data-video-card]");
  if (!first) return 300;
  const styles = window.getComputedStyle(container);
  const gap =
    parseFloat((styles as any).gap || (styles as any).columnGap || "0") || 0;
  return first.offsetWidth + gap;
};

const LatestVideosSection: FC<LatestVideosSectionProps> = ({ onSeeAll }) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);
  const [panSize, setPanSize] = useState<number>(300);
  const [dragging, setDragging] = useState(false);
  const dragStartX = useRef(0);
  const dragStartLeft = useRef(0);

  const updateArrows = useCallback(() => {
    const el = carouselRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 0);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth);
  }, []);

  const updatePanSize = useCallback(() => {
    setPanSize(getPanSize(carouselRef.current));
  }, []);

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;

    updatePanSize();
    updateArrows();

    const onScroll = () => updateArrows();
    const onResize = () => {
      updatePanSize();
      updateArrows();
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
  }, [updateArrows, updatePanSize]);

  const pan = (dir: "left" | "right") => {
    const el = carouselRef.current;
    if (!el) return;
    const offset = dir === "left" ? -panSize : panSize;
    el.scrollBy({ left: offset, behavior: "smooth" });
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      pan("left");
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      pan("right");
    } else if (e.key === "Home") {
      e.preventDefault();
      carouselRef.current?.scrollTo({ left: 0, behavior: "smooth" });
    } else if (e.key === "End") {
      e.preventDefault();
      const el = carouselRef.current;
      if (!el) return;
      el.scrollTo({ left: el.scrollWidth, behavior: "smooth" });
    }
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = carouselRef.current;
    if (!el) return;
    setDragging(true);
    dragStartX.current = e.clientX;
    dragStartLeft.current = el.scrollLeft;
    el.setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = carouselRef.current;
    if (!el || !dragging) return;
    el.scrollLeft = dragStartLeft.current - (e.clientX - dragStartX.current);
  };
  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = carouselRef.current;
    if (!el) return;
    setDragging(false);
    el.releasePointerCapture?.(e.pointerId);
    updateArrows();
  };

  const carouselId = "latest-videos-carousel";

  return (
    <section id="latest-videos" className="m-0 bg-black py-16">
      <style>{`.no-scrollbar::-webkit-scrollbar{display:none}`}</style>

      <div className="mx-auto max-w-[1400px] px-8 py-6 max-[768px]:px-4">
        <div className="mb-4 flex items-center justify-between">
          <h2
            className="m-0 text-[3rem] text-white"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            Check Our Latest Videos
          </h2>

          <button
            type="button"
            onClick={() => onSeeAll?.()}
            className="inline-flex items-center rounded-[50px] border border-white px-6 py-[0.7rem] text-white transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/60"
            style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1rem" }}
            aria-label="See all videos"
          >
            SEE ALL →
          </button>
        </div>

        <div className="relative" role="region" aria-label="Latest videos carousel">
          {canLeft && (
            <button
              type="button"
              aria-label="Previous videos"
              aria-controls={carouselId}
              onClick={() => pan("left")}
              className="absolute left-2 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/60"
              style={{ fontSize: "1.5rem" }}
            >
              ‹
            </button>
          )}

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
              dragging ? "cursor-grabbing" : "",
            ].join(" ")}
            style={{
              WebkitOverflowScrolling: "touch",
              msOverflowStyle: "none",
              scrollbarWidth: "none",
            }}
          >
            {VIDEOS.map((v) => (
              <article
                role="listitem"
                key={v.id}
                data-video-card
                className="flex w-[260px] snap-start flex-col overflow-hidden rounded-b-[1rem] bg-transparent"
                style={{ boxShadow: "0 4px 6px rgba(0,0,0,0.3)" }}
                title={v.title}
              >
                <a
                  href={v.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative mb-8 block aspect-video w-full overflow-hidden focus:outline-none focus:ring-2 focus:ring-white/60"
                  aria-label={`Open video: ${v.title}`}
                >
                  <img
                    src={v.thumb}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                  <span
                    aria-hidden
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[2rem] text-white/80"
                  >
                    ▶
                  </span>
                </a>

                <div className="flex flex-col items-start px-4 pb-4 text-left">
                  <div
                    className="mb-2 text-[0.85rem] text-[#aaa]"
                    style={{ fontFamily: "'Roboto Condensed', sans-serif" }}
                  >
                    {v.date}
                  </div>

                  <a
                    href={v.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mb-4 block truncate text-[1.1rem] leading-[1.3] text-white focus:outline-none focus:ring-2 focus:ring-white/60"
                    style={{ fontFamily: "'Bebas Neue', sans-serif", textDecoration: "none" }}
                    aria-label={`Open video: ${v.title}`}
                    title={v.title}
                  >
                    {v.title}
                  </a>

                  <p
                    className="m-0 text-[0.9rem] leading-[1.4] text-[#eee]"
                    style={{ fontFamily: "Roboto, sans-serif", opacity: 0.85 }}
                  >
                    {v.description}
                  </p>
                </div>
              </article>
            ))}
          </div>

          {canRight && (
            <button
              type="button"
              aria-label="Next videos"
              aria-controls={carouselId}
              onClick={() => pan("right")}
              className="absolute right-2 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/60"
              style={{ fontSize: "1.5rem" }}
            >
              ›
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default LatestVideosSection;