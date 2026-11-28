/* ───────── 빌드 78 넷째: 주문서 강화 · 내구도 · 숫돌 수리 · 촉매 · 망각의 주문서 · 마탑 스킬북 합성 · 단계 책 없앰 (11-27 대표님 — ai-meeting decisions.md 31장 끝 「강화 정리」 둘째 ~ 넷째 · e4 · e5) ─────────
   · 주문서: 갈래 다섯(주무기 · 부장비 · 방어구 · 장신구 · 가방) × 능력치 × 확률 100 · 80 · 60 · 30 · 10%. 성공하면 정해진 수치를 그대로 더한다(%가 아님).
     수치는 장비 레벨과 상관없이 늘 같은 값(11-28 대표님 A안 — 100% +1 · 80% +2 · 60% +4 · 30% +7 · 10% +12, 공격력 기준 · 다른 능력치는 mul 배율). 예전 B안(레벨 구간 1 · 30 · 60 · 90 · 120마다 다른 값)은 SCR78_B에 남김. 실패하면 아무 일 없음(부서지지 않음). 바르는 횟수 제한 없음.
     장비: g.sc = { 능력치: 더한 값 } · g.scN 성공 수 · g.scT 바른 수. 옛 +1 ~ +30 강화(g.enh)는 불러올 때 들어간 돈 · 마정석을 돌려주고 지운다.
   · 내구도: 주무기 · 부장비 120 · 방어구 부위 150(장신구 · 가방 · 화살 없음). 싸움이 끝날 때 1(레이드 3), 그 싸움에서 쓰러진 사람은 4 더. 0이면 그 장비 능력치 50%.
     g.dur(없으면 가득). 숫돌 하나 = 40 수리 + 돈. 자동 수리: 출발 전 40 이상 닳은 장비를 창고 숫돌로 · 숫돌을 챙겨 가 야영 때 고치고 잔다 · 짐꾼 계열은 원정마다 한 번 숫돌 없이 응급 수리 20.
   · 촉매 넷(맹공 힘 · 비전 지능 · 수호 체력 · 질풍 민첩): 대장간 제작에 하나씩 쓰면 희귀 이상 확률이 조금 오르고(×1.25), 희귀 이상이면 그 능력치가 꼭 붙는다.
   · 망각의 주문서(레테의 강물): 빈 주문서(마탑에서 만듦) → 장비의 주문서 강화 기억(g.sc · scN)을 빼앗아 가둠(장비는 처음 상태로) → 어떤 장비에든 그대로 풀기. 기억은 S.lethe[]에(본인 귀속).
   · 스킬북: 펼치는 단계 책을 없앴다 — 몬스터 · 상자가 단계를 뽑은 뒤 그 단계의 스킬북을 바로 준다. 남은 단계 책은 불러올 때 펼쳐 준다.
     합성은 마탑으로: 같은 레어도 9권(직업 · 공용 섞어도 됨) → 바로 위 레어도 한 권, 넣은 책 한 권이 그 계열에 한 표(뽑힌 계열에 그 레어도 책이 없으면 전체에서). 두 단계 위 대성공 없음. */
const SCR78 = {
  cats: {
    weapon: { name: '주무기', slots: ['weapon'], stats: ['atk', 'matk', 'crit'] },
    off: { name: '부장비', slots: ['off', 'bcase'], stats: ['atk', 'def', 'block', 'mp'] },
    armor: { name: '방어구', slots: ['armor', 'legs', 'gloves', 'boots', 'belt'], stats: ['def', 'mres', 'hp', 'eva'] },
    acc: { name: '장신구', slots: ['acc', 'ear'], stats: ['str', 'vit', 'agi', 'int'] },
    bag: { name: '가방', slots: ['bag'], stats: ['carry', 'movePct'] }
  },
  rates: [100, 80, 60, 30, 10],
  band: [1],   // A안: 구간 하나(장비 레벨 상관없이 같은 값)
  atk: [[1], [2], [4], [7], [12]],   // [확률][구간] 공격력 기준
  mul: { atk: 1, matk: 1, def: 0.6, hp: 3, mp: 2, str: 0.5, vit: 0.5, agi: 0.5, int: 0.5, carry: 1.5, crit: 0.0005, block: 0.0005, eva: 0.0005, mres: 0.0006, movePct: 0.002 },
  name: { atk: '공격력', matk: '마법 공격력', crit: '치명', def: '방어력', block: '막기', mp: '최대 MP', mres: '마법 저항', hp: '최대 HP', eva: '회피', str: '힘', vit: '체력', agi: '민첩', int: '지능', carry: '짐', movePct: '이동 속도' },
  pct: ['crit', 'block', 'eva', 'mres', 'movePct'],
  v: [300, 900, 2000, 5000, 12000],   // 기준가 (100% 주문서는 대장간에서 이 값에 판다)
  drop: { p80: 0.008, p60: 0.003, boss30: 0.09, boss10: 0.04 }   // 임시: 몬스터마다 정한 주문서 표가 나오기 전까지
};
const SCR78_B = { band: [1, 30, 60, 90, 120], atk: [[1, 2, 4, 7, 12], [2, 3, 6, 10, 18], [2, 4, 8, 14, 24], [4, 7, 14, 24, 40], [6, 11, 22, 38, 60]] };   // 보관: 예전 B안(구간마다 다른 값)
const DUR78 = { arms: 120, armor: 150, fight: 1, raid: 3, down: 4, stone: 40, auto: 40, pack: 3, porter: 20, warn: 0.2, zero: 0.5, fee: t => 20 + 15 * (t || 0) };   // fee = 숫돌 하나 쓸 때 드는 돈
const CAT78 = { cat_str: ['맹공의 촉매', 'str', '#d0503a'], cat_int: ['비전의 촉매', 'int', '#6a5ad8'], cat_vit: ['수호의 촉매', 'vit', '#3a9a58'], cat_agi: ['질풍의 촉매', 'agi', '#3aa8c8'] };
const CAT78_Q = 1.25, CAT78_DROP = 0.15;
const LETHE78 = { make: { mj_2: 2 }, fee: 3000, take: 1000 };   // 빈 망각의 주문서: 중급 마정석 2 + 3,000G · 기억 담기 1,000G

