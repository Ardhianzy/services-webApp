// src/features/magazine/components/MagazineCollectionSection.tsx
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "@/app/routes";
import { contentApi } from "@/lib/content/api";
import type { MagazineDTO } from "@/lib/content/types";

type UIMag = Pick<MagazineDTO, "id" | "slug" | "title" | "description" | "image"> & {
  created_at?: string | null;
  pdf_uploaded_at?: string | null;
};

function normalizeBackendHtml(payload?: string | null): string {
  if (!payload) return "";
  let s = String(payload).trim();
  s = s.replace(/\\u003C/gi, "<").replace(/\\u003E/gi, ">").replace(/\\u0026/gi, "&");
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) s = s.slice(1, -1);
  return s;
}
function sanitizeBasicHtml(html: string): string {
  let out = html;
  out = out.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "");
  out = out.replace(/\son[a-z]+\s*=\s*"(?:[^"]*)"/gi, "");
  out = out.replace(/\son[a-z]+\s*=\s*'(?:[^']*)'/gi, "");
  out = out.replace(/\son[a-z]+\s*=\s*[^>\s]+/gi, "");
  out = out.replace(/(href|src)\s*=\s*"(?:\s*javascript:[^"]*)"/gi, '$1="#"');
  out = out.replace(/(href|src)\s*=\s*'(?:\s*javascript:[^']*)'/gi, '$1="#"');
  return out;
}

type Props = {
  items?: Pick<MagazineDTO, "id" | "slug" | "title" | "description" | "image">[];
};

