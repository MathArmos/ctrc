// Item 24 · a area de protecao e o tamanho minimo.
//
// 🔴 A AREA DE PROTECAO E DERIVADA DO MAIOR VAO INTERNO, e nunca escolhida no olho.
// O raciocinio inteiro cabe numa frase: se um elemento de fora puder chegar mais perto da
// palavra do que o SIMBOLO esta, ele entra na leitura da assinatura. Entao o piso e o maior
// vao interno de tinta, e o valor adotado e o menor multiplo inteiro de `u` que o supera
// ESTRITAMENTE. Empatar nao serve: a 1u o elemento de fora fica exatamente tao longe quanto
// o simbolo, e ai a leitura e ambigua.
//
// 📌 Os vaos internos sao MEDIDOS aqui, caixa de tinta contra caixa de tinta, e nao lidos da
// constante `VAOS` do item 14. A constante diz o que foi pedido; a caixa diz o que saiu.
//
// O tamanho minimo nao e escolhido aqui tampouco: ele e o piso do item 23, que ja foi medido
// e aprovado na folha de contato. Esta pagina so o converte para as unidades em que alguem
// de fato aplica a marca: largura total em px e altura de caixa alta em mm a 300 dpi.
//
// Rodar: node protecao.mjs

import { readFileSync, writeFileSync } from 'node:fs';
import { palavra, VAOS } from '../lettering/lettering.mjs';
import { simboloFinal } from '../simbolo-letra/simbolo.mjs';
import { caixa, mover, paraSVG } from '../lettering/contorno.mjs';
import { U } from './assinatura.mjs';

const f1 = (n) => +n.toFixed(1);

// --- as pecas ---
const S = simboloFinal();
const cxS = caixa(S);
const pecas = palavra().pecas;
const P = pecas.flatMap((p) => p.cs);
const cxP = caixa(P);

const horizontal = [...S, ...mover(P, cxS.maxX + U - cxP.minX)];
const vertical = (() => {
  const vao = U * 0.75;
  const larg = Math.max(cxS.largura, cxP.largura);
  return [
    ...mover(S, (larg - cxS.largura) / 2 - cxS.minX),
    ...mover(P, (larg - cxP.largura) / 2 - cxP.minX, cxS.maxY + vao - cxP.minY),
  ];
})();

// --- 1. os vaos internos, MEDIDOS caixa a caixa ---
const cxL = pecas.map((p) => caixa(p.cs));
const vaosInternos = [];
for (let i = 1; i < cxL.length; i++) {
  vaosInternos.push({ onde: `letra ${i} contra letra ${i + 1}`, vao: f1(cxL[i].minX - cxL[i - 1].maxX) });
}
vaosInternos.push({ onde: 'simbolo contra palavra (horizontal)', vao: f1(U) });
vaosInternos.push({ onde: 'simbolo contra palavra (vertical)', vao: f1(U * 0.75) });

const maiorVao = Math.max(...vaosInternos.map((v) => v.vao));
// o menor multiplo INTEIRO de u que supera estritamente o maior vao interno
const MULT = Math.floor(maiorVao / U) + 1;
const PROTECAO = +(MULT * U).toFixed(1);

// --- 2. o tamanho minimo, convertido do piso do item 23 ---
const PISO_CAP_PX = 16; // item 23, aprovado na folha de contato
const DPI = 300;
const mm = (capPx) => +((capPx / DPI) * 25.4).toFixed(2);

const PECAS = {
  'assinatura-horizontal': horizontal,
  'assinatura-vertical': vertical,
  simbolo: S,
};
const minimos = Object.entries(PECAS).map(([nome, c]) => {
  const cx = caixa(c);
  const esc = PISO_CAP_PX / 1000;
  return {
    peca: nome,
    razao: +(cx.largura / cx.altura).toFixed(3),
    'cap minima px': PISO_CAP_PX,
    'largura px': Math.round(cx.largura * esc),
    'altura px': Math.round(cx.altura * esc),
    'cap minima mm a 300dpi': mm(PISO_CAP_PX),
    'largura mm a 300dpi': +((cx.largura * esc / DPI) * 25.4).toFixed(2),
  };
});

