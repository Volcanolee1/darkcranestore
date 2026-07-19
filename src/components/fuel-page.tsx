"use client"

import { useState } from "react"
import { Fuel, Zap, Package, RefreshCw, CheckCircle2, ChevronRight } from "lucide-react"

// ── Types ─────────────────────────────────────────────────────────────────────

type FuelTab = "balance" | "traffic"

interface BalancePreset { amount: number; bonus?: string; popular?: boolean }
interface TrafficPack  { id: string; name: string; traffic: string; price: number; validity: string; note?: string; color: string }

// ── Data ──────────────────────────────────────────────────────────────────────

const BALANCE_PRESETS: BalancePreset[] = [
  { amount: 50 },
  { amount: 100, bonus: "送 5 元" },
  { amount: 200, bonus: "送 15 元", popular: true },
  { amount: 500, bonus: "送 50 元" },
  { amount: 1000, bonus: "送 120 元" },
]

const TRAFFIC_PACKS: TrafficPack[] = [
  { id: "s50", name: "小补包", traffic: "50 GB", price: 12, validity: "30 天", color: "#00e6ff" },
  { id: "m150", name: "标准包", traffic: "150 GB", price: 29, validity: "30 天", note: "最受欢迎", color: "#ff2d78", },
  { id: "l300", name: "大车包", traffic: "300 GB", price: 49, validity: "30 天", color: "#a855f7" },
  { id: "xl600", name: "旗舰包", traffic: "600 GB", price: 88, validity: "30 天", note: "性价比最高", color: "#ffb800" },
  { id: "unl", name: "不限量", traffic: "不限", price: 158, validity: "30 天", note: "速率 50Mbps", color: "#ff5500" },
]

const HISTORY = [
  { id: 1, type: "充值", desc: "余额充值 +¥200", amount: "+200.00", time: "2025-07-18 14:32", color: "#00e6ff" },
  { id: 2, type: "消费", desc: "A6L HK · 7月续费", amount: "-89.00", time: "2025-07-01 00:00", color: "rgba(255,255,255,0.25)" },
  { id: 3, type: "消费", desc: "小米 SU7 JP · 7月续费", amount: "-139.00", time: "2025-07-01 00:00", color: "rgba(255,255,255,0.25)" },
  { id: 4, type: "充值", desc: "余额充值 +¥500", amount: "+500.00", time: "2025-06-15 09:11", color: "#00e6ff" },
  { id: 5, type: "消费", desc: "标准流量包 150 GB", amount: "-29.00", time: "2025-06-10 11:45", color: "rgba(255,255,255,0.25)" },
]

// ── Main component ─────────────────────────────────────────────────────────────

