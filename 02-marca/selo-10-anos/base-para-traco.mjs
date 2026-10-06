// Base para a passada de caneta · itens 39 a 41.
//
// O caminho e o do designer do copo de cafe, e e o do briefing: o carimbo e
// impresso, a mao reforca o que precisa de forca, e o resultado volta a ser
// arquivo. Esta folha e a METADE DE BAIXO desse caminho.
//
// 🔴 AS MARCAS DE REGISTRO NAO SAO ENFEITE. O papel volta por escaner ou foto,
// e sem tres pontos conhecidos nao da para desfazer rotacao e escala sem
// chutar. Com eles o alinhamento e aritmetica.
//
// Rodar: node 02-marca/selo-10-anos/base-para-traco.mjs

import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { carimbar, relevoDeTexto, AGUA } from './carimbo.mjs';

const require = createRequire(import.meta.url);
const sharp = require('/Users/math.ramos/dev/project-sosanimal/node_modules/sharp');
const AQUI = dirname(fileURLToPath(import.meta.url));

const DPI = 300;
const mm = (v) => Math.round((v / 25.4) * DPI);
const A4 = { l: mm(210), a: mm(297) };
const DIAM = mm(140);        // 14 cm de anilha: cabe no A4 com margem para a mao
const TOPO = mm(46);
const ESQ = Math.round((A4.l - DIAM) / 2);

// 🟡 P01 e o padrao so porque e a primeira. A escolha e do driver na folha 01, e
// trocar aqui e trocar estes dois numeros.
const ESCOLHA = { semente: 20261005, inclinacaoGrau: 60 };

const registro = () => {
  const r = mm(4), e = 1.2;
  const cruz = (x, y) =>
    `<g stroke="#000" stroke-width="${e}"><line x1="${x - r}" y1="${y}" x2="${x + r}" y2="${y}"/>` +
    `<line x1="${x}" y1="${y - r}" x2="${x}" y2="${y + r}"/>` +
    `<circle cx="${x}" cy="${y}" r="${r * 0.55}" fill="none"/></g>`;
  const m = mm(12);
  return cruz(m, m) + cruz(A4.l - m, m) + cruz(m, A4.a - m) + cruz(A4.l - m, A4.a - m);
};

(async () => {
  mkdirSync(join(AQUI, 'base-para-traco'), { recursive: true });
  const releva = await relevoDeTexto(DIAM, '10 ANOS');
  const { bruto, lado } = await carimbar({ lado: DIAM, releva, agua: { ...AGUA, ...ESCOLHA } });

  const carimboPNG = await sharp(bruto, { raw: { width: lado, height: lado, channels: 1 } })
    .png().toBuffer();

  const texto = `<svg xmlns="http://www.w3.org/2000/svg" width="${A4.l}" height="${A4.a}">
    ${registro()}
    <text x="${ESQ}" y="${mm(28)}" font-family="Helvetica" font-size="${mm(3.6)}" fill="#000">CTRC · selo 10 anos · base para a passada de caneta</text>
    <text x="${ESQ}" y="${mm(34)}" font-family="Helvetica" font-size="${mm(2.8)}" fill="#808080">carimbo semente ${ESCOLHA.semente}, inclinacao ${ESCOLHA.inclinacaoGrau} · imprimir a 100%, sem ajuste de escala · nao cortar as quatro cruzes</text>
    <text x="${ESQ}" y="${A4.a - mm(26)}" font-family="Helvetica" font-size="${mm(2.8)}" fill="#808080">Reforcar o que pede forca. O que ficar seco por acidente e material, nao erro: so apagar o que atrapalhar a leitura.</text>
    <text x="${ESQ}" y="${A4.a - mm(21)}" font-family="Helvetica" font-size="${mm(2.8)}" fill="#808080">Devolver escaneado a 600 dpi ou fotografado de frente, com as quatro cruzes visiveis no enquadramento.</text>
  </svg>`;

  await sharp({ create: { width: A4.l, height: A4.a, channels: 3, background: '#ffffff' } })
    .composite([{ input: carimboPNG, left: ESQ, top: TOPO }, { input: Buffer.from(texto), left: 0, top: 0 }])
    .png().toFile(join(AQUI, 'base-para-traco', 'A4-carimbo-300dpi.png'));

  console.log(`A4 ${A4.l}x${A4.a} px a ${DPI} dpi · anilha ${DIAM} px (140 mm) · semente ${ESCOLHA.semente}`);
})();
