"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Car, Zap, Gauge, Calendar, ChevronRight,
  Plus, RefreshCw, TrendingUp, Wifi, Shield,
  Clock, AlertTriangle, CheckCircle2, X, Minus,
} from "lucide-react"

// ─── Mock data ────────────────────────────────────────────────────────────────

type OwnedVehicle = {
  id: string
  modelName: string
  modelSub: string
  regionFlag: string
  regionName: string
  gradeLabel: string
  gradeColor: string
  seats: number            // seats owned by this user
  bandwidth: string
  route: string
  trafficUsedGB: number
  trafficTotalGB: number   // -1 = unlimited
  expireAt: string         // ISO date string
  status: "active" | "expiring" | "expired"
  pricePerSeat: number
}

const MOCK_VEHICLES: OwnedVehicle[] = [
  {
    id: "v1",
    modelName: "BMW 525i",
    modelSub: "HK Premium · B级",
    regionFlag: "🇭🇰",
    regionName: "香港",
    gradeLabel: "B级",
    gradeColor: "#00e6ff",
    seats: 2,
    bandwidth: "200Mbps",
    route: "CN2 GIA",
    trafficUsedGB: 134,
    trafficTotalGB: 500,
    expireAt: "2025-08-15",
    status: "active",
    pricePerSeat: 68,
  },
  {
    id: "v2",
    modelName: "小米 SU7",
    modelSub: "JP Direct · B级",
    regionFlag: "🇯🇵",
    regionName: "日本",
    gradeLabel: "B级",
    gradeColor: "#00e6ff",
    seats: 1,
    bandwidth: "500Mbps",
    route: "软银直连",
    trafficUsedGB: 480,
    trafficTotalGB: 500,
    expireAt: "2025-07-28",
    status: "expiring",
    pricePerSeat: 88,
  },
  {
    id: "v3",
    modelName: "Audi A7",
    modelSub: "US West · C级",
    regionFlag: "🇺🇸",
    regionName: "美国",
    gradeLabel: "C级",
    gradeColor: "#ffb800",
    seats: 1,
    bandwidth: "1Gbps",
    route: "AS9929",
    trafficUsedGB: 220,
    trafficTotalGB: -1,
    expireAt: "2025-09-01",
    status: "active",
    pricePerSeat: 128,
  },
]

