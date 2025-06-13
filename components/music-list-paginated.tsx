"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, PlayCircle, Download, ExternalLink, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { Music } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export function MusicListPaginated() {
    const [currentItems, setCurrentItems] = useState<Music[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const itemsPerPage = 10;

    // Buscar músicas da API
    useEffect(() => {
        const fetchMusic = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await fetch(`/api/music?page=${currentPage}&limit=${itemsPerPage}`);

                if (!response.ok) {
                    throw new Error("Erro ao carregar músicas");
                }

                const data = await response.json();

                setCurrentItems(data.music);
                setTotalPages(data.pagination.totalPages);
                setTotalItems(data.pagination.total);
            } catch (err: any) {
                console.error("Erro ao buscar músicas:", err);
                setError(err.message || "Ocorreu um erro ao carregar as músicas");
            } finally {
                setLoading(false);
            }
        };

        fetchMusic();
    }, [currentPage]);

    // Cálculo de índices para exibição
    const startIndex = (currentPage - 1) * itemsPerPage;
    // Navegação entre páginas
    const goToPage = (page: number) => {
        setCurrentPage(Math.max(1, Math.min(page, totalPages)));
        // Scroll para o topo da lista
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // Exibir estado de carregamento
    if (loading && currentItems.length === 0) {
        return (
            <Card className="p-6 text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                <p className="mt-2 text-muted-foreground">Carregando músicas...</p>
            </Card>
        );
    }

    // Exibir mensagem de erro
    if (error && currentItems.length === 0) {
        return (
            <Card className="p-6 text-center bg-red-50 dark:bg-red-950/20">
                <p className="text-red-600 dark:text-red-400">{error}</p>
                <Button onClick={() => goToPage(1)} className="mt-4" variant="outline">
                    Tentar novamente
                </Button>
            </Card>
        );
    }

    // Mensagem quando não houver músicas
    if (currentItems.length === 0) {
        return (
            <Card className="p-6 text-center">
                <p className="text-muted-foreground">Nenhuma música encontrada.</p>
            </Card>
        );
    }

    // Função para renderizar uma linha da tabela de músicas
    const renderMusicRow = (music: Music, index: number) => (
        <div
            key={music.id}
            className={`flex items-center py-3 px-4 gap-4 ${
                index % 2 === 0 ? "bg-background" : "bg-muted/20"
            } hover:bg-muted/40 transition-colors`}
        >
            {/* Número da música */}
            <div className="flex-shrink-0 w-8 text-center text-muted-foreground">{startIndex + index + 1}</div>

            {/* Capa do álbum */}
            <div className="flex-shrink-0 relative w-12 h-12">
                <Image src={music.coverUrl} alt={music.title} fill className="object-cover rounded-md" />
            </div>

            {/* Informações da música */}
            <div className="flex flex-col flex-grow min-w-0">
                <Link href={`/musica/${music.id}`} className="font-medium hover:underline truncate">
                    {music.title}
                </Link>
                <Link
                    href={`/artista/${music.artistId}`}
                    className="text-sm text-muted-foreground hover:underline truncate"
                >
                    {music.artist}
                </Link>
            </div>

            {/* Gênero */}
            <div className="hidden md:block w-24 text-sm text-muted-foreground truncate">{music.genre}</div>

            {/* Data */}
            <div className="hidden md:block w-28 text-sm text-muted-foreground">{music.releaseDate}</div>

            {/* Downloads */}
            <div className="w-20 text-sm text-muted-foreground flex items-center justify-end">
                <Download className="h-3 w-3 mr-1" />
                {music.downloads.toLocaleString()}
            </div>

            {/* Ações */}
            <div className="flex-shrink-0 flex items-center gap-1">
                <Button size="icon" variant="ghost" className="h-8 w-8" asChild>
                    <Link href={`/musica/${music.id}`}>
                        <PlayCircle className="h-4 w-4" />
                        <span className="sr-only">Ouvir</span>
                    </Link>
                </Button>

                <Button size="icon" variant="ghost" className="h-8 w-8" asChild>
                    <Link href={`/musica/${music.id}`}>
                        <ExternalLink className="h-4 w-4" />
                        <span className="sr-only">Ver detalhes</span>
                    </Link>
                </Button>
            </div>
        </div>
    );

    // Renderizar paginação
    const renderPagination = () => {
        const pageNumbers = [];
        const maxVisiblePages = 5;

        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = startPage + maxVisiblePages - 1;

        if (endPage > totalPages) {
            endPage = totalPages;
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }

        return (
            <div className="flex items-center justify-center mt-6 gap-1">
                <Button
                    size="icon"
                    variant="outline"
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>

                {startPage > 1 && (
                    <>
                        <Button
                            variant={currentPage === 1 ? "default" : "outline"}
                            size="sm"
                            onClick={() => goToPage(1)}
                            className="w-8 h-8"
                        >
                            1
                        </Button>
                        {startPage > 2 && <span className="px-1">...</span>}
                    </>
                )}

                {pageNumbers.map((number) => (
                    <Button
                        key={number}
                        variant={currentPage === number ? "default" : "outline"}
                        size="sm"
                        onClick={() => goToPage(number)}
                        className="w-8 h-8"
                    >
                        {number}
                    </Button>
                ))}

                {endPage < totalPages && (
                    <>
                        {endPage < totalPages - 1 && <span className="px-1">...</span>}
                        <Button
                            variant={currentPage === totalPages ? "default" : "outline"}
                            size="sm"
                            onClick={() => goToPage(totalPages)}
                            className="w-8 h-8"
                        >
                            {totalPages}
                        </Button>
                    </>
                )}

                <Button
                    size="icon"
                    variant="outline"
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        );
    };

    return (
        <Card className="overflow-hidden">
            {/* Cabeçalho da lista */}
            <div className="flex items-center py-3 px-4 font-medium bg-muted/30 text-sm">
                <div className="w-8 text-center">#</div>
                <div className="w-12"></div>
                <div className="flex-grow pl-4">TÍTULO</div>
                <div className="hidden md:block w-24">GÊNERO</div>
                <div className="hidden md:block w-28">LANÇAMENTO</div>
                <div className="w-20 text-right">DOWNLOADS</div>
                <div className="w-[72px]"></div>
            </div>

            {/* Lista de músicas */}
            <div className="divide-y divide-border">{currentItems.map(renderMusicRow)}</div>

            {/* Paginação */}
            {renderPagination()}
        </Card>
    );
}
