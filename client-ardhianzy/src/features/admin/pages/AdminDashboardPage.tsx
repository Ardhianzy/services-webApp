import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Article } from "@/features/articles/types";
import { listArticles } from "@/features/articles/api";
import { ROUTES } from "@/app/routes";

export default function AdminDashboardPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await listArticles();
        setArticles(data.filter((x:any) => x?.section !== "research"));
      } catch {
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const totalArticles = articles.length;
  const totalUsers = 1;

  return (
    <div>
      <h2>Dashboard</h2>
      <p>Selamat datang di panel admin. Dari sini Anda dapat mengelola konten website.</p>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-[30px] mb-[40px] mt-4">
        <div className="bg-[#f7fafc] border border-[#e2e8f0] rounded-[12px] p-[25px]">
          <h3 className="text-[18px] font-medium text-[#4a5568]">Total Artikel</h3>
          <p className="text-[42px] font-bold text-[#1a202c] my-[10px]">{loading ? "…" : totalArticles}</p>
          <Link to={ROUTES.ADMIN.ARTICLES_LIST} className="text-[#2b6cb0] no-underline font-medium">Kelola Artikel →</Link>
        </div>

        <div className="bg-[#f7fafc] border border-[#e2e8f0] rounded-[12px] p-[25px]">
          <h3 className="text-[18px] font-medium text-[#4a5568]">Total Pengguna</h3>
          <p className="text-[42px] font-bold text-[#1a202c] my-[10px]">{totalUsers}</p>
          <a href="#manage-users" onClick={(e) => e.preventDefault()} className="text-[#a0aec0] pointer-events-none no-underline font-medium">Kelola Pengguna (Segera)</a>
        </div>
      </div>

      <h3>Manajemen Artikel</h3>
      <p>Gunakan tabel di bawah untuk melihat, mengedit, atau menghapus artikel yang ada.</p>
    </div>
  );
}