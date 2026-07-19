import { Navbar } from "@/components/navbar"
import { ResidentialPage } from "@/components/residential-page"

export const metadata = {
  title: "家宽专区 — DarkCrane",
  description: "原生住宅 IP，畅享家庭宽带线路，解锁流媒体限制",
}

export default function Residential() {
  return (
    <main className="min-h-screen bg-black">
      <Navbar />
      <ResidentialPage />
    </main>
  )
}
