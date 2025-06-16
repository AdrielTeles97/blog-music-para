"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Search,
    Users,
    Trash2,
    Edit3,
    Shield,
    User,
    ChevronLeft,
    ChevronRight,
    MoreHorizontal,
    UserPlus,
    Crown,
    Mail,
    Calendar,
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Alert, AlertDescription } from "@/components/ui/alert-simple";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface User {
    id: string;
    name: string | null;
    email: string;
    role: "USER" | "ADMIN" | "SUPER_ADMIN";
    createdAt: string;
    _count?: {
        musics?: number;
    };
}

export default function ManageUsers() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [newUser, setNewUser] = useState({
        name: "",
        email: "",
        role: "USER" as "USER" | "ADMIN" | "SUPER_ADMIN",
        password: "",
    });

    const itemsPerPage = 10;

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: currentPage.toString(),
                limit: itemsPerPage.toString(),
                search: searchTerm,
            });

            const response = await fetch(`/api/admin/users?${params}`);
            if (!response.ok) throw new Error("Erro ao carregar usuários");

            const data = await response.json();
            setUsers(data.users);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error("Erro:", error);
            setAlert({ type: "error", message: "Erro ao carregar usuários" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [currentPage, searchTerm]);

    const handleRoleChange = async (userId: string, newRole: string) => {
        try {
            const response = await fetch(`/api/admin/users/${userId}/role`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ role: newRole }),
            });

            if (!response.ok) throw new Error("Erro ao atualizar função");

            setAlert({ type: "success", message: "Função atualizada com sucesso!" });
            fetchUsers();
        } catch (error) {
            setAlert({ type: "error", message: "Erro ao atualizar função" });
        }
    };

    const handleDelete = async (userId: string) => {
        if (!confirm("Tem certeza que deseja excluir este usuário?")) return;

        try {
            const response = await fetch(`/api/admin/users/${userId}`, {
                method: "DELETE",
            });

            if (!response.ok) throw new Error("Erro ao excluir usuário");

            setAlert({ type: "success", message: "Usuário excluído com sucesso!" });
            fetchUsers();
        } catch (error) {
            setAlert({ type: "error", message: "Erro ao excluir usuário" });
        }
    };

    const handleCreateUser = async () => {
        try {
            const response = await fetch("/api/admin/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newUser),
            });

            if (!response.ok) throw new Error("Erro ao criar usuário");

            setAlert({ type: "success", message: "Usuário criado com sucesso!" });
            setShowCreateDialog(false);
            setNewUser({ name: "", email: "", role: "USER", password: "" });
            fetchUsers();
        } catch (error) {
            setAlert({ type: "error", message: "Erro ao criar usuário" });
        }
    };

    const getRoleIcon = (role: string) => {
        switch (role) {
            case "SUPER_ADMIN":
                return <Crown className="h-4 w-4 text-yellow-500" />;
            case "ADMIN":
                return <Shield className="h-4 w-4 text-blue-500" />;
            default:
                return <User className="h-4 w-4 text-gray-500" />;
        }
    };

    const getRoleBadge = (role: string) => {
        const styles = {
            SUPER_ADMIN: "bg-yellow-100 text-yellow-800 border-yellow-200",
            ADMIN: "bg-blue-100 text-blue-800 border-blue-200",
            USER: "bg-gray-100 text-gray-800 border-gray-200",
        };

        return `px-2 py-1 rounded-full text-xs font-medium border ${
            styles[role as keyof typeof styles] || styles.USER
        }`;
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold flex items-center">
                        <Users className="h-6 w-6 mr-2 text-primary" />
                        Gerenciar Usuários
                    </h1>
                    <p className="text-muted-foreground">Gerencie usuários e permissões do sistema</p>
                </div>

                <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                    <DialogTrigger asChild>
                        <Button className="gap-2">
                            <UserPlus className="h-4 w-4" />
                            Novo Usuário
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Criar Novo Usuário</DialogTitle>
                            <DialogDescription>Adicione um novo usuário ao sistema</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="name">Nome</Label>
                                <Input
                                    id="name"
                                    value={newUser.name}
                                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                                    placeholder="Nome do usuário"
                                />
                            </div>
                            <div>
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={newUser.email}
                                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                    placeholder="email@exemplo.com"
                                />
                            </div>
                            <div>
                                <Label htmlFor="password">Senha</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={newUser.password}
                                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                    placeholder="Senha"
                                />
                            </div>
                            <div>
                                <Label htmlFor="role">Função</Label>
                                <Select
                                    value={newUser.role}
                                    onValueChange={(value) => setNewUser({ ...newUser, role: value as any })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="USER">Usuário</SelectItem>
                                        <SelectItem value="ADMIN">Administrador</SelectItem>
                                        <SelectItem value="SUPER_ADMIN">Super Administrador</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                                Cancelar
                            </Button>
                            <Button onClick={handleCreateUser}>Criar Usuário</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Alert */}
            {alert && (
                <Alert variant={alert.type === "error" ? "destructive" : "success"} className="mb-4">
                    <AlertDescription>{alert.message}</AlertDescription>
                </Alert>
            )}

            {/* Filtros */}
            <Card className="p-4">
                <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Buscar por nome ou email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </Card>

            {/* Tabela de Usuários */}
            <Card>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="border-b">
                            <tr className="text-left">
                                <th className="p-4 font-medium">#</th>
                                <th className="p-4 font-medium">Usuário</th>
                                <th className="p-4 font-medium">Função</th>
                                <th className="p-4 font-medium">Data de Criação</th>
                                <th className="p-4 font-medium">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center">
                                        <div className="flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                                            <span className="ml-2">Carregando...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-muted-foreground">
                                        Nenhum usuário encontrado
                                    </td>
                                </tr>
                            ) : (
                                users.map((user, index) => (
                                    <tr key={user.id} className="border-b hover:bg-muted/50">
                                        <td className="p-4 text-sm text-muted-foreground">
                                            {(currentPage - 1) * itemsPerPage + index + 1}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                    <User className="h-5 w-5 text-primary" />
                                                </div>
                                                <div>
                                                    <div className="font-medium">{user.name || "Sem nome"}</div>
                                                    <div className="text-sm text-muted-foreground flex items-center">
                                                        <Mail className="h-3 w-3 mr-1" />
                                                        {user.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center space-x-2">
                                                {getRoleIcon(user.role)}
                                                <span className={getRoleBadge(user.role)}>
                                                    {user.role === "SUPER_ADMIN"
                                                        ? "Super Admin"
                                                        : user.role === "ADMIN"
                                                        ? "Admin"
                                                        : "Usuário"}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-sm text-muted-foreground">
                                            <div className="flex items-center">
                                                <Calendar className="h-4 w-4 mr-1" />
                                                {new Date(user.createdAt).toLocaleDateString("pt-BR")}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    {user.role !== "SUPER_ADMIN" && (
                                                        <DropdownMenuItem
                                                            onClick={() => handleRoleChange(user.id, "ADMIN")}
                                                        >
                                                            <Shield className="h-4 w-4 mr-2" />
                                                            Tornar Admin
                                                        </DropdownMenuItem>
                                                    )}
                                                    {user.role !== "USER" && (
                                                        <DropdownMenuItem
                                                            onClick={() => handleRoleChange(user.id, "USER")}
                                                        >
                                                            <User className="h-4 w-4 mr-2" />
                                                            Tornar Usuário
                                                        </DropdownMenuItem>
                                                    )}
                                                    <DropdownMenuItem
                                                        onClick={() => handleDelete(user.id)}
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
