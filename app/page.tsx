import { MusicListPaginated } from "@/components/music-list-paginated"
import { TopDownloadsEnhanced } from "@/components/top-downloads-enhanced"
import { RecentlyAdded } from "@/components/recently-added"
import { PageHeader } from "@/components/page-header"
import { Card } from "@/components/ui/card"
import BannerSlider from "@/components/banner-slider"
import Announcements from "@/components/announcements"
import { Button } from "@/components/ui/button"
import { ChevronRight, Headphones, TrendingUp, Clock } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <div>
      {/* Banner rotativo e destaque */}
      <div className="py-4 bg-muted/30">
        <BannerSlider />
      </div>
      
      <div className="container py-6 md:py-8">
        {/* Anúncios do sistema */}
        <Announcements />
        
        {/* Seção de destaque */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <PageHeader title="Descubra Novas Músicas" description="Explore as melhores músicas e artistas em um só lugar" />
            <div className="hidden md:block">
              <Link href="/explorar">
                <Button variant="outline" className="rounded-full">
                  Ver todas
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Grid principal */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Coluna principal */}
          <div className="lg:col-span-8">
            {/* Músicas Recentes */}
            <section className="mb-10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-primary" />
                  <h2 className="text-2xl font-bold">Músicas Recentes</h2>
                </div>                <Link href="/musicas-recentes">
                  <Button variant="ghost" size="sm" className="text-sm">
                    Ver mais
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <div className="bg-muted/30 rounded-xl p-4">
                <RecentlyAdded />
              </div>
            </section>
            
            {/* Biblioteca de Músicas */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <Headphones className="h-5 w-5 mr-2 text-primary" />
                  <h2 className="text-2xl font-bold">Biblioteca de Músicas</h2>
                </div>
              </div>
              <div className="bg-muted/30 rounded-xl p-4">
                <MusicListPaginated />
              </div>
            </section>
          </div>
          
          {/* Coluna lateral */}
          <div className="lg:col-span-4 space-y-8">
            {/* Top Downloads */}
            <Card className="overflow-hidden border-none shadow-lg">
              <div className="bg-gradient-to-r from-primary/20 to-primary/5 p-4">
                <div className="flex items-center mb-4">
                  <TrendingUp className="h-5 w-5 mr-2 text-primary" />
                  <h2 className="text-xl font-bold flex items-center">
                    <span className="bg-primary text-primary-foreground w-7 h-7 inline-flex items-center justify-center rounded-full mr-2 text-sm">
                      10
                    </span>
                    Top Downloads
                  </h2>
                </div>
                <TopDownloadsEnhanced />
              </div>
            </Card>

            {/* Categorias */}
            <Card className="overflow-hidden border-none shadow-lg">
              <div className="bg-gradient-to-r from-muted/50 to-muted/10 p-4">
                <h2 className="text-xl font-bold mb-4">Categorias</h2>
                <div className="flex flex-wrap gap-2">
                  {["Pop", "Rock", "Hip Hop", "Eletrônica", "Jazz", "Clássica", "R&B", "Country", "Indie", "Metal"].map(
                    (category) => (
                      <a
                        key={category}
                        href={`/category/${category.toLowerCase().replace(" ", "-")}`}
                        className="px-4 py-1.5 bg-background border border-border hover:border-primary rounded-full text-sm hover:bg-primary/10 transition-colors"
                      >
                        {category}
                      </a>
                    ),
                  )}
                </div>
              </div>
            </Card>
            
            {/* Banner de anúncios */}
            <Card className="overflow-hidden border-none shadow-lg">
              <div className="h-[250px] relative bg-gradient-to-br from-muted/30 to-muted/5">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center p-6">
                    <h3 className="font-semibold mb-2">Destaque Especial</h3>
                    <p className="text-muted-foreground text-sm mb-4">Descubra artistas em destaque</p>
                    <Button size="sm" className="rounded-full">Saiba mais</Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
