import { articles, type ArticleMeta } from "@/data/articles";

type ArticleRow = {
  id: string | number;
  title: string;
  category?: string;
  publishedAt: string;
};

function toDisplayDate(iso: string): string {
  const d = new Date(iso);
  return isNaN(d.getTime()) ? iso : d.toISOString().slice(0, 10);
}

export default function AdminArticlePage() {
  const rows: ArticleRow[] = (articles as ArticleMeta[]).map((a) => ({
    id: a.id,
    title: a.title,
    category: a.category,
    publishedAt: a.publishedAt,
  }));

  return (
    <div>
      <h2>Manage Articles</h2>
      <p>Tambahkan, edit, atau hapus artikel dari sini.</p>

      <div className="bg-white border border-[#e2e8f0] rounded-[12px] overflow-hidden mt-4">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#f7fafc]">
              <th className="p-4 text-left border-b border-[#e2e8f0] text-[14px] font-semibold text-[#4a5568] uppercase">
                Judul
              </th>
              <th className="p-4 text-left border-b border-[#e2e8f0] text-[14px] font-semibold text-[#4a5568] uppercase">
                Kategori
              </th>
              <th className="p-4 text-left border-b border-[#e2e8f0] text-[14px] font-semibold text-[#4a5568] uppercase">
                Tanggal
              </th>
              <th className="p-4 text-left border-b border-[#e2e8f0] text-[14px] font-semibold text-[#4a5568] uppercase">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((article) => (
              <tr key={article.id}>
                <td className="p-4 border-b border-[#e2e8f0] text-[#2d3748]">
                  {article.title}
                </td>
                <td className="p-4 border-b border-[#e2e8f0] text-[#2d3748]">
                  {article.category ?? "-"}
                </td>
                <td className="p-4 border-b border-[#e2e8f0] text-[#2d3748]">
                  {toDisplayDate(article.publishedAt)}
                </td>
                <td className="p-4 border-b border-[#e2e8f0]">
                  <button
                    className="px-3 py-[6px] border-0 rounded-[6px] cursor-pointer mr-2 font-medium bg-[#dbeafe] text-[#1d4ed8]"
                    type="button"
                  >
                    Edit
                  </button>
                  <button
                    className="px-3 py-[6px] border-0 rounded-[6px] cursor-pointer mr-2 font-medium bg-[#fee2e2] text-[#b91c1c]"
                    type="button"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}