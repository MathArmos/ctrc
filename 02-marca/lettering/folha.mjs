// Item 14 · folhas de contato. Rodar: node folha.mjs
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { create } from '/Users/math.ramos/dev/project-sosanimal/node_modules/fontkitten/dist/index.js';
const require = createRequire(import.meta.url);
const sharp = require('/Users/math.ramos/dev/project-sosanimal/node_modules/sharp');

const ROT = create(readFileSync('../tipografia/fontes/inter/Inter[opsz,wght].ttf')).getVariation({ wght: 600, opsz: 14 });
function texto(t, tam) {
  const esc = tam / ROT.unitsPerEm;
  const d = [];
  let cur = 0;
  for (const g of ROT.glyphsForString(t)) {
    for (const c of g.path.commands) {
      const a = c.args;
      const X = (x) => +((x + cur) * esc).toFixed(2);
      const Y = (y) => +(-y * esc).toFixed(2);
      if (c.command === 'moveTo') d.push(`M${X(a[0])} ${Y(a[1])}`);
      else if (c.command === 'lineTo') d.push(`L${X(a[0])} ${Y(a[1])}`);
      else if (c.command === 'quadraticCurveTo') d.push(`Q${X(a[0])} ${Y(a[1])} ${X(a[2])} ${Y(a[3])}`);
      else if (c.command === 'bezierCurveTo') d.push(`C${X(a[0])} ${Y(a[1])} ${X(a[2])} ${Y(a[3])} ${X(a[4])} ${Y(a[5])}`);
      else if (c.command === 'closePath') d.push('Z');
    }
    cur += g.advanceWidth;
  }
  return { d: d.join(''), w: cur * esc };
}
const rot = (t, x, y, tam, cor = '#111') => `<g transform="translate(${x} ${y})" fill="${cor}"><path d="${texto(t, tam).d}"/></g>`;

function em(caminho, capPx) {
  const s = readFileSync(caminho, 'utf8');
  const vb = s.match(/viewBox="([^"]+)"/)[1].split(/\s+/).map(Number);
  const esc = capPx / 1000;
  const w = Math.max(1, Math.round(vb[2] * esc));
  const h = Math.max(1, Math.round(vb[3] * esc));
  return { svg: s.replace(/width="[\d.]+"/, `width="${w}"`).replace(/height="[\d.]+"/, `height="${h}"`), w, h };
}
const png = async (c, p) => sharp(Buffer.from(em(c, p).svg)).flatten({ background: '#fff' }).png().toBuffer();
async function zoom(c, p, f) {
  const { svg, w, h } = em(c, p);
  const peq = await sharp(Buffer.from(svg)).resize({ width: w, height: h, fit: 'fill' }).flatten({ background: '#fff' }).png().toBuffer();
  return sharp(peq).resize({ width: w * f, height: h * f, kernel: 'nearest' }).png().toBuffer();
}

const FONTE = '../tipografia/svg/CTRC-F4.svg';
const LET = 'svg/lettering-ctrc.svg';

// --- folha 1: a fonte e o lettering, grandes, um sobre o outro ---
{
  const a = em(FONTE, 230), b = em(LET, 230);
  const W = Math.max(a.w, b.w) + 130, H = 120 + a.h + 120 + b.h + 70;
  const cam = [
    { input: await png(FONTE, 230), left: 65, top: 100 },
    { input: await png(LET, 230), left: 65, top: 100 + a.h + 120 },
  ];
  const t = [
    rot('Item 14 · o lettering CTRC', 65, 48, 26, '#000'),
    rot('matriz Big Shoulders Display 800 (SIL OFL 1.1), em curvas e modificada', 65, 74, 14, '#666'),
    rot('a fonte como vem', 65, 100 + a.h + 36, 15, '#999'),
    rot('o lettering: perna do R e terminais do C a 19 graus da vertical, vaos redesenhados', 65, 100 + a.h + 100 + b.h + 46, 15, '#111'),
  ].join('');
  cam.push({ input: Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">${t}</svg>`), left: 0, top: 0 });
  await sharp({ create: { width: W, height: H, channels: 3, background: '#fff' } }).composite(cam).png().toFile('verificacao/folha-01-antes-e-depois.png');
  console.log('verificacao/folha-01-antes-e-depois.png', W, H);
}

// --- folha 2: reducao ---
{
  const CAPS = [48, 24, 16];
  const F = 7;
  const W = 1120, H = 430;
  const cam = [];
  let x = 60;
  const t = [rot('Item 14 · reducao do lettering, por altura de caixa alta', 60, 44, 24, '#000'),
             rot('as tres da esquerda em TAMANHO REAL · a da direita e o de 16 px ampliado 7x', 60, 70, 14, '#666')];
  for (const c of CAPS) {
    const im = em(LET, c);
    cam.push({ input: await png(LET, c), left: x, top: 150 });
    cam.push({ input: await png(LET, c), left: x, top: 260 });
    t.push(rot(`${c} px`, x, 130, 14, '#333'));
    x += im.w + 34;
  }
  const z = await zoom(LET, 16, F);
  const zi = em(LET, 16);
  cam.push({ input: z, left: x + 20, top: 150 });
  t.push(rot('16 px a 7x', x + 20, 130, 14, '#333'));
  t.push(rot('a linha de cima e o lettering; a de baixo repete para conferir a leitura', 60, 390, 13, '#999'));
  cam.push({ input: Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">${t.join('')}</svg>`), left: 0, top: 0 });
  await sharp({ create: { width: W, height: H, channels: 3, background: '#fff' } }).composite(cam).png().toFile('verificacao/folha-02-reducao.png');
  console.log('verificacao/folha-02-reducao.png', W, H);
}