// ── 물건 ──
const scrPct = s => SCR78.pct.includes(s);
const scrFmt = (s, v) => scrPct(s) ? `+${Math.round(v * 1000) / 10}%` : `+${v}`;
const scrRi = r => SCR78.rates.indexOf(r);
for (const [c, C] of Object.entries(SCR78.cats)) for (const s of C.stats) SCR78.rates.forEach((r, i) => {
  ITEMS[`scr_${c}_${s}_${r}`] = { name: `${C.name} ${SCR78.name[s]} 주문서 ${r}%`, v: SCR78.v[i], w: 0, icon: 'book', c: '#d8b878', g: i, keep: 1, scr: { c, s, r },
    desc: `${C.name}(${C.slots.map(x => (SLOTS.find(y => y[0] === x) || [0, x])[1]).join(' · ')})에 발라요. 성공 ${r}% — 성공하면 ${SCR78.name[s]}이(가) 정해진 만큼 오르고(어떤 장비에 발라도 같은 값), 실패해도 장비는 그대로예요.` };
});
ITEMS.whetstone = { name: '숫돌', v: 300, w: 1, icon: 'ore', c: '#b8b0a0', g: 0, keep: 1, desc: `닳은 장비를 고쳐요. 하나에 내구도 ${DUR78.stone}. 원정에 챙겨 가면 야영 때 고치고 자요.` };
Object.entries(CAT78).forEach(([id, [n, st, c]]) => { ITEMS[id] = { name: n, v: 1200, w: 1, icon: 'gem', c, g: 2, keep: 1, desc: `대장간에서 장비를 만들 때 넣어요. 희귀 이상이 조금 더 잘 나오고, 희귀 이상이면 ${STATS.find(x => x[0] === st)[1]}이(가) 꼭 붙어요. 만들 때마다 하나씩 써요.` }; });
ITEMS.lethe = { name: '망각의 주문서', v: 4000, w: 0, icon: 'book', c: '#9cc4d8', g: 3, keep: 1, desc: '망각의 마법을 담은 빈 주문서. 레테의 강물처럼 장비에서 주문서 강화의 기억을 씻어 내 이 안에 가둬요 — 장비는 처음 상태로 돌아가고, 가둔 기억은 다른 장비에 그대로 풀 수 있어요. (마탑)' };
if (typeof ITEM_HD !== 'undefined') { if (ITEM_HD.whet_3) ITEM_HD.whetstone = ITEM_HD.whet_3; if (ITEM_HD.lethe0) ITEM_HD.lethe = ITEM_HD.lethe0; }
const _itemHD78 = itemHD;
itemHD = function (id) {   // eslint-disable-line no-func-assign
  const I = ITEMS[id];
  if (I && I.scr && typeof ITEM_HD !== 'undefined') { const k = `scrart_${I.scr.c}_${I.scr.r}`; if (ITEM_HD[k]) { HR_URL.add(ITEM_HD[k]); return ITEM_HD[k]; } }
  return _itemHD78(id);
};

