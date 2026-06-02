import { create } from "zustand"
import { like, getLikelist } from "../api/player"
import { useAuthStore } from "./useAuthStore"

interface LikeState {
  likedIds: Set<number>
  inited: boolean
  init: () => Promise<void>
  toggleLike: (id: number) => Promise<boolean>
  isLiked: (id: number) => boolean
}

export const useLikeStore = create<LikeState>((set, get) => ({
  likedIds: new Set<number>(),
  inited: false,

  init: async () => {
    const { isLoggedIn, user } = useAuthStore.getState()
    if (!isLoggedIn || !user) return
    try {
      const res = await getLikelist(user.userId)
      const ids: number[] = res.ids || []
      set({ likedIds: new Set(ids), inited: true })
    } catch { set({ inited: true }) }
  },

  toggleLike: async (id: number) => {
    const { likedIds } = get()
    const isLiked = likedIds.has(id)
    const next = new Set(likedIds)
    if (isLiked) next.delete(id)
    else next.add(id)
    set({ likedIds: next })
    try {
      await like(id, !isLiked)
      return !isLiked
    } catch {
      const revert = new Set(get().likedIds)
      if (isLiked) revert.add(id)
      else revert.delete(id)
      set({ likedIds: revert })
      return isLiked
    }
  },

  isLiked: (id: number) => get().likedIds.has(id),
}))
