import ShopHeroSection from "@/features/shop/components/ShopHeroSection";
import ShopListingSection from "@/features/shop/components/ShopListingSection";

export default function ShopPage() {
  return (
    <main className="bg-black text-white min-h-screen pt-24">
      <div className="flex flex-col gap-8 mx-auto">
        <ShopHeroSection />
        <ShopListingSection />
      </div>
    </main>
  );
}