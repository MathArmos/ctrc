const sharp = require('/Users/math.ramos/dev/project-sosanimal/node_modules/sharp');
const S = '/private/tmp/claude-501/-Users-math-ramos-dev-project-sosanimal/f1400c66-8a14-41a4-b7c0-30e661dbd69a/images/';
const hex = (r,g,b)=>'#'+[r,g,b].map(v=>v.toString(16).padStart(2,'0')).join('').toUpperCase();

async function vermelhoDominante(f, label) {
  const { data, info } = await sharp(S+f).raw().toBuffer({resolveWithObject:true});
  const ch = info.channels;
  const buckets = new Map();
  let n=0;
  for (let i=0;i<data.length;i+=ch){
    const r=data[i],g=data[i+1],b=data[i+2];
    // pixel claramente vermelho e saturado
    if (r>110 && r > g*1.9 && r > b*1.7){
      const k = `${r>>4},${g>>4},${b>>4}`;
      buckets.set(k,(buckets.get(k)||0)+1); n++;
    }
  }
  const top = [...buckets.entries()].sort((a,b)=>b[1]-a[1]).slice(0,3);
  console.log(`\n${label} (${f}): ${n} px vermelhos`);
  for (const [k,c] of top){
    const [r,g,b]=k.split(',').map(v=>parseInt(v)*16+8);
    console.log(`   ${hex(r,g,b)}  ${c} px  (${(100*c/n).toFixed(0)}% dos vermelhos)`);
  }
}
(async()=>{
  await vermelhoDominante('1.jpg','fachada entardecer');
  await vermelhoDominante('3.png','fachada noite');
  await vermelhoDominante('4.jpg','marca na parede (foto real)');
  await vermelhoDominante('2.webp','interior render');
})();
