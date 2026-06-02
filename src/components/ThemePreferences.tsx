import { X, Monitor, Sun, Moon } from "lucide-react"
import { useThemeStore, ACCENT_PRESETS } from "../stores/useThemeStore"
import type { ThemePreset } from "../stores/useThemeStore"

export function ThemePreferences() {
  const { scheme, accentColor, presetName, showPrefs, setScheme, setAccentColor, setShowPrefs } = useThemeStore()

  if (!showPrefs) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-overlay)] backdrop-blur-sm animate-fade-in"
      onClick={() => setShowPrefs(false)}>
      <div className="w-[380px] bg-[var(--color-bg-surface)] rounded-2xl border border-[var(--color-border)] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-border)]">
          <h2 className="font-bold text-lg">主题偏好</h2>
          <button onClick={() => setShowPrefs(false)} className="p-1.5 hover:bg-[var(--color-bg-elevated)] rounded-full transition-colors">
            <X size={16} />
          </button>
        </div>

        <div className="p-5 space-y-6">
          {/* Mode selector */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-3">外观模式</p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: "auto" as const, icon: Monitor, label: "跟随系统" },
                { value: "light" as const, icon: Sun, label: "白天" },
                { value: "dark" as const, icon: Moon, label: "夜间" },
              ].map(({ value, icon: Icon, label }) => (
                <button key={value} onClick={() => setScheme(value)}
                  className={`flex flex-col items-center gap-2 py-3 rounded-xl text-sm font-medium transition-all ${
                    scheme === value
                      ? "bg-[var(--color-primary-dim)] text-[var(--color-primary)] ring-2 ring-[var(--color-primary)]"
                      : "bg-[var(--color-bg-elevated)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-highlight)]"
                  }`}>
                  <Icon size={22} />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Accent color */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-3">强调色</p>
            <div className="grid grid-cols-4 gap-3">
              {ACCENT_PRESETS.map((p: ThemePreset) => (
                <button key={p.name} onClick={() => setAccentColor(p.color, p.name)}
                  className={`flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all ${
                    presetName === p.name
                      ? "ring-2 ring-[var(--color-primary)] bg-[var(--color-primary-dim)]"
                      : "hover:bg-[var(--color-bg-highlight)]"
                  }`}>
                  <div className="w-8 h-8 rounded-full shadow-md transition-transform hover:scale-110"
                    style={{ backgroundColor: p.color }} />
                  <span className="text-[10px] text-[var(--color-text-muted)] truncate w-full text-center">{p.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Custom color */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-2">自定义颜色</p>
            <div className="flex items-center gap-3">
              <input type="color" value={accentColor}
                onChange={(e) => setAccentColor(e.target.value)}
                className="w-10 h-10 rounded-full border-2 border-[var(--color-border)] cursor-pointer bg-transparent p-0"
                style={{ accentColor: accentColor }} />
              <input type="text" value={accentColor}
                onChange={(e) => {
                  const v = e.target.value
                  if (/^#[0-9a-fA-F]{6}$/.test(v)) setAccentColor(v)
                }}
                className="flex-1 bg-[var(--color-bg-elevated)] rounded-lg px-3 py-2 text-sm font-mono" />
            </div>
          </div>

          {/* Preview */}
          <div className="p-3 rounded-xl bg-[var(--color-bg-elevated)]">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-2">预览</p>
            <div className="flex items-center gap-2">
              <div className="px-3 py-1.5 rounded-full text-xs font-medium text-white" style={{ backgroundColor: accentColor }}>
                按钮
              </div>
              <div className="px-3 py-1.5 rounded-full text-xs font-medium border" style={{ borderColor: accentColor, color: accentColor }}>
                边框
              </div>
              <div className="w-6 h-6 rounded" style={{ backgroundColor: dim(accentColor, 0.15) }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function dim(hex: string, opacity: number) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${opacity})`
}
