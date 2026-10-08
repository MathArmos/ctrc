// Item 25 · usos proibidos.
//
// 🔴 CADA PROIBICAO AQUI TEM UM MOTIVO, E DOIS DELES TEM NUMERO MEDIDO NESTE REPOSITORIO:
// o vermelho sobre preto da 3,80:1 (item 28) e abaixo do tamanho minimo a fidelidade cai e o
// contraforma entope (a mesma regua do item 23, rodada aqui num tamanho proibido).
// 📌 Proibicao sem motivo e gosto do autor, e manual cheio de gosto do autor nao e obedecido.
//
// ⚠️ O ERRADO E DESENHADO DE VERDADE, nunca descrito. Quem le um manual precisa reconhecer o
// erro quando o vir, e para isso ele tem de estar na pagina.
//
// Rodar: node proibidos.mjs

import { readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { palavra, letraC, letraR, letraCrua } from '../lettering/lettering.mjs';
import { simboloFinal } from '../simbolo-letra/simbolo.mjs';
import { caixa, mover, paraSVG } from '../lettering/contorno.mjs';

const require = createRequire(import.meta.url);
const sharp = require('/Users/math.ramos/dev/project-sosanimal/node_modules/sharp');
const { create } = await import('/Users/math.ramos/dev/project-sosanimal/node_modules/fontkitten/dist/index.js');

const U = 161.2;
const VERMELHO = '#DE0943';
const PRETO = '#111111';

const S = simboloFinal();
const cxS = caixa(S);
const P = palavra().pecas.flatMap((p) => p.cs);
const cxP = caixa(P);
const horizontal = [...S, ...mover(P, cxS.maxX + U - cxP.minX)];
const cxH = caixa(horizontal);

// ---- rotulos por contorno de glifo (Inter, SIL OFL, declarada em logs/licencas.md) ----
const ROT = create(readFileSync('../tipografia/fontes/inter/Inter[opsz,wght].ttf')).getVariation({ wght: 600, opsz: 14 });
function texto(t, tam) {
  const esc = tam / ROT.unitsPerEm; const d = []; let cur = 0;
  for (const g of ROT.glyphsForString(t)) {
    for (const c of g.path.commands) {
      const a = c.args; const X = (x) => +((x + cur) * esc).toFixed(2); const Y = (y) => +(-y * esc).toFixed(2);
      if (c.command === 'moveTo') d.push(`M${X(a[0])} ${Y(a[1])}`);
      else if (c.command === 'lineTo') d.push(`L${X(a[0])} ${Y(a[1])}`);
      else if (c.command === 'quadraticCurveTo') d.push(`Q${X(a[0])} ${Y(a[1])} ${X(a[2])} ${Y(a[3])}`);
      else if (c.command === 'bezierCurveTo') d.push(`C${X(a[0])} ${Y(a[1])} ${X(a[2])} ${Y(a[3])} ${X(a[4])} ${Y(a[5])}`);
      else if (c.command === 'closePath') d.push('Z');
    }
    cur += g.advanceWidth;
  }
  return d.join('');
}
const rot = (t, x, y, tam, cor = '#111') => `<g transform="translate(${x} ${y})" fill="${cor}"><path d="${texto(t, tam)}"/></g>`;

// ---- a regua do item 23, rodada aqui para PROVAR o tamanho proibido ----
// AVISO medido: resize com background sobre entrada de 1 canal devolve 3 canais.
// Todo caminho termina em .greyscale() antes do .raw().
const N = 400;
async function fidelidade(conts, capPx) {
  const cx = caixa(conts);
  const esc = capPx / 1000;
  const w = Math.max(1, Math.round(cx.largura * esc));
  const h = Math.max(1, Math.round(cx.altura * esc));
  const n = mover(conts, -cx.minX, -cx.minY);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${cx.largura.toFixed(2)} ${cx.altura.toFixed(2)}"><rect width="${cx.largura}" height="${cx.altura}" fill="#fff"/><path d="${paraSVG(n)}" fill="#000"/></svg>`;
  const grande = await sharp(Buffer.from(svg)).resize({ width: N, height: N, fit: 'fill' }).flatten({ background: '#fff' }).greyscale().raw().toBuffer();
  const peq = await sharp(Buffer.from(svg)).resize({ width: w, height: h, fit: 'fill' }).flatten({ background: '#fff' }).png().toBuffer();
  const reamp = await sharp(peq).resize({ width: N, height: N, fit: 'fill', kernel: 'nearest' }).greyscale().raw().toBuffer();
  let i = 0; let u = 0;
  for (let k = 0; k < grande.length; k++) {
    const a = grande[k] < 128; const b = reamp[k] < 128;
    if (a && b) i++; if (a || b) u++;
  }
  return +(i / (u || 1)).toFixed(3);
}

// quanto cada modificacao do item 14 muda de pixel, para o painel da fonte crua poder dizer
// um numero em vez de pedir fe. Mesma caixa para os dois, senao a normalizacao esconde a diferenca.
async function diferencaPct(a, b) {
  const cx = caixa([...a, ...b]);
  const N2 = 600;
  const mask = async (c) => {
    const n = mover(c, -cx.minX, -cx.minY);
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${cx.largura} ${cx.altura}"><rect width="${cx.largura}" height="${cx.altura}" fill="#fff"/><path d="${paraSVG(n)}" fill="#000"/></svg>`;
    return sharp(Buffer.from(svg)).resize({ width: N2, height: N2, fit: 'fill' }).flatten({ background: '#fff' }).greyscale().raw().toBuffer();
  };
  const A = await mask(a); const B = await mask(b);
  let d = 0;
  for (let k = 0; k < A.length; k++) if ((A[k] < 128) !== (B[k] < 128)) d++;
  return +((100 * d) / (N2 * N2)).toFixed(1);
}
const difC = await diferencaPct(letraCrua('C'), letraC());
const difR = await diferencaPct(letraCrua('R'), letraR().cs);

const fid16 = await fidelidade(horizontal, 16);
const fid10 = await fidelidade(horizontal, 10);
const fid8 = await fidelidade(horizontal, 8);

// ---- o corpo de cada painel ----
const CAP = 54;
const esc = CAP / 1000;
const nH = mover(horizontal, -cxH.minX, -cxH.minY);
const dH = paraSVG(nH);
const wH = cxH.largura * esc;
const hH = cxH.altura * esc;

const CAIXA_W = 380;
const CAIXA_H = 140;
function painel(interno, fundo = '#fff') {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${CAIXA_W}" height="${CAIXA_H}" viewBox="0 0 ${CAIXA_W} ${CAIXA_H}">
    <rect width="${CAIXA_W}" height="${CAIXA_H}" fill="${fundo}"/>
    ${interno}
    <rect x="0.5" y="0.5" width="${CAIXA_W - 1}" height="${CAIXA_H - 1}" fill="none" stroke="#E2E2E2" stroke-width="1"/>
  </svg>`;
}
// a marca certa, centrada, com uma transformacao aplicada por cima
const marca = (transform = '', fill = '#111', extra = '') => {
  const tx = (CAIXA_W - wH) / 2;
  const ty = (CAIXA_H - hH) / 2;
  return `<g transform="translate(${tx.toFixed(1)} ${ty.toFixed(1)})">${extra}<g transform="${transform}"><g transform="scale(${esc})"><path d="${dH}" fill="${fill}"/></g></g></g>`;
};

// a palavra digitada na fonte CRUA, para o painel 7
const cruaSvg = readFileSync('../tipografia/svg/CTRC-F4.svg', 'utf8');
const cruaD = [...cruaSvg.matchAll(/<path d="([^"]+)"/g)].map((m) => m[1]).join(' ');
const cruaTranslate = cruaSvg.match(/translate\(([-\d.]+)\s+([-\d.]+)\)/);
const cruaDx = cruaTranslate ? +cruaTranslate[1] : 0;
const cruaDy = cruaTranslate ? +cruaTranslate[2] : 0;

const PROIBIDOS = [
  {
    titulo: 'nao distorcer',
    motivo: 'escala nao uniforme muda a espessura de haste, e u = 161,2 e a unidade de que saem o vao, a protecao e o sistema inteiro',
    svg: painel(marca(`translate(${(wH * -0.18).toFixed(1)} 0) scale(1.36 1)`)),
  },
  {
    titulo: 'nao girar',
    motivo: 'a malha da D-07 e absoluta: horizontais a 0 graus e obliquas a 19 da vertical. Girar a assinatura leva as duas familias para angulo nenhum',
    svg: painel(marca(`rotate(-11 ${(wH / 2).toFixed(1)} ${(hH / 2).toFixed(1)})`)),
  },
  {
    titulo: 'nao pintar a palavra de vermelho no fundo escuro',
    motivo: 'MEDIDO no item 28: vermelho sobre preto da 3,80:1, abaixo do piso de 4,5 para texto normal. O simbolo pode, porque ele e grafismo; a palavra nao, porque ela e texto',
    svg: painel(marca('', VERMELHO), PRETO),
  },
  {
    titulo: 'nao recompor o vao',
    motivo: 'o vao simbolo|palavra e 1u, e e dele que a area de protecao do item 24 e derivada. Encostar os dois faz a assinatura ler CCTRC',
    svg: (() => {
      const vaoErrado = U * 0.12;
      const errado = [...S, ...mover(P, cxS.maxX + vaoErrado - cxP.minX)];
      const cx = caixa(errado);
      const n = mover(errado, -cx.minX, -cx.minY);
      const w = cx.largura * esc; const h = cx.altura * esc;
      return painel(`<g transform="translate(${((CAIXA_W - w) / 2).toFixed(1)} ${((CAIXA_H - h) / 2).toFixed(1)}) scale(${esc})"><path d="${paraSVG(n)}" fill="#111"/></g>`);
    })(),
  },
  {
    titulo: 'nao vazar em contorno',
    motivo: 'a marca e massa chapada. Vazada, ela perde o peso que a torna reconhecivel de longe, e o traco fecha o contraforma do C muito antes do tamanho minimo',
    svg: (() => {
      const tx = (CAIXA_W - wH) / 2; const ty = (CAIXA_H - hH) / 2;
      return painel(`<g transform="translate(${tx.toFixed(1)} ${ty.toFixed(1)}) scale(${esc})"><path d="${dH}" fill="none" stroke="#111" stroke-width="${(1.8 / esc).toFixed(0)}"/></g>`);
    })(),
  },
  {
    titulo: 'nao sombrear nem dar volume',
    motivo: 'a marca atual existe hoje em tres vermelhos porque cada acabamento a reinterpreta. A proposta tem uma cor so e uma espessura so, e sombra reabre essa porta',
    svg: painel(`${marca('translate(5 5)', '#BBBBBB')}${marca('', '#111')}`),
  },
  {
    titulo: 'nao digitar CTRC na fonte, o lettering e desenhado',
    motivo: `a Big Shoulders e a MATRIZ, e o item 14 fez tres modificacoes nela. Em preto o lettering, e por cima em vermelho o contorno da fonte crua: no C o corte dos dois terminais a 19 graus muda ${difC}% dos pixels, no R a perna vai para 19 graus e muda ${difR}%`,
    svg: (() => {
      const capG = 104; const e = capG / 1000;
      const pecas = [[letraCrua('C'), letraC()], [letraCrua('R'), letraR().cs]];
      let x = 46; const g = [];
      for (const [crua, feita] of pecas) {
        const cx = caixa([...crua, ...feita]);
        const nc = mover(crua, -cx.minX, -cx.minY);
        const nf = mover(feita, -cx.minX, -cx.minY);
        g.push(`<g transform="translate(${x.toFixed(1)} ${((CAIXA_H - cx.altura * e) / 2).toFixed(1)}) scale(${e})">` +
          `<path d="${paraSVG(nf)}" fill="#111"/>` +
          `<path d="${paraSVG(nc)}" fill="none" stroke="${VERMELHO}" stroke-width="${(1.6 / e).toFixed(0)}"/></g>`);
        x += cx.largura * e + 78;
      }
      return painel(g.join(''));
    })(),
  },
  {
    titulo: 'nao usar abaixo do tamanho minimo',
    motivo: `MEDIDO com a regua do item 23: a 16 px de caixa alta a fidelidade e ${fid16.toFixed(3)} e a folha aprova; a 10 px cai para ${fid10.toFixed(3)} e a 8 px para ${fid8.toFixed(3)}, com os contraformas entupindo. Aqui estao os tres, ampliados 3x`,
    svg: (() => {
      let x = 18; const g = [];
      for (const px of [16, 10, 8]) {
        const w = Math.max(1, Math.round(cxH.largura * (px / 1000)));
        const h = Math.max(1, Math.round(cxH.altura * (px / 1000)));
        g.push({ px, w, h, x });
        x += w * 3 + 22;
      }
      return { pedacos: g };
    })(),
  },
];

// ---- a folha ----
const LARG = 1240;
const cam = []; const txt = [];
txt.push(rot('Item 25 · usos proibidos', 50, 52, 26, '#000'));
txt.push(rot('cada proibicao tem um motivo, e dois deles tem numero medido neste repositorio', 50, 80, 14, '#666'));
txt.push(rot('o errado esta desenhado de verdade, e nunca so descrito: quem le um manual precisa reconhecer o erro quando o vir', 50, 100, 14, '#666'));

let y = 140;
let col = 0;
const COLS = 2;
const PASSO_X = 590;
const alturaItem = CAIXA_H + 92;

for (const p of PROIBIDOS) {
  const x = 50 + col * PASSO_X;
  if (p.svg.pedacos) {
    // o painel do tamanho minimo e montado com imagens reais ampliadas
    const sub = [];
    sub.push({ input: { create: { width: CAIXA_W, height: CAIXA_H, channels: 3, background: '#fff' } }, left: 0, top: 0 });
    for (const q of p.svg.pedacos) {
      const n = mover(horizontal, -cxH.minX, -cxH.minY);
      const svgPeca = `<svg xmlns="http://www.w3.org/2000/svg" width="${q.w}" height="${q.h}" viewBox="0 0 ${cxH.largura.toFixed(1)} ${cxH.altura.toFixed(1)}"><rect width="${cxH.largura}" height="${cxH.altura}" fill="#fff"/><path d="${paraSVG(n)}" fill="#111"/></svg>`;
      const peq = await sharp(Buffer.from(svgPeca)).flatten({ background: '#fff' }).png().toBuffer();
      const amp = await sharp(peq).resize({ width: q.w * 3, height: q.h * 3, kernel: 'nearest' }).png().toBuffer();
      sub.push({ input: amp, left: q.x, top: Math.round((CAIXA_H - q.h * 3) / 2) + 8 });
      sub.push({ input: Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${CAIXA_W}" height="${CAIXA_H}">${rot(`${q.px} px`, q.x, 24, 12, '#888')}</svg>`), left: 0, top: 0 });
    }
    const base = await sharp({ create: { width: CAIXA_W, height: CAIXA_H, channels: 3, background: '#fff' } }).composite(sub).png().toBuffer();
    cam.push({ input: await sharp(base).composite([{ input: Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${CAIXA_W}" height="${CAIXA_H}"><rect x="0.5" y="0.5" width="${CAIXA_W - 1}" height="${CAIXA_H - 1}" fill="none" stroke="#E2E2E2"/></svg>`), left: 0, top: 0 }]).png().toBuffer(), left: x, top: y });
  } else {
    cam.push({ input: await sharp(Buffer.from(p.svg)).png().toBuffer(), left: x, top: y });
  }
  // a tarja vermelha de proibido, no canto
  cam.push({ input: Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26"><circle cx="13" cy="13" r="12" fill="${VERMELHO}"/><path d="M7 7 L19 19 M19 7 L7 19" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/></svg>`), left: x + CAIXA_W - 34, top: y + 8 });

  txt.push(rot(p.titulo, x, y + CAIXA_H + 22, 15, '#000'));
  // o motivo, quebrado em linhas de largura fixa
  const palavras = p.motivo.split(' ');
  let linha = ''; let ly = y + CAIXA_H + 42;
  for (const w of palavras) {
    const tentativa = linha ? `${linha} ${w}` : w;
    let larg = 0; for (const g of ROT.glyphsForString(tentativa)) larg += g.advanceWidth;
    if ((larg * 12) / ROT.unitsPerEm > CAIXA_W + 110) { txt.push(rot(linha, x, ly, 12, '#555')); linha = w; ly += 16; }
    else linha = tentativa;
  }
  if (linha) txt.push(rot(linha, x, ly, 12, '#555'));

  col++;
  if (col === COLS) { col = 0; y += alturaItem; }
}
if (col !== 0) y += alturaItem;

const ALT = y + 20;
cam.push({ input: Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${LARG}" height="${ALT}">${txt.join('')}</svg>`), left: 0, top: 0 });
await sharp({ create: { width: LARG, height: ALT, channels: 3, background: '#fff' } }).composite(cam).png().toFile('verificacao/folha-07-proibidos.png');

writeFileSync('medidas-proibidos.json', JSON.stringify({
  item: 25,
  proibicoes: PROIBIDOS.map((p) => ({ titulo: p.titulo, motivo: p.motivo })),
  medidoAqui: { 'C crua->item14, pct de pixel diferente': difC, 'R crua->item14, pct de pixel diferente': difR, 'fidelidade 16px': fid16, 'fidelidade 10px': fid10, 'fidelidade 8px': fid8, piso: 0.85, origemDaRegua: 'item 23' },
}, null, 2));

console.log(`fidelidade da horizontal: 16px ${fid16}  10px ${fid10}  8px ${fid8}`);
console.log(`modificacoes do item 14: C muda ${difC}% dos pixels, R muda ${difR}%`);
console.log('verificacao/folha-07-proibidos.png', LARG, ALT);
