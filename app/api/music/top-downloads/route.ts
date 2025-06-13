import { NextResponse } from "next/server";
import { getTopDownloads } from "@/lib/services/music-service";

export async function GET() {
  try {
    const topMusic = await getTopDownloads(10); // Buscar top 10 downloads
    return NextResponse.json(topMusic);
  } catch (error) {
    console.error("Erro ao buscar top downloads:", error);
    return NextResponse.json(
      { message: "Erro ao buscar músicas mais baixadas" },
      { status: 500 }
    );
  }
}
