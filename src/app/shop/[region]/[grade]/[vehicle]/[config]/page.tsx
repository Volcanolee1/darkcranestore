import { redirect } from "next/navigation"
import { getVehicleSlug, readVehicle } from "@/lib/catalog-service"

export const dynamic = "force-dynamic"

type ConfigPageProps = {
  params: Promise<{
    region: string
    grade: string
    vehicle: string
  }>
}

export default async function ConfigPage({ params }: ConfigPageProps) {
  const { region: regionId, grade: gradeId, vehicle: vehicleSlug } = await params
  const vehicle = await readVehicle(regionId, gradeId, vehicleSlug)
  const normalizedVehicleSlug = vehicle ? getVehicleSlug(vehicle) : vehicleSlug

  redirect(`/shop/${regionId}/${gradeId}/${normalizedVehicleSlug}`)
}
