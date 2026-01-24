// src/features/home/components/ShopsSection.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { contentApi } from "@/lib/content/api";
import type { ShopDTO } from "@/lib/content/types";

type ShopCard = {
  img?: string | null;
  name: string;
  type: string;
  author: string;
  price: string;
  href?: string;
  isComingSoon?: boolean;
  desc?: string;
};

const MAX_VISIBLE = 5;
const SIMULATE_EXTRA_SOON = 0;

function formatIDR(n?: number | string | null) {
  const num = typeof n === "string" ? Number(n) : n ?? 0;
  if (!Number.isFinite(num)) return "—";
  try {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(Number(num));
  } catch {
    return `Rp ${num}`;
  }
}

function mapToCard(x: ShopDTO): ShopCard {
  return {
    img: (x.image || "").trim() || null,
    name: (x.title || "").trim(),
    type: x.category ? `Merch • ${x.category}` : "Merch",
    author: "Ardhianzy",
    price: formatIDR(x.price),
    href: (x.link || "").trim() || "#",
    isComingSoon: false,
    desc: (x.meta_description || x.desc || "").trim(),
  };
}

function buildComingSoonCard(): ShopCard {
  return {
    img: null,
    name: "Coming Soon",
    type: "",
    author: "Nantikan produk Ardhianzy lainnya!",
    price: "—",
    href: undefined,
    isComingSoon: true,
  };
}

const getPanSize = (root: HTMLElement | null) => {
  if (!root || typeof window === "undefined") return 190;
  const track = root.querySelector<HTMLElement>(".shop-track") ?? root;
  const first = track.querySelector<HTMLElement>("[data-shop-card]");
  if (!first) return 190;
  const styles = window.getComputedStyle(track);
  const gapStr =
    (styles as any).gap || (styles as any).columnGap || (styles as any).rowGap || "0";
  const gap = parseFloat(gapStr) || 0;
  return first.offsetWidth + gap;
};

