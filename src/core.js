/* ───────── 게임 상태 ───────── */
let S = null;
const HOOKS = { changed() {}, toast() {}, modal() {}, sale() {}, floor() {} };   // 화면 쪽에서 덮어쓴다
const rnd = Math.random;
const ri = (a, b) => a + Math.floor(rnd() * (b - a + 1));
const pickOne = a => a[Math.floor(rnd() * a.length)];
const nid = () => S.seq++;

const dayOf = t => Math.floor(t / DAY_SEC);
function dateParts(t) {
  const d = dayOf(t), m0 = START.month - 1 + Math.floor(d / MONTH_DAYS);
  return { y: START.year + Math.floor(m0 / 12), m: (m0 % 12) + 1, d: (d % MONTH_DAYS) + 1 };
}
function dateStr(t) { const p = dateParts(t); return `${p.y}.${p.m}.${p.d}`; }
const today = () => dayOf(S.t);
const dayLabel = k => { const p = dateParts(k * DAY_SEC); return `${p.m}월 ${p.d}일`; };

function changed() { HOOKS.changed(); }
function log(text, kind = '') {
  const p = dateParts(S.t);
  S.log.unshift({ d: `${p.m}.${p.d}`, text, kind });
  if (S.log.length > 80) S.log.length = 80;
}
function queueModal(m) { S.modals.push(m); HOOKS.modal(); }

/* 연구·후원 단계 */
const rlv = k => (S.research && S.research.lv[k]) || 0;
const spn = k => (S.spons && S.spons[k]) || 0;
const blessed = id => !!(S && S.bless && S.bless.id === id);
const isNight = () => phaseOf(S.t) === 3;

/* ───────── 모험가 능력치 ───────── */
function expNeed(lv) { return Math.round(30 * Math.pow(lv, 1.8)); }
function growStats(a, n) {
  const g = CLASSES[a.cls].grow, mul = a.hero2 ? 1.35 : a.hero ? 1.2 : 1;   // 용사는 1.2배, 2차 각성하면 1.35배로 자란다
  for (let i = 0; i < n; i++) for (const [k] of STATS) { const v = g[k] * mul, f = Math.floor(v); a.st[k] += f + (rnd() < v - f ? 1 : 0); }
}
function makeAdv(o = {}) {
  const cls = o.cls || pickOne(CLASS_IDS), C = CLASSES[cls], lv = o.lv || 1;
  const a = {
    id: nid(), name: o.name || (pickOne(NAME_A) + pickOne(NAME_B)), cls, lv, exp: 0, hero: !!o.hero,
    look: { hair: pickOne(HAIRS), skin: pickOne(SKINS) }, bio: o.bio || pickOne(BIOS[cls] || BIOS[jobBase(cls)]),
    status: 'idle', kills: 0, trips: 0, quit: false, fat: 0, sleep: 0, pf: 0, rank: 0, inj: null, post: null, down: false,
    st: Object.assign({}, C.base), tr: { str: 0, vit: 0, agi: 0, int: 0 },
    eq: { weapon: null, off: null, ammo: null, armor: null, acc: null, bag: null }, skills: [C.innate], sm: {}, mast: {}, traits: o.traits || rollTraits(), wxt: o.wxt || rollWxt(),
    salary: o.salary != null ? o.salary : Math.round(C.salary * (1 + 0.09 * (lv - 1)) / 5) * 5
  };
  growStats(a, lv - 1);
  if (needsArrows(a)) a.eq.ammo = makeGear('arrows', arrowTierOf(lv), 0);   // 화살을 쓰는 직업은 레벨에 맞는 화살을 들고 온다
  if (gearFits(a, { base: 'shield', t: 0 })) a.eq.off = makeGear(shieldOf(a.cls), arrowTierOf(lv), 0);   // 전사·마부 계열은 방패를 들고 온다 (빌드 39)
  const d = derive(a);
  a.hp = d.maxHp; a.mp = d.maxMp;
  return a;
}
/* ───────── 각성: 3차 직업을 용사로 ───────── */
function awakenWhy(a) {
  if (a.hero) return '이미 용사예요';
  if (jobTier(a.cls) < 3) return '3차 직업이어야 해요';
  if (a.lv < AWAKEN.lv) return `Lv${AWAKEN.lv}부터`;
  if ((a.rank || 0) < AWAKEN.rank) return `${LICENSE[AWAKEN.rank].name} 라이선스 필요`;
  if (a.status !== 'idle' || a.inj) return '상단에서 쉬고 있을 때만';
  const souls = Object.keys(S.inv).filter(k => k.startsWith('soul_')).reduce((n, k) => n + S.inv[k], 0);
  if (souls < AWAKEN.souls) return `주인의 혼 ${AWAKEN.souls}개 필요 (지금 ${souls})`;
  if (S.gold < AWAKEN.fee) return `${fmt(AWAKEN.fee)}G 필요`;
  return '';
}
function awaken(aid) {
  const a = advById(aid); if (!a) return '';
  const why = awakenWhy(a); if (why) return why + '.';
  let need = AWAKEN.souls;
  for (const k of Object.keys(S.inv).filter(k => k.startsWith('soul_')).sort()) { const t = Math.min(need, S.inv[k]); addTo(S.inv, k, -t); need -= t; if (!need) break; }
  S.gold -= AWAKEN.fee; a.hero = true; S.fame += 30;
  const sk = awkSkillOf(a); if (!a.skills.includes(sk)) a.skills.unshift(sk);
  const d = derive(a); a.hp = d.maxHp; a.mp = d.maxMp;
  log(`${a.name}이(가) 각성해 용사가 되었다! 각성기 「${SKILLS[sk].name}」. 상단 명성 +30`, 'good');
  queueModal({ title: '각성', body: [`${a.name}의 안에서 잠들어 있던 힘이 깨어났다. 모험가 길드 명예의 벽에 「용사」로 이름이 새겨진다.`, `각성기 「${SKILLS[sk].name}」: ${SKILLS[sk].desc}`, '능력이 15% 오르고, 레벨이 오를 때마다 더 크게 자란다.', `Lv${AWAKEN2.lv}이 되면 2차 각성으로 레벨 상한을 ${MAX_LV2}까지 풀 수 있다.`] });
  changed();
  return '';
}
/* ───────── 2차 각성: Lv100 용사의 한계를 풀어 Lv150까지 ───────── */
const soulCount = () => Object.keys(S.inv).filter(k => k.startsWith('soul_')).reduce((n, k) => n + S.inv[k], 0);
function awaken2Why(a) {
  if (a.hero2) return '이미 2차 각성했어요';
  if (!a.hero) return '먼저 각성해 용사가 되어야 해요';
  if (a.lv < AWAKEN2.lv) return `Lv${AWAKEN2.lv}부터`;
  if ((a.rank || 0) < AWAKEN2.rank) return `${LICENSE[AWAKEN2.rank].name} 라이선스 필요`;
  if (a.status !== 'idle' || a.inj) return '상단에서 쉬고 있을 때만';
  if ((S.inv[AWAKEN2.core] || 0) < AWAKEN2.cores) return `${ITEMS[AWAKEN2.core].name} ${AWAKEN2.cores}개 필요 (창고 ${S.inv[AWAKEN2.core] || 0})`;
  if (soulCount() < AWAKEN2.souls) return `주인의 혼 ${AWAKEN2.souls}개 필요 (지금 ${soulCount()})`;
  if (S.gold < AWAKEN2.fee) return `${fmt(AWAKEN2.fee)}G 필요`;
  return '';
}
function awaken2(aid) {
  const a = advById(aid); if (!a) return '';
  const why = awaken2Why(a); if (why) return why + '.';
  let need = AWAKEN2.souls;
  for (const k of Object.keys(S.inv).filter(k => k.startsWith('soul_')).sort()) { const t = Math.min(need, S.inv[k]); addTo(S.inv, k, -t); need -= t; if (!need) break; }
  addTo(S.inv, AWAKEN2.core, -AWAKEN2.cores);
  S.gold -= AWAKEN2.fee; a.hero2 = true; S.fame += 60; a.exp = 0;
  const sk = awk2SkillOf(a); if (!a.skills.includes(sk)) a.skills.splice(a.skills.includes(awkSkillOf(a)) ? 1 : 0, 0, sk);
  const d = derive(a); a.hp = d.maxHp; a.mp = d.maxMp;
  log(`${a.name}이(가) 2차 각성했다! 레벨 상한이 ${MAX_LV2}까지 풀렸다. 2차 각성기 「${SKILLS[sk].name}」. 상단 명성 +60`, 'good');
  queueModal({ title: '2차 각성', body: [`${a.name}이(가) 용사의 한계를 넘었다. 몸 안에서 별빛 같은 힘이 넘친다.`, `2차 각성기 「${SKILLS[sk].name}」: ${SKILLS[sk].desc}`, `레벨 상한 ${MAX_LV} → ${MAX_LV2}. 능력이 15% 더 오르고, 레벨이 오를 때마다 1.35배로 자란다. 스킬 칸이 하나 늘었다.`] });
  changed();
  return '';
}
function gearSum(a) {
  const s = {};
  for (const [slot] of SLOTS) { const g = a.eq && a.eq[slot]; if (!g || (isAmmo(g) && ammoLeft(g, a) <= 0) || (slot === 'ammo' && !needsArrows(a))) continue; const gs = gearStats(g); for (const k in gs) s[k] = (s[k] || 0) + gs[k]; }   // 다 쓴 화살·표창은 능력치 없음
  return s;
}
function passives(a) {
  const p = {};
  for (const id of a.skills || []) { const P = SKILLS[id] && SKILLS[id].passive; if (P) { const L = skLvMul(a, id); for (const k in P) p[k] = (p[k] || 0) + P[k] * L; } }   // 스킬 레벨만큼 커진다
  const MF = mastFx(a); for (const k in MF) p[k] = (p[k] || 0) + MF[k];   // 숙련 (초급·중급·상급)
  return p;
}
// 원정 중이면 날씨·도시락 효과가 얹힌다 (weather.js expMods)
function derive(a) { return expMods(deriveBase(a), a); }
function deriveBase(a) {
  const C = CLASSES[a.cls], jb = jobBase(a.cls), G = gearSum(a), P = passives(a), L = a.lv, T = {};
  const SB = setInfo(a).bonus; if (SB) for (const k in SB) if (typeof SB[k] === 'number') P[k] = (P[k] || 0) + SB[k];   // 세트 효과
  for (const [k] of STATS) T[k] = Math.max(0, a.st[k] + a.tr[k] + (G[k] || 0));
  let atk = jb === 'archer' ? T.str * 0.5 + T.agi * 0.75 : jb === 'rogue' ? T.str * 0.8 + T.agi * 0.45 : T.str * 1.1;
  atk += L * 0.4 + (G.atk || 0);
  const war = blessed('war') ? 1.15 : 1, earth = blessed('earth'), wind = blessed('wind'), lic = (LICENSE[a.rank || 0] || LICENSE[0]).mul * (a.hero ? 1.15 : 1) * (a.hero2 ? 1.15 : 1);
  const X = k => traitSum(a, k);   // 타고난 특성
  return {
    T, atk: atk * war * lic * (1 + (P.atkPct || 0) + X('atkPct')),
    matk: (T.int * 1.2 + L * 0.4 + (G.matk || 0)) * (1 + rlv('power') * 0.1 + (P.matkPct || 0) + X('matkPct')) * war * lic,
    def: (T.vit * 0.35 + L * 0.2 + (G.def || 0)) * (1 + (P.defPct || 0) + rlv('ward') * 0.08 + X('defPct')) * (earth ? 1.1 : 1) * lic,
    maxHp: Math.round((40 + T.vit * 7 + L * 4 + (G.hp || 0)) * (earth ? 1.15 : 1) * lic * (1 + (P.hpPct || 0) + X('hpPct') + relic('hp'))),   // 유물: 세계수의 씨앗·별의 여왕의 왕관
    maxMp: Math.round((8 + T.int * 4 + L + (G.mp || 0)) * (1 + X('mpPct') + (P.mpPct || 0))),
    eva: Math.min(0.6, T.agi * 0.004 + (G.eva || 0) + (P.eva || 0) + (wind ? 0.05 : 0) + X('eva')),
    crit: Math.min(0.75, C.crit + T.agi * 0.0015 + (G.crit || 0) + (P.crit || 0) + X('crit')),
    block: Math.min(0.6, (G.block || 0) + (P.block || 0) + X('block')),
    counter: Math.min(0.7, (G.counter || 0) + (P.counter || 0) + X('counter')),
    double: Math.min(0.6, (G.double || 0) + (P.double || 0) + X('double')),
    healPow: 1 + X('healPow') + (P.healPow || 0), rheal: X('rheal'), hpRegen: X('hpRegen'), mpFlat: X('mpFlat'),
    spd: C.spd * (1 + T.agi * 0.004) * (1 + (P.spdPct || 0) + X('spdPct') + (G.spdPct || 0)),   // 공격 속도: 기본 공격 대기시간 = BASIC_CD ÷ spd
    cdr: Math.min(CDR_MAX, (P.cdr || 0) + X('cdr') + (G.cdr || 0)),                                   // 스킬 재사용 감소 (상한 50%)
    carry: Math.round((C.carry + T.str * 0.4 + (G.carry || 0) + X('carry')) * (1 + (P.carryPct || 0))),
    move: (6 + T.agi * 0.06) * (1 + (P.movePct || 0) + relic('move') + X('movePct') + (G.movePct || 0)) * (wind ? 1.15 : 1),
    mpRegen: 1 + (P.mpRegen || 0) + rlv('mana') * 0.3,
    mExec: P.exec || 0, mStun: P.stun || 0, mBuff: P.buffDur || 0   // 숙련: 처형 피해 · 기본 공격 기절 · 강화 지속
  };
}
function clampVitals(a) { const d = derive(a); a.hp = Math.min(a.hp, d.maxHp); a.mp = Math.min(a.mp == null ? d.maxMp : a.mp, d.maxMp); }
function addExp(a, n) {
  const cap = lvCap(a);   // Lv100, 2차 각성하면 150
  if (a.lv >= cap) { a.exp = 0; return false; }
  a.exp += Math.round(n * (1 + traitSum(a, 'expPct')));
  let up = false;
  while (a.lv < cap && a.exp >= expNeed(a.lv)) {
    const before = derive(a);
    a.exp -= expNeed(a.lv); a.lv++; up = true;
    growStats(a, 1);
    const after = derive(a);
    a.hp = Math.min(after.maxHp, a.hp + (after.maxHp - before.maxHp));
    a.mp = Math.min(after.maxMp, a.mp + (after.maxMp - before.maxMp));
  }
  if (a.lv >= cap) a.exp = 0;
  return up;
}
const advById = id => S.advs.find(a => a.id === id);
const living = () => S.advs.filter(a => a.status !== 'dead');
const partyOf = aid => S.parties.find(p => p.members.includes(aid));
const beds = () => 2 + S.bld.inn * 2 + rankBeds(S.rank || 0);
const teamOf = p => p.members.map(advById).filter(a => a && a.status !== 'dead');
const standing = p => teamOf(p).filter(a => !a.down);
const avgLvOf = p => { const t = teamOf(p); return t.length ? t.reduce((s, a) => s + a.lv, 0) / t.length : 0; };

