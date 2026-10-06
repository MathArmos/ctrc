// Carimbo da anilha · itens 39 a 41 (selo de 10 anos).
//
// O selo e a IMPRESSAO DE CONTATO de uma anilha molhada prensada no sulfite, e
// nao o desenho de uma anilha. A falha e o produto, nao o defeito.
//
// D-04 e RNF-06: nenhum modelo generativo encosta nisto. A imperfeicao aqui e
// ARITMETICA: um campo escalar de agua, calculado camada por camada, cortado por
// um limiar. Cortar um campo liso e o que produz quebra de tinta com forma
// organica e tamanho correlacionado. Ruido independente por pixel produziria
// chuvisco, que e a cara de pincel de Photoshop que o projeto esta evitando.
//
// A semente deixa o acidente REPRODUTIVEL: carimbo que ninguem sabe regerar se
// perde na primeira troca de parametro.
//
// Rodar: node 02-marca/selo-10-anos/carimbo.mjs

import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
// AVISO: mesmo caminho absoluto que medir.mjs do item 12 usa. E fragil e e o
// padrao da casa: este repositorio nao tem node_modules proprio.
const sharp = require('/Users/math.ramos/dev/project-sosanimal/node_modules/sharp');
const AQUI = dirname(fileURLToPath(import.meta.url));

// ------------------------------------------------------------- 1. a anilha
// Tudo em raio normalizado: 1 = borda externa do disco.
//
// 🔴 A FACE E UM PLANO SO, e isso e a decisao geometrica que faz o selo ler.
// Anilha de face rebaixada entre aro e cubo imprimiria DOIS aneis, e as quatro
// aberturas de pegada cairiam no rebaixo, que nao encosta no papel: elas sairiam
// brancas sobre branco, ou seja invisiveis. Com a face plana a tinta cobre o
// disco inteiro e os cinco furos leem como vazio. Era o pedido.
export const ANILHA = {
  furoCentral: 0.155,      // o furo da barra
  aberturas: 4,            // as pegadas
  aberturaRaio: 0.60,      // distancia do centro ao centro da pegada
  aberturaMeia: 0.130,     // meio comprimento da pegada, no sentido tangencial
  aberturaEspessura: 0.075,// meia espessura da pegada
  aberturaGiro: 45,        // 45 poe as quatro nas diagonais e deixa os eixos livres
};

// ---------------------------------------------- 2. o campo de agua, por camada
// Ordem de importancia medida a olho, da maior amplitude para a menor. Quem
// mexer aqui mexe nesta ordem, porque e ela que separa objeto levantado do papel
// de textura espalhada por cima.
export const AGUA = {
  // (a) FILME DE MIOLO: o que SOBRA de agua no meio da face depois de a prensa
  // empurrar o resto para fora. E baixo de proposito: media abaixo do limiar,
  // entao o miolo nasce BRANCO e so as placas mais molhadas imprimem. Era o erro
  // da primeira passada, que entregou 58% de tinta e leu como disco preto.
  filme: 0.72,

  // (b) INCLINACAO: a mao nunca prensa nivelada. Um lado do disco e
  // sistematicamente mais seco. E a camada de maior amplitude e a que mais
  // convence, porque a falha fica CORRELACIONADA em vez de espalhada.
  inclinacao: 0.34,
  inclinacaoGrau: 108,

  // (c) MANCHA: a agua empoca em placas, nao uniformemente. Ruido de valor
  // suavizado, duas oitavas.
  manchaGrade: 5,
  manchaAmplitude: 0.60,

  // (d) ESMAGAMENTO DE BORDA: prensado, o filme e empurrado para FORA e acumula
  // na beirada de TODO contato, inclusive em volta de cada furo. E a assinatura
  // de que havia um objeto com espessura, e nao um circulo desenhado.
  bordaGanho: 0.80,
  bordaLargura: 0.017,
  // ...e a borda TAMBEM seca onde a anilha levantou. Sem isto o aro externo sai
  // um circulo perfeito, que e o unico detalhe que denuncia desenho na hora.
  bordaQuebra: 0.45,

  // (e) GRAO DE PAPEL: a fibra do sulfite quebra a tinta no limiar. 🔴 Ele e
  // ruido COM GRUMO, e nao ruido por pixel: por pixel a transicao vira retícula
  // e a poca le como aerografo. O grumo e o que faz a borda da tinta ser rasgada.
  grao: 0.085,
  graoGrade: 150,
  graoFino: 0.022,

  // (f) RESPINGO: gota fina pouco alem do aro, agrupada onde a agua empocou.
  respingoFaixa: 0.05,
  respingoChance: 0.07,

  // 🔴 Alto relevo e o ponto MAIS ALTO da peca: ele toca o papel antes de tudo,
  // entao e o que MENOS falha. Ganho baixo deixou o "10 ANOS" perder o N numa
  // zona seca, o que e realista e ilegivel ao mesmo tempo.
  relevoGanho: 0.78,
  limiar: 0.62,
  semente: 20261005,
};

