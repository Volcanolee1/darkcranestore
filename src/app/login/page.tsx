import { LoginForm } from "@/components/login-form"
import { Navbar } from "@/components/navbar"

export const metadata = {
  title: "登录 — DarkCrane",
  description: "登录你的 DarkCrane 账户",
}

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-black">
      <Navbar />
      <LoginForm />
    </main>
  )
}
