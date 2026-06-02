import api from "./request"

export const getCommentMusic = (id: number, limit = 20, offset = 0, before = 0) =>
  api.get("/comment/music", { params: { id, limit, offset, before } }) as Promise<any>

export const getCommentPlaylist = (id: number, limit = 20, offset = 0, before = 0) =>
  api.get("/comment/playlist", { params: { id, limit, offset, before } }) as Promise<any>

export const getCommentAlbum = (id: number, limit = 20, offset = 0, before = 0) =>
  api.get("/comment/album", { params: { id, limit, offset, before } }) as Promise<any>

export const getCommentMv = (id: number, limit = 20, offset = 0, before = 0) =>
  api.get("/comment/mv", { params: { id, limit, offset, before } }) as Promise<any>

export const getCommentHot = (type: number, id: number, limit = 20, offset = 0, before = 0) =>
  api.get("/comment/hot", { params: { type, id, limit, offset, before } }) as Promise<any>

export const commentLike = (type: number, id: number, cid: number, t: 1 | 2 = 1) =>
  api.get("/comment/like", { params: { type, id, cid, t } }) as Promise<any>

export const comment = (type: number, id: number, t: number, content: string, commentId?: number) =>
  api.get("/comment", { params: { type, id, t, content, commentId } }) as Promise<any>