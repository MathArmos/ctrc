// Item 14 · o lettering CTRC.
//
// Matriz: Big Shoulders Display, instancia wght 800, SIL OFL 1.1 (item 29, familia F4).
// A OFL rege o arquivo da fonte, e nao o desenho feito com ela (D-03).
//
// 🔴 TRES MODIFICACOES, E AS TRES SAEM DA MALHA DA D-07. Nenhuma e enfeite:
//
//   M1. A PERNA DO R VAI PARA EXATAMENTE 19 GRAUS DA VERTICAL.
//       Na fonte as duas arestas dela estao a 16,8 e 15,1 graus, ou seja a perna AFUNILA.
//       Levadas as duas a 19, elas ficam paralelas e a perna passa a ter largura constante
//       de 161,1 unidades. 📌 Isso nao foi escolhido por simetria: 161,2 e a espessura de
//       haste desta fonte, medida na haste do T (159,4 a 320,6), na haste do R (54,4 a 215,6)
//       e nos dois terminais do C. A perna cai em cima do peso que a familia ja usa, com
//       0,12 unidade de diferenca, que e 0,012% da caixa alta.
//       ✅ E esta e a modificacao que torna literal a frase do eixo conceitual: de tudo o que
//       existe hoje sobrevive um angulo, e ele esta aqui dentro da letra.
//
//   M2. OS DOIS TERMINAIS DO C SAO CORTADOS A 19 GRAUS DA VERTICAL, PARALELOS.
//       Na fonte eles sao horizontais, e isso foi MEDIDO e nao suposto: o C tem duas retas de
//       161 unidades a 0 grau e mais nada de oblíquo. Cortados, a boca do C deixa de ser um
//       entalhe retangular e passa a ser um corte inclinado.
//       ⚠️ OS DOIS CORTES SAO PARALELOS, E NUNCA ESPELHADOS. Espelhados eles abririam a boca
//       em bico, que e a forma do chevron, e a D-07 manda o chevron MORRER como forma. O que
//       sobrevive e o angulo. Paralelos, a boca inclina e nao aponta.
//       ❌ A 51 graus foi tentado e descartado por medida, nao por gosto: o terminal tem 161
//       unidades e a boca 260, entao um corte a 51 sobe 199 e fecha a boca.
//
//   M3. O ESPACAMENTO E REDESENHADO, e deixa de ser o da fonte.
//       Fonte espaca para texto corrido; logotipo espaca para uma palavra so.
//
// ❌ O T NAO FOI TOCADO. Ele e horizontal e vertical puros, e nao ha nada nele que a malha
//    peca para mudar. Mexer no T seria mexer para parecer que se mexeu.
//
// Rodar: node lettering.mjs

import { create } from '/Users/math.ramos/dev/project-sosanimal/node_modules/fontkitten/dist/index.js';
import { readFileSync, writeFileSync } from 'node:fs';
import { daFonte, paraSVG, chanfrar, reta, caixa, mover } from './contorno.mjs';

const FONTE = '../tipografia/fontes/bigshouldersdisplay/BigShouldersDisplay[wght].ttf';
const PESO = { wght: 800 };
const CAIXA_ALTA = 1000;
const GRAUS_DA_VERTICAL = 19; // D-07
const TAN19 = Math.tan((GRAUS_DA_VERTICAL * Math.PI) / 180);

// profundidade do corte do C: x em que a reta do chanfro cruza a face da boca.
// Medido olhando: 470 corta o canto, 420 come a boca.
export const CORTE_C_X = 470;

const f = create(readFileSync(FONTE)).getVariation(PESO);
const ESC = CAIXA_ALTA / f.glyphsForString('T')[0].bbox.maxY;
const g = (ch) => f.glyphsForString(ch)[0];

// ---------- M2: o C ----------

// as duas faces da boca, em espaco SVG (y para baixo, topo da caixa alta em 0)
const FACE_CIMA = CAIXA_ALTA - 631.9 * 1;
const FACE_BAIXO = CAIXA_ALTA - 371.3 * 1;

export function letraC() {
  let cs = daFonte(g('C'), ESC);
  // y para baixo: -71 e a reta que sobe para a direita. E a unica que corta o CANTO do braco
  // sem atravessar o ombro: a +71 nao cruza o braco de cima e destroi o de baixo (medido).
  const L1 = reta([CORTE_C_X, FACE_CIMA], -71);
  cs = cs.map((c, i) => (i === 0 ? chanfrar(c, L1, [522, FACE_CIMA + 12]) : c));
  const L2 = reta([CORTE_C_X, FACE_BAIXO], -71);
  cs = cs.map((c, i) => (i === 0 ? chanfrar(c, L2, [527, FACE_BAIXO - 12]) : c));
  return cs;
}

// ---------- M2 continuacao: o T, intocado ----------

export function letraT() {
  return daFonte(g('T'), ESC);
}

// ---------- M1: o R ----------

export function letraR() {
  const cs = daFonte(g('R'), ESC);
  const ext = cs[0];

  // na fonte, em unidades de caixa alta e com y para cima:
  //   aresta externa da perna: de (417,5 , 375,6) ate (530,6 , 0)
  //   aresta interna da perna: de (265,6 , 348,8) ate (359,4 , 0)
  // o topo de cada uma e junta com o bojo e NAO se mexe. O que anda e o pe.
  const TOPO_EXT = [417.5, 375.6];
  const TOPO_INT = [265.6, 348.8];
  const peExt = TOPO_EXT[0] + TOPO_EXT[1] * TAN19;
  const peInt = TOPO_INT[0] + TOPO_INT[1] * TAN19;

  // em espaco SVG a base da caixa alta e y = CAIXA_ALTA
  const alvoExt = [peExt, CAIXA_ALTA];
  const alvoInt = [peInt, CAIXA_ALTA];

  // acha os dois pes atuais pelo valor, e nao pela posicao no array: se a fonte mudar de
  // versao e a ordem dos comandos andar, isto estoura em vez de mover o ponto errado.
  const perto = (p, q, tol = 0.6) => Math.hypot(p[0] - q[0], p[1] - q[1]) < tol;
  const velhoExt = [530.6, CAIXA_ALTA];
  const velhoInt = [359.4, CAIXA_ALTA];
  let achouExt = 0;
  let achouInt = 0;
  for (const s of ext.segs) {
    if (s.t === 'L' && perto(s.p, velhoExt)) { s.p = alvoExt; achouExt++; }
    else if (s.t === 'L' && perto(s.p, velhoInt)) { s.p = alvoInt; achouInt++; }
  }
  if (achouExt !== 1 || achouInt !== 1) {
    throw new Error(`M1: esperava 1 pe externo e 1 interno, achei ${achouExt} e ${achouInt}. A fonte mudou?`);
  }

  return { cs, peExt, peInt, larguraPerna: +(peExt - peInt).toFixed(2) };
}

// ---------- M3: a palavra ----------

// vaos entre caixas de letra, redesenhados. Nao sao os avancos da fonte.
export const VAOS = { CT: 34, TR: 34, RC: 46 };

export function palavra() {
  const C1 = letraC();
  const T = letraT();
  const Rr = letraR();
  const C2 = letraC();

  const pecas = [
    { ch: 'C', cs: C1 },
    { ch: 'T', cs: T },
    { ch: 'R', cs: Rr.cs },
    { ch: 'C', cs: C2 },
  ];
  const vaos = [VAOS.CT, VAOS.TR, VAOS.RC];

  let x = 0;
  const postas = [];
  for (let i = 0; i < pecas.length; i++) {
    const cx = caixa(pecas[i].cs);
    const dx = x - cx.minX;
    postas.push({ ch: pecas[i].ch, cs: mover(pecas[i].cs, dx), largura: cx.largura });
    x += cx.largura + (vaos[i] ?? 0);
  }
  return { pecas: postas, R: Rr };
}

// ---------- saida ----------

if (import.meta.url === `file://${process.argv[1]}`) {
  const { pecas, R } = palavra();
  const todos = pecas.flatMap((p) => p.cs);
  const cx = caixa(todos);
  const norm = mover(todos, -cx.minX, -cx.minY);
  const c2 = caixa(norm);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${c2.largura.toFixed(2)} ${c2.altura.toFixed(2)}" width="${Math.round(c2.largura)}" height="${Math.round(c2.altura)}">
<!-- Item 14 · lettering CTRC · matriz Big Shoulders Display wght 800, SIL OFL 1.1, em curvas e modificada (D-03)
     M1 perna do R a 19 graus da vertical, largura ${R.larguraPerna}
     M2 terminais do C cortados a 19 graus da vertical, paralelos, em x=${CORTE_C_X}
     M3 vaos redesenhados: C|T ${VAOS.CT}, T|R ${VAOS.TR}, R|C ${VAOS.RC}
     caixa alta = ${CAIXA_ALTA} unidades -->
<path d="${paraSVG(norm)}" fill="#000"/>
</svg>
`;
  writeFileSync('svg/lettering-ctrc.svg', svg);

  console.log('Item 14 · lettering CTRC');
  console.log(`  perna do R: ${R.larguraPerna} unidades de largura (haste da fonte = 161,2)`);
  console.log(`  pe externo ${R.peExt.toFixed(2)} · pe interno ${R.peInt.toFixed(2)}`);
  for (const p of pecas) console.log(`  ${p.ch}: ${p.largura.toFixed(1)}`);
  console.log(`  palavra: ${c2.largura.toFixed(1)} x ${c2.altura.toFixed(1)} · razao ${(c2.largura / c2.altura).toFixed(3)}`);
  console.log('  svg/lettering-ctrc.svg');
}
