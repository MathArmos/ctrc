// Medicao das rotas do item 12. Nada aqui e estimativa.
//
// 1. tinta: % da caixa que o simbolo preenche
// 2. fidelidade em reducao: IoU entre o simbolo a 48, 24 e 16 px (reampliado) e
//    o mesmo simbolo em tamanho grande. E o numero que responde ao RNF-02
// AVISO medido: resize com `background` sobre entrada de 1 canal devolve 3 canais.
// Por isso todo caminho de medicao termina em .greyscale() antes do .raw().
//
// 3. distancia da forma que morre: IoU contra o chevron e contra o monograma
//    atuais, os dois normalizados na mesma caixa (D-07)
//
// Rodar: node 02-marca/exploracao-simbolo/medir.mjs

import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const sharp = require('/Users/math.ramos/dev/project-sosanimal/node_modules/sharp');
const AQUI = dirname(fileURLToPath(import.meta.url));
// pasta alvo: por padrao a propria exploracao, ou a passada em argv[2]
const ALVO = process.argv[2] ? join(AQUI, process.argv[2]) : AQUI;
const N = 400; // lado da caixa de normalizacao

// ------------------------------------------------- marca atual, para a D-07
const atual = readFileSync(join(AQUI, '..', 'marca-atual-limpa.svg'), 'utf8');
const d = atual.match(/ d="([^"]+)"/)[1];
const [dR, dC] = d.split('Z').filter((s) => s.trim()).map((s) => s.trim() + 'Z');
const cabeca = atual.slice(0, atual.indexOf('<path'));
const soComD = (dd) => cabeca + `<path fill="#000" d="${dd}"/></svg>`;

// mascara binaria normalizada: ajusta pela caixa de tinta e centraliza em NxN
async function mascara(svg) {
  const { data, info } = await sharp(Buffer.from(svg)).resize({ width: 1400, fit: 'inside' })
    .flatten({ background: '#fff' }).greyscale().raw().toBuffer({ resolveWithObject: true });
  let x0 = 1e9, x1 = -1, y0 = 1e9, y1 = -1;
  for (let y = 0; y < info.height; y++) for (let x = 0; x < info.width; x++) {
    if (data[y * info.width + x] < 128) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
  }
  const w = x1 - x0 + 1, h = y1 - y0 + 1;
  const recorte = await sharp(data, { raw: { width: info.width, height: info.height, channels: 1 } })
    .extract({ left: x0, top: y0, width: w, height: h })
    .resize({ width: N, height: N, fit: 'contain', background: '#fff' }).greyscale().raw().toBuffer();
  return { m: Uint8Array.from(recorte, (v) => (v < 128 ? 1 : 0)), razao: w / h };
}
const iou = (a, b) => {
  let i = 0, u = 0;
  for (let k = 0; k < a.length; k++) { if (a[k] | b[k]) u++; if (a[k] & b[k]) i++; }
  return u ? i / u : 0;
};

// o simbolo reduzido a `px` e reampliado, contra ele mesmo em tamanho grande
async function fidelidade(svg, px, grande) {
  const peq = await sharp(Buffer.from(svg)).resize({ width: px, height: px, fit: 'inside' })
    .flatten({ background: '#fff' }).greyscale().png().toBuffer();
  const svgPeq = peq; // ja e bitmap
  const { data, info } = await sharp(svgPeq).resize({ width: N, height: N, fit: 'contain', background: '#fff', kernel: 'nearest' })
    .greyscale().raw().toBuffer({ resolveWithObject: true });
  const m = Uint8Array.from(data, (v) => (v < 128 ? 1 : 0));
  return { iou: iou(m, grande), bitmap: svgPeq, info };
}

(async () => {
  const chevron = (await mascara(soComD(dC))).m;
  const monograma = (await mascara(atual)).m;
  const linhas = [];
  const arquivos = readdirSync(join(ALVO, 'svg')).filter((f) => f.endsWith('.svg')).sort();

  for (const f of arquivos) {
    const id = f.replace('.svg', '');
    const svg = readFileSync(join(ALVO, 'svg', f), 'utf8');
    const { m: grande, razao } = await mascara(svg);
    const tinta = grande.reduce((a, b) => a + b, 0) / (N * N);

    const red = {};
    for (const px of [48, 24, 16]) {
      const r = await fidelidade(svg, px, grande);
      red[px] = Number(r.iou.toFixed(3));
    }
    linhas.push({ id, razao: Number(razao.toFixed(3)), tinta: Number((100 * tinta).toFixed(1)),
      fidelidade: red, iouChevron: Number(iou(grande, chevron).toFixed(3)), iouMonograma: Number(iou(grande, monograma).toFixed(3)) });

    // folha de contato: grande + 48/24/16 ampliados por vizinho mais proximo
    const alvo = 320;
    const partes = [await sharp(Buffer.from(svg)).resize({ width: alvo, height: alvo, fit: 'contain', background: '#fff' }).flatten({ background: '#fff' }).toBuffer()];
    for (const px of [48, 24, 16]) {
      partes.push(await sharp(Buffer.from(svg)).resize({ width: px, height: px, fit: 'inside' })
        .flatten({ background: '#fff' })
        .resize({ width: alvo, height: alvo, fit: 'contain', background: '#fff', kernel: 'nearest' }).toBuffer());
    }
    await sharp({ create: { width: alvo * 4 + 50, height: alvo, channels: 3, background: '#fff' } })
      .composite(partes.map((input, i) => ({ input, left: i * (alvo + 16), top: 0 })))
      .png().toFile(join(ALVO, 'verificacao', `${id}-contato.png`));
  }

  console.table(linhas.map((l) => ({ rota: l.id, razao: l.razao, 'tinta %': l.tinta,
    'IoU 48': l.fidelidade[48], 'IoU 24': l.fidelidade[24], 'IoU 16': l.fidelidade[16],
    'IoU chevron': l.iouChevron, 'IoU monograma': l.iouMonograma })));
  writeFileSync(join(ALVO, 'medidas-render.json'), JSON.stringify(linhas, null, 2) + '\n');
})();
