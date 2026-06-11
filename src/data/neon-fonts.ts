export type NeonFontVariant = "script" | "outline" | "neon-outline" | "thin-outline" | "block";

export interface NeonFont {
  id: string;
  name: string;
  family: string;
  weight?: number;
  style?: "normal" | "italic";
  letterSpacing?: string;
  textTransform?: "none" | "uppercase" | "lowercase";
  variant?: NeonFontVariant;
  googleQuery: string;
}

export const neonFonts: NeonFont[] = [
  { id: "alexa", name: "Alexa", family: "Great Vibes", weight: 400, googleQuery: "Great+Vibes" },
  { id: "barcelona", name: "Barcelona", family: "Sacramento", weight: 400, googleQuery: "Sacramento" },
  { id: "bayview", name: "Bayview", family: "Allura", weight: 400, googleQuery: "Allura" },
  { id: "amsterdam", name: "Amsterdam", family: "Parisienne", weight: 400, googleQuery: "Parisienne" },
  { id: "greenworld", name: "Greenworld", family: "Courgette", weight: 400, googleQuery: "Courgette" },
  { id: "newcursive", name: "NewCursive", family: "Kaushan Script", weight: 400, googleQuery: "Kaushan+Script" },
  { id: "vintage", name: "Vintage", family: "Playfair Display", weight: 700, style: "italic", googleQuery: "Playfair+Display:ital,wght@1,700" },
  { id: "venetian", name: "Venetian", family: "Cormorant Upright", weight: 500, style: "italic", googleQuery: "Cormorant+Upright:ital,wght@1,500" },
  { id: "amanda", name: "Amanda", family: "Satisfy", weight: 400, googleQuery: "Satisfy" },
  { id: "austin", name: "Austin", family: "Yellowtail", weight: 400, googleQuery: "Yellowtail" },
  { id: "beachfront", name: "Beachfront", family: "Lobster", weight: 400, googleQuery: "Lobster" },
  { id: "chelsea", name: "Chelsea", family: "Cookie", weight: 400, googleQuery: "Cookie" },
  { id: "freehand", name: "Freehand", family: "Permanent Marker", weight: 400, googleQuery: "Permanent+Marker" },
  { id: "freespirit", name: "Freespirit", family: "Shadows Into Light", weight: 400, googleQuery: "Shadows+Into+Light" },
  { id: "lovenote", name: "LoveNote", family: "Marck Script", weight: 400, googleQuery: "Marck+Script" },
  { id: "neonscript", name: "Neonscript", family: "Racing Sans One", weight: 400, googleQuery: "Racing+Sans+One" },
  { id: "northshore", name: "Northshore", family: "Bebas Neue", weight: 400, googleQuery: "Bebas+Neue" },
  { id: "photogenic", name: "Photogenic", family: "Abril Fatface", weight: 400, googleQuery: "Abril+Fatface" },
  { id: "royalty", name: "Royalty", family: "Cinzel", weight: 600, googleQuery: "Cinzel:wght@600" },
  { id: "rocket", name: "Rocket", family: "Orbitron", weight: 700, googleQuery: "Orbitron:wght@700" },
  { id: "signature", name: "Signature", family: "Mr Dafoe", weight: 400, googleQuery: "Mr+Dafoe" },
  { id: "sorrento", name: "Sorrento", family: "Tangerine", weight: 700, googleQuery: "Tangerine:wght@700" },
  { id: "wildscript", name: "WildScript", family: "Bilbo Swash Caps", weight: 400, googleQuery: "Bilbo+Swash+Caps" },
  { id: "avante", name: "Avante", family: "Montserrat", weight: 600, googleQuery: "Montserrat:wght@600" },
  { id: "buttercup", name: "Buttercup", family: "Grape Nuts", weight: 400, googleQuery: "Grape+Nuts" },
  { id: "classictype", name: "ClassicType", family: "Libre Baskerville", weight: 700, googleQuery: "Libre+Baskerville:wght@700" },
  { id: "typewriter", name: "Typewriter", family: "Special Elite", weight: 400, googleQuery: "Special+Elite" },
  { id: "melbourne", name: "Melbourne", family: "Raleway", weight: 500, googleQuery: "Raleway:wght@500" },
  { id: "neotokyo", name: "NeoTokyo", family: "Michroma", weight: 400, googleQuery: "Michroma" },
  { id: "monaco", name: "MONACO", family: "Major Mono Display", weight: 400, textTransform: "uppercase", googleQuery: "Major+Mono+Display" },
  { id: "waikiki", name: "WAIKIKI", family: "Quicksand", weight: 600, textTransform: "uppercase", letterSpacing: "0.15em", googleQuery: "Quicksand:wght@600" },
  { id: "bellview", name: "Bellview", family: "Alex Brush", weight: 400, variant: "outline", googleQuery: "Alex+Brush" },
  { id: "loveneon", name: "LOVENEON", family: "Bebas Neue", weight: 400, textTransform: "uppercase", variant: "neon-outline", letterSpacing: "0.12em", googleQuery: "Bebas+Neue" },
  { id: "marquee", name: "MARQUEE", family: "Oswald", weight: 700, textTransform: "uppercase", variant: "neon-outline", letterSpacing: "0.1em", googleQuery: "Oswald:wght@700" },
  { id: "mayfair", name: "Mayfair", family: "Pinyon Script", weight: 400, variant: "outline", googleQuery: "Pinyon+Script" },
  { id: "neonglow", name: "NeonGlow", family: "Monoton", weight: 400, variant: "outline", googleQuery: "Monoton" },
  { id: "neonlite", name: "NEONLITE", family: "Jost", weight: 200, textTransform: "uppercase", variant: "thin-outline", letterSpacing: "0.25em", googleQuery: "Jost:wght@200" },
  { id: "neontrace", name: "NEONTRACE", family: "Syncopate", weight: 700, textTransform: "uppercase", variant: "thin-outline", letterSpacing: "0.08em", googleQuery: "Syncopate:wght@700" },
  { id: "nevada", name: "Nevada", family: "Sacramento", weight: 400, variant: "script", googleQuery: "Sacramento" },
  { id: "scifi", name: "SCIFI", family: "Exo 2", weight: 700, textTransform: "uppercase", variant: "block", letterSpacing: "0.2em", googleQuery: "Exo+2:wght@700" },
];

export const defaultNeonFont = neonFonts.find((f) => f.id === "nevada")!;

export function getNeonFontById(id: string): NeonFont {
  return neonFonts.find((f) => f.id === id) ?? defaultNeonFont;
}

export function buildGoogleFontsUrl(): string {
  const queries = [...new Set(neonFonts.map((f) => f.googleQuery))];
  return `https://fonts.googleapis.com/css2?${queries.map((q) => `family=${q}`).join("&")}&display=swap`;
}
