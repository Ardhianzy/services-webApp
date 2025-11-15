// src/features/layout/components/SiteFooter.tsx
import React, { useState } from "react";
import { Link } from "react-router-dom";

const YT_URL = "https://www.youtube.com/@ardhianzy/";
const COMMUNITY_URL = "https://ardhianzy.notion.site/ardhianzycommunity";
const MODAL_BG = "/assets/shop/bg/fine-photographics-bg.png";
const LOGO_ARDHIANZY = "/assets/icon/Ardhianzy_Logo_1.png";
const LOGO_YOUTUBE = "/assets/icon/youtube.png";
const LOGO_DISCORD = "/assets/icon/discord.png";

const SHOP_URL = "";

export default function SiteFooter() {
  const [showCourse, setShowCourse] = useState(false);
  const [showCommunity, setShowCommunity] = useState(false);
  const [showShop, setShowShop] = useState(false);

  return (
    <footer className="bg-black text-white py-12">
      <div className="mx-auto max-w-[1400px] px-8 flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex-shrink-0 flex flex-col items-start ml-0 mt-0 lg:ml-[150px] lg:mt-[120px]">
          <img
            src="/assets/icon/Ardhianzy_Logo 2.png"
            alt="Ardhianzy Logo"
            className="w-[150px] h-auto object-contain mb-4"
          />
        </div>

        <div className="w-full lg:flex-1 lg:justify-end lg:pl-16 flex flex-col gap-8 lg:flex-row lg:gap-24">
          <div className="text-left">
            <h4 className="font-['Bebas Neue'] text-[1.25rem] mb-4">INSIDE ARDHIANZY</h4>
            <ul className="list-none m-0 p-0 space-y-3">
              <li><Link to="/magazine"         className="text-[#ccc] no-underline transition-colors hover:text-[#00aaff] inline-block">Magazine</Link></li>
              <li><Link to="/research"          className="text-[#ccc] no-underline transition-colors hover:text-[#00aaff] inline-block">Research</Link></li>
              <li>
                <a
                  href="/"
                  onClick={(e) => { e.preventDefault(); setShowCourse(true); }}
                  className="text-[#ccc] no-underline transition-colors hover:text-[#00aaff] inline-block"
                >
                  Course
                </a>
              </li>
              <li><Link to="/monologues"        className="text-[#ccc] no-underline transition-colors hover:text-[#00aaff] inline-block">Monologues</Link></li>
              <li><Link to="/ReadingGuide"      className="text-[#ccc] no-underline transition-colors hover:text-[#00aaff] inline-block">Reading Guide</Link></li>
              <li><Link to="/IdeasTradition"    className="text-[#ccc] no-underline transition-colors hover:text-[#00aaff] inline-block">Ideas & Tradition</Link></li>
              <li><Link to="/PopCultureReview"  className="text-[#ccc] no-underline transition-colors hover:text-[#00aaff] inline-block">Pop-Culture Review</Link></li>
              <li>
                <a
                  href="/"
                  onClick={(e) => { e.preventDefault(); setShowShop(true); }}
                  className="text-[#ccc] no-underline transition-colors hover:text-[#00aaff] inline-block"
                >
                  Shops
                </a>
              </li>
              <li>
                <a
                  href="/"
                  onClick={(e) => { e.preventDefault(); setShowCommunity(true); }}
                  className="text-[#ccc] no-underline transition-colors hover:text-[#00aaff] inline-block"
                >
                  Community
                </a>
              </li>
            </ul>
          </div>

          <div className="text-left">
            <h4 className="font-['Bebas Neue'] text-[1.25rem] mb-4">CUSTOMER CARE</h4>
            <ul className="list-none m-0 p-0 space-y-3">
              <li><a href="#terms"   className="text-[#ccc] no-underline transition-colors hover:text-[#00aaff] inline-block">Term & Condition</a></li>
              <li><a href="#privacy" className="text-[#ccc] no-underline transition-colors hover:text-[#00aaff] inline-block">Privacy Policy</a></li>
              <li><a href="#faqs"    className="text-[#ccc] no-underline transition-colors hover:text-[#00aaff] inline-block">FAQs</a></li>
            </ul>
          </div>

          <div className="text-left">
            <h4 className="font-['Bebas Neue'] text-[1.25rem] mb-4">GET IN TOUCH</h4>
            <ul className="list-none m-0 p-0">
              <li className="mb-3">
                <a href="#contact" className="text-[#ccc] no-underline transition-colors hover:text-[#00aaff] inline-block">
                  Contact Us
                </a>
              </li>
            </ul>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <a href="https://youtube.com"   aria-label="YouTube"   className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center transition-colors hover:bg-[rgba(0,170,255,0.2)]"><img src="/assets/icon/youtube.svg"  alt="YouTube"  className="w-[18px] h-[18px] filter invert" /></a>
              <a href="https://instagram.com" aria-label="Instagram" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center transition-colors hover:bg-[rgba(0,170,255,0.2)]"><img src="/assets/icon/instagram.svg" alt="Instagram" className="w-[18px] h-[18px] filter invert" /></a>
              <a href="https://discord.com"   aria-label="Discord"   className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center transition-colors hover:bg-[rgba(0,170,255,0.2)]"><img src="/assets/icon/discord.svg"  alt="Discord"  className="w-[18px] h-[18px] filter invert" /></a>
              <a href="https://tiktok.com"    aria-label="TikTok"    className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center transition-colors hover:bg-[rgba(0,170,255,0.2)]"><img src="/assets/icon/tiktok.svg"   alt="TikTok"   className="w-[18px] h-[18px] filter invert" /></a>
              <a href="https://linkedin.com"  aria-label="LinkedIn"  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center transition-colors hover:bg-[rgba(0,170,255,0.2)]"><img src="/assets/icon/linkeind.svg" alt="LinkedIn" className="w-[18px] h-[18px] filter invert" /></a>
              <a href="mailto:info@example.com" aria-label="Email"   className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center transition-colors hover:bg-[rgba(0,170,255,0.2)]"><img src="/assets/icon/gmail.svg"    alt="Email"    className="w-[18px] h-[18px] filter invert" /></a>
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
}

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
        className="pdp-slide-up relative mx-4 w-[82%] max-w-[980px] rounded-md p-10 text-white flex gap-10 max-lg:flex-col max-lg:gap-8"
        style={bgStyle}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-4 right-8 inline-flex !h-9 !w-9 !items-center !justify-center !rounded-full border !border-white/40 hover:!border-transparent !bg-transparent text-xl leading-none transition hover:bg-[#151515] cursor-pointer"
        >
          <span className="block translate-x-[-0.5px] !text-white">×</span>
        </button>

        <div className="flex-1 flex flex-col justify-center">
          {!!logos.length && (
            <div className="mb-6 flex items-center gap-4">
              {logos.map((l, i) => (
                <img
                  key={i}
                  src={l.src}
                  alt={l.alt}
                  className="h-10 w-auto object-contain opacity-90"
                  onError={(e) => ((e.currentTarget.style.display = "none"))}
                />
              ))}
            </div>
          )}

          <h2
            className="m-0 text-[#F5F5F5]"
            style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "56px", lineHeight: 1, letterSpacing: "0.02em" }}
          >
            {heading}
          </h2>

          {subheading ? (
            <p
              className="mt-2 mb-6 text-[#F5F5F5]"
              style={{ fontFamily: "'Roboto', sans-serif", fontWeight: 700, fontSize: "16px", letterSpacing: "0.01em" }}
            >
              {subheading}
            </p>
          ) : null}

          <p
            className="mb-8 max-w-[640px] text-[#F5F5F5]"
            style={{ fontFamily: "'Roboto', sans-serif", fontSize: "14px", lineHeight: 1.5 }}
          >
            {description}
          </p>

          {showCta && ctaLabel && onCta ? (
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={onCta}
                className="inline-flex items-center justify-center gap-[8px] !rounded-[30px] border !border-[#F5F5F5] px-[26px] py-[14px] !text-[#F5F5F5] transition-colors hover:!border-black hover:!bg-[#F5F5F5] hover:!text-black"
                style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "18px", lineHeight: "22px", letterSpacing: "0.02em" }}
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