import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Link from "next/link";

export default function AjudaPage() {
  return (
    <div className="container py-6 md:py-10">
      <PageHeader
        title="Ajuda e Suporte"
        description="Saiba como usar o MusicBlog e tire suas dúvidas"
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
        {/* Menu lateral */}
        <div className="md:col-span-1">
          <Card className="p-4 sticky top-20">
            <nav className="space-y-2">
              <h3 className="font-medium text-lg mb-4">Categorias</h3>
              <ul className="space-y-1">
                <li>
                  <a href="#como-funciona" className="block py-1 hover:text-primary">
                    Como funciona
                  </a>
                </li>
                <li>
                  <a href="#buscar-musicas" className="block py-1 hover:text-primary">
                    Como buscar músicas
                  </a>
                </li>
                <li>
                  <a href="#enviar-musicas" className="block py-1 hover:text-primary">
                    Como enviar músicas
                  </a>
                </li>
                <li>
                  <a href="#baixar-musicas" className="block py-1 hover:text-primary">
                    Como baixar músicas
                  </a>
                </li>
                <li>
                  <a href="#conta" className="block py-1 hover:text-primary">
                    Minha conta
                  </a>
                </li>
                <li>
                  <a href="#perguntas-frequentes" className="block py-1 hover:text-primary">
                    Perguntas frequentes
                  </a>
                </li>
              </ul>
            </nav>
          </Card>
        </div>

        {/* Conteúdo principal */}
        <div className="md:col-span-3">
          <section id="como-funciona" className="mb-10">
            <h2 className="text-2xl font-bold mb-4">Como funciona o MusicBlog</h2>
            <Card className="p-6">
              <p className="mb-4">
                O MusicBlog é uma plataforma comunitária onde artistas e fãs podem compartilhar 
                e descobrir músicas. Nosso objetivo é criar um espaço onde músicas de artistas 
                independentes ou estabelecidos possam ser compartilhadas livremente, respeitando 
                os direitos autorais e as licenças.
              </p>
              <h3 className="text-lg font-medium mt-6 mb-2">Principais recursos:</h3>
              <ul className="list-disc list-inside space-y-2 pl-4">
                <li>Biblioteca de músicas com milhares de títulos organizados por gênero e artista</li>
                <li>Sistema de envio de músicas por usuários</li>
                <li>Curadoria por administradores para garantir a qualidade do conteúdo</li>
                <li>Top downloads e músicas recentemente adicionadas</li>
                <li>Links para plataformas externas como Spotify, YouTube e Apple Music</li>
              </ul>
            </Card>
          </section>

          <section id="buscar-musicas" className="mb-10">
            <h2 className="text-2xl font-bold mb-4">Como buscar músicas</h2>
            <Card className="p-6">
              <p className="mb-4">
                Você pode encontrar músicas na plataforma de várias maneiras:
              </p>
              <ol className="list-decimal list-inside space-y-3 pl-4 mb-4">
                <li><strong>Barra de pesquisa:</strong> Use a barra de pesquisa no topo da página para buscar por título, artista ou álbum.</li>
                <li><strong>Navegação por categorias:</strong> Explore os gêneros musicais disponíveis na página inicial.</li>
                <li><strong>Artistas:</strong> Navegue pela lista de artistas e descubra todas as músicas de um mesmo criador.</li>
                <li><strong>Músicas recentes:</strong> Confira as músicas mais recentemente adicionadas na página inicial.</li>
                <li><strong>Top downloads:</strong> Veja o que está fazendo sucesso entre os usuários na seção de top downloads.</li>
              </ol>
              
              <p>
                Os resultados de pesquisa podem ser filtrados por gênero, data de lançamento e popularidade.
              </p>
            </Card>
          </section>

          <section id="enviar-musicas" className="mb-10">
            <h2 className="text-2xl font-bold mb-4">Como enviar músicas</h2>
            <Card className="p-6">
              <p className="mb-4">
                Qualquer pessoa pode enviar músicas para o MusicBlog, seguindo estas etapas:
              </p>
              
              <ol className="list-decimal list-inside space-y-3 pl-4 mb-6">
                <li>Acesse a página <Link href="/enviar" className="text-primary hover:underline">Enviar Música</Link> através do menu principal.</li>
                <li>Preencha o formulário com as informações da música (título, artista, gênero, etc.).</li>
                <li>Forneça links para o arquivo de áudio e imagem de capa (hospedados externamente).</li>
                <li>Adicione uma descrição e outros detalhes relevantes.</li>
                <li>Envie a submissão para aprovação.</li>
              </ol>
              
              <div className="bg-amber-50 dark:bg-amber-950/20 p-4 rounded-md">
                <h4 className="font-medium mb-2 text-amber-800 dark:text-amber-300">Importante:</h4>
                <ul className="list-disc list-inside space-y-2 pl-2 text-amber-700 dark:text-amber-400">
                  <li>Todas as submissões são revisadas pelos administradores antes de serem publicadas.</li>
                  <li>Você deve ter os direitos autorais ou permissão para compartilhar a música.</li>
                  <li>O arquivo de áudio e a imagem de capa devem ser hospedados externamente (SoundCloud, Dropbox, etc.).</li>
                  <li>A aprovação pode levar até 48 horas.</li>
                </ul>
              </div>
            </Card>
          </section>

          <section id="baixar-musicas" className="mb-10">
            <h2 className="text-2xl font-bold mb-4">Como baixar músicas</h2>
            <Card className="p-6">
              <p className="mb-4">
                Para baixar uma música do MusicBlog:
              </p>
              
              <ol className="list-decimal list-inside space-y-3 pl-4">
                <li>Encontre a música que deseja baixar usando a pesquisa ou navegação.</li>
                <li>Clique no card da música para acessar a página de detalhes.</li>
                <li>Clique no botão "Download" para iniciar o download.</li>
                <li>Alternativamente, você pode acessar os links externos para ouvir em plataformas como Spotify ou YouTube.</li>
              </ol>
            </Card>
          </section>

          <section id="conta" className="mb-10">
            <h2 className="text-2xl font-bold mb-4">Minha Conta</h2>
            <Card className="p-6">
              <p className="mb-4">
                Com uma conta no MusicBlog, você pode:
              </p>
              
              <ul className="list-disc list-inside space-y-2 pl-4 mb-6">
                <li>Acompanhar suas submissões de música</li>
                <li>Receber notificações quando suas submissões forem aprovadas</li>
                <li>Criar e gerenciar playlists personalizadas</li>
                <li>Salvar músicas favoritas</li>
              </ul>
              
              <p className="mb-4">
                Para criar uma conta, clique no ícone de usuário no canto superior direito e selecione "Criar conta".
              </p>
            </Card>
          </section>

          <section id="perguntas-frequentes" className="mb-10">
            <h2 className="text-2xl font-bold mb-4">Perguntas Frequentes</h2>
            <Card className="p-6">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>O MusicBlog é gratuito?</AccordionTrigger>
                  <AccordionContent>
                    Sim, o MusicBlog é totalmente gratuito para uso. Não cobramos pelo acesso às músicas ou pelo envio de conteúdo.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-2">
                  <AccordionTrigger>Posso enviar minhas próprias músicas?</AccordionTrigger>
                  <AccordionContent>
                    Sim! Encorajamos artistas a compartilharem suas próprias músicas no MusicBlog. Basta acessar a página "Enviar Música" e preencher o formulário.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-3">
                  <AccordionTrigger>Como faço para denunciar conteúdo que viola direitos autorais?</AccordionTrigger>
                  <AccordionContent>
                    Se você encontrar conteúdo que acredita violar direitos autorais, entre em contato conosco através da página de contato. Vamos analisar e remover, se necessário.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-4">
                  <AccordionTrigger>Por que minha submissão foi rejeitada?</AccordionTrigger>
                  <AccordionContent>
                    As submissões podem ser rejeitadas por diversos motivos: qualidade insuficiente, informações incompletas, problemas com direitos autorais, ou conteúdo inadequado. Você receberá um e-mail com o motivo específico da rejeição.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-5">
                  <AccordionTrigger>Posso atualizar informações de uma música que enviei?</AccordionTrigger>
                  <AccordionContent>
                    Sim, entre em contato conosco através da página de suporte com as informações que deseja atualizar.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </Card>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">Entre em Contato</h2>
            <Card className="p-6">
              <p className="mb-4">
                Ainda tem dúvidas? Fale conosco:
              </p>
              <ul className="list-disc list-inside space-y-2 pl-4">
                <li>Email: suporte@musicblog.com</li>
                <li>Formulário de contato: <Link href="/contato" className="text-primary hover:underline">Página de Contato</Link></li>
              </ul>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}
