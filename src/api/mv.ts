import api from "./request"

export const getMvAll = (area = "", type = "", order = "", limit = 50, offset = 0) =>
  api.get("/mv/all", { params: { area, type, order, limit, offset } }) as Promise<any>

export const getMvDetail = (mvid: number) =>
  api.get("/mv/detail", { params: { mvid } }) as Promise<any>

export const getMvUrl = (id: number, r = 1080) =>
  api.get("/mv/url", { params: { id, r } }) as Promise<any>

export const getTopMvList = (limit = 50, offset = 0, area = "") =>
  api.get("/top/mv", { params: { limit, offset, area } }) as Promise<any>

export const getMvFirst = (limit = 50, area = "") =>
  api.get("/mv/first", { params: { limit, area } }) as Promise<any>

export const getMvExclusiveRcmd = (limit = 50, offset = 0) =>
  api.get("/mv/exclusive/rcmd", { params: { limit, offset } }) as Promise<any>

export const getRelatedAllvideo = (id: number) =>
  api.get("/related/allvideo", { params: { id } }) as Promise<any>

export const mvSub = (mvid: number, t: 1 | 2 = 1) =>
  api.get("/mv/sub", { params: { mvid, t } }) as Promise<any>

export const getMvSublist = () =>
  api.get("/mv/sublist") as Promise<any>

export const getVideoGroupList = () =>
  api.get("/video/group/list") as Promise<any>

export const getVideoGroup = (id: number) =>
  api.get("/video/group", { params: { id } }) as Promise<any>

export const getVideoDetail = (id: string) =>
  api.get("/video/detail", { params: { id } }) as Promise<any>

export const getVideoUrl = (id: string) =>
  api.get("/video/url", { params: { id } }) as Promise<any>