// 🔴 O AVATAR TEM PISO PROPRIO, E ELE E MAIOR. O PRD §5 pede o simbolo reconhecivel a 40 px
// num avatar CIRCULAR, e circulo corta canto: o quadrado inscrito num circulo de 40 px tem
// 28,3 px de lado. O piso de 16 px e de altura de caixa alta em campo retangular, e nao
// responde por recorte circular. Os dois convivem e dizem coisas diferentes.
const AVATAR_PX = 40;
const ladoInscrito = +(AVATAR_PX / Math.SQRT2).toFixed(1);
const capNoAvatar = Math.floor(ladoInscrito * (1000 / cxS.altura));

const medidas = {
  item: 24,
  unidade: 'caixa alta = 1000',
  u: U,
  'u, o que e': 'espessura de haste, medida no item 14 em quatro lugares da fonte',
  vaosInternos,
  maiorVaoInterno: maiorVao,
  regra: 'a area de protecao supera ESTRITAMENTE o maior vao interno, no menor multiplo inteiro de u',
  protecao: { multiplos_de_u: MULT, unidades: PROTECAO, 'fracao da caixa alta': +(PROTECAO / 1000).toFixed(3) },
  tamanhoMinimo: { piso: 'altura de caixa alta', origem: 'item 23, medido e aprovado na folha de contato', tabela: minimos },
  avatar: { diametro_px: AVATAR_PX, lado_do_quadrado_inscrito: ladoInscrito, cap_que_cabe_px: capNoAvatar },
};
writeFileSync('medidas-protecao.json', JSON.stringify(medidas, null, 2));

// --- 3. os SVG com a area de protecao desenhada ---
function comProtecao(nome, conts) {
  const cx = caixa(conts);
  const n = mover(conts, -cx.minX + PROTECAO, -cx.minY + PROTECAO);
  const W = cx.largura + PROTECAO * 2;
  const H = cx.altura + PROTECAO * 2;
  const g = U / 2; // o quadrado de referencia, meia haste, so para o diagrama
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W.toFixed(2)} ${H.toFixed(2)}" width="${Math.round(W)}" height="${Math.round(H)}">
<!-- CTRC · item 24 · ${nome} com area de protecao
     protecao = ${MULT}u = ${PROTECAO} unidades de caixa alta, onde u = ${U}
     a regra: supera estritamente o maior vao interno (${maiorVao}) -->
