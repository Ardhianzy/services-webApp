// src/features/magazine/components/MagazineCollectionSection.tsx
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "@/app/routes";
import { contentApi } from "@/lib/content/api";
import type { MagazineDTO } from "@/lib/content/types";

type UIMag = Pick<MagazineDTO, "id" | "slug" | "title" | "description" | "image"> & {
  created_at?: string | null;
};

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

  const chosen: UIMag | null = useMemo(() => {
    const fromBackend = list;
    if (!fromBackend || fromBackend.length < 2) return null;

    const sorted = [...fromBackend].sort((a, b) => {
      const ta = a.created_at ? new Date(a.created_at).getTime() : Number.POSITIVE_INFINITY;
      const tb = b.created_at ? new Date(b.created_at).getTime() : Number.POSITIVE_INFINITY;
      return ta - tb;
    });

    return sorted[0] ?? null;
  }, [list]);

  return (
    <section className="magcol">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Roboto:wght@300;400&display=swap');

        .magcol { width: 100% !important; background: #000 !important; padding: 4rem 2rem !important; overflow: hidden !important; }
        .magcol__container { max-width: 1307px !important; margin: 0 auto !important; position: relative !important; padding-bottom: 120px !important; }
        .magcol__title { font-family: 'Bebas Neue', sans-serif !important; font-weight: 400 !important; font-size: 68px !important; color: #fff !important; margin-bottom: 4rem !important; text-align: left !important; }
        .magcol__list { display: flex !important; flex-direction: column !important; gap: 5rem !important; }

        .magcol__article { display: flex !important; position: relative !important; height: 425px !important; align-items: center !important; flex-direction: row !important; border-left-style: var(--tw-border-style); border-left-width: 2px; border-color: #444444; border-radius: 16px; }
        .magcol__imgwrap { height: 100% !important; width: 60% !important; border-radius: 20px !important; overflow: hidden !important; position: relative !important; }
        .magcol__imgwrap::after { content: '' !important; position: absolute !important; inset: 0 !important; background-color: rgba(0,0,0,0.38) !important; border-radius: 20px !important; }
        .magcol__img { width: 100% !important; height: 100% !important; object-position: top center !important; object-fit: cover !important; filter: grayscale(1) !important; border-radius: 20px !important; display: block !important; }
        .magcol__content { position: absolute !important; width: 65% !important; height: 60% !important; padding: 2rem 4rem !important; display: flex !important; flex-direction: column !important; justify-content: center !important; color: #fff !important; top: 50% !important; transform: translateY(-50%) !important; border-radius: 20px !important; }
        .magcol__article:nth-child(odd)   { justify-content: flex-start !important; }
        .magcol__article:nth-child(odd) .magcol__content { right: 0 !important; align-items: flex-start !important; text-align: left !important; background: linear-gradient(to left, #171717 75.85%, rgba(23,23,23,0) 99.96%) !important; }
        .magcol__article:nth-child(even)  { justify-content: flex-end !important; }
        .magcol__article:nth-child(even) .magcol__content { left: 0 !important; align-items: flex-start !important; text-align: left !important; background: linear-gradient(to right, #171717 75.85%, rgba(23,23,23,0) 99.96%) !important; }
        .magcol__h3 { font-family: 'Bebas Neue', sans-serif !important; font-weight: 400 !important; font-size: 42px !important; line-height: 1.1 !important; color: #fff !important; margin: 0 0 .5rem 0 !important; text-shadow: 0 4px 50px rgba(0,0,0,0.25) !important; }
        .magcol__desc { font-family: 'Roboto', sans-serif !important; font-weight: 400 !important; font-size: 16px !important; line-height: 1.5 !important; text-align: justify !important; color: #fff !important; margin: 0 !important; }

        .fx-curtainDown { position: relative !important; overflow: hidden !important; }
        .fx-curtainDown::before {
          content: '' !important; position: absolute !important; inset: 0 !important; z-index: 2 !important;
          background: #000 !important;
          transform-origin: bottom !important;
          transform: scaleY(1) !important;
          transition: transform .6s cubic-bezier(.25,.8,.3,1) !important;
          pointer-events: none !important;
        }
        .fx-curtainDown.is-open::before { transform: scaleY(0) !important; }

        @media (max-width: 1350px) { .magcol__container { padding: 0 2rem !important; } }
        @media (max-width: 968px) {
          .magcol__article { flex-direction: column !important; height: auto !important; }
          .magcol__imgwrap, .magcol__content { position: static !important; width: 100% !important; transform: none !important; }
          .magcol__imgwrap { height: 300px !important; }
          .magcol__content { background: #171717 !important; border-radius: 20px !important; padding: 2rem !important; margin-top: -2rem !important; position: relative !important; z-index: 2 !important; }
        }
      `}</style>

      <div className="magcol__container">
        <h2 className="magcol__title">PREVIOUS MAGAZINE</h2>

        {(!chosen || loading) ? (
          <p
            className="text-white/80 text-center"
            style={{ fontFamily: "Roboto, sans-serif", fontSize: 16, lineHeight: 1.6 }}
          >
            No magazines available yet. Stay tuned!
          </p>
        ) : (
          <div className="magcol__list">
            <Link
              key={chosen.id}
              to={chosen.slug ? `/magazine/${chosen.slug}` : ROUTES.MAGAZINE}
              className="magcol__article group"
            >
              <div className="magcol__imgwrap">
                <img
                  src={chosen.image ?? "/assets/magazine/placeholder.png"}
                  alt={chosen.title}
                  className="magcol__img"
                />
              </div>
              <div className="magcol__content">
                <h3 className="magcol__h3">{chosen.title}</h3>
                {chosen.description ? (
                  <p className="magcol__desc">{chosen.description}</p>
                ) : null}
              </div>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}