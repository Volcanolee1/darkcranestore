import { Navbar } from "@/components/navbar"
import { Dashboard } from "@/components/dashboard"

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-black">
      <Navbar />
      <Dashboard />
    </main>
  )
}
