// Item 26 · antes e depois, lado a lado.
//
// 🔴 AS DUAS MARCAS PASSAM PELA MESMA REGUA, E ESSA E A UNICA COISA QUE TORNA A COMPARACAO
// HONESTA. Mesma convencao de reducao (altura de CAIXA ALTA, e nunca caixa quadrada), mesmo
// N de reamostragem, mesmo limiar, mesmo caminho de codigo. Comparar o numero do item 23 com
// um numero medido de outro jeito seria comparar reguas, e nao marcas.
//
// ⚠️ O "ANTES" E O REDESENHO LIMPO DO ITEM 6, e nao a marca de producao: o vetor original nao
// existe (P-06, fechada por impossibilidade). O redesenho bate com a fotografia retificada em
// IoU 0,980, e e o melhor antes disponivel. Isso esta escrito na folha, nao escondido.
//
// Rodar: node comparar.mjs

import { readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { palavra } from '../lettering/lettering.mjs';
import { simboloFinal } from '../simbolo-letra/simbolo.mjs';
import { caixa, mover, paraSVG } from '../lettering/contorno.mjs';
import { U } from '../assinatura/assinatura.mjs';

const require = createRequire(import.meta.url);
const sharp = require('/Users/math.ramos/dev/project-sosanimal/node_modules/sharp');
const { create } = await import('/Users/math.ramos/dev/project-sosanimal/node_modules/fontkitten/dist/index.js');

const VERMELHO = '#DE0943';

// ---- o ANTES: o redesenho limpo do item 6 ----
const antesSvg = readFileSync('../marca-atual-limpa.svg', 'utf8');
const ANTES_D = antesSvg.match(/<path[^>]*\sd="([^"]+)"/)[1];
const vbAntes = antesSvg.match(/viewBox="([^"]+)"/)[1].split(/\s+/).map(Number);
const ANTES = { d: ANTES_D, w: vbAntes[2], h: vbAntes[3], nome: 'marca atual (redesenho limpo do item 6)' };

// ---- o DEPOIS: a assinatura horizontal do item 16 ----
const S = simboloFinal();
const cxS = caixa(S);
const P = palavra().pecas.flatMap((p) => p.cs);
const cxP = caixa(P);
const horizontal = [...S, ...mover(P, cxS.maxX + U - cxP.minX)];
const cxH = caixa(horizontal);
const DEPOIS = {
  d: paraSVG(mover(horizontal, -cxH.minX, -cxH.minY)),
  w: cxH.largura, h: cxH.altura, nome: 'assinatura CTRC (itens 13 a 16)',
};

// ---- a regua, identica a do item 23 ----
// AVISO medido: resize com background sobre entrada de 1 canal devolve 3 canais.
// Todo caminho termina em .greyscale() antes do .raw().
const N = 400;
const svgDe = (m) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${m.w.toFixed(2)} ${m.h.toFixed(2)}"><rect width="${m.w}" height="${m.h}" fill="#fff"/><path d="${m.d}" fill="#000"/></svg>`;

async function fidelidade(m, capPx) {
  const esc = capPx / 1000; // caixa alta = 1000 nas duas, por construcao dos dois arquivos
  const w = Math.max(1, Math.round(m.w * esc));
  const h = Math.max(1, Math.round(m.h * esc));
  const svg = svgDe(m);
  const grande = await sharp(Buffer.from(svg)).resize({ width: N, height: N, fit: 'fill' }).flatten({ background: '#fff' }).greyscale().raw().toBuffer();
  const peq = await sharp(Buffer.from(svg)).resize({ width: w, height: h, fit: 'fill' }).flatten({ background: '#fff' }).png().toBuffer();
  const reamp = await sharp(peq).resize({ width: N, height: N, fit: 'fill', kernel: 'nearest' }).greyscale().raw().toBuffer();
  let i = 0; let u = 0;
  for (let k = 0; k < grande.length; k++) {
    const a = grande[k] < 128; const b = reamp[k] < 128;
    if (a && b) i++; if (a || b) u++;
  }
  return { iou: +(i / (u || 1)).toFixed(3), w, h };
}

