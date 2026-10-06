// Rotas de simbolo do item 12. Cada rota e geometria parametrica: nenhuma foi
// desenhada a mao e nenhuma passou por modelo generativo (D-04).
// Toda aresta nasce de uma das tres familias de angulo da malha, e a guarda de
// malha.mjs estoura se alguma escapar. Contrato em contrato-da-rota.md
//
// Rodar: node 02-marca/exploracao-simbolo/rotas.mjs
// Escreve: svg/<id>.svg e medidas.json

import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { horizontal, obliqua, diagonal, desloca, cruza, em, poligono, conferirAngulos, svgDe } from './malha.mjs';

const AQUI = dirname(fileURLToPath(import.meta.url));
const CAPA = 0, BASE = 1000;
const escala = (poly, s, dx = 0, dy = 0) => poly.map(([x, y]) => [x * s + dx, y * s + dy]);

// ------------------------------------------------------------------ rota A
// O C de CTRC como poligono: haste na obliqua, terminais cortados na diagonal.
export function rotaC({ pesoHaste, pesoLeve, xTerminal, garra }) {
  const hasteExterna = obliqua([0, BASE]);
  const hasteInterna = desloca(hasteExterna, pesoHaste);
  return [poligono([
    horizontal(CAPA),
    diagonal([xTerminal, CAPA], garra),
    horizontal(CAPA + pesoLeve),
    hasteInterna,
    horizontal(BASE - pesoLeve),
    diagonal([xTerminal, BASE], -garra),
    horizontal(BASE),
    hasteExterna,
  ])];
}

// ------------------------------------------------------------------ rota B
// Escada: quatro barras horizontais cortadas na diagonal, alinhadas a esquerda
// por uma unica obliqua. O avanco das pontas e que desenha a subida.
export function rotaEscada({ barras, altura, vao, xPonta, passo }) {
  const esquerda = obliqua([0, BASE]);
  const out = [];
  for (let k = 0; k < barras; k++) {
    const yTopo = k * (altura + vao);
    out.push(poligono([
      horizontal(yTopo),
      diagonal([xPonta - k * passo, yTopo], -1),
      horizontal(yTopo + altura),
      esquerda,
    ]));
  }
  return out;
}

// ------------------------------------------------------------------ rota C
// O mesmo C da rota A partido por um corte a 51: a forma desliza em dois tempos.
function rotaDoisTempos({ pesoHaste, pesoLeve, xTerminal, garra, xCorte, folga }) {
  const hasteExterna = obliqua([0, BASE]);
  const hasteInterna = desloca(hasteExterna, pesoHaste);
  const labioSup = horizontal(CAPA + pesoLeve);
  const labioInf = horizontal(BASE - pesoLeve);
  const termSup = diagonal([xTerminal, CAPA], garra);
  const termInf = diagonal([xTerminal, BASE], -garra);
  // o corte e uma OBLIQUA, e nao uma diagonal: a 51 graus, uma reta que
  // atravessa os 1230 px de largura sobe 1519 px e sai pelo topo, entao ela so
  // consegue lascar um canto. Na obliqua ela corta as duas pontas.
  const corte = obliqua([xCorte, BASE]);
  const adiante = desloca(corte, folga);
  const tronco = poligono([
    horizontal(CAPA), corte, labioSup, hasteInterna, labioInf, corte, horizontal(BASE), hasteExterna,
  ]);
  const pontaCima = poligono([horizontal(CAPA), termSup, labioSup, adiante]);
  const pontaBaixo = poligono([labioInf, termInf, horizontal(BASE), adiante]);
  return [tronco, pontaCima, pontaBaixo];
}

// ------------------------------------------------------------------ rota D
// CT travado: o T mora dentro da boca do C e divide com ele a mesma obliqua.
export function rotaCT({ pesoHaste, pesoLeve, xTerminal, garra, tTopo, tEspBarra, tEsq, tBarra, tHaste, tBase, tCorte = 'diagonal' }) {
  const [c] = rotaC({ pesoHaste, pesoLeve, xTerminal, garra });
  const barraTopo = horizontal(tTopo);
  const barraBase = horizontal(tTopo + tEspBarra);
  // o corte das pontas da barra pode ser diagonal (51) ou obliqua (19 da
  // vertical). Na obliqua ele fica PARALELO a haste do C, e so assim o vao
  // entre o T e o C e constante: com a diagonal as duas retas convergem para
  // baixo e o vao mais apertado some em reducao.
  const corte = (x) => (tCorte === 'obliqua' ? obliqua([x, tTopo]) : diagonal([x, tTopo], -1));
  const fimEsq = corte(tEsq);
  const fimDir = corte(tEsq + tBarra);
  // a haste nasce no MEIO da barra, medido na altura em que as duas se encontram
  const meio = (cruza(fimEsq, barraBase)[0] + cruza(fimDir, barraBase)[0]) / 2;
  const hasteEsq = obliqua([meio - tHaste / (2 * Math.cos(19 * Math.PI / 180)), tTopo + tEspBarra]);
  const t = poligono([
    barraTopo, fimDir, barraBase, desloca(hasteEsq, tHaste),
    horizontal(tBase), hasteEsq, barraBase, fimEsq,
  ]);
  return [c, t];
}

