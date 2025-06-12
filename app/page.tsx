import { MusicList } from "@/components/music-list"
import { TopDownloads } from "@/components/top-downloads"
import { RecentlyAdded } from "@/components/recently-added"
import { PageHeader } from "@/components/page-header"

export default function Home() {
  return (
    <div className="container py-6 md:py-10">
      <PageHeader title="Descubra Novas Músicas" description="Explore as melhores músicas e artistas em um só lugar" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold mb-4">Músicas Recentes</h2>
          <RecentlyAdded />

          <h2 className="text-2xl font-bold mt-10 mb-4">Todas as Músicas</h2>
          <MusicList />
        </div>

        <div className="space-y-6">
          <div className="border rounded-lg p-4">
            <h2 className="text-xl font-bold mb-4">Top 10 Downloads</h2>
            <TopDownloads />
          </div>

          <div className="border rounded-lg p-4">
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
          </div>
        </div>
      </div>
    </div>
  )
}
