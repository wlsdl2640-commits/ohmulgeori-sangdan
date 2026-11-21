/* ───────── 장비 강화 +1 ~ +30 · 마정석 · 숫돌 · 에테르 쇳가루 · 회수로 (빌드 72 · 11-21 11:44 ~ 11:59 사용자) ─────────
   · 파티가 마을에 있을 때(장비 주인이 쉬는 중이거나 창고의 장비) 대장간에서. 결과는 성공(+1) · 실패(그대로) · 손상(−1) · 파괴(장비가 사라짐).
     +1은 100%, 오를수록 성공 몫을 넷이 나눠 가진다(ENH.table — 사용자에게 보인 초안 그대로). 강화 +1마다 능력치 +3%.
   · 비용 = 돈 + 마정석. 마정석 등급은 다섯 단계마다 오른다(+1 ~ 5 최하급 · +6 ~ 10 하급 · +11 ~ 15 중급 · +16 ~ 20 중상급 · +21 ~ 25 상급 · +26 ~ 30 최상급).
   · 에테르 주괴(id ether_dust): 강화할 때 넣으면 파괴를 막는다(수치 그대로) — enhDustNeed(n)개 들어간다.
   · 장비마다 강화는 100번까지(시도할 때마다 1번 — 내 판단). 숫돌(+1 · 3 · 5 · 7 · 10회)이 되돌려 준다.
   · 회수로: +N 장비 → 「+N 강화 주괴」 + 장비는 +0. 주괴는 +0 장비에만 써서 +N으로. 회수 · 주괴는 강화 횟수를 안 쓰고 횟수는 장비에 남는다(내 판단).
   · 임시(사용자가 안 정한 것): 돈 · 마정석 개수 · 마정석 드랍(한 마리에 하나 — 사용자 「무조건」 · 우두머리 2 ~ 3개 · 등급은 몬스터 Lv 30마다) · 숫돌 · 쇳가루 값(대장간에서 삼) — 마정석 · 부속품을 새로 짤 때 다시 정한다. */
const ENH = { max: 30, per: 0.03, tries: 100, whet: [1, 3, 5, 7, 10], mjDrop: 0.08,
  table: [[100, 0, 0, 0], [95, 5, 0, 0], [90, 10, 0, 0], [85, 15, 0, 0], [80, 20, 0, 0], [75, 25, 0, 0], [70, 30, 0, 0], [65, 33, 2, 0], [60, 36, 4, 0], [55, 39, 6, 0],
    [50, 40, 10, 0], [45, 42, 13, 0], [40, 43, 17, 0], [36, 44, 20, 0], [32, 45, 23, 0], [28, 45, 26, 1], [25, 45, 28, 2], [22, 44, 31, 3], [19, 44, 33, 4], [16, 43, 36, 5],
    [14, 42, 38, 6], [12, 41, 40, 7], [10, 40, 42, 8], [8, 39, 44, 9], [7, 37, 46, 10], [6, 35, 47, 12], [5, 33, 48, 14], [4, 31, 49, 16], [3, 29, 50, 18], [2, 27, 51, 20]],
  shop: { ether_dust: 5000, whet_1: 800, whet_3: 2200, whet_5: 3500, whet_7: 4700, whet_10: 6500 } };
