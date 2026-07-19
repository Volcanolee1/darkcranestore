import { Navbar } from "@/components/navbar"
import { ShopHero } from "@/components/shop-hero"
import { VehicleSelector } from "@/components/vehicle-selector"

export const metadata = {
  title: "车型选购 — DarkCrane Store",
  description: "精品线路 VPS 拼车平台车型选购，极速上车，赛博朋克风格。",
}

export default function ShopPage() {
  return (
    <main className="min-h-screen bg-black font-sans">
      <Navbar />
      <ShopHero />
      <VehicleSelector />
    </main>
  )
}
