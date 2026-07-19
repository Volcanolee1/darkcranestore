"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, ArrowRight, ChevronRight, Gauge, Users, Zap } from "lucide-react"
import { GRADES, REGIONS, type Config, type Grade, type Region, type Vehicle, getVehicleSlug } from "@/lib/shop-data"

const STEPS = ["目的地", "车辆级别", "选择车型", "车辆配置"]

type BreadcrumbItem = {
  label: string
  href?: string
}

export function ShopBreadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="车型选购路径" className="mb-6 flex flex-wrap items-center gap-2 font-mono text-xs text-white/35">
      {items.map((item, index) => {
        const isLast = index === items.length - 1

        return (
          <span key={`${item.label}-${index}`} className="flex items-center gap-2">
            {item.href && !isLast ? (
              <Link href={item.href} className="hover:text-white transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? "text-white/75" : undefined}>{item.label}</span>
            )}
            {!isLast && <ChevronRight size={12} className="text-white/15" />}
          </span>
        )
      })}
    </nav>
  )
}

export function StepBar({ step }: { step: number }) {
  return (
    <div className="mb-10 flex items-center gap-0 overflow-x-auto pb-2">
      {STEPS.map((label, i) => {
        const active = i === step
        const done = i < step
        const color = done || active ? "#ff2d78" : "rgba(255,255,255,0.15)"

        return (
          <div key={label} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className="flex h-7 w-7 items-center justify-center rounded-full font-mono text-xs font-bold transition-all duration-300"
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
                className="whitespace-nowrap font-mono text-[10px] tracking-wider"
                style={{ color: active ? "#ff2d78" : done ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.2)" }}
              >
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className="mx-2 mb-5 h-px w-16 shrink-0 transition-all duration-300"
                style={{ background: done ? "#ff2d78" : "rgba(255,255,255,0.08)" }}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

export function RegionGrid({ regions = REGIONS }: { regions?: Region[] }) {
  return (
    <ShopFrame
      step={0}
      breadcrumbItems={[{ label: "车型选购" }]}
      title="选择目的地"
      subtitle="SELECT DESTINATION"
    >
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {regions.map((region) => (
          <Link
            key={region.id}
            href={`/shop/${region.id}`}
            className="group relative flex flex-col items-center gap-3 rounded-xl p-6 text-left transition-all duration-200 hover:-translate-y-1"
            style={{
              background: "rgba(0,0,0,0.6)",
              border: `1px solid ${region.color}20`,
              backdropFilter: "blur(16px)",
            }}
          >
            <span className="font-mono text-2xl font-black tracking-widest" style={{ color: region.color }}>
              {region.flag}
            </span>
            <div className="text-center">
              <p className="font-sans text-lg font-bold leading-none text-white">{region.name}</p>
              <p className="mt-1 font-mono text-[10px] tracking-widest" style={{ color: region.color }}>
                {region.nameEn}
              </p>
            </div>
            <p className="text-center font-mono text-[10px] leading-relaxed text-white/30">{region.tagline}</p>
            <div className="mt-1 flex items-center gap-1 font-mono text-[10px] font-semibold" style={{ color: region.color }}>
              上车 <ChevronRight size={10} />
            </div>
          </Link>
        ))}
      </div>
    </ShopFrame>
  )
}

export function GradeGrid({
  region,
  grades = GRADES,
  availableGrades = GRADES.filter((grade) => grade.available),
}: {
  region: Region
  grades?: Grade[]
  availableGrades?: Grade[]
}) {
  const availableGradeIds = new Set(availableGrades.map((grade) => grade.id))

  return (
    <ShopFrame
      step={1}
      backHref="/shop"
      backLabel="返回目的地"
      breadcrumbItems={[
        { label: "车型选购", href: "/shop" },
        { label: region.name },
      ]}
      eyebrow={
        <span className="font-mono text-2xl font-black tracking-widest" style={{ color: region.color }}>
          {region.flag}
        </span>
      }
      title={`${region.name}路车辆级别`}
      subtitle="SELECT VEHICLE GRADE"
    >
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {grades.map((grade) => {
          const clickable = availableGradeIds.has(grade.id)

          if (!clickable) {
            return <GradeCard key={grade.id} grade={grade} disabled />
          }

          return (
            <GradeCard
              key={grade.id}
              grade={grade}
              href={`/shop/${region.id}/${grade.id}`}
            />
          )
        })}
      </div>
    </ShopFrame>
  )
}

export function VehicleGrid({ region, grade, vehicles }: { region: Region; grade: Grade; vehicles: Vehicle[] }) {
  return (
    <ShopFrame
      step={2}
      backHref={`/shop/${region.id}`}
      backLabel="返回车辆级别"
      breadcrumbItems={[
        { label: "车型选购", href: "/shop" },
        { label: region.name, href: `/shop/${region.id}` },
        { label: grade.nameZh },
      ]}
      eyebrow={
        <>
          <span className="font-mono text-2xl font-black tracking-widest" style={{ color: region.color }}>
            {region.flag}
          </span>
          <span
            className="font-mono text-3xl font-extrabold leading-none"
            style={{ color: grade.color, textShadow: `0 0 18px ${grade.color}50` }}
          >
            {grade.label}
          </span>
        </>
      }
      title={`${grade.nameZh} / 选择车型`}
      subtitle="SELECT MODEL"
    >
      {vehicles.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {vehicles.map((vehicle) => (
            <VehicleCard
              key={vehicle.id}
              grade={grade}
              vehicle={vehicle}
              href={`/shop/${region.id}/${grade.id}/${getVehicleSlug(vehicle)}`}
            />
          ))}
        </div>
      ) : (
        <EmptyState href={`/shop/${region.id}`} label="这一档暂时没有可上车车型" />
      )}
    </ShopFrame>
  )
}

export function VehicleDetail({ region, grade, vehicle }: { region: Region; grade: Grade; vehicle: Vehicle }) {
  const recommendedConfig = vehicle.configs[0]

  return (
    <ShopFrame
      step={3}
      backHref={`/shop/${region.id}/${grade.id}`}
      backLabel="返回车型"
      breadcrumbItems={[
        { label: "车型选购", href: "/shop" },
        { label: region.name, href: `/shop/${region.id}` },
        { label: grade.nameZh, href: `/shop/${region.id}/${grade.id}` },
        { label: vehicle.modelName },
      ]}
      eyebrow={
        <>
          <span className="font-mono text-2xl font-black tracking-widest" style={{ color: region.color }}>
            {region.flag}
          </span>
          <p className="font-mono text-3xl font-extrabold leading-none" style={{ color: grade.color, textShadow: `0 0 18px ${grade.color}50` }}>
            {vehicle.modelName}
          </p>
          {vehicle.badge && (
            <span
              className="rounded px-2 py-0.5 font-mono text-[10px] font-bold"
              style={{ color: grade.color, background: `${grade.color}18`, border: `1px solid ${grade.color}40` }}
            >
              {vehicle.badge}
            </span>
          )}
        </>
      }
      title="选择拼车配置"
      subtitle={vehicle.modelSub}
    >
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {vehicle.configs.map((config) => (
            <ConfigCard
              key={config.id}
              config={config}
              grade={grade}
              href={`/shop/${region.id}/${grade.id}/${getVehicleSlug(vehicle)}/${config.id}`}
            />
          ))}
        </div>

        <VehicleSummary region={region} grade={grade} vehicle={vehicle} config={recommendedConfig} />
      </div>
    </ShopFrame>
  )
}

export function ConfigCheckout({
  region,
  grade,
  vehicle,
  config,
  backHref,
  backLabel,
  includeConfigBreadcrumb = true,
}: {
  region: Region
  grade: Grade
  vehicle: Vehicle
  config: Config
  backHref?: string
  backLabel?: string
  includeConfigBreadcrumb?: boolean
}) {
  const availableSeats = Math.max(0, vehicle.maxSeats - vehicle.occupiedSeats)
  const maxBuy = Math.max(1, availableSeats)
  const [seatInput, setSeatInput] = useState("1")

  const seatCount = Math.min(Math.max(1, Number.parseInt(seatInput, 10) || 1), maxBuy)
  const totalPrice = seatCount * config.pricePerSeat

  function handleSeatChange(value: string) {
    if (value === "" || /^\d{1,2}$/.test(value)) setSeatInput(value)
  }

  function handleSeatBlur() {
    setSeatInput(String(seatCount))
  }

  return (
    <ShopFrame
      step={3}
      backHref={backHref ?? `/shop/${region.id}/${grade.id}/${getVehicleSlug(vehicle)}`}
      backLabel={backLabel ?? "返回配置"}
      breadcrumbItems={
        includeConfigBreadcrumb
          ? [
              { label: "车型选购", href: "/shop" },
              { label: region.name, href: `/shop/${region.id}` },
              { label: grade.nameZh, href: `/shop/${region.id}/${grade.id}` },
              { label: vehicle.modelName, href: `/shop/${region.id}/${grade.id}/${getVehicleSlug(vehicle)}` },
              { label: config.label },
            ]
          : [
              { label: "车型选购", href: "/shop" },
              { label: region.name, href: `/shop/${region.id}` },
              { label: grade.nameZh, href: `/shop/${region.id}/${grade.id}` },
              { label: vehicle.modelName },
            ]
      }
      eyebrow={
        <>
          <span className="font-mono text-2xl font-black tracking-widest" style={{ color: region.color }}>
            {region.flag}
          </span>
          <p className="font-mono text-3xl font-extrabold leading-none" style={{ color: grade.color, textShadow: `0 0 18px ${grade.color}50` }}>
            {vehicle.modelName}
          </p>
        </>
      }
      title={includeConfigBreadcrumb ? config.label : "按 Seat 购买"}
      subtitle={vehicle.modelSub}
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div>
          <p className="mb-4 font-mono text-xs uppercase tracking-widest text-white/40">购买 Seat 数量</p>

          <div
            className="mb-5 flex items-center justify-between rounded-xl px-5 py-4"
            style={{
              background: "rgba(0,0,0,0.5)",
              border: `1px solid ${grade.color}20`,
              backdropFilter: "blur(12px)",
            }}
          >
            <div className="flex flex-col gap-1.5">
              <span className="font-mono text-xs text-white/40">当前车辆座位</span>
              <SeatRow vehicle={vehicle} grade={grade} selectedSeats={seatCount} />
            </div>
            <div className="flex flex-col gap-0.5 text-right">
              <span className="font-mono text-[10px] text-white/25">可购</span>
              <span className="font-mono text-2xl font-bold" style={{ color: grade.color }}>{availableSeats}</span>
              <span className="font-mono text-[10px] text-white/25">Seat</span>
            </div>
          </div>

          <div
            className="flex items-center gap-5 rounded-xl px-5 py-4"
            style={{
              background: "rgba(0,0,0,0.5)",
              border: `1px solid ${grade.color}30`,
              backdropFilter: "blur(12px)",
            }}
          >
            <div className="flex flex-1 flex-col gap-1">
              <label className="font-mono text-[10px] tracking-wider text-white/35">输入 Seat 数量，1 - {maxBuy}</label>
              <input
                type="text"
                inputMode="numeric"
                value={seatInput}
                onBlur={handleSeatBlur}
                onChange={(event) => handleSeatChange(event.target.value)}
                className="w-full bg-transparent font-mono text-2xl font-bold caret-current outline-none"
                style={{ color: grade.color }}
                maxLength={2}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <button
                type="button"
                onClick={() => setSeatInput(String(Math.min(seatCount + 1, maxBuy)))}
                disabled={seatCount >= maxBuy}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-lg font-bold transition-all duration-150 disabled:opacity-20"
                style={{
                  background: `${grade.color}18`,
                  border: `1px solid ${grade.color}35`,
                  color: grade.color,
                }}
              >
                +
              </button>
              <button
                type="button"
                onClick={() => setSeatInput(String(Math.max(seatCount - 1, 1)))}
                disabled={seatCount <= 1}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-lg font-bold transition-all duration-150 disabled:opacity-20"
                style={{
                  background: `${grade.color}18`,
                  border: `1px solid ${grade.color}35`,
                  color: grade.color,
                }}
              >
                -
              </button>
            </div>
          </div>

          <p className="mt-3 font-mono text-[10px] tracking-wider text-white/25">
            单价 ¥{config.pricePerSeat} / Seat / 月 · 每车最大 {vehicle.maxSeats} Seat
          </p>
        </div>

        <VehicleSummary
          region={region}
          grade={grade}
          vehicle={vehicle}
          config={config}
          seatCount={seatCount}
          totalPrice={totalPrice}
        />
      </div>
    </ShopFrame>
  )
}

function ShopFrame({
  step,
  backHref,
  backLabel,
  breadcrumbItems,
  eyebrow,
  title,
  subtitle,
  children,
}: {
  step: number
  backHref?: string
  backLabel?: string
  breadcrumbItems: BreadcrumbItem[]
  eyebrow?: React.ReactNode
  title: string
  subtitle: string
  children: React.ReactNode
}) {
  return (
    <section id="vehicles" className="mx-auto max-w-6xl px-6 pb-24">
      <StepBar step={step} />
      <ShopBreadcrumb items={breadcrumbItems} />

      {backHref && backLabel && (
        <Link href={backHref} className="mb-6 flex items-center gap-1.5 font-mono text-xs text-white/30 transition-colors hover:text-white/70">
          <ArrowLeft size={12} /> {backLabel}
        </Link>
      )}

      <div className="mb-8">
        {eyebrow && <div className="mb-1 flex items-center gap-3">{eyebrow}</div>}
        <h2 className="font-sans text-2xl font-extrabold text-white">{title}</h2>
        <p className="mt-1 font-mono text-xs tracking-wider text-white/30">{subtitle}</p>
      </div>

      {children}

      <div className="mt-14 flex justify-center">
        <Link href="/" className="font-mono text-xs tracking-widest text-white/25 transition-colors hover:text-white/60">
          ← 返回首页
        </Link>
      </div>
    </section>
  )
}

function GradeCard({ grade, href, disabled = false }: { grade: Grade; href?: string; disabled?: boolean }) {
  const content = (
    <>
      {disabled && (
        <span className="absolute right-3 top-3 rounded border border-white/10 px-1.5 py-0.5 font-mono text-[9px] tracking-widest text-white/20">
          暂无车辆
        </span>
      )}
      <span
        className="mb-3 font-mono text-5xl font-extrabold leading-none"
        style={{ color: grade.color, textShadow: disabled ? "none" : `0 0 24px ${grade.color}50` }}
      >
        {grade.label}
      </span>
      <p className="font-sans text-base font-bold text-white">{grade.nameZh}</p>
      <p className="mb-3 font-mono text-[10px] tracking-widest" style={{ color: grade.color }}>{grade.subtitle}</p>
      <p className="mb-4 font-mono text-[10px] leading-relaxed text-white/35">{grade.desc}</p>
      <div
        className="inline-flex items-center gap-1 self-start rounded px-2.5 py-1 font-mono text-[10px] font-bold"
        style={{
          color: grade.fuelColor,
          background: `${grade.fuelColor}12`,
          border: `1px solid ${grade.fuelColor}30`,
        }}
      >
        <Zap size={9} /> {grade.fuel}
      </div>
    </>
  )

  const className = "relative flex flex-col rounded-xl p-5 text-left transition-all duration-200 hover:-translate-y-0.5"
  const style = {
    background: disabled ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.6)",
    border: `1px solid ${disabled ? "rgba(255,255,255,0.06)" : grade.color + "28"}`,
    backdropFilter: "blur(16px)",
    opacity: disabled ? 0.4 : 1,
  }

  if (!href || disabled) {
    return <div className={className} style={style}>{content}</div>
  }

  return <Link href={href} className={className} style={style}>{content}</Link>
}

function SeatBadge({ occupied, max, gradeColor }: { occupied: number; max: number; gradeColor: string }) {
  const isFull = occupied >= max
  const available = max - occupied
  const dotColor = isFull ? "#ff4444" : available === 1 ? "#ffb800" : gradeColor

  return (
    <div className="absolute right-5 top-5 flex flex-col items-end gap-1">
      <div className="flex items-center gap-[3px]">
        {Array.from({ length: max }).map((_, i) => (
          <div
            key={i}
            className="h-[7px] w-[7px] rounded-sm transition-all duration-300"
            style={{
              background: i < occupied ? dotColor : "rgba(255,255,255,0.10)",
              boxShadow: i < occupied ? `0 0 5px ${dotColor}90` : "none",
            }}
          />
        ))}
      </div>
      <span className="font-mono text-[9px] tracking-wider" style={{ color: isFull ? "#ff4444" : "rgba(255,255,255,0.35)" }}>
        {isFull ? "已满员" : `还差 ${available} 人发车`}
      </span>
    </div>
  )
}

function VehicleCard({ grade, vehicle, href }: { grade: Grade; vehicle: Vehicle; href: string }) {
  const minPrice = Math.min(...vehicle.configs.map((config) => config.pricePerSeat))

  return (
    <Link
      href={href}
      className="relative flex min-h-[280px] flex-col overflow-hidden rounded-xl text-left transition-all duration-200 hover:-translate-y-0.5"
      style={{
        background: "rgba(0,0,0,0.65)",
        border: `1px solid ${grade.color}20`,
        backdropFilter: "blur(16px)",
      }}
    >
      <SeatBadge occupied={vehicle.occupiedSeats} max={vehicle.maxSeats} gradeColor={grade.color} />

      {vehicle.badge && (
        <span
          className="absolute left-5 top-5 rounded px-2 py-0.5 font-mono text-[10px] font-bold tracking-widest"
          style={{
            color: grade.color,
            background: `${grade.color}18`,
            border: `1px solid ${grade.color}40`,
            boxShadow: `0 0 8px ${grade.color}30`,
          }}
        >
          {vehicle.badge}
        </span>
      )}

      <div className="min-h-[116px] px-5 pb-5 pt-14" style={{ borderBottom: `1px solid ${grade.color}12` }}>
        <p className="mb-1 font-mono text-3xl font-extrabold leading-none" style={{ color: grade.color, textShadow: `0 0 18px ${grade.color}50` }}>
          {vehicle.modelName}
        </p>
        <p className="font-mono text-[10px] tracking-widest text-white/30">{vehicle.modelSub}</p>
      </div>

      <div className="flex flex-1 flex-col gap-2 px-5 py-5">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-xs text-white/40">
          <Gauge size={11} />
          <span>{vehicle.configs[0]?.bandwidth}</span>
          <span className="mx-1 text-white/15">·</span>
          <span>{vehicle.configs[0]?.route}</span>
        </div>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-xs text-white/40">
          <Users size={11} />
          <span>{vehicle.configs.length} 种拼车方案</span>
          <span className="ml-auto font-bold" style={{ color: grade.color }}>
            ¥{minPrice} 起 / Seat
          </span>
        </div>
      </div>

      <div className="px-5 pb-5">
        <div
          className="flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold"
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
    </Link>
  )
}

function ConfigCard({ config, grade, href }: { config: Config; grade: Grade; href: string }) {
  return (
    <Link
      href={href}
      className="flex min-h-56 flex-col rounded-xl p-5 transition-all duration-200 hover:-translate-y-0.5"
      style={{
        background: "rgba(0,0,0,0.6)",
        border: `1px solid ${grade.color}24`,
        backdropFilter: "blur(16px)",
      }}
    >
      <p className="font-sans text-lg font-bold text-white">{config.label}</p>
      <p className="mt-1 font-mono text-[10px] tracking-widest text-white/30">
        {config.note ?? `${config.seats} Seat 方案`}
      </p>
      <div className="my-5 flex flex-col gap-2 font-mono text-xs text-white/45">
        <span>{config.bandwidth}</span>
        <span>{config.route}</span>
        <span>{config.traffic}</span>
      </div>
      <div className="mt-auto flex items-end justify-between gap-4">
        <span className="font-mono text-[10px] text-white/30">单 Seat / 月</span>
        <span className="font-mono text-2xl font-extrabold" style={{ color: grade.color }}>
          ¥{config.pricePerSeat}
        </span>
      </div>
    </Link>
  )
}

function SeatRow({ vehicle, grade, selectedSeats }: { vehicle: Vehicle; grade: Grade; selectedSeats: number }) {
  return (
    <div className="mt-1 flex items-center gap-[5px]">
      {Array.from({ length: vehicle.maxSeats }).map((_, i) => {
        const isOccupied = i < vehicle.occupiedSeats
        const isSelected = !isOccupied && i < vehicle.occupiedSeats + selectedSeats
        const dotColor = isSelected ? grade.color : isOccupied ? "rgba(255,255,255,0.20)" : "rgba(255,255,255,0.08)"

        return (
          <div
            key={i}
            className="flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-200"
            style={{
              background: isSelected ? `${grade.color}22` : isOccupied ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.03)",
              border: `1px solid ${dotColor}`,
              boxShadow: isSelected ? `0 0 10px ${grade.color}40` : "none",
            }}
            title={isOccupied ? "已有乘客" : isSelected ? "你的座位" : "空位"}
          >
            <Users
              size={13}
              style={{ color: isSelected ? grade.color : isOccupied ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.10)" }}
            />
          </div>
        )
      })}
    </div>
  )
}

function VehicleSummary({
  region,
  grade,
  vehicle,
  config,
  seatCount = 1,
  totalPrice,
}: {
  region: Region
  grade: Grade
  vehicle: Vehicle
  config: Config
  seatCount?: number
  totalPrice?: number
}) {
  const computedTotal = totalPrice ?? seatCount * config.pricePerSeat

  return (
    <div
      className="flex flex-col gap-5 rounded-xl p-6"
      style={{
        background: "rgba(0,0,0,0.65)",
        border: `1px solid ${grade.color}20`,
        backdropFilter: "blur(16px)",
      }}
    >
      <p className="font-mono text-xs uppercase tracking-widest text-white/40">车辆配置详情</p>

      {[
        { label: "车型", value: vehicle.modelName },
        { label: "带宽", value: config.bandwidth },
        { label: "线路", value: config.route },
        { label: "流量", value: config.traffic },
        { label: "燃油型号", value: grade.fuel },
        { label: "目的地", value: `${region.flag} ${region.name}` },
      ].map(({ label, value }) => (
        <div key={label} className="flex items-start justify-between gap-4 border-b border-white/[0.04] pb-3">
          <span className="shrink-0 font-mono text-xs text-white/30">{label}</span>
          <span className="text-right font-mono text-xs text-white/75">{value}</span>
        </div>
      ))}

      <div className="flex items-center justify-between rounded-lg px-4 py-3" style={{ background: `${grade.color}0a`, border: `1px solid ${grade.color}25` }}>
        <div className="flex flex-col gap-0.5">
          <span className="font-mono text-xs text-white/40">本次上车费用</span>
          <span className="font-mono text-[10px] text-white/25">{seatCount} Seat × ¥{config.pricePerSeat}</span>
        </div>
        <span className="font-mono text-2xl font-extrabold" style={{ color: grade.color, textShadow: `0 0 14px ${grade.color}50` }}>
          ¥{computedTotal}
          <span className="ml-1 text-sm font-normal text-white/30">/ 月</span>
        </span>
      </div>

      <button
        type="button"
        className="flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold transition-all duration-200 hover:brightness-110 active:scale-[0.98]"
        style={{
          background: grade.color,
          color: "#000",
          boxShadow: `0 0 24px ${grade.color}50`,
        }}
      >
        立刻上车 {seatCount > 1 ? `· ${seatCount} Seat` : ""} <ArrowRight size={15} />
      </button>

      <p className="text-center font-mono text-[10px] leading-relaxed text-white/20">
        人满自动发车 · 支持月付 · 跳车不退款
      </p>
    </div>
  )
}

function EmptyState({ href, label }: { href: string; label: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/50 p-8 text-center">
      <p className="font-mono text-sm text-white/45">{label}</p>
      <Link href={href} className="mt-4 inline-flex items-center gap-2 font-mono text-xs text-[#ff2d78]">
        返回上一层 <ArrowRight size={12} />
      </Link>
    </div>
  )
}
