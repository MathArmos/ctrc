// Item 19 · a versao colorida.
//
// 🔴 A REGRA E: O SIMBOLO LEVA A COR, A PALAVRA LEVA A TINTA. Um so elemento colorido, porque
// a paleta tem um vermelho so (item 27) e porque o vermelho sobre o preto da 3,80:1, abaixo do
// piso de 4,5 para texto normal. ⚠️ Isso NAO reprova o simbolo: grafismo tem piso de 3:1, e
// 3,80 passa. Reprova a palavra, e e por isso que ela fica em tinta e nao em vermelho.
//
// Rodar: node colorida.mjs

import { writeFileSync } from 'node:fs';
import { palavra } from '../lettering/lettering.mjs';
import { simboloFinal } from '../simbolo-letra/simbolo.mjs';
import { caixa, mover, paraSVG } from '../lettering/contorno.mjs';
import { PALETA, contraste } from '../../03-sistema/paleta/paleta.mjs';

const U = 161.2;
const VERMELHO = PALETA['ctrc-vermelho'].hex;
const PRETO = PALETA['ctrc-preto'].hex;
const BRANCO = PALETA['ctrc-branco'].hex;

const S = simboloFinal();
const cxS = caixa(S);
const P = palavra().pecas.flatMap((p) => p.cs);
const cxP = caixa(P);

function monta(orientacao) {
  if (orientacao === 'horizontal') {
    return { simbolo: S, texto: mover(P, cxS.maxX + U - cxP.minX) };
  }
  const vao = U * 0.75;
  const larg = Math.max(cxS.largura, cxP.largura);
  return {
    simbolo: mover(S, (larg - cxS.largura) / 2 - cxS.minX),
    texto: mover(P, (larg - cxP.largura) / 2 - cxP.minX, cxS.maxY + vao - cxP.minY),
  };
}

function escreve(nome, orientacao, corSimbolo, corTexto, fundo) {
  const { simbolo, texto } = monta(orientacao);
  const cx = caixa([...simbolo, ...texto]);
  const s = mover(simbolo, -cx.minX, -cx.minY);
  const t = mover(texto, -cx.minX, -cx.minY);
  const rect = fundo ? `<rect width="${cx.largura.toFixed(2)}" height="${cx.altura.toFixed(2)}" fill="${fundo}"/>` : '';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${cx.largura.toFixed(2)} ${cx.altura.toFixed(2)}" width="${Math.round(cx.largura)}" height="${Math.round(cx.altura)}">
<!-- CTRC · item 19 · ${nome} · simbolo ${corSimbolo}, palavra ${corTexto}${fundo ? ', fundo ' + fundo : ''} -->
${rect}<path d="${paraSVG(s)}" fill="${corSimbolo}"/><path d="${paraSVG(t)}" fill="${corTexto}"/>
</svg>
`;
  writeFileSync(`svg/${nome}.svg`, svg);
  return nome;
}

escreve('assinatura-horizontal-colorida', 'horizontal', VERMELHO, PRETO, null);
escreve('assinatura-horizontal-colorida-negativa', 'horizontal', VERMELHO, BRANCO, PRETO);
escreve('assinatura-vertical-colorida', 'vertical', VERMELHO, PRETO, null);
escreve('assinatura-vertical-colorida-negativa', 'vertical', VERMELHO, BRANCO, PRETO);

const rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
console.log('item 19 · quatro arquivos coloridos escritos');
console.log(`  simbolo vermelho sobre branco: ${contraste(rgb(VERMELHO), rgb(BRANCO))}:1   (grafismo, piso 3:1)`);
console.log(`  simbolo vermelho sobre preto:  ${contraste(rgb(VERMELHO), rgb(PRETO))}:1   (grafismo, piso 3:1)`);
console.log(`  palavra preta sobre branco:    ${contraste(rgb(PRETO), rgb(BRANCO))}:1`);
console.log(`  palavra branca sobre preto:    ${contraste(rgb(BRANCO), rgb(PRETO))}:1`);
