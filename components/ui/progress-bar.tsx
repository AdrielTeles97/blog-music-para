"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
    currentTime: number;
    duration: number;
    onSeek?: (time: number) => void;
    showWaveform?: boolean;
    className?: string;
}

export function ProgressBar({ currentTime, duration, onSeek, showWaveform = false, className }: ProgressBarProps) {
    // Gerar pontos para waveform simulado
    const [waveformPoints, setWaveformPoints] = useState<number[]>([]);
    const progressBarRef = useRef<HTMLDivElement>(null);

    // Gerar pontos aleatórios para o waveform na montagem do componente
    useEffect(() => {
        const points = Array.from({ length: 40 }).map(() => 20 + Math.floor(Math.random() * 80));
        setWaveformPoints(points);
    }, []);

    // Calcular o percentual de progresso
    const progressPercentage = duration ? (currentTime / duration) * 100 : 0;

    // Handler para busca ao clicar na barra de progresso
    const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!duration || !onSeek) return;

        const rect = e.currentTarget.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const width = rect.width;
        const percentage = offsetX / width;
        const newTime = percentage * duration;

        onSeek(newTime);
    };

    return (
        <div
            className={cn(
                "relative h-2 bg-muted/30 rounded-full overflow-hidden cursor-pointer group hover:bg-muted/60 transition-colors duration-200",
                className
            )}
            onClick={handleSeek}
            ref={progressBarRef}
        >
            {/* Waveform simulado como background */}
            {showWaveform && (
                <div className="absolute inset-0 flex items-center justify-around opacity-30">
                    {waveformPoints.map((height, i) => (
                        <div key={i} className="w-0.5 bg-muted-foreground/50" style={{ height: `${height}%` }}></div>
                    ))}
                </div>
            )}

            {/* Barra de progresso com gradiente */}
            <div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-primary/80"
                style={{
                    width: `${progressPercentage}%`,
                    transition: "width 0.1s linear",
                }}
            />

            {/* Indicador de posição (bolinha) */}
            <div
                className="absolute top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-primary border border-background shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                style={{
                    left: `calc(${progressPercentage}% - 6px)`,
                    display: duration ? "block" : "none",
                }}
            />
        </div>
    );
}

// Versão expandida com visualização de waveform mais detalhada
export function WaveformProgressBar({ currentTime, duration, onSeek, className }: ProgressBarProps) {
    // Gerar pontos para waveform simulado
    const [waveformPoints, setWaveformPoints] = useState<number[]>([]);

    // Gerar pontos aleatórios para o waveform na montagem do componente
    useEffect(() => {
        const points = Array.from({ length: 40 }).map(() => 20 + Math.floor(Math.random() * 80));
        setWaveformPoints(points);
    }, []);

    // Calcular o percentual de progresso
    const progressPercentage = duration ? (currentTime / duration) * 100 : 0;

    // Handler para busca ao clicar na barra de progresso
    const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!duration || !onSeek) return;

        const rect = e.currentTarget.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const width = rect.width;
        const percentage = offsetX / width;
        const newTime = percentage * duration;

        onSeek(newTime);
    };

    return (
        <div className={cn("relative h-12 w-full cursor-pointer", className)} onClick={handleSeek}>
            {/* Wave simulado */}
            <div className="absolute bottom-0 left-0 right-0 h-8 flex items-end justify-around">
                {waveformPoints.map((height, i) => {
                    const isActive = i / waveformPoints.length < currentTime / duration;
                    return (
                        <div
                            key={i}
                            className={`w-1 rounded-t-sm transition-colors duration-300 ${
                                isActive ? "bg-primary" : "bg-muted-foreground/30"
                            }`}
                            style={{ height: `${height}%` }}
                        ></div>
                    );
                })}
            </div>

            {/* Overlay gradiente */}
            <div
                className="absolute bottom-0 left-0 h-8 bg-gradient-to-r from-primary to-primary/50"
                style={{
                    width: `${progressPercentage}%`,
                    opacity: 0.3,
                }}
            ></div>

            {/* Linha de progresso */}
            <div
                className="absolute bottom-0 left-0 w-1 h-8 bg-primary"
                style={{
                    left: `${progressPercentage}%`,
                    transform: "translateX(-50%)",
                }}
            ></div>
        </div>
    );
}
