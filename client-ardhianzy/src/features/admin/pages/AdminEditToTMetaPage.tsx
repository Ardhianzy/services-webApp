// src/features/admin/pages/AdminEditToTMetaPage.tsx
import { type FormEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ROUTES } from "@/app/routes";
import {
  adminFetchToT,
  adminGetToTMetaById,
  adminUpdateToTMeta,
  //   adminDeleteToTMeta,
  normalizeBackendHtml,
  type ToTMetaDTO,
} from "@/lib/content/api";
import type { ToTDTO } from "@/lib/content/types";

type ToTMetaFormState = {
  ToT_id: string;
  metafisika: string;
  epsimologi: string;
  aksiologi: string;
  conclusion: string;
  is_published: boolean;
};

const EMPTY_FORM: ToTMetaFormState = {
  ToT_id: "",
  metafisika: "",
  epsimologi: "",
  aksiologi: "",
  conclusion: "",
  is_published: false,
};

const AdminEditToTMetaPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [form, setForm] = useState<ToTMetaFormState>(EMPTY_FORM);
  const [tots, setTots] = useState<ToTDTO[]>([]);
  const [meta, setMeta] = useState<ToTMetaDTO | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  //   const [deleting, setDeleting] = useState<boolean>(false);

  useEffect(() => {
    if (!id) {
      setError("ID ToT Meta tidak ditemukan di URL.");
      setLoading(false);
      return;
    }

    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const [totList, metaDetail] = await Promise.all([
          adminFetchToT(),
          adminGetToTMetaById(id),
        ]);

        setTots(totList);
        setMeta(metaDetail);

        setForm({
          ToT_id: metaDetail.ToT_id,
          metafisika: metaDetail.metafisika ?? "",
          epsimologi: metaDetail.epsimologi ?? "",
          aksiologi: metaDetail.aksiologi ?? "",
          conclusion: metaDetail.conclusion ?? "",
          is_published: Boolean(metaDetail.is_published),
        });
      } catch (err: any) {
        setError(err?.message ?? "Failed to load ToT Meta detail");
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type, checked } = target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!id) return;

    try {
      setSaving(true);
      setError(null);

      await adminUpdateToTMeta(id, {
        ToT_id: form.ToT_id,
        metafisika: form.metafisika || null,
        epsimologi: form.epsimologi || null,
        aksiologi: form.aksiologi || null,
        conclusion: form.conclusion || null,
        is_published: form.is_published,
      });

      navigate(ROUTES.ADMIN.TOT_META_LIST);
    } catch (err: any) {
      setError(err?.message ?? "Failed to update ToT Meta");
    } finally {
      setSaving(false);
    }
  };

  //   const handleDelete = async () => {
  //     if (!id || !meta) return;
  //     const label =
  //       meta.tot?.philosofer ?? meta.ToT_id ?? "this ToT Meta entry";

  //     const ok = window.confirm(
  //       `Yakin ingin menghapus ToT Meta untuk "${label}"?`
  //     );
  //     if (!ok) return;

  //     try {
  //       setDeleting(true);
  //       await adminDeleteToTMeta(id);
  //       navigate(ROUTES.ADMIN.TOT_META_LIST);
  //     } catch (err: any) {
  //       setError(err?.message ?? "Failed to delete ToT Meta");
  //       setDeleting(false);
  //     }
  //   };

  const selectedTot: Partial<ToTDTO> | null =
    (form &&
      (tots.find(
        (t) => t.id === form.ToT_id
      ) as Partial<ToTDTO> | undefined)) ??
    meta?.tot ??
    null;

  const renderHtml = (html: string) => ({
    __html: normalizeBackendHtml(html || ""),
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white px-10 py-8 flex items-center justify-center">
        <p className="text-sm text-neutral-400">
          Memuat ToT Meta untuk di-edit...
        </p>
      </div>
    );
  }

  if (!meta) {
    return (
      <div className="min-h-screen bg-black text-white px-10 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold tracking-[0.15em]">
            EDIT TOT META
          </h1>
          <button
            type="button"
            onClick={() => navigate(ROUTES.ADMIN.TOT_META_LIST)}
            className="px-4 py-2 rounded-full border border-zinc-600 text-xs tracking-[0.15em]
                       hover:bg-white hover:text-black transition cursor-pointer"
          >
            KEMBALI KE LIST
          </button>
        </div>
        <p className="text-sm text-red-400">
          {error || "ToT Meta tidak ditemukan."}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-10 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold tracking-[0.15em]">
            EDIT TOT META
          </h1>
          <p className="text-sm text-neutral-400 mt-1 max-w-xl">
            Perbarui konten Metafisika, Epistemologi, Aksiologi, dan
            Kesimpulan untuk Timeline of Thought terpilih.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => navigate(ROUTES.ADMIN.TOT_META_LIST)}
            className="px-4 py-2 rounded-full border border-zinc-600 text-xs tracking-[0.15em]
                       hover:bg-white hover:text-black transition cursor-pointer"
          >
            KEMBALI KE LIST
          </button>
          {/* <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="px-4 py-2 rounded-full border border-red-500/60 text-xs tracking-[0.15em]
                       text-red-300 hover:bg-red-500 hover:text-white transition-colors
                       disabled:opacity-60 cursor-pointer"
          >
            {deleting ? "DELETING..." : "HAPUS TOT META"}
          </button> */}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1.1fr)]">
        <div className="bg-zinc-950/60 border border-zinc-800 rounded-3xl p-6 space-y-5">
          {error && <p className="text-sm text-red-400 -mt-1">{error}</p>}

          <div className="space-y-2">
            <label className="text-xs text-neutral-400 tracking-[0.15em]">
              PILIH TOT (FILSUF)
            </label>
            <select
              name="ToT_id"
              value={form.ToT_id}
              onChange={handleChange}
              className="w-full rounded-xl bg-black border border-zinc-700 px-3 py-2 text-sm outline-none
                         focus:border-white"
            >
              {tots.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.philosofer ?? t.id}
                  {t.years ? ` (${t.years})` : ""}
                </option>
              ))}
            </select>
            {selectedTot && (
              <p className="text-[11px] text-neutral-500">
                {selectedTot.geoorigin && `${selectedTot.geoorigin} · `} 
                {selectedTot.years}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="mr-2 text-xs text-neutral-400 tracking-[0.15em]">
              STATUS
            </label>
            <label className="inline-flex items-center gap-2 text-xs text-neutral-300">
              <input
                id="is_published"
                type="checkbox"
                name="is_published"
                checked={form.is_published}
                onChange={handleChange}
                className="w-4 h-4 rounded border-zinc-600 bg-black"
              />
              <span>Publish ke user</span>
            </label>
            <p className="text-[11px] text-neutral-500">
              Jika tidak dicentang, konten akan berstatus{" "}
              <span className="font-semibold">Draft / Preview</span> dan
              hanya tampil di admin.
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-neutral-400 tracking-[0.15em]">
              METAFISIKA (HTML)
            </label>
            <textarea
              name="metafisika"
              value={form.metafisika}
              onChange={handleChange}
              rows={8}
              className="w-full rounded-2xl bg-black border border-zinc-700 px-3 py-2 text-xs outline-none
                         focus:border-white resize-y font-mono leading-relaxed"
              placeholder="<p>Penjelasan metafisika...</p>"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs text-neutral-400 tracking-[0.15em]">
              EPISTEMOLOGI (HTML)
            </label>
            <textarea
              name="epsimologi"
              value={form.epsimologi}
              onChange={handleChange}
              rows={6}
              className="w-full rounded-2xl bg-black border border-zinc-700 px-3 py-2 text-xs outline-none
                         focus:border-white resize-y font-mono leading-relaxed"
              placeholder="<p>Penjelasan epistemologi...</p>"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs text-neutral-400 tracking-[0.15em]">
              AKSIOLOGI (HTML)
            </label>
            <textarea
              name="aksiologi"
              value={form.aksiologi}
              onChange={handleChange}
              rows={6}
              className="w-full rounded-2xl bg-black border border-zinc-700 px-3 py-2 text-xs outline-none
                         focus:border-white resize-y font-mono leading-relaxed"
              placeholder="<p>Penjelasan aksiologi...</p>"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs text-neutral-400 tracking-[0.15em]">
              CONCLUSION (HTML)
            </label>
            <textarea
              name="conclusion"
              value={form.conclusion}
              onChange={handleChange}
              rows={6}
              className="w-full rounded-2xl bg-black border border-zinc-700 px-3 py-2 text-xs outline-none
                         focus:border-white resize-y font-mono leading-relaxed"
              placeholder="<p>Ringkasan / sintesis akhir...</p>"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 justify-between pt-3 border-t border-zinc-800 mt-2">
            <div className="text-[11px] text-neutral-500">
              Pastikan struktur HTML sudah rapi sebelum publish ke user.
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => navigate(ROUTES.ADMIN.TOT_META_LIST)}
                className="px-4 py-2 rounded-full border border-zinc-600 text-xs tracking-[0.15em]
                           hover:bg-zinc-800 cursor-pointer"
              >
                BATAL
              </button>
              <button
                type="submit"
                disabled={saving}
                onClick={handleSubmit}
                className="px-4 py-2 rounded-full border border-white bg-white text-black text-xs tracking-[0.15em]
                           hover:bg-transparent hover:text-white hover:border-white disabled:opacity-50 cursor-pointer"
              >
                {saving ? "SAVING..." : "SAVE CHANGES"}
              </button>
            </div>
          </div>
        </div>

        <div className="bg-zinc-950/60 border border-zinc-800 rounded-3xl p-6 overflow-hidden">
          <h2 className="text-sm font-medium tracking-[0.15em] text-neutral-400 mb-4">
            LIVE PREVIEW
          </h2>
          <div className="bg-black rounded-2xl border border-zinc-800 p-6 h-full overflow-y-auto">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {selectedTot?.philosofer && (
                <span className="text-[11px] px-2 py-1 rounded-full border border-zinc-700 text-neutral-300">
                  {selectedTot.philosofer}
                </span>
              )}
              {selectedTot?.years && (
                <span className="text-[11px] px-2 py-1 rounded-full border border-zinc-700 text-neutral-300">
                  {selectedTot.years}
                </span>
              )}
              {selectedTot?.geoorigin && (
                <span className="text-[11px] px-2 py-1 rounded-full border border-zinc-700 text-neutral-300">
                  {selectedTot.geoorigin}
                </span>
              )}
              <span
                className={`ml-auto text-[11px] px-2 py-1 rounded-full ${
                  form.is_published
                    ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/40"
                    : "bg-yellow-500/10 text-yellow-300 border border-yellow-500/40"
                }`}
              >
                {form.is_published ? "Published" : "Draft / Preview"}
              </span>
            </div>

            {selectedTot && (selectedTot as any).image && (
              <div className="mb-5 rounded-2xl overflow-hidden border border-zinc-800">
                <img
                  src={(selectedTot as any).image}
                  alt={selectedTot.philosofer ?? "ToT Cover"}
                  className="w-full h-56 object-cover"
                />
              </div>
            )}

            <h1 className="text-2xl md:text-3xl font-semibold mb-4">
              {selectedTot?.philosofer || "Nama filsuf / ToT"}
            </h1>

            {form.metafisika && (
              <div className="mb-5 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
                <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-[0.18em] mb-2">
                  METAFISIKA
                </p>
                <div
                  className="admin-totmeta-html"
                  dangerouslySetInnerHTML={renderHtml(form.metafisika)}
                />
              </div>
            )}

            {form.epsimologi && (
              <div className="mb-5 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
                <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-[0.18em] mb-2">
                  EPISTEMOLOGI
                </p>
                <div
                  className="admin-totmeta-html"
                  dangerouslySetInnerHTML={renderHtml(form.epsimologi)}
                />
              </div>
            )}

            {form.aksiologi && (
              <div className="mb-5 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
                <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-[0.18em] mb-2">
                  AKSIOLOGI
                </p>
                <div
                  className="admin-totmeta-html"
                  dangerouslySetInnerHTML={renderHtml(form.aksiologi)}
                />
              </div>
            )}

            {form.conclusion && (
              <div className="mb-2 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
                <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-[0.18em] mb-2">
                  CONCLUSION
                </p>
                <div
                  className="admin-totmeta-html"
                  dangerouslySetInnerHTML={renderHtml(form.conclusion)}
                />
              </div>
            )}

            {!form.metafisika &&
              !form.epsimologi &&
              !form.aksiologi &&
              !form.conclusion && (
                <p className="text-xs text-neutral-500 mt-2">
                  Konten masih kosong. Isi salah satu bidang HTML di
                  formulir kiri untuk melihat preview bagaimana ToT Meta
                  akan tampil di halaman user.
                </p>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminEditToTMetaPage;