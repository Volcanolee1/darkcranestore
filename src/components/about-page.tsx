"use client"

import Link from "next/link"
import { Zap, Server, Users, Shield, Clock, MessageCircle, Mail, ArrowRight } from "lucide-react"

// ── Data ──────────────────────────────────────────────────────────────────────

const STATS = [
  { value: "5,200+", label: "活跃乘客" },
  { value: "99.9%", label: "月均在线率" },
  { value: "4", label: "覆盖地区" },
  { value: "24/7", label: "运维响应" },
]

const MILESTONES = [
  { year: "2021", title: "DarkCrane 创立", desc: "一群热爱网络技术的工程师，在深夜咖啡馆里写下第一行代码。" },
  { year: "2022", title: "香港 & 日本节点上线", desc: "首批商用节点正式运行，三个月内积累了第一批 500 位乘客。" },
  { year: "2023", title: "美国 & 新加坡扩容", desc: "网络覆盖延伸至北美与东南亚，引入 IPLC 专线提升稳定性。" },
  { year: "2024", title: "家宽专区正式发布", desc: "原生住宅 IP 产品线上线，解锁更多流媒体与业务场景。" },
  { year: "2025", title: "全新拼车模式",      desc: "席位制计费正式落地，DarkCrane 2.0 版本开启新旅程。" },
]

const VALUES = [
  { icon: Server,  title: "稳定优先",   desc: "节点 SLA 承诺 99.9% 可用，故障自动切换，不让你在路上抛锚。" },
  { icon: Shield,  title: "隐私第一",   desc: "零日志政策，所有流量不记录、不分析、不售卖给任何第三方。" },
  { icon: Users,   title: "社区驱动",   desc: "路线图由用户投票决定，每一个需求都认真对待。" },
  { icon: Clock,   title: "全时响应",   desc: "工单 15 分钟内首次响应，紧急故障 1 小时内恢复。" },
]

const CONTACTS = [
  { icon: MessageCircle, label: "Telegram 社群", value: "@DarkCraneCommunity", href: "#" },
  { icon: Mail,          label: "商务合作邮件",  value: "biz@darkcrane.net",   href: "mailto:biz@darkcrane.net" },
  { icon: MessageCircle, label: "技术支持工单",  value: "在控制台提交工单",      href: "/dashboard" },
]

// ── Component ─────────────────────────────────────────────────────────────────

