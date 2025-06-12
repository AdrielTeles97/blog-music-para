import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function DocContent() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-start">
        <h1 className="text-3xl font-bold mb-6">Introdução</h1>
        <div className="hidden md:block">
          <div className="border rounded-md p-4 w-64">
            <h3 className="text-sm font-medium mb-3">Nesta página</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#por-que" className="text-muted-foreground hover:text-foreground">
                  Por que Better Auth?
                </a>
              </li>
              <li>
                <a href="#caracteristicas" className="text-muted-foreground hover:text-foreground">
                  Características
                </a>
              </li>
              <li>
                <a href="#llms" className="text-muted-foreground hover:text-foreground">
                  LLMs.txt
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-lg mb-8">
          Better Auth é um framework de autenticação e autorização independente de framework para TypeScript. Ele
          oferece um conjunto abrangente de recursos prontos para uso e inclui um ecossistema de plugins que simplifica
          a adição de funcionalidades avançadas. Seja para autenticação de dois fatores (2FA), multilocação, suporte a
          múltiplas sessões ou até mesmo recursos corporativos como SSO, ele permite que você se concentre na construção
          do seu aplicativo em vez de reinventar a roda.
        </p>

        <h2 id="por-que" className="text-2xl font-bold mt-10 mb-4">
          Por que Better Auth?
        </h2>
        <p className="mb-6 italic">
          A autenticação no ecossistema TypeScript é há muito tempo um problema parcialmente resolvido. Outras
          bibliotecas de código aberto frequentemente exigem muito código adicional para qualquer coisa além dos
          recursos básicos de autenticação. Em vez de simplesmente oferecer serviços de terceiros como solução, acredito
          que podemos fazer melhor como comunidade — daí o nome Better Auth.
        </p>

        <h2 id="caracteristicas" className="text-2xl font-bold mt-10 mb-6">
          Características
        </h2>
        <p className="mb-8">
          A Better Auth pretende ser a biblioteca de autenticação mais completa. Ela oferece uma ampla gama de recursos
          prontos para uso e permite que você os expanda com plugins. Aqui estão alguns dos recursos:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <Card>
            <CardHeader>
              <CardTitle>Estrutura Agnóstica</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Suporte para as estruturas mais populares</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>E-mail e senha</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Suporte integrado para autenticação segura de e-mail e senha</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Gerenciamento de contas e sessões</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Gerencie contas de usuários e sessões com facilidade</p>
            </CardContent>
          </Card>
        </div>

        <h2 id="llms" className="text-2xl font-bold mt-10 mb-4">
          LLMs.txt
        </h2>
        <p className="mb-6">Documentação adicional sobre integração com modelos de linguagem grandes.</p>
      </div>
    </div>
  )
}
