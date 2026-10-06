// Item 13 · alargamento do C para servir como simbolo.
//
// 🔴 O PROBLEMA: o C do lettering tem razao 0,466. Num avatar de 40 px ele sai com 18 px de
// largura, e a 16 px o contraforma quase fecha. Simbolo derivado de letra tem direito a
// proporcao propria, e esta e a modificacao que lhe da isso.
//
// ❌ NAO SE ALARGA ESCALANDO EM X, e o motivo e de peso. Escalar em x engrossaria a haste
// esquerda, que e vertical, e deixaria os bracos de cima e de baixo como estao, porque a
// espessura deles e vertical. O C sairia com dois pesos diferentes. 🔴 E pior: o corte dos
// terminais a 19 graus MUDARIA DE ANGULO, porque escala nao preserva angulo. A malha cairia
// junto, em silencio.
//
// ✅ O QUE SERVE E TRANSLADAR, e translacao preserva angulo e espessura exatamente.
// O C tem dois apices de tangente horizontal, em cima e embaixo, no mesmo x. Eles partem o
// contorno em metade ESQUERDA e metade DIREITA. Afastando a metade direita e tapando a fenda
// com uma reta horizontal em cada apice, o C fica mais largo e NADA mais muda: a haste
// continua com o mesmo peso, os bracos continuam com a mesma espessura, e os dois cortes de
// 19 graus continuam a 19 graus.
//
// Rodar: node alargar.mjs

import { writeFileSync } from 'node:fs';
import { letraC } from '../lettering/lettering.mjs';
import { caixa, mover, paraSVG } from '../lettering/contorno.mjs';

// 🔴 ONDE O CONTORNO COMECA NAO E O APICE DE BAIXO, e supor isso ja estourou aqui uma vez.
// Depois do chanfro do item 14, `chanfrar` reconstroi o contorno a partir do ponto de corte,
// entao `inicio` passa a ser um ponto qualquer do braco. A guarda pegou (apices em x=287,5 e
// x=339,2). Os dois apices agora sao ACHADOS varrendo, e o contorno e reenraizado no de cima.

// pontos do contorno em ordem de percurso: P0 = inicio, Pk = segs[k-1].p
function pontos(cont) {
  const out = [cont.inicio];
  for (const s of cont.segs) out.push(s.p);
  return out; // o ultimo fecha no primeiro
}

// reenraiza o contorno no vertice k, mantendo a ordem de percurso
function reenraizar(cont, k) {
  const n = cont.segs.length;
  if (k === 0) return cont;
  const P = pontos(cont);
  const segs = [];
  for (let i = 0; i < n; i++) segs.push(cont.segs[(k + i) % n]);
  return { inicio: P[k], segs };
}

const trans = (s, dx) => (s.t === 'L' ? { t: 'L', p: [s.p[0] + dx, s.p[1]] } : { t: 'Q', c: [s.c[0] + dx, s.c[1]], p: [s.p[0] + dx, s.p[1]] });

export function alargarC(cont, delta) {
  const P = pontos(cont);
  const n = cont.segs.length;
  let iTopo = 0;
  let iBaixo = 0;
  for (let i = 0; i < n; i++) {
    if (P[i][1] < P[iTopo][1]) iTopo = i;
    if (P[i][1] > P[iBaixo][1]) iBaixo = i;
  }
  const apiceTopo = P[iTopo];
  const apiceBaixo = P[iBaixo];

  // os dois apices precisam estar no MESMO x, senao nao sao um par de tangente horizontal e
  // a fenda sairia torta. Isto estoura em vez de entregar um C torto.
  if (Math.abs(apiceTopo[0] - apiceBaixo[0]) > 2) {
    throw new Error(`alargar: apices em x diferentes (${apiceTopo[0].toFixed(1)} e ${apiceBaixo[0].toFixed(1)})`);
  }

  // reenraiza no apice de cima e acha onde o apice de baixo cai no novo percurso
  const c = reenraizar(cont, iTopo);
  const Q = pontos(c);
  let j = -1;
  for (let i = 1; i < Q.length; i++) {
    if (Math.hypot(Q[i][0] - apiceBaixo[0], Q[i][1] - apiceBaixo[1]) < 1e-6) { j = i; break; }
  }
  if (j < 1) throw new Error('alargar: nao achei o apice de baixo no percurso reenraizado');

  const arco1 = c.segs.slice(0, j);   // apice de cima -> apice de baixo
  const arco2 = c.segs.slice(j);      // apice de baixo -> apice de cima

  // qual dos dois e a metade DIREITA, medida pelo x medio dos pontos dele
  const medioX = (arr, de) => {
    let soma = de[0];
    let k = 1;
    for (const s of arr) { soma += s.p[0]; k++; }
    return soma / k;
  };
  const arco1Direita = medioX(arco1, apiceTopo) > medioX(arco2, apiceBaixo);

  const segs = [];
  if (arco1Direita) {
    segs.push({ t: 'L', p: [apiceTopo[0] + delta, apiceTopo[1]] });
    for (const s of arco1) segs.push(trans(s, delta));
    segs.push({ t: 'L', p: apiceBaixo });
    for (const s of arco2) segs.push(s);
  } else {
    for (const s of arco1) segs.push(s);
    segs.push({ t: 'L', p: [apiceBaixo[0] + delta, apiceBaixo[1]] });
    for (const s of arco2) segs.push(trans(s, delta));
    segs.push({ t: 'L', p: apiceTopo });
  }
  return { inicio: apiceTopo, segs };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const base = letraC();
  if (base.length !== 1) throw new Error(`o C deveria ter 1 contorno, tem ${base.length}`);
  const alvoRazao = [0.466, 0.58, 0.66, 0.74];
  const cx0 = caixa(base);
  for (const r of alvoRazao) {
    const larguraAlvo = r * cx0.altura;
    const delta = Math.max(0, larguraAlvo - cx0.largura);
    const c = delta === 0 ? base[0] : alargarC(base[0], delta);
    const cx = caixa([c]);
    const n = mover([c], -cx.minX, -cx.minY);
    const id = `C${String(Math.round(r * 100)).padStart(2, '0')}`;
    writeFileSync(`svg/${id}.svg`, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${cx.largura.toFixed(2)} ${cx.altura.toFixed(2)}" width="${Math.round(cx.largura)}" height="${Math.round(cx.altura)}">
<!-- Item 13 · ${id} · o C do lettering alargado por translacao, delta ${delta.toFixed(1)}
     angulo e peso preservados exatamente: nenhuma escala foi aplicada -->
<path d="${paraSVG(n)}" fill="#000"/>
</svg>
`);
    console.log(`${id}  delta ${delta.toFixed(1).padStart(6)}  ${cx.largura.toFixed(0)}x${cx.altura.toFixed(0)}  razao ${(cx.largura / cx.altura).toFixed(3)}`);
  }
}
