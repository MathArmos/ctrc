// Item 13 · O SIMBOLO, fonte unica da verdade.
//
// Escolha do driver em 2026-10-06: S1, o C sozinho.
// 📌 Ele foi o unico que NAO gagueja ao lado da palavra. A palavra CTRC ja comeca com C e com
// T, entao um simbolo CT posto ao lado dela le "CT CTRC". A tabela de medidas dava a S2 e a
// S3 como melhores em razao, reducao e distancia do chevron, e as duas perdiam na unica coisa
// que a assinatura principal precisa fazer. Quem achou isso foi a folha, nao o numero.
//
// 🔴 E O C PRECISOU SER ALARGADO, por medida e nao por gosto. Como letra ele tem razao 0,466,
// e a 16 px o contraforma quase fecha: a fidelidade da 0,682 contra o piso de 0,85, que e o
// RNF-02. Simbolo derivado de letra tem direito a proporcao propria.
//
// ✅ ALARGADO POR TRANSLACAO, e nunca por escala em x. Ver `alargar.mjs` para o porque:
// escala engrossaria a haste e mudaria o angulo dos dois cortes de 19 graus, derrubando a
// malha em silencio. A translacao preserva os dois cortes exatamente, e isso foi conferido:
// 71 graus e comprimento 164,5 e 401,8, identicos antes e depois.
//
// 🔴 O DELTA E O MINIMO QUE PASSA, e a busca esta registrada:
//
//   razao   delta   tinta    16 px     chevron
//   0,466       0   24,2%    0,682 ❌   0,360
//   0,580   116,4   35,6%    0,853 ✅   0,438     <- adotado
//   0,660   198,2   43,5%    0,891 ✅   0,462
//   0,740   280,0   51,6% ❌  0,918     0,466
//
// ⚠️ ALARGAR TEM DOIS PRECOS, E OS DOIS SOBEM JUNTOS: a tinta cresce (bordado, item 36) e o
// simbolo se APROXIMA DO CHEVRON, que e a forma que a D-07 manda morrer. De 0,360 a 0,466 em
// 280 unidades de alargamento, contra um piso de reprova em 0,50. 📌 E por isso que o delta
// adotado e o minimo que passa, e nao o que mede melhor em reducao: cada unidade a mais
// compra fidelidade com distancia da marca velha.

import { letraC } from '../lettering/lettering.mjs';
import { alargarC } from './alargar.mjs';

export const DELTA = 116.4; // minimo que leva a fidelidade a 16 px acima do piso de 0,85
export const RAZAO_ALVO = 0.58;

export function simboloFinal() {
  const base = letraC();
  if (base.length !== 1) throw new Error(`o C deveria ter 1 contorno, tem ${base.length}`);
  return [alargarC(base[0], DELTA)];
}
