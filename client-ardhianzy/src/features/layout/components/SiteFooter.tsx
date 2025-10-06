export default function SiteFooter() {
  return (
    <footer className="bg-black text-white py-12">
      <div className="mx-auto max-w-[1400px] px-8 flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between">
        {/* Logo */}
        <div className="flex-shrink-0 flex flex-col items-start ml-0 mt-0 lg:ml-[150px] lg:mt-[120px]">
          <img
            src="/assets/icon/Ardhianzy_Logo 2.png"
            alt="Ardhianzy Logo"
            className="w-[150px] h-auto object-contain mb-4"
          />
          {/* (Opsional tagline di desain lama bersifat optional; dikosongkan agar 1:1) */}
        </div>

        {/* Links */}
        <div className="w-full lg:flex-1 lg:justify-end lg:pl-16 flex flex-col gap-8 lg:flex-row lg:gap-24">
          {/* Column 1 */}
          <div className="text-left">
            <h4 className="font-['Bebas Neue'] text-[1.25rem] mb-4">INSIDE ARDHIANZY</h4>
            <ul className="list-none m-0 p-0 space-y-3">
              <li><a href="#magazine" className="text-[#ccc] no-underline transition-colors hover:text-[#00aaff] inline-block">Magazine</a></li>
              <li><a href="#research" className="text-[#ccc] no-underline transition-colors hover:text-[#00aaff] inline-block">Research</a></li>
              <li><a href="#course" className="text-[#ccc] no-underline transition-colors hover:text-[#00aaff] inline-block">Course</a></li>
              <li><a href="#monologues" className="text-[#ccc] no-underline transition-colors hover:text-[#00aaff] inline-block">Monologues</a></li>
              <li><a href="#reading-guide" className="text-[#ccc] no-underline transition-colors hover:text-[#00aaff] inline-block">Reading Guide</a></li>
              <li><a href="#ideas" className="text-[#ccc] no-underline transition-colors hover:text-[#00aaff] inline-block">Ideas & Tradition</a></li>
              <li><a href="#pop-culture" className="text-[#ccc] no-underline transition-colors hover:text-[#00aaff] inline-block">Pop-Culture Review</a></li>
              <li><a href="#shops" className="text-[#ccc] no-underline transition-colors hover:text-[#00aaff] inline-block">Shops</a></li>
              <li><a href="#community" className="text-[#ccc] no-underline transition-colors hover:text-[#00aaff] inline-block">Community</a></li>
            </ul>
          </div>

          {/* Column 2 */}
          <div className="text-left">
            <h4 className="font-['Bebas Neue'] text-[1.25rem] mb-4">CUSTOMER CARE</h4>
            <ul className="list-none m-0 p-0 space-y-3">
              <li><a href="#terms" className="text-[#ccc] no-underline transition-colors hover:text-[#00aaff] inline-block">Term & Condition</a></li>
              <li><a href="#privacy" className="text-[#ccc] no-underline transition-colors hover:text-[#00aaff] inline-block">Privacy Policy</a></li>
              <li><a href="#faqs" className="text-[#ccc] no-underline transition-colors hover:text-[#00aaff] inline-block">FAQs</a></li>
            </ul>
          </div>

          {/* Column 3 */}
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
              <a href="https://youtube.com" aria-label="YouTube" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center transition-colors hover:bg-[rgba(0,170,255,0.2)]">
                <img src="/assets/icon/youtube.svg" alt="YouTube" className="w-[18px] h-[18px] filter invert" />
              </a>
              <a href="https://instagram.com" aria-label="Instagram" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center transition-colors hover:bg-[rgba(0,170,255,0.2)]">
                <img src="/assets/icon/instagram.svg" alt="Instagram" className="w-[18px] h-[18px] filter invert" />
              </a>
              <a href="https://discord.com" aria-label="Discord" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center transition-colors hover:bg-[rgba(0,170,255,0.2)]">
                <img src="/assets/icon/discord.svg" alt="Discord" className="w-[18px] h-[18px] filter invert" />
              </a>
              <a href="https://tiktok.com" aria-label="TikTok" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center transition-colors hover:bg-[rgba(0,170,255,0.2)]">
                <img src="/assets/icon/tiktok.svg" alt="TikTok" className="w-[18px] h-[18px] filter invert" />
              </a>
              <a href="https://linkedin.com" aria-label="LinkedIn" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center transition-colors hover:bg-[rgba(0,170,255,0.2)]">
                <img src="/assets/icon/linkeind.svg" alt="LinkedIn" className="w-[18px] h-[18px] filter invert" />
              </a>
              <a href="mailto:info@example.com" aria-label="Email" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center transition-colors hover:bg-[rgba(0,170,255,0.2)]">
                <img src="/assets/icon/gmail.svg" alt="Email" className="w-[18px] h-[18px] filter invert" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bagian copyright ada di CSS lama tapi tidak dipakai di JSX.
          Dibiarkan tidak dirender agar 1:1 dengan komponen asli. */}
    </footer>
  );
}