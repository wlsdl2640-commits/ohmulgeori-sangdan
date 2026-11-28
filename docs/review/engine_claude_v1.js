/**
 * 《미궁도시》 성장 · 전직 · 주문서 · 몬스터 · 명중/피해 · 비콘 — 클팀장 수정안 v1 (2026-11-28)
 *
 * 제미나이와 짠 「통합 엔진」을 읽고, 지금 게임에서 이미 정한 것(대표님 결정)에 맞춰 다시 짠 검토용 코드.
 * 게임에 바로 넣는 코드가 아니다 — 생각을 코드로 정리한 것. 맨 아래 selfCheck()를 돌리면 숫자 표가 나온다.
 *   node engine_claude_v1.js
 *
 * ── 원안에서 바꾼 것 (왜) ──────────────────────────────────────────────
 *  1. 전직 레벨 50 · 105 · 160 → 50 · 100 · 150 (11-10 대표님 결정). 레벨만 되면 저절로 → 조건(랭크 · 돈 · 혼 · 핵)을 채워야.
 *  2. 능력치 힘/덱스/지능/행운 → 힘 · 체력 · 민첩 · 지능 (지금 게임). 기본 직업 6 = 전사 · 궁수 · 마법사 · 성직자 · 도적 · 짐꾼
 *     (기사는 전사 2차). 방치형이라 성장은 직업마다 자동(grow) — 직접 분배(AP)는 「켜면 쓰는」 선택 기능으로만.
 *  3. 강화 단계 % + 10강부터 급상승 → 주문서 A안(장비 레벨 상관없이 고정 값, 11-28 결정). 실패해도 장비는 그대로.
 *  4. 추출 주문서 「옮길 장비에 더하기」 → 망각의 주문서 「옮기기」(빈 장비에만 — 여러 장비의 강화를 한 장비에 쌓는 길을 막는다).
 *  5. 명중: 원안은 Lv1부터 44%, 끝판 15% → 기본 공격만 빗나가고(스킬은 눈멀 때만), 명중 75% 아래로는 안 내려간다.
 *  6. 피해: 원안은 「공격 − 방어」 뺄셈이라 끝판에 늘 1 → 지금 게임의 나눗셈 감소 red(def) = 60 / (60 + 1.5·방어)로 0이 안 된다.
 *  7. 몬스터: 원안은 층마다 따로 만든 곡선이라 플레이어 힘과 어긋남(50층 한 마리에 1,300대) →
 *     「그 레벨 파티가 몇 초에 잡아야 하는가(TTK)」에서 거꾸로 HP를 정한다. 미궁은 B1 ~ B100 = Lv150 ~ 200 (11-13 문서).
 *  8. 레벨 차이 벌칙은 살림 — 단, 피해는 0.7배 · 명중은 −10%p에서 멈춘다(만렙 Lv200이 미궁 끝 Lv200 우두머리를 넘을 수 있게).
 *  9. 비콘(전리품 미리 보내기)은 살림 — 창고 칸 · 한 번에 보내는 칸 수 · 비콘 소모를 지킨다.
 * 10. 치명: 고정 5% → 민첩에서 나온다(상한 있음). 행운 능력치는 없다.
 */

// ── 1. 레벨 · 전직 ─────────────────────────────────────────────────────
const MAX_LV = 200;
const JOB_REQ = {   // 지금 게임 data-rpg.js JOB_REQ + 4차(11-12 결정)
  2: { lv: 50, rank: 2, rn: '금장', fee: 30000 },   // rank = 라이선스 단계 번호(지금 게임과 같음) · rn = 이름
  3: { lv: 100, rank: 3, rn: '백은', fee: 300000, souls: 2 },
  4: { lv: 150, rank: 4, rn: '백금', fee: 3000000, souls: 4, core: 1 }
};
const ADV_BONUS = 3;   // 전직할 때 HP · MP가 레벨 3개 몫 한 번에 오른다 (원안에서 가져옴)

