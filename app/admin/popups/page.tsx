"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2, Plus, Trash, Pencil, Calendar, Link as LinkIcon } from "lucide-react";
import Image from "next/image";

// Tipo Popup
interface Popup {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  buttonText?: string;
  buttonUrl?: string;
  showOnce: boolean;
  isActive: boolean;
  startDate: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
}

export default function PopupsPage() {
  const [popups, setPopups] = useState<Popup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    imageUrl: "",
    buttonText: "",
    buttonUrl: "",
    showOnce: false,
    startDate: new Date().toISOString().split('T')[0],
    endDate: "",
    isActive: true
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Buscar popups
  useEffect(() => {
    const fetchPopups = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/admin/popups");
        
        if (!response.ok) {
          throw new Error("Falha ao buscar popups");
        }
        
        const data = await response.json();
        setPopups(data);
      } catch (err: any) {
        console.error("Erro ao buscar popups:", err);
        setError(err.message || "Erro desconhecido");
      } finally {
        setLoading(false);
      }
    };

    fetchPopups();
  }, []);

  // Manipuladores de formulário
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const url = editingId 
        ? `/api/admin/popups/${editingId}` 
        : "/api/admin/popups";
      
      const method = editingId ? "PATCH" : "POST";
      
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao salvar popup");
      }
      
      // Atualizar lista de popups
      const updatedResponse = await fetch("/api/admin/popups");
      const updatedData = await updatedResponse.json();
      setPopups(updatedData);
      
      // Resetar formulário
      setShowForm(false);
      setEditingId(null);
      setFormData({
        title: "",
        content: "",
        imageUrl: "",
        buttonText: "",
        buttonUrl: "",
        showOnce: false,
        startDate: new Date().toISOString().split('T')[0],
        endDate: "",
        isActive: true
      });
    } catch (err: any) {
      console.error("Erro ao salvar popup:", err);
      setError(err.message || "Erro desconhecido");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (popup: Popup) => {
    setFormData({
      title: popup.title,
      content: popup.content,
      imageUrl: popup.imageUrl || "",
      buttonText: popup.buttonText || "",
      buttonUrl: popup.buttonUrl || "",
      showOnce: popup.showOnce,
      startDate: new Date(popup.startDate).toISOString().split('T')[0],
      endDate: popup.endDate ? new Date(popup.endDate).toISOString().split('T')[0] : "",
      isActive: popup.isActive
    });
    setEditingId(popup.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este popup?")) {
      return;
    }
    
    try {
      const response = await fetch(`/api/admin/popups/${id}`, {
        method: "DELETE"
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao excluir popup");
      }
      
      // Atualizar lista de popups
      setPopups(popups.filter(popup => popup.id !== id));
    } catch (err: any) {
      console.error("Erro ao excluir popup:", err);
      setError(err.message || "Erro desconhecido");
    }
  };

  return (
    <div className="container py-6">
      <PageHeader
        title="Gerenciar Popups"
        description="Adicione e edite popups promocionais para o site"
      />
      
      {error && (
        <div className="my-4 p-4 bg-red-100 text-red-800 rounded-md">
          {error}
        </div>
      )}
      
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-bold">Popups</h2>
        <Button 
          onClick={() => {
            setEditingId(null);
            setShowForm(!showForm);
            if (!showForm) {
              setFormData({
                title: "",
                content: "",
                imageUrl: "",
                buttonText: "",
                buttonUrl: "",
                showOnce: false,
                startDate: new Date().toISOString().split('T')[0],
                endDate: "",
                isActive: true
              });
            }
          }}
        >
          {showForm ? "Cancelar" : (
            <>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Popup
            </>
          )}
        </Button>
      </div>
      
      {/* Formulário de popup */}
      {showForm && (
        <Card className="mb-8 p-6">
          <h3 className="text-lg font-medium mb-4">
            {editingId ? "Editar Popup" : "Novo Popup"}
          </h3>
          
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
                <label className="block text-sm font-medium mb-1">URL da Imagem (opcional)</label>
                <Input
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  placeholder="https://exemplo.com/imagem.jpg"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Texto do Botão (opcional)</label>
                <Input
                  type="text"
                  name="buttonText"
                  value={formData.buttonText}
                  onChange={handleInputChange}
                  placeholder="Saiba Mais"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">URL do Botão (opcional)</label>
                <Input
                  type="url"
                  name="buttonUrl"
                  value={formData.buttonUrl}
                  onChange={handleInputChange}
                  placeholder="https://exemplo.com/pagina"
                />
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
                  id="showOnce"
                  name="showOnce"
                  checked={formData.showOnce}
                  onChange={handleInputChange}
                  className="h-4 w-4 mr-2"
                />
                <label htmlFor="showOnce">Mostrar apenas uma vez por usuário</label>
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
                <p className="text-sm font-medium mb-2">Pré-visualização da imagem:</p>
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
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowForm(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>Salvar Popup</>
                )}
              </Button>
            </div>
          </form>
        </Card>
      )}
      
      {/* Lista de popups */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : popups.length === 0 ? (
        <Card className="p-12 text-center text-gray-500">
          <p>Nenhum popup encontrado.</p>
          <p className="text-sm mt-2">Clique em "Adicionar Popup" para criar o primeiro.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {popups.map(popup => (
            <Card key={popup.id} className="overflow-hidden">
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-lg">{popup.title}</h3>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{popup.content}</p>
                    
                    <div className="flex items-center text-xs text-gray-500 mt-3">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(popup.startDate).toLocaleDateString()}
                      {popup.endDate && ` - ${new Date(popup.endDate).toLocaleDateString()}`}
                      
                      {!popup.isActive && (
                        <span className="ml-2 bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300 px-1.5 py-0.5 rounded-full text-xs">
                          Inativo
                        </span>
                      )}
                      
                      {popup.showOnce && (
                        <span className="ml-2 bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 px-1.5 py-0.5 rounded-full text-xs">
                          Mostrar uma vez
                        </span>
                      )}
                    </div>
                    
                    {popup.buttonText && popup.buttonUrl && (
                      <div className="flex items-center text-sm mt-2">
                        <LinkIcon className="h-4 w-4 mr-1" />
                        <span>
                          Botão: {popup.buttonText} - 
                          <a 
                            href={popup.buttonUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="ml-1 text-blue-600 hover:underline"
                          >
                            {popup.buttonUrl}
                          </a>
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleEdit(popup)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleDelete(popup.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              
              {popup.imageUrl && (
                <div className="px-4 pb-4">
                  <div className="relative h-40 w-full rounded-lg overflow-hidden">
                    <Image
                      src={popup.imageUrl}
                      alt={popup.title}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/placeholder.svg";
                      }}
                    />
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