export default function MagazineCollectionSection({ items }: Props) {
  const [list, setList] = useState<UIMag[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);

        if (!items || items.length === 0) {
          const all = await contentApi.magazines.list();
          if (!alive) return;

          const mapped: UIMag[] = (all ?? []).map((m) => ({
            id: m.id,
            slug: m.slug,
            title: m.title,
            description: m.description,
            image: m.image,
            created_at: (m as any).created_at ?? null,
            pdf_uploaded_at: (m as any).pdf_uploaded_at ?? null,
          }));

          setList(mapped);
        } else {
          setList([]);
        }
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [items]);

  const rest: UIMag[] = useMemo(() => {
    const fromBackend = list ?? [];
    const sortedDesc = [...fromBackend].sort((a, b) => {
      const ta = new Date((a.pdf_uploaded_at || a.created_at || "") as string).getTime();
      const tb = new Date((b.pdf_uploaded_at || b.created_at || "") as string).getTime();
      return (tb || 0) - (ta || 0);
    });
    return sortedDesc.slice(1);
  }, [list]);

  const showComingSoonCard = !loading && list.length <= 1;

  return (
    <section className="magcol">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Roboto:wght@300;400&display=swap');

        .magcol { width: 100% !important; background: #000 !important; padding: 4rem 2rem !important; overflow: hidden !important; }
        .magcol__container { max-width: 1307px !important; margin: 0 auto !important; position: relative !important; padding-bottom: 120px !important; }
        .magcol__title { font-family: 'Bebas Neue', sans-serif !important; font-weight: 400 !important; font-size: 48px !important; color: #fff !important; margin-bottom: 4rem !important; text-align: left !important; border-top-width: 1px !important; border-color: #ffffff !important; padding-top: 20px !important; }
        .magcol__list { display: flex !important; flex-direction: column !important; gap: 5rem !important; }

        .magcol__article { display: flex !important; position: relative !important; height: 425px !important; align-items: center !important; flex-direction: row !important; border-left-style: var(--tw-border-style); border-left-width: 2px; border-color: #444444; border-radius: 16px; }
        .magcol__imgwrap { height: 100% !important; width: 60% !important; border-radius: 20px !important; overflow: hidden !important; position: relative !important; }
        .magcol__imgwrap::after { content: '' !important; position: absolute !important; inset: 0 !important; background-color: rgba(0,0,0,0.38) !important; border-radius: 20px !important; }
        .magcol__img { width: 100% !important; height: 100% !important; object-position: top center !important; object-fit: cover !important; filter: grayscale(1) !important; border-radius: 20px !important; display: block !important; }

        .magcol__img__soon { width: 100% !important; height: 100% !important; padding: 56px !important; object-position: center !important; object-fit: contain !important; filter: grayscale(1) !important; border-radius: 20px !important; display: block !important; }

        .magcol__content { position: absolute !important; width: 65% !important; height: 60% !important; padding: 2rem 4rem !important; display: flex !important; flex-direction: column !important; justify-content: center !important; color: #fff !important; top: 50% !important; transform: translateY(-50%) !important; border-radius: 20px !important; }
        .magcol__article:nth-child(odd)   { justify-content: flex-start !important; }
        .magcol__article:nth-child(odd) .magcol__content { right: 0 !important; align-items: flex-start !important; text-align: left !important; background: linear-gradient(to left, #171717 75.85%, rgba(23,23,23,0) 99.96%) !important; }
        .magcol__article:nth-child(even)  { justify-content: flex-end !important; }
        .magcol__article:nth-child(even) .magcol__content { left: 0 !important; align-items: flex-start !important; text-align: left !important; background: linear-gradient(to right, #171717 75.85%, rgba(23,23,23,0) 99.96%) !important; }
        .magcol__h3 { font-family: 'Bebas Neue', sans-serif !important; font-weight: 400 !important; font-size: 42px !important; line-height: 1.1 !important; color: #fff !important; margin: 0 0 .5rem 0 !important; text-shadow: 0 4px 50px rgba(0,0,0,0.25) !important; }
        .magcol__desc { font-family: 'Roboto', sans-serif !important; font-weight: 400 !important; font-size: 16px !important; line-height: 1.5 !important; text-align: justify !important; color: #fff !important; margin: 0 !important; }

        @media (max-width: 1350px) { .magcol__container { padding: 0 0rem !important; } }
        @media (max-width: 968px) {
          .magcol__article { flex-direction: column !important; height: auto !important; }
          .magcol__imgwrap, .magcol__content { position: static !important; width: 100% !important; transform: none !important; }
          .magcol__imgwrap { height: 300px !important; }
          .magcol__content { background: #171717 !important; border-radius: 20px !important; padding: 2rem !important; margin-top: -2rem !important; position: relative !important; z-index: 2 !important; }
        }

        @media (max-width: 640px) {
          .magcol { padding-top: 3rem !important; padding-bottom: 3rem !important; }
          .magcol__container { padding-bottom: 72px !important; }
          .magcol__title {
            font-size: 2.4rem !important;
            margin-bottom: 2rem !important;
            padding-top: 14px !important;
          }
          .magcol__list { gap: 2.5rem !important; }

          .magcol__article { border-left-width: 1px !important; border-radius: 14px !important; }
          .magcol__imgwrap { height: 240px !important; border-radius: 16px !important; }
          .magcol__imgwrap::after { border-radius: 16px !important; }
          .magcol__img { border-radius: 16px !important; }
          .magcol__img__soon { border-radius: 16px !important; padding: 32px !important; }

          .magcol__content {
            padding: 1.25rem 1.25rem !important;
            margin-top: -1.25rem !important;
            border-radius: 16px !important;
          }

          .magcol__h3 { font-size: 2.4rem !important; }
          .magcol__desc {
            font-size: 0.95rem !important;
            line-height: 1.65 !important;
            display: -webkit-box !important;
            -webkit-line-clamp: 6 !important;
            -webkit-box-orient: vertical !important;
            overflow: hidden !important;
          }
        }

        @media (max-width: 420px) {
          .magcol__imgwrap { height: 220px !important; }
          .magcol__content { padding: 1.1rem 1.1rem !important; }
          .magcol__desc { -webkit-line-clamp: 5 !important; }
        }
      `}</style>

      <div className="magcol__container">
        <h2 className="magcol__title">PREVIOUS MAGAZINE</h2>

        {showComingSoonCard ? (
          <div className="magcol__list">
            <div className="magcol__article group">
              <div className="magcol__imgwrap">
                <img
                  src={"/assets/magazine/placeholder.png"}
                  alt="Coming Soon"
                  className="magcol__img__soon"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = "/assets/icon/Ardhianzy_Logo_2.png";
                  }}
                />
              </div>
              <div className="magcol__content">
                <h3 className="magcol__h3">COMING SOON</h3>
                <p className="magcol__desc">
                  Our next magazine edition is currently in preparation. Stay tuned!
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="magcol__list">
            {rest.map((m) => (
              <Link
                key={m.id}
                to={m.slug ? `/magazine/${m.slug}` : ROUTES.MAGAZINE}
                className="magcol__article group"
              >
                <div className="magcol__imgwrap">
                  <img
                    src={m.image ?? "/assets/magazine/placeholder.png"}
                    alt={m.title}
                    className="magcol__img"
                  />
                </div>
                <div className="magcol__content">
                  <h3 className="magcol__h3">{m.title}</h3>
                  {m.description ? (
                    <p
                      className="magcol__desc"
                      dangerouslySetInnerHTML={{
                        __html: sanitizeBasicHtml(normalizeBackendHtml(m.description)),
                      }}
                    />
                  ) : null}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}