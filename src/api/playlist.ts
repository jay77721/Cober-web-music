import api from "./request"

export const getPlaylistDetail = (id: number) =>
  api.get("/playlist/detail", { params: { id } }) as Promise<any>

export const getPlaylistTrackAll = (id: number, limit = 500, offset = 0) =>
  api.get("/playlist/track/all", { params: { id, limit, offset } }) as Promise<any>

export const createPlaylist = (name: string, privacy = 0) =>
  api.get("/playlist/create", { params: { name, privacy } }) as Promise<any>

export const deletePlaylist = (id: number) =>
  api.get("/playlist/delete", { params: { id } }) as Promise<any>

export const updatePlaylist = (id: number, name: string, desc?: string, tags?: string) =>
  api.get("/playlist/update", { params: { id, name, desc, tags } }) as Promise<any>

export const subscribePlaylist = (id: number, t: 1 | 2 = 1) =>
  api.get("/playlist/subscribe", { params: { id, t } }) as Promise<any>

export const getPlaylistCatlist = () =>
  api.get("/playlist/catlist") as Promise<any>

export const getPlaylistHot = () =>
  api.get("/playlist/hot") as Promise<any>

export const getTopPlaylist = (cat = "全部", limit = 50, offset = 0, order: "hot" | "new" = "hot") =>
  api.get("/top/playlist", { params: { cat, limit, offset, order } }) as Promise<any>

export const getTopPlaylistHighquality = (cat = "全部", limit = 50, before?: number) =>
  api.get("/top/playlist/highquality", { params: { cat, limit, before } }) as Promise<any>

export const addTracks = (pid: number, tracks: string) =>
  api.get("/playlist/track/add", { params: { pid, tracks } }) as Promise<any>

export const deleteTracks = (pid: number, tracks: string) =>
  api.get("/playlist/track/delete", { params: { pid, tracks } }) as Promise<any>