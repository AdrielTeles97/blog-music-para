import { NextResponse } from "next/server";
import { submitMusic } from "@/lib/services/music-service";
import { MusicSubmission } from "@/lib/types";
import { z } from "zod";

const submissionSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  artist: z.string().min(1, "Nome do artista é obrigatório"),
  album: z.string().optional(),
  genre: z.string().min(1, "Gênero é obrigatório"),
  releaseDate: z.string().optional(),
  description: z.string().min(10, "Descrição deve ter pelo menos 10 caracteres"),
  audioUrl: z.string().min(1, "Link do áudio é obrigatório").url("Formato de URL inválido"),
  coverUrl: z.string().optional(),
  submitterName: z.string().min(1, "Seu nome é obrigatório"),
  submitterEmail: z.string().email("Email inválido"),
  spotifyUrl: z.string().url("Formato de URL inválido").optional().or(z.literal("")),
  youtubeUrl: z.string().url("Formato de URL inválido").optional().or(z.literal("")),
  appleMusicUrl: z.string().url("Formato de URL inválido").optional().or(z.literal(""))
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Validar dados
    const result = submissionSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { message: "Dados inválidos", errors: result.error.format() },
        { status: 400 }
      );
    }
    
    // Submeter música
    const submission = result.data as MusicSubmission;
    const music = await submitMusic(submission);
    
    return NextResponse.json({
      message: "Música enviada com sucesso e aguardando aprovação",
      music
    });
  } catch (error) {
    console.error("Erro ao enviar música:", error);
    return NextResponse.json(
      { message: "Erro ao enviar música" },
      { status: 500 }
    );
  }
}
