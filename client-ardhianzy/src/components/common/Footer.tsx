// src/components/common/Footer.tsx
import React from "react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-white pt-[3rem] pb-[2rem]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue:wght@400&family=Roboto:wght@400;500;700&display=swap');

        /* Hover link & ikon disetarakan dengan CSS lama */
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

        /* Responsif: mengikuti Footer.css lama */
        @media (max-width: 1024px) {
          .footer-container { flex-direction: column; gap: 3rem; }
          .footer-links { width: 100%; justify-content: space-between; }
          .footer-logo { width: 100%; margin: 0 !important; }
        }
        @media (max-width: 768px) {
          .footer-links { flex-direction: column; gap: 2rem; }
          .footer-col { width: 100%; }
        }
      `}</style>

      <div className="footer-container max-w-[1400px] mx-auto px-8 flex items-start justify-between">
        <div
          className="footer-logo flex flex-col items-start shrink-0"
          style={{
            marginTop: "120px",
            marginRight: "0px",
            marginBottom: "0px",
            marginLeft: "150px",
          }}
        >
          <img
            src="/assets/icon/Ardhianzy_Logo_2.png"
            alt="Ardhianzy Logo"
            className="w-[150px] h-auto object-contain mb-4"
          />
          {/* Optional tagline (disiapkan seperti di CSS lama) */}
          {/* <p className="text-[#ccc] text-[0.85rem] leading-[1.4]" style={{ fontFamily: "'Roboto', sans-serif", maxWidth: 200, margin: 0 }}>
            Your tagline...
          </p> */}
        </div>

        <div className="footer-links flex gap-[6rem] flex-1 justify-end pl-[4rem]">
          <div className="footer-col text-left">
            <h4
              className="text-white mb-4"
              style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.25rem" }}
            >
              INSIDE ARDHIANZY
            </h4>
            <ul className="list-none p-0 m-0">
              {[
                ["#magazine", "Magazine"],
                ["#research", "Research"],
                ["#course", "Course"],
                ["#monologues", "Monologues"],
                ["#reading-guide", "Reading Guide"],
                ["#ideas", "Ideas & Tradition"],
                ["#pop-culture", "Pop-Culture Review"],
                ["#shops", "Shops"],
                ["#community", "Community"],
              ].map(([href, label]) => (
                <li key={href} className="mb-3 text-left">
                  <a href={href} className="footer-link">{label}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-col text-left">
            <h4
              className="text-white mb-4"
              style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.25rem" }}
            >
              CUSTOMER CARE
            </h4>
            <ul className="list-none p-0 m-0">
              {[
                ["#terms", "Term & Condition"],
                ["#privacy", "Privacy Policy"],
                ["#faqs", "FAQs"],
              ].map(([href, label]) => (
                <li key={href} className="mb-3 text-left">
                  <a href={href} className="footer-link">{label}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-col text-left">
            <h4
              className="text-white mb-4"
              style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.25rem" }}
            >
              GET IN TOUCH
            </h4>

            <ul className="list-none p-0 m-0">
              <li className="mb-3 text-left">
                <a href="#contact" className="footer-link">Contact Us</a>
              </li>
            </ul>

            <div className="mt-6 flex gap-4 items-center flex-wrap">
              {[
                ["https://youtube.com", "/assets/icon/youtube.svg", "YouTube"],
                ["https://instagram.com", "/assets/icon/instagram.svg", "Instagram"],
                ["https://discord.com", "/assets/icon/discord.svg", "Discord"],
                ["https://tiktok.com", "/assets/icon/tiktok.svg", "TikTok"],
                ["https://linkedin.com", "/assets/icon/linkedin.svg", "LinkedIn"],
                ["mailto:info@example.com", "/assets/icon/gmail.svg", "Email"],
              ].map(([href, src, label]) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="footer-social"
                >
                  <img
                    src={src}
                    alt={label}
                    className="w-[18px] h-[18px]"
                    style={{ filter: "brightness(0) invert(1)" }}
                  />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Optional: footer-bottom (di CSS lama ada stylingnya, tapi JSX lamanya tidak menampilkan) */}
      {/* <div className="max-w-[1400px] mx-auto mt-[3rem] px-8 pt-8 border-t border-white/10 text-left">
        <p className="m-0 text-[#888]" style={{ fontFamily: "'Roboto', sans-serif", fontSize: ".85rem" }}>
          © 2025 Ardhianzy. All rights reserved.
        </p>
      </div> */}
    </footer>
  );
};