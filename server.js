const express = require("express");
const path = require("path");

const app = express();
app.use(express.json());
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "index.html")));

const UA =
  "Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 " +
  "(KHTML, like Gecko) Chrome/124.0 Mobile Safari/537.36";

// Só aceita links da Shopee (evita usar o servidor como proxy aberto)
function dominioPermitido(u) {
  try {
    const h = new URL(u).hostname;
    return /(^|\.)shopee\.[a-z.]+$/.test(h) || /(^|\.)shp\.ee$/.test(h);
  } catch {
    return false;
  }
}

// Tenta achar a URL do mp4 dentro da página do vídeo
function extrairVideo(html) {
  const og = html.match(/property=["']og:video(?::url)?["']\s+content=["']([^"']+)/i);
  if (og) return og[1].replace(/&amp;/g, "&");
  const mp4 = html.match(/https?:\\?\/\\?\/[^"'\s\\]+\.mp4[^"'\s\\]*/i);
  if (mp4) return mp4[0].replace(/\\\//g, "/").replace(/\\u0026/g, "&");
  return null;
}

// 1) Recebe o link colado e devolve a URL do vídeo
app.post("/api/resolver", async (req, res) => {
  const { url } = req.body || {};
  if (!url || !dominioPermitido(url)) {
    return res.status(400).json({ erro: "Cole um link válido do Shopee Vídeo." });
  }
  try {
    const r = await fetch(url, { headers: { "User-Agent": UA }, redirect: "follow" });
    const html = await r.text();
    const video = extrairVideo(html);
    if (!video) {
      return res.status(404).json({ erro: "Não consegui achar o vídeo nesse link." });
    }
    res.json({ video });
  } catch (e) {
    res.status(500).json({ erro: "Falha ao acessar o link." });
  }
});

// 2) Baixa o arquivo e entrega ao navegador como download
app.get("/api/baixar", async (req, res) => {
  const { v } = req.query;
  if (!v) return res.status(400).send("Faltou o vídeo.");
  try {
    const r = await fetch(v, { headers: { "User-Agent": UA } });
    if (!r.ok) return res.status(502).send("Não foi possível baixar.");
    res.setHeader("Content-Type", "video/mp4");
    res.setHeader("Content-Disposition", 'attachment; filename="shopee-video.mp4"');
    const buf = Buffer.from(await r.arrayBuffer());
    res.send(buf);
  } catch {
    res.status(500).send("Erro no download.");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Rodando na porta " + PORT));
