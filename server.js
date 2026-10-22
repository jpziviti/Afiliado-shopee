const express = require("express");
const path = require("path");
const puppeteer = require("puppeteer");

const app = express();
app.use(express.json());
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "index.html")));

const UA =
  "Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 " +
  "(KHTML, like Gecko) Chrome/124.0 Mobile Safari/537.36";

function dominioPermitido(u) {
  try {
    const h = new URL(u).hostname;
    return /(^|\.)shopee\.[a-z.]+$/.test(h) || /(^|\.)shp\.ee$/.test(h);
  } catch {
    return false;
  }
}

const esperar = (ms) => new Promise((r) => setTimeout(r, ms));

async function acharVideoComNavegador(url) {
  const browser = await puppeteer.launch({
    headless: "new",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--autoplay-policy=no-user-gesture-required",
    ],
  });
  try {
    const page = await browser.newPage();
    await page.setUserAgent(UA);
    await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });

    let videoUrl = null;

    // Pega qualquer resposta que seja video (pelo tipo ou pela extensao)
    page.on("response", (res) => {
      try {
        const u = res.url();
        const ct = (res.headers()["content-type"] || "").toLowerCase();
        if (!videoUrl && !u.startsWith("blob:") && (ct.startsWith("video/") || /\.mp4(\?|$)/i.test(u))) {
          videoUrl = u;
        }
      } catch (e) {}
    });

    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
    await esperar(3000);

    // Forca o video a tocar (sem som) para a pagina pedir o arquivo
    await page.evaluate(() => {
      const v = document.querySelector("video");
      if (v) {
        v.muted = true;
        v.play().catch(() => {});
      }
    }).catch(() => {});
    await page.mouse.click(195, 420).catch(() => {});

    // Espera ate 12s pelo video aparecer
    for (let i = 0; i < 24 && !videoUrl; i++) {
      await esperar(500);
    }

    // Plano B: ler direto da tag <video>
    if (!videoUrl) {
      videoUrl = await page.evaluate(() => {
        const v = document.querySelector("video");
        const s = v && (v.currentSrc || v.src);
        return s && !s.startsWith("blob:") ? s : null;
      }).catch(() => null);
    }

    return videoUrl;
  } finally {
    await browser.close();
  }
}

app.post("/api/resolver", async (req, res) => {
  const { url } = req.body || {};
  if (!url || !dominioPermitido(url)) {
    return res.status(400).json({ erro: "Cole um link valido do Shopee Video." });
  }
  try {
    const video = await acharVideoComNavegador(url);
    if (!video) {
      return res.status(404).json({ erro: "Nao consegui achar o video nesse link." });
    }
    res.json({ video });
  } catch (e) {
    console.error(e);
    res.status(500).json({ erro: "Falha ao acessar o link." });
  }
});

app.get("/api/baixar", async (req, res) => {
  const { v } = req.query;
  if (!v) return res.status(400).send("Faltou o video.");
  try {
    const r = await fetch(v, {
      headers: { "User-Agent": UA, Referer: "https://sv.shopee.com.br/" },
    });
    if (!r.ok) return res.status(502).send("Nao foi possivel baixar.");
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
