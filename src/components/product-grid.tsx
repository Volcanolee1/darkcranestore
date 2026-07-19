"use client"

import Link from "next/link"
import { ArrowRight, Gauge } from "lucide-react"

const PRODUCTS = [
  {
    grade: "A",
    name: "经济型",
    subtitle: "ECONOMY CLASS",
    price: "¥29",
    unit: "/ 月",
    color: "#00e6ff",
    seats: 8,
    speed: "100 Mbps",
    regions: ["JP", "US"],
    features: ["共享带宽", "标准延迟", "基础加密", "7天退款"],
    badge: null,
  },
  {
    grade: "B",
    name: "商务型",
    subtitle: "BUSINESS CLASS",
    price: "¥69",
    unit: "/ 月",
    color: "#ff2d78",
    seats: 4,
    speed: "500 Mbps",
    regions: ["JP", "US", "HK"],
    features: ["专属通道", "低延迟优化", "AES-256 加密", "24h 客服"],
    badge: "热门",
  },
  {
    grade: "C",
    name: "豪华型",
    subtitle: "FIRST CLASS",
    price: "¥149",
    unit: "/ 月",
    color: "#ffb800",
    seats: 2,
    speed: "1 Gbps",
    regions: ["JP", "US", "HK", "TW"],
    features: ["独享带宽", "极低延迟", "全节点覆盖", "专属 IP"],
    badge: "旗舰",
  },
  {
    grade: "D",
    name: "家宽专线",
    subtitle: "RESIDENTIAL",
    price: "¥199",
    unit: "/ 月",
    color: "#a855f7",
    seats: 1,
    speed: "200 Mbps",
    regions: ["HK", "TW"],
    features: ["家庭宽带出口", "原生 IP", "流媒体解锁", "最高稳定性"],
    badge: "家宽",
  },
]

export function ProductGrid() {
  return (
    <section className="pb-24 px-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {PRODUCTS.map((p) => (
          <div
            key={p.grade}
            className="relative flex flex-col rounded-xl overflow-hidden group transition-transform duration-300 hover:-translate-y-1"
            style={{
              background: "rgba(0,0,0,0.72)",
              border: `1px solid ${p.color}28`,
              backdropFilter: "blur(16px)",
              boxShadow: `0 0 30px rgba(0,0,0,0.6), inset 0 0 1px ${p.color}10`,
            }}
          >
            {/* Badge */}
            {p.badge && (
              <span
                className="absolute top-3 right-3 font-mono text-[10px] font-bold tracking-widest px-2 py-0.5 rounded"
                style={{
                  color: p.color,
                  background: `${p.color}18`,
                  border: `1px solid ${p.color}40`,
                  boxShadow: `0 0 8px ${p.color}30`,
                }}
              >
                {p.badge}
              </span>
            )}

            {/* Grade header */}
            <div
              className="px-5 pt-5 pb-4"
              style={{ borderBottom: `1px solid ${p.color}14` }}
            >
              <div className="flex items-end justify-between mb-1">
                <span
                  className="font-mono font-extrabold text-4xl leading-none"
                  style={{ color: p.color, textShadow: `0 0 20px ${p.color}60` }}
                >
                  {p.grade}
                </span>
                <div className="text-right">
                  <span
                    className="font-mono font-bold text-2xl text-white"
                    style={{ textShadow: `0 0 10px ${p.color}50` }}
                  >
                    {p.price}
                  </span>
                  <span className="font-mono text-xs text-white/35 ml-1">{p.unit}</span>
                </div>
              </div>
              <p className="font-sans font-semibold text-white text-base">{p.name}</p>
              <p className="font-mono text-[10px] tracking-widest text-white/30 mt-0.5">{p.subtitle}</p>
            </div>

            {/* Specs */}
            <div className="px-5 py-4 flex flex-col gap-2.5 flex-1">
              <div className="flex items-center gap-2">
                <Gauge size={12} style={{ color: p.color }} />
                <span className="font-mono text-xs text-white/60">{p.speed}</span>
                <span className="font-mono text-[10px] text-white/25 ml-auto">{p.seats} 座</span>
              </div>

              {/* Regions */}
              <div className="flex gap-1.5 flex-wrap">
                {p.regions.map((r) => (
                  <span
                    key={r}
                    className="font-mono text-[10px] font-bold px-2 py-0.5 rounded"
                    style={{
                      color: p.color,
                      background: `${p.color}12`,
                      border: `1px solid ${p.color}30`,
                    }}
                  >
                    {r}
                  </span>
                ))}
              </div>

              {/* Features */}
              <ul className="flex flex-col gap-1.5 mt-1">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <span
                      className="w-1 h-1 rounded-full shrink-0"
                      style={{ background: p.color, boxShadow: `0 0 4px ${p.color}` }}
                    />
                    <span className="text-xs text-white/50">{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA */}
            <div className="px-5 pb-5">
              <button
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 group-hover:opacity-90"
                style={{
                  background: `${p.color}18`,
                  border: `1px solid ${p.color}40`,
                  color: p.color,
                  boxShadow: `0 0 12px ${p.color}20`,
                }}
              >
                立即上车
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Back link */}
      <div className="mt-12 flex justify-center">
        <Link
          href="/"
          className="font-mono text-xs text-white/30 hover:text-white/60 transition-colors tracking-widest"
        >
          &larr; 返回首页
        </Link>
      </div>
    </section>
  )
}
