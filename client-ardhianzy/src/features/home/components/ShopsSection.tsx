// src/features/home/components/ShopsSection.tsx
import { useEffect, useRef, useState, type MouseEventHandler, type PointerEventHandler, type KeyboardEventHandler } from "react";

type ShopItem = {
  img: string;
  name: string;
  type: string;
  author: string;
  price: string;
};

const shopData: ShopItem[] = [
  { img: "/assets/Shop/topi.png", name: "LOREM", type: "Merch • Hat", author: "Ardhianzy", price: "Rp. 100.000" },
  { img: "/assets/Shop/topi.png", name: "LOREM", type: "Merch • Hat", author: "Ardhianzy", price: "Rp. 100.000" },
  { img: "/assets/Shop/topi.png", name: "LOREM", type: "Merch • Hat", author: "Ardhianzy", price: "Rp. 100.000" },
  { img: "/assets/Shop/topi.png", name: "LOREM", type: "Merch • Hat", author: "Ardhianzy", price: "Rp. 100.000" },
  { img: "/assets/Shop/topi.png", name: "LOREM", type: "Merch • Hat", author: "Ardhianzy", price: "Rp. 100.000" },
  { img: "/assets/Shop/topi.png", name: "LOREM", type: "Merch • Hat", author: "Ardhianzy", price: "Rp. 100.000" },
  { img: "/assets/Shop/topi.png", name: "LOREM", type: "Merch • Hat", author: "Ardhianzy", price: "Rp. 100.000" },
  { img: "/assets/Shop/topi.png", name: "LOREM", type: "Merch • Hat", author: "Ardhianzy", price: "Rp. 100.000" },
  { img: "/assets/Shop/topi.png", name: "LOREM", type: "Merch • Hat", author: "Ardhianzy", price: "Rp. 100.000" },
];

export default function ShopsSection() {
  const listRef = useRef<HTMLDivElement | null>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startScroll, setStartScroll] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const updateArrows = () => {
    const el = listRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 0);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  useEffect(() => {
    updateArrows();
    const onResize = () => updateArrows();
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const getLeftOffset = (el: HTMLElement) => el.getBoundingClientRect().left + window.scrollX;

  const onMouseDown: MouseEventHandler<HTMLDivElement> = (e) => {
    const el = listRef.current;
    if (!el) return;
    setIsDragging(true);
    setStartX(e.pageX - getLeftOffset(el));
    setStartScroll(el.scrollLeft);
  };
  const onMouseUp: MouseEventHandler<HTMLDivElement> = () => setIsDragging(false);
  const onMouseLeave: MouseEventHandler<HTMLDivElement> = () => setIsDragging(false);
  const onMouseMove: MouseEventHandler<HTMLDivElement> = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const el = listRef.current;
    if (!el) return;
    const x = e.pageX - getLeftOffset(el);
    el.scrollLeft = startScroll - (x - startX);
    updateArrows();
  };

  const onPointerDown: PointerEventHandler<HTMLDivElement> = (e) => {
    const el = listRef.current;
    if (!el) return;
    el.setPointerCapture?.(e.pointerId);
    setIsDragging(true);
    setStartX(e.pageX - getLeftOffset(el));
    setStartScroll(el.scrollLeft);
  };
  const onPointerUp: PointerEventHandler<HTMLDivElement> = () => setIsDragging(false);
  const onPointerMove: PointerEventHandler<HTMLDivElement> = (e) => {
    if (!isDragging) return;
    const el = listRef.current;
    if (!el) return;
    const x = e.pageX - getLeftOffset(el);
    el.scrollLeft = startScroll - (x - startX);
    updateArrows();
  };

  const onKeyDown: KeyboardEventHandler<HTMLDivElement> = (e) => {
    const el = listRef.current;
    if (!el) return;
    if (e.key === "ArrowLeft") {
      el.scrollBy({ left: -el.clientWidth, behavior: "smooth" });
      e.preventDefault();
    } else if (e.key === "ArrowRight") {
      el.scrollBy({ left: el.clientWidth, behavior: "smooth" });
      e.preventDefault();
    }
  };

  const handlePrev = () => {
    const el = listRef.current;
    if (!el) return;
    el.scrollBy({ left: -el.clientWidth, behavior: "smooth" });
  };
  const handleNext = () => {
    const el = listRef.current;
    if (!el) return;
    el.scrollBy({ left: el.clientWidth, behavior: "smooth" });
  };

  return (
    <section id="shops" aria-labelledby="shops_heading">
      <div className="relative z-[1] mx-auto max-w-[1400px] px-8 py-6">
        <div aria-hidden className="absolute inset-y-0 left-1/2 -z-10 w-screen -translate-x-1/2 bg-black" />

        <div className="mb-4 flex items-center justify-between">
          <h2
            id="shops_heading"
            className="m-0 text-[3rem] text-white"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            Shops
          </h2>
          <a
            href="#"
            className="inline-flex items-center rounded-[50px] border border-white px-6 py-[0.7rem] text-white transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/60"
            style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1rem", textDecoration: "none" }}
          >
            SEE ALL <span className="ml-[0.3rem]">→</span>
          </a>
        </div>

        <div className="relative overflow-visible">
          {canPrev && (
            <button
              type="button"
              aria-label="Previous"
              onClick={handlePrev}
              className="absolute left-[-24px] top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border-0 bg-black/60 p-0 text-white transition hover:bg-black/80"
            >
              ‹
            </button>
          )}

          <div
            ref={listRef}
            onMouseDown={onMouseDown}
            onMouseLeave={onMouseLeave}
            onMouseUp={onMouseUp}
            onMouseMove={onMouseMove}
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
            onPointerMove={onPointerMove}
            onKeyDown={onKeyDown}
            tabIndex={0}
            aria-label="Shop items carousel"
            onScroll={updateArrows}
            className="flex cursor-grab gap-[75px] overflow-x-hidden scroll-smooth active:cursor-grabbing"
            style={{ touchAction: "pan-y" }}
          >
            {shopData.map((item, i) => (
              <div key={`${item.name}-${i}`} className="w-[170px] flex-shrink-0 text-center">
                <div className="mb-3 h-[240px] w-full">
                  <img
                    loading="lazy"
                    decoding="async"
                    src={item.img.trim()}
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="flex flex-col items-center">
                  <h3
                    className="my-1 text-[1.25rem] text-white"
                    style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                  >
                    {item.name}
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
                    {item.author}
                  </p>
                  <p className="m-0 text-[1rem] text-white">{item.price}</p>
                </div>
              </div>
            ))}
          </div>

          {canNext && (
            <button
              type="button"
              aria-label="Next"
              onClick={handleNext}
              className="absolute right-[-24px] top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border-0 bg-black/60 p-0 text-white transition hover:bg-black/80"
            >
              ›
            </button>
          )}
        </div>
      </div>
    </section>
  );
}