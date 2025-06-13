"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2, Plus, Trash, Pencil, Calendar, Link as LinkIcon } from "lucide-react";
import Image from "next/image";

// Tipo Banner
interface Banner {
    id: string;
    title: string;
    imageUrl: string;
    linkUrl?: string;
    position: string;
    order: number;
    startDate: string;
    endDate?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export default function BannersPage() {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        imageUrl: "",
        linkUrl: "",
        position: "top",
        startDate: new Date().toISOString().split("T")[0],
        endDate: "",
        isActive: true,
    });
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Buscar banners
    useEffect(() => {
        const fetchBanners = async () => {
            try {
                setLoading(true);
                const response = await fetch("/api/admin/banners");

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
    }, []);

    // Manipuladores de formulário
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
            const url = editingId ? `/api/admin/banners/${editingId}` : "/api/admin/banners";

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
                throw new Error(errorData.message || "Erro ao salvar banner");
            }

            // Atualizar lista de banners
            const updatedResponse = await fetch("/api/admin/banners");
            const updatedData = await updatedResponse.json();
            setBanners(updatedData);

            // Resetar formulário
            setShowForm(false);
            setEditingId(null);
            setFormData({
                title: "",
                imageUrl: "",
                linkUrl: "",
                position: "top",
                startDate: new Date().toISOString().split("T")[0],
                endDate: "",
                isActive: true,
            });
        } catch (err: any) {
            console.error("Erro ao salvar banner:", err);
            setError(err.message || "Erro desconhecido");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = (banner: Banner) => {
        setFormData({
            title: banner.title,
            imageUrl: banner.imageUrl,
            linkUrl: banner.linkUrl || "",
            position: banner.position,
            startDate: new Date(banner.startDate).toISOString().split("T")[0],
            endDate: banner.endDate ? new Date(banner.endDate).toISOString().split("T")[0] : "",
            isActive: banner.isActive,
        });
        setEditingId(banner.id);
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Tem certeza que deseja excluir este banner?")) {
            return;
        }

        try {
            const response = await fetch(`/api/admin/banners/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Erro ao excluir banner");
            }

            // Atualizar lista de banners
            setBanners(banners.filter((banner) => banner.id !== id));
        } catch (err: any) {
            console.error("Erro ao excluir banner:", err);
            setError(err.message || "Erro desconhecido");
        }
    };

    return (
        <div className="container py-6">
            <PageHeader title="Gerenciar Banners" description="Adicione e edite banners promocionais para o site" />

            {error && <div className="my-4 p-4 bg-red-100 text-red-800 rounded-md">{error}</div>}

            <div className="mb-6 flex justify-between items-center">
                <h2 className="text-xl font-bold">Banners</h2>
                <Button
                    onClick={() => {
                        setEditingId(null);
                        setShowForm(!showForm);
                        if (!showForm) {
                            setFormData({
                                title: "",
                                imageUrl: "",
                                linkUrl: "",
                                position: "top",
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
                            Adicionar Banner
                        </>
                    )}
                </Button>
            </div>

            {/* Formulário de banner */}
            {showForm && (
                <Card className="mb-8 p-6">
                    <h3 className="text-lg font-medium mb-4">{editingId ? "Editar Banner" : "Novo Banner"}</h3>

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
                                <label className="block text-sm font-medium mb-1">URL da Imagem</label>
                                <Input
                                    type="url"
                                    name="imageUrl"
                                    value={formData.imageUrl}
                                    onChange={handleInputChange}
                                    placeholder="https://exemplo.com/imagem.jpg"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Link (opcional)</label>
                                <Input
                                    type="url"
                                    name="linkUrl"
                                    value={formData.linkUrl}
                                    onChange={handleInputChange}
                                    placeholder="https://exemplo.com/pagina"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Posição</label>
                                <select
                                    name="position"
                                    value={formData.position}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md"
                                    required
                                >
                                    <option value="top">Topo</option>
                                    <option value="middle">Meio</option>
                                    <option value="bottom">Rodapé</option>
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

                        {formData.imageUrl && (
                            <div className="mt-4">
                                <p className="text-sm font-medium mb-2">Pré-visualização:</p>
                                <div className="relative h-40 w-full rounded-lg overflow-hidden">
                                    <Image
                                        src={formData.imageUrl}
                                        alt="Pré-visualização"
                                        fill
                                        className="object-cover"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = "/placeholder.svg";
                                        }}
                                    />
                                </div>
                            </div>
                        )}

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
                                    <>Salvar Banner</>
                                )}
                            </Button>
                        </div>
                    </form>
                </Card>
            )}

            {/* Lista de banners */}
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin" />
                </div>
            ) : banners.length === 0 ? (
                <Card className="p-12 text-center text-gray-500">
                    <p>Nenhum banner encontrado.</p>
                    <p className="text-sm mt-2">Clique em "Adicionar Banner" para criar o primeiro.</p>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {banners.map((banner) => (
                        <Card key={banner.id} className="overflow-hidden">
                            <div className="relative h-40 w-full">
                                <Image
                                    src={banner.imageUrl}
                                    alt={banner.title}
                                    fill
                                    className="object-cover"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = "/placeholder.svg";
                                    }}
                                />
                                {!banner.isActive && (
                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                        <span className="bg-red-600 px-2 py-1 rounded text-white text-sm">Inativo</span>
                                    </div>
                                )}
                            </div>

                            <div className="p-4">
                                <h3 className="font-medium text-lg">{banner.title}</h3>

                                <div className="flex items-center text-sm text-gray-500 mt-2">
                                    <Calendar className="h-4 w-4 mr-1" />
                                    {new Date(banner.startDate).toLocaleDateString()}
                                    {banner.endDate && ` - ${new Date(banner.endDate).toLocaleDateString()}`}
                                </div>

                                {banner.linkUrl && (
                                    <div className="flex items-center text-sm text-gray-500 mt-1">
                                        <LinkIcon className="h-4 w-4 mr-1" />
                                        <a
                                            href={banner.linkUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="truncate hover:underline"
                                        >
                                            {banner.linkUrl}
                                        </a>
                                    </div>
                                )}

                                <div className="flex justify-between items-center mt-4">
                                    <div>
                                        <span className="text-xs px-2 py-1 rounded-full bg-gray-200 dark:bg-gray-700">
                                            {banner.position === "top"
                                                ? "Topo"
                                                : banner.position === "middle"
                                                ? "Meio"
                                                : "Rodapé"}
                                        </span>
                                    </div>

                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm" onClick={() => handleEdit(banner)}>
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button variant="destructive" size="sm" onClick={() => handleDelete(banner.id)}>
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
