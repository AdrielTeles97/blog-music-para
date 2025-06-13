import { MusicListPaginated } from "@/components/music-list-paginated"
import { TopDownloadsEnhanced } from "@/components/top-downloads-enhanced"
import { RecentlyAdded } from "@/components/recently-added"
import { PageHeader } from "@/components/page-header"
import { AdBanner } from "@/components/ad-banner"
import { Card } from "@/components/ui/card"
import BannerSlider from "@/components/banner-slider"
import Announcements from "@/components/announcements"

export default function Home() {
  return (    <div className="container py-6 md:py-10">
      <PageHeader title="Descubra Novas Músicas" description="Explore as melhores músicas e artistas em um só lugar" />
      
      {/* Banner rotativo */}
      <div className="mt-6">
        <BannerSlider />
      </div>
      
      {/* Anúncios do sistema */}
      <Announcements />
      
      {/* Banner de anúncios */}
      <div className="mb-8">
        <AdBanner />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold mb-4">Músicas Recentes</h2>
          <RecentlyAdded />

          <h2 className="text-2xl font-bold mt-10 mb-4">Biblioteca de Músicas</h2>
          <MusicListPaginated />
        </div>

        <div className="space-y-6">
          <Card className="p-4">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <span className="bg-primary text-primary-foreground w-7 h-7 inline-flex items-center justify-center rounded-full mr-2 text-sm">
                10
              </span>
              Top Downloads
            </h2>
            <TopDownloadsEnhanced />
          </Card>

          <Card className="p-4">
            <h2 className="text-xl font-bold mb-4">Categorias</h2>
            <div className="flex flex-wrap gap-2">
              {["Pop", "Rock", "Hip Hop", "Eletrônica", "Jazz", "Clássica", "R&B", "Country", "Indie", "Metal"].map(
                (category) => (
                  <a
                    key={category}
                    href={`/category/${category.toLowerCase().replace(" ", "-")}`}
                    className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    {category}
                  </a>
                ),
              )}
            </div>
          </Card>
          
          {/* Banner de anúncios menor na lateral */}
          <div className="border rounded-lg overflow-hidden h-[250px] relative">
            <div className="absolute inset-0 flex items-center justify-center bg-muted text-muted-foreground">
              Espaço para banner
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
