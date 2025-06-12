import { MusicCard } from "@/components/music-card"
import { getRecentlyAdded } from "@/lib/data"

export function RecentlyAdded() {
  const recentMusic = getRecentlyAdded()

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {recentMusic.map((music) => (
        <MusicCard key={music.id} music={music} />
      ))}
    </div>
  )
}
