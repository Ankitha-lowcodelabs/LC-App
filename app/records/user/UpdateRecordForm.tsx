import React, { useState, useEffect } from "react";
import { supabase } from "@/components/lib/supabaseClient";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@mui/material";
import UpdateRecordForm from "./UpdateRecordForm";

interface AppData {
  id: number;
  appCode: string;
  appName: string;
  appdescription: string;
}

interface RecordData {
  id: number;
  name: string;
  type: string;
  length: number;
  eid: string;
}

export default function UserPage() {
  const [apps, setApps] = useState<AppData[]>([]);
  const [records, setRecords] = useState<{ [key: string]: RecordData[] }>({});
  const [editingRecord, setEditingRecord] = useState<RecordData | null>(null);
  const [activeAppCode, setActiveAppCode] = useState<string>("");

  // Fetch all apps
  const fetchApps = async () => {
    const { data, error } = await supabase.from("apps").select("*");
    if (error) {
      console.error("Error fetching apps:", error);
    } else {
      setApps(data || []);
    }
  };

  // Fetch records for a specific app
  const fetchRecords = async (appCode: string) => {
    const { data, error } = await supabase.from(`app_${appCode}`).select("*");
    if (error) {
      console.error(`Error fetching records for app ${appCode}:`, error);
    } else {
      setRecords((prev) => ({ ...prev, [appCode]: data || [] }));
    }
  };

  // Fetch apps and their records
  useEffect(() => {
    fetchApps();
  }, []);

  useEffect(() => {
    apps.forEach((app) => fetchRecords(app.appCode));
  }, [apps]);

  // Handle record update
  const handleUpdate = () => {
    if (activeAppCode) fetchRecords(activeAppCode);
    setEditingRecord(null);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">App Records</h1>
      <div className="grid gap-6">
        {apps.map((app) => (
          <div key={app.id} className="border rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-2">{app.appName}</h2>
            <p className="text-gray-600 mb-4">{app.appdescription}</p>
            <div className="overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Length</TableHead>
                    <TableHead>EID</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {records[app.appCode]?.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>{record.id}</TableCell>
                      <TableCell>{record.name}</TableCell>
                      <TableCell>{record.type}</TableCell>
                      <TableCell>{record.length}</TableCell>
                      <TableCell>{record.eid}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => {
                            setEditingRecord(record);
                            setActiveAppCode(app.appCode);
                          }}
                        >
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        ))}
      </div>
      {editingRecord && activeAppCode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <h3 className="text-lg font-bold mb-4">Edit Record</h3>
            <UpdateRecordForm
              appCode={activeAppCode}
              record={editingRecord}
              onUpdate={handleUpdate}
            />
          </div>
        </div>
      )}
    </div>
  );
}
