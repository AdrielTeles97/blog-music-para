"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    Play,
    Pause,
    SkipBack,
    SkipForward,
    Volume2,
    VolumeX,
    Repeat,
    Shuffle,
    Maximize2,
    Heart,
    ListMusic,
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { processAudioUrl, getFallbackUrls } from "@/lib/audio-url-processor";
import { ProgressBar, WaveformProgressBar } from "@/components/ui/progress-bar";

// Definir tipos de origem de áudio
export type AudioSource = {
    platform: "direct" | "soundcloud" | "googledrive" | "dropbox";
    url: string;
    title: string;
    artist: string;
    coverUrl?: string;
    id: string;
};

// Estado global para a música atual
let globalCurrentMusic: AudioSource | null = null;

export function MusicPlayerFooter() {
    const [currentMusic, setCurrentMusic] = useState<AudioSource | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [volume, setVolume] = useState(0.7);
    const [isMuted, setIsMuted] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isRepeat, setIsRepeat] = useState(false);
    const [isShuffle, setIsShuffle] = useState(false);

    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Evento personalizado para ouvir quando uma música é selecionada para tocar
    useEffect(() => {
        const handleMusicPlay = (event: CustomEvent) => {
            const musicData = event.detail as AudioSource;
            setCurrentMusic(musicData);
            globalCurrentMusic = musicData;
            setIsPlaying(true);

            // Disparar evento para notificar outros componentes
            const playerEvent = new CustomEvent("player-play", {
                detail: { type: "play", musicId: musicData.id },
            });
            window.dispatchEvent(playerEvent);
        };

        const handleMusicPause = (event: CustomEvent) => {
            const data = event.detail;
            if (audioRef.current && currentMusic && (!data.id || data.id === currentMusic.id)) {
                audioRef.current.pause();
                setIsPlaying(false);

                // Disparar evento para notificar outros componentes
                const playerEvent = new CustomEvent("player-pause", {
                    detail: { type: "pause", musicId: currentMusic.id },
                });
                window.dispatchEvent(playerEvent);
            }
        };

        // Registrar os eventos
        window.addEventListener("play-music" as any, handleMusicPlay as EventListener);
        window.addEventListener("pause-music" as any, handleMusicPause as EventListener);

        // Limpar os eventos ao desmontar
        return () => {
            window.removeEventListener("play-music" as any, handleMusicPlay as EventListener);
            window.removeEventListener("pause-music" as any, handleMusicPause as EventListener);
        };
    }, [currentMusic]);

    // Processar URL baseado na plataforma
    useEffect(() => {
        if (!currentMusic) return;

        const playAudio = async () => {
            try {
                // Processar URL usando nossa biblioteca dedicada
                const processedUrl = processAudioUrl(currentMusic.url, currentMusic.platform);
                console.log(`URL processada (${currentMusic.platform}):`, processedUrl);

                if (audioRef.current) {
                    // Tentar reproduzir com a URL principal
                    audioRef.current.src = processedUrl;
                    audioRef.current.load();

                    try {
                        await audioRef.current.play();
                        console.log("Reprodução iniciada com sucesso usando URL principal");
                        setIsPlaying(true);
                    } catch (error) {
                        console.error("Erro ao reproduzir usando URL principal:", error);

                        // Se falhou, tentar URLs alternativas
                        const fallbackUrls = getFallbackUrls(currentMusic.url, currentMusic.platform);
                        console.log("Tentando URLs alternativas:", fallbackUrls);

                        // Tentar cada URL alternativa
                        let played = false;
                        for (const fallbackUrl of fallbackUrls) {
                            if (played) break;

                            try {
                                audioRef.current.src = fallbackUrl;
                                audioRef.current.load();
                                await audioRef.current.play();
                                console.log("Reprodução iniciada com sucesso usando URL alternativa:", fallbackUrl);
                                played = true;
                                setIsPlaying(true);
                                break;
                            } catch (fallbackError) {
                                console.error(`Falha na URL alternativa ${fallbackUrl}:`, fallbackError);
                            }
                        }

                        if (!played) {
                            console.error("Todas as tentativas de reprodução falharam");
                            setIsPlaying(false);

                            // Mostrar um alerta para o usuário (em um ambiente de produção,
                            // seria melhor usar um componente de notificação/toast)
                            alert(
                                `Não foi possível reproduzir "${currentMusic.title}". O formato pode não ser suportado ou o arquivo pode não estar disponível.`
                            );
                        }
                    }
                }
            } catch (error) {
                console.error("Erro durante o processamento da URL:", error);
            }
        };

        playAudio();
    }, [currentMusic]);

    // Função para lidar com o fim da música
    const handleEnded = () => {
        setIsPlaying(false);

        if (currentMusic) {
            // Disparar evento para notificar outros componentes
            const playerEvent = new CustomEvent("player-ended", {
                detail: { type: "ended", musicId: currentMusic.id },
            });
            window.dispatchEvent(playerEvent);
        }

        if (isRepeat && audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play();
            setIsPlaying(true);

            if (currentMusic) {
                // Notificar que a reprodução foi reiniciada
                const playerEvent = new CustomEvent("player-play", {
                    detail: { type: "play", musicId: currentMusic.id },
                });
                window.dispatchEvent(playerEvent);
            }
        }
    };

    // Atualizar a barra de progresso
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const updateProgress = () => {
            const current = audio.currentTime;
            const duration = audio.duration;
            setCurrentTime(current);
            setDuration(duration);
        };

        audio.addEventListener("timeupdate", updateProgress);
        audio.addEventListener("loadedmetadata", updateProgress);
        audio.addEventListener("ended", handleEnded);

        return () => {
            audio.removeEventListener("timeupdate", updateProgress);
            audio.removeEventListener("loadedmetadata", updateProgress);
            audio.removeEventListener("ended", handleEnded);
        };
    }, [isRepeat, currentMusic]); // Adicionado dependências necessárias

    // Função para alterar volume
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = isMuted ? 0 : volume;
        }
    }, [volume, isMuted]);

    // Funções de controle
    const togglePlay = () => {
        const audio = audioRef.current;
        if (!audio || !currentMusic) return;

        if (isPlaying) {
            audio.pause();
            setIsPlaying(false);

            // Disparar evento para notificar outros componentes
            const playerEvent = new CustomEvent("player-pause", {
                detail: { type: "pause", musicId: currentMusic.id },
            });
            window.dispatchEvent(playerEvent);
        } else {
            audio
                .play()
                .then(() => {
                    setIsPlaying(true);

                    // Disparar evento para notificar outros componentes
                    const playerEvent = new CustomEvent("player-play", {
                        detail: { type: "play", musicId: currentMusic.id },
                    });
                    window.dispatchEvent(playerEvent);
                })
                .catch((err) => {
                    console.error("Erro ao reproduzir áudio:", err);
                });
        }
    };

    const handleProgressChange = (values: number[]) => {
        const audio = audioRef.current;
        if (!audio) return;

        const newTime = values[0];
        audio.currentTime = newTime;
        setCurrentTime(newTime);
    };

    const handleVolumeChange = (values: number[]) => {
        const newVolume = values[0];
        setVolume(newVolume);
        setIsMuted(newVolume === 0);
    };

    const toggleMute = () => {
        setIsMuted(!isMuted);
    };

    const toggleRepeat = () => {
        setIsRepeat(!isRepeat);
    };

    const toggleShuffle = () => {
        setIsShuffle(!isShuffle);
    };

    const formatTime = (time: number) => {
        if (isNaN(time)) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    };

    // Se não houver música, mostrar um player vazio minimizado
    if (!currentMusic) {
        return null;
    }

    return (
        <div
            className={cn(
                "fixed bottom-0 left-0 right-0 bg-background/90 backdrop-blur-md border-t z-50 transition-all duration-300",
                isExpanded ? "h-96" : "h-20"
            )}
        >
            <audio ref={audioRef} />

            {/* Player expandido */}
            {isExpanded && (
                <div className="container max-w-6xl mx-auto h-full p-6 grid grid-cols-1 md:grid-cols-2 gap-6 relative">
                    {/* Botão simples para minimizar */}
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsExpanded(false)}
                        className="absolute top-2 right-2"
                        title="Minimizar player"
                    >
                        X
                    </Button>

                    <div className="flex items-center justify-center">
                        <div className="relative w-64 h-64 shadow-2xl">
                            <Image
                                src={currentMusic.coverUrl || "/placeholder.svg"}
                                alt={currentMusic.title}
                                fill
                                className="object-cover rounded-lg"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col justify-center">
                        <h2 className="text-2xl font-bold mb-1">{currentMusic.title}</h2>
                        <p className="text-muted-foreground mb-6">{currentMusic.artist}</p>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span>{formatTime(currentTime)}</span>
                                    <span>{formatTime(duration)}</span>
                                </div>
                                {/* Barra de progresso com visualização de wave simulado */}
                                <WaveformProgressBar
                                    currentTime={currentTime}
                                    duration={duration}
                                    onSeek={(newTime) => {
                                        if (audioRef.current) {
                                            audioRef.current.currentTime = newTime;
                                            setCurrentTime(newTime);
                                        }
                                    }}
                                    className="w-full h-12"
                                />
                            </div>

                            <div className="flex justify-between items-center">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={toggleShuffle}
                                    className={isShuffle ? "text-primary" : ""}
                                >
                                    <Shuffle className="h-5 w-5" />
                                </Button>
                                <Button variant="ghost" size="icon">
                                    <SkipBack className="h-5 w-5" />
                                </Button>
                                <Button
                                    size="icon"
                                    onClick={togglePlay}
                                    className="h-12 w-12 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
                                >
                                    {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                                </Button>
                                <Button variant="ghost" size="icon">
                                    <SkipForward className="h-5 w-5" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={toggleRepeat}
                                    className={isRepeat ? "text-primary" : ""}
                                >
                                    <Repeat className="h-5 w-5" />
                                </Button>
                            </div>

                            <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon" onClick={toggleMute}>
                                    {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                                </Button>
                                <Slider
                                    value={[isMuted ? 0 : volume]}
                                    max={1}
                                    step={0.01}
                                    onValueChange={handleVolumeChange}
                                    className="w-32"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Player minimizado */}
            <div className="container max-w-6xl mx-auto h-20 flex items-center">
                <div className="grid grid-cols-3 w-full gap-4">
                    {/* Info da música */}
                    <div className="flex items-center gap-3">
                        <div className="relative h-12 w-12 rounded-md overflow-hidden flex-shrink-0">
                            <Image
                                src={currentMusic.coverUrl || "/placeholder.svg"}
                                alt={currentMusic.title}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="min-w-0">
                            <Link
                                href={`/musica/${currentMusic.id}`}
                                className="font-medium text-sm line-clamp-1 hover:underline"
                            >
                                {currentMusic.title}
                            </Link>
                            <Link
                                href={`/artista/${currentMusic.artist.toLowerCase().replace(/\s+/g, "-")}`}
                                className="text-xs text-muted-foreground hover:underline"
                            >
                                {currentMusic.artist}
                            </Link>
                        </div>
                        <Button variant="ghost" size="icon" className="hidden md:flex">
                            <Heart className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* Controles */}
                    <div className="flex flex-col items-center justify-center">
                        <div className="flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={toggleShuffle}
                                className={cn("hidden sm:flex", isShuffle ? "text-primary" : "")}
                            >
                                <Shuffle className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="hidden sm:flex">
                                <SkipBack className="h-4 w-4" />
                            </Button>
                            <Button
                                onClick={togglePlay}
                                className="h-8 w-8 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 flex-shrink-0"
                                size="icon"
                            >
                                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                            </Button>
                            <Button variant="ghost" size="icon" className="hidden sm:flex">
                                <SkipForward className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={toggleRepeat}
                                className={cn("hidden sm:flex", isRepeat ? "text-primary" : "")}
                            >
                                <Repeat className="h-4 w-4" />
                            </Button>
                        </div>
                        
                        <div className="w-full max-w-md flex items-center gap-1 text-xs">
                            <span className="hidden sm:block w-8 text-right text-muted-foreground">
                                {formatTime(currentTime)}
                            </span>
                            <ProgressBar
                                currentTime={currentTime}
                                duration={duration}
                                showWaveform={true}
                                className="flex-1"
                                onSeek={(newTime) => {
                                    if (audioRef.current) {
                                        audioRef.current.currentTime = newTime;
                                        setCurrentTime(newTime);
                                    }
                                }}
                            />
                            <span className="hidden sm:block w-8 text-muted-foreground">{formatTime(duration)}</span>
                        </div>
                    </div>

                    {/* Volume e extras */}
                    <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" className="hidden md:flex">
                            <ListMusic className="h-4 w-4" />
                        </Button>
                        <div className="hidden md:flex items-center gap-2">
                            <Button variant="ghost" size="icon" onClick={toggleMute} className="hidden sm:flex">
                                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                            </Button>
                            <Slider
                                value={[isMuted ? 0 : volume]}
                                max={1}
                                step={0.01}
                                onValueChange={handleVolumeChange}
                                className="w-20"
                            />
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => setIsExpanded(!isExpanded)}>
                            {isExpanded ? (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="h-4 w-4"
                                >
                                    <polyline points="4 14 10 14 10 20"></polyline>
                                    <polyline points="20 10 14 10 14 4"></polyline>
                                    <line x1="14" y1="10" x2="21" y2="3"></line>
                                    <line x1="3" y1="21" x2="10" y2="14"></line>
                                </svg>
                            ) : (
                                <Maximize2 className="h-4 w-4" />
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Função auxiliar para disparar o evento de tocar música
export function playMusic(music: AudioSource) {
    const event = new CustomEvent("play-music", { detail: music });
    window.dispatchEvent(event);
    return true;
}

// Função auxiliar para pausar a reprodução da música atual
export function pauseMusic(musicId?: string) {
    const event = new CustomEvent("pause-music", { detail: { id: musicId } });
    window.dispatchEvent(event);
    return true;
}

// Função auxiliar para verificar se uma música específica está tocando
export function isCurrentlyPlaying(musicId: string): boolean {
    return globalCurrentMusic?.id === musicId;
}