// Item 29 · folhas de contato das oito candidatas. E a folha que decide, o numero e companhia.
//
// Rodar: node medir.mjs   (depois de compor.mjs)
//
// 🔴 CONVENCAO DE REDUCAO, E ELA E DIFERENTE DA DO SIMBOLO. O item 12 reduziu o simbolo
// dentro de uma caixa QUADRADA de 48, 24 e 16 px, porque simbolo tem razao perto de 1.
// CTRC tem razao de 2,0 a 4,2: numa caixa de 16x16 ele sairia com 4 px de altura, que nao e
// teste de nada. Aqui a reducao e pela ALTURA DE CAIXA ALTA: 48, 24 e 16 px de caixa alta,
// que e a dimensao por onde logotipo e de fato limitado em uso. Declarado, nao herdado.
//
// AVISO medido (contrato da rota, secao 4): resize com `background` sobre entrada de 1 canal
// devolve 3 canais. Todo caminho de medicao termina em .greyscale() antes do .raw().
//
// Os rotulos sao desenhados com o CONTORNO da Inter, e nunca com <text> e fonte do sistema:
// se a folha virar pagina do PDF, tudo nela e OFL declarado em logs/licencas.md.

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { create } from '/Users/math.ramos/dev/project-sosanimal/node_modules/fontkitten/dist/index.js';

const require = createRequire(import.meta.url);
const sharp = require('/Users/math.ramos/dev/project-sosanimal/node_modules/sharp');

const CFG = JSON.parse(readFileSync('candidatas.json', 'utf8'));
const MED = JSON.parse(readFileSync('medidas.json', 'utf8'));
const porId = Object.fromEntries(MED.familias.map((f) => [f.id, f]));

// ---------- rotulos por contorno de glifo ----------

const ROT = create(readFileSync('fontes/inter/Inter[opsz,wght].ttf')).getVariation({ wght: 600, opsz: 14 });
const ROT_UPEM = ROT.unitsPerEm;

function textoParaPath(texto, tamanho) {
  const glifos = ROT.glyphsForString(texto);
  const esc = tamanho / ROT_UPEM;
  const d = [];
  let cursor = 0;
  for (const g of glifos) {
    for (const c of g.path.commands) {
      const a = c.args;
      const X = (x) => +((x + cursor) * esc).toFixed(2);
      const Y = (y) => +(-y * esc).toFixed(2);
      if (c.command === 'moveTo') d.push(`M${X(a[0])} ${Y(a[1])}`);
      else if (c.command === 'lineTo') d.push(`L${X(a[0])} ${Y(a[1])}`);
      else if (c.command === 'quadraticCurveTo') d.push(`Q${X(a[0])} ${Y(a[1])} ${X(a[2])} ${Y(a[3])}`);
      else if (c.command === 'bezierCurveTo') d.push(`C${X(a[0])} ${Y(a[1])} ${X(a[2])} ${Y(a[3])} ${X(a[4])} ${Y(a[5])}`);
      else if (c.command === 'closePath') d.push('Z');
    }
    cursor += g.advanceWidth;
  }
  return { d: d.join(''), largura: +(cursor * esc).toFixed(2) };
}

// corta o texto para caber na coluna. Rotulo encostando na arte foi defeito da primeira
// passada, e rotulo em cima da letra estraga justamente a leitura que a folha existe para dar.
function cabe(texto, maxLargura, tamanho) {
  if (textoParaPath(texto, tamanho).largura <= maxLargura) return texto;
  let t = texto;
  while (t.length > 1 && textoParaPath(t + '...', tamanho).largura > maxLargura) t = t.slice(0, -1);
  return t.trimEnd() + '...';
}

function rotulo(texto, x, yBase, tamanho, cor = '#111', maxLargura = null) {
  const txt = maxLargura ? cabe(texto, maxLargura, tamanho) : texto;
  const { d } = textoParaPath(txt, tamanho);
  return `<g transform="translate(${x} ${yBase})" fill="${cor}"><path d="${d}"/></g>`;
}

// ---------- o CTRC de cada familia, em px ----------

