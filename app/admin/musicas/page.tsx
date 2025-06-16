"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Music } from "@/lib/types";
import { 
  Search, 
  Music2, 
  Trash2, 
  Edit3, 
  Eye, 
  Download,
  Calendar,
  User,
  Filter,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Clock
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert-simple";

type FilterStatus = "all" | "approved" | "pending" | "rejected";

interface MusicWithSubmitter extends Music {
  submittedBy?: string;
}

export default function ManageMusics() {
  const [musics, setMusics] = useState<MusicWithSubmitter[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [alert, setAlert] = useState<{type: 'success' | 'error', message: string} | null>(null);
  
  const itemsPerPage = 10;

  const fetchMusics = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        search: searchTerm,
        status: filterStatus === "all" ? "" : filterStatus,
      });

      const response = await fetch(`/api/admin/music?${params}`);
      if (!response.ok) throw new Error("Erro ao carregar músicas");
      
      const data = await response.json();
      setMusics(data.musics);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Erro:", error);
      setAlert({ type: 'error', message: 'Erro ao carregar músicas' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMusics();
  }, [currentPage, searchTerm, filterStatus]);

  const handleStatusChange = async (musicId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/music/${musicId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error("Erro ao atualizar status");
      
      setAlert({ type: 'success', message: 'Status atualizado com sucesso!' });
      fetchMusics();
    } catch (error) {
      setAlert({ type: 'error', message: 'Erro ao atualizar status' });
    }
  };

  const handleDelete = async (musicId: string) => {
    if (!confirm("Tem certeza que deseja excluir esta música?")) return;
    
    try {
      const response = await fetch(`/api/admin/music/${musicId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error("Erro ao excluir música");
      
      setAlert({ type: 'success', message: 'Música excluída com sucesso!' });
      fetchMusics();
    } catch (error) {
      setAlert({ type: 'error', message: 'Erro ao excluir música' });
    }
  };
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved": return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "rejected": return <XCircle className="h-4 w-4 text-red-500" />;
      case "pending": return <Clock className="h-4 w-4 text-yellow-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      approved: "bg-green-100 text-green-800 border-green-200",
      rejected: "bg-red-100 text-red-800 border-red-200", 
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200"
    };
    
    return `px-2 py-1 rounded-full text-xs font-medium border ${styles[status as keyof typeof styles] || styles.pending}`;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center">
            <Music2 className="h-6 w-6 mr-2 text-primary" />
            Gerenciar Músicas
          </h1>
          <p className="text-muted-foreground">Gerencie todas as músicas do sistema</p>
        </div>
      </div>

      {/* Alert */}
      {alert && (
        <Alert variant={alert.type === 'error' ? 'destructive' : 'success'} className="mb-4">
          <AlertDescription>{alert.message}</AlertDescription>
        </Alert>
      )}

      {/* Filtros */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por título, artista ou álbum..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Status: {filterStatus === "all" ? "Todos" : filterStatus}
              </Button>
            </DropdownMenuTrigger>            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setFilterStatus("all")}>
                Todos
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("pending")}>
                Pendentes
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("approved")}>
                Aprovadas
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("rejected")}>
                Rejeitadas
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </Card>

      {/* Tabela de Músicas */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b">
              <tr className="text-left">
                <th className="p-4 font-medium">#</th>
                <th className="p-4 font-medium">Música</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Downloads</th>
                <th className="p-4 font-medium">Data</th>
                <th className="p-4 font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                      <span className="ml-2">Carregando...</span>
                    </div>
                  </td>
                </tr>
              ) : musics.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">
                    Nenhuma música encontrada
                  </td>
                </tr>
              ) : (
                musics.map((music, index) => (
                  <tr key={music.id} className="border-b hover:bg-muted/50">
                    <td className="p-4 text-sm text-muted-foreground">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={music.coverUrl || "/placeholder.svg"}
                          alt={music.title}
                          className="w-12 h-12 rounded-lg object-cover"
                        />                        <div>
                          <div className="font-medium">{music.title}</div>
                          <div className="text-sm text-muted-foreground">{music.artist}</div>
                          {music.submittedBy && (
                            <div className="text-xs text-muted-foreground">
                              Por: {music.submittedBy}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(music.status || 'pending')}
                        <span className={getStatusBadge(music.status || 'pending')}>
                          {music.status || 'pending'}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center text-sm">
                        <Download className="h-4 w-4 mr-1" />
                        {music.downloads}
                      </div>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {new Date(music.postedAt!).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="p-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => window.open(`/musica/${music.id}`, '_blank')}>
                            <Eye className="h-4 w-4 mr-2" />
                            Visualizar
                          </DropdownMenuItem>                          {music.status !== "approved" && (
                            <DropdownMenuItem onClick={() => handleStatusChange(music.id, "approved")}>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Aprovar
                            </DropdownMenuItem>
                          )}
                          {music.status !== "rejected" && (
                            <DropdownMenuItem onClick={() => handleStatusChange(music.id, "rejected")}>
                              <XCircle className="h-4 w-4 mr-2" />
                              Rejeitar
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem 
                            onClick={() => handleDelete(music.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Paginação */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t">
            <div className="text-sm text-muted-foreground">
              Página {currentPage} de {totalPages}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Próximo
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
