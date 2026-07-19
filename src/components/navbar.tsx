"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, Zap } from "lucide-react"
import { useRegisterModal } from "@/components/register-modal"

const navLinks = [
  { label: "选购车型", href: "/shop" },
  { label: "加油充值", href: "/fuel" },
  { label: "家宽专区", href: "/residential" },
  { label: "关于我们", href: "/about" },
]

export function Navbar() {
  const [open, setOpen] = useState(false)
  const { open: openRegister } = useRegisterModal()

  function handleOpenRegister() {
    setOpen(false)
    openRegister()
  }

  return (
    <header className="glass-panel fixed left-0 right-0 top-0 z-50 border-b border-white/8">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="group flex items-center gap-2">
          <Zap
            size={20}
            className="text-[#ff2d78]"
            style={{ filter: "drop-shadow(0 0 6px rgba(255,45,120,0.8))" }}
          />
          <span className="font-mono text-base font-bold uppercase tracking-widest text-white">
            Dark<span className="text-neon-pink">Crane</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm tracking-wide text-white/60 transition-colors duration-200 hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/login"
            className="px-4 py-2 text-sm text-white/60 transition-colors hover:text-white"
          >
            登录
          </Link>
          <button
            type="button"
            onClick={handleOpenRegister}
            className="neon-glow-pink rounded-md bg-[#ff2d78] px-5 py-2 text-sm font-semibold text-black transition-all duration-200 hover:bg-[#ff5090]"
          >
            注册
          </button>
        </div>

        <button
          type="button"
          className="text-white/70 hover:text-white md:hidden"
          onClick={() => setOpen(!open)}
          aria-label={open ? "关闭菜单" : "打开菜单"}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="glass-panel flex flex-col gap-4 border-t border-white/8 px-6 py-4 md:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="py-1 text-sm text-white/70 transition-colors hover:text-white"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/quick-board"
            prefetch={false}
            className="neon-glow-pink rounded-md bg-[#ff2d78] px-5 py-2 text-center text-sm font-semibold text-black"
            onClick={() => setOpen(false)}
          >
            快速上车
          </Link>
          <button
            type="button"
            onClick={handleOpenRegister}
            className="neon-glow-pink w-full rounded-md bg-[#ff2d78] px-5 py-2 text-center text-sm font-semibold text-black"
          >
            注册
          </button>
        </div>
      )}
    </header>
  )
}
