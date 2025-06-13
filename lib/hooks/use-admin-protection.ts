"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const useAdminProtection = () => {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "loading") return;

        if (!session || session.user.role !== "ADMIN") {
            router.push("/login?message=Acesso restrito apenas para administradores");
        }
    }, [session, status, router]);

    return { session, status, isAdmin: session?.user.role === "ADMIN" };
};
