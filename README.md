# 🎵 PARAMUSIC - Plataforma de Agregação Musical

![Logo PARAMUSIC](./public/logo.png)

## 📋 Sobre o Projeto

**PARAMUSIC** é uma plataforma inovadora de agregação musical desenvolvida especificamente para um gênero musical de um estado específico. A aplicação funciona como um grande hub centralizador onde artistas e produtores podem submeter suas músicas para serem compartilhadas com a comunidade.

Este projeto foi desenvolvido com base em Inteligência Artificial para fins de estudos, explorando as melhores práticas de desenvolvimento web moderno com Next.js, TypeScript e tecnologias relacionadas.

## 🎯 Objetivo Principal

A plataforma visa:
- **Centralizar** a divulgação musical de um gênero específico
- **Facilitar** o descobrimento de novos talentos
- **Conectar** artistas com sua audiência
- **Automatizar** o processo de aprovação musical (futuro)

## ✨ Funcionalidades Principais

### 🏠 Tela Inicial
![Tela Inicial](./public/telas-app/tela-inicial.png)

- **Dashboard interativo** com músicas em destaque
- **Sistema de categorias** dinâmico baseado no banco de dados
- **Top downloads** dos artistas mais populares
- **Navegação intuitiva** e responsiva
- **Busca avançada** por músicas, artistas e gêneros

### 🎼 Submissão de Músicas
![Submissão de Música](./public/telas-app/submissão%20de%20música.png)

**Sistema completo de envio com validações avançadas:**
- ✅ **Dropdown de gêneros** pré-definidos pelo administrador
- ✅ **Date picker** com data atual pré-preenchida
- ✅ **Validação de URLs** para áudio (MP3) e imagens de capa
- ✅ **Sanitização** automática contra scripts maliciosos
- ✅ **Alertas personalizados** (sem alerts nativos do navegador)
- ✅ **Campos opcionais** como descrição e links de plataformas
- ✅ **Links para Spotify, YouTube e Apple Music**

### 🎵 Páginas Individuais de Músicas
![Tela de Música Individual](./public/telas-app/tela%20de%20músicas%20individuais.png)

- **Player integrado** com controles completos
- **Informações detalhadas** da música e artista
- **Links para plataformas** de streaming
- **Sistema de downloads** com contadores
- **Músicas relacionadas** do mesmo artista/gênero

### 🔧 Painel Administrativo
![Painel Administrativo](./public/telas-app/painel%20administrativo.png)

**Dashboard completo para administradores:**
- 📊 **Estatísticas detalhadas** de usuários e músicas
- 🎵 **Gerenciamento de músicas** (aprovar/rejeitar/editar)
- 👥 **Gerenciamento de usuários** e permissões
- 📢 **Sistema de anúncios** e banners
- 🚀 **Popups promocionais**
- 📈 **Métricas de performance** e engajamento

### 🎼 Gerenciamento de Músicas
![Gerenciar Músicas](./public/telas-app/gerenciar%20musicas.png)

**Interface administrativa para controle total:**
- ✅ **Aprovação/Rejeição** de submissões
- ✏️ **Edição** de informações musicais
- 🗑️ **Exclusão** com confirmação
- 🔍 **Filtros avançados** por status e gênero
- 📄 **Paginação** eficiente
- 📊 **Visualização** de estatísticas de download

## 🚀 Tecnologias Utilizadas

### Frontend
- **Next.js 14** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização utility-first
- **Radix UI** - Componentes acessíveis
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de schemas

### Backend
- **Next.js API Routes** - Serverless functions
- **Prisma ORM** - Object-Relational Mapping
- **PostgreSQL** - Banco de dados relacional
- **NextAuth.js** - Autenticação e autorização

### DevOps & Tools
- **Vercel** - Deploy e hosting
- **Git** - Controle de versão
- **ESLint** - Linting
- **Prettier** - Formatação de código

## 🎯 Funcionalidades Futuras (Roadmap)

### Melhorar a performance, principalmente no bandle inicial ao carregar o site.

### 🤖 Aprovação Automática com IA
- **Análise automática** de qualidade de áudio
- **Detecção de gênero musical** via machine learning
- **Verificação de conteúdo** apropriado
- **Sistema de score** para aprovação automática
- **Fallback manual** para casos duvidosos

### 📱 Aplicativo Mobile
- **App nativo** para iOS e Android
- **Player offline** para músicas baixadas
- **Notificações push** para novos lançamentos
- **Integração com sistemas** de música do dispositivo

### 🎵 Player Avançado
- **Playlists personalizadas**
- **Sistema de favoritos**
- **Histórico de reprodução**
- **Qualidade de áudio ajustável**
- **Crossfade entre músicas**

## 📊 Arquitetura do Sistema

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (Next.js)     │◄──►│   (API Routes)  │◄──►│   (PostgreSQL)  │
│                 │    │                 │    │                 │
│ - React         │    │ - Prisma ORM    │    │ - Users         │
│ - TypeScript    │    │ - NextAuth      │    │ - Music         │
│ - Tailwind      │    │ - Validation    │    │ - Submissions   │
│ - Components    │    │ - File Upload   │    │ - Analytics     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🛠️ Como Executar o Projeto

### Pré-requisitos
- Node.js 18+
- PostgreSQL
- Git

### Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/seu-usuario/paramusic.git
cd paramusic
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
```bash
cp .env.example .env.local
```

Edite o arquivo `.env.local` com suas configurações:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/paramusic"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

4. **Configure o banco de dados**
```bash
npx prisma migrate dev
npx prisma db seed
```

5. **Execute o projeto**
```bash
npm run dev
```

Acesse `http://localhost:3000` no seu navegador.

## 📁 Estrutura do Projeto

```
paramusic/
├── app/                    # App Router (Next.js 14)
│   ├── admin/             # Páginas administrativas
│   ├── api/               # API Routes
│   ├── buscar/            # Sistema de busca
│   ├── enviar/            # Submissão de músicas
│   └── musica/            # Páginas individuais
├── components/            # Componentes reutilizáveis
│   ├── ui/               # Componentes base (Radix)
│   └── ...               # Componentes específicos
├── lib/                   # Utilitários e configurações
│   ├── db/               # Configuração do Prisma
│   └── services/         # Serviços de negócio
├── prisma/               # Schema e migrações
├── public/               # Arquivos estáticos
│   └── telas-app/        # Screenshots da aplicação
└── types/                # Definições de tipos
```

## 🎨 Design System

- **Cores primárias**: Sistema de cores moderno e acessível
- **Tipografia**: Inter como fonte principal
- **Componentes**: Baseados em Radix UI para máxima acessibilidade
- **Layout**: Grid responsivo com breakpoints otimizados
- **Animações**: Transições suaves usando Tailwind

## 🧪 Testes e Qualidade

- **Validação de formulários** com Zod
- **Sanitização** de inputs do usuário
- **Validação de URLs** para conteúdo externo
- **Tratamento de erros** robusto
- **TypeScript** para type safety

## 🤝 Contribuição

Este projeto foi desenvolvido para fins educacionais com foco em:
- **Desenvolvimento Full-Stack** moderno
- **Integração com IA** (futuro)
- **Boas práticas** de programação
- **Arquitetura escalável**

## 📜 Licença

Este projeto é licenciado sob a MIT License - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 👨‍💻 Desenvolvedor

Desenvolvido com ❤️ por: Adriel Teles utilizando assistência de IA para fins educacionais e demonstração de tecnologias modernas de desenvolvimento web.

---

**PARAMUSIC** - *Conectando artistas, descobrindo talentos* 🎵