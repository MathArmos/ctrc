import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
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

const IDS = ['S1', 'S2', 'S3', 'S4'];
const NOMES = { S1: 'o C sozinho', S2: 'C e T compostos', S3: 'CT travado, barra continua', S4: 'CT travado, haste na boca' };
const MED = { S1: '0,466 · tinta 24,2% · chevron 0,360', S2: '0,955 · tinta 43,6% · chevron 0,157', S3: '0,779 · tinta 42,3% · chevron 0,283', S4: '0,721 · tinta 38,5% · chevron 0,307' };
const COL = 290, ALT = 420, TOPO = 120;
const cam = []; const txt = [rot('Item 13 · quatro derivacoes do simbolo, todas tiradas da letra', 40, 46, 24, '#000'),
  rot('grande · 48 · 24 · 16 px em caixa quadrada, e o de 16 px ampliado 8x', 40, 72, 14, '#666')];
for (let i = 0; i < IDS.length; i++) {
  const id = IDS[i]; const x = 40 + i * COL;
  const svg = readFileSync(`svg/${id}.svg`, 'utf8');
  const grande = await sharp(Buffer.from(svg)).resize({ width: 170, height: 170, fit: 'inside' }).flatten({ background: '#fff' }).png().toBuffer();
  cam.push({ input: grande, left: x, top: TOPO });
  let xx = x;
  for (const px of [48, 24, 16]) {
    const p = await sharp(Buffer.from(svg)).resize({ width: px, height: px, fit: 'inside' }).flatten({ background: '#fff' }).png().toBuffer();
    const m = await sharp(p).metadata();
    cam.push({ input: p, left: xx, top: TOPO + 200 + (48 - m.height) });
    xx += m.width + 14;
  }
  const p16 = await sharp(Buffer.from(svg)).resize({ width: 16, height: 16, fit: 'inside' }).flatten({ background: '#fff' }).png().toBuffer();
  const m16 = await sharp(p16).metadata();
  cam.push({ input: await sharp(p16).resize({ width: m16.width * 8, height: m16.height * 8, kernel: 'nearest' }).png().toBuffer(), left: x, top: TOPO + 265 });
  txt.push(rot(`${id}  ${NOMES[id]}`, x, TOPO + 410, 13, '#000'));
  txt.push(rot(`razao ${MED[id]}`, x, TOPO + 428, 11, '#888'));
}
const W = 40 + IDS.length * COL, H = TOPO + 460;
cam.push({ input: Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">${txt.join('')}</svg>`), left: 0, top: 0 });
await sharp({ create: { width: W, height: H, channels: 3, background: '#fff' } }).composite(cam).png().toFile('verificacao/folha-00-quatro.png');
console.log('verificacao/folha-00-quatro.png', W, H);
