/* ───────── 야영 (빌드 65): 모닥불 · 마부 텐트 · 코네스토가 웨건 · 불침번 교대 · 내려서 자는 탈것 ─────────
   사용자 11-11 00:34 · 01:07 · 01:38 (짐꾼 계열 개편 — equip-draft DECISIONS.md) · 11-12 17:23 「마차 칸, 코네스토가 야영 웨건 그림 … 다 추가」.
   - 기본은 모닥불만: 불침번 한 명이 앉아 있고 나머지는 불가에 누워 잔다.
   - 마부 계열(마부)이 있으면 작은 텐트: 한 채에 두 명, 넷부터 두 채(불침번 한 명은 늘 밖이라 다섯까지 두 채면 맞는다).
   - 코네스토가 · 캐러밴 마스터가 있으면 텐트 대신 코네스토가 웨건 — 모두 그 안에서 잔다.
   - 불침번은 짐꾼 계열이 먼저, 그다음 파티 차례로 한 명씩 교대: 다음 사람이 잠자리(텐트 · 웨건)에서 나와 불가로 걸어오고, 앞 불침번은 그 빈자리로 들어간다(한 바퀴 이어진다).
   - 탈것(랑기수 늑대 · 용기수 와이번)은 내려서 자고, 탈것은 야영지 한쪽에 웅크려 잔다(pxride65.js drawRideSleep).
   시안: tools/saved/porter_chars/camp62.js · camp62r.py(TENT_AT · tentsFor · 교대 길). 웨건 그림 = wagon62.json(80×50, 앞이 오른쪽 — 불 쪽으로 뒤 덮개 구멍이 오게 dir −1). */
