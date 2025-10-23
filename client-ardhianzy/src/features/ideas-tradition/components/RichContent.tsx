import type { IdeaBlock } from "../types";

function slugify(text: string) {
  return text.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim().replace(/\s+/g, "-");
}

export default function RichContent({ blocks }: { blocks: IdeaBlock[] }) {
  return (
    <div className="space-y-[clamp(16px,2.2vw,28px)]">
      {blocks.map((b, i) => {
        if (b.type === "paragraph") {
          return (
            <p key={i}
               className="text-[clamp(15px,1.05vw,18px)] leading-[1.85] text-white/90"
               dangerouslySetInnerHTML={{ __html: b.html }} />
          );
        }
        if (b.type === "h2") {
          const id = slugify(b.text);
          return (
            <h2 key={i} id={id}
                className="scroll-mt-24 text-fluid-lg font-semibold tracking-tight text-white mt-[clamp(24px,3vw,48px)]"
                style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
              {b.text}
            </h2>
          );
        }
        if (b.type === "image") {
          return (
            <figure key={i} className="my-[clamp(12px,2vw,20px)]">
              <div className="relative w-full overflow-hidden rounded-xl border border-white/10">
                <img src={b.src} alt={b.alt ?? ""} loading="lazy"
                     className="block w-full h-auto object-cover" />
              </div>
              {b.caption && (
                <figcaption className="mt-2 text-sm text-white/60">{b.caption}</figcaption>
              )}
            </figure>
          );
        }
        return null;
      })}
    </div>
  );
}