// ── 장비: 갈래 · 수치 · 내구도 ──
const scrCatOf = g => { const sl = GTYPES[g.base] && GTYPES[g.base].slot; for (const [c, C] of Object.entries(SCR78.cats)) if (C.slots.includes(sl)) return c; return null; };
const scrBand = g => { const L = gearReqLv(g); let b = 0; SCR78.band.forEach((x, i) => { if (L >= x) b = i; }); return b; };
function scrVal(g, s, r) {
  const base = SCR78.atk[scrRi(r)][scrBand(g)] * SCR78.mul[s];
  return scrPct(s) ? Math.max(0.001, Math.round(base * 1000) / 1000) : Math.max(1, Math.round(base));
}
function durMax(g) { const sl = g && GTYPES[g.base] && GTYPES[g.base].slot; if (!sl || GTYPES[g.base].ammo) return 0; return ['weapon', 'off', 'bcase'].includes(sl) ? DUR78.arms : ['armor', 'legs', 'gloves', 'boots', 'belt'].includes(sl) ? DUR78.armor : 0; }
const durOf = g => { const M = durMax(g); return M ? (g.dur == null ? M : Math.max(0, Math.min(M, g.dur))) : 0; };
const durTxt = g => { const M = durMax(g); if (!M) return ''; const d = durOf(g); return `<span class="${d === 0 ? 'red-t' : d <= M * DUR78.warn ? 'gold-t' : 'muted'}">내구도 ${d}/${M}${d === 0 ? ' (능력치 절반)' : ''}</span>`; };
// 빌드 78: 내구도 막대 — 닳은 장비만 그림 아래에 열 칸 도트 막대(가득이면 안 보임). 절반 위 초록 · 20% 위 노랑 · 그 아래 빨강 · 0이면 빈 막대가 깜빡인다
const durBarH = g => { const M = durMax(g); if (!M) return ''; const d = durOf(g); if (d >= M) return ''; const n = d > 0 ? Math.max(1, Math.ceil(d / M * 10)) : 0, c = d === 0 ? 'z' : d <= M * DUR78.warn ? 'r' : d <= M * 0.5 ? 'y' : 'g'; return `<b class="durb ${c}" style="--dn:${n}"></b>`; };
const _gearStats78 = gearStats;
gearStats = function (g) {   // eslint-disable-line no-func-assign
  const out = _gearStats78(g);
  if (g && g.sc) for (const [k, v] of Object.entries(g.sc)) out[k] = scrPct(k) ? Math.round(((out[k] || 0) + v) * 1000) / 1000 : (out[k] || 0) + v;
  if (g && durMax(g) && durOf(g) === 0) for (const k in out) out[k] = Number.isInteger(out[k]) ? Math.floor(out[k] * DUR78.zero) : Math.round(out[k] * DUR78.zero * 1000) / 1000;
  return out;
};

// ── 주문서 바르기 ──
function scrWhy(f, it) {
  if (!f) return '장비를 골라요.'; const I = ITEMS[it]; if (!I || !I.scr) return '주문서를 골라요.';
  if (!(S.inv[it] > 0)) return '주문서가 없어요.';
  if (scrCatOf(f.g) !== I.scr.c) return `${SCR78.cats[I.scr.c].name} 주문서는 ${SCR78.cats[I.scr.c].name}에만 발라요.`;
  if (f.a && f.a.status !== 'idle') return '원정 중인 길드원의 장비예요.';
  return '';
}
function scrDo(gid, it) {
  const f = findGear(gid), w = scrWhy(f, it); if (w) return w;
  const g = f.g, I = ITEMS[it], { s, r } = I.scr; addTo(S.inv, it, -1); g.scT = (g.scT || 0) + 1;
  const ok = rnd() * 100 < r, v = scrVal(g, s, r);
  if (ok) { g.sc = g.sc || {}; g.sc[s] = scrPct(s) ? Math.round(((g.sc[s] || 0) + v) * 1000) / 1000 : (g.sc[s] || 0) + v; g.scN = (g.scN || 0) + 1; if (f.a && typeof clampVitals === 'function') clampVitals(f.a); }
  UI.scrLast = { ok, line: ok ? `${gearName(g)} — ${SCR78.name[s]} ${scrFmt(s, v)}` : `${I.name}이(가) 스르르 바스러졌다. 장비는 그대로예요.` };
  sfx && sfx(ok ? 'win' : 'miss'); log(ok ? `주문서 성공: ${gearName(g)}의 ${SCR78.name[s]} ${scrFmt(s, v)}` : `주문서 실패: ${I.name}`, ok ? 'good' : 'muted');
  changed(); return '';
}
function scrBuy(it, n = 1) {
  const I = ITEMS[it]; if (!I || !I.scr || I.scr.r !== 100) return ''; const pr = I.v * n;
  if (S.gold < pr) return '돈이 모자라요.'; if (!roomItem(it)) return WH_FULL;
  S.gold -= pr; S.stats.spent = (S.stats.spent || 0) + pr; addTo(S.inv, it, n); changed(); return `${I.name} ${n}장을 샀다.`;
}
// 대장간 「주문서 강화」 탭 (panels.js smithy — 옛 enhBox 자리)
function scrollBox() {
  const all = gearsAll().filter(x => scrCatOf(x.g)).sort((x, y) => (y.g.scN || 0) - (x.g.scN || 0) || (y.g.q || 0) - (x.g.q || 0) || y.g.t - x.g.t);
  const f0 = UI.scrG != null ? findGear(UI.scrG) : null, f = f0 && scrCatOf(f0.g) ? f0 : null;
  let ctl = '<div class="sub muted" style="text-align:center">아래에서 장비를 고른 뒤, 그 갈래 주문서를 발라요. 실패해도 장비는 부서지지 않고, 바르는 횟수 제한도 없어요.</div>';
  if (f) {
    const g = f.g, c = scrCatOf(g), C = SCR78.cats[c];
    const sc = g.sc && Object.keys(g.sc).length ? Object.entries(g.sc).map(([k, v]) => `${SCR78.name[k]} ${scrFmt(k, v)}`).join(' · ') : '없음';
    const rows = C.stats.flatMap(s => SCR78.rates.map(r => {
      const it = `scr_${c}_${s}_${r}`, n = S.inv[it] || 0, why = scrWhy(f, it), buy = r === 100;
      if (!n && !buy) return '';
      return `<div class="li">${iconImg(it)}<div class="grow stack"><span>${ITEMS[it].name} <b class="num">×${n}</b></span><span class="sub">성공하면 ${SCR78.name[s]} <b class="gold-t">${scrFmt(s, scrVal(g, s, r))}</b> (이 장비 기준)</span></div>
        ${n ? `<button type="button" class="btn sm gold" data-act="scrgo" data-g="${g.id}" data-it="${it}"${why ? ' disabled' : ''}>바르기</button>` : ''}${buy ? `<button type="button" class="btn sm" data-act="scrbuy" data-it="${it}"${S.gold < ITEMS[it].v ? ' disabled' : ''}>사기 ${fmt(ITEMS[it].v)}G</button>` : ''}</div>`;
    })).join('');
    ctl = `<div class="enh-name"><b>${gearName(g)}</b> ${qTag(g)}<span class="sub">${statLine(gearStats(g))}</span><span class="sub">${f.a ? esc(f.a.name) : '창고'} · ${C.name} · 주문서 성공 ${g.scN || 0} / 바름 ${g.scT || 0} · 오른 것: ${sc}${durMax(g) ? ' · ' + durTxt(g) : ''}</span></div>
      ${UI.scrLast ? `<div class="card ${UI.scrLast.ok ? 'hl' : ''}" style="text-align:center"><b class="${UI.scrLast.ok ? 'gold-t' : 'muted'}">${UI.scrLast.ok ? '성공!' : '실패'}</b> ${esc(UI.scrLast.line)}</div>` : ''}
      <div class="list">${rows || '<div class="li"><span class="sub">바를 수 있는 주문서가 없어요.</span></div>'}</div>`;
  }
  const cells = all.map(x => `<button type="button" class="cell${f && f.g === x.g ? ' on' : ''}${x.owner && x.owner.status !== 'idle' ? ' zero' : ''}" data-act="scrsel" data-g="${x.g.id}" aria-label="${esc(gearName(x.g))}">${gArt(x.g, 2)}${x.g.scN ? `<span class="qty enhq">+${x.g.scN}</span>` : ''}</button>`).join('');
  const band = SCR78.band.map((b, i) => `<tr><td>${SCR78.band.length > 1 ? `Lv${b}~` : "모든 장비"}</td>${SCR78.rates.map((r, j) => `<td>+${SCR78.atk[j][i]}</td>`).join('')}</tr>`).join('');
  return `<div class="card enh-ctl">${ctl}</div>
    <div class="sec"><b>장비</b><span>${all.length}점 · 흐린 칸은 원정 중</span></div><div class="igrid enhgrid">${cells || '<span class="sub">장비가 없어요.</span>'}</div>
    <details class="card"><summary>주문서 수치표 (공격력 기준 — 다른 능력치는 배율만큼)</summary><table class="enht"><tr><th>${SCR78.band.length > 1 ? "장비 레벨" : ""}</th>${SCR78.rates.map(r => `<th>${r}%</th>`).join('')}</tr>${band}</table>
      <div class="sub muted">방어력 ×0.6 · 최대 HP ×3 · 최대 MP ×2 · 힘 · 체력 · 민첩 · 지능 ×0.5 · 짐 ×1.5 · 치명 · 막기 · 회피 ×0.05%p · 마법 저항 ×0.06%p · 이동 ×0.2%</div></details>`;
}

