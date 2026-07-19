"use client"

import { useState, useEffect, useRef, createContext, useContext, useCallback } from "react"
import { createPortal } from "react-dom"
import { Eye, EyeOff, ArrowRight, Zap, X, Check, Mail, RefreshCw } from "lucide-react"
import Link from "next/link"

// ─── Context ──────────────────────────────────────────────────────────────────

interface RegisterModalContextValue {
  open: () => void
  close: () => void
}

const RegisterModalContext = createContext<RegisterModalContextValue | null>(null)

export function useRegisterModal() {
  const ctx = useContext(RegisterModalContext)
  if (!ctx) throw new Error("useRegisterModal must be used within RegisterModalProvider")
  return ctx
}

// ─── Types ────────────────────────────────────────────────────────────────────

type Step = "form" | "verify" | "done"
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
  code?: string
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

// ─── Sub-components ───────────────────────────────────────────────────────────

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: "8位以上", pass: password.length >= 8 },
    { label: "含数字", pass: /\d/.test(password) },
    { label: "含大写", pass: /[A-Z]/.test(password) },
    { label: "含符号", pass: /[^A-Za-z0-9]/.test(password) },
  ]
  const score = checks.filter(c => c.pass).length
  const colors = ["#ff4444", "#ff8c00", "#ffb800", "#00e6ff", "#00e6ff"]
  const labels = ["", "弱", "一般", "良好", "强"]
  const barColor = colors[score]
  if (!password) return null
  return (
    <div className="mt-2 flex flex-col gap-1.5">
      <div className="flex gap-1 items-center">
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
        <span className="font-mono text-[10px] ml-1 shrink-0" style={{ color: barColor }}>
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

// ─── Countdown hook ───────────────────────────────────────────────────────────

function useCountdown(initial = 60) {
  const [seconds, setSeconds] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const start = useCallback(() => {
    setSeconds(initial)
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setSeconds(s => {
        if (s <= 1) {
          clearInterval(timerRef.current!)
          return 0
        }
        return s - 1
      })
    }, 1000)
  }, [initial])

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current) }, [])

  return { seconds, start, active: seconds > 0 }
}

// ─── Modal inner ──────────────────────────────────────────────────────────────

