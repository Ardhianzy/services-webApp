// src/features/layout/components/AppHeader.tsx
import { Link, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
// import UserProfile from "@/features/user/components/UserProfile";

interface AppHeaderProps {
  isLoggedIn?: boolean;
  handleLogout?: () => void;
}

type NavItem =
  | { kind: "route"; to: string; label: string }
  | { kind: "modal"; modal: "course" | "community" | "shop"; label: string };

const YT_URL = "https://www.youtube.com/@ardhianzy/";
const DISCORD_URL = "https://discord.gg/Q79ScExgG4";
const MODAL_BG = "/assets/shop/bg/fine-photographics-bg.png";
const LOGO_ARDHIANZY = "/assets/icon/Ardhianzy_Logo_1.png";
const LOGO_YOUTUBE = "/assets/icon/youtube.png";
const LOGO_DISCORD = "/assets/icon/discord.png";

const SHOP_URL = "";

export default function AppHeader({}: AppHeaderProps) {
  const NAV_ITEMS: NavItem[] = [
    { kind: "route", to: "/magazine", label: "MAGAZINE" },
    { kind: "route", to: "/research", label: "RESEARCH" },
    { kind: "modal", modal: "course", label: "COURSE" },
    { kind: "route", to: "/monologues", label: "MONOLOGUES" },
    { kind: "route", to: "/ReadingGuide", label: "READING GUIDE" },
    // { kind: "route", to: "/IdeasTradition", label: "IDEAS & TRADITION" },
    // { kind: "route", to: "/PopCultureReview", label: "POPSOPHIA" },
    { kind: "modal", modal: "shop", label: "SHOPS" },
    { kind: "modal", modal: "community", label: "COMMUNITY" },
  ];

  const [showCourse, setShowCourse] = useState(false);
  const [showCommunity, setShowCommunity] = useState(false);
  const [showShop, setShowShop] = useState(false);

  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!mobileOpen) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [mobileOpen]);

  const openModal = (modal: "course" | "community" | "shop") => {
    setMobileOpen(false);
    if (modal === "course") setShowCourse(true);
    if (modal === "community") setShowCommunity(true);
    if (modal === "shop") setShowShop(true);
  };

  return (
    <div className="fixed top-0 left-0 w-full z-[1000]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');

        .secnav-link {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 18px;
          letter-spacing: 1px;
          color: #000000 !important;
          text-decoration: none;
          transition: color .3s ease;
        }
        @media (max-width: 1200px) { .secnav-link { font-size: 16px; } }
        @media (max-width: 960px)  { .secnav-link { font-size: 14px; } }

        @keyframes pdpFadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes pdpSlideUp { from { transform: translateY(20px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
        .pdp-fade-in { animation: pdpFadeIn .3s ease-out }
        .pdp-slide-up { animation: pdpSlideUp .4s ease-out }

        .secnav-mobile-title {
          font-family: 'Bebas Neue', sans-serif;
          letter-spacing: 1px;
          font-size: 18px;
          color: #000;
        }
        @media (max-width: 420px) {
          .secnav-mobile-title { font-size: 16px; }
        }

        .secnav-mobile-item {
          font-family: 'Bebas Neue', sans-serif;
          letter-spacing: 1px;
          font-size: 20px;
          color: #000;
          text-decoration: none;
        }
        @media (max-width: 420px) {
          .secnav-mobile-item { font-size: 18px; }
        }

        .appheader-wordmark {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 48px;
          letter-spacing: 1px;
          white-space: nowrap;
        }
        @media (max-width: 768px) {
          .appheader-wordmark { font-size: 40px !important; }
        }
        @media (max-width: 420px) {
          .appheader-wordmark { font-size: 34px !important; }
        }
      `}</style>

      <header
        className="w-full h-[72px] bg-black text-white flex justify-center items-center px-8 border-b border-[#222] box-border"
        role="banner"
      >
        <div className="flex justify-center">
          <Link to="/" className="flex items-center text-white no-underline" aria-label="Go to homepage">
            <img
              src="/assets/icon/Ardhianzy_Logo_2.png"
              alt="Ardhianzy Logo"
              className="w-[40px] h-auto mr-2 max-md:w-[36px] max-[420px]:w-[32px]"
            />
            <span
              className="text-white appheader-wordmark"
              style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "1px" }}
            >
              ARDHIANZY
            </span>
          </Link>
        </div>
      </header>

      <nav
        className="w-full bg-white flex justify-center py-[10px] relative"
        style={{ boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}
        aria-label="Primary sections"
      >
        <div className="md:hidden flex items-center justify-between w-full max-w-[1439px] px-4">
          <span className="secnav-mobile-title">EXPLORE</span>

          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
            className="inline-flex items-center justify-center h-10 w-10 rounded-md border border-black/10 bg-white text-black transition hover:bg-black/5"
          >
            <span className="relative block w-5 h-4">
              <span
                className={[
                  "absolute left-0 top-0 h-[2px] w-full bg-black transition-transform duration-200",
                  mobileOpen ? "translate-y-[7px] rotate-45" : "",
                ].join(" ")}
              />
              <span
                className={[
                  "absolute left-0 top-[7px] h-[2px] w-full bg-black transition-opacity duration-200",
                  mobileOpen ? "opacity-0" : "opacity-100",
                ].join(" ")}
              />
              <span
                className={[
                  "absolute left-0 bottom-0 h-[2px] w-full bg-black transition-transform duration-200",
                  mobileOpen ? "translate-y-[-7px] -rotate-45" : "",
                ].join(" ")}
              />
            </span>
          </button>
        </div>

        <ul className="hidden md:flex list-none m-0 p-0 justify-center max-w-[1439px] w-full">
          {NAV_ITEMS.map((item) => (
            <li key={item.label} className="mx-[15px] whitespace-nowrap">
              {item.kind === "route" ? (
                <NavLink to={item.to} className={({ isActive }) => ["secnav-link", isActive ? "active" : ""].join(" ")}>
                  {item.label}
                </NavLink>
              ) : (
                <a
                  href="#"
                  className="secnav-link"
                  onClick={(e) => {
                    e.preventDefault();
                    if (item.modal === "course") setShowCourse(true);
                    if (item.modal === "community") setShowCommunity(true);
                    if (item.modal === "shop") setShowShop(true);
                  }}
                >
                  {item.label}
                </a>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {mobileOpen && (
        <div className="fixed inset-0 z-[4002] md:hidden" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/70" onClick={() => setMobileOpen(false)} />
          <div className="absolute top-[72px] left-0 right-0 bg-white text-black border-t border-[#eee] shadow-[0_8px_30px_rgba(0,0,0,0.25)]">
            <div className="max-h-[calc(100vh-72px)] overflow-auto">
              <div className="flex items-center justify-between px-5 py-4 border-b border-[#eee]">
                <span className="secnav-mobile-title">MENU</span>
                <button
                  type="button"
                  aria-label="Close menu"
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-white text-xl leading-none transition hover:bg-black/5"
                >
                  <span className="block translate-y-[-1px]">×</span>
                </button>
              </div>

              <ul className="list-none m-0 p-0">
                {NAV_ITEMS.map((item) => (
                  <li key={`m-${item.label}`} className="border-b border-[#f0f0f0]">
                    {item.kind === "route" ? (
                      <NavLink
                        to={item.to}
                        onClick={() => setMobileOpen(false)}
                        className={({ isActive }) =>
                          ["block px-5 py-4", "secnav-mobile-item", isActive ? "bg-black/5" : "bg-white"].join(" ")
                        }
                      >
                        {item.label}
                      </NavLink>
                    ) : (
                      <button
                        type="button"
                        onClick={() => openModal(item.modal)}
                        className="w-full text-left block px-5 py-4 secnav-mobile-item bg-white hover:bg-black/5"
                      >
                        {item.label}
                      </button>
                    )}
                  </li>
                ))}
              </ul>

              <div className="px-5 py-4 text-[12px] text-black/60">Tap a section to navigate.</div>
            </div>
          </div>
        </div>
      )}

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
          onCta={() => window.location.assign(DISCORD_URL)}
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
    </div>
  );
}

type CtaModalProps = {
  onClose: () => void;
  backgroundUrl?: string;
  heading: string;
  subheading?: string;
  description: string;
  ctaLabel?: string;
  onCta?: () => void;
  logos?: { src: string; alt: string }[];
  showCta?: boolean;
};

function GenericCtaModal({
  onClose,
  backgroundUrl = "/assets/shop/bg/fine-photographics-bg.png",
  heading,
  subheading,
  description,
  ctaLabel,
  onCta,
  logos = [],
  showCta = true,
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
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "56px",
              lineHeight: 1,
              letterSpacing: "0.02em",
            }}
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
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "18px",
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
    </div>
  );
}