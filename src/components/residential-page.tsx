"use client"

import { useState } from "react"
import { Home, Shield, Tv, Globe, Zap, CheckCircle2, ArrowRight, Signal } from "lucide-react"

// ── Data ──────────────────────────────────────────────────────────────────────

const FEATURES = [
  { icon: Home,   title: "原生住宅 IP",    desc: "真实家庭宽带出口，非机房 IP，风控评分最低" },
  { icon: Shield, title: "纯净度极高",     desc: "IP 黑名单占比 < 1%，全球主流平台可访问" },
  { icon: Tv,     title: "全平台解锁",     desc: "Netflix · Disney+ · ChatGPT · TikTok 无障碍" },
  { icon: Globe,  title: "多地区覆盖",     desc: "美国 / 日本 / 英国 / 香港 四地原生住宅线路" },
  { icon: Zap,    title: "弹性带宽",       desc: "按量计费，峰值可达 200 Mbps，夜间不限速" },
  { icon: Signal, title: "动态 IP 轮换",   desc: "每次连接自动分配新 IP，防追踪更安全" },
]

interface Plan {
  id: string
  region: string
  flag: string
  name: string
  traffic: string
  price: number
  period: string
  speed: string
  ip: string
  unlocks: string[]
  color: string
  popular?: boolean
}

const PLANS: Plan[] = [
  {
    id: "us-m",
    region: "美国",
    flag: "🇺🇸",
    name: "美国住宅 M",
    traffic: "100 GB",
    price: 39,
    period: "月",
    speed: "100 Mbps",
    ip: "动态住宅",
    unlocks: ["Netflix", "Disney+", "ChatGPT", "Hulu"],
    color: "#00e6ff",
  },
  {
    id: "us-l",
    region: "美国",
    flag: "🇺🇸",
    name: "美国住宅 L",
    traffic: "300 GB",
    price: 89,
    period: "月",
    speed: "200 Mbps",
    ip: "动态住宅",
    unlocks: ["Netflix", "Disney+", "ChatGPT", "Hulu", "HBO Max"],
    color: "#00e6ff",
    popular: true,
  },
  {
    id: "jp-m",
    region: "日本",
    flag: "🇯🇵",
    name: "日本住宅 M",
    traffic: "100 GB",
    price: 45,
    period: "月",
    speed: "100 Mbps",
    ip: "动态住宅",
    unlocks: ["Netflix JP", "AbemaTV", "NicoNico", "DMM"],
    color: "#ff2d78",
  },
  {
    id: "jp-l",
    region: "日本",
    flag: "🇯🇵",
    name: "日本住宅 L",
    traffic: "300 GB",
    price: 99,
    period: "月",
    speed: "200 Mbps",
    ip: "静态住宅",
    unlocks: ["Netflix JP", "AbemaTV", "NicoNico", "DMM", "Radiko"],
    color: "#ff2d78",
  },
  {
    id: "hk-m",
    region: "香港",
    flag: "🇭🇰",
    name: "香港住宅 M",
    traffic: "100 GB",
    price: 35,
    period: "月",
    speed: "100 Mbps",
    ip: "动态住宅",
    unlocks: ["Netflix HK", "ViuTV", "MyTV Super"],
    color: "#a855f7",
  },
  {
    id: "uk-m",
    region: "英国",
    flag: "🇬🇧",
    name: "英国住宅 M",
    traffic: "100 GB",
    price: 42,
    period: "月",
    speed: "100 Mbps",
    ip: "动态住宅",
    unlocks: ["BBC iPlayer", "ITVX", "Netflix UK", "Sky Go"],
    color: "#ffb800",
  },
]

const REGIONS = ["全部", "美国", "日本", "香港", "英国"]

// ── Component ─────────────────────────────────────────────────────────────────

