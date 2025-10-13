// src/features/admin/components/AdminConfirmModal.tsx
import React from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  heading: string;
  description: string;
  ctaLabel: string;
  onConfirm: () => void;
  backgroundUrl?: string;
};

const DEFAULT_BG = "/assets/misc/modal-bg.png";

export default function AdminConfirmModal({
  open,
  onClose,
  heading,
  description,
  ctaLabel,
  onConfirm,
  backgroundUrl = DEFAULT_BG,
}: Props) {
  if (!open) return null;

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
        className="pdp-slide-up relative mx-4 w-[82%] max-w-[740px] rounded-md p-10 text-white flex gap-10 max-lg:flex-col max-lg:gap-8"
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
          <h2
            className="m-0 text-[#F5F5F5]"
            style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "56px", lineHeight: 1, letterSpacing: "0.02em" }}
          >
            {heading}
          </h2>

          <p
            className="mb-8 max-w-[640px] text-[#F5F5F5]"
            style={{ fontFamily: "'Roboto', sans-serif", fontSize: "14px", lineHeight: 1.5 }}
          >
            {description}
          </p>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={onConfirm}
              className="inline-flex items-center justify-center gap-[8px] !rounded-[30px] border !border-[#F5F5F5] px-[26px] py-[14px] !text-[#F5F5F5] transition-colors hover:!border-black hover:!bg-[#F5F5F5] hover:!text-black"
              style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "18px", lineHeight: "22px", letterSpacing: "0.02em" }}
            >
              {ctaLabel} <span>&rarr;</span>
            </button>
          </div>
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