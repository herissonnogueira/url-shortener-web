# URL Shortener Web

Frontend do URL Shortener, desenvolvido com React, TypeScript e Tailwind CSS.

## Tecnologias

- [React](https://react.dev/) - biblioteca de UI
- [TypeScript](https://www.typescriptlang.org/) - tipagem estática
- [Vite](https://vite.dev/) - bundler e dev server
- [Tailwind CSS](https://tailwindcss.com/) - estilização
- [React Query](https://tanstack.com/query) - gerenciamento de estado assíncrono
- [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) - formulários e validação
- [Axios](https://axios-http.com/) - cliente HTTP

## Como rodar o projeto

### Pré-requisitos

- Node.js 18+
- pnpm
- [URL Shortener API](https://github.com/herissonnogueira/url-shortener) rodando na porta 3000

### Instalação

```bash
# Clone o repositório
git clone https://github.com/herissonnogueira/url-shortener-web.git
cd url-shortener-web

# Instale as dependências
pnpm install

# Configure as variáveis de ambiente
cp .env.example .env

# Rode o projeto
pnpm run dev
```

### Variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_API_URL=http://localhost:3000
```

Certifique-se de que o [URL Shortener API](https://github.com/herissonnogueira/url-shortener) está rodando antes de iniciar o frontend.

### Autenticação

O token de login é o mesmo valor de `API_TOKEN` configurado no `.env` da [API](https://github.com/herissonnogueira/url-shortener).

## Páginas

- `/` - Login
- `/dashboard` - Painel para encurtar, listar e deletar URLs