// ── 2. 기본 직업 여섯 — 능력치 힘 str · 체력 vit · 민첩 agi · 지능 int ──
// grow = 레벨마다 자동으로 오르는 몫(소수는 확률로). hpLv · mpLv = 레벨마다 HP · MP (고정 — 원안의 무작위 HP는 뺌)
const CLASSES = {
  warrior: { name: '전사',   role: '근접',   main: 'str', magic: false, base: { str: 12, vit: 10, agi: 6, int: 3 },  grow: { str: 2.2, vit: 1.6, agi: 0.8, int: 0.2 }, hp: 120, hpLv: 24, mp: 30, mpLv: 4 },
  archer:  { name: '궁수',   role: '원거리', main: 'agi', magic: false, base: { str: 6, vit: 7, agi: 12, int: 4 },   grow: { str: 0.8, vit: 1.0, agi: 2.4, int: 0.4 }, hp: 95,  hpLv: 18, mp: 50, mpLv: 10 },
  mage:    { name: '마법사', role: '마법',   main: 'int', magic: true,  base: { str: 3, vit: 6, agi: 6, int: 13 },   grow: { str: 0.2, vit: 0.9, agi: 0.7, int: 2.6 }, hp: 75,  hpLv: 13, mp: 90, mpLv: 22 },
  cleric:  { name: '성직자', role: '회복',   main: 'int', magic: true,  base: { str: 5, vit: 9, agi: 5, int: 11 },   grow: { str: 0.4, vit: 1.3, agi: 0.6, int: 2.1 }, hp: 90,  hpLv: 17, mp: 85, mpLv: 20 },
  rogue:   { name: '도적',   role: '근접',   main: 'agi', magic: false, base: { str: 8, vit: 7, agi: 12, int: 4 },   grow: { str: 1.2, vit: 0.9, agi: 2.3, int: 0.2 }, hp: 95,  hpLv: 18, mp: 45, mpLv: 9 },
  porter:  { name: '짐꾼',   role: '지원',   main: 'vit', magic: false, base: { str: 9, vit: 12, agi: 5, int: 5 },   grow: { str: 1.0, vit: 2.2, agi: 0.6, int: 0.8 }, hp: 130, hpLv: 26, mp: 40, mpLv: 6 }
};

// 직접 분배(선택 기능): 켜면 레벨마다 자동 몫 대신 AP 5를 받아 프리셋대로 나눈다. 끄면 자동 성장(기본)
const AP_PER_LV = 5;
const AP_PRESETS = {
  balanced: c => CLASSES[c].grow,                                        // 직업 기본 비율
  pureMain: c => ({ str: 0, vit: 0, agi: 0, int: 0, [CLASSES[c].main]: 1 }),
  survive:  c => ({ ...CLASSES[c].grow, vit: CLASSES[c].grow.vit * 2 })  // 버티기형 (원안의 「명중 보완형」 대신 — 명중은 민첩에서 조금만 나온다)
};

class Adventurer {
  constructor(id, cls, o = {}) {
    const C = CLASSES[cls]; if (!C) throw new Error('직업 없음: ' + cls);
    Object.assign(this, { id, cls, lv: 1, tier: 1, st: { ...C.base }, maxHp: C.hp, maxMp: C.mp, ap: 0, apMode: o.apMode || null, eq: {} });
    this.hp = this.maxHp; this.mp = this.maxMp;
  }
  levelUp(n = 1, rnd = Math.random) {
    const C = CLASSES[this.cls];
    for (let i = 0; i < n && this.lv < MAX_LV; i++) {
      this.lv++; this.maxHp += C.hpLv; this.maxMp += C.mpLv;
      if (this.apMode) { this.ap += AP_PER_LV; this.spendAp(); }
      else for (const k in C.grow) { const v = C.grow[k], f = Math.floor(v); this.st[k] += f + (rnd() < v - f ? 1 : 0); }
    }
    this.hp = this.maxHp; this.mp = this.maxMp;
  }
  spendAp() {   // 프리셋 비율대로 — 남는 1점은 비율이 가장 큰 능력치
    const w = AP_PRESETS[this.apMode](this.cls), sum = Object.values(w).reduce((a, b) => a + b, 0) || 1;
    let left = this.ap;
    for (const k in w) { const q = Math.floor(this.ap * w[k] / sum); this.st[k] += q; left -= q; }
    const top = Object.keys(w).sort((a, b) => w[b] - w[a])[0]; this.st[top] += left; this.ap = 0;
  }
  // 전직: 레벨 + 조건. 원안처럼 레벨만으로 저절로 되지 않는다
  advanceWhy(guild) {
    const R = JOB_REQ[this.tier + 1]; if (!R) return '더 오를 차수가 없어요.';
    if (this.lv < R.lv) return `Lv${R.lv}부터예요.`;
    if (guild.rankOf(this) < R.rank) return `${R.rn} 라이선스가 필요해요.`;   // rankOf = 그 모험가의 라이선스 단계 번호
    if (guild.gold < R.fee) return '돈이 모자라요.';
    if ((R.souls || 0) > guild.souls) return `주인의 혼 ${R.souls}개가 필요해요.`;
    if (R.core && !guild.cores) return '별의 핵이 필요해요.';
    return '';
  }
  advance(guild) {
    const w = this.advanceWhy(guild); if (w) return w;
    const R = JOB_REQ[this.tier + 1], C = CLASSES[this.cls];
    guild.gold -= R.fee; guild.souls -= R.souls || 0; if (R.core) guild.cores--;
    this.tier++; this.maxHp += C.hpLv * ADV_BONUS; this.maxMp += C.mpLv * ADV_BONUS; this.hp = this.maxHp; this.mp = this.maxMp;
    return '';
  }
}

