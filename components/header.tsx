import Link from "next/link"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Music2, Search, User } from "lucide-react"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="flex items-center space-x-2">
            <Music2 className="h-6 w-6" />
            <span className="font-bold hidden sm:inline-block">MUSICBLOG</span>
          </Link>
        </div>

        <div className="flex flex-1 items-center gap-4 md:gap-8">
          <nav className="hidden md:flex items-center space-x-4">
            <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
              Início
            </Link>
            <Link href="/artistas" className="text-sm font-medium transition-colors hover:text-primary">
              Artistas
            </Link>
            <Link href="/playlists" className="text-sm font-medium transition-colors hover:text-primary">
              Playlists
            </Link>
            <Link href="/sobre" className="text-sm font-medium transition-colors hover:text-primary">
              Sobre
            </Link>
          </nav>

          <div className="flex-1 relative max-w-md">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Buscar músicas, artistas ou álbuns..." className="w-full pl-9" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/perfil">
              <User className="h-5 w-5" />
              <span className="sr-only">Perfil</span>
            </Link>
          </Button>
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}
