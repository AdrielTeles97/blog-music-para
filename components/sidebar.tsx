"use client"

import Link from "next/link"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { AdminNav } from "./admin-nav"
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
  HelpCircle,
  Upload,
} from "lucide-react"

const mainNavItems = [
  { icon: Home, label: "Início", href: "/" },
  { icon: Music, label: "Explorar", href: "/explorar" },
  { icon: Mic2, label: "Artistas", href: "/artistas" },
  { icon: ListMusic, label: "Playlists", href: "/playlists" },
  { icon: Radio, label: "Rádios", href: "/radios" },
  { icon: Upload, label: "Enviar Música", href: "/enviar" },
]

const libraryItems = [
  { icon: Headphones, label: "Ouvindo Agora", href: "/ouvindo" },
  { icon: Heart, label: "Favoritos", href: "/favoritos" },
  { icon: Download, label: "Downloads", href: "/downloads" },
  { icon: History, label: "Histórico", href: "/historico" },
  { icon: Clock, label: "Recentes", href: "/recentes" },
]

const otherItems = [
  { icon: HelpCircle, label: "Ajuda", href: "/ajuda" },
]

export function Sidebar() {
  const [activeItem, setActiveItem] = useState("/")

  return (
    <div className="hidden md:block w-64 border-r bg-background overflow-y-auto h-[calc(100vh-3.5rem)]">
      <div className="flex flex-col gap-2 p-4">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Menu</h3>
          <nav className="space-y-1">
            {mainNavItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                onClick={() => setActiveItem(item.href)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 text-sm hover:bg-accent rounded-md",
                  activeItem === item.href ? "bg-accent" : "transparent"
                )}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        <div className="py-2">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Biblioteca</h3>
          <nav className="space-y-1">
            {libraryItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                onClick={() => setActiveItem(item.href)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 text-sm hover:bg-accent rounded-md",
                  activeItem === item.href ? "bg-accent" : "transparent"
                )}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Componente AdminNav que só aparece para administradores */}
        <AdminNav />

        <div className="py-2">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Outros</h3>
          <nav className="space-y-1">
            {otherItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                onClick={() => setActiveItem(item.href)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 text-sm hover:bg-accent rounded-md",
                  activeItem === item.href ? "bg-accent" : "transparent"
                )}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  )
}
