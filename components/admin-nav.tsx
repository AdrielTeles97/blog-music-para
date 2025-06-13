"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Shield, Settings } from "lucide-react";

export function AdminNav() {
    const { data: session } = useSession();

    // Mostrar apenas se o usuário estiver logado e for admin
    if (!session || session.user.role !== "ADMIN") {
        return null;
    }

    return (
        <div className="py-2">
            <h3 className="text-sm font-medium text-muted-foreground px-4 mb-2">Administração</h3>
            <nav className="space-y-1">
                <Link href="/admin" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-accent rounded-md">
                    <Shield className="h-4 w-4" />
                    <span>Painel Admin</span>
                </Link>
                <Link
                    href="/configuracoes"
                    className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-accent rounded-md"
                >
                    <Settings className="h-4 w-4" />
                    <span>Configurações</span>
                </Link>
            </nav>
        </div>
    );
}
