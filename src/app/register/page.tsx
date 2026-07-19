import Link from "next/link"
import { Zap, ArrowLeft } from "lucide-react"
import { RegisterForm } from "@/components/register-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "注册 — DarkcraneStore",
  description: "注册 DarkcraneStore 账号，开始你的赛博拼车之旅。",
}

export default function RegisterPage() {
  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Background: static hero image at low opacity */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none"
        style={{
          backgroundImage: "url('/images/hero-bg.png')",
          opacity: 0.22,
        }}
      />

      {/* Radial vignette — keeps focus on the card */}
      <div
        className="absolute inset-0 pointer-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 30%, rgba(0,0,0,0.85) 100%)",
        }}
      />

      {/* Subtle neon scan line */}
      <div
        className="absolute inset-x-0 top-0 h-px pointer-events-none"
        style={{ background: "linear-gradient(90deg, transparent, rgba(255,45,120,0.4), transparent)" }}
      />

      {/* Back to home */}
      <Link
        href="/"
        className="absolute top-6 left-6 flex items-center gap-1.5 font-mono text-xs text-white/30 hover:text-white/70 transition-colors z-10"
      >
        <ArrowLeft size={12} />
        返回首页
      </Link>

      {/* Card */}
      <div
        className="relative z-10 w-full max-w-md mx-4"
        style={{
          background: "rgba(6,6,14,0.72)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderTop: "1px solid rgba(255,45,120,0.35)",
          borderRadius: "1.25rem",
          backdropFilter: "blur(24px)",
          boxShadow:
            "0 0 0 1px rgba(0,0,0,0.4), 0 40px 80px rgba(0,0,0,0.6), 0 0 60px rgba(255,45,120,0.06)",
        }}
      >
        {/* Card top accent line glow */}
        <div
          className="absolute left-1/2 -translate-x-1/2 -top-px w-32 h-px rounded-full pointer-events-none"
          style={{ background: "linear-gradient(90deg, transparent, rgba(255,45,120,0.9), transparent)" }}
        />

        <div className="px-8 py-10">
          {/* Logo */}
          <div className="flex flex-col items-center gap-2 mb-8">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center mb-1"
              style={{
                background: "rgba(255,45,120,0.1)",
                border: "1px solid rgba(255,45,120,0.35)",
                boxShadow: "0 0 20px rgba(255,45,120,0.15)",
              }}
            >
              <Zap size={18} className="text-[#ff2d78]" style={{ filter: "drop-shadow(0 0 6px rgba(255,45,120,0.8))" }} />
            </div>
            <span className="font-mono text-base font-bold tracking-widest uppercase text-white">
              Dark<span className="text-neon-pink">Crane</span>
            </span>
            <p className="font-mono text-[11px] text-white/25 tracking-widest mt-0.5">创建账号 · 准备上车</p>
          </div>

          <RegisterForm />
        </div>

        {/* Card footer */}
        <div
          className="px-8 py-4 rounded-b-[1.25rem]"
          style={{ borderTop: "1px solid rgba(255,255,255,0.05)", background: "rgba(0,0,0,0.25)" }}
        >
          <p className="font-mono text-[10px] text-white/18 text-center leading-relaxed">
            注册即代表你接受用户协议 · 人满自动发车 · 跳车不退款
          </p>
        </div>
      </div>
    </main>
  )
}
