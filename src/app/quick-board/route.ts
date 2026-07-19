import { redirect } from "next/navigation"
import { readRandomFastBoardingHref } from "@/lib/catalog-service"

export const dynamic = "force-dynamic"

export async function GET() {
  redirect(await readRandomFastBoardingHref())
}
