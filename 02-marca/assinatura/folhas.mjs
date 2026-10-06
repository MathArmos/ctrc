// Folhas de verificacao da assinatura e das variacoes. Rodar: node folhas.mjs
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { create } from '/Users/math.ramos/dev/project-sosanimal/node_modules/fontkitten/dist/index.js';
const require = createRequire(import.meta.url);
const sharp = require('/Users/math.ramos/dev/project-sosanimal/node_modules/sharp');

const ROT = create(readFileSync('../tipografia/fontes/inter/Inter[opsz,wght].ttf')).getVariation({ wght: 600, opsz: 14 });
function texto(t, tam) {
  const esc = tam / ROT.unitsPerEm; const d = []; let cur = 0;
  for (const g of ROT.glyphsForString(t)) {
    for (const c of g.path.commands) { const a = c.args; const X = (x) => +((x + cur) * esc).toFixed(2); const Y = (y) => +(-y * esc).toFixed(2);
      if (c.command === 'moveTo') d.push(`M${X(a[0])} ${Y(a[1])}`); else if (c.command === 'lineTo') d.push(`L${X(a[0])} ${Y(a[1])}`);
      else if (c.command === 'quadraticCurveTo') d.push(`Q${X(a[0])} ${Y(a[1])} ${X(a[2])} ${Y(a[3])}`);
      else if (c.command === 'bezierCurveTo') d.push(`C${X(a[0])} ${Y(a[1])} ${X(a[2])} ${Y(a[3])} ${X(a[4])} ${Y(a[5])}`); else if (c.command === 'closePath') d.push('Z'); }
    cur += g.advanceWidth; }
  return d.join('');
}
const rot = (t, x, y, tam, cor = '#111') => `<g transform="translate(${x} ${y})" fill="${cor}"><path d="${texto(t, tam)}"/></g>`;

function em(caminho, capPx) {
  const s = readFileSync(caminho, 'utf8');
  const vb = s.match(/viewBox="([^"]+)"/)[1].split(/\s+/).map(Number);
  const esc = capPx / 1000;
  const w = Math.max(1, Math.round(vb[2] * esc)), h = Math.max(1, Math.round(vb[3] * esc));
  return { svg: s.replace(/width="[\d.]+"/, `width="${w}"`).replace(/height="[\d.]+"/, `height="${h}"`), w, h };
}
const png = async (c, p, fundo = '#fff') => sharp(Buffer.from(em(c, p).svg)).flatten({ background: fundo }).png().toBuffer();
async function zoom(c, p, f, fundo = '#fff') {
  const { svg, w, h } = em(c, p);
  const peq = await sharp(Buffer.from(svg)).resize({ width: w, height: h, fit: 'fill' }).flatten({ background: fundo }).png().toBuffer();
  return sharp(peq).resize({ width: w * f, height: h * f, kernel: 'nearest' }).png().toBuffer();
}