export default function ShopsSection() {
  const [cards, setCards] = useState<ShopCard[]>([]);
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const baseScrollerRef = useRef<HTMLDivElement | null>(null);

  const [dragging, setDragging] = useState(false);
  const [showBar, setShowBar] = useState(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const hideTimerRef = useRef<number | null>(null);

  const [vw, setVw] = useState<number>(() =>
    typeof window !== "undefined" ? window.innerWidth : 1920
  );
  const isMobile = vw < 768;

  const [activeDot, setActiveDot] = useState(0);
  const panSizeRef = useRef<number>(190);

  useEffect(() => {
    const onResize = () => setVw(window.innerWidth);
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await contentApi.shops.list();
        const normalized = (Array.isArray(data) ? data : []).map(mapToCard);
        if (mounted) setCards(normalized);
      } catch {
        if (mounted) setCards([]);
      }
    })();
    return () => {
      mounted = false;
      if (hideTimerRef.current) {
        window.clearTimeout(hideTimerRef.current);
        hideTimerRef.current = null;
      }
    };
  }, []);

  const baseFive = useMemo(() => {
    const real = cards.slice(0, MAX_VISIBLE);
    const fillers = Array.from(
      { length: Math.max(0, MAX_VISIBLE - real.length) },
      buildComingSoonCard
    );
    return [...real, ...fillers];
  }, [cards]);

  const overflowCards = useMemo(() => {
    const extras = Array.from({ length: SIMULATE_EXTRA_SOON }, buildComingSoonCard);
    return [...cards, ...extras];
  }, [cards]);

  const hasOverflow = overflowCards.length > MAX_VISIBLE;

  const mobileDotCount = isMobile
    ? Math.max(1, (hasOverflow ? overflowCards.length : baseFive.length) || 1)
    : 0;

  useEffect(() => {
    if (!isMobile) return;

    const el = (hasOverflow ? scrollerRef.current : baseScrollerRef.current) as HTMLDivElement | null;
    if (!el) return;

    const updatePan = () => {
      panSizeRef.current = getPanSize(el);
    };

    const clampIdx = (idx: number) => {
      const max = Math.max(0, mobileDotCount - 1);
      return Math.max(0, Math.min(max, idx));
    };

    const updateActive = () => {
      const p = panSizeRef.current || 190;
      const idx = Math.round(el.scrollLeft / p);
      setActiveDot(clampIdx(idx));
    };

    updatePan();
    updateActive();

    const onScroll = () => updateActive();
    const onResize = () => {
      updatePan();
      updateActive();
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
  }, [isMobile, hasOverflow, mobileDotCount]);

  const scrollToDot = (idx: number) => {
    const el = (hasOverflow ? scrollerRef.current : baseScrollerRef.current) as HTMLDivElement | null;
    if (!el) return;
    const p = panSizeRef.current || 190;
    el.scrollTo({ left: idx * p, behavior: "smooth" });
  };

  const revealScrollbar = () => {
    if (!hasOverflow) return;
    setShowBar(true);
    if (hideTimerRef.current) window.clearTimeout(hideTimerRef.current);
    hideTimerRef.current = window.setTimeout(() => setShowBar(false), 700);
  };

  const onMouseDown: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (!hasOverflow || !scrollerRef.current) return;
    setDragging(true);
    startXRef.current = e.pageX - scrollerRef.current.offsetLeft;
    scrollLeftRef.current = scrollerRef.current.scrollLeft;
  };
  const onMouseLeave: React.MouseEventHandler<HTMLDivElement> = () => setDragging(false);
  const onMouseUp: React.MouseEventHandler<HTMLDivElement> = () => setDragging(false);
  const onMouseMove: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (!dragging || !scrollerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollerRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 1;
    scrollerRef.current.scrollLeft = scrollLeftRef.current - walk;
  };
  const onTouchStart: React.TouchEventHandler<HTMLDivElement> = (e) => {
    if (!hasOverflow || !scrollerRef.current) return;
    setDragging(true);
    startXRef.current = e.touches[0].pageX - scrollerRef.current.offsetLeft;
    scrollLeftRef.current = scrollerRef.current.scrollLeft;
  };
  const onTouchMove: React.TouchEventHandler<HTMLDivElement> = (e) => {
    if (!dragging || !scrollerRef.current) return;
    const x = e.touches[0].pageX - scrollerRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 1;
    scrollerRef.current.scrollLeft = scrollLeftRef.current - walk;
  };
  const onTouchEnd: React.TouchEventHandler<HTMLDivElement> = () => setDragging(false);

  const Card = (item: ShopCard, i: number, clickable = true) => {
    const inner = (
      <>
        <div className="mb-3 h-[240px] w-full">
          {item.isComingSoon ? (
            <div className="h-full w-full grid place-items-center border border-white/30 bg-black/30 p-4">
              <img
                src="/assets/icon/Ardhianzy_Logo_2.png"
                alt="Ardhianzy"
                className="max-h-[70%] w-auto object-contain select-none"
                draggable={false}
              />
            </div>
          ) : item.img ? (
            <img
              loading="lazy"
              decoding="async"
              src={item.img}
              alt={item.name}
              className="h-full w-full object-cover"
              draggable={false}
            />
          ) : (
            <div className="h-full w-full grid place-items-center border border-white/30 bg-black/30" />
          )}
        </div>

        <div className="flex flex-col items-center text-center">
          <h3
            className="my-1 text-[1.25rem] text-white"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            {item.name || "Untitled"}
          </h3>
          <p
            className="m-0 text-[0.85rem] italic text-white opacity-80"
            style={{ fontFamily: "Roboto, sans-serif" }}
          >
            {item.type}
          </p>
          <p
            className="my-1 text-[0.9rem] font-semibold text-white opacity-90"
            style={{ fontFamily: "Roboto, sans-serif" }}
          >
            {item.isComingSoon ? item.author : "Ardhianzy"}
          </p>
          <p className="m-0 text-[1rem] text-white">{item.price}</p>
        </div>
      </>
    );

    const wrapperClass =
      "w-[170px] mx-auto text-center max-[768px]:mx-0 max-[768px]:shrink-0 max-[768px]:snap-start";

    if (!clickable || item.isComingSoon) {
      return (
        <div key={`soon-${i}`} className={wrapperClass} aria-disabled="true" data-shop-card>
          {inner}
        </div>
      );
    }
    return (
      <a
        key={`${item.name}-${i}`}
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        className={wrapperClass}
        data-shop-card
      >
        {inner}
      </a>
    );
  };

  return (
    <section id="shops" aria-labelledby="shops_heading">
      <style>{`.no-scrollbar::-webkit-scrollbar{display:none}`}</style>

      <div className="mt-50 relative z-[1] mx-auto max-w-[1560px] px-8 py-6">
        <div aria-hidden className="absolute inset-y-0 left-1/2 -z-10 w-screen -translate-x-1/2 bg-black" />

        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center">
            <img
              src="/assets/icon/Shop_Logo.png"
              alt="Ardhianzy Shop"
              className="hidden sm:inline-block h-[clamp(38px,4vw,70px)] w-auto object-contain select-none"
              draggable={false}
            />
            <h2
              id="shops_heading"
              className="ml-4 text-[3rem] max-[768px]:text-[2.4rem] text-white"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            >
              Shops
            </h2>
          </div>

          {/* <a
            href="/shop"
            className="inline-flex items-center rounded-[50px] border border-white px-6 py-[0.7rem] text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white/60 hover:text-black hover:bg-white hover:border-black"
            style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1rem", textDecoration: "none" }}
          >
            SEE ALL <span className="ml-[0.3rem]">→</span>
          </a> */}
        </div>

        {!hasOverflow && (
          <div
            ref={baseScrollerRef}
            className={[
              "flex flex-wrap justify-evenly gap-8",
              "max-[768px]:flex-nowrap max-[768px]:justify-start max-[768px]:overflow-x-auto max-[768px]:overflow-y-hidden",
              "max-[768px]:snap-x max-[768px]:snap-mandatory max-[768px]:gap-6 max-[768px]:pb-4",
              "max-[768px]:no-scrollbar",
            ].join(" ")}
            aria-label="Shop items grid"
          >
            {baseFive.map((item, i) => Card(item, i, !item.isComingSoon))}
          </div>
        )}

        {hasOverflow && (
          <div
            ref={scrollerRef}
            className={[
              `x-scrollbar ${showBar ? "show-scrollbar" : ""} ${dragging ? "dragging" : ""}`,
              "scroll-drag overflow-x-auto overflow-y-hidden px-1 py-1 select-none",
              "max-[768px]:snap-x max-[768px]:snap-mandatory max-[768px]:no-scrollbar",
            ].join(" ")}
            onScroll={revealScrollbar}
            onMouseDown={onMouseDown}
            onMouseLeave={onMouseLeave}
            onMouseUp={onMouseUp}
            onMouseMove={onMouseMove}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            aria-label="Shop items scroller"
          >
            <div className="shop-track">
              {overflowCards.map((item, i) => Card(item, i, !item.isComingSoon))}
            </div>
          </div>
        )}

        {isMobile && (
          <div className="mt-6 flex justify-center gap-2" aria-label="Shop slider pagination">
            {Array.from({ length: mobileDotCount }).map((_, idx) => {
              const active = idx === activeDot;
              return (
                <button
                  key={`shop-dot-${idx}`}
                  type="button"
                  aria-label={`Go to item ${idx + 1}`}
                  onClick={() => scrollToDot(idx)}
                  className={[
                    "h-2 w-2 rounded-full transition-opacity",
                    active ? "bg-white opacity-100" : "bg-white/40 opacity-60",
                  ].join(" ")}
                />
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}