// tinta: fracao da caixa coberta
async function tinta(m) {
  const { data } = await sharp(Buffer.from(svgDe(m))).resize({ width: 600, height: Math.max(1, Math.round((600 * m.h) / m.w)), fit: 'fill' })
    .flatten({ background: '#fff' }).greyscale().raw().toBuffer({ resolveWithObject: true });
  let n = 0;
  for (const v of data) if (v < 128) n++;
  return +((100 * n) / data.length).toFixed(1);
}

// 🔴 A IoU NAO MEDE O DEFEITO QUE O PRD ACUSA, e isso precisa de segunda regua.
// O achado 2 do PRD diz que a 24 px o vazado do R quase fecha e a 16 o R e o chevron viram
// uma mancha so. Isso e EMPASTAMENTO, e IoU nao ve empastamento: ela compara silhuetas, e uma
// silhueta empastada continua parecida com ela mesma. Duas contagens topologicas veem:
//
//   1. quantas PECAS PRETAS separadas sobram. Se duas se encostam, a contagem cai, e foi
//      exatamente isso que o PRD descreveu com "viram uma mancha so".
//   2. quantos CONTRAFORMAS FECHADOS sobram, ou seja ilhas brancas que nao tocam a borda.
//      O vazado do R e um deles, e e o que o PRD viu quase fechar a 24 px.
//
// 📌 As duas contam no bitmap do tamanho de destino, sem reamostragem nenhuma: o que se conta
// e o pixel que a tela realmente acende.
async function topologia(m, capPx) {
  const esc = capPx / 1000;
  const w = Math.max(1, Math.round(m.w * esc));
  const h = Math.max(1, Math.round(m.h * esc));
  const { data } = await sharp(Buffer.from(svgDe(m)))
    .resize({ width: w, height: h, fit: 'fill' })
    .flatten({ background: '#fff' }).greyscale().raw().toBuffer({ resolveWithObject: true });
  const preto = (i) => data[i] < 128;

  // rotulagem por 4-vizinhanca
  const componentes = (querPreto) => {
    const visto = new Uint8Array(w * h);
    let n = 0;
    const tocaBorda = [];
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const i = y * w + x;
        if (visto[i] || preto(i) !== querPreto) continue;
        n++;
        let borda = false;
        const pilha = [i];
        visto[i] = 1;
        while (pilha.length) {
          const j = pilha.pop();
          const jx = j % w; const jy = (j / w) | 0;
          if (jx === 0 || jy === 0 || jx === w - 1 || jy === h - 1) borda = true;
          for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
            const nx = jx + dx; const ny = jy + dy;
            if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
            const k = ny * w + nx;
            if (visto[k] || preto(k) !== querPreto) continue;
            visto[k] = 1; pilha.push(k);
          }
        }
        tocaBorda.push(borda);
      }
    }
    return { n, fechados: tocaBorda.filter((b) => !b).length };
  };

  const pretas = componentes(true);
  const brancas = componentes(false);
  return { pecas: pretas.n, contraformas: brancas.fechados, caixa: `${w}x${h}` };
}

// 🔴 A CONTAGEM DE PECAS E ESTAVEL A 48 E 24 PX E DEIXA DE SER A 16, e isso foi MEDIDO, nao
// suposto. A 16 px a borda inteira cai na faixa cinza do antialiasing, entao mover o limiar
// move a contagem. Esta funcao existe para que a folha possa dizer ATE ONDE a regua vale, em
// vez de reportar um numero de 16 px como se ele fosse firme.
// 📌 Mesma familia da lição que ja esta no contrato da rota: medida impossivel, ou instavel,
// e defeito da regua antes de ser defeito do objeto.
async function porLimiar(m, capPx, limiares = [100, 128, 160, 190]) {
  const esc = capPx / 1000;
  const w = Math.max(1, Math.round(m.w * esc));
  const h = Math.max(1, Math.round(m.h * esc));
  const { data } = await sharp(Buffer.from(svgDe(m)))
    .resize({ width: w, height: h, fit: 'fill' })
    .flatten({ background: '#fff' }).greyscale().raw().toBuffer({ resolveWithObject: true });
  const conta = (lim, querPreto) => {
    const visto = new Uint8Array(w * h);
    const ehPreto = (i) => data[i] < lim;
    let n = 0; let fechados = 0;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const i = y * w + x;
        if (visto[i] || ehPreto(i) !== querPreto) continue;
        n++;
        let borda = false;
        const pilha = [i]; visto[i] = 1;
        while (pilha.length) {
          const j = pilha.pop(); const jx = j % w; const jy = (j / w) | 0;
          if (jx === 0 || jy === 0 || jx === w - 1 || jy === h - 1) borda = true;
          for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
            const nx = jx + dx; const ny = jy + dy;
            if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
            const k = ny * w + nx;
            if (visto[k] || ehPreto(k) !== querPreto) continue;
            visto[k] = 1; pilha.push(k);
          }
        }
        if (!borda) fechados++;
      }
    }
    return { n, fechados };
  };
  const fora = {};
  for (const lim of limiares) fora[lim] = { pecas: conta(lim, true).n, contraformas: conta(lim, false).fechados };
  return fora;
}

