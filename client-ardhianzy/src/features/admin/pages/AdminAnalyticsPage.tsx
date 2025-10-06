import React from "react";
import { useLocation } from "react-router-dom";
import { articles } from "@/data/articles";

const WebPerformanceSection: React.FC = () => (
  <div id="web-performance" className="bg-[#2a2a2a] p-5 rounded-[8px] mb-5">
    <h3 className="mt-0 text-[#E0E0E0]">Web Performance</h3>
    <p className="text-[#B1B1B1]">
      Grafik dan data mengenai performa website akan ditampilkan di sini.
    </p>
    <div className="bg-[#333] rounded-[8px] p-10 text-center text-[#777] mt-5">
      Chart Placeholder
    </div>
  </div>
);

const ArticleAnalyticsSection: React.FC = () => (
  <div id="article-analytics" className="bg-[#2a2a2a] p-5 rounded-[8px] mb-5">
    <h3 className="mt-0 text-[#E0E0E0]">Article Analytics</h3>
    <p className="text-[#B1B1B1]">Statistik mengenai artikel yang paling banyak dilihat.</p>

    <div className="overflow-x-auto">
      <table className="w-full border-collapse mt-[15px]">
        <thead>
          <tr>
            <th className="p-[12px_15px] text-left border-b border-[#444] bg-[#333] text-white font-medium">
              Judul
            </th>
            <th className="p-[12px_15px] text-left border-b border-[#444] bg-[#333] text-white font-medium">
              Kategori
            </th>
            <th className="p-[12px_15px] text-left border-b border-[#444] bg-[#333] text-white font-medium">
              Total Pembaca (Contoh)
            </th>
          </tr>
        </thead>
        <tbody>
          {(articles as any[]).slice(0, 3).map((article) => (
            <tr key={article.id} className="bg-[#2a2a2a] hover:bg-[#383838]">
              <td className="p-[12px_15px] text-left border-b border-[#444]">{article.title}</td>
              <td className="p-[12px_15px] text-left border-b border-[#444]">
                {article.category ?? "-"}
              </td>
              <td className="p-[12px_15px] text-left border-b border-[#444]">
                {Math.floor(Math.random() * 5000) + 1000}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const ShopAnalyticsSection: React.FC = () => (
  <div id="shop-analytics" className="bg-[#2a2a2a] p-5 rounded-[8px] mb-5">
    <h3 className="mt-0 text-[#E0E0E0]">Shop Analytics</h3>
    <p className="text-[#B1B1B1]">Data penjualan dan performa produk di toko Anda.</p>
    <div className="bg-[#333] rounded-[8px] p-10 text-center text-[#777] mt-5">
      Sales Data Placeholder
    </div>
  </div>
);

const AdminAnalyticsPage: React.FC = () => {
  const location = useLocation();

  React.useEffect(() => {
    if (location.hash) {
      const el = document.getElementById(location.hash.substring(1));
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  }, [location]);

  return (
    <div
      className="min-h-screen bg-[#1E1E1E] text-white"
      style={{ fontFamily: "'Roboto', sans-serif" }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500&display=swap');`}</style>

      <div className="px-10 py-5">
        <WebPerformanceSection />
        <ArticleAnalyticsSection />
        <ShopAnalyticsSection />
      </div>
    </div>
  );
};

export default AdminAnalyticsPage;