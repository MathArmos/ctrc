// Ferramenta de contorno do item 14. Nao desenha nada sozinha: so corta e mede.
//
// Um contorno aqui e { inicio: [x,y], segs: [ {t:'L', p:[x,y]} | {t:'Q', c:[x,y], p:[x,y]} ] }.
// E o mesmo vocabulario que o arquivo da fonte usa, para que nada se perca na traducao.
//
// 🔴 O CORTE E LOCAL, E ISSO NAO E DETALHE. Um semiplano global cortaria o C em dois lugares:
// a reta a 51 graus que passa pela ponta do braco de cima sai de novo pelo topo da letra, em
// x=215. Cortar pelo semiplano levaria junto o ombro esquerdo. Por isso o cortador acha TODAS
// as travessias, separa os trechos que caem do lado de fora, e remove so o trecho mais proximo
// da ponta que se quer chanfrar, fechando com uma corda reta.
//
// ❌ Nada aqui achata curva em poligono. A quadratica e partida por de Casteljau no proprio
// parametro da travessia, entao o pedaco que fica continua sendo a curva original.

const EPS = 1e-9;

export function lerp(a, b, t) {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
}

// reta pelo ponto P com angulo `graus`. Devolve a distancia com sinal de um ponto a ela.
export function reta(P, graus) {
  const r = (graus * Math.PI) / 180;
  const n = [-Math.sin(r), Math.cos(r)]; // normal
  return {
    P,
    graus,
    n,
    s: (p) => (p[0] - P[0]) * n[0] + (p[1] - P[1]) * n[1],
  };
}

// raizes de a t^2 + b t + c no intervalo aberto (0,1)
function raizes(a, b, c) {
  const out = [];
  if (Math.abs(a) < EPS) {
    if (Math.abs(b) > EPS) out.push(-c / b);
  } else {
    const disc = b * b - 4 * a * c;
    if (disc >= 0) {
      const r = Math.sqrt(disc);
      out.push((-b + r) / (2 * a), (-b - r) / (2 * a));
    }
  }
  return out.filter((t) => t > EPS && t < 1 - EPS).sort((x, y) => x - y);
}

function pontoEm(seg, p0, t) {
  if (seg.t === 'L') return lerp(p0, seg.p, t);
  const a = lerp(p0, seg.c, t);
  const b = lerp(seg.c, seg.p, t);
  return lerp(a, b, t);
}

// parte um segmento em t, devolve [antes, depois] no mesmo vocabulario
function partir(seg, p0, t) {
  if (seg.t === 'L') {
    const m = lerp(p0, seg.p, t);
    return [{ t: 'L', p: m }, { t: 'L', p: seg.p }, m];
  }
  const a = lerp(p0, seg.c, t);
  const b = lerp(seg.c, seg.p, t);
  const m = lerp(a, b, t);
  return [{ t: 'Q', c: a, p: m }, { t: 'Q', c: b, p: seg.p }, m];
}

// travessias do contorno pela reta, em ordem de percurso
function travessias(cont, L) {
  const out = [];
  let p0 = cont.inicio;
  for (let i = 0; i < cont.segs.length; i++) {
    const seg = cont.segs[i];
    if (seg.t === 'L') {
      const s0 = L.s(p0);
      const s1 = L.s(seg.p);
      if ((s0 > 0) !== (s1 > 0) && Math.abs(s1 - s0) > EPS) {
        out.push({ i, t: s0 / (s0 - s1) });
      }
    } else {
      // s(B(t)) e quadratica em t: resolve exato, sem amostrar
      const s0 = L.s(p0);
      const sc = L.s(seg.c);
      const s1 = L.s(seg.p);
      const a = s0 - 2 * sc + s1;
      const b = 2 * (sc - s0);
      for (const t of raizes(a, b, s0)) out.push({ i, t });
    }
    p0 = seg.p;
  }
  return out;
}

/**
 * Chanfra o contorno com a reta L, removendo o trecho que cai no lado `s > 0`
 * mais proximo de `ancora`. Devolve o contorno novo.
 */
