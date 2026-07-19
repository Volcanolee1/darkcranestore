import { notFound } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { ShopHero } from "@/components/shop-hero"
import { VehicleGrid } from "@/components/vehicle-selector"
import { readGrade, readRegion, readVehiclesByRegionAndGrade } from "@/lib/catalog-service"

export const dynamic = "force-dynamic"

type GradePageProps = {
  params: Promise<{
    region: string
    grade: string
  }>
}

export async function generateMetadata({ params }: GradePageProps) {
  const { region: regionId, grade: gradeId } = await params
  const [region, grade] = await Promise.all([
    readRegion(regionId),
    readGrade(gradeId),
  ])

  if (!region || !grade) return {}

  return {
    title: `车型选购 / ${region.name} / ${grade.nameZh} - DarkCrane Store`,
    description: `选择 ${region.name} ${grade.nameZh} 可上车车型。`,
  }
}

export default async function GradePage({ params }: GradePageProps) {
  const { region: regionId, grade: gradeId } = await params
  const [region, grade, vehicles] = await Promise.all([
    readRegion(regionId),
    readGrade(gradeId),
    readVehiclesByRegionAndGrade(regionId, gradeId),
  ])

  if (!region || !grade) notFound()

  return (
    <main className="min-h-screen bg-black font-sans">
      <Navbar />
      <ShopHero />
      <VehicleGrid region={region} grade={grade} vehicles={vehicles} />
    </main>
  )
}
