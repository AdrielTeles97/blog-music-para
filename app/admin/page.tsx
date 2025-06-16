"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Music } from "@/lib/types";
import { CheckCircle, XCircle, PlayCircle, Eye, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getPendingSubmissions, approveSubmission, rejectSubmission } from "@/lib/data";
import { useAdminProtection } from "@/lib/hooks/use-admin-protection";

export default function AdminPage() {
    const { isAdmin, status } = useAdminProtection();
    const [pendingSubmissions, setPendingSubmissions] = useState<Music[]>([]);
    const [playingId, setPlayingId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
        // Só carregamos os dados se o usuário for admin
        if (status === "authenticated" && isAdmin) {
            const fetchPendingSubmissions = async () => {
                try {
                    const response = await fetch("/api/admin/pending-submissions");
                    if (response.ok) {
                        const data = await response.json();
                        setPendingSubmissions(data);
                    } else {
                        console.error("Erro ao buscar submissões pendentes");
                    }
                } catch (error) {
                    console.error("Erro ao buscar submissões pendentes:", error);
                } finally {
                    setIsLoading(false);
                }
            };
            
            fetchPendingSubmissions();
        }
    }, [status, isAdmin]);

    // Função para reproduzir o áudio (implementação simplificada)
    const togglePlay = (id: string) => {
        if (playingId === id) {
            setPlayingId(null);
            // Parar áudio
        } else {
            setPlayingId(id);
            // Reproduzir áudio
        }
    };    // Função para aprovar uma música
    const handleApprove = async (id: string) => {
        try {
            const response = await fetch("/api/admin/review", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id,
                    action: "approve"
                }),
            });
            
            if (response.ok) {
                setPendingSubmissions(pendingSubmissions.filter(sub => sub.id !== id));
                alert(`Música ${id} aprovada com sucesso!`);
            } else {
                const error = await response.json();
                throw new Error(error.message || "Erro ao aprovar música");
            }
        } catch (error) {
            console.error("Erro ao aprovar música:", error);
            alert("Ocorreu um erro ao aprovar a música.");
        }
    };

    // Função para rejeitar uma música
    const handleReject = async (id: string) => {
        const reason = window.prompt("Informe o motivo da rejeição:");
        if (reason) {
            try {
                const response = await fetch("/api/admin/review", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        id,
                        action: "reject",
                        reason
                    }),
                });
                
                if (response.ok) {
                    setPendingSubmissions(pendingSubmissions.filter(sub => sub.id !== id));
                    alert(`Música ${id} rejeitada. Motivo: ${reason}`);
                } else {
                    const error = await response.json();
                    throw new Error(error.message || "Erro ao rejeitar música");
                }
            } catch (error) {
                console.error("Erro ao rejeitar música:", error);
                alert("Ocorreu um erro ao rejeitar a música.");
            }
        }
    };

    return (
        <div className="container py-6 md:py-10">
            <PageHeader title="Painel Administrativo" description="Gerencie as submissões de músicas" />

            <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">Submissões Pendentes ({pendingSubmissions.length})</h2>

                {isLoading ? (
                    <Card className="p-6 text-center">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                        <p className="mt-2 text-muted-foreground">Carregando submissões...</p>
                    </Card>
                ) : pendingSubmissions.length === 0 ? (
                    <Card className="p-6 text-center">
                        <p className="text-muted-foreground">Não há submissões pendentes no momento.</p>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {pendingSubmissions.map((submission) => (
                            <Card key={submission.id} className="p-4 flex flex-col md:flex-row gap-4">
                                <div className="relative w-full md:w-32 h-32 flex-shrink-0">
                                    <Image
                                        src={submission.coverUrl || "/placeholder.svg"}
                                        alt={submission.title}
                                        fill
                                        className="object-cover rounded-md"
                                    />
                                </div>

                                <div className="flex-grow">
                                    <h3 className="text-lg font-bold">{submission.title}</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Artista: {submission.artist} • Gênero: {submission.genre} • Album:{" "}
                                        {submission.album || "N/A"}
                                    </p>
                                    <p className="text-sm mt-2">
                                        <span className="font-medium">Enviado por:</span> {submission.submittedBy}
                                        <span className="ml-2 font-medium">Em:</span> {submission.submittedAt}
                                    </p>

                                    <div className="mt-3 line-clamp-2 text-sm text-muted-foreground">
                                        {submission.description}
                                    </div>

                                    <div className="flex flex-wrap items-center gap-2 mt-4">
                                        <Button size="sm" variant="outline" onClick={() => togglePlay(submission.id)}>
                                            <PlayCircle className="h-4 w-4 mr-1" />
                                            {playingId === submission.id ? "Parar" : "Reproduzir"}
                                        </Button>

                                        <Button size="sm" variant="outline">
                                            <Eye className="h-4 w-4 mr-1" />
                                            Ver Detalhes
                                        </Button>

                                        <div className="flex-grow md:flex-grow-0"></div>

                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 border-red-200"
                                            onClick={() => handleReject(submission.id)}
                                        >
                                            <XCircle className="h-4 w-4 mr-1" />
                                            Rejeitar
                                        </Button>

                                        <Button
                                            size="sm"
                                            className="bg-green-600 hover:bg-green-700"
                                            onClick={() => handleApprove(submission.id)}
                                        >
                                            <CheckCircle className="h-4 w-4 mr-1" />
                                            Aprovar
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}                <div className="mt-10">
                    <h2 className="text-2xl font-bold mb-4">Ações Administrativas</h2>
                    <Card className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Link href="/admin/banners" className="w-full">
                                <Button variant="outline" className="h-auto py-4 flex flex-col items-center w-full">
                                    <span className="text-lg font-medium mb-2">Gerenciar Banners</span>
                                    <span className="text-xs text-muted-foreground">
                                        Configurar banners na página inicial
                                    </span>
                                </Button>
                            </Link>
                            
                            <Link href="/admin/announcements" className="w-full">
                                <Button variant="outline" className="h-auto py-4 flex flex-col items-center w-full">
                                    <span className="text-lg font-medium mb-2">Gerenciar Anúncios</span>
                                    <span className="text-xs text-muted-foreground">
                                        Configurar avisos do sistema
                                    </span>
                                </Button>
                            </Link>
                            
                            <Link href="/admin/popups" className="w-full">
                                <Button variant="outline" className="h-auto py-4 flex flex-col items-center w-full">
                                    <span className="text-lg font-medium mb-2">Gerenciar Popups</span>
                                    <span className="text-xs text-muted-foreground">
                                        Configurar janelas de popup
                                    </span>
                                </Button>
                            </Link>
                                  <Link href="/admin/musicas" className="w-full">
                                <Button variant="outline" className="h-auto py-4 flex flex-col items-center w-full">
                                    <span className="text-lg font-medium mb-2">Gerenciar Músicas</span>
                                    <span className="text-xs text-muted-foreground">
                                        Editar ou remover músicas existentes
                                    </span>
                                </Button>
                            </Link>

                            <Link href="/admin/usuarios" className="w-full">
                                <Button variant="outline" className="h-auto py-4 flex flex-col items-center w-full">
                                    <span className="text-lg font-medium mb-2">Gerenciar Usuários</span>
                                    <span className="text-xs text-muted-foreground">Ver e gerenciar contas de usuário</span>
                                </Button>
                            </Link>

                            <Link href="/admin/estatisticas" className="w-full">
                                <Button variant="outline" className="h-auto py-4 flex flex-col items-center w-full">
                                    <span className="text-lg font-medium mb-2">Estatísticas</span>
                                    <span className="text-xs text-muted-foreground">Ver downloads e interações</span>
                                </Button>
                            </Link>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
