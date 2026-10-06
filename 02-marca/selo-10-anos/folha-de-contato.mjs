// Folha de contato do carimbo · itens 39 a 41.
//
// Carimbar doze vezes e escolher uma e o que um designer faz na bancada. Aqui a
// semente faz o papel da mao: cada uma e uma prensada diferente da MESMA anilha,
// com os mesmos parametros. Nenhuma e mais "certa" que a outra, e a escolha e do
// driver, no olho.
//
// 🔴 CADA QUADRO LEVA O ROTULO IMPRESSO DENTRO DELE. Folha sem rotulo obriga a
// contar posicao para saber qual e qual, e posicao e exatamente o que se perde
// quando a imagem e recortada ou reordenada.
//
// Rodar: node 02-marca/selo-10-anos/folha-de-contato.mjs

import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { carimbar, relevoDeTexto, AGUA } from './carimbo.mjs';

const require = createRequire(import.meta.url);
const sharp = require('/Users/math.ramos/dev/project-sosanimal/node_modules/sharp');
const AQUI = dirname(fileURLToPath(import.meta.url));

const LADO = 440;
const VAO = 26;

const rotulo = (texto, largura) => Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${largura}" height="34">
     <text x="0" y="24" font-family="Helvetica" font-size="21" fill="#9a9a9a">${texto}</text>
   </svg>`);

async function folha({ nome, quadros, colunas, titulo }) {
  const linhas = Math.ceil(quadros.length / colunas);
  const alturaQuadro = LADO + 34;
  const L = colunas * LADO + (colunas - 1) * VAO;
  const A = 46 + linhas * alturaQuadro + (linhas - 1) * VAO;
  const pecas = [{ input: rotulo(titulo, L), left: 0, top: 6 }];

  for (let i = 0; i < quadros.length; i++) {
    const cx = i % colunas, cy = Math.floor(i / colunas);
    const left = cx * (LADO + VAO), top = 46 + cy * (alturaQuadro + VAO);
    const { bruto, lado } = quadros[i].chapa;
    const img = await sharp(bruto, { raw: { width: lado, height: lado, channels: 1 } })
      .resize(LADO).png().toBuffer();
    pecas.push({ input: img, left, top });
    pecas.push({ input: rotulo(quadros[i].rotulo, LADO), left, top: top + LADO + 2 });
  }

  await sharp({ create: { width: L, height: A, channels: 3, background: '#ffffff' } })
    .composite(pecas).png().toFile(join(AQUI, 'verificacao', nome));
  console.log(nome, `${L}x${A}`);
}

(async () => {
  mkdirSync(join(AQUI, 'verificacao'), { recursive: true });
  const lado = 1100;
  const releva = await relevoDeTexto(lado, '10 ANOS');
  const tinta = ({ bruto }) => {
    let t = 0; for (const v of bruto) if (v === 0) t++;
    return (100 * t / bruto.length).toFixed(1);
  };

  // 1. doze prensadas: mesma anilha, mesmos parametros, maos diferentes
  const doze = [];
  for (let i = 0; i < 12; i++) {
    const semente = 20261005 + i * 7919;
    const grau = 60 + i * 27; // a mao tambem nao inclina sempre para o mesmo lado
    const chapa = await carimbar({ lado, releva, agua: { ...AGUA, semente, inclinacaoGrau: grau } });
    doze.push({ chapa, rotulo: `P${String(i + 1).padStart(2, '0')}  semente ${semente}  incl ${grau}  tinta ${tinta(chapa)}%` });
  }
  await folha({ nome: 'folha-01-doze-prensadas.png', quadros: doze, colunas: 4,
    titulo: 'CTRC · selo 10 anos · doze prensadas da mesma anilha. Escolher UMA. Rotulo = parametro que a reproduz.' });

  // 2. secura: a MESMA prensada, do mais molhado ao mais seco
  const secura = [];
  for (const limiar of [0.52, 0.57, 0.62, 0.67, 0.72]) {
    const chapa = await carimbar({ lado, releva, agua: { ...AGUA, limiar } });
    secura.push({ chapa, rotulo: `limiar ${limiar.toFixed(2)}   tinta ${tinta(chapa)}%` });
  }
  await folha({ nome: 'folha-02-secura.png', quadros: secura, colunas: 5,
    titulo: 'CTRC · selo 10 anos · a mesma prensada, do mais molhado ao mais seco. So o limiar muda.' });
})();
