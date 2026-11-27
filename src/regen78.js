/* ───────── 빌드 78: 리젠보스 · 마법 걸린 밀짚 반지 · 협회 로비 소문 (11-27 대표님 — ai-meeting decisions.md 「리젠보스」 첫째 · 둘째 결정) ─────────
   · 리젠보스 = 정해진 스테이지의 눈에 띄는 자리에서만 나오는 보스. 잡으면 **현실 시간**으로 다시 나올 때까지 기다린다(게임을 꺼 둬도 흐른다 — Date.now()).
     1층 곡창지대: 첫째 짚단 사신(C1) = 1-8 밀짚더미 · 15분 / 둘째 푸른 모자 사신(C2) = 1-16 낡은 축사 · 30분. 길드 하나에 하나(파티끼리 같이 쓴다 — 먼저 닿은 파티가 싸운다).
   · 정해진 보상은 없다 — 모두 무작위(확률은 낮게, 아래 REGEN78.drop). 첫째 = 마법 걸린 밀짚 반지(제작 불가 · 능력치 고정), 둘째 = 1차 여섯 계열의 스킬북 여섯 가운데 하나(거래 가능).
     리젠보스는 펼치는 무작위 스킬북(단계 책) · 보통 장비를 떨어뜨리지 않는다(core.js kill — f.regen). 부속품 · 마정석 · 재료는 다른 몬스터처럼.
   · 지도 · 화면에 「출현 중 · 남은 시간」을 보이지 않는다 — 협회 로비 모험가 · 지나가는 모험가의 소문 대사로만 알린다(늘 도는 소문 · 나와 있을 때만 도는 소문).
   상태 S.regen[열쇠] = { next: 다시 나오는 때(ms, 없으면 지금 나와 있음), busy: 싸우기 시작한 때(ms — 2분 동안은 다른 파티가 못 만난다), kills, told: 나왔다고 알린 next } */
const REGEN78 = {
  c1: { mon: 'scare_c1', field: 'plains', stage: 8, min: 15, lvAdd: 3, hp: 4.5, atk: 1.3, spot: '밀짚더미',
        drop: [['ring', 0.10]] },
  c2: { mon: 'scare_c2', field: 'plains', stage: 16, min: 30, lvAdd: 4, hp: 5.5, atk: 1.4, spot: '낡은 축사',
        drop: [['book', 0.24]] }
};
const REGEN_BUSY = 120000;   // 싸우는 중(2분)에는 다른 파티가 못 만난다 — 지거나 물러나면 2분 뒤 다시 만날 수 있다
// 둘째 리젠보스의 1차 스킬북 여섯 (11-27 대표님 「여섯 종류로」): 전사 철벽 · 궁수 연사 · 마법사 연쇄 번개 · 성직자 축복 · 도적 독 바르기 · 짐꾼 튼튼한 등짐
const REGEN_BOOKS78 = ['ironwall', 'double', 'chain', 'bless', 'venom', 'sturdy'];

// ── 마법 걸린 밀짚 반지 (보스 드롭 장비 — 제작 불가 · 능력치 고정 · 희귀 고정 · Lv1, e2 회의안) ──
// gearStats = st × 단계 배율(견습 1) × 희귀 1.55 → 힘 · 체력 · 민첩 · 지능 +6 · 치명 +4%p. GTYPE_IDS · CRAFT_IDS 뒤에 더해서 떨어뜨리기 · 대장간 · 합성 목록에 안 들어간다
GTYPES.strawring = { name: '마법 걸린 밀짚 반지', slot: 'acc', cls: ['all'], st: { str: 6 / 1.55, vit: 6 / 1.55, agi: 6 / 1.55, int: 6 / 1.55, crit: 0.04 / 1.55 }, w: 1, icon: 'ring',
  boss: 1, nocraft: 1, shieldStart: 0.12, desc: '허수아비 사신이 밀짚더미 속에 감춰 둔 반지. 짚 사이로 옅은 마력이 돈다 — 싸움이 시작되면 끼고 있는 사람을 한 번 감싼다(최대 HP의 12% 보호막).' };
if (typeof WNAME !== 'undefined') WNAME.strawring = ['마법 걸린 밀짚 반지'];
function strawRing() { return { id: nid(), base: 'strawring', t: 0, q: 2, bonus: null, runes: [] }; }
// 싸움 시작 보호막: 마석 아쿠아마린(msSpawn)과 같은 길 — 그것을 감싼다
const _msSpawn78 = msSpawn;
msSpawn = function (e) {   // eslint-disable-line no-func-assign
  _msSpawn78(e);
  const p = partyOfE(e); if (!p) return;
  for (const a of teamOf(p)) {
    if (!up(a) || !a.eq) continue;
    const pct = Object.values(a.eq).reduce((s, g) => s + (g && GTYPES[g.base] && GTYPES[g.base].shieldStart || 0), 0); if (!pct) continue;
    const amt = Math.max(1, Math.round(derive(a).maxHp * pct)), sid = 'strawring@' + a.id;
    e.buffs = (e.buffs || []).filter(b => b.sid !== sid);
    e.buffs.push({ sid, to: a.id, stat: 'shield', hp: amt, max: amt, t: 600 });
    ev(e, 'shield', { d: a.id, v: amt, ms: 1 });
  }
};

