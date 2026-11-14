/* ───────── 탈것 (빌드 65): 랑기수(ranger 계열) = 늑대 · 용기수(dragoon 계열) = 와이번 ─────────
   사용자 11-12 17:23 「탈것 모습: 늑대 · 와이번 A~D … 이건 전부 추가하고 가장 첫 시안이 기본이고, 나머지 시안들은 추후 얻는 법 넣을 예정이니 일단 게임 안에 넣어 둬」
   · 「랑기수 전직 때 늑대 펫 보내기」(data-class65.js req.petWolf · econ.js promote).
   결정(tools/saved/ride65/DECISIONS.md): 옆모습 · 앞모습(상단 앞 줄 · 영웅 창) · 자는 모습(야영 · 마구간) · 전투 대형 맨 뒷줄 ·
   와이번은 떠 있다(그림자는 땅에) · 앉기 · 눕기 · 쓰러짐 · 들것은 내려서.
   그림: data-ride65.js RIDE65 (반 해상도 줄 → pxUp → pxBake — PXU 몬스터 그림과 같은 굽기).
   기수: 모험가 그림(옆 pxsAdvGrid · pxsMotGrid / 앞 pxAdvGrid)에서 엉덩이 아래 다리 글자(U u B b)만 지우고 걸터앉은 다리를 얹은 뒤,
         엉덩이(RIDE_HIP)를 탈것 장 seat 칸의 왼쪽 위 모서리에 맞춘다(둘 다 뭉툭 칸 모서리라 칸이 어긋나지 않는다).
         탄 채 하는 동작은 내딛기 · 웅크림 · 몸 나감 · 뛰기를 뺀다(pxs.js PXS_RIDE).
   저장: a.ride = { wolf: { look, name, lv }, wyv: { look } } — 없으면 모습 A. 늑대 이름 · 레벨은 랑기수 전직 때 보낸 늑대 펫의 것. */
const RIDE_LOOKS = ['A', 'B', 'C', 'D'];
const RIDE_KIND_NAME = { wolf: '늑대', wyv: '와이번', sea: '해룡' };   // 해룡(빌드 69): 그림 넷(RIDE65.sea)만 — 해룡기수(용기수 다음 4차) · 해룡 펫이 들어올 때 rideKind에 잇는다
// 이 모험가가 타는 것 (직업 계열로): 용기수 계열 → 와이번 · 랑기수 계열 → 늑대
function rideKind(a) {
  if (!a || !a.cls || !CLASSES[a.cls]) return null;
  const ch = chainOf(a.cls);
  return ch.includes('dragoon') ? 'wyv' : ch.includes('ranger') ? 'wolf' : null;
}
const rideLook = (a, k) => { const r = a && a.ride && a.ride[k]; return r && RIDE65[k][r.look] ? r.look : 'A'; };
const rideData = a => { const k = rideKind(a); return k ? RIDE65[k][rideLook(a, k)] : null; };
// 창에 쓰는 이름: 「은빛 늑대 「찹쌀」 Lv31」
function rideName(a) {
  const k = rideKind(a); if (!k) return '';
  const r = (a.ride && a.ride[k]) || {}, L = RIDE65[k][rideLook(a, k)];
  return L.name + (r.name ? ` 「${r.name}」` : '') + (r.lv ? ` Lv${r.lv}` : '');
}
// 전직으로 탈것이 바뀔 때 (용기수: 와이번) · 옛 저장의 랑기수 · 용기수에게 기본 모습
function rideEnsure(a) {
  const k = rideKind(a); if (!k) return;
  a.ride = a.ride || {};
  if (!a.ride[k]) a.ride[k] = { look: 'A' };
}

/* 탈것 한 장 굽기 (part: side · front · over(앞모습 머리 덮개) · sleep) → s.seat = 기수 엉덩이 칸 왼쪽 위 모서리(그림 좌표, 논리 픽셀) */
const RIDE_PAL0 = (() => { const b = pxRamp('#8a8a8a'); return { C: b.b, c: b.s, d: b.d, Q: b.l, K: '#2a1e2a', k: '#2a1e2a', w: '#ffffff', e: '#ff4a3a', v: '#6a4428', S: '#e0ac7e', s: '#b08058', M: '#a8a8b4', N: '#7a7a88', n: '#4e4e5a', x: '#e8e8f0', G: '#d8a838', g: '#a07a28', O: '#b8864e' }; })();
function rideMSpr(k, look, part, f) {
  const key = 'RM|' + k + look + '|' + part + '|' + f, hit = PXC.get(pxKeyOf(key));
  if (hit) return hit;
  const L = RIDE65[k][look] || RIDE65[k].A, P = L[part === 'over' ? 'front' : part], rows = part === 'over' ? P.over[f] : P.fr[f], H0 = rows.length;
  const s = pxBake(key, pxUp(rows), Object.assign({}, RIDE_PAL0, L.pal, P.pal || {}), P.ax * 2 + 1, (H0 - 1) * 2 + 1);
  const st = part !== 'over' && P.seat && P.seat[f];
  if (st) s.seat = [s.ax - 1 + 2 * (st[0] - P.ax), s.ay - 1 + 2 * (st[1] - (H0 - 1))];
  return s;
}