const MJ_GRADES = ['최하급', '하급', '중급', '중상급', '상급', '최상급'];
const MJ_V = [30, 120, 500, 2000, 8000, 30000], MJ_C = ['#c4ccd6', '#a8d0ec', '#78b8ec', '#4890e0', '#2860c8', '#1838a0'];   // 같은 푸른 수정 — 등급이 오를수록 진해진다 (머금은 마나가 늘어남 · 11-21 12:39 사용자)
MJ_GRADES.forEach((n, i) => { ITEMS['mj_' + i] = { name: `${n} 마정석`, v: MJ_V[i], w: 1, icon: 'ore', c: MJ_C[i], g: i, mj: i + 1, keep: 1, desc: `마나를 머금은 원석. ${['마나가 아주 조금 스며 있어 빛깔이 거의 없다.', '옅은 하늘빛이 돈다.', '맑은 하늘색으로 물들었다.', '또렷한 파란빛이 돈다.', '짙은 청색 속에서 빛이 비친다.', '마나가 가득 차 가장 깊은 남청색으로 빛난다.'][i]} 마법공학 장치와 생활 속 여러 기구를 움직이는 에너지 자원으로, 미궁 밖 세상이 이것으로 돌아간다. 대장간에서는 장비 강화에 쓴다.` }; });
ITEMS.ether_dust = { name: '에테르 주괴', v: 1500, w: 1, icon: 'ore', c: '#9ad8f0', g: 3, keep: 1, desc: '강화할 때 넣으면 장비가 파괴될 결과를 막아 준다(수치 그대로). 강화 수치가 높을수록 여러 개가 들어간다.' };   // id는 ether_dust 그대로 (처음 이름 에테르 쇳가루 → 11-21 12:21 사용자 「에테르주괴로」)
ENH.whet.forEach(n => { ITEMS['whet_' + n] = { name: `숫돌 (+${n}회)`, v: 200 * n, w: 1, icon: 'ore', c: '#b8b0a0', g: n >= 7 ? 2 : n >= 3 ? 1 : 0, keep: 1, whet: n, desc: `장비의 남은 강화 횟수를 ${n}회 되돌려 준다.` }; });
for (let n = 1; n <= ENH.max; n++) ITEMS['ingot_' + n] = { name: `+${n} 강화 주괴`, v: 500 * n * n, w: 2, icon: 'ore', c: '#e8c060', g: Math.min(6, Math.floor((n - 1) / 5) + 1), keep: 1, ingot: n, desc: `회수로에서 뽑아낸 강화. +0인 장비에 쓰면 그 장비가 바로 +${n}이 된다.` };
const enhOf = g => (g && g.enh) | 0;
function enhMul(g) { return 1 + ENH.per * enhOf(g); }
const enhLeft = g => Math.max(0, ENH.tries - ((g.enhN) | 0));
const enhAble = g => g && GTYPES[g.base] && !GTYPES[g.base].ammo;
const enhMj = n => ({ id: 'mj_' + Math.floor((n - 1) / 5), q: 1 + ((n - 1) % 5) });   // +n으로 올릴 때
const enhGold = (g, n) => Math.round(gearValue(Object.assign({}, g, { runes: [], ms: [] })) * (0.15 + 0.05 * n) / 10) * 10;
function enhWhy(f) {
  if (!f) return '장비를 찾을 수 없어요.'; const g = f.g;
  if (!S.bld.smithy) return '대장간이 있어야 해요.';
  if (!enhAble(g)) return '화살 · 암기 같은 소모형 장비는 강화할 수 없어요.';
  if (f.a && f.a.status !== 'idle') return `${f.a.name}이(가) 마을에 돌아와 있어야 해요.`;
  return '';
}
function enhTryWhy(f) {
  const w = enhWhy(f); if (w) return w; const g = f.g, n = enhOf(g) + 1;
  if (n > ENH.max) return `+${ENH.max}이 끝이에요.`;
  if (!enhLeft(g)) return '강화 횟수를 다 썼어요. 숫돌로 되돌릴 수 있어요.';
  const M = enhMj(n);
  if ((S.inv[M.id] || 0) < M.q) return `${ITEMS[M.id].name} ${M.q}개가 필요해요.`;
  if (S.gold < enhGold(g, n)) return '돈이 모자라요.';
  if (UI.enhDust && enhDustNeed(n) && (S.inv.ether_dust || 0) < enhDustNeed(n)) return '에테르 주괴가 모자라요.';
  return '';
}
function enhGone(f) { if (f.a) { for (const [sl] of SLOTS) if (f.a.eq[sl] === f.g) f.a.eq[sl] = null; clampVitals && clampVitals(f.a); } else S.gear = S.gear.filter(x => x !== f.g); }
function enhDo(gid) {
  const f = findGear(gid), w = enhTryWhy(f); if (w) return w;
  const g = f.g, n = enhOf(g) + 1, M = enhMj(n), T = ENH.table[n - 1], dn = UI.enhDust ? enhDustNeed(n) : 0, dust = dn > 0, nm = gearName(g), art0 = gArt(g, 2);
  S.gold -= enhGold(g, n); S.inv[M.id] -= M.q; if (!S.inv[M.id]) delete S.inv[M.id];
  if (dust) { S.inv.ether_dust -= dn; if (!S.inv.ether_dust) delete S.inv.ether_dust; }
  g.enhN = (g.enhN | 0) + 1;
  const r = rnd() * 100; let res = r < T[0] ? 's' : r < T[0] + T[1] ? 'f' : r < T[0] + T[1] + T[2] ? 'd' : 'x', saved = false;
  if (res === 'x' && dust) { res = 'f'; saved = true; }
  let msg;
  if (res === 's') { g.enh = n; msg = `강화 성공! ${gearName(g)}`; }
  else if (res === 'f') msg = saved ? `파괴될 뻔했지만 에테르 주괴가 막았다. ${nm} 그대로.` : `강화 실패. ${nm} 그대로.`;
  else if (res === 'd') { g.enh = Math.max(0, n - 2); msg = `손상! ${nm} → ${gearName(g)}`; }
  else { enhGone(f); UI.enhG = null; msg = `파괴… ${nm}이(가) 부서져 사라졌다.`; }
  UI.enhLast = { res: saved ? 'v' : res, msg, art: art0, line: res === 'x' ? `${nm}이(가) 부서져 사라졌다` : res === 's' ? `${nm} → +${n}` : res === 'd' ? `${nm} → +${enhOf(g)}` : `${nm} 그대로`, sub: res === 's' ? `능력치 +${n * 3}%` : saved ? `에테르 주괴 ${dn}개가 대신 부서졌다` : res === 'd' ? '강화 수치가 한 단계 내려갔다' : res === 'x' ? '' : `남은 강화 횟수 ${enhLeft(g)}/${ENH.tries}` }; log(msg, res === 's' ? 'good' : res === 'f' ? '' : 'bad'); changed(); return msg;
}
function whetUse(gid, n) {
  const f = findGear(gid), w = enhWhy(f); if (w) return w; const id = 'whet_' + n;
  if (!(S.inv[id] > 0)) return '그 숫돌이 없어요.'; if (!(f.g.enhN > 0)) return '강화 횟수가 가득 차 있어요.';
  S.inv[id]--; if (!S.inv[id]) delete S.inv[id]; f.g.enhN = Math.max(0, f.g.enhN - n); changed(); return `숫돌로 강화 횟수를 되돌렸다. (남은 횟수 ${enhLeft(f.g)}/${ENH.tries})`;
}
function reclaimDo(gid) {
  const f = findGear(gid), w = enhWhy(f); if (w) return w; const g = f.g, n = enhOf(g); if (!n) return '+1 이상인 장비만 회수할 수 있어요.';
  const id = 'ingot_' + n; if (!roomItem(id)) return WH_FULL;
  const nm = gearName(g); g.enh = 0; S.inv[id] = (S.inv[id] || 0) + 1; const msg = `회수로에서 ${nm}의 강화를 뽑아 「${ITEMS[id].name}」를 얻었다.`; log(msg, 'good'); changed(); return msg;
}
function ingotUse(gid, n) {
  const f = findGear(gid), w = enhWhy(f); if (w) return w; const g = f.g, id = 'ingot_' + n;
  if (!(S.inv[id] > 0)) return '그 주괴가 없어요.'; if (enhOf(g)) return '강화 주괴는 +0인 장비에만 쓸 수 있어요.';
  S.inv[id]--; if (!S.inv[id]) delete S.inv[id]; g.enh = n; const msg = `강화 주괴를 녹여 넣었다. ${gearName(g)}`; log(msg, 'good'); changed(); return msg;
}
function enhBuy(id) { const pr = ENH.shop[id]; if (!pr) return ''; if (S.gold < pr) return '돈이 모자라요.'; if (!roomItem(id)) return WH_FULL; S.gold -= pr; S.inv[id] = (S.inv[id] || 0) + 1; changed(); return `${ITEMS[id].name}을(를) 샀다.`; }
// 임시 마정석 드랍 (core.js kill — 갈무리 안에서): 몬스터 레벨대 등급
function mjDrop(p, e, f) {
  const big = f.boss || f.fb, gr = Math.max(0, Math.min(5, Math.floor((f.lv || 1) / 30)));
  loot(p, e, 'mj_' + gr, big ? 2 + Math.floor(rnd() * 2) : 1);   // 11-21 12:21 사용자 「마정석은 무조건 나오는 거야」 — 한 마리에 하나(우두머리 2 ~ 3), 짐꾼이 없어도 줄지 않는다(job72.js j1Hold)
}
const enhPct = v => (v ? `${v}%` : '—');
/* 강화 화면 (11-21 12:21 사용자): 큰 모루 무대 + 아래 장비 칸(강화 수치 높은 것부터) → 고르면 모루 위에 올라가고, 강화를 누르면 망치로 세 번 내려친 뒤
   결과 연출(성공 금빛 빛살 · 별 / 실패 연기 / 손상 붉은 번쩍 · 금 · 흔들림 / 파괴 네 조각으로 부서짐 / 에테르 주괴가 막음 푸른 막) + 결과 안내 판.
   모루 · 망치 · 배경은 ENH_ART(bg · anvil · hammer — GPT 그림이 오면 data-enhart.js로)에 있으면 그 그림, 없으면 임시 네모 그림. */