export function FuelPage() {
  const [tab, setTab] = useState<FuelTab>("balance")
  const [selectedPreset, setSelectedPreset] = useState<number | null>(200)
  const [customAmount, setCustomAmount] = useState("")
  const [selectedPack, setSelectedPack] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState("")

  const balance = 342.00

  function handleRecharge() {
    const amount = customAmount ? parseFloat(customAmount) : selectedPreset
    if (!amount || amount <= 0) return
    setSuccessMsg(`已成功充值 ¥${amount}，账户余额已更新`)
    setTimeout(() => setSuccessMsg(""), 4000)
    setCustomAmount("")
  }

  function handleBuyPack() {
    if (!selectedPack) return
    const pack = TRAFFIC_PACKS.find(p => p.id === selectedPack)
    if (!pack) return
    setSuccessMsg(`已购买「${pack.name}」${pack.traffic} 流量包`)
    setTimeout(() => setSuccessMsg(""), 4000)
    setSelectedPack(null)
  }

  return (
    <div className="relative min-h-screen pt-24 pb-16 overflow-hidden">
      {/* BG */}
      <div className="absolute inset-0 bg-black" />
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/images/hero-bg.png')", opacity: 0.08 }} />
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(255,45,120,0.06) 0%, transparent 70%)" }} />

      <div className="relative z-10 max-w-5xl mx-auto px-6">

        {/* Page header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <Fuel size={20} className="text-[#ff2d78]" style={{ filter: "drop-shadow(0 0 6px rgba(255,45,120,0.8))" }} />
            <h1 className="font-mono font-extrabold text-3xl text-white">加油充值</h1>
          </div>
          <p className="font-mono text-xs text-white/35 tracking-wider ml-8">FUEL &amp; TRAFFIC TOPUP</p>
        </div>

        {/* Balance card */}
        <div
          className="rounded-2xl p-6 mb-8 flex items-center justify-between"
          style={{
            background: "rgba(6,6,14,0.75)",
            border: "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(16px)",
          }}
        >
          <div>
            <p className="font-mono text-[11px] text-white/35 tracking-widest uppercase mb-1">当前余额</p>
            <p className="font-mono font-extrabold text-4xl" style={{ color: "#00e6ff", textShadow: "0 0 18px rgba(0,230,255,0.5)" }}>
              ¥{balance.toFixed(2)}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div
              className="px-4 py-2 rounded-xl font-mono text-xs text-white/40 cursor-pointer hover:text-white/70 transition-colors"
              style={{ border: "1px solid rgba(255,255,255,0.07)" }}
            >
              查看明细
            </div>
          </div>
        </div>

        {/* Success toast */}
        {successMsg && (
          <div
            className="mb-6 flex items-center gap-3 px-5 py-3.5 rounded-xl font-mono text-sm text-white"
            style={{ background: "rgba(0,230,255,0.1)", border: "1px solid rgba(0,230,255,0.35)", boxShadow: "0 0 20px rgba(0,230,255,0.15)" }}
          >
            <CheckCircle2 size={16} className="text-[#00e6ff] shrink-0" />
            {successMsg}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 mb-6 p-1 rounded-xl w-fit" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
          {([
            { id: "balance" as FuelTab, label: "余额充值", icon: Zap },
            { id: "traffic" as FuelTab, label: "流量包", icon: Package },
          ]).map(({ id, label, icon: Icon }) => {
            const active = tab === id
            return (
              <button
                key={id}
                onClick={() => setTab(id)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-mono text-sm transition-all duration-200"
                style={{
                  background: active ? "#ff2d78" : "transparent",
                  color: active ? "#000" : "rgba(255,255,255,0.4)",
                  boxShadow: active ? "0 0 16px rgba(255,45,120,0.4)" : "none",
                  fontWeight: active ? "700" : "400",
                }}
              >
                <Icon size={14} />
                {label}
              </button>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main panel */}
          <div className="lg:col-span-2">
            {tab === "balance" ? (
              <div
                className="rounded-2xl p-7"
                style={{ background: "rgba(6,6,14,0.75)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(16px)" }}
              >
                <p className="font-mono text-xs text-white/40 tracking-widest uppercase mb-5">选择充值金额</p>

                {/* Preset grid */}
                <div className="grid grid-cols-3 gap-3 mb-5">
                  {BALANCE_PRESETS.map(p => {
                    const active = selectedPreset === p.amount && !customAmount
                    return (
                      <button
                        key={p.amount}
                        onClick={() => { setSelectedPreset(p.amount); setCustomAmount("") }}
                        className="relative flex flex-col items-center justify-center py-4 rounded-xl font-mono transition-all duration-200"
                        style={{
                          background: active ? "rgba(255,45,120,0.12)" : "rgba(255,255,255,0.03)",
                          border: `1px solid ${active ? "rgba(255,45,120,0.5)" : "rgba(255,255,255,0.07)"}`,
                          boxShadow: active ? "0 0 20px rgba(255,45,120,0.15)" : "none",
                        }}
                      >
                        {p.popular && (
                          <span
                            className="absolute -top-2 left-1/2 -translate-x-1/2 font-mono text-[9px] px-2 py-0.5 rounded-full"
                            style={{ background: "#ff2d78", color: "#000", fontWeight: 700 }}
                          >
                            推荐
                          </span>
                        )}
                        <span className="font-extrabold text-lg" style={{ color: active ? "#ff2d78" : "rgba(255,255,255,0.8)" }}>
                          ¥{p.amount}
                        </span>
                        {p.bonus && (
                          <span className="text-[10px] mt-0.5" style={{ color: active ? "#ff2d78" : "rgba(255,255,255,0.3)" }}>
                            {p.bonus}
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>

                {/* Custom amount */}
                <div className="flex flex-col gap-1.5 mb-6">
                  <label className="font-mono text-[11px] text-white/35 tracking-widest uppercase">自定义金额</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-white/30 text-sm">¥</span>
                    <input
                      type="number"
                      min="1"
                      placeholder="输入任意金额"
                      value={customAmount}
                      onChange={e => { setCustomAmount(e.target.value); setSelectedPreset(null) }}
                      className="w-full pl-8 pr-4 py-3 rounded-xl font-mono text-sm text-white placeholder-white/20 outline-none transition-all duration-200"
                      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                      onFocus={e => { e.currentTarget.style.border = "1px solid rgba(255,45,120,0.5)"; e.currentTarget.style.boxShadow = "0 0 12px rgba(255,45,120,0.15)" }}
                      onBlur={e => { e.currentTarget.style.border = "1px solid rgba(255,255,255,0.08)"; e.currentTarget.style.boxShadow = "none" }}
                    />
                  </div>
                </div>

                {/* Summary + CTA */}
                <div
                  className="flex items-center justify-between px-5 py-4 rounded-xl mb-5"
                  style={{ background: "rgba(255,45,120,0.07)", border: "1px solid rgba(255,45,120,0.2)" }}
                >
                  <div>
                    <p className="font-mono text-[11px] text-white/35">充值金额</p>
                    <p className="font-mono font-extrabold text-2xl" style={{ color: "#ff2d78", textShadow: "0 0 12px rgba(255,45,120,0.5)" }}>
                      ¥{customAmount || selectedPreset || "—"}
                    </p>
                  </div>
                  <button
                    onClick={handleRecharge}
                    disabled={!customAmount && !selectedPreset}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl font-mono font-bold text-sm text-black transition-all duration-200 hover:brightness-110 active:scale-[0.98] disabled:opacity-30"
                    style={{ background: "#ff2d78", boxShadow: "0 0 20px rgba(255,45,120,0.4)" }}
                  >
                    <RefreshCw size={14} /> 立即充值
                  </button>
                </div>

                <p className="font-mono text-[10px] text-white/20 text-center tracking-wider">
                  支持支付宝 · 微信 · USDT · 余额仅限平台消费
                </p>
              </div>
            ) : (
              <div
                className="rounded-2xl p-7"
                style={{ background: "rgba(6,6,14,0.75)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(16px)" }}
              >
                <p className="font-mono text-xs text-white/40 tracking-widest uppercase mb-5">选择流量包</p>
                <div className="flex flex-col gap-3 mb-6">
                  {TRAFFIC_PACKS.map(pack => {
                    const active = selectedPack === pack.id
                    return (
                      <button
                        key={pack.id}
                        onClick={() => setSelectedPack(pack.id)}
                        className="flex items-center justify-between px-5 py-4 rounded-xl text-left transition-all duration-200"
                        style={{
                          background: active ? `${pack.color}12` : "rgba(255,255,255,0.03)",
                          border: `1px solid ${active ? pack.color + "55" : "rgba(255,255,255,0.07)"}`,
                          boxShadow: active ? `0 0 24px ${pack.color}18` : "none",
                        }}
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                            style={{ background: `${pack.color}18`, border: `1px solid ${pack.color}35` }}
                          >
                            <Package size={16} style={{ color: pack.color }} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="font-mono font-bold text-sm text-white">{pack.name}</span>
                              {pack.note && (
                                <span
                                  className="font-mono text-[9px] px-1.5 py-0.5 rounded"
                                  style={{ color: pack.color, background: `${pack.color}18`, border: `1px solid ${pack.color}35` }}
                                >
                                  {pack.note}
                                </span>
                              )}
                            </div>
                            <span className="font-mono text-xs text-white/30">{pack.traffic} · 有效期 {pack.validity}</span>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="font-mono font-extrabold text-lg" style={{ color: active ? pack.color : "rgba(255,255,255,0.6)" }}>
                            ¥{pack.price}
                          </p>
                          <p className="font-mono text-[10px] text-white/25">/ 次</p>
                        </div>
                      </button>
                    )
                  })}
                </div>
                <button
                  onClick={handleBuyPack}
                  disabled={!selectedPack}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-mono font-bold text-sm text-black transition-all duration-200 hover:brightness-110 active:scale-[0.98] disabled:opacity-30"
                  style={{ background: "#ff2d78", boxShadow: "0 0 24px rgba(255,45,120,0.4)" }}
                >
                  <Zap size={14} /> 立即购买流量包
                </button>
                <p className="font-mono text-[10px] text-white/20 text-center mt-3 tracking-wider">
                  流量包立即到账 · 有效期内使用 · 过期不退
                </p>
              </div>
            )}
          </div>

          {/* Right: history */}
          <div
            className="rounded-2xl p-6 flex flex-col gap-4"
            style={{ background: "rgba(6,6,14,0.75)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(16px)" }}
          >
            <p className="font-mono text-xs text-white/40 tracking-widest uppercase">最近记录</p>
            <div className="flex flex-col gap-1">
              {HISTORY.map((h, i) => (
                <div
                  key={h.id}
                  className="flex items-start justify-between gap-3 py-3"
                  style={{ borderBottom: i < HISTORY.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}
                >
                  <div className="flex flex-col gap-1 flex-1 min-w-0">
                    <span className="font-mono text-xs text-white/65 leading-relaxed truncate">{h.desc}</span>
                    <span className="font-mono text-[10px] text-white/20">{h.time}</span>
                  </div>
                  <span className="font-mono text-sm font-bold shrink-0" style={{ color: h.color }}>
                    {h.amount}
                  </span>
                </div>
              ))}
            </div>
            <button className="flex items-center justify-center gap-1 font-mono text-xs text-white/25 hover:text-white/50 transition-colors mt-1">
              查看全部 <ChevronRight size={12} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
