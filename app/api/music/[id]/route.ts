import { NextResponse } from "next/server";
import { getMusicById } from "@/lib/services/music-service";

export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        const id = params.id;
        const music = await getMusicById(id);

        if (!music) {
            return NextResponse.json({ message: "Música não encontrada" }, { status: 404 });
        }

        return NextResponse.json(music);
    } catch (error) {
        console.error(`Erro ao buscar música ${params.id}:`, error);
        return NextResponse.json({ message: "Erro ao buscar música" }, { status: 500 });
    }
}