// ── 내구도 · 숫돌 ──
const durGears = a => SLOTS.map(([sl]) => a.eq[sl]).filter(g => g && durMax(g));
function durHit(g, n) { const M = durMax(g); if (!M || n <= 0) return 0; const d0 = durOf(g), d = Math.max(0, d0 - n); g.dur = d; return (d0 > M * DUR78.warn && d <= M * DUR78.warn) || (d0 > 0 && d === 0) ? d : -1; }
function durWear(e) {
  if (!e || !['field', 'dungeon', 'raid', 'trade'].includes(e.area) || e.pvp) return;
  const p = partyOfE(e); if (!p) return;
  for (const a of teamOf(p)) {
    const n = (e.area === 'raid' ? DUR78.raid : DUR78.fight) + (a.down ? DUR78.down : 0);
    for (const g of durGears(a)) { const w = durHit(g, n); if (w === 0) log(`${a.name}의 ${gearName(g)} 내구도가 다 닳았다! 수리할 때까지 능력치가 절반이에요.`, 'bad'); else if (w > 0) log(`${a.name}의 ${gearName(g)} 내구도가 ${w}밖에 안 남았다.`, 'muted'); }
  }
}
const _ev78 = ev;
ev = function (e, type, data) { _ev78(e, type, data); if (type === 'clear') durWear(e); };   // eslint-disable-line no-func-assign
// 숫돌로 고치기: 한 개 = 40. bag(창고 S.inv 또는 원정 e.sup)에서 꺼내 쓴다. all이면 가득, 아니면 40 이상 닳은 만큼만(헛소모 없이)
function durFix(g, bag, all, pay = true) {
  const M = durMax(g); if (!M) return 0; let used = 0;
  while ((bag.whetstone || 0) > 0) {
    const miss = M - durOf(g); if (miss <= 0 || (!all && miss < DUR78.stone)) break;
    const fee = pay ? DUR78.fee(g.t) : 0; if (S.gold < fee) break;
    S.gold -= fee; addTo(bag, 'whetstone', -1); g.dur = Math.min(M, durOf(g) + DUR78.stone); used++;
  }
  if (durOf(g) >= M) delete g.dur; return used;
}
function repairWhy(g) { const M = durMax(g); if (!M) return '내구도가 없는 장비예요.'; if (durOf(g) >= M) return '닳지 않았어요.'; if (!(S.inv.whetstone > 0)) return '숫돌이 없어요.'; if (S.gold < DUR78.fee(g.t)) return '돈이 모자라요.'; return ''; }
function repairDo(gid) { const f = findGear(gid); if (!f) return ''; const w = repairWhy(f.g); if (w) return w; const n = durFix(f.g, S.inv, true); changed(); return `${gearName(f.g)}을(를) 숫돌 ${n}개로 고쳤다.`; }
function repairAll() { let n = 0; for (const x of gearsAll()) if (durMax(x.g) && (!x.owner || x.owner.status === 'idle')) n += durFix(x.g, S.inv, true); changed(); return n ? `숫돌 ${n}개로 장비를 고쳤다.` : '고칠 장비가 없거나 숫돌 · 돈이 모자라요.'; }
function repairBox() {
  const worn = gearsAll().filter(x => durMax(x.g) && durOf(x.g) < durMax(x.g)).sort((x, y) => durOf(x.g) / durMax(x.g) - durOf(y.g) / durMax(y.g));
  const rows = worn.map(x => `<div class="li">${gArt(x.g, 1)}<div class="grow stack"><span>${gearName(x.g)} ${qTag(x.g)}${x.owner ? ` <span class="tag">${esc(x.owner.name)}</span>` : ''}</span><span class="sub">${durTxt(x.g)} · 숫돌 하나에 ${DUR78.stone} · ${fmt(DUR78.fee(x.g.t))}G</span></div>
    <button type="button" class="btn sm" data-act="repair" data-g="${x.g.id}"${repairWhy(x.g) || (x.owner && x.owner.status !== 'idle') ? ' disabled' : ''}>수리</button></div>`).join('');
  const auto = S.autoRepair !== false;
  return `<div class="card"><div class="sub">숫돌 <b>${S.inv.whetstone || 0}</b>개 · 하나에 내구도 ${DUR78.stone}. 내구도가 0이면 그 장비 능력치가 절반이에요(부서지지는 않아요).</div>
    <div class="btns"><button type="button" class="btn sm gold" data-act="repairall"${worn.length ? '' : ' disabled'}>모두 수리</button><button type="button" class="btn sm" data-act="whetbuy" data-n="5"${S.gold < ITEMS.whetstone.v * 5 ? ' disabled' : ''}>숫돌 5개 사기 ${fmt(ITEMS.whetstone.v * 5)}G</button>
    <button type="button" class="btn sm${auto ? ' gold' : ''}" data-act="autorepair">자동 수리 ${auto ? '켬' : '끔'}</button></div>
    <div class="sub muted">자동 수리: 출발할 때 ${DUR78.auto} 이상 닳은 장비를 창고 숫돌로 고치고, 숫돌 ${DUR78.pack}개를 챙겨 가 야영 때 고친 뒤 잠들어요. 짐꾼 계열은 원정마다 한 번 숫돌 없이 ${DUR78.porter}을 고쳐요.</div></div>
    <div class="list">${rows || '<div class="li"><span class="sub">닳은 장비가 없어요.</span></div>'}</div>`;
}
// 출발: 자동 수리 + 숫돌 챙기기 (startExp가 성공했을 때)
const _startExp78 = startExp;
startExp = function (p, fid, o) {   // eslint-disable-line no-func-assign
  if (S.autoRepair !== false) for (const a of p.members.map(advById).filter(Boolean)) if (a.status === 'idle') for (const g of durGears(a)) durFix(g, S.inv, false);
  const r = _startExp78(p, fid, o);
  if (!r && p.exp && S.autoRepair !== false && p.exp.sup) { const n = Math.min(DUR78.pack, S.inv.whetstone || 0); if (n) { addTo(S.inv, 'whetstone', -n); addTo(p.exp.sup, 'whetstone', n); } }
  return r;
};
// 야영: 챙겨 간 숫돌로 고치고 잔다 · 짐꾼 응급 수리
const _startCamp78 = startCamp;
startCamp = function (p, e) {   // eslint-disable-line no-func-assign
  _startCamp78(p, e);
  const team = teamOf(p); let n = 0;
  if (e.sup && S.autoRepair !== false) for (const a of team) for (const g of durGears(a)) n += durFix(g, e.sup, false, false);
  if (n) log(`${p.name}이(가) 야영지에서 숫돌 ${n}개로 장비를 손보고 잠들었다.`, 'muted');
  if (!e.prFix && team.some(a => !a.down && jobBase(a.cls) === 'porter')) {
    const gs = team.flatMap(durGears).filter(g => durOf(g) < durMax(g)).sort((x, y) => durOf(x) / durMax(x) - durOf(y) / durMax(y));
    if (gs.length) { const g = gs[0]; g.dur = Math.min(durMax(g), durOf(g) + DUR78.porter); if (g.dur >= durMax(g)) delete g.dur; e.prFix = 1; log(`짐꾼이 야영지에서 ${gearName(g)}을(를) 응급 수리했다 (+${DUR78.porter}).`, 'muted'); }
  }
};

