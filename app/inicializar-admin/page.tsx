"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

const registerSchema = z
    .object({
        name: z.string().min(1, "Nome é obrigatório"),
        email: z.string().email("Email inválido"),
        password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
        confirmPassword: z.string().min(6, "Confirme sua senha"),
        secretKey: z.string().min(1, "Chave secreta é obrigatória"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "As senhas não conferem",
        path: ["confirmPassword"],
    });

type RegisterFormData = z.infer<typeof registerSchema>;

export default function InitializeAdminPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterFormData) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch("/api/admin/create-first-admin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: data.name,
                    email: data.email,
                    password: data.password,
                    secretKey: data.secretKey,
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                setError(result.message || "Erro ao criar administrador");
            } else {
                setSuccess(true);
            }
        } catch (error) {
            setError("Ocorreu um erro ao criar o administrador");
            console.error("Erro ao criar administrador:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container py-6 md:py-10">
            <PageHeader
                title="Configuração Inicial"
                description="Crie a primeira conta de administrador para o sistema"
            />

            <Card className="max-w-md mx-auto mt-8 p-6">
                {success ? (
                    <div className="text-center py-4">
                        <h3 className="text-xl font-bold mb-2 text-green-600">Administrador criado com sucesso!</h3>
                        <p className="mb-4">
                            Sua conta de administrador foi criada. Agora você pode fazer login para acessar o painel de
                            administração.
                        </p>
                        <Button onClick={() => (window.location.href = "/login")}>Ir para a página de login</Button>
                    </div>
                ) : (
                    <>
                        {error && <div className="bg-red-100 text-red-800 p-3 rounded mb-4">{error}</div>}

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium" htmlFor="name">
                                    Nome Completo
                                </label>
                                <Input id="name" placeholder="Seu nome" {...register("name")} />
                                {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium" htmlFor="email">
                                    Email
                                </label>
                                <Input id="email" type="email" placeholder="admin@exemplo.com" {...register("email")} />
                                {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium" htmlFor="password">
                                    Senha
                                </label>
                                <Input id="password" type="password" placeholder="••••••••" {...register("password")} />
                                {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium" htmlFor="confirmPassword">
                                    Confirme a Senha
                                </label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    placeholder="••••••••"
                                    {...register("confirmPassword")}
                                />
                                {errors.confirmPassword && (
                                    <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium" htmlFor="secretKey">
                                    Chave Secreta de Inicialização
                                </label>
                                <Input
                                    id="secretKey"
                                    type="password"
                                    placeholder="Chave fornecida durante a instalação"
                                    {...register("secretKey")}
                                />
                                {errors.secretKey && <p className="text-sm text-red-500">{errors.secretKey.message}</p>}
                                <p className="text-xs text-muted-foreground mt-1">
                                    Esta chave é necessária apenas para criar o administrador inicial.
                                </p>
                            </div>

                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Criando...
                                    </>
                                ) : (
                                    "Criar Administrador"
                                )}
                            </Button>
                        </form>
                    </>
                )}
            </Card>
        </div>
    );
}
