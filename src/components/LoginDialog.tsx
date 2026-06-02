import { useState, useEffect, useRef } from "react"
import { X, Smartphone, Mail, QrCode, Disc3 } from "lucide-react"
import { useAuthStore } from "../stores/useAuthStore"
import { useAppStore } from "../stores/useAppStore"
import { captchaSent, loginQrKey, loginQrCreate, loginQrCheck } from "../api"

export function LoginDialog() {
  const { showLogin, setShowLogin } = useAppStore()
  const { login, loginWithEmail, checkLogin, setLoginState } = useAuthStore()
  const [tab, setTab] = useState<"phone" | "email" | "qr">("qr")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [email, setEmail] = useState("")
  const [captcha, setCaptcha] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [qrImg, setQrImg] = useState("")
  const [qrMsg, setQrMsg] = useState("")
  const qrTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (tab === "qr" && showLogin) { generateQr() }
    return () => { if (qrTimerRef.current) clearInterval(qrTimerRef.current) }
  }, [tab, showLogin])

  const generateQr = async () => {
    if (qrTimerRef.current) clearInterval(qrTimerRef.current)
    try {
      const keyRes = await loginQrKey()
      const key = keyRes?.data?.unikey || keyRes?.unikey
      if (!key) { setQrMsg("获取二维码失败"); return }
      const qrRes = await loginQrCreate(key, true)
      const qrData = qrRes?.data || qrRes
      setQrImg(qrData?.qrimg || "")
      setQrMsg("请使用网易云音乐 App 扫码登录")
      startQrCheck(key)
    } catch { setQrMsg("获取二维码失败") }
  }

  const startQrCheck = (key: string) => {
    if (qrTimerRef.current) clearInterval(qrTimerRef.current)
    qrTimerRef.current = setInterval(async () => {
      try {
        const res = await loginQrCheck(key)
        const data = res?.data || res
        if (data.code === 803) {
          if (qrTimerRef.current) clearInterval(qrTimerRef.current)
          setQrMsg("登录成功！")
          setLoginState(data.cookie || "", data.profile || null)
          checkLogin().catch(() => {})
          setTimeout(() => setShowLogin(false), 500)
        } else if (data.code === 800) {
          if (qrTimerRef.current) clearInterval(qrTimerRef.current)
          setQrMsg("二维码已过期，请刷新")
        } else if (data.code === 801) { setQrMsg("等待扫码...") }
        else if (data.code === 802) { setQrMsg("扫码成功，请在手机上确认") }
      } catch {}
    }, 2000)
  }

  if (!showLogin) return null

  const handleLogin = async () => {
    setLoading(true); setError("")
    try {
      let success = false
      if (tab === "phone") { const res = await login(phone, captcha || password); success = !!res }
      else if (tab === "email") { const res = await loginWithEmail(email, password); success = !!res }
      if (success) setShowLogin(false)
    } catch (e: any) { setError(e?.response?.data?.message || "登录失败") }
    finally { setLoading(false) }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in"
      onClick={() => setShowLogin(false)}>
      <div className="w-[400px] bg-[var(--color-bg-surface)] rounded-2xl shadow-2xl border border-white/5 overflow-hidden"
        onClick={(e) => e.stopPropagation()}>
        {/* Header with gradient */}
        <div className="relative h-24 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-hover)] flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Disc3 size={24} className="text-white" />
          </div>
          <button onClick={() => setShowLogin(false)}
            className="absolute top-3 right-3 p-1.5 bg-white/10 hover:bg-white/20 rounded-full transition-colors">
            <X size={16} className="text-white" />
          </button>
        </div>
        <div className="p-6">
          <h2 className="text-lg font-bold text-center mb-5">登录</h2>
          {/* Tabs */}
          <div className="flex gap-2 mb-5 bg-[var(--color-bg-elevated)] rounded-xl p-1">
            {([["qr", "扫码", QrCode], ["phone", "手机", Smartphone], ["email", "邮箱", Mail]] as const).map(([key, label, Icon]) => (
              <button key={key} onClick={() => { setTab(key); setError("") }}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium transition-all ${
                  tab === key ? "bg-[var(--color-bg-surface)] text-white shadow-sm" : "text-[var(--color-text-muted)] hover:text-white"
                }`}>
                <Icon size={15} />{label}
              </button>
            ))}
          </div>
          {tab === "qr" ? (
            <div className="text-center py-4 space-y-4">
              <div className="w-44 h-44 mx-auto rounded-xl overflow-hidden bg-white p-2 shadow-lg">
                {qrImg ? <img src={qrImg} className="w-full h-full" alt="QR" /> : (
                  <div className="w-full h-full flex items-center justify-center text-[var(--color-text-muted)] text-xs">加载中...</div>
                )}
              </div>
              <p className="text-sm text-[var(--color-text-secondary)]">{qrMsg || "正在获取二维码..."}</p>
              {qrMsg.includes("过期") && (
                <button onClick={generateQr}
                  className="text-sm text-[var(--color-primary)] font-medium hover:underline">刷新二维码</button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {tab === "phone" ? (
                <>
                  <input className="w-full bg-[var(--color-bg-elevated)] border border-transparent focus:border-[var(--color-primary)]/50 rounded-lg px-4 py-2.5 text-sm transition-colors"
                    placeholder="手机号" value={phone} onChange={(e) => setPhone(e.target.value)} />
                  <div className="flex gap-2">
                    <input className="flex-1 bg-[var(--color-bg-elevated)] border border-transparent focus:border-[var(--color-primary)]/50 rounded-lg px-4 py-2.5 text-sm transition-colors"
                      placeholder="验证码" value={captcha} onChange={(e) => setCaptcha(e.target.value)} />
                    <button onClick={async () => {
                      if (!phone) return setError("请输入手机号")
                      try { await captchaSent(phone); setError("") }
                      catch (e: any) { setError(e?.response?.data?.message || "发送失败") }
                    }}
                      className="px-4 py-2.5 bg-[var(--color-bg-elevated)] rounded-lg text-sm whitespace-nowrap hover:bg-[var(--color-border)] transition-colors">发送验证码</button>
                  </div>
                  <input className="w-full bg-[var(--color-bg-elevated)] border border-transparent focus:border-[var(--color-primary)]/50 rounded-lg px-4 py-2.5 text-sm transition-colors"
                    placeholder="密码（与验证码二选一）" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </>
              ) : (
                <>
                  <input className="w-full bg-[var(--color-bg-elevated)] border border-transparent focus:border-[var(--color-primary)]/50 rounded-lg px-4 py-2.5 text-sm transition-colors"
                    placeholder="邮箱" value={email} onChange={(e) => setEmail(e.target.value)} />
                  <input className="w-full bg-[var(--color-bg-elevated)] border border-transparent focus:border-[var(--color-primary)]/50 rounded-lg px-4 py-2.5 text-sm transition-colors"
                    placeholder="密码" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </>
              )}
              {error && <p className="text-sm text-[var(--color-primary)] bg-[var(--color-primary-dim)] px-3 py-2 rounded-lg">{error}</p>}
              <button onClick={handleLogin} disabled={loading}
                className="w-full py-2.5 bg-[var(--color-primary)] rounded-xl font-medium hover:bg-[var(--color-primary-hover)] active:scale-[0.98] disabled:opacity-50 transition-all">
                {loading ? "登录中..." : "登录"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