// ── 3. 주문서 A안 · 망각의 주문서 ─────────────────────────────────────
const SCROLL = {
  rates: [100, 80, 60, 30, 10],
  atk: [1, 2, 4, 7, 12],   // 공격력 기준 고정 값 — 장비 레벨 상관없이 같다
  mul: { atk: 1, matk: 1, def: 0.6, hp: 3, mp: 2, str: 0.5, vit: 0.5, agi: 0.5, int: 0.5 }
};
function applyScroll(g, stat, rate, rnd = Math.random) {   // 실패해도 장비는 그대로 · 횟수 제한 없음
  const i = SCROLL.rates.indexOf(rate); if (i < 0) throw new Error('없는 확률');
  g.scT = (g.scT || 0) + 1;
  if (rnd() * 100 >= rate) return { ok: false };
  const v = Math.round(SCROLL.atk[i] * (SCROLL.mul[stat] || 1) * 10) / 10;
  g.sc = g.sc || {}; g.sc[stat] = (g.sc[stat] || 0) + v; g.scN = (g.scN || 0) + 1;
  return { ok: true, v };
}
// 망각의 주문서: ① 장비에서 기억을 빼 주문서에 가둔다(장비는 처음 상태) ② 「주문서 기억이 없는」 장비에만 푼다
// 원안의 「더하기」는 장비 열 개의 강화를 한 장비에 쌓을 수 있어 막는다
function letheTake(g) { if (!g.scN) return null; const mem = { sc: { ...g.sc }, scN: g.scN }; delete g.sc; g.scN = 0; return mem; }
function letheGive(mem, g) { if (!mem) return '빈 주문서예요.'; if (g.scN) return '이미 주문서 기억이 있는 장비에는 풀 수 없어요.'; g.sc = { ...mem.sc }; g.scN = mem.scN; return ''; }

// ── 4. 플레이어 힘 어림 (몬스터를 이것에서 거꾸로 만든다) ─────────────
// 그 레벨에 「그 레벨 대 장비를 낀 평범한 파티 원 한 명」의 공격력 · 초당 기본 공격 피해 · HP
// 지금 게임 숫자의 결: 장비 단계마다 배율이 오르고, 주문서 · 룬이 조금 더한다. 여기서는 매끄러운 곡선 하나로 둔다
const P = {
  atk: lv => (14 + 3.0 * lv) * (1 + 0.012 * lv),     // Lv1 17 · Lv50 254 · Lv100 704 · Lv150 1,343 · Lv200 2,172
  hp: lv => 110 + 22 * lv + 0.05 * lv * lv,          // 전사 기준
  swing: 5 / 1.25,                                    // 기본 공격 5초 ÷ 공격 속도 1.25 → 4초에 한 번
  mult: 2.5                                           // 기본 공격 배율 (지금 게임 BASIC_MULT)
};

