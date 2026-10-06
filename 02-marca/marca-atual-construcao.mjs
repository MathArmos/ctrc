#!/usr/bin/env node
// Redesenho em vetor limpo da marca ATUAL do CTRC (monograma RK).
// Item 6 de TAREFAS.md. Nao e a marca nova.
//
// A geometria nao foi desenhada a mao: ela e reconstruida por intersecao de retas
// cujos angulos e posicoes foram MEDIDOS na fotografia da fachada, depois de
// retificada a perspectiva. O procedimento inteiro esta em marca-atual-medicoes.md.
//
// Rodar:  node 02-marca/marca-atual-construcao.mjs
// Escreve: marca-atual-limpa.svg  e  marca-atual-medidas.json

import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const AQUI = dirname(fileURLToPath(import.meta.url));
const D = Math.PI / 180;

// ---------------------------------------------------------------- parametros
// Unidade: altura de caixa alta = 1000. Eixo y para baixo.
const P = {
  capa: 0,          // linha de topo, comum aos dois glifos
  base: 1000,       // linha de base, comum aos dois glifos
  yPisoContraforma: 488.9, // piso do contraforma da R. O vertice do chevron cai em 489.0
                           // por DERIVACAO, nao por imposicao: ver medicoes, secao 5.

  anguloHaste: -71.0,   // obliqua da haste da R, medida -70.88 +- 0.74
  anguloDiagonal: 51.0, // diagonais, medida 51.13 +- 0.46 a 0.98

  pesoLeve: 252.37,  // braco da R, perna da R, dois bracos do chevron
  pesoHaste: 275.21, // haste da R, 9,05% mais pesada que as demais

  xBaseHaste: 0,        // V11: pe esquerdo da haste, na linha de base
  xTopoBraco: 1199.214, // V2: ponta superior direita do braco, na linha de topo
  yEncontroPerna: 492.022, // V9: onde a aresta inferior da perna encontra a haste
  xTopoChevron: 1445.179,  // W1: ponta superior esquerda do chevron, na linha de topo
  xBaseChevron: 1462.963,  // W5: ponta inferior esquerda do chevron, na linha de base
};

// ------------------------------------------------------------------ geometria
const reta = (ponto, grau) => ({ p: ponto, u: [Math.cos(grau * D), Math.sin(grau * D)] });
const horizontal = (y) => reta([0, y], 0);
const normal = (r) => [-r.u[1], r.u[0]];

// desloca a reta `r` por `d` ao longo da sua normal
function desloca(r, d) {
  const n = normal(r);
  return { p: [r.p[0] + n[0] * d, r.p[1] + n[1] * d], u: r.u };
}
// ponto da reta `r` na altura `y`
function em(r, y) {
  const t = (y - r.p[1]) / r.u[1];
  return [r.p[0] + r.u[0] * t, y];
}
function cruza(a, b) {
  const det = a.u[0] * -b.u[1] - a.u[1] * -b.u[0];
  const t = ((b.p[0] - a.p[0]) * -b.u[1] - (b.p[1] - a.p[1]) * -b.u[0]) / det;
  return [a.p[0] + a.u[0] * t, a.p[1] + a.u[1] * t];
}

const O = P.anguloHaste, DN = -P.anguloDiagonal, DP = P.anguloDiagonal;

// --- R ---------------------------------------------------------------------
const E11 = reta([P.xBaseHaste, P.base], O);      // lado esquerdo da haste
const E9 = desloca(E11, P.pesoHaste);            // lado direito da haste (uma reta so,
const E4 = E9;                                    //   interrompida pelo contraforma)
const E1 = horizontal(P.capa);                    // topo do braco
const E3 = horizontal(P.capa + P.pesoLeve);       // face inferior do braco
const E2 = reta([P.xTopoBraco, P.capa], DN);      // corte diagonal do braco
const E5 = horizontal(P.yPisoContraforma);                    // piso do contraforma
const E8 = reta(em(E9, P.yEncontroPerna), DP);    // aresta inferior da perna
const E6 = desloca(E8, -P.pesoLeve);              // aresta superior da perna
const E7 = horizontal(P.base);                    // base da perna
const E10 = horizontal(P.base);                   // base da haste

