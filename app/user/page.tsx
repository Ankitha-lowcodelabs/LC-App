"use client"

import { useState, useEffect } from "react"
import { AppCard } from "@/components/app-card"
import { AppDetailsDialog } from "@/components/app-details-dialog"
import { AppData } from "@/types/app"
import { supabase } from "@/lib/supabaseClient" // Assuming you fetch records from Supabase

export default function UserPage() {
  const [apps, setApps] = useState<AppData[]>([])
  const [selectedApp, setSelectedApp] = useState<AppData | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [records, setRecords] = useState<{ [key: string]: any[] }>({}) // This stores records per app

  // Load apps and records on component mount
  useEffect(() => {
    // Load apps from localStorage
    const savedApps = localStorage.getItem("existingApps")
    if (savedApps) {
      setApps(JSON.parse(savedApps))
    }
  }, [])

  // Fetch records for a specific app when selected
  useEffect(() => {
    if (selectedApp) {
      const fetchRecords = async (appCode: string) => {
        const { data, error } = await supabase
          .from(`app_${appCode}`)
          .select("*")

        if (error) {
          console.error(`Error fetching records for app ${appCode}:`, error)
        } else if (data) {
          setRecords((prevRecords) => ({
            ...prevRecords,
            [appCode]: data, // Store records for the selected app
          }))
        }
      }

      fetchRecords(selectedApp.appCode)
    }
  }, [selectedApp])

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

      {selectedApp && (
        <AppDetailsDialog
          app={selectedApp}
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          records={records[selectedApp.appCode] || []} // Ensure records for selected app are passed
        />
      )}
    </div>
  )
}
