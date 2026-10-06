// Contorno dos tres estados · itens 39 a 41.
//
// 🔴 NENHUMA SILHUETA FOI DESENHADA A MAO NEM DE MEMORIA. A origem e a malha
// territorial do IBGE, baixada da API v3 em 2026-10-06 e guardada em `origem/`
// para a peca continuar reproduzivel com a API fora do ar. Contorno de estado
// inventado seria dado plausivel dentro de um ativo de marca, que e exatamente
// o que este projeto proibe.
//
// Rodar: node 02-marca/selo-10-anos/estados.mjs

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const AQUI = dirname(fileURLToPath(import.meta.url));

export const UF = {
  SP: { arquivo: 'ibge-uf-35-sao-paulo.json', nome: 'Sao Paulo' },
  SC: { arquivo: 'ibge-uf-42-santa-catarina.json', nome: 'Santa Catarina' },
  MG: { arquivo: 'ibge-uf-31-minas-gerais.json', nome: 'Minas Gerais' },
};

// todos os aneis de um Polygon ou MultiPolygon, sem furo (anel 0 de cada peca)
function aneis(geom) {
  const partes = geom.type === 'MultiPolygon' ? geom.coordinates : [geom.coordinates];
  return partes.map((p) => p[0]);
}

const area = (anel) => {
  let a = 0;
  for (let i = 0, j = anel.length - 1; i < anel.length; j = i++)
    a += anel[j][0] * anel[i][1] - anel[i][0] * anel[j][1];
  return Math.abs(a) / 2;
};

// ⚠️ SO O MAIOR ANEL ENTRA. Sao Paulo vem como MultiPolygon por causa das ilhas
// (Ilhabela, Ilha Comprida e companhia): a 3 cm de diametro elas viram sujeita
// solta ao lado do estado, e em corte de patch ou de adesivo viram peca perdida.
// Custo declarado: o contorno entregue e o continental, nao o oficial completo.
export function contorno(sigla) {
  const bruto = JSON.parse(readFileSync(join(AQUI, 'origem', UF[sigla].arquivo), 'utf8'));
  const todos = bruto.features.flatMap((f) => aneis(f.geometry));
  const maior = todos.reduce((a, b) => (area(a) >= area(b) ? a : b));

  // projecao equiretangular com correcao de latitude. Para a extensao de um
  // estado o erro de forma e pequeno, e e o que mantem o contorno reconhecivel
  // sem trazer uma biblioteca de projecao so para isto.
  const lat0 = maior.reduce((s, p) => s + p[1], 0) / maior.length;
  const k = Math.cos((lat0 * Math.PI) / 180);
  const proj = maior.map(([lon, lat]) => [lon * k, -lat]);

  const xs = proj.map((p) => p[0]), ys = proj.map((p) => p[1]);
  const x0 = Math.min(...xs), x1 = Math.max(...xs);
  const y0 = Math.min(...ys), y1 = Math.max(...ys);
  const lar = x1 - x0, alt = y1 - y0, esc = Math.max(lar, alt);

  // centrado em (0,0), maior dimensao = 1
  return {
    sigla, nome: UF[sigla].nome, pontos: maior.length,
    razao: Number((lar / alt).toFixed(4)),
    anel: proj.map(([x, y]) => [(x - (x0 + x1) / 2) / esc, (y - (y0 + y1) / 2) / esc]),
  };
}

export const caminho = (anel, cx, cy, s, giro = 0) => {
  const g = (giro * Math.PI) / 180, co = Math.cos(g), si = Math.sin(g);
  return 'M' + anel.map(([x, y]) => {
    const u = x * co - y * si, v = x * si + y * co;
    return `${(cx + u * s).toFixed(2)} ${(cy + v * s).toFixed(2)}`;
  }).join('L') + 'Z';
};

if (import.meta.url === `file://${process.argv[1]}`) {
  const saida = Object.fromEntries(['SP', 'SC', 'MG'].map((s) => [s, contorno(s)]));
  for (const c of Object.values(saida))
    console.log(c.sigla.padEnd(3), c.nome.padEnd(16), 'pontos', String(c.pontos).padStart(4), ' razao L/A', c.razao);
  writeFileSync(join(AQUI, 'estados.json'), JSON.stringify(saida) + '\n');
}
