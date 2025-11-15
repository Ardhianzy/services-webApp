// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { listToT, createToTMeta } from "@/features/tot/api";
// import type { BackendToT } from "@/features/tot/types";
// import { ROUTES } from "@/app/routes";

// export default function AdminToTMetaAddPage() {
//   const nav = useNavigate();
//   const [tots, setTots] = useState<BackendToT[]>([]);
//   const [form, setForm] = useState({
//     ToT_id: "",
//     metafisika: "",
//     epistemologi: "",
//     aksiologi: "",
//     conclusion: "",
//   });
//   const [saving, setSaving] = useState(false);
//   const [err, setErr] = useState<string | null>(null);

//   useEffect(() => {
//     (async () => setTots(await listToT()))();
//   }, []);

//   const onChange = (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setForm((f) => ({ ...f, [name]: value }));
//   };

//   const onSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!form.ToT_id) { setErr("Pilih ToT"); return; }
//     setSaving(true); setErr(null);
//     try {
//       await createToTMeta({
//         ToT_id: Number(form.ToT_id) || form.ToT_id,
//         metafisika: form.metafisika,
//         epistemologi: form.epistemologi,
//         aksiologi: form.aksiologi,
//         conclusion: form.conclusion,
//       });
//       nav(ROUTES.ADMIN.TOT_META_LIST);
//     } catch (e: any) {
//       setErr(e?.message || "Gagal menyimpan");
//     } finally {
//       setSaving(false);
//     }
//   };

//   return (
//     <div>
//       <h2>Tambah ToT Meta</h2>
//       <form onSubmit={onSubmit} className="grid gap-4 max-w-xl">
//         <select name="ToT_id" value={form.ToT_id} onChange={onChange} className="border p-2 rounded" required>
//           <option value="">— pilih ToT —</option>
//           {tots.map((t) => (
//             <option key={String(t.id)} value={String(t.id)}>{t.philosofer}</option>
//           ))}
//         </select>
//         <textarea name="metafisika" placeholder="Metafisika" value={form.metafisika} onChange={onChange} className="border p-2 rounded" rows={3} />
//         <textarea name="epistemologi" placeholder="Epistemologi" value={form.epistemologi} onChange={onChange} className="border p-2 rounded" rows={3} />
//         <textarea name="aksiologi" placeholder="Aksiologi" value={form.aksiologi} onChange={onChange} className="border p-2 rounded" rows={3} />
//         <textarea name="conclusion" placeholder="Kesimpulan" value={form.conclusion} onChange={onChange} className="border p-2 rounded" rows={3} />
//         {err && <p className="text-red-500 m-0">{err}</p>}
//         <div className="flex gap-2">
//           <button disabled={saving} className="bg-blue-600 text-white px-4 py-2 rounded">{saving ? "Menyimpan…" : "Simpan"}</button>
//           <button type="button" onClick={() => nav(-1)} className="px-4 py-2 border rounded">Batal</button>
//         </div>
//       </form>
//     </div>
//   );
// }