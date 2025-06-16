"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MusicSubmission } from "@/lib/types";
import { Loader2, AlertCircle, CheckCircle2, Calendar } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert-simple";

// Função para sanitizar strings
const sanitizeString = (str: string) => {
  return str.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
            .replace(/[<>]/g, "")
            .trim();
};

// Função para validar se número contém apenas dígitos
const isValidNumber = (str: string) => {
  return /^\d+$/.test(str.replace(/\s/g, ""));
};


const submissionSchema = z.object({
  title: z.string().min(1, "Título é obrigatório").transform(sanitizeString),
  artist: z.string().min(1, "Nome do artista é obrigatório").transform(sanitizeString),
  album: z.string().optional().transform((val) => val ? sanitizeString(val) : ""),
  genre: z.string().min(1, "Gênero é obrigatório"),
  releaseDate: z.string().optional(),
  description: z.string().optional().transform((val) => val ? sanitizeString(val) : ""),
  audioUrl: z.string().min(1, "Link do áudio é obrigatório").url("Formato de URL inválido"),
  coverUrl: z.string().optional(),
  submitterName: z.string().min(1, "Seu nome é obrigatório").transform(sanitizeString),
  submitterEmail: z.string().email("Email inválido"),
  spotifyUrl: z.string().url("Formato de URL inválido").optional().or(z.literal("")),
  youtubeUrl: z.string().url("Formato de URL inválido").optional().or(z.literal("")),
  appleMusicUrl: z.string().url("Formato de URL inválido").optional().or(z.literal("")),
});

interface Genre {
  name: string;
  count: number;
}

export default function SubmitMusic() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [alert, setAlert] = useState<{type: 'success' | 'error' | 'warning', title: string, message: string} | null>(null);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loadingGenres, setLoadingGenres] = useState(true);

  // Data atual para o date picker
  const today = new Date().toISOString().split('T')[0];

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<MusicSubmission>({
    resolver: zodResolver(submissionSchema),
    defaultValues: {
      title: "",
      artist: "",
      album: "",
      genre: "",
      releaseDate: today, // Data atual como padrão
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
    setAlert(null);
    
    try {
      // Validar URLs antes de submeter
      setAlert({
        type: 'warning',
        title: 'Validando URLs...',
        message: 'Verificando se os links fornecidos são válidos.'
      });

      const [isImageValid, isAudioValid] = await Promise.all([
        testImageUrl(data.coverUrl || ''),
        testAudioUrl(data.audioUrl)
      ]);

      if (!isImageValid) {
        setAlert({
          type: 'error',
          title: 'URL da imagem inválida',
          message: 'O link da capa fornecido não é uma imagem válida ou não está acessível.'
        });
        return;
      }

      if (!isAudioValid) {
        setAlert({
          type: 'error',
          title: 'URL do áudio inválida',
          message: 'O link do áudio fornecido não é um arquivo de áudio válido ou não está acessível.'
        });
        return;
      }
      
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
      setAlert({
        type: 'success',
        title: 'Música enviada com sucesso!',
        message: 'Sua música foi enviada e está aguardando aprovação da nossa equipe.'
      });
    } catch (error) {
      console.error("Erro ao enviar música:", error);
      setAlert({
        type: 'error',
        title: 'Erro ao enviar música',
        message: 'Ocorreu um erro ao enviar sua música. Por favor, tente novamente.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Carregar gêneros da API
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch('/api/music/genres');
        if (response.ok) {
          const data = await response.json();
          setGenres(data.genres);
        }
      } catch (error) {
        console.error('Erro ao carregar gêneros:', error);
      } finally {
        setLoadingGenres(false);
      }
    };

    fetchGenres();
  }, []);

    return (
        <div className="container py-6 md:py-10">
            <PageHeader
                title="Enviar Música"
                description="Compartilhe sua música com o mundo. Após o envio, nossa equipe irá analisar e aprovar sua submissão."
            />            <Card className="max-w-3xl mx-auto mt-8 p-6">
                {/* Alert personalizado */}
                {alert && (
                    <Alert 
                        variant={alert.type === 'error' ? 'destructive' : alert.type === 'success' ? 'success' : 'warning'} 
                        className="mb-6"
                    >
                        {alert.type === 'error' && <AlertCircle className="h-4 w-4" />}
                        {alert.type === 'success' && <CheckCircle2 className="h-4 w-4" />}
                        {alert.type === 'warning' && <AlertCircle className="h-4 w-4" />}
                        <AlertTitle>{alert.title}</AlertTitle>
                        <AlertDescription>{alert.message}</AlertDescription>
                    </Alert>
                )}

                {submitted ? (
                    <div className="text-center py-10">
                        <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
                        <h3 className="text-xl font-bold mb-2">Música enviada com sucesso!</h3>
                        <p className="text-muted-foreground mb-6">
                            Obrigado por compartilhar sua música conosco. Nossa equipe irá analisar sua submissão em
                            breve.
                        </p>
                        <Button onClick={() => { setSubmitted(false); setAlert(null); }}>Enviar outra música</Button>
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
                            </div>                            <div className="space-y-2">
                                <label className="text-sm font-medium" htmlFor="genre">
                                    Gênero*
                                </label>
                                {loadingGenres ? (
                                    <div className="flex items-center space-x-2">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        <span className="text-sm text-muted-foreground">Carregando gêneros...</span>
                                    </div>
                                ) : (
                                    <Select onValueChange={(value) => setValue('genre', value)} defaultValue="">
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione um gênero" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {genres.map((genre) => (
                                                <SelectItem key={genre.name} value={genre.name}>
                                                    {genre.name} ({genre.count} músicas)
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                                {errors.genre && <p className="text-sm text-red-500">{errors.genre.message}</p>}
                            </div>                            <div className="space-y-2">
                                <label className="text-sm font-medium" htmlFor="releaseDate">
                                    Data de Lançamento (opcional)
                                </label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input 
                                        id="releaseDate" 
                                        type="date" 
                                        className="pl-10"
                                        defaultValue={today}
                                        {...register("releaseDate")} 
                                    />
                                </div>
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
                        </div>                        <div className="space-y-2">
                            <label className="text-sm font-medium" htmlFor="description">
                                Descrição da Música (opcional)
                            </label>
                            <textarea
                                id="description"
                                className="w-full min-h-[100px] px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary resize-none"
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
