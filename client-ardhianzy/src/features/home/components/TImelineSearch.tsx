// src/features/home/components/TimelineSearch.tsx
import { useEffect, useState, useRef } from "react";
import type { TimelinePhilosopher } from "./TimelineOfThoughtSection";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  data: TimelinePhilosopher[];
  onSelect: (philosopher: TimelinePhilosopher) => void;
};

export default function TimelineSearch({ isOpen, onClose, data, onSelect }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<TimelinePhilosopher[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      setQuery("");
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const lowerQ = query.toLowerCase();
    const filtered = data.filter((p) => {
      const name = (p.name || "").toLowerCase();
      const years = (p.years || "").toLowerCase();
      const origin = (p.geoorigin || "").toLowerCase();
      const loc = (p.detail_location || "").toLowerCase();

      return (
        name.includes(lowerQ) ||
        years.includes(lowerQ) ||
        origin.includes(lowerQ) ||
        loc.includes(lowerQ)
      );
    });

    setResults(filtered.slice(0, 10));
  }, [query, data]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    }
    if (e.key === "Enter" && results.length > 0) {
      onSelect(results[0]);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1500] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[4px]"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative z-[1501] w-[90%] max-w-[600px] flex flex-col gap-2 animate-in fade-in zoom-in duration-200">
        <div className="relative flex items-center bg-[#1a1a1a] border border-white/20 rounded-lg shadow-2xl overflow-hidden">
          <div className="pl-4 text-white/50">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
          
          <input
            ref={inputRef}
            type="text"
            className="flex-1 bg-transparent px-4 py-4 text-lg text-white placeholder-white/40 focus:outline-none font-sans"
            placeholder="Search philosopher, year, or location..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />

          {query && (
            <button
              onClick={() => setQuery("")}
              className="pr-4 text-white/50 hover:text-white transition"
            >
              ✕
            </button>
          )}
        </div>

        {results.length > 0 && (
          <div className="bg-[#1a1a1a] border border-white/10 rounded-lg shadow-xl overflow-hidden max-h-[300px] overflow-y-auto custom-scrollbar">
            {results.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  onSelect(p);
                  onClose();
                }}
                className="w-full text-left px-4 py-3 border-b border-white/5 last:border-0 hover:bg-white/10 transition flex items-center gap-3"
              >
                {p.image ? (
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-10 h-10 rounded-full object-cover bg-black border border-white/20"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-xs">
                    ?
                  </div>
                )}
                <div>
                  <div className="text-white font-medium text-base tracking-wide" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                    {p.name}
                  </div>
                  <div className="text-white/50 text-xs">
                    {p.years} • {p.geoorigin || p.detail_location || "Unknown Location"}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
        
        {query && results.length === 0 && (
           <div className="bg-[#1a1a1a] border border-white/10 rounded-lg p-4 text-white/50 text-center text-sm">
             No results found for "{query}"
           </div>
        )}
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #111;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #444;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #666;
        }
      `}</style>
    </div>
  );
}