const tabela = [];
for (const m of [ANTES, DEPOIS]) {
  const linha = { marca: m.nome, razao: +(m.w / m.h).toFixed(3), tinta: await tinta(m) };
  linha.topologiaEmGrande = await topologia(m, 400);
  linha.porLimiar = { '48px': await porLimiar(m, 48), '24px': await porLimiar(m, 24), '16px': await porLimiar(m, 16) };
  for (const px of [48, 24, 16]) {
    const r = await fidelidade(m, px);
    const t = await topologia(m, px);
    linha[`${px}px`] = r.iou;
    linha[`${px}px_caixa`] = `${r.w}x${r.h}`;
    linha[`${px}px_pecas`] = t.pecas;
    linha[`${px}px_contraformas`] = t.contraformas;
  }
  tabela.push(linha);
}

const medidas = {
  item: 26,
  regua: 'identica a do item 23: altura de CAIXA ALTA, N=400, limiar 128',
  ressalva: 'o ANTES e o redesenho limpo do item 6 (IoU 0,980 contra a fotografia retificada), porque o vetor original nao existe (P-06)',
  leituraHonesta: [
    'a marca atual pontua MAIS ALTO que a nova na IoU de reducao (0,899 contra 0,815 a 16 px), e isso esta declarado em vez de escondido',
    'a IoU premia silhueta simples e traco grosso: a marca atual tem 2 pecas e a assinatura nova tem 5, mais uma palavra de quatro letras. Entre marcas de complexidade diferente a IoU mede complexidade, e nao qualidade',
    'o que separa as duas e topologia, nao silhueta: contraformas fechados 0 contra 1, que e o achado 1 do PRD (o bojo do R nao fecha, e o olho fecha um K) medido por outro caminho',
    'a marca atual FRAGMENTA a 24 px, de 2 pecas para 3, que e o achado 2 do PRD',
    'a 16 px a contagem de pecas passa a depender do limiar nas duas marcas, entao ali quem decide e a folha de contato',
  ],
  tabela,
};
writeFileSync('medidas.json', JSON.stringify(medidas, null, 2));
console.table(tabela.map((l) => ({ marca: l.marca.slice(0, 30), tinta: l.tinta, '48 IoU': l['48px'], '24 IoU': l['24px'], '16 IoU': l['16px'] })));
console.log('\ntopologia: pecas pretas separadas / contraformas fechados');
for (const l of tabela) {
  console.log(`  ${l.marca.slice(0, 44).padEnd(46)} grande ${l.topologiaEmGrande.pecas}/${l.topologiaEmGrande.contraformas}   48px ${l['48px_pecas']}/${l['48px_contraformas']}   24px ${l['24px_pecas']}/${l['24px_contraformas']}   16px ${l['16px_pecas']}/${l['16px_contraformas']}`);
}

// ---------------------------------------------------------------------------
// A folha. Rotulos por contorno de glifo (Inter, SIL OFL, declarada em logs/licencas.md).
// ---------------------------------------------------------------------------
const ROT = create(readFileSync('../tipografia/fontes/inter/Inter[opsz,wght].ttf')).getVariation({ wght: 600, opsz: 14 });
function texto(t, tam) {
  const esc = tam / ROT.unitsPerEm; const d = []; let cur = 0;
  for (const g of ROT.glyphsForString(t)) {
    for (const c of g.path.commands) {
      const a = c.args; const X = (x) => +((x + cur) * esc).toFixed(2); const Y = (y) => +(-y * esc).toFixed(2);
      if (c.command === 'moveTo') d.push(`M${X(a[0])} ${Y(a[1])}`);
      else if (c.command === 'lineTo') d.push(`L${X(a[0])} ${Y(a[1])}`);
      else if (c.command === 'quadraticCurveTo') d.push(`Q${X(a[0])} ${Y(a[1])} ${X(a[2])} ${Y(a[3])}`);
      else if (c.command === 'bezierCurveTo') d.push(`C${X(a[0])} ${Y(a[1])} ${X(a[2])} ${Y(a[3])} ${X(a[4])} ${Y(a[5])}`);
      else if (c.command === 'closePath') d.push('Z');
    }
    cur += g.advanceWidth;
  }
  return d.join('');
}
const rot = (t, x, y, tam, cor = '#111') => `<g transform="translate(${x} ${y})" fill="${cor}"><path d="${texto(t, tam)}"/></g>`;

