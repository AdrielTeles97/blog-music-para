import { NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const musicId = url.searchParams.get("id");

        if (!musicId) {
            return NextResponse.json({ error: "ID da música não fornecido" }, { status: 400 });
        }

        // Buscar a música para verificar se ela existe
        const music = await prisma.music.findUnique({
            where: { id: musicId },
        });

        if (!music) {
            return NextResponse.json({ error: "Música não encontrada" }, { status: 404 });
        }

        // Incrementar o contador de downloads
        await prisma.music.update({
            where: { id: musicId },
            data: {
                downloads: {
                    increment: 1,
                },
            },
        });

        try {
            // Fazer fetch do arquivo de áudio
            const audioResponse = await fetch(music.audioUrl);

            if (!audioResponse.ok) {
                throw new Error(`Erro ao buscar o arquivo: ${audioResponse.status}`);
            }

            // Obter o conteúdo do arquivo como buffer
            const audioBuffer = await audioResponse.arrayBuffer();

            // Definir o nome do arquivo
            const fileName = `${music.artist} - ${music.title}.mp3`;

            // Retornar o arquivo com cabeçalhos de download
            return new NextResponse(audioBuffer, {
                status: 200,
                headers: {
                    "Content-Type": "audio/mpeg",
                    "Content-Disposition": `attachment; filename="${encodeURIComponent(fileName)}"`,
                    "Content-Length": audioBuffer.byteLength.toString(),
                },
            });
        } catch (fetchError) {
            console.error("Erro ao fazer fetch do arquivo:", fetchError);
            return NextResponse.json({ error: "Erro ao acessar o arquivo de áudio" }, { status: 500 });
        }
    } catch (error) {
        console.error("Erro ao processar download:", error);
        return NextResponse.json({ error: "Erro ao processar requisição" }, { status: 500 });
    }
}
