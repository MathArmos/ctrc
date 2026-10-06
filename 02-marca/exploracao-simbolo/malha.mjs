// Malha angular do item 12. Toda rota de simbolo e construida AQUI dentro.
//
// D-07: da marca atual sobrevive so o ANGULO. As tres familias medidas no item 6
// sao as unicas permitidas. Peso de haste NAO e herdado: ele e decisao nova de
// cada rota, e esta declarado em cada uma.
//
// A funcao conferirAngulos() e a guarda: ela ESTOURA se qualquer aresta de
// qualquer rota cair fora das familias. Nao e aviso, e erro.

const D = Math.PI / 180;

export const FAMILIAS = {
  horizontal: 0,
  obliqua: -71,      // 19 graus da vertical, medida -70.88 +- 0.74
  diagonalDesce: 51, // medida 51.13 +- 0.46 a 0.98
  diagonalSobe: -51,
};
export const PERMITIDOS = Object.values(FAMILIAS);

// --------------------------------------------------------------- algebra
export const reta = (ponto, grau) => ({ p: ponto, u: [Math.cos(grau * D), Math.sin(grau * D)], grau });
export const horizontal = (y) => reta([0, y], FAMILIAS.horizontal);
export const obliqua = (ponto) => reta(ponto, FAMILIAS.obliqua);
export const diagonal = (ponto, sinal) => reta(ponto, sinal >= 0 ? FAMILIAS.diagonalDesce : FAMILIAS.diagonalSobe);

const normal = (r) => [-r.u[1], r.u[0]];
export function desloca(r, d) {
  const n = normal(r);
  return { p: [r.p[0] + n[0] * d, r.p[1] + n[1] * d], u: r.u, grau: r.grau };
}
export function em(r, y) {
  const t = (y - r.p[1]) / r.u[1];
  return [r.p[0] + r.u[0] * t, y];
}
export function cruza(a, b) {
  const det = a.u[0] * -b.u[1] - a.u[1] * -b.u[0];
  if (Math.abs(det) < 1e-12) throw new Error('retas paralelas nao se cruzam');
  const t = ((b.p[0] - a.p[0]) * -b.u[1] - (b.p[1] - a.p[1]) * -b.u[0]) / det;
  return [a.p[0] + a.u[0] * t, a.p[1] + a.u[1] * t];
}

// poligono fechado a partir de uma lista CICLICA de retas:
// cada vertice e a intersecao de uma reta com a seguinte.
export function poligono(retas) {
  return retas.map((r, i) => cruza(r, retas[(i + 1) % retas.length]));
}

// ---------------------------------------------------------------- guarda
const anguloDaAresta = ([x1, y1], [x2, y2]) => {
  let g = Math.atan2(y2 - y1, x2 - x1) / D;
  if (g > 90) g -= 180;
  if (g <= -90) g += 180;
  return g;
};

export function conferirAngulos(poligonos, id) {
  const fora = [];
  const uso = new Map(PERMITIDOS.map((g) => [g, 0]));
  for (const poly of poligonos) {
    for (let i = 0; i < poly.length; i++) {
      const a = poly[i], b = poly[(i + 1) % poly.length];
      const comp = Math.hypot(b[0] - a[0], b[1] - a[1]);
      if (comp < 1e-6) continue;
      const g = anguloDaAresta(a, b);
      const alvo = PERMITIDOS.find((p) => Math.abs(g - p) < 1e-6 || Math.abs(Math.abs(g - p) - 180) < 1e-6);
      if (alvo === undefined) fora.push({ i, g: g.toFixed(4), comp: comp.toFixed(1) });
      else uso.set(alvo, uso.get(alvo) + comp);
    }
  }
  if (fora.length) {
    throw new Error(`rota ${id}: ${fora.length} aresta(s) fora da malha: ` +
      fora.map((f) => `aresta ${f.i} a ${f.g} graus (comp ${f.comp})`).join(' · '));
  }
  const total = [...uso.values()].reduce((a, b) => a + b, 0);
  return Object.fromEntries([...uso].map(([g, c]) => [g, Number((100 * c / total).toFixed(1))]));
}

// ------------------------------------------------------------------- svg
const n = (v) => Number(v.toFixed(3));

export function svgDe(poligonos, { id, nome, descricao, parametros }) {
  const todos = poligonos.flat();
  const x0 = Math.min(...todos.map((p) => p[0]));
  const y0 = Math.min(...todos.map((p) => p[1]));
  const larg = Math.max(...todos.map((p) => p[0])) - x0;
  const alt = Math.max(...todos.map((p) => p[1])) - y0;
  const caminho = (poly) => 'M' + poly.map(([x, y]) => `${n(x - x0)} ${n(y - y0)}`).join('L') + 'Z';
  const corpo = poligonos.map(caminho).join(' ');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${n(larg)} ${n(alt)}" width="${n(larg)}" height="${n(alt)}" role="img" aria-label="CTRC, rota ${id}">
  <title>CTRC · item 12 · rota ${id}: ${nome}</title>
  <desc>${descricao}
Malha: horizontais 0, obliqua ${FAMILIAS.obliqua} (19 da vertical), diagonais ${FAMILIAS.diagonalDesce}.
Parametros: ${JSON.stringify(parametros)}
Exploracao, nao e a marca escolhida. Contrato em 02-marca/exploracao-simbolo/contrato-da-rota.md</desc>
  <path fill="#000000" fill-rule="evenodd" d="${corpo}"/>
</svg>
`;
  return { svg, caixa: { largura: n(larg), altura: n(alt), razao: n(larg / alt) } };
}
