const sharp = require('/Users/math.ramos/dev/project-sosanimal/node_modules/sharp');
const fs = require('fs');
const D = '/private/tmp/claude-501/-Users-math-ramos-dev-project-sosanimal/f1400c66-8a14-41a4-b7c0-30e661dbd69a/scratchpad/ctrc/';
const svg = fs.readFileSync(D + 'logo-atual.svg', 'utf8');

const HEAD = `<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" width="80pt" height="45pt" viewBox="0 0 80 45"><g transform="translate(0,45) scale(0.1,-0.1)" fill="#000" stroke="none">`;
const P1 = svg.match(/<path d="M137[\s\S]*?"\/>/)[0];
const P2 = svg.match(/<path d="M560[\s\S]*?"\/>/)[0];

async function bbox(svgStr, label) {
  const W = 2000;
  const { data, info } = await sharp(Buffer.from(svgStr))
    .resize({ width: W })
    .flatten({ background: '#ffffff' })
    .greyscale().raw().toBuffer({ resolveWithObject: true });
  let minX = 1e9, maxX = -1, minY = 1e9, maxY = -1, ink = 0;
  for (let y = 0; y < info.height; y++) for (let x = 0; x < info.width; x++) {
    if (data[y * info.width + x] < 128) { ink++; if (x<minX)minX=x; if(x>maxX)maxX=x; if(y<minY)minY=y; if(y>maxY)maxY=y; }
  }
  const w = maxX-minX+1, h = maxY-minY+1;
  console.log(`${label}: bbox ${w}x${h} px (em ${info.width}x${info.height}) | x ${minX}..${maxX} | y ${minY}..${maxY} | razao ${(w/h).toFixed(3)} | tinta ${(100*ink/(w*h)).toFixed(1)}% da caixa`);
  return {minX,maxX,minY,maxY,w,h,W:info.width,H:info.height};
}

(async () => {
  const full = await bbox(svg, 'CONJUNTO');
  const g1 = await bbox(HEAD + P1 + '</g></svg>', 'GLIFO 1 (esq)');
  const g2 = await bbox(HEAD + P2 + '</g></svg>', 'GLIFO 2 (dir)');
  console.log(`\nVAO entre glifos: ${g2.minX - g1.maxX} px de ${full.w} (${(100*(g2.minX-g1.maxX)/full.w).toFixed(1)}% da largura)`);
  console.log(`Altura g1 ${g1.h} vs g2 ${g2.h}  => diferenca ${g1.h-g2.h} px (${(100*(g1.h-g2.h)/g1.h).toFixed(1)}%)`);
  console.log(`Topo g1 y=${g1.minY} vs g2 y=${g2.minY} | Base g1 y=${g1.maxY} vs g2 y=${g2.maxY}`);

  // renders
  await sharp(Buffer.from(svg)).resize({width:1200}).flatten({background:'#ffffff'}).png().toFile(D+'01-grande.png');
  const red = svg.replace(/#000000/g, '#E8252A');
  await sharp(Buffer.from(red)).resize({width:1200}).flatten({background:'#111111'}).png().toFile(D+'02-vermelho-no-preto.png');
  for (const px of [48, 24, 16]) {
    await sharp(Buffer.from(svg)).resize({width:px}).flatten({background:'#ffffff'})
      .resize({width:px*14, kernel:'nearest'}).png().toFile(D+`03-reducao-${px}.png`);
  }
  console.log('\nrenders prontos');
})();