<rect x="0" y="0" width="${W.toFixed(2)}" height="${H.toFixed(2)}" fill="none" stroke="#DE0943" stroke-width="${(U / 8).toFixed(1)}" stroke-dasharray="${(U / 2).toFixed(1)} ${(U / 3).toFixed(1)}"/>
<path d="${paraSVG(n)}" fill="#111"/>
</svg>
`;
  writeFileSync(`svg/${nome}-protecao.svg`, svg);
  return { W, H };
}
for (const [nome, c] of Object.entries(PECAS)) comProtecao(nome, c);

console.log(`u = ${U}   maior vao interno = ${maiorVao}   =>  protecao = ${MULT}u = ${PROTECAO}`);
console.table(vaosInternos);
console.table(minimos);
console.log(`avatar: circulo de ${AVATAR_PX} px -> quadrado inscrito de ${ladoInscrito} px -> cabe cap de ${capNoAvatar} px`);

// ---------------------------------------------------------------------------
// A folha. Rotulos por contorno de glifo (Inter, SIL OFL, declarada em logs/licencas.md),
// nunca por <text> com fonte do sistema: se a folha virar pagina do PDF, tudo nela precisa
// estar na tabela de licencas.
// ---------------------------------------------------------------------------
import { createRequire } from 'node:module';
import { create } from '/Users/math.ramos/dev/project-sosanimal/node_modules/fontkitten/dist/index.js';
const require = createRequire(import.meta.url);
const sharp = require('/Users/math.ramos/dev/project-sosanimal/node_modules/sharp');

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
const larguraRot = (t, tam) => {
  let w = 0; for (const g of ROT.glyphsForString(t)) w += g.advanceWidth; return (w * tam) / ROT.unitsPerEm;
};

// desenha uma peca com a moldura de protecao, em px, mais o quadrado de 1u como referencia
async function pecaComMoldura(conts, capPx) {
  const cx = caixa(conts);
  const esc = capPx / 1000;
  const prot = PROTECAO * esc;
  const u = U * esc;
  const w = cx.largura * esc;
  const h = cx.altura * esc;
  const W = Math.round(w + prot * 2);
  const H = Math.round(h + prot * 2);
  const n = mover(conts, -cx.minX, -cx.minY);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    <rect x="0" y="0" width="${W}" height="${H}" fill="#F6F6F6"/>
    <rect x="${prot.toFixed(1)}" y="${prot.toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" fill="#fff"/>
    <g transform="translate(${prot.toFixed(1)} ${prot.toFixed(1)}) scale(${esc})"><path d="${paraSVG(n)}" fill="#111"/></g>
    <rect x="${prot.toFixed(1)}" y="${prot.toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" fill="none" stroke="#DE0943" stroke-width="1" stroke-dasharray="5 4"/>
    <rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" fill="none" stroke="#DE0943" stroke-width="1"/>
    <rect x="${(prot - u).toFixed(1)}" y="${prot.toFixed(1)}" width="${u.toFixed(1)}" height="${u.toFixed(1)}" fill="#DE0943" fill-opacity="0.22" stroke="#DE0943" stroke-width="0.8"/>
    <rect x="${(prot - u * 2).toFixed(1)}" y="${prot.toFixed(1)}" width="${u.toFixed(1)}" height="${u.toFixed(1)}" fill="#DE0943" fill-opacity="0.10" stroke="#DE0943" stroke-width="0.8"/>
  </svg>`;
  return { buf: await sharp(Buffer.from(svg)).png().toBuffer(), W, H };
}