/* 기수 (옆모습): 걸터앉은 다리 — 허벅지가 앞으로, 무릎에서 꺾여 종아리가 아래로, 발끝은 앞 (몸 블록 왼쪽 위 기준 x 3 · y 6) */
const RIDE_HIP = [SX + 7, SY + 8];
const RIDE_LEG = pxRows(`
...UUUUUUu...
..UUUUUUUUu..
.....uUUUUUu.
.......UUUu..
.......UUUu..
.......UUUu..
......BBBBb..
......BBBBBBb
`);
// 기수 (앞모습): 탈것 등을 사이에 두고 벌려 앉은 다리 (몸 블록 왼쪽 위 기준 x −6 · y 7)
const RIDE_HIPF = [BX + 8, BY + 8];
const RIDE_LEGF = pxRows(`
......UUUUUUUUUUUUUUu.......
...UUUUUUu........UUUUUUu...
.UUUUu..............UUUUu...
UUUu..................UUUu..
UUu....................UUu..
UUu....................UUu..
BBBb..................BBBb..
BBBb..................BBBb..
`);
const rideRKey = (a, pose, fr) => { const l = a.look || {}, w = a.eq && a.eq.weapon; return a.cls + '|' + (l.hair || '') + (l.skin || '') + '|' + ((a.id || 0) % 3) + '|' + (w ? w.base : '-') + '|' + pxOffKey(a) + '|' + pose + fr; };
function rideLegsOff(g, y0) { for (let y = y0; y < g.length; y++) for (let x = 0; x < g[y].length; x++) if ('UuBb'.includes(g[y][x])) g[y][x] = '.'; }
function rideRiderS(a, pose, fr) {
  const key = 'RS|' + rideRKey(a, pose, fr), hit = PXC.get(pxKeyOf(key));
  if (hit) return hit;
  const L = advLook(a), o = PXS_RIDE; let g;
  PXS_RIDE = 1;
  try { g = pose.startsWith('m:') ? pxsMotGrid(a, pose.slice(2), fr, L) : pxsAdvGrid(a, pose, fr, L); } finally { PXS_RIDE = o; }
  rideLegsOff(g, SY + 6);
  pxPut(g, RIDE_LEG, SX + 3, SY + 6);
  const s = pxBake(key, g, Object.assign(pxPal(L, a.look || {}), pxOffPal(a)), RIDE_HIP[0], RIDE_HIP[1]);
  if (g.mfx !== undefined) s.mfx = g.mfx;
  return s;
}
function rideRiderF(a, pose, fr) {
  const key = 'RF|' + rideRKey(a, pose, fr), hit = PXC.get(pxKeyOf(key));
  if (hit) return hit;
  const L = advLook(a), g = pxAdvGrid(a, pose, fr, L);
  rideLegsOff(g, BY + 7);
  pxPut(g, RIDE_LEGF, BX - 6, BY + 7);
  return pxBake(key, g, Object.assign(pxPal(L, a.look || {}), pxOffPal(a)), RIDE_HIPF[0], RIDE_HIPF[1]);
}
// 탈것 장 고르기: 옆 — 서 있기 idle0 · idle1 / 걷기 run0~3 / 공격 · 동작 idle0, 앞 — front0 · front1
function rideFrames(pose, fr, side) {
  if (side) return pose === 'walk' ? ['run' + (fr % 4), 'idle', 0] : pose === 'idle' ? ['idle' + (fr % 2), 'idle', fr % 2] : ['idle0', pose, fr];
  return pose === 'idle' || pose === 'walk' ? ['front' + (fr % 2), 'idle', fr % 2] : ['front0', pose, fr];
}
/* 탈것 + 기수 한 장 (drawAdv가 부른다). 닻 = 탈것 발 가운데(땅). s.lift = 떠 있는 높이(와이번, 논리 픽셀) · s.ro = 기수가 서 있다면 발이 올 자리(닻에서, 효과 칸용) */
function rideComp(a, pose, fr, side) {
  const k = rideKind(a), look = rideLook(a, k), L = RIDE65[k][look], [mf, rp, rf] = rideFrames(pose, fr, side);
  const key = 'RC|' + (side ? 's' : 'f') + k + look + mf + '|' + rideRKey(a, rp, rf), kk = pxKeyOf(key);
  let s = PXC.get(kk);
  if (s) return s;
  const m = rideMSpr(k, look, side ? 'side' : 'front', mf), r = side ? rideRiderS(a, rp, rf) : rideRiderF(a, rp, rf), ov = side ? null : rideMSpr(k, look, 'over', mf);
  const [sx, sy] = m.seat, rx = sx - r.ax, ry = sy - r.ay, ox = ov ? m.ax - ov.ax : 0, oy = ov ? m.ay - ov.ay : 0;
  const x0 = Math.min(0, rx, ox), y0 = Math.min(0, ry, oy), x1 = Math.max(m.w, rx + r.w, ov ? ox + ov.w : 0), y1 = Math.max(m.h, ry + r.h, ov ? oy + ov.h : 0);
  const [cv, g] = mkCanvas(x1 - x0, y1 - y0);
  g.drawImage(m.cv, -x0, -y0);
  g.drawImage(r.cv, rx - x0, ry - y0);
  if (ov) g.drawImage(ov.cv, ox - x0, oy - y0);   // 앞모습: 탈것 머리 · 목이 기수 앞에
  s = { cv, ax: m.ax - x0, ay: m.ay - y0, w: x1 - x0, h: y1 - y0, lift: side && L.float ? L.float * 2 + 5 : 0, ro: side ? [sx - 1 - m.ax, sy + 5 - m.ay] : [sx - m.ax, sy + 5 - m.ay] };
  if (r.mfx !== undefined) s.mfx = r.mfx;
  PXC.set(kk, s);
  if (PXC.size > 1400) PXC.delete(PXC.keys().next().value);
  return s;
}
// 효과 칸 · 쏘는 자리 (view.js motFx · motTip · skfx.js): 탄 기수의 서 있는 닻이 탈것 닻에서 얼마나 떨어졌나 (옆모습 동작 = 탈것 idle0, 떠 있는 높이 포함)
function rideOff(a) {
  const k = rideKind(a); if (!k) return null;
  const look = rideLook(a, k), m = rideMSpr(k, look, 'side', 'idle0'), L = RIDE65[k][look];
  return [m.seat[0] - 1 - m.ax, m.seat[1] + 5 - m.ay - (L.float ? L.float * 2 + 5 : 0)];
}
// 탄 기수로 셈하기: PXS_RIDE를 켜고 fn(효과 자리) — 타지 않으면 fn(null)
function rideDo(a, fn) {
  const ro = rideOff(a); if (!ro) return fn(null);
  const o = PXS_RIDE; PXS_RIDE = 1;
  try { return fn(ro); } finally { PXS_RIDE = o; }
}
// 동작 그림 (효과 칸 mfx · 가린 칸 occ를 읽는 곳): 타면 기수 그림
const advMotSpr = (a, mk, f) => rideKind(a) ? rideRiderS(a, 'm:' + mk, f) : pxsAdvSprite(a, 'm:' + mk, f);
// 발밑 그림자 반지름 (z 1 논리 픽셀) · 기수 머리 높이(위 −)
const rideShadow = a => { const k = rideKind(a); return k === 'wolf' ? 22 : k === 'wyv' || k === 'sea' ? 18 : 0; };
const rideTop = a => { const ro = rideOff(a); return ro ? ro[1] : 0; };
// 자는 탈것 (야영 · 마구간): sleep0 · sleep1 (숨쉬기)
function rideSleepSpr(a, fr) { const k = rideKind(a); return k ? rideMSpr(k, rideLook(a, k), 'sleep', 'sleep' + (fr % 2)) : null; }
function drawRideSleep(g, a, t, z, ph) {
  const s = rideSleepSpr(a, Math.floor(t * 0.8 + (ph || 0)) % 2); if (!s) return;
  g.save(); g.scale(z || 1, z || 1); pxBlit(g, s); g.restore();
}
STORY.v65.push('탈것 — 랑기수는 늑대, 용기수는 와이번을 타고 싸운다(전투 대형 맨 뒷줄 · 와이번은 떠 있다). 랑기수로 전직하려면 늑대 펫 Lv30 하나를 보낸다 — 그 늑대가 탈것이 된다. 야영 · 상단에서는 내려서 쉬고, 탈것은 곁에서 웅크려 잔다(상단 마구간).');