/* ───────── 짐 ───────── */
const wOf = bag => Object.entries(bag).reduce((s, [k, q]) => s + (ITEMS[k] ? ITEMS[k].w * q : 0), 0);
const vOf = bag => Object.entries(bag).reduce((s, [k, q]) => s + (ITEMS[k] ? ITEMS[k].v * q : 0), 0);
const gW = list => (list || []).reduce((s, g) => s + GTYPES[g.base].w, 0);
// 짐꾼 계열(짐꾼·음유시인·마부·정찰가…)은 파티당 한 명. 손수레 말고는 짐꾼 계열이 있어야 마차를 끈다. 마부는 마차 짐을 더 싣고 더 빨리 몬다
const isPorter = a => !!a && jobBase(a.cls) === 'porter';
const portersOf = p => teamOf(p).filter(isPorter);
const porterOf = p => portersOf(p).filter(a => !a.down)[0] || null;
const coachOf = p => teamOf(p).filter(a => !a.down && (TR(a).wagon || 0) > 0).sort((x, y) => (TR(y).wagon || 0) - (TR(x).wagon || 0))[0] || null;
const wagonOwned = p => (p.wagon && WAGONS[p.wagon]) || null;
// 맨 말: 'h:종류'(마구간에서 산 말) 또는 'p:펫id'(다 자란 펫). HORSES 항목에 id·펫 정보를 붙여 돌려준다
function horseOf(p) {
  if (!p || !p.horse) return null;
  if (p.horse.startsWith('h:')) { const k = p.horse.slice(2); return HORSES[k] && !HORSES[k].pet ? Object.assign({ id: k }, HORSES[k]) : null; }
  const pet = petById(+p.horse.slice(2)); if (!pet || !pet.stage) return null;
  const k = horseOfPet(pet.kind); return k ? Object.assign({ id: k, petId: pet.id, petName: pet.name }, HORSES[k]) : null;
}
function wagonWhy(p) {
  const w = wagonOwned(p); if (!w || !w.horse) return '';
  if (!porterOf(p)) return '짐꾼 계열이 파티에 있어야 끌 수 있어요';
  const h = horseOf(p);
  if (!h) return p.horse && p.horse.startsWith('p:') ? '맨 펫이 없거나 아직 다 자라지 않았어요' : w.horse === 'fly' ? '마구간에서 그리폰·와이번·페가수스(다 자란 펫)를 매어야 해요' : w.horse === 'goat' ? '마구간에서 고산지대 산양(다 자란 펫)을 매어야 해요' : '마구간에서 말을 매어야 해요';
  if (w.horse === 'goat' && !h.steel) return '고산지대 산양이 끌어야 해요';
  if (w.horse === 'fly' && !h.fly) return '그리폰·와이번·페가수스가 끌어야 해요';
  return '';
}
const wagonOf = p => { const w = wagonOwned(p); return w && !wagonWhy(p) ? w : null; };
const wagonPlus = p => Math.max(0, Math.min(WAGON_PLUS_MAX, p.wagonPlus || 0));
const wagonCap = p => { const w = wagonOf(p); if (!w) return 0; const c = coachOf(p), h = horseOf(p); return Math.round(w.cap * (h ? h.cap : 1) * (1 + wagonPlus(p) * WAGON_PLUS.cap) * (1 + (c ? TR(c).wagon || 0 : 0)) * (w.fly && (S.bld.airfield || 0) >= 2 ? 1.2 : 1)); };
const wagonSpd = p => { const w = wagonOf(p); if (!w) return 1; const c = coachOf(p), h = horseOf(p); return w.spd * (h ? h.spd : 1) * (1 + wagonPlus(p) * WAGON_PLUS.spd) * (1 + (c ? TR(c).wagonSpd || 0 : 0)); };
const wagonFly = p => { const w = wagonOf(p), h = horseOf(p); return !!(w && w.fly && h && h.fly); };
// 마차 이름: 비행 마차에 그리폰을 매면 그리폰 마차
function rigName(p) { const w = wagonOwned(p); if (!w) return ''; const h = horseOf(p); return (w.fly && h && h.fly ? `${h.name} 마차` : w.name) + (wagonPlus(p) ? ` +${wagonPlus(p)}` : ''); }
// 정찰가: 파티 이동 속도와 텐트(야영 피로 회복 배율)
const scoutMove = p => Math.max(0, ...teamOf(p).filter(a => !a.down).map(a => TR(a).scout || 0));
const tentOf = p => Math.max(1, ...teamOf(p).filter(a => !a.down).map(a => TR(a).tent || 1));
// 쓰러진 동료는 짐을 못 들고, 들것이 자리를 차지한다
function capOf(p) { const all = teamOf(p), st = all.filter(a => !a.down); return Math.max(0, Math.round((st.reduce((s, a) => s + derive(a).carry, 0) + wagonCap(p)) * (1 + rlv('carry') * 0.1)) - (all.length - st.length) * STRETCHER); }
function usedOf(p) { return p.exp ? wOf(p.exp.bag) + wOf(p.exp.sup) + gW(p.exp.gbag) + wOf(p.exp.cargo || {}) : wOf(p.sup); }
// 파티 이동속도 = 가장 빠른(민첩한) 모험가의 속도 × 피로 × 마차
function moveOf(p) { const all = teamOf(p), st = all.filter(a => !a.down), ch = p.exp && p.exp.sta && st.some(a => p.exp.sta[a.id] && p.exp.sta[a.id].chill) ? 0.7 : 1; if (!st.length) return 4; return ch * Math.max(4, ...st.map(a => derive(a).move * fatMul(a.fat || 0))) * wagonSpd(p) * (1 + scoutMove(p)) * (st.length < all.length ? 0.8 : 1) * (1 + petHome('move')); }
const tire = (team, v) => team.forEach(a => { a.fat = Math.max(0, Math.min(100, (a.fat || 0) + v * (v > 0 ? 1 - traitSum(a, 'fatigue') : 1))); });
function addTo(bag, k, q) { bag[k] = (bag[k] || 0) + q; if (bag[k] <= 0) delete bag[k]; }

/* ───────── 장비 만들기 ───────── */
// 품질: 일반·고급·희귀는 무작위, 보스에게서는 가끔 영웅. 전설 이상은 보스 부속품으로 만들거나 던전·레이드 보상
function rollQuality(boost = 0) {
  const r = rnd(), dw = spn('dwarves'), hero = boost >= 0.2 ? 0.01 + boost * 0.08 : 0;
  const rare = 0.05 + boost * 0.5 + (dw >= 3 ? 0.06 : 0), fine = 0.25 + boost + (dw >= 2 ? 0.08 : 0);
  return r < hero ? 3 : r < hero + rare ? 2 : r < hero + rare + fine ? 1 : 0;
}
// 희귀 이상은 보너스 능력치가 붙는다 (등급이 높을수록 여러 개, 더 크게)
const BONUS_Q = [null, null, [1, 0.6], [1, 1.0], [2, 1.0], [2, 1.4], [3, 1.6]];
function rollBonus(t, q) {
  const B = BONUS_Q[q]; if (!B) return null;
  const bonus = {}, ks = STAT_KEYS.slice().sort(() => rnd() - 0.5).slice(0, B[0]);
  ks.forEach(k => { bonus[k] = Math.max(1, Math.round(B[1] * GTIERS[t].p * (0.8 + rnd() * 0.5))); });   // 같은 등급이라도 조금씩 다르다
  return bonus;
}
function makeGear(base, t, q) {
  const g = { id: nid(), base, t, q: q || 0, bonus: null, runes: [] };
  g.bonus = rollBonus(t, g.q);
  return g;
}
function randomBook(lo, hi) {
  const pool = BOOK_IDS.filter(id => SKILLS[id].lv >= lo && SKILLS[id].lv <= hi);
  return pool.length ? 'book_' + pickOne(pool) : null;
}

/* ───────── 원정 ───────── */
const mHp = (m, L) => m.mh * (25 + 18 * L + 1.15 * L * L);
const mAtk = (m, L) => m.ma * (2.5 + 1.5 * L + 0.035 * L * L);
const mDef = (m, L) => (m.md || 0) * (1 + 0.6 * L);
const red = def => 60 / (60 + Math.max(0, def) * 1.5);
const DIFF = { hp: 1.22, atk: 1.16 };   // v0.5: 더 어렵게

function areaDef(e) { const F = FIELDS[e.field]; return e.area === 'dungeon' ? F.dungeon : F; }
// 던전 층수: 보물 던전은 셋, 나머지는 다섯
const floorsOf = e => (FIELDS[e.field] && FIELDS[e.field].treasure ? TREASURE_FLOORS : DUNGEON_FLOORS);
function makeEncs(e) {
  if (e.area === 'trade') return rnd() < (e.mode === 'return' ? 0.45 : 0.6) + (isNight() ? 0.15 : 0) ? [ri(30, 75)] : [];   // 교역로: 산적과 짐승이 가끔
  const night = e.area === 'field' && isNight();
  if (e.mode === 'return') return rnd() < (night ? 0.55 : 0.4) ? [ri(30, 70)] : [];
  if (e.area === 'dungeon') return e.stage === floorsOf(e) ? [35, 80] : [30, 70];
  return [25 + ri(-4, 4), 55 + ri(-4, 4), 85 + ri(-4, 4)];
}
function foeFrom(id, lv) {
  const m = MONS[id], hp = Math.round(mHp(m, lv) * DIFF.hp);
  if (S && S.advs) dexSeen(id);   // 도감: 만난 몬스터
  return { uid: nid(), id, lv, hp, maxHp: hp, atk: mAtk(m, lv) * DIFF.atk, def: mDef(m, lv), spd: m.spd, eva: m.eva || 0, cd: 0.6 + rnd() * 0.8, boss: !!m.boss, dot: null, dotT: 0, slow: 0 };
}
// 희귀종: 아주 가끔 반짝이는 개체. 체력·공격·방어·회피가 높고 경험치가 많다 (data-sky.js RARE)
function makeRare(f) {
  f.rare = 1; f.name = RARE.name + MONS[f.id].name;
  f.hp = f.maxHp = Math.round(f.maxHp * RARE.hp); f.atk *= RARE.atk; f.def *= RARE.def; f.eva = Math.min(0.6, (f.eva || 0) + RARE.eva);
  return f;
}
// 둥지 몬스터: 둥지 이벤트가 있는 필드에서 섞여 나온다. 강하고 전리품이 두 배
function makeNestFoe(f) {
  f.nest = 1; f.name = NEST.name + MONS[f.id].name;
  f.hp = f.maxHp = Math.round(f.maxHp * NEST.hp); f.atk *= NEST.atk;
  return f;
}
const nestAt = fid => (typeof evActive === 'function' ? evActive('nest').find(x => x.at === fid) : null) || null;
// 필드 보스: 10 스테이지마다. k = 1~5 (1-50은 그 필드의 주인)
function fieldBoss(F, stage, lv) {
  const k = Math.round(stage / BOSS_EVERY), pool = F.mons.filter(id => minStage(MONS[id]) <= stage);
  const id = F.bosses && F.bosses[k - 1] && MONS[F.bosses[k - 1]] ? F.bosses[k - 1] : pool[(k * 7 + F.no * 3) % pool.length];
  const f = foeFrom(id, lv + 1);
  f.hp = f.maxHp = Math.round(f.maxHp * (3 + 0.9 * k));
  f.atk *= 1.25 + 0.06 * k; f.def *= 1.25;
  f.boss = true; f.fb = k; f.aoe = k >= 3;
  f.sc = Math.min(3, Math.max(1, Math.round(MONS[id].scale || 1)) + (k >= 5 ? 2 : 1));
  f.name = k >= 5 ? `${F.name}의 주인 ${MONS[id].name}` : `우두머리 ${MONS[id].name}`;
  return f;
}
// 어두워질수록 몬스터가 더 몰려온다 (던전 안은 상관없음)
function nightMore(e) {
  if (e.area !== 'field') return 0;
  const m = PHASES[phaseOf(S.t)].more * (blessed('moon') ? 0.5 : 1);
  return Math.floor(m) + (rnd() < m % 1 ? 1 : 0);
}
function rollFoes(e, idx, extra = 0) {
  if (e.area === 'trade') { const T = TRADE[FIELDS[e.field].trade], n = Math.min(4, 1 + (rnd() < 0.4 ? 1 : 0) + (isNight() && rnd() < 0.5 ? 1 : 0) + extra); return Array.from({ length: n }, () => foeFrom(pickOne(T.mons), Math.max(1, (e.lvo || T.lv) + ri(-1, 1)))); }
  const F = FIELDS[e.field], A = areaDef(e);
  const last = e.mode === 'advance' && idx === e.encs.length - 1;
  const dboss = e.area === 'dungeon' && e.stage === floorsOf(e) && last;
  const fboss = e.area === 'field' && e.stage % BOSS_EVERY === 0 && last;
  const lv = e.area === 'dungeon' ? (F.treasure ? Math.max(1, (e.lvo || 10) + e.stage - 3) : F.raid ? F.lv + 8 + e.stage : dungeonLv(F, e.stage)) : fieldLv(F, e.stage);   // 보물 던전: 파티 평균 -2 ~ 0
  const pool = A.mons.filter(id => e.area === 'dungeon' || minStage(MONS[id]) <= e.stage);
  const out = [];
  if (dboss) { out.push(foeFrom(A.boss, F.treasure ? (e.lvo || 10) + 2 : F.raid ? F.lv + 14 : dungeonBossLv(F))); out.push(foeFrom(pickOne(pool), lv)); }
  else if (fboss) { out.push(fieldBoss(F, e.stage, lv)); for (let i = 0; i < (e.stage >= 30 ? 2 : 1); i++) out.push(foeFrom(pickOne(pool), lv)); }
  else {
    const nest = e.area === 'field' && e.mode === 'advance' ? nestAt(e.field) : null;
    let n = e.mode === 'return' ? 1 : 1 + ri(0, Math.min(2, Math.floor(e.stage / 5))) + (e.area === 'dungeon' ? 1 : 0);
    n = Math.min(5, n + nightMore(e) * (F.frontier && e.field === 'grave' ? 2 : 1) + extra + (nest ? NEST.extra : 0));
    for (let i = 0; i < n; i++) { const f = foeFrom(pickOne(pool), lv); if (nest && rnd() < NEST.p) makeNestFoe(f); out.push(f); }
  }
  // 희귀종: 우두머리·주인·던전 주인이 아닌 몬스터 하나가 아주 가끔 반짝인다
  if (!e.pvp && !F.giant) for (const f of out) if (!f.boss && !f.fb && !f.nest && rnd() < RARE.p) { makeRare(f); break; }
  return out;
}
function spawn(p, e) {
  e.foes = e.next || rollFoes(e, e.ei - 1);
  e.next = null;
  e.cd = {}; e.buffs = []; e.taunt = null; e.hpW = null; e.noDmg = 0;
  const fb = e.foes.find(f => f.fb), rare = e.foes.find(f => f.rare);
  ev(e, 'spawn', { boss: e.foes.some(f => f.boss), name: fb ? fb.name : '', rare: rare ? 1 : 0 });
  if (rare) { log(`${p.name} 앞에 ${rare.name}이(가) 나타났다! 희귀종이다.`, 'good'); HOOKS.toast(`희귀종 출현 · ${rare.name}`); }
}
function ev(e, type, data) {
  if (e.ev) { e.ev.push(Object.assign({ n: ++e.evN, type }, data)); if (e.ev.length > 50) e.ev.shift(); }
  // 전투 통계: 준 피해(스킬별)·받은 피해·치유·처치
  if (type === 'hit' && data.v) { const who = data.by || data.s; if (who) { bstat(e, who, 'dealt', data.v, data.sid || (data.b ? 'basic' : data.ctr ? 'counter' : data.pet ? 'pet' : data.k === 'pet' ? 'companion' : data.dot ? 'dot' : 'etc')); (e.lastHit || (e.lastHit = {}))[data.d] = who; } }
  else if (type === 'hurt' && data.v) bstat(e, data.d, 'taken', data.v);
  else if (type === 'heal' && data.v && data.s) bstat(e, data.s, 'healed', data.v);
  else if (type === 'kill') { const who = e.lastHit && e.lastHit[data.d]; if (who) bstat(e, who, 'kills', 1); }
}
function bstat(e, who, k, v, sid) { const T = e.stats || (e.stats = {}), r = T[who] || (T[who] = { dealt: 0, taken: 0, healed: 0, kills: 0, sk: {} }); r[k] = (r[k] || 0) + v; if (sid && k === 'dealt') r.sk[sid] = (r.sk[sid] || 0) + v; }

