// src/components/common/Footer.tsx
import React, { useState } from "react";
import { Link } from "react-router-dom";

const YT_URL = "https://www.youtube.com/@ardhianzy/";
const COMMUNITY_URL = "https://ardhianzy.notion.site/ardhianzycommunity";
const MODAL_BG = "/assets/shop/bg/fine-photographics-bg.png";
const LOGO_ARDHIANZY = "/assets/icon/Ardhianzy_Logo_1.png";
const LOGO_YOUTUBE = "/assets/icon/youtube.png";
const LOGO_DISCORD = "/assets/icon/discord.png";

const SHOP_URL = "";

export const Footer: React.FC = () => {
  const [showCourse, setShowCourse] = useState(false);
  const [showCommunity, setShowCommunity] = useState(false);
  const [showShop, setShowShop] = useState(false);

  return (
    <footer className="bg-black text-white pt-[3rem] pb-[2rem] max-[768px]:pt-[2rem] max-[768px]:pb-[1.5rem]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue:wght@400&family=Roboto:wght@400;500;700&display=swap');

        .footer-link {
          font-family: 'Roboto', sans-serif;
          font-size: .9rem;
          color: #ccc;
          text-decoration: none;
          transition: color .2s ease;
          display: inline-block;
        }
        .footer-link:hover { color: #00aaff; }

        .footer-social {
          width: 32px; height: 32px;
          display: flex; align-items: center; justify-content: center;
          background: rgba(255,255,255,.1);
          border-radius: 50%;
          transition: background .2s ease;
        }
        .footer-social:hover { background: rgba(0,170,255,.2); }

        @media (max-width: 1024px) {
          .footer-container { flex-direction: column; gap: 3rem; }
          .footer-links { width: 100%; justify-content: space-between; }
          .footer-logo { width: 100%; margin: 0 !important; }
        }
        @media (max-width: 768px) {
          .footer-links { flex-direction: column; gap: 2rem; }
          .footer-col { width: 100%; }

          .footer-link { font-size: .82rem; }
          .footer-social { width: 28px; height: 28px; }
        }
      `}</style>

      <div className="footer-container max-w-[1400px] mx-auto px-8 max-[768px]:px-5 flex items-start justify-between">
        <div
          className="footer-logo flex flex-col items-start shrink-0"
          style={{ marginTop: "120px", marginRight: "0px", marginBottom: "0px", marginLeft: "150px" }}
        >
          <img
            src="/assets/icon/Ardhianzy_Logo_2.png"
            alt="Ardhianzy Logo"
            className="w-[150px] max-[768px]:w-[120px] h-auto object-contain mb-4 max-[768px]:mb-3"
          />
        </div>

        <div className="footer-links flex gap-[6rem] flex-1 justify-end pl-[4rem] max-[768px]:pl-0">
          <div className="footer-col text-left">
            <h4
              className="text-white mb-4 max-[768px]:mb-3"
              style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.25rem" }}
            >
              INSIDE ARDHIANZY
            </h4>
            <ul className="list-none p-0 m-0">
              <li className="mb-3 text-left max-[768px]:mb-2">
                <Link to="/magazine" className="footer-link">Magazine</Link>
              </li>
              <li className="mb-3 text-left max-[768px]:mb-2">
                <Link to="/research" className="footer-link">Research</Link>
              </li>
              <li className="mb-3 text-left max-[768px]:mb-2">
                <a
                  href="/"
                  onClick={(e) => { e.preventDefault(); setShowCourse(true); }}
                  className="footer-link"
                >
                  Course
                </a>
              </li>
              <li className="mb-3 text-left max-[768px]:mb-2">
                <Link to="/monologues" className="footer-link">Monologues</Link>
              </li>
              <li className="mb-3 text-left max-[768px]:mb-2">
                <Link to="/ReadingGuide" className="footer-link">Reading Guide</Link>
              </li>
              <li className="mb-3 text-left max-[768px]:mb-2">
                <Link to="/IdeasTradition" className="footer-link">Ideas & Tradition</Link>
              </li>
              <li className="mb-3 text-left max-[768px]:mb-2">
                <Link to="/PopCultureReview" className="footer-link">Pop-Culture Review</Link>
              </li>
              <li className="mb-3 text-left max-[768px]:mb-2">
                <a
                  href="/"
                  onClick={(e) => { e.preventDefault(); setShowShop(true); }}
                  className="footer-link"
                >
                  Shops
                </a>
              </li>
              <li className="mb-3 text-left max-[768px]:mb-2">
                <a
                  href="/"
                  onClick={(e) => { e.preventDefault(); setShowCommunity(true); }}
                  className="footer-link"
                >
                  Community
                </a>
              </li>
            </ul>
          </div>

          <div className="footer-col text-left">
            <h4
              className="text-white mb-4 max-[768px]:mb-3"
              style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.25rem" }}
            >
              CUSTOMER CARE
            </h4>
            <ul className="list-none p-0 m-0">
              <li className="mb-3 text-left max-[768px]:mb-2"><a href="#terms" className="footer-link">Term & Condition</a></li>
              <li className="mb-3 text-left max-[768px]:mb-2"><a href="#privacy" className="footer-link">Privacy Policy</a></li>
              <li className="mb-3 text-left max-[768px]:mb-2"><a href="#faqs" className="footer-link">FAQs</a></li>
            </ul>
          </div>

          <div className="footer-col text-left">
            <h4
              className="text-white mb-4 max-[768px]:mb-3"
              style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.25rem" }}
            >
              GET IN TOUCH
            </h4>

            <ul className="list-none p-0 m-0">
              <li className="mb-3 text-left max-[768px]:mb-2">
                <p className="footer-link">Contact Us</p>
              </li>
            </ul>

            <div className="mt-6 flex gap-4 items-center flex-wrap max-[768px]:mt-4 max-[768px]:gap-3">
              {[
                ["https://www.youtube.com/@ardhianzy/", "/assets/icon/youtube.svg", "YouTube"],
                ["instagram.com/ardhianzy", "/assets/icon/instagram.svg", "Instagram"],
                ["discord.gg/Q79ScExgG4", "/assets/icon/discord.svg", "Discord"],
                ["tiktok.com/@ardhianzy", "/assets/icon/tiktok.svg", "TikTok"],
                ["https://www.linkedin.com/company/ardhianzy/", "/assets/icon/linkedin.svg", "LinkedIn"],
                ["businesswithardhianzy@gmail.com", "/assets/icon/gmail.svg", "Email"],
              ].map(([href, src, label]) => (
                <a key={label} href={href} aria-label={label} className="footer-social">
                  <img
                    src={src}
                    alt={label}
                    className="w-[18px] h-[18px] max-[768px]:w-[16px] max-[768px]:h-[16px]"
                    style={{ filter: "brightness(0) invert(1)" }}
                  />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showCourse && (
        <GenericCtaModal
          onClose={() => setShowCourse(false)}
          backgroundUrl={MODAL_BG}
          heading="ARDHIANZY COURSES"
          subheading="Think clearly. Read deeply. Create rigorously."
          description="Study philosophy and history through cinematic, tightly-edited lessons: Philosophy 101–102, Dialectica, Stoicism, Kritik, Logobiography, Historia, and more. Structured playlists, primary sources, and practical exercises. So, big ideas become tools you can use."
          ctaLabel="Start Learning on YouTube"
          onCta={() => window.location.assign(YT_URL)}
          logos={[
            { src: LOGO_ARDHIANZY, alt: "Ardhianzy" },
            { src: LOGO_YOUTUBE, alt: "YouTube" },
          ]}
        />
      )}

      {showCommunity && (
        <GenericCtaModal
          onClose={() => setShowCommunity(false)}
          backgroundUrl={MODAL_BG}
          heading="JOIN THE ARDHIANZY COMMUNITY"
          subheading="Conversations for people who love ideas."
          description="Belajar filsafat dari nol! Filsafat berasal dari bahasa Yunani, yang melalui bahasa latin, philosophia, kalau diterjemahkan artinya cinta terhadap kebijaksanaan. Perjalanan 'dari nol' ini akan lebih seru jika dilakukan bersama. Bergabunglah dengan komunitas kami untuk bertukar pikiran!"
          ctaLabel="Enter the Community"
          onCta={() => window.location.assign(COMMUNITY_URL)}
          logos={[
            { src: LOGO_ARDHIANZY, alt: "Ardhianzy" },
            { src: LOGO_DISCORD, alt: "Discord" },
          ]}
        />
      )}

      {showShop && (
        <GenericCtaModal
          onClose={() => setShowShop(false)}
          backgroundUrl={MODAL_BG}
          {...(!SHOP_URL
            ? {
                heading: "The Official Ardhianzy Store is Launching Soon.",
                subheading: "We look forward to welcoming you soon.",
                description:
                  "Our official online store is currently under construction. We are carefully preparing our products to ensure the best quality and experience.",
                showCta: false,
              }
            : {
                heading: "Shop the Official Ardhianzy Collection",
                subheading: "Explore our exclusive collection, curated just for you.",
                description:
                  "We are pleased to offer our complete range of products online. Browse our categories and find your new favorites today.",
                ctaLabel: "Shop Now!",
                onCta: () => window.location.assign(SHOP_URL),
                showCta: true,
              })}
          logos={[{ src: LOGO_ARDHIANZY, alt: "Ardhianzy" }]}
        />
      )}
    </footer>
  );
};

type CtaModalProps = {
  onClose: () => void;
  backgroundUrl?: string;
  heading: string;
  subheading?: string;
  description: string;
  showCta?: boolean;
  ctaLabel?: string;
  onCta?: () => void;
  logos?: { src: string; alt: string }[];
};

function GenericCtaModal({
  onClose,
  backgroundUrl = MODAL_BG,
  heading,
  subheading,
  description,
  showCta = true,
  ctaLabel,
  onCta,
  logos = [],
}: CtaModalProps) {
  const bgStyle: React.CSSProperties = backgroundUrl
    ? {
        backgroundColor: "#000",
        backgroundImage: `url('${backgroundUrl}')`,
        backgroundBlendMode: "luminosity",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }
    : { backgroundColor: "#000" };

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/85 backdrop-blur-[8px] pdp-fade-in"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="pdp-slide-up relative mx-4 w-[82%] max-w-[980px] rounded-md p-10 text-white flex gap-10 max-lg:flex-col max-lg:gap-8 max-[768px]:p-6 max-[768px]:gap-6"
        style={bgStyle}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-4 right-8 max-[768px]:right-4 inline-flex !h-9 !w-9 !items-center !justify-center !rounded-full border !border-white/40 hover:!border-transparent !bg-transparent text-xl leading-none transition hover:bg-[#151515] cursor-pointer"
        >
          <span className="block translate-x-[-0.5px] !text-white">×</span>
        </button>

        <div className="flex-1 flex flex-col justify-center">
          {!!logos.length && (
            <div className="mb-6 max-[768px]:mb-4 flex items-center gap-4 max-[768px]:gap-3">
              {logos.map((l, i) => (
                <img
                  key={i}
                  src={l.src}
                  alt={l.alt}
                  className="h-10 max-[768px]:h-8 w-auto object-contain opacity-90"
                  onError={(e) => ((e.currentTarget.style.display = "none"))}
                />
              ))}
            </div>
          )}

          <h2
            className="m-0 text-[#F5F5F5]"
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(34px, 6vw, 56px)",
              lineHeight: 1,
              letterSpacing: "0.02em",
            }}
          >
            {heading}
          </h2>

          {subheading ? (
            <p
              className="mt-2 mb-6 max-[768px]:mb-4 text-[#F5F5F5]"
              style={{
                fontFamily: "'Roboto', sans-serif",
                fontWeight: 700,
                fontSize: "clamp(14px, 2.2vw, 16px)",
                letterSpacing: "0.01em",
              }}
            >
              {subheading}
            </p>
          ) : null}

          <p
            className="mb-8 max-[768px]:mb-6 max-w-[640px] text-[#F5F5F5]"
            style={{
              fontFamily: "'Roboto', sans-serif",
              fontSize: "clamp(13px, 2.1vw, 14px)",
              lineHeight: 1.5,
            }}
          >
            {description}
          </p>

          {showCta && ctaLabel && onCta ? (
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={onCta}
                className="inline-flex items-center justify-center gap-[8px] !rounded-[30px] border !border-[#F5F5F5] px-[26px] py-[14px] max-[768px]:px-[20px] max-[768px]:py-[12px] !text-[#F5F5F5] transition-colors hover:!border-black hover:!bg-[#F5F5F5] hover:!text-black"
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "clamp(16px, 2.6vw, 18px)",
                  lineHeight: "22px",
                  letterSpacing: "0.02em",
                }}
              >
                {ctaLabel} <span>&rarr;</span>
              </button>
            </div>
          ) : null}
        </div>
      </div>

      <style>{`
        @keyframes pdpFadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes pdpSlideUp { from { transform: translateY(20px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
        .pdp-fade-in { animation: pdpFadeIn .3s ease-out }
        .pdp-slide-up { animation: pdpSlideUp .4s ease-out }
      `}</style>
    </div>
  );
}