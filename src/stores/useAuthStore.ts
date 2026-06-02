import { create } from "zustand"
import { loginCellphone, loginEmail, loginStatus, logout, registerAnonimous } from "../api"

interface AuthState {
  isLoggedIn: boolean
  cookie: string | null
  user: { userId: number; nickname: string; avatarUrl: string } | null
  loading: boolean
  login: (phone: string, password: string) => Promise<boolean>
  loginWithEmail: (email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  checkLogin: () => Promise<void>
  guestLogin: () => Promise<void>
  setLoginState: (cookie: string, user: { userId: number; nickname: string; avatarUrl: string } | null) => void
}

const savedCookie = localStorage.getItem("cookie")
const savedUser = localStorage.getItem("user")

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: !!(savedCookie && savedUser && savedUser !== "null"),
  cookie: savedCookie,
  user: savedUser && savedUser !== "null" ? JSON.parse(savedUser) : null,
  loading: false,

  login: async (phone, password): Promise<boolean> => {
    set({ loading: true })
    try {
      const res = await loginCellphone({ phone, password })
      if (res.code === 200) {
        const cookie = res.cookie || ""
        const user = res.profile
        localStorage.setItem("cookie", cookie)
        localStorage.setItem("user", JSON.stringify(user))
        set({ isLoggedIn: true, cookie, user })
        return true
      }
      return false
    } finally {
      set({ loading: false })
    }
  },

  loginWithEmail: async (email, password): Promise<boolean> => {
    set({ loading: true })
    try {
      const res = await loginEmail({ email, password })
      if (res.code === 200) {
        const cookie = res.cookie || ""
        const user = res.profile
        localStorage.setItem("cookie", cookie)
        localStorage.setItem("user", JSON.stringify(user))
        set({ isLoggedIn: true, cookie, user })
        return true
      }
      return false
    } finally {
      set({ loading: false })
    }
  },

  logout: async () => {
    try { await logout() } catch {}
    localStorage.removeItem("cookie")
    localStorage.removeItem("user")
    set({ isLoggedIn: false, cookie: null, user: null })
  },

  checkLogin: async () => {
    const cookie = localStorage.getItem("cookie")
    if (!cookie) return
    try {
      const res = await loginStatus()
      const statusData = res.data || res
      if (statusData.code === 200 && statusData.profile) {
        localStorage.setItem("user", JSON.stringify(statusData.profile))
        set({ isLoggedIn: true, cookie, user: statusData.profile })
      } else {
        localStorage.removeItem("cookie")
        localStorage.removeItem("user")
        set({ isLoggedIn: false, cookie: null, user: null })
      }
    } catch {
      set({ isLoggedIn: false, cookie: null, user: null })
    }
  },

  guestLogin: async () => {
    try {
      const res = await registerAnonimous()
      if (res.cookie) {
        localStorage.setItem("cookie", res.cookie)
        set({ cookie: res.cookie })
      }
    } catch {}
  },

  setLoginState: (cookie: string, user) => {
    localStorage.setItem("cookie", cookie)
    if (user) {
      localStorage.setItem("user", JSON.stringify(user))
    }
    set({ isLoggedIn: true, cookie, user: user || null })
  },
}))
