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
  is_published: false,
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

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1.25fr)_minmax(0,1.1fr)]">
        <form
          onSubmit={handleSubmit}
          className="bg-zinc-950/60 border border-zinc-800 rounded-3xl p-6 space-y-6"
        >
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

          {error && <p className="text-sm text-red-400 mt-1">{error}</p>}

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

        <div className="bg-zinc-950/60 border border-zinc-800 rounded-3xl p-6 overflow-hidden flex flex-col">
          <h2 className="text-sm font-medium tracking-[0.15em] text-neutral-400 mb-4">
            LIVE PREVIEW ToT META
          </h2>

          <div className="bg-black rounded-2xl border border-zinc-800 p-6 h-full overflow-y-auto space-y-5">
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

            {form.metafisika && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-[0.18em]">
                  Metafisika
                </p>
                <div
                  className="admin-totmeta-html"
                  dangerouslySetInnerHTML={renderHtml(form.metafisika)}
                />
              </div>
            )}

            {form.epsimologi && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-[0.18em]">
                  Epistemologi
                </p>
                <div
                  className="admin-totmeta-html"
                  dangerouslySetInnerHTML={renderHtml(form.epsimologi)}
                />
              </div>
            )}

            {form.aksiologi && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-[0.18em]">
                  Aksiologi
                </p>
                <div
                  className="admin-totmeta-html"
                  dangerouslySetInnerHTML={renderHtml(form.aksiologi)}
                />
              </div>
            )}

            {form.conclusion && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-[0.18em]">
                  Conclusion
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
                <p className="text-xs text-neutral-500">
                  Isi salah satu bidang HTML di formulir (Metafisika /
                  Epistemologi / Aksiologi / Conclusion) untuk melihat preview
                  kontennya di sini.
                </p>
              )}
          </div>
        </div>
      </div>

      <style>{`
        .admin-totmeta-html{
          font-family: Roboto, ui-sans-serif, system-ui;
          font-size: 1.02rem;
          line-height: 1.85;
          color: #fff;
          text-align: justify;
          text-justify: inter-word;
          hyphens: auto;
          word-break: break-word;
        }
        .admin-totmeta-html h1,
        .admin-totmeta-html h2,
        .admin-totmeta-html h3,
        .admin-totmeta-html h4{
          font-family: Roboto, ui-sans-serif, system-ui;
          font-weight: 700;
          line-height: 1.25;
          margin: .85em 0 .45em;
          letter-spacing: .2px;
        }
        .admin-totmeta-html h1{font-size:1.15rem}
        .admin-totmeta-html h2{font-size:1.08rem}
        .admin-totmeta-html h3{font-size:1.04rem}
        .admin-totmeta-html h4{font-size:1.02rem}
        .admin-totmeta-html p{margin:0 0 1em}
        .admin-totmeta-html blockquote{
          margin:1em 0;
          padding:.75em 1em;
          border-left:3px solid rgba(255,255,255,.35);
          background:rgba(255,255,255,.04);
          border-radius:8px;
        }
        .admin-totmeta-html blockquote p{margin:.4em 0}
        .admin-totmeta-html blockquote footer{
          margin-top:.55em;
          opacity:.85;
          font-size:.92em;
        }
        .admin-totmeta-html ul,
        .admin-totmeta-html ol{
          margin:.6em 0 1.1em;
          padding-left:1.3em;
        }
        .admin-totmeta-html ul{list-style:disc}
        .admin-totmeta-html ol{list-style:decimal}
        .admin-totmeta-html img,
        .admin-totmeta-html video,
        .admin-totmeta-html iframe{
          max-width:100%;
          height:auto;
        }
        .admin-totmeta-html a{
          color:#fff;
          text-decoration:underline;
          text-underline-offset:2px;
          text-decoration-color:rgba(255,255,255,.6);
        }
        .admin-totmeta-html em,
        .admin-totmeta-html i{
          font-style: italic;
        }
        .admin-totmeta-html strong,
        .admin-totmeta-html b{
          font-weight: 700;
        }
        .admin-totmeta-html code{
          font-family: "Space Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
          font-size: 0.9em;
          background: rgba(255,255,255,.06);
          padding: .1em .3em;
          border-radius: 4px;
        }
        .admin-totmeta-html pre{
          font-family: "Space Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
          font-size: 0.9em;
          background: rgba(255,255,255,.06);
          padding: .8em 1em;
          border-radius: 8px;
          overflow-x: auto;
        }
        .admin-totmeta-html sup{
          font-size: 0.75em;
          vertical-align: super;
        }
        .admin-totmeta-html sub{
          font-size: 0.75em;
          vertical-align: sub;
        }
        .admin-totmeta-html hr{
          border: 0;
          border-top: 1px solid rgba(255,255,255,.28);
          margin: 1.5em 0;
        }

        .admin-totmeta-html table{
          width: 100%;
          border-collapse: collapse;
          margin: 1.1em 0;
          font-size: 0.98rem;
          text-align: left;
        }
        .admin-totmeta-html thead th{
          background: rgba(255,255,255,.06);
          font-weight: 700;
        }
        .admin-totmeta-html th,
        .admin-totmeta-html td{
          border: 1px solid rgba(255,255,255,.28);
          padding: .55em .8em;
          vertical-align: top;
          text-align: left;
          text-justify: auto;
          hyphens: auto;
          word-break: break-word;
        }
        .admin-totmeta-html tbody tr:nth-child(even){
          background: rgba(255,255,255,.02);
        }

        @media (max-width: 768px){
          .admin-totmeta-html{
            font-size:1rem;
            line-height:1.8;
          }
          .admin-totmeta-html table{
            display: block;
            width: 100%;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminAddToTMetaPage;