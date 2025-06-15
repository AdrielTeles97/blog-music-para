import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

// GET - Buscar banners ativos
export async function GET() {
    try {
        const now = new Date();
        console.log("Data atual:", now);

        // Buscar todos os banners ativos, ignorando temporariamente as restrições de data
        const banners = await prisma.banner.findMany({
            where: {
                isActive: true,
            },
            orderBy: {
                order: "asc",
            },
        });
        
        console.log("Banners encontrados:", banners);

        return NextResponse.json(banners);
    } catch (error: any) {
        console.error("Erro ao buscar banners ativos:", error);
        return NextResponse.json({ message: "Erro ao buscar banners", error: error.message }, { status: 500 });
    }
}
