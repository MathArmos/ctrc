// Itens 27 e 28 · a paleta e o teste de contraste.
//
// 🔴 UM VERMELHO SO, E ISSO JA ESTAVA DECIDIDO. O eixo conceitual acusa a marca atual de
// existir "em tres vermelhos diferentes, um por acabamento". Entregar dois contradiria o
// proprio paragrafo que vai ao avaliador.
//
// 🔴 DE ONDE ELE SAI, E POR QUE NAO DOS OUTROS DOIS. Medidos os quatro materiais do cliente,
// a fachada (entardecer e noite) devolve #78-#98 2828, e o render devolve #782828: sao
// vermelhos ESCUROS, e nenhum dos dois e a cor do material. Os dois primeiros sao halo
// retroiluminado fotografado contra o ceu, e o terceiro e vermelho de ambiente de render.
// ✅ A unica fonte frontal, em luz chapada e sobre material real, e a marca NA PAREDE.
//
// ⚠️ INCERTEZA DECLARADA, E ELA NAO FOI CORRIGIDA DE PROPOSITO. A fotografia da parede tem
// vies quente: as superficies quase neutras dela dao mediana #B1ABA6, o que sugere ganhos de
// R x0,966 e B x1,030, e isso levaria o vermelho de #DE0943 para cerca de #D70945. 🔴 MAS AS
// SUPERFICIES USADAS COMO REFERENCIA PODEM SER BEGE DE VERDADE, e nesse caso corrigir seria
// introduzir erro em vez de tirar. A primeira tentativa usou os pixels mais claros e eles
// estavam ESTOURADOS (254,9 de 255), o que invalida qualquer estimativa de balanco.
// 📌 A correcao fica MEDIDA E NAO APLICADA, e o valor definitivo pede amostra fisica ou uma
// fotografia com carta de cinza. Nasce a P-10.
//
// Rodar: node paleta.mjs

import { writeFileSync } from 'node:fs';

const hex2rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const rgb2hex = (c) => '#' + c.map((v) => Math.round(v).toString(16).padStart(2, '0').toUpperCase()).join('');

const canal = (v) => { const c = v / 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
const lum = ([r, g, b]) => 0.2126 * canal(r) + 0.7152 * canal(g) + 0.0722 * canal(b);
export const contraste = (a, b) => {
  const L1 = lum(a);
  const L2 = lum(b);
  return +(((Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05))).toFixed(2);
};

// CMYK ingenuo, sem perfil. ⚠️ Serve para orientar, NUNCA para fechar impressao.
function cmyk([r, g, b]) {
  const R = r / 255;
  const G = g / 255;
  const B = b / 255;
  const k = 1 - Math.max(R, G, B);
  if (k === 1) return [0, 0, 0, 100];
  const c = (1 - R - k) / (1 - k);
  const m = (1 - G - k) / (1 - k);
  const y = (1 - B - k) / (1 - k);
  return [c, m, y, k].map((v) => Math.round(v * 100));
}

// 🔴 O VERMELHO ADOTADO. Mediana da face difusa das letras da parede (R acima do p60, para
// descartar a lateral sombreada), com o valor arredondado para dentro da faixa medida.
// A faixa da face vai de #D8002E (p75) a #F50046 (p97), e a mediana da face da #DE0943.
export const PALETA = {
  'ctrc-vermelho': { hex: '#DE0943', papel: 'a cor da marca, e a unica cor de marca' },
  'ctrc-preto': { hex: '#111111', papel: 'fundo escuro, tinta principal sobre claro' },
  'ctrc-branco': { hex: '#FFFFFF', papel: 'tinta sobre vermelho e sobre preto' },
  'ctrc-cinza': { hex: '#6E6E6E', papel: 'texto secundario sobre claro' },
};

const PISO = 4.5; // RNF-04, texto normal
const PISO_GRANDE = 3.0; // texto grande, a partir de 24 px ou 19 px em negrito

const nomes = Object.keys(PALETA);
for (const n of nomes) PALETA[n].rgb = hex2rgb(PALETA[n].hex);
for (const n of nomes) PALETA[n].cmyk = cmyk(PALETA[n].rgb);

// matriz de contraste de todos contra todos
const matriz = {};
for (const a of nomes) {
  matriz[a] = {};
  for (const b of nomes) matriz[a][b] = a === b ? null : contraste(PALETA[a].rgb, PALETA[b].rgb);
}

// os pares que a marca de fato usa
const PARES = [
  ['ctrc-branco', 'ctrc-vermelho', 'tinta branca sobre o vermelho'],
  ['ctrc-vermelho', 'ctrc-branco', 'vermelho sobre branco'],
  ['ctrc-branco', 'ctrc-preto', 'tinta branca sobre o preto, que e a negativa'],
  ['ctrc-preto', 'ctrc-branco', 'preto sobre branco, que e a positiva'],
  ['ctrc-vermelho', 'ctrc-preto', 'vermelho sobre o preto'],
  ['ctrc-cinza', 'ctrc-branco', 'texto secundario sobre branco'],
];

const linhas = PARES.map(([a, b, papel]) => {
  const c = contraste(PALETA[a].rgb, PALETA[b].rgb);
  return {
    par: `${a} sobre ${b}`,
    papel,
    contraste: c,
    'texto normal': c >= PISO ? 'passa' : 'REPROVA',
    'texto grande': c >= PISO_GRANDE ? 'passa' : 'REPROVA',
  };
});

// so escreve e imprime quando rodado direto: importar a paleta nao deve imprimir nada
if (import.meta.url === `file://${process.argv[1]}`) {
  writeFileSync('paleta.json', JSON.stringify({
    item: 27,
    piso: { textoNormal: PISO, textoGrande: PISO_GRANDE, origem: 'RNF-04' },
    cores: PALETA,
    matriz,
    pares: linhas,
    pantone: 'NAO DECLARADO. Ver a secao de Pantone em resultado.md: nao existe conversao livre e confiavel de sRGB para Pantone, e inventar um numero seria pior do que declarar a falta.',
    cmyk: 'INGENUO, sem perfil de impressao. Orienta, nao fecha impressao.',
  }, null, 2));

  console.log('\nItem 27 · a paleta\n');
  for (const n of nomes) {
    const p = PALETA[n];
    console.log(`  ${n.padEnd(16)} ${p.hex}  rgb(${p.rgb.join(', ')})  cmyk(${p.cmyk.join(', ')})  ${p.papel}`);
  }
  console.log('\nItem 28 · contraste dos pares que a marca usa (piso 4,5 normal / 3,0 grande)\n');
  console.table(linhas);
}
