import MonologuesHighlightSection from "@/features/monologues/components/MonologuesHighlightSection";
import MonologuesArticleGridSection from "@/features/monologues/components/MonologuesArticleGridSection";

export default function MonologuesPage() {
  return (
    <main className="bg-black text-white min-h-screen pt-24">
      <div className="flex flex-col gap-8">
        <MonologuesHighlightSection />
        <MonologuesArticleGridSection />
      </div>
    </main>
  );
}