export function chanfrar(cont, L, ancora) {
  const tr = travessias(cont, L);
  if (tr.length < 2) {
    throw new Error(`chanfro: ${tr.length} travessia(s), precisa de pelo menos 2. A reta nao cruza a ponta.`);
  }
  if (tr.length % 2 !== 0) {
    throw new Error(`chanfro: ${tr.length} travessias, numero impar. Contorno aberto ou reta tangente.`);
  }

  // pontos de cada travessia, e o trecho entre a travessia k e a k+1
  const pts = [];
  {
    let p0 = cont.inicio;
    const acum = [p0];
    for (const seg of cont.segs) { acum.push(seg.p); }
    for (const x of tr) {
      let q0 = cont.inicio;
      for (let i = 0; i < x.i; i++) q0 = cont.segs[i].p;
      pts.push(pontoEm(cont.segs[x.i], q0, x.t));
    }
  }

  // para cada par (k, k+1) descobre se o trecho entre eles esta do lado de fora,
  // olhando o ponto medio do percurso entre as duas travessias
  const candidatos = [];
  for (let k = 0; k < tr.length; k++) {
    const A = tr[k];
    const B = tr[(k + 1) % tr.length];
    // ponto no meio do trecho, em percurso
    let meio;
    if (B.i === A.i) {
      let q0 = cont.inicio;
      for (let i = 0; i < A.i; i++) q0 = cont.segs[i].p;
      meio = pontoEm(cont.segs[A.i], q0, (A.t + B.t) / 2);
    } else {
      const idx = (A.i + 1) % cont.segs.length;
      let q0 = cont.inicio;
      for (let i = 0; i < idx; i++) q0 = cont.segs[i].p;
      meio = pontoEm(cont.segs[idx], q0, 0.5);
    }
    if (L.s(meio) > 0) {
      const mid = [(pts[k][0] + pts[(k + 1) % tr.length][0]) / 2, (pts[k][1] + pts[(k + 1) % tr.length][1]) / 2];
      candidatos.push({ k, de: A, para: B, dist: Math.hypot(mid[0] - ancora[0], mid[1] - ancora[1]) });
    }
  }
  if (!candidatos.length) throw new Error('chanfro: nenhum trecho do lado de fora. Lado invertido?');
  candidatos.sort((a, b) => a.dist - b.dist);
  const alvo = candidatos[0];

  // reconstroi: percorre do fim do trecho removido ate o comeco dele, e fecha com a corda
  const n = cont.segs.length;
  const saida = [];
  const pA = pts[alvo.k];                       // onde o contorno sai (entra no lado de fora)
  const pB = pts[(alvo.k + 1) % tr.length];     // onde ele volta

  // comeca em pB e anda ate pA
  const [, restoB] = partir(cont.segs[alvo.para.i], pontoAntes(cont, alvo.para.i), alvo.para.t);
  saida.push(restoB);
  let i = (alvo.para.i + 1) % n;
  while (i !== alvo.de.i) {
    saida.push(cont.segs[i]);
    i = (i + 1) % n;
  }
  const [antesA] = partir(cont.segs[alvo.de.i], pontoAntes(cont, alvo.de.i), alvo.de.t);
  saida.push(antesA);
  saida.push({ t: 'L', p: pB }); // a corda do chanfro, fechando

  return { inicio: pB, segs: saida, chanfro: { de: pA, para: pB, graus: L.graus } };
}

function pontoAntes(cont, i) {
  let p = cont.inicio;
  for (let k = 0; k < i; k++) p = cont.segs[k].p;
  return p;
}

// ---------- entrada e saida ----------

export function daFonte(glifo, esc, dx = 0, capAlta = 1000) {
  const X = (x) => (x + dx) * esc;
  const Y = (y) => capAlta - y * esc;
  const conts = [];
  let atual = null;
  for (const c of glifo.path.commands) {
    const a = c.args;
    if (c.command === 'moveTo') {
      atual = { inicio: [X(a[0]), Y(a[1])], segs: [] };
      conts.push(atual);
    } else if (c.command === 'lineTo') atual.segs.push({ t: 'L', p: [X(a[0]), Y(a[1])] });
    else if (c.command === 'quadraticCurveTo') atual.segs.push({ t: 'Q', c: [X(a[0]), Y(a[1])], p: [X(a[2]), Y(a[3])] });
    else if (c.command === 'bezierCurveTo') {
      // a fonte e TrueType: nao deveria aparecer cubica. Se aparecer, e erro e precisa gritar.
      throw new Error('cubica no contorno: a conversao perderia fidelidade em silencio');
    } else if (c.command === 'closePath') {
      const p = atual.segs.length ? atual.segs[atual.segs.length - 1].p : atual.inicio;
      if (Math.hypot(p[0] - atual.inicio[0], p[1] - atual.inicio[1]) > 1e-6) {
        atual.segs.push({ t: 'L', p: atual.inicio });
      }
    }
  }
  return conts;
}

export function paraSVG(conts, casas = 2) {
  const f = (v) => +v.toFixed(casas);
  return conts
    .map((c) => {
      const d = [`M${f(c.inicio[0])} ${f(c.inicio[1])}`];
      for (const s of c.segs) {
        if (s.t === 'L') d.push(`L${f(s.p[0])} ${f(s.p[1])}`);
        else d.push(`Q${f(s.c[0])} ${f(s.c[1])} ${f(s.p[0])} ${f(s.p[1])}`);
      }
      d.push('Z');
      return d.join('');
    })
    .join('');
}

export function mover(conts, dx, dy = 0) {
  const m = (p) => [p[0] + dx, p[1] + dy];
  return conts.map((c) => ({
    inicio: m(c.inicio),
    segs: c.segs.map((s) => (s.t === 'L' ? { t: 'L', p: m(s.p) } : { t: 'Q', c: m(s.c), p: m(s.p) })),
  }));
}

export function caixa(conts, amostras = 48) {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  const vis = (p) => { minX = Math.min(minX, p[0]); maxX = Math.max(maxX, p[0]); minY = Math.min(minY, p[1]); maxY = Math.max(maxY, p[1]); };
  for (const c of conts) {
    let p0 = c.inicio;
    vis(p0);
    for (const s of c.segs) {
      if (s.t === 'L') vis(s.p);
      else for (let k = 1; k <= amostras; k++) vis(pontoEm(s, p0, k / amostras));
      p0 = s.p;
    }
  }
  return { minX, minY, maxX, maxY, largura: maxX - minX, altura: maxY - minY };
}
