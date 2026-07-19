"use client"

import { useState } from "react"
import Link from "next/link"
import { Eye, EyeOff, ArrowRight, Check } from "lucide-react"

type Field = "username" | "email" | "password" | "confirm"

interface FormState {
  username: string
  email: string
  password: string
  confirm: string
}

interface FormErrors {
  username?: string
  email?: string
  password?: string
  confirm?: string
}

function validate(form: FormState): FormErrors {
  const errors: FormErrors = {}
  if (!form.username.trim()) errors.username = "请输入用户名"
  else if (form.username.length < 3) errors.username = "用户名至少 3 位"
  if (!form.email.trim()) errors.email = "请输入邮箱"
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = "邮箱格式不正确"
  if (!form.password) errors.password = "请输入密码"
  else if (form.password.length < 8) errors.password = "密码至少 8 位"
  if (!form.confirm) errors.confirm = "请再次输入密码"
  else if (form.confirm !== form.password) errors.confirm = "两次密码不一致"
  return errors
}

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: "8位以上", pass: password.length >= 8 },
    { label: "包含数字", pass: /\d/.test(password) },
    { label: "包含大写", pass: /[A-Z]/.test(password) },
    { label: "包含符号", pass: /[^A-Za-z0-9]/.test(password) },
  ]
  const score = checks.filter(c => c.pass).length
  const colors = ["#ff4444", "#ff8c00", "#ffb800", "#00e6ff", "#00e6ff"]
  const labels = ["", "弱", "一般", "良好", "强"]
  const barColor = colors[score]

  if (!password) return null

  return (
    <div className="mt-2 flex flex-col gap-1.5">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map(i => (
          <div
            key={i}
            className="h-0.5 flex-1 rounded-full transition-all duration-300"
            style={{
              background: i <= score ? barColor : "rgba(255,255,255,0.08)",
              boxShadow: i <= score ? `0 0 4px ${barColor}80` : "none",
            }}
          />
        ))}
        <span
          className="font-mono text-[10px] ml-1 shrink-0"
          style={{ color: barColor }}
        >
          {labels[score]}
        </span>
      </div>
      <div className="flex gap-3 flex-wrap">
        {checks.map(({ label, pass }) => (
          <span
            key={label}
            className="font-mono text-[10px] flex items-center gap-1 transition-colors duration-200"
            style={{ color: pass ? "#00e6ff" : "rgba(255,255,255,0.2)" }}
          >
            <Check size={9} style={{ opacity: pass ? 1 : 0.3 }} />
            {label}
          </span>
        ))}
      </div>
    </div>
  )
}

