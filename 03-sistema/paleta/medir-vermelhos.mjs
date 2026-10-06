// Item 27 · de onde sai o vermelho de marca.
//
// 🔴 O EIXO CONCEITUAL JA OBRIGA UM VERMELHO SO. O paragrafo acusa a marca atual de existir
// "em tres vermelhos diferentes, um por acabamento", entao entregar dois ja o contradiz.
// O que esta pagina faz NAO e escolher se a marca e vermelha: e medir os tres e achar o um.
//
// ⚠️ A fonte e o material commitado em 00-briefing/material-cliente/, e nao um scratchpad.
// A medicao anterior apontava para uma pasta de sessao que nao existe mais, e por isso nao
// era reproduzivel.
//
// Rodar: node medir-vermelhos.mjs

import { createRequire } from 'node:module';
import { writeFileSync } from 'node:fs';
const require = createRequire(import.meta.url);
const sharp = require('/Users/math.ramos/dev/project-sosanimal/node_modules/sharp');

const MAT = '../../00-briefing/material-cliente/';
const ARQUIVOS = [
  ['fachada-entardecer.jpg', 'fachada ao entardecer, retroiluminada'],
  ['fachada-noite.png', 'fachada a noite, retroiluminada'],
  ['interior-foto-real.jpg', 'marca na parede, fotografia real'],
  ['interior-render.webp', 'interior, render de projeto'],
];

const hex = (r, g, b) => '#' + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('').toUpperCase();

// luminancia relativa da WCAG, para o contraste do RNF-04
function lum(r, g, b) {
  const f = (v) => { const c = v / 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}
export const contraste = (a, b) => {
  const L1 = lum(...a);
  const L2 = lum(...b);
  return +(((Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05))).toFixed(2);
};

async function vermelhos(arquivo, rotulo) {
  const { data, info } = await sharp(MAT + arquivo).raw().toBuffer({ resolveWithObject: true });
  const ch = info.channels;
  const baldes = new Map();
  let n = 0;
  let somaR = 0;
  let somaG = 0;
  let somaB = 0;
  for (let i = 0; i < data.length; i += ch) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    // pixel claramente vermelho e saturado: a mesma regra da medicao de 2026-10-03
    if (r > 110 && r > g * 1.9 && r > b * 1.7) {
      const k = `${r >> 4},${g >> 4},${b >> 4}`;
      baldes.set(k, (baldes.get(k) || 0) + 1);
      n++; somaR += r; somaG += g; somaB += b;
    }
  }
  const topo = [...baldes.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3)
    .map(([k, c]) => {
      const [r, g, b] = k.split(',').map((v) => parseInt(v, 10) * 16 + 8);
      return { hex: hex(r, g, b), rgb: [r, g, b], px: c, pct: +((100 * c / n).toFixed(1)) };
    });
  const medio = n ? [somaR / n, somaG / n, somaB / n] : null;
  return { arquivo, rotulo, pixelsVermelhos: n, pctDaImagem: +((100 * n / (info.width * info.height)).toFixed(2)), dominantes: topo, medio: medio ? { hex: hex(...medio), rgb: medio.map((v) => Math.round(v)) } : null };
}

const saida = [];
for (const [a, r] of ARQUIVOS) {
  const m = await vermelhos(a, r);
  saida.push(m);
  console.log(`\n${r}`);
  console.log(`  ${m.pixelsVermelhos} px vermelhos (${m.pctDaImagem}% da imagem)`);
  for (const d of m.dominantes) console.log(`    ${d.hex}  ${d.px} px  ${d.pct}% dos vermelhos`);
  if (m.medio) console.log(`    medio ${m.medio.hex}`);
}
writeFileSync('medidas-vermelhos.json', JSON.stringify({ fonte: MAT, saida }, null, 2));
console.log('\nmedidas-vermelhos.json escrito');
