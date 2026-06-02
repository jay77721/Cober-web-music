export const SEARCH_TYPES = { 1: "单曲", 10: "专辑", 100: "歌手", 1000: "歌单", 1002: "用户", 1004: "MV", 1006: "歌词", 1009: "电台", 1014: "视频" } as const

export const FEE_LABELS: Record<number, string> = { 0: "", 1: "VIP", 4: "付费", 8: "免费" }

export const PLAY_MODE_LABELS: Record<string, string> = { sequence: "顺序播放", shuffle: "随机播放", single: "单曲循环", loop: "列表循环" }

export const PLAY_MODE_ICONS: Record<string, string> = { sequence: "repeat", shuffle: "shuffle", single: "repeat-1", loop: "repeat" }

export const SIDEBAR_MENU = [
  { path: "/", label: "发现音乐", icon: "Compass" },
  { path: "/search", label: "搜索", icon: "Search" },
  { path: "/ranking", label: "排行榜", icon: "TrendingUp" },
  { path: "/mv", label: "MV", icon: "Clapperboard" },
  { path: "/video", label: "视频", icon: "Film" },
  { path: "/user", label: "我的音乐", icon: "Library" },
]

export const MOBILE_TABS = [
  { path: "/", label: "发现", icon: "Compass" },
  { path: "/ranking", label: "排行榜", icon: "TrendingUp" },
  { path: "/search", label: "搜索", icon: "Search" },
  { path: "/user", label: "我的", icon: "Library" },
]
