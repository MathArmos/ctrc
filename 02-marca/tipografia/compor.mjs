// Item 29 · compoe CTRC em cada familia candidata e mede o que decide a P-09.
//
// O que ele faz:
//   1. abre cada fonte, instancia o peso declarado em candidatas.json
//   2. mede a altura de caixa alta no proprio glifo T (topo chato, base na linha)
//   3. normaliza as oito para caixa alta = 1000, que e a unidade do item 6
//   4. escreve svg/CTRC-<id>.svg com o contorno real do glifo, ja em curvas
//   5. mede o histograma de angulo das arestas retas: e isto que responde a P-09
//
// Rodar: node compor.mjs
//
// AVISOS DE REGUA
//   - kerning (GPOS) NAO e aplicado. Avanco natural, tracking 0. Declarado em candidatas.json
//   - o histograma mede SO aresta reta. A fracao curva do contorno vai no relatorio, porque
//     familia quase toda curva tem pouco a dizer sobre a malha, e isso precisa aparecer
//   - a altura de caixa alta e MEDIDA no T, e conferida contra a declarada em OS/2. Divergencia
//     acima de 1 unidade e impressa, nunca engolida

import { create } from '/Users/math.ramos/dev/project-sosanimal/node_modules/fontkitten/dist/index.js';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const CFG = JSON.parse(readFileSync('candidatas.json', 'utf8'));
const CAIXA_ALTA = 1000; // unidade do projeto, igual a do item 6
const TOL = 3; // graus de tolerancia na classificacao de familia angular

// As tres familias da malha (D-07), em angulo normalizado para [0,180).
//
// 🔴 A PRIMEIRA PASSADA ERROU AQUI, E O AVISO FOI UM ZERO EM TODAS AS OITO.
// O contrato da rota declara a malha como horizontal 0, obliqua -71 e diagonais +-51.
// Normalizado para [0,180), -71 e 109 e -51 e 129, NAO 71 e 51. Os alvos tinham sido postos
// nos ESPELHOS das familias reais, e por isso nada casava. Medida impossivel e defeito da
// regua antes de ser defeito do objeto.
//
// Espelho conta como dentro da familia, de proposito: espelhar uma forma e de graca em
// desenho, entao uma aresta a 71 fala a mesma lingua que uma a 109. Os dois alvos de cada
// familia ficam declarados para que isso seja escolha visivel, e nao efeito colateral.
const FAMILIAS_ANGULO = [
  { nome: 'horizontal', alvos: [0], naMalha: true },
  { nome: 'diagonal51', alvos: [51, 129], naMalha: true },
  { nome: 'obliqua19', alvos: [71, 109], naMalha: true }, // 19 graus da vertical
  { nome: 'vertical', alvos: [90], naMalha: false },
];

// alvos da malha, para medir distancia de uma aresta qualquer a familia mais proxima
const ALVOS_MALHA = FAMILIAS_ANGULO.filter((f) => f.naMalha).flatMap((f) => f.alvos.map((a) => ({ a, nome: f.nome })));

// ---------- geometria ----------

function normaliza180(a) {
  let x = a % 180;
  if (x < 0) x += 180;
  return x;
}

function distanciaAngular(a, alvo) {
  const d = Math.abs(normaliza180(a) - normaliza180(alvo));
  return Math.min(d, 180 - d);
}

function classifica(anguloGraus) {
  for (const f of FAMILIAS_ANGULO) {
    for (const alvo of f.alvos) {
      if (distanciaAngular(anguloGraus, alvo) <= TOL) return f.nome;
    }
  }
  return 'fora';
}

// para uma aresta obliqua, qual familia da malha esta mais perto e a quantos graus
function maisProximaDaMalha(anguloGraus) {
  let melhor = null;
  for (const t of ALVOS_MALHA) {
    const d = distanciaAngular(anguloGraus, t.a);
    if (!melhor || d < melhor.d) melhor = { d: +d.toFixed(1), nome: t.nome, alvo: t.a };
  }
  return melhor;
}