{
  const LARG = 1240;
  const cam = []; const txt = [];
  txt.push(rot('Item 24 · area de protecao e tamanho minimo', 50, 52, 26, '#000'));
  txt.push(rot(`a protecao e ${MULT}u = ${PROTECAO} unidades de caixa alta, e ela foi DERIVADA, nao escolhida`, 50, 80, 14, '#666'));
  txt.push(rot(`u = ${U}, a espessura de haste medida no item 14 · os dois quadrados vermelhos sao 1u cada`, 50, 100, 14, '#666'));

  let y = 136;
  txt.push(rot('a regra, em uma frase', 50, y, 16, '#000'));
  y += 26;
  txt.push(rot('se um elemento de fora chegar mais perto da palavra do que o SIMBOLO esta, ele entra na leitura da assinatura.', 50, y, 13, '#333')); y += 20;
  txt.push(rot(`entao o piso e o maior vao interno (${maiorVao}, que e o vao simbolo|palavra) e o valor adotado e o menor multiplo`, 50, y, 13, '#333')); y += 20;
  txt.push(rot('inteiro de u que o supera ESTRITAMENTE. Empatar nao serve: a 1u o elemento de fora fica tao longe quanto o simbolo.', 50, y, 13, '#333')); y += 34;

  // os vaos internos medidos
  txt.push(rot('os vaos internos, medidos caixa de tinta contra caixa de tinta', 50, y, 15, '#000')); y += 24;
  for (const v of vaosInternos) {
    txt.push(rot(v.onde, 68, y, 13, '#333'));
    txt.push(rot(`${v.vao}`, 420, y, 13, v.vao === maiorVao ? '#DE0943' : '#777'));
    if (v.vao === maiorVao) txt.push(rot('o maior, e e dele que a protecao sai', 470, y, 13, '#DE0943'));
    y += 20;
  }
  y += 28;

  // os tres diagramas
  const h1 = await pecaComMoldura(horizontal, 120);
  cam.push({ input: h1.buf, left: 50, top: y });
  txt.push(rot('assinatura horizontal', 50, y - 10, 14, '#000'));
  const v1 = await pecaComMoldura(vertical, 120);
  cam.push({ input: v1.buf, left: 50 + h1.W + 70, top: y });
  txt.push(rot('vertical', 50 + h1.W + 70, y - 10, 14, '#000'));
  const s1 = await pecaComMoldura(S, 120);
  cam.push({ input: s1.buf, left: 50 + h1.W + 70 + v1.W + 70, top: y });
  txt.push(rot('simbolo', 50 + h1.W + 70 + v1.W + 70, y - 10, 14, '#000'));
  y += Math.max(h1.H, v1.H, s1.H) + 46;

  // o tamanho minimo, em tamanho real
  txt.push(rot('tamanho minimo, em tamanho real nesta folha', 50, y, 16, '#000')); y += 22;
  txt.push(rot('o piso e o do item 23: 16 px de altura de caixa alta, medido e aprovado na folha de contato daquele item', 50, y, 13, '#666')); y += 30;

  let x = 60;
  for (const [nome, conts] of Object.entries(PECAS)) {
    const cx = caixa(conts); const esc = PISO_CAP_PX / 1000;
    const w = Math.max(1, Math.round(cx.largura * esc)); const h = Math.max(1, Math.round(cx.altura * esc));
    const n = mover(conts, -cx.minX, -cx.minY);
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${cx.largura.toFixed(1)} ${cx.altura.toFixed(1)}"><path d="${paraSVG(n)}" fill="#111"/></svg>`;
    cam.push({ input: await sharp(Buffer.from(svg)).flatten({ background: '#fff' }).png().toBuffer(), left: x, top: y + 40 - h });
    const l = minimos.find((m) => m.peca === nome);
    txt.push(rot(nome.replace('assinatura-', ''), x, y + 60, 12, '#000'));
    txt.push(rot(`${l['largura px']}x${l['altura px']} px`, x, y + 78, 12, '#777'));
    txt.push(rot(`cap ${l['cap minima mm a 300dpi']} mm a 300 dpi`, x, y + 94, 12, '#777'));
    x += Math.round(Math.max(w, larguraRot("cap 1.35 mm a 300 dpi", 12))) + 40;
  }
  y += 124;

  // o avatar
  txt.push(rot('o avatar tem piso proprio, e ele e MAIOR', 50, y, 15, '#DE0943')); y += 22;
  txt.push(rot(`o PRD pede o simbolo reconhecivel a ${AVATAR_PX} px num avatar CIRCULAR, e circulo corta canto: o quadrado inscrito`, 50, y, 13, '#333')); y += 19;
  txt.push(rot(`num circulo de ${AVATAR_PX} px tem ${ladoInscrito} px de lado, e nele cabe uma caixa alta de ${capNoAvatar} px. O piso de 16 px e de campo`, 50, y, 13, '#333')); y += 19;
  txt.push(rot('RETANGULAR e nao responde por recorte circular. Os dois convivem e dizem coisas diferentes.', 50, y, 13, '#333')); y += 36;

  const ALT = y;
  cam.push({ input: Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${LARG}" height="${ALT}">${txt.join('')}</svg>`), left: 0, top: 0 });
  await sharp({ create: { width: LARG, height: ALT, channels: 3, background: '#fff' } }).composite(cam).png().toFile('verificacao/folha-06-protecao.png');
  console.log('verificacao/folha-06-protecao.png', LARG, ALT);
}
