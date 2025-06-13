"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2, Plus, Trash, Pencil, Calendar, AlertCircle, AlertTriangle, CheckCircle, Info } from "lucide-react";

// Tipo Announcement
interface Announcement {
    id: string;
    title: string;
    content: string;
    type: "INFO" | "WARNING" | "SUCCESS" | "ERROR";
    isActive: boolean;
    startDate: string;
    endDate?: string;
    createdAt: string;
    updatedAt: string;
}

export default function AnnouncementsPage() {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        content: "",
        type: "INFO",
        startDate: new Date().toISOString().split("T")[0],
        endDate: "",
        isActive: true,
    });
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Buscar anúncios
    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                setLoading(true);
                const response = await fetch("/api/admin/announcements");

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

    // Manipuladores de formulário
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target as HTMLInputElement;

        setFormData({
            ...formData,
            [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const url = editingId ? `/api/admin/announcements/${editingId}` : "/api/admin/announcements";

            const method = editingId ? "PATCH" : "POST";

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Erro ao salvar anúncio");
            }

            // Atualizar lista de anúncios
            const updatedResponse = await fetch("/api/admin/announcements");
            const updatedData = await updatedResponse.json();
            setAnnouncements(updatedData);

            // Resetar formulário
            setShowForm(false);
            setEditingId(null);
            setFormData({
                title: "",
                content: "",
                type: "INFO",
                startDate: new Date().toISOString().split("T")[0],
                endDate: "",
                isActive: true,
            });
        } catch (err: any) {
            console.error("Erro ao salvar anúncio:", err);
            setError(err.message || "Erro desconhecido");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = (announcement: Announcement) => {
        setFormData({
            title: announcement.title,
            content: announcement.content,
            type: announcement.type,
            startDate: new Date(announcement.startDate).toISOString().split("T")[0],
            endDate: announcement.endDate ? new Date(announcement.endDate).toISOString().split("T")[0] : "",
            isActive: announcement.isActive,
        });
        setEditingId(announcement.id);
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Tem certeza que deseja excluir este anúncio?")) {
            return;
        }

        try {
            const response = await fetch(`/api/admin/announcements/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Erro ao excluir anúncio");
            }

            // Atualizar lista de anúncios
            setAnnouncements(announcements.filter((announcement) => announcement.id !== id));
        } catch (err: any) {
            console.error("Erro ao excluir anúncio:", err);
            setError(err.message || "Erro desconhecido");
        }
    };

    // Função para obter o ícone baseado no tipo
    const getAnnouncementIcon = (type: string) => {
        switch (type) {
            case "INFO":
                return <Info className="h-5 w-5 text-blue-500" />;
            case "WARNING":
                return <AlertTriangle className="h-5 w-5 text-amber-500" />;
            case "SUCCESS":
                return <CheckCircle className="h-5 w-5 text-green-500" />;
            case "ERROR":
                return <AlertCircle className="h-5 w-5 text-red-500" />;
            default:
                return <Info className="h-5 w-5 text-gray-500" />;
        }
    };

    // Função para obter a cor de fundo baseada no tipo
    const getAnnouncementStyles = (type: string) => {
        switch (type) {
            case "INFO":
                return "bg-blue-100 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800";
            case "WARNING":
                return "bg-amber-100 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800";
            case "SUCCESS":
                return "bg-green-100 dark:bg-green-900/30 border-green-200 dark:border-green-800";
            case "ERROR":
                return "bg-red-100 dark:bg-red-900/30 border-red-200 dark:border-red-800";
            default:
                return "bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700";
        }
    };

    return (
        <div className="container py-6">
            <PageHeader title="Gerenciar Anúncios" description="Adicione e edite anúncios informativos para o site" />

            {error && <div className="my-4 p-4 bg-red-100 text-red-800 rounded-md">{error}</div>}

            <div className="mb-6 flex justify-between items-center">
                <h2 className="text-xl font-bold">Anúncios</h2>
                <Button
                    onClick={() => {
                        setEditingId(null);
                        setShowForm(!showForm);
                        if (!showForm) {
                            setFormData({
                                title: "",
                                content: "",
                                type: "INFO",
                                startDate: new Date().toISOString().split("T")[0],
                                endDate: "",
                                isActive: true,
                            });
                        }
                    }}
                >
                    {showForm ? (
                        "Cancelar"
                    ) : (
                        <>
                            <Plus className="mr-2 h-4 w-4" />
                            Adicionar Anúncio
                        </>
                    )}
                </Button>
            </div>

            {/* Formulário de anúncio */}
            {showForm && (
                <Card className="mb-8 p-6">
                    <h3 className="text-lg font-medium mb-4">{editingId ? "Editar Anúncio" : "Novo Anúncio"}</h3>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Título</label>
                                <Input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Tipo</label>
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md"
                                    required
                                >
                                    <option value="INFO">Informativo</option>
                                    <option value="WARNING">Aviso</option>
                                    <option value="SUCCESS">Sucesso</option>
                                    <option value="ERROR">Erro</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Data de Início</label>
                                <Input
                                    type="date"
                                    name="startDate"
                                    value={formData.startDate}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Data de Fim (opcional)</label>
                                <Input
                                    type="date"
                                    name="endDate"
                                    value={formData.endDate}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium mb-1">Conteúdo</label>
                                <textarea
                                    name="content"
                                    value={formData.content}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md min-h-[120px]"
                                    required
                                ></textarea>
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="isActive"
                                    name="isActive"
                                    checked={formData.isActive}
                                    onChange={handleInputChange}
                                    className="h-4 w-4 mr-2"
                                />
                                <label htmlFor="isActive">Ativo</label>
                            </div>
                        </div>

                        <div className="flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Salvando...
                                    </>
                                ) : (
                                    <>Salvar Anúncio</>
                                )}
                            </Button>
                        </div>
                    </form>
                </Card>
            )}

            {/* Lista de anúncios */}
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin" />
                </div>
            ) : announcements.length === 0 ? (
                <Card className="p-12 text-center text-gray-500">
                    <p>Nenhum anúncio encontrado.</p>
                    <p className="text-sm mt-2">Clique em "Adicionar Anúncio" para criar o primeiro.</p>
                </Card>
            ) : (
                <div className="space-y-4">
                    {announcements.map((announcement) => (
                        <Card key={announcement.id} className={`border ${getAnnouncementStyles(announcement.type)}`}>
                            <div className="p-4">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-start">
                                        <div className="mr-3">{getAnnouncementIcon(announcement.type)}</div>
                                        <div>
                                            <h3 className="font-medium">{announcement.title}</h3>
                                            <p className="mt-1 text-sm">{announcement.content}</p>

                                            <div className="flex items-center text-xs text-gray-500 mt-2">
                                                <Calendar className="h-3 w-3 mr-1" />
                                                {new Date(announcement.startDate).toLocaleDateString()}
                                                {announcement.endDate &&
                                                    ` - ${new Date(announcement.endDate).toLocaleDateString()}`}

                                                {!announcement.isActive && (
                                                    <span className="ml-2 bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300 px-1.5 py-0.5 rounded-full text-xs">
                                                        Inativo
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm" onClick={() => handleEdit(announcement)}>
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => handleDelete(announcement.id)}
                                        >
                                            <Trash className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
