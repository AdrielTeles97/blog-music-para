import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

// GET - Buscar anúncios ativos
export async function GET() {
    try {
        const now = new Date();

        // Buscar anúncios ativos
        const announcements = await prisma.announcement.findMany({
            where: {
                isActive: true,
                OR: [
                    {
                        startDate: { lte: now },
                        endDate: { gte: now },
                    },
                    {
                        startDate: { lte: now },
                        endDate: null,
                    },
                ],
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return NextResponse.json(announcements);
    } catch (error: any) {
        console.error("Erro ao buscar anúncios ativos:", error);
        return NextResponse.json({ message: "Erro ao buscar anúncios", error: error.message }, { status: 500 });
    }
}
