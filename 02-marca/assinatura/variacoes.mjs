// Itens 19 a 23 · as variacoes obrigatorias do item 5 do regulamento.
//
//   20 monocromatica  uma cor chapada so
//   21 positiva       marca escura sobre fundo claro
//   22 negativa       marca clara sobre fundo escuro
//   23 teste de reducao medido a 48, 24 e 16 px
//
// 🔴 O ITEM 19 (COLORIDA) NAO ESTA AQUI, e isso e de proposito: ele depende do item 27, que e
// a paleta, e o eixo conceitual acusa a marca atual de ter TRES vermelhos. Entregar um vermelho
// escolhido no olho aqui contradiria o proprio paragrafo. Fica para quando a paleta for medida.
//
// ⚠️ O FUNDO ESCURO DA NEGATIVA E PROVISORIO (#111111) e esta declarado: a cor definitiva sai
// do item 27. O que a negativa prova agora e que a marca aguenta inversao sem fechar contraforma.
//
// Rodar: node variacoes.mjs

import { readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { palavra } from '../lettering/lettering.mjs';
import { simboloFinal } from '../simbolo-letra/simbolo.mjs';
import { caixa, mover, paraSVG } from '../lettering/contorno.mjs';

const require = createRequire(import.meta.url);
const sharp = require('/Users/math.ramos/dev/project-sosanimal/node_modules/sharp');

export const FUNDO_NEGATIVA = '#111111'; // provisorio, item 27 decide
const TINTA_POSITIVA = '#000000';
const TINTA_NEGATIVA = '#FFFFFF';

const U = 161.2;
const S = simboloFinal();
const cxS = caixa(S);
const P = palavra().pecas.flatMap((p) => p.cs);
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

const PECAS = {
  'assinatura-horizontal': horizontal,
  'assinatura-vertical': vertical,
  simbolo: S,
  lettering: P,
};

function svgDe(conts, tinta, fundo, capPx = null) {
  const cx = caixa(conts);
  const n = mover(conts, -cx.minX, -cx.minY);
  const esc = capPx ? capPx / 1000 : 1;
  const w = Math.max(1, Math.round(cx.largura * esc));
  const h = Math.max(1, Math.round(cx.altura * esc));
  const rect = fundo ? `<rect width="${cx.largura}" height="${cx.altura}" fill="${fundo}"/>` : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${cx.largura.toFixed(2)} ${cx.altura.toFixed(2)}" width="${w}" height="${h}">${rect}<path d="${paraSVG(n)}" fill="${tinta}"/></svg>`;
}

// --- 20, 21 e 22 ---
for (const [nome, conts] of Object.entries(PECAS)) {
  writeFileSync(`svg/${nome}-positiva.svg`, svgDe(conts, TINTA_POSITIVA, null) + '\n');
  writeFileSync(`svg/${nome}-negativa.svg`, svgDe(conts, TINTA_NEGATIVA, FUNDO_NEGATIVA) + '\n');
}
console.log('itens 20, 21 e 22: positiva e negativa escritas para as quatro pecas');

// --- 23: o teste de reducao, MEDIDO ---
// AVISO medido: resize com background sobre entrada de 1 canal devolve 3 canais.
// Todo caminho termina em .greyscale() antes do .raw().
const N = 400;
async function mascaraDe(svg, largura, altura) {
  const { data, info } = await sharp(Buffer.from(svg))
    .resize({ width: largura, height: altura, fit: 'fill' })
    .flatten({ background: '#fff' }).greyscale().raw().toBuffer({ resolveWithObject: true });
  return { data, info };
}
async function fidelidade(conts, capPx) {
  const cx = caixa(conts);
  const esc = capPx / 1000;
  const w = Math.max(1, Math.round(cx.largura * esc));
  const h = Math.max(1, Math.round(cx.altura * esc));
  const svg = svgDe(conts, '#000', '#fff');
  const grande = await sharp(Buffer.from(svg)).resize({ width: N, height: N, fit: 'fill' })
    .flatten({ background: '#fff' }).greyscale().raw().toBuffer();
  const peq = await sharp(Buffer.from(svg)).resize({ width: w, height: h, fit: 'fill' })
    .flatten({ background: '#fff' }).png().toBuffer();
  const reamp = await sharp(peq).resize({ width: N, height: N, fit: 'fill', kernel: 'nearest' })
    .greyscale().raw().toBuffer();
  let i = 0;
  let u = 0;
  for (let k = 0; k < grande.length; k++) {
    const a = grande[k] < 128;
    const b = reamp[k] < 128;
    if (a && b) i++;
    if (a || b) u++;
  }
  return { iou: +(i / (u || 1)).toFixed(3), w, h };
}

const tabela = [];
for (const [nome, conts] of Object.entries(PECAS)) {
  const linha = { peca: nome, razao: +(caixa(conts).largura / caixa(conts).altura).toFixed(3) };
  for (const px of [48, 24, 16]) {
    const r = await fidelidade(conts, px);
    linha[`${px}px`] = r.iou;
    linha[`${px}px_caixa`] = `${r.w}x${r.h}`;
  }
  tabela.push(linha);
}
writeFileSync('medidas-reducao.json', JSON.stringify({ item: 23, unidade: 'altura de caixa alta em px', tabela }, null, 2));
console.table(tabela.map((l) => ({ peca: l.peca, razao: l.razao, '48px': l['48px'], '24px': l['24px'], '16px': l['16px'], 'caixa a 16px': l['16px_caixa'] })));
