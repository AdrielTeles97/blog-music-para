"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/page-header";
import { MusicCard } from "@/components/music-card";
import { Music } from "@/lib/types";
import { Loader2, Search, Filter, SortAsc, SortDesc } from "lucide-react";
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

export default function RecentMusicPage() {
  const [recentMusic, setRecentMusic] = useState<Music[]>([]);
  const [filteredMusic, setFilteredMusic] = useState<Music[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    const fetchRecentMusic = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/music/recently-added?limit=50");
        
        if (!response.ok) {
          throw new Error("Falha ao carregar músicas recentes");
        }
        
        const data = await response.json();
        setRecentMusic(data);
        setFilteredMusic(data);
      } catch (err: any) {
        console.error("Erro ao buscar músicas recentes:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRecentMusic();
  }, []);

  // Filtrar e ordenar músicas
  useEffect(() => {
    let filtered = [...recentMusic];

    // Filtrar por termo de busca
    if (searchTerm) {
      filtered = filtered.filter(music =>
        music.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        music.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
        music.genre.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Ordenar
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case "newest":
          comparison = new Date(b.postedAt || 0).getTime() - new Date(a.postedAt || 0).getTime();
          break;
        case "oldest":
          comparison = new Date(a.postedAt || 0).getTime() - new Date(b.postedAt || 0).getTime();
          break;
        case "title":
          comparison = a.title.localeCompare(b.title);
          break;
        case "artist":
          comparison = a.artist.localeCompare(b.artist);
          break;
        case "downloads":
          comparison = b.downloads - a.downloads;
          break;
      }
      
      return sortOrder === "asc" ? comparison : -comparison;
    });

    setFilteredMusic(filtered);
  }, [recentMusic, searchTerm, sortBy, sortOrder]);

  const getSortLabel = () => {
    const labels = {
      newest: "Mais recentes",
      oldest: "Mais antigas",
      title: "Título",
      artist: "Artista",
      downloads: "Downloads"
    };
    return labels[sortBy];
  };

  if (loading) {
    return (      <div className="container py-8">
        <PageHeader
          title="Músicas Recentes"
          description="Descubra as últimas adições ao nosso catálogo"
        />
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (error) {
    return (      <div className="container py-8">
        <PageHeader
          title="Músicas Recentes"
          description="Descubra as últimas adições ao nosso catálogo"
        />
        <Card className="p-6 text-center bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/20">
          <p className="text-red-600 dark:text-red-400">{error}</p>
          <Button 
            variant="outline"
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Tentar novamente
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-6">      <PageHeader
        title="Músicas Recentes"
        description={`${recentMusic.length} músicas adicionadas recentemente`}
      />

      {/* Controles de busca e filtros */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar músicas, artistas ou gêneros..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
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

      {/* Resultados */}
      {filteredMusic.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">
            {searchTerm 
              ? `Nenhuma música encontrada para "${searchTerm}"`
              : "Nenhuma música encontrada"
            }
          </p>
          {searchTerm && (
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => setSearchTerm("")}
            >
              Limpar busca
            </Button>
          )}
        </Card>
      ) : (
        <>
          {searchTerm && (
            <div className="text-sm text-muted-foreground">
              {filteredMusic.length} resultado(s) encontrado(s) para "{searchTerm}"
            </div>
          )}
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredMusic.map((music) => (
              <MusicCard key={music.id} music={music} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
