// src/features/home/components/CourseSection.tsx
import { useEffect, useMemo, useState, type FC } from "react";

type VideoInput = { id: string; url: string };
type VideoCard = {
  id: string;
  href: string;
  title: string;
  date: string;
  publishedAt?: string;
  // desc: string;
  thumb: string;
};

const VIDEO_LINKS: VideoInput[] = [
  { id: "v1", url: "https://www.youtube.com/watch?v=cL7fxbq32S4&list=PL7jTs0cokAnwUlYbjEKi_Yo_EZsW7u9rp&index=1" },
  { id: "v2", url: "https://www.youtube.com/watch?v=nxNwqaFNmdU&list=PL7jTs0cokAnwUlYbjEKi_Yo_EZsW7u9rp&index=2" },
  { id: "v3", url: "https://www.youtube.com/watch?v=TOYzAHoZmHU&list=PL7jTs0cokAnwUlYbjEKi_Yo_EZsW7u9rp&index=3" },
  { id: "v4", url: "https://www.youtube.com/watch?v=JHxl9Bn5HRk&list=PL7jTs0cokAnwUlYbjEKi_Yo_EZsW7u9rp&index=4" },
];

const MAX_TITLE_WORDS = 10;
// const MAX_DESC_WORDS = 12;

// const DEFAULT_DESC =
//   "Access exclusive Philosophy101 membership videos and deepen your understanding with curated lessons.";

function extractYouTubeId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) {
      return u.pathname.replace("/", "") || null;
    }
    if (u.hostname.includes("youtube.com")) {
      const v = u.searchParams.get("v");
      return v || null;
    }
    return null;
  } catch {
    return null;
  }
}

function ytThumb(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
}

function prettyDate(iso?: string): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", { day: "2-digit", month: "long", year: "numeric" });
}

function truncateWords(text: string, n: number) {
  const safe = (text ?? "").trim();
  if (!safe) return ["", false] as const;
  const words = safe.split(/\s+/);
  if (words.length <= n) return [safe, false] as const;
  return [words.slice(0, n).join(" "), true] as const;
}

function ContinueReadInline() {
  return (
    <span
      className="
        inline-flex items-center underline underline-offset-4
        decoration-white/60 hover:decoration-white
      "
    >
      Continue to Watch&nbsp;→
    </span>
  );
}

const PlayIcon: FC = () => (
  <div
    className="absolute left-1/2 top-1/2 z-[2] flex h-[50px] w-[50px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full transition-transform duration-200 ease-in-out group-hover:scale-110"
    style={{ background: "#fff", boxShadow: "0 2px 6px rgba(0,0,0,0.2)" }}
    aria-hidden
  >
    <span
      className="inline-block"
      style={{
        borderStyle: "solid",
        borderWidth: "10px 0 10px 16px",
        borderColor: "transparent transparent transparent #000",
        marginLeft: "4px",
        width: 0,
        height: 0,
      }}
    />
  </div>
);

const CourseCard: FC<VideoCard> = ({ href, title, thumb }) => {
  const [titleCut, titleTrimmed] = truncateWords(title, MAX_TITLE_WORDS);
  // const [descCut, descTrimmed] = truncateWords(desc, MAX_DESC_WORDS);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group block no-underline"
      aria-label={title}
      title={title}
    >
      <article className="course-card text-left">
        <div className="relative mb-4 w-full overflow-hidden rounded-[10px] bg-black">
          <div className="relative w-full aspect-video flex items-center justify-center">
            <img
              src={thumb}
              alt={title}
              className="max-h-full max-w-full object-contain"
              loading="lazy"
              onError={(e) => {
                const el = e.currentTarget as HTMLImageElement;
                if (!el.dataset.fallback) {
                  el.dataset.fallback = "1";
                  el.src = el.src.replace("maxresdefault.jpg", "hqdefault.jpg");
                }
              }}
            />
            <PlayIcon />
          </div>
        </div>

        <h3
          className="mb-[0.3rem] text-[1.5rem] text-white"
          style={{ fontFamily: "'Bebas Neue', sans-serif" }}
        >
          {titleCut}
          {titleTrimmed ? "..." : ""}
        </h3>

        {/* <p
          className="mb-[0.6rem] text-[0.9rem] text-white"
          style={{ fontFamily: "'Roboto Condensed', sans-serif", opacity: 0.8 }}
        >
          {date}
        </p> */}

        <p className="mb-0 text-[0.95rem] leading-[1.6] text-white" style={{ opacity: 0.85 }}>
          {/* {descCut}
          {descTrimmed ? "..." : ""}  */}
          <ContinueReadInline />
        </p>
      </article>
    </a>
  );
};

