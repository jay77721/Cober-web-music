import api from "./request"
import type { SearchResponse, LoginResponse, PlaylistDetailResponse, TopListResponse, TopDetailResponse } from "../types/api"

export const search = (keywords: string, type = 1, limit = 30, offset = 0) =>
  api.get("/search", { params: { keywords, type, limit, offset } }) as Promise<SearchResponse>

export const searchSuggest = (keywords: string) =>
  api.get("/search/suggest", { params: { keywords } }) as Promise<any>

export const searchDefault = () =>
  api.get("/search/default") as Promise<any>

export const searchHot = () =>
  api.get("/search/hot") as Promise<any>

export const searchHotDetail = () =>
  api.get("/search/hot/detail") as Promise<any>

export const searchMultimatch = (keywords: string) =>
  api.get("/search/multimatch", { params: { keywords } }) as Promise<any>
