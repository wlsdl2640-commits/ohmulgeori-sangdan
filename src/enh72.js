/* ───────── 장비 강화 +1 ~ +30 · 마정석 · 숫돌 · 에테르 쇳가루 · 회수로 (빌드 72 · 11-21 11:44 ~ 11:59 사용자) ─────────
   · 파티가 마을에 있을 때(장비 주인이 쉬는 중이거나 창고의 장비) 대장간에서. 결과는 성공(+1) · 실패(그대로) · 손상(−1) · 파괴(장비가 사라짐).
     +1은 100%, 오를수록 성공 몫을 넷이 나눠 가진다(ENH.table — 사용자에게 보인 초안 그대로). 강화 +1마다 능력치 +3%.
   · 비용 = 돈 + 마정석. 마정석 등급은 다섯 단계마다 오른다(+1 ~ 5 최하급 · +6 ~ 10 하급 · +11 ~ 15 중급 · +16 ~ 20 중상급 · +21 ~ 25 상급 · +26 ~ 30 최상급).
   · 에테르 쇳가루: 강화할 때 넣으면 파괴가 실패로 바뀐다(넣을 때마다 하나 씀).
   · 장비마다 강화는 100번까지(시도할 때마다 1번 — 내 판단). 숫돌(+1 · 3 · 5 · 7 · 10회)이 되돌려 준다.
   · 회수로: +N 장비 → 「+N 강화 주괴」 + 장비는 +0. 주괴는 +0 장비에만 써서 +N으로. 회수 · 주괴는 강화 횟수를 안 쓰고 횟수는 장비에 남는다(내 판단).
   · 임시(사용자가 안 정한 것): 돈 · 마정석 개수 · 마정석 드랍(몬스터 레벨대로 8% · 우두머리 1 ~ 3개) · 숫돌 · 쇳가루 값(대장간에서 삼) — 마정석 · 부속품을 새로 짤 때 다시 정한다. */
const ENH = { max: 30, per: 0.03, tries: 100, whet: [1, 3, 5, 7, 10], mjDrop: 0.08,
  table: [[100, 0, 0, 0], [95, 5, 0, 0], [90, 10, 0, 0], [85, 15, 0, 0], [80, 20, 0, 0], [75, 25, 0, 0], [70, 30, 0, 0], [65, 33, 2, 0], [60, 36, 4, 0], [55, 39, 6, 0],
    [50, 40, 10, 0], [45, 42, 13, 0], [40, 43, 17, 0], [36, 44, 20, 0], [32, 45, 23, 0], [28, 45, 26, 1], [25, 45, 28, 2], [22, 44, 31, 3], [19, 44, 33, 4], [16, 43, 36, 5],
    [14, 42, 38, 6], [12, 41, 40, 7], [10, 40, 42, 8], [8, 39, 44, 9], [7, 37, 46, 10], [6, 35, 47, 12], [5, 33, 48, 14], [4, 31, 49, 16], [3, 29, 50, 18], [2, 27, 51, 20]],
  shop: { ether_dust: 5000, whet_1: 800, whet_3: 2200, whet_5: 3500, whet_7: 4700, whet_10: 6500 } };