const R = [
  cruza(E11, E1), cruza(E1, E2), cruza(E2, E3), cruza(E3, E4), cruza(E4, E5),
  cruza(E5, E6), cruza(E6, E7), cruza(E7, E8), cruza(E8, E9), cruza(E9, E10),
  cruza(E10, E11),
];

// --- chevron ---------------------------------------------------------------
const F6 = reta([P.xTopoChevron, P.capa], DN);    // aresta externa do braco superior
const F2 = desloca(F6, P.pesoLeve);              // aresta interna do braco superior
const F5 = reta([P.xBaseChevron, P.base], DP);    // aresta externa do braco inferior
const F3 = desloca(F5, -P.pesoLeve);               // aresta interna do braco inferior
const F1 = horizontal(P.capa);                    // topo
const F4 = horizontal(P.base);                    // base

const C = [
  cruza(F6, F1), cruza(F1, F2), cruza(F2, F3), cruza(F3, F4), cruza(F4, F5), cruza(F5, F6),
];

// ------------------------------------------------------------------- escrita
const todos = [...R, ...C];
const x0 = Math.min(...todos.map((p) => p[0]));
const y0 = Math.min(...todos.map((p) => p[1]));
const larg = Math.max(...todos.map((p) => p[0])) - x0;
const alt = Math.max(...todos.map((p) => p[1])) - y0;
const n = (v) => Number(v.toFixed(3));
const caminho = (poly) =>
  'M' + poly.map(([x, y]) => `${n(x - x0)} ${n(y - y0)}`).join('L') + 'Z';

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${n(larg)} ${n(alt)}" width="${n(larg)}" height="${n(alt)}" role="img" aria-label="Monograma atual do CTRC">
  <title>CTRC · monograma atual, redesenhado em vetor limpo</title>
  <desc>Redesenho de geometria limpa da marca em uso (item 6). Nao e a marca nova.
Angulos: horizontais 0 graus, haste a ${P.anguloHaste} graus, diagonais a ${P.anguloDiagonal} graus.
Pesos: ${P.pesoLeve} (braco, perna, bracos do chevron) e ${P.pesoHaste} (haste).
Medidas e procedimento em 02-marca/marca-atual-medicoes.md.</desc>
  <path fill="currentColor" fill-rule="nonzero" d="${caminho(R)} ${caminho(C)}"/>
</svg>
`;
writeFileSync(join(AQUI, 'marca-atual-limpa.svg'), svg);

const rotulos = {
  R: ['V1 topo esquerdo', 'V2 topo direito', 'V3 fim do corte do braco', 'V4 topo esq. do contraforma',
      'V5 pe do contraforma na haste', 'V6 nascimento da perna', 'V7 pe direito da perna',
      'V8 pe esquerdo da perna', 'V9 encontro da perna com a haste', 'V10 pe direito da haste',
      'V11 pe esquerdo da haste'],
  C: ['W1 topo esquerdo', 'W2 topo direito', 'W3 vertice interno', 'W4 pe direito',
      'W5 pe esquerdo', 'W6 vertice externo'],
};
writeFileSync(join(AQUI, 'marca-atual-medidas.json'), JSON.stringify({
  unidade: 'altura de caixa alta = 1000, eixo y para baixo, origem no canto superior esquerdo da caixa',
  caixa: { largura: n(larg), altura: n(alt), razao: n(larg / alt) },
  parametros: P,
  vertices: {
    R: R.map((p, i) => ({ id: 'V' + (i + 1), rotulo: rotulos.R[i], x: n(p[0] - x0), y: n(p[1] - y0) })),
    C: C.map((p, i) => ({ id: 'W' + (i + 1), rotulo: rotulos.C[i], x: n(p[0] - x0), y: n(p[1] - y0) })),
  },
}, null, 2) + '\n');

console.log(`caixa ${n(larg)} x ${n(alt)}  (razao ${n(larg / alt)})`);
console.log('escrito: marca-atual-limpa.svg, marca-atual-medidas.json');
