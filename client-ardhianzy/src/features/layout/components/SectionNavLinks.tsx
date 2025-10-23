// src/features/layout/components/SectionNavLinks.tsx
import { useEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

type NavItem =
  | { kind: "route"; to: string; label: string }
  | { kind: "hash"; href: string; label: string };

const NAV_ITEMS: NavItem[] = [
  { kind: "route", to: "/magazine", label: "MAGAZINE" },
  { kind: "route", to: "/research", label: "RESEARCH" },
  { kind: "hash",  href: "#course", label: "COURSE" },
  { kind: "route", to: "/monologues", label: "MONOLOGUES" },
  { kind: "route", to: "/ReadingGuide", label: "READING GUIDE" },
  { kind: "route", to: "/IdeasTradition", label: "IDEAS & TRADITION" },
  { kind: "route", to: "/PopCultureReview", label: "POPSHOPIA" },
  { kind: "route", to: "/shop", label: "SHOPS" },
  { kind: "hash",  href: "#community", label: "COMMUNITY" },
];

const HOME_SECTION_MAP: Record<string, string> = {
  "/magazine": "magazine",
  "/research": "research",
  "/monologues": "monologues",
  "/ReadingGuide": "reading-guide",
  "/reading-guide": "reading-guide",
  "/IdeasTradition": "ideas",
  "/ideas-tradition": "ideas",
  "/PopCultureReview": "popshopia",
  "/pop-culture-review": "popshopia",
  "/shop": "shops",
};

export default function SectionNavLinks() {
  const navRef = useRef<HTMLElement>(null);
  const { pathname, hash } = useLocation();
  const isHome = pathname === "/";

  const [isStuck, setIsStuck] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const mainNav = document.querySelector<HTMLElement>('nav[role="navigation"]');
      const mainH = mainNav?.offsetHeight ?? 0;
      const top = navRef.current?.getBoundingClientRect().top ?? Infinity;
      setIsStuck(top <= mainH + 0.5);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const getOverlayHeight = () => {
    const mainNav = document.querySelector<HTMLElement>('nav[role="navigation"]');
    const mainH   = mainNav?.offsetHeight ?? 0;
    const stuck   = (() => {
      if (!navRef.current) return false;
      const top = navRef.current.getBoundingClientRect().top;
      return top <= mainH + 0.5;
    })();
    const secH    = stuck ? (navRef.current?.offsetHeight ?? 0) : 0;
    return mainH + secH;
  };

  const scrollToIdCentered = (id: string, behavior: ScrollBehavior = "smooth") => {
    const el = document.getElementById(id);
    if (!el) return;

    const overlay = getOverlayHeight();
    const areaH = window.innerHeight - overlay;

    const rect = el.getBoundingClientRect();
    const topDoc = rect.top + window.scrollY;
    const elH = rect.height;

    const targetY = topDoc - overlay + (elH - areaH) / 2;

    window.scrollTo({
      top: Math.max(0, Math.min(targetY, document.body.scrollHeight)),
      behavior,
    });
  };

  const onHashClick: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
    const href = (e.currentTarget.getAttribute("href") || "").trim();
    if (!href.startsWith("#")) return;
    const id = href.slice(1);
    e.preventDefault();
    sessionStorage.setItem("lastHomeSection", id);
    history.pushState(null, "", href);
    scrollToIdCentered(id);
  };

  const onHomeRouteClick = (e: React.MouseEvent, routePath: string) => {
    if (!isHome) return;
    const targetId = HOME_SECTION_MAP[routePath];
    if (!targetId) return;
    e.preventDefault();
    sessionStorage.setItem("lastHomeSection", targetId);
    history.pushState(null, "", `#${targetId}`);
    scrollToIdCentered(targetId);
  };

  useEffect(() => {
    if (!isHome) return;
    const idFromHash = (hash || "").replace(/^#/, "");
    const last = sessionStorage.getItem("lastHomeSection") || "";
    const targetId = idFromHash || last;
    if (!targetId) return;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        scrollToIdCentered(targetId, "auto");
      });
    });
  }, [isHome, hash]);

  useEffect(() => {
    if (!isHome) return;
    const onHashChange = () => {
      const id = location.hash.replace("#", "");
      if (id) {
        sessionStorage.setItem("lastHomeSection", id);
        scrollToIdCentered(id);
      }
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [isHome]);

  const itemSpacing =
    "mx-[15px] max-[1200px]:mx-[10px] max-[960px]:mx-[8px] whitespace-nowrap";

  return (
    <nav
      ref={navRef}
      aria-label="Section navigation"
      className={[
        "w-full bg-white flex justify-center z-[999] py-[10px]",
        "sticky top-[72px]",
        isStuck ? "border-t border-[#eee]" : "",
      ].join(" ")}
      style={{ boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)" }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');`}</style>

      <style>{`
        .secnav-link {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 18px;
          letter-spacing: 1px;
          color: #000000;
          text-decoration: none;
          transition: color .3s ease;
        }
        .secnav-link:hover { color: #4249CA !important; }
        @media (max-width: 1200px) { .secnav-link { font-size: 16px; } }
        @media (max-width: 960px)  { .secnav-link { font-size: 14px; } }
      `}</style>

      <ul className="flex list-none m-0 p-0 justify-center max-w-[1439px] w-full">
        {NAV_ITEMS.map((item) => (
          <li key={item.label} className={itemSpacing}>
            {isHome && item.kind === "route" ? (
              HOME_SECTION_MAP[item.to] ? (
                <a
                  href={`#${HOME_SECTION_MAP[item.to]}`}
                  className="secnav-link"
                  onClick={(e) => onHomeRouteClick(e, item.to)}
                >
                  {item.label}
                </a>
              ) : (
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    ["secnav-link", isActive ? "active" : ""].join(" ")
                  }
                >
                  {item.label}
                </NavLink>
              )
            ) : item.kind === "route" ? (
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  ["secnav-link", isActive ? "active" : ""].join(" ")
                }
              >
                {item.label}
              </NavLink>
            ) : (
              <a href={item.href} className="secnav-link" onClick={onHashClick}>
                {item.label}
              </a>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}