import { Navbar } from "@/components/navbar"
import { AboutPage } from "@/components/about-page"

export const metadata = {
  title: "关于我们 — DarkCrane",
  description: "DarkCrane 品牌故事、服务理念与联系方式",
}

export default function About() {
  return (
    <main className="min-h-screen bg-black">
      <Navbar />
      <AboutPage />
    </main>
  )
}
