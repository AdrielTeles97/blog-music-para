"use client";

import { useEffect, useState } from "react";
import { AlertCircle, AlertTriangle, CheckCircle, Info } from "lucide-react";

// Definição do tipo Announcement
interface Announcement {
    id: string;
    title: string;
    content: string;
    type: "INFO" | "WARNING" | "SUCCESS" | "ERROR";
}

export default function Announcements() {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                setLoading(true);
                const response = await fetch("/api/announcements");

                if (!response.ok) {
                    throw new Error("Falha ao buscar anúncios");
                }

                const data = await response.json();
                setAnnouncements(data);
            } catch (err: any) {
                console.error("Erro ao buscar anúncios:", err);
                setError(err.message || "Erro desconhecido");
            } finally {
                setLoading(false);
            }
        };

        fetchAnnouncements();
    }, []);

    if (loading) {
        return <div className="w-full h-12 bg-gray-200 dark:bg-gray-800 animate-pulse rounded my-4"></div>;
    }

    if (error || announcements.length === 0) {
        return null; // Não exibir nada se houver erro ou não existirem anúncios
    }

    // Função para obter a cor de fundo baseada no tipo
    const getAnnouncementStyles = (type: string) => {
        switch (type) {
            case "INFO":
                return {
                    bgClass: "bg-blue-100 dark:bg-blue-900/30",
                    textClass: "text-blue-800 dark:text-blue-200",
                    icon: <Info className="h-5 w-5" />,
                };
            case "WARNING":
                return {
                    bgClass: "bg-amber-100 dark:bg-amber-900/30",
                    textClass: "text-amber-800 dark:text-amber-200",
                    icon: <AlertTriangle className="h-5 w-5" />,
                };
            case "SUCCESS":
                return {
                    bgClass: "bg-green-100 dark:bg-green-900/30",
                    textClass: "text-green-800 dark:text-green-200",
                    icon: <CheckCircle className="h-5 w-5" />,
                };
            case "ERROR":
                return {
                    bgClass: "bg-red-100 dark:bg-red-900/30",
                    textClass: "text-red-800 dark:text-red-200",
                    icon: <AlertCircle className="h-5 w-5" />,
                };
            default:
                return {
                    bgClass: "bg-gray-100 dark:bg-gray-800",
                    textClass: "text-gray-800 dark:text-gray-200",
                    icon: <Info className="h-5 w-5" />,
                };
        }
    };

    return (
        <div className="space-y-3 my-4">
            {announcements.map((announcement) => {
                const styles = getAnnouncementStyles(announcement.type);

                return (
                    <div
                        key={announcement.id}
                        className={`rounded-lg px-4 py-3 ${styles.bgClass} ${styles.textClass} flex items-start`}
                    >
                        <div className="mr-3 mt-0.5">{styles.icon}</div>
                        <div>
                            <h3 className="font-medium">{announcement.title}</h3>
                            <div className="text-sm mt-1">{announcement.content}</div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
