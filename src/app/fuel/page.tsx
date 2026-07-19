import { Navbar } from "@/components/navbar"
import { FuelPage } from "@/components/fuel-page"

export const metadata = {
  title: "加油充值 — DarkCrane",
  description: "为你的车辆加油，购买流量包和余额充值",
}

export default function Fuel() {
  return (
    <main className="min-h-screen bg-black">
      <Navbar />
      <FuelPage />
    </main>
  )
}
