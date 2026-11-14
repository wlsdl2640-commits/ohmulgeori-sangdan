/* ───────── 빌드 31: 계절과 날씨 ─────────
   날마다 하늘(맑음·흐림·비·뇌우·눈·폭설·안개, 여름에는 장마)과 바람이 정해지고, 계절·시간·땅의 기후로 온도가 정해진다.
   온도: 온화함 능력치 +10% · 더움/쌀쌀함 -10% · 무더위·열대야·추위·강추위 -30%. 밤(22~04시)과 새벽(04~10시)에는 한 단계 춥다.
   더우면 이동이 느려지고 스킬 재사용이 길어진다. 추우면 이동이 느려지고 기본 공격 대기가 길어진다.
   야영(노숙): 온도에 따라 피로 회복 ×1.1/×0.9/×0.7, 비·폭설이면 모닥불을 못 피워 ×0.4, 강풍이면 모닥불이 약해 ×0.7.
   텐트(정찰가)는 비와 바람을 막고, 대형 텐트(탐험가)는 추위까지 막는다. 날씨는 하루 단위로 미리 정해져 있어 예보를 볼 수 있다. */
const WXC = { d: {}, seed: null };
const hash01 = n => { let x = Math.imul((n | 0) ^ 0x9e3779b9, 0x85ebca6b); x ^= x >>> 13; x = Math.imul(x, 0xc2b2ae35); x ^= x >>> 16; return (x >>> 0) / 4294967296; };
function wxSeed() { if (!S.wx) S.wx = { seed: Math.floor(Math.random() * 1e9) }; if (WXC.seed !== S.wx.seed) { WXC.seed = S.wx.seed; WXC.d = {}; } return S.wx.seed; }
const wxH = (n, k) => hash01(n * 131 + k * 7919 + wxSeed());
const dayIndexOf = (y, m, d) => ((y - START.year) * 12 + (m - START.month)) * MONTH_DAYS + (d - 1);
// 장마: 해마다 한 번, 6월 중순~7월 초에 6~9일 이어지는 비
function monsoonOf(y) {
  const a = dayIndexOf(y, 6, 10) + Math.floor(hash01(y * 977 + wxSeed()) * 22);
  return [a, a + 6 + Math.floor(hash01(y * 1307 + wxSeed()) * 4)];
}
function wxDay(dn) {
  wxSeed();
  if (WXC.d[dn]) return WXC.d[dn];
  const P = dateParts(dn * DAY_SEC), se = seasonOfMonth(P.m);
  let r = wxH(dn, 1), sky = 'clear';
  for (const [k, q] of WX_SKY_P[se]) { if (r < q) { sky = k; break; } r -= q; }
  const [m0, m1] = monsoonOf(P.y), mon = dn >= m0 && dn < m1;
  if (mon) sky = 'monsoon';
  const wr = wxH(dn, 2), wind = wr < (se === 3 ? 0.14 : 0.1) ? 2 : wr < 0.4 ? 1 : 0;
  const heat = se === 1 && !mon && wxH(Math.floor(dn / 3), 3) < 0.35;   // 사흘씩 이어지는 폭염
  const cold = se === 3 && wxH(Math.floor(dn / 3), 4) < 0.3;            // 사흘씩 이어지는 한파
  return (WXC.d[dn] = { dn, se, sky, wind, heat, cold, mon });
}
// 원정 중인 곳의 기후 (집·성문이면 평범)
function wxClim(e) {
  if (!e) return {};
  const F = FIELDS[e.field];
  if (e.area === 'raid' || e.area === 'arena') return { indoor: 1 };
  if (e.area === 'wave') return {};
  if (e.area === 'dungeon') { const b = F && F.dungeon && F.dungeon.bg; return DUNGEON_CLIMATE[b] != null ? { fixed: DUNGEON_CLIMATE[b] } : { indoor: 1 }; }
  if (e.area === 'trade') { const T = TRADE[F.trade]; return (T && T.clim && CLIMATE[T.clim]) || {}; }
  return (F && (CLIMATE[e.field] || CLIMATE[F.bg])) || {};
}
// 지금 그곳의 날씨: { sky, wind, T, sun, se, … } (실내면 { indoor: 1 })
function wxNow(e, t) {
  t = t == null ? S.t : t;
  const C = wxClim(e);
  if (C.indoor) return { indoor: 1 };
  const dn = dayOf(t), D = wxDay(dn), dp = (((t % DAY_SEC) + DAY_SEC) % DAY_SEC) / DAY_SEC, ph = phaseOf(t);
  const sun = dp > 0.06 && dp < 0.66, coldHr = ph === 3 || ph === 0;
  if (C.fixed != null) return { fixed: 1, sky: 'clear', wind: 0, T: C.fixed, sun, se: D.se, coldHr, C };
  let sky = D.sky, wind = D.wind;
  const wetSky = ['rain', 'monsoon', 'storm', 'snow', 'heavy'].includes(sky);
  if (C.dry && (wetSky || sky === 'fog')) sky = 'cloud';
  if (C.sand && wind === 2) sky = 'sand';
  if (C.snowy) { if (sky === 'rain' || sky === 'monsoon') sky = 'snow'; if (sky === 'storm') sky = 'heavy'; }
  if (C.cloudy && wetSky) sky = 'cloud';
  if (C.stormy && (sky !== 'clear' || wxH(dn, 5) < 0.4)) sky = 'storm';
  if (C.wet && sky === 'clear' && wxH(dn, 6) < (C.wet - 1) * 0.5) sky = 'rain';
  if (C.wind && wind < 2 && wxH(dn, 7) < 0.1 * (C.wind - 1)) wind = 2;
  if (C.clear) { sky = 'clear'; wind = 0; }
  let T = [0, 1, -1, -1][D.se];
  if (D.se === 1 && D.heat) T = 2;
  if (D.se === 3 && (D.cold || sky === 'heavy')) T = -2;
  if (coldHr && !(D.se === 1 && D.heat)) T -= 1;   // 밤·새벽은 한 단계 춥다 (폭염이면 열대야)
  T = Math.max(-2, Math.min(2, T)) + (C.t || 0);    // 계절 온도를 먼저 정하고 땅의 기후로 민다 (사막의 강추위 → 쌀쌀함)
  T = Math.max(C.lo != null ? C.lo : -2, Math.min(C.hi != null ? C.hi : 2, T));
  return { sky, wind, T, sun, se: D.se, coldHr, heat: D.heat, cold: D.cold, mon: D.mon, C };
}
const wxTName = w => (w.fixed ? WX_T[w.T].name : w.T === 2 ? (w.sun ? '무더위' : '열대야') : w.T === -2 ? (w.se === 3 || (w.C && w.C.snowy) ? '강추위' : '추위') : WX_T[w.T].name);
function wxSkyName(w) {
  if (w.fixed) return w.T > 0 ? '열기' : '냉기';
  const n = (WX_SKY[w.sky] || WX_SKY.clear).name;
  return w.wind === 2 && w.sky !== 'sand' ? `${n} · 강풍` : n;
}
const wxLabel = w => (!w || w.indoor ? '실내' : `${wxSkyName(w)} · ${wxTName(w)}`);
const wxTCls = w => (!w || w.indoor || w.T == null ? '' : w.T > 0 ? 'wx-hot' : w.T < 0 ? 'wx-cold' : 'wx-ok');
// 모험가 한 명에게 미치는 날씨 효과: stat(능력치) · move(이동) · sk(스킬 재사용) · ba(기본 공격 대기)
function wxFx(w, a, ff) {
  if (!w || w.indoor || w.T == null) return null;
  ff = ff || {};
  const coldRes = !!ff.coldRes, hotRes = !!ff.hotRes;   // 도시락(뜨거운 수프·얼음 빙수)만 추위·더위를 막는다
  const W = (a && a.wxt && TRAITS[a.wxt]) || {};          // 날씨 특성: 모험가마다 하나 (그 날씨에 약하다)
  let T = w.T, res = false;
  if (T < 0 && coldRes) { T = 0; res = true; }
  if (T > 0 && hotRes) { T = 0; res = true; }
  let stat = res ? 1 : WX_T[T].stat, move = 1, sk = 1, ba = 1;
  if (T > 0) { move = T === 2 ? 0.85 : 0.92; sk = T === 2 ? 1.25 : 1.1; }
  if (T < 0) { move = T === -2 ? 0.85 : 0.92; ba = T === -2 ? 1.25 : 1.1; }
  const SK = WX_SKY[w.sky] || {};
  if (SK.move) move *= SK.move;
  if (w.T < 0 && !coldRes) stat += W.wxCold || 0;
  if (w.T > 0 && !hotRes) stat += W.wxHot || 0;
  if (SK.wet || w.sky === 'snow') stat += W.wxWet || 0;
  if (w.wind === 2) stat += W.wxWind || 0;
  return { stat: Math.max(0.4, stat), move, sk, ba, res };
}
// 이 날씨에 약한 모험가인가 (날씨 특성) — 도시락이 막아 주면 아니다
function wxtHits(a, w, ff) {
  const W = a && a.wxt && TRAITS[a.wxt]; ff = ff || {};
  if (!W || !w || w.indoor || w.T == null) return false;
  const SK = WX_SKY[w.sky] || {};
  return !!((W.wxCold && w.T < 0 && !ff.coldRes) || (W.wxHot && w.T > 0 && !ff.hotRes) || (W.wxWet && (SK.wet || w.sky === 'snow')) || (W.wxWind && w.wind === 2));
}
// 날씨 특성 칩 (모험가 창·선술집 손님)
const wxtChip = a => { const W = a && a.wxt && TRAITS[a.wxt]; return W ? `<span class="trait neg wxt" title="${esc(W.desc)}"><b>${W.name}</b> <small>${esc(W.desc)} · 날씨 특성</small></span>` : ''; };
// 야영(노숙)의 피로 회복 배율
function campWxF(p, w) {
  if (!w || w.indoor || w.T == null) return 1;
  const tent = tentOf(p), big = tent >= 2, SK = WX_SKY[w.sky] || {};
  let f = w.T === 0 ? 1.1 : Math.abs(w.T) === 1 ? 0.9 : 0.7;
  if (big && w.T < 0) f = 1;               // 대형 텐트: 추위를 막는다
  if (tent <= 1 && SK.wet) f *= 0.4;       // 비·폭설: 모닥불 없이 젖은 채 잔다
  if (tent <= 1 && w.wind === 2) f *= 0.7; // 강풍: 모닥불이 약하다
  return f;
}
const campWet = (p, w) => !!(w && !w.indoor && (WX_SKY[w.sky] || {}).wet && tentOf(p) <= 1);
const campWindy = (p, w) => !!(w && !w.indoor && w.wind === 2 && tentOf(p) <= 1);

