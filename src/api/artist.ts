import api from "./request"

export const getArtistDetail = (id: number) =>
  api.get("/artist/detail", { params: { id } }) as Promise<any>

export const getArtistSongs = (id: number, order: "hot" | "time" = "hot", limit = 50, offset = 0) =>
  api.get("/artist/songs", { params: { id, order, limit, offset } }) as Promise<any>

export const getArtistAlbum = (id: number, limit = 50, offset = 0) =>
  api.get("/artist/album", { params: { id, limit, offset } }) as Promise<any>

export const getArtistMv = (id: number, limit = 50, offset = 0) =>
  api.get("/artist/mv", { params: { id, limit, offset } }) as Promise<any>

export const getArtistDesc = (id: number) =>
  api.get("/artist/desc", { params: { id } }) as Promise<any>

export const getSimiArtist = (id: number) =>
  api.get("/simi/artist", { params: { id } }) as Promise<any>

export const artistSub = (id: number, t: 1 | 2 = 1) =>
  api.get("/artist/sub", { params: { id, t } }) as Promise<any>

export const getTopArtists = (limit = 100, offset = 0) =>
  api.get("/top/artists", { params: { limit, offset } }) as Promise<any>