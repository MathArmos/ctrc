// Exporta as pecas em coordenadas INTEIRAS, para caberem numa chamada de importacao do Figma.
// Caixa alta = 1000 unidades, entao inteiro e 0,1% de precisao: invisivel em qualquer uso.
// Rodar: node exportar-figma.mjs
import { writeFileSync } from 'node:fs';
import { palavra } from '../lettering/lettering.mjs';
import { simboloFinal } from '../simbolo-letra/simbolo.mjs';
import { caixa, mover, paraSVG } from '../lettering/contorno.mjs';
import { PALETA } from '../../03-sistema/paleta/paleta.mjs';

const U = 161.2;
const S = simboloFinal();
const cxS = caixa(S);
const P = palavra().pecas.flatMap((p) => p.cs);
const cxP = caixa(P);

const arranjos = {
  horizontal: () => ({ simbolo: S, texto: mover(P, cxS.maxX + U - cxP.minX) }),
  vertical: () => {
    const larg = Math.max(cxS.largura, cxP.largura);
    return {
      simbolo: mover(S, (larg - cxS.largura) / 2 - cxS.minX),
      texto: mover(P, (larg - cxP.largura) / 2 - cxP.minX, cxS.maxY + U * 0.75 - cxP.minY),
    };
  },
};

function escreve(nome, simbolo, textoC) {
  const todos = [...(simbolo || []), ...(textoC || [])];
  const cx = caixa(todos);
  const w = Math.round(cx.largura);
  const h = Math.round(cx.altura);
  const partes = [];
  if (simbolo && simbolo.length) partes.push(`<path id="simbolo" d="${paraSVG(mover(simbolo, -cx.minX, -cx.minY), 0)}" fill="${PALETA['ctrc-vermelho'].hex}"/>`);
  if (textoC && textoC.length) partes.push(`<path id="lettering" d="${paraSVG(mover(textoC, -cx.minX, -cx.minY), 0)}" fill="${PALETA['ctrc-preto'].hex}"/>`);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">${partes.join('')}</svg>`;
  writeFileSync(`svg-figma/${nome}.svg`, svg);
  return { nome, bytes: svg.length, w, h };
}

const out = [];
{ const a = arranjos.horizontal(); out.push(escreve('horizontal', a.simbolo, a.texto)); }
{ const a = arranjos.vertical(); out.push(escreve('vertical', a.simbolo, a.texto)); }
out.push(escreve('simbolo', S, null));
out.push(escreve('lettering', null, P));

let total = 0;
for (const o of out) { console.log(`${o.nome.padEnd(12)} ${String(o.bytes).padStart(5)} bytes  ${o.w}x${o.h}`); total += o.bytes; }
console.log(`total ${total} bytes`);
