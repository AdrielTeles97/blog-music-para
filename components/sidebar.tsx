"use client"

import Link from "next/link"
import { useState } from "react"
import { cn } from "@/lib/utils"
import {
  Home,
  Music,
  Mic2,
  ListMusic,
  Radio,
  Headphones,
  Heart,
  Download,
  History,
  Clock,
  Settings,
  HelpCircle,
} from "lucide-react"

const mainNavItems = [
  { icon: Home, label: "Início", href: "/" },
  { icon: Music, label: "Explorar", href: "/explorar" },
  { icon: Mic2, label: "Artistas", href: "/artistas" },
  { icon: ListMusic, label: "Playlists", href: "/playlists" },
  { icon: Radio, label: "Rádios", href: "/radios" },
]

const libraryItems = [
  { icon: Headphones, label: "Ouvindo Agora", href: "/ouvindo" },
  { icon: Heart, label: "Favoritos", href: "/favoritos" },
  { icon: Download, label: "Downloads", href: "/downloads" },
  { icon: History, label: "Histórico", href: "/historico" },
  { icon: Clock, label: "Recentes", href: "/recentes" },
]

const otherItems = [
  { icon: Settings, label: "Configurações", href: "/configuracoes" },
  { icon: HelpCircle, label: "Ajuda", href: "/ajuda" },
]

export function Sidebar() {
  const [activeItem, setActiveItem] = useState("/")

  return (
    <div className="hidden md:block w-64 border-r bg-background overflow-y-auto h-[calc(100vh-3.5rem)]">
      <div className="py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Navegação</h2>
          <div className="space-y-1">
            {mainNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
                  activeItem === item.href ? "bg-accent text-accent-foreground" : "transparent",
                )}
                onClick={() => setActiveItem(item.href)}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Sua Biblioteca</h2>
          <div className="space-y-1">
            {libraryItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
                  activeItem === item.href ? "bg-accent text-accent-foreground" : "transparent",
                )}
                onClick={() => setActiveItem(item.href)}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Outros</h2>
          <div className="space-y-1">
            {otherItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
                  activeItem === item.href ? "bg-accent text-accent-foreground" : "transparent",
                )}
                onClick={() => setActiveItem(item.href)}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