const emPx = async (m, capPx, amp = 1) => {
  const esc = capPx / 1000;
  const w = Math.max(1, Math.round(m.w * esc));
  const h = Math.max(1, Math.round(m.h * esc));
  const peq = await sharp(Buffer.from(svgDe(m))).resize({ width: w, height: h, fit: 'fill' }).flatten({ background: '#fff' }).png().toBuffer();
  if (amp === 1) return { buf: peq, w, h };
  return { buf: await sharp(peq).resize({ width: w * amp, height: h * amp, kernel: 'nearest' }).png().toBuffer(), w: w * amp, h: h * amp };
};

const LARG = 1240;
const cam = []; const txt = [];
txt.push(rot('Item 26 · antes e depois', 50, 52, 26, '#000'));
txt.push(rot('as duas marcas passam pela MESMA regua: altura de caixa alta, mesmo N, mesmo limiar, mesmo caminho de codigo', 50, 80, 14, '#666'));
txt.push(rot('o ANTES e o redesenho limpo do item 6, e nao a marca de producao: o vetor original nao existe (P-06). Ele bate com a', 50, 100, 13, '#999'));
txt.push(rot('fotografia retificada em IoU 0,980, e e o melhor antes disponivel', 50, 118, 13, '#999'));

let y = 156;
// --- as duas, lado a lado, mesma caixa alta ---
const CAP_G = 108;
const a1 = await emPx(ANTES, CAP_G);
const d1 = await emPx(DEPOIS, CAP_G);
cam.push({ input: a1.buf, left: 60, top: y });
cam.push({ input: d1.buf, left: 60, top: y + a1.h + 54 });
txt.push(rot('antes', 60 + a1.w + 40, y + 18, 15, '#999'));
txt.push(rot('le RK antes de ler RC · o bojo do R nao fecha · tres vermelhos, um por acabamento', 60 + a1.w + 40, y + 40, 13, '#777'));
txt.push(rot('depois', 60 + d1.w + 40, y + a1.h + 54 + 18, 15, '#000'));
txt.push(rot('le CTRC · nome sem deposito no INPI · um vermelho so, medido', 60 + d1.w + 40, y + a1.h + 54 + 40, 13, '#333'));
y += a1.h + d1.h + 54 + 50;

// --- a tira de reducao ---
txt.push(rot('reducao, em tamanho real, e o de 16 px ampliado 4x', 50, y, 16, '#000'));
y += 26;
for (const m of [ANTES, DEPOIS]) {
  const linha = tabela.find((l) => l.marca === m.nome);
  let x = 60;
  const alturas = [];
  for (const px of [48, 24, 16]) {
    const im = await emPx(m, px);
    alturas.push(im.h);
  }
  const alturaLinha = Math.max(...alturas, 48) + 30;
  for (const px of [48, 24, 16]) {
    const im = await emPx(m, px);
    cam.push({ input: im.buf, left: x, top: y + alturaLinha - im.h - 22 });
    txt.push(rot(`${px} px · IoU ${linha[`${px}px`].toFixed(3)}`, x, y + alturaLinha - 4, 12, '#888'));
    x += Math.max(im.w, 92) + 34;
  }
  const amp = await emPx(m, 16, 4);
  cam.push({ input: amp.buf, left: 700, top: y + alturaLinha - amp.h - 22 });
  txt.push(rot('16 px a 4x', 700, y + alturaLinha - 4, 12, '#888'));
  txt.push(rot(m === ANTES ? 'antes' : 'depois', 60, y + 2, 14, m === ANTES ? '#999' : '#000'));
  y += alturaLinha + 44;
}