const ENH_HIT = 1.3;   // 망치질 초
const ENH_RES = { s: ['강화 성공!', 'ok'], f: ['강화 실패', 'fail'], d: ['손상', 'dmg'], x: ['파괴', 'brk'], v: ['파괴를 막았다', 'save'] };
const enhDustNeed = n => (ENH.table[n - 1][3] ? Math.floor((n - 16) / 5) + 1 : 0);   // 에테르 주괴: +16 ~ 20 하나 · +21 ~ 25 둘 · +26 ~ 30 셋 (파괴가 없는 단계는 못 넣음 — 내 판단)
const enhArt = k => (typeof ENH_ART !== 'undefined' && ENH_ART[k] ? ` style="background-image:url(${ENH_ART[k]})"` : '');
function enhStage(f) {
  const L = UI.enhLast, hit = UI.enhAnim ? Math.min(ENH_HIT, (Date.now() - UI.enhAnim) / 1000) : 0, g = f && f.g;
  const art = L && L.res === 'x' ? L.art : g ? gArt(g, 2) : '';
  const parts = L && L.res === 'x' ? [0, 1, 2, 3].map(i => `<span class="enh-pc p${i}">${L.art}</span>`).join('') : '';
  const stars = L && L.res === 's' ? [...Array(12)].map((_, i) => `<i class="enh-star" style="--a:${i * 30}deg;--d:${(i % 3) * 0.08}s"></i>`).join('') : '';
  const smoke = L && (L.res === 'f' || L.res === 'x') ? [...Array(6)].map((_, i) => `<i class="enh-smoke" style="--x:${(i - 2.5) * 14}px;--d:${i * 0.07}s"></i>`).join('') : '';
  const R = L && !UI.enhAnim ? ENH_RES[L.res] : null;
  const panel = R ? `<div class="enh-res ${R[1]}"><b>${R[0]}</b><span>${esc(L.line)}</span>${L.sub ? `<small>${esc(L.sub)}</small>` : ''}<button type="button" class="btn sm${L.res === 's' ? ' gold' : ''}" data-act="enhok">확인</button></div>` : '';
  return `<div class="enhst${UI.enhAnim ? ' hit' : ''}${R ? ' r-' + L.res : ''}${enhArt('bg') ? ' art' : ''}" style="--el:-${hit.toFixed(1)}s"><div class="enh-bg"${enhArt('bg')}></div>
    ${R && L.res === 's' ? '<div class="enh-rays"></div>' : ''}<div class="enh-anvil${enhArt('anvil') ? ' art' : ''}"${enhArt('anvil')}></div>
    <div class="enh-gear">${parts || art || '<span class="enh-empty">장비를 골라요</span>'}${R && L.res === 'd' ? '<i class="enh-crack"></i>' : ''}${R && L.res === 'v' ? '<i class="enh-shield"></i>' : ''}</div>
    <div class="enh-hammer${enhArt('hammer') ? ' art' : ''}"${enhArt('hammer')}></div><i class="enh-spark k1"></i><i class="enh-spark k2"></i><i class="enh-spark k3"></i>${stars}${smoke}${panel}</div>`;
}
function enhBox() {
  const all = gearsAll().filter(x => enhAble(x.g)).sort((x, y) => enhOf(y.g) - enhOf(x.g) || (y.g.q || 0) - (x.g.q || 0) || y.g.t - x.g.t);
  const f0 = UI.enhG != null ? findGear(UI.enhG) : null, f = f0 && enhAble(f0.g) ? f0 : null, have = id => S.inv[id] || 0, busy = !!UI.enhAnim || !!UI.enhLast;
  let ctl = '<div class="sub muted" style="text-align:center">아래에서 강화할 장비를 골라 모루에 올려요.</div>';
  if (f) {
    const g = f.g, cur = enhOf(g), n = cur + 1, top = n > ENH.max, T = top ? [0, 0, 0, 0] : ENH.table[n - 1], M = top ? null : enhMj(n), why = enhTryWhy(f), base = enhWhy(f), dn = top ? 0 : enhDustNeed(n);
    const whets = ENH.whet.filter(k => have('whet_' + k)).map(k => `<button type="button" class="btn sm" data-act="enhwhet" data-g="${g.id}" data-n="${k}"${base || busy || !(g.enhN > 0) ? ' disabled' : ''}>숫돌 +${k}회 (${have('whet_' + k)})</button>`).join('');
    const ingots = cur ? '' : Object.keys(S.inv).filter(k => ITEMS[k] && ITEMS[k].ingot && S.inv[k] > 0).sort((x, y) => ITEMS[y].ingot - ITEMS[x].ingot).map(k => `<button type="button" class="btn sm gold" data-act="enhingot" data-g="${g.id}" data-n="${ITEMS[k].ingot}"${base || busy ? ' disabled' : ''}>${ITEMS[k].name} 쓰기 (${S.inv[k]})</button>`).join('');
    ctl = `<div class="enh-name"><b>${gearName(g)}</b> ${qTag(g)}<span class="sub">${statLine(gearStats(g))}</span><span class="sub">${f.a ? esc(f.a.name) : '창고'} · 남은 강화 횟수 <b class="${enhLeft(g) ? '' : 'red-t'}">${enhLeft(g)}/${ENH.tries}</b></span></div>
      ${top ? '<div class="sub gold-t" style="text-align:center">가장 높은 강화예요.</div>' : `<div class="enh-rates"><span class="s"><small>성공</small><b>${enhPct(T[0])}</b></span><span class="f"><small>실패</small><b>${enhPct(T[1])}</b></span><span class="d"><small>손상 −1</small><b>${enhPct(T[2])}</b></span><span class="x"><small>파괴</small><b>${enhPct(UI.enhDust && dn ? 0 : T[3])}</b></span></div>
      <div class="sub" style="text-align:center">+${cur} → <b class="gold-t">+${n}</b> (능력치 +${n * 3}%) · ${fmt(enhGold(g, n))}G · ${iconImg(M.id)} ${ITEMS[M.id].name} ${M.q}개 <span class="${have(M.id) >= M.q ? 'muted' : 'red-t'}">(보유 ${have(M.id)})</span></div>
      <label class="enh-dust${dn ? '' : ' off'}"><input type="checkbox" data-act="enhdust"${UI.enhDust && dn ? ' checked' : ''}${dn && have('ether_dust') >= dn && !busy ? '' : ' disabled'}>${iconImg('ether_dust')}<span>에테르 주괴 사용 ${dn ? `<b>${dn}개</b> 들어감` : '<span class="muted">— 파괴 확률이 없는 단계</span>'} · 보유 <b class="${dn && have('ether_dust') < dn ? 'red-t' : ''}">${have('ether_dust')}개</b></span></label>
      <button type="button" class="btn gold block enh-go" data-act="enhgo" data-g="${g.id}"${why || busy ? ' disabled' : ''}>${why ? esc(why) : `강화 +${n}`}</button>`}
      <div class="btns" style="margin-top:6px;justify-content:center">${cur ? `<button type="button" class="btn sm" data-act="enhreclaim" data-g="${g.id}"${base || busy ? ' disabled' : ''}>회수로: +${cur} 강화 주괴로 뽑기</button>` : ''}${whets}${ingots}</div>`;
  }
  const cells = all.map(x => `<button type="button" class="cell${f && f.g === x.g ? ' on' : ''}${x.owner && x.owner.status !== 'idle' ? ' zero' : ''}" data-act="enhsel" data-g="${x.g.id}"${busy ? ' disabled' : ''} aria-label="${esc(gearName(x.g))}">${gArt(x.g, 2)}${enhOf(x.g) ? `<span class="qty enhq">+${enhOf(x.g)}</span>` : ''}${x.owner ? `<span class="enh-own">${esc(x.owner.name.slice(0, 2))}</span>` : ''}</button>`).join('');
  const shop = Object.keys(ENH.shop).map(id => `<div class="li">${iconImg(id)}<div class="grow stack"><span>${ITEMS[id].name} <b class="num">×${have(id)}</b></span><span class="sub">${ITEMS[id].desc}</span></div><button type="button" class="btn sm" data-act="enhbuy" data-it="${id}"${S.gold < ENH.shop[id] ? ' disabled' : ''}>${fmt(ENH.shop[id])}G</button></div>`).join('');
  const mj = MJ_GRADES.map((nm, i) => `${nm} ${have('mj_' + i)}`).join(' · ');
  const tbl = ENH.table.map((T, i) => `<tr><td>+${i + 1}</td><td>${enhPct(T[0])}</td><td>${enhPct(T[1])}</td><td>${enhPct(T[2])}</td><td>${enhPct(T[3])}</td><td>${MJ_GRADES[Math.floor(i / 5)]} ${1 + (i % 5)}</td></tr>`).join('');
  return `${enhStage(f)}<div class="card enh-ctl">${ctl}</div>
    <div class="sec"><b>장비</b><span>${all.length}점 · 강화 수치 높은 순 · 흐린 칸은 원정 중</span></div><div class="igrid enhgrid">${cells || '<span class="sub">강화할 장비가 없어요.</span>'}</div>
    <div class="sub muted">마정석: ${mj}</div>
    <details class="card"><summary>강화 확률표</summary><table class="enht"><tr><th>목표</th><th>성공</th><th>실패</th><th>손상</th><th>파괴</th><th>마정석</th></tr>${tbl}</table></details>
    <details class="card"><summary>숫돌 · 에테르 주괴 사기</summary><div class="list">${shop}</div></details>`;
}
// 강화 누르기: 망치질(ENH_HIT초) 뒤에 결과를 굴린다
function enhStart(gid) {
  if (UI.enhAnim || UI.enhLast) return; const f = findGear(gid), w = enhTryWhy(f); if (w) { say(w); return; }
  UI.enhAnim = Date.now(); [0.26, 0.66, 1.06].forEach(t => setTimeout(() => sfx('forge'), t * 1000));
  setTimeout(() => { UI.enhAnim = 0; const m = enhDo(gid); if (!UI.enhLast) say(m); else sfx(UI.enhLast.res === 's' ? 'win' : UI.enhLast.res === 'x' ? 'lose' : UI.enhLast.res === 'd' ? 'hurt' : UI.enhLast.res === 'v' ? 'buff' : 'miss');
    const top = winTop(); if (top && top.id === 'b') renderPanel(true); updateHud && updateHud(); saveGame && saveGame(); }, ENH_HIT * 1000);
}
Object.assign(ACT, {
  enhsel: d => { if (UI.enhAnim) return; UI.enhG = +d.g; UI.enhLast = null; $('panel') && ($('panel').scrollTop = 0); },
  enhgo: d => enhStart(+d.g),
  enhok: () => { UI.enhLast = null; },
  enhdust: () => { UI.enhDust = !UI.enhDust; },
  enhreclaim: d => { UI.enhLast = null; say(reclaimDo(+d.g)); },
  enhwhet: d => say(whetUse(+d.g, +d.n)),
  enhingot: d => { UI.enhLast = null; say(ingotUse(+d.g, +d.n)); },
  enhbuy: d => say(enhBuy(d.it))
});
