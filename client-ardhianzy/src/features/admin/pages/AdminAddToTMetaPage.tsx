// src/features/admin/pages/AdminAddToTMetaPage.tsx
import { type FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/app/routes";
import {
  adminFetchToT,
  adminCreateToTMeta,
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
  is_published: false, // default draft
};

const AdminAddToTMetaPage: React.FC = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState<ToTMetaFormState>(EMPTY_FORM);
  const [tots, setTots] = useState<ToTDTO[]>([]);
  const [loadingTots, setLoadingTots] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoadingTots(true);
        const data = await adminFetchToT();
        setTots(data);
        if (!form.ToT_id && data.length > 0) {
          setForm((prev) => ({ ...prev, ToT_id: data[0].id }));
        }
      } catch (err: any) {
        setError(err?.message ?? "Failed to load ToT list");
      } finally {
        setLoadingTots(false);
      }
    };

    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    if (!form.ToT_id) {
      setError("Pilih salah satu ToT terlebih dahulu.");
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const payload: Partial<ToTMetaDTO> & { ToT_id: string } = {
        ToT_id: form.ToT_id,
        metafisika: form.metafisika || null,
        epsimologi: form.epsimologi || null,
        aksiologi: form.aksiologi || null,
        conclusion: form.conclusion || null,
        is_published: form.is_published,
      };

      await adminCreateToTMeta(payload);
      navigate(ROUTES.ADMIN.TOT_META_LIST);
    } catch (err: any) {
      setError(err?.message ?? "Failed to create ToT Meta");
    } finally {
      setSaving(false);
    }
  };

  const selectedTot = tots.find((t) => t.id === form.ToT_id) ?? null;

  const renderHtml = (html: string) => ({
    __html: normalizeBackendHtml(html || ""),
  });

  return (
    <div className="min-h-screen bg-black text-white px-10 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold tracking-[0.15em]">
            NEW TIMELINE OF THOUGHT META
          </h1>
          <p className="text-sm text-neutral-400 mt-3 max-w-xl">
            Buat entri <span className="font-semibold">ToT Meta</span> untuk
            menjelaskan Metafisika, Epistemologi, Aksiologi, dan Kesimpulan
            dari salah satu entri Timeline of Thought (ToT).
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate(ROUTES.ADMIN.TOT_META_LIST)}
          className="px-4 py-2 rounded-full border border-zinc-600 text-xs tracking-[0.15em]
                     hover:bg-white hover:text-black transition cursor-pointer"
        >
          KEMBALI KE LIST
        </button>
      </div>

      {/* Layout: kiri form, kanan preview */}
      <div className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1.25fr)_minmax(0,1.1fr)]">
        {/* KIRI: FORM */}
        <form
          onSubmit={handleSubmit}
          className="bg-zinc-950/60 border border-zinc-800 rounded-3xl p-6 space-y-6"
        >
          {/* Pilih ToT */}
          <div className="flex flex-col gap-2">
            <label className="text-xs text-neutral-400 tracking-[0.15em]">
              PILIH TIMELINE OF THOUGHT (ToT)
            </label>
            {loadingTots ? (
              <p className="text-xs text-neutral-400">Loading ToT…</p>
            ) : tots.length === 0 ? (
              <p className="text-xs text-neutral-400">
                Belum ada data ToT. Buat ToT terlebih dahulu sebelum membuat
                ToT Meta.
              </p>
            ) : (
              <select
                name="ToT_id"
                value={form.ToT_id}
                onChange={handleChange}
                className="w-full rounded-xl bg-black border border-zinc-700 px-3 py-2 text-sm outline-none focus:border-white cursor-pointer"
              >
                {tots.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.philosofer ?? t.id}
                    {t.years ? ` (${t.years})` : ""}
                  </option>
                ))}
              </select>
            )}
            {selectedTot && (
              <p className="text-xs text-neutral-400">
                {selectedTot.geoorigin && `${selectedTot.geoorigin} · `}
                {selectedTot.years}
              </p>
            )}
          </div>

          {/* Status publish / draft */}
          <div className="flex flex-col gap-2 pt-1 border-t border-zinc-800 mt-2">
            <label className="text-xs text-neutral-400 tracking-[0.15em]">
              STATUS PUBLIKASI
            </label>
            <label className="inline-flex items-center gap-2 text-xs text-neutral-300">
              <input
                id="is_published"
                type="checkbox"
                name="is_published"
                checked={form.is_published}
                onChange={handleChange}
                className="h-4 w-4 rounded border border-zinc-600 bg-black"
              />
              <span>Publish ke user begitu ToT Meta ini disimpan</span>
            </label>
            <p className="text-xs text-neutral-500">
              Jika tidak dicentang, status akan{" "}
              <span className="font-semibold">Draft / Preview</span> dan hanya
              muncul di admin.
            </p>
          </div>

          {/* Metafisika */}
          <div className="space-y-2">
            <label className="text-xs text-neutral-400 tracking-[0.15em]">
              METAFISIKA (HTML)
            </label>
            <textarea
              name="metafisika"
              value={form.metafisika}
              onChange={handleChange}
              rows={8}
              className="w-full rounded-xl bg-black border border-zinc-700 px-3 py-2 text-sm outline-none focus:border-white resize-y"
              placeholder="<h1>1. Metafisika...</h1>..."
            />
            <p className="text-xs text-neutral-500">
              Bisa tempel HTML dari editor eksternal (h1, p, ul, table, dsb.).
              Sistem akan menormalkan &amp; menampilkan preview.
            </p>
          </div>

          {/* Epistemologi */}
          <div className="space-y-2">
            <label className="text-xs text-neutral-400 tracking-[0.15em]">
              EPISTEMOLOGI (HTML)
            </label>
            <textarea
              name="epsimologi"
              value={form.epsimologi}
              onChange={handleChange}
              rows={6}
              className="w-full rounded-xl bg-black border border-zinc-700 px-3 py-2 text-sm outline-none focus:border-white resize-y"
            />
          </div>

          {/* Aksiologi */}
          <div className="space-y-2">
            <label className="text-xs text-neutral-400 tracking-[0.15em]">
              AKSIOLOGI (HTML)
            </label>
            <textarea
              name="aksiologi"
              value={form.aksiologi}
              onChange={handleChange}
              rows={6}
              className="w-full rounded-xl bg-black border border-zinc-700 px-3 py-2 text-sm outline-none focus:border-white resize-y"
            />
          </div>

          {/* Conclusion */}
          <div className="space-y-2">
            <label className="text-xs text-neutral-400 tracking-[0.15em]">
              CONCLUSION (HTML)
            </label>
            <textarea
              name="conclusion"
              value={form.conclusion}
              onChange={handleChange}
              rows={6}
              className="w-full rounded-xl bg-black border border-zinc-700 px-3 py-2 text-sm outline-none focus:border-white resize-y"
            />
          </div>

          {error && (
            <p className="text-sm text-red-400 mt-1">{error}</p>
          )}

          {/* Tombol aksi */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-zinc-800 mt-2">
            <button
              type="button"
              onClick={() => navigate(ROUTES.ADMIN.TOT_META_LIST)}
              className="text-xs px-4 py-2 rounded-full border border-zinc-600 text-neutral-200 tracking-[0.15em]
                         hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              BATAL
            </button>
            <button
              type="submit"
              disabled={saving || loadingTots || !form.ToT_id}
              className="text-xs px-5 py-2 rounded-full border border-white bg-white text-black font-medium tracking-[0.15em]
                         hover:bg-transparent hover:text-white hover:border-white transition-colors disabled:opacity-60 cursor-pointer"
            >
              {saving ? "SAVING…" : "SAVE ToT META"}
            </button>
          </div>
        </form>

        {/* KANAN: PREVIEW */}
        <div className="bg-zinc-950/60 border border-zinc-800 rounded-3xl p-6 overflow-hidden flex flex-col">
          <h2 className="text-sm font-medium tracking-[0.15em] text-neutral-400 mb-4">
            LIVE PREVIEW ToT META
          </h2>

          <div className="bg-black rounded-2xl border border-zinc-800 p-6 h-full overflow-y-auto space-y-5">
            {/* Header preview */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <div className="min-w-0">
                <p className="text-[11px] uppercase tracking-[0.18em] text-neutral-400">
                  ToT META PREVIEW
                </p>
                <h1 className="text-xl md:text-2xl font-semibold truncate">
                  {selectedTot?.philosofer ?? "Pilih ToT untuk preview"}
                </h1>
                {selectedTot && (
                  <div className="flex flex-wrap gap-2 mt-1 text-[11px] text-neutral-400">
                    {selectedTot.years && <span>{selectedTot.years}</span>}
                    {selectedTot.geoorigin && (
                      <span className="before:content-['•'] before:mx-1">
                        {selectedTot.geoorigin}
                      </span>
                    )}
                  </div>
                )}
              </div>
              <span
                className={[
                  "ml-auto inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium border",
                  !form.is_published
                    ? "bg-yellow-500/10 text-yellow-300 border-yellow-500/40"
                    : "bg-emerald-500/10 text-emerald-300 border-emerald-500/40",
                ].join(" ")}
              >
                {!form.is_published ? "Draft / Preview" : "Published"}
              </span>
            </div>

            {/* Metafisika */}
            {form.metafisika && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-[0.18em]">
                  Metafisika
                </p>
                <div
                  className="prose prose-invert max-w-none text-sm"
                  dangerouslySetInnerHTML={renderHtml(form.metafisika)}
                />
              </div>
            )}

            {/* Epistemologi */}
            {form.epsimologi && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-[0.18em]">
                  Epistemologi
                </p>
                <div
                  className="prose prose-invert max-w-none text-sm"
                  dangerouslySetInnerHTML={renderHtml(form.epsimologi)}
                />
              </div>
            )}

            {/* Aksiologi */}
            {form.aksiologi && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-[0.18em]">
                  Aksiologi
                </p>
                <div
                  className="prose prose-invert max-w-none text-sm"
                  dangerouslySetInnerHTML={renderHtml(form.aksiologi)}
                />
              </div>
            )}

            {/* Conclusion */}
            {form.conclusion && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-[0.18em]">
                  Conclusion
                </p>
                <div
                  className="prose prose-invert max-w-none text-sm"
                  dangerouslySetInnerHTML={renderHtml(form.conclusion)}
                />
              </div>
            )}

            {/* Jika kosong semua */}
            {!form.metafisika &&
              !form.epsimologi &&
              !form.aksiologi &&
              !form.conclusion && (
                <p className="text-xs text-neutral-500">
                  Isi salah satu bidang HTML di formulir (Metafisika /
                  Epistemologi / Aksiologi / Conclusion) untuk melihat preview
                  kontennya di sini.
                </p>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAddToTMetaPage;