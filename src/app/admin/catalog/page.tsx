import { revalidatePath } from "next/cache"
import { Navbar } from "@/components/navbar"
import { readCatalogSnapshot } from "@/lib/catalog-service"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

function readText(formData: FormData, key: string) {
  const value = formData.get(key)

  return typeof value === "string" ? value.trim() : ""
}

function readPositiveInteger(formData: FormData, key: string) {
  const value = Number.parseInt(readText(formData, key), 10)

  return Number.isFinite(value) && value >= 0 ? value : 0
}

async function updateVehicleSeats(formData: FormData) {
  "use server"

  const vehicleId = readText(formData, "vehicleId")
  const occupiedSeats = readPositiveInteger(formData, "occupiedSeats")
  const maxSeats = Math.max(1, readPositiveInteger(formData, "maxSeats"))
  const badge = readText(formData, "badge")

  await prisma.vehicle.update({
    where: { id: vehicleId },
    data: {
      occupiedSeats: Math.min(occupiedSeats, maxSeats),
      maxSeats,
      badge: badge === "" ? null : badge,
    },
  })

  revalidateCatalog()
}

async function updateConfigPrice(formData: FormData) {
  "use server"

  const vehicleId = readText(formData, "vehicleId")
  const code = readText(formData, "code")
  const pricePerSeat = readPositiveInteger(formData, "pricePerSeat")

  await prisma.vehicleConfig.update({
    where: {
      vehicleId_code: {
        vehicleId,
        code,
      },
    },
    data: { pricePerSeat },
  })

  revalidateCatalog()
}

function revalidateCatalog() {
  revalidatePath("/admin/catalog")
  revalidatePath("/shop")
  revalidatePath("/shop/[region]", "page")
  revalidatePath("/shop/[region]/[grade]", "page")
  revalidatePath("/shop/[region]/[grade]/[vehicle]", "page")
}

