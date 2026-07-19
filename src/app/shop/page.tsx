import { Navbar } from "@/components/navbar"
import { RegionGrid } from "@/components/vehicle-selector"
import { ShopHero } from "@/components/shop-hero"
import { readRegions } from "@/lib/catalog-service"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "车型选购 - DarkCrane Store",
  description: "精品线路 VPS 拼车平台车型选购，极速上车，赛博朋克风格。",
}

export default async function ShopPage() {
  const regions = await readRegions()

  return (
    <main className="min-h-screen bg-black font-sans">
      <Navbar />
      <ShopHero />
      <RegionGrid regions={regions} />
    </main>
  )
}
