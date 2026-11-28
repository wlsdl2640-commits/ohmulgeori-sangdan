/* ───────── 빌드 79: 1층 광맥 콩벌레 · 소형 광물 조각 · 대장간 조각 거래 (11-28 대표님 — 회의 e8 · ai-meeting decisions.md) ─────────
   · 몬스터 MONS.orebug(data.js) · 스킬 등딱지 웅크리기 = 단단해지기(방어 ×1.5 · 10초 · 재사용 20초, data-fight.js) · 그림 · 동작 data-pxl78.js(export78.py) · hd70.js
   · 1-4 ~ 1-10 일반 전투의 30%에 콩벌레끼리 1 ~ 2마리(각 50%) — 나머지 70%는 콩벌레 없이 예전 무리
   · 전리품은 소형 조각만, 마리당 40%로 1개 — 갈무리(짐꾼) 없이 바로 가방에, 단 가방(짐 최대치)에 들어가는 만큼만
   · 대장간: 소형 조각 10개 + 20G → 최하급 주괴 1개를 바로 바꿔 준다(정제 · 가공 단계를 거치지 않는 특이 케이스). 다른 광물은 예전처럼 광물 → 주괴 */
const OREBUG79 = { p: 0.3, drop: 0.4, n: 10, fee: 20, out: 'p_ore_0' };
ITEMS.f1_ore_chip = { name: '소형 광물 조각', v: 6, w: 1, icon: 'ore', c: '#c8ccd4', g: 0, keep: 1, desc: `광맥 콩벌레의 등딱지에서 떨어진 작은 쇳조각. 대장간에서 ${OREBUG79.n}개를 주면 최하급 주괴 하나로 바꿔 준다.` };
DROP79.mon.orebug = ['armor', 'def', 0];   // 주력 주문서: 방어구 방어 · 숫돌 없음

// 무리: 콩벌레가 나오는 칸이면 30%는 콩벌레끼리, 아니면 콩벌레를 빼고 예전대로
const _st20Pack79 = st20Pack;
st20Pack = function (F, e, pool, extra) {   // eslint-disable-line no-func-assign
  if (!pool.includes('orebug')) return _st20Pack79(F, e, pool, extra);
  const rest = pool.filter(id => id !== 'orebug');
  if (!rest.length || rnd() < OREBUG79.p) return Array(rnd() < 0.5 ? 1 : 2).fill('orebug');
  return _st20Pack79(F, e, rest, extra);
};

// 전리품: 갈무리를 거치지 않고 바로 가방에 (loot가 짐 최대치를 지킨다)
const _matDrop79 = matDrop;
matDrop = function (p, e, f) {   // eslint-disable-line no-func-assign
  _matDrop79(p, e, f);
  if (!e || !f || f.id !== 'orebug' || f.sum || e.pvp || rnd() >= OREBUG79.drop) return;
  const kq = e.kq; e.kq = null; loot(p, e, 'f1_ore_chip', 1); e.kq = kq;
};

// 대장간 조각 거래
const chipMax79 = () => Math.min(Math.floor((S.inv.f1_ore_chip || 0) / OREBUG79.n), Math.floor(S.gold / OREBUG79.fee));
function chipTradeWhy(n) {
  if (!(n > 0)) return '';
  if ((S.inv.f1_ore_chip || 0) < OREBUG79.n * n) return `소형 광물 조각이 ${OREBUG79.n * n}개 필요해요.`;
  if (S.gold < OREBUG79.fee * n) return '돈이 모자라요.';
  if (typeof roomItem === 'function' && !roomItem(OREBUG79.out, (S.inv.f1_ore_chip || 0) === OREBUG79.n * n ? 1 : 0)) return WH_FULL;
  return '';
}
function chipTrade(n) {
  const w = chipTradeWhy(n); if (w) return w;
  S.inv.f1_ore_chip -= OREBUG79.n * n; if (!S.inv.f1_ore_chip) delete S.inv.f1_ore_chip;
  S.gold -= OREBUG79.fee * n; S.stats.spent = (S.stats.spent || 0) + OREBUG79.fee * n;
  addTo(S.inv, OREBUG79.out, n); changed();
  return `소형 광물 조각 ${OREBUG79.n * n}개를 ${ITEMS[OREBUG79.out].name} ${n}개로 바꿨다.`;
}
const _forgeMatBox79 = forgeMatBox;
forgeMatBox = function () {   // eslint-disable-line no-func-assign
  const have = S.inv.f1_ore_chip || 0, mx = chipMax79();
  const btn = n => `<button type="button" class="btn sm${n > 1 ? '' : ' gold'}" data-act="chiptrade" data-n="${n}"${chipTradeWhy(n) ? ' disabled' : ''}>${n}개</button>`;
  const box = have || (S.inv[OREBUG79.out] || 0) ? `<div class="sec" style="margin-top:6px"><b>조각 거래</b><span>광맥 콩벌레의 소형 조각 → 주괴 (바로)</span></div>
    <div class="list"><div class="li">${iconImg(OREBUG79.out)}<div class="grow stack"><span>${ITEMS[OREBUG79.out].name} <b class="num">×${S.inv[OREBUG79.out] || 0}</b></span>
    <span class="sub">${iconImg('f1_ore_chip')} ${ITEMS.f1_ore_chip.name} <span class="${have >= OREBUG79.n ? '' : 'red-t'}">${have}/${OREBUG79.n}</span> · ${OREBUG79.fee}G</span></div>
    <div class="btns">${btn(1)}${mx >= 5 ? btn(5) : ''}${mx > 1 ? `<button type="button" class="btn sm" data-act="chiptrade" data-n="${mx}">모두 (${mx})</button>` : ''}</div></div></div>` : '';
  return _forgeMatBox79() + box;
};
Object.assign(ACT, { chiptrade: d => say(chipTrade(+d.n)) });

// ── 데모 제작 정리 (e8) ──
GTYPES.bag.cls = ['porter'];   // 11-25 결정: 가방은 짐꾼 계열 전용
const _forgeGearWhy79 = forgeGearWhy;
forgeGearWhy = function (base, t, lv, sm) {   // eslint-disable-line no-func-assign
  if (TEST_SCOPE && t > 0) return '시험판에서는 견습 장비만 만들어요.';   // 장비 단계는 #10에서 없앤다 — 그때까지 시험판은 견습만
  return _forgeGearWhy79(base, t, lv, sm);
};
