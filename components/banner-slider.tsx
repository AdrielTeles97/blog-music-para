"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Definição do tipo Banner
interface Banner {
    id: string;
    title: string;
    imageUrl: string;
    linkUrl?: string;
    position: string;
}

export default function BannerSlider() {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                setLoading(true);
                const response = await fetch("/api/banners");

                if (!response.ok) {
                    throw new Error(`Falha ao buscar banners: ${response.status}`);
                }

                const data = await response.json();
                setBanners(data);
            } catch (err: any) {
                console.error("Erro ao buscar banners:", err);
                setError(err.message || "Erro desconhecido");
            } finally {
                setLoading(false);
            }
        };

        fetchBanners();

        // Configurar rotação automática para os banners
        const intervalId = setInterval(() => {
            setCurrentBannerIndex((prevIndex) => (prevIndex === banners.length - 1 ? 0 : prevIndex + 1));
        }, 5000);

        return () => clearInterval(intervalId);
    }, [banners.length]);

    // Funções para navegação manual
    const goToPrevBanner = () => {
        setCurrentBannerIndex((prevIndex) => (prevIndex === 0 ? banners.length - 1 : prevIndex - 1));
    };

    const goToNextBanner = () => {
        setCurrentBannerIndex((prevIndex) => (prevIndex === banners.length - 1 ? 0 : prevIndex + 1));
    };

    if (loading) {
        return (
            <div className="w-full h-[280px] md:h-[320px] bg-gray-200 dark:bg-gray-800 animate-pulse rounded-xl max-w-5xl mx-auto">
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                    Carregando...
                </div>
            </div>
        );
    }

    if (error || banners.length === 0) {
        return null; // Não exibir nada se houver erro ou não houver banners
    }

    const currentBanner = banners[currentBannerIndex];

    return (
        <div className="relative w-full mb-8 rounded-xl overflow-hidden max-w-5xl mx-auto">
            {/* Banner */}
            {currentBanner.linkUrl ? (
                <Link href={currentBanner.linkUrl}>
                    <div className="relative w-full h-[280px] md:h-[320px]">
                        <Image
                            src={currentBanner.imageUrl}
                            alt={currentBanner.title}
                            fill
                            className="object-cover"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30"></div>
                        <div className="absolute bottom-0 left-0 p-4 text-white">
                            <h3 className="font-bold text-lg md:text-xl">{currentBanner.title}</h3>
                        </div>
                    </div>
                </Link>
            ) : (
                <div className="relative w-full h-[280px] md:h-[320px]">
                    <Image
                        src={currentBanner.imageUrl}
                        alt={currentBanner.title}
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30"></div>
                    <div className="absolute bottom-0 left-0 p-4 text-white">
                        <h3 className="font-bold text-lg md:text-xl">{currentBanner.title}</h3>
                    </div>
                </div>
            )}

            {/* Controles de navegação */}
            {banners.length > 1 && (
                <>
                    <button
                        onClick={goToPrevBanner}
                        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-colors"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                        onClick={goToNextBanner}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-colors"
                    >
                        <ChevronRight className="h-5 w-5" />
                    </button>
                    <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
                        {banners.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentBannerIndex(index)}
                                className={`w-2 h-2 rounded-full ${
                                    currentBannerIndex === index ? "bg-white" : "bg-white/40"
                                }`}
                            ></button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
