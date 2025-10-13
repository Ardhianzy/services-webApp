import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createToT } from "@/features/tot/api";
import { ROUTES } from "@/app/routes";

export default function AdminToTAddPage() {
  const nav = useNavigate();
  const [form, setForm] = useState({
    philosofer: "",
    years: "",
    geoorigin: "",
    detail_location: "",
    lat: "",
    lng: "",
    imageFile: null as File | null,
  });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const onChange = (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setForm((f) => ({ ...f, imageFile: file }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setErr(null);
    try {
      await createToT({
        philosofer: form.philosofer,
        years: form.years,
        geoorigin: form.geoorigin,
        detail_location: form.detail_location,
        lat: form.lat ? Number(form.lat) : undefined,
        lng: form.lng ? Number(form.lng) : undefined,
        imageFile: form.imageFile,
      });
      nav(ROUTES.ADMIN.TOT_LIST);
    } catch (e: any) {
      setErr(e?.message || "Gagal menyimpan");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h2>Tambah ToT</h2>
      <form onSubmit={onSubmit} className="grid gap-4 max-w-xl">
        <input name="philosofer" placeholder="Nama (philosofer)" value={form.philosofer} onChange={onChange} className="border p-2 rounded" required />
        <input name="years" placeholder="Years (misal 1844–1900 atau 470-399 BC)" value={form.years} onChange={onChange} className="border p-2 rounded" />
        <input name="geoorigin" placeholder="Geoorigin (misal Germany)" value={form.geoorigin} onChange={onChange} className="border p-2 rounded" />
        <input name="detail_location" placeholder='Detail location (misal "51.3,12.37" atau "City, Country")' value={form.detail_location} onChange={onChange} className="border p-2 rounded" />
        <div className="grid grid-cols-2 gap-3">
          <input name="lat" placeholder="Lat (opsional)" value={form.lat} onChange={onChange} className="border p-2 rounded" />
          <input name="lng" placeholder="Lng (opsional)" value={form.lng} onChange={onChange} className="border p-2 rounded" />
        </div>
        <input type="file" accept="image/*" onChange={onFile} className="border p-2 rounded" />
        {err && <p className="text-red-500 m-0">{err}</p>}
        <div className="flex gap-2">
          <button disabled={saving} className="bg-blue-600 text-white px-4 py-2 rounded">{saving ? "Menyimpan…" : "Simpan"}</button>
          <button type="button" onClick={() => nav(-1)} className="px-4 py-2 border rounded">Batal</button>
        </div>
      </form>
    </div>
  );
}