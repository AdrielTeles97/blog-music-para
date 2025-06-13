import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

// GET - Buscar banners ativos
export async function GET() {
    try {
        const now = new Date();

        // Buscar banners ativos
        const banners = await prisma.banner.findMany({
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
                order: "asc",
            },
        });

        return NextResponse.json(banners);
    } catch (error: any) {
        console.error("Erro ao buscar banners ativos:", error);
        return NextResponse.json({ message: "Erro ao buscar banners", error: error.message }, { status: 500 });
    }
}
