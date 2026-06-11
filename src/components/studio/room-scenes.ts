/**
 * Duvar odaklı oda sahneleri — neon tabela üst duvara yerleştirilir.
 * Görseller üst duvar alanına kırpılır; neonTop duvar üzerindeki Y konumu.
 */
export interface RoomScene {
  id: string;
  label: string;
  image: string;
  thumb: string;
  neonTop: string;
  objectPosition: string;
  neonScale?: number;
}

function wallUrl(id: string, w = 1600): string {
  return `https://images.unsplash.com/${id}?w=${w}&q=88&fit=crop&h=960&crop=top`;
}

function thumbUrl(id: string): string {
  return `https://images.unsplash.com/${id}?w=240&q=70&fit=crop&h=180&crop=top`;
}

export const roomScenes: RoomScene[] = [
  {
    id: "dark-loft",
    label: "Koyu Salon",
    image: wallUrl("photo-1618220179428-22790b461013"),
    thumb: thumbUrl("photo-1618220179428-22790b461013"),
    neonTop: "21%",
    objectPosition: "center 20%",
    neonScale: 0.94,
  },
  {
    id: "light-wall",
    label: "Açık Duvar",
    image: wallUrl("photo-1616486338812-3dadae4b4ace"),
    thumb: thumbUrl("photo-1616486338812-3dadae4b4ace"),
    neonTop: "15%",
    objectPosition: "center 12%",
    neonScale: 0.9,
  },
  {
    id: "brick-wall",
    label: "Tuğla Duvar",
    image: wallUrl("photo-1513694203232-719a280e022f"),
    thumb: thumbUrl("photo-1513694203232-719a280e022f"),
    neonTop: "18%",
    objectPosition: "center 16%",
    neonScale: 0.92,
  },
  {
    id: "bedroom",
    label: "Yatak Odası",
    image: wallUrl("photo-1617806118233-18e1de247200"),
    thumb: thumbUrl("photo-1617806118233-18e1de247200"),
    neonTop: "17%",
    objectPosition: "center 14%",
    neonScale: 0.86,
  },
  {
    id: "cafe",
    label: "Cafe / Dükkan",
    image: wallUrl("photo-1554118811-1e0d58224f24"),
    thumb: thumbUrl("photo-1554118811-1e0d58224f24"),
    neonTop: "13%",
    objectPosition: "center 10%",
    neonScale: 0.96,
  },
  {
    id: "minimal",
    label: "Minimal Beyaz",
    image: wallUrl("photo-1615529328331-f8917597711f"),
    thumb: thumbUrl("photo-1615529328331-f8917597711f"),
    neonTop: "19%",
    objectPosition: "center 16%",
    neonScale: 0.9,
  },
];
