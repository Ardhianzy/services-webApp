// src/features/home/components/TimelineOfThoughtHybrid.tsx
import TimelineOfThoughtSection from "./TimelineOfThoughtSection";
import { useHybridTimelinePhilosophers } from "@/features/tot/hooks";
import { timelinePhilosophers as fallbackPhilosophers } from "@/data/philosophers";

export default function TimelineOfThoughtHybrid() {
  const { philosophers, error } = useHybridTimelinePhilosophers();
//   const { philosophers, loading, error } = useHybridTimelinePhilosophers();

//   efek loading di bawah ini biar keren
//   if (loading) return <section className="h-[600px] bg-black text-white grid place-items-center">Loading Timeline...</section>;
   // Walau error (BE down), kita tetap render pakai data fallback/dummy
  const list = philosophers?.length ? philosophers : fallbackPhilosophers;
  return (
    <>
      {error && <div className="sr-only">Using fallback data for timeline.</div>}
      <TimelineOfThoughtSection philosophers={list} />
    </>
  );

  return <TimelineOfThoughtSection philosophers={philosophers} />;
}