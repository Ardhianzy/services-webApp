import HighlightSection from "@/features/ideas-tradition/components/HighlightSection";
import ArticleSection from "@/features/ideas-tradition/components/ArticleSection";

export default function IdeasTraditionPage() {
  return (
    <main className="bg-black text-white min-h-screen pt-24">
      <div className="flex flex-col gap-8">
        <HighlightSection />
        <ArticleSection />
      </div>
    </main>
  );
}