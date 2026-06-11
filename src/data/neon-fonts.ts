export interface NeonFont {
  id: string;
  name: string;
  family: string;
  file: string;
}

const FONT_FILES = [
  "Alexa.ttf",
  "Amanda.ttf",
  "Amsterdam.ttf",
  "Austin.ttf",
  "Avante.ttf",
  "Barcelona.ttf",
  "Bayview.ttf",
  "Beachfront.ttf",
  "Bellview.ttf",
  "Buttercup.ttf",
  "Chelsea.ttf",
  "ClassicType.ttf",
  "Freehand.ttf",
  "Freespirit.ttf",
  "Greenworld.ttf",
  "LoveNeon.ttf",
  "LoveNote.ttf",
  "Marquee.ttf",
  "Mayfair.ttf",
  "Melbourne.ttf",
  "Monaco.ttf",
  "NeonGlow.ttf",
  "NeonLite.ttf",
  "Neonscript.ttf",
  "Neontrace.ttf",
  "NeoTokyo.ttf",
  "Nevada.ttf",
  "NewCursive.ttf",
  "Northshore.ttf",
  "Photogenic.ttf",
  "Rocket.ttf",
  "Royalty.ttf",
  "SciFi.ttf",
  "Signature.ttf",
  "Sorrento.ttf",
  "Typewriter.ttf",
  "Venetian.ttf",
  "Vintage.ttf",
  "Waikiki.ttf",
  "WildScript.ttf",
] as const;

function toFontName(file: string): string {
  return file.replace(/\.ttf$/i, "");
}

export const neonFonts: NeonFont[] = FONT_FILES.map((file) => {
  const name = toFontName(file);
  return {
    id: name.toLowerCase(),
    name,
    family: `Neon-${name}`,
    file: `/fonts/neon/${file}`,
  };
});

export const defaultNeonFont = neonFonts.find((f) => f.id === "nevada")!;

export function getNeonFontById(id: string): NeonFont {
  return neonFonts.find((f) => f.id === id) ?? defaultNeonFont;
}

export function buildLocalFontsCss(): string {
  return neonFonts
    .map(
      (font) => `@font-face {
  font-family: "${font.family}";
  src: url("${font.file}") format("truetype");
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}`
    )
    .join("\n");
}
