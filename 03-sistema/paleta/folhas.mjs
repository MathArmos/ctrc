// Folhas dos itens 27 e 28. Rodar: node folhas.mjs
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { create } from '/Users/math.ramos/dev/project-sosanimal/node_modules/fontkitten/dist/index.js';
import { PALETA, contraste } from './paleta.mjs';
const require = createRequire(import.meta.url);
const sharp = require('/Users/math.ramos/dev/project-sosanimal/node_modules/sharp');

const ROT = create(readFileSync('../../02-marca/tipografia/fontes/inter/Inter[opsz,wght].ttf')).getVariation({ wght: 600, opsz: 14 });
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
const rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));

// ---- folha 1: a paleta ----
{
  const W = 1240, H = 560;
  const nomes = Object.keys(PALETA);
  const t = [rot('Item 27 · a paleta', 50, 52, 26, '#000'),
    rot('um vermelho so, porque o eixo conceitual acusa os tres da marca atual como defeito', 50, 78, 14, '#666')];
  const cam = [];
  const CH = 240, CW = 250;
  nomes.forEach((n, i) => {
    const p = PALETA[n];
    const x = 50 + i * (CW + 24);
    cam.push({ input: { create: { width: CW, height: CH, channels: 3, background: p.hex } }, left: x, top: 120 });
    if (n === 'ctrc-branco') cam.push({ input: Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${CW}" height="${CH}"><rect x="0.5" y="0.5" width="${CW - 1}" height="${CH - 1}" fill="none" stroke="#ddd"/></svg>`), left: x, top: 120 });
    t.push(rot(n, x, 392, 17, '#000'));
    t.push(rot(p.hex, x, 416, 15, '#444'));
    t.push(rot(`rgb(${p.rgb.join(', ')})`, x, 438, 13, '#777'));
    t.push(rot(`cmyk(${p.cmyk.join(', ')})`, x, 458, 13, '#777'));
    t.push(rot(p.papel, x, 482, 12, '#999'));
  });
  t.push(rot('o CMYK e ingenuo, sem perfil: orienta e nao fecha impressao. Pantone nao esta declarado, e o porque esta em resultado.md', 50, 524, 13, '#999'));
  cam.push({ input: Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">${t.join('')}</svg>`), left: 0, top: 0 });
  await sharp({ create: { width: W, height: H, channels: 3, background: '#fff' } }).composite(cam).png().toFile('verificacao/folha-01-paleta.png');
  console.log('verificacao/folha-01-paleta.png');
}

// ---- folha 2: o teste de contraste, com texto de verdade ----
{
  const PARES = [
    ['ctrc-branco', 'ctrc-vermelho'],
    ['ctrc-vermelho', 'ctrc-branco'],
    ['ctrc-branco', 'ctrc-preto'],
    ['ctrc-preto', 'ctrc-branco'],
    ['ctrc-vermelho', 'ctrc-preto'],
    ['ctrc-cinza', 'ctrc-branco'],
  ];
  const W = 1240;
  const LH = 112;
  const H = 150 + PARES.length * LH + 60;
  const t = [rot('Item 28 · teste de contraste, medido', 50, 52, 26, '#000'),
    rot('piso do RNF-04: 4,5:1 para texto normal, 3,0:1 para texto grande e para grafismo', 50, 78, 14, '#666'),
    rot('cada faixa traz o texto de verdade nos dois tamanhos, para o numero poder ser conferido no olho', 50, 98, 14, '#666')];
  const cam = [];
  PARES.forEach(([tinta, fundo], i) => {
    const y = 140 + i * LH;
    const c = contraste(rgb(PALETA[tinta].hex), rgb(PALETA[fundo].hex));
    cam.push({ input: { create: { width: W - 100, height: LH - 14, channels: 3, background: PALETA[fundo].hex } }, left: 50, top: y });
    if (fundo === 'ctrc-branco') cam.push({ input: Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W - 100}" height="${LH - 14}"><rect x="0.5" y="0.5" width="${W - 101}" height="${LH - 15}" fill="none" stroke="#e4e4e4"/></svg>`), left: 50, top: y });
    const amostra = `<svg xmlns="http://www.w3.org/2000/svg" width="${W - 100}" height="${LH - 14}">`
      + rot('CENTRO DE TREINAMENTO RENATO CARIANI', 24, 42, 26, PALETA[tinta].hex)
      + rot('texto normal de 14 px, que e o que o piso de 4,5:1 protege', 24, 72, 14, PALETA[tinta].hex)
      + '</svg>';
    cam.push({ input: Buffer.from(amostra), left: 50, top: y });
    const veredito = `${c.toFixed(2)}:1  ·  normal ${c >= 4.5 ? 'passa' : 'REPROVA'}  ·  grande ${c >= 3 ? 'passa' : 'REPROVA'}`;
    cam.push({ input: Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W - 100}" height="${LH - 14}">${rot(veredito, W - 480, 72, 15, PALETA[tinta].hex)}${rot(`${tinta} sobre ${fundo}`, W - 480, 42, 14, PALETA[tinta].hex)}</svg>`), left: 50, top: y });
  });
  t.push(rot('o vermelho sobre o preto da 3,80:1: ele NAO carrega texto normal no fundo escuro.', 50, H - 40, 14, '#000'));
  t.push(rot('Passa como texto grande e como grafismo, e e por isso que na versao colorida a palavra fica em tinta e so o simbolo e vermelho.', 50, H - 20, 13, '#666'));
  cam.push({ input: Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">${t.join('')}</svg>`), left: 0, top: 0 });
  await sharp({ create: { width: W, height: H, channels: 3, background: '#fff' } }).composite(cam).png().toFile('verificacao/folha-02-contraste.png');
  console.log('verificacao/folha-02-contraste.png');
}
