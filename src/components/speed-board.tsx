"use client"

import { useState, useEffect, useRef, useCallback } from "react"

// ── Data ─────────────────────────────────────────────────────────────────────

const REGIONS = [
  {
    id: "JP",
    label: "日本",
    flag: "JP",
    carriers: [
      { name: "电信", ms: 89, status: "good" as const },
      { name: "联通", ms: 113, status: "ok" as const },
      { name: "移动", ms: 69, status: "good" as const },
    ],
  },
  {
    id: "US",
    label: "美国",
    flag: "US",
    carriers: [
      { name: "电信", ms: 150, status: "ok" as const },
      { name: "联通", ms: 151, status: "ok" as const },
      { name: "移动", ms: 155, status: "ok" as const },
    ],
  },
  {
    id: "HK",
    label: "香港",
    flag: "HK",
    carriers: [
      { name: "电信", ms: 42, status: "good" as const },
      { name: "联通", ms: 38, status: "good" as const },
      { name: "移动", ms: 45, status: "good" as const },
    ],
  },
  {
    id: "TW",
    label: "台湾",
    flag: "TW",
    carriers: [
      { name: "电信", ms: 72, status: "good" as const },
      { name: "联通", ms: 98, status: "ok" as const },
      { name: "移动", ms: 81, status: "good" as const },
    ],
  },
]

// ── Gauge helpers ─────────────────────────────────────────────────────────────

/** Map latency (0–300ms) to a 0–1 normalised value for the arc */
function latencyToNorm(ms: number) {
  return Math.min(ms / 300, 1)
}

/** Colour: green → yellow → red based on ms */
function latencyColor(ms: number) {
  if (ms <= 80) return "#00e6ff"    // fast  → cyan
  if (ms <= 150) return "#ff2d78"   // ok    → pink
  return "#ff5500"                  // slow  → orange
}

/** SVG arc path for a given 0–1 value within a 240° sweep */
function arcPath(cx: number, cy: number, r: number, norm: number, sweep = 240) {
  const startAngle = (180 - sweep / 2) * (Math.PI / 180)
  const endAngle = startAngle + norm * sweep * (Math.PI / 180)
  const x1 = cx + r * Math.cos(startAngle)
  const y1 = cy + r * Math.sin(startAngle)
  const x2 = cx + r * Math.cos(endAngle)
  const y2 = cy + r * Math.sin(endAngle)
  const large = norm * sweep > 180 ? 1 : 0
  return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`
}

// ── Sub-components ────────────────────────────────────────────────────────────

function GaugeNeedle({ cx, cy, r, norm, sweep = 240, color }: {
  cx: number; cy: number; r: number; norm: number; sweep?: number; color: string
}) {
  const startAngle = (180 - sweep / 2) * (Math.PI / 180)
  const angle = startAngle + norm * sweep * (Math.PI / 180)
  const x2 = cx + r * Math.cos(angle)
  const y2 = cy + r * Math.sin(angle)
  const x3 = cx + (r * 0.15) * Math.cos(angle + Math.PI)
  const y3 = cy + (r * 0.15) * Math.sin(angle + Math.PI)
  return (
    <g>
      <line
        x1={x3} y1={y3} x2={x2} y2={y2}
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        style={{ filter: `drop-shadow(0 0 4px ${color})` }}
      />
      <circle cx={cx} cy={cy} r={4} fill={color} style={{ filter: `drop-shadow(0 0 6px ${color})` }} />
    </g>
  )
}

function Gauge({ ms, label }: { ms: number; label: string }) {
  const cx = 52; const cy = 52; const r = 38
  const norm = latencyToNorm(ms)
  const color = latencyColor(ms)
  const trackPath = arcPath(cx, cy, r, 1)
  const fillPath = arcPath(cx, cy, r, norm)

  // tick marks
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => {
    const sweep = 240
    const startAngle = (180 - sweep / 2) * (Math.PI / 180)
    const angle = startAngle + t * sweep * (Math.PI / 180)
    const inner = r - 5; const outer = r + 2
    return {
      x1: cx + inner * Math.cos(angle),
      y1: cy + inner * Math.sin(angle),
      x2: cx + outer * Math.cos(angle),
      y2: cy + outer * Math.sin(angle),
    }
  })

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={104} height={104} viewBox="0 0 104 104" className="overflow-visible">
        {/* Track */}
        <path d={trackPath} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={5} strokeLinecap="round" />
        {/* Fill */}
        <path
          d={fillPath}
          fill="none"
          stroke={color}
          strokeWidth={5}
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 5px ${color})` }}
        />
        {/* Ticks */}
        {ticks.map((t, i) => (
          <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2}
            stroke="rgba(255,255,255,0.2)" strokeWidth={1.5} strokeLinecap="round" />
        ))}
        {/* Needle */}
        <GaugeNeedle cx={cx} cy={cy} r={r - 6} norm={norm} color={color} />
        {/* Centre value */}
        <text x={cx} y={cy + 4} textAnchor="middle"
          fill={color} fontSize={13} fontFamily="monospace" fontWeight="bold"
          style={{ filter: `drop-shadow(0 0 5px ${color})` }}>
          {ms}
        </text>
        <text x={cx} y={cy + 16} textAnchor="middle"
          fill="rgba(255,255,255,0.35)" fontSize={7.5} fontFamily="monospace">
          ms
        </text>
      </svg>
      <span className="text-[10px] font-mono text-white/40 tracking-widest">{label}</span>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

