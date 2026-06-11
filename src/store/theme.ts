import { create } from "zustand";
import { persist } from "zustand/middleware";

type Theme = "dark" | "light";

interface ThemeState {
  theme: Theme;
  currency: "TRY" | "USD" | "EUR";
  locale: "tr" | "en";
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  setCurrency: (currency: "TRY" | "USD" | "EUR") => void;
  setLocale: (locale: "tr" | "en") => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: "light",
      currency: "TRY",
      locale: "tr",
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set({ theme: get().theme === "dark" ? "light" : "dark" }),
      setCurrency: (currency) => set({ currency }),
      setLocale: (locale) => set({ locale }),
    }),
    { name: "premium-store-settings-v2" }
  )
);