// --- a leitura honesta ---
y += 10;
txt.push(rot('a IoU favorece a marca ATUAL, e isso esta declarado em vez de escondido', 50, y, 16, VERMELHO));
y += 24;
const linhasHonestas = [
  'a 16 px a marca atual da 0,899 e a assinatura nova da 0,815. Lido solto, esse numero diz que a nova e pior em reducao.',
  'ele nao diz isso. A IoU premia silhueta simples e traco grosso: a marca atual tem 2 pecas, e a assinatura nova tem 5 mais',
  'uma palavra de quatro letras. Entre marcas de complexidade diferente, a IoU mede COMPLEXIDADE, e nao qualidade.',
  '',
  'o que separa as duas nao e silhueta, e topologia. E ali a conta inverte e nao se mexe mais:',
];
for (const l of linhasHonestas) { if (l) txt.push(rot(l, 50, y, 13, '#333')); y += 19; }
y += 14;

// --- a tabela topologica ---
const colX = [50, 330, 470, 610, 750, 890];
txt.push(rot('medida', colX[0], y, 13, '#000'));
txt.push(rot('grande', colX[1], y, 13, '#000'));
txt.push(rot('48 px', colX[2], y, 13, '#000'));
txt.push(rot('24 px', colX[3], y, 13, '#000'));
txt.push(rot('16 px', colX[4], y, 13, '#000'));
txt.push(rot('firme?', colX[5], y, 13, '#000'));
y += 22;
for (const m of [ANTES, DEPOIS]) {
  const l = tabela.find((t) => t.marca === m.nome);
  const nome = m === ANTES ? 'atual' : 'CTRC';
  const estavel = (chave) => ['48px', '24px', '16px'].every((px) => {
    const v = l.porLimiar[px];
    return [100, 128, 160, 190].every((k) => v[k][chave] === v[100][chave]);
  });
  txt.push(rot(`${nome} · pecas pretas separadas`, colX[0], y, 13, '#555'));
  txt.push(rot(`${l.topologiaEmGrande.pecas}`, colX[1], y, 13, '#555'));
  for (const [i, px] of ['48px', '24px', '16px'].entries()) txt.push(rot(`${l[`${px}_pecas`]}`, colX[2 + i], y, 13, '#555'));
  txt.push(rot(estavel('pecas') ? 'sim' : 'NAO, varia com o limiar', colX[5], y, 13, estavel('pecas') ? '#555' : VERMELHO));
  y += 20;
  txt.push(rot(`${nome} · contraformas FECHADOS`, colX[0], y, 13, '#000'));
  txt.push(rot(`${l.topologiaEmGrande.contraformas}`, colX[1], y, 13, VERMELHO));
  for (const [i, px] of ['48px', '24px', '16px'].entries()) txt.push(rot(`${l[`${px}_contraformas`]}`, colX[2 + i], y, 13, VERMELHO));
  txt.push(rot(estavel('contraformas') ? 'sim, em todo limiar' : 'nao', colX[5], y, 13, '#000'));
  y += 30;
}
y += 6;
const fecho = [
  'contraforma fechado e a unica medida que nao se mexe: ela da 0 na marca atual e 1 na nova, em TODO tamanho e em TODO',
  'limiar testado (100, 128, 160 e 190). E ela e exatamente o achado 1 do PRD medido por outro caminho: o bojo do R da marca',
  'atual nunca fecha, e e por isso que o olho fecha um K e le RK. A assinatura nova fecha o bojo e o mantem fechado a 16 px.',
  '',
  'a contagem de PECAS, ao contrario, varia com o limiar abaixo de 48 px nas duas marcas, entao ela nao sustenta conclusao',
  'nenhuma nesse tamanho. Fica registrada com o aviso, e nao usada como argumento.',
];
for (const l of fecho) { if (l) txt.push(rot(l, 50, y, 13, '#333')); y += 19; }

const ALT = y + 24;
cam.push({ input: Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${LARG}" height="${ALT}">${txt.join('')}</svg>`), left: 0, top: 0 });
await sharp({ create: { width: LARG, height: ALT, channels: 3, background: '#fff' } }).composite(cam).png().toFile('verificacao/folha-01-antes-e-depois.png');
console.log('verificacao/folha-01-antes-e-depois.png', LARG, ALT);
