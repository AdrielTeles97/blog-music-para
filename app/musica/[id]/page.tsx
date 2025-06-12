import { MusicPlayer } from "@/components/music-player"
import { PageHeader } from "@/components/page-header"
import { RelatedSongs } from "@/components/related-songs"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { getMusicById } from "@/lib/data"
import { Download, Share2, Heart } from "lucide-react"
import Image from "next/image"

export default function MusicPage({ params }: { params: { id: string } }) {
  const music = getMusicById(params.id)

  if (!music) {
    return <div className="container py-10">Música não encontrada</div>
  }

  return (
    <div className="container py-6 md:py-10">
      <PageHeader title={music.title} description={`${music.artist} • ${music.album}`} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="overflow-hidden">
            <div className="relative aspect-video">
              <Image src={music.coverUrl || "/placeholder.svg"} alt={music.title} fill className="object-cover" />
            </div>

            <div className="p-6">
              <MusicPlayer audioUrl={music.audioUrl} title={music.title} artist={music.artist} />

              <div className="flex items-center justify-between mt-6">
                <div className="flex items-center gap-4">
                  <Button variant="outline" size="sm">
                    <Heart className="h-4 w-4 mr-2" />
                    Favoritar
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="h-4 w-4 mr-2" />
                    Compartilhar
                  </Button>
                </div>

                <Button>
                  <Download className="h-4 w-4 mr-2" />
                  Download ({music.downloads})
                </Button>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Sobre a Música</h2>
            <p className="text-muted-foreground">{music.description}</p>

            <h3 className="text-lg font-bold mt-6 mb-2">Informações</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Álbum</p>
                <p>{music.album}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Gênero</p>
                <p>{music.genre}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Lançamento</p>
                <p>{music.releaseDate}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Duração</p>
                <p>{music.duration}</p>
              </div>
            </div>

            <h3 className="text-lg font-bold mt-6 mb-2">Postado por</h3>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                {music.postedBy.charAt(0)}
              </div>
              <div>
                <p className="font-medium">{music.postedBy}</p>
                <p className="text-sm text-muted-foreground">{music.postedAt}</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-4">
            <h2 className="text-xl font-bold mb-4">Músicas Relacionadas</h2>
            <RelatedSongs currentId={params.id} />
          </Card>

          <Card className="p-4">
            <h2 className="text-xl font-bold mb-4">Links</h2>
            <div className="space-y-2">
              <a
                href={music.spotifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center p-2 hover:bg-secondary rounded-md transition-colors"
              >
                <div className="w-8 h-8 bg-[#1DB954] rounded-full flex items-center justify-center mr-3">
                  <span className="text-white text-xs">S</span>
                </div>
                Spotify
              </a>
              <a
                href={music.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center p-2 hover:bg-secondary rounded-md transition-colors"
              >
                <div className="w-8 h-8 bg-[#FF0000] rounded-full flex items-center justify-center mr-3">
                  <span className="text-white text-xs">Y</span>
                </div>
                YouTube
              </a>
              <a
                href={music.appleMusicUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center p-2 hover:bg-secondary rounded-md transition-colors"
              >
                <div className="w-8 h-8 bg-[#FA243C] rounded-full flex items-center justify-center mr-3">
                  <span className="text-white text-xs">A</span>
                </div>
                Apple Music
              </a>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
