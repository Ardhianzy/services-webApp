// src/features/reading-guides/pages/ReadingGuidePage.tsx
import ReadingGuideHighlightSection from "@/features/reading-guides/components/ReadingGuideHighlightSection";
import ReadingGuideCollectionSection from "@/features/reading-guides/components/ReadingGuideCollectionSection";

export default function ReadingGuidePage() {
  return (
    <main className="bg-black text-white min-h-screen pt-24">
      <div className="flex flex-col gap-8">
        <ReadingGuideHighlightSection />
        <ReadingGuideCollectionSection />
      </div>
    </main>
  );
}