const MOCK_BALANCE = 342.50
const MOCK_TRANSACTIONS = [
  { id: "t1", desc: "充值", amount: +200, date: "2025-07-01", type: "credit" },
  { id: "t2", desc: "BMW 525i × 2 Seat 续费", amount: -136, date: "2025-07-01", type: "debit" },
  { id: "t3", desc: "小米 SU7 × 1 Seat 续费", amount: -88, date: "2025-07-01", type: "debit" },
  { id: "t4", desc: "Audi A7 × 1 Seat 续费", amount: -128, date: "2025-06-01", type: "debit" },
  { id: "t5", desc: "充值", amount: +500, date: "2025-06-01", type: "credit" },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function daysUntil(dateStr: string) {
  const diff = new Date(dateStr).getTime() - Date.now()
  return Math.ceil(diff / 86400000)
}

function trafficPct(used: number, total: number) {
  if (total === -1) return 0
  return Math.min(100, Math.round((used / total) * 100))
}

// ─── Traffic ring ─────────────────────────────────────────────────────────────

function TrafficRing({ pct, color, unlimited }: { pct: number; color: string; unlimited: boolean }) {
  const r = 26
  const circ = 2 * Math.PI * r
  const dash = unlimited ? 0 : (pct / 100) * circ
  const warnColor = pct >= 90 ? "#ff4444" : pct >= 70 ? "#ffb800" : color

  return (
    <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
      <svg width="64" height="64" className="-rotate-90">
        <circle cx="32" cy="32" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5" />
        {!unlimited && (
          <circle
            cx="32" cy="32" r={r}
            fill="none"
            stroke={warnColor}
            strokeWidth="5"
            strokeDasharray={`${dash} ${circ}`}
            strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 4px ${warnColor}80)`, transition: "stroke-dasharray 0.6s ease" }}
          />
        )}
      </svg>
      <span className="absolute font-mono text-[10px] font-bold text-white/70">
        {unlimited ? "∞" : `${pct}%`}
      </span>
    </div>
  )
}

// ─── Vehicle card ─────────────────────────────────────────────────────────────

function VehicleCard({ v, onRenew }: { v: OwnedVehicle; onRenew: (v: OwnedVehicle) => void }) {
  const days = daysUntil(v.expireAt)
  const pct = trafficPct(v.trafficUsedGB, v.trafficTotalGB)
  const unlimited = v.trafficTotalGB === -1

  const statusColor = v.status === "expired" ? "#ff4444" : v.status === "expiring" ? "#ffb800" : v.gradeColor
  const statusLabel = v.status === "expired" ? "已过期" : v.status === "expiring" ? `${days}天后到期` : `${days}天后到期`
  const StatusIcon = v.status === "expired" ? AlertTriangle : v.status === "expiring" ? Clock : CheckCircle2

  return (
    <div
      className="rounded-2xl flex flex-col gap-0 overflow-hidden transition-all duration-300 hover:translate-y-[-2px]"
      style={{
        background: "rgba(8,8,18,0.7)",
        border: `1px solid ${v.gradeColor}22`,
        backdropFilter: "blur(20px)",
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.borderColor = `${v.gradeColor}55`
        ;(e.currentTarget as HTMLElement).style.boxShadow = `0 0 32px ${v.gradeColor}12`
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.borderColor = `${v.gradeColor}22`
        ;(e.currentTarget as HTMLElement).style.boxShadow = "none"
      }}
    >
      {/* Top accent line */}
      <div className="h-[2px] w-full" style={{ background: `linear-gradient(90deg, transparent, ${v.gradeColor}, transparent)` }} />

      {/* Header */}
      <div className="flex items-start justify-between px-5 pt-4 pb-3">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-lg leading-none">{v.regionFlag}</span>
            <span className="font-mono font-bold text-lg text-white leading-none">{v.modelName}</span>
            <span
              className="font-mono text-[9px] font-bold px-1.5 py-0.5 rounded tracking-widest"
              style={{ color: v.gradeColor, background: `${v.gradeColor}18`, border: `1px solid ${v.gradeColor}35` }}
            >
              {v.gradeLabel}
            </span>
          </div>
          <span className="font-mono text-[10px] text-white/30 tracking-wider">{v.modelSub}</span>
        </div>
        {/* Status chip */}
        <div
          className="flex items-center gap-1 px-2 py-1 rounded-full"
          style={{ background: `${statusColor}14`, border: `1px solid ${statusColor}35` }}
        >
          <StatusIcon size={10} style={{ color: statusColor }} />
          <span className="font-mono text-[9px]" style={{ color: statusColor }}>{statusLabel}</span>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-5 h-px bg-white/5" />

      {/* Stats row */}
      <div className="flex items-center gap-4 px-5 py-4">
        <TrafficRing pct={pct} color={v.gradeColor} unlimited={unlimited} />
        <div className="flex flex-col gap-2 flex-1 min-w-0">
          {/* Traffic */}
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] text-white/35">流量</span>
            <span className="font-mono text-[11px] text-white/70">
              {unlimited ? "不限量" : `${v.trafficUsedGB}GB / ${v.trafficTotalGB}GB`}
            </span>
          </div>
          {/* Traffic bar */}
          {!unlimited && (
            <div className="w-full h-1 rounded-full bg-white/6">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${pct}%`,
                  background: pct >= 90 ? "#ff4444" : pct >= 70 ? "#ffb800" : v.gradeColor,
                  boxShadow: `0 0 6px ${pct >= 90 ? "#ff444480" : v.gradeColor + "60"}`,
                }}
              />
            </div>
          )}
          {/* Bandwidth + route */}
          <div className="flex items-center gap-4 mt-0.5">
            <div className="flex items-center gap-1">
              <Wifi size={9} className="text-white/25" />
              <span className="font-mono text-[9px] text-white/40">{v.bandwidth}</span>
            </div>
            <div className="flex items-center gap-1">
              <Shield size={9} className="text-white/25" />
              <span className="font-mono text-[9px] text-white/40">{v.route}</span>
            </div>
            <div className="flex items-center gap-1">
              <Car size={9} className="text-white/25" />
              <span className="font-mono text-[9px] text-white/40">{v.seats} Seat</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-5 pb-4 mt-auto">
        <div className="flex items-center gap-1.5">
          <Calendar size={11} className="text-white/25" />
          <span className="font-mono text-[10px] text-white/30">
            到期 {v.expireAt}
          </span>
        </div>
        <button
          onClick={() => onRenew(v)}
          className="flex items-center gap-1.5 font-mono text-[11px] font-semibold px-3 py-1.5 rounded-lg transition-all duration-200 hover:brightness-110 active:scale-95"
          style={{
            background: `${v.gradeColor}18`,
            border: `1px solid ${v.gradeColor}40`,
            color: v.gradeColor,
            boxShadow: `0 0 10px ${v.gradeColor}20`,
          }}
        >
          <RefreshCw size={10} /> 续费
        </button>
      </div>
    </div>
  )
}

