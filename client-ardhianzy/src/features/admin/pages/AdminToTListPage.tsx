// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { listToT } from "@/features/tot/api";
// import type { BackendToT } from "@/features/tot/types";
// import { ROUTES } from "@/app/routes";

// export default function AdminToTListPage() {
//   const [items, setItems] = useState<BackendToT[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     (async () => {
//       try {
//         const data = await listToT();
//         setItems(data);
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, []);

//   return (
//     <div>
//       <h2>ToT (Timeline of Thought)</h2>
//       <p>Kelola entri dasar filsuf untuk peta timeline.</p>

//       <div className="mb-4">
//         <Link to={ROUTES.ADMIN.TOT_ADD} className="inline-block bg-blue-600 text-white px-4 py-2 rounded">+ Tambah ToT</Link>
//       </div>

//       {loading ? "Memuat…" : (
//         <div className="overflow-x-auto">
//           <table className="w-full border-collapse">
//             <thead>
//               <tr>
//                 <th className="p-3 border">ID</th>
//                 <th className="p-3 border">Nama (philosofer)</th>
//                 <th className="p-3 border">Years</th>
//                 <th className="p-3 border">Geoorigin</th>
//                 <th className="p-3 border">Detail Location</th>
//               </tr>
//             </thead>
//             <tbody>
//               {items.map((x) => (
//                 <tr key={String(x.id)}>
//                   <td className="p-3 border">{String(x.id ?? "")}</td>
//                   <td className="p-3 border">{x.philosofer ?? ""}</td>
//                   <td className="p-3 border">{x.years ?? ""}</td>
//                   <td className="p-3 border">{x.geoorigin ?? ""}</td>
//                   <td className="p-3 border">{x.detail_location ?? `${x.lat ?? ""},${x.lng ?? ""}`}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// }