import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

// GET - Buscar popups ativos
export async function GET() {
    try {
        const now = new Date();

        // Buscar popups ativos
        const popups = await prisma.popup.findMany({
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

        return NextResponse.json(popups);
    } catch (error: any) {
        console.error("Erro ao buscar popups ativos:", error);
        return NextResponse.json({ message: "Erro ao buscar popups", error: error.message }, { status: 500 });
    }
}
