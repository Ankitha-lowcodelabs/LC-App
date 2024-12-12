import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AppData } from "../types/app"
import Image from "next/image"
import {supabase} from "@/lib/supabaseClient"

interface RecordData {
  // Define the properties of your record here
  // For example:
  id: number;
  name: string;
  // Add other fields as necessary
}

interface AppDetailsDialogProps<T extends RecordData> {
  app: AppData | null
  open: boolean
  onOpenChange: (open: boolean) => void
  records: T[]
}

export function AppDetailsDialog<T extends RecordData>({ app, open, onOpenChange, records }: AppDetailsDialogProps<T>) {
  const [formData, setFormData] = useState<{ [key: string]: string }>({});

  const handleInputChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (!app) return; // Ensure app is defined
    const { error } = await supabase
      .from(`app_${app.appCode}`)
      .insert([formData]); // Insert the new record

    if (error) {
      console.error('Error inserting record:', error);
    } else {
      onOpenChange(false); // Close the dialog after submission
      fetchRecords(app.appCode); // Refresh records after submission
    }
  };

  // Fetch records when the dialog opens
  React.useEffect(() => {
    if (open && app) {
      fetchRecords(app.appCode); // Fetch records for the selected app
    }
  }, [open, app]);

  const fetchRecords = async (appCode: string) => {
    // Implement the logic to fetch records from the database
    const { data, error } = await supabase
      .from(`app_${appCode}`)
      .select('*');

    if (error) {
      console.error('Error fetching records:', error);
    } else {
      // Handle the fetched data (e.g., update state)
      // setRecords(data); // Uncomment and implement state management if needed
    }
  };

  if (!app) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-4">
            <div className="w-12 h-12 relative">
              <Image
                src={app.logo || "/.svg?height=48&width=48"}
                alt={app.appName}
                fill
                className="rounded-lg object-cover"
              />
            </div>
            {app.appName}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-6">
          <div>
            <h4 className="font-semibold mb-2">Description</h4>
            <p className="text-muted-foreground">{app.appdescription}</p>
          </div>
          <hr className="border-t border-gray-400 my-4" />
          <div>
            <h4 className="font-semibold mb-4">Records</h4>
            <div className="overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {records.length > 0 && Object.keys(records[0]).map((key) => (
                      <TableHead key={key}>{key}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    {records.length > 0 && Object.keys(records[0]).map((key) => (
                      <TableCell key={key}>
                        <input
                          type="text"
                          value={formData[key] || ''}
                          onChange={(e) => handleInputChange(key, e.target.value)}
                          className="border border-gray-300 p-1"
                          placeholder={`Enter ${key}`}
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                </TableBody>
              </Table>
            </div>
            <Button className="w-full mt-2" onClick={handleSubmit}>Save Changes</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