const MJ_GRADES = ['최하급', '하급', '중급', '중상급', '상급', '최상급'];
const MJ_V = [30, 120, 500, 2000, 8000, 30000], MJ_C = ['#8a94a8', '#6ab0d8', '#5ad0a0', '#e0c050', '#e08040', '#d050e0'];
MJ_GRADES.forEach((n, i) => { ITEMS['mj_' + i] = { name: `${n} 마정석`, v: MJ_V[i], w: 1, icon: 'ore', c: MJ_C[i], g: i, mj: i + 1, keep: 1, desc: '강한 마나를 머금은 광물. 미궁 밖 세상이 이것으로 돌아간다고 할 만큼 큰 에너지 자원이다. 장비 강화에도 쓴다.' }; });
ITEMS.ether_dust = { name: '에테르 쇳가루', v: 1500, w: 1, icon: 'ore', c: '#9ad8f0', g: 3, keep: 1, desc: '강화할 때 넣으면 장비가 파괴될 결과를 실패로 바꿔 준다. 넣을 때마다 하나를 쓴다.' };
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
  if (UI.enhDust && !(S.inv.ether_dust > 0)) return '에테르 쇳가루가 없어요.';
  return '';
}
function enhGone(f) { if (f.a) { for (const [sl] of SLOTS) if (f.a.eq[sl] === f.g) f.a.eq[sl] = null; clampVitals && clampVitals(f.a); } else S.gear = S.gear.filter(x => x !== f.g); }
function enhDo(gid) {
  const f = findGear(gid), w = enhTryWhy(f); if (w) return w;
  const g = f.g, n = enhOf(g) + 1, M = enhMj(n), T = ENH.table[n - 1], dust = !!UI.enhDust, nm = gearName(g);
  S.gold -= enhGold(g, n); S.inv[M.id] -= M.q; if (!S.inv[M.id]) delete S.inv[M.id];
  if (dust) { S.inv.ether_dust--; if (!S.inv.ether_dust) delete S.inv.ether_dust; }
  g.enhN = (g.enhN | 0) + 1;
  const r = rnd() * 100; let res = r < T[0] ? 's' : r < T[0] + T[1] ? 'f' : r < T[0] + T[1] + T[2] ? 'd' : 'x', saved = false;
  if (res === 'x' && dust) { res = 'f'; saved = true; }
  let msg;
  if (res === 's') { g.enh = n; msg = `강화 성공! ${gearName(g)}`; sfx && sfx('coin'); }
  else if (res === 'f') msg = saved ? `파괴될 뻔했지만 에테르 쇳가루가 막았다. ${nm} 그대로.` : `강화 실패. ${nm} 그대로.`;
  else if (res === 'd') { g.enh = Math.max(0, n - 2); msg = `손상! ${nm} → ${gearName(g)}`; }
  else { enhGone(f); UI.enhG = null; msg = `파괴… ${nm}이(가) 부서져 사라졌다.`; }
  UI.enhLast = { res, msg }; log(msg, res === 's' ? 'good' : res === 'f' ? '' : 'bad'); changed(); return msg;
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
  if (big) loot(p, e, 'mj_' + gr, 1 + Math.floor(rnd() * 3)); else if (rnd() < ENH.mjDrop) loot(p, e, 'mj_' + gr, 1);
}
const enhPct = v => (v ? `${v}%` : '—');
function enhBox() {
  const all = gearsAll().filter(x => enhAble(x.g)).sort((x, y) => enhOf(y.g) - enhOf(x.g) || (y.g.q || 0) - (x.g.q || 0) || y.g.t - x.g.t);
  const f = UI.enhG != null ? findGear(UI.enhG) : null, have = id => S.inv[id] || 0;
  let card = '<div class="card"><div class="sub">아래에서 강화할 장비를 골라요. 주인이 원정 중인 장비는 돌아온 뒤에 할 수 있어요.</div></div>';
  if (f && enhAble(f.g)) {
    const g = f.g, cur = enhOf(g), n = cur + 1, top = n > ENH.max, T = top ? null : ENH.table[n - 1], M = top ? null : enhMj(n), why = enhTryWhy(f), base = enhWhy(f);
    const res = UI.enhLast ? `<div class="sub ${UI.enhLast.res === 's' ? 'ok-t' : UI.enhLast.res === 'f' ? 'gold-t' : 'red-t'}"><b>${esc(UI.enhLast.msg)}</b></div>` : '';
    const whets = ENH.whet.filter(k => have('whet_' + k)).map(k => `<button type="button" class="btn sm" data-act="enhwhet" data-g="${g.id}" data-n="${k}"${base || !(g.enhN > 0) ? ' disabled' : ''}>숫돌 +${k}회 (${have('whet_' + k)})</button>`).join('');
    const ingots = cur ? '' : Object.keys(S.inv).filter(k => ITEMS[k] && ITEMS[k].ingot && S.inv[k] > 0).sort((x, y) => ITEMS[y].ingot - ITEMS[x].ingot).map(k => `<button type="button" class="btn sm gold" data-act="enhingot" data-g="${g.id}" data-n="${ITEMS[k].ingot}"${base ? ' disabled' : ''}>${ITEMS[k].name} 쓰기 (${S.inv[k]})</button>`).join('');
    card = `<div class="card hl"><div class="row">${gArt(g, 2)}<div class="grow"><div class="h">${gearName(g)} ${qTag(g)}</div><div class="sub">${statLine(gearStats(g))}</div><div class="sub">${f.a ? `${esc(f.a.name)}이(가) 쓰는 중` : '창고에 보관 중'} · 강화 +${cur} (능력치 +${cur * 3}%) · 남은 강화 횟수 <b class="${enhLeft(g) ? '' : 'red-t'}">${enhLeft(g)}/${ENH.tries}</b></div></div></div>
      ${res}
      ${top ? '<div class="sub gold-t">가장 높은 강화예요.</div>' : `<div class="sub"><b>+${n} 도전</b> (능력치 +${n * 3}%) · <span class="ok-t">성공 ${enhPct(T[0])}</span> · 실패 ${enhPct(T[1])} · <span class="gold-t">손상(−1) ${enhPct(T[2])}</span> · <span class="red-t">파괴 ${enhPct(T[3])}</span></div>
      <div class="sub">비용 ${fmt(enhGold(g, n))}G · ${iconImg(M.id)} ${ITEMS[M.id].name} ${M.q}개 <span class="${have(M.id) >= M.q ? 'muted' : 'red-t'}">(가진 것 ${have(M.id)})</span></div>
      <label class="row sub" style="gap:6px"><input type="checkbox" data-act="enhdust"${UI.enhDust ? ' checked' : ''}${have('ether_dust') ? '' : ' disabled'}> 에테르 쇳가루 넣기 — 파괴를 실패로 바꿔요 (가진 것 ${have('ether_dust')})</label>
      <button type="button" class="btn gold block" data-act="enhgo" data-g="${g.id}"${why ? ' disabled' : ''}>${why ? esc(why) : `+${n} 강화하기`}</button>`}
      <div class="btns" style="margin-top:6px">${cur ? `<button type="button" class="btn sm" data-act="enhreclaim" data-g="${g.id}"${base ? ' disabled' : ''}>회수로: +${cur} 강화 주괴로 뽑기</button>` : ''}${whets}${ingots}</div></div>`;
  }
  const rows = all.map(x => `<div class="li${f && f.g === x.g ? ' sel' : ''}">${gArt(x.g, 1)}<div class="grow stack"><span>${gearName(x.g)} ${qTag(x.g)}${x.owner ? ` <span class="tag">${esc(x.owner.name)}</span>` : ''}</span><span class="sub">남은 횟수 ${enhLeft(x.g)}/${ENH.tries}${x.owner && x.owner.status !== 'idle' ? ' · <span class="red-t">원정 중</span>' : ''}</span></div><button type="button" class="btn sm" data-act="enhsel" data-g="${x.g.id}">고르기</button></div>`).join('');
  const shop = Object.keys(ENH.shop).map(id => `<div class="li">${iconImg(id)}<div class="grow stack"><span>${ITEMS[id].name} <b class="num">×${have(id)}</b></span><span class="sub">${ITEMS[id].desc}</span></div><button type="button" class="btn sm" data-act="enhbuy" data-it="${id}"${S.gold < ENH.shop[id] ? ' disabled' : ''}>${fmt(ENH.shop[id])}G</button></div>`).join('');
  const mj = MJ_GRADES.map((nm, i) => `${nm} ${have('mj_' + i)}`).join(' · ');
  const tbl = ENH.table.map((T, i) => `<tr><td>+${i + 1}</td><td>${enhPct(T[0])}</td><td>${enhPct(T[1])}</td><td>${enhPct(T[2])}</td><td>${enhPct(T[3])}</td><td>${MJ_GRADES[Math.floor(i / 5)]} ${1 + (i % 5)}</td></tr>`).join('');
  return `${card}<div class="sub muted">마정석: ${mj}</div>
    <details class="card"><summary>강화 확률표</summary><table class="enht"><tr><th>목표</th><th>성공</th><th>실패</th><th>손상</th><th>파괴</th><th>마정석</th></tr>${tbl}</table></details>
    <details class="card"><summary>숫돌 · 에테르 쇳가루 사기</summary><div class="list">${shop}</div></details>
    <div class="sec"><b>장비</b><span>${all.length}점 · 강화 +1마다 능력치 +3%</span></div><div class="list">${rows || '<div class="li"><span class="sub">강화할 장비가 없어요.</span></div>'}</div>`;
}
Object.assign(ACT, {
  enhsel: d => { UI.enhG = +d.g; UI.enhLast = null; $('panel') && ($('panel').scrollTop = 0); },
  enhgo: d => { say(enhDo(+d.g)); },
  enhdust: () => { UI.enhDust = !UI.enhDust; },
  enhreclaim: d => { UI.enhLast = null; say(reclaimDo(+d.g)); },
  enhwhet: d => say(whetUse(+d.g, +d.n)),
  enhingot: d => { UI.enhLast = null; say(ingotUse(+d.g, +d.n)); },
  enhbuy: d => say(enhBuy(d.it))
});
