import { NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const query = url.searchParams.get("q");
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = parseInt(url.searchParams.get("limit") || "20", 10);
    const genre = url.searchParams.get("genre");
    const sortBy = url.searchParams.get("sortBy") || "newest";

    if (!query || query.trim().length === 0) {
      return NextResponse.json(
        { error: "Termo de busca é obrigatório" },
        { status: 400 }
      );
    }

    const skip = (page - 1) * limit;
      // Construir filtros de busca
    let searchFilters: any = {
      status: "APPROVED",
      OR: [
        {
          title: {
            contains: query.trim(),
            mode: "insensitive",
          },
        },
        {
          artist: {
            contains: query.trim(),
            mode: "insensitive",
          },
        },
        {
          album: {
            contains: query.trim(),
            mode: "insensitive",
          },
        },
        {
          genre: {
            contains: query.trim(),
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: query.trim(),
            mode: "insensitive",
          },
        },
      ],
    };

    // Adicionar filtro de gênero se especificado
    if (genre && genre !== "all") {
      searchFilters.genre = {
        equals: genre,
        mode: "insensitive",
      };
    }

    // Definir ordenação
    let orderBy: any = { postedAt: "desc" };
    switch (sortBy) {
      case "oldest":
        orderBy = { postedAt: "asc" };
        break;
      case "title":
        orderBy = { title: "asc" };
        break;
      case "artist":
        orderBy = { artist: "asc" };
        break;
      case "downloads":
        orderBy = { downloads: "desc" };
        break;
      case "newest":
      default:
        orderBy = { postedAt: "desc" };
        break;
    }

    // Buscar músicas
    const [musics, totalCount] = await Promise.all([
      prisma.music.findMany({
        where: searchFilters,
        orderBy,
        skip,
        take: limit,
        select: {
          id: true,
          title: true,
          artist: true,
          artistId: true,
          album: true,
          genre: true,
          releaseDate: true,
          duration: true,
          coverUrl: true,
          audioUrl: true,
          downloads: true,
          description: true,
          postedBy: true,
          postedAt: true,
          spotifyUrl: true,
          youtubeUrl: true,
          appleMusicUrl: true,
        },
      }),
      prisma.music.count({
        where: searchFilters,
      }),
    ]);

    // Buscar gêneros únicos para filtros
    const genres = await prisma.music.findMany({
      where: {
        status: "APPROVED",
      },
      select: {
        genre: true,
      },
      distinct: ["genre"],
      orderBy: {
        genre: "asc",
      },
    });

    const uniqueGenres = genres.map(g => g.genre).filter(Boolean);

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      musics,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
      query,
      genres: uniqueGenres,
    });
  } catch (error) {
    console.error("Erro ao buscar músicas:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
