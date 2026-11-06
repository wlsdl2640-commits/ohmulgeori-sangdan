/* ───────── 몬스터 동작 (빌드 43): 공격 · 마법 · 스킬 ─────────
   PXU 그림이 있는 몬스터(언데드)는 사건마다 동작을 하고, 모험가 쪽 효과·숫자·소리·번쩍임은 맞는 때(동작의 맞히는 장 + 투사체가 나는 시간)에 낸다.
   갈래: 공격(atk) · 마법(mag, 마법 몬스터의 공격) · 스킬(skl — 광역기가 있으면 광역기, 없으면 상태이상을 거는 한 방·치명타).
   V.fmot['f' + uid] = { mk 동작 · cat 갈래 · t0 시작 · T 장마다 초 · hit 맞히는 장까지 초 · fl 투사체 초 · aoe { t, T1, x0, k } } */
const FMOT_CAST = Object.assign({ spush: 1, sjab: 1, spushup: 1, scharge: 1, sraise: 1, bshot: 1, bfull: 1, bdiag: 1, brapid: 1, braise: 1 }, PXU_CAST);   // 투사체를 쏘는 동작
const FMOT_AOE_V = { bats: 150, nova: 230, spin: 260, slam: 240, rats: 120, roots: 240, storm: 700, blizzard: 300 };   // 광역기가 퍼지는 빠르기 (논리 픽셀/초)
const FMOT_NAME = { icequeen: '눈보라', stormwyvern: '번개 폭풍', ratking: '쥐 떼', elder: '뿌리 솟기', giant: '땅 울림', dracula: '박쥐 떼', lichking: '죽음의 파동', reaper: '죽음의 회전', deathknight: '암흑 강타', banshee: '죽음의 비명', ghosttree: '원혼의 뿌리', seraphknight: '천벌' };   // 광역기 이름 (알림 · 3번째부터의 우두머리도 광역기를 쓴다)
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
  const cat = x.type === 'aoe' ? 'skl' : A.skl && !MONS[f.id].aoe && !f.aoe && (x.c || sta) ? 'skl' : x.k === 'magic' && A.mag ? 'mag' : A.atk ? 'atk' : 'mag';
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
  if (FMOT_NAME[f.id]) callout(fq[0], fq[1] - H - 6, FMOT_NAME[f.id] + '!', 'boss');
  if (k === 'bats') tg.forEach((q, i) => { for (let j = 0; j < 3; j++) V.fx.push({ k: 'ubat', id, x0: cx - 6 * dir + (j - 1) * 6, y0: cy - 10 + j * 6, x1: q[0] + (j - 1) * 4, y1: q[1] - 14 * zAt(q[1]) + (j - 1) * 5, t0: T1 + j * 0.06, d: Math.abs(q[0] - cx) / FMOT_AOE_V.bats, s: i * 3 + j }); });
  else if (k === 'rats') tg.forEach((q, i) => { for (let j = 0; j < 3; j++) V.fx.push({ k: 'urat', id, x0: cx - 8 * dir + (j - 1) * 5, y0: fq[1] - 1 - j * 3, x1: q[0] + (j - 1) * 6, y1: q[1] - 1 - j * 2, t0: T1 + j * 0.07, d: Math.abs(q[0] - cx) / FMOT_AOE_V.rats, s: i * 3 + j }); });
  else if (k === 'nova') V.fx.push({ k: 'unova', id, x: cx, y: fq[1] - 2, t0: T1, d: 0.9, r1: Math.max(60, ...tg.map(q => Math.abs(q[0] - cx) + 16)) });
  else if (k === 'spin') { V.fx.push({ k: 'uspin', id, x: cx, y: cy + 4, r: H * 0.5 + 6, t0: T1 - 0.12, d: 0.42 }); const xe = tg.length ? Math.min(...tg.map(q => q[0])) - 10 : cx - 120; V.fx.push({ k: 'skw', id, x0: cx - 18 * dir, y: cy + 6, dir: -dir, t0: T1, d: Math.abs(cx - 18 * dir - xe) / SK_WAVE + 0.3 }); }
  else if (k === 'storm') V.fx.push({ k: 'ustorm', id, t0: T1 - 0.35, d: 1.3, tg: tg.map(q => [q[0], q[1] - 100]) });
  else if (k === 'blizzard') { const xe = tg.length ? Math.min(...tg.map(q => q[0])) - 40 : cx - 160; V.fx.push({ k: 'ublizz', id, x0: cx - 10 * dir, x1: xe, y: fq[1], t0: T1 - 0.15, d: 1.5, tg }); }   // 눈보라 (빌드 49): 여왕 앞에서 파티 쪽으로 눈이 휘몰아친다
  else if (k === 'slam' || k === 'roots') { const xe = tg.length ? (dir > 0 ? Math.min(...tg.map(q => q[0])) - 12 : Math.max(...tg.map(q => q[0])) + 12) : cx - 120 * dir; V.fx.push({ k: 'skq', id, x0: cx - 22 * dir, gy: fq[1], xe, dir: -dir, t0: T1, d: Math.abs(cx - xe) / SK_QUAKE + 1.2 }); }
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
  if (f.k === 'urat') {   // 쥐 떼: 땅을 따라 종종걸음으로 달려간다 (뭉툭 칸 6×3)
    const q = Math.min(1, e / f.d), x = f.x0 + (f.x1 - f.x0) * q, y = f.y0 + (f.y1 - f.y0) * q - Math.abs(Math.sin(e * 26 + f.s)) * 2, st = Math.floor(e * 20 + f.s) % 2, L = f.x1 < f.x0;
    if (q >= 1) return;
    const A = st ? ['..cC...', '.cCCCe.', 'sCCCCCC', '..c..c.'] : ['..cC...', '.cCCCe.', 'sCCCCCC', '.c..c..'], C = { c: '#6a5848', C: '#9a8470', e: '#ff4a3a', s: '#d89a90' };
    const at = (i, j) => [x + (L ? 6 - i : i - 3) * 2, y + (j - 3) * 2];
    A.forEach((row, j) => [...row].forEach((ch, i) => { if (ch === '.') return; for (const [ox, oy] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) { const ii = i + ox, jj = j + oy; if (!(A[jj] && A[jj][ii] && A[jj][ii] !== '.')) { const [qx, qy] = at(ii, jj); skQ(g, qx, qy, '#1a1010'); } } }));
    A.forEach((row, j) => [...row].forEach((ch, i) => { if (ch !== '.') { const [qx, qy] = at(i, j); skQ(g, qx, qy, C[ch]); } }));
    return;
  }
  if (f.k === 'ustorm') {   // 번개 폭풍: 파티 머리 위에 먹구름(뭉툭 칸 덩이) · 번쩍일 때 밝아진다
    const k = e / f.d, al = k < 0.2 ? k / 0.2 : k > 0.75 ? Math.max(0, 1 - (k - 0.75) / 0.25) : 1, fl = Math.floor(e * 14) % 5 === 0 && k > 0.25 && k < 0.7;
    f.tg.forEach(([x, y], i) => { for (let j = 0; j < 9; j++) { const ox = (skH(i * 9 + j, 21) - 0.5) * 30, oy = (skH(i * 9 + j, 22) - 0.5) * 8 - (1 - Math.min(1, k * 3)) * 10; skQ(g, x + ox, y + oy, fl ? '#c8d8f0' : j % 3 ? '#2a3448' : '#3e4a64', al * 0.9); skQ(g, x + ox + 2, y + oy, fl ? '#e8f0ff' : '#34405a', al * 0.8); } });
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