// ── 5. 몬스터 — 레벨만 정하면 나머지는 「잡는 시간」에서 ─────────────
const red = def => 60 / (60 + Math.max(0, def) * 1.5);   // 지금 게임 core.js 그대로: 방어가 아무리 높아도 0이 안 된다
const MON = {
  def: lv => 3 + 0.9 * lv,                // 방어: 레벨 비례 (Lv200 = 183 → 같은 레벨 공격이 18%만 들어감)
  eva: lv => Math.min(0.2, 0.04 + 0.0008 * lv),   // 회피 4% → 20% 상한
  ttk: { normal: 6, elite: 15, boss: 75, labBoss: 120 },   // 4명 파티가 같은 레벨로 잡는 데 걸리는 초 (목표)
  party: 4,
  atkPct: { normal: 0.05, elite: 0.08, boss: 0.1, labBoss: 0.12 }   // 한 방 = 같은 레벨 전사 HP의 몇 % (방어 전)
};
function partyDps(lv, monLv) {   // 같은 레벨 파티가 그 몬스터에게 넣는 초당 피해 (명중 · 방어 · 레벨 차이 넣음)
  const per = P.atk(lv) * P.mult * red(MON.def(monLv)) * dmgLvMul(lv, monLv) * hitRate({ lv, agi: 0 }, { lv: monLv, eva: MON.eva(monLv) });
  return per / P.swing * MON.party;
}
function makeMonster(lv, kind = 'normal') {
  const hp = Math.round(partyDps(lv, lv) * MON.ttk[kind]);   // 같은 레벨 파티 기준으로 HP를 정한다
  return { lv, kind, hp, maxHp: hp, atk: Math.round(P.hp(lv) * MON.atkPct[kind]), def: Math.round(MON.def(lv)), eva: MON.eva(lv) };
}
// 지하미궁 B1 ~ B100 = Lv150 ~ 200 (11-13 문서: 기본 Lv150 + 한 층 0.5). 10층마다 우두머리
const labLevel = b => Math.round(150 + (Math.max(1, Math.min(100, b)) - 1) * 50 / 99);
const labMonster = b => makeMonster(labLevel(b), b === 100 ? 'labBoss' : b % 10 === 0 ? 'boss' : 'normal');

// ── 6. 명중 · 피해 ──────────────────────────────────────────────────
const HIT = { floor: 0.75, accPerAgi: 0.0004, accMax: 0.1, lvPen: 0.01, lvPenMax: 0.1 };
const DMG = { lvPen: 0.02, lvMin: 0.7, crit: 1.6, critPerAgi: 0.0003, critBase: 0.05, critMax: 0.4 };
// 기본 공격만 이 판정을 쓴다. 스킬 · 광역기는 빗나가지 않는다(눈멀었을 때만 20% — 지금 게임 규칙)
function hitRate(a, m) {
  const acc = Math.min(HIT.accMax, (a.agi || 0) * HIT.accPerAgi);                  // 민첩이 명중을 조금 올린다 (최대 +10%p)
  const pen = Math.min(HIT.lvPenMax, Math.max(0, m.lv - a.lv) * HIT.lvPen);        // 높은 레벨 몬스터: −1%p씩, −10%p에서 멈춤
  return Math.max(HIT.floor, Math.min(1, 1 - Math.max(0, m.eva - acc) - pen));       // 자동 전투가 답답하지 않게 75% 아래로 안 감
}
const dmgLvMul = (aLv, mLv) => Math.max(DMG.lvMin, 1 - Math.max(0, mLv - aLv) * DMG.lvPen);   // 레벨 15 차이에서 0.7로 멈춤
const critRate = agi => Math.min(DMG.critMax, DMG.critBase + agi * DMG.critPerAgi);
function basicHit(a, m, rnd = Math.random) {   // a = { lv, atk, agi, buffAtk, finalPct }
  if (rnd() >= hitRate(a, m)) return { miss: 1, v: 0 };
  const crit = rnd() < critRate(a.agi || 0);
  const v = a.atk * (1 + (a.buffAtk || 0)) * P.mult * red(m.def) * dmgLvMul(a.lv, m.lv) * (crit ? DMG.crit : 1) * (1 + (a.finalPct || 0)) * (0.85 + rnd() * 0.3);
  return { miss: 0, crit, v: Math.max(1, Math.round(v)) };
}

