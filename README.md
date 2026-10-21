# Ajudante do Afiliado

App para colar o link de um Shopee Vídeo e baixar o vídeo sem marca d'água.

## Tecnologia

- Node.js + Express (servidor)
- Puppeteer (abre a página como um navegador de verdade para achar o vídeo)
- HTML simples (interface branca e laranja)

## Como rodar

1. Instale as dependências: `npm install`
2. Inicie o servidor: `npm start`
3. Acesse o endereço mostrado no terminal.

## Hospedagem recomendada

Use o **Render** (render.com), não o Vercel. O Puppeteer precisa de mais tempo e
recursos do que o Vercel costuma permitir no plano gratuito.

Configuração no Render:
- Build Command: `npm install`
- Start Command: `npm start`

## Estrutura

- `server.js` — servidor que recebe o link, abre a página da Shopee e extrai o vídeo
- `index.html` — tela onde a pessoa cola o link e baixa o vídeo
- `package.json` — lista as dependências do projeto
