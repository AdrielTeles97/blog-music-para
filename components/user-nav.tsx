"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogIn, LogOut, User } from "lucide-react";

export function UserNav() {
    const { data: session, status } = useSession();

    if (status === "loading") {
        return <div className="h-9 w-9"></div>; // Espaço reservado enquanto carrega
    }

    if (!session) {
        return (
            <Button variant="ghost" size="icon" asChild>
                <Link href="/login" title="Fazer login">
                    <LogIn className="h-5 w-5" />
                    <span className="sr-only">Login</span>
                </Link>
            </Button>
        );
    }

    // Usuário logado
    return (
        <div className="flex items-center gap-2">
            {session.user.role === "ADMIN" && (
                <Link
                    href="/admin"
                    className="text-xs font-medium px-2 py-1 bg-primary text-primary-foreground rounded-md"
                >
                    Admin
                </Link>
            )}

            <Button variant="ghost" size="icon" asChild>
                <Link href="/perfil" title={session.user.name || "Perfil"}>
                    <User className="h-5 w-5" />
                    <span className="sr-only">Perfil</span>
                </Link>
            </Button>

            <Button variant="ghost" size="icon" onClick={() => signOut()} title="Sair">
                <LogOut className="h-5 w-5" />
                <span className="sr-only">Sair</span>
            </Button>
        </div>
    );
}