export default async function AdminCatalogPage() {
  const snapshot = await readCatalogSnapshot()
  const regionMap = new Map(snapshot.regions.map((region) => [region.id, region]))
  const gradeMap = new Map(snapshot.grades.map((grade) => [grade.id, grade]))
  const databaseReady = snapshot.source === "database"

  return (
    <main className="min-h-screen bg-black font-sans text-white">
      <Navbar />

      <section className="mx-auto max-w-7xl px-6 pb-20 pt-28">
        <div className="mb-8 flex flex-col gap-3 border-b border-white/10 pb-6">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-white/35">
            ADMIN.CATALOG // VEHICLE.DATA
          </p>
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="font-sans text-3xl font-extrabold text-white">车型目录管理</h1>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/45">
                第一阶段后台，只管理车辆余座、座位上限、徽标和单 Seat 价格。后续可以继续扩展地区、车型、线路、上下架和排序。
              </p>
            </div>
            <span
              className="self-start rounded border px-3 py-1.5 font-mono text-xs md:self-auto"
              style={{
                color: databaseReady ? "#a3e635" : "#ffb800",
                borderColor: databaseReady ? "rgba(163,230,53,0.35)" : "rgba(255,184,0,0.35)",
                background: databaseReady ? "rgba(163,230,53,0.08)" : "rgba(255,184,0,0.08)",
              }}
            >
              {databaseReady ? "DATABASE CONNECTED" : "STATIC FALLBACK"}
            </span>
          </div>

          {!databaseReady && (
            <div className="rounded-lg border border-[#ffb800]/25 bg-[#ffb800]/8 px-4 py-3 text-sm leading-relaxed text-[#ffdf7a]">
              当前 PostgreSQL 还没有连接或尚未导入数据。启动 Docker 后运行 `npm run db:push` 和 `npm run db:seed`，这里会切换为数据库数据并开放保存。
            </div>
          )}
        </div>

        <div className="overflow-x-auto rounded-xl border border-white/10 bg-black/55">
          <table className="w-full min-w-[980px] border-collapse text-left">
            <thead className="border-b border-white/10 bg-white/[0.03]">
              <tr className="font-mono text-[11px] uppercase tracking-widest text-white/35">
                <th className="px-4 py-3">车辆</th>
                <th className="px-4 py-3">地区 / 级别</th>
                <th className="px-4 py-3">座位</th>
                <th className="px-4 py-3">徽标</th>
                <th className="px-4 py-3">配置价格</th>
              </tr>
            </thead>
            <tbody>
              {snapshot.vehicles.map((vehicle) => {
                const region = regionMap.get(vehicle.regionId)
                const grade = gradeMap.get(vehicle.gradeId)

                return (
                  <tr key={vehicle.id} className="border-b border-white/[0.06] align-top last:border-b-0">
                    <td className="px-4 py-5">
                      <p className="font-mono text-lg font-extrabold" style={{ color: grade?.color ?? "#ff2d78" }}>
                        {vehicle.modelName}
                      </p>
                      <p className="mt-1 font-mono text-[11px] text-white/35">{vehicle.modelSub}</p>
                      <p className="mt-2 font-mono text-[10px] text-white/20">{vehicle.id}</p>
                    </td>
                    <td className="px-4 py-5">
                      <p className="font-mono text-sm text-white/70">{region?.name ?? vehicle.regionId}</p>
                      <p className="mt-1 font-mono text-xs text-white/35">{grade?.nameZh ?? vehicle.gradeId}</p>
                    </td>
                    <td className="px-4 py-5">
                      <form action={updateVehicleSeats} className="flex flex-wrap items-end gap-2">
                        <input type="hidden" name="vehicleId" value={vehicle.id} />
                        <label className="flex flex-col gap-1 font-mono text-[10px] uppercase tracking-widest text-white/30">
                          已占
                          <input
                            name="occupiedSeats"
                            type="number"
                            min={0}
                            max={vehicle.maxSeats}
                            defaultValue={vehicle.occupiedSeats}
                            disabled={!databaseReady}
                            className="h-9 w-20 rounded border border-white/10 bg-black px-2 font-mono text-sm text-white outline-none disabled:opacity-45"
                          />
                        </label>
                        <label className="flex flex-col gap-1 font-mono text-[10px] uppercase tracking-widest text-white/30">
                          上限
                          <input
                            name="maxSeats"
                            type="number"
                            min={1}
                            defaultValue={vehicle.maxSeats}
                            disabled={!databaseReady}
                            className="h-9 w-20 rounded border border-white/10 bg-black px-2 font-mono text-sm text-white outline-none disabled:opacity-45"
                          />
                        </label>
                        <label className="flex flex-col gap-1 font-mono text-[10px] uppercase tracking-widest text-white/30">
                          徽标
                          <input
                            name="badge"
                            type="text"
                            defaultValue={vehicle.badge ?? ""}
                            disabled={!databaseReady}
                            className="h-9 w-24 rounded border border-white/10 bg-black px-2 font-mono text-sm text-white outline-none disabled:opacity-45"
                          />
                        </label>
                        <button
                          type="submit"
                          disabled={!databaseReady}
                          className="h-9 rounded bg-[#ff2d78] px-4 font-mono text-xs font-bold text-black disabled:cursor-not-allowed disabled:opacity-35"
                        >
                          保存
                        </button>
                      </form>
                    </td>
                    <td className="px-4 py-5">
                      <span className="rounded border border-white/10 px-2 py-1 font-mono text-xs text-white/55">
                        {vehicle.badge ?? "无"}
                      </span>
                    </td>
                    <td className="px-4 py-5">
                      <div className="flex flex-col gap-2">
                        {vehicle.configs.map((config) => (
                          <form key={config.id} action={updateConfigPrice} className="flex flex-wrap items-center gap-2">
                            <input type="hidden" name="vehicleId" value={vehicle.id} />
                            <input type="hidden" name="code" value={config.id} />
                            <span className="w-16 font-mono text-xs text-white/65">{config.label}</span>
                            <span className="w-36 truncate font-mono text-[11px] text-white/30">{config.bandwidth}</span>
                            <input
                              name="pricePerSeat"
                              type="number"
                              min={0}
                              defaultValue={config.pricePerSeat}
                              disabled={!databaseReady}
                              className="h-8 w-24 rounded border border-white/10 bg-black px-2 font-mono text-sm text-white outline-none disabled:opacity-45"
                            />
                            <span className="font-mono text-[11px] text-white/25">/ Seat</span>
                            <button
                              type="submit"
                              disabled={!databaseReady}
                              className="h-8 rounded border border-[#00e6ff]/35 px-3 font-mono text-[11px] font-bold text-[#00e6ff] disabled:cursor-not-allowed disabled:opacity-35"
                            >
                              改价
                            </button>
                          </form>
                        ))}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  )
}
