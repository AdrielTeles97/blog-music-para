import { NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";

export async function GET() {
  try {
    // Estatísticas básicas
    const [
      totalMusics,
      totalUsers,
      totalDownloads,
      pendingSubmissions,
      approvedMusics,
      rejectedMusics,
      topGenres,
      topMusics,
    ] = await Promise.all([
      // Total de músicas
      prisma.music.count(),
      
      // Total de usuários
      prisma.user.count(),
      
      // Total de downloads
      prisma.music.aggregate({
        _sum: {
          downloads: true,
        },
      }),
      
      // Submissões pendentes
      prisma.music.count({
        where: {
          status: "PENDING",
        },
      }),
      
      // Músicas aprovadas
      prisma.music.count({
        where: {
          status: "APPROVED",
        },
      }),
      
      // Músicas rejeitadas
      prisma.music.count({
        where: {
          status: "REJECTED",
        },
      }),
      
      // Top gêneros
      prisma.music.groupBy({
        by: ['genre'],
        _count: {
          genre: true,
        },
        orderBy: {
          _count: {
            genre: 'desc',
          },
        },
        take: 5,
      }),
      
      // Músicas mais baixadas
      prisma.music.findMany({
        orderBy: {
          downloads: 'desc',
        },
        take: 5,
        select: {
          id: true,
          title: true,
          artist: true,
          downloads: true,
        },
      }),
    ]);

    // Atividade dos últimos 7 dias (simulada por enquanto)
    const recentActivity = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // Por enquanto vamos simular os dados
      // TODO: Implementar contadores reais por data
      recentActivity.push({
        date: date.toISOString().split('T')[0],
        downloads: Math.floor(Math.random() * 100) + 10,
        submissions: Math.floor(Math.random() * 10) + 1,
      });
    }

    const statistics = {
      totalMusics,
      totalUsers,
      totalDownloads: totalDownloads._sum.downloads || 0,
      pendingSubmissions,
      approvedMusics,
      rejectedMusics,
      recentActivity,
      topGenres: topGenres.map(item => ({
        genre: item.genre,
        count: item._count.genre,
      })),
      topMusics,
    };

    return NextResponse.json(statistics);
  } catch (error) {
    console.error("Erro ao buscar estatísticas:", error);
    return NextResponse.json(
      { error: "Erro ao buscar estatísticas" },
      { status: 500 }
    );
  }
}
