"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import { ArrowRight, Car, Fuel, Users } from "lucide-react"
import { SpeedBoard } from "@/components/speed-board"

const stats = [
  { icon: Car, label: "在线车型", value: "24", unit: "款" },
  { icon: Users, label: "当前乘客", value: "138", unit: "人" },
  { icon: Fuel, label: "已发车辆", value: "312", unit: "台" },
]

export function Hero() {
  const [videoActive, setVideoActive] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  function handleButtonEnter() {
    const v = videoRef.current
    if (v) {
      v.currentTime = 0
      v.play()
    }
    setVideoActive(true)
  }

  function handleButtonLeave() {
    setVideoActive(false)
  }

  return (
    <section className="relative min-h-screen flex flex-col justify-end overflow-hidden">
      {/* Layer 1: Pure black base */}
      <div className="absolute inset-0 bg-black" />

      {/* Layer 2a: Hero static image — fades out on hover */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/hero-bg.png')",
          opacity: videoActive ? 0 : 0.88,
          transition: "opacity 0.8s ease",
        }}
      />

      {/* Layer 2b: Hero video — fades in on hover, always starts from 0 */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        style={{
          opacity: videoActive ? 0.88 : 0,
          transition: "opacity 0.8s ease",
        }}
        src="/videos/drive.mp4"
        loop
        muted
        playsInline
        preload="auto"
      />

      {/* Layer 3: Gradient overlays for depth */}
      {/* Bottom fade — keeps content readable */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
      {/* Top fade for nav clarity */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/70 to-transparent" />

      {/* SpeedBoard HUD — top-right fixed overlay */}
      <div className="absolute top-20 right-6 z-20">
        <SpeedBoard />
      </div>

      {/* Neon scanline texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)",
          opacity: 0.4,
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pb-24 pt-32 w-full">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-12">
          {/* Left: headline + CTA */}
          <div className="flex flex-col gap-6 max-w-xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 self-start">
              <span
                className="w-2 h-2 rounded-full bg-[#ff2d78] inline-block"
                style={{ boxShadow: "0 0 8px rgba(255,45,120,0.9)" }}
              />
              <span className="font-mono text-xs tracking-[0.2em] text-white/50 uppercase">
                SYS.ONLINE // FLEET.ACTIVE
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-sans font-extrabold leading-none tracking-tight text-balance">
              <span className="block text-5xl md:text-7xl text-white">霓虹</span>
              <span
                className="block text-5xl md:text-7xl"
                style={{
                  color: "#ff2d78",
                  textShadow:
                    "0 0 20px rgba(255,45,120,0.7), 0 0 50px rgba(255,45,120,0.35)",
                }}
              >
                拼 车 局
              </span>
              <span className="block text-xl md:text-2xl text-white/60 font-normal tracking-widest mt-2 font-mono">
                DARKCRANE STORE
              </span>
            </h1>

            {/* Sub */}
            <p className="text-white/55 text-base md:text-lg leading-relaxed max-w-md">
              精品线路 VPS 拼车平台。选你的车型，加对应油号，人满即发——
              <span className="text-[#00e6ff]">赛博朋克风格，极速出发。</span>
            </p>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-4 mt-2">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-md font-semibold text-sm text-black bg-[#ff2d78] neon-glow-pink hover:bg-[#ff5090] transition-all duration-200"
                onMouseEnter={handleButtonEnter}
                onMouseLeave={handleButtonLeave}
              >
                快速上车
                <ArrowRight size={16} />
              </Link>
              <Link
                href="#fuel"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-md font-semibold text-sm text-[#00e6ff] glass-panel-cyan neon-glow-cyan hover:bg-[#00e6ff]/10 transition-all duration-200"
              >
                查看油号
              </Link>
            </div>
          </div>

          {/* Right: stats panel */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-4 lg:min-w-[220px]">
            {stats.map(({ icon: Icon, label, value, unit }) => (
              <div
                key={label}
                className="glass-panel rounded-xl px-5 py-4 flex items-center gap-4 flex-1 lg:flex-none"
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                  style={{
                    background: "rgba(255,45,120,0.12)",
                    border: "1px solid rgba(255,45,120,0.3)",
                  }}
                >
                  <Icon size={18} className="text-[#ff2d78]" />
                </div>
                <div>
                  <div className="flex items-baseline gap-1">
                    <span
                      className="font-mono font-bold text-2xl text-white"
                      style={{
                        textShadow: "0 0 10px rgba(0,230,255,0.5)",
                      }}
                    >
                      {value}
                    </span>
                    <span className="text-xs text-white/40 font-mono">{unit}</span>
                  </div>
                  <p className="text-xs text-white/45 mt-0.5">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom ticker */}
        <div
          className="mt-12 glass-panel rounded-lg px-5 py-3 flex items-center gap-3 overflow-hidden"
          style={{ borderColor: "rgba(0,230,255,0.18)" }}
        >
          <span
            className="text-[10px] font-mono tracking-widest shrink-0 px-2 py-0.5 rounded"
            style={{
              color: "#00e6ff",
              background: "rgba(0,230,255,0.1)",
              border: "1px solid rgba(0,230,255,0.3)",
            }}
          >
            LIVE
          </span>
          <p className="text-xs text-white/40 font-mono truncate">
            前方施工 // 新世界 // 霓虹大道 // 全时連線 // 92号油 ¥5/seat // C级车
            A6L 刚刚满员发车 // D级车 E300L 还剩 2 个座位 // 家宽专区 HK 已开放 //
          </p>
        </div>
      </div>
    </section>
  )
}
