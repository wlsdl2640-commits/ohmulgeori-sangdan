/* ───────── 몬스터 동작 (빌드 43): 공격 · 마법 · 스킬 ─────────
   PXU 그림이 있는 몬스터(언데드)는 사건마다 동작을 하고, 모험가 쪽 효과·숫자·소리·번쩍임은 맞는 때(동작의 맞히는 장 + 투사체가 나는 시간)에 낸다.
   갈래: 공격(atk) · 마법(mag, 마법 몬스터의 공격) · 스킬(skl — 광역기가 있으면 광역기, 없으면 상태이상을 거는 한 방·치명타).
   V.fmot['f' + uid] = { mk 동작 · cat 갈래 · t0 시작 · T 장마다 초 · hit 맞히는 장까지 초 · fl 투사체 초 · aoe { t, T1, x0, k } } */
const FMOT_CAST = { spush: 1, sjab: 1, spushup: 1, scharge: 1, sraise: 1, wspit: 1, bshot: 1, bfull: 1, bdiag: 1, brapid: 1, braise: 1 };   // 투사체를 쏘는 동작
const FMOT_AOE_V = { bats: 150, nova: 230, spin: 260, slam: 240 };   // 광역기가 퍼지는 빠르기 (논리 픽셀/초)
const FMOT_NAME = { dracula: '박쥐 떼', lichking: '죽음의 파동', reaper: '죽음의 회전', deathknight: '암흑 강타', banshee: '죽음의 비명', ghosttree: '원혼의 뿌리', seraphknight: '천벌' };   // 광역기 이름 (알림 · 3번째부터의 우두머리도 광역기를 쓴다)
// 효과 표: SKFX에 'u:id:갈래'로 넣어 스킬 효과 그리기(skh 맞히기 · skp 투사체 · skw 초승달 · skq 땅 금)를 빌린다
for (const id in PXU_ACT) for (const cat of ['atk', 'mag', 'skl']) {
  const q = PXU_ACT[id].fx && PXU_ACT[id].fx[cat];
  if (q) SKFX['u:' + id + ':' + cat] = Object.assign({ pal: 'shadow', hit: 'star' }, q, q.p ? { proj: q.p } : {});
}
const fmotOK = f => !!(f && !f.giant && !f.adv && PXU[f.id]);
const fmotSk = (id, cat) => SKFX['u:' + id + ':' + cat] || null;
// 사건 하나 → 동작 시작 · 맞는 때까지 남은 초 (PXU 몬스터가 아니면 0) · nx = 바로 뒤 사건 (상태이상을 거는 한 방인지 본다)
function fmotOn(e, x, t, nx, at) {
  const f = e.foes && e.foes.find(o => o.uid === x.s);
  if (!fmotOK(f)) return 0;
  const key = 'f' + f.uid, A = PXU_ACT[f.id] || {}, m0 = V.fmot[key], fq = at('f' + f.uid);
  if ((x.type === 'hurt' || x.type === 'miss' || x.type === 'shield') && m0 && m0.aoe && m0.aoe.t === t) {   // 광역기의 한 방: 퍼지는 것이 그 사람에게 닿는 때
    const q = at('a' + x.d), dist = q ? Math.abs(q[0] - m0.aoe.x0) : 60;
    return Math.max(0, m0.aoe.T1 - t) + dist / (FMOT_AOE_V[m0.aoe.k] || 200);
  }
  if (m0 && m0.t0 === t && m0.d === x.d && (x.type === 'shield' || m0.from === 'shield')) return m0.hit + m0.fl;   // 보호막이 받은 한 방과 그 뒤 맞기: 같은 동작
  const sta = nx && nx.type === 'sta' && nx.side === 'a' && nx.d === x.d;
  const cat = x.type === 'aoe' ? 'skl' : A.skl && !MONS[f.id].aoe && !f.aoe && (x.c || sta) ? 'skl' : x.k === 'magic' && A.mag ? 'mag' : A.atk ? 'atk' : 'mag';
  const mk = pxuPick(f.id, cat, m0 && m0.mk), T = pxuMotT(f.id, mk), hf = pxsMotHit(mk), sk = fmotSk(f.id, cat);
  let hit = 0; for (let i = 0; i < hf; i++) hit += T[i];
  const fl = sk && sk.proj && FMOT_CAST[mk] && x.type !== 'aoe' ? SK_PROJ_T[sk.proj] || 0.2 : 0;
  V.fmot[key] = { mk, cat, t0: t, T, hit, fl, c: x.c, d: x.d, from: x.type };
  if (x.type === 'aoe') V.fmot[key].aoe = { t, T1: t + hit, x0: fq ? fq[0] : 170, k: (sk && sk.aoe) || 'nova' };
  return hit + fl;
}
// 지금 장 { mk, f, cat, c } (동작이 끝나면 지운다)
function fmotNow(f, t) {
  const key = 'f' + f.uid, m = V.fmot && V.fmot[key];
  if (!m) return null;
  let e = t - m.t0;
  if (e < 0) return null;
  for (let i = 0; i < m.T.length; i++) { if (e < m.T[i]) return { mk: m.mk, f: i, cat: m.cat, c: m.c }; e -= m.T[i]; }
  delete V.fmot[key];
  return null;
}
// 몸이 나간 거리 (화면 픽셀, 파티 쪽 −)
const fmotDx = (f, mo, z) => (mo ? (pxuSprite(f.id, mo.mk, mo.f).dx || 0) * 2 * z : 0);
// 무기 자취·번쩍임 칸: 갈래 색으로 (적은 왼쪽을 본다)
function fmotFx(g, f, mo, x, y, z, dir) {
  const s = pxuSprite(f.id, mo.mk, mo.f), F = s.mfx;
  if (!F) return;
  const sk = fmotSk(f.id, mo.cat), P = sk ? SK_PAL[sk.pal] : MOT_PAL[0], pal = mo.c ? MOT_PAL[1] : [P[0], P[1], P[2]];
  g.save(); g.translate(x, y); g.scale(-dir * z, z);
  for (const L of [F.back, F.front]) for (const [X, Y, ci] of L) R(g, 2 * X - s.fo[0], 2 * Y - s.fo[1], 2, 2, pal[ci]);
  g.restore();
}
// 쏘는 장의 무기 끝 → 화면 자리
function fmotTip(f, m, q, z, dir) {
  const s = pxuSprite(f.id, m.mk, pxsMotHit(m.mk)), tp = s.tip || [s.fo[0] / 2, s.fo[1] / 2 - 8];
  return [q[0] - (2 * tp[0] - s.fo[0] + 1) * z * dir, q[1] + (2 * tp[1] - s.fo[1] + 1) * z];
}
// 맞는 자리 효과 (모험가 쪽): 투사체 → 맞히기 · 남은 것
function fmotHitFx(e, x, t, fd, am, aq, at) {
  const f = e.foes.find(o => o.uid === x.s), m = f && V.fmot['f' + f.uid];
  if (!m) return;
  const dir = V.dir || 1, fq = at('f' + f.uid), cat = m.aoe && m.aoe.t === t ? 'skl' : m.cat, sk = fmotSk(f.id, cat), id = 'u:' + f.id + ':' + cat, T1 = t + fd;
  if (!sk) return;
  if (m.fl && fq) {
    const src = fmotTip(f, m, fq, zAt(fq[1]), dir);
    V.fx.push({ k: 'skp', id, style: sk.proj, x0: src[0], y0: src[1], x1: am[0], y1: am[1], t0: T1 - m.fl, d: m.fl, arc: m.mk === 'bdiag' ? 34 : 0, dir: -dir, big: sk.big || 0 });
  }
  V.fx.push({ k: 'skh', id, x: am[0], y: am[1], fy: aq[1], h: 21 * zAt(aq[1]), t0: T1 - (SK_PRE[sk.hit] || 0), pre: SK_PRE[sk.hit] || 0, d: 1.1 + (SK_PRE[sk.hit] || 0), big: x.c ? Math.max(1, sk.big || 0) : sk.big || 0, last: 1, dir: -dir, ax: fq ? fq[0] : am[0] + 40 * dir });
}
// 광역기: 동작이 맞히는 장에서 퍼진다 (박쥐 떼 · 죽음의 파동 · 죽음의 회전 · 암흑 강타)
function fmotAoe(e, x, t, fd, team, at) {
  const f = e.foes.find(o => o.uid === x.s), m = f && V.fmot['f' + f.uid];
  if (!m || !m.aoe) return;
  const dir = V.dir || 1, fq = at('f' + f.uid), z = fq ? zAt(fq[1]) : 1, sk = fmotSk(f.id, 'skl'), id = 'u:' + f.id + ':skl', T1 = t + fd, k = m.aoe.k;
  if (!fq || !sk) return;
  const H = monH(f.id, f.sc) * z, cx = fq[0], cy = fq[1] - H * 0.55, tg = team.filter(a => !a.down).map(a => at('a' + a.id)).filter(Boolean);
  if (FMOT_NAME[f.id]) callout(fq[0], fq[1] - H - 6, FMOT_NAME[f.id] + '!', 'boss');
  if (k === 'bats') tg.forEach((q, i) => { for (let j = 0; j < 3; j++) V.fx.push({ k: 'ubat', id, x0: cx - 6 * dir + (j - 1) * 6, y0: cy - 10 + j * 6, x1: q[0] + (j - 1) * 4, y1: q[1] - 14 * zAt(q[1]) + (j - 1) * 5, t0: T1 + j * 0.06, d: Math.abs(q[0] - cx) / FMOT_AOE_V.bats, s: i * 3 + j }); });
  else if (k === 'nova') V.fx.push({ k: 'unova', id, x: cx, y: fq[1] - 2, t0: T1, d: 0.9, r1: Math.max(60, ...tg.map(q => Math.abs(q[0] - cx) + 16)) });
  else if (k === 'spin') { V.fx.push({ k: 'uspin', id, x: cx, y: cy + 4, r: H * 0.5 + 6, t0: T1 - 0.12, d: 0.42 }); const xe = tg.length ? Math.min(...tg.map(q => q[0])) - 10 : cx - 120; V.fx.push({ k: 'skw', id, x0: cx - 18 * dir, y: cy + 6, dir: -dir, t0: T1, d: Math.abs(cx - 18 * dir - xe) / SK_WAVE + 0.3 }); }
  else if (k === 'slam') { const xe = tg.length ? (dir > 0 ? Math.min(...tg.map(q => q[0])) - 12 : Math.max(...tg.map(q => q[0])) + 12) : cx - 120 * dir; V.fx.push({ k: 'skq', id, x0: cx - 22 * dir, gy: fq[1], xe, dir: -dir, t0: T1, d: Math.abs(cx - xe) / SK_QUAKE + 1.2 }); }
  if (sk.shake) V.fx.push({ k: 'shk', id, n: sk.shake, t0: T1, d: 0.1 });
}
// 박쥐 · 파동 · 회전 그리기 (fx()가 부른다)
function fmotDraw(g, f, t) {
  const sk = SKFX[f.id]; if (!sk) return;
  const P = SK_PAL[sk.pal], e = t - f.t0;
  if (e < 0) return;
  if (f.k === 'ubat') {   // 날갯짓하며 물결치듯 날아간다 (뭉툭 칸 7×4 · 날개 끝은 붉게)
    const q = Math.min(1, e / f.d), x = f.x0 + (f.x1 - f.x0) * q, y = f.y0 + (f.y1 - f.y0) * q + Math.sin(q * 9 + f.s) * 5 - Math.sin(q * Math.PI) * 10, up = Math.floor(e * 16 + f.s) % 2;
    if (q >= 1) return;
    const A = up ? ['a.....a', 'aw.k.wa', '.wkkkw.', '...k...'] : ['...k...', '.wkkkw.', 'aw...wa', 'a.....a'], C = { a: '#a8303e', w: '#3e1a2a', k: '#140a10' };
    A.forEach((row, j) => [...row].forEach((ch, i) => { if (ch !== '.') skQ(g, x + (i - 3) * 2, y + (j - 1.5) * 2, C[ch]); }));
    skQ(g, x + (f.x1 < f.x0 ? -2 : 2), y - (up ? 1 : 3), '#ff4a4a');   // 붉은 눈
    return;
  }
  if (f.k === 'unova') {   // 땅을 따라 퍼지는 고리 두 겹 + 떠오르는 알갱이
    const k = e / f.d;
    for (const [lag, c, w] of [[0, P[1], 1], [0.08, P[2], 0.7]]) {
      const kk = Math.max(0, (e - lag) / (f.d * 0.55)); if (kk <= 0 || kk >= 1.2) continue;
      const r = 16 + (f.r1 - 16) * Math.min(1, kk), al = (kk < 0.8 ? 1 : Math.max(0, 1 - (kk - 0.8) / 0.4)) * w, n = Math.max(20, Math.round(r * 1.2));
      for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2; skQ(g, f.x + Math.cos(a) * r, f.y + Math.sin(a) * r * 0.22, c, al); }
    }
    if (k < 0.8) for (let i = 0; i < 10; i++) { const a = i * 2.4, r = 6 + (f.r1 - 6) * Math.min(1, e / (f.d * 0.55)) * (0.4 + 0.6 * skH(i, 7)), yy = f.y - e * 40 * (0.5 + skH(i, 8)); skQ(g, f.x + Math.cos(a) * r, yy + Math.sin(a) * r * 0.22, P[i % 2 ? 0 : 1], 1 - k / 0.8); }
    return;
  }
  if (f.k === 'uspin') {   // 낫이 몸을 두 바퀴 돈다: 둥근 자취
    const k = e / f.d; if (k >= 1) return;
    const a0 = k * Math.PI * 4;
    for (let i = 0; i < 14; i++) { const a = a0 - i * 0.16, al = 1 - i / 14; skQ(g, f.x + Math.cos(a) * f.r, f.y + Math.sin(a) * f.r * 0.45, i < 3 ? P[0] : i < 8 ? P[1] : P[2], al * (k < 0.8 ? 1 : (1 - k) / 0.2)); }
  }
}
