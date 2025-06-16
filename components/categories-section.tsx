"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Music2, Loader2 } from "lucide-react";
import Link from "next/link";

interface Genre {
    name: string;
    count: number;
}

interface GenresResponse {
    genres: Genre[];
    total: number;
}

export function CategoriesSection() {
    const [genres, setGenres] = useState<Genre[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const response = await fetch("/api/music/genres");
                if (!response.ok) {
                    throw new Error("Erro ao carregar gêneros");
                }
                const data: GenresResponse = await response.json();
                setGenres(data.genres.slice(0, 8)); // Mostrar apenas os 8 principais
            } catch (err: any) {
                console.error("Erro ao buscar gêneros:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchGenres();
    }, []);

    if (loading) {
        return (
            <Card className="p-6">
                <div className="flex items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
            </Card>
        );
    }

    if (error || genres.length === 0) {
        return (
            <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Categorias</h3>
                <p className="text-muted-foreground text-sm">{error || "Nenhuma categoria encontrada"}</p>
            </Card>
        );
    }

    return (
        <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Categorias</h3>
            <div className="grid grid-cols-2 gap-2">
                {genres.map((genre) => (
                    <Link
                        key={genre.name}
                        href={`/buscar?q=${encodeURIComponent(genre.name)}&genre=${encodeURIComponent(genre.name)}`}
                    >
                        <Button
                            variant="ghost"
                            className="w-full justify-start text-left h-auto p-3 hover:bg-primary/10"
                        >
                            <div className="flex items-center justify-between w-full">
                                <span className="font-medium text-sm">{genre.name}</span>
                                <span className="text-xs text-muted-foreground">{genre.count}</span>
                            </div>
                        </Button>
                    </Link>
                ))}
            </div>

            {genres.length >= 8 && (
                <div className="mt-4 pt-4 border-t">
                    <Link href="/categorias">
                        <Button variant="outline" className="w-full">
                            Ver todas as categorias
                        </Button>
                    </Link>
                </div>
            )}
        </Card>
    );
}
