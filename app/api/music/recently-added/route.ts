import { NextResponse } from "next/server";
import { getRecentlyAdded } from "@/lib/services/music-service";

export async function GET() {
    try {
        const recentMusic = await getRecentlyAdded(6); // Buscar 6 músicas recentes
        return NextResponse.json(recentMusic);
    } catch (error) {
        console.error("Erro ao buscar músicas recentes:", error);
        return NextResponse.json({ message: "Erro ao buscar músicas recentes" }, { status: 500 });
    }
}
