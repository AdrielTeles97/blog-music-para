import { NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";

export async function GET() {
    try {
        // Buscar gêneros únicos de músicas aprovadas
        const genres = await prisma.music.findMany({
            where: {
                status: "APPROVED",
                genre: {
                    not: "",
                },
            },
            select: {
                genre: true,
            },
            distinct: ["genre"],
            orderBy: {
                genre: "asc",
            },
        });

        // Contar quantas músicas cada gênero tem
        const genresWithCount = await Promise.all(
            genres.map(async (genreItem) => {
                const count = await prisma.music.count({
                    where: {
                        status: "APPROVED",
                        genre: genreItem.genre,
                    },
                });

                return {
                    name: genreItem.genre,
                    count,
                };
            })
        );

        // Filtrar gêneros que têm pelo menos 1 música e ordenar por quantidade
        const filteredGenres = genresWithCount.filter((genre) => genre.count > 0).sort((a, b) => b.count - a.count);

        return NextResponse.json({
            genres: filteredGenres,
            total: filteredGenres.length,
        });
    } catch (error) {
        console.error("Erro ao buscar gêneros:", error);
        return NextResponse.json({ error: "Erro ao buscar gêneros" }, { status: 500 });
    }
}