const CAMP_SHIFT = 5, CAMP_WALK = 1.2;                 // 불침번 한 사람이 서는 초 · 교대 걸음 초
const CAMP_TENT_AT = [[-58, 7], [-94, 1]];             // 불(cx) 기준 텐트 자리(아래 가운데): 앞 · 뒤 왼쪽
const campTents = n => (n <= 3 ? 1 : 2);               // n = 서 있는 사람 (불침번 한 명은 밖)
const campMode = list => (list.some(a => chainOf(a.cls).includes('conestoga')) ? 'wagon' : list.some(a => chainOf(a.cls).includes('coachman')) ? 'tent' : 'fire');
const WAGON62 = pxRows(`
................................................................................
................................................................................
..cCC.....................................................................CCc...
..CCCCCCC.............................................................CCCCCCC...
..CCCCCCCCCCC.....................................................CCCCCCCCCCC...
..CCCCCCCCCCdCCCCC...........................................CCCdCCCCCCCCCCCC...
..CCCCCCCCCCdCCCCCCCdCCC...............................CdCCCCCCCdCCCCCCCCCCCC...
..CCCCCCCCCCdCCCCCCCdCCCCCCCCdCCCCCCCCd.CCCCCCCdCCCCCCCCdCCCCCCCdCCCCCCCCCCCC...
..CCCCCCCCCCdCCCCCCCdCCCCCCCCdCCCCCCCCdCCCCCCCCdCCCCCCCCdCCCCCCCdCCCCCCCCeCCC...
..CCeeCCCCCCdCCCCCCCdCCCCCCCCdCCCCCCCCdCCCCCCCCdCCCCCCCCdCCCCCCCdCCCCCCCeeeCC...
..CeeeCCCCCdCCCCCCCCdCCCCCCCCdCCCCCCCCdCCCCCCCCdCCCCCCCCdCCCCCCCCdCCCCCCeeeCC...
..ceeeCCCCCdCCCCCCCCdCCCCCCCdCCCCCCCCCdCCCCCCCCCdCCCCCCCdCCCCCCCCdCCCCCCeeeCc...
..ceeeCCCCCdCCCCCCCCdCCCCCCCdCCCCCCCCCdCCCCCCCCCdCCCCCCCdCCCCCCCCdCCCCCCeeecc...
..ceeeCCCCCdCCCCCCCCdCCCCCCCdCCCCCCCCCdCCCCCCCCCdCCCCCCCdCCCCCCCCdCCCCCCeeecc...
...eeeCCCCCdCCCCCCCCdCCCCCCCdCCCCCCCCCdCCCCCCCCCdCCCCCCCdCCCCCCCCdCCCCCCeeec....
....eecCCCCdCCCCCCCdCCCCCCCCdCCCCCCCCCdCCCCCCCCCdCCCCCCCCdCCCCCCCdCCCCCCeee.....
.....eccccdCCCCCCCCdCCCCCCCCdCCCCCCCCCdCCCCCCCCCdCCCCCCCCdCCCCCCCCdCCcccce......
.....cccccdcccccCCCdCCCCCCCCdCCCCCCCCCdCCCCCCCCCdCCCCCCCCdCCCCCcccdccccccc......
......ccccdccccccccdcccCCCCCdCCCCCCCCCdCCCCCCCCCdCCCCCCCcdccccccccdcccccc.......
.......cccdccccccccdccccccccdcccccccccdcccccccccdccccccccdccccccccdccccc........
......kkkkkkkccccccdccccccccdcccccccccdcccccccccdccccccccdcccccccckkkkkkk.......
......KKkkkkkkkkkkkkkcccccccdcccccccccdcccccccccdccccccccdkkkkkkkkkkkkkKK.......
......bBBKKKKKKkkkkkkkkkkkkkkkkkccccccdcccccccckkkkkkkkkkkkkkkkkKKKKKKBBb.......
......bBBBBBbBBBKKKKKKkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkKKKKKKBBBbBBBBBb.......
......bBBBBBbBBBBBbBBBBBKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKBBBBBbBBBBBbBBBBBb.......
......bBBBBBbBBBBBbBBBBBbBBBBBbBBBBBbBBBBBbBBBBBbBBBBBbBBBBBbBBBBBbBBBBBb.......
......bBBBBBbBBBBBbBBBBBbBBBBBbBBBBBbBBBBBbBBBBBbBBBBBbBBBBBbBBBBBbBBBBBb.......
......bBBBBBbBBBBBbBBBBBbBBBBBbBBBBBbBBBBBbBBBBBbBBBBBbBBBBBbBBBBBbBBBBBb.......
......bBBBBBbBBTTTTTBBBBbBBBBBbBBBBBbBBBBBbBBBBBbBBBBBbBBBBBbBBBBBbBBBBBb.......
......KKKKKKKTTTTRTTTTBBbBBBBBbBBBBBbBBBBBbBBBBBbBBBBBbBBBBBbBBKKKKKKKKKK.......
.........KKTTRRRRRRRRRTTKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK..........
..........TTRRVVVrVVVRRTTKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKVVVVV..................
.........TTRRrrvvrvvrrRRTTvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvTTTv..................
.........TRR..r..r..r..RRT.............................TTTTRTTTT................
........TRRr...r.r.r...rRRT...........................TTRRRRRRRTT...............
........TR.rr..r.r.r..rr.RT..........................TTRRr...rRRTT..............
.......TTR...rr.rrr.rr...RTT........................TTR...r.r...RTT.............
.......TTR.....rhhhr.....RTT........................TRRr..r.r..rwRT.............
.......TRRrrrrrrhhhrrrrrrRRT........................TR..r.....r.Www.............
.......TTR.....rhhhr.....RTT.......................TTR....hhh....WWww...........
.......TTR...rr.rrr.rr...RTT.......................TRRrrrrhhhrrrrRRWWw..........
........TR.rr..r.r.r..rr.RT........................TTR....hhh....RTT.Www........
........TRRr...r.r.r...rRRT.........................TR..r.....r..RT...WWww......
.........TRR..r..r..r..RRT..........................TRRr..r.r..rRRT.....WWw.....
.........TTRRrr..r..rrRRTT..........................TTR...r.r...RTT.......Www...
..........TTRR...r...RRTT............................TTRRr...rRRTT.........WWww.
...........TTRRRRRRRRRTT..............................TTRRRRRRRTT............WW.
.............TTTTRTTTT.................................TTTTRTTTT................
...............TTTTT......................................TTT...................
................................................................................
`);
const WAG62_PAL = {
  day: { C: '#ece0c4', c: '#c8b890', d: '#968260', e: '#3c2c1e', B: '#3a5a9a', b: '#243a6a', k: '#964028', K: '#5a2416', R: '#c84a2a', r: '#e6824a', T: '#2a2630', h: '#3c281e', v: '#462c1c', V: '#6e4628', w: '#8c6038', W: '#503420' },
  lit: { C: '#ffe6a0', c: '#e8b860', d: '#b07a3a', e: '#fff4c8', B: '#3a5a9a', b: '#243a6a', k: '#964028', K: '#5a2416', R: '#c84a2a', r: '#e6824a', T: '#2a2630', h: '#3c281e', v: '#462c1c', V: '#6e4628', w: '#8c6038', W: '#503420' }
};
// 코네스토가 웨건 (야영 · 밤이면 덮개 안에 불이 켜진다)
function drawWagon62(w, x, gy, lit, dir) {
  const gr = pxGrid(80, 50); pxPut(gr, WAGON62, 0, 0);
  w.save(); w.translate(Math.round(x), gy); w.scale(dir || 1, 1);
  pxBlit(w, pxBake('wag62' + (lit ? 'L' : 'D'), gr, WAG62_PAL[lit ? 'lit' : 'day'], 40, 49));
  w.restore();
}
// 탈것이 자는 자리 (불 기준 · 바깥을 향해 웅크린다)
const CAMP_MOUNT_AT = { fire: [[64, -4], [-62, -6]], tent: [[-22, -4], [54, -6]], wagon: [[-12, -4], [54, -6]] };   // (cx, GL) 기준 · 사람들 뒤에
const CAMP_MOUNT_Z = 0.8;
function campScene(w, t, p, e, team, pos, lights, post, dark, bg) {
  const cx = AW / 2, cy = GL + 16, ct = e.camp.t, up = team.filter(a => !a.down), downs = team.filter(a => a.down);
  const mode = e.camp.tent ? campMode(up) : 'fire';
  // 불침번 차례: 짐꾼 계열 먼저 → 나머지는 파티 차례
  const order = up.filter(isPorter).concat(up.filter(a => !isPorter(a))), L = order.length;
  const gather = ct < 1.5;   // 처음 1.5초: 다 같이 불가에 둘러앉는다
  const k = Math.floor(Math.max(0, ct - 1.5) / CAMP_SHIFT), inS = Math.max(0, ct - 1.5) - k * CAMP_SHIFT;
  const cur = L ? order[k % L] : null, nxt = L ? order[(k + 1) % L] : null, swap = !gather && L > 1 && inS > CAMP_SHIFT - CAMP_WALK;
  const sw = swap ? (inS - (CAMP_SHIFT - CAMP_WALK)) / CAMP_WALK : 0;
  const draw = (a, x, y, o, flip) => { shadowAt(w, x, y, o.sleep ? 14 : 8); w.save(); w.translate(Math.round(x), Math.round(y)); if (flip) w.scale(-1, 1); drawAdv(w, a, t, Object.assign({ z: ZS, side: 1, noRide: 1 }, o)); w.restore(); pos['a' + a.id] = [x, y]; };
  const zzz = (x, y, ph) => post.push(g => drawZ(g, x, y, t, ph));
  // 불가 자리: 사람마다 정해진 자리 (짝수 왼쪽 · 홀수 오른쪽), 누우면 조금 더 바깥
  const spot = (i, lying) => { const side = i % 2 ? 1 : -1, kk = Math.floor(i / 2); return [cx + side * (lying ? 26 + kk * 24 : 18 + kk * 17), cy, side]; };
  const fireSleep = (a, i, sitUp) => {   // 불가에서 자기 (깨어 있으면 앉는다)
    const lying = !gather && !sitUp && (a.down || (a.fat || 0) > 4), [x, y, side] = spot(i, lying);
    draw(a, x, y, lying ? { sleep: 1 } : { sit: 1 }, side > 0);
    if (lying) zzz(x - side * 8, y - 14, i * 0.3);
  };
  // 잠자리 (텐트 · 웨건) — 그 앞(문)에서 나오고 들어간다
  let door = null, TP = null, slots = null, nT = 0;
  if (mode === 'tent') {
    nT = Math.min(CAMP_TENT_AT.length, campTents(L));
    TP = CAMP_TENT_AT.slice(0, nT).map(([ox, oy]) => [cx + ox, GL + oy]);
    TP.map((q, i) => i).sort((i, j) => TP[i][1] - TP[j][1]).forEach(i => { w.save(); w.translate(TP[i][0], TP[i][1]); drawTentHi(w); w.restore(); });
    // 잠자리 칸: 처음엔 첫 불침번 다음 차례대로 두 명씩 · 교대할 때마다 나온 사람 칸에 들어간 사람
    slots = order.slice(1);
    for (let j = 1; j <= k; j++) { const i = slots.indexOf(order[j % L]); if (i >= 0) slots[i] = order[(j - 1) % L]; }
    const ti = Math.max(0, Math.min(nT - 1, Math.floor(Math.max(0, slots.indexOf(nxt)) / 2)));
    door = [TP[ti][0] - 4, TP[ti][1] + 1];
  } else if (mode === 'wagon') {
    const lit = dark > 0.3;
    drawWagon62(w, cx - 70, GL + 14, lit, -1); door = [cx - 32, cy - 4];   // 뒤(덮개 구멍)가 불 쪽
    if (lit) { lights.push({ x: cx - 70, y: GL - 16, r: 64, c: '#f0c060', glow: 1, flick: 0 }); post.push(g => R(g, cx - 34.5, GL - 22, 1, 6, '#3a2a1a')); post.push(g => lanternHi(g, cx - 31, GL - 6, t)); lights.push({ x: cx - 31, y: GL - 12, r: 46, c: '#f0c060', glow: 1, flick: 1 }); }
  }
  if (p.wagon && !bg.under) {   // 이 파티의 마차 (모닥불만이면 왼쪽 · 텐트 · 웨건이면 오른쪽) · 캐러밴 마스터의 둘째 마차는 그 안쪽 뒤
    const q2 = rig2Live(p); if (q2) drawRig(w, mode === 'fire' ? 60 : 176, GL + 4, t + 0.37, q2, false, mode === 'fire' ? 1 : -1);
    drawRig(w, mode === 'fire' ? 26 : 214, GL + 10, t, p, false, mode === 'fire' ? 1 : -1);
  }
  // 탈것: 내려서 웅크려 잔다 (기수는 불가 · 잠자리에)
  up.concat(downs).filter(a => rideKind(a)).slice(0, 2).forEach((a, i) => {
    const [ox, oy] = CAMP_MOUNT_AT[mode][i], x = cx + ox, y = GL + oy;
    const fl = ox > 0 ? -1 : 1;   // 불 쪽을 보고 웅크린다
    shadowAt(w, x, y, 20);
    w.save(); w.translate(x, y); w.scale(fl, 1); drawRideSleep(w, a, t, CAMP_MOUNT_Z, i * 0.6); w.restore();
    if (!gather) zzz(x - fl * 8, y - 16, 0.5 + i * 0.4);
  });
  if (mode === 'fire') {
    // 모두 불가: 불침번만 앉아 있고 나머지는 누워 잔다. 교대 때 다음 사람이 먼저 일어나 앉는다
    team.forEach((a, i) => fireSleep(a, i, a === cur || (swap && a === nxt && sw > 0.3)));
  } else {
    // 텐트 · 웨건: 불침번만 밖. 교대 때 다음 사람이 잠자리에서 나와 걸어오고, 앞 사람은 그 잠자리로 들어간다 (불 앞으로 돌아서 걷는다)
    const seat = [cx + 20, cy], qIn = Math.min(1, sw * 1.4), qOut = Math.max(0, sw * 1.4 - 0.4);
    const path = (A, B, q) => { const mid = [A[0] + (B[0] - A[0]) * 0.15, Math.max(A[1], B[1]) + 4], u = q < 0.35 ? q / 0.35 : (q - 0.35) / 0.65, P = q < 0.35 ? [A, mid] : [mid, B]; return [P[0][0] + (P[1][0] - P[0][0]) * u, P[0][1] + (P[1][1] - P[0][1]) * u]; };
    if (gather) order.forEach((a, i) => fireSleep(a, i, 1));
    else if (cur) {
      if (!swap) draw(cur, seat[0], seat[1], { sit: 1 }, true);
      else {
        const a1 = path(door, [seat[0] + 10, seat[1]], qIn), a0 = path(seat, door, qOut);
        draw(nxt, a1[0], a1[1], { walk: 1 }, a1[0] < door[0]);                     // 나와서 불 쪽으로
        draw(cur, a0[0], a0[1], qOut > 0 ? { walk: 1 } : { sit: 1 }, true);         // 일어나 잠자리로
      }
    }
    // 텐트 칸보다 사람이 많으면 남는 사람은 불 오른쪽 바깥에 눕는다 (들것에 실린 사람은 잠자리 안)
    const outside = mode === 'tent' && slots ? slots.slice(nT * 2) : [];
    outside.forEach((a, i) => fireSleep(a, 3 + i * 2, 0));
    if (!gather) {
      if (mode === 'tent') TP.forEach(([x, y], i) => {   // 텐트마다 안에서 자는 사람 수만큼 쿨쿨
        const inside = slots.slice(i * 2, i * 2 + 2).filter(a => !(swap && a === nxt && qIn > 0));
        inside.forEach((a, m) => zzz(x + 1 + m * 6, y - 19 - m * 3, i * 0.5 + m * 0.3));
      });
      else for (let i = 0; i < Math.min(3, Math.max(1, L - 1)); i++) zzz(door[0] + 4 + i * 3, door[1] - 22 - i * 2, i * 0.4);
    }
    // 텐트 · 웨건 안 사람의 자리 (효과 · 숫자가 뜨는 곳)
    order.forEach(a => { if (!pos['a' + a.id]) pos['a' + a.id] = door ? [door[0], door[1] + 6] : [cx, cy]; });
  }
  // 모닥불 (비가 오면 노숙(모닥불만)은 꺼진 장작에서 연기만 · 강풍이면 작은 불)
  const cw = wxNow(e);
  if (campWet(p, cw)) post.push(g => { R(g, cx - 5, cy - 2, 11, 1, '#5e3c22'); R(g, cx - 4, cy - 3, 3, 1, '#4a3020'); R(g, cx + 2, cy - 3, 3, 1, '#4a3020'); for (let i = 0; i < 4; i++) { const q = ((t * 0.5 + i * 0.25) % 1); R(g, cx + Math.round(Math.sin(i * 5 + t) * 2), cy - 6 - Math.round(q * 16), 1, 1, `rgba(170,170,180,${(0.6 * (1 - q)).toFixed(2)})`); } });
  else { const windy = campWindy(p, cw); post.push(g => fireHi(g, cx + (windy ? Math.round(Math.sin(t * 9)) : 0), cy, t)); lights.push({ x: cx, y: cy - 6, r: windy ? 55 : 90, c: '#f09040', glow: 1, flick: 1 }); }
}
STORY.v65.push(
  '야영 — 모닥불만 피우던 노숙에 더해, 마부가 있으면 작은 텐트(한 채에 둘, 넷부터 두 채), 코네스토가 · 캐러밴 마스터가 있으면 코네스토가 웨건 안에서 모두 잔다. 불침번은 짐꾼 계열부터 한 명씩 교대한다.',
  '마차 — 말이 끄는 마차는 이제 마부 계열(마부 · 코네스토가 · 캐러밴 마스터)만 몬다. 그냥 짐꾼 · 음유시인 · 정찰가 파티는 손수레만. 짐꾼 계열 장비 탭에 마차 칸이 생겼고, 캐러밴 마스터는 마차를 두 대까지 몬다(마구간에서 둘째 마차 — 짐은 더하고 행렬은 느린 마차에 맞춘다).'
);