function ModalInner({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<Step>("form")
  const [form, setForm] = useState<FormState>({ username: "", email: "", password: "", confirm: "" })
  const [errors, setErrors] = useState<FormErrors>({})
  const [show, setShow] = useState({ password: false, confirm: false })
  const [focused, setFocused] = useState<Field | null>(null)
  const [code, setCode] = useState("")
  const [codeFocused, setCodeFocused] = useState(false)
  const { seconds, start: startCountdown, active: countdownActive } = useCountdown(60)

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") onClose() }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onClose])

  // Lock body scroll
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => { document.body.style.overflow = prev }
  }, [])

  function handleChange(field: Field, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }))
  }

  function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate(form)
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    // Simulate sending code
    startCountdown()
    setStep("verify")
  }

  function handleSendCode() {
    if (countdownActive) return
    startCountdown()
  }

  function handleVerifySubmit(e: React.FormEvent) {
    e.preventDefault()
    if (code.trim().length < 4) {
      setErrors(prev => ({ ...prev, code: "请输入完整的验证码" }))
      return
    }
    // In production: validate against backend; here we accept any 4+ char code
    setStep("done")
  }

  const inputBase =
    "w-full bg-transparent font-mono text-sm text-white placeholder:text-white/20 outline-none py-3 px-4 rounded-xl transition-all duration-200"

  const inputStyle = (field: keyof FormErrors, isFocused: boolean) => ({
    background: "rgba(255,255,255,0.03)",
    border: `1px solid ${
      errors[field]
        ? "rgba(255,68,68,0.6)"
        : isFocused
        ? "rgba(255,45,120,0.55)"
        : "rgba(255,255,255,0.07)"
    }`,
    boxShadow: errors[field]
      ? "0 0 12px rgba(255,68,68,0.10)"
      : isFocused
      ? "0 0 18px rgba(255,45,120,0.10)"
      : "none",
    borderRadius: "0.75rem",
    transition: "border-color 0.2s, box-shadow 0.2s",
  })

  // ── Step: done ──
  if (step === "done") {
    return (
      <div className="flex flex-col items-center justify-center gap-6 py-8 text-center">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center"
          style={{
            background: "rgba(0,230,255,0.08)",
            border: "1px solid rgba(0,230,255,0.35)",
            boxShadow: "0 0 32px rgba(0,230,255,0.2)",
          }}
        >
          <Check size={28} className="text-[#00e6ff]" style={{ filter: "drop-shadow(0 0 6px rgba(0,230,255,0.9))" }} />
        </div>
        <div>
          <p className="font-mono font-bold text-xl text-white mb-1">注册成功</p>
          <p className="font-mono text-sm text-white/40">欢迎上车，{form.username}</p>
        </div>
        <Link
          href="/shop"
          onClick={onClose}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-mono font-semibold text-sm text-black bg-[#ff2d78] hover:bg-[#ff5090] transition-all duration-200"
          style={{ boxShadow: "0 0 20px rgba(255,45,120,0.45)" }}
        >
          前往选购车型 <ArrowRight size={14} />
        </Link>
        <button
          onClick={onClose}
          className="font-mono text-xs text-white/30 hover:text-white/60 transition-colors"
        >
          返回当前页面
        </button>
      </div>
    )
  }

  // ── Step: verify ──
  if (step === "verify") {
    return (
      <form onSubmit={handleVerifySubmit} noValidate className="flex flex-col gap-5">
        {/* Icon */}
        <div className="flex flex-col items-center gap-2 pb-2">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{
              background: "rgba(0,230,255,0.08)",
              border: "1px solid rgba(0,230,255,0.30)",
              boxShadow: "0 0 24px rgba(0,230,255,0.12)",
            }}
          >
            <Mail size={20} className="text-[#00e6ff]" style={{ filter: "drop-shadow(0 0 5px rgba(0,230,255,0.8))" }} />
          </div>
          <p className="font-mono text-sm text-white/70 text-center leading-relaxed">
            验证码已发送至<br />
            <span className="text-[#00e6ff]">{form.email}</span>
          </p>
          <p className="font-mono text-[11px] text-white/25">请检查收件箱（含垃圾邮件）</p>
        </div>

        {/* Code input */}
        <div className="flex flex-col gap-1.5">
          <label className="font-mono text-[11px] text-white/35 tracking-widest uppercase">邮箱验证码</label>
          <div className="flex gap-2">
            <div className="flex-1" style={inputStyle("code", codeFocused)}>
              <input
                type="text"
                className={inputBase}
                placeholder="输入 6 位验证码"
                value={code}
                onChange={e => {
                  setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                  if (errors.code) setErrors(prev => ({ ...prev, code: undefined }))
                }}
                onFocus={() => setCodeFocused(true)}
                onBlur={() => setCodeFocused(false)}
                maxLength={6}
                autoComplete="one-time-code"
                inputMode="numeric"
              />
            </div>
            <button
              type="button"
              onClick={handleSendCode}
              disabled={countdownActive}
              className="shrink-0 flex items-center gap-1.5 px-4 rounded-xl font-mono text-xs font-semibold transition-all duration-200 disabled:opacity-40"
              style={{
                background: countdownActive ? "rgba(0,230,255,0.05)" : "rgba(0,230,255,0.10)",
                border: "1px solid rgba(0,230,255,0.25)",
                color: "#00e6ff",
              }}
            >
              {countdownActive ? (
                <>{seconds}s</>
              ) : (
                <><RefreshCw size={11} /> 重新发送</>
              )}
            </button>
          </div>
          {errors.code && (
            <span className="font-mono text-[11px] text-[#ff4444]">{errors.code}</span>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="mt-1 w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-mono font-bold text-sm text-black bg-[#ff2d78] hover:bg-[#ff5090] active:scale-[0.98] transition-all duration-200"
          style={{ boxShadow: "0 0 24px rgba(255,45,120,0.40)" }}
        >
          确认验证 <ArrowRight size={15} />
        </button>

        <button
          type="button"
          onClick={() => setStep("form")}
          className="font-mono text-xs text-white/30 hover:text-white/60 transition-colors text-center"
        >
          ← 修改邮箱地址
        </button>
      </form>
    )
  }

  // ── Step: form ──
  return (
    <form onSubmit={handleFormSubmit} noValidate className="flex flex-col gap-4">
      {/* Username */}
      <div className="flex flex-col gap-1.5">
        <label className="font-mono text-[11px] text-white/35 tracking-widest uppercase">用户名</label>
        <div style={inputStyle("username", focused === "username")}>
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
        {errors.username && <span className="font-mono text-[11px] text-[#ff4444]">{errors.username}</span>}
      </div>

      {/* Email */}
      <div className="flex flex-col gap-1.5">
        <label className="font-mono text-[11px] text-white/35 tracking-widest uppercase">邮箱</label>
        <div style={inputStyle("email", focused === "email")}>
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
        {errors.email && <span className="font-mono text-[11px] text-[#ff4444]">{errors.email}</span>}
      </div>

      {/* Password */}
      <div className="flex flex-col gap-1.5">
        <label className="font-mono text-[11px] text-white/35 tracking-widest uppercase">密码</label>
        <div style={inputStyle("password", focused === "password")} className="relative">
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
        {errors.password && <span className="font-mono text-[11px] text-[#ff4444]">{errors.password}</span>}
      </div>

      {/* Confirm */}
      <div className="flex flex-col gap-1.5">
        <label className="font-mono text-[11px] text-white/35 tracking-widest uppercase">确认密码</label>
        <div style={inputStyle("confirm", focused === "confirm")} className="relative">
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
        {errors.confirm && <span className="font-mono text-[11px] text-[#ff4444]">{errors.confirm}</span>}
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="mt-2 w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-mono font-bold text-sm text-black bg-[#ff2d78] hover:bg-[#ff5090] active:scale-[0.98] transition-all duration-200"
        style={{ boxShadow: "0 0 24px rgba(255,45,120,0.40)" }}
      >
        发送验证码 <Mail size={15} />
      </button>

      <div className="flex items-center gap-3 mt-1">
        <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
        <span className="font-mono text-[10px] text-white/20 tracking-widest">已有账号</span>
        <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
      </div>

      <button
        type="button"
        onClick={onClose}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-mono text-sm text-white/50 hover:text-white transition-colors duration-200"
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        登录已有账号
      </button>
    </form>
  )
}

// ─── Modal shell ──────────────────────────────────────────────────────────────

function RegisterModal({ onClose }: { onClose: () => void }) {
  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="注册账号"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/75"
        style={{ backdropFilter: "blur(8px)" }}
        onClick={onClose}
      />

      {/* Card */}
      <div
        className="relative z-10 w-full max-w-md"
        style={{
          background: "rgba(6,6,14,0.88)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderTop: "1px solid rgba(255,45,120,0.40)",
          borderRadius: "1.25rem",
          backdropFilter: "blur(28px)",
          boxShadow:
            "0 0 0 1px rgba(0,0,0,0.4), 0 40px 80px rgba(0,0,0,0.7), 0 0 60px rgba(255,45,120,0.08)",
        }}
      >
        {/* Top glow line */}
        <div
          className="absolute left-1/2 -translate-x-1/2 -top-px w-36 h-px pointer-events-none"
          style={{ background: "linear-gradient(90deg, transparent, rgba(255,45,120,0.9), transparent)" }}
        />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg text-white/30 hover:text-white/70 transition-colors"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
          aria-label="关闭注册窗口"
        >
          <X size={14} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2.5 px-7 pt-7 pb-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{
              background: "rgba(255,45,120,0.10)",
              border: "1px solid rgba(255,45,120,0.30)",
              boxShadow: "0 0 16px rgba(255,45,120,0.12)",
            }}
          >
            <Zap size={14} className="text-[#ff2d78]" style={{ filter: "drop-shadow(0 0 5px rgba(255,45,120,0.8))" }} />
          </div>
          <div>
            <p className="font-mono font-bold text-sm tracking-widest uppercase text-white">
              Dark<span className="text-[#ff2d78]">Crane</span>
            </p>
            <p className="font-mono text-[10px] text-white/25 tracking-wider">创建账号 · 准备上车</p>
          </div>
        </div>

        {/* Form area */}
        <div className="px-7 py-6">
          <ModalInner onClose={onClose} />
        </div>

        {/* Footer */}
        <div
          className="px-7 py-3.5 rounded-b-[1.25rem]"
          style={{ borderTop: "1px solid rgba(255,255,255,0.05)", background: "rgba(0,0,0,0.30)" }}
        >
          <p className="font-mono text-[10px] text-white/18 text-center leading-relaxed">
            注册即代表你接受用户协议 · 人满自动发车 · 跳车不退款
          </p>
        </div>
      </div>
    </div>,
    document.body
  )
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function RegisterModalProvider({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(false)

  const open = useCallback(() => setVisible(true), [])
  const close = useCallback(() => setVisible(false), [])

  return (
    <RegisterModalContext.Provider value={{ open, close }}>
      {children}
      {visible && <RegisterModal onClose={close} />}
    </RegisterModalContext.Provider>
  )
}
