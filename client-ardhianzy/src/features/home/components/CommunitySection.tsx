// src/features/home/components/CommunitySection.tsx
import { type FC } from "react";

const BACKGROUND_URL = "/assets/community/Intro.png";
const CARD_SHADOW = "0 4px 12px rgba(0,0,0,0.5)";

const CommunitySection: FC = () => {
  return (
    <section
      id="community"
      aria-labelledby="community-title"
      className="mb-22 bg-black bg-no-repeat bg-center bg-[length:75%] py-24 px-8"
      style={{ backgroundImage: `url('${BACKGROUND_URL}')` }}
    >
      <div className="max-w-[1480px] mx-auto px-8 flex justify-start">
        <div
          className="bg-[#1a1a1a] text-white rounded-[30px] p-8 max-w-[400px]"
          style={{ boxShadow: CARD_SHADOW }}
        >
          <h2
            id="community-title"
            className="mb-6 text-[2.4rem] text-center"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            CHECK OUR COMMUNITY
          </h2>

          <ul
            className="list-disc list-inside text-justify text-[0.9rem] leading-[1.6] mb-8"
            style={{
              fontFamily: "Roboto, sans-serif",
              textJustify: "inter-word" as any,
            }}
          >
            <li className="mb-3 opacity-85">
              Dialogue: ngobrol santai &amp; curhat bareng
            </li>
            <li className="mb-3 opacity-85">
              Reading: rekomendasi buku, artikel, dan insight
            </li>
            <li className="mb-3 opacity-85">
              Debate: debat sehat &amp; tukar pikiran
            </li>
          </ul>

          <a
            href="https://discord.gg/Q79ScExgG4"
            aria-label="Join our Discord"
            className="inline-flex mx-auto items-center px-6 py-[0.7rem] border !border-white !rounded-4xl text-white transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/60"
            style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1rem", textDecoration: "none" }}
          >
            JOIN OUR DISCORD
            <img
              src="/assets/icon/discord.svg"
              alt="discord icon"
              aria-hidden="true"
              className="w-5 h-5 ml-2"
            />
          </a>
        </div>
      </div>
    </section>
  );
};

export default CommunitySection;