import { MusicCard } from "@/components/music-card"
import { getRelatedSongs } from "@/lib/data"

interface RelatedSongsProps {
  currentId: string
}

export function RelatedSongs({ currentId }: RelatedSongsProps) {
  const relatedSongs = getRelatedSongs(currentId)

  return (
    <div className="space-y-4">
      {relatedSongs.map((music) => (
        <MusicCard key={music.id} music={music} />
      ))}
    </div>
  )
}