export function RegisterForm() {
  const [form, setForm] = useState<FormState>({ username: "", email: "", password: "", confirm: "" })
  const [errors, setErrors] = useState<FormErrors>({})
  const [show, setShow] = useState({ password: false, confirm: false })
  const [focused, setFocused] = useState<Field | null>(null)
  const [submitted, setSubmitted] = useState(false)

  function handleChange(field: Field, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate(form)
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 py-12 text-center">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center"
          style={{
            background: "rgba(0,230,255,0.08)",
            border: "1px solid rgba(0,230,255,0.35)",
            boxShadow: "0 0 32px rgba(0,230,255,0.2)",
          }}
        >
          <Check size={28} className="text-[#00e6ff]" />
        </div>
        <div>
          <p className="font-mono font-bold text-xl text-white mb-1">注册成功</p>
          <p className="font-mono text-sm text-white/40">欢迎上车，{form.username}</p>
        </div>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-mono font-semibold text-sm text-black bg-[#ff2d78] neon-glow-pink hover:bg-[#ff5090] transition-all duration-200"
        >
          前往选购车型 <ArrowRight size={14} />
        </Link>
      </div>
    )
  }

  const inputBase =
    "w-full bg-transparent font-mono text-sm text-white placeholder:text-white/20 outline-none py-3.5 px-4 rounded-xl transition-all duration-200"
  const inputWrapper = (field: Field) => ({
    background: "rgba(255,255,255,0.03)",
    border: `1px solid ${
      errors[field]
        ? "rgba(255,68,68,0.6)"
        : focused === field
        ? "rgba(255,45,120,0.55)"
        : "rgba(255,255,255,0.07)"
    }`,
    boxShadow:
      errors[field]
        ? "0 0 12px rgba(255,68,68,0.12)"
        : focused === field
        ? "0 0 18px rgba(255,45,120,0.12)"
        : "none",
    borderRadius: "0.75rem",
    backdropFilter: "blur(8px)",
    transition: "border-color 0.2s, box-shadow 0.2s",
  })

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      {/* Username */}
      <div className="flex flex-col gap-1.5">
        <label className="font-mono text-[11px] text-white/35 tracking-widest uppercase">用户名</label>
        <div style={inputWrapper("username")}>
          <input
            type="text"
            className={inputBase}
            placeholder="3–20 位，字母数字"
            value={form.username}
            onChange={e => handleChange("username", e.target.value)}
            onFocus={() => setFocused("username")}
            onBlur={() => setFocused(null)}
            autoComplete="username"
          />
        </div>
        {errors.username && (
          <span className="font-mono text-[11px] text-[#ff4444]">{errors.username}</span>
        )}
      </div>

      {/* Email */}
      <div className="flex flex-col gap-1.5">
        <label className="font-mono text-[11px] text-white/35 tracking-widest uppercase">邮箱</label>
        <div style={inputWrapper("email")}>
          <input
            type="email"
            className={inputBase}
            placeholder="your@email.com"
            value={form.email}
            onChange={e => handleChange("email", e.target.value)}
            onFocus={() => setFocused("email")}
            onBlur={() => setFocused(null)}
            autoComplete="email"
          />
        </div>
        {errors.email && (
          <span className="font-mono text-[11px] text-[#ff4444]">{errors.email}</span>
        )}
      </div>

      {/* Password */}
      <div className="flex flex-col gap-1.5">
        <label className="font-mono text-[11px] text-white/35 tracking-widest uppercase">密码</label>
        <div style={inputWrapper("password")} className="relative">
          <input
            type={show.password ? "text" : "password"}
            className={`${inputBase} pr-12`}
            placeholder="至少 8 位"
            value={form.password}
            onChange={e => handleChange("password", e.target.value)}
            onFocus={() => setFocused("password")}
            onBlur={() => setFocused(null)}
            autoComplete="new-password"
          />
          <button
            type="button"
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
            onClick={() => setShow(s => ({ ...s, password: !s.password }))}
            tabIndex={-1}
          >
            {show.password ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>
        <PasswordStrength password={form.password} />
        {errors.password && (
          <span className="font-mono text-[11px] text-[#ff4444]">{errors.password}</span>
        )}
      </div>

      {/* Confirm */}
      <div className="flex flex-col gap-1.5">
        <label className="font-mono text-[11px] text-white/35 tracking-widest uppercase">确认密码</label>
        <div style={inputWrapper("confirm")} className="relative">
          <input
            type={show.confirm ? "text" : "password"}
            className={`${inputBase} pr-12`}
            placeholder="再次输入密码"
            value={form.confirm}
            onChange={e => handleChange("confirm", e.target.value)}
            onFocus={() => setFocused("confirm")}
            onBlur={() => setFocused(null)}
            autoComplete="new-password"
          />
          <button
            type="button"
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
            onClick={() => setShow(s => ({ ...s, confirm: !s.confirm }))}
            tabIndex={-1}
          >
            {show.confirm ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>
        {errors.confirm && (
          <span className="font-mono text-[11px] text-[#ff4444]">{errors.confirm}</span>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="mt-2 w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-mono font-bold text-sm text-black bg-[#ff2d78] neon-glow-pink hover:bg-[#ff5090] active:scale-[0.98] transition-all duration-200"
      >
        立即注册上车 <ArrowRight size={15} />
      </button>

      {/* Divider */}
      <div className="flex items-center gap-3 my-1">
        <div className="flex-1 h-px bg-white/6" />
        <span className="font-mono text-[10px] text-white/20 tracking-widest">已有账号</span>
        <div className="flex-1 h-px bg-white/6" />
      </div>

      {/* Login link */}
      <Link
        href="#login"
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-mono text-sm text-white/50 hover:text-white transition-colors duration-200"
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        登录已有账号
      </Link>
    </form>
  )
}