export function ResidentialPage() {
  const [region, setRegion] = useState("全部")
  const [hoveredPlan, setHoveredPlan] = useState<string | null>(null)

  const filtered = region === "全部" ? PLANS : PLANS.filter(p => p.region === region)

  return (
    <div className="relative min-h-screen pt-24 pb-16 overflow-hidden">
      {/* BG */}
      <div className="absolute inset-0 bg-black" />
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/images/hero-bg.png')", opacity: 0.08 }} />
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(0,230,255,0.05) 0%, transparent 70%)" }} />

      <div className="relative z-10 max-w-6xl mx-auto px-6">

        {/* Hero header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5 font-mono text-xs tracking-widest" style={{ background: "rgba(0,230,255,0.08)", border: "1px solid rgba(0,230,255,0.25)", color: "#00e6ff" }}>
            <Home size={12} /> RESIDENTIAL IP · 原生住宅
          </div>
          <h1 className="font-mono font-extrabold text-4xl lg:text-5xl text-white mb-4 text-balance">
            真实家庭宽带出口<br />
            <span style={{ color: "#00e6ff", textShadow: "0 0 24px rgba(0,230,255,0.5)" }}>告别机房 IP 封锁</span>
          </h1>
          <p className="font-mono text-sm text-white/40 max-w-xl mx-auto leading-relaxed">
            基于真实住宅网络的出口节点，IP 纯净度业界领先，专为流媒体解锁、账号注册、广告验证等场景设计。
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-14">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="flex items-start gap-4 p-5 rounded-xl"
              style={{ background: "rgba(6,6,14,0.70)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(12px)" }}
            >
              <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: "rgba(0,230,255,0.1)", border: "1px solid rgba(0,230,255,0.25)" }}>
                <Icon size={16} className="text-[#00e6ff]" />
              </div>
              <div>
                <p className="font-mono font-bold text-sm text-white mb-1">{title}</p>
                <p className="font-mono text-[11px] text-white/35 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Region filter */}
        <div className="flex items-center gap-2 mb-7 flex-wrap">
          {REGIONS.map(r => {
            const active = region === r
            return (
              <button
                key={r}
                onClick={() => setRegion(r)}
                className="px-4 py-1.5 rounded-lg font-mono text-xs transition-all duration-200"
                style={{
                  background: active ? "#00e6ff" : "rgba(255,255,255,0.04)",
                  color: active ? "#000" : "rgba(255,255,255,0.45)",
                  border: `1px solid ${active ? "#00e6ff" : "rgba(255,255,255,0.08)"}`,
                  fontWeight: active ? 700 : 400,
                  boxShadow: active ? "0 0 14px rgba(0,230,255,0.4)" : "none",
                }}
              >
                {r}
              </button>
            )
          })}
        </div>

        {/* Plans grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(plan => {
            const hovered = hoveredPlan === plan.id
            return (
              <div
                key={plan.id}
                className="relative flex flex-col rounded-2xl overflow-hidden cursor-pointer transition-all duration-200"
                style={{
                  background: "rgba(6,6,14,0.75)",
                  border: `1px solid ${hovered ? plan.color + "55" : "rgba(255,255,255,0.07)"}`,
                  backdropFilter: "blur(16px)",
                  boxShadow: hovered ? `0 0 32px ${plan.color}18` : "none",
                  transform: hovered ? "translateY(-3px)" : "none",
                }}
                onMouseEnter={() => setHoveredPlan(plan.id)}
                onMouseLeave={() => setHoveredPlan(null)}
              >
                {/* Top accent */}
                <div className="h-px w-full" style={{ background: `linear-gradient(90deg, transparent, ${plan.color}, transparent)` }} />

                {plan.popular && (
                  <div
                    className="absolute top-4 right-4 font-mono text-[9px] px-2 py-0.5 rounded-full font-bold"
                    style={{ background: plan.color, color: "#000" }}
                  >
                    最受欢迎
                  </div>
                )}

                <div className="p-6 flex flex-col gap-5 flex-1">
                  {/* Header */}
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{plan.flag}</span>
                      <span className="font-mono font-bold text-base text-white">{plan.name}</span>
                    </div>
                    <p className="font-mono text-[11px] text-white/30">{plan.ip} · {plan.speed} 峰值</p>
                  </div>

                  {/* Specs */}
                  <div className="flex flex-col gap-2">
                    {[
                      { label: "流量", value: plan.traffic },
                      { label: "速率", value: plan.speed },
                      { label: "IP 类型", value: plan.ip },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex items-center justify-between">
                        <span className="font-mono text-[11px] text-white/30">{label}</span>
                        <span className="font-mono text-xs text-white/70">{value}</span>
                      </div>
                    ))}
                  </div>

                  {/* Unlocks */}
                  <div>
                    <p className="font-mono text-[10px] text-white/25 tracking-wider uppercase mb-2">已解锁平台</p>
                    <div className="flex flex-wrap gap-1.5">
                      {plan.unlocks.map(u => (
                        <span
                          key={u}
                          className="font-mono text-[10px] px-2 py-0.5 rounded-md flex items-center gap-1"
                          style={{ background: `${plan.color}12`, border: `1px solid ${plan.color}30`, color: plan.color }}
                        >
                          <CheckCircle2 size={9} /> {u}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Price + CTA */}
                  <div className="mt-auto pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                    <div className="flex items-end justify-between mb-4">
                      <div>
                        <span className="font-mono font-extrabold text-3xl" style={{ color: plan.color, textShadow: `0 0 14px ${plan.color}50` }}>
                          ¥{plan.price}
                        </span>
                        <span className="font-mono text-xs text-white/25 ml-1">/ {plan.period}</span>
                      </div>
                    </div>
                    <button
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-mono font-bold text-sm transition-all duration-200 hover:brightness-110 active:scale-[0.98]"
                      style={{
                        background: hovered ? plan.color : "rgba(255,255,255,0.05)",
                        color: hovered ? "#000" : "rgba(255,255,255,0.5)",
                        border: `1px solid ${hovered ? plan.color : "rgba(255,255,255,0.08)"}`,
                        boxShadow: hovered ? `0 0 20px ${plan.color}50` : "none",
                      }}
                    >
                      立即上车 <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Bottom note */}
        <p className="font-mono text-[11px] text-white/20 text-center mt-10 tracking-wider">
          所有住宅 IP 来源于真实用户授权的家庭网络 · 合规使用 · 禁止违法行为
        </p>
      </div>
    </div>
  )
}
