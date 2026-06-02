import api from "./request"

export const getAlbum = (id: number) =>
  api.get("/album", { params: { id } }) as Promise<any>

export const getAlbumDetail = (id: number) =>
  api.get("/album/detail", { params: { id } }) as Promise<any>

export const getAlbumNewest = () =>
  api.get("/album/newest") as Promise<any>

export const getAlbumList = (area = "ALL", type = "new", limit = 30, offset = 0) =>
  api.get("/album/list", { params: { area, type, limit, offset } }) as Promise<any>

export const albumSub = (id: number, t: 1 | 2 = 1) =>
  api.get("/album/sub", { params: { id, t } }) as Promise<any>