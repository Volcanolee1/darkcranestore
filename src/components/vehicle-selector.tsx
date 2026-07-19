"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, ArrowRight, Users, Gauge, Zap, ChevronRight } from "lucide-react"
import { REGIONS, GRADES, VEHICLES, type Region, type Grade, type Vehicle } from "@/lib/shop-data"

// ─── Step indicator ───────────────────────────────────────────────────────────

const STEPS = ["目的地", "车辆级别", "选择车型", "车辆配置"]

function StepBar({ step }: { step: number }) {
  return (
    <div className="flex items-center gap-0 mb-10">
      {STEPS.map((label, i) => {
        const active = i === step
        const done = i < step
        const color = done || active ? "#ff2d78" : "rgba(255,255,255,0.15)"
        return (
          <div key={i} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-all duration-300"
                style={{
                  background: done || active ? "#ff2d78" : "rgba(255,45,120,0.08)",
                  border: `1px solid ${color}`,
                  color: done || active ? "#000" : "rgba(255,255,255,0.3)",
                  boxShadow: active ? "0 0 14px rgba(255,45,120,0.6)" : "none",
                }}
              >
                {done ? "✓" : i + 1}
              </div>
              <span
                className="font-mono text-[10px] tracking-wider whitespace-nowrap"
                style={{ color: active ? "#ff2d78" : done ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.2)" }}
              >
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className="w-16 h-px mx-2 mb-5 transition-all duration-300"
                style={{ background: done ? "#ff2d78" : "rgba(255,255,255,0.08)" }}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── Step 1: Region ───────────────────────────────────────────────────────────

function StepRegion({ onSelect }: { onSelect: (r: Region) => void }) {
  return (
    <div>
      <h2 className="font-sans font-extrabold text-2xl text-white mb-1">选择目的地</h2>
      <p className="font-mono text-xs text-white/30 mb-8 tracking-wider">SELECT DESTINATION</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {REGIONS.map((r) => (
          <button
            key={r.id}
            onClick={() => onSelect(r)}
            className="group relative flex flex-col items-center gap-3 rounded-xl p-6 transition-all duration-200 hover:-translate-y-1 cursor-pointer text-left"
            style={{
              background: "rgba(0,0,0,0.6)",
              border: `1px solid ${r.color}20`,
              backdropFilter: "blur(16px)",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.borderColor = `${r.color}60`
              ;(e.currentTarget as HTMLElement).style.boxShadow = `0 0 30px ${r.color}20`
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.borderColor = `${r.color}20`
              ;(e.currentTarget as HTMLElement).style.boxShadow = "none"
            }}
          >
            <span className="text-4xl">{r.flag}</span>
            <div className="text-center">
              <p className="font-sans font-bold text-white text-lg leading-none">{r.name}</p>
              <p className="font-mono text-[10px] tracking-widest mt-1" style={{ color: r.color }}>{r.nameEn}</p>
            </div>
            <p className="font-mono text-[10px] text-white/30 text-center leading-relaxed">{r.tagline}</p>
            <div
              className="flex items-center gap-1 font-mono text-[10px] font-semibold mt-1"
              style={{ color: r.color }}
            >
              上车 <ChevronRight size={10} />
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── Step 2: Grade ────────────────────────────────────────────────────────────

function StepGrade({ region, onSelect, onBack }: { region: Region; onSelect: (g: Grade) => void; onBack: () => void }) {
  const availableVehicleGradeIds = new Set(
    VEHICLES.filter(v => v.regionId === region.id).map(v => v.gradeId)
  )

  return (
    <div>
      <button onClick={onBack} className="flex items-center gap-1.5 font-mono text-xs text-white/30 hover:text-white/70 transition-colors mb-6">
        <ArrowLeft size={12} /> 返回目的地
      </button>
      <div className="flex items-center gap-2 mb-1">
        <span className="text-2xl">{region.flag}</span>
        <h2 className="font-sans font-extrabold text-2xl text-white">{region.name} · 车辆级别</h2>
      </div>
      <p className="font-mono text-xs text-white/30 mb-8 tracking-wider">SELECT VEHICLE GRADE</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {GRADES.map((g) => {
          const hasStock = availableVehicleGradeIds.has(g.id)
          const clickable = hasStock

          return (
            <button
              key={g.id}
              onClick={() => clickable && onSelect(g)}
              disabled={!clickable}
              className="relative flex flex-col rounded-xl p-5 transition-all duration-200 text-left"
              style={{
                background: clickable ? "rgba(0,0,0,0.6)" : "rgba(0,0,0,0.3)",
                border: `1px solid ${clickable ? g.color + "28" : "rgba(255,255,255,0.06)"}`,
                backdropFilter: "blur(16px)",
                opacity: clickable ? 1 : 0.4,
                cursor: clickable ? "pointer" : "not-allowed",
              }}
              onMouseEnter={e => {
                if (!clickable) return
                ;(e.currentTarget as HTMLElement).style.borderColor = `${g.color}60`
                ;(e.currentTarget as HTMLElement).style.boxShadow = `0 0 28px ${g.color}18`
                ;(e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"
              }}
              onMouseLeave={e => {
                if (!clickable) return
                ;(e.currentTarget as HTMLElement).style.borderColor = `${g.color}28`
                ;(e.currentTarget as HTMLElement).style.boxShadow = "none"
                ;(e.currentTarget as HTMLElement).style.transform = "none"
              }}
            >
              {!clickable && (
                <span className="absolute top-3 right-3 font-mono text-[9px] text-white/20 tracking-widest border border-white/10 px-1.5 py-0.5 rounded">
                  暂无车辆
                </span>
              )}
              <span
                className="font-mono font-extrabold text-5xl leading-none mb-3"
                style={{ color: g.color, textShadow: clickable ? `0 0 24px ${g.color}50` : "none" }}
              >
                {g.label}
              </span>
              <p className="font-sans font-bold text-white text-base">{g.nameZh}</p>
              <p className="font-mono text-[10px] tracking-widest mb-3" style={{ color: g.color }}>{g.subtitle}</p>
              <p className="font-mono text-[10px] text-white/35 leading-relaxed mb-4">{g.desc}</p>
              <div
                className="inline-flex items-center gap-1 font-mono text-[10px] font-bold px-2.5 py-1 rounded self-start"
                style={{
                  color: g.fuelColor,
                  background: `${g.fuelColor}12`,
                  border: `1px solid ${g.fuelColor}30`,
                }}
              >
                <Zap size={9} /> {g.fuel}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ─── Seat occupancy badge ─────────────────────────────────────────────────────

function SeatBadge({ occupied, max, gradeColor }: { occupied: number; max: number; gradeColor: string }) {
  const isFull = occupied >= max
  const available = max - occupied

  // Color logic: full = red, 1 seat left = orange, otherwise grade color
  const dotColor = isFull ? "#ff4444" : available === 1 ? "#ffb800" : gradeColor

  return (
    <div
      className="absolute top-3 right-3 flex flex-col items-end gap-1"
    >
      {/* Seat pip row */}
      <div className="flex items-center gap-[3px]">
        {Array.from({ length: max }).map((_, i) => (
          <div
            key={i}
            className="w-[7px] h-[7px] rounded-sm transition-all duration-300"
            style={{
              background: i < occupied ? dotColor : "rgba(255,255,255,0.10)",
              boxShadow: i < occupied ? `0 0 5px ${dotColor}90` : "none",
            }}
          />
        ))}
      </div>
      {/* Label */}
      <span
        className="font-mono text-[9px] tracking-wider"
        style={{ color: isFull ? "#ff4444" : "rgba(255,255,255,0.35)" }}
      >
        {isFull ? "已满员" : `还差 ${available} 人发车`}
      </span>
    </div>
  )
}

// ─── Step 3: Vehicle model ────────────────────────────────────────────────────

function StepVehicle({
  region, grade, onSelect, onBack,
}: {
  region: Region
  grade: Grade
  onSelect: (v: Vehicle) => void
  onBack: () => void
}) {
  const vehicles = VEHICLES.filter(v => v.regionId === region.id && v.gradeId === grade.id)

  return (
    <div>
      <button onClick={onBack} className="flex items-center gap-1.5 font-mono text-xs text-white/30 hover:text-white/70 transition-colors mb-6">
        <ArrowLeft size={12} /> 返回车辆级别
      </button>
      <div className="flex items-center gap-3 mb-1">
        <span className="text-2xl">{region.flag}</span>
        <span
          className="font-mono font-extrabold text-3xl leading-none"
          style={{ color: grade.color, textShadow: `0 0 18px ${grade.color}50` }}
        >
          {grade.label}
        </span>
        <h2 className="font-sans font-extrabold text-2xl text-white">级 · 选择车型</h2>
      </div>
      <p className="font-mono text-xs text-white/30 mb-8 tracking-wider">SELECT MODEL</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {vehicles.map((v) => (
          <button
            key={v.id}
            onClick={() => onSelect(v)}
            className="relative flex flex-col rounded-xl overflow-hidden text-left transition-all duration-200"
            style={{
              background: "rgba(0,0,0,0.65)",
              border: `1px solid ${grade.color}20`,
              backdropFilter: "blur(16px)",
            }}
            onMouseEnter={e => {
              ;(e.currentTarget as HTMLElement).style.borderColor = `${grade.color}55`
              ;(e.currentTarget as HTMLElement).style.boxShadow = `0 0 32px ${grade.color}18`
              ;(e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"
            }}
            onMouseLeave={e => {
              ;(e.currentTarget as HTMLElement).style.borderColor = `${grade.color}20`
              ;(e.currentTarget as HTMLElement).style.boxShadow = "none"
              ;(e.currentTarget as HTMLElement).style.transform = "none"
            }}
          >
            {/* Seat occupancy badge — top-right corner */}
            <SeatBadge occupied={v.occupiedSeats} max={v.maxSeats} gradeColor={grade.color} />

            {v.badge && (
              <span
                className="absolute top-3 left-3 font-mono text-[10px] font-bold tracking-widest px-2 py-0.5 rounded"
                style={{
                  color: grade.color,
                  background: `${grade.color}18`,
                  border: `1px solid ${grade.color}40`,
                  boxShadow: `0 0 8px ${grade.color}30`,
                }}
              >
                {v.badge}
              </span>
            )}

            {/* Top bar */}
            <div className="px-5 pt-5 pb-4" style={{ borderBottom: `1px solid ${grade.color}12` }}>
              <p
                className="font-mono font-extrabold text-3xl leading-none mb-1"
                style={{ color: grade.color, textShadow: `0 0 18px ${grade.color}50` }}
              >
                {v.modelName}
              </p>
              <p className="font-mono text-[10px] tracking-widest text-white/30">{v.modelSub}</p>
            </div>

            {/* Config preview */}
            <div className="px-5 py-4 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-white/40 text-xs font-mono">
                <Gauge size={11} />
                <span>{v.configs[0].bandwidth}</span>
                <span className="mx-1 text-white/15">·</span>
                <span>{v.configs[0].route}</span>
              </div>
              <div className="flex items-center gap-2 text-white/40 text-xs font-mono">
                <Users size={11} />
                <span>{v.configs.length} 种拼车方案</span>
                <span className="ml-auto font-bold" style={{ color: grade.color }}>
                  ¥{Math.min(...v.configs.map(c => c.pricePerSeat))} 起 / Seat
                </span>
              </div>
            </div>

            {/* CTA */}
            <div className="px-5 pb-5">
              <div
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-semibold text-sm"
                style={{
                  background: `${grade.color}14`,
                  border: `1px solid ${grade.color}35`,
                  color: grade.color,
                  boxShadow: `0 0 10px ${grade.color}15`,
                }}
              >
                查看配置 <ChevronRight size={13} />
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── Step 4: Config ───────────────────────────────────────────────────────────

function StepConfig({
  region, grade, vehicle, onBack,
}: {
  region: Region
  grade: Grade
  vehicle: Vehicle
  onBack: () => void
}) {
  const cfg = vehicle.configs[0]
  const availableSeats = vehicle.maxSeats - vehicle.occupiedSeats
  const maxBuy = Math.max(1, availableSeats)

  const [seatInput, setSeatInput] = useState<string>("1")

  const seatCount = Math.min(Math.max(1, parseInt(seatInput) || 1), maxBuy)
  const totalPrice = seatCount * cfg.pricePerSeat

  function handleSeatChange(val: string) {
    // Allow empty string while typing, or digits only
    if (val === "" || /^\d{1,2}$/.test(val)) setSeatInput(val)
  }

  function handleSeatBlur() {
    const n = Math.min(Math.max(1, parseInt(seatInput) || 1), maxBuy)
    setSeatInput(String(n))
  }

  return (
    <div>
      <button onClick={onBack} className="flex items-center gap-1.5 font-mono text-xs text-white/30 hover:text-white/70 transition-colors mb-6">
        <ArrowLeft size={12} /> 返回车型
      </button>

      {/* Title */}
      <div className="flex items-center gap-3 mb-1">
        <span className="text-2xl">{region.flag}</span>
        <p className="font-mono font-extrabold text-3xl leading-none" style={{ color: grade.color, textShadow: `0 0 18px ${grade.color}50` }}>
          {vehicle.modelName}
        </p>
        {vehicle.badge && (
          <span
            className="font-mono text-[10px] font-bold px-2 py-0.5 rounded"
            style={{ color: grade.color, background: `${grade.color}18`, border: `1px solid ${grade.color}40` }}
          >
            {vehicle.badge}
          </span>
        )}
      </div>
      <p className="font-mono text-[10px] tracking-widest text-white/30 mb-8">{vehicle.modelSub}</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: seat quantity input */}
        <div>
          <p className="font-mono text-xs text-white/40 tracking-widest mb-4 uppercase">购买 Seat 数量</p>

          {/* Seat availability visual */}
          <div
            className="rounded-xl px-5 py-4 mb-5 flex items-center justify-between"
            style={{
              background: "rgba(0,0,0,0.5)",
              border: `1px solid ${grade.color}20`,
              backdropFilter: "blur(12px)",
            }}
          >
            <div className="flex flex-col gap-1.5">
              <span className="font-mono text-xs text-white/40">当前车辆座位</span>
              <div className="flex items-center gap-[5px] mt-1">
                {Array.from({ length: vehicle.maxSeats }).map((_, i) => {
                  const isOccupied = i < vehicle.occupiedSeats
                  const isYours = !isOccupied && i < vehicle.occupiedSeats + seatCount
                  const dotColor = isYours ? grade.color : isOccupied ? "rgba(255,255,255,0.20)" : "rgba(255,255,255,0.08)"
                  return (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200"
                      style={{
                        background: isYours ? `${grade.color}22` : isOccupied ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.03)",
                        border: `1px solid ${dotColor}`,
                        boxShadow: isYours ? `0 0 10px ${grade.color}40` : "none",
                      }}
                      title={isOccupied ? "已有乘客" : isYours ? "你的座位" : "空位"}
                    >
                      <Users
                        size={13}
                        style={{ color: isYours ? grade.color : isOccupied ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.10)" }}
                      />
                    </div>
                  )
                })}
              </div>
            </div>
            <div className="text-right flex flex-col gap-0.5">
              <span className="font-mono text-[10px] text-white/25">可购</span>
              <span className="font-mono font-bold text-2xl" style={{ color: grade.color }}>{maxBuy}</span>
              <span className="font-mono text-[10px] text-white/25">Seat</span>
            </div>
          </div>

          {/* Input row */}
          <div
            className="rounded-xl px-5 py-4 flex items-center gap-5"
            style={{
              background: "rgba(0,0,0,0.5)",
              border: `1px solid ${grade.color}30`,
              backdropFilter: "blur(12px)",
            }}
          >
            <div className="flex flex-col gap-1 flex-1">
              <label className="font-mono text-[10px] text-white/35 tracking-wider">输入 Seat 数量（1 – {maxBuy}）</label>
              <input
                type="text"
                inputMode="numeric"
                value={seatInput}
                onChange={e => handleSeatChange(e.target.value)}
                onBlur={handleSeatBlur}
                className="w-full font-mono text-2xl font-bold bg-transparent outline-none caret-current"
                style={{ color: grade.color }}
                maxLength={1}
              />
            </div>
            {/* Stepper buttons */}
            <div className="flex flex-col gap-1.5">
              <button
                onClick={() => setSeatInput(String(Math.min(seatCount + 1, maxBuy)))}
                disabled={seatCount >= maxBuy}
                className="w-8 h-8 rounded-lg font-bold text-lg flex items-center justify-center transition-all duration-150 disabled:opacity-20"
                style={{
                  background: `${grade.color}18`,
                  border: `1px solid ${grade.color}35`,
                  color: grade.color,
                }}
              >
                +
              </button>
              <button
                onClick={() => setSeatInput(String(Math.max(seatCount - 1, 1)))}
                disabled={seatCount <= 1}
                className="w-8 h-8 rounded-lg font-bold text-lg flex items-center justify-center transition-all duration-150 disabled:opacity-20"
                style={{
                  background: `${grade.color}18`,
                  border: `1px solid ${grade.color}35`,
                  color: grade.color,
                }}
              >
                −
              </button>
            </div>
          </div>

          {/* Unit price hint */}
          <p className="font-mono text-[10px] text-white/25 mt-3 tracking-wider">
            单价 ¥{cfg.pricePerSeat} / Seat · 每车最多 {vehicle.maxSeats} Seat
          </p>
        </div>

        {/* Right: specs + CTA */}
        <div
          className="rounded-xl p-6 flex flex-col gap-5"
          style={{
            background: "rgba(0,0,0,0.65)",
            border: `1px solid ${grade.color}20`,
            backdropFilter: "blur(16px)",
          }}
        >
          <p className="font-mono text-xs text-white/40 tracking-widest uppercase">车辆配置详情</p>

          {/* Spec rows */}
          {[
            { label: "带宽", value: cfg.bandwidth },
            { label: "线路", value: cfg.route },
            { label: "流量", value: cfg.traffic },
            { label: "燃油型号", value: GRADES.find(g => g.id === grade.id)?.fuel ?? "" },
            { label: "目的地", value: `${region.flag} ${region.name}` },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-start justify-between gap-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", paddingBottom: "0.75rem" }}>
              <span className="font-mono text-xs text-white/30 shrink-0">{label}</span>
              <span className="font-mono text-xs text-white/75 text-right">{value}</span>
            </div>
          ))}

          {/* Price summary */}
          <div
            className="rounded-lg px-4 py-3 flex items-center justify-between"
            style={{ background: `${grade.color}0a`, border: `1px solid ${grade.color}25` }}
          >
            <div className="flex flex-col gap-0.5">
              <span className="font-mono text-xs text-white/40">本次上车费用</span>
              <span className="font-mono text-[10px] text-white/25">
                {seatCount} Seat × ¥{cfg.pricePerSeat}
              </span>
            </div>
            <span
              className="font-mono font-extrabold text-2xl"
              style={{ color: grade.color, textShadow: `0 0 14px ${grade.color}50` }}
            >
              ¥{totalPrice}
              <span className="text-sm font-normal text-white/30 ml-1">/ 月</span>
            </span>
          </div>

          {/* CTA */}
          <button
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm transition-all duration-200 hover:brightness-110 active:scale-[0.98]"
            style={{
              background: grade.color,
              color: "#000",
              boxShadow: `0 0 24px ${grade.color}50`,
            }}
          >
            立即上车 {seatCount > 1 ? `· ${seatCount} Seat` : ""} <ArrowRight size={15} />
          </button>

          <p className="font-mono text-[10px] text-white/20 text-center leading-relaxed">
            人满自动发车 · 支持月付 · 跳车不退款
          </p>
        </div>
      </div>
    </div>
  )
}

// ─── Main orchestrator ────────────────────────────────────────────────────────

export function VehicleSelector() {
  const [step, setStep] = useState(0)
  const [region, setRegion] = useState<Region | null>(null)
  const [grade, setGrade] = useState<Grade | null>(null)
  const [vehicle, setVehicle] = useState<Vehicle | null>(null)

  function selectRegion(r: Region) { setRegion(r); setStep(1) }
  function selectGrade(g: Grade) { setGrade(g); setStep(2) }
  function selectVehicle(v: Vehicle) { setVehicle(v); setStep(3) }

  function goBack() {
    if (step === 1) { setRegion(null); setStep(0) }
    if (step === 2) { setGrade(null); setStep(1) }
    if (step === 3) { setVehicle(null); setStep(2) }
  }

  return (
    <section className="px-6 pb-24 max-w-6xl mx-auto">
      <StepBar step={step} />

      {step === 0 && <StepRegion onSelect={selectRegion} />}
      {step === 1 && region && <StepGrade region={region} onSelect={selectGrade} onBack={goBack} />}
      {step === 2 && region && grade && <StepVehicle region={region} grade={grade} onSelect={selectVehicle} onBack={goBack} />}
      {step === 3 && region && grade && vehicle && <StepConfig region={region} grade={grade} vehicle={vehicle} onBack={goBack} />}

      {/* Back to homepage */}
      <div className="mt-14 flex justify-center">
        <Link href="/" className="font-mono text-xs text-white/25 hover:text-white/60 transition-colors tracking-widest">
          &larr; 返回首页
        </Link>
      </div>
    </section>
  )
}
