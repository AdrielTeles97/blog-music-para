"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/page-header";
import { RelatedSongs } from "@/components/related-songs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, Share2, Heart, Play, Pause, ExternalLink, Clock, Music, LayoutGrid } from "lucide-react";
import Image from "next/image";
import { AudioSource, playMusic, pauseMusic } from "@/components/music-player-footer";
import { identifyPlatform } from "@/lib/audio-url-processor";
import * as Tabs from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";
import { useParams } from "next/navigation";

// Tipo para eventos customizados do player
type PlayerEvent = {
    type: "play" | "pause" | "stop" | "ended";
    musicId?: string;
};

interface Music {
    id: string;
    title: string;
    artist: string;
    album?: string;
    genre: string;
    releaseDate?: string;
    duration?: string;
    coverUrl?: string;
    audioUrl: string;
    downloads: number;
    description?: string;
    postedBy?: string;
    postedAt?: string;
    spotifyUrl?: string;
    youtubeUrl?: string;
    appleMusicUrl?: string;
}

export default function MusicPage() {
    // Usamos o useParams para obter o ID da música da URL de forma segura
    const params = useParams();
    const id = Array.isArray(params.id) ? params.id[0] : params.id;    const [music, setMusic] = useState<Music | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentPlayingId, setCurrentPlayingId] = useState<string | null>(null);

    useEffect(() => {
        const fetchMusic = async () => {
            setIsLoading(true);
            setError(null);

            try {
                // Buscando música via API
                const response = await fetch(`/api/music/${id}`);

                if (!response.ok) {
                    throw new Error(response.status === 404 ? "Música não encontrada" : "Erro ao buscar música");
                }

                const musicData = await response.json();
                setMusic(musicData);
            } catch (error: any) {
                console.error("Erro ao buscar música:", error);
                setError(error.message || "Erro ao buscar música");
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            fetchMusic();
        }
    }, [id]);

    // Ouvir eventos do player global
    useEffect(() => {
        // Handler para atualizar o estado de reprodução com base nos eventos do player global
        const handlePlayerEvent = (event: CustomEvent) => {
            const playerEvent = event.detail as PlayerEvent;

            // Atualizar o estado de reprodução apenas se for a música atual
            if (playerEvent.musicId === id || !playerEvent.musicId) {
                setIsPlaying(playerEvent.type === "play");
                if (playerEvent.musicId) {
                    setCurrentPlayingId(playerEvent.musicId);
                }
            } else if (playerEvent.musicId !== id && playerEvent.type === "play") {
                // Se outra música começou a tocar, esta não está mais tocando
                setIsPlaying(false);
                setCurrentPlayingId(playerEvent.musicId);
            }
        };

        // Registrar ouvintes para os eventos
        window.addEventListener("player-play" as any, handlePlayerEvent as EventListener);
        window.addEventListener("player-pause" as any, handlePlayerEvent as EventListener);
        window.addEventListener("player-stop" as any, handlePlayerEvent as EventListener);
        window.addEventListener("player-ended" as any, handlePlayerEvent as EventListener);

        // Limpar ouvintes ao desmontar
        return () => {
            window.removeEventListener("player-play" as any, handlePlayerEvent as EventListener);
            window.removeEventListener("player-pause" as any, handlePlayerEvent as EventListener);
            window.removeEventListener("player-stop" as any, handlePlayerEvent as EventListener);
            window.removeEventListener("player-ended" as any, handlePlayerEvent as EventListener);
        };
    }, [id]); // Manipulador para tocar ou pausar a música usando o player global
    const handlePlayPause = () => {
        if (!music) return;

        if (isPlaying) {
            // Se já está tocando, pausar
            pauseMusic(music.id);
            // O estado será atualizado pelo listener de eventos
        } else {
            // Se não está tocando, iniciar reprodução
            const platform = identifyPlatform(music.audioUrl);

            // Criar objeto de fonte de áudio
            const audioSource: AudioSource = {
                id: music.id,
                platform,
                url: music.audioUrl,
                title: music.title,
                artist: music.artist,
                coverUrl: music.coverUrl,
            };

            // Reproduzir a música usando o player global
            playMusic(audioSource);
            // O estado será atualizado pelo listener de eventos
        }
    };    // Manipular download
    const handleDownload = async () => {
        if (!music) return;
        
        try {
            // Fazer o download via nossa API
            const downloadUrl = `/api/music/download-file?id=${music.id}`;
            
            // Criar um link temporário para download
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = `${music.artist} - ${music.title}.mp3`;
            link.style.display = 'none';
            
            // Adicionar ao DOM, clicar e remover
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Atualizar a UI com o contador incrementado
            setMusic(prevMusic => {
                if (prevMusic) {
                    return {
                        ...prevMusic,
                        downloads: prevMusic.downloads + 1
                    };
                }
                return prevMusic;
            });
            
        } catch (error) {
            console.error('Erro ao fazer download:', error);
        }
    };

    // Manipular compartilhamento
    const handleShare = () => {
        if (navigator.share) {
            navigator
                .share({
                    title: music?.title,
                    text: `Ouça ${music?.title} por ${music?.artist} no ParáMusic`,
                    url: window.location.href,
                })
                .catch(console.error);
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert("Link copiado para a área de transferência!");
        }
    };

    if (isLoading) {
        return (
            <div className="container py-10">
                <div className="h-10 w-1/2 bg-muted animate-pulse mb-6 rounded"></div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <div className="aspect-video bg-muted animate-pulse rounded-lg"></div>
                    </div>
                    <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="h-20 bg-muted animate-pulse rounded-lg"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return <div className="container py-10 text-center text-red-500">{error}</div>;
    }

    if (!music) {
        return <div className="container py-10">Música não encontrada</div>;
    }

    return (
        <>
            {/* Hero banner com imagem de fundo */}
            <div className="relative h-[280px] md:h-[320px]">
                <div className="absolute inset-0">
                    <Image
                        src={music.coverUrl || "/placeholder.svg"}
                        alt={music.title}
                        fill
                        className="object-cover blur-lg opacity-40"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/40 to-background"></div>
                </div>

                {/* Conteúdo do hero */}
                <div className="container relative z-10 h-full flex items-center">
                    <div className="flex flex-col md:flex-row items-start md:items-end gap-6 w-full">
                        {/* Capa do álbum */}
                        <div className="w-40 h-40 md:w-48 md:h-48 rounded-lg overflow-hidden shadow-xl flex-shrink-0 border border-border/50">
                            <Image
                                src={music.coverUrl || "/placeholder.svg"}
                                alt={music.title}
                                width={192}
                                height={192}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Info da música */}
                        <div className="flex-1">
                            <div className="flex flex-col">
                                <span className="uppercase text-xs font-medium text-muted-foreground mb-1">Música</span>
                                <h1 className="text-2xl md:text-4xl font-bold line-clamp-2">{music.title}</h1>
                                <div className="flex items-center text-sm md:text-base mt-2">
                                    <span className="font-medium">{music.artist}</span>
                                    {music.album && (
                                        <>
                                            <span className="mx-2">•</span>
                                            <span className="text-muted-foreground">{music.album}</span>
                                        </>
                                    )}
                                </div>
                                <div className="text-sm text-muted-foreground mt-2 flex items-center gap-2">
                                    <span>{music.releaseDate}</span>
                                    <span>•</span>
                                    <span>{music.genre}</span>
                                    <span>•</span>
                                    <span className="flex items-center">
                                        <Clock className="h-3 w-3 mr-1" />
                                        {music.duration || "3:45"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Conteúdo principal */}
            <div className="container py-6">
                <div className="flex items-center gap-3 mb-8">
                    {" "}
                    <Button size="lg" className="rounded-full px-6" onClick={handlePlayPause}>
                        {isPlaying ? <Pause className="mr-2 h-5 w-5" /> : <Play className="mr-2 h-5 w-5" />}
                        {isPlaying ? "Pausar" : "Reproduzir"}
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        className={cn("rounded-full", isLiked ? "text-red-500 border-red-500 bg-red-500/10" : "")}
                        onClick={() => setIsLiked(!isLiked)}
                    >
                        <Heart className={cn("h-5 w-5", isLiked ? "fill-current" : "")} />
                    </Button>
                    <Button variant="outline" size="icon" className="rounded-full" onClick={handleShare}>
                        <Share2 className="h-5 w-5" />
                    </Button>
                    <Button className="rounded-full gap-2 ml-auto" onClick={handleDownload}>
                        <Download className="h-5 w-5" />
                        <span className="hidden sm:inline">Download</span>
                        <span className="bg-background/20 px-2 py-0.5 rounded-full text-xs">{music.downloads}</span>
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <Tabs.Root defaultValue="about" className="w-full">
                            <Tabs.List className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground mb-6">
                                <Tabs.Trigger
                                    value="about"
                                    className="inline-flex items-center justify-center whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                                >
                                    <Music className="h-4 w-4 mr-2" />
                                    Sobre
                                </Tabs.Trigger>
                                <Tabs.Trigger
                                    value="lyrics"
                                    className="inline-flex items-center justify-center whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                                >
                                    <LayoutGrid className="h-4 w-4 mr-2" />
                                    Letra
                                </Tabs.Trigger>
                            </Tabs.List>

                            <Tabs.Content
                                value="about"
                                className="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 space-y-6"
                            >
                                <Card className="p-6">
                                    <h2 className="text-xl font-bold mb-4">Sobre a Música</h2>
                                    <p className="text-muted-foreground whitespace-pre-line">
                                        {music.description || "Nenhuma descrição disponível."}
                                    </p>

                                    <h3 className="text-lg font-bold mt-8 mb-3">Informações</h3>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                        <div>
                                            <p className="text-sm text-muted-foreground">Álbum</p>
                                            <p className="font-medium">{music.album || "—"}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Gênero</p>
                                            <p className="font-medium">{music.genre}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Lançamento</p>
                                            <p className="font-medium">{music.releaseDate || "—"}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Duração</p>
                                            <p className="font-medium">{music.duration || "—"}</p>
                                        </div>
                                    </div>
                                </Card>

                                <Card className="p-6">
                                    <h2 className="text-xl font-bold mb-4">Enviado por</h2>
                                    <div className="flex items-center gap-3">                                        <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                                            <span className="font-semibold text-primary">
                                                {music.postedBy ? music.postedBy.charAt(0).toUpperCase() : "?"}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="font-medium">{music.postedBy || "Anônimo"}</p>
                                            <p className="text-sm text-muted-foreground">Enviado em {music.postedAt || "N/A"}</p>
                                        </div>
                                    </div>
                                </Card>
                            </Tabs.Content>

                            <Tabs.Content
                                value="lyrics"
                                className="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            >
                                <Card className="p-6">
                                    <p className="italic text-muted-foreground text-center py-10">
                                        Letra não disponível para esta música.
                                    </p>
                                </Card>
                            </Tabs.Content>
                        </Tabs.Root>
                    </div>

                    <div className="space-y-6">
                        {/* Músicas relacionadas */}
                        <Card className="overflow-hidden border-none shadow-lg">
                            <div className="bg-gradient-to-r from-primary/20 to-primary/5 p-4">
                                <h2 className="text-xl font-bold mb-4">Músicas Relacionadas</h2>
                                <RelatedSongs currentId={String(id)} />
                            </div>
                        </Card>

                        {/* Links externos */}
                        <Card className="overflow-hidden border-none shadow-lg">
                            <div className="bg-gradient-to-r from-muted/50 to-muted/10 p-4">
                                <h2 className="text-xl font-bold mb-4">Links</h2>
                                <div className="space-y-2">
                                    <a
                                        href={music.spotifyUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`flex items-center p-3 rounded-lg transition-colors ${
                                            music.spotifyUrl ? "hover:bg-green-500/10" : "opacity-50 cursor-not-allowed"
                                        }`}
                                        onClick={(e) => !music.spotifyUrl && e.preventDefault()}
                                    >
                                        <div className="w-8 h-8 bg-[#1DB954] rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                                            <span className="text-white text-xs font-bold">S</span>
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium">Spotify</p>
                                            <p className="text-xs text-muted-foreground line-clamp-1">
                                                {music.spotifyUrl ? "Ouvir no Spotify" : "Link não disponível"}
                                            </p>
                                        </div>
                                        {music.spotifyUrl && <ExternalLink className="h-4 w-4 text-muted-foreground" />}
                                    </a>

                                    <a
                                        href={music.youtubeUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`flex items-center p-3 rounded-lg transition-colors ${
                                            music.youtubeUrl ? "hover:bg-red-500/10" : "opacity-50 cursor-not-allowed"
                                        }`}
                                        onClick={(e) => !music.youtubeUrl && e.preventDefault()}
                                    >
                                        <div className="w-8 h-8 bg-[#FF0000] rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                                            <span className="text-white text-xs font-bold">Y</span>
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium">YouTube</p>
                                            <p className="text-xs text-muted-foreground line-clamp-1">
                                                {music.youtubeUrl ? "Assistir no YouTube" : "Link não disponível"}
                                            </p>
                                        </div>
                                        {music.youtubeUrl && <ExternalLink className="h-4 w-4 text-muted-foreground" />}
                                    </a>

                                    <a
                                        href={music.appleMusicUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`flex items-center p-3 rounded-lg transition-colors ${
                                            music.appleMusicUrl
                                                ? "hover:bg-red-500/10"
                                                : "opacity-50 cursor-not-allowed"
                                        }`}
                                        onClick={(e) => !music.appleMusicUrl && e.preventDefault()}
                                    >
                                        <div className="w-8 h-8 bg-[#FA243C] rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                                            <span className="text-white text-xs font-bold">A</span>
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium">Apple Music</p>
                                            <p className="text-xs text-muted-foreground line-clamp-1">
                                                {music.appleMusicUrl ? "Ouvir no Apple Music" : "Link não disponível"}
                                            </p>
                                        </div>
                                        {music.appleMusicUrl && (
                                            <ExternalLink className="h-4 w-4 text-muted-foreground" />
                                        )}
                                    </a>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}