export function AboutPage() {
  return (
    <div className="relative min-h-screen pt-24 pb-20 overflow-hidden">
      {/* BG */}
      <div className="absolute inset-0 bg-black" />
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/images/hero-bg.png')", opacity: 0.10 }} />
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(255,45,120,0.06) 0%, transparent 65%)" }} />

      <div className="relative z-10 max-w-5xl mx-auto px-6">

        {/* ── Hero ── */}
        <div className="text-center mb-20">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <Zap size={22} className="text-[#ff2d78]" style={{ filter: "drop-shadow(0 0 8px rgba(255,45,120,0.9))" }} />
            <span className="font-mono font-extrabold text-2xl tracking-widest uppercase text-white">
              Dark<span className="text-neon-pink">Crane</span>
            </span>
          </Link>
          <h1 className="font-mono font-extrabold text-4xl lg:text-5xl text-white mb-5 text-balance">
            我们是一群<br />
            <span style={{ color: "#ff2d78", textShadow: "0 0 24px rgba(255,45,120,0.5)" }}>深夜开车的工程师</span>
          </h1>
          <p className="font-mono text-sm text-white/40 max-w-2xl mx-auto leading-relaxed">
            DarkCrane 诞生于对糟糕网络体验的共同愤怒。我们不卖廉价带宽，我们卖的是「在任何地方都能顺畅上路」的确定感。
          </p>
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-20">
          {STATS.map(({ value, label }) => (
            <div
              key={label}
              className="flex flex-col items-center justify-center py-7 rounded-2xl"
              style={{ background: "rgba(6,6,14,0.72)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(16px)" }}
            >
              <span
                className="font-mono font-extrabold text-3xl mb-1"
                style={{ color: "#ff2d78", textShadow: "0 0 16px rgba(255,45,120,0.45)" }}
              >
                {value}
              </span>
              <span className="font-mono text-xs text-white/30 tracking-wider">{label}</span>
            </div>
          ))}
        </div>

        {/* ── Timeline ── */}
        <div className="mb-20">
          <p className="font-mono text-xs text-white/30 tracking-widest uppercase mb-8 text-center">成长历程</p>
          <div className="relative flex flex-col gap-0">
            {/* Vertical line */}
            <div
              className="absolute left-[3.25rem] top-3 bottom-3 w-px"
              style={{ background: "linear-gradient(to bottom, #ff2d78, rgba(255,45,120,0.1))" }}
            />
            {MILESTONES.map((m, i) => (
              <div key={m.year} className="relative flex items-start gap-6 pb-10 last:pb-0">
                {/* Dot */}
                <div className="relative z-10 flex flex-col items-center shrink-0 w-[6.5rem]">
                  <div
                    className="w-3 h-3 rounded-full mt-1"
                    style={{
                      background: i === MILESTONES.length - 1 ? "#ff2d78" : "rgba(255,45,120,0.4)",
                      boxShadow: i === MILESTONES.length - 1 ? "0 0 10px rgba(255,45,120,0.8)" : "none",
                      border: "2px solid rgba(255,45,120,0.6)",
                    }}
                  />
                </div>
                <div>
                  <div className="flex items-baseline gap-3 mb-1">
                    <span className="font-mono font-extrabold text-sm" style={{ color: "#ff2d78" }}>{m.year}</span>
                    <span className="font-mono font-bold text-base text-white">{m.title}</span>
                  </div>
                  <p className="font-mono text-xs text-white/35 leading-relaxed">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Values ── */}
        <div className="mb-20">
          <p className="font-mono text-xs text-white/30 tracking-widest uppercase mb-8 text-center">我们的承诺</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {VALUES.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="flex items-start gap-5 p-6 rounded-2xl"
                style={{ background: "rgba(6,6,14,0.72)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(12px)" }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: "rgba(255,45,120,0.10)", border: "1px solid rgba(255,45,120,0.25)" }}
                >
                  <Icon size={18} className="text-[#ff2d78]" />
                </div>
                <div>
                  <p className="font-mono font-bold text-sm text-white mb-1.5">{title}</p>
                  <p className="font-mono text-xs text-white/35 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Contact ── */}
        <div
          className="rounded-2xl p-8 mb-10"
          style={{ background: "rgba(6,6,14,0.75)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(16px)" }}
        >
          <p className="font-mono text-xs text-white/30 tracking-widest uppercase mb-6 text-center">联系我们</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {CONTACTS.map(({ icon: Icon, label, value, href }) => (
              <a
                key={label}
                href={href}
                className="flex flex-col items-center gap-3 py-6 rounded-xl transition-all duration-200 group"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.border = "1px solid rgba(255,45,120,0.4)"; (e.currentTarget as HTMLElement).style.background = "rgba(255,45,120,0.06)" }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.border = "1px solid rgba(255,255,255,0.07)"; (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)" }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(255,45,120,0.10)", border: "1px solid rgba(255,45,120,0.25)" }}>
                  <Icon size={18} className="text-[#ff2d78]" />
                </div>
                <div className="text-center">
                  <p className="font-mono text-[11px] text-white/30 mb-0.5">{label}</p>
                  <p className="font-mono text-xs text-white/70">{value}</p>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* ── CTA ── */}
        <div className="text-center">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-mono font-bold text-sm text-black transition-all duration-200 hover:brightness-110 active:scale-[0.98]"
            style={{ background: "#ff2d78", boxShadow: "0 0 28px rgba(255,45,120,0.5)" }}
          >
            立即上车 <ArrowRight size={15} />
          </Link>
          <p className="font-mono text-[11px] text-white/20 mt-4 tracking-wider">
            &copy; 2025 DarkCrane. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}
