import { notFound } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { ShopHero } from "@/components/shop-hero"
import { GradeGrid } from "@/components/vehicle-selector"
import { readGrades, readRegion, readVehiclesByRegion } from "@/lib/catalog-service"

export const dynamic = "force-dynamic"

type RegionPageProps = {
  params: Promise<{
    region: string
  }>
}

export async function generateMetadata({ params }: RegionPageProps) {
  const { region: regionId } = await params
  const region = await readRegion(regionId)

  if (!region) return {}

  return {
    title: `车型选购 / ${region.name} - DarkCrane Store`,
    description: `选择 ${region.name} 线路的车辆级别。`,
  }
}

export default async function RegionPage({ params }: RegionPageProps) {
  const { region: regionId } = await params
  const [region, grades, vehicles] = await Promise.all([
    readRegion(regionId),
    readGrades(),
    readVehiclesByRegion(regionId),
  ])

  if (!region) notFound()

  const availableGradeIds = new Set(vehicles.map((vehicle) => vehicle.gradeId))
  const availableGrades = grades.filter((grade) => availableGradeIds.has(grade.id))

  return (
    <main className="min-h-screen bg-black font-sans">
      <Navbar />
      <ShopHero />
      <GradeGrid region={region} grades={grades} availableGrades={availableGrades} />
    </main>
  )
}
