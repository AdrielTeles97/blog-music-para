import { NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";

// Atualizar status da música
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
    try {
        const { status } = await request.json();
        const musicId = params.id;

        if (!["pending", "approved", "rejected"].includes(status)) {
            return NextResponse.json({ error: "Status inválido" }, { status: 400 });
        }

        const music = await prisma.music.update({
            where: { id: musicId },
            data: {
                status: status.toUpperCase(),
                reviewedAt: new Date(),
                // reviewedBy: "admin", // TODO: pegar do contexto de autenticação
            },
        });

        return NextResponse.json({ music });
    } catch (error) {
        console.error("Erro ao atualizar status:", error);
        return NextResponse.json({ error: "Erro ao atualizar status" }, { status: 500 });
    }
}

// Deletar música
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        const musicId = params.id;

        await prisma.music.delete({
            where: { id: musicId },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Erro ao deletar música:", error);
        return NextResponse.json({ error: "Erro ao deletar música" }, { status: 500 });
    }
}
