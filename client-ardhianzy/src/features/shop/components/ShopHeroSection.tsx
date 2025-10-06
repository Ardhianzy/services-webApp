// src/features/shop/components/ShopHeroSection.tsx
export default function ShopHeroSection() {
  const backgroundImageUrl = "/assets/shop/bg/assets_Shop.png";

  return (
    <section
      aria-label="Shop hero section"
      className="
        relative flex w-full items-center overflow-hidden
        bg-cover bg-center
        h-[280px] max-[640px]:h-[220px]
      "
      style={{ backgroundImage: `url(${backgroundImageUrl})` }}
    >
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0) 12.5%, #000000 100%)",
        }}
      />

      <div className="relative z-[2] px-16 text-white">
        <h1
          className="mb-2 uppercase"
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontWeight: 400,
            fontSize: "clamp(2.75rem, 6vw, 4.5rem)",
            lineHeight: 1,
            color: "#F5F5F5",
            margin: 0,
          }}
        >
          Ardhianzy Shop
        </h1>

        <p
          style={{
            fontFamily: "'Roboto', sans-serif",
            fontWeight: 400,
            fontSize: "1.125rem",
            lineHeight: 1.4,
            margin: 0,
            opacity: 0.95,
          }}
        >
          We offer merchandise and books on philosophy to psychology.
        </p>
      </div>
    </section>
  );
}