/* ───────── 원정 중 효과 (날씨 + 도시락): derive가 부른다 ───────── */
const awayParty = a => (a && a.status === 'away' && S ? S.parties.find(p => p.exp && p.members.includes(a.id)) : null);
function expMods(d, a) {
  const p = awayParty(a); if (!p) return d;
  const e = p.exp, ff = foodFx(e);
  const w = wxFx(wxNow(e), a, ff);
  if (w) { d.atk *= w.stat; d.matk *= w.stat; d.def *= w.stat; d.maxHp = Math.max(1, Math.round(d.maxHp * w.stat)); d.move *= w.move; d.wxSk = w.sk; d.wxBa = w.ba; d.wxStat = w.stat; }
  if (ff.atk) d.atk *= 1 + ff.atk;
  if (ff.matk) d.matk *= 1 + ff.matk;
  if (ff.def) d.def *= 1 + ff.def;
  if (ff.hp) d.maxHp = Math.round(d.maxHp * (1 + ff.hp));
  if (ff.move) d.move *= 1 + ff.move;
  if (ff.crit) { const c0 = d.crit + ff.crit; d.crit = Math.min(CAP.crit, c0); if (c0 > CAP.crit) d.critDmg = Math.min(CAP.critDmg, (d.critDmg || 0) + (c0 - CAP.crit) * CRIT_OVER); }   // 빌드 69: 치명타 50%까지 · 넘친 몫은 치명타 피해로
  if (ff.regen) d.hpRegen = (d.hpRegen || 0) + ff.regen;
  if (ff.carry) d.carry += ff.carry;
  for (const k in FOOD_RES) if (ff[k]) { const f = FOOD_RES[k]; d.res = Object.assign({}, d.res); d.res[f] = Math.min(FIGHT.resMax, (d.res[f] || 0) + 0.1); }   // 뜨거운 수프 · 얼음 빙수: 그 속성 피해 −10% (빌드 63)
  return d;
}

