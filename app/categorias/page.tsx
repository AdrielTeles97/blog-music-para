"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Music2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";

interface Genre {
    name: string;
    count: number;
}

interface GenresResponse {
    genres: Genre[];
    total: number;
}

export default function CategoriesPage() {
    const [genres, setGenres] = useState<Genre[]>([]);
    const [filteredGenres, setFilteredGenres] = useState<Genre[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const response = await fetch("/api/music/genres");
                if (!response.ok) {
                    throw new Error("Erro ao carregar gêneros");
                }
                const data: GenresResponse = await response.json();
                setGenres(data.genres);
                setFilteredGenres(data.genres);
            } catch (err: any) {
                console.error("Erro ao buscar gêneros:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchGenres();
    }, []);

    // Filtrar gêneros quando o termo de busca muda
    useEffect(() => {
        if (searchTerm.trim() === "") {
            setFilteredGenres(genres);
        } else {
            const filtered = genres.filter((genre) => genre.name.toLowerCase().includes(searchTerm.toLowerCase()));
            setFilteredGenres(filtered);
        }
    }, [searchTerm, genres]);

    if (loading) {
        return (
            <div className="container py-8">
                <PageHeader title="Categorias" description="Explore músicas por gênero" />
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container py-8">
                <PageHeader title="Categorias" description="Explore músicas por gênero" />
                <Card className="p-6 text-center bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/20">
                    <p className="text-red-600 dark:text-red-400">{error}</p>
                    <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
                        Tentar novamente
                    </Button>
                </Card>
            </div>
        );
    }

    return (
        <div className="container py-8 space-y-6">
            <PageHeader title="Categorias" description={`${genres.length} gêneros musicais disponíveis`} />

            {/* Barra de busca */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                    placeholder="Buscar gêneros..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                />
            </div>

            {/* Resultados */}
            {filteredGenres.length === 0 ? (
                <Card className="p-8 text-center">
                    <Music2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Nenhum gênero encontrado</h3>
                    <p className="text-muted-foreground mb-4">
                        {searchTerm
                            ? `Tente usar outros termos de busca para "${searchTerm}"`
                            : "Não há gêneros cadastrados no sistema."}
                    </p>
                    {searchTerm && (
                        <Button variant="outline" onClick={() => setSearchTerm("")}>
                            Limpar busca
                        </Button>
                    )}
                </Card>
            ) : (
                <>
                    {searchTerm && (
                        <div className="text-sm text-muted-foreground">
                            {filteredGenres.length} gênero(s) encontrado(s) para "{searchTerm}"
                        </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {filteredGenres.map((genre) => (
                            <Link
                                key={genre.name}
                                href={`/buscar?q=${encodeURIComponent(genre.name)}&genre=${encodeURIComponent(
                                    genre.name
                                )}`}
                            >
                                <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:scale-105 group cursor-pointer">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                                                {genre.name}
                                            </h3>
                                            <p className="text-sm text-muted-foreground">
                                                {genre.count} música{genre.count !== 1 ? "s" : ""}
                                            </p>
                                        </div>
                                        <Music2 className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors" />
                                    </div>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
