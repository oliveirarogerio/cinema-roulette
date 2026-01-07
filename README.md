# Cinema Roulette 🎬

Uma aplicação web minimalista para descobrir filmes aleatórios. Deixe o destino escolher seu próximo filme!

## 🎯 Características

- **Roleta de Filmes**: Descubra filmes aleatórios com um clique
- **Filtros Opcionais**: Filtre por gênero e década
- **Interface Minimalista**: Design dark mode com animações suaves
- **Informações Completas**: Veja poster, sinopse, nota e onde assistir
- **Responsivo**: Otimizado para mobile e desktop

## 🚀 Tecnologias

- **Next.js 16** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS 4** - Estilização utilitária
- **Framer Motion** - Animações suaves
- **Axios** - Cliente HTTP para requisições
- **TMDB API** - Base de dados de filmes
- **Heroicons** - Ícones minimalistas

## 📋 Pré-requisitos

- Node.js 18+ ou superior
- pnpm (ou npm/yarn)
- Chave de API do TMDB

## 🔑 Obtendo API Key do TMDB

1. Acesse [The Movie Database (TMDB)](https://www.themoviedb.org/)
2. Crie uma conta gratuita
3. Vá para Configurações → API
4. Solicite uma API Key (é gratuito!)
5. Copie sua API Key

## 🛠️ Instalação

1. Clone o repositório:

```bash
git clone <repository-url>
cd cinema-roulette
```

2. Instale as dependências:

```bash
pnpm install
```

3. Configure as variáveis de ambiente:

Crie um arquivo `.env.local` na raiz do projeto:

```bash
TMDB_API_KEY=sua_api_key_aqui
```

4. Execute o servidor de desenvolvimento:

```bash
pnpm dev
```

5. Abra [http://localhost:3000](http://localhost:3000) no navegador

## 📦 Build para Produção

```bash
pnpm build
pnpm start
```

## 🎨 Design

O projeto segue os princípios de design definidos no PRD:

- **Paleta de Cores**: Tema dark com destaque em rose-600
- **Tipografia**: Geist Sans (padrão Next.js)
- **UX**: Baseado nas Leis de Hick e Fitts
- **Animações**: Framer Motion com foco em performance

## 📁 Estrutura do Projeto

```
app/
├── components/
│   ├── ui/              # Componentes base
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Modal.tsx
│   │   └── Skeleton.tsx
│   ├── FilterBar.tsx    # Filtros de gênero e ano
│   ├── MovieCard.tsx    # Card do filme sorteado
│   └── Roulette.tsx     # Botão principal e lógica
├── lib/
│   ├── tmdb.ts          # Cliente TMDB (Server Actions)
│   ├── types.ts         # Tipos TypeScript
│   ├── image-helpers.ts # Helpers para URLs de imagens
│   └── utils.ts         # Utilitários
├── layout.tsx           # Layout global
├── page.tsx             # Página principal
└── globals.css          # Estilos globais
```

## 🔒 Segurança

- API Key protegida via Server Actions do Next.js
- Nunca exposta ao cliente
- Revalidação de cache configurada

## 🌐 Deploy

Recomendado: [Vercel](https://vercel.com)

1. Conecte seu repositório
2. Configure a variável de ambiente `TMDB_API_KEY`
3. Deploy automático

## 📝 Licença

Este projeto foi criado como parte de um exercício de desenvolvimento.

## 🙏 Créditos

- Dados de filmes: [The Movie Database (TMDB)](https://www.themoviedb.org/)
- Animações inspiradas em: [Aceternity UI](https://ui.aceternity.com/)
