// 내구도 막대 모형: 게임 CSS(style.css 끝 「빌드 78: 내구도 막대」)를 그대로 붙여 칸 여섯을 찍는다.  node mkmock.js → mock.html
const fs = require('fs'), R = __dirname + '/../../../src/';
const m = fs.readFileSync(R + 'data-wart67.js', 'utf8').match(/data:image\/webp;base64,[A-Za-z0-9+/=]+/g);
const css = '/* ' + fs.readFileSync(R + 'style.css', 'utf8').split('/* 빌드 78: 내구도 막대')[1];
const L = [[10, '', '새 장비 (막대 없음)'], [6, 'g', '60%'], [4, 'y', '40%'], [2, 'r', '20%'], [1, 'r', '10%'], [0, 'z', '0% · 깜빡']];
const cells = L.map(([n, c, t], i) => `<div class=c><i class="rqa s2 hr" style="--u:url(${m[i * 20 + 5]})">${c ? `<b class="durb ${c}" style="--dn:${n}"></b>` : ''}</i><span>${t}</span></div>`).join('');
fs.writeFileSync(__dirname + '/mock.html', `<meta charset=utf-8><style>body{background:#121620;margin:0;padding:14px;font:13px 'Malgun Gothic';color:#e8dcc0;display:flex;gap:14px}.c{display:flex;flex-direction:column;align-items:center;gap:6px}.rqa{display:block;width:60px;height:60px;position:relative;background:#2a2218;box-shadow:inset 0 0 0 3px #4a3c28}.rqa.hr::after{content:"";position:absolute;left:16.667%;top:16.667%;width:66.667%;height:66.667%;background:var(--u) center/contain no-repeat}${css}</style>${cells}`);