// ------------------------------------------------------------------ rota E
// Seta na obliqua, com as barbas na diagonal. E a rota mais perto do chevron,
// e foi construida justamente para o numero existir.
function rotaSeta({ peso, xPonta, yBarba }) {
  const hasteEsq = obliqua([xPonta - 520, BASE]);
  const hasteDir = desloca(hasteEsq, peso);
  return [poligono([
    diagonal([xPonta, CAPA], 1),    // barba direita
    horizontal(yBarba),
    hasteDir,
    horizontal(BASE),
    hasteEsq,
    horizontal(yBarba),
    diagonal([xPonta, CAPA], -1),   // barba esquerda
  ])];
}

// ------------------------------------------------------------------ rota F
// Rastro: o C tres vezes, menor e mais para tras a cada passo.
function rotaRastro({ pesoHaste, pesoLeve, xTerminal, garra, fator, vao }) {
  const [c] = rotaC({ pesoHaste, pesoLeve, xTerminal, garra });
  const largura = Math.max(...c.map((p) => p[0])) - Math.min(...c.map((p) => p[0]));
  const out = [];
  let s = 1, direita = largura;
  for (let k = 0; k < 3; k++) {
    const w = largura * s;
    out.push(escala(c, s, direita - w, BASE * (1 - s)));
    direita -= w + vao * s;
    s *= fator;
  }
  return out.reverse();
}

// ------------------------------------------------------------------ rota G
// Marco: corpo na obliqua, ponta na diagonal, vazado no meio.
function rotaMarco({ largura, yOmbro, vazadoAlt, vazadoLarg, yVazado }) {
  const esq = obliqua([0, yOmbro]);
  const dir = desloca(esq, largura);
  const xPonta = em(dir, BASE)[0] - largura / 2;
  const corpo = poligono([
    horizontal(CAPA),
    dir,
    diagonal([xPonta, BASE], -1),
    diagonal([xPonta, BASE], 1),
    esq,
  ]);
  const cv = em(esq, yVazado)[0] + (largura - vazadoLarg) / 2;
  const ve = obliqua([cv, yVazado + vazadoAlt]);
  const vazado = poligono([
    horizontal(yVazado),
    desloca(ve, vazadoLarg),
    horizontal(yVazado + vazadoAlt),
    ve,
  ]);
  return [corpo, vazado.slice().reverse()];
}

export const ROTAS = [
  { id: 'A', nome: 'C aberto', construir: rotaC,
    descricao: 'O C de CTRC como poligono, haste na obliqua e terminais cortados a 51 apontando um para o outro.',
    parametros: { pesoHaste: 285, pesoLeve: 285, xTerminal: 1000, garra: 1 } },
  { id: 'A2', nome: 'C aberto, terminal invertido', construir: rotaC,
    descricao: 'Variante da A com o corte do terminal invertido. Mantida como registro: reprovou na distancia do chevron.',
    parametros: { pesoHaste: 285, pesoLeve: 285, xTerminal: 1000, garra: -1 } },
  { id: 'B', nome: 'Escada', construir: rotaEscada,
    descricao: 'Quatro barras alinhadas a esquerda por uma obliqua, com as pontas avancando a cada degrau.',
    parametros: { barras: 4, altura: 175, vao: 100, xPonta: 1420, passo: 265 } },
  { id: 'C', nome: 'C em dois tempos', construir: rotaDoisTempos,
    descricao: 'O C da rota A com as duas pontas destacadas por um corte na obliqua: a marca lida como forma que se abre.',
    parametros: { pesoHaste: 285, pesoLeve: 285, xTerminal: 1000, garra: 1, xCorte: 790, folga: 85 } },
  { id: 'D', nome: 'CT travado', construir: rotaCT,
    descricao: 'O C da rota A com um T na boca, os dois na mesma obliqua. Unica rota que carrega duas das quatro letras.',
    parametros: { pesoHaste: 250, pesoLeve: 250, xTerminal: 1150, garra: 1,
      tTopo: 300, tEspBarra: 150, tEsq: 620, tBarra: 470, tHaste: 185, tBase: 700 } },
  { id: 'E', nome: 'Seta obliqua', construir: rotaSeta,
    descricao: 'Seta com haste na obliqua e barbas na diagonal. Construida para medir a distancia do chevron, nao por aposta.',
    parametros: { peso: 300, xPonta: 900, yBarba: 430 } },
  { id: 'F', nome: 'Rastro', construir: rotaRastro,
    descricao: 'O C tres vezes, menor e mais atras a cada passo. Direcao por repeticao.',
    parametros: { pesoHaste: 285, pesoLeve: 285, xTerminal: 1000, garra: 1, fator: 0.62, vao: 110 } },
  { id: 'G', nome: 'Marco', construir: rotaMarco,
    descricao: 'Corpo na obliqua terminando em ponta na diagonal, com vazado. O unico que fala de territorio.',
    parametros: { largura: 620, yOmbro: 640, vazadoAlt: 230, vazadoLarg: 230, yVazado: 180 } },
];

const saida = {};
for (const rota of ROTAS) {
  const poligonos = rota.construir(rota.parametros);
  const familias = conferirAngulos(poligonos, rota.id);
  const { svg, caixa } = svgDe(poligonos, rota);
  writeFileSync(join(AQUI, 'svg', `${rota.id}.svg`), svg);
  saida[rota.id] = { nome: rota.nome, parametros: rota.parametros, caixa, familias, pecas: poligonos.length };
  console.log(`${rota.id.padEnd(3)} ${rota.nome.padEnd(30)} caixa ${String(caixa.largura).padStart(8)} x ${caixa.altura}  razao ${caixa.razao}  pecas ${poligonos.length}`);
}
writeFileSync(join(AQUI, 'medidas.json'), JSON.stringify(saida, null, 2) + '\n');
