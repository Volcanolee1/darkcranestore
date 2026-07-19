"use client"

import { useState } from "react"
import Link from "next/link"
import { Eye, EyeOff, Zap, ArrowRight, Lock, Mail } from "lucide-react"
import { useRegisterModal } from "@/components/register-modal"

export function LoginForm() {
  const { open: openRegister } = useRegisterModal()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => { setLoading(false); setDone(true) }, 1400)
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden px-4">
      {/* Background layers */}
      <div className="absolute inset-0 bg-black" />
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/hero-bg.png')", opacity: 0.18 }}
      />
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-black/70 to-black" />
      {/* Top scan line */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, #ff2d78, transparent)", opacity: 0.6 }}
      />

      {/* Card */}
      <div
        className="relative z-10 w-full max-w-md rounded-2xl overflow-hidden"
        style={{
          background: "rgba(6,6,14,0.82)",
          border: "1px solid rgba(255,45,120,0.25)",
          backdropFilter: "blur(24px)",
          boxShadow: "0 0 60px rgba(255,45,120,0.08), 0 32px 64px rgba(0,0,0,0.6)",
        }}
      >
        {/* Top accent bar */}
        <div className="h-px w-full" style={{ background: "linear-gradient(90deg, transparent, #ff2d78 40%, #00e6ff 60%, transparent)" }} />

        <div className="px-8 py-10">
          {done ? (
            <div className="flex flex-col items-center gap-6 py-6 text-center">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ background: "rgba(0,230,255,0.12)", border: "1px solid rgba(0,230,255,0.4)", boxShadow: "0 0 24px rgba(0,230,255,0.3)" }}
              >
                <Zap size={28} className="text-[#00e6ff]" />
              </div>
              <div>
                <p className="font-mono font-bold text-xl text-white mb-1">已上车</p>
                <p className="font-mono text-xs text-white/35 tracking-wider">欢迎回来，老司机</p>
              </div>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-mono font-bold text-sm text-black bg-[#ff2d78] neon-glow-pink hover:bg-[#ff5090] transition-all duration-200"
              >
                进入车辆管理 <ArrowRight size={14} />
              </Link>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="flex flex-col items-center gap-3 mb-8">
                <Link href="/" className="flex items-center gap-2">
                  <Zap size={18} className="text-[#ff2d78]" style={{ filter: "drop-shadow(0 0 6px rgba(255,45,120,0.8))" }} />
                  <span className="font-mono font-bold tracking-widest text-sm text-white uppercase">
                    Dark<span className="text-neon-pink">Crane</span>
                  </span>
                </Link>
                <h1 className="font-mono font-extrabold text-2xl text-white mt-1">上车验证</h1>
                <p className="font-mono text-xs text-white/30 tracking-wider">LOGIN TO YOUR ACCOUNT</p>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                {/* Email */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[11px] tracking-widest text-white/40 uppercase">邮箱</label>
                  <div className="relative">
                    <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="w-full pl-10 pr-4 py-3 rounded-xl font-mono text-sm text-white placeholder-white/20 outline-none transition-all duration-200"
                      style={{
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.08)",
                      }}
                      onFocus={e => { e.currentTarget.style.border = "1px solid rgba(255,45,120,0.5)"; e.currentTarget.style.boxShadow = "0 0 12px rgba(255,45,120,0.15)" }}
                      onBlur={e => { e.currentTarget.style.border = "1px solid rgba(255,255,255,0.08)"; e.currentTarget.style.boxShadow = "none" }}
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[11px] tracking-widest text-white/40 uppercase">密码</label>
                  <div className="relative">
                    <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-11 py-3 rounded-xl font-mono text-sm text-white placeholder-white/20 outline-none transition-all duration-200"
                      style={{
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.08)",
                      }}
                      onFocus={e => { e.currentTarget.style.border = "1px solid rgba(255,45,120,0.5)"; e.currentTarget.style.boxShadow = "0 0 12px rgba(255,45,120,0.15)" }}
                      onBlur={e => { e.currentTarget.style.border = "1px solid rgba(255,255,255,0.08)"; e.currentTarget.style.boxShadow = "none" }}
                    />
                    <button
                      type="button"
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors"
                      onClick={() => setShowPassword(v => !v)}
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>

                {/* Forgot */}
                <div className="flex justify-end -mt-2">
                  <button type="button" className="font-mono text-[11px] text-white/25 hover:text-[#ff2d78] transition-colors">
                    忘记密码？
                  </button>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-mono font-bold text-sm text-black transition-all duration-200 hover:brightness-110 active:scale-[0.98] disabled:opacity-60"
                  style={{ background: "#ff2d78", boxShadow: "0 0 24px rgba(255,45,120,0.45)" }}
                >
                  {loading ? (
                    <span className="inline-block w-4 h-4 border-2 border-black/40 border-t-black rounded-full animate-spin" />
                  ) : (
                    <><ArrowRight size={15} /> 立即登录</>
                  )}
                </button>
              </form>

              {/* Footer */}
              <div className="mt-7 pt-5 flex items-center justify-center gap-2" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <span className="font-mono text-xs text-white/25">还没有账户？</span>
                <button
                  onClick={openRegister}
                  className="font-mono text-xs text-[#ff2d78] hover:text-[#ff5090] transition-colors"
                >
                  立即注册
                </button>
              </div>
            </>
          )}
        </div>

        {/* Bottom bar */}
        <div
          className="px-8 py-3 flex items-center justify-center gap-1"
          style={{ borderTop: "1px solid rgba(255,255,255,0.05)", background: "rgba(0,0,0,0.3)" }}
        >
          <span className="font-mono text-[10px] text-white/20 tracking-wider">DARKCRANE · SECURE LOGIN · AES-256</span>
        </div>
      </div>
    </div>
  )
}
