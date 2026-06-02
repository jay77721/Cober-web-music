import { create } from "zustand"

export interface ThemePreset {
  name: string
  label: string
  color: string
  emoji: string
}

export const ACCENT_PRESETS: ThemePreset[] = [
  { name: "netease", label: "网易红", color: "#E8593C", emoji: "🔴" },
  { name: "spotify", label: "Spotify 绿", color: "#1DB954", emoji: "🟢" },
  { name: "blue", label: "深空蓝", color: "#4A90D9", emoji: "🔵" },
  { name: "purple", label: "魅惑紫", color: "#8B5CF6", emoji: "🟣" },
  { name: "pink", label: "樱花粉", color: "#EC4899", emoji: "💗" },
  { name: "teal", label: "青碧色", color: "#14B8A6", emoji: "🩵" },
  { name: "gold", label: "琥珀金", color: "#F59E0B", emoji: "🟡" },
  { name: "rose", label: "玫瑰红", color: "#F43F5E", emoji: "🌹" },
]

type Scheme = "auto" | "dark" | "light"

function getSystemDark(): boolean {
  if (typeof window === "undefined") return true
  return window.matchMedia("(prefers-color-scheme: dark)").matches
}

function resolveIsDark(scheme: Scheme): boolean {
  if (scheme === "auto") return getSystemDark()
  return scheme === "dark"
}

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return { r, g, b }
}

function lighten(hex: string, amount: number) {
  const { r, g, b } = hexToRgb(hex)
  return `rgb(${Math.min(255, Math.round(r + (255 - r) * amount))}, ${Math.min(255, Math.round(g + (255 - g) * amount))}, ${Math.min(255, Math.round(b + (255 - b) * amount))})`
}

export function dim(hex: string, opacity: number) {
  const { r, g, b } = hexToRgb(hex)
  return `rgba(${r}, ${g}, ${b}, ${opacity})`
}

export function applyTheme(accent: string, isDark: boolean) {
  const root = document.documentElement
  root.dataset.theme = isDark ? "dark" : "light"
  root.style.setProperty("--color-primary", accent)
  root.style.setProperty("--color-primary-hover", lighten(accent, 0.08))
  root.style.setProperty("--color-primary-dim", dim(accent, 0.15))
}

interface ThemeState {
  scheme: Scheme
  accentColor: string
  presetName: string
  isDark: boolean
  showPrefs: boolean
  setScheme: (s: Scheme) => void
  setAccentColor: (color: string, presetName?: string) => void
  togglePrefs: () => void
  setShowPrefs: (v: boolean) => void
}

const savedScheme = (localStorage.getItem("theme_scheme") as Scheme) || "auto"
const savedAccent = localStorage.getItem("theme_accent") || "#E8593C"
const savedPreset = localStorage.getItem("theme_preset") || "netease"

export const useThemeStore = create<ThemeState>((set) => ({
  scheme: savedScheme,
  accentColor: savedAccent,
  presetName: savedPreset,
  isDark: resolveIsDark(savedScheme),
  showPrefs: false,

  setScheme: (scheme) => {
    localStorage.setItem("theme_scheme", scheme)
    const isDark = resolveIsDark(scheme)
    set({ scheme, isDark })
    applyTheme(useThemeStore.getState().accentColor, isDark)
  },

  setAccentColor: (color, presetName) => {
    localStorage.setItem("theme_accent", color)
    if (presetName) localStorage.setItem("theme_preset", presetName)
    set({ accentColor: color, presetName: presetName || useThemeStore.getState().presetName })
    applyTheme(color, useThemeStore.getState().isDark)
  },

  togglePrefs: () => set((s) => ({ showPrefs: !s.showPrefs })),
  setShowPrefs: (v) => set({ showPrefs: v }),
}))
