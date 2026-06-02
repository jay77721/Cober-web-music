import api from "./request"

export const getUserAccount = () =>
  api.get("/user/account") as Promise<any>

export const getUserDetail = (uid: number) =>
  api.get("/user/detail", { params: { uid } }) as Promise<any>

export const getUserSubcount = () =>
  api.get("/user/subcount") as Promise<any>

export const getUserLevel = () =>
  api.get("/user/level") as Promise<any>

export const getUserPlaylist = (uid: number, limit = 30, offset = 0) =>
  api.get("/user/playlist", { params: { uid, limit, offset } }) as Promise<any>

export const getUserFollows = (uid: number, limit = 30, offset = 0) =>
  api.get("/user/follows", { params: { uid, limit, offset } }) as Promise<any>

export const getUserFolloweds = (uid: number, limit = 30, offset = 0) =>
  api.get("/user/followeds", { params: { uid, limit, offset } }) as Promise<any>

export const getUserEvent = (uid: number, limit = 30, lasttime = -1) =>
  api.get("/user/event", { params: { uid, limit, lasttime } }) as Promise<any>

export const getUserRecord = (uid: number, type = 1) =>
  api.get("/user/record", { params: { uid, type } }) as Promise<any>

export const getUserCloud = (limit = 30, offset = 0) =>
  api.get("/user/cloud", { params: { limit, offset } }) as Promise<any>

export const getUserDj = (uid: number, limit = 30, offset = 0) =>
  api.get("/user/dj", { params: { uid, limit, offset } }) as Promise<any>

export const followUser = (id: number, t: 1 | 2 = 1) =>
  api.get("/follow", { params: { id, t } }) as Promise<any>

export const updateUser = (data: { gender?: number; birthday?: number; nickname?: string; province?: number; city?: number; signature?: string }) =>
  api.post("/user/update", data) as Promise<any>