// ─── Recharge modal ───────────────────────────────────────────────────────────

const PRESET_AMOUNTS = [50, 100, 200, 500]

function RechargeModal({ onClose }: { onClose: () => void }) {
  const [amount, setAmount] = useState<string>("100")
  const [done, setDone] = useState(false)

  function handleSubmit() {
    const n = parseFloat(amount)
    if (!n || n < 1) return
    setDone(true)
  }

  return (
    <ModalShell onClose={onClose} title="加油充值" accent="#ff2d78">
      {!done ? (
        <div className="flex flex-col gap-5">
          <p className="font-mono text-[11px] text-white/35 tracking-wider">选择或输入充值金额（元）</p>

          {/* Preset amounts */}
          <div className="grid grid-cols-4 gap-2">
            {PRESET_AMOUNTS.map(a => (
              <button
                key={a}
                onClick={() => setAmount(String(a))}
                className="py-2.5 rounded-xl font-mono font-bold text-sm transition-all duration-150"
                style={{
                  background: amount === String(a) ? "rgba(255,45,120,0.15)" : "rgba(255,255,255,0.04)",
                  border: `1px solid ${amount === String(a) ? "rgba(255,45,120,0.5)" : "rgba(255,255,255,0.08)"}`,
                  color: amount === String(a) ? "#ff2d78" : "rgba(255,255,255,0.5)",
                  boxShadow: amount === String(a) ? "0 0 14px rgba(255,45,120,0.2)" : "none",
                }}
              >
                ¥{a}
              </button>
            ))}
          </div>

          {/* Custom input */}
          <div
            className="flex items-center gap-3 rounded-xl px-4 py-3"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,45,120,0.3)" }}
          >
            <span className="font-mono text-lg text-[#ff2d78]">¥</span>
            <input
              type="text"
              inputMode="decimal"
              value={amount}
              onChange={e => setAmount(e.target.value.replace(/[^0-9.]/g, ""))}
              className="flex-1 bg-transparent outline-none font-mono text-xl font-bold text-white caret-[#ff2d78]"
              placeholder="自定义金额"
            />
          </div>

          <div className="flex items-center justify-between px-1">
            <span className="font-mono text-[10px] text-white/25">支付方式：USDT / 支付宝 / 微信</span>
            <span className="font-mono text-[10px] text-white/25">到账余额</span>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full py-3.5 rounded-xl font-mono font-bold text-sm text-black transition-all duration-200 hover:brightness-110"
            style={{ background: "#ff2d78", boxShadow: "0 0 24px rgba(255,45,120,0.4)" }}
          >
            立即充值 ¥{amount || "0"}
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 py-4">
          <CheckCircle2 size={48} color="#00e6ff" style={{ filter: "drop-shadow(0 0 12px rgba(0,230,255,0.6))" }} />
          <p className="font-mono font-bold text-xl text-white">充值请求已提交</p>
          <p className="font-mono text-[11px] text-white/35 text-center leading-relaxed">
            系统将在确认到账后自动更新余额<br />通常在 5 分钟内完成
          </p>
          <button
            onClick={onClose}
            className="font-mono text-xs text-white/40 hover:text-white/70 transition-colors mt-2"
          >
            关闭窗口
          </button>
        </div>
      )}
    </ModalShell>
  )
}

