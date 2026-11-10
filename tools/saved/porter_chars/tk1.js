/* ═══ 트래커(2차) · 스토커(3차) 캐릭터 시안 (사용자 11-10 23:09) — rg1.js · rg2.js(H2 · E2 · rgBack) 위에 ═══
   괴물사냥꾼 → 트래커, 드래곤 슬레이어 → 스토커. 주무기 컴파운드 보우(도르래 활) · 부장비 손목 석궁(먼 팔) · 볼트통(허리) · 볼트 · 화살통(등, 궁수 공통) */
Object.assign(PX_HEAD, {
  // 늑대 가죽 두건: 머리 위에 늑대 머리(귀 · 눈 · 주둥이) · 윗턱 이빨이 이마 위 · 옆으로 털이 늘어진다
  wolfhood: H2(`
.JJ..JJ.
.JjJJjJ.
JJJJJJJJ
JKJZZJKJ
JJZKKZJJ
jzZZZZzj
J......j
j......j
j......j`, 3),
  wolfhood2: H2(`
.JJ..JJ.
.JjJJjJ.
JJJJJJJJ
JXJZZJXJ
JJZKKZJJ
jzZZZZzj
J......j
j......j
j......j`, 3),
  // 덫꾼 털모자: 가죽 모자 · 털 테 · 귀덮개가 턱까지
  trapper: H2(`
..JJJJ..
.JJIJJj.
JJJJJJJj
AAAAAAAa
AA....aa
Aa....aa
Aa....aa
.a....a.`, 2),
  // 두건 + 붉은 반다나(입 · 턱만 가림, 이마 · 눈은 보인다)
  bandana: H2(`
..JJJJ..
.JJIJJj.
JJIJJJjj
J......j
J......j
J......j
jRrRrRrj`, 1),
  // 유리눈 가면: 검은 두건 · 얼굴 전부 가죽 가면 · 놋쇠 테 둥근 유리눈(빛) · 입 거르개
  lensmask: H2(`
..JJJJ..
.JJIJJj.
JJIJJJjj
JGGFFGGj
JXXFFXXj
JGGFFGGj
.jFrrFj.`, 1),
  // 짐승 뼈 가면: 두건 · 해골 가면(눈구멍에 빛) · 코 구멍 · 이빨
  skullmask: H2(`
..JJJJ..
.JJIJJj.
JZZZZZZj
JZZZZZZj
JKXZZXKj
jZZKKZZj
.zZzzZz.`, 1)
});
Object.assign(PXS_HEAD, {
  wolfhood: H2(`
.....JJ....
....JJJJ...
..JJJJJKJ..
.JJJJJJJZZ.
JJJJJJJZZK.
JJJJjzZZz..
JJJ........
JJj........
Jj.........`, 3, -2),
  wolfhood2: H2(`
.....JJ....
....JJJJ...
..JJJJJXJ..
.JJJJJJJZZ.
JJJJJJJZZK.
JJJJjzZZz..
JJJ........
JJj........
Jj.........`, 3, -2),
  trapper: H2(`
...JJJJ...
..JJIJJj..
.JJJJJJJj.
AAAAAAAAAa
.AA.......
.AAa......
.Aaa......
..a.......`, 2, -1),
  bandana: H2(`
....JJJ...
...JJIJj..
..JJJJJJj.
..JJ......
..JJ......
..JJ......
..jJRrRr..`, 1, -2),
  lensmask: H2(`
....JJJ...
...JJIJj..
..JJJJJJj.
..JJGGGG..
..JJGXXF..
..JJGGGFF.
...JJFrr..`, 1, -2),
  skullmask: H2(`
....JJJ...
...JJIJj..
..JJZZZZ..
..JZZZZZZ.
..JZZKXZZZ
..jZZZZKZz
...JzZzZz.`, 1, -2)
});
// 손목 석궁(먼 팔 팔뚝) · 볼트통(허리) — 반 해상도로 그려 두 배
Object.assign(PX_EX, {
  wxbow: E2(`
.G.
GaG
.a.`, 14, 2),
  bcase: E2(`
e.e
bbb
bbB
.B.`, -2, 4)
});
Object.assign(PXS_EX, {
  wxbow: E2(`
G..
aaG
G..`, 9, 2),
  bcase: E2(`
e.e
bbb
bbB
.B.`, -1, 4, 1)
});
// 컴파운드 보우 손 그림 (장궁 칸을 빌려 쓴다 — 시안판에서만)
const TK_CBOW = {
  front: { x: -4, y: -6, g: pxUp(pxRows(`
GG.
O.w
OOw
NNw
NSw
NNw
OOw
O.w
GG.`)).join('\n'), draw: pxUp(pxRows(`
GG...
O.w..
OO.w.
NN..R
NS..R
NN..w
OO.w.
O.w..
GG...`)).join('\n') },
  side: { x: 11, y: -8, g: pxUp(pxRows(`
GG.
O.w
OOw
NNw
SNw
NNw
OOw
O.w
GG.`)).join('\n'), draw: pxUp(pxRows(`
GG...
O.w..
OO.w.
NN..R
SN..R
NN..w
OO.w.
O.w..
GG...`)).join('\n') }
};
const TK = {
  tr: [
    ['A 늑대 가죽 두건', '머리 위에 늑대 머리 · 이빨이 이마 위 · 어깨까지 회색 털 · 가죽 조끼', { head: 'wolfhood', body: 'leather', ex: ['quiver', 'fur', 'wxbow', 'bcase'], c1: '#4a5a3a', c2: '#c8b080', c3: '#8a3a2a', hc: '#8a8a90', leather: '#7a7a80', feather: '#c8322a', pants: '#3e3a2e', boots: '#2e241a', hair: 'short', wv: 'long' }],
    ['B 덫꾼 털모자', '가죽 모자 · 털 테 · 턱까지 내려온 귀덮개 · 갈색 가죽옷', { head: 'trapper', body: 'leather', ex: ['quiver', 'kerchief', 'wxbow', 'bcase'], c1: '#6a4a2e', c2: '#d8c8a8', c3: '#a8432f', hc: '#5a3a22', leather: '#8a6a44', pants: '#4a3a2a', boots: '#2e2218', hair: 'short', wv: 'long' }],
    ['C 반다나 두건', '이끼빛 두건 · 붉은 반다나로 입을 가림 · 이마 · 눈은 보인다', { head: 'bandana', body: 'leather', ex: ['quiver', 'wxbow', 'bcase'], c1: '#4e5a34', c2: '#a8a070', c3: '#8a6a3a', hc: '#56603a', leather: '#6a6a44', feather: '#c8322a', pants: '#3a3a28', boots: '#28241a', hair: 'short', wv: 'long' }]
  ],
  st: [
    ['A 유리눈 가면', '검은 두건 · 얼굴 전부 가린 가죽 가면 · 놋쇠 테 유리눈이 빛난다 · 망토', { head: 'lensmask', body: 'leather', ex: ['quiver', 'cape', 'wxbow', 'bcase'], c1: '#2a2a30', c2: '#4a4a52', c3: '#4a3a2e', hc: '#1e1e24', leather: '#3a3a42', gold: '#c89a40', gem: '#c8ff6a', feather: '#8a2a22', cape: '#2a2420', pants: '#1e1e22', boots: '#141416', hair: 'short', wv: 'long' }],
    ['B 검은 늑대 망토', '검은 늑대 가죽 두건(눈이 붉게 빛남) · 검은 털 · 붉은 망토 안감', { head: 'wolfhood2', body: 'leather', ex: ['quiver', 'fur', 'cape', 'wxbow', 'bcase'], c1: '#2a2228', c2: '#6a5a50', c3: '#8a2a2a', hc: '#2e2a30', leather: '#3a343a', gem: '#ff4a3a', cape: '#5a1a1a', pants: '#1e1a1e', boots: '#121014', hair: 'short', wv: 'long' }],
    ['C 짐승 뼈 가면', '짐승 해골 가면(눈구멍 빛) · 검은 두건 · 뼈빛 · 짙은 망토', { head: 'skullmask', body: 'leather', ex: ['quiver', 'cape', 'wxbow', 'bcase'], c1: '#2e2a26', c2: '#5a5048', c3: '#6a5a4a', hc: '#24201c', leather: '#3e3832', gem: '#7af0ff', cape: '#1e1a18', pants: '#1c1a18', boots: '#121010', hair: 'short', wv: 'long' }]
  ]
};
const TK_NAME = { tr: '트래커 (2차, 괴물사냥꾼 자리) — 컴파운드 보우 · 손목 석궁(먼 팔) · 볼트통(허리) · 화살통(등)', st: '스토커 (3차, 드래곤 슬레이어 자리) — 같은 차림을 더 어둡고 무섭게' };
function tkWith(fn) {   // 장궁 그림을 잠깐 컴파운드 보우로
  const a = PX_BOW.long, b = PXS_BOW.long;
  PX_BOW.long = TK_CBOW.front; PXS_BOW.long = TK_CBOW.side;
  try { return fn(); } finally { PX_BOW.long = a; PXS_BOW.long = b; }
}
window.WAR_SHEET = () => {
  S = blankState('시안');
  const Z = 4, CW = 34 * Z, RH = 42 * Z, LW = 250, cols = ['앞', '옆', '뒤', '당기기', '게임 속 크기'];
  const secs = ['tr', 'st'];
  const H = 74 + secs.reduce((s, k) => s + 50 + TK[k].length * RH, 0);
  const [c, g] = mkCanvas(LW + 4 * CW + 140, H);
  g.fillStyle = '#1a1820'; g.fillRect(0, 0, c.width, c.height); g.imageSmoothingEnabled = false;
  g.font = '700 16px Galmuri11'; g.fillStyle = '#f0c45a'; g.fillText('트래커 · 스토커 캐릭터 시안 — 직업마다 셋 중 하나 (11-10 23:09)', 10, 24);
  g.font = '12px Galmuri11'; g.fillStyle = '#a89c8c';
  g.fillText('옛 사냥꾼 · 괴수사냥꾼(괴물사냥꾼 · 드래곤 슬레이어) 그림은 버리고 새로. 손에 컴파운드 보우(끝 도르래), 먼 팔에 손목 석궁, 허리에 볼트통, 등에 화살통.', 10, 44);
  g.fillText('맨 오른쪽 칸 = 실제 크기(두 배 · 한 배). 이름 · 색은 제안.', 10, 60);
  let y = 74;
  secs.forEach(k => {
    g.font = '700 14px Galmuri11'; g.fillStyle = '#f0c45a'; g.fillText(TK_NAME[k], 10, y + 22);
    g.fillStyle = '#3a3640'; g.fillRect(10, y + 30, c.width - 20, 1);
    cols.forEach((n, i) => { g.font = '11px Galmuri11'; g.fillStyle = '#8a8070'; g.fillText(n, LW + i * CW + (i === 4 ? 14 : CW / 2 - 12), y + 46); });
    y += 50;
    TK[k].forEach(([nm, desc, L]) => tkWith(() => {
      PXC.clear();
      const a = makeAdv({ cls: 'archer', lv: 60 }); a.id = 1;
      a.eq.weapon = makeGear('bow', 5, 0); a.eq.off = null;
      g.fillStyle = '#e8e0d0'; g.font = '700 13px Galmuri11'; g.fillText(nm, 10, y + 40);
      g.font = '11px Galmuri11'; g.fillStyle = '#a89c8c';
      let ty = y + 60, line = '';
      for (const w of desc.split(' ')) { if (g.measureText(line + w).width > LW - 24) { g.fillText(line, 10, ty); ty += 15; line = ''; } line += w + ' '; }
      g.fillText(line, 10, ty);
      const put = (s, i, z, dx, dy) => { const x = LW + i * CW + CW / 2 + (dx || 0), yy = y + RH - 16 + (dy || 0); g.drawImage(s.cv, Math.round(x - s.ax * z), Math.round(yy - s.ay * z), s.cv.width * z, s.cv.height * z); };
      const side = pxsAdvSprite(a, 'idle', 0, L);
      put(pxAdvSprite(a, 'idle', 0, L), 0, Z); put(side, 1, Z); put(rgBack(a, L), 2, Z);
      put(pxsAdvSprite(a, 'atk', 0, L), 3, Z);
      g.fillStyle = '#0e1118'; g.fillRect(LW + 4 * CW, y + 30, 110, RH - 40);
      put(side, 4, 2, -50, -10); put(side, 4, 1, 0, -10);
      y += RH;
    }));
  });
  return c.toDataURL();
};
