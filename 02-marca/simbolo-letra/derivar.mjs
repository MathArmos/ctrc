// Item 13 · o simbolo, DERIVADO DA LETRA (D-09, RFC 000 acao 5).
//
// Nada aqui e forma nova: toda peca e uma letra do lettering do item 14, que por sua vez
// vem da Big Shoulders Display 800 em curvas, modificada pela malha da D-07.
//
// Quatro derivacoes, e as quatro saem do mesmo C e do mesmo T:
//   S1  o C sozinho
//   S2  C e T compostos, com o vao do lettering
//   S3  C e T TRAVADOS: a barra do T perde o braco esquerdo, que o topo do C passa a fazer
//   S4  igual ao S3, com a haste do T entrando na boca do C
//
// Rodar: node derivar.mjs    depois: node ../exploracao-simbolo/medir.mjs ../simbolo-letra

import { writeFileSync } from 'node:fs';
import { letraC, letraT } from '../lettering/lettering.mjs';
import { caixa, mover, paraSVG, chanfrar, reta } from '../lettering/contorno.mjs';

const C = letraC();
const cxC = caixa(C);
const cxT = caixa(letraT());

// o T sem o braco esquerdo: corta numa vertical e guarda o lado direito.
// 📌 E isto que faz a ligadura: o braco que some e devolvido pelo TOPO DO C.
function Tcortado(dxT, corteX) {
  const T = mover(letraT(), dxT);
  // 🔴 O SINAL DA VERTICAL JA SAIU ERRADO UMA VEZ E LEVOU O T INTEIRO, em silencio: o
  // chanfro remove o lado `s > 0`, e com -90 esse lado e o da DIREITA. O resultado tinha a
  // caixa do C e razao identica a do S1, que foi o que denunciou. Agora a orientacao e
  // ESCOLHIDA medindo, e nao escrita de cabeca.
  const tentativa = reta([corteX, 500], 90);
  const graus = tentativa.s([corteX - 10, 500]) > 0 ? 90 : -90;
  const L = reta([corteX, 500], graus);
  if (L.s([corteX - 10, 500]) <= 0) throw new Error('corte do T: nao achei a orientacao que poe a esquerda do lado de fora');
  return T.map((c) => chanfrar(c, L, [corteX - 80, 70]));
}

const DX_COLADO = 529.7 - 159.4; // haste do T encostando na borda direita do C
const DX_NA_BOCA = 470 - 159.4; // haste do T entrando na boca

const derivacoes = [
  { id: 'S1', nome: 'o C sozinho', cs: C },
  { id: 'S2', nome: 'C e T compostos, vao 34', cs: [...C, ...mover(letraT(), cxC.maxX + 34 - cxT.minX)] },
  { id: 'S3', nome: 'CT travado, barra continua', cs: [...C, ...Tcortado(DX_COLADO, 470)] },
  { id: 'S4', nome: 'CT travado, haste na boca', cs: [...C, ...Tcortado(DX_NA_BOCA, 500)] },
];

for (const d of derivacoes) {
  const cx = caixa(d.cs);
  const n = mover(d.cs, -cx.minX, -cx.minY);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${cx.largura.toFixed(2)} ${cx.altura.toFixed(2)}" width="${Math.round(cx.largura)}" height="${Math.round(cx.altura)}">
<!-- Item 13 · ${d.id} ${d.nome} · derivado do lettering do item 14 (D-09)
     matriz Big Shoulders Display wght 800, SIL OFL 1.1, em curvas e modificada -->
<path d="${paraSVG(n)}" fill="#000"/>
</svg>
`;
  writeFileSync(`svg/${d.id}.svg`, svg);
  console.log(`${d.id}  ${d.nome.padEnd(30)} ${cx.largura.toFixed(0)}x${cx.altura.toFixed(0)}  razao ${(cx.largura / cx.altura).toFixed(3)}`);
}
