// src/data/philosophers.ts
import type { Philosopher as PhilosopherCore } from "@/types/philosophy";

export type Philosopher = PhilosopherCore & {
  bookIds?: string[];
};

export const philosophers: Philosopher[] = [
  {
    id: "nietzsche",
    name: "Friedrich Nietzsche",
    image: "/assets/readingGuide/friedrich.jpg",
    birthDate: "15 OCT 1844",
    deathDate: "25 AUG 1900",
    birthPlace: "Röcken, Lützen, Jerman",
    deathPlace: "Weimar, Jerman",
    desc:
      "Friedrich Nietzsche (1844–1900) adalah filsuf Jerman yang mengguncang fondasi moral religius Eropa dengan kritiknya terhadap moralitas dan klaim 'Tuhan telah mati'. Gagasannya berpengaruh pada eksistensialisme, psikoanalisis, hingga kritik budaya modern.",
    bookIds: ["b-025", "b-026", "b-028"],
  },

  {
    id: "nietzsche",
    name: "Friedrich Nietzsche",
    image: "/assets/philosophers/Friedrich Nietzsche.jpg",
    birthDate: "15 OCT 1844",
    deathDate: "25 AUG 1900",
    birthPlace: "Röcken, Lützen, Jerman",
    deathPlace: "Weimar, Jerman",
    descript:
      "Friedrich Nietzsche (1844–1900) adalah filsuf Jerman yang mengguncang fondasi moral religius Eropa dengan kritiknya terhadap moralitas dan klaim 'Tuhan telah mati'. Gagasannya berpengaruh pada eksistensialisme, psikoanalisis, hingga kritik budaya modern.",
    description: `Friedrich Nietzsche adalah filsuf Jerman yang mengguncang fondasi moral religius Eropa dengan seruannya bahwa “Tuhan telah mati.” Berangkat dari latar filologi klasik, ia merumuskan konsep nihilisme—krisis makna setelah runtuhnya nilai tradisional—dan menawarkan gagasan Übermensch, sosok yang menciptakan nilai baru melalui “kehendak untuk berkuasa.” Lewat karya-karya seperti Thus Spoke Zarathustra dan Beyond Good and Evil, Nietzsche mendorong penilaian ulang moralitas, menolak kepasrahan, dan menantang kita untuk mengafirmasi kehidupan sepenuhnya, bahkan jika harus mengulanginya tanpa akhir. Warisannya membekas kuat dalam eksistensialisme, psikoanalisis, dan kritik budaya modern.`,
    bookIds: ["b-025", "b-026", "b-028"],
  },
  {
    id: "camus",
    name: "Albert Camus",
    image: "/assets/philosophers/Albert Camus.jpg",
    birthDate: "07 NOV 1913",
    deathDate: "04 JAN 1960",
    birthPlace: "Mondovi, Aljazair Prancis",
    deathPlace: "Villeblevin, Prancis",
    description:
      "Albert Camus adalah penulis dan pemikir Prancis kelahiran Aljazair; tokoh utama absurdisme yang mengeksplorasi benturan pencarian makna dengan kebisuan alam semesta.",
    bookIds: ["b-101", "b-102"],
  },

  {
    id: "nietzsche",
    name: "Friedrich Nietzsche",
    image: "/assets/readingGuide/friedrich.jpg",
    description:
      "Friedrich Nietzsche (1844 – 1900) adalah filsuf Jerman yang dikenal karena pemikirannya yang radikal tentang moralitas, agama, dan makna hidup.",
  },
  {
    id: "marx",
    name: "Karl Marx",
    image: "/assets/readingGuide/Karl Marx - Wikipedia.jpeg",
    description:
      "Karl Heinrich Marx (1818–1883) adalah filsuf Jerman, ekonom politik, dan revolusioner; perintis materialisme historis dan kritik kapitalisme.",
  },
  {
    id: "scheler",
    name: "Max Scheler",
    image: "/assets/readingGuide/Max Scheler (1).jpeg",
    description:
      "Max Scheler (1874–1928) adalah filsuf Jerman, tokoh utama fenomenologi dan filsafat nilai (aksiologi) dengan fokus pada ordo amoris.",
  },
  {
    id: "dilthey",
    name: "Wilhelm Dilthey",
    image: "/assets/readingGuide/Wilhelm Dilthey (1833 – 1911).jpeg",
    description:
      "Wilhelm Dilthey (1833–1911) adalah filsuf dan sejarawan Jerman; pelopor hermeneutika modern dan pembeda Naturwissenschaften vs Geisteswissenschaften.",
  },
];

export const philosophersHomeIds: Array<Philosopher["id"]> = [
  "marx",
  "nietzsche",
  "scheler",
  "dilthey",
];

type MarkerPhilosopher = PhilosopherCore & {
  years: string;
  born?: number;
  died?: number;
  coordinates: [number, number];
};

export const philosopherMarkers: MarkerPhilosopher[] = [
  {
    id: "nietzsche",
    name: "Friedrich Nietzsche",
    years: "1844–1900",
    born: 1844,
    died: 1900,
    image: "/assets/philosophers/Friedrich Nietzsche.jpg",
    flag: "/assets/philosophers/GERMANY.jpg",
    coordinates: [51.3397, 12.3731],
  },
  {
    id: "camus",
    name: "Albert Camus",
    years: "1913–1960",
    born: 1913,
    died: 1960,
    image: "/assets/philosophers/Albert Camus.jpg",
    flag: "/assets/philosophers/FRANCE.jpg",
    coordinates: [48.8566, 2.3522],
  },
];

export type TimelinePhilosopher = {
  id: string | number;
  name: string;
  years: string;
  lat: number;
  lng: number;
  image?: string;
  flag?: string;
};

export const timelinePhilosophers: TimelinePhilosopher[] = philosopherMarkers
  .filter(
    (m) => !!m.years && Array.isArray(m.coordinates) && m.coordinates.length === 2
  )
  .map((m) => ({
    id: m.id,
    name: m.name,
    years: m.years!,
    lat: m.coordinates![0],
    lng: m.coordinates![1],
    image: m.image,
    flag: m.flag,
  }));

export default philosophers;