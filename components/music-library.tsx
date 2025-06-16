"use client";

import { useState, useEffect } from "react";
import { MusicCard } from "@/components/music-card";
import { Music } from "@/lib/types";
import { Loader2, Music2, ChevronLeft, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface MusicLibraryProps {
    title: string;
    itemsPerPage?: number;
    showAllLink?: string;
    variant?: "grid" | "table" | "list";
}

export function MusicLibrary({ title, itemsPerPage = 6, showAllLink, variant = "list" }: MusicLibraryProps) {
    const [music, setMusic] = useState<Music[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const fetchMusic = async () => {
            setLoading(true);
            try {
                const response = await fetch(`/api/music/recently-added?limit=50`); // Buscar mais músicas para paginação

                if (!response.ok) {
                    throw new Error("Falha ao carregar músicas");
                }

                const data = await response.json();
                setMusic(data);
                setTotalPages(Math.ceil(data.length / itemsPerPage));
            } catch (err: any) {
                console.error("Erro ao buscar músicas:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMusic();
    }, [itemsPerPage]);

    // Calcular músicas da página atual
    const getCurrentPageMusic = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return music.slice(startIndex, endIndex);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };
    if (loading) {
        return (
            <div className="space-y-4">
                <h2 className="text-2xl font-bold flex items-center">
                    <Music2 className="h-5 w-5 mr-2 text-primary" />
                    {title}
                </h2>
                <div className="space-y-4">
                    {[...Array(itemsPerPage)].map((_, i) => (
                        <Card key={i} className="p-4 animate-pulse">
                            <div className="flex items-center space-x-4">
                                <div className="w-16 h-16 bg-muted rounded-lg"></div>
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-muted rounded w-3/4"></div>
                                    <div className="h-3 bg-muted rounded w-1/2"></div>
                                </div>
                                <div className="h-4 bg-muted rounded w-20"></div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <Card className="p-6 text-center bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/20">
                <p className="text-red-600 dark:text-red-400">{error}</p>
                <button className="mt-2 text-sm text-primary hover:underline" onClick={() => window.location.reload()}>
                    Tentar novamente
                </button>
            </Card>
        );
    }    if (music.length === 0) {
        return (
            <Card className="p-6 text-center">
                <Music2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Nenhuma música encontrada</p>
            </Card>
        );
    }

    const currentPageMusic = getCurrentPageMusic();

    // Layout de lista vertical com paginação
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold flex items-center">
                    <Music2 className="h-5 w-5 mr-2 text-primary" />
                    {title}
                </h2>
                {showAllLink && (
                    <a href={showAllLink} className="text-primary hover:text-primary/80 text-sm font-medium">
                        Ver todas →
                    </a>
                )}
            </div>
            
            {/* Lista de músicas */}
            <div className="space-y-3">                {currentPageMusic.map((musicItem, index) => (
                    <Card key={musicItem.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 group border-l-4 border-l-transparent hover:border-l-primary">
                        <div className="p-4">
                            <div className="flex items-center space-x-4">
                                {/* Número */}
                                <div className="w-8 text-center font-bold text-primary">
                                    {(currentPage - 1) * itemsPerPage + index + 1}
                                </div>
                                
                                {/* Capa */}
                                <div className="w-16 h-16 flex-shrink-0 overflow-hidden rounded-lg bg-muted shadow-md group-hover:shadow-lg transition-shadow">
                                    <img
                                        src={musicItem.coverUrl || "/placeholder.svg"}
                                        alt={musicItem.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.src = "/placeholder.svg";
                                        }}
                                    />
                                </div>
                                
                                {/* Informações da música */}
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-lg line-clamp-1 group-hover:text-primary transition-colors">
                                        <a href={`/musica/${musicItem.id}`}>{musicItem.title}</a>
                                    </h3>
                                    <p className="text-muted-foreground line-clamp-1 font-medium">
                                        <a href={`/artista/${musicItem.artistId}`} className="hover:text-primary transition-colors">
                                            {musicItem.artist}
                                        </a>
                                    </p>
                                    {musicItem.album && (
                                        <p className="text-sm text-muted-foreground/80 line-clamp-1">
                                            📀 {musicItem.album}
                                        </p>
                                    )}
                                </div>
                                
                                {/* Gênero */}
                                <div className="hidden sm:block">
                                    <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                                        {musicItem.genre}
                                    </span>
                                </div>
                                
                                {/* Data */}
                                <div className="hidden md:block text-sm text-muted-foreground font-medium">
                                    {musicItem.releaseDate || musicItem.postedAt ? 
                                        new Date(musicItem.releaseDate || musicItem.postedAt!).toLocaleDateString('pt-BR') 
                                        : 'N/A'
                                    }
                                </div>
                                
                                {/* Downloads */}
                                <div className="text-sm text-muted-foreground flex items-center bg-muted/50 px-3 py-1 rounded-full">
                                    <span className="font-bold text-primary">{musicItem.downloads}</span>
                                    <span className="ml-1 hidden sm:inline">downloads</span>
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
            
            {/* Paginação */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-4">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>

                    <div className="flex items-center gap-1">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            const pageNum = currentPage <= 3 
                                ? i + 1 
                                : currentPage >= totalPages - 2
                                ? totalPages - 4 + i
                                : currentPage - 2 + i;

                            if (pageNum < 1 || pageNum > totalPages) return null;

                            return (                                <Button
                                    key={pageNum}
                                    variant={pageNum === currentPage ? "default" : "outline"}
                                    size="icon"
                                    onClick={() => handlePageChange(pageNum)}
                                    className={pageNum === currentPage ? "bg-primary" : "hover:bg-primary hover:text-primary-foreground"}
                                >
                                    {pageNum}
                                </Button>
                            );
                        })}
                    </div>

                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="hover:bg-primary hover:text-primary-foreground"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            )}
            
            {/* Info da paginação */}
            <div className="text-center text-sm text-muted-foreground bg-muted/30 px-4 py-2 rounded-full mt-4">
                Mostrando <span className="font-semibold text-primary">{(currentPage - 1) * itemsPerPage + 1}</span> - <span className="font-semibold text-primary">{Math.min(currentPage * itemsPerPage, music.length)}</span> de <span className="font-semibold text-primary">{music.length}</span> músicas
            </div>
        </div>
    );
}
