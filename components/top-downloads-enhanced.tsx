"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Play, Download, Headphones, Loader2, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Music } from "@/lib/types"
import { MusicCard } from "./music-card"

export function TopDownloadsEnhanced() {
  const [topMusic, setTopMusic] = useState<Music[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  
  useEffect(() => {
    const fetchTopDownloads = async () => {
      setLoading(true)
      try {
        const response = await fetch("/api/music/top-downloads")
        
        if (!response.ok) {
          throw new Error("Falha ao carregar músicas mais baixadas")
        }
        
        const data = await response.json()
        setTopMusic(data)
      } catch (err: any) {
        console.error("Erro ao buscar top downloads:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    
    fetchTopDownloads()
  }, [])
  
  if (loading) {
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-5 h-5 bg-muted rounded-full animate-pulse"></div>
            <div className="h-10 w-10 rounded bg-muted animate-pulse"></div>
            <div className="flex-1 space-y-2">
              <div className="h-3 bg-muted rounded w-3/4 animate-pulse"></div>
              <div className="h-2 bg-muted rounded w-1/2 animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="text-center py-4 text-red-500">
        <p>Erro ao carregar músicas mais baixadas</p>
        <button 
          onClick={() => window.location.reload()} 
          className="text-sm underline mt-2"
        >
          Tentar novamente
        </button>
      </div>
    )
  }
  
  if (topMusic.length === 0) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        <p>Nenhuma música encontrada</p>
      </div>
    )
  }
  
  return (
    <div className="space-y-1">
      {topMusic.map((music, index) => (
        <div 
          key={music.id}
          className="group flex items-center gap-3 p-2 hover:bg-muted/40 rounded-lg transition-colors"
          onMouseEnter={() => setActiveIndex(index)}
          onMouseLeave={() => setActiveIndex(null)}
        >
          <div className="w-6 h-6 flex-shrink-0 rounded-full bg-muted/50 flex items-center justify-center text-sm font-medium">
            {index + 1}
          </div>
          <div className="relative h-10 w-10 flex-shrink-0 rounded-md overflow-hidden">
            <Image
              src={music.coverUrl || "/placeholder.svg"}
              alt={music.title}
              fill
              className="object-cover"
            />
            {activeIndex === index && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[2px]">
                <Play className="h-4 w-4 text-white" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <Link href={`/musica/${music.id}`} className="block font-medium text-sm line-clamp-1 hover:text-primary transition-colors">
              {music.title}
            </Link>
            <Link href={`/artista/${music.artistId}`} className="block text-xs text-muted-foreground hover:text-primary/70 transition-colors">
              {music.artist}
            </Link>
          </div>
          <div className="flex items-center text-xs text-muted-foreground">
            <Download className="h-3 w-3 mr-1" />
            {music.downloads}
          </div>
        </div>
      ))}
      
      <div className="pt-3 mt-2 border-t border-border">
        <Link href="/top-downloads">
          <Button variant="ghost" size="sm" className="w-full text-xs rounded-full">
            <TrendingUp className="h-3 w-3 mr-1" /> Ver ranking completo
          </Button>
        </Link>
      </div>
    </div>
  )
}