// ─── Renew modal ──────────────────────────────────────────────────────────────

function RenewModal({ vehicle, balance, onClose }: { vehicle: OwnedVehicle; balance: number; onClose: () => void }) {
  const [months, setMonths] = useState(1)
  const total = months * vehicle.seats * vehicle.pricePerSeat
  const enough = balance >= total
  const [done, setDone] = useState(false)

  return (
    <ModalShell onClose={onClose} title="提前续费" accent={vehicle.gradeColor}>
      {!done ? (
        <div className="flex flex-col gap-5">
          {/* Vehicle summary */}
          <div
            className="rounded-xl px-4 py-3 flex items-center gap-3"
            style={{ background: `${vehicle.gradeColor}0e`, border: `1px solid ${vehicle.gradeColor}25` }}
          >
            <span className="text-xl">{vehicle.regionFlag}</span>
            <div className="flex flex-col gap-0.5">
              <span className="font-mono font-bold text-sm text-white">{vehicle.modelName}</span>
              <span className="font-mono text-[10px] text-white/35">{vehicle.seats} Seat · ¥{vehicle.pricePerSeat}/Seat/月</span>
            </div>
          </div>

          {/* Month selector */}
          <div className="flex flex-col gap-2">
            <label className="font-mono text-[10px] text-white/35 tracking-wider">续费月数</label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMonths(m => Math.max(1, m - 1))}
                className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-150 disabled:opacity-20"
                disabled={months <= 1}
                style={{ background: `${vehicle.gradeColor}18`, border: `1px solid ${vehicle.gradeColor}35`, color: vehicle.gradeColor }}
              >
                <Minus size={14} />
              </button>
              <div
                className="flex-1 py-3 rounded-xl text-center font-mono font-bold text-2xl"
                style={{ color: vehicle.gradeColor, background: `${vehicle.gradeColor}0e`, border: `1px solid ${vehicle.gradeColor}25` }}
              >
                {months}
                <span className="text-sm font-normal text-white/35 ml-1">月</span>
              </div>
              <button
                onClick={() => setMonths(m => Math.min(12, m + 1))}
                className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-150 disabled:opacity-20"
                disabled={months >= 12}
                style={{ background: `${vehicle.gradeColor}18`, border: `1px solid ${vehicle.gradeColor}35`, color: vehicle.gradeColor }}
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

          {/* Price breakdown */}
          <div
            className="rounded-xl px-4 py-3 flex flex-col gap-2"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            {[
              { label: "单价", val: `¥${vehicle.pricePerSeat} / Seat / 月` },
              { label: "Seat 数", val: `${vehicle.seats} Seat` },
              { label: "续费月数", val: `${months} 月` },
            ].map(({ label, val }) => (
              <div key={label} className="flex justify-between">
                <span className="font-mono text-[10px] text-white/30">{label}</span>
                <span className="font-mono text-[10px] text-white/55">{val}</span>
              </div>
            ))}
            <div className="h-px bg-white/6 my-1" />
            <div className="flex justify-between">
              <span className="font-mono text-xs text-white/50">合计</span>
              <span className="font-mono font-bold text-base" style={{ color: vehicle.gradeColor }}>¥{total}</span>
            </div>
          </div>

          {/* Balance check */}
          <div className="flex items-center justify-between px-1">
            <span className="font-mono text-[10px] text-white/30">
              当前余额 <span className={enough ? "text-white/60" : "text-[#ff4444]"}>¥{balance.toFixed(2)}</span>
            </span>
            {!enough && (
              <span className="font-mono text-[10px] text-[#ff4444] flex items-center gap-1">
                <AlertTriangle size={10} /> 余额不足
              </span>
            )}
          </div>

          <button
            disabled={!enough}
            onClick={() => setDone(true)}
            className="w-full py-3.5 rounded-xl font-mono font-bold text-sm transition-all duration-200 hover:brightness-110 disabled:opacity-30 disabled:cursor-not-allowed"
            style={{ background: vehicle.gradeColor, color: "#000", boxShadow: `0 0 24px ${vehicle.gradeColor}40` }}
          >
            确认续费 · 扣除 ¥{total}
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 py-4">
          <CheckCircle2 size={48} color={vehicle.gradeColor} style={{ filter: `drop-shadow(0 0 12px ${vehicle.gradeColor}80)` }} />
          <p className="font-mono font-bold text-xl text-white">续费成功</p>
          <p className="font-mono text-[11px] text-white/35 text-center leading-relaxed">
            {vehicle.modelName} 已续费 {months} 个月<br />
            新到期日：{new Date(new Date(vehicle.expireAt).getTime() + months * 30 * 86400000).toISOString().slice(0, 10)}
          </p>
          <button onClick={onClose} className="font-mono text-xs text-white/40 hover:text-white/70 transition-colors mt-2">
            关闭窗口
          </button>
        </div>
      )}
    </ModalShell>
  )
}