// -------------------------------------------------------------- aritmetica
const D = Math.PI / 180;

// PRNG semeado. Carimbo reproduzivel e carimbo declaravel.
function semeado(s) {
  let a = s >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const grade = (n, rnd) => Float32Array.from({ length: n * n }, () => rnd());
const suave = (f) => f * f * (3 - 2 * f);

// ruido de valor, bilinear com suavizacao, toroidal
function amostra(g, n, u, v) {
  const x = (u % 1 + 1) % 1 * n, y = (v % 1 + 1) % 1 * n;
  const x0 = Math.floor(x), y0 = Math.floor(y);
  const sx = suave(x - x0), sy = suave(y - y0);
  const i0 = y0 % n, i1 = (y0 + 1) % n, j0 = x0 % n, j1 = (x0 + 1) % n;
  const a = g[i0 * n + j0], b = g[i0 * n + j1], c = g[i1 * n + j0], d = g[i1 * n + j1];
  return (a * (1 - sx) + b * sx) * (1 - sy) + (c * (1 - sx) + d * sx) * sy;
}

// distancia de ponto a capsula (segmento engrossado). Exata, e e ela que da a
// pegada com canto arredondado e a distancia da borda de graca.
function sdCapsula(px, py, ax, ay, bx, by, r) {
  const vx = bx - ax, vy = by - ay, wx = px - ax, wy = py - ay;
  const t = Math.max(0, Math.min(1, (wx * vx + wy * vy) / (vx * vx + vy * vy)));
  return Math.hypot(wx - vx * t, wy - vy * t) - r;
}

// SDF do contato: negativo DENTRO do metal, e o modulo e a distancia a borda
// mais proxima. Intersecao por maximo, que e exata para estas formas.
export function contato(px, py, g = ANILHA) {
  const r = Math.hypot(px, py);
  let f = Math.max(r - 1, g.furoCentral - r);
  for (let i = 0; i < g.aberturas; i++) {
    const a = (g.aberturaGiro + (360 / g.aberturas) * i) * D;
    const cx = Math.cos(a) * g.aberturaRaio, cy = Math.sin(a) * g.aberturaRaio;
    const tx = -Math.sin(a) * g.aberturaMeia, ty = Math.cos(a) * g.aberturaMeia;
    const d = sdCapsula(px, py, cx - tx, cy - ty, cx + tx, cy + ty, g.aberturaEspessura);
    f = Math.max(f, -d);
  }
  return f;
}

// ------------------------------------------------------------ 3. a chapa
// `releva`: mascara de 1 canal onde escuro = letra em ALTO RELEVO fundida na
// face. E assim que anilha de verdade carrega o numero dela, e e a unica forma
// que le aqui: vazada sumiria no miolo branco.
export async function carimbar({ lado = 2000, releva = null, agua = AGUA, anilha = ANILHA } = {}) {
  const rnd = semeado(agua.semente);
  const m1 = grade(agua.manchaGrade, rnd);
  const m2 = grade(agua.manchaGrade * 2, rnd);
  const m3 = grade(agua.graoGrade, rnd);
  const dir = [Math.cos(agua.inclinacaoGrau * D), Math.sin(agua.inclinacaoGrau * D)];

  // borda do relevo tambem acumula tinta: proximidade vem de um desfoque da
  // propria mascara, que e barato e suficiente.
  let prox = null;
  if (releva) {
    prox = await sharp(releva, { raw: { width: lado, height: lado, channels: 1 } })
      .blur(Math.max(1, lado * 0.004)).raw().toBuffer();
  }

  const out = Buffer.alloc(lado * lado, 255);
  const meio = (lado - 1) / 2;
  const esc = meio / 1.06; // 6% de folga para o respingo caber na caixa

  for (let y = 0; y < lado; y++) {
    for (let x = 0; x < lado; x++) {
      const k = y * lado + x;
      const px = (x - meio) / esc, py = (y - meio) / esc;
      const f = contato(px, py, anilha);

      if (f > 0) {
        // fora do metal: so respingo, e so na faixa logo depois do aro
        if (f < agua.respingoFaixa) {
          const mb = amostra(m1, agua.manchaGrade, (px + 1) / 2, (py + 1) / 2);
          if (rnd() < agua.respingoChance * mb * mb) out[k] = 0;
        }
        continue;
      }

      const d = -f; // distancia para dentro
      const incl = 1 - agua.inclinacao * ((px * dir[0] + py * dir[1]) + 1) / 2;
      const mancha =
        amostra(m1, agua.manchaGrade, (px + 1) / 2, (py + 1) / 2) * 0.68 +
        amostra(m2, agua.manchaGrade * 2, (px + 1) / 2, (py + 1) / 2) * 0.32;

      // miolo: filme fino, modulado por inclinacao e mancha. Nasce abaixo do limiar.
      let nivel = agua.filme * incl * (1 - agua.manchaAmplitude + 2 * agua.manchaAmplitude * mancha);
      // borda: acumulo, que tambem seca onde a anilha levantou
      nivel += agua.bordaGanho * Math.exp(-d / agua.bordaLargura) * incl *
               (1 - agua.bordaQuebra + agua.bordaQuebra * 2 * mancha);
      // relevo: letra fundida em alto relevo encosta no papel ANTES da face, entao
      // ela imprime MAIS. Vazada nao serve: o miolo e branco, e branco em branco
      // nao le. Medido na primeira passada, onde o "10 ANOS" sumiu.
      if (releva) {
        nivel += agua.relevoGanho * (1 - releva[k] / 255) * incl;
        nivel += agua.bordaGanho * 0.45 * (1 - prox[k] / 255) * incl;
      }
      nivel += (amostra(m3, agua.graoGrade, (px + 1) / 2, (py + 1) / 2) - 0.5) * 2 * agua.grao;
      nivel += (rnd() - 0.5) * 2 * agua.graoFino;

      if (nivel > agua.limiar) out[k] = 0;
    }
  }
  return { bruto: out, lado };
}

// -------------------------------------------------------- 4. o relevo "10 ANOS"
// 🟡 A TIPOGRAFIA E PROVISORIA. O item 14 (lettering CTRC) e o item 29 (tipografia
// de apoio, OFL) nao foram decididos, entao aqui entra Helvetica do sistema so
// para ocupar o lugar e medir. Trocar depois nao mexe em nada do carimbo.
export async function relevoDeTexto(lado, texto = '10 ANOS') {
  const corpo = Math.round(lado * 0.058);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${lado}" height="${lado}">
  <rect width="${lado}" height="${lado}" fill="#fff"/>
  <text x="${lado / 2}" y="${Math.round(lado * 0.905)}" font-family="Helvetica" font-size="${corpo}"
        font-weight="700" letter-spacing="${corpo * 0.1}" text-anchor="middle" fill="#000">${texto}</text>
</svg>`;
  return sharp(Buffer.from(svg)).greyscale().raw().toBuffer();
}

// ------------------------------------------------------------------ 5. saida
export const png = ({ bruto, lado }) =>
  sharp(bruto, { raw: { width: lado, height: lado, channels: 1 } }).png({ compressionLevel: 9 });

if (import.meta.url === `file://${process.argv[1]}`) {
  const lado = 2000;
  mkdirSync(join(AQUI, 'verificacao'), { recursive: true });

  for (const [nome, texto] of [['sem-relevo', null], ['com-relevo', '10 ANOS']]) {
    const releva = texto ? await relevoDeTexto(lado, texto) : null;
    const chapa = await carimbar({ lado, releva });
    await png(chapa).toFile(join(AQUI, 'verificacao', `carimbo-${nome}.png`));
    let tinta = 0;
    for (const v of chapa.bruto) if (v === 0) tinta++;
    console.log(nome.padEnd(14), 'tinta na caixa:', (100 * tinta / (lado * lado)).toFixed(1) + '%');
  }
  writeFileSync(join(AQUI, 'parametros.json'), JSON.stringify({ ANILHA, AGUA }, null, 2) + '\n');
}