// o SVG composto tem caixa alta = 1000 unidades. Para sair com caixa alta de `capPx`,
// a escala e capPx/1000 e a altura total vira alturaTotal * escala.
function ctrcSVG(id, capPx) {
  const m = porId[id];
  const bruto = readFileSync(m.svg, 'utf8');
  const corpo = bruto.slice(bruto.indexOf('<g '), bruto.lastIndexOf('</g>') + 4);
  const esc = capPx / 1000;
  const w = m.larguraTotal * esc;
  const h = m.alturaTotal * esc;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${Math.max(1, Math.round(w))}" height="${Math.max(1, Math.round(h))}" viewBox="0 0 ${m.larguraTotal} ${m.alturaTotal}"><rect width="${m.larguraTotal}" height="${m.alturaTotal}" fill="#fff"/>${corpo}</svg>`;
  return { svg, w: Math.max(1, Math.round(w)), h: Math.max(1, Math.round(h)) };
}

async function pngDoCTRC(id, capPx) {
  const { svg } = ctrcSVG(id, capPx);
  return sharp(Buffer.from(svg)).flatten({ background: '#fff' }).png().toBuffer();
}

// reduz de verdade e reamplia por vizinho mais proximo, para o pixel aparecer
async function pngReduzidoAmpliado(id, capPx, fator) {
  const { svg, w, h } = ctrcSVG(id, capPx);
  const peq = await sharp(Buffer.from(svg)).resize({ width: w, height: h, fit: 'fill' }).flatten({ background: '#fff' }).png().toBuffer();
  return sharp(peq).resize({ width: w * fator, height: h * fator, kernel: 'nearest' }).png().toBuffer();
}

// ---------- medida de tinta, em cima do raster de verdade ----------

async function tinta(id) {
  const { svg, w, h } = ctrcSVG(id, 600);
  const { data, info } = await sharp(Buffer.from(svg)).flatten({ background: '#fff' }).greyscale().raw().toBuffer({ resolveWithObject: true });
  let escuros = 0;
  for (let i = 0; i < data.length; i++) if (data[i] < 128) escuros++;
  return { pct: +((escuros / (info.width * info.height)) * 100).toFixed(1), w, h };
}

// ---------- folhas ----------

mkdirSync('verificacao', { recursive: true });
const IDS = CFG.familias.map((f) => f.id);
const CAP_GRANDE = 88;

// --- folha 1: as oito em grande ---
{
  const COL_ROT = 364;
  const UTIL = COL_ROT - 64;
  const larguras = await Promise.all(IDS.map(async (id) => (await pngDoCTRC(id, CAP_GRANDE)).length && ctrcSVG(id, CAP_GRANDE).w));
  const maxW = Math.max(...larguras);
  const LARG = COL_ROT + maxW + 48;
  const ALT_LINHA = 150;
  const TOPO = 118;
  const ALT = TOPO + IDS.length * ALT_LINHA + 56;

  const camadas = [];
  const textos = [];
  textos.push(rotulo('Item 29 · CTRC nas oito familias candidatas', 32, 52, 26, '#000'));
  textos.push(rotulo(`todas na mesma altura de caixa alta (${CAP_GRANDE} px) · preto sobre branco · licenca SIL OFL 1.1`, 32, 80, 15, '#555'));
  textos.push(rotulo('kerning nao aplicado: avanco natural de cada glifo, tracking 0', 32, 100, 15, '#555'));

  for (let i = 0; i < IDS.length; i++) {
    const id = IDS[i];
    const cand = CFG.familias[i];
    const m = porId[id];
    const y = TOPO + i * ALT_LINHA;
    const img = await pngDoCTRC(id, CAP_GRANDE);
    const { w, h } = ctrcSVG(id, CAP_GRANDE);
    camadas.push({ input: img, left: COL_ROT, top: Math.round(y + (ALT_LINHA - h) / 2) });
    textos.push(rotulo(`${id}  ${cand.familia}`, 32, y + 46, 20, '#000', UTIL));
    textos.push(rotulo(cand.natureza, 32, y + 70, 13, '#666', UTIL));
    const o = m.obliquaPrincipal;
    const diag = o
      ? `obliqua ${o.anguloGraus}gr (${o.daVertical}gr da vertical) · erra ${o.distanciaAoAlvo}gr da malha`
      : 'nenhuma aresta obliqua: so horizontal e vertical';
    textos.push(rotulo(diag, 32, y + 92, 12, '#999', UTIL));
    textos.push(rotulo(`razao ${m.razao.toFixed(2)}`, 32, y + 112, 12, '#999', UTIL));
    if (i < IDS.length - 1) {
      camadas.push({ input: { create: { width: LARG - 64, height: 1, channels: 3, background: '#e2e2e2' } }, left: 32, top: y + ALT_LINHA - 1 });
    }
  }

  const camadaTexto = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${LARG}" height="${ALT}">${textos.join('')}</svg>`);
  await sharp({ create: { width: LARG, height: ALT, channels: 3, background: '#fff' } })
    .composite([...camadas, { input: camadaTexto, left: 0, top: 0 }])
    .png()
    .toFile('verificacao/folha-01-oito-em-grande.png');
  console.log(`verificacao/folha-01-oito-em-grande.png  ${LARG}x${ALT}`);
}

