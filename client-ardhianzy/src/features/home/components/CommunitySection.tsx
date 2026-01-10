// src/features/home/components/CommunitySection.tsx
import { type FC } from "react";

const BACKGROUND_URL = "/assets/community/communityBg.png";
const CARD_SHADOW = "0 4px 12px rgba(0,0,0,0.5)";

const CommunitySection: FC = () => {
  return (
    <section
      id="community"
      aria-labelledby="community-title"
      className="community-section relative w-screen mt-15 mb-35 overflow-visible bg-black py-24 max-[900px]:py-20 max-[640px]:py-14"
      style={{
        backgroundImage: `url('${BACKGROUND_URL}')`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "contain",
        minHeight: "520px",
      }}
    >
      <div
        className="relative mx-auto w-full"
        style={{
          maxWidth: 1560,
          height: "100%",
        }}
      >
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          aria-hidden
        />

        <style>{`
          .community-card { box-shadow: ${CARD_SHADOW}; }

          .pos-left-top  { --dx:-380px; --dy:-90px;  }
          .pos-left-bot  { --dx:-380px; --dy:110px;  }
          .pos-right-top { --dx: 260px; --dy:-20px;  }
          .pos-right-bot { --dx: 260px; --dy:130px;  }

          .card-abs {
            position: absolute;
            left: 50%;
            top:  50%;
            transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy)));
          }

          .card-grad-left {
            background: linear-gradient(
              to right,
              rgba(255,255,255,0.40) 0%,
              rgba(255,255,255,0.18) 55%,
              rgba(255,255,255,0.08) 100%
            );
          }
          .card-grad-right {
            background: linear-gradient(
              to left,
              rgba(255,255,255,0.40) 0%,
              rgba(255,255,255,0.18) 55%,
              rgba(255,255,255,0.08) 100%
            );
          }

          @media (max-width: 900px) {
            .pos-left-top  { --dx: -220px; --dy: -120px; }
            .pos-left-bot  { --dx: -220px; --dy:  40px;  }
            .pos-right-top { --dx:  140px; --dy: -120px; }
            .pos-right-bot { --dx:  140px; --dy:  40px;  }
          }

          @media (max-width: 640px) {
            .community-section { min-height: 420px !important; background-size: cover !important; }
            .card-abs { position: static; transform: none; margin-left: auto; margin-right: auto; }
            .stack-gap > * + * { margin-top: 14px; }
          }
        `}</style>

        <div className="stack-gap mt-38 max-[640px]:mt-16">
          <div
            className="ml-38 mt-3 card-abs pos-left-top community-card card-grad-left text-white rounded-[20px] px-5 py-2
                       max-[640px]:ml-0 max-[640px]:mt-0 max-[640px]:rounded-[16px] max-[640px]:px-4 max-[640px]:py-[0.45rem]"
            style={{ maxWidth: 420 }}
          >
            <p
              className="m-0 text-[1.25rem] max-[640px]:text-[1.05rem]"
              style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.2px" }}
            >
              <span className="font-semibold">Dialogue:</span> ngobrol santai &amp; curhat bareng
            </p>
          </div>

          <div
            className="ml-37 mt-[-60px] card-abs pos-left-bot community-card card-grad-left text-white rounded-[20px] px-5 py-2
                       max-[640px]:ml-0 max-[640px]:mt-0 max-[640px]:rounded-[16px] max-[640px]:px-4 max-[640px]:py-[0.45rem]"
            style={{ maxWidth: 460 }}
          >
            <p
              className="m-0 text-[1.25rem] max-[640px]:text-[1.05rem]"
              style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.2px" }}
            >
              <span className="font-semibold">Debate:</span> debat sehat &amp; tukar pikiran
            </p>
          </div>

          <div
            className="ml-0 mt-[-15px] card-abs pos-right-top community-card card-grad-right text-white rounded-[20px] px-5 py-2
                       max-[640px]:ml-0 max-[640px]:mt-0 max-[640px]:rounded-[16px] max-[640px]:px-4 max-[640px]:py-[0.45rem]"
            style={{ maxWidth: 470 }}
          >
            <p
              className="m-0 text-[1.25rem] max-[640px]:text-[1.05rem]"
              style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.2px" }}
            >
              <span className="font-semibold">Reading:</span> rekomendasi buku, artikel, dan insight
            </p>
          </div>

          <div
            className="ml-[-23px] card-abs pos-right-bot community-card card-grad-right text-white rounded-[22px] px-6 py-4
                       max-[640px]:ml-0 max-[640px]:mt-0 max-[640px]:rounded-[18px] max-[640px]:px-5 max-[640px]:py-3"
            style={{ width: 300, maxWidth: "90vw" }}
          >
            <h2
              id="community-title"
              className="m-0 text-center mb-3 text-[1.6rem] max-[640px]:text-[1.3rem] max-[640px]:mb-2"
              style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.5px" }}
            >
              CHECK OUR COMMUNITY
            </h2>

            <div className="flex flex-col justify-center items-center gap-2 max-[640px]:gap-[0.45rem]">
              <a
                href="https://discord.gg/Q79ScExgG4"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Join our Discord"
                className="inline-flex items-center px-5 py-[0.55rem] border !border-white !rounded-4xl text-white transition-colors hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/60
                           max-[640px]:px-4 max-[640px]:py-[0.45rem]"
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "clamp(0.95rem, 4.2vw, 1.05rem)",
                  textDecoration: "none",
                }}
              >
                JOIN OUR DISCORD
                <img
                  src="/assets/icon/discord.svg"
                  alt=""
                  aria-hidden="true"
                  className="ml-2 h-5 w-5 max-[640px]:h-4 max-[640px]:w-4"
                />
              </a>

              <a
                href="https://ardhianzy.notion.site/ardhianzycommunity"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="See more event on Notion"
                className="mt-1 inline-flex items-center px-5 py-[0.55rem] border !border-white !rounded-4xl text-white transition-colors hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/60
                           max-[640px]:mt-0 max-[640px]:px-4 max-[640px]:py-[0.45rem]"
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "clamp(0.95rem, 4.2vw, 1.05rem)",
                  textDecoration: "none",
                }}
              >
                SEE MORE EVENT
                <img
                  src="/assets/icon/notion.svg"
                  alt=""
                  aria-hidden="true"
                  className="ml-2 h-5 w-5 max-[640px]:h-4 max-[640px]:w-4"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommunitySection;