import { useEffect } from "react"
import { HashRouter, Routes, Route } from "react-router-dom"
import { useAuthStore } from "./stores/useAuthStore"
import { useAppStore } from "./stores/useAppStore"
import { useLikeStore } from "./stores/useLikeStore"
import { useIsDesktop } from "./hooks/useMediaQuery"
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts"
import { AudioManager } from "./components/AudioManager"
import { DesktopLayout } from "./components/Layout/DesktopLayout"
import { MobileLayout } from "./components/Layout/MobileLayout"
import { Home } from "./pages/Home/index"
import { SearchPage } from "./pages/Search/index"
import { PlaylistPage } from "./pages/Playlist/index"
import { AlbumPage } from "./pages/Album/index"
import { ArtistPage } from "./pages/Artist/index"
import { RankingPage } from "./pages/Ranking/index"
import { RankingDetailPage } from "./pages/Ranking/Detail"
import { MvListPage } from "./pages/MV/index"
import { MvPlayerPage } from "./pages/MV/Player"
import { VideoListPage } from "./pages/Video/index"
import { UserPage } from "./pages/User/index"
import { LoginDialog } from "./components/LoginDialog"
import { FullPlayer } from "./components/Player/FullPlayer"
import { PlayQueue } from "./components/Player/PlayQueue"
import { SongContextMenu } from "./components/SongContextMenu"
import { ThemePreferences } from "./components/ThemePreferences"
import { useThemeStore, applyTheme } from "./stores/useThemeStore"

function App() {
  const { isDark, scheme, accentColor } = useThemeStore()

  // Sync theme + accent color
  useEffect(() => {
    applyTheme(accentColor, isDark)
  }, [accentColor, isDark])

  // Listen for system theme changes
  useEffect(() => {
    if (scheme !== "auto") return
    const mq = window.matchMedia("(prefers-color-scheme: dark)")
    const handler = () => {
      const dark = mq.matches
      applyTheme(useThemeStore.getState().accentColor, dark)
      document.documentElement.dataset.theme = dark ? "dark" : "light"
    }
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [scheme, accentColor])
  const isDesktop = useIsDesktop()
  const { checkLogin, guestLogin } = useAuthStore()
  const { setShowLogin } = useAppStore()
  const { init: initLikes } = useLikeStore()
  const Layout = isDesktop ? DesktopLayout : MobileLayout

  useKeyboardShortcuts()

  useEffect(() => {
    checkLogin().then(() => initLikes()).catch(() => guestLogin())
    const handler = () => setShowLogin(true)
    window.addEventListener("need-login", handler)
    return () => window.removeEventListener("need-login", handler)
  }, [])

  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/playlist/:id" element={<PlaylistPage />} />
          <Route path="/album/:id" element={<AlbumPage />} />
          <Route path="/artist/:id" element={<ArtistPage />} />
          <Route path="/ranking" element={<RankingPage />} />
          <Route path="/ranking/:id" element={<RankingDetailPage />} />
          <Route path="/mv" element={<MvListPage />} />
          <Route path="/mv/player/:id" element={<MvPlayerPage />} />
          <Route path="/user" element={<UserPage />} />
          <Route path="/video" element={<VideoListPage />} />
        </Route>
      </Routes>
      <AudioManager />
      <LoginDialog />
      <FullPlayer />
      <PlayQueue />
      <SongContextMenu />
      <ThemePreferences />
    </HashRouter>
  )
}

export default App




