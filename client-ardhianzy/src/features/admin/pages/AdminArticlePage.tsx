// // src/features/admin/pages/AdminArticlePage.tsx
// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import type { Article } from "@/features/articles/types";
// import { listArticles, deleteArticle } from "@/features/articles/api";
// import AdminConfirmModal from "@/features/admin/components/AdminConfirmModal";

// function toDisplayDate(iso?: string | null, rawDate?: string): string {
//   const src = iso ?? rawDate ?? null;
//   if (!src) return "-";
//   const d = new Date(src);
//   return isNaN(d.getTime()) ? String(src).slice(0,10) : d.toISOString().slice(0, 10);
// }

// export default function AdminArticlePage() {
//   const [rows, setRows] = useState<Article[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [err, setErr] = useState<string | null>(null);

//   const [deleteId, setDeleteId] = useState<string | number | null>(null);
//   const [deleting, setDeleting] = useState(false);
//   const [showDelete, setShowDelete] = useState(false);

//   useEffect(() => {
//     (async () => {
//       try {
//         const data = await listArticles();
//         setRows(data.filter((x: any) => x?.section !== "research"));
//       } catch (e: any) {
//         setErr(e?.message || "Gagal memuat artikel");
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, []);

//   function confirmDelete(id?: string | number) {
//     if (!id) return;
//     setDeleteId(id);
//     setShowDelete(true);
//   }

//   async function onConfirmDelete() {
//     if (!deleteId) return;
//     setDeleting(true);
//     try {
//       await deleteArticle(deleteId);
//       setRows((r) => r.filter((x) => x.id !== deleteId));
//     } catch (e) {
//       // optionally tampilkan error toast
//     } finally {
//       setDeleting(false);
//       setShowDelete(false);
//       setDeleteId(null);
//     }
//   }

//   if (loading) return <p>Memuat…</p>;
//   if (err) return <p className="text-red-400">{err}</p>;

//   const target = rows.find(r => r.id === deleteId);

//   return (
//     <div>
//       <h2>Manage Articles</h2>
//       <p>Tambahkan, edit, atau hapus artikel dari sini.</p>

//       <div className="bg-white border border-[#e2e8f0] rounded-[12px] overflow-hidden mt-4">
//         <table className="w-full border-collapse">
//           <thead>
//             <tr className="bg-[#f7fafc]">
//               <th className="p-4 text-left border-b border-[#e2e8f0] text-[14px] font-semibold text-[#4a5568] uppercase">Judul</th>
//               <th className="p-4 text-left border-b border-[#e2e8f0] text-[14px] font-semibold text-[#4a5568] uppercase">Kategori</th>
//               <th className="p-4 text-left border-b border-[#e2e8f0] text-[14px] font-semibold text-[#4a5568] uppercase">Tanggal</th>
//               <th className="p-4 text-left border-b border-[#e2e8f0] text-[14px] font-semibold text-[#4a5568] uppercase">Aksi</th>
//             </tr>
//           </thead>
//           <tbody>
//             {rows.map((article) => (
//               <tr key={String(article.id)}>
//                 <td className="p-4 border-b border-[#e2e8f0] text-[#2d3748]">{article.title}</td>
//                 <td className="p-4 border-b border-[#e2e8f0] text-[#2d3748]">{article.category ?? "-"}</td>
//                 <td className="p-4 border-b border-[#e2e8f0] text-[#2d3748]">{toDisplayDate(article.publishedAt ?? null, (article as any).date)}</td>
//                 <td className="p-4 border-b border-[#e2e8f0]">
//                   <Link
//                     to={`/admin/articles/edit/${article.id}`}
//                     className="inline-block px-3 py-[6px] rounded-[6px] mr-2 font-medium bg-[#dbeafe] text-[#1d4ed8] no-underline"
//                   >
//                     Edit
//                   </Link>
//                   <button
//                     onClick={() => confirmDelete(article.id!)}
//                     className="px-3 py-[6px] border-0 rounded-[6px] cursor-pointer mr-2 font-medium bg-[#fee2e2] text-[#b91c1c]"
//                     type="button"
//                   >
//                     Hapus
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       <AdminConfirmModal
//         open={showDelete}
//         onClose={() => !deleting && setShowDelete(false)}
//         heading="DELETE ARTICLE"
//         description={
//           deleting
//             ? "Menghapus artikel…"
//             : `Aksi ini tidak bisa dibatalkan. Hapus artikel${target ? ` “${target.title}”` : ""}?`
//         }
//         ctaLabel={deleting ? "Deleting…" : "Delete permanently"}
//         onConfirm={deleting ? () => {} : onConfirmDelete}
//         // pakai background/modal style yang sama dengan modal course:
//         backgroundUrl={"/assets/misc/modal-bg.png"}
//       />
//     </div>
//   );
// }