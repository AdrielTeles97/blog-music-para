import { NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";

export async function POST(request: Request) {
  try {
    // Obter dados do corpo da requisição
    const data = await request.json();
    
    // Validar se o ID da música foi fornecido
    if (!data.musicId) {
      return NextResponse.json(
        { error: "ID da música não fornecido" },
        { status: 400 }
      );
    }

    const { musicId } = data;
    
    // Buscar a música para verificar se ela existe
    const music = await prisma.music.findUnique({
      where: { id: musicId },
    });

    // Se a música não existir, retornar erro
    if (!music) {
      return NextResponse.json(
        { error: "Música não encontrada" },
        { status: 404 }
      );
    }

    // Registrar o download
    const updatedMusic = await prisma.music.update({
      where: { id: musicId },
      data: {
        downloads: {
          increment: 1,
        },
      },
    });

    // Retornar sucesso
    return NextResponse.json(
      { 
        success: true,
        message: "Download registrado com sucesso",
        currentDownloads: updatedMusic.downloads
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro ao registrar download:", error);
    return NextResponse.json(
      { error: "Erro ao processar requisição" },
      { status: 500 }
    );
  }
}