// ── 촉매 (forge72.js forgeGear · forgeTick이 부른다) ──
const catSel = () => (UI.forgeCat && CAT78[UI.forgeCat] && (S.inv[UI.forgeCat] || 0) > 0 ? UI.forgeCat : '');
function catPick() {
  const have = Object.keys(CAT78).filter(k => (S.inv[k] || 0) > 0);
  if (!have.length) return '<div class="sub muted">촉매(맹공 · 비전 · 수호 · 질풍)가 있으면 제작에 넣을 수 있어요 — 우두머리 · 리젠보스가 떨어뜨려요.</div>';
  const cur = catSel();
  return `<div class="btns"><span class="sub">촉매:</span><button type="button" class="btn sm${cur ? '' : ' on'}" data-act="forgecat" data-k="">안 넣음</button>${have.map(k => `<button type="button" class="btn sm${cur === k ? ' gold' : ''}" data-act="forgecat" data-k="${k}">${ITEMS[k].name} ×${S.inv[k]}</button>`).join('')}</div>`;
}
function catBonus(g, cat) {   // 희귀 이상이면 그 능력치를 꼭 붙인다(없으면 하나를 바꿔 끼움)
  const st = CAT78[cat] && CAT78[cat][1]; if (!st || (g.q || 0) < 2) return;
  g.bonus = g.bonus || {}; if (g.bonus[st]) return;
  const ks = Object.keys(g.bonus), v = ks.length ? Math.max(...ks.map(k => g.bonus[k])) : Math.max(1, Math.round(GTIERS[g.t].p));
  if (ks.length) delete g.bonus[ks[Math.floor(rnd() * ks.length)]]; g.bonus[st] = v;
}

