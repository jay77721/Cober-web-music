import { create } from "zustand"

interface AppState {
  showLogin: boolean
  showSidebar: boolean
  setShowLogin: (v: boolean) => void
  setShowSidebar: (v: boolean) => void
  toggleSidebar: () => void
}

export const useAppStore = create<AppState>((set) => ({
  showLogin: false,
  showSidebar: false,
  setShowLogin: (v) => set({ showLogin: v }),
  setShowSidebar: (v) => set({ showSidebar: v }),
  toggleSidebar: () => set((s) => ({ showSidebar: !s.showSidebar })),
}))