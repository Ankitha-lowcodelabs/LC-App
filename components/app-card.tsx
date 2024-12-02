import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { AppData } from "../types/app"

interface AppCardProps {
  app: AppData
  onClick: () => void
}

export function AppCard({ app, onClick }: AppCardProps) {
  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-shadow"
      onClick={onClick}
    >
      <CardContent className="p-6 flex flex-col items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="text-center">
            <h3 className="font-semibold text-lg">{app.appName}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">{app.appdescription}</p>
          </div>
          <div className="w-16 h-16 relative">
            <Image
              src={"/placeholder.svg?height=64&width=64"}
              alt={app.appName}
              fill
              className="rounded-lg object-cover"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

