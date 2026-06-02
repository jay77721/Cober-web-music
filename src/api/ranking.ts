import api from "./request"

export const getToplist = () =>
  api.get("/toplist") as Promise<any>

export const getToplistDetail = () =>
  api.get("/toplist/detail") as Promise<any>

export const getTopList = (id: number) =>
  api.get("/top/list", { params: { id } }) as Promise<any>

export const getTopArtistsRanking = (limit = 100, offset = 0) =>
  api.get("/toplist/artist", { params: { limit, offset } }) as Promise<any>

export const getTopMv = (limit = 50, offset = 0, area = "") =>
  api.get("/top/mv", { params: { limit, offset, area } }) as Promise<any>

export const getTopSong = (type = 0) =>
  api.get("/top/song", { params: { type } }) as Promise<any>

export const getTopAlbum = (type = "new", limit = 50, offset = 0, area = "ALL") =>
  api.get("/top/album", { params: { type, limit, offset, area } }) as Promise<any>