// --- folha 2: reducao a 48, 24 e 16 px de caixa alta, real e ampliada ---
const tabela = [];
{
  const COL_ROT = 258;
  const CAPS = [48, 24, 16];
  const FATOR = 6;
  const colsReal = CAPS.map((c) => Math.max(...IDS.map((id) => ctrcSVG(id, c).w)) + 26);
  const colZoom = Math.max(...IDS.map((id) => ctrcSVG(id, 16).w)) * FATOR + 30;
  const LARG = COL_ROT + colsReal.reduce((a, b) => a + b, 0) + colZoom + 48;
  const ALT_LINHA = 122;
  const TOPO = 126;
  const ALT = TOPO + IDS.length * ALT_LINHA + 48;

  const camadas = [];
  const textos = [];
  textos.push(rotulo('Item 29 · reducao das oito: 48, 24 e 16 px de altura de caixa alta', 32, 50, 24, '#000'));
  textos.push(rotulo('as tres primeiras colunas estao em TAMANHO REAL. A ultima e o de 16 px ampliado 6x por', 32, 76, 14, '#555'));
  textos.push(rotulo('vizinho mais proximo, para o pixel aparecer. Quem decide e esta folha, nao o numero.', 32, 96, 14, '#555'));

  let x = COL_ROT;
  const xs = [];
  for (let k = 0; k < CAPS.length; k++) { xs.push(x); textos.push(rotulo(`${CAPS[k]} px`, x, TOPO - 14, 14, '#333')); x += colsReal[k]; }
  const xZoom = x;
  textos.push(rotulo('16 px a 6x', xZoom, TOPO - 14, 14, '#333'));

  for (let i = 0; i < IDS.length; i++) {
    const id = IDS[i];
    const cand = CFG.familias[i];
    const y = TOPO + i * ALT_LINHA;
    textos.push(rotulo(`${id}  ${cand.familia}`, 32, y + 56, 16, '#000', COL_ROT - 56));

    for (let k = 0; k < CAPS.length; k++) {
      const cap = CAPS[k];
      const img = await pngDoCTRC(id, cap);
      const { h } = ctrcSVG(id, cap);
      camadas.push({ input: img, left: xs[k], top: Math.round(y + (ALT_LINHA - h) / 2) });
    }
    const zoom = await pngReduzidoAmpliado(id, 16, FATOR);
    const hz = ctrcSVG(id, 16).h * FATOR;
    camadas.push({ input: zoom, left: xZoom, top: Math.round(y + (ALT_LINHA - hz) / 2) });

    const t = await tinta(id);
    tabela.push({ id, familia: cand.familia, tinta: t.pct, larguraA16: ctrcSVG(id, 16).w, alturaA16: ctrcSVG(id, 16).h });

    if (i < IDS.length - 1) {
      camadas.push({ input: { create: { width: LARG - 64, height: 1, channels: 3, background: '#e8e8e8' } }, left: 32, top: y + ALT_LINHA - 1 });
    }
  }

  const camadaTexto = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${LARG}" height="${ALT}">${textos.join('')}</svg>`);
  await sharp({ create: { width: LARG, height: ALT, channels: 3, background: '#fff' } })
    .composite([...camadas, { input: camadaTexto, left: 0, top: 0 }])
    .png()
    .toFile('verificacao/folha-02-reducao.png');
  console.log(`verificacao/folha-02-reducao.png  ${LARG}x${ALT}`);
}

// ---------- fecha medidas.json com tinta e caixa a 16 px ----------
for (const linha of tabela) {
  const m = porId[linha.id];
  m.tintaPct = linha.tinta;
  m.a16px = { largura: linha.larguraA16, altura: linha.alturaA16 };
}
writeFileSync('medidas.json', JSON.stringify(MED, null, 2));

const col = (s, n) => String(s).padEnd(n);
console.log('\nid  familia                tinta%  largura a 16 px de caixa alta');
console.log('-'.repeat(68));
for (const l of tabela) {
  console.log(col(l.id, 4) + col(l.familia, 23) + col(l.tinta.toFixed(1), 8) + `${l.larguraA16} x ${l.alturaA16} px`);
}
