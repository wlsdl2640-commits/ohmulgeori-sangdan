/* ═══ 도적 계열 캐릭터 확정 · 보관 (사용자 11-10 22:15) ═══
   소매치기 = A 헌팅캡 · 3차 괴도(새 직업) = 중절모 · 대도 → 4차(지금 그림 그대로) · 닌자 = A 남색 시노비 · 카게닌자 = A 그림자 두건
   보관: 삿갓(모자만 — 전사 계열 새 1차 「무사」용) · 쿠노이치((여)도적용) · 귀면 · 여우 가면(닌자 계열 4차용) */
PX_HEAD.kasa_hat = H2(`
.....AA.....
...AAAAAa...
.AAAAAAAAAa.
aaaaaaaaaaaa`, 2, -2);
PXS_HEAD.kasa_hat = H2(`
.....AA.....
...AAAAAa...
.AAAAAAAAAa.
aaaaaaaaaaaa`, 2, -2);
const RGF = {
  line: [
    ['소매치기 (2차) — A 헌팅캡', '보물 사냥꾼 자리 · 트럼프 카드 · 락핀', 'cards', RG.pp[0][2]],
    ['괴도 (3차, 새 직업) — 중절모', '이번 시안 B를 옮김 · 둥근 중절모 · 붉은 띠 · 나비넥타이 · 초록 조끼', 'cards', RG.pp[1][2]],
    ['대도 (4차로 올림) — 지금 그림', '실크해트 · 망토 · 가면 그대로', 'cards', PXL.masterthief],
    ['닌자 (2차) — A 남색 시노비', '눈만 보이는 두건 · 붉은 머리띠 꼬리', 'dagger', RG.nj[0][2]],
    ['카게닌자 (3차) — A 그림자 두건', '검보라 · 끝이 빛나는 꼬리와 목도리', 'dagger', RG.kg[0][2]]
  ],
  saved: [
    ['삿갓 (모자만)', '전사 계열 새 1차 「무사」에 다시 쓴다 (무사 → 검호 → 검제 → 검성)', 'sword', { head: 'kasa_hat', body: 'tunic', c1: '#3a4a6a', c2: '#d8b878', c3: '#8a5a3a', hc: '#d8b878', pants: '#2e3448', boots: '#2a2228', hair: 'short' }],
    ['쿠노이치', '나중에 (여)도적을 만들 때', 'dagger', RG.nj[2][2]],
    ['귀면', '닌자 계열 4차(또는 5차 · 각성)용', 'dagger', RG.kg[1][2]],
    ['여우 가면', '닌자 계열 4차(또는 5차 · 각성)용', 'dagger', RG.kg[2][2]]
  ]
};
window.WAR_SHEET = () => {
  S = blankState('시안');
  const Z = 4, CW = 34 * Z, RH = 42 * Z, LW = 250, cols = ['앞', '옆', '뒤', '공격', '게임 속 크기'];
  const secs = [['도적 계열 확정 — 도적 → 2차 소매치기 → 3차 괴도 → 4차 대도 / 도적 → 2차 닌자 → 3차 카게닌자', RGF.line], ['보관 (나중에 쓸 그림 · tools/saved/rogue_skins.json)', RGF.saved]];
  const H = 60 + secs.reduce((s, [, L]) => s + 50 + L.length * RH, 0);
  const [c, g] = mkCanvas(LW + 4 * CW + 140, H);
  g.fillStyle = '#1a1820'; g.fillRect(0, 0, c.width, c.height); g.imageSmoothingEnabled = false;
  g.font = '700 16px Galmuri11'; g.fillStyle = '#f0c45a'; g.fillText('도적 계열 캐릭터 — 고른 것 · 보관한 것 (11-10 22:15)', 10, 24);
  g.font = '12px Galmuri11'; g.fillStyle = '#a89c8c'; g.fillText('괴도 · 대도 스킬은 나중에 다시 짠다(나눠 쓰는 것 + 새로 만드는 것). 맨 오른쪽 = 실제 크기(두 배 · 한 배).', 10, 44);
  let y = 60;
  secs.forEach(([title, list]) => {
    g.font = '700 14px Galmuri11'; g.fillStyle = '#f0c45a'; g.fillText(title, 10, y + 22);
    g.fillStyle = '#3a3640'; g.fillRect(10, y + 30, c.width - 20, 1);
    cols.forEach((n, i) => { g.font = '11px Galmuri11'; g.fillStyle = '#8a8070'; g.fillText(n, LW + i * CW + (i === 4 ? 14 : CW / 2 - 8), y + 46); });
    y += 50;
    list.forEach(([nm, desc, wb, L]) => {
      PXC.clear();
      const a = makeAdv({ cls: wb === 'sword' ? 'warrior' : 'rogue', lv: 60 }); a.id = 1;
      a.eq.weapon = makeGear(wb, 5, 0); a.eq.off = null;
      g.fillStyle = '#e8e0d0'; g.font = '700 13px Galmuri11'; g.fillText(nm, 10, y + 40);
      g.font = '11px Galmuri11'; g.fillStyle = '#a89c8c';
      let ty = y + 60, line = '';
      for (const w of desc.split(' ')) { if (g.measureText(line + w).width > LW - 24) { g.fillText(line, 10, ty); ty += 15; line = ''; } line += w + ' '; }
      g.fillText(line, 10, ty);
      const put = (s, i, z, dx, dy) => { const x = LW + i * CW + CW / 2 + (dx || 0), yy = y + RH - 16 + (dy || 0); g.drawImage(s.cv, Math.round(x - s.ax * z), Math.round(yy - s.ay * z), s.cv.width * z, s.cv.height * z); };
      const side = pxsAdvSprite(a, 'idle', 0, L);
      put(pxAdvSprite(a, 'idle', 0, L), 0, Z); put(side, 1, Z); put(rgBack(a, L), 2, Z);
      put(wb === 'cards' ? pxsAdvSprite(a, 'atk', 1, L) : pxsAdvSprite(a, wb === 'sword' ? 'm:down' : 'm:thrust', 4, L), 3, Z);
      g.fillStyle = '#0e1118'; g.fillRect(LW + 4 * CW, y + 30, 110, RH - 40);
      put(side, 4, 2, -50, -10); put(side, 4, 1, 0, -10);
      y += RH;
    });
  });
  return c.toDataURL();
};
