import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { GRADES, REGIONS, VEHICLES } from "../src/lib/shop-data"

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error("DATABASE_URL is required to seed catalog data.")
}

const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

async function main() {
  for (const [index, region] of REGIONS.entries()) {
    await prisma.region.upsert({
      where: { id: region.id },
      create: {
        ...region,
        sortOrder: index,
      },
      update: {
        ...region,
        sortOrder: index,
      },
    })
  }

  for (const [index, grade] of GRADES.entries()) {
    await prisma.grade.upsert({
      where: { id: grade.id },
      create: {
        ...grade,
        sortOrder: index,
      },
      update: {
        ...grade,
        sortOrder: index,
      },
    })
  }

  for (const [vehicleIndex, vehicle] of VEHICLES.entries()) {
    await prisma.vehicle.upsert({
      where: { id: vehicle.id },
      create: {
        id: vehicle.id,
        regionId: vehicle.regionId,
        gradeId: vehicle.gradeId,
        modelName: vehicle.modelName,
        modelSub: vehicle.modelSub,
        badge: vehicle.badge,
        occupiedSeats: vehicle.occupiedSeats,
        maxSeats: vehicle.maxSeats,
        sortOrder: vehicleIndex,
      },
      update: {
        regionId: vehicle.regionId,
        gradeId: vehicle.gradeId,
        modelName: vehicle.modelName,
        modelSub: vehicle.modelSub,
        badge: vehicle.badge,
        occupiedSeats: vehicle.occupiedSeats,
        maxSeats: vehicle.maxSeats,
        sortOrder: vehicleIndex,
      },
    })

    for (const [configIndex, config] of vehicle.configs.entries()) {
      await prisma.vehicleConfig.upsert({
        where: {
          vehicleId_code: {
            vehicleId: vehicle.id,
            code: config.id,
          },
        },
        create: {
          vehicleId: vehicle.id,
          code: config.id,
          label: config.label,
          bandwidth: config.bandwidth,
          route: config.route,
          traffic: config.traffic,
          seats: config.seats,
          pricePerSeat: config.pricePerSeat,
          totalSeats: config.totalSeats,
          note: config.note,
          sortOrder: configIndex,
        },
        update: {
          label: config.label,
          bandwidth: config.bandwidth,
          route: config.route,
          traffic: config.traffic,
          seats: config.seats,
          pricePerSeat: config.pricePerSeat,
          totalSeats: config.totalSeats,
          note: config.note,
          sortOrder: configIndex,
        },
      })
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (error: unknown) => {
    console.error(error)
    await prisma.$disconnect()
    process.exit(1)
  })
