"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, Zap } from "lucide-react"

const navLinks = [
  { label: "选购车型", href: "#vehicles" },
  { label: "加油充值", href: "#fuel" },
  { label: "家宽专区", href: "#residential" },
  { label: "关于我们", href: "#about" },
]

export function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-white/8">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <Zap
            size={20}
            className="text-[#ff2d78]"
            style={{ filter: "drop-shadow(0 0 6px rgba(255,45,120,0.8))" }}
          />
          <span className="font-mono text-base font-bold tracking-widest uppercase text-white">
            Dark<span className="text-neon-pink">Crane</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-white/60 hover:text-white transition-colors duration-200 tracking-wide"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="#login"
            className="text-sm text-white/60 hover:text-white transition-colors px-4 py-2"
          >
            登录
          </Link>
          <Link
            href="#register"
            className="text-sm font-semibold px-5 py-2 rounded-md bg-[#ff2d78] text-black neon-glow-pink hover:bg-[#ff5090] transition-all duration-200"
          >
            注册
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-white/70 hover:text-white"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden glass-panel border-t border-white/8 px-6 py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-white/70 hover:text-white transition-colors py-1"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="#vehicles"
            className="text-sm font-semibold px-5 py-2 rounded-md bg-[#ff2d78] text-black text-center neon-glow-pink"
            onClick={() => setOpen(false)}
          >
            快速上车
          </Link>
        </div>
      )}
    </header>
  )
}
