"use client";

import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Play, Download, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Music } from "@/lib/types"
import { AudioSource, playMusic } from "./music-player-footer"
import { useState } from "react"
import { identifyPlatform } from "@/lib/audio-url-processor"

interface MusicCardProps {
  music: Music
  index?: number
  variant?: "default" | "compact" | "featured" | "compact-grid"
}

export function MusicCard({ music, index, variant = "default" }: MusicCardProps) {
  const isCompact = variant === "compact";
  const isFeatured = variant === "featured";
  const isCompactGrid = variant === "compact-grid";
  const [isPlaying, setIsPlaying] = useState(false);
  const handlePlay = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
      // Determinar a plataforma com base na URL automaticamente
    const platform = identifyPlatform(music.audioUrl);

    // Criar objeto de fonte de áudio
    const audioSource: AudioSource = {
      id: music.id,
      platform,
      url: music.audioUrl,
      title: music.title,
      artist: music.artist,
      coverUrl: music.coverUrl,
    };

    // Reproduzir a música usando o player global
    playMusic(audioSource);
    setIsPlaying(true);
  };

  if (isCompact) {
    return (
      <div className="group flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
        {index !== undefined && (
          <div className="w-6 text-center font-semibold text-sm text-muted-foreground group-hover:text-primary">
            {index + 1}
          </div>
        )}        <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-md bg-muted">
          <Image
            src={music.coverUrl || "/placeholder.svg"}
            alt={music.title}
            fill
            className="object-cover"
            sizes="40px"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/placeholder.svg";
            }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <Link href={`/musica/${music.id}`} className="font-medium hover:text-primary line-clamp-1 transition-colors">
            {music.title}
          </Link>
          <Link href={`/artista/${music.artistId}`} className="text-xs text-muted-foreground hover:text-muted-foreground/80 block">
            {music.artist}
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-xs text-muted-foreground flex items-center">
            <Download className="h-3 w-3 mr-1" />
            {music.downloads}
          </div>
          <Button 
            size="icon" 
            variant="ghost" 
            className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handlePlay}
          >
            <Play className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  if (isFeatured) {
    return (      <Card className="overflow-hidden border-none bg-gradient-to-br from-primary/10 to-primary/5 shadow-lg">
        <div className="relative aspect-[16/9] bg-muted">
          <Image
            src={music.coverUrl || "/placeholder.svg"}
            alt={music.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/placeholder.svg";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-4 w-full">
            <Link href={`/musica/${music.id}`} className="text-xl font-bold text-white hover:underline line-clamp-1">
              {music.title}
            </Link>
            <Link href={`/artista/${music.artistId}`} className="text-sm text-white/80 hover:text-white transition-colors">
              {music.artist}
            </Link>
          </div>
          <Button 
            size="icon" 
            variant="secondary" 
            className="absolute right-4 bottom-4 rounded-full h-12 w-12 shadow-lg"
            onClick={handlePlay}
          >
            <Play className="h-6 w-6" />
          </Button>
        </div>
        <CardContent className="p-3 flex justify-between items-center">
          <div className="flex items-center text-sm">
            <Download className="h-4 w-4 mr-1 text-muted-foreground" />
            <span>{music.downloads} downloads</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="h-4 w-4 mr-1" />
            <span>{music.duration || "3:45"}</span>
          </div>
        </CardContent>
      </Card>
    );
  }
  if (isCompactGrid) {
    return (
      <Card className="overflow-hidden border-none shadow-sm group hover:shadow-md transition-all duration-300 bg-gradient-to-b from-muted/20 to-background h-full flex flex-col">
        <Link href={`/musica/${music.id}`} className="block flex-shrink-0">
          <div className="relative aspect-square bg-muted w-full">
            <Image
              src={music.coverUrl || "/placeholder.svg"}
              alt={music.title}
              fill
              className="object-cover transition-transform group-hover:scale-105 duration-500"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 16vw"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/placeholder.svg";
              }}
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
              <Button 
                size="icon" 
                variant="secondary" 
                className="rounded-full h-10 w-10 shadow-lg"
                onClick={handlePlay}
              >
                <Play className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </Link>
        <CardContent className="p-2 flex-1 flex flex-col justify-between min-h-0">
          <div className="space-y-1">
            <Link href={`/musica/${music.id}`} className="font-medium text-sm hover:text-primary line-clamp-2 transition-colors leading-tight">
              {music.title}
            </Link>
            <Link href={`/artista/${music.artistId}`} className="text-xs text-muted-foreground hover:text-primary/80 transition-colors line-clamp-1">
              {music.artist}
            </Link>
          </div>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center text-xs text-muted-foreground">
              <Download className="h-3 w-3 mr-1" />
              {music.downloads}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (    <Card className="overflow-hidden border-none shadow-md group hover:shadow-lg transition-all duration-300">
      <Link href={`/musica/${music.id}`} className="block">
        <div className="relative aspect-square bg-muted">
          {index !== undefined && (
            <div className="absolute top-2 left-2 bg-background/80 backdrop-blur-sm text-primary font-bold w-8 h-8 rounded-full flex items-center justify-center z-10">
              {index + 1}
            </div>
          )}
          <Image
            src={music.coverUrl || "/placeholder.svg"}
            alt={music.title}
            fill
            className="object-cover transition-transform group-hover:scale-105 duration-500"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/placeholder.svg";
            }}
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
            <Button 
              size="icon" 
              variant="secondary" 
              className="rounded-full h-12 w-12 shadow-lg"
              onClick={handlePlay}
            >
              <Play className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </Link>
      <CardContent className="p-3 bg-gradient-to-b from-muted/30 to-background">
        <div className="flex justify-between items-start">
          <div>
            <Link href={`/musica/${music.id}`} className="font-medium hover:text-primary line-clamp-1 transition-colors">
              {music.title}
            </Link>
            <Link href={`/artista/${music.artistId}`} className="text-sm text-muted-foreground hover:text-primary/80 transition-colors">
              {music.artist}
            </Link>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Download className="h-3 w-3 mr-1" />
            {music.downloads}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
