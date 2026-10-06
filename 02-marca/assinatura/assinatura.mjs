// Itens 15, 16 e 17 · a assinatura travada, horizontal e vertical.
//
// 🔴 A UNIDADE DO SISTEMA E A ESPESSURA DE HASTE, e ela e medida, nao escolhida: 161,2
// unidades de caixa alta, a mesma na haste do T, na haste do R, nos terminais do C e, depois
// da M1 do item 14, tambem na perna do R. Chamo essa unidade de `u`.
// 📌 Todo vao e toda area de protecao desta assinatura sai de `u`. Nenhum numero solto.
//
// O simbolo e trocavel: mude SIMBOLO e as tres assinaturas se refazem com um comando.
//
// Rodar: node assinatura.mjs

import { readFileSync, writeFileSync } from 'node:fs';
import { letraC, letraT, palavra } from '../lettering/lettering.mjs';
import { caixa, mover, paraSVG, chanfrar, reta } from '../lettering/contorno.mjs';

export const U = 161.2; // espessura de haste, medida no item 14
export const SIMBOLO = 'S3';

// --- o simbolo escolhido, reconstruido a partir das mesmas letras ---
function Tcortado(dxT, corteX) {
  const T = mover(letraT(), dxT);
  const tentativa = reta([corteX, 500], 90);
  const graus = tentativa.s([corteX - 10, 500]) > 0 ? 90 : -90;
  return T.map((c) => chanfrar(c, reta([corteX, 500], graus), [corteX - 80, 70]));
}

function simbolo(id) {
  const C = letraC();
  const cxC = caixa(C);
  const cxT = caixa(letraT());
  if (id === 'S1') return C;
  if (id === 'S2') return [...C, ...mover(letraT(), cxC.maxX + 34 - cxT.minX)];
  if (id === 'S3') return [...C, ...Tcortado(529.7 - 159.4, 470)];
  if (id === 'S4') return [...C, ...Tcortado(470 - 159.4, 500)];
  throw new Error(`simbolo ${id} nao existe`);
}

// --- as pecas, normalizadas pela linha de base da caixa alta ---
const S = simbolo(SIMBOLO);
const cxS = caixa(S);
const P = palavra().pecas.flatMap((p) => p.cs);
const cxP = caixa(P);

// 🔴 O ALINHAMENTO E PELA CAIXA ALTA, E NUNCA PELA CAIXA DE TINTA. O C tem transbordo em cima
// e embaixo (a curva passa da linha), entao alinhar por tinta poria a palavra fora de registro
// com o simbolo. A caixa alta vai de y=0 a y=1000 nos dois, por construcao do item 14.
const TOPO_ALTA = 0;
const BASE_ALTA = 1000;

// --- 16 · horizontal: simbolo a esquerda, palavra a direita ---
const VAO_H = U; // uma haste entre o simbolo e a palavra
{
  const dx = cxS.maxX + VAO_H - cxP.minX;
  const todos = [...S, ...mover(P, dx)];
  escreve('assinatura-horizontal', todos, `item 16 · horizontal · vao ${VAO_H} (1u)`);
}

// --- 17 · vertical: simbolo em cima, palavra embaixo, centrados ---
const VAO_V = U * 0.75;
{
  const alturaS = cxS.altura;
  const dyP = cxS.maxY + VAO_V - cxP.minY;
  const larguraMax = Math.max(cxS.largura, cxP.largura);
  const dxS = (larguraMax - cxS.largura) / 2 - cxS.minX;
  const dxP = (larguraMax - cxP.largura) / 2 - cxP.minX;
  const todos = [...mover(S, dxS), ...mover(P, dxP, dyP)];
  escreve('assinatura-vertical', todos, `item 17 · vertical · vao ${VAO_V.toFixed(1)} (0,75u)`);
}

// --- 18 · o simbolo isolado ---
escreve('simbolo', S, `item 18 · simbolo isolado (${SIMBOLO})`);

// --- 15 · a principal e a horizontal ---
{
  const dx = cxS.maxX + VAO_H - cxP.minX;
  escreve('assinatura-principal', [...S, ...mover(P, dx)], 'item 15 · assinatura principal = a horizontal');
}

function escreve(nome, conts, nota) {
  const cx = caixa(conts);
  const n = mover(conts, -cx.minX, -cx.minY);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${cx.largura.toFixed(2)} ${cx.altura.toFixed(2)}" width="${Math.round(cx.largura)}" height="${Math.round(cx.altura)}">
<!-- CTRC · ${nota}
     simbolo ${SIMBOLO} e lettering do item 14 · matriz Big Shoulders Display wght 800, SIL OFL 1.1
     unidade do sistema u = ${U} (espessura de haste, medida) -->
<path d="${paraSVG(n)}" fill="#000"/>
</svg>
`;
  writeFileSync(`svg/${nome}.svg`, svg);
  console.log(`${nome.padEnd(24)} ${cx.largura.toFixed(0)}x${cx.altura.toFixed(0)}  razao ${(cx.largura / cx.altura).toFixed(3)}   ${nota}`);
}