// ── 망각의 주문서 (마탑) ──
const letheList = () => (S.lethe = S.lethe || []);
function letheMakeWhy() { if (S.gold < LETHE78.fee) return '돈이 모자라요.'; const m = Object.entries(LETHE78.make).find(([k, q]) => (S.inv[k] || 0) < q); if (m) return `${ITEMS[m[0]].name}이(가) 모자라요.`; if (!roomItem('lethe')) return WH_FULL; return ''; }
function letheMake() { const w = letheMakeWhy(); if (w) return w; S.gold -= LETHE78.fee; Object.entries(LETHE78.make).forEach(([k, q]) => addTo(S.inv, k, -q)); addTo(S.inv, 'lethe', 1); changed(); return '빈 망각의 주문서를 만들었다.'; }
function letheTake(gid) {
  const f = findGear(gid); if (!f || !f.g.scN) return '주문서 강화가 없는 장비예요.'; if (f.a && f.a.status !== 'idle') return '원정 중인 길드원의 장비예요.';
  if (!(S.inv.lethe > 0)) return '빈 망각의 주문서가 없어요.'; if (S.gold < LETHE78.take) return '돈이 모자라요.';
  const g = f.g; S.gold -= LETHE78.take; addTo(S.inv, 'lethe', -1);
  letheList().push({ id: nid(), sc: g.sc || {}, n: g.scN, from: gearName(g) });
  delete g.sc; delete g.scN; delete g.scT; if (f.a && typeof clampVitals === 'function') clampVitals(f.a);
  log(`망각의 주문서가 ${gearName(g)}에서 강화의 기억을 씻어 갔다. 장비는 처음 상태로 돌아왔다.`, 'good'); changed(); return '';
}
function letheGive(mid, gid) {
  const L = letheList(), i = L.findIndex(x => x.id === mid), f = findGear(gid); if (i < 0 || !f) return '';
  if (f.a && f.a.status !== 'idle') return '원정 중인 길드원의 장비예요.';
  const m = L[i], g = f.g; g.sc = g.sc || {};
  for (const [k, v] of Object.entries(m.sc)) g.sc[k] = scrPct(k) ? Math.round(((g.sc[k] || 0) + v) * 1000) / 1000 : (g.sc[k] || 0) + v;
  g.scN = (g.scN || 0) + m.n; L.splice(i, 1); UI.letheSel = null; if (f.a && typeof clampVitals === 'function') clampVitals(f.a);
  log(`가둬 둔 기억(+${m.n})을 ${gearName(g)}에 풀었다.`, 'good'); changed(); return '';
}
function letheBox() {
  const L = letheList(), sel = L.find(x => x.id === UI.letheSel);
  const mem = L.map(m => `<div class="li">${iconImg('lethe')}<div class="grow stack"><span>기억을 담은 망각의 주문서 <b class="gold-t">+${m.n}</b></span><span class="sub">${esc(m.from)}에서 · ${Object.entries(m.sc).map(([k, v]) => `${SCR78.name[k]} ${scrFmt(k, v)}`).join(' · ') || '오른 것 없음'} · 본인 귀속</span></div>
    <button type="button" class="btn sm${sel === m ? ' gold' : ''}" data-act="lethesel" data-m="${m.id}">${sel === m ? '풀 장비 고르는 중' : '장비에 풀기'}</button></div>`).join('');
  const all = gearsAll().filter(x => !x.owner || x.owner.status === 'idle');
  const take = all.filter(x => x.g.scN).map(x => `<div class="li">${gArt(x.g, 1)}<div class="grow stack"><span>${gearName(x.g)}${x.owner ? ` <span class="tag">${esc(x.owner.name)}</span>` : ''}</span><span class="sub">주문서 성공 +${x.g.scN} · 기억 담기 ${fmt(LETHE78.take)}G</span></div><button type="button" class="btn sm" data-act="lethetake" data-g="${x.g.id}"${S.inv.lethe > 0 ? '' : ' disabled'}>기억 빼내기</button></div>`).join('');
  const give = sel ? all.filter(x => scrCatOf(x.g)).map(x => `<button type="button" class="cell" data-act="lethegive" data-m="${sel.id}" data-g="${x.g.id}" aria-label="${esc(gearName(x.g))}">${gArt(x.g, 2)}${x.g.scN ? `<span class="qty enhq">+${x.g.scN}</span>` : ''}</button>`).join('') : '';
  return `<div class="sec"><b>망각의 주문서</b><span>레테의 강물 — 강화의 기억을 씻어 가둬요</span></div>
    <div class="sub muted">빈 주문서: 중급 마정석 ${LETHE78.make.mj_2} + ${fmt(LETHE78.fee)}G · 갖고 있는 빈 주문서 ${S.inv.lethe || 0}장. 기억을 빼낸 장비는 처음 상태로 돌아가고, 기억은 어떤 장비에든 그대로 풀 수 있어요.</div>
    <div class="btns"><button type="button" class="btn sm gold" data-act="lethemake"${letheMakeWhy() ? ' disabled' : ''}>빈 망각의 주문서 만들기</button></div>
    ${mem ? `<div class="list">${mem}</div>` : ''}${sel ? `<div class="sub gold-t">기억(+${sel.n})을 풀 장비를 골라요</div><div class="igrid enhgrid">${give}</div>` : ''}
    <details class="card"><summary>기억 빼내기 — 주문서 강화가 있는 장비 ${all.filter(x => x.g.scN).length}점</summary><div class="list">${take || '<div class="li"><span class="sub">없어요.</span></div>'}</div></details>`;
}

