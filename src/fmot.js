/* ───────── 몬스터 동작 (빌드 43): 공격 · 마법 · 스킬 ─────────
   PXU 그림이 있는 몬스터(언데드)는 사건마다 동작을 하고, 모험가 쪽 효과·숫자·소리·번쩍임은 맞는 때(동작의 맞히는 장 + 투사체가 나는 시간)에 낸다.
   갈래: 공격(atk) · 마법(mag, 마법 몬스터의 공격) · 스킬(skl — 광역기가 있으면 광역기, 없으면 상태이상을 거는 한 방·치명타).
   V.fmot['f' + uid] = { mk 동작 · cat 갈래 · t0 시작 · T 장마다 초 · hit 맞히는 장까지 초 · fl 투사체 초 · aoe { t, T1, x0, k } } */
const FMOT_CAST = Object.assign({ spush: 1, sjab: 1, spushup: 1, scharge: 1, sraise: 1, bshot: 1, bfull: 1, bdiag: 1, brapid: 1, braise: 1 }, PXU_CAST);   // 투사체를 쏘는 동작
const FMOT_AOE_V = { bats: 150, nova: 230, spin: 260, slam: 240, rats: 120, roots: 240, storm: 700, blizzard: 300, sand: 190, blades: 260, flood: 210, coil: 900, miasma: 420, rocks: 240, breath: 260, meteor: 110, pillar: 520, fang: 700, lash: 260, twister: 150, feathers: 300, zap: 600, chain: 300 };   // 광역기가 퍼지는 빠르기 (논리 픽셀/초)
const FMOT_NAME = { thunderdragon: '뇌전 숨결', stormking: '번개 사슬', skytitan: '회오리바람', skyemperor: '깃털 폭풍', worldserpent: '땅속 독니', corruptheart: '가시 덩굴 채찍', magmadragon: '화산탄 비', firelord: '불기둥', ogreking: '대지 가르기', chimera: '불길 숨결', anaconda: '휘감아 조이기', swampwitch: '독 늪', sewertroll: '하수 범람', blackhood: '그림자 칼날 비', greatworm: '모래 해일', icequeen: '눈보라', stormwyvern: '번개 폭풍', ratking: '쥐 떼', elder: '뿌리 솟기', giant: '땅 울림', dracula: '박쥐 떼', lichking: '죽음의 파동', reaper: '죽음의 회전', deathknight: '암흑 강타', banshee: '죽음의 비명', ghosttree: '원혼의 뿌리', seraphknight: '천벌' };   // 광역기 이름 (알림 · 3번째부터의 우두머리도 광역기를 쓴다)
// 효과 표: SKFX에 'u:id:갈래'로 넣어 스킬 효과 그리기(skh 맞히기 · skp 투사체 · skw 초승달 · skq 땅 금)를 빌린다
for (const id in PXU_ACT) for (const cat in PXU_ACT[id].fx || {}) {   // 갈래(atk·mag·skl) · 동작 이름(그 동작만, 빌드 44)
  const q = PXU_ACT[id].fx[cat];
  if (q) SKFX['u:' + id + ':' + cat] = Object.assign({ pal: 'shadow', hit: 'star' }, q, q.p ? { proj: q.p } : {});
}
SKFX['u:low:tear'] = { pal: 'blood', hit: 'slashes', after: 'petals' };   // 망토가 찢어질 때: 천 조각이 흩날린다 (빌드 44)
const fmotOK = f => !!(f && !f.giant && !f.adv && PXU[f.id]);
const fmotKey = (id, cat, mk) => 'u:' + id + ':' + (mk && SKFX['u:' + id + ':' + mk] ? mk : cat);
const fmotSk = (id, cat, mk) => SKFX[fmotKey(id, cat, mk)] || null;
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
  const cat = x.type === 'aoe' ? 'skl' : A.skl && !MONS[f.id].aoe && !f.aoe && (x.c || sta || x.ms) ? 'skl' : x.k === 'magic' && A.mag ? 'mag' : A.atk ? 'atk' : 'mag';   // 몬스터 스킬 한 방(ms, 빌드 63)도 스킬 갈래
  const mk = pxuPick(f.id, cat, m0 && m0.mk), T = pxuMotT(f.id, mk), hf = pxsMotHit(mk), sk = fmotSk(f.id, cat, mk);
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
// 몸이 나간 거리 (화면 픽셀, 파티 쪽 −) · 뛴 높이 (위 −)
const fmotDx = (f, mo, z) => (mo ? (pxuSprite(f.id, mo.mk, mo.f).dx || 0) * 2 * z : 0);
const fmotJy = (f, mo, z) => (mo ? Math.round((pxuSprite(f.id, mo.mk, mo.f).jy || 0) * 2 * z) : 0);
// 무기 자취·번쩍임 칸: 갈래 색으로 (적은 왼쪽을 본다)
function fmotFx(g, f, mo, x, y, z, dir) {
  const s = pxuSprite(f.id, mo.mk, mo.f), F = s.mfx;
  if (!F) return;
  const sk = fmotSk(f.id, mo.cat, mo.mk), P = sk ? SK_PAL[sk.pal] : MOT_PAL[0], pal = mo.c ? MOT_PAL[1] : [P[0], P[1], P[2]];
  g.save(); g.translate(x, y); g.scale(-dir * z, z);
  for (const L of [F.back, F.front]) for (const [X, Y, ci] of L) R(g, 2 * X - s.fo[0], 2 * Y - s.fo[1], 2, 2, pal[ci]);
  g.restore();
}
// 쏘는 장의 무기 끝 → 화면 자리
function fmotTip(f, m, q, z, dir) {
  const s = pxuSprite(f.id, m.mk, pxsMotHit(m.mk)), tp = s.tip || [s.fo[0] / 2, s.fo[1] / 2 - 8];
  return [q[0] - (2 * tp[0] - s.fo[0] + 1) * z * dir, q[1] + (2 * tp[1] - s.fo[1] + 1 + 2 * (s.jy || 0)) * z];
}
// 맞는 자리 효과 (모험가 쪽): 투사체 → 맞히기 · 남은 것
function fmotHitFx(e, x, t, fd, am, aq, at) {
  const f = e.foes.find(o => o.uid === x.s), m = f && V.fmot['f' + f.uid];
  if (!m) return;
  const dir = V.dir || 1, fq = at('f' + f.uid), cat = m.aoe && m.aoe.t === t ? 'skl' : m.cat, sk = fmotSk(f.id, cat, m.mk), id = fmotKey(f.id, cat, m.mk), T1 = t + fd;
  if (!sk) return;
  if (m.fl && fq) {
    const src = fmotTip(f, m, fq, zAt(fq[1]), dir);
    V.fx.push({ k: 'skp', id, style: sk.proj, x0: src[0], y0: src[1], x1: am[0], y1: am[1], t0: T1 - m.fl, d: m.fl, arc: m.mk === 'bdiag' ? 34 : sk.proj === 'snow' ? 16 : 0, dir: -dir, big: sk.big || 0 });
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
  if (FMOT_NAME[f.id] && !x.ms) callout(fq[0], fq[1] - H - 6, FMOT_NAME[f.id] + '!', 'boss');   // 몬스터 스킬(빌드 63)은 이름 띠를 따로 띄운다
  let dmin = null;   // 땅속 독니 · 가시 덩굴 채찍 · 깃털 폭풍: 가장 먼저 맞는 때까지 (흔들림)
  if (k === 'bats') tg.forEach((q, i) => { for (let j = 0; j < 3; j++) V.fx.push({ k: 'ubat', id, x0: cx - 6 * dir + (j - 1) * 6, y0: cy - 10 + j * 6, x1: q[0] + (j - 1) * 4, y1: q[1] - 14 * zAt(q[1]) + (j - 1) * 5, t0: T1 + j * 0.06, d: Math.abs(q[0] - cx) / FMOT_AOE_V.bats, s: i * 3 + j }); });
  else if (k === 'rats') tg.forEach((q, i) => { for (let j = 0; j < 3; j++) V.fx.push({ k: 'urat', id, x0: cx - 8 * dir + (j - 1) * 5, y0: fq[1] - 1 - j * 3, x1: q[0] + (j - 1) * 6, y1: q[1] - 1 - j * 2, t0: T1 + j * 0.07, d: Math.abs(q[0] - cx) / FMOT_AOE_V.rats, s: i * 3 + j }); });
  else if (k === 'nova') V.fx.push({ k: 'unova', id, x: cx, y: fq[1] - 2, t0: T1, d: 0.9, r1: Math.max(60, ...tg.map(q => Math.abs(q[0] - cx) + 16)) });
  else if (k === 'spin') { V.fx.push({ k: 'uspin', id, x: cx, y: cy + 4, r: H * 0.5 + 6, t0: T1 - 0.12, d: 0.42 }); const xe = tg.length ? Math.min(...tg.map(q => q[0])) - 10 : cx - 120; V.fx.push({ k: 'skw', id, x0: cx - 18 * dir, y: cy + 6, dir: -dir, t0: T1, d: Math.abs(cx - 18 * dir - xe) / SK_WAVE + 0.3 }); }
  else if (k === 'storm') V.fx.push({ k: 'ustorm', id, t0: T1 - 0.35, d: 1.3, tg: tg.map(q => [q[0], q[1] - 100]) });
  else if (k === 'sand') { const xe = tg.length ? Math.min(...tg.map(q => q[0])) - 24 : cx - 160; V.fx.push({ k: 'usand', id, x0: cx - 20 * dir, x1: xe, gy: fq[1], t0: T1, d: Math.abs(cx - 20 * dir - xe) / FMOT_AOE_V.sand + 0.5 }); }   // 모래 해일 (빌드 50): 몸을 내리꽂으면 모래 물결이 땅을 따라 파티 쪽으로 밀려온다
  else if (k === 'coil') tg.forEach((q, i) => { const zq = zAt(q[1]), dt = Math.abs(q[0] - cx) / FMOT_AOE_V.coil; V.fx.push({ k: 'ucoil', id, x: q[0], y: q[1] - 8 * zq, r: 8 * zq, t0: T1 + dt - 0.28, d: 1.0, s: i }); })   // 휘감아 조이기 (빌드 53): 사람마다 뱀 몸이 고리로 감겨 조였다가 풀린다
  else if (k === 'miasma') { const xs = tg.map(q => q[0]), gy = tg.length ? tg.reduce((a, q) => a + q[1], 0) / tg.length : fq[1]; V.fx.push({ k: 'umiasma', id, x0: (xs.length ? Math.min(...xs) : cx - 120) - 18, x1: (xs.length ? Math.max(...xs) : cx - 60) + 18, gy: gy + 1, t0: T1 - 0.25, d: 1.7, tg }); }   // 독 늪 (빌드 53): 파티 발밑에 독 늪이 번지고 거품과 해골 연기가 솟는다
  else if (k === 'flood') { const xe = tg.length ? Math.min(...tg.map(q => q[0])) - 28 : cx - 160; V.fx.push({ k: 'uflood', id, x0: cx - 16 * dir, x1: xe, gy: fq[1], t0: T1, d: Math.abs(cx - 16 * dir - xe) / FMOT_AOE_V.flood + 0.6 }); }   // 하수 범람 (빌드 52): 땅을 내리찍으면 검푸른 폐수가 바닥을 따라 파티 쪽으로 밀려오고 거품이 터진다
  else if (k === 'blades') tg.forEach((q, i) => { for (let j = 0; j < 3; j++) { const dxs = (j - 1) * 7; V.fx.push({ k: 'ublade', id, x0: cx - 4 * dir + (j - 1) * 3, y0: cy - 16 - j * 3, x1: q[0] + dxs, y1: q[1] - 6 * zAt(q[1]), t0: T1 + j * 0.05 + i * 0.03, d: 0.3 + Math.abs(q[0] - cx) / FMOT_AOE_V.blades, s: i * 3 + j }); } });   // 그림자 칼날 비 (빌드 51): 치켜든 단검에서 그림자 단검 셋씩 솟아 포물선으로 파티에게 꽂힌다
  else if (k === 'blizzard') { const xe = tg.length ? Math.min(...tg.map(q => q[0])) - 40 : cx - 160; V.fx.push({ k: 'ublizz', id, x0: cx - 10 * dir, x1: xe, y: fq[1], t0: T1 - 0.15, d: 1.5, tg }); }   // 눈보라 (빌드 49): 여왕 앞에서 파티 쪽으로 눈이 휘몰아친다
  else if (k === 'rocks') {   // 대지 가르기 (빌드 55): 몽둥이로 땅을 내리찍으면 땅 금이 파티 쪽으로 달리고, 금이 닿는 사람마다 발밑에서 바위 가시가 솟았다 부서진다
    const xe = tg.length ? (dir > 0 ? Math.min(...tg.map(q => q[0])) - 12 : Math.max(...tg.map(q => q[0])) + 12) : cx - 120 * dir;
    V.fx.push({ k: 'skq', id, x0: cx - 22 * dir, gy: fq[1], xe, dir: -dir, t0: T1, d: Math.abs(cx - xe) / SK_QUAKE + 1.2 });
    tg.forEach((q, i) => V.fx.push({ k: 'urock', id, x: q[0], y: q[1], z: zAt(q[1]), t0: T1 + Math.abs(q[0] - cx) / FMOT_AOE_V.rocks - 0.05, d: 0.95, s: i }));
  }
  else if (k === 'breath') {   // 불길 숨결 (빌드 55): 숨을 모았다가 벌린 입에서 불길이 부채꼴로 뿜어져 파티를 휩쓴다
    const src = fmotTip(f, m, fq, z, dir), xe = tg.length ? (dir > 0 ? Math.min(...tg.map(q => q[0])) - 18 : Math.max(...tg.map(q => q[0])) + 18) : cx - 150 * dir;
    V.fx.push({ k: 'ufire', id, x0: src[0], y0: src[1], x1: xe, gy: fq[1], t0: T1 - 0.04, d: 1.05 });
  }
  else if (k === 'meteor') {   // 화산탄 비 (빌드 57): 하늘로 포효하면 입에서 화산탄이 솟아 사람마다 셋씩 포물선으로 떨어진다 — 첫째가 맞는 때(거리 ÷ 빠르기)에, 둘은 옆에 뒤따라
    const src = fmotTip(f, m, fq, z, dir);
    tg.forEach((q, i) => { const zq = zAt(q[1]), dt = Math.abs(q[0] - cx) / FMOT_AOE_V.meteor;
      for (let j = 0; j < 3; j++) V.fx.push({ k: 'umeteor', id, x0: src[0] + (j - 1) * 2, y0: src[1], x1: q[0] + [0, -10, 9][j] * zq, y1: q[1] - 1 + [0, 2, 1][j], t0: T1 + j * 0.11, fl: dt + j * 0.05, d: dt + j * 0.05 + 0.95, h: 84 + j * 12 + i * 5, s: i * 3 + j, z: zq }); });
  }
  else if (k === 'pillar') tg.forEach((q, i) => { const zq = zAt(q[1]), dt = Math.abs(q[0] - cx) / FMOT_AOE_V.pillar; V.fx.push({ k: 'upillar', id, x: q[0], y: q[1], z: zq, t0: T1 + dt - 0.32, pre: 0.32, d: 1.3, s: i }); });   // 불기둥 (빌드 57): 발밑이 0.32초 달아오르다 맞는 때에 불기둥이 솟는다 (가까운 사람부터)
  else if (k === 'fang') {   // 땅속 독니 (빌드 58): 뱀이 고개를 젖혔다가 땅을 내리치면 파티 발밑이 0.35초 들썩이고, 맞는 때(T1)에 땅속에서 커다란 아가리가 솟아 파티를 통째로 문다 — 빠르기가 커서 모두 거의 한꺼번에 맞는다
    const xs = tg.map(q => q[0]), zq = tg.length ? zAt(tg.reduce((a, q) => a + q[1], 0) / tg.length) : z;
    const L = (xs.length ? Math.min(...xs) : cx - 120) - 22 * zq, R = (xs.length ? Math.max(...xs) : cx - 60) + 22 * zq, gy = (tg.length ? Math.max(...tg.map(q => q[1])) : fq[1]) + 1;
    dmin = xs.length ? Math.min(...xs.map(x => Math.abs(x - cx))) / FMOT_AOE_V.fang : 0;
    V.fx.push({ k: 'ufang', id, L, R, gy, z: zq, t0: T1 - 0.35, pre: 0.35, d: 1.45 });
  }
  else if (k === 'lash') {   // 가시 덩굴 채찍 (빌드 58): 심장이 부풀었다 뛰면 가시 덩굴이 사람마다 활꼴로 뻗어 맞는 때(거리 ÷ 빠르기)에 내리치고 거둬들인다
    const src = fmotTip(f, m, fq, z, dir);
    tg.forEach((q, i) => { const zq = zAt(q[1]), dt = Math.abs(q[0] - cx) / FMOT_AOE_V.lash; dmin = Math.min(dmin == null ? 9 : dmin, dt); V.fx.push({ k: 'ulash', id, x0: src[0], y0: src[1], x1: q[0], y1: q[1] - 12 * zq, t0: T1, fl: Math.max(0.05, dt), d: dt + 0.75, h: 34 + i * 9, z: zq, s: i }); });
  }
  else if (k === 'twister') {   // 회오리바람 (빌드 59): 거인이 땅을 내리치면 거인 앞 끝에서 회오리가 일어 파티 쪽으로 땅을 따라 지나간다 — 사람마다 맞는 때 = T1 + 거리 ÷ 빠르기(그때 회오리가 그 사람 자리에 온다), 거인 몸 안을 지나는 동안(es)은 그리지 않는다
    const xs = tg.map(q => q[0]), zq = tg.length ? zAt(tg.reduce((a, q) => a + q[1], 0) / tg.length) : z;
    const x1 = (xs.length ? Math.min(...xs) : cx - 140) - 30 * zq, y1 = tg.length ? tg.reduce((a, q) => a + q[1], 0) / tg.length : fq[1];
    const lid = pxuSkin(f) || f.id, P = PXU[lid], fr = P ? (Math.max(...pxuRows(P).map(r => r.replace(/\.+$/, '').length)) - P.ax) * 2 * z : 20 * z;   // 닻에서 그림 앞 끝까지
    const v = FMOT_AOE_V.twister, d1 = xs.length ? Math.min(...xs.map(x => Math.abs(x - cx))) : 60, es = Math.max(0, Math.min(fr / v, d1 / v - 0.12));   // 앞 끝에서 일어나되 맨 앞 사람에게 닿기 0.12초 전에는 보이게
    V.fx.push({ k: 'utwist', id, x0: cx, y0: fq[1], x1, y1, v, t0: T1, z: zq, es, d: Math.abs(cx - x1) / v + 0.45, s: 0 });
  }
  else if (k === 'feathers') {   // 깃털 폭풍 (빌드 59): 지팡이에 빛을 모았다가 쏘면 지팡이 끝에서 사람마다 금빛 · 흰 깃털 한 무리가 소용돌이치며 날아가 맞는 때(거리 ÷ 빠르기)에 둘레를 휘돈다
    const src = fmotTip(f, m, fq, z, dir);
    tg.forEach((q, i) => { const zq = zAt(q[1]), dt = Math.abs(q[0] - cx) / FMOT_AOE_V.feathers; dmin = Math.min(dmin == null ? 9 : dmin, dt); V.fx.push({ k: 'ufeath', id, x0: src[0], y0: src[1], x1: q[0], y1: q[1] - 14 * zq, t0: T1, fl: Math.max(0.06, dt), d: dt + 1.2, z: zq, s: i }); });
  }
  else if (k === 'zap') {   // 뇌전 숨결 (빌드 60): 웅크려 숨을 모았다가 벌린 입에서 꺾인 번개가 부채꼴로 파티 쪽으로 뻗는다 — 앞머리는 보스 자리에서 e × 빠르기만큼 (맞는 때 셈과 같다) · 지나간 사람마다 줄기에서 갈래가 꽂힌다 · 줄기는 파티 뒤로 한참 지나간다
    const src = fmotTip(f, m, fq, z, dir), v = FMOT_AOE_V.zap, xe = tg.length ? (dir > 0 ? Math.min(...tg.map(q => q[0])) - 56 * z : Math.max(...tg.map(q => q[0])) + 56 * z) : cx - 150 * dir;
    const ym = tg.length ? tg.reduce((a, q) => a + q[1] - 14 * zAt(q[1]), 0) / tg.length : fq[1] - 14;
    tg.forEach(q => { dmin = Math.min(dmin == null ? 9 : dmin, Math.abs(q[0] - cx) / v); });
    V.fx.push({ k: 'uzap', id, x0: src[0], y0: src[1], cx, xe, ym, v, tg: tg.map(q => [q[0], q[1] - 14 * zAt(q[1]), zAt(q[1])]), t0: T1, z, d: Math.abs(cx - xe) / v + 0.5, s: f.uid % 7 });
  }
  else if (k === 'chain') {   // 번개 사슬 (빌드 60): 지팡이 끝에서 가장 가까운 사람에게 곧게 내리꽂히고, 거기서 머리 위로 활꼴을 그리며 다음 사람 · 그다음 사람으로 차례로 건너뛴다 (마디마다 맞는 때 = 거리 ÷ 빠르기)
    const src = fmotTip(f, m, fq, z, dir), v = FMOT_AOE_V.chain, nodes = tg.map(q => [q[0], q[1] - 14 * zAt(q[1]), Math.abs(q[0] - cx) / v, zAt(q[1])]).sort((a, b) => a[2] - b[2]);
    if (nodes.length) dmin = nodes[0][2];
    V.fx.push({ k: 'uchain', id, x0: src[0], y0: src[1], nodes, t0: T1, z, d: (nodes.length ? nodes[nodes.length - 1][2] : 0.3) + 0.6, s: f.uid % 7 });
  }
  else if (k === 'slam' || k === 'roots') { const xe = tg.length ? (dir > 0 ? Math.min(...tg.map(q => q[0])) - 12 : Math.max(...tg.map(q => q[0])) + 12) : cx - 120 * dir; V.fx.push({ k: 'skq', id, x0: cx - 22 * dir, gy: fq[1], xe, dir: -dir, t0: T1, d: Math.abs(cx - xe) / SK_QUAKE + 1.2 }); }
  if (sk.shake) V.fx.push({ k: 'shk', id, n: sk.shake, t0: T1 + (k === 'meteor' ? 0.55 : dmin != null ? dmin : 0), d: 0.1 });   // 화산탄 비는 떨어질 때 · 땅속 독니 · 가시 덩굴 채찍 · 깃털 폭풍 · 뇌전 숨결 · 번개 사슬은 처음 맞을 때 흔든다 (회오리바람은 내리칠 때)
}
// 꺾인 번개 한 줄 (빌드 60 뇌전 숨결 · 번개 사슬): (x0, y0) → (x1, y1) · 마디마다 옆으로 꺾인다 (sd가 바뀌면 다른 꼴 = 깜빡임) · 흰 속 · 노란 테 · 하늘빛 빛무리 (thin이면 옅은 노랑 속만)
function zapBolt(g, x0, y0, x1, y1, sd, jag, al, thin) {
  const L = Math.hypot(x1 - x0, y1 - y0); if (L < 1) return;
  const n = Math.max(2, Math.round(L / 7)), nx = -(y1 - y0) / L, ny = (x1 - x0) / L, pts = [];
  for (let i = 0; i <= n; i++) { const u = i / n, o = i === 0 || i === n ? 0 : (skH(i, sd) - 0.5) * 2 * jag; pts.push([x0 + (x1 - x0) * u + nx * o, y0 + (y1 - y0) * u + ny * o]); }
  for (let i = 0; i < n; i++) {
    const [ax, ay] = pts[i], [bx, by] = pts[i + 1], l = Math.hypot(bx - ax, by - ay), m = Math.max(1, Math.ceil(l / 1.6));
    for (let j = 0; j <= m; j++) {
      const x = ax + (bx - ax) * j / m, y = ay + (by - ay) * j / m;
      if (!thin) { skQ(g, x + nx * 2, y + ny * 2, '#8ae8ff', al * 0.55); skQ(g, x - nx * 2, y - ny * 2, '#ffd84a', al * 0.8); }
      skQ(g, x, y, thin ? '#fff6b0' : '#ffffff', al);
    }
  }
}
// 번개가 맞는 자리 (빌드 60): 짧은 번개 가시가 사방으로 튀고 사그라진다 (q 0 → 1)
function zapBurst(g, x, y, q, s, z) {
  for (let i = 0; i < 7; i++) {
    const a = i / 7 * Math.PI * 2 + s * 1.7, r1 = (3 + 10 * q) * z, r2 = r1 + (4 + 3 * skH(i, s + 90)) * z * (1 - q);
    for (let k = 0; k <= 3; k++) { const r = r1 + (r2 - r1) * k / 3, w = (k % 2 ? 1.4 : -1.4) * z; skQ(g, x + Math.cos(a) * r - Math.sin(a) * w, y + Math.sin(a) * r * 0.7 + Math.cos(a) * w * 0.7, k < 2 ? '#fff6b0' : '#ffd84a', 1 - q); }
  }
  if (q < 0.4) { skQ(g, x, y, '#ffffff'); skQ(g, x + 2, y, '#fff6b0', 0.9); skQ(g, x - 2, y, '#fff6b0', 0.9); skQ(g, x, y - 2, '#8ae8ff', 0.8); }
}
// 박쥐 · 파동 · 회전 그리기 (fx()가 부른다)
function fmotDraw(g, f, t) {
  const sk = SKFX[f.id]; if (!sk) return;
  const P = SK_PAL[sk.pal], e = t - f.t0;
  if (e < 0) return;
  if (f.k === 'uzap') {   // 뇌전 숨결 (빌드 60): 입가에 튀는 불꽃 · 입에서 부채꼴 번개 다섯 갈래 + 굵은 줄기 (앞머리까지) · 앞머리가 지나간 사람마다 줄기에서 갈래가 꽂히고 맞는 자리 불꽃 · 끝 0.3초에 사그라진다
    if (e > f.d) return;
    const z = f.z || 1, sg = Math.sign(f.cx - f.xe) || 1, tr = Math.abs(f.cx - f.xe) / f.v, al = e > f.d - 0.3 ? Math.max(0, (f.d - e) / 0.3) : 1, sd = Math.floor(e / 0.05) + f.s * 31;
    for (let i = 0; i < 5; i++) skQ(g, f.x0 + (skH(i, sd + 7) - 0.5) * 8 * z, f.y0 + (skH(i, sd + 8) - 0.5) * 6 * z, i % 2 ? '#fff6b0' : '#8ae8ff', al * 0.9);
    const xf = f.cx - sg * Math.min(e, tr) * f.v;   // 앞머리 (보스 자리에서 잰 거리 = 맞는 때와 같은 셈)
    if ((f.x0 - xf) * sg <= 0) return;   // 아직 입 앞을 못 나갔다
    const span = Math.max(1, Math.abs(f.xe - f.x0)), yAt = x => f.y0 + (f.ym - f.y0) * Math.min(1, Math.abs(x - f.x0) / span), reach = Math.abs(xf - f.x0);
    for (let j = 0; j < 5; j++) { const sp = (j - 2) * 0.16, yy = yAt(xf) + Math.tan(sp) * reach + (j === 4 ? 6 * z : 0); zapBolt(g, f.x0, f.y0, xf + sg * Math.abs(j - 2) * 4 * z, yy, sd + j * 19, (3 + Math.abs(j - 2)) * z, al * (j === 2 ? 1 : 0.8), j !== 2); }
    zapBolt(g, f.x0, f.y0 + 1, xf, yAt(xf) + 1, sd + 101, 3 * z, al, false);
    f.tg.forEach(([qx, qy, zq], i) => { const th = Math.abs(qx - f.cx) / f.v; if (e < th) return; const ee = e - th, bx = qx + sg * 9 * zq; zapBolt(g, bx, yAt(bx), qx, qy, sd + i * 13, 2.5 * zq, al, false); if (ee < 0.35) zapBurst(g, qx, qy, ee / 0.35, i + f.s, zq); });
    if (e < tr) { const q = (e * 9) % 1; skQ(g, xf, yAt(xf), '#ffffff'); skQ(g, xf - sg * 2, yAt(xf) - 2, '#fff6b0', 1 - q); skQ(g, xf - sg * 2, yAt(xf) + 2, '#8ae8ff', 1 - q); }
    return;
  }
  if (f.k === 'uchain') {   // 번개 사슬 (빌드 60): 마디마다 맞는 때 0.08초 전에 앞 마디에서 뻗어 닿고 (첫 마디는 곧게 · 다음부터는 머리 위 활꼴 네 토막) 0.4초 깜빡이다 0.2초에 사그라진다 · 맞는 자리 불꽃 · 처음에 지팡이 끝 불꽃
    if (e > f.d) return;
    const sd = Math.floor(e / 0.05) + f.s * 37;
    let px = f.x0, py = f.y0;
    f.nodes.forEach(([x, y, th, zq], i) => {
      const pre = Math.min(0.08, Math.max(0.02, th)), ee = e - (th - pre), ox = px, oy = py;
      px = x; py = y;
      if (ee < 0) return;
      const grow = Math.min(1, ee / pre), al = e > th + 0.4 ? Math.max(0, 1 - (e - th - 0.4) / 0.2) : 1;
      if (al <= 0) return;
      if (i === 0) zapBolt(g, ox, oy, ox + (x - ox) * grow, oy + (y - oy) * grow, sd, 4 * zq, al, false);
      else { const h = (12 + Math.abs(x - ox) * 0.25) * zq, Pt = u => [ox + (x - ox) * u, oy + (y - oy) * u - Math.sin(u * Math.PI) * h], n = 4, upto = grow * n;
        for (let j = 0; j < n && j < upto; j++) { const [ax, ay] = Pt(j / n), [bx, by] = Pt(Math.min(upto, j + 1) / n); zapBolt(g, ax, ay, bx, by, sd + i * 11 + j * 3, 2.5 * zq, al, false); } }
      if (e >= th && e < th + 0.4) zapBurst(g, x, y, (e - th) / 0.4, i + f.s, zq);
    });
    if (e < 0.12) { const z = f.z || 1; for (let i = 0; i < 4; i++) skQ(g, f.x0 + (skH(i, sd + 3) - 0.5) * 6 * z, f.y0 + (skH(i, sd + 4) - 0.5) * 6 * z, i % 2 ? '#fff6b0' : '#8ae8ff'); }
    return;
  }
  if (f.k === 'ubat') {   // 날갯짓하며 물결치듯 날아간다 (뭉툭 칸 7×4 · 날개 끝은 붉게)
    const q = Math.min(1, e / f.d), x = f.x0 + (f.x1 - f.x0) * q, y = f.y0 + (f.y1 - f.y0) * q + Math.sin(q * 9 + f.s) * 5 - Math.sin(q * Math.PI) * 10, up = Math.floor(e * 16 + f.s) % 2;
    if (q >= 1) return;
    const A = up ? ['a.....a', 'aw.k.wa', '.wkkkw.', '...k...'] : ['...k...', '.wkkkw.', 'aw...wa', 'a.....a'], C = { a: '#a8303e', w: '#3e1a2a', k: '#140a10' };
    A.forEach((row, j) => [...row].forEach((ch, i) => { if (ch !== '.') skQ(g, x + (i - 3) * 2, y + (j - 1.5) * 2, C[ch]); }));
    skQ(g, x + (f.x1 < f.x0 ? -2 : 2), y - (up ? 1 : 3), '#ff4a4a');   // 붉은 눈
    return;
  }
  if (f.k === 'urat') {   // 쥐 떼: 땅을 따라 종종걸음으로 달려간다 (뭉툭 칸 6×3)
    const q = Math.min(1, e / f.d), x = f.x0 + (f.x1 - f.x0) * q, y = f.y0 + (f.y1 - f.y0) * q - Math.abs(Math.sin(e * 26 + f.s)) * 2, st = Math.floor(e * 20 + f.s) % 2, L = f.x1 < f.x0;
    if (q >= 1) return;
    const A = st ? ['..cC...', '.cCCCe.', 'sCCCCCC', '..c..c.'] : ['..cC...', '.cCCCe.', 'sCCCCCC', '.c..c..'], C = { c: '#6a5848', C: '#9a8470', e: '#ff4a3a', s: '#d89a90' };
    const at = (i, j) => [x + (L ? 6 - i : i - 3) * 2, y + (j - 3) * 2];
    A.forEach((row, j) => [...row].forEach((ch, i) => { if (ch === '.') return; for (const [ox, oy] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) { const ii = i + ox, jj = j + oy; if (!(A[jj] && A[jj][ii] && A[jj][ii] !== '.')) { const [qx, qy] = at(ii, jj); skQ(g, qx, qy, '#1a1010'); } } }));
    A.forEach((row, j) => [...row].forEach((ch, i) => { if (ch !== '.') { const [qx, qy] = at(i, j); skQ(g, qx, qy, C[ch]); } }));
    return;
  }
  if (f.k === 'ucoil') {   // 뱀 몸 고리: 크게 감겼다가(0~0.28초) 조이고(맥박) 풀리며 사라진다 · 앞 반쪽은 굵고 밝게, 뒤 반쪽은 가늘고 어둡게 · 등 얼룩과 연노랑 배
    if (e > f.d) return;
    const k1 = Math.min(1, e / 0.28), sq = e > 0.28 && e < 0.75 ? 0.9 + 0.1 * Math.cos((e - 0.28) * 26) : 1, r = f.r * (1.7 - 0.7 * k1) * sq, al = e > f.d - 0.25 ? (f.d - e) / 0.25 : 1, rot = e * 3 + f.s;
    for (let j = 0; j < 28; j++) {
      const a = j / 28 * Math.PI * 2 + rot, ex = Math.cos(a) * r * 1.15, ey = Math.sin(a) * r * 0.42, front = Math.sin(a) > 0;
      const c = front ? (j % 5 === 0 ? '#2e4a1a' : j % 2 ? '#7aa048' : '#5e8a3c') : '#2e4a1a';
      skQ(g, f.x + ex, f.y + ey, c, al * (front ? 1 : 0.55)); if (front) skQ(g, f.x + ex, f.y + ey + 2, j % 3 ? '#e8e098' : '#b0a868', al);
    }
    if (e > 0.28) for (let i = 0; i < 4; i++) { const q = ((e - 0.28) * 1.8 + skH(f.s * 4 + i, 71)) % 1; skQ(g, f.x + (skH(f.s * 4 + i, 72) - 0.5) * r * 2, f.y - r * 0.6 - q * 12, i % 2 ? '#8af060' : '#c8f0a0', al * (1 - q)); }
    return;
  }
  if (f.k === 'urock') {   // 바위 가시: 발밑에서 뾰족한 바위 셋이 솟고(0.14초) 버티다가 부서져 조각이 튀고 흙먼지가 오른다
    if (e > f.d) return;
    const up = Math.min(1, e / 0.14), br = e > 0.45 ? (e - 0.45) / (f.d - 0.45) : 0, al = 1 - br * br, C = ['#e2cca0', '#b8986a', '#7e6444', '#54402a'];
    [[-8, 10, 3], [0, 17, 4], [7, 12, 3]].forEach(([ox, h0, w]) => {
      const h = h0 * f.z * up * (1 - br * 0.7), bx = f.x + ox * f.z;
      for (let yy = 0; yy < h; yy += 2) { const ww = Math.max(0, Math.round(w * (1 - yy / Math.max(1, h)) * f.z)); for (let xx = -ww; xx <= ww; xx += 2) skQ(g, bx + xx, f.y - yy, yy + 2 >= h ? C[0] : xx < 0 ? C[1] : xx > 0 ? C[3] : C[2], al); }
    });
    if (br > 0) for (let i = 0; i < 9; i++) { const a = skH(f.s * 9 + i, 91) * Math.PI, r = 3 + br * 18; skQ(g, f.x + Math.cos(a) * r * (i % 2 ? 1 : -1), f.y - 8 - Math.sin(a) * r * 0.7 + br * br * 16, C[1 + i % 3], 1 - br); }
    for (let i = 0; i < 7; i++) { const q = (e * 1.5 + skH(f.s * 7 + i, 92)) % 1; skQ(g, f.x + (skH(f.s * 7 + i, 93) - 0.5) * 26, f.y - 1 - q * 12, '#c8b48c', 0.4 * (1 - q) * al); }
    return;
  }
  if (f.k === 'umeteor') {   // 화산탄: 검붉은 바위에 빛나는 테 · 불꼬리와 연기 꼬리 → 떨어지면 불꽃 · 튀는 용암 · 식어 가는 용암 웅덩이 · 연기
    const q = e / f.fl;
    if (q < 1) {
      const x = f.x0 + (f.x1 - f.x0) * q, y = f.y0 + (f.y1 - f.y0) * q - 4 * f.h * q * (1 - q);
      const vx = f.x1 - f.x0, vy = (f.y1 - f.y0) - 4 * f.h * (1 - 2 * q), L = Math.hypot(vx, vy) || 1, ux = vx / L, uy = vy / L;
      for (let i = 9; i >= 1; i--) {   // 불꼬리 → 연기 꼬리 (두 줄 굵기)
        const tx = x - ux * i * 2.6 + Math.sin(e * 30 + i + f.s) * 0.9, ty = y - uy * i * 2.6, c = i < 3 ? '#ffd040' : i < 5 ? '#ff8a2a' : i < 7 ? '#c8401a' : '#5a3a36', a = (1 - i / 10) * 0.95;
        skQ(g, tx, ty, c, a); if (i < 7) skQ(g, tx - uy * 2, ty + ux * 2, c, a * 0.8);
      }
      for (const [ox, oy, c] of [[-2, -2, '#ff8a2a'], [0, -2, '#ffb040'], [2, -2, '#e0502a'], [-2, 0, '#ffb040'], [0, 0, '#fff0a0'], [2, 0, '#ff8a2a'], [-2, 2, '#e0502a'], [0, 2, '#ff8a2a'], [2, 2, '#a8301a']]) skQ(g, x + ox, y + oy, c);   // 화산탄: 흰 노랑 속 · 주황 · 빨강 테
      return;
    }
    const k2 = e - f.fl, z = f.z || 1, d2 = f.d - f.fl; if (k2 > d2) return;
    const al = k2 > d2 - 0.3 ? (d2 - k2) / 0.3 : 1;
    for (let i = 0; i < 9; i++) {   // 용암 웅덩이: 노랑 → 주황 → 빨강 → 검붉음
      const u = (i / 8 - 0.5) * 2, px = f.x1 + u * 6 * z, c = k2 < 0.25 ? '#ffe070' : k2 < 0.5 ? '#ff8a2a' : k2 < 0.72 ? '#c8401a' : '#4a2a24';
      skQ(g, px, f.y1 + Math.abs(u) * 0.6, c, al * 0.95); if (Math.abs(u) < 0.6) skQ(g, px, f.y1 - 1.4, c, al * 0.7);
    }
    if (k2 < 0.3) [-1, 0, 1].forEach(j => {   // 불꽃
      const hh = (j ? 9 : 14) * z * Math.sin(Math.min(1, k2 / 0.3) * Math.PI);
      for (let yy = 0; yy < hh; yy += 2) skQ(g, f.x1 + j * 4 * z + Math.sin(yy * 0.4 + j) * 0.8, f.y1 - 2 - yy, yy < hh * 0.35 ? '#ffe070' : yy < hh * 0.7 ? '#ff8a2a' : '#e0402a');
    });
    if (k2 < 0.55) for (let i = 0; i < 8; i++) {   // 튀는 용암 방울
      const a = Math.PI * (0.12 + 0.76 * skH(f.s * 8 + i, 71)), sp = (34 + 30 * skH(f.s * 8 + i, 72)) * z;
      skQ(g, f.x1 + Math.cos(a) * sp * k2 * (i % 2 ? 1 : -1), f.y1 - 3 - Math.sin(a) * sp * k2 + 170 * k2 * k2, i % 3 ? '#ff8a2a' : '#ffe070', 1 - k2 / 0.55);
    }
    if (k2 > 0.15) for (let i = 0; i < 3; i++) { const p = Math.min(1, (k2 - 0.15 - i * 0.08) / 0.7); if (p > 0) skQ(g, f.x1 + (i - 1) * 4 + Math.sin(p * 5 + i) * 2, f.y1 - 6 - p * 18, '#6a5a58', 0.55 * (1 - p) * al); }   // 연기
    return;
  }
  if (f.k === 'upillar') {   // 불기둥: 발밑 달아오름(금 · 빛 고리) → 솟아 일렁이는 기둥(흰 노랑 가운데 · 주황 · 빨강 가장자리 · 꼭대기 불꽃 혀) → 위로 흩어지며 연기 · 불씨 · 그을린 자리
    const z = f.z || 1, Hm = 56 * z;
    if (e < f.pre) {
      const k = e / f.pre, rx = (4 + 6 * k) * z, n = 14;
      for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2; skQ(g, f.x + Math.cos(a) * rx, f.y + Math.sin(a) * rx * 0.3, i % 2 ? '#ff8a2a' : '#ffd040', 0.35 + 0.6 * k); }
      for (let i = 0; i < 5; i++) { const a = i / 5 * Math.PI * 2 + 0.4, r = rx * 0.8 * k; skQ(g, f.x + Math.cos(a) * r, f.y + Math.sin(a) * r * 0.3, '#ffe070', k); }
      return;
    }
    const ee = e - f.pre, rise = Math.min(1, ee / 0.08), out = ee > 0.5 ? Math.min(1, (ee - 0.5) / 0.4) : 0, al = 1 - out;
    if (out < 1) {
      const top = f.y - Hm * rise - out * 10, bot = f.y - out * Hm * 0.7;
      for (let yy = bot; yy > top; yy -= 2) {
        const u = (f.y - yy) / Hm, w = Math.max(1.5, (6.4 - 2.6 * u) * z + Math.sin(ee * 38 + yy * 0.45 + f.s) * 0.9);
        for (let dx = -w; dx <= w; dx += 2) { const a = Math.abs(dx) / w; skQ(g, f.x + dx, yy, a < 0.34 ? '#fff6c0' : a < 0.64 ? '#ffd040' : a < 0.9 ? '#ff8a2a' : '#e0402a', al); }
      }
      for (let i = 0; i < 3; i++) { const tx = f.x + (i - 1) * 3 * z, th = (5 + 4 * skH(i + f.s * 3 + Math.floor(ee * 14), 81)) * z; for (let yy = 0; yy < th; yy += 2) skQ(g, tx + Math.sin(ee * 20 + i) * 1.2, top - yy, yy < th * 0.5 ? '#ff8a2a' : '#e0402a', al * (1 - yy / th * 0.5)); }   // 꼭대기 불꽃 혀
    }
    for (let i = 0; i < 10; i++) { const p = (ee * 1.1 + skH(f.s * 10 + i, 82)) % 1; skQ(g, f.x + (skH(f.s * 10 + i, 83) - 0.5) * 22 * z + Math.sin(p * 6 + i) * 2, f.y - 4 - p * Hm * 1.1, i % 2 ? '#ffd040' : '#ff8a2a', (1 - p) * (ee < 1.0 ? 1 : 0)); }   // 불씨
    if (out > 0) for (let i = 0; i < 4; i++) { const p = out; skQ(g, f.x + (i - 1.5) * 4, f.y - Hm * 0.6 - p * 16 - i * 3, '#5a3a36', 0.5 * (1 - p)); }   // 연기
    const sc = Math.min(1, ee / 0.1), sal = ee > f.d - f.pre - 0.3 ? Math.max(0, (f.d - f.pre - ee) / 0.3) : 1;   // 그을린 자리
    for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; skQ(g, f.x + Math.cos(a) * 8 * z * sc, f.y + Math.sin(a) * 2.4 * z * sc, i % 3 ? '#3a1a14' : '#c8401a', 0.7 * sal); }
    return;
  }
  if (f.k === 'utwist') {   // 회오리바람 (빌드 59): 위로 갈수록 넓어지는 고리를 쌓고 돌린다(뒤쪽 반은 잿빛, 앞쪽 반은 흰빛) · 기둥이 흔들린다 · 밑동 먼지 · 도는 잎과 돌 조각
    const z = f.z || 1, tr = Math.abs(f.x0 - f.x1) / f.v, run = Math.max(0, Math.min(e, tr)), X = f.x0 + (f.x1 - f.x0) * run / tr, Y = f.y0 + (f.y1 - f.y0) * run / tr;
    if (e < f.es) return;   // 거인 몸 안: 아직 안 보인다 (앞 끝에서 일어난다)
    const grow = Math.min(1, (e - f.es) / 0.2), fade = e > tr ? Math.max(0, 1 - (e - tr) / 0.45) : 1;
    const al = fade * (0.35 + 0.65 * grow), Ht = 58 * z * (0.25 + 0.75 * grow) * (0.55 + 0.45 * fade), NR = 18, wide = (0.5 + 0.5 * grow) * (0.65 + 0.35 * fade);
    for (const front of [0, 1]) for (let i = 0; i < NR; i++) {
      const u = i / (NR - 1), h = u * Ht, r = (3 + 17 * Math.pow(u, 1.35)) * z * wide, xc = X + Math.sin(e * 5 + u * 3.2) * 4 * z * u + u * u * 5 * z * Math.sin(e * 2.4);
      const npt = Math.max(8, Math.round(Math.PI * 2 * r / 2.2));
      for (let j = 0; j < npt; j++) {
        const a = j / npt * Math.PI * 2 + e * 15 + i * 0.75, sn = Math.sin(a);
        if ((sn > 0) !== !!front) continue;
        const col = front ? (i % 3 === 0 ? '#c8d6ea' : (j + i) % 7 === 0 ? '#ffffff' : '#eef4fc') : (i % 2 ? '#8a9ab4' : '#a6b4ca');
        skQ(g, xc + Math.cos(a) * r, Y - h + sn * r * 0.3, col, al * (front ? 1 : 0.85));
      }
    }
    for (let i = 0; i < 12; i++) {   // 밑동 먼지
      const a = skH(i, 71) * Math.PI * 2 + e * 9, r = (7 + 12 * skH(i, 72)) * z;
      skQ(g, X + Math.cos(a) * r, Y - 1 + Math.sin(a) * 2.5 - skH(i, 73) * 5, i % 2 ? '#c8b48a' : '#e4d6b0', al * 0.85);
    }
    for (let i = 0; i < 8; i++) {   // 도는 잎 · 돌 조각
      const u = 0.2 + 0.65 * skH(i, 74), a = e * (9 + 5 * skH(i, 75)) + i * 2.1, r = (6 + 17 * u) * z * wide, h = u * Ht, sn = Math.sin(a);
      skQ(g, X + Math.cos(a) * r, Y - h + sn * r * 0.3, i % 3 === 0 ? '#6a7484' : i % 3 === 1 ? '#7ac04a' : '#9a7a4a', al * (sn > 0 ? 1 : 0.6));
    }
    return;
  }
  if (f.k === 'ufeath') {   // 깃털 폭풍 (빌드 59): 깃털 열넷이 소용돌이치며 날아가 → 맞는 때에 둘레를 휘돌고 → 흩날려 떨어진다 (금빛 · 흰빛, 깃대는 짙은 금)
    const z = f.z || 1, N = 14;
    for (let j = 0; j < N; j++) {
      const lag = j * 0.022, ee = e - lag;
      let x, y, ang;
      if (ee < 0) continue;
      if (ee <= f.fl) {
        const u = ee / f.fl, mx = (f.x0 + f.x1) / 2, my = Math.min(f.y0, f.y1) - 22 - 14 * skH(j, 80 + f.s);
        const bx = (1 - u) * (1 - u) * f.x0 + 2 * u * (1 - u) * mx + u * u * f.x1, by = (1 - u) * (1 - u) * f.y0 + 2 * u * (1 - u) * my + u * u * f.y1;
        const sp = ((1 - u) * 10 + 4) * z, a = u * 10 + j * 0.45 + f.s;
        x = bx + Math.cos(a) * sp; y = by + Math.sin(a) * sp * 0.6; ang = a + 1.57;
      } else {
        const w = ee - f.fl, a0 = j * (Math.PI * 2 / N);
        if (w < 0.32) { const a = a0 + w * 16, r = (9 + 4 * Math.sin(w * 10)) * z; x = f.x1 + Math.cos(a) * r; y = f.y1 + Math.sin(a) * r * 0.5; ang = a + 1.57; }
        else { const v = w - 0.32, a = a0 + 0.32 * 16, r = (11 + v * 14) * z; x = f.x1 + Math.cos(a) * r + Math.sin(v * 7 + j) * 3 * z; y = f.y1 + Math.sin(a) * r * 0.5 + v * 24 * z; ang = 1.57 + Math.sin(v * 7 + j) * 0.8; }
      }
      const al = e > f.d - 0.3 ? Math.max(0, (f.d - e) / 0.3) : 1, dx = Math.cos(ang) * 2, dy = Math.sin(ang) * 2;
      const c1 = j % 3 === 0 ? '#ffffff' : '#ffe070', c2 = j % 3 === 0 ? '#b8c8e0' : '#b88a28';
      skQ(g, x - dx, y - dy, c2, al); skQ(g, x, y, c1, al); skQ(g, x + dx, y + dy, c1, al * 0.75);
    }
    if (e >= f.fl && e < f.fl + 0.35) {   // 닿는 자리 빛 고리
      const q = (e - f.fl) / 0.35;
      for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2 + f.s, r = (4 + 14 * q) * z; skQ(g, f.x1 + Math.cos(a) * r, f.y1 + Math.sin(a) * r * 0.6, i % 2 ? '#fff6c0' : '#ffd040', 1 - q); }
    }
    return;
  }
  if (f.k === 'ufang') {   // 땅속 독니 (빌드 58): 발밑 들썩임(금 · 튀는 흙) → 양쪽에서 위턱 · 아래턱이 활꼴로 솟아(안쪽에 이빨 · 끝에 큰 독니) 파티 머리 위에서 덥석 → 독 · 흙이 튀고 땅속으로
    const z = f.z || 1, M = (f.L + f.R) / 2, Rj = (f.R - f.L) / 2, hk = 1.12;
    if (e < f.pre) {
      const k = e / f.pre;
      for (let i = 0; i <= 18; i++) { const x = f.L + (f.R - f.L) * i / 18; skQ(g, x, f.gy + (i % 3 ? 1 : 0), i % 2 ? '#2a1c12' : '#4a3424', 0.25 + 0.65 * k); }
      for (let i = 0; i < 10; i++) { const ph = (e * 6 + skH(i, 98)) % 1, x = f.L + 6 + (f.R - f.L - 12) * skH(i, 99); skQ(g, x, f.gy - 1 - Math.sin(ph * Math.PI) * 7 * k, i % 2 ? '#8a6a42' : '#5a3e28', k); }
      return;
    }
    const ee = e - f.pre, D2 = f.d - f.pre; if (ee > D2) return;
    const al = ee > D2 - 0.3 ? Math.max(0, (D2 - ee) / 0.3) : 1;
    for (let i = 0; i <= 18; i++) { const x = f.L + (f.R - f.L) * i / 18; skQ(g, x, f.gy + 1, i % 3 ? '#140c08' : '#2a1c12', al); }   // 벌어진 땅
    const ph = ee < 0.06 ? 180 - 70 * ee / 0.06 : ee < 0.1 ? 110 - 19 * (ee - 0.06) / 0.04 : ee < 0.42 ? 91 : 91 + 89 * Math.min(1, (ee - 0.42) / 0.26);   // 턱 끝 각도 (180 = 땅)
    if (ph < 179) {
      const band = [], teeth = [];
      for (const sx of [1, -1]) {   // 1 왼턱 · -1 오른턱 (거울)
        const n = 32;
        for (let j = 0; j <= n; j++) {
          const a = (180 + (ph - 180) * j / n) * Math.PI / 180, x = M + sx * Rj * Math.cos(a), y = f.gy - Rj * hk * Math.sin(a);
          let ix = M - x, iy = f.gy - 6 * z - y; const IL = Math.hypot(ix, iy) || 1; ix /= IL; iy /= IL;   // 안쪽 (파티 쪽)
          band.push([x - ix * 4, y - iy * 4, '#1a120a'], [x - ix * 2, y - iy * 2, '#7a6444'], [x, y, '#4a3a26'], [x + ix * 2, y + iy * 2, '#7a2434']);
          if (j % 3 === 1 && j < n - 2) for (let t = 1; t <= 3; t++) teeth.push([x + ix * (2 + 2 * t), y + iy * (2 + 2 * t), t === 3 ? '#c8b89a' : '#f4ecd8']);
          if (j === n) for (let t = 1; t <= 6; t++) teeth.push([x + ix * (1 + 2 * t), y + iy * (1 + 2 * t) + t * 1.0, t >= 5 ? '#8af060' : '#f4ecd8']);   // 끝의 큰 독니
        }
      }
      for (const [x, y] of teeth) for (const [ox, oy] of [[-2, 0], [2, 0], [0, -2], [0, 2]]) skQ(g, x + ox, y + oy, '#1a120a');
      for (const [x, y, c] of band) skQ(g, x, y, c);
      for (const [x, y, c] of teeth) skQ(g, x, y, c);
    }
    if (ee < 0.5) for (let i = 0; i < 14; i++) {   // 턱이 솟는 자리에서 흙 튐
      const q = ee / 0.5, bx = i % 2 ? f.L : f.R, a = Math.PI * (0.15 + 0.7 * skH(i, 96)), sp = (30 + 30 * skH(i, 97)) * z;
      skQ(g, bx + Math.cos(a) * sp * q * (i % 4 < 2 ? 1 : -1), f.gy - 2 - Math.sin(a) * sp * q + 150 * q * q, i % 3 ? '#6a4a30' : '#a8845a', 1 - q);
    }
    if (ee > 0.1 && ee < 0.65) for (let i = 0; i < 12; i++) {   // 덥석 문 자리에서 독이 튄다
      const q = (ee - 0.1) / 0.55, a = Math.PI * (0.1 + 0.8 * skH(i, 94)), sp = (26 + 26 * skH(i, 95)) * z;
      skQ(g, M + Math.cos(a) * sp * q * (i % 2 ? 1 : -1), f.gy - Rj * hk + 4 - Math.sin(a) * sp * q + 110 * q * q, i % 3 ? '#6ac83a' : '#b8f06a', 1 - q);
    }
    return;
  }
  if (f.k === 'ulash') {   // 가시 덩굴 채찍 (빌드 58): 심장에서 활꼴로 뻗는 검보랏빛 덩굴(양쪽 번갈아 자홍 가시 · 빛나는 끝) → 내리친 자리 가시 고리 → 출렁이다 거둬들인다
    const z = f.z || 1, gr = Math.min(1, e / f.fl), ee = e - f.fl;
    let u1 = 1 - (1 - gr) * (1 - gr);
    if (ee > 0.2) u1 = Math.max(0, 1 - (ee - 0.2) / 0.4);
    if (u1 > 0) {
      const mx = (f.x0 + f.x1) / 2, my = Math.min(f.y0, f.y1) - f.h;
      const P = u => [(1 - u) * (1 - u) * f.x0 + 2 * u * (1 - u) * mx + u * u * f.x1, (1 - u) * (1 - u) * f.y0 + 2 * u * (1 - u) * my + u * u * f.y1];
      const N = 44, wig = ee > 0 && ee < 0.3 ? Math.sin(ee * 46) * (1 - ee / 0.3) * 4 : 0;
      let tx = f.x0, ty = f.y0;
      for (let j = 0; j <= N; j++) {
        const u = j / N * u1, [x, y] = P(u), [x2, y2] = P(Math.min(1, u + 0.01)), L = Math.hypot(x2 - x, y2 - y) || 1, nx = -(y2 - y) / L, ny = (x2 - x) / L;
        const off = Math.sin(u * 13 + e * 16 + f.s) * 1.2 + wig * Math.sin(u * Math.PI), X = x + nx * off, Y = y + ny * off, tx2 = (x2 - x) / L, ty2 = (y2 - y) / L;
        skQ(g, X + nx * 2, Y + ny * 2, '#2e102e'); skQ(g, X, Y, '#8a3a8a');
        if (u < 0.7) skQ(g, X - nx * 2, Y - ny * 2, '#c070c0', 0.9);
        if (j % 4 === 2) { const sd = Math.floor(j / 4) % 2 ? 1 : -1; skQ(g, X + nx * sd * 4 - tx2, Y + ny * sd * 4 - ty2, '#ff5ab0'); skQ(g, X + nx * sd * 6 - tx2 * 2.5, Y + ny * sd * 6 - ty2 * 2.5, '#ffa0d0', 0.9); }   // 가시 (양쪽 번갈아 · 뒤로 기운다)
        tx = X; ty = Y;
      }
      skQ(g, tx, ty, '#ffd0ea'); skQ(g, tx - 2, ty, '#ff5ab0', 0.85); skQ(g, tx, ty - 2, '#ff5ab0', 0.6);   // 빛나는 끝
    }
    if (ee >= 0 && ee < 0.45) {   // 내리친 자리: 가시 고리가 터져 퍼진다
      const q = ee / 0.45;
      for (let i = 0; i < 10; i++) {
        const a = i / 10 * Math.PI * 2 + f.s, r = (4 + 15 * q) * z;
        skQ(g, f.x1 + Math.cos(a) * r, f.y1 + Math.sin(a) * r * 0.7, i % 2 ? '#ff5ab0' : '#c060e0', 1 - q);
        skQ(g, f.x1 + Math.cos(a) * (r - 3), f.y1 + Math.sin(a) * (r - 3) * 0.7, '#5e2a5e', (1 - q) * 0.8);
      }
    }
    return;
  }
  if (f.k === 'ufire') {   // 불길: 입에서 파티 쪽으로 불 알갱이가 부채꼴로 흘러간다 — 입 가까이 흰 노랑 · 노랑 · 주황 · 빨강, 끝은 검붉은 연기 · 다 뿜은 뒤 꼬리가 따라간다
    if (e > f.d + 0.35) return;
    const L = Math.abs(f.x0 - f.x1) || 1, tt = L / FMOT_AOE_V.breath, head = e / tt, tail = (e - (f.d - 0.3)) / tt, al = e > f.d ? Math.max(0, 1 - (e - f.d) / 0.35) : 1;
    for (let i = 0; i < 72; i++) {
      const sp = 0.85 + skH(i, 102) * 0.3, u = (e * sp / tt + skH(i, 101)) % 1;
      if (u > head || u < tail) continue;
      const x = f.x0 + (f.x1 - f.x0) * u, y = f.y0 + (f.gy - 9 - f.y0) * u * 0.8 + (skH(i, 103) - 0.5) * (3 + u * 28) + Math.sin(e * 18 + i) * 2 * u;
      const c = u < 0.16 ? '#fff6c0' : u < 0.38 ? '#ffd040' : u < 0.62 ? '#ff8a2a' : u < 0.84 ? '#e0402a' : '#5a3436', a2 = al * (u < 0.84 ? 1 : 1 - (u - 0.84) / 0.16);
      skQ(g, x, y, c, a2); if (u > 0.3) skQ(g, x + (f.x1 < f.x0 ? 2 : -2), y, c, a2 * 0.9); if (u > 0.55 && i % 2) skQ(g, x, y - 2, c, a2 * 0.8);
    }
    if (e < f.d - 0.25) for (let i = 0; i < 5; i++) skQ(g, f.x0 + (skH(i, 104) - 0.5) * 6, f.y0 + (skH(i, 105) - 0.5) * 6, i % 2 ? '#fff6c0' : '#ffd040', 0.8);
    return;
  }
  if (f.k === 'umiasma') {   // 독 늪: 파티 발밑에 검보라·초록 늪이 가운데부터 번지고, 거품이 솟아 터지고, 해골 모양 연기가 오른다
    if (e > f.d) return;
    const al = e > f.d - 0.35 ? (f.d - e) / 0.35 : 1, k1 = Math.min(1, e / 0.35), cx = (f.x0 + f.x1) / 2, hw = (f.x1 - f.x0) / 2 * k1;
    for (let x = cx - hw; x <= cx + hw; x += 2) { const u = Math.abs(x - cx) / Math.max(1, hw), h = 1 + (1 - u * u) * 2; for (let yy = 0; yy < h * 2; yy += 2) skQ(g, x, f.gy - yy + 2, yy ? '#4a2a5a' : '#2a3a1e', al * 0.85); if (Math.floor(x / 2 + e * 9) % 7 === 0) skQ(g, x, f.gy - h * 2, '#6ab040', al); }
    for (let i = 0; i < 18; i++) { const q = (e * 1.5 + skH(i, 81)) % 1, bx = cx + (skH(i, 82) - 0.5) * hw * 2, by = f.gy - 3 - q * 16; skQ(g, bx, by, i % 3 ? '#8af060' : '#c060ff', al * (1 - q)); if (q > 0.85) { skQ(g, bx - 2, by, '#c8f0a0', al * 0.6); skQ(g, bx + 2, by, '#c8f0a0', al * 0.6); } }
    if (e > 0.3) (f.tg || []).forEach((q, i) => { const p = Math.min(1, (e - 0.3 - i * 0.08) / 1.0); if (p <= 0) return; const sx = q[0] + (i % 2 ? 3 : -3), sy = q[1] - 10 - p * 22, a2 = al * (1 - p) * 0.9, C = '#b8f088';
      [[-2, 0], [0, 0], [2, 0], [-2, 2], [2, 2], [0, 4]].forEach(([dx, dy]) => skQ(g, sx + dx, sy + dy, C, a2)); skQ(g, sx - 1, sy + 2, '#1a2a10', a2); skQ(g, sx + 1, sy + 2, '#1a2a10', a2); });
    return;
  }
  if (f.k === 'uflood') {   // 폐수 물결: 앞머리가 높고 뒤로 낮아지는 검푸른 물 벽 · 거품과 물방울 · 지나간 자리에 번들거림
    if (e > f.d) return;
    const x = f.x0 - Math.min(f.x0 - f.x1, e * FMOT_AOE_V.flood), al = e > f.d - 0.4 ? Math.max(0, (f.d - e) / 0.4) : 1, C = ['#9ab878', '#5a7a52', '#36503a', '#1e3026'];
    for (let i = 0; i < 28; i++) { const xx = x + i * 2, h = Math.max(0, 16 - i * 0.6) * (0.8 + 0.2 * Math.sin(e * 16 + i * 0.7)); for (let yy = 0; yy < h; yy += 2) skQ(g, xx, f.gy - yy, C[Math.min(3, Math.floor(yy / 5) + (i > 6 ? 1 : 0))], al); }
    for (let i = 0; i < 12; i++) { const q = (e * 2.4 + skH(i, 61)) % 1; skQ(g, x - 2 + skH(i, 62) * 12, f.gy - 14 - q * 14, i % 3 ? '#c8e0a0' : '#ffffff', al * (1 - q)); }
    for (let i = 0; i < 14; i++) { const xx = x + 56 + skH(i, 63) * Math.max(0, f.x0 - x - 56), q = skH(i, 64), bl = Math.floor(e * 6 + i) % 3 === 0; skQ(g, xx, f.gy - 2 - q * 6, bl ? '#a8c890' : '#4a6a48', al * 0.4 * (1 - q)); }
    return;
  }
  if (f.k === 'ublade') {   // 그림자 단검: 위로 솟았다가 포물선으로 내려꽂힌다 · 검은 날 · 붉은 잔상 · 꽂히면 붉은 튐
    const q = Math.min(1, e / f.d); if (q >= 1 && e > f.d + 0.25) return;
    if (q < 1) { const x = f.x0 + (f.x1 - f.x0) * q, y = f.y0 + (f.y1 - f.y0) * q - Math.sin(q * Math.PI) * 34, vx = (f.x1 - f.x0) / f.d, vy = (f.y1 - f.y0) / f.d - Math.cos(q * Math.PI) * Math.PI * 34 / f.d, L = Math.hypot(vx, vy) || 1, ux = vx / L, uy = vy / L;
      for (let i = -2; i <= 2; i++) skQ(g, x - ux * i * 2, y - uy * i * 2, i === 2 ? '#e8e8f0' : i < 0 ? '#2a2230' : '#4a4256', 1);
      for (let i = 3; i <= 5; i++) skQ(g, x - ux * i * 2, y - uy * i * 2, '#a02030', 0.5 - (i - 3) * 0.15); }
    else { const k2 = (e - f.d) / 0.25; for (let i = 0; i < 5; i++) { const a = skH(f.s * 5 + i, 51) * Math.PI, r = 3 + k2 * 9; skQ(g, f.x1 + Math.cos(a) * r, f.y1 - Math.abs(Math.sin(a)) * r, i % 2 ? '#c42e36' : '#4a4256', 1 - k2); } }
    return;
  }
  if (f.k === 'ustorm') {   // 번개 폭풍: 파티 머리 위에 먹구름(뭉툭 칸 덩이) · 번쩍일 때 밝아진다
    const k = e / f.d, al = k < 0.2 ? k / 0.2 : k > 0.75 ? Math.max(0, 1 - (k - 0.75) / 0.25) : 1, fl = Math.floor(e * 14) % 5 === 0 && k > 0.25 && k < 0.7;
    f.tg.forEach(([x, y], i) => { for (let j = 0; j < 9; j++) { const ox = (skH(i * 9 + j, 21) - 0.5) * 30, oy = (skH(i * 9 + j, 22) - 0.5) * 8 - (1 - Math.min(1, k * 3)) * 10; skQ(g, x + ox, y + oy, fl ? '#c8d8f0' : j % 3 ? '#2a3448' : '#3e4a64', al * 0.9); skQ(g, x + ox + 2, y + oy, fl ? '#e8f0ff' : '#34405a', al * 0.8); } });
    return;
  }
  if (f.k === 'usand') {   // 모래 물결: 앞머리(볏)가 높고 뒤로 낮아지는 모래 벽 · 볏에서 모래가 튄다 · 지나간 자리에 먼지
    if (e > f.d) return;
    const x = f.x0 - Math.min(f.x0 - f.x1, e * FMOT_AOE_V.sand), al = e > f.d - 0.4 ? Math.max(0, (f.d - e) / 0.4) : 1, C = ['#f4dca4', '#dcb474', '#b48a52', '#8a6838'];
    for (let i = 0; i < 26; i++) { const xx = x + i * 2, h = Math.max(0, 20 - i * 0.85) * (0.82 + 0.18 * Math.sin(e * 20 + i)); for (let yy = 0; yy < h; yy += 2) skQ(g, xx, f.gy - yy, C[Math.min(3, Math.floor((h - yy) / 5))], al * (1 - i / 30)); }
    for (let i = 0; i < 10; i++) { const q = (e * 3 + skH(i, 41)) % 1; skQ(g, x - 2 + skH(i, 42) * 8, f.gy - 18 - q * 16, C[i % 2], al * (1 - q)); }
    for (let i = 0; i < 12; i++) { const xx = x + 52 + skH(i, 43) * Math.max(0, f.x0 - x - 52), q = skH(i, 44); skQ(g, xx, f.gy - 2 - q * 8, '#c8a878', al * 0.35 * (1 - q)); }
    return;
  }
  if (f.k === 'ublizz') {   // 눈보라: 눈송이 떼가 물결치며 파티 쪽으로 휘몰아치고, 뒤에 흰 안개 띠
    const k = e / f.d; if (k >= 1) return;
    const al = k < 0.15 ? k / 0.15 : k > 0.7 ? (1 - k) / 0.3 : 1, L = f.x0 - f.x1;
    for (let i = 0; i < 46; i++) { const sp = 0.55 + skH(i, 31) * 0.6, q = ((e * sp * 1.4) + skH(i, 32)) % 1, x = f.x0 - q * L, y = f.y - 6 - skH(i, 33) * 46 + Math.sin(e * 9 + i) * 4, big = skH(i, 34) > 0.75;
      skQ(g, x, y, i % 3 ? '#ffffff' : '#c8e4ff', al * (0.5 + 0.5 * (1 - q))); if (big) { skQ(g, x + 2, y, '#e8f4ff', al * 0.8); skQ(g, x, y + 2, '#c8e4ff', al * 0.6); } if (!big && i % 4 === 0) skQ(g, x + 2, y + 1, '#dceeff', al * 0.5); }
    for (let x = f.x1; x < f.x0; x += 2) for (const [oy, a2] of [[-14, 0.16], [-22, 0.12], [-30, 0.08]]) skQ(g, x, f.y + oy + Math.round(Math.sin(x * 0.08 + e * 5) * 3), '#f0f8ff', al * a2);
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
STORY.v43 = [
  '빌드 43: 언데드 17종을 새로 그렸다 — 스켈레톤 전사·궁수·법사, 구울, 좀비, 미라, 망령 기사, 실험체 골렘, 도깨비불, 밴시, 원혼 나무, 천계 기사의 망령, 그리고 우두머리 흡혈 기사·드라큘라 백작·리치 킹·사신·죽음의 기사 모르간.',
  '몬스터도 동작을 한다: 공격(칼·발톱·붕대·주먹·가지), 마법(지팡이와 손끝에서 날아가는 구슬·얼음 화살), 스킬(상태이상을 거는 한 방·치명타, 우두머리는 광역기 — 박쥐 떼·죽음의 파동·죽음의 회전·암흑 강타). 맞는 숫자·번쩍임·소리·쓰러짐은 무기나 마법이 닿는 순간에 나온다.',
  '고친 것: 빌드 42에서 스킬 투사체(화염구·얼음 조각 같은 것)가 그려지지 않던 문제.'
];
STORY.v44 = [
  '빌드 44: 평원과 버려진 곡물 창고의 몬스터를 새로 그렸다 — 들쥐, 초록 슬라임, 뿔토끼, 들늑대, 고블린, 그리고 우두머리 들쥐왕.',
  '짐승도 제 몸으로 싸운다: 웅크렸다 덮쳐 물기, 뛰어올라 뿔 내리꽂기, 높이 뛰어 짓누르기, 단검 찌르기. 들쥐왕은 왕관을 쓴 쥐 수인으로, 밀 이삭 홀을 휘두르고 덥석 물며 홀을 들어 쥐 떼를 부른다. HP가 30% 아래로 떨어지면 망토가 찢어진다.',
  '새 펫: 들쥐 새끼(평원에서 알이 나온다) — 재빠르게 물고, 상단에 두면 약초를 물어 온다. 다 자라면 붉은 목도리를 두른 들쥐 대장. 슬라임 펫은 다 자라면 왕관 슬라임이 된다.',
  '도감의 몬스터 그림도 새 그림으로 바뀌었다.'
];
STORY.v45 = [
  '빌드 45: 원시림과 썩은 뿌리 동굴의 몬스터를 새로 그렸다 — 독버섯 괴물, 거대 거미, 트렌트 묘목, 고블린 주술사, 그리고 우두머리 늙은 트렌트.',
  '독버섯 괴물은 갓으로 들이받고 갓을 부풀려 독 포자를 내뿜는다. 거대 거미는 덮쳐 물고, 뛰어올라 물고, 앞다리를 들어 독침을 뱉는다. 트렌트 묘목은 이끼와 붉은 버섯이 돋은 몸으로 가지를 휘두르고, 고블린 주술사는 뿔 달린 해골 지팡이로 마법 구슬을 쏘고 저주를 모은다.',
  '늙은 트렌트는 회녹색 이끼가 길게 늘어진 고목이다. 이끼 낀 큰 가지로 내려치고, 파티 발밑에서 뿌리를 솟구치게 한다(뿌리 솟기).'
];
STORY.v46 = [
  '빌드 46: 검은바위산과 버려진 드워프 갱도의 몬스터를 새로 그렸다 — 바위 도마뱀, 동굴 박쥐, 코볼트 광부, 스톤 골렘, 그리고 우두머리 바위거인.',
  '바위 도마뱀은 등에 바위 비늘판이 솟은 네발 도마뱀으로, 물고 머리를 숙여 돌진한다. 동굴 박쥐는 떠서 날갯짓하다가 내리꽂으며 물고 피를 빤다. 코볼트 광부는 노란 안전모에 등불을 단 개 얼굴의 광부로, 곡괭이를 내려찍고 땅을 찍어 흔든다.',
  '스톤 골렘과 바위거인은 만날 때마다 네 모습 중 하나로 나온다 — 골렘은 갈라진 바위 · 이끼 낀 고대 골렘 · 광맥과 수정 · 드워프가 만든 골렘, 바위거인은 자수정 거인 · 원석의 심장 · 산 거인 · 봉인의 수호자. 도감에서 네 모습을 모두 볼 수 있다.',
  '골렘 조각 펫은 다 자라면 어깨에 수정이 돋은 「수정 골렘」 모습이 된다.'
];
STORY.v48 = [
  '빌드 48: 바람계곡과 와이번 둥지의 몬스터를 새로 그렸다 — 바람 늑대, 하피, 그리폰, 와이번, 그리고 우두머리 폭풍 와이번.',
  '바람 늑대는 흰 갈기에 푸른 바람 무늬가 흐르는 늑대로, 물고 덮치고 덮쳐 물어뜯는다. 하피는 길게 뻗은 매 날개로 떠서 날갯짓하다가 내리꽂으며 발톱을 세우고, 날개를 쳐 깃털을 날려 상처를 낸다(출혈).',
  '그리폰은 독수리 머리에 사자 몸, 층진 깃털 날개를 가졌다. 부리로 쪼고 덮치며, 높이 솟았다가 내리꽂는다. 와이번은 커다란 막 날개를 단 초록 비룡으로, 물고 머리를 숙여 들이받고 바람 숨결을 뿜는다.',
  '폭풍 와이번은 번개 모양 뿔이 솟은 짙푸른 비룡이다. 물고 들이받다가, 뒤로 젖혀 숨을 모아 하늘로 포효하면 파티 머리 위에 먹구름이 끼고 번개가 내리친다(번개 폭풍).',
  '그리폰·하피·와이번 펫도 다 자라면 새 그림이 된다. 큰 펫은 알맞게 줄여 그리고, 그리폰·와이번이 비행 마차를 끌 때는 마차 앞에 선다.',
  '고친 것: 전투에서 펫이 뒤(파티 반대쪽)를 보고 있던 것 — 이제 적 쪽을 본다.'
];
STORY.v49 = [
  '빌드 49: 만년설산과 얼어붙은 신전의 몬스터를 새로 그렸다 — 눈사람, 얼음 정령, 예티, 설녀, 그리고 우두머리 설녀 여왕.',
  '눈사람은 양동이 모자에 당근 코, 붉은 목도리를 두르고 나뭇가지 팔로 눈덩이를 치켜들어 던진다(맞으면 냉기). 통통 튀어 몸통 박치기도 한다. 얼음 정령은 떠다니는 얼음 결정으로, 얼음 조각을 쏜다.',
  '예티는 흰 털이 덥수룩한 큰 덩치에 푸른 얼굴과 붉은 눈, 송곳니를 가졌다. 긴 팔로 주먹을 내려치고 휘두르며, 땅을 내리찍는다.',
  '설녀는 긴 머리에 흰 기모노를 입고 끌리는 옷자락으로 떠다닌다. 손끝에서 얼음 숨결을 날리고 냉기를 모은다. 만날 때마다 검은 머리 · 은빛 머리 두 모습 중 하나로 나온다(도감에서 둘 다 볼 수 있다).',
  '설녀 여왕은 얼음 왕관과 얼음 깃, 남빛 긴 머리에 흰 드레스를 입고 얼음 홀을 든다. 홀로 얼음 창을 쏘고, 홀을 치켜들면 파티 쪽으로 눈보라가 휘몰아친다(눈보라).',
  '고산지대 산양도 새로 그렸다 — 만날 때마다 아이벡스(뒤로 휜 마디 뿔) · 흰 산양(짧은 검은 뿔) · 큰뿔 산양(말린 굵은 뿔) 세 모습 중 하나. 머리를 숙여 들이받고, 뛰어올라 들이받는다. 산양 펫은 다 자라면 아이벡스 모습이 되어 강철 마차를 끈다.'
];
STORY.v61 = [
  '빌드 61: 천둥 봉우리의 뇌수와 폭풍 골렘도 새로 그렸다. 뇌수는 만날 때마다 번개 뿔 들소 · 번개 그리폰 중 하나로 나온다(도감에서 둘 다 볼 수 있다).',
  '번개 뿔 들소는 흰 뿔 끝마다 번개를 튀기며 물고 들이받고, 번개 그리폰은 어깨 위로 들어 편 칼깃 끝에 번개 빛을 달고 덮친다(감전). 폭풍 골렘은 몸이 빗물 덩이인 폭풍우 골렘이 되어, 물 머리 속에 돌을 띄운 채 물 주먹을 휘두르고 내리찍어 기절시킨다.'
];
STORY.v60 = [
  '빌드 60: 천둥 봉우리와 뇌신의 첨탑 몬스터를 새로 그렸다 — 먹구름 정령, 번개매, 폭풍 기사, 쉰 번째 우두머리 뇌룡, 그리고 첨탑의 두목 뇌제 아스트라. 만날 때마다 여러 모습 중 하나로 나타나기도 한다(뇌수와 폭풍 골렘은 옛 모습 그대로).',
  '먹구름 정령은 뭉게 먹구름 · 꼬마 뇌운 셋이 되어 덮치고 번개 구슬을 뱉는다. 번개매는 먹빛 번개매 · 폭풍 수리 · 뇌제비가 되어 할퀴고 번개를 두른 채 내리꽂는다. 폭풍 기사는 청록 목도리를 휘날리는 비바람 척후 창기사가 되어 찌르고 베고 내리찍는다.',
  '뇌룡(흰 두 뿔 뇌룡 · 먹구름 날개 용)이 웅크려 숨을 모았다가 입을 벌리면 꺾인 번개가 부채꼴로 파티를 꿰뚫고 지나가며 한 사람씩 지진다(뇌전 숨결).',
  '뇌신의 첨탑 꼭대기의 뇌제 아스트라(번개 관 뇌제)는 폭풍 구슬 지팡이로 번개를 쏘고, 지팡이를 높이 들면 번개가 가장 가까운 사람에게 꽂힌 뒤 머리 위로 튀어 다음 사람 · 그다음 사람으로 건너뛴다(번개 사슬).'
];
STORY.v59 = [
  '빌드 59: 구름섬과 구름 위 신전 몬스터를 새로 그렸다 — 구름 양, 하늘 가오리, 뇌조, 페가수스, 구름 거인, 하늘 기사, 쉰 번째 우두머리 하늘의 거인, 그리고 신전의 두목 하늘의 황제. 만날 때마다 여러 모습 중 하나로 나온다(도감에서 모두 볼 수 있다).',
  '구름 양은 뭉게구름 양 · 비구름 양이 되어 들이받고 덮친다. 하늘 가오리는 하늘빛 만타 · 구름 자락 가오리가 되어 미끄러지듯 덮치고 얼음 조각을 뱉는다. 뇌조는 번개 꼬리 매 · 구름 날개 두루미가 되어 내리꽂고 번개 구슬을 날린다. 페가수스는 흰 날개 말 · 접은 날개 갈색 페가수스 — 페가수스 펫이 다 자라면, 그리고 비행 마차를 끌 때도 흰 날개 말 모습이 된다.',
  '구름 거인은 구름 몸 거인 · 부러진 돌기둥을 든 기둥 거인 · 쇠스랑을 든 하늘 농부 거인, 하늘 기사는 날개 투구 창기사 · 구름 망토 검사 · 푸른 갑주 대검사가 되어 찌르고 베고 뛰어올라 내리찍는다.',
  '하늘의 거인(섬을 진 거인 · 폭풍석 거인 · 하얀 성채 거인)이 땅을 내리치면 거인 앞에서 회오리가 일어 파티 쪽으로 땅을 따라 지나가며 한 사람씩 휩쓴다(회오리바람). 구름 위 신전의 하늘의 황제(구름 왕좌 황제 · 깃털 망토 여황제)는 지팡이로 빛을 쏘고, 빛을 모아 쏘면 금빛 깃털이 소용돌이치며 사람마다 날아가 휘감는다(깃털 폭풍).'
];
STORY.v58 = [
  '빌드 58: 세계수 뿌리와 세계수의 심장 몬스터를 새로 그렸다 — 뿌리 거미, 뿌리 웜, 트렌트 수호자, 드라이어드, 이끼 골렘, 쉰 번째 우두머리 세계수의 뱀, 그리고 심장의 두목 타락한 세계수의 심장. 모두 네 모습씩이라 만날 때마다 그중 하나로 나온다(도감에서 모두 볼 수 있다).',
  '뿌리 거미는 뿌리 다리 · 밤송이 · 이끼 등 · 가시 덤불 거미, 뿌리 웜은 뿌리 웜 · 굼벵이 · 버섯 웜 · 가시 덩굴 웜. 물고 덤벼들며 독을 뱉는다. 트렌트 수호자는 방패 나무 기사 · 고목 수문장 · 꽃 피운 수호자 · 그루터기 거인, 이끼 골렘은 이끼 둔덕 · 뿌리 감긴 바위 · 묘목 등 · 덩굴 골렘이 되어 내리치고 땅을 울린다.',
  '드라이어드는 목까지 덮는 긴 옷을 입고 늘 떠 있다 — 잎사귀 · 나무껍질 · 꽃봉오리 · 단풍 드라이어드가 손 위의 꽃 · 씨앗 · 꽃가루 · 단풍잎에서 자연의 힘을 날린다.',
  '세계수의 뱀(나무껍질 비늘 뱀 · 이끼 덮인 고대 뱀 · 린드웜 · 땅을 넘나드는 뱀)이 고개를 젖혔다가 땅을 내리치면, 파티 발밑이 들썩이다 땅속에서 커다란 아가리가 솟아 파티를 통째로 문다(땅속 독니). 타락한 세계수의 심장(심장 고목 · 떠오른 심장 · 타락한 꽃 · 가시 고치)은 부풀었다 뛸 때마다 빛 구슬을 뱉고, 크게 뛰면 가시 덩굴이 사람마다 활꼴로 뻗어 내리친다(가시 덩굴 채찍).'
];
STORY.v57 = [
  '빌드 57: 용암 화산과 불의 심장 화구의 몬스터를 새로 그렸다 — 마그마 슬라임, 불박쥐, 샐러맨더, 용암 골렘, 적토마, 이프리트, 쉰 번째 우두머리 마그마 드래곤, 그리고 화구의 두목 화염 군주 이프리트.',
  '만날 때마다 여러 모습 중 하나로 나온다: 마그마 슬라임은 불꽃 머리 · 끓는 슬라임, 불박쥐는 불꽃 날개 · 숯 박쥐, 용암 골렘은 흘러내리는 용암 골렘 · 등에 화산을 진 골렘, 적토마는 불꽃 갈기 준마 · 갑옷 군마 · 불꽃 말 · 화산암 말, 마그마 드래곤은 용암 갑룡 · 불꽃 날개 화룡 · 흑요석 가시 용. 도감에서 모두 볼 수 있다.',
  '샐러맨더는 불꽃 아가미를 부채처럼 펼친 용암 도롱뇽이 되어 물고 돌진하며 불덩이를 뱉는다. 용암 골렘은 녹은 용암 몸에 식어 굳은 검은 껍질 판을 두르고 돌주먹을 휘두른다(등에 화산을 진 골렘은 분화구에서 연기와 불씨가 오른다). 이프리트는 온몸이 불길인 그림자가 되어 손 위의 불덩이를 날린다. 적토마 펫이 다 자라면, 그리고 적토마 마차를 끌 때도 불꽃 갈기 준마 모습이 된다.',
  '마그마 드래곤이 숨을 모아 배를 달군 뒤 하늘로 포효하면 입에서 솟은 화산탄이 파티 위로 쏟아진다(화산탄 비). 화염 군주 이프리트는 식어 굳은 용암 망토를 두르고 불꽃 관을 띄운 채, 불 구슬을 치켜들어 파티 발밑에서 불기둥을 솟구치게 한다(불기둥).'
];
STORY.v56 = [
  '빌드 56: 백작의 성 몬스터를 새로 그렸다 — 흡혈 박쥐, 가고일, 이블아이, 서큐버스. 넷 다 늘 떠 있다(가고일 · 이블아이 · 서큐버스는 열 번째 우두머리로도 나온다).',
  '흡혈 박쥐는 옆에서 본 박쥐가 되어 핏빛 날개를 퍼덕이다 아래턱을 벌리고 내리꽂는다. 가고일은 부서진 성벽 조각에 웅크려 앉은 채 떠다니며 입에서 돌 조각을 뱉는다.',
  '이블아이는 핏발 선 눈알에 작은 박쥐 날개가 달렸고, 홍채가 환해지면 빛줄기를 쏜다. 서큐버스는 자홍 박쥐 날개를 양쪽으로 활짝 펴고, 검은 레이스를 겹친 긴 드레스 차림으로 손 위의 분홍 하트에서 마력을 날린다.',
  '구울 · 흡혈 기사 · 드라큘라 · 지하 고문실의 스켈레톤과 리치 킹은 언데드 새 그림(빌드 43) 그대로다. 아기 박쥐 펫이 다 자라면 새 흡혈 박쥐 모습이 된다.'
];
STORY.v55 = [
  '빌드 55: 메마른 땅과 키메라 연구소의 몬스터를 새로 그렸다 — 임프, 헬하운드, 트롤, 오거, 열 번째 우두머리 케르베로스와 오거 대왕, 그리고 연구소의 두목 키메라.',
  '만날 때마다 여러 모습 중 하나로 나온다: 임프는 말린 뿔 · 긴 뿔 두건 임프, 헬하운드는 썩은 하이에나 · 가시 늑대, 오거는 오거 · 두 머리 오거 · 짐승 해골 오거 · 백정 오거, 오거 대왕은 왕관 쓴 대왕 · 두 머리 대왕 · 해골 대왕. 도감에서 모두 볼 수 있다.',
  '트롤은 산처럼 굽은 등에 이끼와 서리꽃이 핀 이끼 등 트롤이 되어 고기 뼈 몽둥이를 휘두른다. 임프는 불씨가 타는 지팡이로 불덩이를 쏜다.',
  '오거 대왕이 몽둥이로 땅을 내리찍으면 땅 금이 달려와 발밑에서 바위 가시가 솟는다(대지 가르기). 키메라는 사자 · 염소 · 뱀이 한 몸이다 — 서 있는 동안 등의 염소가 앞을 봤다 뒤를 봤다 하고, 숨을 모았다가 파티에게 불길을 뿜는다(불길 숨결).'
];
STORY.v53 = [
  '빌드 53: 눅눅한 늪지대와 가라앉은 마녀의 오두막의 몬스터를 새로 그렸다 — 프로그, 늪 거머리, 켈피, 세이렌, 늪지 괴물, 우두머리 두꺼비 왕, 새 우두머리 늪지 아나콘다, 그리고 늪지의 마녀.',
  '만날 때마다 여러 모습 중 하나로 나온다: 프로그는 늪 개구리 · 황소개구리 · 독화살 개구리 · 이끼 개구리, 거머리 셋, 세이렌 셋, 늪지 괴물은 이끼 · 진흙 · 버섯 괴물, 두꺼비 왕은 황소개구리 왕 · 정원을 진 왕 · 독샘 왕. 도감에서 모두 볼 수 있다.',
  '켈피는 켈프 갈기를 늘어뜨린 흰 물말이다. 맞으면 잠깐 몸이 물로 풀렸다가 다시 말이 된다.',
  '늪지대 쉰 번째 우두머리가 히드라에서 늪지 아나콘다로 바뀌었다. 그루터기를 감고 있다가 덮쳐 물고, 몸으로 파티를 휘감아 조인다(휘감아 조이기). 늪지의 마녀는 파티 발밑에 독 늪을 피운다(독 늪).'
];
STORY.v52 = [
  '빌드 52: 지하수로와 지하수로 깊은 곳의 몬스터를 새로 그렸다 — 하수도 쥐떼, 오물 슬라임, 하수도 악어, 쥐인간 도둑, 그리고 우두머리 하수도 트롤.',
  '만날 때마다 여러 모습 중 하나로 나온다: 쥐떼는 잿빛 · 검은 · 갈색 쥐 세 마리, 오물 슬라임은 녹갈색 · 검은 폐수 · 독 거품, 악어는 이끼 · 검은 · 늙은 백악어, 쥐인간은 갈색 · 회색 · 검은 두목, 트롤은 긴 코 이끼 · 뚱뚱한 폐수 · 외눈 뼈 트롤. 도감에서 모두 볼 수 있다.',
  '쥐떼는 떼로 물고 덮친다. 오물 슬라임은 튀어 올라 박치기하고 짓누른다(중독). 악어는 긴 턱으로 물고 돌진하며 물어뜯는다(출혈). 쥐인간 도둑은 단검으로 찌르고 뛰어올라 찌른다(마비).',
  '하수도 트롤은 하수관 몽둥이를 휘두르고, 땅을 내리찍으면 폐수가 바닥을 따라 파티 쪽으로 밀려온다(하수 범람).'
];
STORY.v51 = [
  '빌드 51: 7번가 뒷골목 · 암살자 길드 은신처의 몬스터를 새로 그렸다 — 암살자, 독살자, 길드 행동대원, 새로 생긴 길드 간부, 그리고 두목 길드장 검은 두건.',
  '만날 때마다 여러 모습 중 하나로 나온다: 암살자는 그림자 두건 · 흰 가면 · 꽁지머리 추적자, 독살자는 역병 의사 · 녹색 두건 약제사 · 늙은 독 약초꾼, 행동대원은 상처투성이 덩치 · 쇠가면 집행자 · 붉은 머리띠 주먹꾼, 간부는 까마귀 가면 · 흰 머리 노검객. 도감에서 모두 볼 수 있다.',
  '암살자는 단검으로 찌르고 베며 뛰어올라 찌른다(출혈). 독살자는 독 병을 던지고 독 구름을 피운다(중독). 행동대원은 못 박힌 몽둥이로 후려치고 땅을 내리찍는다.',
  '은신처 맨 안쪽에서는 두목 검은 두건이 간부 둘을 거느리고 기다린다. 두목이 망토를 젖히며 물결 단검을 치켜들면 그림자 단검이 쏟아진다(그림자 칼날 비).'
];
STORY.v50 = [
  '빌드 50: 사라크 사막과 모래에 묻힌 왕릉의 몬스터를 새로 그렸다 — 스콜피온, 개미지옥, 사막 도적, 샌드웜, 그리고 우두머리 거대 샌드웜.',
  '만날 때마다 여러 모습 중 하나로 나온다: 스콜피온은 사막 전갈 · 황제 전갈 · 모래 전갈 · 왕릉 전갈, 개미지옥은 개미귀신 · 붉은 개미귀신 · 창백한 개미귀신, 사막 도적은 붉은 두건 · 검은 망토, 샌드웜은 모래빛 · 갑각, 거대 샌드웜은 가시 등 · 매끈한 등. 도감에서 모두 볼 수 있다.',
  '스콜피온은 집게로 집고 꼬리 독침으로 찌른다(중독). 개미지옥은 모래 둔덕에 몸을 묻고 큰 턱으로 물며 모래를 튀겨 던진다. 사막 도적은 칼로 베고 찌르며 뛰어올라 찌른다(출혈) — 붉은 두건은 굽은 칼, 검은 망토는 청동 가면에 단검.',
  '샌드웜은 다물면 뾰족하고 벌리면 꽃잎 셋으로 활짝 열리는 입으로 덮쳐 문다. 거대 샌드웜은 몸을 솟구쳤다 내리꽂아 모래 물결을 일으킨다(모래 해일).'
];
// 물기 (빌드 44): 위아래 이빨 줄이 맞물리고 작은 터짐
Object.assign(SK_HIT2, {
  bite(g, f, P, e, big) {
    if (e < 0 || e > 0.42) return;
    const k = Math.min(1, e / 0.08), gap = 10 + 4 * big, y0 = f.y - gap * (1 - k), y1 = f.y + gap * (1 - k), al = e < 0.26 ? 1 : 1 - (e - 0.26) / 0.16, n = 3 + big;
    for (let i = 0; i < n; i++) { const x = f.x + (i - (n - 1) / 2) * 4; skQ(g, x, y0 - 2, P[1], al); skQ(g, x, y0, P[0], al); skQ(g, x, y1 + 2, P[1], al); skQ(g, x, y1, P[0], al); }
    for (const s of [-1, 1]) { skQ(g, f.x + s * (n * 2 + 2), f.y - 2, P[2], al * 0.8); skQ(g, f.x + s * (n * 2 + 2), f.y + 2, P[2], al * 0.8); }
    if (k >= 1 && e < 0.2) skStar(g, f.x, f.y, e - 0.08, P, big ? 1 : 0);
  }
});
// 뿌리 솟기 (빌드 45): 발밑에서 뿌리 셋이 솟았다가 들어간다 · 흙 튐
Object.assign(SK_HIT2, {
  roots(g, f, P, e, big) {
    if (e < 0 || e > 0.9) return;
    const up = e < 0.12 ? e / 0.12 : e < 0.5 ? 1 : Math.max(0, 1 - (e - 0.5) / 0.4), n = 3 + big, gy = f.fy;
    for (let i = 0; i < n; i++) { const x = f.x + (i - (n - 1) / 2) * 6 + (i % 2 ? 1 : -1), H = (10 + 6 * ((i * 7) % 3) + 4 * big) * up;
      for (let h = 0; h < H; h += 2) { const bend = Math.sin(h * 0.25 + i) * 1.5; skQ(g, x + bend, gy - h, h > H - 3 ? P[1] : '#6a4a2c'); if (h < H - 4) skQ(g, x + bend + 2, gy - h, '#3e2a18', 0.9); }
      if (H > 6) skQ(g, x + Math.sin(H * 0.25 + i) * 1.5 - 2, gy - H + 4, P[2]); }
    if (e < 0.3) for (let i = 0; i < 8; i++) { const a = Math.PI + i / 7 * Math.PI, r = 4 + e * 60; skQ(g, f.x + Math.cos(a) * r, gy - 2 + Math.sin(a) * r * 0.5, i % 2 ? '#8a6a44' : '#5a4428', 1 - e / 0.3); }
  }
});
