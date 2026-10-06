// Item 14 · a regua do lettering. Ela nao gera forma, so mede (RFC 000, secao 7).
//
// 1. histograma de angulo: o lettering passa a ter a malha da D-07 dentro dele?
// 2. vertice mais agudo: entra em bordado (item 36) e gravacao (item 37)?
// 3. reducao a 48, 24 e 16 px de altura de caixa alta
// 4. tinta
//
// AVISO medido (contrato da rota, secao 4): resize com `background` sobre entrada de 1 canal
// devolve 3 canais. Todo caminho de medicao termina em .greyscale() antes do .raw().
//
// Rodar: node medir.mjs

import { readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { palavra, VAOS, CORTE_C_X } from './lettering.mjs';
import { caixa, mover, paraSVG } from './contorno.mjs';

const require = createRequire(import.meta.url);
const sharp = require('/Users/math.ramos/dev/project-sosanimal/node_modules/sharp');

const TOL = 3;
const ALVOS = [
  { nome: 'horizontal', alvos: [0], naMalha: true },
  { nome: 'diagonal51', alvos: [51, 129], naMalha: true },
  { nome: 'obliqua19', alvos: [71, 109], naMalha: true },
  { nome: 'vertical', alvos: [90], naMalha: false },
];
const n180 = (a) => { let x = a % 180; if (x < 0) x += 180; return x; };
const dAng = (a, b) => { const d = Math.abs(n180(a) - n180(b)); return Math.min(d, 180 - d); };

function classifica(a) {
  for (const f of ALVOS) for (const alvo of f.alvos) if (dAng(a, alvo) <= TOL) return f.nome;
  return 'fora';
}

// ---------- 1 e 2: geometria ----------

function medeGeometria(conts) {
  const hist = { horizontal: 0, vertical: 0, diagonal51: 0, obliqua19: 0, fora: 0 };
  let reto = 0;
  let curvo = 0;
  const vertices = [];

  for (const c of conts) {
    let p0 = c.inicio;
    for (const s of c.segs) {
      if (s.t === 'L') {
        const dx = s.p[0] - p0[0];
        const dy = s.p[1] - p0[1];
        const L = Math.hypot(dx, dy);
        if (L > 1e-6) {
          // y para baixo no SVG: nega dy para ler em convencao matematica
          hist[classifica(n180((Math.atan2(-dy, dx) * 180) / Math.PI))] += L;
          reto += L;
        }
      } else {
        let a = p0;
        for (let k = 1; k <= 24; k++) {
          const t = k / 24;
          const m1 = [p0[0] + (s.c[0] - p0[0]) * t, p0[1] + (s.c[1] - p0[1]) * t];
          const m2 = [s.c[0] + (s.p[0] - s.c[0]) * t, s.c[1] + (s.p[1] - s.c[1]) * t];
          const b = [m1[0] + (m2[0] - m1[0]) * t, m1[1] + (m2[1] - m1[1]) * t];
          curvo += Math.hypot(b[0] - a[0], b[1] - a[1]);
          a = b;
        }
      }
      p0 = s.p;
    }
    // angulo interno de cada vertice
    for (let i = 0; i < c.segs.length; i++) {
      const s = c.segs[i];
      const ant = i === 0 ? c.inicio : c.segs[i - 1].p;
      const prox = c.segs[(i + 1) % c.segs.length];
      const entra = s.t === 'L' ? [s.p[0] - ant[0], s.p[1] - ant[1]] : [s.p[0] - s.c[0], s.p[1] - s.c[1]];
      const sai = prox.t === 'L' ? [prox.p[0] - s.p[0], prox.p[1] - s.p[1]] : [prox.c[0] - s.p[0], prox.c[1] - s.p[1]];
      if (Math.hypot(...entra) < 1e-6 || Math.hypot(...sai) < 1e-6) continue;
      let d = ((Math.atan2(sai[1], sai[0]) - Math.atan2(entra[1], entra[0])) * 180) / Math.PI;
      while (d <= -180) d += 360;
      while (d > 180) d -= 360;
      vertices.push({ ang: +(180 - Math.abs(d)).toFixed(1), p: s.p.map((v) => +v.toFixed(1)) });
    }
  }

  const tot = reto || 1;
  const pct = (v) => +((v / tot) * 100).toFixed(1);
  vertices.sort((a, b) => a.ang - b.ang);
  return {
    contorno: { fracaoReta: +((reto / (reto + curvo)) * 100).toFixed(1) },
    angulo: {
      horizontal: pct(hist.horizontal),
      vertical: pct(hist.vertical),
      diagonal51: pct(hist.diagonal51),
      obliqua19: pct(hist.obliqua19),
      fora: pct(hist.fora),
      naMalhaD07: pct(hist.horizontal + hist.diagonal51 + hist.obliqua19),
    },
    verticeMaisAgudo: vertices[0],
    verticesAbaixoDe60: vertices.filter((v) => v.ang < 60).length,
  };
}

// ---------- 3 e 4: raster ----------

function svgDe(conts, capPx) {
  const cx = caixa(conts);
  const norm = mover(conts, -cx.minX, -cx.minY);
  const esc = capPx / 1000;
  const w = Math.max(1, Math.round(cx.largura * esc));
  const h = Math.max(1, Math.round(cx.altura * esc));
  return {
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${cx.largura} ${cx.altura}"><rect width="${cx.largura}" height="${cx.altura}" fill="#fff"/><path d="${paraSVG(norm)}" fill="#000"/></svg>`,
    w, h, cx,
  };
}

async function tinta(conts) {
  const { svg } = svgDe(conts, 600);
  const { data, info } = await sharp(Buffer.from(svg)).flatten({ background: '#fff' }).greyscale().raw().toBuffer({ resolveWithObject: true });
  let e = 0;
  for (let i = 0; i < data.length; i++) if (data[i] < 128) e++;
  return +((e / (info.width * info.height)) * 100).toFixed(1);
}

// IoU do reduzido e reampliado contra o grande: o numero do RNF-02
async function fidelidade(conts, capPx, N = 400) {
  const { svg, w, h } = svgDe(conts, capPx);
  const grande = await sharp(Buffer.from(svgDe(conts, 1000).svg))
    .resize({ width: N, height: N, fit: 'fill' }).flatten({ background: '#fff' }).greyscale().raw().toBuffer();
  const peq = await sharp(Buffer.from(svg)).resize({ width: w, height: h, fit: 'fill' }).flatten({ background: '#fff' }).png().toBuffer();
  const reamp = await sharp(peq).resize({ width: N, height: N, fit: 'fill', kernel: 'nearest' }).greyscale().raw().toBuffer();
  let inter = 0;
  let uniao = 0;
  for (let i = 0; i < grande.length; i++) {
    const a = grande[i] < 128;
    const b = reamp[i] < 128;
    if (a && b) inter++;
    if (a || b) uniao++;
  }
  return +(inter / (uniao || 1)).toFixed(3);
}

// ---------- roda ----------

const { pecas, R } = palavra();
const todos = pecas.flatMap((p) => p.cs);
const cx = caixa(todos);
const geo = medeGeometria(todos);
const t = await tinta(todos);
const fid = {};
for (const px of [48, 24, 16]) fid[px] = await fidelidade(todos, px);

const saida = {
  item: 14,
  matriz: 'Big Shoulders Display, wght 800, SIL OFL 1.1',
  modificacoes: {
    M1: `perna do R a ${19} graus da vertical, largura ${R.larguraPerna}`,
    M2: `terminais do C cortados a 19 graus da vertical, paralelos, em x=${CORTE_C_X}`,
    M3: `vaos redesenhados C|T ${VAOS.CT}, T|R ${VAOS.TR}, R|C ${VAOS.RC}`,
  },
  caixa: { largura: +cx.largura.toFixed(2), altura: +cx.altura.toFixed(2), razao: +(cx.largura / cx.altura).toFixed(3) },
  ...geo,
  tintaPct: t,
  fidelidade: fid,
};
writeFileSync('medidas.json', JSON.stringify(saida, null, 2));

console.log('\nItem 14 · lettering medido\n');
console.log(`  caixa ${saida.caixa.largura} x ${saida.caixa.altura}  razao ${saida.caixa.razao}`);
console.log(`  aresta reta ${geo.contorno.fracaoReta}% do contorno`);
console.log('  angulo (% da aresta reta):');
console.log(`     horizontal ${geo.angulo.horizontal}  vertical ${geo.angulo.vertical}  obliqua19 ${geo.angulo.obliqua19}  diagonal51 ${geo.angulo.diagonal51}  fora ${geo.angulo.fora}`);
console.log(`     NA MALHA D-07: ${geo.angulo.naMalhaD07}%`);
console.log(`  vertice mais agudo: ${geo.verticeMaisAgudo.ang} graus  (abaixo de 60 graus: ${geo.verticesAbaixoDe60})`);
console.log(`  tinta ${t}%`);
console.log(`  fidelidade  48px ${fid[48]}   24px ${fid[24]}   16px ${fid[16]}`);
