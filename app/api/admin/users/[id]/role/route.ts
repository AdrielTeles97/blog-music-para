import { NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
    try {
        const { role } = await request.json();
        const userId = params.id;

        if (!["USER", "ADMIN", "SUPER_ADMIN"].includes(role)) {
            return NextResponse.json({ error: "Função inválida" }, { status: 400 });
        }

        const user = await prisma.user.update({
            where: { id: userId },
            data: { role },
        });

        return NextResponse.json({ user });
    } catch (error) {
        console.error("Erro ao atualizar função:", error);
        return NextResponse.json({ error: "Erro ao atualizar função" }, { status: 500 });
    }
}
