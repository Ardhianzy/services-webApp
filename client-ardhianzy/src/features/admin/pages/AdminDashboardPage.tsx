import { Link } from "react-router-dom";
import { articles, type ArticleMeta } from "@/data/articles";

export default function AdminDashboardPage() {
  const totalArticles = (articles as any[]).length;
  const totalUsers = 1;

  return (
    <div>
      <h2>Dashboard</h2>
      <p>
        Selamat datang di panel admin. Dari sini Anda dapat mengelola konten
        website.
      </p>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-[30px] mb-[40px] mt-4">
        <div className="bg-[#f7fafc] border border-[#e2e8f0] rounded-[12px] p-[25px]">
          <h3 className="text-[18px] font-medium text-[#4a5568]">
            Total Artikel
          </h3>
          <p className="text-[42px] font-bold text-[#1a202c] my-[10px]">
            {totalArticles}
          </p>
          <Link to="/admin/articles" className="text-[#2b6cb0] no-underline font-medium">
            Kelola Artikel &rarr;
          </Link>
        </div>

        <div className="bg-[#f7fafc] border border-[#e2e8f0] rounded-[12px] p-[25px]">
          <h3 className="text-[18px] font-medium text-[#4a5568]">
            Total Pengguna
          </h3>
          <p className="text-[42px] font-bold text-[#1a202c] my-[10px]">
            {totalUsers}
          </p>
          <a
            href="#manage-users"
            onClick={(e) => e.preventDefault()}
            className="text-[#a0aec0] pointer-events-none no-underline font-medium"
          >
            Kelola Pengguna (Segera)
          </a>
        </div>
      </div>

      <h3>Manajemen Artikel</h3>
      <p>
        Gunakan tabel di bawah untuk melihat, mengedit, atau menghapus artikel
        yang ada.
      </p>

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
            {(articles as ArticleMeta[]).slice(0, 5).map((article) => (
              <tr key={article.id}>
                <td className="p-4 border-b border-[#e2e8f0] text-[#2d3748]">{article.title}</td>
                <td className="p-4 border-b border-[#e2e8f0] text-[#2d3748]">
                  {article.category ?? "-"}
                </td>
                <td className="p-4 border-b border-[#e2e8f0] text-[#2d3748]">
                  {(() => {
                    const d = new Date(article.publishedAt);
                    return isNaN(d.getTime()) ? article.publishedAt : d.toISOString().slice(0, 10);
                  })()}
                </td>
                <td className="p-4 border-b border-[#e2e8f0]">
                  <button className="px-3 py-[6px] border-0 rounded-[6px] cursor-pointer mr-2 font-medium bg-[#dbeafe] text-[#1d4ed8]" type="button">
                    Edit
                  </button>
                  <button className="px-3 py-[6px] border-0 rounded-[6px] cursor-pointer mr-2 font-medium bg-[#fee2e2] text-[#b91c1c]" type="button">
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="p-4 text-right">
          <Link
            to="/admin/articles"
            className="bg-[#2d3748] text-white py-[10px] px-4 rounded-[8px] no-underline font-medium inline-block"
          >
            Lihat Semua Artikel
          </Link>
        </div>
      </div>
    </div>
  );
}