// ── 리젠 상태 ──
const regenSt = k => { S.regen = S.regen || {}; return S.regen[k] || (S.regen[k] = { next: 0, busy: 0, kills: 0, told: 0 }); };
const regenUp = k => Date.now() >= (regenSt(k).next || 0);
function regenAt(e) {   // 이 원정이 지금 이 스테이지에서 만날 리젠보스 열쇠 (없으면 null)
  if (e.area !== 'field' || e.mode !== 'advance' || e.pvp) return null;
  for (const k in REGEN78) {
    const R = REGEN78[k], r = regenSt(k);
    if (R.field !== e.field || R.stage !== e.stage || !regenUp(k)) continue;
    if (r.busy && Date.now() - r.busy < REGEN_BUSY) continue;
    return k;
  }
  return null;
}
function regenFoe(k, lv) {
  const R = REGEN78[k], f = foeFrom(R.mon, lv + R.lvAdd);
  f.hp = f.maxHp = Math.round(f.maxHp * R.hp); f.atk *= R.atk; f.def *= 1.2;
  f.boss = true; f.regen = k; f.aoe = true; f.sc = 2;
  f.name = `리젠보스 ${MONS[R.mon].name}`;
  regenSt(k).busy = Date.now();
  return f;
}
function regenDown(p, e, f) {   // core.js kill이 부른다 — 시계를 다시 돌리고 무작위 드롭(짐이 차 있어도 넣는다)
  const k = f.regen, R = REGEN78[k], r = regenSt(k);
  r.next = Date.now() + R.min * 60000; r.busy = 0; r.kills = (r.kills || 0) + 1;
  const got = [];
  for (const [what, ch] of R.drop) {
    if (rnd() >= ch) continue;
    if (what === 'ring') { e.gbag.push(strawRing()); got.push('마법 걸린 밀짚 반지'); }
    else if (what === 'book') { const id = pickOne(REGEN_BOOKS78), it = 'book_' + id; if (ITEMS[it]) { addTo(e.bag, it, 1); got.push(ITEMS[it].name); } }
  }
  if (got.length) { log(`${p.name}이(가) ${f.name}에게서 「${got.join('」 · 「')}」을(를) 얻었다!`, 'good'); HOOKS.toast(`리젠보스 드롭 · ${got.join(' · ')}`); }
  else log(`${f.name}이(가) 짚더미로 무너졌다. 이번엔 아무것도 남기지 않았다.`, 'muted');
}

// ── 소문 (협회 로비 배경 모험가 · 지나가는 모험가) ──
// 늘 도는 소문: 어디서 나온다더라(흐릿하게) / 나와 있을 때만: 방금 봤다더라
const RUMOR78 = {
  c1: { base: ['평원 가운데 밀짚더미 말이야… 바람도 안 부는데 혼자 들썩이더라고.',
               '까마귀가 유난히 모여드는 밀짚더미가 있다던데. 거기 뭐가 묻혀 있는 거 아냐?',
               '밀짚으로 엮은 반지를 끼고 다니는 녀석을 봤어. 허수아비한테서 나왔다나?'],
        up:   ['방금 들어온 녀석이 그러는데, 밀짚더미가 또 일어났대! 까마귀 떼가 하늘을 덮었다나.',
               '평원 가는 파티 있으면 조심해. 밀짚더미 쪽 까마귀들이 다시 시끄러워.'] },
  c2: { base: ['평원 끝 버려진 축사엔 가지 마. 주인이 떠난 지 오래인데, 밤마다 낫 가는 소리가 난대.',
               '그 축사에서 나온 놈이 오래된 기술서를 품고 있었다던데… 진짜일까?',
               '허수아비가 다 똑같은 줄 알아? 푸른 모자 쓴 놈은 차원이 달라.'],
        up:   ['축사 문이 열려 있더래. 안에서 뭔가 낫을 끌며 나왔다고…',
               '지금 축사 근처는 피하라던데? 푸른 모자가 돌아왔대.'] }
};
const RUMOR_WHO = ['창을 멘 모험가', '술잔을 든 궁수', '붕대를 감은 전사', '짐을 내려놓은 짐꾼', '모자를 눌러쓴 도적', '책을 낀 마법사', '나이 든 사제'];
function rumorLines(n = 2) {   // 지금 들리는 소문 n줄 [누가, 말] — 1분마다 바뀐다. 나와 있는 리젠보스가 있으면 그 「봤다더라」가 먼저(70%)
  const slot = Math.floor(Date.now() / 60000), pool = [], hot = [];
  for (const k in RUMOR78) { const L = RUMOR78[k]; pool.push(...L.base); if (regenUp(k) && (regenSt(k).kills || 0) > 0) hot.push(...L.up); }
  const out = [], h = i => ((slot * 2654435761 + i * 40503) >>> 0);
  if (hot.length && h(9) % 10 < 7) out.push(hot[h(1) % hot.length]);
  for (let i = 0; out.length < n && i < 20; i++) { const s = pool[h(i + 2) % pool.length]; if (!out.includes(s)) out.push(s); }
  return out.map((s, i) => [RUMOR_WHO[h(i + 30) % RUMOR_WHO.length], s]);
}
function rumorBox() {   // panels.js 협회 의뢰 창 맨 위
  return `<div class="card rumor"><div class="sub"><b>협회 로비의 소문</b> <span class="muted">· 로비 한쪽에서 모험가들이 수군거린다</span></div>${rumorLines(2).map(([w, s]) => `<div class="sub">「${s}」 <span class="muted">— ${w}</span></div>`).join('')}</div>`;
}
// 다시 나온 순간: 지나가는 모험가가 기록에 한 줄 (처음 잡기 전에는 조용히 — 늘 도는 소문만)
function regenTick() {
  if (typeof S === 'undefined' || !S || !S.advs) return;
  for (const k in REGEN78) {
    const r = regenSt(k); if (!r.kills || !r.next || Date.now() < r.next || r.told === r.next) continue;
    r.told = r.next; const L = RUMOR78[k].up;
    log(`지나가던 모험가: 「${L[Math.floor(rnd() * L.length)]}」`, 'muted');
  }
}
if (typeof window !== 'undefined') setInterval(regenTick, 5000);
