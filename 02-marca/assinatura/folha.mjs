// Folha da assinatura. Rodar: node folha.mjs
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
const png = async (c, p) => sharp(Buffer.from(em(c, p).svg)).flatten({ background: '#fff' }).png().toBuffer();
async function zoom(c, p, f) {
  const { svg, w, h } = em(c, p);
  const peq = await sharp(Buffer.from(svg)).resize({ width: w, height: h, fit: 'fill' }).flatten({ background: '#fff' }).png().toBuffer();
  return sharp(peq).resize({ width: w * f, height: h * f, kernel: 'nearest' }).png().toBuffer();
}

const H = 'svg/assinatura-horizontal.svg', V = 'svg/assinatura-vertical.svg', S = 'svg/simbolo.svg';
const cam = [], txt = [];
const W = 1240;
let y = 110;
txt.push(rot('CTRC · a assinatura', 50, 52, 28, '#000'));
txt.push(rot('simbolo S3 (CT travado) e lettering do item 14 · unidade do sistema u = 161,2, a espessura de haste medida', 50, 80, 14, '#666'));

const h1 = em(H, 150);
cam.push({ input: await png(H, 150), left: 50, top: y });
txt.push(rot('item 16 · horizontal, e tambem a principal (item 15) · vao de 1u entre simbolo e palavra', 50, y + h1.h + 32, 14, '#111'));
y += h1.h + 80;

const v1 = em(V, 150);
const s1 = em(S, 150);
cam.push({ input: await png(V, 150), left: 50, top: y });
cam.push({ input: await png(S, 150), left: 50 + v1.w + 110, top: y + (v1.h - s1.h) / 2 });
txt.push(rot('item 17 · vertical, vao 0,75u', 50, y + v1.h + 32, 14, '#111'));
txt.push(rot('item 18 · simbolo isolado', 50 + v1.w + 110, y + v1.h + 32, 14, '#111'));
y += v1.h + 80;

// reducao da assinatura horizontal
txt.push(rot('reducao da assinatura, por altura de caixa alta', 50, y + 20, 15, '#000'));
let x = 50;
for (const c of [48, 24, 16]) {
  const im = em(H, c);
  cam.push({ input: await png(H, c), left: x, top: y + 50 });
  txt.push(rot(`${c} px`, x, y + 44, 12, '#888'));
  x += im.w + 30;
}
const z = await zoom(H, 16, 6);
cam.push({ input: z, left: x + 20, top: y + 40 });
txt.push(rot('16 px a 6x', x + 20, y + 34, 12, '#888'));
y += 170;

const ALT = y + 40;
cam.push({ input: Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${ALT}">${txt.join('')}</svg>`), left: 0, top: 0 });
await sharp({ create: { width: W, height: ALT, channels: 3, background: '#fff' } }).composite(cam).png().toFile('verificacao/folha-01-assinatura.png');
console.log('verificacao/folha-01-assinatura.png', W, ALT);
