import ResearchHighlightSection from "@/features/research/components/ResearchHighlightSection";
import ResearchArticlesSection from "@/features/research/components/ResearchArticlesSection";

export default function ResearchPage() {
  return (
    <main className="bg-black text-white min-h-screen pt-24">
      <div className="px-8 flex flex-col gap-8 max-md:px-0 max-md:gap-0">
        <ResearchHighlightSection />
        <ResearchArticlesSection />
      </div>
    </main>
  );
}