/* ───────── 화면: 아이콘 · 상태줄 · 예보 창 · 풍경 위 날씨 ───────── */
const WX_PX = {
  sun:   ['...y...', '.y.y.y.', '..yyy..', 'yyyyyyy', '..yyy..', '.y.y.y.', '...y...'],
  moon:  ['..lll..', '.ll....', 'll.....', 'll.....', 'll.....', '.ll....', '..lll..'],
  cloud: ['.......', '..www..', '.wwwww.', 'wwwwwww', 'wwwwwww', '.......', '.......'],
  rain:  ['..www..', '.wwwww.', 'wwwwwww', '.......', '.b.b.b.', 'b.b.b..', '.......'],
  storm: ['..ggg..', '.ggggg.', 'ggggggg', '...y...', '..yy.b.', '.b.y.b.', '..y....'],
  snow:  ['..www..', '.wwwww.', 'wwwwwww', '.......', '.w.w.w.', 'w.w.w..', '.w.w.w.'],
  heavy: ['.ggggg.', 'ggggggg', '.w.w.w.', 'w.w.w.w', '.w.w.w.', 'w.w.w.w', '.w.w.w.'],
  fog:   ['.......', 'wwwww..', '.......', '..wwwww', '.......', 'wwwww..', '.......'],
  sand:  ['.......', 'ss.sss.', '.......', 'sss.ss.', '.......', '.ss.sss', '.......'],
  wind:  ['.......', 'wwwww..', '....w..', '.wwww..', '.......', 'wwwwww.', '.....w.'],
  hot:   ['...r...', '..rrr..', '.rryrr.', '.ryyyr.', '.ryyyr.', '..rrr..', '.......'],
  cold:  ['...b...', 'b..b..b', '.b.b.b.', 'bbbbbbb', '.b.b.b.', 'b..b..b', '...b...'],
  room:  ['...k...', '..kkk..', '.kkkkk.', 'kkkkkkk', '.k.k.k.', '.k...k.', '.kkkkk.']
};
const WX_PAL = { y: '#f7d04a', l: '#e8e8c8', w: '#d8e0ec', b: '#6aa8ff', g: '#8a94a8', s: '#d8b070', r: '#ff6a3a', k: '#a89a80' };
const WX_URL = {};
function wxIconURL(name) {
  if (WX_URL[name]) return WX_URL[name];
  const pat = WX_PX[name] || WX_PX.sun, [c, x] = mkCanvas(pat[0].length, pat.length);
  pat.forEach((row, y) => { for (let i = 0; i < row.length; i++) if (row[i] !== '.') R(x, i, y, 1, 1, WX_PAL[row[i]]); });
  return (WX_URL[name] = c.toDataURL());
}
function wxIcon(w) {
  if (!w || w.indoor) return 'room';
  if (w.fixed) return w.T > 0 ? 'hot' : 'cold';
  if (w.sky === 'storm' || w.sky === 'heavy' || w.sky === 'snow' || w.sky === 'sand' || w.sky === 'fog') return w.sky;
  if (w.sky === 'rain' || w.sky === 'monsoon') return 'rain';
  if (w.wind === 2) return 'wind';
  if (w.sky === 'cloud') return 'cloud';
  return w.sun ? 'sun' : 'moon';
}
const wxImg = w => `<img class="wxi" src="${wxIconURL(wxIcon(w))}" alt="">`;
// 효과 한 줄 (모험가 없이 일반 체질 기준)
function wxFxText(w, p) {
  if (!w || w.indoor) return '날씨 영향 없음';
  const f = wxFx(w, { traits: [] }, null), out = [];   // 날씨 특성 없이 (누구나 받는 몫)
  out.push(`능력치 ${f.stat >= 1 ? '+' : ''}${Math.round((f.stat - 1) * 100)}%`);
  if (f.move < 1) out.push(`이동 ×${f.move.toFixed(2)}`);
  if (f.sk > 1) out.push(`스킬 재사용 ×${f.sk}`);
  if (f.ba > 1) out.push(`기본 공격 대기 ×${f.ba}`);
  if (p) { const cf = campWxF(p, w); out.push(`야영 피로 회복 ×${(Math.round(cf * 100) / 100)}${campWet(p, w) ? ' (비: 모닥불 없음)' : campWindy(p, w) ? ' (강풍)' : ''}`); }
  return out.join(' · ');
}
function hudWeather() { const w = wxNow(null); return `<span class="wx ${wxTCls(w)}">${wxImg(w)}${SEASONS[w.se].name} · ${wxLabel(w)}</span>`; }
// 날씨 창: 오늘과 앞으로 이틀, 원정 중인 곳의 날씨
function wxDayRow(dn) {
  const noon = dn * DAY_SEC + DAY_SEC * 0.4, night = dn * DAY_SEC + DAY_SEC * 0.9, a = wxNow(null, noon), b = wxNow(null, night), D = wxDay(dn);
  const tags = [D.mon ? '장마' : '', D.heat ? '폭염' : '', D.cold ? '한파' : ''].filter(Boolean).join(' · ');
  return `<div class="li"><div class="grow stack"><span>${dayLabel(dn)}${dn === today() ? ' <span class="tag gold-t">오늘</span>' : ''} <span class="muted">· ${SEASONS[D.se].name}</span>${tags ? ` <span class="tag red-t">${tags}</span>` : ''}</span><span class="sub">낮 ${wxImg(a)} <span class="${wxTCls(a)}">${wxLabel(a)}</span> · 밤 ${wxImg(b)} <span class="${wxTCls(b)}">${wxLabel(b)}</span></span></div></div>`;
}
Object.assign(WIN_TITLE, { co_wx: '날씨' });
PANELS.co_wx = () => {
  const w = wxNow(null), dn = today();
  const away = S.parties.filter(p => p.exp);
  return `<div class="card hl"><div class="row">${wxImg(w).replace('class="wxi"', 'class="wxi big"')}<div class="grow"><div class="h">${WORLD.capital || '하르겐'} · ${SEASONS[w.se].name} <small class="${wxTCls(w)}">${wxLabel(w)}</small></div><div class="sub">${wxFxText(w)}</div></div></div></div>
    <div class="sec"><b>예보</b><span>낮(12시)과 밤(23시)</span></div>
    <div class="list">${[0, 1, 2].map(k => wxDayRow(dn + k)).join('')}</div>
    ${away.length ? `<div class="sec"><b>원정 중인 곳</b><span>땅마다 기후가 달라요</span></div><div class="list">${away.map(p => { const x = wxNow(p.exp), C = wxClim(p.exp); return `<div class="li"><div class="grow stack"><span>${esc(p.name)} <span class="muted">· ${esc(whereStr(p.exp))}</span></span><span class="sub">${wxImg(x)} <span class="${wxTCls(x)}">${wxLabel(x)}</span> · ${wxFxText(x, p)}</span>${C.note ? `<span class="sub muted">${C.note}</span>` : ''}${foodOf(p.exp) ? `<span class="sub gold-t">도시락 ${FOODS[foodOf(p.exp)].name} · ${foodFxText(FOODS[foodOf(p.exp)].fx)}</span>` : ''}</div></div>`; }).join('')}</div>` : ''}
    <details class="card"><summary>날씨 규칙</summary><div class="log">
      <div>온화함 능력치 +10% · 더움·쌀쌀함 -10% · 무더위·열대야·추위·강추위 -30%. 밤(22~04시)·새벽(04~10시)은 한 단계 춥다.</div>
      <div>봄은 온화하고, 여름 한낮은 덥고(폭염이면 무더위, 밤에는 열대야), 가을은 쌀쌀하고, 겨울은 쌀쌀하다가 밤과 한파에 강추위. 여름에는 한 번 장마가 온다.</div>
      <div>더우면 이동 ×0.92(무더위 ×0.85)·스킬 재사용 ×1.1(×1.25). 추우면 이동 ×0.92(×0.85)·기본 공격 대기 ×1.1(×1.25). 비·눈은 걸음을 늦추고, 폭설은 크게 늦춘다.</div>
      <div>땅의 기후: 사막·메마른 땅·화산은 덥고, 설산은 언제나 춥다(여름 한낮에도 쌀쌀함). 늪지대는 비가, 바람계곡은 강풍이 잦다. 던전·지하는 날씨가 없지만 화구는 덥고 얼음 신전은 춥다.</div>
      <div>야영(노숙) 피로 회복: 온화함 ×1.1 · 더움·쌀쌀함 ×0.9 · 그보다 심하면 ×0.7. 비·폭설은 모닥불을 못 피워 ×0.4, 강풍은 모닥불이 약해 ×0.7. 정찰가의 텐트는 비·바람을, 탐험가의 대형 텐트는 추위까지 막는다.</div>
      <div>날씨 특성: 모험가마다 하나씩 추위·더위·비·바람 가운데 하나에 약하다(타고난 특성 3칸과 따로). 추위·더위 디버프는 누구나 받고, 그 날씨에 약한 모험가는 능력치 -10%를 더 받는다. 뜨거운 수프·얼음 빙수 도시락은 추위·더위 디버프를 막는다.</div>
    </div></details>`;
};
// 땅 위: 겨울에는 눈이 덮이고, 비가 오면 젖어 어둡다 (사람을 그리기 전에)
function groundWx(g, w, oy) {
  if (!w || w.indoor || w.fixed) return;
  const snowy = (w.sky === 'snow' || w.sky === 'heavy') || (w.se === 3 && !(w.C && w.C.dry)) || (w.C && w.C.snowy);
  if (snowy) { R(g, 0, oy + 99, AW, AH - oy - 99, w.sky === 'heavy' ? 'rgba(244,248,255,0.55)' : 'rgba(240,244,252,0.38)'); for (let x = 0; x < AW; x += 7) R(g, x, oy + 99 + (x % 3), 4, 1, 'rgba(255,255,255,0.6)'); }
  else if ((WX_SKY[w.sky] || {}).wet) R(g, 0, oy + 99, AW, AH - oy - 99, 'rgba(30,40,60,0.14)');
}
// 풍경 위 날씨 (빛을 입힌 뒤)
function drawWeather(g, w, t, oy) {
  if (!w || w.indoor || w.fixed) return;
  const wrap = (v, m) => ((v % m) + m) % m, SK = w.sky, wind = w.wind === 2 ? 1 : 0, H = AH;
  const dim = { cloud: 0.07, rain: 0.14, monsoon: 0.18, storm: 0.22, heavy: 0.1, snow: 0.05 }[SK];
  if (dim) R(g, 0, 0, AW, H, SK === 'heavy' || SK === 'snow' ? `rgba(200,210,225,${dim})` : `rgba(40,50,70,${dim})`);
  if (w.T === 2 && w.sun) R(g, 0, 0, AW, H, 'rgba(255,140,60,0.06)');
  if (w.T <= -2) R(g, 0, 0, AW, H, 'rgba(120,170,255,0.06)');
  if (SK === 'fog') for (let i = 0; i < 5; i++) { const x = wrap(i * 70 - t * 4, AW + 140) - 70; R(g, Math.round(x), oy + 60 + i * 14, 140, 10, 'rgba(225,230,240,0.16)'); }
  if (SK === 'rain' || SK === 'monsoon' || SK === 'storm') {
    const n = SK === 'monsoon' ? 90 : SK === 'storm' ? 80 : 55, sl = wind ? 3 : 1;
    for (let i = 0; i < n; i++) { const x = wrap(i * 37 + t * (60 + wind * 60) * (sl > 1 ? 1 : 0.2), AW), y = wrap(i * 53 + t * 220, H); for (let k = 0; k < 5; k++) R(g, Math.round(x - k * sl * 0.4), Math.round(y - k * 2), 1, 2, 'rgba(170,200,240,0.45)'); }
    if (SK === 'storm') { const ph = t % 5.3; if (ph < 0.1 || (ph > 0.18 && ph < 0.24)) R(g, 0, 0, AW, H, 'rgba(230,240,255,0.22)'); }
  }
  if (SK === 'snow' || SK === 'heavy') {
    const n = SK === 'heavy' ? 120 : 50;
    for (let i = 0; i < n; i++) { const x = wrap(i * 41 + t * (8 + (i % 5) * 3 + wind * 50) + Math.sin(t + i) * 4, AW), y = wrap(i * 29 + t * (16 + (i % 4) * 5), H); R(g, Math.round(x), Math.round(y), i % 6 ? 1 : 2, i % 6 ? 1 : 2, 'rgba(245,248,255,0.85)'); }
    if (SK === 'heavy') R(g, 0, 0, AW, H, 'rgba(235,240,250,0.12)');
  }
  if (SK === 'sand') { R(g, 0, 0, AW, H, 'rgba(210,170,100,0.12)'); for (let i = 0; i < 26; i++) { const x = wrap(i * 47 - t * 150, AW + 40) - 20, y = oy + 30 + (i * 13) % 100; R(g, Math.round(x), y, 8 + (i % 4) * 3, 1, 'rgba(230,200,140,0.6)'); } }
  else if (wind) for (let i = 0; i < 12; i++) { const x = wrap(i * 61 - t * 170, AW + 40) - 20, y = oy + 14 + (i * 19) % 110; R(g, Math.round(x), y, 12 + (i % 3) * 5, 1, 'rgba(255,255,255,0.45)'); }
}
