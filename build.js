import { MAINTENANCE } from "./src/config.js";
import { execSync } from "node:child_process";
import { rmSync, mkdirSync, copyFileSync, cpSync, readFileSync, writeFileSync } from "node:fs";

const DIST = "dist";

// Lista do que o browser pode carregar no site publicado. Se um pacote de npm
// for comprometido, o código dele não consegue enviar nada para fora.
// Ao acrescentar um serviço novo (imagens, embeds), juntar aqui.
// Só vai para o build de produção: no npm run dev partia o recarregamento
// automático do Parcel.
const CSP = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self'",
  "img-src 'self' data: https://crafthead.net https://mc-heads.net https://minotar.net",
  "connect-src 'self'",
  "frame-src https://player.twitch.tv https://www.youtube.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'none'",
].join("; ");

function addCsp(file) {
  const html = readFileSync(file, "utf8");
  const meta = `<meta http-equiv="Content-Security-Policy" content="${CSP}">`;
  // Logo a seguir a <html>: a CSP só se aplica ao que vem depois dela, e o
  // Parcel põe o <link> do CSS antes do <meta charset>.
  writeFileSync(file, html.replace(/<html[^>]*>/i, m => m + meta));
}

if (MAINTENANCE) {
  rmSync(DIST, { recursive: true, force: true });
  mkdirSync(DIST, { recursive: true });
  copyFileSync("maintenance.html", `${DIST}/index.html`);
  cpSync("public", DIST, { recursive: true });
} else {
  execSync("parcel build index.html --dist-dir dist --public-url /", { stdio: "inherit" });
  addCsp(`${DIST}/index.html`);
}
