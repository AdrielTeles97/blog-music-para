"use client"

import { useState, useEffect } from "react"
import { MusicCard } from "@/components/music-card"
import { Music } from "@/lib/types"
import { Loader2 } from "lucide-react"
import { Card } from "@/components/ui/card"

export function RecentlyAdded() {
  const [recentMusic, setRecentMusic] = useState<Music[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRecentMusic = async () => {
      setLoading(true)
      try {
        const response = await fetch("/api/music/recently-added")
        
        if (!response.ok) {
          throw new Error("Falha ao carregar músicas recentes")
        }
        
        const data = await response.json()
        setRecentMusic(data)
      } catch (err: any) {
        console.error("Erro ao buscar músicas recentes:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    
    fetchRecentMusic()
  }, [])

  if (loading) {
    return (
      <Card className="p-6 text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto" />
        <p className="mt-2 text-muted-foreground">Carregando músicas...</p>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="p-6 text-center bg-red-50 dark:bg-red-950/20">
        <p className="text-red-600 dark:text-red-400">{error}</p>
      </Card>
    )
  }

  if (recentMusic.length === 0) {
    return (
      <Card className="p-6 text-center">
        <p className="text-muted-foreground">Nenhuma música encontrada.</p>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {recentMusic.map((music) => (
        <MusicCard key={music.id} music={music} />
      ))}
    </div>
  )
}
