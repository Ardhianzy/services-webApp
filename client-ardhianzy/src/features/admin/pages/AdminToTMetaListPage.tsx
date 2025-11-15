// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { listToT, listToTMetaByTotId } from "@/features/tot/api";
// import type { BackendToT, BackendToTMeta } from "@/features/tot/types";
// import { ROUTES } from "@/app/routes";

// export default function AdminToTMetaListPage() {
//   const [totItems, setTotItems] = useState<BackendToT[]>([]);
//   const [metaByTot, setMetaByTot] = useState<Record<string, BackendToTMeta[]>>({});
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     (async () => {
//       try {
//         const tots = await listToT();
//         setTotItems(tots);
//         const dict: Record<string, BackendToTMeta[]> = {};
//         for (const t of tots) {
//           if (!t?.id) continue;
//           dict[String(t.id)] = await listToTMetaByTotId(t.id);
//         }
//         setMetaByTot(dict);
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, []);

//   return (
//     <div>
//       <h2>ToT Meta</h2>
//       <p>Kelola catatan Metafisika/Epistemologi/Aksiologi per ToT.</p>

//       <div className="mb-4">
//         <Link to={ROUTES.ADMIN.TOT_META_ADD} className="inline-block bg-blue-600 text-white px-4 py-2 rounded">+ Tambah ToT Meta</Link>
//       </div>

//       {loading ? "Memuat…" : (
//         <div className="space-y-6">
//           {totItems.map((t) => {
//             const metas = metaByTot[String(t.id)] ?? [];
//             return (
//               <section key={String(t.id)} className="border rounded p-3">
//                 <h3 className="m-0">#{String(t.id)} — {t.philosofer}</h3>
//                 {metas.length === 0 ? (
//                   <p className="m-0 text-sm text-gray-500">Belum ada meta.</p>
//                 ) : (
//                   <ul className="m-0 pl-5">
//                     {metas.map((m) => (
//                       <li key={String(m.id)}>
//                         <strong>Metafisika:</strong> {m.metafisika || "-"} | <strong>Epistemologi:</strong> {(m.epistemologi ?? m.epsimologi) || "-"} | <strong>Aksiologi:</strong> {m.aksiologi || "-"}
//                       </li>
//                     ))}
//                   </ul>
//                 )}
//               </section>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// }