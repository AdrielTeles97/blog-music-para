import { NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";

// Deletar usuário
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        const userId = params.id;

        await prisma.user.delete({
            where: { id: userId },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Erro ao deletar usuário:", error);
        return NextResponse.json({ error: "Erro ao deletar usuário" }, { status: 500 });
    }
}
