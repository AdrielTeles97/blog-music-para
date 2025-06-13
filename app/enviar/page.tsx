"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MusicSubmission } from "@/lib/types";
import { Loader2 } from "lucide-react";
import { submitMusic } from "@/lib/data";

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
    appleMusicUrl: z.string().url("Formato de URL inválido").optional().or(z.literal("")),
});

export default function SubmitMusic() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<MusicSubmission>({
        resolver: zodResolver(submissionSchema),
        defaultValues: {
            title: "",
            artist: "",
            album: "",
            genre: "",
            releaseDate: "",
            description: "",
            audioUrl: "",
            coverUrl: "",
            submitterName: "",
            submitterEmail: "",
            spotifyUrl: "",
            youtubeUrl: "",
            appleMusicUrl: "",
        },
    });

  const onSubmit = async (data: MusicSubmission) => {
    setIsSubmitting(true);
    
    try {
      // Chamando a API para submeter a música
      const response = await fetch("/api/music/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || "Erro ao enviar música");
      }
      
      reset();
      setSubmitted(true);
    } catch (error) {
      console.error("Erro ao enviar música:", error);
      alert("Ocorreu um erro ao enviar sua música. Por favor, tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

    return (
        <div className="container py-6 md:py-10">
            <PageHeader
                title="Enviar Música"
                description="Compartilhe sua música com o mundo. Após o envio, nossa equipe irá analisar e aprovar sua submissão."
            />

            <Card className="max-w-3xl mx-auto mt-8 p-6">
                {submitted ? (
                    <div className="text-center py-10">
                        <h3 className="text-xl font-bold mb-2">Música enviada com sucesso!</h3>
                        <p className="text-muted-foreground mb-6">
                            Obrigado por compartilhar sua música conosco. Nossa equipe irá analisar sua submissão em
                            breve.
                        </p>
                        <Button onClick={() => setSubmitted(false)}>Enviar outra música</Button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-1">
                            <h3 className="text-lg font-medium">Informações da Música</h3>
                            <p className="text-sm text-muted-foreground">
                                Preencha as informações sobre a música que você deseja compartilhar.
                            </p>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <label className="text-sm font-medium" htmlFor="title">
                                    Título da Música*
                                </label>
                                <Input id="title" placeholder="Ex: Minha Nova Música" {...register("title")} />
                                {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium" htmlFor="artist">
                                    Artista/Banda*
                                </label>
                                <Input id="artist" placeholder="Ex: Nome do Artista" {...register("artist")} />
                                {errors.artist && <p className="text-sm text-red-500">{errors.artist.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium" htmlFor="album">
                                    Álbum (opcional)
                                </label>
                                <Input id="album" placeholder="Ex: Nome do Álbum" {...register("album")} />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium" htmlFor="genre">
                                    Gênero*
                                </label>
                                <Input id="genre" placeholder="Ex: Pop, Rock, Hip Hop" {...register("genre")} />
                                {errors.genre && <p className="text-sm text-red-500">{errors.genre.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium" htmlFor="releaseDate">
                                    Data de Lançamento (opcional)
                                </label>
                                <Input id="releaseDate" placeholder="Ex: 01/01/2025" {...register("releaseDate")} />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium" htmlFor="audioUrl">
                                    Link do Arquivo MP3*
                                </label>
                                <Input id="audioUrl" placeholder="https://" {...register("audioUrl")} />
                                {errors.audioUrl && <p className="text-sm text-red-500">{errors.audioUrl.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium" htmlFor="coverUrl">
                                    Link da Imagem de Capa (opcional)
                                </label>
                                <Input id="coverUrl" placeholder="https://" {...register("coverUrl")} />
                                {errors.coverUrl && <p className="text-sm text-red-500">{errors.coverUrl.message}</p>}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium" htmlFor="description">
                                Descrição da Música*
                            </label>
                            <textarea
                                id="description"
                                className="w-full min-h-[100px] px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder="Conte-nos sobre sua música..."
                                {...register("description")}
                            />
                            {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
                        </div>

                        <div className="space-y-1 pt-4">
                            <h3 className="text-lg font-medium">Links Adicionais (opcionais)</h3>
                            <p className="text-sm text-muted-foreground">
                                Adicione links para sua música em outras plataformas.
                            </p>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <label className="text-sm font-medium" htmlFor="spotifyUrl">
                                    Link do Spotify
                                </label>
                                <Input
                                    id="spotifyUrl"
                                    placeholder="https://open.spotify.com/..."
                                    {...register("spotifyUrl")}
                                />
                                {errors.spotifyUrl && (
                                    <p className="text-sm text-red-500">{errors.spotifyUrl.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium" htmlFor="youtubeUrl">
                                    Link do YouTube
                                </label>
                                <Input
                                    id="youtubeUrl"
                                    placeholder="https://youtube.com/..."
                                    {...register("youtubeUrl")}
                                />
                                {errors.youtubeUrl && (
                                    <p className="text-sm text-red-500">{errors.youtubeUrl.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium" htmlFor="appleMusicUrl">
                                    Link do Apple Music
                                </label>
                                <Input
                                    id="appleMusicUrl"
                                    placeholder="https://music.apple.com/..."
                                    {...register("appleMusicUrl")}
                                />
                                {errors.appleMusicUrl && (
                                    <p className="text-sm text-red-500">{errors.appleMusicUrl.message}</p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-1 pt-4">
                            <h3 className="text-lg font-medium">Suas Informações</h3>
                            <p className="text-sm text-muted-foreground">
                                Precisamos de suas informações para entrar em contato.
                            </p>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <label className="text-sm font-medium" htmlFor="submitterName">
                                    Seu Nome*
                                </label>
                                <Input
                                    id="submitterName"
                                    placeholder="Digite seu nome"
                                    {...register("submitterName")}
                                />
                                {errors.submitterName && (
                                    <p className="text-sm text-red-500">{errors.submitterName.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium" htmlFor="submitterEmail">
                                    Seu Email*
                                </label>
                                <Input
                                    id="submitterEmail"
                                    type="email"
                                    placeholder="email@exemplo.com"
                                    {...register("submitterEmail")}
                                />
                                {errors.submitterEmail && (
                                    <p className="text-sm text-red-500">{errors.submitterEmail.message}</p>
                                )}
                            </div>
                        </div>

                        <div className="pt-4">
                            <Button type="submit" className="w-full" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Enviando...
                                    </>
                                ) : (
                                    "Enviar Música"
                                )}
                            </Button>
                        </div>

                        <p className="text-xs text-muted-foreground text-center">
                            Ao enviar sua música, você concorda com nossos termos de serviço e política de privacidade.
                            Nossa equipe irá revisar sua submissão e entrar em contato se necessário.
                        </p>
                    </form>
                )}
            </Card>
        </div>
    );
}
