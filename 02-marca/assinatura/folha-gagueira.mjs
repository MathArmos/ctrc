import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { letraC, letraT, palavra } from '../lettering/lettering.mjs';
import { caixa, mover, paraSVG, chanfrar, reta } from '../lettering/contorno.mjs';
import { create } from '/Users/math.ramos/dev/project-sosanimal/node_modules/fontkitten/dist/index.js';
const require = createRequire(import.meta.url);
const sharp = require('/Users/math.ramos/dev/project-sosanimal/node_modules/sharp');
const ROT = create(readFileSync('../tipografia/fontes/inter/Inter[opsz,wght].ttf')).getVariation({ wght: 600, opsz: 14 });
function texto(t, tam){const esc=tam/ROT.unitsPerEm;const d=[];let cur=0;
 for(const g of ROT.glyphsForString(t)){for(const c of g.path.commands){const a=c.args;const X=x=>+((x+cur)*esc).toFixed(2);const Y=y=>+(-y*esc).toFixed(2);
 if(c.command==='moveTo')d.push(`M${X(a[0])} ${Y(a[1])}`);else if(c.command==='lineTo')d.push(`L${X(a[0])} ${Y(a[1])}`);
 else if(c.command==='quadraticCurveTo')d.push(`Q${X(a[0])} ${Y(a[1])} ${X(a[2])} ${Y(a[3])}`);
 else if(c.command==='bezierCurveTo')d.push(`C${X(a[0])} ${Y(a[1])} ${X(a[2])} ${Y(a[3])} ${X(a[4])} ${Y(a[5])}`);else if(c.command==='closePath')d.push('Z');}cur+=g.advanceWidth;}
 return d.join('');}
const rot=(t,x,y,tam,cor='#111')=>`<g transform="translate(${x} ${y})" fill="${cor}"><path d="${texto(t,tam)}"/></g>`;

const U = 161.2;
function Tcortado(dxT, corteX){const T=mover(letraT(),dxT);const tt=reta([corteX,500],90);const gr=tt.s([corteX-10,500])>0?90:-90;return T.map(c=>chanfrar(c,reta([corteX,500],gr),[corteX-80,70]));}
const C = letraC(); const cxC = caixa(C);
const SIMB = {
  'S1 · o C sozinho': C,
  'S2 · C e T compostos': [...C, ...mover(letraT(), cxC.maxX + 34 - caixa(letraT()).minX)],
  'S3 · CT travado': [...C, ...Tcortado(529.7-159.4, 470)],
};
const P = palavra().pecas.flatMap(p=>p.cs);
const cxP = caixa(P);

const cam=[], txt=[rot('A assinatura com cada simbolo · a pergunta e se o simbolo GAGUEJA com a palavra', 50, 48, 24, '#000'),
  rot('a palavra ja comeca com C e com T. Um simbolo CT ao lado dela repete as duas primeiras letras.', 50, 74, 14, '#666')];
let y = 115;
for (const [nome, S] of Object.entries(SIMB)) {
  const cxS = caixa(S);
  const todos = [...S, ...mover(P, cxS.maxX + U - cxP.minX)];
  const cx = caixa(todos);
  const n = mover(todos, -cx.minX, -cx.minY);
  const esc = 120/1000;
  const w = Math.round(cx.largura*esc), h = Math.round(cx.altura*esc);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${cx.largura} ${cx.altura}"><rect width="${cx.largura}" height="${cx.altura}" fill="#fff"/><path d="${paraSVG(n)}" fill="#000"/></svg>`;
  cam.push({ input: await sharp(Buffer.from(svg)).flatten({background:'#fff'}).png().toBuffer(), left: 50, top: y });
  txt.push(rot(nome, 50, y + h + 26, 15, '#111'));
  y += h + 70;
}
const W=1100, H=y+20;
cam.push({ input: Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">${txt.join('')}</svg>`), left:0, top:0 });
await sharp({create:{width:W,height:H,channels:3,background:'#fff'}}).composite(cam).png().toFile('verificacao/folha-04-gagueira.png');
console.log('verificacao/folha-04-gagueira.png', W, H);
