import { notFound } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { ShopHero } from "@/components/shop-hero"
import { ConfigCheckout } from "@/components/vehicle-selector"
import { readGrade, readRegion, readVehicle } from "@/lib/catalog-service"

export const dynamic = "force-dynamic"

type VehiclePageProps = {
  params: Promise<{
    region: string
    grade: string
    vehicle: string
  }>
}

export async function generateMetadata({ params }: VehiclePageProps) {
  const { region: regionId, grade: gradeId, vehicle: vehicleSlug } = await params
  const [region, grade, vehicle] = await Promise.all([
    readRegion(regionId),
    readGrade(gradeId),
    readVehicle(regionId, gradeId, vehicleSlug),
  ])

  if (!region || !grade || !vehicle) return {}

  return {
    title: `车型选购 / ${region.name} / ${grade.nameZh} / ${vehicle.modelName} - DarkCrane Store`,
    description: `按 Seat 购买 ${vehicle.modelName}。`,
  }
}

export default async function VehiclePage({ params }: VehiclePageProps) {
  const { region: regionId, grade: gradeId, vehicle: vehicleSlug } = await params
  const [region, grade, vehicle] = await Promise.all([
    readRegion(regionId),
    readGrade(gradeId),
    readVehicle(regionId, gradeId, vehicleSlug),
  ])
  const config = vehicle?.configs[0]

  if (!region || !grade || !vehicle || !config) notFound()

  return (
    <main className="min-h-screen bg-black font-sans">
      <Navbar />
      <ShopHero />
      <ConfigCheckout
        region={region}
        grade={grade}
        vehicle={vehicle}
        config={config}
        backHref={`/shop/${region.id}/${grade.id}`}
        backLabel="返回车型"
        includeConfigBreadcrumb={false}
      />
    </main>
  )
}
