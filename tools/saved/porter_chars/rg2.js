/* ═══ 도적 계열 새 캐릭터 시안 2 — 반 해상도(뭉툭 칸)로 그려 두 배 (특징이 2×2 칸에 맞아 안 뭉개진다) ═══ */
const H2 = (s, top, x) => ({ top: top * 2, x: (x || 0) * 2, g: pxUp(pxRows(s)).join('\n') });
const E2 = (s, x, y, under) => Object.assign({ x, y, g: pxUp(pxRows(s)).join('\n') }, under ? { under: 1 } : {});
Object.assign(PX_HEAD, {
  shinobi: H2(`
..JJJJ.....
.JJIJJj....
JJIJJJjj...
FFFFFFFfFF.
J......j.Ff
JJJJJJJj..f
.jJJJJj....`, 1),
  shadow: H2(`
..JJJJ.....
.JJIJJj....
JJIJJJjj...
FFFFFFFfFF.
J......j.FX
JJJJJJJj..X
.jJJJJj....`, 1),
  kasa: H2(`
.....AA.....
...AAAAAa...
.AAAAAAAAAa.
aaaaaaaaaaaa
..JJJJJJJj..
..J......j..
..JJJJJJJj..
...jJJJJj...`, 2, -2),
  kunoichi: H2(`
.......HH...
..JJJJFHHh..
.JJIJJj.Hh..
JJIJJJjj.Hh.
FFFFFFFf.Hh.
J......j..h.
JJJJJJJj....
.jJJJJj.....`, 2),
  oni: H2(`
.Z....Z....
.zJJJJz....
.JJIJJj....
JJIJJJjj...
FFFFFFFfFF.
J......j.Ff
RRRRRRRr..f
.RZRRZr....`, 2),
  kitsune: H2(`
.Z....Z.
.ZRJJRZ.
.JJIJJj.
JZZZZZZj
JZRZZRZj
JZkZZkZj
jzZZZZzj
.jzRRzj.`, 2),
  flatcap: H2(`
..JJJJ...
.JJIJJJj.
JJJJJJJJj
jjFFFFFjj`, 1),
  bowler: H2(`
...JJJJ...
..JJIJJJj.
..JJJJJJj.
..FFFFFFf.
JJJJJJJJJj`, 2, -1),
  beanie: H2(`
...FF...
...Ff...
..JJJJ..
.JJIJJj.
JJIJJJJj
AAAAAAAa`, 3)
});
Object.assign(PXS_HEAD, {
  shinobi: H2(`
....JJJ...
...JJIJj..
..JJJJJJj.
FfFFFFFFFf
F.JJJJ....
f.JJJJJJJ.
...JJJJJ..`, 1, -2),
  shadow: H2(`
....JJJ...
...JJIJj..
..JJJJJJj.
FfFFFFFFFf
X.JJJJ....
X.JJJJJJJ.
...JJJJJ..`, 1, -2),
  kasa: H2(`
.....AA.....
...AAAAAa...
.AAAAAAAAAa.
aaaaaaaaaaaa
..JJJJJJJj..
..JJJJ......
..JJJJJJJJ..
...JJJJJ....`, 2, -2),
  kunoichi: H2(`
..HH.......
.HHhFJJJ...
HH..JJIJj..
H..JJJJJJj.
H..FFFFFFFf
h..JJJJ....
...JJJJJJJ.
....JJJJJ..`, 2, -3),
  oni: H2(`
...Z..Z...
...zJJz...
...JJIJj..
..JJJJJJj.
FfFFFFFFFf
F.JJJJ....
f.JJJJRRR.
...JJRZR..`, 2, -2),
  kitsune: H2(`
.....Z.....
....ZRZ....
...JJJJj...
..JJJZZZ...
..JJZZRZZ..
..JJZZZkZZZ
..JJzZZZZz.
...JjzRz...`, 2, -2),
  flatcap: H2(`
..JJJJ....
.JJIJJJj..
JJJJJJJJj.
jjjjjjFFFF`, 1),
  bowler: H2(`
...JJJJ....
..JJIJJJj..
..JJJJJJj..
..FFFFFFf..
JJJJJJJJJJj`, 2, -1),
  beanie: H2(`
..FF....
..Ff....
.JJJJ...
JJIJJj..
JJJJJJJ.
AAAAAAAa`, 3)
});
// 목수건(짧게 맨 것) · 긴 목도리(닌자) · 나비넥타이
Object.assign(PX_EX, {
  kerchief: E2(`
FFFFFf
.FFf..`, 2, 0),
  nscarf: E2(`
FFFFFf..
.....Ff.
......F.
......f.`, 2, 0),
  bowtie: E2(`
FfF`, 6, 0)
});
Object.assign(PXS_EX, {
  kerchief: E2(`
FFFFf
..Ff.`, 1, 0),
  nscarf: E2(`
....FFFFf
..FFf....
.Ff......
.f.......`, -7, 0),
  bowtie: E2(`
.Ff`, 5, 0)
});
PX_WPN.cards = `
.ZZZz.
ZZRRZz
ZZRRZz
.zZZz.
..@...
`;
// 시안 표 다시
RG.pp = [
  ['A 헌팅캡', '납작 헌팅캡(챙이 앞으로) · 머스터드 목수건 · 갈색 재킷', { head: 'flatcap', body: 'coat', ex: ['kerchief'], c1: '#6a5034', c2: '#e8dcc0', c3: '#d8a030', hc: '#6e6a5a', gold: '#c8b080', pants: '#4a4036', boots: '#3a2a1e', hair: 'short' }],
  ['B 중절모 도박사', '둥근 중절모 · 붉은 띠 · 나비넥타이 · 초록 조끼 · 흰 셔츠', { head: 'bowler', body: 'coat', ex: ['bowtie'], c1: '#2f5a42', c2: '#f0ece0', c3: '#b8322a', hc: '#4a3426', gold: '#e0c060', pants: '#2e2a2a', boots: '#1e1a1a', hair: 'short' }],
  ['C 털모자', '방울 털모자 · 녹슨 빛 재킷 · 노란 목수건', { head: 'beanie', body: 'leather', ex: ['kerchief'], c1: '#8a4a2e', c2: '#d8c8a0', c3: '#e8b040', hc: '#3a5a8a', leather: '#6a3a24', gold: '#c8a060', pants: '#3e3a4a', boots: '#2a2430', hair: 'short' }]
];
RG.nj = [
  ['A 남색 시노비', '눈만 보이는 남색 두건 · 붉은 머리띠 꼬리 · 붉은 허리띠', { head: 'shinobi', body: 'leather', c1: '#2e3a6a', c2: '#4a5a8a', c3: '#d8302a', hc: '#2e3a6a', leather: '#3c4c80', gold: '#d8302a', pants: '#283460', boots: '#1c2240', hair: 'short' }],
  ['B 삿갓 닌자', '삿갓 · 먹색 복면 · 갈색 목도리', { head: 'kasa', body: 'leather', ex: ['nscarf'], c1: '#3a3c48', c2: '#d8b878', c3: '#9a6a40', hc: '#34363f', leather: '#4a4c5a', gold: '#9a6a40', pants: '#30323c', boots: '#22232a', hair: 'short' }],
  ['C 쿠노이치', '꽁지머리 · 자줏빛 두건 · 붉은 목도리', { head: 'kunoichi', body: 'leather', ex: ['nscarf'], c1: '#5a2a50', c2: '#8a4a7a', c3: '#e0403a', hc: '#5a2a50', leather: '#6a3a60', gold: '#e0403a', pants: '#4a2242', boots: '#2a1428', hair: 'short', hairc: '#2a1a24' }]
];
RG.kg = [
  ['A 그림자 두건', '검보라 두건 · 보랏빛 눈 · 끝이 연기처럼 빛나는 꼬리', { head: 'shadow', body: 'leather', c1: '#241c34', c2: '#3a2a50', c3: '#5a3a8a', hc: '#201a2c', leather: '#30264a', gold: '#7a4ab8', gem: '#c89aff', eyes: '#d8b0ff', pants: '#1c1626', boots: '#120e18', hair: 'short' }],
  ['B 귀면', '검은 두건 · 붉은 도깨비 턱가리개 · 뼈 뿔 · 붉은 눈', { head: 'oni', body: 'leather', c1: '#1c1820', c2: '#3a2a2e', c3: '#a8222a', hc: '#16141a', leather: '#2a2228', gold: '#a8222a', feather: '#c8282e', eyes: '#ff4a3a', pants: '#18141a', boots: '#100c10', hair: 'short' }],
  ['C 여우 가면', '흰 여우 가면 · 붉은 무늬 · 금빛 눈 · 남보라 차림', { head: 'kitsune', body: 'leather', ex: ['nscarf'], c1: '#20203a', c2: '#3a3a5a', c3: '#6a4ad8', hc: '#1a1a2e', leather: '#2c2c4a', gold: '#6a4ad8', feather: '#d8283a', gem: '#ffd84a', eyes: '#ffd84a', pants: '#1a1a30', boots: '#10101e', hair: 'short' }]
];
// 다듬기: 헌팅캡 챙은 모자 색(짙게) · 쿠노이치 꽁지머리 빛 · 그림자 두건은 끝이 빛나는 긴 목도리
PX_HEAD.flatcap = H2(`
..JJJJ...
.JJIJJJj.
JJJJJJJJj
jjjjjjjjj`, 1);
PXS_HEAD.flatcap = H2(`
..JJJJ....
.JJIJJJj..
JJJJJJJJj.
jjjjjjjjjj`, 1);
PX_HEAD.kunoichi = H2(`
.......LH...
..JJJJFHHh..
.JJIJJj.Lh..
JJIJJJjj.Hh.
FFFFFFFf.Lh.
J......j..h.
JJJJJJJj....
.jJJJJj.....`, 2);
PXS_HEAD.kunoichi = H2(`
..LH.......
.HLhFJJJ...
HL..JJIJj..
L..JJJJJJj.
H..FFFFFFFf
h..JJJJ....
...JJJJJJJ.
....JJJJJ..`, 2, -3);
Object.assign(PX_EX, { sscarf: E2(`
FFFFFf..
.....Ff.
......X.
......X.`, 2, 0) });
Object.assign(PXS_EX, { sscarf: E2(`
....FFFFf
..FFf....
.XX......
.X.......`, -7, 0) });
RG.kg[0][1] = '검보라 두건 · 보랏빛 눈 · 끝이 그림자 불꽃처럼 빛나는 머리띠 꼬리와 목도리';
RG.kg[0][2].ex = ['sscarf'];
RG.nj[2][2].hairc = '#3a2232';
/* 시안판 */
window.WAR_SHEET = () => {
  S = blankState('시안');
  const Z = 4, CW = 34 * Z, RH = 42 * Z, LW = 230, cols = ['앞', '옆', '뒤', '공격', '게임 속 크기'];
  const sec = ['pp', 'nj', 'kg'];
  const refH = 46 * 3 + 40;
  const H = 74 + refH + sec.reduce((s, k) => s + 50 + RG[k].length * RH, 0);
  const [c, g] = mkCanvas(LW + 4 * CW + 140, H);
  g.fillStyle = '#1a1820'; g.fillRect(0, 0, c.width, c.height); g.imageSmoothingEnabled = false;
  g.font = '700 16px Galmuri11'; g.fillStyle = '#f0c45a'; g.fillText('도적 계열 새 캐릭터 시안 — 소매치기 · 닌자 · 카게닌자 (직업마다 셋 중 하나)', 10, 24);
  g.font = '12px Galmuri11'; g.fillStyle = '#a89c8c'; g.fillText('뭉툭 칸(2×2)에 맞춰 그려 게임 크기에서도 모자 · 두건 · 가면이 읽히게. 무기: 소매치기 트럼프 카드 · 닌자 단검(표창은 부장비 칸).', 10, 44);
  g.fillText('맨 오른쪽 칸 = 실제 크기(두 배 · 한 배). 이름 · 색은 제안 — 고른 뒤 다듬는다.', 10, 60);
  // 지금 도적 계열 (견주기)
  let y = 74;
  g.font = '700 13px Galmuri11'; g.fillStyle = '#c8c0b0'; g.fillText('지금 도적 계열 (견주기용 · 옆모습)', 10, y + 14);
  const ref = ['rogue', 'assassin', 'shadowlord', 'duelist', 'bladedancer', 'treasure', 'masterthief'];
  ref.forEach((cls, i) => {
    PXC.clear();
    const a = makeAdv({ cls, lv: 60 }); a.id = 1; a.eq.weapon = makeGear(WEAPON_OF[cls], 5, 0); a.eq.off = null;
    const s = pxsAdvSprite(a, 'idle', 0), Z2 = 3, x = 40 + i * 104, yy = y + 40 + 120;
    g.drawImage(s.cv, Math.round(x + 40 - s.ax * Z2), Math.round(yy - s.ay * Z2), s.cv.width * Z2, s.cv.height * Z2);
    g.font = '11px Galmuri11'; g.fillStyle = '#a89c8c'; g.fillText(CLASSES[cls].name, x + 16, yy + 18);
  });
  y += refH;
  sec.forEach(k => {
    g.font = '700 14px Galmuri11'; g.fillStyle = '#f0c45a'; g.fillText(RG_NAME[k], 10, y + 22);
    g.fillStyle = '#3a3640'; g.fillRect(10, y + 30, c.width - 20, 1);
    cols.forEach((n, i) => { g.font = '11px Galmuri11'; g.fillStyle = '#8a8070'; g.fillText(n, LW + i * CW + (i === 4 ? 14 : CW / 2 - 8), y + 46); });
    y += 50;
    RG[k].forEach(([nm, desc, L]) => {
      PXC.clear();
      const a = makeAdv({ cls: 'rogue', lv: 60 }); a.id = 1;
      a.eq.weapon = makeGear(k === 'pp' ? 'cards' : 'dagger', 5, 0); a.eq.off = null;
      g.fillStyle = '#e8e0d0'; g.font = '700 13px Galmuri11'; g.fillText(nm, 10, y + 40);
      g.font = '11px Galmuri11'; g.fillStyle = '#a89c8c';
      let ty = y + 60, line = '';
      for (const w of desc.split(' ')) { if (g.measureText(line + w).width > LW - 24) { g.fillText(line, 10, ty); ty += 15; line = ''; } line += w + ' '; }
      g.fillText(line, 10, ty);
      const put = (s, i, z, dx, dy) => { const x = LW + i * CW + CW / 2 + (dx || 0), yy = y + RH - 16 + (dy || 0); g.drawImage(s.cv, Math.round(x - s.ax * z), Math.round(yy - s.ay * z), s.cv.width * z, s.cv.height * z); };
      const side = pxsAdvSprite(a, 'idle', 0, L);
      put(pxAdvSprite(a, 'idle', 0, L), 0, Z); put(side, 1, Z); put(rgBack(a, L), 2, Z);
      put(k === 'pp' ? pxsAdvSprite(a, 'atk', 1, L) : pxsAdvSprite(a, 'm:thrust', 4, L), 3, Z);
      g.fillStyle = '#0e1118'; g.fillRect(LW + 4 * CW, y + 30, 110, RH - 40);
      put(side, 4, 2, -50, -10); put(side, 4, 1, 0, -10);
      y += RH;
    });
  });
  return c.toDataURL();
};
