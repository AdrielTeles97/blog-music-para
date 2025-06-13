"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"

interface AdBanner {
  id: string
  imageUrl: string
  linkUrl: string
  altText: string
}

// Mock de banners para anúncios
const adBanners: AdBanner[] = [
  {
    id: "ad1",
    imageUrl: "/placeholder.svg?height=200&width=800",
    linkUrl: "https://example.com/promo1",
    altText: "Promoção de Equipamentos Musicais"
  },
  {
    id: "ad2",
    imageUrl: "/placeholder.svg?height=200&width=800",
    linkUrl: "https://example.com/promo2",
    altText: "Festival de Verão 2025"
  },
  {
    id: "ad3",
    imageUrl: "/placeholder.svg?height=200&width=800",
    linkUrl: "https://example.com/promo3",
    altText: "Nova plataforma de streaming musical"
  }
]

export function AdBanner() {
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0)
  
  // Alternar entre banners a cada 8 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBannerIndex(prev => (prev + 1) % adBanners.length)
    }, 8000)
    
    return () => clearInterval(interval)
  }, [])
  
  const currentBanner = adBanners[currentBannerIndex]
  
  return (
    <Card className="overflow-hidden shadow-md">
      <div className="relative">
        <Link href={currentBanner.linkUrl} target="_blank" rel="noopener noreferrer">
          <div className="relative h-[200px] w-full">
            <Image 
              src={currentBanner.imageUrl} 
              alt={currentBanner.altText} 
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white">
            <p className="font-bold">{currentBanner.altText}</p>
            <p className="text-sm opacity-80">Patrocinado</p>
          </div>
        </Link>
        
        {/* Indicadores de paginação do banner */}
        <div className="absolute bottom-3 right-3 flex gap-1">
          {adBanners.map((_, index) => (
            <button 
              key={index}
              className={`w-2 h-2 rounded-full ${index === currentBannerIndex ? 'bg-white' : 'bg-white/50'}`}
              onClick={() => setCurrentBannerIndex(index)}
            />
          ))}
        </div>
      </div>
    </Card>
  )
}
