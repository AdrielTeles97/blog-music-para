"use client"
import Link from "next/link";
import { ModeToggle } from "@/components/mode-toggle";
import { UserNav } from "@/components/user-nav";
import { Input } from "@/components/ui/input";
import { Music2, Search, Upload, Menu } from "lucide-react";
import Image from "next/image";
import { Button } from "./ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const router = useRouter();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            router.push(`/buscar?q=${encodeURIComponent(searchTerm.trim())}`);
            setSearchTerm("");
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSearch(e);
        }
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center">
                {/* Logo */}
                <div className="mr-4 flex">
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="bg-primary rounded-full p-1 flex items-center justify-center">
                            <Image
                                src="/logo-black-white.png"
                                width={24}
                                height={24}
                                alt="Music Blog Logo"
                                className="rounded-full"
                            />
                        </div>
                        <span className="font-bold text-lg tracking-tight hidden sm:inline-block">PARÁMUSIC</span>
                    </Link>
                </div>

                {/* Nav items - Desktop */}
                <nav className="hidden md:flex items-center space-x-1 ml-6">
                    <Link href="/" className="px-3 py-2 text-sm font-medium rounded-full transition-colors hover:bg-accent">
                        Início
                    </Link>
                    <Link href="/artistas" className="px-3 py-2 text-sm font-medium rounded-full transition-colors hover:bg-accent">
                        Artistas
                    </Link>
                    <Link href="/playlists" className="px-3 py-2 text-sm font-medium rounded-full transition-colors hover:bg-accent">
                        Playlists
                    </Link>
                    <Link href="/sobre" className="px-3 py-2 text-sm font-medium rounded-full transition-colors hover:bg-accent">
                        Sobre
                    </Link>
                    <Link href="/ajuda" className="px-3 py-2 text-sm font-medium rounded-full transition-colors hover:bg-accent">
                        Ajuda
                    </Link>
                </nav>                {/* Search and Upload - Desktop */}
                <div className="flex-1 flex items-center justify-end gap-4 md:justify-between">
                    <form onSubmit={handleSearch} className="relative max-w-md hidden md:block mx-4 flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Buscar músicas, artistas ou álbuns..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyPress={handleKeyPress}
                            className="w-full pl-10 pr-4 h-10 rounded-full bg-muted/40 border-none focus-visible:ring-offset-0"
                        />
                    </form>
                    
                    <Link href="/enviar" className="hidden md:flex">
                        <Button variant="outline" className="h-10 px-4 rounded-full">
                            <Upload className="h-4 w-4 mr-2" />
                            Enviar Música
                        </Button>
                    </Link>
                </div>

                {/* Mobile menu button */}
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="md:hidden mr-2"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    <Menu className="h-5 w-5" />
                </Button>

                {/* User controls */}
                <div className="flex items-center gap-2">
                    <UserNav />
                    <ModeToggle />
                </div>
            </div>

            {/* Mobile menu dropdown */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t bg-background">
                    <nav className="flex flex-col p-4 space-y-2">
                        <Link href="/" className="px-3 py-2 text-sm font-medium hover:bg-accent rounded-md">
                            Início
                        </Link>
                        <Link href="/artistas" className="px-3 py-2 text-sm font-medium hover:bg-accent rounded-md">
                            Artistas
                        </Link>
                        <Link href="/playlists" className="px-3 py-2 text-sm font-medium hover:bg-accent rounded-md">
                            Playlists
                        </Link>
                        <Link href="/sobre" className="px-3 py-2 text-sm font-medium hover:bg-accent rounded-md">
                            Sobre
                        </Link>
                        <div className="pt-2 border-t">
                            <Link href="/enviar" className="flex items-center px-3 py-2 text-sm font-medium hover:bg-accent rounded-md">
                                <Upload className="h-4 w-4 mr-2" />
                                Enviar Música
                            </Link>
                        </div>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Buscar..."
                                className="w-full pl-10 pr-4"
                            />
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
}
