import { Outlet } from "react-router-dom"
import { Sidebar } from "./Sidebar"
import { Topbar } from "./Topbar"
import { BottomPlayer } from "./BottomPlayer"

export function DesktopLayout() {
  return (
    <div className="h-full flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        <main className="flex-1 overflow-y-auto bg-[var(--color-bg-base)]">
          <Outlet />
        </main>
        <BottomPlayer />
      </div>
    </div>
  )
}