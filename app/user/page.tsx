"use client"

import { useState, useEffect } from "react"
import { AppCard } from "@/components/app-card"
import { AppDetailsDialog } from "@/components/app-details-dialog"
import { AppData } from "@/types/app"

export default function UserPage() {
  const [apps, setApps] = useState<AppData[]>([])
  const [selectedApp, setSelectedApp] = useState<AppData | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    // Load apps from localStorage
    const savedApps = localStorage.getItem("existingApps")
    if (savedApps) {
      setApps(JSON.parse(savedApps))
    }
  }, [])

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-8">Your Apps</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {apps.map((app) => (
          <AppCard
            key={app.appCode}
            app={app}
            onClick={() => {
              setSelectedApp(app)
              setIsDialogOpen(true)
            }}
          />
        ))}
      </div>
      <AppDetailsDialog
        app={selectedApp}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </div>
  )
}

