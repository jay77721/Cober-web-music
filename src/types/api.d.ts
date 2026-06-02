export interface ApiResponse<T = unknown> {
  code: number
  data: T
  msg?: string
  message?: string
}

export interface LoginResponse {
  code: number
  cookie: string
  token: string
  profile: {
    userId: number
    nickname: string
    avatarUrl: string
    backgroundUrl: string
  }
  account: {
    id: number
    userName: string
    type: number
    status: number
    createTime: number
  }
}

export interface SongUrlResponse {
  data: { id: number; url: string; br: number; size: number; type: string; level: string; encodeType: string; freeTrialInfo: null | object }[]
}

export interface LyricResponse {
  lrc: { lyric: string }
  tlyric: { lyric: string }
  klyric: { lyric: string }
  yrc: { lyric: string }
  romalrc: { lyric: string }
  code: number
}

export interface SearchResponse {
  result: {
    songs?: { id: number; name: string; artists: { id: number; name: string }[]; album: { id: number; name: string; picUrl: string }; duration: number; fee: number }[]
    albums?: { id: number; name: string; artist: { id: number; name: string; picUrl: string }; picUrl: string; size: number }[]
    artists?: { id: number; name: string; picUrl: string; alias: string[]; albumSize: number }[]
    playlists?: { id: number; name: string; coverImgUrl: string; creator: { nickname: string; userId: number }; trackCount: number; playCount: number }[]
    mvs?: { id: number; name: string; cover: string; artistName: string; duration: number; playCount: number }[]
    songCount?: number
    albumCount?: number
    artistCount?: number
    playlistCount?: number
    mvCount?: number
  }
  code: number
}

export interface PlaylistDetailResponse {
  playlist: {
    id: number
    name: string
    coverImgUrl: string
    creator: { userId: number; nickname: string; avatarUrl: string }
    description: string
    playCount: number
    trackCount: number
    subscribedCount: number
    subscribed: boolean
    tags: string[]
    createTime: number
    updateTime: number
    tracks: { id: number; name: string; ar: { id: number; name: string }[]; al: { id: number; name: string; picUrl: string }; dt: number; fee: number }[]
    trackIds: { id: number }[]
  }
  privileges: { id: number; fee: number; payed: number; pl: number; dl: number; st: number }[]
  code: number
}

export interface TopListResponse {
  list: { id: number; name: string; coverImgUrl: string; updateFrequency: string; updateTime: number; trackCount: number; playCount: number; description: string }[]
  artistToplist: { coverUrl: string; name: string; upateFrequency: string; position: number }
}

export interface TopDetailResponse {
  playlist: {
    id: number
    name: string
    coverImgUrl: string
    updateFrequency: string
    updateTime: number
    trackCount: number
    playCount: number
    description: string
    tracks: { id: number; name: string; ar: { id: number; name: string }[]; al: { id: number; name: string; picUrl: string }; dt: number; fee: number }[]
  }
  privileges: { id: number; fee: number; payed: number; pl: number; dl: number; st: number }[]
  code: number
}