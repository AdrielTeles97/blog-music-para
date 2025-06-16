import { NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";

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
            },
        });

        return NextResponse.json({ music });
    } catch (error) {
        console.error("Erro ao atualizar status:", error);
        return NextResponse.json({ error: "Erro ao atualizar status" }, { status: 500 });
    }
}