const CAROUSEL_MS = 3500

export function SpeedBoard() {
  const [active, setActive] = useState(0)
  const [animating, setAnimating] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const goTo = useCallback((idx: number) => {
    if (idx === active) return
    setAnimating(true)
    setTimeout(() => {
      setActive(idx)
      setAnimating(false)
    }, 220)
  }, [active])

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      goTo((active + 1) % REGIONS.length)
    }, CAROUSEL_MS)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [active, goTo])

  const region = REGIONS[active]
  const avgMs = Math.round(region.carriers.reduce((s, c) => s + c.ms, 0) / region.carriers.length)

  return (
    <div
      className="w-[300px] rounded-xl overflow-hidden select-none"
      style={{
        background: "rgba(0,0,0,0.72)",
        border: "1px solid rgba(0,230,255,0.18)",
        backdropFilter: "blur(16px)",
        boxShadow: "0 0 30px rgba(0,0,0,0.7), inset 0 0 1px rgba(0,230,255,0.08)",
      }}
    >
      {/* Region tabs */}
      <div className="flex" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        {REGIONS.map((r, i) => (
          <button
            key={r.id}
            onClick={() => goTo(i)}
            className="flex-1 py-2 font-mono text-xs font-bold tracking-widest transition-all duration-200 relative"
            style={{
              color: i === active ? "#fff" : "rgba(255,255,255,0.3)",
              background: i === active ? "rgba(0,230,255,0.07)" : "transparent",
            }}
          >
            {r.id}
            {i === active && (
              <span
                className="absolute bottom-0 left-2 right-2 h-[1.5px] rounded-full"
                style={{ background: "#00e6ff", boxShadow: "0 0 6px rgba(0,230,255,0.8)" }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Gauge area */}
      <div
        className="px-4 pt-4 pb-2 transition-opacity duration-200"
        style={{ opacity: animating ? 0 : 1 }}
      >
        {/* Region label */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <span
              className="font-mono font-bold text-lg text-white"
              style={{ textShadow: "0 0 12px rgba(0,230,255,0.6)" }}
            >
              {region.id}
            </span>
            <span className="ml-2 font-mono text-xs text-white/35">{region.label}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-[10px] text-white/30">AVG</span>
            <span
              className="font-mono text-sm font-bold"
              style={{ color: latencyColor(avgMs), textShadow: `0 0 8px ${latencyColor(avgMs)}` }}
            >
              {avgMs}ms
            </span>
          </div>
        </div>

        {/* Three gauges */}
        <div className="flex justify-around">
          {region.carriers.map((c) => (
            <Gauge key={c.name} ms={c.ms} label={c.name} />
          ))}
        </div>
      </div>

      {/* Carousel progress bar */}
      <div className="px-4 pb-3">
        <div className="flex gap-1">
          {REGIONS.map((_, i) => (
            <div
              key={i}
              className="flex-1 h-[2px] rounded-full cursor-pointer"
              style={{ background: i === active ? "rgba(0,230,255,0.7)" : "rgba(255,255,255,0.1)" }}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
