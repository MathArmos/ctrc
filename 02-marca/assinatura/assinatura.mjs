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
import { palavra } from '../lettering/lettering.mjs';
import { caixa, mover, paraSVG } from '../lettering/contorno.mjs';

export const U = 161.2; // espessura de haste, medida no item 14

// 🔴 ESTE ARQUIVO SO ESCREVE QUANDO RODADO DIRETO. Ele exporta `U`, que e a unidade do
// sistema, e o item 24 precisa dela; sem esta guarda, importar a unidade reescrevia os
// quatro SVG da assinatura como efeito colateral de uma leitura.
const DIRETO = import.meta.url === `file://${process.argv[1]}`;
// 🔴 O SIMBOLO VEM DE UMA FONTE UNICA, `simbolo-letra/simbolo.mjs`, e nunca e remontado aqui.
// Antes desta linha existia uma copia da construcao de cada derivacao dentro deste arquivo, e
// duas copias da mesma geometria sao duas chances de uma divergir.
import { simboloFinal, DELTA } from '../simbolo-letra/simbolo.mjs';

// --- as pecas, normalizadas pela linha de base da caixa alta ---
const S = simboloFinal();
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
escreve('simbolo', S, `item 18 · simbolo isolado · o C alargado em ${DELTA}`);

// --- 15 · a principal e a horizontal ---
{
  const dx = cxS.maxX + VAO_H - cxP.minX;
  escreve('assinatura-principal', [...S, ...mover(P, dx)], 'item 15 · assinatura principal = a horizontal');
}

function escreve(nome, conts, nota) {
  if (!DIRETO) return;
  const cx = caixa(conts);
  const n = mover(conts, -cx.minX, -cx.minY);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${cx.largura.toFixed(2)} ${cx.altura.toFixed(2)}" width="${Math.round(cx.largura)}" height="${Math.round(cx.altura)}">
<!-- CTRC · ${nota}
     simbolo: o C alargado em ${DELTA} (item 13) e lettering do item 14 · matriz Big Shoulders Display wght 800, SIL OFL 1.1
     unidade do sistema u = ${U} (espessura de haste, medida) -->
<path d="${paraSVG(n)}" fill="#000"/>
</svg>
`;
  writeFileSync(`svg/${nome}.svg`, svg);
  console.log(`${nome.padEnd(24)} ${cx.largura.toFixed(0)}x${cx.altura.toFixed(0)}  razao ${(cx.largura / cx.altura).toFixed(3)}   ${nota}`);
}
