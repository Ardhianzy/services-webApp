// src/features/layout/components/AppHeader.tsx
import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
// import UserProfile from "@/features/user/components/UserProfile";

interface AppHeaderProps {
  isLoggedIn?: boolean;
  handleLogout?: () => void;
}

type NavItem =
  | { kind: "route"; to: string; label: string }
  | { kind: "modal"; modal: "course" | "community"; label: string };

const YT_URL = "https://www.youtube.com/@ardhianzy/";
const DISCORD_URL = "https://discord.gg/Q79ScExgG4";
const MODAL_BG = "/assets/shop/bg/fine-photographics-bg.png";
const LOGO_ARDHIANZY = "/assets/icon/Ardhianzy_Logo_1.png";
const LOGO_YOUTUBE = "/assets/icon/youtube.png";
const LOGO_DISCORD = "/assets/icon/discord.png";

// saya comment, jaga-jaga kalau nanti dibutuhkan
// export default function AppHeader({ isLoggedIn, handleLogout }: AppHeaderProps) {
export default function AppHeader({ }: AppHeaderProps) {
  const NAV_ITEMS: NavItem[] = [
    { kind: "route", to: "/magazine", label: "MAGAZINE" },
    { kind: "route", to: "/research", label: "RESEARCH" },
    { kind: "modal", modal: "course", label: "COURSE" },
    { kind: "route", to: "/monologues", label: "MONOLOGUES" },
    { kind: "route", to: "/ReadingGuide", label: "READING GUIDE" },
    { kind: "route", to: "/IdeasTradition", label: "IDEAS & TRADITION" },
    { kind: "route", to: "/PopCultureReview", label: "POP-CULTURE REVIEW" },
    { kind: "route", to: "/shop", label: "SHOPS" },
    { kind: "modal", modal: "community", label: "COMMUNITY" },
  ];

  const [showCourse, setShowCourse] = useState(false);
  const [showCommunity, setShowCommunity] = useState(false);

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
        .secnav-link:hover { color: #4249CA !important; }
        @media (max-width: 1200px) { .secnav-link { font-size: 16px; } }
        @media (max-width: 960px)  { .secnav-link { font-size: 14px; } }

        @keyframes pdpFadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes pdpSlideUp { from { transform: translateY(20px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
        .pdp-fade-in { animation: pdpFadeIn .3s ease-out }
        .pdp-slide-up { animation: pdpSlideUp .4s ease-out }
      `}</style>

      <header
        className="w-full h-[72px] bg-black text-white flex justify-center items-center px-8 border-b border-[#222] box-border"
        role="banner"
      >
        <div className="flex justify-center">
          <Link to="/" className="flex items-center text-white no-underline" aria-label="Go to homepage">
            <img src="/assets/icon/Ardhianzy_Logo_2.png" alt="Ardhianzy Logo" className="w-10 h-auto mr-2" />
            <span
              className="text-white"
              style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "48px", letterSpacing: "1px" }}
            >
              ARDHIANZY
            </span>
          </Link>
        </div>
        {/* <div className="flex-1 flex justify-end items-center gap-4">
          {isLoggedIn ? (
            <UserProfile handleLogout={handleLogout} />
          ) : (
            <>
              <Link
                to="/signup"
                className="flex justify-center items-center h-[44px] px-[25px] rounded-[30px] no-underline transition-opacity duration-300"
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "18px",
                  fontWeight: 400,
                  backgroundColor: "#000000",
                  color: "#F5F5F5",
                  border: "1px solid #F5F5F5",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                SIGN UP
              </Link>
              <Link
                to="/login"
                className="flex justify-center items-center h-[44px] px-[25px] rounded-[30px] no-underline shadow-[0_0_10px_rgba(255,255,255,0.3)] transition-opacity duration-300"
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "18px",
                  fontWeight: 400,
                  backgroundColor: "#F5F5F5",
                  color: "#000000",
                  border: "1px solid #000000",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                LOG IN
              </Link>
            </>
          )}
        </div> */}
      </header>

      <nav
        className="w-full bg-white flex justify-center py-[10px]"
        style={{ boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}
        aria-label="Primary sections"
      >
        <ul className="flex list-none m-0 p-0 justify-center max-w-[1439px] w-full">
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
                  }}
                >
                  {item.label}
                </a>
              )}
            </li>
          ))}
        </ul>
      </nav>

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
          description="Join our Community to discuss episodes and texts, share notes, get feedback, and join reading circles, from Stoicism and dialectics to media critique and history. High-signal, welcoming, and learner-first."
          ctaLabel="Enter the Community"
          onCta={() => window.location.assign(DISCORD_URL)}
          logos={[
            { src: LOGO_ARDHIANZY, alt: "Ardhianzy" },
            { src: LOGO_DISCORD, alt: "Discord" },
          ]}
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
  ctaLabel: string;
  onCta: () => void;
  logos?: { src: string; alt: string }[];
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
          className="absolute top-4 right-8 inline-flex !h-9 !w-9 !items-center !justify-center !rounded-full border !border-white/40 hover:!border-transparent !bg-transparent text-xl leading-none transition hover:!bg-white/10"
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
              style={{ fontFamily: "'Roboto', sans-serif',", fontWeight: 700, fontSize: "16px", letterSpacing: "0.01em" }}
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
        </div>
      </div>
    </div>
  );
}