// 거점: 필드 보스를 쓰러뜨린 구간 다음부터 출발할 수 있다 (1-11, 1-21 …)
function checkpoints(fid) {
  const F = FIELDS[fid], fs = S.fields[fid];
  if (!F || F.raid || !fs) return [1];
  return [1].concat([1, 2, 3, 4].filter(k => fs.boss && fs.boss[k]).map(k => k * BOSS_EVERY + 1));
}
function newExp(fid, sup, start = 1) {
  const F = FIELDS[fid];
  const e = { field: fid, area: F.giant ? 'raid' : F.raid ? 'dungeon' : 'field', raid: F.giant || null, rt: 0, dealt: 0, mode: 'advance', stage: start, home: start, pos: 0, ei: 0, encs: [], foes: [], next: null,
    bag: {}, gbag: [], sup, cd: {}, scd: {}, buffs: [], taunt: null, potCd: 0, mpCd: 0,
    kills: 0, full: false, ev: [], evN: 0, why: '', camp: null, wait: null };
  e.encs = F.giant ? [] : makeEncs(e);
  return e;
}
// 원정에 못 나가는 이유 (없으면 '')
function cantGo(a) {
  if (!a || a.status !== 'idle') return '원정 중이에요';
  if (a.inj) return `${a.name}이(가) 다쳐서 치료가 필요해요`;
  if (a.post) return `${a.name}은(는) 신전에서 일하고 있어요`;
  if ((a.sleep || 0) >= SLEEP.block) return `${a.name}이(가) 너무 피곤해요. 여관에서 더 자야 해요`;
  return '';
}
// 전투 대형: 근접은 맨 앞, 원거리 딜러는 가운데, 짐꾼·마법사·치유사는 맨 뒤 (출발할 때 줄을 세운다)
const formRank = c => { const C = CLASSES[c]; if (!C) return 2; if (C.row != null) return C.row; return C.act === 'melee' ? 0 : C.act === 'arrow' ? 1 : 2; };
function formParty(p) { p.members = p.members.map((id, i) => [id, i]).sort((x, y) => { const a = advById(x[0]), b = advById(y[0]); return (a ? formRank(a.cls) : 2) - (b ? formRank(b.cls) : 2) || x[1] - y[1]; }).map(x => x[0]); }
function startExp(p, fid) {
  if (p.raidOnly && !(FIELDS[fid] && FIELDS[fid].giant)) return '레이드 전용 파티는 레이드에만 나가요. 원정대 창의 레이드 탭에서 보내요.';
  const team = p.members.map(advById).filter(a => a && a.status === 'idle');
  if (!team.length || team.length !== p.members.length) return '대기 중인 모험가만 보낼 수 있어요.';
  if (!isUnlocked(fid)) return FIELDS[fid] && FIELDS[fid].giant ? '이번 달에는 열리지 않은 레이드예요.' : '아직 갈 수 없는 곳이에요.';
  const why = team.map(cantGo).find(Boolean);
  if (why) return why + '.';
  const GR = FIELDS[fid].giant && RAIDS[FIELDS[fid].giant];
  if (GR && avgLvOf(p) < GR.lv - RAID_GAP) return `${GR.name} 레이드는 파티 평균 Lv${GR.lv - RAID_GAP} 이상이어야 도전할 수 있어요.`;
  const pw = partyWhy(p); if (pw) return pw;
  if (FIELDS[fid].trade) { const tw = tradeWhy(p); if (tw) return tw; if (!Object.keys(tradeCargoPlan(p, FIELDS[fid].trade).cargo).length) return `${KINGDOMS[FIELDS[fid].trade].name}이(가) 원하는 물건이 창고에 없어요.`; }
  if (FIELDS[fid].region === 'sky' && !wagonFly(p)) return `${FIELDS[fid].name}은(는) 비행 마차에 그리폰·와이번·페가수스를 맨 파티만 갈 수 있어요.`;
  if (FIELDS[fid].treasure && (S.inv.tmap || 0) < 1) return '보물 지도가 없어요.';
  const sup = {};
  if (p.autoBuy) for (const [k, q] of Object.entries(p.sup)) { const short = q - (S.inv[k] || 0); if (short > 0 && ITEMS[k] && ITEMS[k].buy) { const cost = buyPrice(k) * short; if (S.gold >= cost) { S.gold -= cost; S.stats.spent = (S.stats.spent || 0) + cost; addTo(S.inv, k, short); log(`${p.name} 출발 전에 ${ITEMS[k].name} ${short}개를 ${g$(cost)}에 사 두었다.`); } } }
  for (const [k, q] of Object.entries(p.sup)) { const take = Math.min(S.inv[k] || 0, q); if (take > 0) { sup[k] = take; addTo(S.inv, k, -take); } }
  team.forEach(a => { const b = pickArrows(a, fid); if (b) log(`${a.name}이(가) ${FIELDS[fid].name}에 맞춰 ${GTYPES[b].name}을(를) 챙겼다.`); });   // 속성 화살 고르기 (빌드 39)
  formParty(p);
  p.exp = newExp(fid, sup, checkpoints(fid).includes(p.start) ? p.start : 1);
  p.exp.food = packFood(p);   // 도시락
  if (FIELDS[fid].trade) tradeSetup(p, p.exp);
  if (FIELDS[fid].treasure) { addTo(S.inv, 'tmap', -1); p.exp.lvo = Math.max(8, Math.min(MAX_LV2, Math.round(avgLvOf(p)))); p.exp.chests = 0; }
  team.forEach(a => { refillAmmo(a); a.status = 'away'; a.down = false; a.mp = derive(a).maxMp; });
  S.stats.trips++;
  if (!FIELDS[fid].trade) log(`${p.name}이(가) ${FIELDS[fid].name}(으)로 출발했다.${p.exp.food ? ` 도시락 ${FOODS[p.exp.food].name}을(를) 챙겼다.` : ''}${FIELDS[fid].treasure ? ' 보물 지도 한 장을 썼다.' : wagonFly(p) ? ` ${rigName(p)}이(가) 하늘로 떠올랐다.` : ''}`);
  changed();
  return '';
}
function recall(p, why = '') {
  const e = p.exp;
  if (!e || e.mode !== 'advance') return;
  e.mode = 'return'; e.why = why; e.wait = null;
  e.encs = rnd() < 0.5 ? [Math.max(5, Math.floor(e.pos) - ri(15, 30))] : []; e.ei = 0; e.next = null;
  ev(e, 'turn', {});
  if (why === 'full') log(`${p.name}의 짐이 가득 차서 상단으로 돌아온다.`);
  if (why === 'danger') { log(`${p.name}은(는) 물약이 떨어지고 부상자가 생겨 발길을 돌렸다.`); HOOKS.toast(`${p.name}: 위험해서 복귀합니다`); }
  if (why === 'loss') log(`${p.name}은(는) 쓰러진 동료를 들것에 싣고 발길을 돌렸다.`);
  if (why === 'ahead') log(`${p.name}은(는) 앞쪽 몬스터가 너무 강해 보여 발길을 돌렸다.`);
  if (why === 'sleep') log(`${p.name}은(는) 며칠째 제대로 못 자 상단으로 돌아간다.`);
  if (why === 'end') log(`${p.name}이(가) ${FIELDS[e.field].name}의 끝에 닿아 발길을 돌렸다.`, 'good');
  if (why === 'imm') log(`${p.name}은(는) 공격이 통하지 않는 적을 만나 상단으로 돌아간다.`);
  changed();
}
// 던전 입구 앞에서: 들어간다 / 지나간다(돌아간다)
function enterDungeon(p) {
  const e = p.exp;
  if (!e || e.wait !== 'gate' || e.area !== 'field' || S.fields[e.field].cleared) return;
  e.wait = null; e.area = 'dungeon'; e.stage = 1; e.pos = 0; e.ei = 0; e.encs = makeEncs(e); e.next = null;
  log(`${p.name}이(가) ${FIELDS[e.field].dungeon.name}에 들어갔다.`);
  ev(e, 'enter', {});
  changed();
}
function gateChoice(p, choice) {
  const e = p.exp;
  if (!e || e.wait !== 'gate') return;
  if (choice === 'enter') { enterDungeon(p); return; }
  e.wait = null;
  log(`${p.name}은(는) ${FIELDS[e.field].dungeon.name}에 들어가지 않고 돌아섰다.`);
  if (e.stage >= FIELD_STAGES) { recall(p, 'end'); return; }
  e.stage++; e.pos = 0; e.ei = 0; e.encs = makeEncs(e); e.next = null;
  changed();
}

/* ───────── 야영: 지치면 모닥불을 피우고 잔다 ───────── */
function startCamp(p, e) {
  const tent = tentOf(p);   // 정찰가가 있으면 텐트: 피로가 더 풀리고 밤습격도 반으로
  e.camp = { t: 0, night: isNight(), tent: tent > 1 ? tent : 0, amb: isNight() && e.area === 'field' && rnd() < (blessed('moon') ? 0.11 : 0.22) * (tent > 1 ? 0.5 : 1) ? 4 + rnd() * 10 : 0 };
  ev(e, 'camp', { tent: e.camp.tent ? 1 : 0 });
}
function stepCamp(p, e, team, dm, dt) {
  const c = e.camp;
  c.t += dt;
  const tm = c.tent || 1;   // 텐트: 피로 회복 1.5~2배, HP 회복 1.25배
  c.wxf = campWxF(p, wxNow(e));   // 날씨: 노숙이면 비·강풍·추위·더위에 회복이 줄어든다 (텐트가 막는다)
  team.forEach(a => { const d = dm[a.id]; a.fat = Math.max(0, (a.fat || 0) - FATIGUE.sleep * tm * c.wxf * dt); a.hp = Math.min(d.maxHp, a.hp + d.maxHp * 0.02 * (tm > 1 ? 1.25 : 1) * dt); a.mp = Math.min(d.maxMp, a.mp + d.maxMp * 0.05 * d.mpRegen * dt); });
  if (c.amb && c.t >= c.amb) {
    c.amb = 0;
    e.foes = rollFoes(e, -1, 1); e.cd = {}; e.buffs = []; e.taunt = null;
    ev(e, 'spawn', { boss: false, amb: 1 });
    log(`${p.name}의 야영지에 몬스터가 밤습격을 해 왔다!`, 'bad');
    return;
  }
  const f = team.map(a => a.fat || 0);
  if (c.t >= (c.night ? FATIGUE.nightRest : 6) && Math.max(...f) <= 15 && f.reduce((s, v) => s + v, 0) / f.length <= FATIGUE.wake) { e.camp = null; ev(e, 'wake', {}); }
}

