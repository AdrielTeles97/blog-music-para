"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { MusicCard } from "@/components/music-card";
import { Music } from "@/lib/types";
import { Loader2, Search, Filter, SortAsc, SortDesc, X, Music2, ChevronLeft, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type SortOption = "newest" | "oldest" | "title" | "artist" | "downloads";

interface SearchResult {
    musics: Music[];
    pagination: {
        page: number;
        limit: number;
        totalCount: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
    };
    query: string;
    genres: string[];
}

export default function SearchPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const initialQuery = searchParams?.get("q") || "";

    const [searchTerm, setSearchTerm] = useState(initialQuery);
    const [results, setResults] = useState<SearchResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [sortBy, setSortBy] = useState<SortOption>("newest");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
    const [selectedGenre, setSelectedGenre] = useState<string>("all");
    const [currentPage, setCurrentPage] = useState(1);

    // Função para fazer a busca
    const performSearch = async (
        query: string,
        page: number = 1,
        genre: string = "all",
        sort: SortOption = "newest"
    ) => {
        if (!query.trim()) return;

        setLoading(true);
        setError(null);

        try {
            const params = new URLSearchParams({
                q: query.trim(),
                page: page.toString(),
                limit: "20",
                sortBy: sort,
            });

            if (genre !== "all") {
                params.append("genre", genre);
            }

            const response = await fetch(`/api/music/search?${params}`);

            if (!response.ok) {
                throw new Error("Erro ao realizar busca");
            }

            const data = await response.json();
            setResults(data);
            setCurrentPage(page);
        } catch (err: any) {
            console.error("Erro na busca:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Buscar quando a página carrega
    useEffect(() => {
        if (initialQuery) {
            performSearch(initialQuery, 1, selectedGenre, sortBy);
        }
    }, []);

    // Buscar quando filtros mudam
    useEffect(() => {
        if (results && searchTerm.trim()) {
            performSearch(searchTerm, 1, selectedGenre, sortBy);
        }
    }, [selectedGenre, sortBy]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            // Atualizar URL
            router.push(`/buscar?q=${encodeURIComponent(searchTerm.trim())}`);
            performSearch(searchTerm, 1, selectedGenre, sortBy);
        }
    };

    const handlePageChange = (page: number) => {
        if (searchTerm.trim()) {
            performSearch(searchTerm, page, selectedGenre, sortBy);
        }
    };

    const clearSearch = () => {
        setSearchTerm("");
        setResults(null);
        setError(null);
        router.push("/buscar");
    };

    const getSortLabel = () => {
        const labels = {
            newest: "Mais recentes",
            oldest: "Mais antigas",
            title: "Título A-Z",
            artist: "Artista A-Z",
            downloads: "Mais baixadas",
        };
        return labels[sortBy];
    };

    return (
        <div className="container py-8 space-y-6">
            <PageHeader title="Buscar Músicas" description="Encontre suas músicas, artistas e álbuns favoritos" />

            {/* Barra de busca */}
            <Card className="p-6">
                <form onSubmit={handleSearch} className="space-y-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                        <Input
                            placeholder="Buscar músicas, artistas, álbuns ou gêneros..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-12 pr-12 h-12 text-base"
                        />
                        {searchTerm && (
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                                onClick={clearSearch}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        )}
                    </div>

                    {/* Filtros */}
                    {results && (
                        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                            <div className="flex gap-2 w-full sm:w-auto">                                {/* Filtro de gênero */}
                                {results.genres.length > 0 && (
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="outline" className="w-full sm:w-48 justify-start">
                                                {selectedGenre === "all" ? "Todos os gêneros" : selectedGenre}
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="start" className="w-48">
                                            <DropdownMenuItem onClick={() => setSelectedGenre("all")}>
                                                Todos os gêneros
                                            </DropdownMenuItem>
                                            {results.genres.map((genre) => (
                                                <DropdownMenuItem key={genre} onClick={() => setSelectedGenre(genre)}>
                                                    {genre}
                                                </DropdownMenuItem>
                                            ))}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                )}

                                {/* Ordenação */}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" className="gap-2">
                                            <Filter className="h-4 w-4" />
                                            {getSortLabel()}
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => setSortBy("newest")}>
                                            Mais recentes
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setSortBy("oldest")}>
                                            Mais antigas
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setSortBy("title")}>
                                            Título A-Z
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setSortBy("artist")}>
                                            Artista A-Z
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setSortBy("downloads")}>
                                            Mais baixadas
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>

                                {/* Ordem crescente/decrescente */}
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                                >
                                    {sortOrder === "asc" ? (
                                        <SortAsc className="h-4 w-4" />
                                    ) : (
                                        <SortDesc className="h-4 w-4" />
                                    )}
                                </Button>
                            </div>
                        </div>
                    )}

                    <Button type="submit" className="w-full sm:w-auto">
                        <Search className="mr-2 h-4 w-4" />
                        Buscar
                    </Button>
                </form>
            </Card>

            {/* Loading */}
            {loading && (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            )}

            {/* Erro */}
            {error && (
                <Card className="p-6 text-center bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/20">
                    <p className="text-red-600 dark:text-red-400">{error}</p>
                    <Button
                        variant="outline"
                        className="mt-4"
                        onClick={() => performSearch(searchTerm, currentPage, selectedGenre, sortBy)}
                    >
                        Tentar novamente
                    </Button>
                </Card>
            )}

            {/* Resultados */}
            {results && !loading && (
                <div className="space-y-6">
                    {/* Info dos resultados */}
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                            {results.pagination.totalCount > 0 ? (
                                <>
                                    {results.pagination.totalCount} resultado(s) encontrado(s) para "{results.query}"
                                    {selectedGenre !== "all" && ` em ${selectedGenre}`}
                                </>
                            ) : (
                                `Nenhum resultado encontrado para "${results.query}"`
                            )}
                        </div>
                    </div>

                    {/* Grid de resultados */}
                    {results.musics.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                {results.musics.map((music) => (
                                    <MusicCard key={music.id} music={music} />
                                ))}
                            </div>

                            {/* Paginação */}
                            {results.pagination.totalPages > 1 && (
                                <div className="flex items-center justify-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={!results.pagination.hasPrevPage}
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </Button>

                                    <div className="flex items-center gap-1">
                                        {Array.from({ length: Math.min(5, results.pagination.totalPages) }, (_, i) => {
                                            const pageNum =
                                                currentPage <= 3
                                                    ? i + 1
                                                    : currentPage >= results.pagination.totalPages - 2
                                                    ? results.pagination.totalPages - 4 + i
                                                    : currentPage - 2 + i;

                                            if (pageNum < 1 || pageNum > results.pagination.totalPages) return null;

                                            return (
                                                <Button
                                                    key={pageNum}
                                                    variant={pageNum === currentPage ? "default" : "outline"}
                                                    size="icon"
                                                    onClick={() => handlePageChange(pageNum)}
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
                                        disabled={!results.pagination.hasNextPage}
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            )}
                        </>
                    ) : (
                        <Card className="p-12 text-center">
                            <Music2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold mb-2">Nenhuma música encontrada</h3>
                            <p className="text-muted-foreground mb-4">
                                Tente usar termos diferentes ou verifique a ortografia.
                            </p>
                            <Button variant="outline" onClick={clearSearch}>
                                Limpar busca
                            </Button>
                        </Card>
                    )}
                </div>
            )}

            {/* Estado inicial */}
            {!results && !loading && !error && (
                <Card className="p-12 text-center">
                    <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Busque por músicas</h3>
                    <p className="text-muted-foreground">
                        Digite o nome de uma música, artista, álbum ou gênero para começar.
                    </p>
                </Card>
            )}
        </div>
    );
}
