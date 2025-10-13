// src/features/home/components/ReadingGuideSection.tsx
import { useEffect, useMemo, useState, type FC } from "react";
import {
  philosophers,
  philosophersHomeIds,
  type Philosopher,
} from "@/data/philosophers";

const ReadingGuideSection: FC = () => {
  const [vw, setVw] = useState<number>(
    typeof window !== "undefined" ? window.innerWidth : 1920
  );

  useEffect(() => {
    const onResize = () => setVw(window.innerWidth);
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const { isTablet, isMobile } = useMemo(
    () => ({ isTablet: vw <= 1024 && vw > 640, isMobile: vw <= 640 }),
    [vw]
  );

  const items: Philosopher[] = useMemo(
    () =>
      philosophersHomeIds
        .map((id) => philosophers.find((p) => p.id === id))
        .filter(Boolean) as Philosopher[],
    []
  );

  const borderClassFor = (i: number) => {
    if (isMobile) return i === 0 ? "" : "border-t border-white/30 pt-12";
    if (isTablet) return i % 2 === 1 ? "border-l border-white/30" : "";
    return i === 0 ? "" : "border-l border-white/30";
  };

  return (
    <section
      id="reading-guide"
      aria-labelledby="philosophers_heading"
      className="bg-black text-white"
    >
      <div className="mx-auto max-w-[1560px] px-8">
        <div className="mb-16 flex items-center justify-between max-[640px]:flex-col max-[640px]:gap-6">
          <h2
            id="philosophers_heading"
            className="m-0 text-[3rem]"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            Meet The Philosophers
          </h2>

          <a
            href="/ReadingGuide"
            className="inline-flex items-center rounded-[50px] border border-white px-6 py-[0.7rem] transition-colors hover:bg-white hover:text-black focus:outline-none focus:ring-2 focus:ring-white/60"
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "1rem",
              textDecoration: "none",
            }}
          >
            SEE ALL <span className="ml-2">→</span>
          </a>
        </div>

        <div className="grid grid-cols-4 max-[1024px]:grid-cols-2 max-[640px]:grid-cols-1 max-[1024px]:gap-y-16 max-[640px]:gap-y-12">
          {items.map((p, i) => (
            <article
              key={String(p.id)}
              className={["flex flex-col items-center px-6 text-center", borderClassFor(i)].join(
                " "
              )}
            >
              <div className="mb-6 h-[250px] w-[187px] overflow-hidden">
                <img
                  loading="lazy"
                  decoding="async"
                  src={p.image}
                  alt={p.name}
                  className="h-full w-full object-cover"
                  style={{ objectPosition: "top" }}
                />
              </div>

              <h3
                className="mb-3 text-[28px] font-normal leading-[1.2]"
                style={{ fontFamily: "'Bebas Neue', sans-serif" }}
              >
                {p.name}
              </h3>

              <p
                className="m-0 max-w-[226px] text-[12px] font-light leading-[1.5] text-white/90"
                style={{ fontFamily: "Roboto, sans-serif" }}
              >
                {(p as any).description || (p as any).descript || (p as any).desc || ""}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReadingGuideSection;