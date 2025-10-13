// src/features/home/components/ResearchSection.tsx
import { useEffect, useState } from "react";
import { listResearch } from "@/features/research/api";
import { API_BASE } from "@/config/endpoints";

type ResearchRemote = any;
type ResearchCard = {
  img: string;
  title: string;
  date: string;
  excerpt: string;
  link: string;
};

const FALLBACK: ResearchCard[] = [
  {
    img: "/assets/research/Desain tanpa judul.png",
    title: "LOREM IPSUM DOLOR SIT",
    date: "22 May, 2025",
    excerpt:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna",
    link: "/research",
  },
  {
    img: "/assets/research/Research (3).png",
    title: "LOREM IPSUM DOLOR SIT",
    date: "22 May, 2025",
    excerpt:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna",
    link: "/research",
  },
  {
    img: "/assets/research/Research (1).png",
    title: "LOREM IPSUM DOLOR SIT",
    date: "22 May, 2025",
    excerpt:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna",
    link: "/research",
  },
  {
    img: "/assets/research/Research (2).png",
    title: "LOREM IPSUM DOLOR SIT",
    date: "22 May, 2025",
    excerpt:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna",
    link: "/research",
  },
];

function toAbs(url?: string) {
  if (!url) return undefined;
  if (/^https?:\/\//i.test(url)) return url;
  return `${API_BASE}${url.startsWith("/") ? "" : "/"}${url}`;
}

function pickFirst<T = string>(obj: any, keys: string[], fallback?: T): T {
  for (const k of keys) {
    const v = obj?.[k];
    if (v != null && v !== "") return v as T;
  }
  return fallback as T;
}

function plainExcerpt(htmlOrText?: string, max = 140) {
  if (!htmlOrText) return "";
  const text = String(htmlOrText).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  return text.length > max ? `${text.slice(0, max)}…` : text;
}

function mapToCard(x: ResearchRemote): ResearchCard {
  const title = pickFirst<string>(x, ["title", "research_title", "name"], "Untitled");
  const dateRaw = pickFirst<string>(x, ["research_date", "publishedAt", "date"], "");
  const date =
    dateRaw && !/^\d{1,2}\s\w+,\s\d{4}$/.test(dateRaw)
      ? new Date(dateRaw).toLocaleDateString("en-US", { day: "2-digit", month: "long", year: "numeric" })
      : dateRaw || "";
  const img = toAbs(pickFirst<string>(x, ["image", "img", "thumbnail", "cover"], "")) ?? "/assets/research/Research (1).png";
  const excerpt = plainExcerpt(pickFirst<string>(x, ["content", "research_sum", "excerpt", "summary"], ""));
  return { img, title, date, excerpt, link: "/research" };
}

export default function ResearchSection() {
  const [items, setItems] = useState<ResearchCard[]>(FALLBACK);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await listResearch();
        const normalized = (Array.isArray(data) ? data : []).slice(0, 4).map(mapToCard);
        if (mounted && normalized.length) setItems(normalized);
      } catch {
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section id="research" aria-labelledby="research_heading" className="mb-50">
      <div className="mx-auto max-w-[1560px] px-16 py-8 text-white max-[1200px]:px-8">
        <div className="mb-10 flex items-center justify-between max-[768px]:flex-col max-[768px]:items-start">
          <h2 id="research_heading" className="m-0 text-[3rem]" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
            Check Our Research
          </h2>

          <a
            href="/research"
            className="inline-flex items-center rounded-[50px] border border-white px-6 py-[0.7rem] text-white transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/60"
            style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1rem", textDecoration: "none" }}
          >
            MORE RESEARCH <span className="ml-[0.3rem]">→</span>
          </a>
        </div>

        <div className="grid grid-cols-4 gap-8 max-[1200px]:grid-cols-2 max-[768px]:grid-cols-1">
          {items.map((item, i) => (
            <article
              key={`${i}-${item.title}`}
              className={[
                "relative text-left pl-8",
                i > 0 ? "border-l border-[#444]" : "",
                "max-[768px]:border-none max-[768px]:pl-0",
              ].join(" ")}
            >
              <div className="mb-4 h-[175px] w-[249px] overflow-hidden rounded-[20px]">
                <img
                  loading="lazy"
                  decoding="async"
                  src={item.img}
                  alt={item.title}
                  className="h-full w-full object-cover"
                  style={{ objectPosition: "50% 10%" }}
                />
              </div>

              <h3 className="mb-2 text-[2rem]" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                {item.title}
              </h3>

              <p className="mb-4 text-[0.9rem] opacity-80" style={{ fontFamily: "'Roboto Condensed', sans-serif" }}>
                {item.date}
              </p>

              <p className="mb-4 text-[0.9rem] leading-[1.5] opacity-85">{item.excerpt}</p>

              <a href={item.link} className="mt-7 mb-[9px] inline-flex items-center underline" aria-label={`Read research: ${item.title}`}>
                Read research <span className="ml-[0.3rem]">→</span>
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}