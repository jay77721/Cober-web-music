export interface Song {
  id: number
  name: string
  artists?: Artist[]
  ar?: { id: number; name: string }[]
  album?: Album
  al?: { id: number; name: string; picUrl: string }
  duration?: number
  dt?: number
  fee?: number
  copyrightId?: number
  status?: number
  rtype?: number
  ftype?: number
  mvid?: number
  alias?: string[]
  transNames?: string[]
  noCopyrightRcmd?: null | { type: number; typeDesc: string }
  source?: { name: string; id: number }
  [key: string]: unknown
}

export interface Artist {
  id: number
  name: string
  picUrl?: string
  alias?: string[]
  albumSize?: number
  picId?: number
  img1v1Url?: string
  trans?: string
  cover?: string
  [key: string]: unknown
}

export interface Album {
  id: number
  name: string
  picUrl?: string
  artist?: Artist
  artists?: Artist[]
  publishTime?: number
  size?: number
  description?: string
  songs?: Song[]
  [key: string]: unknown
}

export interface Playlist {
  id: number
  name: string
  coverImgUrl: string
  creator?: User
  description?: string
  playCount?: number
  trackCount?: number
  subscribedCount?: number
  subscribed?: boolean
  tags?: string[]
  createTime?: number
  updateTime?: number
  tracks?: Song[]
  trackIds?: { id: number }[]
  [key: string]: unknown
}

export interface User {
  userId: number
  nickname: string
  avatarUrl?: string
  signature?: string
  followed?: boolean
  [key: string]: unknown
}

export interface MV {
  id: number
  name: string
  artist?: Artist
  artistName?: string
  cover: string
  playCount?: number
  duration?: number
  desc?: string
  publishTime?: string
  [key: string]: unknown
}

export interface Video {
  id: number
  name: string
  coverUrl: string
  creator?: User
  duration?: number
  playTime?: number
  title?: string
  [key: string]: unknown
}

export interface Comment {
  commentId: number
  user: User
  content: string
  time: number
  likedCount: number
  liked: boolean
  beReplied?: Comment[]
  showFloorComment?: null
}

export interface LyricLine {
  time: number
  text: string
}

export interface SearchResult {
  songs?: Song[]
  albums?: Album[]
  artists?: Artist[]
  playlists?: Playlist[]
  mvs?: MV[]
}

export interface TopList {
  id: number
  name: string
  coverImgUrl: string
  updateFrequency?: string
  updateTime?: number
  trackCount?: number
  playCount?: number
  description?: string
  tracks?: Song[]
  [key: string]: unknown
}

export interface Banner {
  imageUrl: string
  targetId: number
  targetType: number
  titleColor: string
  typeTitle: string
  url?: string
  exclusive?: boolean
  adid?: null
  videoId?: null
  encodeId?: string
  scm?: string
  bannerBizType?: string
}

export interface HomeBlock {
  blockCode: string
  showType: string
  creatives?: Creative[]
  uiElement?: { subTitle: { title: string }; button: { text: string; action: string } }
}

export interface Creative {
  creativeType: string
  creativeId: string
  action?: string
  actionType?: string
  uiElement?: { mainTitle: { title: string }; images?: { imageUrl: string }[] }
  resources?: Resource[]
}

export interface Resource {
  resourceId: string
  resourceType?: string
  uiElement?: { mainTitle: { title: string }; subTitle?: { title: string } }
  resourceExtInfo?: { artists?: Artist[]; songData?: Song; playCount?: number }
}