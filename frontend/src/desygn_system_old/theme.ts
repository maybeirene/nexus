// Gestión del tema. Oscuro por defecto.
// Llama a initTheme() en main.tsx ANTES de renderizar React para evitar parpadeos.

export type ThemePreference = "dark" | "light" | "system";

const STORAGE_KEY = "nexus.theme";
const DEFAULT_PREFERENCE: ThemePreference = "dark";
const media = window.matchMedia("(prefers-color-scheme: dark)");

export function getThemePreference(): ThemePreference {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "dark" || stored === "light" || stored === "system") return stored;
  } catch {
    /* almacenamiento no disponible: usar valor por defecto */
  }
  return DEFAULT_PREFERENCE;
}

function resolve(pref: ThemePreference): "dark" | "light" {
  if (pref === "system") return media.matches ? "dark" : "light";
  return pref;
}

function apply(pref: ThemePreference): void {
  document.documentElement.dataset.theme = resolve(pref);
}

export function setThemePreference(pref: ThemePreference): void {
  try {
    localStorage.setItem(STORAGE_KEY, pref);
  } catch {
    /* se aplica igualmente en esta sesión */
  }
  apply(pref);
}

export function initTheme(): void {
  apply(getThemePreference());
  media.addEventListener("change", () => {
    if (getThemePreference() === "system") apply("system");
  });
}
