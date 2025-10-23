import type { IdeaArticle } from "./types";

export const dummyIdeaDetail: IdeaArticle = {
  id: "wille-zur-macht",
  slug: "apa-itu-wille-zur-macht",
  title: "Apa Itu Wille zur Macht?",
  hero: {
    src: "/assets/ideas/wille-zur-macht.jpg",
    alt: "Friedrich Nietzsche — Wille zur Macht",
  },
  blocks: [
    {
      type: "paragraph",
      html:
        "Friedrich Nietzsche dikenal sebagai filsuf yang mengguncang fondasi pemikiran Barat. Ia menolak kenyamanan dogma ... <em>Wille zur Macht</em> adalah prinsip mendasar dari kehidupan itu sendiri—dorongan vital yang membuat segala sesuatu ada, tumbuh, dan bergerak.",
    },
    { type: "h2", text: "Bukan Sekadar Hasrat untuk Mendominasi" },
    {
      type: "paragraph",
      html:
        "Nietzsche tidak pernah menulis satu buku sistematis berjudul <em>Wille zur Macht</em> ... realitas tidak lain adalah arus dorongan hidup yang dinamis.",
    },
    { type: "h2", text: "Dari Individu ke Kosmos" },
    {
      type: "paragraph",
      html:
        "Pada tingkat individu, dorongan ini tampak dalam penciptaan dan penaklukan diri; pada tingkat kosmos, dunia adalah pergumulan kekuatan yang tiada henti.",
    },
    { type: "h2", text: "Implikasi Etis: Mengatakan 'Ya' pada Hidup" },
    {
      type: "paragraph",
      html:
        "<em>Amor fati</em>, <em>Übermensch</em>, dan <em>Wille zur Macht</em> membentuk visi untuk mengafirmasi hidup—bukan sekadar bertahan, tetapi mencipta nilai baru.",
    },
    { type: "h2", text: "Penutup" },
    {
      type: "paragraph",
      html:
        "<em>Wille zur Macht</em> adalah ajakan untuk menari bersama arus kehidupan: menjadikan keterbatasan sebagai pijakan untuk bertumbuh.",
    },
  ],
};