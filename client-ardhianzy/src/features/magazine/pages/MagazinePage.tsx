import MagazineHeadlineSection from "@/features/magazine/components/MagazineHeadlineSection";
import MagazineCollectionSection from "@/features/magazine/components/MagazineCollectionSection";

export default function MagazinePage() {
  return (
    <main className="bg-black text-white min-h-screen pt-24">
      <div>
        <MagazineHeadlineSection />
        <MagazineCollectionSection />
      </div>
    </main>
  );
}