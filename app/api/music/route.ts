import { NextResponse } from "next/server";
import { getApprovedMusic } from "@/lib/services/music-service";

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const page = parseInt(url.searchParams.get("page") || "1", 10);
        const limit = parseInt(url.searchParams.get("limit") || "10", 10);

        const result = await getApprovedMusic(page, limit);

        return NextResponse.json(result);
    } catch (error) {
        console.error("Erro ao buscar músicas:", error);
        return NextResponse.json({ message: "Erro ao buscar músicas" }, { status: 500 });
    }
}
