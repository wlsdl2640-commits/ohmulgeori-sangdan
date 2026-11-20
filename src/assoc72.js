/* ───────── 모험가 협회에 팔기 · 협회 의뢰 · 명성 (빌드 72 · 11-21 02:20 사용자) ─────────
   · 상점(진열하고 파는 기능)은 없다(SHOP_ON) — 모든 부속품은 모험가 협회에 판다.
   · 협회 의뢰: 날마다 06:00에 새 의뢰가 붙는다. 특정 몬스터 부속품을 10 · 20 · 30 · 40 · 50개 가져오는 의뢰. 의뢰로 얻는 길드 명성는 그냥 팔 때의 2배.
   · 개인 명성(a.pf): 그 부속품을 얻어 온 원정대의 길드원들이, 그 부속품이 의뢰품으로 전달되거나 협회에 팔릴 때 얻는다. 부속품 등급에 따라 다르고, 의뢰와 판매의 값이 다르다.
   · 누가 얻어 왔는지: S.src[물건] = [[개수, [길드원 id …]] …] (먼저 들어온 것부터 나간다 — 원정대가 돌아올 때 store.js unloadBag이 적는다. 사 온 것 · 수거소 것은 임자가 없다) */
const SHOP_ON = false;
const ASSOC = {
  gfame: [0.01, 0.03, 0.06, 0.15, 0.4, 1, 2.5],     // 길드 명성: 협회에 팔 때 부속품 하나마다 (등급 일반 ~ 신성)
  reqMul: 2,                                         // 의뢰로 전달하면 길드 명성 ×2
  pSell: [0.02, 0.05, 0.1, 0.25, 0.6, 1.5, 3],       // 개인 명성: 팔렸을 때 하나마다
  pReq: [0.05, 0.12, 0.25, 0.6, 1.5, 3.5, 8],        // 개인 명성: 의뢰품으로 전달됐을 때 하나마다
  qty: [10, 20, 30, 40, 50], board: 4, due: 3, pay: 1.5, hour: 6
};
const assocG = k => Math.max(0, Math.min(6, typeof itemGrade === 'function' ? itemGrade(k) : 0));
function srcAdd(k, q, ids) { if (!ids || !ids.length || q <= 0) return; S.src = S.src || {}; const L = S.src[k] = S.src[k] || []; const last = L[L.length - 1]; if (last && last[1].join() === ids.join()) last[0] += q; else L.push([q, ids.slice()]); if (L.length > 40) L.splice(0, L.length - 40); }
// 창고에서 q개가 나갈 때: 임자 있는 몫을 먼저 들어온 것부터 꺼낸다 (임자 몫이 재고보다 많으면 — 제작에 쓴 만큼 — 오래된 것부터 버린다)
function srcTake(k, q, stockBefore) {
  const L = (S.src || {})[k]; if (!L) return [];
  let sum = L.reduce((a, x) => a + x[0], 0), over = sum - stockBefore;
  while (over > 0 && L.length) { const d = Math.min(over, L[0][0]); L[0][0] -= d; over -= d; if (L[0][0] <= 0) L.shift(); }
  const out = []; let need = q;
  while (need > 0 && L.length) { const d = Math.min(need, L[0][0]); out.push([d, L[0][1]]); L[0][0] -= d; need -= d; if (L[0][0] <= 0) L.shift(); }
  if (!L.length) delete S.src[k];
  return out;
}
// 협회에 넘긴 부속품의 명성: 길드 명성(소수는 모아 둔다)와 얻어 온 길드원들의 개인 명성. 돌려주는 값 = { g: 이번에 오른 길드 명성(정수), p: 개인 명성를 얻은 사람 수 }
function assocFame(k, q, stockBefore, req) {
  const gr = assocG(k), gf = ASSOC.gfame[gr] * q * (req ? ASSOC.reqMul : 1);
  S.fameAcc = (S.fameAcc || 0) + gf; const up = Math.floor(S.fameAcc); if (up) { S.fame += up; S.fameAcc -= up; }
  const per = (req ? ASSOC.pReq : ASSOC.pSell)[gr], who = new Set();
  for (const [n, ids] of srcTake(k, q, stockBefore)) for (const id of ids) { const a = S.advs.find(x => x.id === id); if (a) { a.pf = (a.pf || 0) + per * n; who.add(id); } }
  return { g: up, p: who.size };
}
// 협회 의뢰에 나올 부속품: 가 본 계층(과 미개척지대)의 몬스터가 떨어뜨리는 것
function assocPool() {
  const out = [], ids = ALL_FIELDS.filter(f => FIELDS[f] && isLab(f));
  for (const f of ids) { const best = (S.fields[f] || {}).best || 0; if (!best && f !== LAB_IDS()[0]) continue;
    for (const m of FIELDS[f].mons) if (MONS[m] && minStage(MONS[m]) <= best + 12) for (const [it] of MONS[m].drops || []) if (ITEMS[it] && !ITEMS[it].egg && !out.includes(it)) out.push(it); }
  return out.length ? out : giftPool();
}
function genAssocReq() {
  if (S.reqs.length >= ASSOC.board) return false;
  const pool = assocPool().filter(k => !S.reqs.some(r => r.item === k)); if (!pool.length) return false;
  const it = pickOne(pool), top = Math.min(ASSOC.qty.length, 2 + (S.rank || 0)), qty = ASSOC.qty[ri(0, top - 1)], v = ITEMS[it].v;
  S.reqs.push({ id: nid(), client: '모험가 협회', assoc: 1, item: it, qty, reward: Math.max(5, Math.round(v * qty * guildRate() * ASSOC.pay / 5) * 5), fame: Math.round(ASSOC.gfame[assocG(it)] * qty * ASSOC.reqMul * 10) / 10, due: today() + ASSOC.due });
  return true;
}
// 날마다 06:00: 게시판을 채운다 (step마다 불러도 된다)
function assocTick() {
  const d6 = Math.floor((S.t - DAY_SEC * (ASSOC.hour - HOUR0) / 24) / DAY_SEC);
  if (S.areqDay === d6) return; const first = S.areqDay == null; S.areqDay = d6;
  let n = 0; while (genAssocReq()) n++;
  if (n && !first) { log(`모험가 협회 게시판에 새 의뢰 ${n}건이 붙었다.`); if (HOOKS.toast) HOOKS.toast(`협회 의뢰 ${n}건이 새로 붙었어요`); }
}
