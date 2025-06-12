import { MusicCard } from "@/components/music-card"
import { getTopDownloads } from "@/lib/data"

export function TopDownloads() {
  const topMusic = getTopDownloads()

  return (
    <div className="space-y-4">
      {topMusic.map((music, index) => (
        <MusicCard key={music.id} music={music} index={index} />
      ))}
    </div>
  )
}