// comprimento aproximado de bezier por amostragem, so para saber quanto do contorno e curva
function comprimentoCurva(p0, pts, grau, amostras = 24) {
  const bez = (t) => {
    if (grau === 2) {
      const [c, p1] = pts;
      const u = 1 - t;
      return [u * u * p0[0] + 2 * u * t * c[0] + t * t * p1[0], u * u * p0[1] + 2 * u * t * c[1] + t * t * p1[1]];
    }
    const [c1, c2, p1] = pts;
    const u = 1 - t;
    return [
      u ** 3 * p0[0] + 3 * u * u * t * c1[0] + 3 * u * t * t * c2[0] + t ** 3 * p1[0],
      u ** 3 * p0[1] + 3 * u * u * t * c1[1] + 3 * u * t * t * c2[1] + t ** 3 * p1[1],
    ];
  };
  let L = 0;
  let a = bez(0);
  for (let i = 1; i <= amostras; i++) {
    const b = bez(i / amostras);
    L += Math.hypot(b[0] - a[0], b[1] - a[1]);
    a = b;
  }
  return L;
}

// ---------- composicao ----------

function compor(cand) {
  const bytes = readFileSync(cand.arquivo);
  let fonte = create(bytes);
  if (cand.instancia) fonte = fonte.getVariation(cand.instancia);

  const glifos = fonte.glyphsForString(CFG.palavra);
  if (glifos.length !== CFG.palavra.length) {
    throw new Error(`${cand.id}: ${glifos.length} glifos para ${CFG.palavra.length} letras`);
  }

  // caixa alta MEDIDA no T (indice 1 em CTRC), que tem topo chato e base na linha
  const T = glifos[1];
  const capMedida = T.bbox.maxY;
  const capDeclarada = fonte.capHeight ?? null;
  const divergencia = capDeclarada == null ? null : +(capMedida - capDeclarada).toFixed(3);

  const escala = CAIXA_ALTA / capMedida;

  // percorre os comandos acumulando o cursor de avanco, e ja transforma para espaco SVG
  // (Y para baixo): x' = (x + cursor) * escala ; y' = (capAlta - y * escala)
  const segmentos = [];
  let comprimentoReto = 0;
  let comprimentoCurvo = 0;
  const partes = [];
  let cursor = 0;

  for (const g of glifos) {
    const d = [];
    let atual = null;
    let inicio = null;
    const tx = (x) => +((x + cursor) * escala).toFixed(3);
    const ty = (y) => +(CAIXA_ALTA - y * escala).toFixed(3);

    const reta = (de, para) => {
      const dx = para[0] - de[0];
      const dy = para[1] - de[1];
      const L = Math.hypot(dx, dy);
      if (L < 1e-6) return;
      // angulo em convencao matematica (Y para cima), por isso -dy
      const ang = (Math.atan2(-dy, dx) * 180) / Math.PI;
      segmentos.push({ ang: normaliza180(ang), L });
      comprimentoReto += L;
    };

    for (const c of g.path.commands) {
      const a = c.args;
      if (c.command === 'moveTo') {
        atual = [tx(a[0]), ty(a[1])];
        inicio = atual;
        d.push(`M${atual[0]} ${atual[1]}`);
      } else if (c.command === 'lineTo') {
        const p = [tx(a[0]), ty(a[1])];
        reta(atual, p);
        d.push(`L${p[0]} ${p[1]}`);
        atual = p;
      } else if (c.command === 'quadraticCurveTo') {
        const c1 = [tx(a[0]), ty(a[1])];
        const p = [tx(a[2]), ty(a[3])];
        comprimentoCurvo += comprimentoCurva(atual, [c1, p], 2);
        d.push(`Q${c1[0]} ${c1[1]} ${p[0]} ${p[1]}`);
        atual = p;
      } else if (c.command === 'bezierCurveTo') {
        const c1 = [tx(a[0]), ty(a[1])];
        const c2 = [tx(a[2]), ty(a[3])];
        const p = [tx(a[4]), ty(a[5])];
        comprimentoCurvo += comprimentoCurva(atual, [c1, c2, p], 3);
        d.push(`C${c1[0]} ${c1[1]} ${c2[0]} ${c2[1]} ${p[0]} ${p[1]}`);
        atual = p;
      } else if (c.command === 'closePath') {
        if (inicio && atual) reta(atual, inicio);
        d.push('Z');
        atual = inicio;
      }
    }
    partes.push(d.join(''));
    cursor += g.advanceWidth;
  }

  // caixa real do conjunto, tirada dos bbox de cada glifo ja transformados
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  let cur2 = 0;
  for (const g of glifos) {
    const b = g.bbox;
    minX = Math.min(minX, (b.minX + cur2) * escala);
    maxX = Math.max(maxX, (b.maxX + cur2) * escala);
    minY = Math.min(minY, CAIXA_ALTA - b.maxY * escala);
    maxY = Math.max(maxY, CAIXA_ALTA - b.minY * escala);
    cur2 += g.advanceWidth;
  }

  // histograma por familia angular, ponderado por comprimento
  const hist = {};
  for (const f of FAMILIAS_ANGULO) hist[f.nome] = 0;
  hist.fora = 0;
  for (const s of segmentos) hist[classifica(s.ang)] += s.L;

  const totalReto = comprimentoReto || 1;
  const contorno = comprimentoReto + comprimentoCurvo;
  const pct = (v) => +((v / totalReto) * 100).toFixed(1);

  const naMalha = hist.horizontal + hist.diagonal51 + hist.obliqua19;

  // AS OBLIQUAS REAIS: toda aresta que nao e horizontal nem vertical, agrupada em degraus de
  // 1 grau, com a distancia dela a familia mais proxima da malha. 📌 E esta lista que responde
  // a P-09, e nao o histograma: o histograma diz se casa dentro da tolerancia, e a lista diz
  // POR QUANTO erra quando nao casa.
  const balde = new Map();
  for (const sg of segmentos) {
    const dH = Math.min(distanciaAngular(sg.ang, 0), distanciaAngular(sg.ang, 180));
    if (dH <= TOL || distanciaAngular(sg.ang, 90) <= TOL) continue;
    const k = Math.round(sg.ang);
    balde.set(k, (balde.get(k) || 0) + sg.L);
  }
  const obliquas = [...balde.entries()]
    .map(([ang, L]) => {
      const prox = maisProximaDaMalha(ang);
      return {
        anguloGraus: ang,
        daVertical: +Math.abs(ang - 90).toFixed(1),
        pctDaRetaTotal: +((L / totalReto) * 100).toFixed(1),
        familiaMaisProxima: prox.nome,
        alvo: prox.alvo,
        distanciaAoAlvo: prox.d,
      };
    })
    .filter((o) => o.pctDaRetaTotal >= 0.5)
    .sort((a, b) => b.pctDaRetaTotal - a.pctDaRetaTotal);

  // a obliqua que carrega mais massa, que e o que o olho le como inclinacao da familia
  const principal = obliquas[0] || null;

  return {
    id: cand.id,
    familia: cand.familia,
    natureza: cand.natureza,
    instancia: cand.instancia,
    caixaAltaMedida: +capMedida.toFixed(2),
    caixaAltaDeclarada: capDeclarada,
    divergenciaCaixaAlta: divergencia,
    unitsPerEm: fonte.unitsPerEm,
    escala: +escala.toFixed(5),
    larguraTotal: +(maxX - minX).toFixed(2),
    alturaTotal: +(maxY - minY).toFixed(2),
    razao: +((maxX - minX) / (maxY - minY)).toFixed(3),
    caixa: { minX: +minX.toFixed(2), minY: +minY.toFixed(2), maxX: +maxX.toFixed(2), maxY: +maxY.toFixed(2) },
    contorno: {
      fracaoReta: +((comprimentoReto / contorno) * 100).toFixed(1),
      fracaoCurva: +((comprimentoCurvo / contorno) * 100).toFixed(1),
      segmentosRetos: segmentos.length,
    },
    angulo: {
      horizontal: pct(hist.horizontal),
      vertical: pct(hist.vertical),
      diagonal51: pct(hist.diagonal51),
      obliqua19: pct(hist.obliqua19),
      fora: pct(hist.fora),
      naMalhaD07: pct(naMalha),
    },
    obliquas,
    obliquaPrincipal: principal,
    svg: `svg/CTRC-${cand.id}.svg`,
    partes,
    offsetX: +minX.toFixed(3),
  };
}

