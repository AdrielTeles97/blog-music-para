"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from "lucide-react"
import { formatTime } from "@/lib/utils"

interface MusicPlayerProps {
  audioUrl: string
  title: string
  artist: string
}

export function MusicPlayer({ audioUrl, title, artist }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.8)
  const [isMuted, setIsMuted] = useState(false)

  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const setAudioData = () => {
      setDuration(audio.duration)
    }

    const setAudioTime = () => {
      setCurrentTime(audio.currentTime)
    }

    // Events
    audio.addEventListener("loadeddata", setAudioData)
    audio.addEventListener("timeupdate", setAudioTime)

    return () => {
      audio.removeEventListener("loadeddata", setAudioData)
      audio.removeEventListener("timeupdate", setAudioTime)
    }
  }, [audioRef])

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
    } else {
      audio.play()
    }

    setIsPlaying(!isPlaying)
  }

  const handleTimeChange = (value: number[]) => {
    const audio = audioRef.current
    if (!audio) return

    audio.currentTime = value[0]
    setCurrentTime(value[0])
  }

  const handleVolumeChange = (value: number[]) => {
    const audio = audioRef.current
    if (!audio) return

    const newVolume = value[0]
    setVolume(newVolume)
    audio.volume = newVolume

    if (newVolume === 0) {
      setIsMuted(true)
    } else {
      setIsMuted(false)
    }
  }

  const toggleMute = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isMuted) {
      audio.volume = volume
      setIsMuted(false)
    } else {
      audio.volume = 0
      setIsMuted(true)
    }
  }

  return (
    <div className="w-full">
      <audio ref={audioRef} src={audioUrl} preload="metadata" />

      <div className="flex flex-col space-y-2">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-medium">{title}</h3>
            <p className="text-sm text-muted-foreground">{artist}</p>
          </div>
          <div className="text-sm text-muted-foreground">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
        </div>

        <Slider
          value={[currentTime]}
          max={duration || 100}
          step={0.1}
          onValueChange={handleTimeChange}
          className="w-full"
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" disabled>
              <SkipBack className="h-4 w-4" />
            </Button>
            <Button onClick={togglePlay} variant="outline" size="icon" className="h-10 w-10">
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="icon" disabled>
              <SkipForward className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2 w-32">
            <Button variant="ghost" size="icon" onClick={toggleMute}>
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
            <Slider value={[isMuted ? 0 : volume]} max={1} step={0.01} onValueChange={handleVolumeChange} />
          </div>
        </div>
      </div>
    </div>
  )
}