// ---- folha 1: a assinatura ----
{
  const H = 'svg/assinatura-horizontal.svg', V = 'svg/assinatura-vertical.svg', S = 'svg/simbolo.svg';
  const cam = [], txt = [];
  const W = 1240;
  let y = 112;
  txt.push(rot('CTRC · a assinatura', 50, 52, 28, '#000'));
  txt.push(rot('simbolo: o C do lettering alargado em 116,4 por translacao · unidade do sistema u = 161,2, a espessura de haste medida', 50, 80, 14, '#666'));
  const h1 = em(H, 150);
  cam.push({ input: await png(H, 150), left: 50, top: y });
  txt.push(rot('item 15 e 16 · a principal, horizontal · vao de 1u entre simbolo e palavra', 50, y + h1.h + 32, 14, '#111'));
  y += h1.h + 80;
  const v1 = em(V, 150), s1 = em(S, 150);
  cam.push({ input: await png(V, 150), left: 50, top: y });
  cam.push({ input: await png(S, 150), left: 50 + v1.w + 130, top: y + Math.round((v1.h - s1.h) / 2) });
  txt.push(rot('item 17 · vertical, vao 0,75u', 50, y + v1.h + 32, 14, '#111'));
  txt.push(rot('item 18 · simbolo isolado', 50 + v1.w + 130, y + v1.h + 32, 14, '#111'));
  y += v1.h + 90;
  const ALT = y;
  cam.push({ input: Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${ALT}">${txt.join('')}</svg>`), left: 0, top: 0 });
  await sharp({ create: { width: W, height: ALT, channels: 3, background: '#fff' } }).composite(cam).png().toFile('verificacao/folha-01-assinatura.png');
  console.log('verificacao/folha-01-assinatura.png', W, ALT);
}

// ---- folha 2: positiva e negativa (itens 20, 21, 22) ----
{
  const W = 1240, ALT = 560;
  const cam = [], txt = [];
  txt.push(rot('Itens 20, 21 e 22 · monocromatica, positiva e negativa', 50, 50, 25, '#000'));
  txt.push(rot('uma cor chapada so, nos dois sentidos · o fundo escuro e provisorio (#111111) ate a paleta do item 27', 50, 76, 14, '#666'));
  const hp = em('svg/assinatura-horizontal-positiva.svg', 110);
  cam.push({ input: await png('svg/assinatura-horizontal-positiva.svg', 110), left: 50, top: 115 });
  txt.push(rot('positiva · marca escura sobre fundo claro', 50, 115 + hp.h + 28, 14, '#111'));
  // campo escuro para a negativa
  cam.push({ input: { create: { width: W - 100, height: hp.h + 80, channels: 3, background: '#111111' } }, left: 50, top: 300 });
  cam.push({ input: await png('svg/assinatura-horizontal-negativa.svg', 110, '#111111'), left: 90, top: 340 });
  txt.push(rot('negativa · marca clara sobre fundo escuro', 50, 300 + hp.h + 108, 14, '#111'));
  cam.push({ input: Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${ALT}">${txt.join('')}</svg>`), left: 0, top: 0 });
  await sharp({ create: { width: W, height: ALT, channels: 3, background: '#fff' } }).composite(cam).png().toFile('verificacao/folha-02-positiva-negativa.png');
  console.log('verificacao/folha-02-positiva-negativa.png', W, ALT);
}

// ---- folha 3: o teste de reducao MEDIDO (item 23) ----
{
  const med = JSON.parse(readFileSync('medidas-reducao.json', 'utf8')).tabela;
  const ARQ = { 'assinatura-horizontal': 'svg/assinatura-horizontal.svg', 'assinatura-vertical': 'svg/assinatura-vertical.svg', simbolo: 'svg/simbolo.svg' };
  const NOME = { 'assinatura-horizontal': 'assinatura horizontal', 'assinatura-vertical': 'assinatura vertical', simbolo: 'simbolo isolado' };
  const W = 1240;
  const cam = [], txt = [];
  txt.push(rot('Item 23 · teste de reducao, medido', 50, 50, 25, '#000'));
  txt.push(rot('48, 24 e 16 px de ALTURA DE CAIXA ALTA, em tamanho real · a direita, o de 16 px ampliado 5x', 50, 76, 14, '#666'));
  txt.push(rot('o numero e a fidelidade: IoU entre o reduzido reampliado e o mesmo desenho em tamanho grande', 50, 96, 14, '#666'));
  // 🔴 A AMPLIACAO VAI NUMA COLUNA FIXA E A ALTURA DA LINHA SAI DELA. Na primeira passada a
  // ampliacao da vertical (32x35 px a 7x = 245 de altura) invadia a linha de baixo, porque a
  // altura da linha estava escrita a mao e nao derivada do que ela precisa conter.
  const FATOR = 5;
  const COL_ZOOM = 620;
  let y = 140;
  for (const chave of Object.keys(ARQ)) {
    const linha = med.find((l) => l.peca === chave);
    const zi = em(ARQ[chave], 16);
    const alturaZoom = zi.h * FATOR;
    const alturaLinha = Math.max(alturaZoom, em(ARQ[chave], 48).h) + 34;
    let x = 60;
    for (const px of [48, 24, 16]) {
      const im = em(ARQ[chave], px);
      cam.push({ input: await png(ARQ[chave], px), left: x, top: y + alturaLinha - im.h - 26 });
      txt.push(rot(`${px} px · ${linha[`${px}px`].toFixed(3)}`, x, y + alturaLinha - 8, 12, '#888'));
      x += Math.max(im.w, 78) + 36;
    }
    cam.push({ input: await zoom(ARQ[chave], 16, FATOR), left: COL_ZOOM, top: y + alturaLinha - alturaZoom - 26 });
    txt.push(rot(`16 px a ${FATOR}x`, COL_ZOOM, y + alturaLinha - 8, 12, '#888'));
    txt.push(rot(NOME[chave], 60, y - 8, 15, '#000'));
    y += alturaLinha + 52;
  }
  txt.push(rot('piso do projeto: 0,85 em 16 px, com a folha de contato decidindo quando o numero fica no limite', 50, y + 6, 13, '#999'));
  txt.push(rot('a assinatura fica em 0,815 e 0,800 e a folha aprova: os quatro contraformas continuam abertos', 50, y + 26, 13, '#999'));
  const ALT = y + 50;
  cam.push({ input: Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${ALT}">${txt.join('')}</svg>`), left: 0, top: 0 });
  await sharp({ create: { width: W, height: ALT, channels: 3, background: '#fff' } }).composite(cam).png().toFile('verificacao/folha-03-reducao-medida.png');
  console.log('verificacao/folha-03-reducao-medida.png', W, ALT);
}

// ---- folha 5: a versao colorida (item 19) ----
{
  const W = 1240;
  const cam = [], txt = [];
  const a = em('svg/assinatura-horizontal-colorida.svg', 110);
  const b = em('svg/assinatura-horizontal-colorida-negativa.svg', 110);
  const v = em('svg/assinatura-vertical-colorida.svg', 110);
  txt.push(rot('Item 19 · a versao colorida', 50, 52, 26, '#000'));
  txt.push(rot('o simbolo leva a cor, a palavra leva a tinta. Um elemento colorido so, porque a paleta tem um vermelho so', 50, 78, 14, '#666'));
  cam.push({ input: await png('svg/assinatura-horizontal-colorida.svg', 110), left: 50, top: 120 });
  txt.push(rot('colorida positiva · simbolo #DE0943 sobre branco, 4,97:1', 50, 120 + a.h + 28, 14, '#111'));
  const yNeg = 120 + a.h + 70;
  cam.push({ input: { create: { width: W - 100, height: b.h + 70, channels: 3, background: '#111111' } }, left: 50, top: yNeg });
  cam.push({ input: await png('svg/assinatura-horizontal-colorida-negativa.svg', 110, '#111111'), left: 85, top: yNeg + 35 });
  txt.push(rot('colorida negativa · simbolo #DE0943 sobre #111111, 3,80:1, que passa como grafismo e reprovaria como texto', 50, yNeg + b.h + 98, 14, '#111'));
  const yV = yNeg + b.h + 130;
  cam.push({ input: await png('svg/assinatura-vertical-colorida.svg', 110), left: 50, top: yV });
  txt.push(rot('vertical colorida', 50, yV + v.h + 28, 14, '#111'));
  const H = yV + v.h + 60;
  cam.push({ input: Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">${txt.join('')}</svg>`), left: 0, top: 0 });
  await sharp({ create: { width: W, height: H, channels: 3, background: '#fff' } }).composite(cam).png().toFile('verificacao/folha-05-colorida.png');
  console.log('verificacao/folha-05-colorida.png', W, H);
}
