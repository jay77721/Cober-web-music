import api from "./request"

export const getHomepageBlock = (refresh = false) =>
  api.get("/homepage/block/page", { params: { refresh } }) as Promise<any>

export const getBanner = (type = 0) =>
  api.get("/banner", { params: { type } }) as Promise<any>

export const getPersonalized = (limit = 30) =>
  api.get("/personalized", { params: { limit } }) as Promise<any>

export const getPersonalizedNewsong = (limit = 30) =>
  api.get("/personalized/newsong", { params: { limit } }) as Promise<any>

export const getPersonalizedDjprogram = () =>
  api.get("/personalized/djprogram") as Promise<any>

export const getPersonalizedMv = () =>
  api.get("/personalized/mv") as Promise<any>

export const getPersonalizedPrivatecontent = () =>
  api.get("/personalized/privatecontent") as Promise<any>

export const getRecommendSongs = () =>
  api.get("/recommend/songs") as Promise<any>

export const getRecommendResource = () =>
  api.get("/recommend/resource") as Promise<any>