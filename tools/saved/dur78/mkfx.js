// 주문서 연출 모형: scrfx78.js를 그대로 불러 시간을 0.08초씩 밀며 장을 띠로 찍는다.  node mkfx.js → fx.html (헤드리스 크롬으로 찍기)
const fs = require('fs'), R = __dirname + '/../../../src/';
const sa = fs.readFileSync(R + 'data-scrollart78.js', 'utf8').match(/scrart_weapon_30: '(data:[^']+)'/)[1];
const wp = fs.readFileSync(R + 'data-wart67.js', 'utf8').match(/data:image\/webp;base64,[A-Za-z0-9+/=]+/g)[85];
const css = fs.readFileSync(R + 'style.css', 'utf8').split('/* 빌드 78: 주문서 바르기 연출')[1];
fs.writeFileSync(__dirname + '/fx.html', `<meta charset=utf-8><style>body{margin:0;background:#1a1420}/*${css}</style><body><canvas id=sheet></canvas><script>
const ITEMS={}, UI={}, itemHD=()=>${JSON.stringify(sa)}, iconURL=()=>'', armArtURL=()=>${JSON.stringify(wp)}, gearIconURL=()=>'', findGear=()=>null; let scrDo=()=>'';
</script><script>${fs.readFileSync(R + 'scrfx78.js', 'utf8')}</script><script>
(async()=>{ const N=21, D=0.08, sh=document.getElementById('sheet'); sh.width=72*N; sh.height=64*2; const X=sh.getContext('2d');
 for (const [row, ok] of [[0,true],[1,false]]) { let q=[]; window.requestAnimationFrame=f=>q.push(f); let T=0; performance.now=()=>T*1000;
  await scrFx(ok,'s',{}); const cv=document.querySelector('#scrfx canvas');
  for (let i=0;i<N;i++){ T=i*D; const f=q.shift(); if(f) f(T*1000); X.fillStyle=row?'#20161a':'#1a1826'; X.fillRect(i*72,row*64,72,64); X.drawImage(cv,i*72,row*64); }
  document.getElementById('scrfx').remove(); }
 sh.style.cssText='position:fixed;left:0;top:0;width:'+72*N*2+'px;height:256px;image-rendering:pixelated;z-index:99'; })();
</script>`);