// ── 7. 비콘: 전멸 대비 전리품 미리 보내기 ─────────────────────────────
// 원안처럼 무한히 밀어 넣지 않는다: 비콘 하나 소모 · 한 번에 최대 칸 수 · 창고에 자리가 있을 때만(없으면 원정 짐에 남김)
const BEACON = { slots: 6 };
function sendBeacon(exp, stash) {
  if (!(exp.beacons > 0)) return { sent: 0, why: '비콘이 없어요.' };
  const pick = exp.bag.slice().sort((x, y) => y.value - x.value).slice(0, BEACON.slots);   // 값진 것부터
  const ok = pick.filter(it => stash.room(it));
  if (!ok.length) return { sent: 0, why: '길드 창고에 자리가 없어요.' };
  exp.beacons--; ok.forEach(it => { stash.put(it); exp.bag.splice(exp.bag.indexOf(it), 1); });
  return { sent: ok.length };
}

// ── 8. 점검 표 ───────────────────────────────────────────────────────
function selfCheck() {
  const row = (who, aLv, m) => {
    const a = { lv: aLv, atk: P.atk(aLv), agi: aLv * 1.5 };
    const hr = hitRate(a, m), avg = a.atk * P.mult * red(m.def) * dmgLvMul(aLv, m.lv) * hr * (1 + critRate(a.agi) * (DMG.crit - 1));
    const t = m.hp / (avg / P.swing * MON.party);
    const hitsTaken = P.hp(aLv) / Math.max(1, m.atk * red(aLv * 0.6));
    return { 누가: who, 모험가Lv: aLv, 몬스터Lv: m.lv, 종류: m.kind, 몬스터HP: m.hp, 명중: Math.round(hr * 100) + '%', '한 대 평균': Math.round(avg), '4명이 잡는 초': Math.round(t), '전사가 버티는 방 수': Math.round(hitsTaken) };
  };
  const out = [];
  for (const lv of [1, 10, 25, 50, 100, 150, 200]) out.push(row('필드', lv, makeMonster(lv)));
  out.push(row('필드 우두머리', 25, makeMonster(25, 'boss')));
  for (const b of [1, 50, 90, 100]) out.push(row(`미궁 B${b} · 같은 레벨`, labLevel(b), labMonster(b)));
  for (const b of [1, 50, 100]) out.push(row(`미궁 B${b} · 만렙`, 200, labMonster(b)));
  out.push(row('미궁 B100 · Lv185로 도전', 185, labMonster(100)));
  console.table(out);
  // 원안과 같은 자리 비교 (원안 숫자는 원안 공식으로 계산한 값)
  console.log('원안: Lv1 전사 1층 명중 44% · 50층 Lv114 전사 명중 31% · 한 마리에 1,300대 · 100층 만렙 전사 피해 1 · 명중 15%');
  // 주문서 · 망각
  const g = {}, rnd = (() => { let s = 7; return () => (s = (s * 16807) % 2147483647) / 2147483647; })();
  for (let i = 0; i < 20; i++) applyScroll(g, 'atk', 60, rnd);
  console.log('60% 공격 주문서 20장:', JSON.stringify(g.sc), `성공 ${g.scN}/${g.scT}`);
  const g2 = { scN: 3, sc: { atk: 5 } }, mem = letheTake(g);
  console.log('망각: 뺀 장비', JSON.stringify(g.sc || {}), '· 기억 있는 장비에 풀기:', letheGive(mem, g2) || '됨', '· 빈 장비에 풀기:', letheGive(mem, {}) || '됨');
}

if (typeof module !== 'undefined' && require.main === module) selfCheck();
if (typeof module !== 'undefined') module.exports = { MAX_LV, JOB_REQ, CLASSES, AP_PRESETS, Adventurer, SCROLL, applyScroll, letheTake, letheGive, P, MON, red, makeMonster, labLevel, labMonster, hitRate, dmgLvMul, critRate, basicHit, BEACON, sendBeacon, selfCheck };
