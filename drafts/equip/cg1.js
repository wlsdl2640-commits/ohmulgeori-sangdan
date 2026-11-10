/* ═══ 코네스토가(짐꾼 계열 3차, 새 직업) 캐릭터 시안 (사용자 11-11 00:34) — rg1.js · rg2.js(H2 · E2) · tk1 · tk2(tkBack 길) 위에 ═══
   마부(챙모자 · 외투) → 코네스토가(포장마차를 끄는 개척민) → 캐러밴마스터(실크해트). 무기 = 채찍(손에 감아 든다). 야영 때 먼저 불침번을 선다.
   유명 캐릭터(페도라 + 가죽 재킷 + 채찍)는 피한다: 모자 · 옷 꼴과 색을 다르게. */
Object.assign(PX_HEAD, {
  // A 개척민 챙모자: 가운데가 눌린 높은 모자 · 띠 · 끝이 살짝 들린 넓은 챙 (크림빛 펠트)
  pioneer: H2(`
...JJJJ...
..JJIJJj..
..JJJJJj..
J.WWWWWW.J
JJJJJJJJJJ
.jjjjjjjj.`, 3, -1),
  // B 밀짚모자: 납작한 꼭대기 · 엮은 결 · 푸른 띠 · 넓은 챙
  straw: H2(`
..AAAAAA..
..AaAAaA..
..FFFFFF..
AAAAAAAAAA
.aAaAaAaa.`, 2, -1),
  // C 방수포 두건: 얼굴을 감싼 두건 · 이마 위 짧은 챙
  oilhood: H2(`
..JJJJ..
.JJIJJj.
JJJJJJJj
jjjjjjjj
J......j
J......j
j......j`, 2)
});
Object.assign(PXS_HEAD, {
  pioneer: H2(`
....JJJJ...
...JIJJJj..
...JJJJJj..
.J.WWWWWW.J
JJJJJJJJJJJ
.jjjjjjjjj.`, 3, -1),
  straw: H2(`
...AAAAAA..
...AaAAaA..
...FFFFFF..
AAAAAAAAAAA
.aAaAaAaAa.`, 2, -1),
  oilhood: H2(`
...JJJJ...
..JJIJJj..
.JJJJJJJj.
JJJJJjjjjj
JJJJ......
JJJj......
JJj.......`, 2, -1)
});
Object.assign(PX_EX, {
  // 등에 진 말아 둔 담요(침낭) — 어깨 위 양쪽으로 끝이 보인다
  bedroll: Object.assign(E2(`
ZZRZZZZRZZ
zzRzzzzRzz`, -2, -3), { under: 1 }),
  // 허리 왼쪽 등불(밤 불침번)
  lantern: E2(`
.G.
GXG
GXG
.G.`, -2, 5),
  // 멜빵 두 줄
  susp: E2(`
.V....V.
.V....V.
.V....V.`, 0, 0)
});
Object.assign(PXS_EX, {
  bedroll: Object.assign(E2(`
ZR
zR`, -3, -3), { under: 1 }),
  lantern: E2(`
.G.
GXG
.G.`, 1, 5),
  susp: E2(`
V...
V...`, 3, 0)
});
// 채찍: 손에 쥔 손잡이 + 아래로 늘어진 감은 끈 (반 해상도 → 두 배). 앞은 손 줄이 홀수라 빈 줄을 하나 더 얹는다
const CG_WHIP = pxUp(pxRows(`
.O.
.@.
.W.
WWV
W.V
VVV`));
const CG_WHIP_F = ['...'.padEnd(6, '.')].concat(CG_WHIP).join('\n');
const CG_WHIP_S = CG_WHIP.join('\n');
const CG = [
  ['A 개척민', '크림빛 챙모자(가죽 띠 · 끝이 들린 챙) · 캔버스 외투(포장마차 덮개 빛) · 붉은 목수건 · 등에 말아 둔 담요(붉은 줄)', { head: 'pioneer', body: 'coat', ex: ['kerchief', 'bedroll'], c1: '#d8c8a0', c2: '#a8906a', c3: '#c8322a', hc: '#ece0c4', leather: '#7a5232', feather: '#c8322a', pants: '#5a4630', boots: '#4a3020', hairc: '#5a3a22', hair: 'short' }],
  ['B 푸른 짐칸', '밀짚모자 · 푸른 띠 · 푸른 작업복(코네스토가 짐칸 빛) · 가죽 조끼 · 멜빵', { head: 'straw', body: 'leather', ex: ['susp'], c1: '#3a5aa0', c2: '#e8c870', c3: '#2a4a8a', hc: '#e8c870', leather: '#7a5232', pants: '#4a4036', boots: '#3a2a1e', hairc: '#c89a5a', hair: 'short' }],
  ['C 불침번', '방수포 두건(짧은 챙) · 기름 먹인 올리브 외투 · 겨자빛 목도리 · 허리에 등불', { head: 'oilhood', body: 'coat', ex: ['kerchief', 'lantern'], c1: '#5a6a3a', c2: '#3a4628', c3: '#d8a030', hc: '#4a5a32', leather: '#5a3a22', gold: '#5a5048', gem: '#ffd860', pants: '#3a3a2a', boots: '#2a2418', hairc: '#2a2420', hair: 'short' }]
];
Object.assign(TK_BACK, {
  pioneer: { fill: 'H', edge: 'h', mask: '' },
  straw: { fill: 'H', edge: 'h', mask: '' },
  oilhood: { fill: 'J', edge: 'j', mask: '' }
});
function cgWith(view, fn) {   // 손 무기 칸(지팡이 = 세워 든다)을 채찍으로 잠깐
  const k = PX_WPN.staff; PX_WPN.staff = view === 'front' ? CG_WHIP_F : CG_WHIP_S;
  try { return fn(); } finally { PX_WPN.staff = k; }
}
function cgBackGrid(a, L) {
  // tkBackGrid에서 화살통만 빼고: 얼굴 → 머리칼/두건, 좌우 뒤집기, 담요는 등 위로
  const q = PX_OFFSHAPE.quiverF; PX_OFFSHAPE.quiverF = '....';
  let g;
  try { g = tkBackGrid(a, L); } finally { PX_OFFSHAPE.quiverF = q; }
  if ((L.ex || []).includes('bedroll')) {
    const rows = pxRows(PX_EX.bedroll.g).map(r => [...r].reverse().join(''));
    pxPut(g, rows, 39 - (BX + PX_EX.bedroll.x) - (rows[0].length - 1), BY + PX_EX.bedroll.y + 2);
  }
  return g;
}
function cgBack(a, L) { return pxBake('CB|' + JSON.stringify(L), cgBackGrid(a, L), Object.assign(pxPal(L, a.look || {}), pxOffPal(a)), 19, BY + 13); }
window.WAR_SHEET = () => {
  S = blankState('시안');
  const Z = 4, CW = 34 * Z, RH = 42 * Z, LW = 250, cols = ['앞', '옆', '뒤', '불침번(앉음)', '게임 속 크기'];
  const [c, g] = mkCanvas(LW + 4 * CW + 140, 84 + 34 + CG.length * RH + 10);
  g.fillStyle = '#1a1820'; g.fillRect(0, 0, c.width, c.height); g.imageSmoothingEnabled = false;
  g.font = '700 16px Galmuri11'; g.fillStyle = '#f0c45a'; g.fillText('코네스토가(짐꾼 계열 3차, 새 직업) 캐릭터 시안 — 셋 중 하나 (11-11 00:34)', 10, 24);
  g.font = '12px Galmuri11'; g.fillStyle = '#a89c8c';
  g.fillText('짐꾼 → 마부(챙모자) → 코네스토가 → 캐러밴마스터(실크해트). 무기 = 채찍(손에 감아 든 모습). 야영 때 먼저 불침번을 선다.', 10, 44);
  g.fillText('포장마차를 끄는 개척민 느낌 · 색은 웨건(흰 덮개 · 푸른 짐칸 · 붉은 바퀴)에서. 맨 오른쪽 칸 = 실제 크기(두 배 · 한 배). 이름 · 색은 제안.', 10, 60);
  g.fillText('', 10, 76);
  let y = 84;
  g.fillStyle = '#3a3640'; g.fillRect(10, y + 4, c.width - 20, 1);
  cols.forEach((n, i) => { g.font = '11px Galmuri11'; g.fillStyle = '#8a8070'; g.fillText(n, LW + i * CW + (i === 4 ? 14 : CW / 2 - g.measureText(n).width / 2), y + 22); });
  y += 34;
  CG.forEach(([nm, desc, L]) => {
    PXC.clear();
    const a = makeAdv({ cls: 'porter', lv: 60 }); a.id = 1;
    a.eq.weapon = makeGear('staff', 5, 0); a.eq.off = null;
    g.fillStyle = '#e8e0d0'; g.font = '700 13px Galmuri11'; g.fillText(nm, 10, y + 30);
    g.font = '11px Galmuri11'; g.fillStyle = '#a89c8c';
    let ty = y + 50, line = '';
    for (const w of desc.split(' ')) { if (g.measureText(line + w).width > LW - 24) { g.fillText(line, 10, ty); ty += 15; line = ''; } line += w + ' '; }
    g.fillText(line, 10, ty);
    const put = (s, i, z, dx, dy) => { const x = LW + i * CW + CW / 2 + (dx || 0), yy = y + RH - 16 + (dy || 0); g.drawImage(s.cv, Math.round(x - s.ax * z), Math.round(yy - s.ay * z), s.cv.width * z, s.cv.height * z); };
    const front = cgWith('front', () => pxAdvSprite(a, 'idle', 0, L));
    const side = cgWith('side', () => pxsAdvSprite(a, 'idle', 0, L));
    const back = cgWith('front', () => cgBack(a, L));
    const sit = cgWith('front', () => pxAdvSprite(a, 'sit', 0, L));
    put(front, 0, Z); put(side, 1, Z); put(back, 2, Z); put(sit, 3, Z);
    g.fillStyle = '#0e1118'; g.fillRect(LW + 4 * CW, y + 10, 110, RH - 30);
    put(side, 4, 2, -50, -10); put(side, 4, 1, 0, -10);
    y += RH;
  });
  return c.toDataURL();
};
