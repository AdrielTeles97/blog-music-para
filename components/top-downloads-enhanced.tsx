"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { PlayCircle, Download, Headphones, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Music } from "@/lib/types"

export function TopDownloadsEnhanced() {
  const [topMusic, setTopMusic] = useState<Music[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
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
      <div className="flex items-center justify-center py-6">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        <span>Carregando...</span>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="text-center py-6 text-red-500">
        <p>Erro ao carregar músicas mais baixadas</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {topMusic.map((music, index) => (
        <div key={music.id} className="flex items-center gap-3 group">
          {/* Número de ranking */}
          <div 
            className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold
              ${index < 3 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
          >
            {index + 1}
          </div>
          
          {/* Capa */}
          <div className="flex-shrink-0 relative w-12 h-12">
            <Image 
              src={music.coverUrl}
              alt={music.title}
              fill
              className="object-cover rounded-md"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <PlayCircle className="h-6 w-6 text-white" />
            </div>
          </div>
          
          {/* Informações */}
          <div className="flex-grow min-w-0">
            <Link 
              href={`/musica/${music.id}`} 
              className="block font-medium text-sm hover:underline truncate"
            >
              {music.title}
            </Link>
            <Link 
              href={`/artista/${music.artistId}`} 
              className="block text-xs text-muted-foreground hover:underline truncate"
            >
              {music.artist}
            </Link>
          </div>
          
          {/* Contagem de downloads */}
          <div className="flex-shrink-0 flex flex-col items-end text-xs text-muted-foreground">
            <div className="flex items-center">
              <Download className="h-3 w-3 mr-1" />
              {music.downloads.toLocaleString()}
            </div>
          </div>
        </div>
      ))}
      
      <div className="pt-2">
        <Button variant="outline" size="sm" className="w-full">
          <Headphones className="h-4 w-4 mr-2" />
          Ver mais músicas
        </Button>
      </div>
    </div>
  )
}
