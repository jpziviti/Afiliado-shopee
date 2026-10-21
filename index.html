<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Ajudante do Afiliado</title>
<style>
  :root { --laranja:#ee4d2d; --bg:#ffffff; --txt:#222; }
  * { box-sizing: border-box; }
  body { margin:0; font-family: system-ui, sans-serif; background:var(--bg); color:var(--txt);
         display:flex; justify-content:center; padding:24px 16px; }
  main { width:100%; max-width:420px; }
  h1 { color:var(--laranja); font-size:26px; margin:0 0 4px; }
  p.sub { margin:0 0 20px; color:#666; }
  input { width:100%; padding:14px; font-size:16px; border:2px solid var(--laranja);
          border-radius:12px; outline:none; }
  button { width:100%; margin-top:12px; padding:14px; font-size:16px; font-weight:600;
           border:0; border-radius:12px; background:var(--laranja); color:#fff; }
  button:disabled { opacity:.6; }
  #msg { margin-top:14px; color:#b00020; min-height:20px; }
  #baixar { display:none; background:#fff; color:var(--laranja); border:2px solid var(--laranja);
            text-align:center; text-decoration:none; padding:14px; border-radius:12px;
            font-weight:600; margin-top:12px; }
</style>
</head>
<body>
<main>
  <h1>Ajudante do Afiliado</h1>
  <p class="sub">Cole o link do Shopee Vídeo e baixe.</p>
  <input id="link" placeholder="Cole o link aqui" inputmode="url">
  <button id="buscar">Buscar vídeo</button>
  <div id="msg"></div>
  <a id="baixar" href="#">Baixar vídeo</a>
</main>
<script>
  const $ = id => document.getElementById(id);
  $("buscar").onclick = async () => {
    $("msg").textContent = ""; $("baixar").style.display = "none";
    $("buscar").disabled = true; $("buscar").textContent = "Buscando...";
    try {
      const r = await fetch("/api/resolver", {
        method: "POST", headers: {"Content-Type":"application/json"},
        body: JSON.stringify({ url: $("link").value.trim() })
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.erro);
      $("baixar").href = "/api/baixar?v=" + encodeURIComponent(d.video);
      $("baixar").style.display = "block";
    } catch (e) { $("msg").textContent = e.message || "Erro."; }
    $("buscar").disabled = false; $("buscar").textContent = "Buscar vídeo";
  };
</script>
</body>
</html>
