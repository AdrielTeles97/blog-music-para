"use client"

import { useState } from "react"
import { MusicCard } from "@/components/music-card"
import { Button } from "@/components/ui/button"
import { getAllMusic } from "@/lib/data"

export function MusicList() {
  const allMusic = getAllMusic()
  const [visibleCount, setVisibleCount] = useState(12)

  const showMore = () => {
    setVisibleCount((prev) => Math.min(prev + 12, allMusic.length))
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {allMusic.slice(0, visibleCount).map((music) => (
          <MusicCard key={music.id} music={music} />
        ))}
      </div>

      {visibleCount < allMusic.length && (
        <div className="flex justify-center mt-6">
          <Button onClick={showMore} variant="outline">
            Carregar mais
          </Button>
        </div>
      )}
    </div>
  )
}
