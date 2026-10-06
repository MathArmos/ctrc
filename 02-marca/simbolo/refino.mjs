// Item 13: refino das tres finalistas do item 12 (A, D e B), em variantes de peso
// e proporcao. Mesma malha, mesma guarda, mesmo contrato de medicao.
//
// Rodar: node 02-marca/simbolo/refino.mjs

import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { conferirAngulos, svgDe } from '../exploracao-simbolo/malha.mjs';
import { rotaC, rotaEscada, rotaCT } from '../exploracao-simbolo/rotas.mjs';

const AQUI = dirname(fileURLToPath(import.meta.url));

// menor vao entre pecas, exato, em unidades de altura de caixa alta = 1000.
// E a medida que diz se duas pecas se encostam em reducao ou em bordado, e ela
// sai da geometria, nunca do raster.
const distPontoSeg = (p, a, b) => {
  const vx = b[0] - a[0], vy = b[1] - a[1];
  const L = vx * vx + vy * vy;
  const t = L ? Math.max(0, Math.min(1, ((p[0] - a[0]) * vx + (p[1] - a[1]) * vy) / L)) : 0;
  return Math.hypot(p[0] - (a[0] + t * vx), p[1] - (a[1] + t * vy));
};
function vaoMinimo(poligonos) {
  if (poligonos.length < 2) return null;
  let min = Infinity;
  for (let i = 0; i < poligonos.length; i++) for (let j = i + 1; j < poligonos.length; j++) {
    for (const p of poligonos[i]) for (let k = 0; k < poligonos[j].length; k++) {
      min = Math.min(min, distPontoSeg(p, poligonos[j][k], poligonos[j][(k + 1) % poligonos[j].length]));
    }
    for (const p of poligonos[j]) for (let k = 0; k < poligonos[i].length; k++) {
      min = Math.min(min, distPontoSeg(p, poligonos[i][k], poligonos[i][(k + 1) % poligonos[i].length]));
    }
  }
  return Number(min.toFixed(1));
}

export const VARIANTES = [
  { id: 'A-1', nome: 'C aberto, peso igual', construir: rotaC,
    descricao: 'Haste e bracos com o mesmo peso. E a rota A como saiu do item 12.',
    parametros: { pesoHaste: 285, pesoLeve: 285, xTerminal: 1000, garra: 1 } },
  { id: 'A-2', nome: 'C aberto, haste compensada', construir: rotaC,
    descricao: 'Haste 20 por cento mais pesada que os bracos, que e compensacao optica corrente: haste quase vertical pede mais peso que diagonal.',
    parametros: { pesoHaste: 300, pesoLeve: 250, xTerminal: 1000, garra: 1 } },
  { id: 'A-3', nome: 'C aberto, leve', construir: rotaC,
    descricao: 'Mesma compensacao da A-2, com o conjunto 15 por cento mais leve.',
    parametros: { pesoHaste: 255, pesoLeve: 212, xTerminal: 1000, garra: 1 } },
  { id: 'D-1', nome: 'CT travado, T pequeno', construir: rotaCT,
    descricao: 'O T ocupa pouco da boca do C.',
    parametros: { pesoHaste: 250, pesoLeve: 250, xTerminal: 1150, garra: 1,
      tTopo: 300, tEspBarra: 150, tEsq: 620, tBarra: 470, tHaste: 185, tBase: 700 } },
  { id: 'D-2', nome: 'CT travado, T cheio', construir: rotaCT,
    descricao: 'O T preenche a boca do C, com folga constante.',
    parametros: { pesoHaste: 260, pesoLeve: 225, xTerminal: 1180, garra: 1,
      tTopo: 300, tEspBarra: 165, tEsq: 580, tBarra: 580, tHaste: 200, tBase: 740 } },
  { id: 'D-3', nome: 'CT travado, leve', construir: rotaCT,
    descricao: 'Mesma proporcao da D-2 com todos os pesos reduzidos, para sobrar ar dentro da boca.',
    parametros: { pesoHaste: 225, pesoLeve: 195, xTerminal: 1180, garra: 1,
      tTopo: 280, tEspBarra: 145, tEsq: 575, tBarra: 590, tHaste: 175, tBase: 760 } },
  { id: 'D-4', nome: 'CT travado, folga de 1 px', construir: rotaCT,
    descricao: 'Folga de 90 unidades em volta do T, que e o minimo para o vao sobreviver com 1 px inteiro a 16 px de largura. Tudo o mais encolhe para pagar essa folga.',
    parametros: { pesoHaste: 225, pesoLeve: 195, xTerminal: 1180, garra: 1,
      tTopo: 285, tEspBarra: 130, tEsq: 585, tBarra: 560, tHaste: 170, tBase: 715 } },
  { id: 'D-5', nome: 'CT travado, ponta na obliqua', construir: rotaCT,
    descricao: 'Como a D-4, com as pontas da barra cortadas na obliqua em vez da diagonal: paralelas a haste do C, o vao entre as duas pecas fica constante em vez de afunilar para baixo.',
    parametros: { pesoHaste: 225, pesoLeve: 195, xTerminal: 1180, garra: 1, tCorte: 'obliqua',
      tTopo: 285, tEspBarra: 130, tEsq: 600, tBarra: 540, tHaste: 170, tBase: 715 } },
  { id: 'B-1', nome: 'Escada, quatro degraus', construir: rotaEscada,
    descricao: 'Quatro barras. E a rota B como saiu do item 12.',
    parametros: { barras: 4, altura: 175, vao: 100, xPonta: 1420, passo: 265 } },
  { id: 'B-2', nome: 'Escada, tres degraus', construir: rotaEscada,
    descricao: 'Tres barras mais grossas. Tres nao conta unidade nenhuma, o que tira a armadilha de a marca mentir quando abrir a quinta.',
    parametros: { barras: 3, altura: 250, vao: 125, xPonta: 1420, passo: 330 } },
  { id: 'B-3', nome: 'Escada, degrau longo', construir: rotaEscada,
    descricao: 'Quatro barras finas com avanco maior: a subida fica mais explicita e a mancha mais leve.',
    parametros: { barras: 4, altura: 140, vao: 145, xPonta: 1560, passo: 350 } },
];

const saida = {};
for (const v of VARIANTES) {
  const poligonos = v.construir(v.parametros);
  const familias = conferirAngulos(poligonos, v.id);
  const { svg, caixa } = svgDe(poligonos, v);
  writeFileSync(join(AQUI, 'svg', `${v.id}.svg`), svg);
  const vao = vaoMinimo(poligonos);
  saida[v.id] = { nome: v.nome, parametros: v.parametros, caixa, familias, pecas: poligonos.length, vaoMinimo: vao };
  const emPx = vao === null ? '' : `  vao ${String(vao).padStart(5)} (${(16 * vao / caixa.largura).toFixed(2)} px a 16)`;
  console.log(`${v.id}  ${v.nome.padEnd(28)} razao ${caixa.razao}${emPx}`);
}
writeFileSync(join(AQUI, 'medidas.json'), JSON.stringify(saida, null, 2) + '\n');
