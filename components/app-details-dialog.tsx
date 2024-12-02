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

interface AppDetailsDialogProps {
  app: AppData | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AppDetailsDialog({ app, open, onOpenChange }: AppDetailsDialogProps) {
  if (!app) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-4">
            <div className="w-12 h-12 relative">
              <Image
                src={app.logo || "/placeholder.svg?height=48&width=48"}
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
          <div>
            <h4 className="font-semibold mb-4">Records</h4>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>EID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Record Type</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {app.records.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{record.id}</TableCell>
                    <TableCell>{record.name}</TableCell>
                    <TableCell>{record.type}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <Button className="w-full">Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

