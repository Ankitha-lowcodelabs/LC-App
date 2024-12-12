"use client"

import { useState, useEffect, useCallback } from "react"
import { AppCard } from "@/components/app-card"
import { AppDetailsDialog } from "@/components/app-details-dialog"
import { AppData } from "@/types/app"
import Image from 'next/image'
import { supabase } from '@/lib/supabaseClient'

// Define a type for the form data structure
interface FormData {
  [key: string]: Record<string, unknown>; // Use 'unknown' instead of 'any' for better type safety
}

export default function UserPage() {
  const [apps, setApps] = useState<AppData[]>([])
  const [selectedApp, setSelectedApp] = useState<AppData | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [records, setRecords] = useState<{ [key: string]: Record<string, unknown>[] }>({}) // Store records by app code
  const [formData, setFormData] = useState<FormData>({}) // Store form data for the selected app

  useEffect(() => {
    const savedApps = localStorage.getItem("existingApps")
    if (savedApps) {
      setApps(JSON.parse(savedApps))
    }
  }, [])

  const fetchRecords = useCallback(async (appCode: string) => {
    const { data, error } = await supabase.from(`app_${appCode}`).select('*')
    if (error) {
      console.error('Error fetching records:', error)
    } else {
      setRecords((prev) => ({ ...prev, [appCode]: data })) // Store records by app code
      // Initialize form data for the selected app
      const initialFormData = data.reduce((acc, record) => {
        acc[record.id] = record; // Assuming each record has a unique id
        return acc;
      }, {});
      setFormData(initialFormData); // Set form data for the selected app
    }
  }, [])

  const handleAppClick = (app: AppData) => {
    setSelectedApp(app)
    fetchRecords(app.appCode)
    setIsDialogOpen(true)
  }

  const handleInputChange = (id: string, field: string, value: unknown) =>  {
    const updatedData = {
      ...formData,
      [id]: {
        ...formData[id],
        [field]: value,
      },
    };
    
    setFormData(updatedData);
    localStorage.setItem('formData', JSON.stringify(updatedData)); // Save to local storage
  };

  // Load data from local storage when the component mounts
  useEffect(() => {
    const savedData = localStorage.getItem('formData');
    if (savedData) {
      setFormData(JSON.parse(savedData)); // Load saved data
    }
  }, []);

  const handleSubmit = async () => {
    const appCode = selectedApp?.appCode;
    if (appCode) {
      for (const id in formData) {
        const record = formData[id];
        const { error } = await supabase
          .from(`app_${appCode}`)
          .update(record)
          .eq('id', id); // Update only the selected app's records
        if (error) {
          console.error('Error updating record:', error);
        }
      }
      fetchRecords(appCode); // Refresh records after update
      localStorage.setItem('formData', JSON.stringify(formData)); // Save updated form data to local storage
    }
  };

  useEffect(() => {
    if (selectedApp) {
      fetchRecords(selectedApp.appCode)
    }
  }, [selectedApp, fetchRecords])

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-8">Your Apps</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {apps.map((app) => (
          <div key={app.appCode} className="flex items-center">
            <AppCard
              app={app}
              onClick={() => handleAppClick(app)}
            />
            {app.logo && (
              <Image src={app.logo} alt={`${app.appName} logo`} className="ml-2 h-8 w-8" width={32} height={32} />
            )}
          </div>
        ))}
      </div>
      
      <AppDetailsDialog
        app={selectedApp}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        records={records[selectedApp?.appCode || '']?.map(record => ({
          id: record.id as number,
          name: (formData[record.id as string]?.name as string) || record.name, // Ensure name is a string
        })) || []} // Pass records for the selected app
      />
    </div>
  )
}

