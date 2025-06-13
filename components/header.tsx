import Link from "next/link";
import { ModeToggle } from "@/components/mode-toggle";
import { UserNav } from "@/components/user-nav";
import { Input } from "@/components/ui/input";
import { Music2, Search, Upload } from "lucide-react";
import Image from "next/image";

export function Header() {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center">
                <div className="mr-4 flex">
                    <Link href="/" className="flex items-center space-x-2">
                        <Image
                            src="/logo-black-white.png"
                            width={20}
                            height={20}
                            alt="Music Blog Logo"
                            className="rounded-full"
                        ></Image>
                        <span className="font-bold hidden sm:inline-block">PARÁMUSIC</span>
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
                        <Input
                            type="search"
                            placeholder="Buscar músicas, artistas ou álbuns..."
                            className="w-full pl-9"
                        />
                    </div>
                    <Link
                        href="/enviar"
                        className="text-sm font-medium transition-colors hover:text-primary flex items-center"
                    >
                        <Upload className="h-4 w-4 mr-1" />
                        Enviar Música
                    </Link>
                </div>

                <div className="flex items-center gap-2">
                    <UserNav />
                    <ModeToggle />
                </div>
            </div>
        </header>
    );
}
