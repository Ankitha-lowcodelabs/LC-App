import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AppData } from "../types/app";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";

interface RecordData {
  id: number;
  name: string;
  [key: string]: string | number; // Allow dynamic fields
}

interface AppDetailsDialogProps<T extends RecordData> {
  app: AppData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  records: T[]; // Add the records prop here
}

export function AppDetailsDialog<T extends RecordData>({
  app,
  open,
  onOpenChange,
  records: initialRecords,
}: AppDetailsDialogProps<T>) {
  const [records, setRecords] = useState<T[]>(initialRecords || []);

  const handleInputChange = (index: number, key: string, value: string) => {
    setRecords((prev) => {
      const updatedRecords = [...prev];
      updatedRecords[index] = { ...updatedRecords[index], [key]: value } as T;
      return updatedRecords;
    });
  };

  const handleAddRow = () => {
    const newRow = { id: 0 } as T; // Initialize with basic fields
    setRecords((prev) => [...prev, newRow]);
  };

  const handleSubmit = async () => {
    if (!app) return; // Ensure app is defined

    const { error } = await supabase
      .from(`app_${app.appCode}`)
      .upsert(records); // Insert or update records

    if (error) {
      console.error('Error inserting/updating records:', error);
    } else {
      onOpenChange(false); // Close the dialog after submission
    }
  };

  useEffect(() => {
    if (open && app) {
      fetchRecords(app.appCode); // Fetch records for the selected app
    }
  }, [open, app]);

  const fetchRecords = async (appCode: string) => {
    const { data, error } = await supabase
      .from(`app_${appCode}`)
      .select('*');

    if (error) {
      console.error('Error fetching records:', error);
    } else if (data) {
      setRecords(data as T[]);
    }
  };

  if (!app) return null;

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
                    {records && records.length > 0 && Object.keys(records[0]).map((key) => (
                      <TableHead key={key}>{key}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {records && records.length > 0 && records.map((record, index) => (
                    <TableRow key={index}>
                      {Object.keys(record).map((key) => (
                        <TableCell key={key}>
                          <input
                            type="text"
                            value={record[key] || ''}
                            onChange={(e) => handleInputChange(index, key, e.target.value)}
                            className="border border-gray-300 p-1"
                            placeholder={`Enter ${key}`}
                          />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <Button className="w-full mt-2" onClick={handleAddRow}>Add Row</Button>
            <Button className="w-full mt-2" onClick={handleSubmit}>Save Changes</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}