// 쓰러진 동료까지 (부활 스킬이 찾는다. 원정 상태에 사람을 넣지 않으려고 따로 둔다)
const TEAM_ALL = new WeakMap();
const downedOf = (e, team) => (TEAM_ALL.get(e) || team).filter(y => y.down);
function stepExp(p, dt) {
  const e = p.exp;
  const all = teamOf(p);
  if (e) TEAM_ALL.set(e, all);
  if (!all.length) { p.exp = null; changed(); return; }
  const team = all.filter(a => !a.down);
  if (!team.length) { wipe(p); return; }
  e.potCd = Math.max(0, e.potCd - dt);
  e.mpCd = Math.max(0, e.mpCd - dt);
  // 숙면 피로: 원정 내내 쌓이고 여관에서만 풀린다
  const ff = foodFx(e), sl = (SLEEP.field + (e.foes.length ? SLEEP.fight : 0)) * dt * (1 - (ff.sleep || 0));   // 도시락: 숙면 피로가 덜 쌓인다
  all.forEach(a => { a.sleep = Math.min(100, (a.sleep || 0) + sl * (1 - traitSum(a, 'sleepy'))); });
  const dm = {};
  e.sta = e.sta || {};
  team.forEach(a => { const d = derive(a), m = fatMul(a.fat || 0); if (m < 1) { d.atk *= m; d.matk *= m; d.def *= m; } const st = e.sta[a.id]; if (st && st.weak) { d.atk *= 0.8; d.matk *= 0.8; d.def *= 0.8; } if (d.hpRegen) a.hp = Math.min(d.maxHp, a.hp + d.maxHp * d.hpRegen * dt); dm[a.id] = d; });
  tickSta(p, e, team, dm, dt);
  if (!p.exp) return;
  // 음유시인·마에스트로의 노래: 파티 전체 공격력과 마법 피해
  const aura = Math.max(0, ...team.map(a => TR(a).aura || 0));
  if (aura) team.forEach(a => { dm[a.id].atk *= 1 + aura; dm[a.id].matk *= 1 + aura; });
  // 광전사: 체력이 줄수록 공격력이 오른다
  team.forEach(a => { const r = TR(a).rage; if (r) dm[a.id].atk *= 1 + r * Math.max(0, 1 - a.hp / dm[a.id].maxHp); const fz = traitSum(a, 'frenzy'); if (fz && a.hp < dm[a.id].maxHp * 0.5) dm[a.id].atk *= 1 + fz; });
  usePotions(p, e, team, dm);
  const fr = (blessed('moon') ? 0.75 : 1) * (1 - (ff.fat || 0));   // 도시락: 피로가 덜 쌓인다
  if (e.area === 'raid') { stepRaid(p, e, team, dm, dt, fr); return; }
  if (e.area === 'arena') { stepArena(p, e, team, dm, dt, fr); return; }
  if (e.area === 'wave') { stepWave(p, e, team, dm, dt, fr); return; }
  if (e.foes.length) { tire(team, FATIGUE.fight * fr * dt); battle(p, e, team, dm, dt); return; }
  if (e.camp) { stepCamp(p, e, team, dm, dt); return; }
  team.forEach(a => { const d = dm[a.id]; a.hp = Math.min(d.maxHp, a.hp + d.maxHp * 0.008 * dt); a.mp = Math.min(d.maxMp, a.mp + d.maxMp * 0.05 * d.mpRegen * dt); });
  if (e.wait === 'gate') return;   // 던전 입구 앞에서 결정을 기다린다
  if (p.safe && e.mode === 'advance' && !hpPotions(e) && team.some(a => a.hp < dm[a.id].maxHp * 0.7)) recall(p, 'danger');
  if (p.safe && e.mode === 'advance' && e.area === 'field' && all.some(a => (a.sleep || 0) >= SLEEP.max)) recall(p, 'sleep');
  const fats = team.map(a => a.fat || 0), maxF = Math.max(...fats), avgF = fats.reduce((s, v) => s + v, 0) / fats.length;
  if (maxF >= FATIGUE.camp || (isNight() && p.campNight !== false && avgF >= FATIGUE.nightCamp)) { startCamp(p, e); return; }
  tire(team, FATIGUE.walk * fr * dt);
  if (!e.next && e.encs[e.ei] != null) e.next = rollFoes(e, e.ei);
  const v = moveOf(p) * (e.mode === 'return' ? 1.15 : 1);
  if (e.mode === 'advance') {
    const next = e.encs[e.ei], np = e.pos + v * dt;
    if (next != null && np >= next) { e.pos = next; e.ei++; spawn(p, e); return; }
    e.pos = np;
    if (e.pos >= STAGE_LEN) stageClear(p, e);
  } else {
    const next = e.encs[e.ei], np = e.pos - v * dt;
    if (next != null && np <= next) { e.pos = next; e.ei++; spawn(p, e); return; }
    e.pos = np;
    if (e.pos <= 0) stageBack(p, e);
  }
}
function stageClear(p, e) {
  if (e.area === 'trade') { tradeStage(p, e); return; }
  const fs = S.fields[e.field], F = FIELDS[e.field];
  if (e.area === 'field') {
    if (e.stage > fs.best) { fs.best = e.stage; if (e.stage % 5 === 0) { S.fame += 1; log(`${p.name}이(가) ${F.no}-${e.stage}까지 처음으로 진출했다. 명성 +1`, 'good'); } }
    if (e.stage >= FIELD_STAGES) {
      e.pos = STAGE_LEN;
      // 1-50의 주인을 쓰러뜨려 던전 입구가 열렸다 (한 번 공략한 던전은 봉인된다)
      if (!fs.cleared) {
        if (!fs.found) { fs.found = true; log(`${p.name}이(가) ${F.no}-${FIELD_STAGES}에서 ${F.dungeon.name} 입구를 열었다!`, 'good'); }
        const mode = p.dmode || 'ask';
        if (mode !== 'skip') {
          e.wait = 'gate';
          if (mode === 'enter') { enterDungeon(p); return; }
          HOOKS.toast(`${p.name}: ${F.dungeon.name} 입구에 도착`);
          queueModal({ title: `${F.dungeon.name} 입구`, gate: p.id, body: [`${p.name}이(가) ${F.name}의 주인을 쓰러뜨리고 ${F.dungeon.name} 입구 앞에 섰다.`, `던전은 한 번만 공략할 수 있다. 안에는 Lv${dungeonLv(F, 1)}~${dungeonLv(F, DUNGEON_FLOORS)} 몬스터와 주인 ${MONS[F.dungeon.boss].name}(Lv${dungeonBossLv(F)})이 기다린다. 파티 평균 Lv${Math.round(avgLvOf(p))}.`] });
          changed();
          return;
        }
      }
      recall(p, 'end');
      return;
    }
    if (p.safe && fieldLv(F, e.stage + 1) + ((e.stage + 1) % BOSS_EVERY === 0 ? 2 : 0) > avgLvOf(p) + 3) { e.stage++; e.pos = 0; e.ei = 0; e.encs = []; e.next = null; recall(p, 'ahead'); return; }
    e.stage++;
  } else if (e.stage < floorsOf(e)) { if (F.treasure) treasureChest(p, e); e.stage++; }
  e.pos = 0; e.ei = 0; e.encs = makeEncs(e); e.next = null;
  changed();
}
// 보물 던전: 층을 지날 때마다 상자 하나 (돈·황금 가루·가끔 장비나 스킬북)
function treasureChest(p, e) {
  const L = e.lvo || 10, gold = Math.round((400 + L * 60) * (0.8 + rnd() * 0.5) / 10) * 10;
  S.gold += gold; S.stats.earned += gold; e.chests = (e.chests || 0) + 1;
  const got = [g$(gold)];
  addTo(e.bag, 'gold_dust', 1); got.push('황금 가루');
  if (rnd() < 0.35) { const g = makeGear(dropBase(), Math.min(GTIERS.length - 1, raidTier(L)), Math.max(1, rollQuality(0.3))); e.gbag.push(g); got.push(`${QUALITY[g.q].name} 장비`); }
  if (rnd() < 0.3) { const b = randomBook(Math.max(1, L - 20), L + 5); if (b) { addTo(e.bag, b, 1); got.push(ITEMS[b].name); } }
  ev(e, 'chest', {});
  log(`${p.name}이(가) 보물고 ${e.stage}층의 상자를 열었다: ${got.join(', ')}`, 'good');
}
function stageBack(p, e) {
  if (e.area === 'dungeon') {
    if (e.stage > 1) e.stage--;
    else if (FIELDS[e.field].raid) { arrive(p); return; }
    else { e.area = 'field'; e.stage = FIELD_STAGES; }
  } else if (e.stage > (e.home || 1)) e.stage--;
  else { arrive(p); return; }   // 출발한 거점에 닿으면 마차를 타고 상단으로
  e.pos = STAGE_LEN; e.ei = 0; e.encs = makeEncs(e); e.next = null;
  changed();
}

/* ───────── 상태이상 ───────── */
// 모험가에게 건다 (특성 저항 반영)
function inflictAdv(e, a, o, atk) {
  e.sta = e.sta || {};
  const st = e.sta[a.id] || (e.sta[a.id] = {}), k = o.k;
  if (k === 'bleed' || k === 'poison' || k === 'burn') {
    const res = Math.min(0.9, (k === 'burn' ? traitSum(a, 'resBurn') : traitSum(a, 'resPoison')) + (foodFx(e).sta || 0));
    const dps = Math.max(1, Math.round((atk || 10) * (o.m || 0.25) * (1 - res)));
    if (st[k] && st[k].dps >= dps) { st[k].t = Math.max(st[k].t, o.d || 8); return; }
    st[k] = { t: o.d || 8, dps, acc: 0 };
  } else if (k === 'weak') { st.weak = Math.max(st.weak || 0, o.d || 8); }
  else { const d = (o.d || 3) * (1 - traitSum(a, 'resCc')) * (1 - (foodFx(e).sta || 0)); if (d <= 0.2) return; st[k] = Math.max(st[k] || 0, d); if (k === 'stun' || k === 'para') comboBreak(e, a.id); }   // 기절·마비면 연계가 끊긴다
  ev(e, 'sta', { d: a.id, k, side: 'a' });
}
// 몬스터 속성에 따라 걸리지 않는 상태이상: 불 계열은 화상, 물·빙결 계열은 냉기, 번개는 감전, 강철은 중독·출혈
const STA_EL = { burn: 'fire', chill: 'ice', shock: 'thunder', poison: 'none', bleed: 'none' };
function inflictFoe(e, f, o, atk, by, sid) {
  if (STA_EL[o.k] && elemBase(STA_EL[o.k], f) === 0) return;
  const st = f.sta || (f.sta = {}), k = o.k;
  if (k === 'bleed' || k === 'poison' || k === 'burn') { const dps = Math.max(1, Math.round((atk || 10) * (o.m || 0.25))); if (st[k] && st[k].dps >= dps) { st[k].t = Math.max(st[k].t, o.d || 8); return; } st[k] = { t: o.d || 8, dps, acc: 0, by: by || 0, sid: sid || 'dot' }; }
  else st[k] = Math.max(st[k] || 0, (o.d || 3) * (f.boss && k !== 'mark' ? 0.5 : 1));   // 표식은 보스에게도 온전히
  ev(e, 'sta', { d: f.uid, k, side: 'f' });
}
function cureSta(e, a, ks) {
  const st = e.sta && e.sta[a.id]; if (!st) return;
  let any = false;
  for (const k of ks) if (st[k]) { delete st[k]; any = true; }
  if (any) ev(e, 'cure', { d: a.id });
}
// 모험가 상태이상 틱: 독·화상·출혈 피해, 시간 줄이기
function tickSta(p, e, team, dm, dt) {
  for (const a of team) {
    const st = e.sta[a.id]; if (!st) continue;
    for (const k of ['poison', 'burn', 'bleed']) {
      const o = st[k]; if (!o) continue;
      o.t -= dt; o.acc += dt;
      if (o.acc >= 1) { o.acc -= 1; const v = Math.max(1, Math.round(o.dps * (0.9 + rnd() * 0.2))); a.hp -= v; ev(e, 'hurt', { s: 0, d: a.id, v, k, dot: 1 }); if (a.hp <= 0) { down(p, e, a, { boss: false }); if (!p.exp) return; break; } }
      if (o.t <= 0) delete st[k];
    }
    for (const k of ['chill', 'shock', 'para', 'stun', 'weak']) if (st[k]) { st[k] -= dt; if (st[k] <= 0) delete st[k]; }
    if (!Object.keys(st).length) delete e.sta[a.id];
  }
}
function tickFoeSta(e, f, dt) {
  const st = f.sta; if (!st) return;
  for (const k of ['poison', 'burn', 'bleed']) {
    const o = st[k]; if (!o) continue;
    o.t -= dt; o.acc += dt;
    if (o.acc >= 1) { o.acc -= 1; const v = Math.max(1, Math.round(o.dps * (0.9 + rnd() * 0.2) * red(f.def * 0.2))); f.hp -= v; ev(e, 'hit', { s: 0, d: f.uid, v, k, dot: 1, by: o.by || 0, sid: o.sid }); }
    if (o.t <= 0) delete st[k];
  }
  for (const k of ['chill', 'shock', 'para', 'stun', 'weak', 'mark']) if (st[k]) { st[k] -= dt; if (st[k] <= 0) delete st[k]; }
  if (!Object.keys(st).length) f.sta = null;
}