// ─── Modal shell ──────────────────────────────────────────────────────────────

function ModalShell({ children, onClose, title, accent }: {
  children: React.ReactNode
  onClose: () => void
  title: string
  accent: string
}) {
  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-md rounded-2xl flex flex-col overflow-hidden"
        style={{ background: "rgba(8,8,18,0.95)", border: `1px solid ${accent}30`, backdropFilter: "blur(24px)" }}
        onClick={e => e.stopPropagation()}
      >
        {/* Top accent */}
        <div className="h-[2px]" style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }} />
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4">
          <span className="font-mono font-bold text-base text-white tracking-wide">{title}</span>
          <button onClick={onClose} className="text-white/30 hover:text-white/70 transition-colors">
            <X size={18} />
          </button>
        </div>
        <div className="h-px mx-6 bg-white/6" />
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  )
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export function Dashboard() {
  const [renewTarget, setRenewTarget] = useState<OwnedVehicle | null>(null)
  const [showRecharge, setShowRecharge] = useState(false)

  const totalMonthly = MOCK_VEHICLES.reduce((sum, v) => sum + v.seats * v.pricePerSeat, 0)
  const expiringCount = MOCK_VEHICLES.filter(v => v.status === "expiring" || v.status === "expired").length

  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 max-w-6xl mx-auto">

      {/* Page header */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="font-mono text-[10px] text-white/25 tracking-[0.2em] uppercase mb-1">Vehicle Management</p>
          <h1 className="font-mono font-extrabold text-3xl text-white">
            我的<span className="text-neon-pink">车辆</span>
          </h1>
        </div>
        <Link
          href="/shop"
          className="hidden sm:flex items-center gap-1.5 font-mono text-xs font-semibold px-4 py-2 rounded-lg transition-all duration-200 hover:brightness-110"
          style={{ background: "rgba(255,45,120,0.12)", border: "1px solid rgba(255,45,120,0.35)", color: "#ff2d78" }}
        >
          <Plus size={12} /> 选购新车型
        </Link>
      </div>

      {/* Summary stat bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {[
          { label: "在手车辆", value: String(MOCK_VEHICLES.length), unit: "辆", color: "#00e6ff", icon: Car },
          { label: "月均费用", value: `¥${totalMonthly}`, unit: "/ 月", color: "#ff2d78", icon: TrendingUp },
          { label: "账户余额", value: `¥${MOCK_BALANCE.toFixed(2)}`, unit: "", color: "#a3e635", icon: Zap },
          { label: "即将到期", value: String(expiringCount), unit: "辆", color: expiringCount > 0 ? "#ffb800" : "#ffffff33", icon: Clock },
        ].map(({ label, value, unit, color, icon: Icon }) => (
          <div
            key={label}
            className="rounded-xl px-4 py-4 flex flex-col gap-2"
            style={{ background: "rgba(8,8,18,0.7)", border: `1px solid ${color}20`, backdropFilter: "blur(16px)" }}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[9px] text-white/30 tracking-widest uppercase">{label}</span>
              <Icon size={12} style={{ color, opacity: 0.6 }} />
            </div>
            <div className="font-mono font-extrabold text-xl leading-none" style={{ color }}>
              {value}
              {unit && <span className="text-[10px] font-normal text-white/30 ml-1">{unit}</span>}
            </div>
          </div>
        ))}
      </div>

      {/* ── Two-column layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left: vehicle cards (2/3 width) */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <p className="font-mono text-[10px] text-white/25 tracking-[0.18em] uppercase">已购车辆</p>
          {MOCK_VEHICLES.map(v => (
            <VehicleCard key={v.id} v={v} onRenew={setRenewTarget} />
          ))}
        </div>

        {/* Right: balance panel (1/3 width) */}
        <div className="flex flex-col gap-4">
          <p className="font-mono text-[10px] text-white/25 tracking-[0.18em] uppercase">余额看板</p>

          {/* Balance card */}
          <div
            className="rounded-2xl p-5 flex flex-col gap-5"
            style={{ background: "rgba(8,8,18,0.7)", border: "1px solid rgba(255,45,120,0.2)", backdropFilter: "blur(20px)" }}
          >
            <div className="flex items-start justify-between">
              <div className="flex flex-col gap-1">
                <span className="font-mono text-[9px] text-white/25 tracking-[0.2em] uppercase">Account Balance</span>
                <span
                  className="font-mono font-extrabold text-4xl leading-none"
                  style={{ color: "#ff2d78", textShadow: "0 0 20px rgba(255,45,120,0.4)" }}
                >
                  ¥{MOCK_BALANCE.toFixed(2)}
                </span>
              </div>
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: "rgba(255,45,120,0.12)", border: "1px solid rgba(255,45,120,0.3)" }}
              >
                <Gauge size={18} color="#ff2d78" />
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => setShowRecharge(true)}
                className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl font-mono text-sm font-bold text-black transition-all duration-200 hover:brightness-110"
                style={{ background: "#ff2d78", boxShadow: "0 0 20px rgba(255,45,120,0.35)" }}
              >
                <Plus size={14} /> 充值
              </button>
              <button
                className="flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl font-mono text-xs text-white/50 transition-all duration-200 hover:text-white/80"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <ChevronRight size={14} /> 明细
              </button>
            </div>

            {/* Quick renew hint */}
            {expiringCount > 0 && (
              <div
                className="rounded-xl px-3 py-2.5 flex items-center gap-2"
                style={{ background: "rgba(255,184,0,0.08)", border: "1px solid rgba(255,184,0,0.25)" }}
              >
                <AlertTriangle size={12} color="#ffb800" />
                <span className="font-mono text-[10px] text-[#ffb800] leading-relaxed">
                  {expiringCount} 辆车即将到期，建议提前续费
                </span>
              </div>
            )}
          </div>

          {/* Transaction history */}
          <div
            className="rounded-2xl p-5 flex flex-col gap-3"
            style={{ background: "rgba(8,8,18,0.7)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(20px)" }}
          >
            <p className="font-mono text-[9px] text-white/25 tracking-[0.2em] uppercase">最近交易</p>
            <div className="flex flex-col gap-0">
              {MOCK_TRANSACTIONS.map((t, i) => (
                <div
                  key={t.id}
                  className="flex items-center justify-between py-2.5"
                  style={{ borderBottom: i < MOCK_TRANSACTIONS.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}
                >
                  <div className="flex flex-col gap-0.5">
                    <span className="font-mono text-[11px] text-white/65">{t.desc}</span>
                    <span className="font-mono text-[9px] text-white/25">{t.date}</span>
                  </div>
                  <span
                    className="font-mono text-sm font-bold"
                    style={{ color: t.type === "credit" ? "#a3e635" : "rgba(255,255,255,0.45)" }}
                  >
                    {t.type === "credit" ? "+" : ""}¥{Math.abs(t.amount)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showRecharge && <RechargeModal onClose={() => setShowRecharge(false)} />}
      {renewTarget && (
        <RenewModal
          vehicle={renewTarget}
          balance={MOCK_BALANCE}
          onClose={() => setRenewTarget(null)}
        />
      )}
    </div>
  )
}
