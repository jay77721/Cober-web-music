import { lazy, Suspense, useEffect } from "react"
import { HashRouter, Routes, Route } from "react-router-dom"
import { useAuthStore } from "./stores/useAuthStore"
import { useAppStore } from "./stores/useAppStore"
import { useLikeStore } from "./stores/useLikeStore"
import { useIsDesktop } from "./hooks/useMediaQuery"
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts"
import { AudioManager } from "./components/AudioManager"
import { DesktopLayout } from "./components/Layout/DesktopLayout"
import { MobileLayout } from "./components/Layout/MobileLayout"
import { LoginDialog } from "./components/LoginDialog"
import { FullPlayer } from "./components/Player/FullPlayer"
import { PlayQueue } from "./components/Player/PlayQueue"
import { SongContextMenu } from "./components/SongContextMenu"
import { ThemePreferences } from "./components/ThemePreferences"
import { ErrorBoundary } from "./components/ErrorBoundary"
import { useThemeStore, applyTheme } from "./stores/useThemeStore"

// 路由懒加载
const Home = lazy(() => import("./pages/Home/index").then(m => ({ default: m.Home })))
const SearchPage = lazy(() => import("./pages/Search/index").then(m => ({ default: m.SearchPage })))
const PlaylistPage = lazy(() => import("./pages/Playlist/index").then(m => ({ default: m.PlaylistPage })))
const AlbumPage = lazy(() => import("./pages/Album/index").then(m => ({ default: m.AlbumPage })))
const ArtistPage = lazy(() => import("./pages/Artist/index").then(m => ({ default: m.ArtistPage })))
const RankingPage = lazy(() => import("./pages/Ranking/index").then(m => ({ default: m.RankingPage })))
const RankingDetailPage = lazy(() => import("./pages/Ranking/Detail").then(m => ({ default: m.RankingDetailPage })))
const MvListPage = lazy(() => import("./pages/MV/index").then(m => ({ default: m.MvListPage })))
const MvPlayerPage = lazy(() => import("./pages/MV/Player").then(m => ({ default: m.MvPlayerPage })))
const VideoListPage = lazy(() => import("./pages/Video/index").then(m => ({ default: m.VideoListPage })))
const UserPage = lazy(() => import("./pages/User/index").then(m => ({ default: m.UserPage })))

function PageLoader() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="w-8 h-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

function App() {
  const { isDark, scheme, accentColor } = useThemeStore()

  useEffect(() => {
    applyTheme(accentColor, isDark)
  }, [accentColor, isDark])

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
    <ErrorBoundary>
      <HashRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Suspense fallback={<PageLoader />}><Home /></Suspense>} />
            <Route path="/search" element={<Suspense fallback={<PageLoader />}><SearchPage /></Suspense>} />
            <Route path="/playlist/:id" element={<Suspense fallback={<PageLoader />}><PlaylistPage /></Suspense>} />
            <Route path="/album/:id" element={<Suspense fallback={<PageLoader />}><AlbumPage /></Suspense>} />
            <Route path="/artist/:id" element={<Suspense fallback={<PageLoader />}><ArtistPage /></Suspense>} />
            <Route path="/ranking" element={<Suspense fallback={<PageLoader />}><RankingPage /></Suspense>} />
            <Route path="/ranking/:id" element={<Suspense fallback={<PageLoader />}><RankingDetailPage /></Suspense>} />
            <Route path="/mv" element={<Suspense fallback={<PageLoader />}><MvListPage /></Suspense>} />
            <Route path="/mv/player/:id" element={<Suspense fallback={<PageLoader />}><MvPlayerPage /></Suspense>} />
            <Route path="/user" element={<Suspense fallback={<PageLoader />}><UserPage /></Suspense>} />
            <Route path="/video" element={<Suspense fallback={<PageLoader />}><VideoListPage /></Suspense>} />
          </Route>
        </Routes>
        <AudioManager />
        <LoginDialog />
        <FullPlayer />
        <PlayQueue />
        <SongContextMenu />
        <ThemePreferences />
      </HashRouter>
    </ErrorBoundary>
  )
}

export default App