/* ───────── 전투 ───────── */
const buffMul = (e, aid, stat) => e.buffs.reduce((m, b) => (b.stat === stat && (b.to === aid || b.to === 'party') && b.mult ? m * b.mult : m), 1);
const buffAdd = (e, aid, stat) => e.buffs.reduce((m, b) => (b.stat === stat && (b.to === aid || b.to === 'party') && b.add ? m + b.add : m), 0);
const lowestFoe = foes => foes.reduce((x, f) => (f.hp < x.hp ? f : x), foes[0]);
const up = x => x.hp > 0 && !x.down;
// 직업 특성: 방어 관통·치명 배율·첫 공격·보스 피해
function hitFoe(e, f, atk, crit, magic, a, el, sk) {
  const T = a ? TR(a) : {};
  const em = elemMul(el, f, a, sk);   // 속성 상성 (0 = 면역)
  HIT.imm = em === 0 ? 1 : 0; HIT.wk = em > 1 ? 1 : 0; HIT.res = em > 0 && em < 1 ? 1 : 0;
  if (em === 0) return 0;
  let def = magic ? f.def * 0.5 : f.def, m = crit ? T.critMul || 1.75 : 1;
  if (T.pen) def *= 1 - T.pen;
  if (T.first && f.hp >= f.maxHp) m *= T.first;
  if (T.bossDmg && f.boss) m *= T.bossDmg;
  if (a && f.boss) m *= 1 + traitSum(a, 'bossDmg');
  if (a && !f.pvp && dexKills(f.id) >= DEX_K[3]) m *= 1.03;   // 도감 완전 기록
  if (a && !f.pvp && dexRare(f.id)) m *= 1 + RARE.dmg;         // 희귀종 기록: 그 종에게 주는 피해 +15%
  if (T.exec && f.hp <= f.maxHp * EXEC_HP) m *= T.exec;                                  // 처형 (한방딜): HP 30% 아래 적
  if (f.sta && f.sta.mark) m *= 1 + MARK_BONUS;                                           // 표식: 받는 피해 +20%
  if (a && T.combo && e.combo && e.combo[a.id]) m *= 1 + T.combo * e.combo[a.id];        // 연계 (지속딜): 중첩만큼
  if (f.sta && f.sta.weak) def *= 0.8;
  m *= em * typeMul(a, f, sk);   // 몬스터 타입 특공 (사냥꾼·괴수사냥꾼·퇴마사 …)
  const v = Math.max(1, Math.round(atk * (0.85 + rnd() * 0.3) * red(def) * m));
  f.hp -= v;
  return v;
}
// 연계: 기본 공격을 맞힐 때마다 쌓이고(상한 COMBO_MAX), 빗나가거나 기절·마비되면 끊긴다
function comboUp(e, a) { const T = TR(a); if (!T.combo) return; e.combo = e.combo || {}; const n = Math.min(COMBO_MAX, (e.combo[a.id] || 0) + 1); if (n !== e.combo[a.id]) { e.combo[a.id] = n; ev(e, 'combo', { s: a.id, c: n }); } }
function comboBreak(e, aid) { if (e.combo && e.combo[aid]) { e.combo[aid] = 0; ev(e, 'combo', { s: aid, c: 0 }); } }
// 성스러운 흡수 (퇴마사·심판관): 자기 마법 피해의 일부만큼 가장 다친 동료가 회복한다
function partyDrain(e, team, dm, a, v) {
  const k = TR(a).pdrain; if (!k || !v) return;
  const x = team.filter(up).sort((p, q) => p.hp / dm[p.id].maxHp - q.hp / dm[q.id].maxHp)[0];
  if (!x || x.hp >= dm[x.id].maxHp) return;
  const h = Math.max(1, Math.round(v * k)); x.hp = Math.min(dm[x.id].maxHp, x.hp + h); ev(e, 'heal', { s: a.id, d: x.id, v: h });
}
// 흡혈 (물리·마법)
function leech(e, a, d, v, magic) {
  const T = TR(a), k = magic ? T.mdrain : T.lifesteal;
  if (!k || !v || a.hp >= d.maxHp) return;
  const h = Math.max(1, Math.round(v * k));
  a.hp = Math.min(d.maxHp, a.hp + h);
  ev(e, 'heal', { s: a.id, d: a.id, v: h });
}
function stealGold(s, hits) { if (!s.steal) return; const g = Math.round(s.steal * hits); S.gold += g; S.stats.earned += g; }
// 스킬 재사용 대기시간 = 기본 × (1 − 재사용 감소 − 강화) × (1 − 숙련 2%/단계). 재사용 감소는 합쳐서 50%까지
function skillCdOf(a, d, id, e) {
  const s = SKILLS[id]; if (!s || !s.cd) return 0;
  const cut = Math.min(CDR_MAX, (d.cdr || 0) + (e ? buffAdd(e, a.id, 'cdr') : 0));
  return Math.max(0.5, s.cd * (1 - cut) * (1 - SM_CD * smLv(a, id)) * (1 - SK_LV_CD * (skLv(a, id) - 1)) * (d.wxSk || 1));   // 더위: 스킬 재사용이 길어진다
}
// 기본 공격 대기시간 = 5초 ÷ 공격 속도(강화 포함)
const basicCd = (a, d, e) => basicCdOf(d.spd, e ? buffMul(e, a.id, 'spd') : 1) * (d.wxBa || 1);   // 추위: 기본 공격 대기가 길어진다
const basicIsMagic = a => CLASSES[a.cls].act === 'magic';
function pickSkill(a, d, team, dm, foes, e) {
  const st = e.sta && e.sta[a.id];
  if (st && (st.shock || st.stun)) return null;
  const sc = e.scd[a.id] || (e.scd[a.id] = {});
  let best = null, bp = 0;
  for (const id of a.skills) {
    const s = SKILLS[id];
    if (!s || s.passive || (sc[id] || 0) > 0) continue;
    if (a.skoff && a.skoff[id]) continue;   // 자동 사용 끔
    if (s.cost.mp && a.mp < s.cost.mp) continue;
    if (s.cost.hp && a.hp < d.maxHp * (s.cost.hp + 0.35)) continue;
    if (arrowSkill(s) && needsArrows(a) && ammoLeft(a.eq.ammo, a) < arrowCost(s, foes.length)) continue;   // 화살이 모자라면 화살 스킬을 못 쓴다
    let pr = 0;
    if (s.kind === 'heal' && s.tgt === 'self') {
      if (a.hp < d.maxHp * 0.5) pr = 10;
    } else if (s.kind === 'heal') {
      const hurt = team.filter(x => up(x) && x.hp < dm[x.id].maxHp * (s.tgt === 'party' ? 0.7 : 0.6));
      if (s.tgt === 'party' ? hurt.length >= 2 : hurt.length >= 1) pr = s.tgt === 'party' ? 11 : 10;
      if (s.reviveAll && downedOf(e, team).length) pr = 13;   // 천상의 기적: 쓰러진 동료가 있으면 가장 먼저
    } else if (s.kind === 'buff') {
      if (!e.buffs.some(b => b.sid === id)) pr = foes.some(f => f.boss) || foes.length >= 2 ? 7 : 4;
    } else if (s.kind === 'shield') {   // 보호막: 아직 없을 때. 자기 보호막은 다쳤거나 보스일 때
      const has = x => e.buffs.some(b => b.stat === 'shield' && b.to === x.id && b.hp > 0);
      if (s.tgt === 'party') { if (team.filter(x => up(x) && !has(x)).length >= 2) pr = foes.some(f => f.boss) || foes.length >= 2 ? 8 : 5; }
      else if (!has(a) && (a.hp < d.maxHp * 0.8 || foes.some(f => f.boss) || foes.length >= 2)) pr = 7;
    } else if (s.kind === 'regen') {    // 재생: 다친 사람이 있고 재생이 안 걸려 있을 때 (급할 땐 직접 치유가 먼저)
      const hurt = team.filter(x => up(x) && x.hp < dm[x.id].maxHp * 0.85 && !buffAdd(e, x.id, 'regen'));
      if (s.tgt === 'party' ? hurt.length >= 2 : hurt.length >= 1) pr = s.tgt === 'party' ? 9 : 8;
    } else if (s.kind === 'revive') {   // 부활: 쓰러진 동료가 있으면 무엇보다 먼저, 싸움마다 한 번
      if (downedOf(e, team).length && !(e.rev && e.rev[a.id])) pr = 12;
    } else if (s.kind === 'cure') {
      if (team.some(x => up(x) && e.sta && e.sta[x.id] && s.cures.some(k => e.sta[x.id][k]))) pr = 9;
    } else if (s.kind === 'taunt') {
      if (team.filter(up).length > 1 && !(e.taunt && e.taunt.t > 0)) pr = 7;
    } else if (s.kind === 'dot') {
      const tg = s.tgt === 'all' ? foes : [foes[0]];
      if (tg.some(f => !f.dot && f.hp > f.maxHp * 0.4)) pr = s.tgt === 'all' && foes.length >= 2 ? 7 : 5;
    } else pr = s.tgt === 'all' ? (foes.length >= 2 ? 8 : 2) : (foes.some(f => f.boss) ? 6 : 5);
    if (pr && (s.kind === 'dmg' || s.kind === 'mdmg' || s.kind === 'dot')) {   // 속성: 면역이면 쓰지 않고, 약점이면 먼저
      const tg = s.tgt === 'all' ? foes : [s.tgt === 'low' ? lowestFoe(foes) : foes[0]], em = Math.max(...tg.map(f => skillElMul(s, f, a) * typeMul(a, f, s)));
      if (em <= 0) pr = 0; else if (em > 1.2) pr += 2; else if (em < 1) pr -= 1;
    }
    if (pr && a.skpri && a.skpri[id]) pr += 3;   // 우선 사용
    if (pr > bp) { bp = pr; best = id; }
  }
  return best;
}
function cast(e, a, d, id, team, dm, foes) {
  const s = SKILLS[id];
  if (s.cost.mp) a.mp -= s.cost.mp;
  if (s.cost.hp) a.hp -= Math.round(d.maxHp * s.cost.hp);
  if (arrowSkill(s) && needsArrows(a)) useAmmo(a.eq.ammo, a, arrowCost(s, foes.length));   // 화살 스킬: 쏘는 만큼
  e.scd[a.id][id] = skillCdOf(a, d, id, e);
  ev(e, 'skill', { s: a.id, id });
  // 숙련도: 쓸수록 위력이 조금씩 오른다 (단계가 오르면 알린다)
  const sm = smLv(a, id), M = smMul(a, id) * skLvMul(a, id), L = skLvMul(a, id);
  a.sm = a.sm || {}; a.sm[id] = (a.sm[id] || 0) + 1;
  if (smLv(a, id) > sm) ev(e, 'mastery', { s: a.id, id, lv: smLv(a, id) });
  if (s.kind === 'dmg' || s.kind === 'mdmg') {
    const magic = s.kind === 'mdmg';
    const tg = s.tgt === 'all' ? foes.slice() : [s.tgt === 'low' ? lowestFoe(foes) : foes[0]];
    for (const f of tg) for (let h = 0; h < (s.hits || 1); h++) {
      if (f.hp <= 0) break;
      let atk = (magic ? d.matk * buffMul(e, a.id, 'matk') : d.atk * buffMul(e, a.id, 'atk')) * s.mult * M;
      if (s.boss && f.boss) atk *= s.boss;
      if (s.exec && f.hp <= f.maxHp * EXEC_HP) atk *= s.exec;   // 스킬 자체의 처형 보너스
      if (d.mExec && f.hp <= f.maxHp * EXEC_HP) atk *= 1 + d.mExec;   // 숙련 (상급 도끼술)
      if (s.gamble) { const jack = rnd() < s.gamble.p; if (jack) { atk *= s.gamble.mult; ev(e, 'jackpot', { s: a.id }); } }   // 대박: 확률로 몇 배
      const crit = s.crit === 1 || rnd() < d.crit + (s.crit || 0) + buffAdd(e, a.id, 'crit');
      const v = hitFoe(e, f, atk, crit, magic, a, skillEl(s, f, a), s);
      ev(e, 'hit', Object.assign({ s: a.id, d: f.uid, v, c: crit, k: s.fx || (magic ? 'magic' : CLASSES[a.cls].act === 'arrow' ? 'arrow' : 'melee'), sid: id }, hitTag()));
      if (!v) continue;   // 면역: 상태이상도 걸리지 않는다
      if (s.sta && (f.hp > 0 || s.sta.k === 'mark') && rnd() < s.sta.p) inflictFoe(e, f, s.sta, atk, a.id, id);
      if (s.slow) f.slow = s.slow;
      if (s.drain) { const h = Math.round(v * s.drain); a.hp = Math.min(d.maxHp, a.hp + h); ev(e, 'heal', { s: a.id, d: a.id, v: h }); }
      else leech(e, a, d, v, magic);
      partyDrain(e, team, dm, a, v);
    }
    stealGold(s, tg.length * (s.hits || 1));
  } else if (s.kind === 'dot') {
    const tg = s.tgt === 'all' ? foes : [foes[0]];
    tg.forEach(f => { if (skillElMul(s, f, a) <= 0) { HIT.imm = 1; ev(e, 'hit', { s: a.id, d: f.uid, v: 0, k: s.fx || 'melee', imm: 1 }); return; } f.dot = { dps: (s.magic ? d.matk * buffMul(e, a.id, 'matk') : d.atk * buffMul(e, a.id, 'atk')) * s.mult * M * (TR(a).dot || 1) * skillElMul(s, f, a), t: s.dur, magic: !!s.magic, by: a.id, sid: id }; f.dotT = 0; if (s.slow) f.slow = s.slow; ev(e, 'hit', { s: a.id, d: f.uid, v: 0, k: s.fx || 'melee', dot: 1 }); });
  } else if (s.kind === 'heal' && s.tgt === 'self') {
    const h = Math.round(d.maxHp * s.pct * M * d.healPow * (1 + d.rheal + buffAdd(e, a.id, 'rheal'))); a.hp = Math.min(d.maxHp, a.hp + h); ev(e, 'heal', { s: a.id, d: a.id, v: h }); cureSta(e, a, ['bleed']);
  } else if (s.kind === 'heal') {
    const pow = d.matk * s.mult * M * (TR(a).healPow || 1) * d.healPow * buffMul(e, a.id, 'heal');
    const alive = team.filter(up);
    const tg = s.tgt === 'party' ? alive : [alive.sort((x, y) => x.hp / dm[x.id].maxHp - y.hp / dm[y.id].maxHp)[0]];
    tg.forEach(x => { const h = Math.round(pow * (0.9 + rnd() * 0.2) * (1 + dm[x.id].rheal + buffAdd(e, x.id, 'rheal'))); x.hp = Math.min(dm[x.id].maxHp, x.hp + h); ev(e, 'heal', { s: a.id, d: x.id, v: h }); cureSta(e, x, s.cures || ['bleed']); });
    if (s.reviveAll) downedOf(e, team).forEach(x => { x.down = false; x.hp = Math.max(1, Math.round(derive(x).maxHp * s.reviveAll)); x.inj = null; ev(e, 'revive', { s: a.id, d: x.id }); log(`${a.name}의 「${s.name}」에 ${x.name}이(가) 다시 일어섰다!`, 'good'); });   // 2차 각성기: 쓰러진 동료를 모두
    if (s.reviveAll && e.flee && !downedOf(e, team).length) e.flee = 0;
  } else if (s.kind === 'cure') {
    team.filter(up).forEach(x => cureSta(e, x, s.cures));
    ev(e, 'buff', { s: a.id, id, party: true });
  } else if (s.kind === 'buff') {
    const to = s.tgt === 'party' ? 'party' : a.id;
    e.buffs = e.buffs.filter(b => b.sid !== id && b.sid !== id + '#h');
    const dur = s.dur * (1 + (d.mBuff || 0));   // 숙련 (연주법): 강화가 더 오래 간다
    e.buffs.push({ sid: id, to, stat: s.stat, mult: s.mult ? 1 + (s.mult - 1) * L : 0, add: (s.add || 0) * L, t: dur });   // 스킬 레벨만큼 세진다
    if (s.haste) e.buffs.push({ sid: id + '#h', to, stat: 'spd', mult: 1 + (s.haste - 1) * L, add: 0, t: dur });   // 공격 속도도 함께 올리는 강화
    ev(e, 'buff', { s: a.id, id, party: to === 'party' });
  } else if (s.kind === 'taunt') {
    e.taunt = { aid: a.id, t: s.dur };
    ev(e, 'buff', { s: a.id, id });
  } else if (s.kind === 'shield') {   // 보호막: 피해를 대신 받는 임시 HP (mult × 마법 공격력, 또는 pct × 대상 최대 HP)
    const tg = s.tgt === 'party' ? team.filter(up) : [a];
    tg.forEach(x => { const amt = Math.round((s.pct ? dm[x.id].maxHp * s.pct : d.matk * s.mult * (TR(a).healPow || 1) * d.healPow) * M); e.buffs = e.buffs.filter(b => b.sid !== id + '@' + x.id); e.buffs.push({ sid: id + '@' + x.id, to: x.id, stat: 'shield', hp: amt, max: amt, t: s.dur }); ev(e, 'shield', { s: a.id, d: x.id, v: amt, on: 1 }); });
    ev(e, 'buff', { s: a.id, id, party: s.tgt === 'party' });
  } else if (s.kind === 'regen') {    // 재생: 초당 회복이 dur초 이어진다
    const hps = d.matk * s.mult * M * (TR(a).healPow || 1) * d.healPow * buffMul(e, a.id, 'heal');
    const alive = team.filter(up);
    const tg = s.tgt === 'party' ? alive : [alive.sort((x, y) => x.hp / dm[x.id].maxHp - y.hp / dm[y.id].maxHp)[0]];
    tg.forEach(x => { e.buffs = e.buffs.filter(b => b.sid !== id + '@' + x.id); e.buffs.push({ sid: id + '@' + x.id, to: x.id, stat: 'regen', add: hps, t: s.dur }); });
    ev(e, 'buff', { s: a.id, id, party: s.tgt === 'party' });
  } else if (s.kind === 'revive') {   // 부활: 쓰러진 동료 하나를 일으킨다 (싸움마다 한 번)
    const x = downedOf(e, team)[0];
    if (x) { x.down = false; x.hp = Math.max(1, Math.round(derive(x).maxHp * s.pct * M)); x.inj = null; e.rev = e.rev || {}; e.rev[a.id] = 1; if (e.flee && !downedOf(e, team).length) e.flee = 0; ev(e, 'revive', { s: a.id, d: x.id }); log(`${a.name}이(가) 쓰러진 ${x.name}을(를) 일으켜 세웠다!`, 'good'); }
  }
}
// 화살이 떨어졌다: 원정마다 한 번 알린다
function noAmmo(e, a, k) {   // 기록은 원정마다 한 번, 전투 화면 말풍선은 8초마다 · k 'shuri'면 표창
  const key = a.id + (k || ''), nm = k === 'shuri' ? '표창' : '화살';
  e.noAmmo = e.noAmmo || {}; if (!e.noAmmo[key]) { e.noAmmo[key] = 1; log(`${a.name}의 ${nm}이 떨어졌다. 상단에 돌아가야 다시 채운다.`, 'bad'); }
  e.noAmmoT = e.noAmmoT || {}; const last = e.noAmmoT[key]; if (last == null || S.t - last >= 8) { e.noAmmoT[key] = S.t; ev(e, 'noammo', k ? { s: a.id, k } : { s: a.id }); }
}
function basicAct(e, a, d, team, dm, foes) {
  const act0 = CLASSES[a.cls].act, act = act0 === 'melee' && shootsArrows(a) ? 'arrow' : act0, T = TR(a), st = e.sta && e.sta[a.id];   // 용기병이 활을 들면 사격
  if (st && (st.para || st.stun)) return;
  if (act === 'magic') {
    const f = foes[0], mk = d.matk * buffMul(e, a.id, 'matk') * BASIC_MAGIC, crit = rnd() < d.crit + buffAdd(e, a.id, 'crit'), v = hitFoe(e, f, mk, crit, true, a, 'none');
    ev(e, 'hit', Object.assign({ s: a.id, d: f.uid, v, c: crit, k: 'magic', b: 1 }, hitTag()));
    leech(e, a, d, v, true);
    partyDrain(e, team, dm, a, v);
    // 정령술사: 다른 적에게도 번진다
    if (T.aoe) foes.slice(1).forEach(o => { if (o.hp > 0) { const w = hitFoe(e, o, mk * T.aoe, false, true, a, 'none'); ev(e, 'hit', Object.assign({ s: a.id, d: o.uid, v: w, c: false, k: 'fire', b: 1 }, hitTag())); } });
    return;
  }
  const f = act === 'arrow' ? lowestFoe(foes) : foes[0];
  const k = act === 'arrow' ? (a.eq && a.eq.weapon && a.eq.weapon.base === 'lute' ? 'note' : 'arrow') : 'melee';
  const bow = shootsArrows(a);
  if (bow && ammoLeft(a.eq.ammo, a) <= 0) { noAmmo(e, a); return; }   // 화살이 없으면 기본 공격을 못 한다
  const swings = 1 + (rnd() < (T.double || 0) + (d.double || 0) ? 1 : 0);
  for (let i = 0; i < swings; i++) {
    if (f.hp <= 0) break;
    if (bow && !useAmmo(a.eq.ammo, a, 1)) { noAmmo(e, a); break; }   // 한 발씩
    if (rnd() < f.eva) { ev(e, 'fmiss', { s: a.id, d: f.uid }); comboBreak(e, a.id); continue; }
    const crit = rnd() < d.crit + buffAdd(e, a.id, 'crit');
    const atk = (d.atk * buffMul(e, a.id, 'atk') + (T.hybrid ? d.matk * buffMul(e, a.id, 'matk') * T.hybrid : 0)) * BASIC_MULT * (d.mExec && f.hp <= f.maxHp * EXEC_HP ? 1 + d.mExec : 1);   // 5초에 한 번, 그만큼 세게 (숙련 처형)
    const bel = bow ? arrowEl(a) || 'none' : 'none';   // 속성 화살 (빌드 39)
    const v = hitFoe(e, f, atk, crit, false, a, bel);
    ev(e, 'hit', Object.assign({ s: a.id, d: f.uid, v, c: crit, k: T.hybrid ? 'spell' : k, b: 1 }, bel !== 'none' ? { el: bel } : {}, hitTag()));
    if (!v) continue;
    if (bow) { const AS = arrowSta(a); if (AS && f.hp > 0 && rnd() < AS.p) inflictFoe(e, f, AS, d.atk * buffMul(e, a.id, 'atk'), a.id, 'arrow'); }
    if (d.mStun && f.hp > 0 && rnd() < d.mStun) inflictFoe(e, f, { k: 'stun', d: 1.2 }, atk, a.id, 'mast');   // 숙련 (상급 둔기술)
    leech(e, a, d, v, false);
    comboUp(e, a);   // 연계 중첩 (지속딜)
  }
  // 표창: 기본 공격마다 하나를 더 던진다 (남은 적 중 가장 약한 적, 직업 특성은 안 탄다)
  const sh = a.eq && a.eq.off;
  if (isAmmo(sh) && sh.base === 'shuriken' && !ammoLeft(sh, a)) noAmmo(e, a, 'shuri');
  else if (isAmmo(sh) && sh.base === 'shuriken' && useAmmo(sh, a, 1)) { const live = foes.filter(x => x.hp > 0); if (live.length) { const tg = lowestFoe(live), c = rnd() < d.crit + buffAdd(e, a.id, 'crit'), v = hitFoe(e, tg, d.atk * buffMul(e, a.id, 'atk') * BASIC_MULT * SHURI_MUL, c, false, null, 'none'); ev(e, 'hit', Object.assign({ s: a.id, d: tg.uid, v, c, k: 'arrow', sid: 'shuri' }, hitTag())); } }
  // 레인저·용기병: 동물 동료가 함께 문다
  if (T.pet && f.hp > 0 && rnd() < 0.5 + T.pet) { const v = hitFoe(e, f, d.atk * (0.35 + T.pet) * BASIC_MULT, false, false, null, 'none'); ev(e, 'hit', Object.assign({ s: a.id, d: f.uid, v, c: false, k: 'pet' }, hitTag())); }
}
// 적이 노릴 상대: 앞줄과 방패를 든 직업이 더 자주 맞는다
function tankW(a) { const t = TR(a).tank; return Math.max(0, (t != null ? t : jobBase(a.cls) === 'warrior' ? 1 : 0) + traitSum(a, 'tank')); }
function pickTarget(live) {
  const w = live.map((x, i) => 1 + (i === 0 ? 1 : 0) + tankW(x) * 2), sum = w.reduce((s2, v) => s2 + v, 0);
  let r = rnd() * sum;
  for (let i = 0; i < live.length; i++) { r -= w[i]; if (r <= 0) return live[i]; }
  return live[0];
}
function battle(p, e, team, dm, dt) {
  const foes = e.foes;
  if (e.flee) {
    e.flee -= dt;
    if (e.flee <= 0) {
      const imm = e.fleeImm; e.fleeImm = 0;
      e.flee = 0; e.foes = []; e.next = null; e.cd = {}; e.buffs = []; e.taunt = null; e.hpW = null;
      ev(e, 'flee', { skip: imm && e.area !== 'wave' && (imm === 1 || e.mode !== 'advance') ? 1 : 0 });
      if (imm) {
        // 성문 방어전: 물러나면 진다 / 우두머리(던전 주인·필드 우두머리·레이드): 넘을 수 없으니 돌아온다 / 그 밖: 싸움만 피하고 길을 이어 간다
        if (e.area === 'wave') { log(`${p.name}은(는) 공격이 통하지 않는 무리에 밀려 성문에서 물러났다.`, 'bad'); waveEnd(p, e, false); return; }
        if (imm === 2 && e.mode === 'advance') { log(`${p.name}은(는) 공격이 통하지 않는 우두머리를 넘지 못하고 발길을 돌렸다.`, 'bad'); recall(p, 'imm'); return; }
        e.skipped = (e.skipped || 0) + 1;
        log(`${p.name}은(는) 공격이 통하지 않는 적을 피해 싸움에서 빠져나와 ${e.mode === 'advance' ? '길을 이어 간다' : '돌아가는 길을 서두른다'}.`, 'bad');
        return;
      }
      log(`${p.name}은(는) 쓰러진 동료를 들쳐 메고 싸움에서 빠져나왔다.`, 'bad');
      return;
    }
  }
  // 면역뿐이라 아무 피해도 못 주면 물러난다 (강철에 무속성만, 빛·신성에 속성만 …)
  // 적 무리가 바뀌면(새 무리·방어전 다음 차례·소환) 처음부터 다시 잰다
  const sig = foes.map(f => f.uid).join(',');
  if (e.hpS !== sig) { e.hpS = sig; e.hpW = null; e.noDmg = 0; }
  const hpNow = foes.reduce((t, f) => t + Math.max(0, f.hp), 0);
  if (e.hpW == null || hpNow < e.hpW - 0.5) { e.hpW = hpNow; e.noDmg = 0; } else e.noDmg = (e.noDmg || 0) + dt;
  if (e.noDmg > 14 && !e.flee && !foes.some(f => f.pvp)) {
    const live = foes.filter(f => f.hp > 0), bossF = live.find(f => f.boss || f.fb), boss = !!bossF || e.area === 'raid', f0 = bossF || live[0];
    e.flee = 2.5; e.fleeImm = boss ? 2 : 1; e.noDmg = 0; ev(e, 'immflee', { boss: boss ? 1 : 0 });
    log(`${p.name}의 공격이 ${f0 ? f0.name || MONS[f0.id].name : '적'}에게 통하지 않는다! ${boss ? '넘을 수 없는 상대라 물러난다' : '싸움을 피해 지나간다'}.${f0 && monElNote(f0.id) ? ` (${monElNote(f0.id)})` : ''}`, 'bad');
    HOOKS.toast(`${p.name}: 공격이 통하지 않아 ${boss ? '돌아옵니다' : '싸움을 피해 지나갑니다'}`);
  }
  e.buffs.forEach(b => { b.t -= dt; });
  e.buffs = e.buffs.filter(b => b.t > 0 && !(b.stat === 'shield' && b.hp <= 0));   // 다 깨진 보호막은 걷는다
  if (e.taunt) { e.taunt.t -= dt; if (e.taunt.t <= 0) e.taunt = null; }
  e.gcd = e.gcd || {}; e.rg = e.rg || {};
  for (const a of team) {
    if (!up(a)) continue;
    const d = dm[a.id];
    a.mp = Math.min(d.maxMp, a.mp + d.maxMp * 0.02 * d.mpRegen * dt);
    a.mp = Math.min(d.maxMp, a.mp + (d.mpFlat || 0) * dt);
    // 재생: 1초마다 걸린 만큼 회복
    const rg = buffAdd(e, a.id, 'regen');
    if (rg) { e.rg[a.id] = (e.rg[a.id] || 0) + dt; if (e.rg[a.id] >= 1) { e.rg[a.id] -= 1; if (a.hp < d.maxHp) { const h = Math.max(1, Math.round(rg * (1 + d.rheal + buffAdd(e, a.id, 'rheal')))); a.hp = Math.min(d.maxHp, a.hp + h); ev(e, 'heal', { s: 0, d: a.id, v: h, rg: 1 }); } } }
    const st = e.sta && e.sta[a.id];
    if (st && st.stun) continue;   // 기절: 모든 대기시간이 멈춘다
    const sc = e.scd[a.id] || (e.scd[a.id] = {}), chill = st && st.chill ? 0.67 : 1;
    for (const k in sc) sc[k] = Math.max(0, sc[k] - dt * chill);
    // 스킬: 저마다의 재사용 대기시간이 돌면 나간다 (스킬과 스킬 사이는 CAST_GAP)
    e.gcd[a.id] = Math.max(0, (e.gcd[a.id] || 0) - dt);
    const alive = foes.filter(f => f.hp > 0);
    if (!alive.length) break;
    if (e.gcd[a.id] <= 0) {
      const sk = pickSkill(a, d, team, dm, alive, e);
      if (sk) { cast(e, a, d, sk, team, dm, alive); e.gcd[a.id] = CAST_GAP; }
    }
    // 기본 공격: 5초 ÷ 공격 속도마다 한 번, 스킬과 상관없이
    e.cd[a.id] = (e.cd[a.id] ?? (0.3 + rnd() * 0.6)) - dt * chill;
    if (e.cd[a.id] > 0) continue;
    e.cd[a.id] = basicCd(a, d, e) * (0.95 + rnd() * 0.1);
    const alive2 = foes.filter(f => f.hp > 0);
    if (!alive2.length) break;
    basicAct(e, a, d, team, dm, alive2);
  }
  petTick(p, e, team, dm, dt);
  for (const f of foes) {
    if (f.hp <= 0) continue;
    if (f.dot) {
      f.dotT += dt; f.dot.t -= dt;
      if (f.dotT >= 1) { const v = Math.max(1, Math.round(f.dot.dps * f.dotT * red(f.def * (f.dot.magic ? 0.15 : 0.3)))); f.hp -= v; f.dotT = 0; ev(e, 'hit', { s: 0, d: f.uid, v, k: f.dot.magic ? 'curse' : 'poison', dot: 1, by: f.dot.by || 0, sid: f.dot.sid }); }
      if (f.dot.t <= 0) f.dot = null;
    }
    if (f.slow > 0) f.slow -= dt;
    tickFoeSta(e, f, dt);
    if (f.hp <= 0) continue;
    f.cd -= dt * (f.sta && f.sta.chill ? 0.67 : 1);
    if (f.cd > 0) continue;
    f.cd = 1 / f.spd * (0.9 + rnd() * 0.25) * (f.slow > 0 ? 1.6 : 1);
    if (f.sta && (f.sta.stun || f.sta.para)) continue;
    const live = team.filter(up);
    if (!live.length) break;
    if (f.heal && !(f.sta && f.sta.shock) && rnd() < 0.3) { const ally = foes.filter(x => x.hp > 0).sort((x, y) => x.hp / x.maxHp - y.hp / y.maxHp)[0]; if (ally && ally.hp < ally.maxHp * 0.75) { const h = Math.round(f.heal * (0.9 + rnd() * 0.2)); ally.hp = Math.min(ally.maxHp, ally.hp + h); ev(e, 'fheal', { s: f.uid, d: ally.uid, v: h }); continue; } }
    if ((MONS[f.id].aoe || f.aoe) && !(f.sta && f.sta.shock) && rnd() < 0.3) { ev(e, 'aoe', { s: f.uid }); live.forEach(x => hitAdv(p, e, f, x, 0.7, dm)); continue; }
    let tgt = null;
    if (e.taunt) tgt = live.find(x => x.id === e.taunt.aid) || null;
    if (!tgt) tgt = pickTarget(live);
    // 엄호 (탱커): 다른 동료가 노려지면 일정 확률로 대신 맞는다 (기절 중이거나 HP 25% 아래면 못 한다)
    if (!e.taunt && live.length > 1) {
      const c = live.filter(x => x !== tgt && (TR(x).cover || 0) > 0 && x.hp > dm[x.id].maxHp * 0.25 && !(e.sta && e.sta[x.id] && e.sta[x.id].stun)).sort((x, y) => (TR(y).cover || 0) - (TR(x).cover || 0))[0];
      if (c && rnd() < TR(c).cover) { ev(e, 'cover', { s: c.id, d: tgt.id }); tgt = c; }
    }
    hitAdv(p, e, f, tgt, 1, dm);
  }
  for (let i = foes.length - 1; i >= 0; i--) if (foes[i].hp <= 0) { const f = foes[i]; foes.splice(i, 1); kill(p, e, f); }
  if (!foes.length) { e.cd = {}; e.buffs = []; e.taunt = null; ev(e, 'clear', {}); }
}
function hitAdv(p, e, f, x, mult, dm) {
  if (!up(x)) return;
  const d = dm[x.id], m = MONS[f.id];
  if (rnd() < Math.min(0.6, d.eva + buffAdd(e, x.id, 'eva'))) { ev(e, 'miss', { s: f.uid, d: x.id }); return; }
  const def = d.def * buffMul(e, x.id, 'def') * (m.magic ? 0.5 : 1);
  const crit = rnd() < (f.boss ? 0.08 : 0.04);
  const pet0 = petOfParty(p), guard = Math.min(0.6, TQ(x, 'guard') + relic('guard') + buffAdd(e, x.id, 'guard') + (pet0 && pet0.trait === 'loyal' ? 0.04 : 0));
  const blk = rnd() < Math.min(0.6, (d.block || 0) + buffAdd(e, x.id, 'block'));
  let v = Math.max(1, Math.round(f.atk * (f.sta && f.sta.weak ? 0.8 : 1) * mult * (0.85 + rnd() * 0.3) * red(def) * (crit ? 1.6 : 1) * (1 - guard) * (blk ? 0.25 : 1)));
  // 보호막이 먼저 깎인다
  let sh = 0;
  for (const b of e.buffs) { if (v <= 0) break; if (b.stat === 'shield' && b.to === x.id && b.hp > 0) { const ab = Math.min(b.hp, v); b.hp -= ab; v -= ab; sh += ab; } }
  if (sh) ev(e, 'shield', { s: f.uid, d: x.id, v: sh });
  if (v <= 0) return;
  x.hp -= v;
  ev(e, 'hurt', { s: f.uid, d: x.id, v, c: crit, k: m.magic ? 'magic' : '', blk: blk ? 1 : 0 });
  if (x.hp <= 0) { down(p, e, x, f); return; }
  const ms = m.sta || f.inflict;
  if (ms && rnd() < ms.p) inflictAdv(e, x, ms, f.atk);
  const st = e.sta && e.sta[x.id];
  if (!(st && (st.para || st.stun)) && rnd() < Math.min(0.7, (d.counter || 0) + buffAdd(e, x.id, 'counter'))) {
    const cv = hitFoe(e, f, d.atk * buffMul(e, x.id, 'atk') * 0.8, rnd() < d.crit, false, x, 'none');
    ev(e, 'hit', Object.assign({ s: x.id, d: f.uid, v: cv, c: false, k: 'melee', ctr: 1 }, hitTag()));
  }
}
function kill(p, e, f) {
  const m = MONS[f.id], F = FIELDS[e.field];
  e.kills++; S.stats.kills++;
  if (!f.pvp) dexKill(f.id);   // 도감: 잡은 수
  if ((f.fb || f.boss) && !f.pvp && !f.giant) S.stats.bosses = (S.stats.bosses || 0) + 1;   // 업적용
  if (f.giant) { ev(e, 'kill', { d: f.uid, id: f.id, sc: 0 }); e.giantDown = 1; return; }   // 레이드 몬스터는 stepRaid가 마무리한다
  const team = teamOf(p).filter(a => !a.down);
  team.forEach(a => { a.kills = (a.kills || 0) + 1; a.pf = (a.pf || 0) + (e.area === 'dungeon' ? 0.08 : 0.04) * (1 + traitSum(a, 'pfPct')); if ((f.fb || f.boss) && !f.pvp) a.bosses = (a.bosses || 0) + 1; });   // 우두머리·주인 처치 수는 라이선스 심사에 쓴다
  const harvest = blessed('harvest') ? 1.15 : 1;
  const xp = Math.round(f.lv * 3 * (f.fb ? 8 : f.boss ? 15 : f.pvp ? 4 : 1) * (f.rare ? RARE.exp : f.nest ? 1.5 : 1) * (1 + (spn('elves') >= 2 ? 0.1 : 0) + (spn('elves') >= 3 ? 0.15 : 0) + relic('exp') + petHome('exp') + (foodFx(e).exp || 0)) * harvest);
  if (f.rare && !f.pvp) rareDown(p, e, f);
  team.forEach(a => { if (addExp(a, xp)) { ev(e, 'lvl', { d: a.id }); log(`${a.name}이(가) Lv${a.lv}이 되었다.`, 'good'); } });
  ev(e, 'kill', { d: f.uid, id: f.id, sc: f.sc || 0, adv: f.adv || null });
  petKill(p, e, f, xp);
  if (f.pvp) return;   // 투기장: 전리품 없음
  kqKill(f.id);
  const luck = Math.max(0, ...team.map(a => TQ(a, 'luck'))), hunt = Math.max(0, ...team.map(a => TQ(a, 'drop')));   // 보물 사냥꾼의 운, 괴물사냥꾼의 손질
  const pet = petOfParty(p), petLuck = (pet ? (PETS[pet.kind].luck || 0) + (pet.trait === 'lucky' ? 0.08 : 0) : 0) + petHome('luck');
  const dropMul = (1 + (spn('elves') >= 1 ? 0.1 : 0) + relic('drop') + luck + hunt + petLuck + (dexRare(f.id) ? RARE.drop : 0) + (foodFx(e).luck || 0)) * harvest, fbm = f.fb ? 3 : f.nest || f.rare ? 2 : 1;
  for (const [it, ch, q] of m.drops) if (rnd() < Math.min(1, ch * dropMul * fbm)) loot(p, e, it, (q || 1) * (f.fb ? 2 : 1));
  if (e.area === 'field' && rnd() < 0.12 * harvest * (1 + petHome('herb'))) loot(p, e, pickOne(F.herbs || ['herb']), 1);   // 약초 줍기
  const ap = 1 + rlv('appraise') * 0.25;
  const inD = e.area === 'dungeon';
  const gt = F.treasure ? Math.min(GTIERS.length - 1, raidTier(e.lvo || 10)) : F.tier;   // 보물 던전은 파티 레벨에 맞는 단계
  if ((f.boss && !f.fb) || (f.fb && rnd() < 0.6) || rnd() < (inD ? 0.025 : 0.006) * ap) lootGear(p, e, makeGear(dropBase(), gt, rollQuality(f.boss ? 0.25 : 0)));
  { const ea = elemArrowOf(f.id); if (ea && rnd() < (f.boss || f.fb ? 0.3 : 0.012) * ap) lootGear(p, e, makeGear(ea, gt, 0)); }   // 속성 화살: 그 속성 몬스터한테서
  // 스킬북: 몬스터마다 정해진 책만 떨어뜨린다 (data-books.js). 감정 연구·전리품 운이 확률을 올린다
  for (const sk of monBooks(f.id)) if (ITEMS['book_' + sk] && rnd() < Math.min(1, bookRate(f, e.area) * ap * (1 + luck + hunt + petLuck))) loot(p, e, 'book_' + sk, 1);
  bossParts(p, e, f, inD);
  stoneDrops(p, e, f, luck);
  mapDrops(p, e, f, luck);
  if (f.nest) nestKill(p, e, f);
  if (luck && rnd() < luck) { const g = Math.round(f.lv * (2 + rnd() * 3)); S.gold += g; S.stats.earned += g; }
  if (f.fb) { if (S.fields[e.field]) fieldBossDown(p, e, f); }   // 방어전(wave)의 우두머리는 필드 기록이 없다
  else if (f.boss && e.area === 'dungeon') dungeonClear(p, e);
}
// 보스 전용 부속품: 우두머리(1-10~1-40)는 증표, 필드의 주인(1-50)은 핵, 던전을 공략한 뒤에는 가끔 혼까지
function bossParts(p, e, f, inD) {
  if (!TIER_FIELDS.includes(e.field)) return;
  const t = FIELDS[e.field].tier, fs = S.fields[e.field];
  if (f.fb) {
    if (f.fb < 5) loot(p, e, 'crest_' + t, 1 + (rnd() < 0.35 ? 1 : 0));
    else { loot(p, e, 'core_' + t, 1); loot(p, e, 'crest_' + t, 2); if (fs.cleared && rnd() < 0.12 + relic('drop')) loot(p, e, 'soul_' + t, 1); }
    if (rnd() < (f.fb >= 5 ? 0.5 : 0.25)) loot(p, e, runeId(pickOne(RUNE_IDS), f.fb >= 5 && rnd() < 0.3 ? 1 : 0), 1);
  } else if (inD && rnd() < (f.boss ? 1 : 0.02)) loot(p, e, runeId(pickOne(RUNE_IDS), f.boss ? 1 : 0), 1);
}
// 특성 돌(개화석·마법사의 돌): 필드의 우두머리·주인과 던전 주인이 가끔 남긴다 (data-trait.js STONE_DROP). 전리품 운이 조금 올린다
function stoneDrops(p, e, f, luck) {
  const kind = e.area === 'field' && f.fb ? (f.fb >= 5 ? 'lord' : 'fb') : e.area === 'dungeon' && f.boss && !f.fb ? 'boss' : null;
  if (!kind) return;
  for (const it of STONE_IDS) if (rnd() < STONE_DROP[it][kind] * (1 + (luck || 0))) { addTo(e.bag, it, 1); ev(e, 'loot', { id: it }); log(`${p.name}이(가) ${f.name}에게서 ${ITEMS[it].name}을(를) 얻었다!`, 'good'); }   // 짐이 가득 차도 잃지 않는다
}
// 보물 지도: 필드의 우두머리(4%)·주인(8%)이 남긴다 (data-sky.js TMAP_DROP)
function mapDrops(p, e, f, luck) {
  if (e.area !== 'field' || !f.fb) return;
  if (rnd() < (f.fb >= 5 ? TMAP_DROP.lord : TMAP_DROP.fb) * (1 + (luck || 0))) { addTo(e.bag, 'tmap', 1); ev(e, 'loot', { id: 'tmap' }); log(`${p.name}이(가) ${f.name}에게서 낡은 보물 지도를 얻었다!`, 'good'); HOOKS.toast('보물 지도를 얻었다'); }
}
// 희귀종을 잡으면: 도감에 기록(그 종 피해 +15%·전리품 +25%), 개화석 하나
function rareDown(p, e, f) {
  const first = !dexRare(f.id);
  dexRareKill(f.id);
  addTo(e.bag, 'bloomstone', 1); ev(e, 'loot', { id: 'bloomstone' });
  S.fame += 2; S.stats.rares = (S.stats.rares || 0) + 1;
  log(`${p.name}이(가) 희귀종 ${f.name}을(를) 쓰러뜨렸다! 개화석을 남겼다. 명성 +2${first ? ` · 도감에 기록: ${MONS[f.id].name}에게 주는 피해 +${Math.round(RARE.dmg * 100)}%, 전리품 +${Math.round(RARE.drop * 100)}%` : ''}`, 'good');
  HOOKS.toast(`희귀종 격파 · ${f.name}`);
}
function fieldBossDown(p, e, f) {
  const fs = S.fields[e.field], F = FIELDS[e.field], k = f.fb;
  fs.boss = fs.boss || {};
  const first = !fs.boss[k];
  fs.boss[k] = (fs.boss[k] || 0) + 1;
  const fame = first ? 4 + k * 3 : 1;
  S.fame += fame;
  teamOf(p).filter(a => !a.down).forEach(a => { a.pf = (a.pf || 0) + (first ? 6 : 3); });
  log(`${p.name}이(가) ${F.no}-${e.stage}의 필드 보스 ${f.name}을(를) 쓰러뜨렸다! 명성 +${fame}`, 'good');
  if (first) HOOKS.toast(`필드 보스 격파 · ${f.name}`);
}
function loot(p, e, it, q) {
  const room = capOf(p) - usedOf(p);
  const fit = Math.min(q, Math.floor(room / ITEMS[it].w));
  if (fit > 0) { addTo(e.bag, it, fit); ev(e, 'loot', { id: it }); }
  if (fit < q) e.full = true;
  if (e.full && p.auto && e.mode === 'advance' && e.area === 'field') recall(p, 'full');
}
function lootGear(p, e, g) {
  if (capOf(p) - usedOf(p) >= GTYPES[g.base].w) {
    e.gbag.push(g);
    ev(e, 'gear', { base: g.base, t: g.t });
    if (g.q >= 1) log(`${p.name}이(가) ${QUALITY[g.q].name} 장비 「${gearName(g)}」을(를) 주웠다.`, 'good');
  } else e.full = true;
}
const isCaster = a => ['mage', 'cleric'].includes(jobBase(a.cls)) || a.cls === 'paladin' || CLASSES[a.cls].act === 'magic';
const hpPotions = e => ['pot_l', 'pot_m', 'pot_s'].reduce((s, k) => s + (e.sup[k] || 0), 0);
function potionHeal(k) { return ITEMS[k].heal * (1 + rlv('potion') * 0.25 + (spn('clinic') >= 3 ? 0.2 : 0) + relic('potion')); }
function usePotions(p, e, team, dm) {
  if (e.sta) for (const k of CURE_IDS) {   // 상태이상 치료 소모품: 걸린 사람이 있으면 하나 쓴다 (만병통치약은 맨 나중에)
    if ((e.sup[k] || 0) <= 0) continue;
    const C = ITEMS[k].cure, a = team.find(x => up(x) && e.sta[x.id] && C.some(s => e.sta[x.id][s]));
    if (a) { addTo(e.sup, k, -1); cureSta(e, a, C); ev(e, 'pot', { d: a.id, v: 0, k }); }
  }
  if (e.potCd <= 0) {
    const low = team.filter(a => up(a) && a.hp < dm[a.id].maxHp * 0.4).sort((x, y) => x.hp / dm[x.id].maxHp - y.hp / dm[y.id].maxHp)[0];
    if (low) {
      const miss = dm[low.id].maxHp - low.hp;
      const order = ['pot_s', 'pot_m', 'pot_l'].filter(k => (e.sup[k] || 0) > 0);
      const use = order.find(k => potionHeal(k) >= miss * 0.6) || order[order.length - 1];
      if (use) {
        addTo(e.sup, use, -1);
        const v = Math.round(potionHeal(use));
        low.hp = Math.min(dm[low.id].maxHp, low.hp + v);
        e.potCd = 1.5;
        ev(e, 'pot', { d: low.id, v });
      }
    }
  }
  if (e.mpCd <= 0) {
    const dry = team.find(a => up(a) && isCaster(a) && a.mp < dm[a.id].maxMp * 0.2);
    const use = dry && ['mp_s', 'mp_m'].find(k => (e.sup[k] || 0) > 0);
    if (use) {
      addTo(e.sup, use, -1);
      dry.mp = Math.min(dm[dry.id].maxMp, dry.mp + ITEMS[use].mana * (1 + rlv('potion') * 0.25));
      e.mpCd = 2;
      ev(e, 'mana', { d: dry.id, v: ITEMS[use].mana });
    }
  }
}
/* ───────── 쓰러짐: 죽지 않고 들것에 실려 돌아온다 ───────── */
function hurtRoll(f) {
  const r = rnd();
  let sev = r < 0.45 ? 1 : r < 0.86 ? 2 : 3;
  if (f && f.boss && sev < 3 && rnd() < 0.5) sev++;
  return sev;
}
function injure(a, sev) {
  if (a.inj && a.inj.sev >= sev) return;
  a.inj = { sev, need: INJ[sev].need, done: a.inj ? a.inj.done : 0, at: today() };
}
function dropOver(p, e) {
  let over = usedOf(p) - capOf(p);
  if (over <= 0) return;
  const keys = Object.keys(e.bag).sort((x, y) => ITEMS[x].v / ITEMS[x].w - ITEMS[y].v / ITEMS[y].w);
  for (const k of keys) { while (over > 0 && e.bag[k] > 0) { addTo(e.bag, k, -1); over -= ITEMS[k].w; } if (over <= 0) break; }
  e.gbag.sort((x, y) => gearValue(x) - gearValue(y));
  while (over > 0 && e.gbag.length) { const g = e.gbag.shift(); over -= GTYPES[g.base].w; }
  log(`${p.name}은(는) 들것을 싣느라 짐 일부를 버렸다.`);
}
function down(p, e, a, f) {
  a.hp = 0; a.down = true;
  if (e.area === 'arena' || e.area === 'wave') { ev(e, 'down', { d: a.id }); log(`${a.name}이(가) ${e.area === 'wave' ? '성문 앞에' : '모래판에'} 쓰러졌다.`, 'bad'); changed(); return; }   // 투기장·방어전에서는 다치지 않는다
  const sev = hurtRoll(f);
  injure(a, sev);
  S.stats.downs = (S.stats.downs || 0) + 1;
  ev(e, 'down', { d: a.id });
  log(`${a.name}이(가) ${FIELDS[e.field].name}에서 쓰러졌다 (${INJ[sev].name}). 동료들이 들것에 싣는다.`, 'bad');
  HOOKS.toast(`${a.name} 쓰러짐 · ${INJ[sev].name}`);
  dropOver(p, e);
  if (p.safe && e.mode === 'advance') recall(p, 'loss');
  if (p.safe && e.foes.length && !e.flee) e.flee = 2.5;   // 조심스러운 파티는 들것을 메고 싸움에서 빠져나온다
  changed();
}
// 모두 쓰러지면: 길드 구조대가 데려오지만 짐은 잃는다
function wipe(p) {
  const e = p.exp, F = FIELDS[e.field];
  if (e.area === 'arena') { arenaWipe(p); return; }
  if (e.area === 'wave') { waveWipe(p); return; }
  teamOf(p).forEach(a => {
    injure(a, Math.max(2, a.inj ? a.inj.sev : 2));
    if (rnd() < 0.25 && a.inj.sev < 3) injure(a, a.inj.sev + 1);
    a.down = false; a.status = 'idle'; a.hp = 1; a.trips++;
  });
  refillParty(teamOf(p), p.name);   // 상단에서 화살·표창 충전 (쓴 만큼 돈)
  S.stats.wipes = (S.stats.wipes || 0) + 1;
  log(`${p.name}이(가) ${F.name}에서 전멸했다. 길드 구조대가 모두를 데려왔지만 가져오던 짐과 장비는 잃었다.`, 'bad');
  S.flags.firstInj = 1;
  queueModal({ title: `${p.name} 전멸`, body: [`${F.name}에서 원정대가 모두 쓰러졌다. 지나가던 길드 구조대 덕분에 목숨은 건졌지만 모두 크게 다쳤고, 가져오던 부속품과 장비, 물약은 잃었다.`, '다친 모험가는 신전에서 치료해야 다시 원정에 나갈 수 있다. 무리하지 말자.'] });
  p.last = { got: {}, gear: 0, kills: e.kills, field: e.field, wiped: 1 };
  p.exp = null;
  changed();
}
function arrive(p) {
  const e = p.exp;
  if (e.area === 'trade') tradeHome(p, e);   // 교역: 못 판 짐은 창고로, 보고
  const got = Object.assign({}, e.bag), val = vOf(got);
  for (const [k, q] of Object.entries(e.bag)) addTo(S.inv, k, q);
  for (const [k, q] of Object.entries(e.sup)) addTo(S.inv, k, q);
  e.gbag.forEach(g => S.gear.push(g));
  autoFulfill();   // 의뢰품이 다 모였으면 먼저 전달하고, 남는 것을 판다
  autoSellRun(p.name);
  const team = p.members.map(advById).filter(Boolean);
  const hurt = team.filter(a => a.down || a.inj);
  team.forEach(a => { if (!a.down) a.pf = (a.pf || 0) + 1; a.down = false; a.hp = Math.max(1, a.hp); a.status = 'idle'; a.trips++; clampVitals(a); });
  refillParty(team, p.name);   // 상단에서 화살·표창 충전 (쓴 만큼 돈, 판 뒤라 판 돈으로 낸다)
  team.filter(a => a.quit).forEach(a => leave(a, '밀린 봉급 때문에 상단을 떠났다.'));
  const n = Object.values(got).reduce((s, q) => s + q, 0);
  if (e.area === 'arena') log(`${p.name}이(가) 투기장에서 돌아왔다.`);
  else if (e.area === 'wave') log(`${p.name}이(가) 성문에서 돌아왔다.`);
  else log(`${p.name}이(가) 돌아왔다. 부속품 ${n}개(약 ${val}G어치)${e.gbag.length ? `, 장비 ${e.gbag.length}개` : ''}, 처치 ${e.kills}마리.`, 'good');
  if (hurt.length) log(`부상자 ${hurt.map(a => a.name).join(', ')}이(가) ${S.bld.temple ? '신전 치료실로 옮겨졌다' : '여관 방에 눕혀졌다. 신전이 있으면 훨씬 빨리 낫는다'}.`, 'bad');
  if (hurt.length && !S.flags.firstInj) { S.flags.firstInj = 1; queueModal({ title: '첫 부상자', body: STORY.firstInj }); }
  HOOKS.toast(`${p.name} 귀환 · 부속품 ${n}개${e.gbag.length ? ` · 장비 ${e.gbag.length}개` : ''}${hurt.length ? ` · 부상 ${hurt.length}명` : ''}`);
  p.last = { got, gear: e.gbag.length, kills: e.kills, field: e.field, hurt: hurt.length, stats: e.stats || null, names: Object.fromEntries(team.map(a => [a.id, a.name])), area: e.area };
  p.exp = null;
  if (trimParty(p)) log(`${p.name}은(는) 인원이 넘쳐 레벨이 낮은 모험가를 대기로 돌렸다. (짐꾼 계열을 빼고 ${PARTY_FIGHTERS}명까지)`);
  if (!S.flags.firstReturn) { S.flags.firstReturn = 1; queueModal({ title: '첫 원정', body: STORY.firstReturn }); }
  if (typeof achvTick === 'function') achvTick();
  changed();
}
function leave(a, why) {
  const p = partyOf(a.id);
  if (p) p.members = p.members.filter(id => id !== a.id);
  SLOTS.forEach(([s]) => { if (a.eq[s]) { S.gear.push(a.eq[s]); a.eq[s] = null; } });
  S.advs = S.advs.filter(x => x.id !== a.id);
  log(`${a.name}이(가) ${why}`, 'bad');
}
function dungeonClear(p, e) {
  const fs = S.fields[e.field], F = FIELDS[e.field];
  if (F.treasure) { treasureClear(p, e); return; }
  const first = !fs.cleared;
  fs.cleared = true;
  const team = teamOf(p).filter(a => !a.down);
  if (F.raid) {
    S.flags.guildDown = 1;
    S.fame += 50; S.gold += 5000; S.stats.earned += 5000;
    team.forEach(a => { a.pf = (a.pf || 0) + 25; a.dungeons = (a.dungeons || 0) + 1; });
    log(`${p.name}이(가) 암살자 길드장을 쓰러뜨렸다! 길드 금고에서 5,000G, 명성 +50`, 'good');
    queueModal({ title: '암살자 길드 토벌', body: STORY.guild });
  } else if (first) {
    const gold = DUNGEON_GOLD[F.tier] || 3000, fame = 60 + F.tier * 25;
    S.gold += gold; S.fame += fame; S.stats.earned += gold; S.stats.dungeons = (S.stats.dungeons || 0) + 1;
    team.forEach(a => { a.pf = (a.pf || 0) + 20; a.dungeons = (a.dungeons || 0) + 1; });
    // 보물 상자: 전설·영웅 장비와 장비 한 점, 스킬북 두 권, 주인의 혼 둘, 중급 룬 둘. 그리고 유물
    e.gbag.push(makeGear(dropBase(), F.tier, 4), makeGear(dropBase(), F.tier, 3), makeGear(dropBase(), F.tier, Math.max(1, rollQuality(0.4))));
    const b1 = randomBook(F.lv, F.lv + 16), b2 = randomBook(F.lv, F.lv + 20);
    if (b1) addTo(e.bag, b1, 1); if (b2) addTo(e.bag, b2, 1);
    addTo(e.bag, 'soul_' + F.tier, 2);
    addTo(e.bag, runeId(pickOne(RUNE_IDS), 1), 1); addTo(e.bag, runeId(pickOne(RUNE_IDS), 1), 1);
    const RL = RELICS[e.field], newRelic = RL && !(S.relics || []).includes(e.field);
    if (newRelic) (S.relics = S.relics || []).push(e.field);
    log(`${p.name}이(가) ${F.dungeon.name}의 주인 ${MONS[F.dungeon.boss].name}을(를) 쓰러뜨렸다! 보물 ${g$(gold)}, 명성 +${fame}${newRelic ? `, 유물 「${RL.name}」` : ''}`, 'good');
    queueModal({ title: `${F.dungeon.name} 공략`, body: (STORY[e.field] || []).concat([`보물 상자에서 ${g$(gold)}과 전설·영웅 장비, 스킬북, ${ITEMS['soul_' + F.tier].name} 둘, 룬을 찾았다. 명성 +${fame}. 함께 싸운 모험가들의 개인 명성도 크게 올랐다.`], newRelic ? [`유물 「${RL.name}」을(를) 얻었다. ${RL.desc}. 상단 창의 유물에서 볼 수 있다.`] : []) });
    if (e.field === 'barren' && STORY.frontier) queueModal({ title: '북쪽 변경', body: STORY.frontier });   // 빌드 30: 안개 묘지가 열린다
    if (e.field === 'roots' && S.bld.airfield && STORY.skyOpen) queueModal({ title: '구름 위의 섬', body: STORY.skyOpen });
  } else {
    S.fame += 3;
    log(`${p.name}이(가) ${MONS[F.dungeon.boss].name}을(를) 또 쓰러뜨렸다. 명성 +3`, 'good');
  }
  e.mode = 'return'; e.why = 'boss'; e.ei = 0; e.encs = []; e.next = null;
  changed();
}
// 보물 던전의 수호자를 쓰러뜨리면: 큰 돈, 황금 가루, 좋은 장비 하나, 스킬북, 개화석(절반 확률). 몇 번이고 갈 수 있다
function treasureClear(p, e) {
  const L = e.lvo || 10, team = teamOf(p).filter(a => !a.down);
  const gold = Math.round((2500 + L * 220) * (0.9 + rnd() * 0.4) / 10) * 10;
  S.gold += gold; S.stats.earned += gold; S.fame += 6; S.stats.tmaps = (S.stats.tmaps || 0) + 1;
  team.forEach(a => { a.pf = (a.pf || 0) + 6; });
  const got = [g$(gold), '명성 +6'];
  addTo(e.bag, 'gold_dust', 3); got.push('황금 가루 3');
  const g = makeGear(dropBase(), Math.min(GTIERS.length - 1, raidTier(L)), rnd() < 0.3 ? 4 : 3); e.gbag.push(g); got.push(`${QUALITY[g.q].name} ${gearName(g)}`);
  const b = randomBook(Math.max(1, L - 15), L + 10); if (b) { addTo(e.bag, b, 1); got.push(ITEMS[b].name); }
  if (rnd() < 0.5) { addTo(e.bag, 'bloomstone', 1); got.push('개화석'); }
  if (rnd() < 0.1) { addTo(e.bag, 'wizstone', 1); got.push('마법사의 돌'); }
  log(`${p.name}이(가) 보물고의 수호자를 쓰러뜨리고 보물을 챙겼다: ${got.join(', ')}`, 'good');
  queueModal({ title: '보물 던전 공략', body: [`${p.name}이(가) 보물 지도의 끝에서 보물 수호자를 쓰러뜨렸다. 상자 ${(e.chests || 0) + 1}개를 열었다.`, `보상: ${got.join(', ')}.`, '보물 지도는 필드의 우두머리와 주인이 가끔 남긴다. 다음 지도를 찾으면 또 떠날 수 있다.'] });
  e.mode = 'return'; e.why = 'boss'; e.ei = 0; e.encs = []; e.next = null;
  changed();
}
const raidReady = () => S.fame >= GUILD_RAID.fame && living().length >= GUILD_RAID.advs && spn(GUILD_RAID.sponsor) >= GUILD_RAID.tier;
// 필드는 상단 랭크가 오르면 하나씩 열린다 (랭크 F = 평원, E = 원시림 …)
function isUnlocked(fid) {
  if (fid === 'alley') return !S.flags.guildDown && raidReady();
  if (fid === 'sewer') return (S.rank || 0) >= UNDER_RANK;
  const F = FIELDS[fid];
  if (F && F.treasure) return (S.inv.tmap || 0) > 0;   // 보물 지도가 있을 때만
  if (F && F.trade) return kingOpen(F.trade);           // 교역로: 길을 아는 나라
  if (F && F.giant) { const r = raidRec(F.giant); return !!(r && !r.done); }
  if (F && F.region === 'sky') return !!(S.fields[F.after] && S.fields[F.after].cleared && (S.bld.airfield || 0) > 0);   // 구름섬: 세계수 던전 + 비행장
  if (F && F.after) return !!(S.fields[F.after] && S.fields[F.after].cleared);   // 마계·변경: 앞 땅의 던전을 공략하면
  return !!F && !F.raid && (S.rank || 0) >= F.no - 1;
}

