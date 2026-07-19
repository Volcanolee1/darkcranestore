import { prisma } from "@/lib/prisma"
import {
  GRADES,
  REGIONS,
  VEHICLES,
  type Config,
  type Grade,
  type Region,
  type Vehicle,
  getConfig,
  getGrade,
  getRandomFastBoardingHref,
  getRegion,
  getVehicle,
  getVehicleHref,
  getVehicleSlug,
  getVehiclesByRegion,
  getVehiclesByRegionAndGrade,
} from "@/lib/shop-data"

type DbVehicle = {
  id: string
  regionId: string
  gradeId: string
  modelName: string
  modelSub: string
  badge: string | null
  occupiedSeats: number
  maxSeats: number
  configs: DbConfig[]
}

type DbConfig = {
  code: string
  label: string
  bandwidth: string
  route: string
  traffic: string
  seats: number
  pricePerSeat: number
  totalSeats: number
  note: string | null
}

export type CatalogSnapshot = {
  source: "database" | "static"
  regions: Region[]
  grades: Grade[]
  vehicles: Vehicle[]
}

function mapDbVehicle(vehicle: DbVehicle): Vehicle {
  return {
    id: vehicle.id,
    regionId: vehicle.regionId,
    gradeId: vehicle.gradeId,
    modelName: vehicle.modelName,
    modelSub: vehicle.modelSub,
    badge: vehicle.badge ?? undefined,
    occupiedSeats: vehicle.occupiedSeats,
    maxSeats: vehicle.maxSeats,
    configs: vehicle.configs.map(mapDbConfig),
  }
}

function mapDbConfig(config: DbConfig): Config {
  return {
    id: config.code,
    label: config.label,
    bandwidth: config.bandwidth,
    route: config.route,
    traffic: config.traffic,
    seats: config.seats,
    pricePerSeat: config.pricePerSeat,
    totalSeats: config.totalSeats,
    note: config.note ?? undefined,
  }
}

async function readVehiclesFromDatabase(where?: { regionId?: string; gradeId?: string }) {
  return prisma.vehicle.findMany({
    where: {
      ...where,
      isPublished: true,
    },
    include: {
      configs: {
        where: { isPublished: true },
        orderBy: { sortOrder: "asc" },
      },
    },
    orderBy: { sortOrder: "asc" },
  })
}

export async function readRegions() {
  try {
    const regions = await prisma.region.findMany({ orderBy: { sortOrder: "asc" } })

    return regions.length > 0 ? regions : REGIONS
  } catch {
    return REGIONS
  }
}

export async function readGrades() {
  try {
    const grades = await prisma.grade.findMany({ orderBy: { sortOrder: "asc" } })

    return grades.length > 0 ? grades : GRADES
  } catch {
    return GRADES
  }
}

export async function readRegion(regionId: string) {
  try {
    return await prisma.region.findUnique({ where: { id: regionId } }) ?? getRegion(regionId)
  } catch {
    return getRegion(regionId)
  }
}

export async function readGrade(gradeId: string) {
  try {
    return await prisma.grade.findUnique({ where: { id: gradeId } }) ?? getGrade(gradeId)
  } catch {
    return getGrade(gradeId)
  }
}

export async function readVehiclesByRegion(regionId: string) {
  try {
    const vehicles = await readVehiclesFromDatabase({ regionId })

    return vehicles.length > 0 ? vehicles.map(mapDbVehicle) : getVehiclesByRegion(regionId)
  } catch {
    return getVehiclesByRegion(regionId)
  }
}

export async function readVehiclesByRegionAndGrade(regionId: string, gradeId: string) {
  try {
    const vehicles = await readVehiclesFromDatabase({ regionId, gradeId })

    return vehicles.length > 0 ? vehicles.map(mapDbVehicle) : getVehiclesByRegionAndGrade(regionId, gradeId)
  } catch {
    return getVehiclesByRegionAndGrade(regionId, gradeId)
  }
}

export async function readVehicle(regionId: string, gradeId: string, vehicleSlug: string) {
  try {
    const vehicleId = vehicleSlug.includes("-") ? vehicleSlug : `${regionId}-${gradeId}-${vehicleSlug}`
    const vehicle = await prisma.vehicle.findFirst({
      where: {
        OR: [
          { id: vehicleSlug },
          { id: vehicleId },
        ],
        regionId,
        gradeId,
        isPublished: true,
      },
      include: {
        configs: {
          where: { isPublished: true },
          orderBy: { sortOrder: "asc" },
        },
      },
    })

    return vehicle ? mapDbVehicle(vehicle) : getVehicle(regionId, gradeId, vehicleSlug)
  } catch {
    return getVehicle(regionId, gradeId, vehicleSlug)
  }
}

export async function readConfig(vehicle: Vehicle, configId: string) {
  try {
    const config = await prisma.vehicleConfig.findUnique({
      where: {
        vehicleId_code: {
          vehicleId: vehicle.id,
          code: configId,
        },
      },
    })

    return config ? mapDbConfig(config) : getConfig(vehicle, configId)
  } catch {
    return getConfig(vehicle, configId)
  }
}

export async function readRandomFastBoardingHref() {
  try {
    const vehicles = (await readVehiclesFromDatabase()).map(mapDbVehicle)
    const fastBoardingVehicles = vehicles.filter((vehicle) => {
      const availableSeats = vehicle.maxSeats - vehicle.occupiedSeats

      return availableSeats >= 1 && availableSeats <= 2
    })
    const candidates = fastBoardingVehicles.length > 0
      ? fastBoardingVehicles
      : vehicles.filter((vehicle) => vehicle.occupiedSeats < vehicle.maxSeats)

    if (candidates.length === 0) return "/shop"

    const vehicle = candidates[Math.floor(Math.random() * candidates.length)]

    return getVehicleHref(vehicle)
  } catch {
    return getRandomFastBoardingHref()
  }
}

export async function readCatalogSnapshot(): Promise<CatalogSnapshot> {
  try {
    const [regions, grades, vehicles] = await Promise.all([
      prisma.region.findMany({ orderBy: { sortOrder: "asc" } }),
      prisma.grade.findMany({ orderBy: { sortOrder: "asc" } }),
      readVehiclesFromDatabase(),
    ])

    if (regions.length === 0 || grades.length === 0 || vehicles.length === 0) {
      return {
        source: "static",
        regions: REGIONS,
        grades: GRADES,
        vehicles: VEHICLES,
      }
    }

    return {
      source: "database",
      regions,
      grades,
      vehicles: vehicles.map(mapDbVehicle),
    }
  } catch {
    return {
      source: "static",
      regions: REGIONS,
      grades: GRADES,
      vehicles: VEHICLES,
    }
  }
}

export { getVehicleSlug }
