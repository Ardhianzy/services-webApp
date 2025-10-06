import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

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
  { kind: "route", to: "/PopCultureReview", label: "POP-CULTURE REVIEW" },
  { kind: "route", to: "/shop", label: "SHOPS" },
  { kind: "hash",  href: "#community", label: "COMMUNITY" },
];

export default function SectionNavLinks() {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const sect = document.getElementById("section1");

    const computeSticky = () => {
      if (!sect) {
        setIsSticky(false);
        return;
      }
      const bottom = sect.offsetTop + sect.offsetHeight;
      setIsSticky(window.scrollY > bottom - 20);
    };

    computeSticky();
    window.addEventListener("scroll", computeSticky, { passive: true });
    window.addEventListener("resize", computeSticky);
    return () => {
      window.removeEventListener("scroll", computeSticky);
      window.removeEventListener("resize", computeSticky);
    };
  }, []);

  const baseLink =
    "text-black no-underline font-['Bebas Neue'] tracking-[1px] transition-colors duration-300 hover:text-[#555] " +
    "text-[18px] max-[1200px]:text-[16px] max-[960px]:text-[14px]";
  const itemSpacing = "mx-[15px] max-[1200px]:mx-[10px] max-[960px]:mx-[8px] whitespace-nowrap";

  return (
    <nav
      aria-label="Section navigation"
      className={[
        "w-full bg-white flex justify-center z-[999] py-[10px]",
        isSticky ? "fixed top-[72px] border-t border-[#eee]" : "absolute",
      ].join(" ")}
      style={{ boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)" }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');`}</style>

      <ul className="flex list-none m-0 p-0 justify-center max-w-[1439px] w-full">
        {NAV_ITEMS.map((item) => (
          <li key={item.label} className={itemSpacing}>
            {item.kind === "route" ? (
              <NavLink
                to={item.to}
                className={({ isActive }) => [baseLink, isActive ? "active" : ""].join(" ")}
              >
                {item.label}
              </NavLink>
            ) : (
              <a href={item.href} className={baseLink}>
                {item.label}
              </a>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}