/* ───────── 초대형 레이드: 다른 상단·왕국 원정대와 같은 몬스터를 두고 겨룬다 ───────── */
const RAID_FIGHT = 90;      // 한 번 도전하면 이만큼(게임 속 초) 싸우고 물러난다
const RAID_GAP = 10;        // 레이드 레벨보다 이만큼 낮은 파티까지 도전할 수 있다
const raidRec = id => (S && S.raid ? S.raid.list.find(r => r.id === id) : null);
const raidHp = L => Math.round(600 * (25 + 18 * L + 1.15 * L * L) * DIFF.hp / 1000) * 1000;
function giantFoe(id) {
  const R = RAIDS[id], rec = raidRec(id), f = foeFrom(R.mon, R.lv + 4);
  Object.assign(f, { maxHp: rec.max, hp: rec.hp, giant: id, boss: true, aoe: true, name: R.name, atk: f.atk * 0.55, spd: Math.min(f.spd, 0.8) });   // 파티 전체를 자주 치니 한 방은 약하게
  return f;
}
function raidLeave(p, e, why) {
  e.mode = 'return'; e.why = why; e.foes = []; e.next = null; e.wait = null; e.flee = 0; e.left = 1;
  const team = teamOf(p).filter(a => !a.down), xp = Math.round(e.dealt / 20);
  if (e.dealt > 0 && !e.paid) {
    e.paid = 1;
    team.forEach(a => { a.pf = (a.pf || 0) + 3; if (addExp(a, xp)) { ev(e, 'lvl', { d: a.id }); log(`${a.name}이(가) Lv${a.lv}이 되었다.`, 'good'); } });
    log(`${p.name}이(가) ${RAIDS[e.raid].name}에게 ${Math.round(e.dealt).toLocaleString('ko-KR')} 피해를 주고 물러났다.`, 'good');
  }
  changed();
}
function stepRaid(p, e, team, dm, dt, fr) {
  const rec = raidRec(e.raid);
  if (e.foes.length) {
    const f = e.foes[0];
    if (!rec || rec.done) { raidLeave(p, e, 'over'); return; }
    if (e.mode === 'return' && !e.flee) { raidLeave(p, e, e.why || 'order'); return; }   // 복귀 명령
    f.hp = rec.hp;                      // 다른 파티와 경쟁자가 깎은 만큼 반영
    const before = f.hp;
    tire(team, FATIGUE.fight * fr * dt);
    battle(p, e, team, dm, dt);
    if (!p.exp) return;                 // 전멸
    const dealt = Math.max(0, before - Math.max(0, f.hp));
    if (dealt) { rec.hp = Math.max(0, rec.hp - dealt); rec.me += dealt; e.dealt += dealt; }
    if (rec.hp <= 0) { teamOf(p).filter(a => !a.down).forEach(a => { a.bosses = (a.bosses || 0) + 1; a.dungeons = (a.dungeons || 0) + 1; }); S.stats.raids = (S.stats.raids || 0) + 1; S.stats.bosses = (S.stats.bosses || 0) + 1; raidEnd(rec, 'kill'); raidLeave(p, e, 'raid'); return; }
    e.rt += dt;
    if (e.foes.length && e.rt >= RAID_FIGHT) raidLeave(p, e, 'time');
    return;
  }
  if (e.fought && !e.left) { raidLeave(p, e, e.why || 'retreat'); return; }   // 들것을 메고 빠져나왔다
  team.forEach(a => { const d = dm[a.id]; a.hp = Math.min(d.maxHp, a.hp + d.maxHp * 0.008 * dt); a.mp = Math.min(d.maxMp, a.mp + d.maxMp * 0.05 * d.mpRegen * dt); });
  tire(team, FATIGUE.walk * fr * dt);
  const v = moveOf(p) * (e.mode === 'return' ? 1.15 : 1);
  if (e.mode === 'advance') {
    if (!rec || rec.done) { raidLeave(p, e, 'over'); return; }
    e.pos = Math.min(STAGE_LEN * 0.6, e.pos + v * dt);
    if (e.pos >= STAGE_LEN * 0.6) { e.foes = [giantFoe(e.raid)]; e.fought = 1; e.cd = {}; e.buffs = []; e.taunt = null; ev(e, 'spawn', { boss: true, name: RAIDS[e.raid].name }); }
  } else {
    e.pos -= v * dt;
    if (e.pos <= 0) arrive(p);
  }
}