export default function CourseSection() {
  const [cards, setCards] = useState<VideoCard[]>([]);
  const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY as string | undefined;

  useEffect(() => {
    let alive = true;

    async function fetchWithYouTubeAPI(videoIds: string[]) {
      const idsParam = videoIds.join(",");
      const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${idsParam}&key=${apiKey}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("YouTube API error");
      const data = await res.json();
      const map: Record<string, { title: string; publishedAt?: string }> = {};
      for (const item of data.items ?? []) {
        map[item.id] = {
          title: item.snippet?.title ?? "",
          publishedAt: item.snippet?.publishedAt,
        };
      }
      return map;
    }

    async function fetchWithOEmbed(urls: string[]) {
      const entries: Record<string, { title: string }> = {};
      for (const url of urls) {
        try {
          const o = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`);
          if (!o.ok) continue;
          const json = await o.json();
          entries[url] = { title: json?.title ?? "" };
        } catch {
        }
      }
      return entries;
    }

    (async () => {
      const withIds = VIDEO_LINKS.map((v) => ({ ...v, vid: extractYouTubeId(v.url) })).filter((v) => v.vid);
      const ids = withIds.map((v) => v.vid!) as string[];

      let titles: Record<string, { title: string; publishedAt?: string }> = {};
      if (apiKey && ids.length) {
        try {
          titles = await fetchWithYouTubeAPI(ids);
        } catch {
          const o = await fetchWithOEmbed(VIDEO_LINKS.map((v) => v.url));
          titles = Object.fromEntries(
            withIds.map(({ url, vid }) => [vid!, { title: o[url]?.title ?? "", publishedAt: undefined }])
          );
        }
      } else {
        const o = await fetchWithOEmbed(VIDEO_LINKS.map((v) => v.url));
        titles = Object.fromEntries(
          withIds.map(({ url, vid }) => [vid!, { title: o[url]?.title ?? "", publishedAt: undefined }])
        );
      }

      const next: VideoCard[] = withIds.map(({ id, url, vid }) => ({
        id,
        href: url,
        title: titles[vid!]?.title || "YouTube Video",
        publishedAt: titles[vid!]?.publishedAt,
        date: prettyDate(titles[vid!]?.publishedAt),
        // desc: DEFAULT_DESC,
        thumb: ytThumb(vid!),
      }));

      if (alive) setCards(next);
    })();

    return () => {
      alive = false;
    };
  }, [apiKey]);

  const hasCards = useMemo(() => cards.length > 0, [cards]);

  return (
    <section id="course" className="relative z-0 mb-50 mt-20 bg-transparent px-0 py-0">
      <div className="absolute inset-x-0 -top-12 -bottom-12 -z-10 bg-black" />

      <div className="course-container mx-auto max-w-[1460px] px-8 py-6">
        <header className="course-header relative mb-2 md:flex md:items-center md:justify-start">
          <img
            src="/assets/icon/MembershipCourse_Logo.png"
            alt="Ardhianzy Research"
            className="hidden sm:inline-block h-[clamp(38px,4vw,70px)] w-auto object-contain select-none"
            draggable={false}
          />

          <h2
            className="ml-4 text-left text-[3rem] text-white"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            Membership Course
          </h2>

          <a
            href="https://www.youtube.com/@ardhianzy/membership"
            className="course-more-button mt-4 inline-flex items-center rounded-[50px] border border-white px-6 py-[0.7rem] text-white transition-colors md:absolute md:right-8 md:top-1/2 md:mt-0 md:-translate-y-1/2 focus:outline-none focus:ring-2 focus:ring-white/60 hover:text-black hover:bg-white hover:border-black"
            style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1rem", textDecoration: "none" }}
          >
            SEE ALL <span className="ml-2">→</span>
          </a>
        </header>

        <p
          className="mb-8 max-w-[532px] text-left text-[1.1rem] text-white"
          style={{ fontFamily: "Roboto, sans-serif" }}
        >
          Access more Philosophy101 videos. Join{" "}
          <a href="https://www.youtube.com/@ardhianzy/membership" className="text-[#00aaff] underline">
            membership
          </a>{" "}
          today!
        </p>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-3">
          {!hasCards
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded-[10px] bg-white/10 p-4 animate-pulse h-[320px]" />
              ))
            : cards.map((item) => <CourseCard key={item.id} {...item} />)}
        </div>
      </div>
    </section>
  );
}