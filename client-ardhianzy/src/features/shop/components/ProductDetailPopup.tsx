// src/features/shop/components/ProductDetailPopup.tsx
import { useCallback, useEffect, useMemo, useState, type MouseEvent } from "react";
import type { Product } from "@/types/shop";

type Props = {
  product: Product | null;
  onClose: () => void;
  backgroundUrl?: string;
  headingId?: string;
  descId?: string;
};

export default function ProductDetailPopup({
  product,
  onClose,
  backgroundUrl = "/assets/shop/bg/fine-photographics-bg.png",
  headingId = "pdp-heading",
  descId = "pdp-desc",
}: Props) {
  if (!product) return null;

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => setCurrentIndex(0), [product]);

  const galleryImages = useMemo<string[]>(() => {
    const src = (product.galleryImages?.length ? product.galleryImages : [product.imageUrl]) ?? [];
    return src.filter(Boolean);
  }, [product.galleryImages, product.imageUrl]);

  const rating = product.reviews?.rating ?? 5.0;
  const reviewCount = product.reviews?.count ?? 100;
  const description =
    product.description ?? "No description available for this product at the moment.";

  const handlePrev = useCallback(
    () => setCurrentIndex((p) => (p - 1 + galleryImages.length) % galleryImages.length),
    [galleryImages.length]
  );
  const handleNext = useCallback(
    () => setCurrentIndex((p) => (p + 1) % galleryImages.length),
    [galleryImages.length]
  );

  const stopCard = (e: MouseEvent) => e.stopPropagation();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleNext, handlePrev, onClose]);

  const bgStyle: React.CSSProperties = backgroundUrl
    ? {
        backgroundColor: "#000",
        backgroundImage: `url('${backgroundUrl}')`,
        backgroundBlendMode: "luminosity",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }
    : { backgroundColor: "#000" };

  const activeAlt = `${product.title} — view ${currentIndex + 1}`;

  const buyUrl = (product as any)?.buyUrl as string | undefined;
  const onBuyNow = () => {
    if (buyUrl) window.open(buyUrl, "_blank", "noopener");
  };

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/85 backdrop-blur-[8px] pdp-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby={headingId}
      aria-describedby={descId}
    >
      <div
        onClick={stopCard}
        className="pdp-slide-up relative mx-4 flex w-[80%] max-w-[1100px] gap-16 rounded-md p-12 text-white max-lg:flex-col max-lg:gap-10"
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

        <div className="flex flex-1 flex-col items-center">
          <img
            src={galleryImages[currentIndex]}
            alt={activeAlt}
            className="h-[526px] w-[379px] object-cover max-sm:h-[420px] max-sm:w-[300px]"
          />

          <div className="mt-4 flex items-center gap-4 text-[24px] text-[#F5F5F5]">
            <button
              type="button"
              onClick={handlePrev}
              className="!px-2 !py-[2px] hover:!border-white transition-transform hover:scale-105 !bg-transparent !rounded-full"
              aria-label="Previous image"
              title="Previous (←)"
            >
              &larr;
            </button>

            <div className="flex items-center gap-2">
              {galleryImages.map((_, i) => {
                const isActive = currentIndex === i;
                return (
                  <span
                    key={i}
                    onClick={() => setCurrentIndex(i)}
                    className={[
                      "inline-block h-2 w-2 cursor-pointer rounded-full border border-[#F5F5F5]",
                      isActive ? "bg-[#F5F5F5]" : "",
                    ].join(" ")}
                    aria-label={`Go to image ${i + 1}`}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setCurrentIndex(i)}
                    title={`Image ${i + 1}`}
                  />
                );
              })}
            </div>

            <button
              type="button"
              onClick={handleNext}
              className="!px-2 !py-[2px] hover:!border-white transition-transform hover:scale-105 !bg-transparent !rounded-full"
              aria-label="Next image"
              title="Next (→)"
            >
              &rarr;
            </button>
          </div>
        </div>

        <div className="flex flex-1 flex-col justify-center">
          <div className="mb-6 flex items-baseline gap-6">
            <h1
              id={headingId}
              className="m-0 leading-[1.1875]"
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "60px",
                letterSpacing: "0.01em",
                color: "#F5F5F5",
              }}
            >
              {product.title}
            </h1>

            <div
              className="leading-[21px] text-[#FFCA0F]"
              style={{ fontFamily: "'Roboto', sans-serif", fontWeight: 700, fontSize: "18px" }}
              aria-label={`Rating ${rating} dari ${reviewCount} ulasan`}
              title={`${rating} (${reviewCount} reviews)`}
            >
              <span className="mr-1 align-middle text-[24px]">&#9733;</span>
              <span>{rating.toFixed(1)} ({reviewCount} reviews)</span>
            </div>
          </div>

          <p
            id={descId}
            className="mb-12 max-w-[460px]"
            style={{ fontFamily: "'Roboto', sans-serif", fontSize: "12px", lineHeight: 1.4, letterSpacing: "0.01em" }}
          >
            {description}
          </p>

          <div className="flex items-center gap-12">
            <p
              className="m-0 leading-[70px] text-white"
              style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "58px" }}
            >
              {product.price}
            </p>

            <button
              type="button"
              onClick={onBuyNow}
              className="inline-flex items-center justify-center gap-[6px] !rounded-[30px] border !border-[#F5F5F5] px-[25px] py-[14px] !text-[#F5F5F5] transition-colors hover:!border-black hover:!bg-[#F5F5F5] hover:!text-black cursor-pointer"
              style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "18px", lineHeight: "22px" }}
            >
              BUY NOW <span>&rarr;</span>
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