// ---------- saida ----------

mkdirSync('svg', { recursive: true });
const medidas = [];

for (const cand of CFG.familias) {
  const m = compor(cand);
  // SVG com a caixa justa na tinta, origem no canto da caixa
  const vb = `0 0 ${m.larguraTotal.toFixed(3)} ${m.alturaTotal.toFixed(3)}`;
  const corpo = m.partes
    .map((d) => `  <path d="${d}"/>`)
    .join('\n');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" width="${m.larguraTotal.toFixed(0)}" height="${m.alturaTotal.toFixed(0)}">
<!-- Item 29 · CTRC em ${m.familia}${m.instancia ? ' ' + JSON.stringify(m.instancia) : ''} · contorno real do glifo, em curvas (D-03)
     caixa alta normalizada para ${CAIXA_ALTA} unidades · kerning nao aplicado · licenca SIL OFL 1.1 -->
<g fill="#000" transform="translate(${(-m.caixa.minX).toFixed(3)} ${(-m.caixa.minY).toFixed(3)})">
${corpo}
</g>
</svg>
`;
  writeFileSync(m.svg, svg);
  delete m.partes;
  delete m.offsetX;
  medidas.push(m);
}

writeFileSync('medidas.json', JSON.stringify({ unidade: CFG.unidade, tolerancia: TOL, familias: medidas }, null, 2));

// tabela no terminal
const col = (s, n) => String(s).padEnd(n);
console.log('\nItem 29 · CTRC composto nas oito candidatas, caixa alta = 1000\n');
console.log(col('id', 4) + col('familia', 23) + col('razao', 8) + col('reta%', 7) + col('horiz', 7) + col('vert', 7) + col('51', 7) + col('19v', 7) + col('malha', 7) + 'fora');
console.log('-'.repeat(94));
for (const m of medidas) {
  console.log(
    col(m.id, 4) +
      col(m.familia, 23) +
      col(m.razao.toFixed(2), 8) +
      col(m.contorno.fracaoReta.toFixed(0), 7) +
      col(m.angulo.horizontal.toFixed(0), 7) +
      col(m.angulo.vertical.toFixed(0), 7) +
      col(m.angulo.diagonal51.toFixed(1), 7) +
      col(m.angulo.obliqua19.toFixed(1), 7) +
      col(m.angulo.naMalhaD07.toFixed(0), 7) +
      m.angulo.fora.toFixed(0)
  );
}
console.log('\n% de angulo sao fracao do comprimento de aresta RETA, nao do contorno inteiro.');
console.log('malha = 0 graus, +-51 e 19 da vertical (109/71). Vertical pura NAO esta na malha.\n');

console.log('A OBLIQUA DE CADA FAMILIA, que e o que decide a P-09:\n');
console.log(col('id', 4) + col('familia', 23) + col('obliqua', 10) + col('da vert', 10) + col('massa', 8) + col('familia malha', 15) + 'erra por');
console.log('-'.repeat(88));
for (const m of medidas) {
  const o = m.obliquaPrincipal;
  if (!o) {
    console.log(col(m.id, 4) + col(m.familia, 23) + 'NENHUMA aresta obliqua: so horizontal e vertical');
    continue;
  }
  console.log(
    col(m.id, 4) +
      col(m.familia, 23) +
      col(o.anguloGraus + 'gr', 10) +
      col(o.daVertical.toFixed(0) + 'gr', 10) +
      col(o.pctDaRetaTotal.toFixed(1) + '%', 8) +
      col(o.familiaMaisProxima + ' ' + o.alvo, 15) +
      o.distanciaAoAlvo.toFixed(1) + 'gr'
  );
}
console.log('');
for (const m of medidas) {
  if (m.divergenciaCaixaAlta !== null && Math.abs(m.divergenciaCaixaAlta) > 1) {
    console.log(`AVISO ${m.id} ${m.familia}: caixa alta medida ${m.caixaAltaMedida} contra ${m.caixaAltaDeclarada} declarada em OS/2 (${m.divergenciaCaixaAlta})`);
  }
}