// ── 스킬북: 단계 책 없앰 · 마탑 합성 ──
const _tierBookFor78 = tierBookFor;
tierBookFor = function (tier, boss) {   // eslint-disable-line no-func-assign
  const tb = _tierBookFor78(tier, boss); if (!tb) return null;
  const i = BOOK_TIERS.findIndex(x => x.id === tb), s = i >= 0 ? drawBook(i) : null;
  return s && ITEMS['book_' + s] ? 'book_' + s : null;
};
LIB_FUSE.jump = 0;   // 두 단계 위 대성공 없음 (e5 12번)
lfWhy = function () {   // eslint-disable-line no-func-assign
  const F = lfClean();
  if (!lfOut(F.g + 1).length) return `${gradeName(F.g + 1)} 스킬북이 아직 없어요`;
  if (F.ids.length < LIB_FUSE.n) return `${LIB_FUSE.n - F.ids.length}권 더 넣어요`;
  if (S.gold < LIB_FUSE.fee[F.g]) return `${fmt(LIB_FUSE.fee[F.g])}G가 필요해요`;
  const cnt = {}; F.ids.forEach(k => { cnt[k] = (cnt[k] || 0) + 1; });
  if (whFree(-1) + freedBy(cnt) <= 0) return '메인 창고에 빈 칸이 없어요';
  return '';
};
const bookFam = id => { const s = SKILLS[id]; const c0 = s && (s.cls || [])[0]; return !c0 || c0 === 'all' || !CLASSES[c0] ? 'all' : jobBase(c0); };
lfPick = function (g) {   // eslint-disable-line no-func-assign
  const L = lfOut(g), F = lfState(), votes = F.ids.map(k => bookFam(ITEMS[k] && ITEMS[k].book)).filter(Boolean);
  const fam = votes.length ? votes[Math.floor(rnd() * votes.length)] : null, M = fam ? L.filter(id => bookFam(id) === fam) : [];
  const P = M.length ? M : L, sum = P.reduce((x, id) => x + BOOK_W[id], 0); let r = rnd() * sum;
  for (const id of P) { r -= BOOK_W[id]; if (r <= 0) return id; } return P[P.length - 1];
};
const _towerBox78 = towerBox;
towerBox = function () {   // eslint-disable-line no-func-assign
  return _towerBox78() + letheBox() + `<div class="sec"><b>스킬북 합성</b><span>같은 레어도 ${LIB_FUSE.n}권 → 한 단계 위 (직업 · 공용 섞어도 돼요)</span></div><div class="sub muted">넣은 책 한 권이 그 계열(전사 · 궁수 · 마법사 · 성직자 · 도적 · 짐꾼 · 공용)에 한 표 — 뽑힌 계열의 책이 나와요.</div>` + BLD_BOX.library();
};
BLD_SUM.library = () => '<div class="sub">스킬북 합성은 마탑으로 옮겼어요.</div>';

