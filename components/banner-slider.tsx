"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

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
                    throw new Error("Falha ao buscar banners");
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
        return <div className="w-full h-40 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-xl"></div>;
    }

    if (error) {
        return null; // Não exibir nada se houver erro
    }

    if (banners.length === 0) {
        return null; // Não exibir nada se não houver banners
    }

    const currentBanner = banners[currentBannerIndex];

    return (
        <div className="relative w-full mb-8 rounded-xl overflow-hidden">
            {/* Banner */}
            {currentBanner.linkUrl ? (
                <Link href={currentBanner.linkUrl}>
                    <div className="relative aspect-[3/1] w-full">
                        <Image
                            src={currentBanner.imageUrl}
                            alt={currentBanner.title}
                            fill
                            className="object-cover"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30"></div>
                    </div>
                </Link>
            ) : (
                <div className="relative aspect-[3/1] w-full">
                    <Image
                        src={currentBanner.imageUrl}
                        alt={currentBanner.title}
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30"></div>
                </div>
            )}

            {/* Controles de navegação */}
            <button
                onClick={goToPrevBanner}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-2"
                aria-label="Banner anterior"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </button>
            <button
                onClick={goToNextBanner}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-2"
                aria-label="Próximo banner"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </button>

            {/* Indicadores */}
            {banners.length > 1 && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-2">
                    {banners.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentBannerIndex(index)}
                            className={`w-2.5 h-2.5 rounded-full ${
                                index === currentBannerIndex ? "bg-white" : "bg-white/50"
                            }`}
                            aria-label={`Ir para banner ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
