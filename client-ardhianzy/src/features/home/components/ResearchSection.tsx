// src/features/home/components/ResearchSection.tsx
type ResearchItem = {
  img: string;
  title: string;
  date: string;
  excerpt: string;
  link: string;
};

const researchData: ResearchItem[] = [
  {
    img: "/assets/research/Desain tanpa judul.png",
    title: "LOREM IPSUM DOLOR SIT",
    date: "22 May, 2025",
    excerpt:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna",
    link: "#",
  },
  {
    img: "/assets/research/Research (3).png",
    title: "LOREM IPSUM DOLOR SIT",
    date: "22 May, 2025",
    excerpt:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna",
    link: "#",
  },
  {
    img: "/assets/research/Research (1).png",
    title: "LOREM IPSUM DOLOR SIT",
    date: "22 May, 2025",
    excerpt:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna",
    link: "#",
  },
  {
    img: "/assets/research/Research (2).png",
    title: "LOREM IPSUM DOLOR SIT",
    date: "22 May, 2025",
    excerpt:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna",
    link: "#",
  },
];

export default function ResearchSection() {
  return (
    <section id="research" aria-labelledby="research_heading">
      <div className="mx-auto max-w-[1400px] px-16 py-8 text-white max-[1200px]:px-8">
        <div className="mb-10 flex items-center justify-between max-[768px]:flex-col max-[768px]:items-start">
          <h2
            id="research_heading"
            className="m-0 text-[3rem]"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            Check Our Research
          </h2>

          <a
            href="#"
            className="inline-flex items-center rounded-[50px] border border-white px-6 py-[0.7rem] text-white transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/60"
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "1rem",
              textDecoration: "none",
            }}
          >
            MORE RESEARCH <span className="ml-[0.3rem]">→</span>
          </a>
        </div>

        <div className="grid grid-cols-4 gap-8 max-[1200px]:grid-cols-2 max-[768px]:grid-cols-1">
          {researchData.map((item, i) => (
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

              <h3
                className="mb-2 text-[2rem]"
                style={{ fontFamily: "'Bebas Neue', sans-serif" }}
              >
                {item.title}
              </h3>

              <p
                className="mb-4 text-[0.9rem] opacity-80"
                style={{ fontFamily: "'Roboto Condensed', sans-serif" }}
              >
                {item.date}
              </p>

              <p className="mb-4 text-[0.9rem] leading-[1.5] opacity-85">
                {item.excerpt}
              </p>

              <a
                href={item.link}
                className="inline-flex items-center underline"
                aria-label={`Read research: ${item.title}`}
              >
                Read research <span className="ml-[0.3rem]">→</span>
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}