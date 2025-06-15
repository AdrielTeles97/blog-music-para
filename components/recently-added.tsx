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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="aspect-square bg-muted animate-pulse rounded-lg"></div>
            <div className="h-4 bg-muted animate-pulse rounded w-3/4"></div>
            <div className="h-3 bg-muted animate-pulse rounded w-1/2"></div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <Card className="p-6 text-center bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/20">
        <p className="text-red-600 dark:text-red-400">{error}</p>
        <button 
          className="mt-2 text-sm text-primary hover:underline"
          onClick={() => window.location.reload()}
        >
          Tentar novamente
        </button>
      </Card>
    )
  }

  if (recentMusic.length === 0) {
    return (
      <Card className="p-6 text-center">
        <p className="text-muted-foreground">Nenhuma música encontrada</p>
      </Card>
    )
  }  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 auto-rows-fr">
      {recentMusic.slice(0, 6).map((music, index) => (
        <div key={music.id} className="min-h-0">
          <MusicCard music={music} variant="compact-grid" />
        </div>
      ))}
    </div>
  )
}
