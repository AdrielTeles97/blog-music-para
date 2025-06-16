import { NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";

    const skip = (page - 1) * limit;

    // Construir filtros
    const where: any = {};
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { artist: { contains: search, mode: "insensitive" } },
        { album: { contains: search, mode: "insensitive" } },
      ];
    }

    if (status && status !== "all") {
      where.status = status;
    }

    // Buscar músicas com contagem total
    const [musics, total] = await Promise.all([
      prisma.music.findMany({
        where,
        skip,
        take: limit,
        orderBy: { postedAt: "desc" },        select: {
          id: true,
          title: true,
          artist: true,
          album: true,
          genre: true,
          coverUrl: true,
          downloads: true,
          status: true,
          postedAt: true,
          submittedBy: true,
          submittedAt: true,
        },
      }),
      prisma.music.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      musics,
      total,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    console.error("Erro ao buscar músicas:", error);
    return NextResponse.json(
      { error: "Erro ao buscar músicas" },
      { status: 500 }
    );
  }
}