// ── 드롭: 주문서 · 촉매 (임시 몫 — 몬스터마다 정한 표가 나오면 바꾼다) ──
function scrRandom(r) { const cs = Object.keys(SCR78.cats), c = pickOne(cs), s = pickOne(SCR78.cats[c].stats); return `scr_${c}_${s}_${r}`; }
const _matDrop78 = matDrop;
matDrop = function (p, e, f) {   // eslint-disable-line no-func-assign
  _matDrop78(p, e, f);
  if (!e || e.kq || e.pvp) return; const big = f.boss || f.fb || f.regen;
  const add = it => { if (e.bag) { addTo(e.bag, it, 1); log(`${p.name}이(가) ${ITEMS[it].name}을(를) 주웠다!`, 'good'); } };
  if (big) { if (rnd() < SCR78.drop.boss10) add(scrRandom(10)); else if (rnd() < SCR78.drop.boss30) add(scrRandom(30)); if (rnd() < CAT78_DROP) add(pickOne(Object.keys(CAT78))); }
  else { const r = rnd(); if (r < SCR78.drop.p60) add(scrRandom(60)); else if (r < SCR78.drop.p60 + SCR78.drop.p80) add(scrRandom(80)); }
};

// ── 옛 저장 (불러올 때마다 — 할 것이 없으면 아무것도 안 함) ──
function scroll78() {
  let gold = 0, mj = {}, n = 0, books = 0;
  const each = g => { if (g && g.enh > 0) { gold += enhGold(g, g.enh); for (let k = 1; k <= g.enh; k++) { const M = enhMj(k); mj[M.id] = (mj[M.id] || 0) + M.q; } n++; } if (g) { delete g.enh; delete g.enhN; } };
  gearsAll().forEach(x => each(x.g)); (S.wh || []).forEach(w => (w.gear || []).forEach(each)); (S.parties || []).forEach(p => p.exp && (p.exp.gbag || []).forEach(each));
  const inv = [S.inv].concat((S.wh || []).map(w => w.inv).filter(Boolean));
  let ether = 0, ingot = 0, whet = 0;
  for (const bag of inv) for (const k of Object.keys(bag)) {
    const q = bag[k]; if (!(q > 0)) continue;
    if (k === 'ether_ingot') { ether += q; delete bag[k]; }
    else if (/^ingot_\d+$/.test(k)) { ingot += q; delete bag[k]; addTo(S.inv, 'lethe', q); }
    else if (/^whet_\d+$/.test(k)) { const m = +k.slice(5); whet += q * m; delete bag[k]; addTo(S.inv, 'whetstone', q * m); }
    else if (BOOK_TIERS.some(T => T.id === k)) { const i = BOOK_TIERS.findIndex(T => T.id === k); delete bag[k]; for (let j = 0; j < q; j++) { const s = drawBook(i); if (s && ITEMS['book_' + s]) { addTo(bag, 'book_' + s, 1); books++; } } }
  }
  gold += ether * (ITEMS.ether_ingot ? ITEMS.ether_ingot.v : 1500);
  if (gold) S.gold += gold; Object.entries(mj).forEach(([k, q]) => addTo(S.inv, k, q));
  if (n || ether || ingot || whet || books) {
    const L = [n ? `강화했던 장비 ${n}점의 강화를 지우고 ${fmt(gold - ether * 1500)}G · 마정석을 돌려받았다` : '', ether ? `에테르 주괴 ${ether}개 → ${fmt(ether * 1500)}G` : '', ingot ? `강화 주괴 ${ingot}개 → 빈 망각의 주문서` : '', whet ? `숫돌 → 수리용 숫돌 ${whet}개` : '', books ? `펼치지 않은 스킬북 단계 책 ${books}권을 펼쳤다` : ''].filter(Boolean);
    log(`강화가 주문서 방식으로 바뀌었어요: ${L.join(' · ')}.`, 'good');
    if (typeof openModal === 'function' && S.flags && !S.flags.v78s) { S.flags.v78s = 1; setTimeout(() => openModal('강화가 바뀌었어요', `<div class="sub">+1 ~ +30 강화 대신 <b>주문서 강화</b>(대장간 「주문서 강화」 탭)와 <b>내구도 · 숫돌 수리</b>(「수리」 탭)가 들어왔어요. 망각의 주문서 · 스킬북 합성은 마탑에서 해요.</div><div class="list">${L.map(x => `<div class="li"><span class="sub">${esc(x)}</span></div>`).join('')}</div>`), 0); }
  }
}

Object.assign(ACT, {
  scrsel: d => { UI.scrG = +d.g; UI.scrLast = null; },
  scrgo: d => say(scrDo(+d.g, d.it)),
  scrbuy: d => say(scrBuy(d.it)),
  repair: d => say(repairDo(+d.g)),
  repairall: () => say(repairAll()),
  whetbuy: d => { const n = +d.n || 1, pr = ITEMS.whetstone.v * n; if (S.gold < pr) { say('돈이 모자라요.'); return; } if (!roomItem('whetstone')) { say(WH_FULL); return; } S.gold -= pr; addTo(S.inv, 'whetstone', n); changed(); },
  autorepair: () => { S.autoRepair = S.autoRepair === false; changed(); },
  forgecat: d => { UI.forgeCat = d.k || ''; },
  lethemake: () => say(letheMake()),
  lethetake: d => say(letheTake(+d.g)),
  lethesel: d => { UI.letheSel = UI.letheSel === +d.m ? null : +d.m; },
  lethegive: d => say(letheGive(+d.m, +d.g))
});
