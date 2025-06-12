import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Play, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Music } from "@/lib/types"

interface MusicCardProps {
  music: Music
  index?: number
}

export function MusicCard({ music, index }: MusicCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <Link href={`/musica/${music.id}`} className="block">
        <div className="relative aspect-square">
          {index !== undefined && (
            <div className="absolute top-0 left-0 bg-background/80 backdrop-blur-sm text-lg font-bold w-8 h-8 flex items-center justify-center z-10">
              {index + 1}
            </div>
          )}
          <Image
            src={music.coverUrl || "/placeholder.svg"}
            alt={music.title}
            fill
            className="object-cover transition-transform hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
            <Button size="icon" variant="secondary" className="rounded-full h-12 w-12">
              <Play className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </Link>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <Link href={`/musica/${music.id}`} className="font-medium hover:underline line-clamp-1">
              {music.title}
            </Link>
            <Link href={`/artista/${music.artistId}`} className="text-sm text-muted-foreground hover:underline">
              {music.artist}
            </Link>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Download className="h-3 w-3 mr-1" />
            {music.downloads}
          </div>
        </div>
        <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
          <span>{music.genre}</span>
          <span>{music.postedAt}</span>
        </div>
      </CardContent>
    </Card>
  )
}
