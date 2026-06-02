import api from "./request"

export const getSongUrl = (id: number | string, br = 999000) =>
  api.get("/song/url", { params: { id, br } }) as Promise<any>

export const getSongDetail = (ids: number | string) =>
  api.get("/song/detail", { params: { ids } }) as Promise<any>

export const getLyric = (id: number) =>
  api.get("/lyric", { params: { id } }) as Promise<any>

export const getSimiSong = (id: number, limit = 30) =>
  api.get("/simi/song", { params: { id, limit } }) as Promise<any>

export const like = (id: number, like = true) =>
  api.get("/like", { params: { id, like } }) as Promise<any>

export const getLikelist = (uid: number) =>
  api.get("/likelist", { params: { uid } }) as Promise<any>

export const checkMusic = (id: number, br = 999000) =>
  api.get("/check/music", { params: { id, br } }) as Promise<any>