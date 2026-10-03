const sharp = require('/Users/math.ramos/dev/project-sosanimal/node_modules/sharp');
const S = '/private/tmp/claude-501/-Users-math-ramos-dev-project-sosanimal/f1400c66-8a14-41a4-b7c0-30e661dbd69a/images/';
const D = '/private/tmp/claude-501/-Users-math-ramos-dev-project-sosanimal/f1400c66-8a14-41a4-b7c0-30e661dbd69a/scratchpad/ctrc/';
(async () => {
  for (const f of ['1.jpg','2.webp','3.png','4.jpg']) {
    const m = await sharp(S+f).metadata();
    console.log(f, m.width+'x'+m.height, m.format);
  }
  // fachada 1: marca iluminada
  const m1 = await sharp(S+'1.jpg').metadata();
  const x = Math.round(m1.width*0.335), y = Math.round(m1.height*0.21);
  const w = Math.round(m1.width*0.16), h = Math.round(m1.height*0.22);
  await sharp(S+'1.jpg').extract({left:x, top:y, width:w, height:h}).resize({width:900, kernel:'lanczos3'}).png().toFile(D+'10-marca-fachada.png');
  console.log('crop fachada:', x, y, w, h);
  // foto real (4) marca na parede
  const m4 = await sharp(S+'4.jpg').metadata();
  const x4 = Math.round(m4.width*0.49), y4 = Math.round(m4.height*0.235);
  const w4 = Math.round(m4.width*0.26), h4 = Math.round(m4.height*0.13);
  await sharp(S+'4.jpg').extract({left:x4, top:y4, width:w4, height:h4}).resize({width:900, kernel:'lanczos3'}).png().toFile(D+'11-marca-parede.png');
  console.log('crop parede:', x4, y4, w4, h4);
})();
