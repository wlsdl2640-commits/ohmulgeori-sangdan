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
  const g = CLASSES[a.cls].grow;
  for (let i = 0; i < n; i++) for (const [k] of STATS) { const v = g[k], f = Math.floor(v); a.st[k] += f + (rnd() < v - f ? 1 : 0); }
}
function makeAdv(o = {}) {
  const cls = o.cls || pickOne(CLASS_IDS), C = CLASSES[cls], lv = o.lv || 1;
  const a = {
    id: nid(), name: o.name || (pickOne(NAME_A) + pickOne(NAME_B)), cls, lv, exp: 0,
    look: { hair: pickOne(HAIRS), skin: pickOne(SKINS) }, bio: o.bio || pickOne(BIOS[cls] || BIOS[jobBase(cls)]),
    status: 'idle', kills: 0, trips: 0, quit: false, fat: 0, sleep: 0, pf: 0, rank: 0, inj: null, post: null, down: false,
    st: Object.assign({}, C.base), tr: { str: 0, vit: 0, agi: 0, int: 0 },
    eq: { weapon: null, off: null, ammo: null, bcase: null, bolt: null, armor: null, legs: null, gloves: null, boots: null, belt: null, acc: null, ear: null, bag: null }, skills: [C.innate], sm: {}, mast: {}, traits: o.traits || rollTraits(), wxt: o.wxt || rollWxt(),
    salary: 0
  };
  a.salary = o.salary != null ? o.salary : salaryCalc(a);   // 빌드 69: 지금 레벨 · 차수 · 라이선스로 셈하고 Lv10마다 +50% (data-sal69.js)
  growStats(a, lv - 1);
  if (needsArrows(a)) a.eq.ammo = makeGear('arrows', arrowTierOf(lv), 0);   // 화살을 쓰는 직업은 레벨에 맞는 화살을 들고 온다
  if (gearFits(a, { base: 'shield', t: 0 })) { const st = arrowTierOf(lv); a.eq.off = gearFor(shieldOf(a.cls, st), st, 0, lv); }   // 전사·마부 계열은 방패를 들고 온다 (빌드 39 · 빌드 64: 그 단계에 있는 직업 방패)
  const d = derive(a);
  a.hp = d.maxHp; a.mp = d.maxMp;
  return a;
}
// 빌드 64: 각성(용사) · 2차 각성(초월 용사)은 없앴다 — 3차 전직(Lv100)에 주인의 혼을 쓴다 (promote, econ.js)
const soulCount = () => Object.keys(S.inv).filter(k => k.startsWith('soul_')).reduce((n, k) => n + S.inv[k], 0);
function useSouls(n) { for (const k of Object.keys(S.inv).filter(k => k.startsWith('soul_')).sort()) { const t = Math.min(n, S.inv[k]); addTo(S.inv, k, -t); n -= t; if (!n) break; } }
function gearSum(a) {
  const s = {};
  for (const [slot] of SLOTS) { const g = a.eq && a.eq[slot]; if (!g || (isAmmo(g) && ammoLeft(g, a) <= 0) || (slot === 'ammo' && !needsArrows(a))) continue; const gs = gearStats(g); for (const k in gs) s[k] = (s[k] || 0) + gs[k]; }   // 다 쓴 화살·표창은 능력치 없음
  return s;
}
// 빌드 64 룬 개편: 끼운 장비의 룬 가운데 한 능력치만 더한다 (전투 중 상태이상 · 속성 피해에 바로 쓴다 · RUNE_CAP까지)
function runeSum(a, st) {
  let s = 0;
  for (const [slot] of SLOTS) { const g = a.eq && a.eq[slot]; if (!g || !g.runes || !g.runes.length) continue; const side = runeSide(g); for (const id of g.runes) { const R = ITEMS[id] && ITEMS[id].rune, F = R && runeFx(R[0], side); if (F && F.st === st) s += F.v[R[1]]; } }
  return Math.min(RUNE_CAP[st.startsWith('d_') ? 'd' : st] || 9, s);
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
  for (const [k] of STATS) T[k] = Math.max(0, a.st[k] + a.tr[k] + (G[k] || 0));
  let atk = jb === 'archer' ? T.str * 0.5 + T.agi * 0.75 : jb === 'rogue' ? T.str * 0.8 + T.agi * 0.45 : T.str * 1.1;
  atk += L * 0.4 + (G.atk || 0);
  const war = blessed('war') ? 1.15 : 1, earth = blessed('earth'), wind = blessed('wind'), lic = (LICENSE[a.rank || 0] || LICENSE[0]).mul;
  const X = k => traitSum(a, k);   // 타고난 특성
  const MC = msCounts(a);           // 빌드 69: 마석 (효과마다 상한 — data-maseok69.js)
  const crit0 = C.crit + T.agi * 0.0015 + (G.crit || 0) + (P.crit || 0) + X('crit');   // 빌드 69 상한(data-cap69.js): 50%를 넘는 몫의 절반은 치명타 피해로
  return {
    T, atk: atk * war * lic * (1 + (P.atkPct || 0) + X('atkPct')),
    matk: (T.int * 1.2 + L * 0.4 + (G.matk || 0)) * (1 + rlv('power') * 0.1 + (P.matkPct || 0) + X('matkPct')) * war * lic,
    def: (T.vit * 0.35 + L * 0.2 + (G.def || 0)) * (1 + (P.defPct || 0) + rlv('ward') * 0.08 + X('defPct')) * (earth ? 1.1 : 1) * lic,
    maxHp: Math.round((40 + T.vit * 7 + L * 4 + (G.hp || 0)) * (earth ? 1.15 : 1) * lic * (1 + (P.hpPct || 0) + X('hpPct') + relic('hp'))),   // 유물: 세계수의 씨앗·별의 여왕의 왕관
    maxMp: Math.round((8 + T.int * 4 + L + (G.mp || 0)) * (1 + X('mpPct') + (P.mpPct || 0) + Math.min(RUNE_CAP.mpPct, G.mpPct || 0))),   // 마나 룬 (방어구)
    // 빌드 69 상한(11-14 12:18 사용자 「확률이 붙는건 최대치를 50%까지」): 회피는 모두 더해 50% — 민첩 몫은 35%까지(내 제안), 나머지는 장비 · 룬 · 환영의 문스톤 · 특성 · 스킬로
    eva: Math.min(CAP.eva, Math.min(EVA_AGI_MAX, T.agi * 0.004) + (G.eva || 0) + (P.eva || 0) + (wind ? 0.05 : 0) + X('eva') + msVal(MC, 'moon')),
    crit: Math.min(CAP.crit, crit0),
    block: Math.min(CAP.block, (G.block || 0) + (P.block || 0) + X('block') + msVal(MC, 'sapph')),       // 결계의 사파이어
    counter: Math.min(CAP.counter, (G.counter || 0) + (P.counter || 0) + X('counter') + msVal(MC, 'garn')),   // 역류의 가넷
    double: Math.min(CAP.double, (G.double || 0) + (P.double || 0) + X('double')),
    healPow: 1 + X('healPow') + (P.healPow || 0) + Math.min(RUNE_CAP.healPow, G.healPow || 0), rheal: X('rheal') + Math.min(RUNE_CAP.rheal, G.rheal || 0), hpRegen: X('hpRegen') + (P.hpRegen || 0), mpFlat: X('mpFlat'),   // 치유 룬: 무기 주는 회복 · 방어구 받는 회복
    spd: C.spd * (1 + T.agi * 0.004) * (1 + Math.min(CAP.spdPct, (P.spdPct || 0) + X('spdPct') + (G.spdPct || 0))),   // 공격 속도: 기본 공격 대기시간 = BASIC_CD ÷ spd (더하는 % 몫은 +100%까지)
    cdr: Math.min(CDR_MAX, (P.cdr || 0) + X('cdr') + (G.cdr || 0)),                                   // 스킬 재사용 감소 (상한 CDR_MAX 30% — 빌드 69)
    carry: Math.round((C.carry + T.str * 0.4 + (G.carry || 0) + X('carry')) * (1 + (P.carryPct || 0))),
    move: (6 + T.agi * 0.06) * (1 + Math.min(CAP.movePct, (P.movePct || 0) + relic('move') + X('movePct') + (G.movePct || 0))) * (wind ? 1.15 : 1),   // 빌드 69: 더하는 % 몫은 +200%까지
    mpRegen: 1 + (P.mpRegen || 0) + rlv('mana') * 0.3 + Math.min(RUNE_CAP.mpRegen, G.mpRegen || 0),   // 영민 룬(방어구) · 마나 룬(무기)
    // 빌드 64 룬 개편: 명중(몬스터 회피 −%p) · 기본 공격 방어 · 행동 방해 시간 − · 기본 공격 눈멂 · 눈멂 저항 · 흡혈 (속성 피해 d_*는 runeSum으로 hitFoe에서)
    hit: Math.min(RUNE_CAP.hit, G.hit || 0), bblock: Math.min(RUNE_CAP.bblock, G.bblock || 0), ccRes: Math.min(RUNE_CAP.ccRes, G.ccRes || 0),
    blindHit: Math.min(RUNE_CAP.blindHit, G.blindHit || 0), blindRes: Math.min(RUNE_CAP.blindRes, G.blindRes || 0), lifesteal: Math.min(RUNE_CAP.lifesteal, G.lifesteal || 0),
    mExec: P.exec || 0, mStun: P.stun || 0, mBuff: P.buffDur || 0,   // 숙련: 처형 피해 · 기본 공격 기절 · 강화 지속
    mres: Math.min(FIGHT.mresMax, mresJob(a) + (G.mres || 0) + (P.mres || 0) + X('mres')),   // 마법 저항 (빌드 63): 마법 피해 −%
    res: resOf(G, P, X),                                                                   // 속성 저항: { 불 계열: 0.1, … }
    critDmg: Math.min(CAP.critDmg, (P.critDmg || 0) + Math.max(0, crit0 - CAP.crit) * CRIT_OVER), critOver: Math.max(0, crit0 - CAP.crit), firstCrit: P.firstCrit || 0, thrownPct: P.thrownPct || 0, petDmg: P.petDmg || 0, pBuff: P.pbuffDur || 0,   // 빌드 65 직업 개편: 치명 피해 · 첫 공격 치명 · 암기 피해 · 탈것 피해 · 파티 강화 지속
    baImm: P.baImm || 0, subst: P.subst || 0,                                              // 기본 공격 면역 · 쓰러질 한 방을 한 번 피함 (개편 직업용)
    // 빌드 69 마석: 받는 피해 − (다이아몬드) · 반사 (오팔) · 싸움 시작 보호막 (아쿠아마린) · 버티기 (호박) · 노려질 확률 − (흑요석)
    msDmg: msVal(MC, 'dia'), msRefl: msVal(MC, 'opal'), msShield: msVal(MC, 'aqua'), msEnd: msVal(MC, 'amber'), msHide: msVal(MC, 'obsid'),
    // 빌드 65 새 숙련 (data-mast65.js): 느림 · 출혈 · 훔치는 돈 · 암기 한 번 더 · 연계 한도 · 둘째 칼 · 보호막 세기 · 볼트 · 탈것 한 번 더 · 정령 스킬 · 지속 피해 · 마법 흡수
    mSlow: P.slowHit || 0, mBleed: P.bleedHit || 0, steal: P.stealPct || 0, thrown2: P.thrownTwice || 0, comboMax: P.comboMax || 0, offDmg: P.offDmg || 0, shieldPow: P.shieldPow || 0,
    boltPct: P.boltPct || 0, boltPen: P.boltPierce || 0, bolt2: P.boltTwice || 0, pet2: P.petTwice || 0, spiritPct: P.spiritPct || 0, dotPct: P.dotPct || 0, mDrain: P.mdrain || 0
  };
}
function resOf(G, P, X) { const r = {}; for (const f of RES_FAMS) { const k = 'r_' + f, v = (G[k] || 0) + (P[k] || 0) + X(k); if (v > 0) r[f] = Math.min(FIGHT.resMax, v); } return r; }
function clampVitals(a) { const d = derive(a); a.hp = Math.min(a.hp, d.maxHp); a.mp = Math.min(a.mp == null ? d.maxMp : a.mp, d.maxMp); }
function addExp(a, n) {
  const cap = lvCap(a);   // 빌드 69: 누구나 Lv200
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
  if (up) salaryNew(a);   // 빌드 69: 봉급은 레벨을 따라 오른다
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
// 빌드 65 (사용자 11-11 00:34 「마차는 마부 계열 전용 · 그냥 짐꾼은 손수레뿐 · 짐꾼 계열 장비 칸에 마차 칸 · 캐러밴마스터는 마차 칸 둘」):
// 말이 끄는 마차는 마부 계열(마부 · 코네스토가 · 캐러밴 마스터)이 몬다. 둘째 마차 p.wagon2 · p.horse2 · p.wagonPlus2는 캐러밴 마스터가 있을 때만 —
// 첫째 마차와 같은 셈을 쓰려고 파티처럼 보이는 그림자 객체 rig2(p)로 넘긴다(r2 표시)
const coachLine = a => !!a && !a.down && chainOf(a.cls).includes('coachman');
const coachLineOf = p => teamOf(p).find(coachLine) || null;
const caravanOf = p => teamOf(p).find(a => !a.down && chainOf(a.cls).includes('caravanmaster')) || null;
const rig2 = p => (p && !p.r2 ? { id: p.id, name: p.name, members: p.members, exp: p.exp, wagon: p.wagon2 || null, horse: p.horse2 || null, wagonPlus: p.wagonPlus2 || 0, r2: 1 } : null);
function wagonWhy(p) {
  const w = wagonOwned(p); if (!w || !w.horse) return '';
  if (p.r2 && !caravanOf(p)) return '둘째 마차는 캐러밴 마스터가 있어야 몰아요';
  if (!coachLineOf(p)) return '말이 끄는 마차는 마부 계열(마부 · 코네스토가 · 캐러밴 마스터)이 몰아요';
  const h = horseOf(p);
  if (!h) return p.horse && p.horse.startsWith('p:') ? '맨 펫이 없거나 아직 다 자라지 않았어요' : w.horse === 'fly' ? '마구간에서 그리핀·와이번·페가수스(다 자란 펫)를 매어야 해요' : w.horse === 'goat' ? '마구간에서 고산지대 산양(다 자란 펫)을 매어야 해요' : '마구간에서 말을 매어야 해요';
  if (w.horse === 'goat' && !h.steel) return '고산지대 산양이 끌어야 해요';
  if (w.horse === 'fly' && !h.fly) return '그리핀·와이번·페가수스가 끌어야 해요';
  return '';
}
const wagonOf = p => { const w = wagonOwned(p); return w && !wagonWhy(p) ? w : null; };
const wagonPlus = p => Math.max(0, Math.min(WAGON_PLUS_MAX, p.wagonPlus || 0));
const rigCap = p => { const w = wagonOf(p); if (!w) return 0; const c = coachOf(p), h = horseOf(p); return Math.round(w.cap * (h ? h.cap : 1) * (1 + wagonPlus(p) * WAGON_PLUS.cap) * (1 + (c ? TR(c).wagon || 0 : 0)) * (1 + (c ? passives(c).wagonCap || 0 : 0)) * (w.fly && (S.bld.airfield || 0) >= 2 ? 1.2 : 1)); };   // 마차 몰기 숙련
const rigSpd = p => { const w = wagonOf(p); if (!w) return 1; const c = coachOf(p), h = horseOf(p); return w.spd * (h ? h.spd : 1) * (1 + wagonPlus(p) * WAGON_PLUS.spd) * (1 + (c ? TR(c).wagonSpd || 0 : 0)) * (1 + (c ? passives(c).wagonSpd || 0 : 0)); };   // 마차 몰기 숙련
// 둘째 마차가 함께 가는가: 첫째 마차가 굴러가고 · 캐러밴 마스터 · 맨 말이 맞고 · 하늘로 가면 둘째도 날아야 한다
const rig2Live = p => { const q = rig2(p); if (!q || !q.wagon || !wagonOf(p) || !wagonOf(q)) return null; const F = p.exp && FIELDS[p.exp.field]; return F && F.region === 'sky' && !wagonFly(q) ? null : q; };
const wagonCap = p => { const q = rig2Live(p); return rigCap(p) + (q ? rigCap(q) : 0); };   // 둘째 마차는 짐을 더 싣고
const wagonSpd = p => { const q = rig2Live(p); return q ? Math.min(rigSpd(p), rigSpd(q)) : rigSpd(p); };   // 행렬은 느린 마차에 맞춘다
const wagonFly = p => { const w = wagonOf(p), h = horseOf(p); return !!(w && w.fly && h && h.fly); };
// 마차 이름: 비행 마차에 그리핀을 매면 그리핀 마차
function rigName(p) { const w = wagonOwned(p); if (!w) return ''; const h = horseOf(p); return (w.fly && h && h.fly ? `${h.name} 마차` : w.name) + (wagonPlus(p) ? ` +${wagonPlus(p)}` : ''); }
const rig2Name = p => { const q = rig2(p); return q && q.wagon ? rigName(q) : ''; };
// 정찰가: 파티 이동 속도와 텐트(야영 피로 회복 배율)
const scoutMove = p => Math.max(0, ...teamOf(p).filter(a => !a.down).map(a => TR(a).scout || 0));
const tentOf = p => Math.max(1, ...teamOf(p).filter(a => !a.down).map(a => TR(a).tent || 1));
// 쓰러진 동료는 짐을 못 들고, 들것이 자리를 차지한다
function capOf(p) { const all = teamOf(p), st = all.filter(a => !a.down); return Math.max(0, Math.round((st.reduce((s, a) => s + derive(a).carry, 0) + wagonCap(p)) * (1 + rlv('carry') * 0.1)) - (all.length - st.length) * STRETCHER); }
function usedOf(p) { return p.exp ? wOf(p.exp.bag) + wOf(p.exp.sup) + gW(p.exp.gbag) + wOf(p.exp.cargo || {}) : wOf(p.sup); }
// 파티 이동속도 = 가장 빠른(민첩한) 모험가의 속도 × 피로 × 마차
function moveOf(p) { const all = teamOf(p), st = all.filter(a => !a.down), ch = p.exp && p.exp.sta && st.some(a => p.exp.sta[a.id] && p.exp.sta[a.id].chill) ? 0.7 : 1; if (!st.length) return 4 * WALK_MUL; return WALK_MUL * ch * Math.max(4, ...st.map(a => derive(a).move * fatMul(a.fat || 0))) * wagonSpd(p) * (1 + scoutMove(p)) * (st.length < all.length ? 0.8 : 1) * (1 + petHome('move')); }
const tire = (team, v) => team.forEach(a => { a.fat = Math.max(0, Math.min(100, (a.fat || 0) + v * (v > 0 ? 1 - traitSum(a, 'fatigue') : 1))); });
function addTo(bag, k, q) { bag[k] = (bag[k] || 0) + q; if (bag[k] <= 0) delete bag[k]; }

/* ───────── 장비 만들기 ───────── */
// 품질: 일반·고급·희귀는 무작위, 보스에게서는 가끔 영웅. 전설 이상은 보스 부속품으로 만들거나 던전·레이드 보상
function rollQuality(boost = 0) {   // 대장간에서 만들 때만 (드랍은 빌드 63 다섯째 묶음부터 rollGrade)
  const r = rnd(), dw = spn('dwarves'), hero = boost >= 0.2 ? 0.01 + boost * 0.08 : 0;
  const rare = 0.05 + boost * 0.5 + (dw >= 3 ? 0.06 : 0), fine = 0.25 + boost + (dw >= 2 ? 0.08 : 0);
  return r < hero ? 3 : r < hero + rare ? 2 : r < hero + rare + fine ? 1 : 0;
}
// 드랍 장비의 레어도 (빌드 63 다섯째 묶음): 모든 레어도가 나오지만 영웅부터는 아주 드물고, 전설부터는 GRADE_DROP.tier 단계 땅에서만. kind = 0 보통 · fb · boss · chest · raid
function rollGrade(tier, kind) {
  const D = GRADE_DROP, b = D.lo[kind] || 0, hm = D.hi[kind] || 1, dw = spn('dwarves'), T = tier || 0;
  const p = [0, D.p[1] + b + (dw >= 2 ? 0.08 : 0), D.p[2] + b * 0.5 + (dw >= 3 ? 0.06 : 0)];
  for (let g = 3; g <= GRADE_MAX; g++) p[g] = T >= D.tier[g] ? D.p[g] * hm : 0;
  let r = rnd();
  for (let g = GRADE_MAX; g >= 1; g--) { if (r < p[g]) return g; r -= p[g]; }
  return 0;
}
// 희귀 이상은 보너스 능력치가 붙는다 (등급이 높을수록 여러 개, 더 크게)
const BONUS_Q = [null, null, [1, 0.6], [1, 1.0], [2, 1.0], [2, 1.4], [3, 1.6], [3, 1.9], [4, 2.2]];
function rollBonus(t, q) {
  const B = BONUS_Q[q]; if (!B) return null;
  const bonus = {}, ks = STAT_KEYS.slice().sort(() => rnd() - 0.5).slice(0, B[0]);
  ks.forEach(k => { bonus[k] = Math.max(1, Math.round(B[1] * GTIERS[t].p * (0.8 + rnd() * 0.5))); });   // 같은 등급이라도 조금씩 다르다
  return bonus;
}
// 빌드 67: 누군가에게 주는 장비(처음 장비 · 전직 · 옛 저장 바꾸기) — 2차 직업 장비는 그 사람이 낄 수 있는 착용 레벨로 (떨어지는 것은 makeGear가 그 단계에서 무작위)
function gearFor(base, t, q, lv) { return makeGear(base, t, q, LADDER_B[base] ? ladderFor(lv, t) : 0); }
function makeGear(base, t, q, lv) {
  const g = { id: nid(), base, t, q: q || 0, bonus: null, runes: [] };
  if (LADDER_B[base]) { g.lv = lv && ARM_LADDER.includes(lv) ? lv : ladderPick(t); g.t = lvTier(g.lv); }   // 빌드 67: 2차 직업 방어구는 착용 레벨(그림) — 떨어지면 그 단계 레벨 대에서 하나
  g.bonus = rollBonus(g.t, g.q);
  return g;
}
// 빌드 63: 보물 상자 · 던전 공략 상자의 스킬북은 스킬북 단계(찢어진 · 낡은 · 빛바랜 · 신비한 …)로 — 레벨 구간의 가운데로 고른다 (data-store.js)
function randomBook(lo, hi, boss) { return tierBookForLv(Math.round((lo + hi) / 2), boss); }

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
  const m = MONS[id], U = m.giant ? null : monMul69(lv), hp = Math.round(mHp(m, lv) * DIFF.hp * (U ? U.hp : 1));   // 빌드 69: 레벨마다 몬스터 능력치 배율 (data-monup69.js — 레이드 거인은 RAID69)
  if (S && S.advs) dexSeen(id);   // 도감: 만난 몬스터
  return { uid: nid(), id, lv, hp, maxHp: hp, atk: mAtk(m, lv) * DIFF.atk * (U ? U.atk : 1), def: mDef(m, lv) * (U ? U.def : 1), spd: m.spd, eva: m.eva || 0, cd: 0.6 + rnd() * 0.8, boss: !!m.boss, dot: null, dotT: 0, slow: 0 };
}
// 희귀종: 아주 가끔 반짝이는 개체. 체력·공격·방어·회피가 높고 경험치가 많다 (data-sky.js RARE)
function makeRare(f) {
  f.rare = 1; f.name = RARE.name + MONS[f.id].name;
  f.hp = f.maxHp = Math.round(f.maxHp * RARE.hp); f.atk *= RARE.atk; f.def *= RARE.def; f.eva = Math.min(CAP.rareEva, (f.eva || 0) + RARE.eva);
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
  if (dboss) { out.push(foeFrom(A.boss, F.treasure ? (e.lvo || 10) + 2 : F.raid ? F.lv + 14 : dungeonBossLv(F))); if (A.guards) A.guards.forEach(id => out.push(foeFrom(id, lv + 2))); else out.push(foeFrom(pickOne(pool), lv)); }   // guards (빌드 51): 주인 곁을 지키는 정해진 호위 (암살자 길드 두목 + 간부 둘)
  else if (fboss) { out.push(fieldBoss(F, e.stage, lv)); for (let i = 0; i < (e.stage >= 30 ? 2 : 1); i++) out.push(foeFrom(pickOne(pool), lv)); }
  else {
    const nest = e.area === 'field' && e.mode === 'advance' ? nestAt(e.field) : null;
    let n = e.mode === 'return' ? 1 : 1 + ri(0, Math.min(2, Math.floor(e.stage / 5))) + (e.area === 'dungeon' ? 1 : 0) + (lv >= PACK.lv && !F.treasure ? PACK.add : 0);   // 빌드 69: Lv100 넘는 땅은 +1
    n = Math.min(5, n + nightMore(e) * (F.frontier && e.field === 'grave' ? 2 : 1) + extra + (nest ? NEST.extra : 0));
    for (let i = 0; i < n; i++) { const f = foeFrom(pickOne(pool), lv); if (nest && rnd() < NEST.p) makeNestFoe(f); out.push(f); }
  }
  // 희귀종: 우두머리·주인·던전 주인이 아닌 몬스터 하나가 아주 가끔 반짝인다
  if (!e.pvp && !F.giant) { const rp = RARE.p * (1 + (foodFx(e).rare || 0)); for (const f of out) if (!f.boss && !f.fb && !f.nest && rnd() < rp) { makeRare(f); break; } }   // 희귀종 미끼
  return out;
}
function spawn(p, e) {
  e.foes = e.next || rollFoes(e, e.ei - 1);
  e.next = null;
  e.cd = {}; e.buffs = []; e.taunt = null; e.hpW = null; e.noDmg = 0; e.subst = null; e.fc = null;
  const fb = e.foes.find(f => f.fb), rare = e.foes.find(f => f.rare);
  ev(e, 'spawn', { boss: e.foes.some(f => f.boss), name: fb ? fb.name : '', rare: rare ? 1 : 0 });
  if (rare) { log(`${p.name} 앞에 ${rare.name}이(가) 나타났다! 희귀종이다.`, 'good'); HOOKS.toast(`희귀종 출현 · ${rare.name}`); }
}
function ev(e, type, data) {
  if (e.ev) { e.ev.push(Object.assign({ n: ++e.evN, type }, data)); if (e.ev.length > 50) e.ev.shift(); }
  if (type === 'spawn') msSpawn(e);   // 빌드 69 마석: 싸움이 시작될 때
  if (type === 'fheal' && data && data.v > 0) e.fheal = (e.fheal || 0) + data.v;   // 빌드 69: 몬스터가 회복한 몫 (battle의 「공격이 통하지 않는다」 판정이 뺀다)
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
// 대형 (빌드 69, 11-13 21:22 사용자 「근접 맨 앞 셋까지 · 가운데 원거리 · 그 뒤 힐러 · 버퍼 · 짐꾼은 늘 맨 뒤」 · 11-14 00:42 「넣어」):
//   0 근접 · 1 원거리 · 마법(탈것 직업도) · 2 힐러(act heal) · 3 짐꾼 계열 모두(음유시인 · 정찰가 · 마부 …). C.row는 이제 안 본다. 그리는 자리는 view.js formSlots
const formRank = c => { const C = CLASSES[c]; if (!C) return 2; if (jobBase(c) === 'porter') return 3; if (C.act === 'heal') return 2; return C.act === 'melee' ? 0 : 1; };
function formParty(p) { p.members = p.members.map((id, i) => [id, i]).sort((x, y) => { const a = advById(x[0]), b = advById(y[0]); return (a ? formRank(a.cls) : 2) - (b ? formRank(b.cls) : 2) || x[1] - y[1]; }).map(x => x[0]); }
function startExp(p, fid, o = {}) {   // o.grp · o.grpi: 레이드 원정대(빌드 69 — 레이드는 qol.js raidLaunch로 파티 넷 이상이 함께만)
  const team = p.members.map(advById).filter(a => a && a.status === 'idle');
  if (!team.length || team.length !== p.members.length) return '대기 중인 모험가만 보낼 수 있어요.';
  if (!isUnlocked(fid)) return FIELDS[fid] && FIELDS[fid].giant ? '이번 달에는 열리지 않은 레이드예요.' : '아직 갈 수 없는 곳이에요.';
  const why = team.map(cantGo).find(Boolean);
  if (why) return why + '.';
  const GR = FIELDS[fid].giant && RAIDS[FIELDS[fid].giant];
  if (GR && avgLvOf(p) < GR.lv - RAID_GAP) return `${GR.name} 레이드는 파티 평균 Lv${GR.lv - RAID_GAP} 이상이어야 도전할 수 있어요.`;
  if (GR && !o.grp) return `레이드는 원정대 창의 「레이드」 탭에서 전투원 넷이 다 찬 파티 ${RAID_MIN_PARTIES}개 이상을 골라 함께 보내요.`;
  if (GR && fightersOf(p).length < PARTY_FIGHTERS) return `레이드에는 전투원 ${PARTY_FIGHTERS}명이 다 찬 파티만 나가요. (지금 ${fightersOf(p).length}명)`;
  if (GR && GR.sky && !S.bld.airfield) return `${GR.name}은(는) 구름섬 하늘에 있어요. 비행장이 있어야 레이드 비행선이 파티를 태워 가요.`;
  const pw = partyWhy(p); if (pw) return pw;
  if (FIELDS[fid].trade) { const tw = tradeWhy(p); if (tw) return tw; if (!Object.keys(tradeCargoPlan(p, FIELDS[fid].trade).cargo).length) return `${KINGDOMS[FIELDS[fid].trade].name}이(가) 원하는 물건이 창고에 없어요.`; }
  if (FIELDS[fid].region === 'sky' && !wagonFly(p)) return `${FIELDS[fid].name}은(는) 비행 마차에 그리핀·와이번·페가수스를 맨 파티만 갈 수 있어요.`;
  if (FIELDS[fid].treasure && (S.inv.tmap || 0) < 1) return '보물 지도가 없어요.';
  const sup = {};
  if (p.autoBuy) for (const [k, q] of Object.entries(p.sup)) { const short = q - (S.inv[k] || 0); if (short > 0 && ITEMS[k] && ITEMS[k].buy) { const cost = buyPrice(k) * short; if (S.gold >= cost) { S.gold -= cost; S.stats.spent = (S.stats.spent || 0) + cost; addTo(S.inv, k, short); log(`${p.name} 출발 전에 ${ITEMS[k].name} ${short}개를 ${g$(cost)}에 사 두었다.`); } } }
  for (const [k, q] of Object.entries(p.sup)) { const take = Math.min(S.inv[k] || 0, q); if (take > 0) { sup[k] = take; addTo(S.inv, k, -take); } }
  team.forEach(a => { const b = pickArrows(a, fid); if (b) log(`${a.name}이(가) ${FIELDS[fid].name}에 맞춰 ${GTYPES[b].name}을(를) 챙겼다.`); });   // 속성 화살 고르기 (빌드 39)
  formParty(p);
  p.exp = newExp(fid, sup, checkpoints(fid).includes(p.start) ? p.start : 1);
  if (o.grp) { p.exp.grp = o.grp; p.exp.grpi = o.grpi || 0; }   // 빌드 69: 레이드 원정대 묶음 (함께 걷고 · 레이드 원정대 창에 함께 나온다)
  p.exp.food = packFood(p);   // 도시락
  boostStart(p.exp);   // 빌드 63: 상단 전용 원정 휴대품 (나침반 · 은화 · 부적 · 미끼 · 깃발 · 월계관 · 이슬 · 방울)
  if (FIELDS[fid].trade) tradeSetup(p, p.exp);
  if (FIELDS[fid].treasure) { addTo(S.inv, 'tmap', -1); p.exp.lvo = Math.max(8, Math.min(MAX_LV, Math.round(avgLvOf(p)))); p.exp.chests = 0; }
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
  const pv = teamOf(p).filter(a => !a.down).map(a => passives(a)), pmax = k => Math.max(0, ...pv.map(P => P[k] || 0));   // 개척민의 지혜(빌드 69): 야영 회복 · 밤습격 · 숙면 피로
  e.camp = { t: 0, night: isNight(), cp: pmax('camp'), cs: pmax('campSleep'), tent: tent > 1 ? tent : 0, amb: isNight() && e.area === 'field' && rnd() < (blessed('moon') ? 0.11 : 0.22) * (tent > 1 ? 0.5 : 1) * (1 - Math.min(0.9, pmax('campAmb'))) ? 4 + rnd() * 10 : 0 };
  ev(e, 'camp', { tent: e.camp.tent ? 1 : 0 });
}
function stepCamp(p, e, team, dm, dt) {
  const c = e.camp;
  c.t += dt;
  const tm = (c.tent || 1) * (1 + (c.cp || 0));   // 텐트: 피로 회복 1.5~2배, HP 회복 1.25배 · 개척민의 지혜(코네스토가): 야영 회복 +20%
  c.wxf = campWxF(p, wxNow(e));   // 날씨: 노숙이면 비·강풍·추위·더위에 회복이 줄어든다 (텐트가 막는다)
  team.forEach(a => { const d = dm[a.id]; a.fat = Math.max(0, (a.fat || 0) - FATIGUE.sleep * tm * c.wxf * dt); a.hp = Math.min(d.maxHp, a.hp + d.maxHp * 0.02 * (tm > 1 ? 1.25 : 1) * dt); a.mp = Math.min(d.maxMp, a.mp + d.maxMp * 0.05 * d.mpRegen * dt); });
  if (c.cs) teamOf(p).forEach(a => { a.sleep = Math.max(0, (a.sleep || 0) - c.cs * dt); });   // 개척민의 지혜(빌드 69): 웨건에서 자면 숙면 피로도 풀린다
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
  team.forEach(a => { const d = derive(a), m = fatMul(a.fat || 0); if (m < 1) { d.atk *= m; d.matk *= m; d.def *= m; } const st = e.sta[a.id]; if (st && st.weak) { d.atk *= 0.8; d.matk *= 0.8; d.def *= 0.8; } staMods(d, st); if (d.hpRegen && !(st && st.curse)) a.hp = Math.min(d.maxHp, a.hp + d.maxHp * d.hpRegen * dt); dm[a.id] = d; });   // 공포 · 부식 · 석화 (빌드 63) · 저주면 재생이 멈춘다
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
function treasureChest(p, e, more) {
  const L = e.lvo || 10, gold = Math.round((400 + L * 60) * (0.8 + rnd() * 0.5) * chestMul(p) / 10) * 10;
  S.gold += gold; S.stats.earned += gold; e.chests = (e.chests || 0) + 1;
  const got = [g$(gold)];
  addTo(e.bag, 'gold_dust', 1); got.push('황금 가루');
  if (rnd() < GEAR_DROP.chest) { const t = Math.min(GTIERS.length - 1, raidTier(L)), g = makeGear(dropBase(t), t, Math.max(1, rollGrade(t, 'chest'))); e.gbag.push(g); got.push(`${QUALITY[g.q].name} 장비`); }
  if (rnd() < 0.3) { const b = randomBook(Math.max(1, L - 20), L + 5); if (b) { addTo(e.bag, b, 1); got.push(ITEMS[b].name); } }
  ev(e, 'chest', {});
  log(`${p.name}이(가) 보물고 ${e.stage}층의 ${more ? '숨은 상자를 하나 더 찾아' : '상자를'} 열었다: ${got.join(', ')}`, 'good');
  const ex = more ? 0 : Math.max(0, ...teamOf(p).filter(a => !a.down).map(a => passives(a).chestExtra || 0));   // 따개 솜씨: 상자 하나 더
  if (ex && rnd() < ex) treasureChest(p, e, true);
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
// 모험가에게 건다 (특성 저항 반영 · 빌드 63: 맹독 · 부식은 쌓이고, 행동 방해는 냉정함 · 탱커 저항 · 도시락으로 짧아진다)
function inflictAdv(e, a, o, atk) {
  const k = o.k; if (!STATUS[k]) return;
  e.sta = e.sta || {};
  const st = e.sta[a.id] || (e.sta[a.id] = {}), ff = foodFx(e).sta || 0;
  if (DOT_STA.includes(k)) {
    const res = Math.min(CAP.dotRes, (k === 'burn' ? traitSum(a, 'resBurn') : traitSum(a, 'resPoison')) + ff);   // 빌드 69: 90% → 60%
    const dps = Math.max(1, Math.round((atk || 10) * (o.m || 0.25) * (1 - res))), t = o.d || 8;
    if (STACK_STA[k]) { const v = st[k]; if (v) { v.n = Math.min(STACK_STA[k], (v.n || 1) + 1); v.dps = Math.max(v.dps, dps); v.t = Math.max(v.t, t); } else st[k] = { t, dps, acc: 0, n: 1 }; }   // 맹독: 쌓일수록 세진다
    else { if (st[k] && st[k].dps >= dps) { st[k].t = Math.max(st[k].t, t); return; } st[k] = { t, dps, acc: 0 }; }
  } else if (STACK_STA[k]) { const c = st[k], t = (o.d || 10) * (1 - ff); if (c) { c.n = Math.min(STACK_STA[k], (c.n || 1) + 1); c.t = Math.max(c.t, t); } else st[k] = { t, n: 1 }; }   // 부식
  else if (CC_IDS.includes(k)) {
    const cut = Math.min(CAP.ccRes, traitSum(a, 'resCc') + (TR(a).ccRes || 0) + runeSum(a, 'ccRes') + (k === 'freeze' ? traitSum(a, 'resFreeze') : 0) + ff);   // 시간 룬 (방어구) · 빌드 69: 냉정함 · 탱커 · 룬 · 도시락을 모두 더해 60%까지 (예전엔 더하면 면역)
    const d = (o.d || 3) * (1 - cut); if (d <= 0.2) return;
    st[k] = Math.max(st[k] || 0, d);
    if (k === 'para' || k === 'charm' || HARD_CC.includes(k)) comboBreak(e, a.id);   // 기절 · 마비 · 수면 · 빙결 · 석화 · 매혹이면 연계가 끊긴다
  } else {   // 쇠약 · 눈멂 · 저주
    if (k === 'blind' && rnd() < runeSum(a, 'blindRes')) { ev(e, 'resist', { d: a.id, k }); return; }   // 섬광 룬 (방어구): 눈멂에 안 걸림
    const d = (o.d || 8) * (1 - ff); if (d <= 0.2) return; st[k] = Math.max(st[k] || 0, d);
  }
  ev(e, 'sta', { d: a.id, k, side: 'a' });
}
// 몬스터 속성에 따라 걸리지 않는 상태이상: 불 계열은 화상, 물·빙결 계열은 냉기 · 빙결, 번개는 감전, 흙은 석화, 강철은 중독 · 맹독 · 출혈
const STA_EL = { burn: 'fire', chill: 'ice', freeze: 'ice', shock: 'thunder', petrify: 'earth', poison: 'none', venom: 'none', bleed: 'none' };
function inflictFoe(e, f, o, atk, by, sid) {
  const k = o.k; if (!STATUS[k]) return;
  if (STA_EL[k] && elemBase(STA_EL[k], f) === 0) return;
  if (staTypeImm(k, f)) return;                                  // 언데드 · 골렘 · 원소: 중독 · 맹독 · 출혈 면역
  if ((k === 'charm' || k === 'confuse') && f.boss) return;      // 우두머리는 홀리지 않는다
  const st = f.sta || (f.sta = {});
  if (DOT_STA.includes(k)) {
    const dps = Math.max(1, Math.round((atk || 10) * (o.m || 0.25))), t = (o.d || 8) * (k === 'burn' && monTypes(f.id).includes('plant') ? 1.5 : 1);   // 식물은 화상이 오래 간다
    if (STACK_STA[k]) { const v = st[k]; if (v) { v.n = Math.min(STACK_STA[k], (v.n || 1) + 1); v.dps = Math.max(v.dps, dps); v.t = Math.max(v.t, t); v.by = by || v.by; v.sid = sid || v.sid; } else st[k] = { t, dps, acc: 0, n: 1, by: by || 0, sid: sid || 'dot' }; }
    else { if (st[k] && st[k].dps >= dps) { st[k].t = Math.max(st[k].t, t); return; } st[k] = { t, dps, acc: 0, by: by || 0, sid: sid || 'dot' }; }
  } else if (STACK_STA[k]) { const c = st[k], t = o.d || 10; if (c) { c.n = Math.min(STACK_STA[k], (c.n || 1) + 1); c.t = Math.max(c.t, t); } else st[k] = { t, n: 1 }; }
  else {
    let d = (o.d || 3) * (f.boss && k !== 'mark' ? 0.5 : 1);   // 표식은 보스에게도 온전히
    if (f.boss && !f.pvp && CC_DR.ks.includes(k)) {   // 빌드 69: 우두머리 행동 방해 저항 (창 안에서 다시 걸면 반씩, max번 넘으면 저항)
      const n = f.ccdrT > 0 ? (f.ccdrN || 0) + 1 : 1;
      if (n > CC_DR.max) { ev(e, 'sta', { d: f.uid, k, side: 'f', res: 1 }); return; }
      f.ccdrN = n; f.ccdrT = CC_DR.win; d *= Math.pow(CC_DR.mul, n - 1);
    }
    st[k] = Math.max(st[k] || 0, d);
  }
  ev(e, 'sta', { d: f.uid, k, side: 'f' });
}
function cureSta(e, a, ks) {
  const st = e.sta && e.sta[a.id]; if (!st) return;
  let any = false;
  for (const k of ks) if (st[k]) { delete st[k]; any = true; }
  if (any) ev(e, 'cure', { d: a.id });
}
// 수면 · 매혹 · 혼란: 맞으면 풀린다 (지속 피해로는 안 풀린다)
function wakeOnHit(e, st, id, side) { for (const k of ['sleep', 'charm', 'confuse']) if (st[k]) { delete st[k]; ev(e, 'stoff', { d: id, k, side }); } }
// 상태이상 시간 줄이기: 숫자는 남은 초, 부식은 { t, n }
function staTimers(st, dt) {
  if (st.corrode) { st.corrode.t -= dt; if (st.corrode.t <= 0) delete st.corrode; }
  for (const k in st) if (typeof st[k] === 'number') { st[k] -= dt; if (st[k] <= 0) delete st[k]; }
}
// 모험가 상태이상 틱: 독 · 맹독 · 화상 · 출혈 피해, 시간 줄이기
function tickSta(p, e, team, dm, dt) {
  for (const a of team) {
    const st = e.sta[a.id]; if (!st) continue;
    for (const k of DOT_STA) {
      const o = st[k]; if (!o) continue;
      o.t -= dt; o.acc += dt;
      if (o.acc >= 1) { o.acc -= 1; const v = Math.max(1, Math.round(o.dps * (o.n || 1) * (0.9 + rnd() * 0.2))); a.hp -= v; ev(e, 'hurt', { s: 0, d: a.id, v, k, dot: 1 }); if (a.hp <= 0) { down(p, e, a, { boss: false }); if (!p.exp) return; break; } }
      if (o.t <= 0) delete st[k];
    }
    staTimers(st, dt);
    if (!Object.keys(st).length) delete e.sta[a.id];
  }
}
function tickFoeSta(e, f, dt) {
  const st = f.sta; if (!st) return;
  for (const k of DOT_STA) {
    const o = st[k]; if (!o) continue;
    o.t -= dt; o.acc += dt;
    if (o.acc >= 1) { o.acc -= 1; const v = Math.max(1, Math.round(o.dps * (o.n || 1) * (0.9 + rnd() * 0.2) * red(f.def * 0.2))); f.hp -= v; ev(e, 'hit', { s: 0, d: f.uid, v, k: k === 'venom' ? 'poison' : k, dot: 1, by: o.by || 0, sid: o.sid }); }
    if (o.t <= 0) delete st[k];
  }
  staTimers(st, dt);
  if (!Object.keys(st).length) f.sta = null;
}

/* ───────── 전투 ───────── */
const buffMul = (e, aid, stat) => e.buffs.reduce((m, b) => (b.stat === stat && (b.to === aid || b.to === 'party') && b.mult ? m * b.mult : m), 1);
const buffAdd = (e, aid, stat) => e.buffs.reduce((m, b) => (b.stat === stat && (b.to === aid || b.to === 'party') && b.add ? m + b.add : m), 0);
const lowestFoe = foes => foes.reduce((x, f) => (f.hp < x.hp ? f : x), foes[0]);
const up = x => x.hp > 0 && !x.down;
// 직업 특성: 방어 관통·치명 배율·첫 공격·보스 피해 (빌드 63: 부식 · 석화 · 몬스터 강화 · 몬스터 보호막 · 불에 깨지는 빙결 · 맞으면 깨는 수면)
function hitFoe(e, f, atk, crit, magic, a, el, sk) {
  const T = a ? TR(a) : {};
  const em = elemMul(el, f, a, sk);   // 속성 상성 (0 = 면역)
  HIT.imm = em === 0 ? 1 : 0; HIT.wk = em > 1 ? 1 : 0; HIT.res = em > 0 && em < 1 ? 1 : 0;
  if (em === 0) return 0;
  const fs = f.sta;
  let def = (magic ? f.def * 0.5 : f.def) * fBuf(f, 'def'), m = crit ? T.critMul || 1.75 : 1;
  if (T.pen) def *= 1 - T.pen;
  if (sk && sk.pen) def *= 1 - sk.pen;   // 빌드 65: 볼트 방어 무시 (석궁술)
  if (T.first && f.hp >= f.maxHp) m *= T.first;
  if (T.bossDmg && f.boss) m *= T.bossDmg;
  if (a && f.boss) m *= 1 + traitSum(a, 'bossDmg');
  if (a && !f.pvp && dexKills(f.id) >= DEX_K[3]) m *= 1.03;   // 도감 완전 기록
  if (a && !f.pvp && dexRare(f.id)) m *= 1 + RARE.dmg;         // 희귀종 기록: 그 종에게 주는 피해 +15%
  if (a && el && el !== 'none') { const rd = runeSum(a, 'd_' + elFam(el)); if (rd) m *= 1 + rd; }   // 빌드 64: 속성 룬(무기) — 그 속성으로 주는 피해 +%
  if (T.exec && f.hp <= f.maxHp * EXEC_HP) m *= T.exec;                                  // 처형 (한방딜): HP 30% 아래 적
  if (fs && fs.mark) m *= 1 + MARK_BONUS;                                                 // 표식: 받는 피해 +20%
  if (a && T.combo && e.combo && e.combo[a.id]) m *= 1 + T.combo * e.combo[a.id];        // 연계 (지속딜): 중첩만큼
  if (fs && fs.weak) def *= 0.8;
  if (fs && fs.corrode) def *= Math.max(0.2, 1 - FIGHT.corrode * (fs.corrode.n || 1));   // 부식: 중첩마다 방어 −15%
  if (fs && fs.petrify) def *= FIGHT.stone;                                               // 석화: 방어 ×2
  if (fs && fs.freeze && elFam(el) === 'fire') { m *= FIGHT.thaw; delete fs.freeze; ev(e, 'stoff', { d: f.uid, k: 'freeze', side: 'f' }); }   // 빙결: 불에 깨지며 ×1.3
  m *= em * typeMul(a, f, sk);   // 몬스터 타입 특공 (사냥꾼·괴수사냥꾼·퇴마사 …)
  const v = Math.max(1, Math.round(atk * (0.85 + rnd() * 0.3) * red(def) * m));
  if (f.shd > 0) { const ab = Math.min(f.shd, v); f.shd -= ab; f.hp -= v - ab; } else f.hp -= v;   // 몬스터 보호막이 먼저 받는다
  if (fs) wakeOnHit(e, fs, f.uid, 'f');
  return v;
}
// 연계: 기본 공격을 맞힐 때마다 쌓이고(상한 COMBO_MAX), 빗나가거나 기절·마비되면 끊긴다
function comboUp(e, a, d) { const T = TR(a); if (!T.combo) return; e.combo = e.combo || {}; const n = Math.min(COMBO_MAX + ((d && d.comboMax) || 0), (e.combo[a.id] || 0) + 1); /* 쌍수술: 연계 한도 +1 · +2 */ if (n !== e.combo[a.id]) { e.combo[a.id] = n; ev(e, 'combo', { s: a.id, c: n }); } }
function comboBreak(e, aid) { if (e.combo && e.combo[aid]) { e.combo[aid] = 0; ev(e, 'combo', { s: aid, c: 0 }); } }
// 성스러운 흡수 (퇴마사·심판관): 자기 마법 피해의 일부만큼 가장 다친 동료가 회복한다
function partyDrain(e, team, dm, a, v) {
  const k = TR(a).pdrain; if (!k || !v) return;
  const x = team.filter(up).sort((p, q) => p.hp / dm[p.id].maxHp - q.hp / dm[q.id].maxHp)[0];
  if (!x || x.hp >= dm[x.id].maxHp) return;
  const h = Math.max(1, Math.round(v * k * healMul(e, x.id))); x.hp = Math.min(dm[x.id].maxHp, x.hp + h); ev(e, 'heal', { s: a.id, d: x.id, v: h });
}
// 흡혈 (물리·마법)
function leech(e, a, d, v, magic) {
  const T = TR(a), k = ((magic ? T.mdrain : T.lifesteal) || 0) + (d.lifesteal || 0) + (magic ? d.mDrain || 0 : 0);   // 생명 룬 (무기): 물리 · 마법 모두 · 금서 해독: 마법 피해 흡수
  if (!k || !v || a.hp >= d.maxHp) return;
  const h = Math.max(1, Math.round(v * k * healMul(e, a.id)));
  a.hp = Math.min(d.maxHp, a.hp + h);
  ev(e, 'heal', { s: a.id, d: a.id, v: h });
}
function stealGold(s, hits, mul) { if (!s.steal) return; const g = Math.round(s.steal * hits * (mul || 1)); S.gold += g; S.stats.earned += g; }
// 빌드 65: 다음 공격 하나에만 드는 강화(그림자 숨기 = 치명 확정 · 숨죽이기 = ×2)를 꺼내 쓴다
function takeNext(e, aid) {
  let crit = false, mul = 1;
  e.buffs = e.buffs.filter(b => { if (b.to !== aid) return true; if (b.stat === 'ncrit') { crit = true; return false; } if (b.stat === 'nmul') { mul *= b.mult || 1; return false; } return true; });
  return crit || mul !== 1 ? { crit, mul } : null;
}
// 싸움마다 첫 공격은 반드시 치명 (저격수 첫 화살)
function firstCrit(e, a, d) { if (!d.firstCrit || (e.fc && e.fc[a.id])) return false; (e.fc || (e.fc = {}))[a.id] = 1; return true; }
const partyOfE = e => S.parties.find(p => p.exp === e) || null;
const pBuffOf = (team, dm) => Math.max(0, ...team.map(x => (dm[x.id] && dm[x.id].pBuff) || 0));   // 여행 채비: 파티 강화 지속 +%
// 상태이상 하나만 푼다 (비상식량 · 보급품 나눠 주기)
function cureOne(e, x) { const st = e.sta && e.sta[x.id]; if (!st) return; const k = Object.keys(st).find(q => st[q]); if (k) cureSta(e, x, [k]); }
// 보물 상자 · 보물고 돈 (자물쇠 따기 · 금고털이): 파티에서 가장 큰 값
const chestMul = p => 1 + Math.max(0, ...teamOf(p).filter(a => !a.down).map(a => passives(a).chestGold || 0));
// 스킬 재사용 대기시간 = 기본 × (1 − 재사용 감소 − 강화) × (1 − 숙련 2%/단계). 재사용 감소는 합쳐서 50%까지
function skillCdOf(a, d, id, e) {
  const s = SKILLS[id]; if (!s || !s.cd) return 0;
  const cut = Math.min(CDR_MAX, (d.cdr || 0) + (e ? buffAdd(e, a.id, 'cdr') : 0));
  return Math.max(0.5, s.cd * CD_FLOOR, s.cd * (1 - cut) * (1 - SM_CD * smLv(a, id)) * (1 - SK_LV_CD * (skLv(a, id) - 1)) * (d.wxSk || 1));   // 더위: 스킬 재사용이 길어진다 · 바닥 = 기본 재사용의 40% (빌드 69)
}
// 기본 공격 대기시간 = 5초 ÷ 공격 속도(강화 포함)
const basicCd = (a, d, e) => basicCdOf(d.spd, e ? buffMul(e, a.id, 'spd') : 1) * (d.wxBa || 1);   // 추위: 기본 공격 대기가 길어진다
const basicIsMagic = a => CLASSES[a.cls].act === 'magic';
function pickSkill(a, d, team, dm, foes, e) {
  const st = e.sta && e.sta[a.id];
  if (st && (st.shock || isHard(st) || st.charm)) return null;   // 감전 · 기절 · 수면 · 빙결 · 석화 · 매혹: 스킬을 못 쓴다
  const sc = e.scd[a.id] || (e.scd[a.id] = {});
  let best = null, bp = 0;
  for (const id of a.skills) {
    const s = SKILLS[id];
    if (!s || s.passive || (sc[id] || 0) > 0) continue;
    if (a.skoff && a.skoff[id]) continue;   // 자동 사용 끔
    if (s.cost.mp && a.mp < s.cost.mp) continue;
    if (s.cost.hp && a.hp < d.maxHp * (s.cost.hp + 0.35)) continue;
    { const AM = skillAmmo(s, a, foes.length); if (AM && (!AM[0] || ammoLeft(AM[0], a) < AM[1])) continue; }   // 화살 · 암기 · 볼트가 모자라면 그 스킬을 못 쓴다
    let pr = 0;
    if (s.kind === 'heal' && s.tgt === 'self') {
      if (a.hp < d.maxHp * 0.5) pr = 10;
    } else if (s.kind === 'heal') {
      const hurt = team.filter(x => up(x) && x.hp < dm[x.id].maxHp * (s.tgt === 'party' ? 0.7 : 0.6));
      if (s.tgt === 'party' ? hurt.length >= 2 : hurt.length >= 1) pr = s.tgt === 'party' ? 11 : 10;
      else if (s.tgt === 'party' && team.some(x => up(x) && x.hp < dm[x.id].maxHp * 0.4)) pr = 9.5;   // 빌드 69 (11-14 19:58 「넣자」): 파티 치유만 고른 힐러도 한 명이 크게 다치면 쓴다 (한 명 치유가 있으면 그쪽이 먼저)
      if (s.reviveAll && downedOf(e, team).length) pr = 13;   // 천상의 기적: 쓰러진 동료가 있으면 가장 먼저
    } else if (s.kind === 'buff') {
      if (!e.buffs.some(b => b.sid === id)) pr = foes.some(f => f.boss) || foes.length >= 2 ? 7 : 4;
      if (s.cures && team.some(x => up(x) && e.sta && e.sta[x.id] && s.cures.some(k => e.sta[x.id][k]))) pr = Math.max(pr, 9);   // 결의: 공포를 떨친다
      if (s.fat) pr = team.some(x => up(x) && (x.fat || 0) >= (s.fatNeed || 20)) && pr ? Math.max(pr, 6) : 0;   // 물통 돌리기(빌드 69): 지친 동료가 있을 때만, 있으면 한 명만 치는 공격보다 먼저
      if (pr && s.ammo && team.some(x => up(x) && ammoLow(x))) pr = Math.max(pr, 7);   // 웨건 보급(빌드 69): 탄약이 절반 아래인 동료가 있으면 먼저
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
      const tg = s.tgt === 'all' ? foes : [frontFoe(foes)];
      if (tg.some(f => !(f.dots && f.dots[id]) && f.hp > f.maxHp * 0.4)) pr = s.tgt === 'all' && foes.length >= 2 ? 7 : 5;   // 지속 피해는 스킬마다 따로 돈다
    } else pr = s.tgt === 'all' ? (foes.length >= 2 ? 8 : 2) : (foes.some(f => f.boss) ? 6 : 5);
    if (pr && (s.kind === 'dmg' || s.kind === 'mdmg' || s.kind === 'dot')) {   // 속성: 면역이면 쓰지 않고, 약점이면 먼저
      const tg = s.tgt === 'all' ? foes : s.tgt === 'pierce' ? pierceFoes(foes) : [s.tgt === 'low' ? lowAwake(foes) : s.tgt === 'strong' ? strongAwake(foes) : frontFoe(foes)], em = Math.max(...tg.map(f => skillElMul(s, f, a) * typeMul(a, f, s) * (s.dk && staTypeImm(s.dk, f) ? 0 : 1)));
      if (em <= 0) pr = 0; else if (em > 1.2) pr += 2; else if (em < 1) pr -= 1;
    }
    if (pr && s.pcures && team.some(x => up(x) && e.sta && e.sta[x.id] && s.pcures.some(k => e.sta[x.id][k]))) pr += 3;   // 정화: 저주가 걸린 동료가 있으면 먼저
    if (pr && a.skpri && a.skpri[id]) pr += 3;   // 우선 사용
    if (pr > bp) { bp = pr; best = id; }
  }
  return best;
}
function cast(e, a, d, id, team, dm, foes) {
  const s = SKILLS[id];
  if (s.cost.mp) a.mp -= s.cost.mp;
  if (s.cost.hp) a.hp -= Math.round(d.maxHp * s.cost.hp);
  { const AM = skillAmmo(s, a, foes.length); if (AM && AM[0]) useAmmo(AM[0], a, AM[1]); }   // 화살 · 암기 · 볼트 스킬: 쏘는 만큼
  e.scd[a.id][id] = skillCdOf(a, d, id, e);
  ev(e, 'skill', { s: a.id, id });
  // 숙련도: 쓸수록 위력이 조금씩 오른다 (단계가 오르면 알린다)
  const sm = smLv(a, id), M = smMul(a, id) * skLvMul(a, id), L = skLvMul(a, id);
  a.sm = a.sm || {}; a.sm[id] = (a.sm[id] || 0) + 1;
  if (smLv(a, id) > sm) ev(e, 'mastery', { s: a.id, id, lv: smLv(a, id) });
  if (s.kind === 'dmg' || s.kind === 'mdmg') {
    const magic = s.kind === 'mdmg';
    const tg = s.tgt === 'all' ? foes.slice() : s.tgt === 'pierce' ? pierceFoes(foes) : [s.tgt === 'low' ? lowAwake(foes) : s.tgt === 'strong' ? strongAwake(foes) : frontFoe(foes)], blind = blindOf(e, a.id), NX = takeNext(e, a.id), P0 = s.wagonMul ? partyOfE(e) : null, wag = P0 && wagonOf(P0) ? s.wagonMul : 1;   // 마차 돌진: 마차를 끌고 왔으면 더 세다
    for (const f of tg) { if (blind && rnd() < FIGHT.blind) { ev(e, 'fmiss', { s: a.id, d: f.uid, sk: 1 }); continue; } for (let h = 0; h < (s.hits || 1); h++) {   // 눈멂: 스킬도 20% 빗나간다
      if (f.hp <= 0) break;
      let atk = (magic ? d.matk * buffMul(e, a.id, 'matk') : d.atk * buffMul(e, a.id, 'atk')) * s.mult * M * wag * (NX ? NX.mul : 1) * (s.thrown ? 1 + (d.thrownPct || 0) : 1) * (d.spiritPct && isSpiritSkill(s) ? 1 + d.spiritPct : 1);   // 완드술: 정령 스킬 피해
      if (s.boss && f.boss) atk *= s.boss;
      if (s.exec && f.hp <= f.maxHp * EXEC_HP) atk *= s.exec;   // 스킬 자체의 처형 보너스
      if (d.mExec && f.hp <= f.maxHp * EXEC_HP) atk *= 1 + d.mExec;   // 숙련 (상급 도끼술)
      if (s.gamble) { const jack = rnd() < s.gamble.p; if (jack) { atk *= s.gamble.mult; ev(e, 'jackpot', { s: a.id }); } }   // 대박: 확률로 몇 배
      const cadd = s.crit === 1 ? 0 : (s.crit || 0) + buffAdd(e, a.id, 'crit');   // 빌드 69: 치명타 확률은 50%까지 · 넘친 몫의 절반은 치명타 피해로 (data-cap69.js)
      const crit = s.crit === 1 || !!(NX && NX.crit) || firstCrit(e, a, d) || rnd() < capCrit(d, cadd);
      if (crit) { const cb = critBonus(d, cadd); if (cb) atk *= 1 + cb / (TR(a).critMul || 1.75); }   // 치명타 피해 +% (행운의 여신 · 첫 화살 · 넘친 치명타)
      const v = hitFoe(e, f, atk, crit, magic, a, skillEl(s, f, a), s);
      ev(e, 'hit', Object.assign({ s: a.id, d: f.uid, v, c: crit, k: s.fx || (magic ? 'magic' : CLASSES[a.cls].act === 'arrow' ? 'arrow' : 'melee'), sid: id }, hitTag()));
      if (!v) continue;   // 면역: 상태이상도 걸리지 않는다
      if (s.sta && (f.hp > 0 || s.sta.k === 'mark') && rnd() < s.sta.p) inflictFoe(e, f, s.sta, atk, a.id, id);
      if (s.sta2 && (f.hp > 0 || s.sta2.k === 'mark') && rnd() < s.sta2.p) inflictFoe(e, f, s.sta2, atk, a.id, id);   // 둘째 상태이상 (올가미 채찍: 마비 + 표식)
      if (s.slow) f.slow = s.slow;
      if (s.drain) { const h = Math.round(v * s.drain * healMul(e, a.id)); a.hp = Math.min(d.maxHp, a.hp + h); ev(e, 'heal', { s: a.id, d: a.id, v: h }); }
      else leech(e, a, d, v, magic);
      partyDrain(e, team, dm, a, v);
    } }
    stealGold(s, tg.length * (s.hits || 1), buffMul(e, a.id, 'steal') * (1 + (d.steal || 0)));   // 카드술: 훔치는 돈 +
    if (s.pcures) team.filter(up).forEach(x => cureSta(e, x, s.pcures));   // 정화: 파티의 저주를 씻는다
    [[s.after, '#a'], [s.after2, '#a2']].forEach(([A2, tag]) => {   // 때린 뒤 따라붙는 강화 (서부로! · 세기의 마술쇼 · 와이번 강하의 내려앉음 · 빌드 69 심해의 포효는 둘)
      if (!A2) return;
      const to = A2.tgt === 'party' ? 'party' : a.id; e.buffs = e.buffs.filter(b => b.sid !== id + tag);
      e.buffs.push({ sid: id + tag, to, stat: A2.stat, mult: A2.mult ? 1 + (A2.mult - 1) * L : 0, add: (A2.add || 0) * L, t: A2.dur * (1 + (to === 'party' ? pBuffOf(team, dm) : 0)) });
      if (A2.stat !== 'ground' && tag === '#a') ev(e, 'buff', { s: a.id, id, party: to === 'party' });
    });
  } else if (s.kind === 'dot') {
    const tg = s.tgt === 'all' ? foes : [frontFoe(foes)];
    const blind = blindOf(e, a.id), pw = s.magic ? d.matk * buffMul(e, a.id, 'matk') : d.atk * buffMul(e, a.id, 'atk');
    tg.forEach(f => {
      if (skillElMul(s, f, a) <= 0 || (s.dk && staTypeImm(s.dk, f))) { HIT.imm = 1; ev(e, 'hit', { s: a.id, d: f.uid, v: 0, k: s.fx || 'melee', imm: 1 }); return; }   // 속성 면역 · 독이 안 듣는 몸 (언데드 · 골렘 · 원소)
      if (blind && rnd() < FIGHT.blind) { ev(e, 'fmiss', { s: a.id, d: f.uid, sk: 1 }); return; }
      (f.dots || (f.dots = {}))[id] = { dps: pw * s.mult * M * (TR(a).dot || 1) * skillElMul(s, f, a) * (1 + (d.dotPct || 0)), t: s.dur,   /* 금서 해독: 지속 피해 + */ magic: !!s.magic, by: a.id, sid: id, acc: 0 };   // 스킬마다 따로 (빌드 63: 네크로맨서와 역병의사가 서로 지우지 않는다)
      if (s.slow) f.slow = s.slow;
      if (s.sta && rnd() < s.sta.p) inflictFoe(e, f, s.sta, pw * s.mult * M, a.id, id);   // 저주 · 부식 · 맹독도 함께
      ev(e, 'hit', { s: a.id, d: f.uid, v: 0, k: s.fx || 'melee', dot: 1 });
    });
  } else if (s.kind === 'heal' && s.tgt === 'self') {
    const h = Math.round(d.maxHp * s.pct * M * d.healPow * (1 + d.rheal + buffAdd(e, a.id, 'rheal')) * healMul(e, a.id)); a.hp = Math.min(d.maxHp, a.hp + h); ev(e, 'heal', { s: a.id, d: a.id, v: h }); cureSta(e, a, ['bleed']);
  } else if (s.kind === 'heal') {
    const pow = d.matk * s.mult * M * (TR(a).healPow || 1) * d.healPow * buffMul(e, a.id, 'heal');
    const alive = team.filter(up);
    const tg = s.tgt === 'party' ? alive : [alive.sort((x, y) => x.hp / dm[x.id].maxHp - y.hp / dm[y.id].maxHp)[0]];
    tg.forEach(x => { const h = Math.round((s.pct ? dm[x.id].maxHp * s.pct * M * d.healPow : pow * (0.9 + rnd() * 0.2)) * (1 + dm[x.id].rheal + buffAdd(e, x.id, 'rheal')) * healMul(e, x.id)); x.hp = Math.min(dm[x.id].maxHp, x.hp + h); ev(e, 'heal', { s: a.id, d: x.id, v: h }); if (s.cure1) cureOne(e, x); else cureSta(e, x, s.cures || ['bleed']); });   // pct = 대상 최대 HP의 %(약상자 · 보급품)
    if (s.reviveAll) downedOf(e, team).forEach(x => { x.down = false; x.hp = Math.max(1, Math.round(derive(x).maxHp * s.reviveAll)); x.inj = null; ev(e, 'revive', { s: a.id, d: x.id }); log(`${a.name}의 「${s.name}」에 ${x.name}이(가) 다시 일어섰다!`, 'good'); });   // 2차 각성기: 쓰러진 동료를 모두
    if (s.reviveAll && e.flee && !downedOf(e, team).length) e.flee = 0;
  } else if (s.kind === 'cure') {
    team.filter(up).forEach(x => cureSta(e, x, s.cures));
    ev(e, 'buff', { s: a.id, id, party: true });
  } else if (s.kind === 'buff') {
    const to = s.tgt === 'party' ? 'party' : a.id;
    const P1 = s.wagonMul ? partyOfE(e) : null, wag = P1 && wagonOf(P1) ? s.wagonMul : 1, LW = L * wag;   // 웨건 보급(빌드 69): 마차를 끌고 왔으면 더 세다
    e.buffs = e.buffs.filter(b => b.sid !== id && !(typeof b.sid === 'string' && (b.sid === id + '#h' || b.sid.startsWith(id + '#m'))));
    const dur = s.dur * (1 + (d.mBuff || 0) + (to === 'party' ? pBuffOf(team, dm) : 0)) * (s.durCarry ? 1 + Math.min(s.durCarry, passives(a).carryPct || 0) : 1);   // 숙련 (연주법): 강화가 더 오래 간다 · 여행 채비(마부): 파티 강화 +20% · 짐 덜어 주기(빌드 69): 짐 +%만큼 (최대 durCarry)
    e.buffs.push({ sid: id, to, stat: s.stat, mult: s.mult ? 1 + (s.mult - 1) * LW : 0, add: (s.add || 0) * LW, t: dur });   // 스킬 레벨만큼 세진다
    if (s.haste) e.buffs.push({ sid: id + '#h', to, stat: 'spd', mult: 1 + (s.haste - 1) * LW, add: 0, t: dur });   // 공격 속도도 함께 올리는 강화
    (s.more || []).forEach((m2, i) => e.buffs.push({ sid: id + '#m' + i, to, stat: m2.stat, mult: m2.mult ? 1 + (m2.mult - 1) * LW : 0, add: (m2.add || 0) * LW, t: dur }));   // 함께 거는 다른 강화 (빌드 65: 방어 · 훔치는 돈 · 덜 노림 · 다음 공격)
    if (s.cures) team.filter(up).forEach(x => cureSta(e, x, s.cures));   // 결의: 공포를 떨친다
    if (s.fat) team.filter(up).forEach(x => { x.fat = Math.max(0, (x.fat || 0) - s.fat * L); });   // 물통 돌리기(빌드 69): 파티 피로를 던다
    if (s.ammo) team.filter(up).forEach(x => ammoTop(x, s.ammo * wag));   // 웨건 보급(빌드 69): 화살 · 암기 · 볼트를 담는 수의 %만큼 (마차가 있으면 1.5배)
    ev(e, 'buff', { s: a.id, id, party: to === 'party' });
  } else if (s.kind === 'taunt') {
    e.taunt = { aid: a.id, t: s.dur };
    ev(e, 'buff', { s: a.id, id });
  } else if (s.kind === 'shield') {   // 보호막: 피해를 대신 받는 임시 HP (mult × 마법 공격력, 또는 pct × 대상 최대 HP)
    const tg = s.tgt === 'party' ? team.filter(up) : [a];
    tg.forEach(x => { const amt = Math.round((s.pct ? dm[x.id].maxHp * s.pct : d.matk * s.mult * (TR(a).healPow || 1) * d.healPow) * M * (1 + (d.shieldPow || 0)));   /* 마력 방패술: 보호막 세기 */ e.buffs = e.buffs.filter(b => b.sid !== id + '@' + x.id); e.buffs.push({ sid: id + '@' + x.id, to: x.id, stat: 'shield', hp: amt, max: amt, t: s.dur }); ev(e, 'shield', { s: a.id, d: x.id, v: amt, on: 1 }); });
    ev(e, 'buff', { s: a.id, id, party: s.tgt === 'party' });
  } else if (s.kind === 'regen') {    // 재생: 초당 회복이 dur초 이어진다
    const hps = d.matk * s.mult * M * (TR(a).healPow || 1) * d.healPow * buffMul(e, a.id, 'heal');
    const alive = team.filter(up);
    const tg = s.tgt === 'party' ? alive : [alive.sort((x, y) => x.hp / dm[x.id].maxHp - y.hp / dm[y.id].maxHp)[0]];
    tg.forEach(x => { e.buffs = e.buffs.filter(b => b.sid !== id + '@' + x.id); e.buffs.push({ sid: id + '@' + x.id, to: x.id, stat: 'regen', add: s.pct ? dm[x.id].maxHp * s.pct * M * d.healPow : hps, t: s.dur }); if (s.cure1) cureOne(e, x); });   // pct = 초당 최대 HP의 %(비상식량)
    ev(e, 'buff', { s: a.id, id, party: s.tgt === 'party' });
  } else if (s.kind === 'revive') {   // 부활: 쓰러진 동료 하나를 일으킨다 (싸움마다 한 번)
    const x = downedOf(e, team)[0];
    if (x) { x.down = false; x.hp = Math.max(1, Math.round(derive(x).maxHp * s.pct * M)); x.inj = null; e.rev = e.rev || {}; e.rev[a.id] = 1; if (e.flee && !downedOf(e, team).length) e.flee = 0; ev(e, 'revive', { s: a.id, d: x.id }); log(`${a.name}이(가) 쓰러진 ${x.name}을(를) 일으켜 세웠다!`, 'good'); }
  }
}
// 화살이 떨어졌다: 원정마다 한 번 알린다
function noAmmo(e, a, k) {   // 기록은 원정마다 한 번, 전투 화면 말풍선은 8초마다 · k 'shuri'면 표창
  const key = a.id + (k || ''), nm = k === 'shuri' ? '암기' : k === 'bolt' ? '볼트' : '화살';
  e.noAmmo = e.noAmmo || {}; if (!e.noAmmo[key]) { e.noAmmo[key] = 1; log(`${a.name}의 ${jo(nm, '이', '가')} 떨어졌다. 상단에 돌아가야 다시 채운다.`, 'bad'); }
  e.noAmmoT = e.noAmmoT || {}; const last = e.noAmmoT[key]; if (last == null || S.t - last >= 8) { e.noAmmoT[key] = S.t; ev(e, 'noammo', k ? { s: a.id, k } : { s: a.id }); }
}
function basicAct(e, a, d, team, dm, foes) {
  const act0 = CLASSES[a.cls].act, act = act0 === 'melee' && shootsArrows(a) ? 'arrow' : act0 === 'arrow' && needsArrows(a) && meleeHeld(a) ? 'melee' : act0, T = TR(a), st = e.sta && e.sta[a.id];   // 용기병이 활을 들면 사격 · 정찰가가 정글칼을 들면 근접(빌드 65)
  if (st && (st.para || isHard(st))) return;
  if (st && (st.charm || (st.confuse && rnd() < FIGHT.confuse)) && advAllyHit(e, a, d, team, dm)) return;   // 매혹 · 혼란: 같은 편을 친다
  const blind = !!(st && st.blind);
  if (act === 'magic') {
    const f = frontFoe(foes);
    if (blind && rnd() < FIGHT.blind) { ev(e, 'fmiss', { s: a.id, d: f.uid }); return; }   // 눈멂
    const cadd = buffAdd(e, a.id, 'crit'), crit = rnd() < capCrit(d, cadd), cb = crit ? critBonus(d, cadd) : 0;   // 빌드 69: 치명타 50%까지 · 넘친 몫은 치명타 피해로
    const mk = d.matk * buffMul(e, a.id, 'matk') * BASIC_MAGIC, v = hitFoe(e, f, mk * (cb ? 1 + cb / (T.critMul || 1.75) : 1), crit, true, a, 'none');
    ev(e, 'hit', Object.assign({ s: a.id, d: f.uid, v, c: crit, k: 'magic', b: 1 }, hitTag()));
    if (v && d.blindHit && f.hp > 0 && rnd() < d.blindHit) inflictFoe(e, f, { k: 'blind', d: RUNE_BLIND }, mk, a.id, 'rune');   // 섬광 룬 (무기)
    leech(e, a, d, v, true);
    partyDrain(e, team, dm, a, v);
    // 정령술사: 다른 적에게도 번진다
    if (T.aoe) foes.filter(o => o !== f).forEach(o => { if (o.hp > 0) { const w = hitFoe(e, o, mk * T.aoe, false, true, a, 'none'); ev(e, 'hit', Object.assign({ s: a.id, d: o.uid, v: w, c: false, k: 'fire', b: 1 }, hitTag())); } });
    return;
  }
  const f = act === 'arrow' ? lowAwake(foes) : frontFoe(foes);   // 잠든 · 돌이 된 · 홀린 적은 되도록 건드리지 않는다
  const k = act === 'arrow' ? (a.eq && a.eq.weapon && a.eq.weapon.base === 'lute' ? 'note' : 'arrow') : 'melee';
  const bow = shootsArrows(a), WR = bow ? null : wpnRune(a);   // WR = 속성 대검(빌드 65): 그 속성 추가 피해 · 상태이상
  if (bow && ammoLeft(a.eq.ammo, a) <= 0) { noAmmo(e, a); return; }   // 화살이 없으면 기본 공격을 못 한다
  const swings = 1 + (rnd() < Math.min(CAP.double, (T.double || 0) + (d.double || 0)) ? 1 : 0), NX = takeNext(e, a.id), od = d.offDmg && a.eq && a.eq.off && a.eq.off.base === 'dagger2' ? d.offDmg : 0;   // NX = 다음 공격 강화(그림자 숨기 · 숨죽이기) · od = 쌍수술: 둘째 칼(보조 단검) 피해
  for (let i = 0; i < swings; i++) {
    if (f.hp <= 0) break;
    if (bow && !useAmmo(a.eq.ammo, a, 1)) { noAmmo(e, a); break; }   // 한 발씩
    if (rnd() < Math.max(0, f.eva - (d.hit || 0)) + (blind ? FIGHT.blind : 0)) { ev(e, 'fmiss', { s: a.id, d: f.uid }); comboBreak(e, a.id); continue; }   // 회피는 기본 공격에만 · 눈멀면 20%p 더 · 바람 룬 명중은 몬스터 회피를 깎는다
    const cadd = buffAdd(e, a.id, 'crit'), crit = (i === 0 && !!(NX && NX.crit)) || firstCrit(e, a, d) || rnd() < capCrit(d, cadd), cb = crit ? critBonus(d, cadd) : 0;   // 빌드 69: 치명타 50%까지 · 넘친 몫은 치명타 피해로
    const atk = (d.atk * buffMul(e, a.id, 'atk') + (T.hybrid ? d.matk * buffMul(e, a.id, 'matk') * T.hybrid : 0)) * BASIC_MULT * (i === 0 && NX ? NX.mul : 1) * (cb ? 1 + cb / (T.critMul || 1.75) : 1) * (d.mExec && f.hp <= f.maxHp * EXEC_HP ? 1 + d.mExec : 1) * (act === 'melee' && isFly(f) ? FIGHT.fly : 1) * (i === 1 && od ? 1 + od : 1);   // 날아다니는 적: 근접 기본 공격 ×0.7   // 5초에 한 번, 그만큼 세게 (숙련 처형)
    const bel = bow ? arrowEl(a) || 'none' : 'none';   // 속성 화살 (빌드 39)
    const v0 = hitFoe(e, f, atk, crit, false, a, bel), tag0 = hitTag();
    const vx = WR && f.hp > 0 ? hitFoe(e, f, atk * ELEM_SWORD_MUL, false, true, a, WR.el) : 0, v = v0 + vx;   // 속성 대검: 한 번 벨 때 그 속성 피해가 덧붙는다(면역이면 0 — 본 피해는 그대로)
    ev(e, 'hit', Object.assign({ s: a.id, d: f.uid, v, c: crit, k: T.hybrid ? 'spell' : k, b: 1 }, bel !== 'none' ? { el: bel } : {}, v0 || !vx ? tag0 : hitTag()));
    if (!v) continue;
    if (WR && WR.sta && f.hp > 0 && rnd() < WR.sta.p) inflictFoe(e, f, WR.sta, d.atk * buffMul(e, a.id, 'atk'), a.id, 'rsw');
    if (bow) { const AS = arrowSta(a); if (AS && f.hp > 0 && rnd() < AS.p) inflictFoe(e, f, AS, d.atk * buffMul(e, a.id, 'atk'), a.id, 'arrow'); }
    if (d.mStun && f.hp > 0 && rnd() < d.mStun) inflictFoe(e, f, { k: 'stun', d: 1.2 }, atk, a.id, 'mast');   // 숙련 (상급 둔기술)
    if (d.mSlow && f.hp > 0 && rnd() < d.mSlow) f.slow = Math.max(f.slow || 0, 1.5);   // 채찍술: 1.5초 느림
    if (d.mBleed && f.hp > 0 && rnd() < d.mBleed) inflictFoe(e, f, { k: 'bleed', p: 1, d: 4, m: 0.3 }, atk, a.id, 'mast');   // 정글칼술: 출혈
    if (d.blindHit && f.hp > 0 && rnd() < d.blindHit) inflictFoe(e, f, { k: 'blind', d: RUNE_BLIND }, atk, a.id, 'rune');   // 섬광 룬 (무기): 기본 공격에 눈멂
    leech(e, a, d, v, false);
    comboUp(e, a, d);   // 연계 중첩 (지속딜)
  }
  // 암기 · 손목 석궁: 기본 공격마다 하나를 더 던진다 · 쏜다 (남은 적 중 가장 약한 적, 직업 특성은 안 탄다 — data-gear65.js offShot)
  offShot(e, a, d, foes);
  // 레인저·용기병: 동물 동료가 함께 문다
  if (T.pet && f.hp > 0 && rnd() < 0.5 + T.pet) for (let j = 0; j < (d.pet2 && rnd() < d.pet2 ? 2 : 1) && f.hp > 0; j++) { const v = hitFoe(e, f, d.atk * (0.35 + T.pet) * BASIC_MULT * (1 + (d.petDmg || 0)), false, false, null, 'none'); ev(e, 'hit', Object.assign({ s: a.id, d: f.uid, v, c: false, k: 'pet' }, hitTag())); }   // 기마술: 탈것이 한 번 더
}
// 적이 노릴 상대: 앞줄과 방패를 든 직업이 더 자주 맞는다
function tankW(a) { const t = TR(a).tank; return Math.max(0, (t != null ? t : jobBase(a.cls) === 'warrior' ? 1 : 0) + traitSum(a, 'tank')); }
function pickTarget(live, e, dm) {
  const w = live.map((x, i) => (1 + (i === 0 ? 1 : 0) + tankW(x) * 2) * (e && buffAdd(e, x.id, 'hide') > 0 ? 0.25 : 1) * (dm && dm[x.id] && dm[x.id].msHide ? 1 - dm[x.id].msHide : 1)), sum = w.reduce((s2, v) => s2 + v, 0);   // 빌드 69: 은신의 흑요석
  let r = rnd() * sum;
  for (let i = 0; i < live.length; i++) { r -= w[i]; if (r <= 0) return live[i]; }
  return live[0];
}

// 빌드 69 거울 마법의 오팔: 맞은 한 방(보호막이 막기 전)의 몇 %를 때린 적에게 — 방어 무시 · 몬스터 보호막이 먼저 받는다 · 투기장 상대에게는 안 듦
function msReflect(e, f, x, d, v) {
  if (!d.msRefl || !(v > 0) || f.hp <= 0 || f.pvp) return;
  const r = Math.max(1, Math.round(v * d.msRefl));
  if (f.shd > 0) { const ab = Math.min(f.shd, r); f.shd -= ab; f.hp -= r - ab; } else f.hp -= r;
  ev(e, 'hit', { s: 0, by: x.id, d: f.uid, v: r, k: 'reflect', sid: 'reflect' });
}
// 빌드 69 마석: 싸움이 시작될 때(ev 'spawn' — 필드 · 던전 · 야영 습격 · 레이드 · 방어전 · 투기장) — 방벽의 아쿠아마린 보호막, 불멸의 호박 버티기를 다시 쓸 수 있게
function msSpawn(e) {
  e.msEnd = null;
  const p = partyOfE(e); if (!p) return;
  for (const a of teamOf(p)) {
    if (!up(a)) continue;
    const d = derive(a); if (!d.msShield) continue;
    const amt = Math.max(1, Math.round(d.maxHp * d.msShield)), sid = 'ms_aqua@' + a.id;
    e.buffs = (e.buffs || []).filter(b => b.sid !== sid);
    e.buffs.push({ sid, to: a.id, stat: 'shield', hp: amt, max: amt, t: 600 });   // 싸움이 끝나면 걷힌다 (battle의 clear)
    ev(e, 'shield', { s: a.id, d: a.id, v: amt, on: 1, ms: 1 });
  }
}

/* ───────── 빌드 63: 전투 도우미 ───────── */
const blindOf = (e, aid) => !!(e.sta && e.sta[aid] && e.sta[aid].blind);
const healMul = (e, aid) => (e.sta && e.sta[aid] && e.sta[aid].curse ? FIGHT.curseHeal : 1);   // 저주: 받는 회복 절반
const fHealMul = f => (f.sta && f.sta.curse ? FIGHT.curseHeal : 1);
// 잠든 · 돌이 된 · 홀린 적은 되도록 건드리지 않는다 (깨우거나 풀어 주지 않게)
const calmFoe = f => f.hp > 0 && !(f.sta && (f.sta.sleep || f.sta.petrify || f.sta.charm));
const tauntFoe = foes => foes.find(f => f.ftaunt > 0 && f.hp > 0) || null;   // 빌드 69: 몬스터 스킬 「도발」 — 그동안 한 명을 치는 공격 · 스킬은 그 몬스터에게
const frontFoe = foes => tauntFoe(foes) || foes.find(calmFoe) || foes[0];
const lowAwake = foes => { const t = tauntFoe(foes); if (t) return t; const c = foes.filter(calmFoe); return lowestFoe(c.length ? c : foes); };
const pierceFoes = foes => { const f0 = frontFoe(foes), f1 = foes.find(f => f !== f0 && f.hp > 0); return f1 ? [f0, f1] : [f0]; };   // 빌드 69 해룡기수 물살 화살: 맨 앞 적과 그 뒤 적을 꿰뚫는다
const strongAwake = foes => { const t = tauntFoe(foes); if (t) return t; const c = foes.filter(calmFoe), L = c.length ? c : foes; return L.reduce((x, f) => ((f.boss ? 1e12 : 0) + (f.atk || 0) > (x.boss ? 1e12 : 0) + (x.atk || 0) ? f : x), L[0]); };   // 빌드 69 해룡기수: 가장 센 적 (우두머리 먼저)
// 모험가 쪽 상태이상이 능력치에 주는 것 (stepExp가 dm에 얹는다)
function staMods(d, st) {
  if (!st) return;
  if (st.fear) { d.atk *= FIGHT.fear; d.matk *= FIGHT.fear; }
  if (st.corrode) d.def *= Math.max(0.2, 1 - FIGHT.corrode * (st.corrode.n || 1));
  if (st.petrify) d.def *= FIGHT.stone;
}
// 엄호 (탱커): 다른 동료가 노려지면 일정 확률로 대신 맞는다 (행동 방해 중이거나 HP 25% 아래면 못 한다)
function coverOf(e, live, tgt, dm) {
  const c = live.filter(x => x !== tgt && (TR(x).cover || 0) > 0 && x.hp > dm[x.id].maxHp * 0.25 && !isHard(e.sta && e.sta[x.id])).sort((x, y) => (TR(y).cover || 0) - (TR(x).cover || 0))[0];
  if (c && rnd() < TR(c).cover) { ev(e, 'cover', { s: c.id, d: tgt.id }); return c; }
  return null;
}
// 매혹 · 혼란에 걸린 모험가: 기본 공격이 같은 편에게 (반만 아프고, 쓰러뜨리지는 않는다)
function advAllyHit(e, a, d, team, dm) {
  const others = team.filter(x => x !== a && up(x));
  if (!others.length) return false;
  const x = pickOne(others), magic = basicIsMagic(a), pw = magic ? d.matk * BASIC_MAGIC : d.atk * BASIC_MULT;
  const v = Math.max(1, Math.round(pw * FIGHT.allyHit * (0.85 + rnd() * 0.3) * red(dm[x.id].def * (magic ? 0.5 : 1)))), dealt = Math.min(v, Math.max(0, Math.ceil(x.hp) - 1));
  x.hp -= dealt; ev(e, 'ahit', { s: a.id, d: x.id, v: dealt });
  const xs = e.sta && e.sta[x.id]; if (xs) wakeOnHit(e, xs, x.id, 'a');
  return true;
}
// 매혹 · 혼란에 걸린 몬스터: 다른 몬스터를 친다 (칠 상대가 없으면 멍하니 선다)
function foeAllyHit(e, f, foes) {
  const others = foes.filter(o => o !== f && o.hp > 0);
  if (!others.length) { ev(e, 'ffear', { s: f.uid, c: 1 }); return; }
  const o = pickOne(others), v = Math.max(1, Math.round(f.atk * fBuf(f, 'atk') * (0.85 + rnd() * 0.3) * red(o.def)));
  if (o.shd > 0) { const ab = Math.min(o.shd, v); o.shd -= ab; o.hp -= v - ab; } else o.hp -= v;
  ev(e, 'fhit', { s: f.uid, d: o.uid, v });
  if (o.sta) wakeOnHit(e, o.sta, o.uid, 'f');
}
/* 몬스터 강화 · 스킬 (data-fight.js MSK · MON_SK) */
const fBuf = (f, stat) => (f.fbuf ? f.fbuf.reduce((m, b) => (b.stat === stat ? m * b.mul : m), 1) : 1);
const fHasBuf = (f, sid) => !!(f.fbuf && f.fbuf.some(b => b.sid === sid));
function fTick(e, f, dt) {
  if (f.fbuf) { f.fbuf.forEach(b => { b.t -= dt; }); f.fbuf = f.fbuf.filter(b => b.t > 0); if (!f.fbuf.length) f.fbuf = null; }
  if (f.ftaunt > 0) f.ftaunt -= dt;   // 빌드 69 몬스터 도발
  if (f.ccdrT > 0) f.ccdrT -= dt;   // 빌드 69 우두머리 행동 방해 저항 창
  const L = monSkills(f); if (!L.length) return;
  if (!f.mcd) { f.mcd = {}; L.forEach(s => { f.mcd[s.id] = s.cd * (0.3 + rnd() * 0.5); }); }   // 처음 쓰는 때를 흩어 놓는다
  if (isHard(f.sta)) return;   // 행동 방해 중엔 스킬 대기시간도 멈춘다
  const k = dt * (f.sta && f.sta.chill ? 0.67 : 1);
  for (const id in f.mcd) f.mcd[id] = Math.max(0, f.mcd[id] - k);
}
// 빌드 69: 지울 수 있는 모험가 강화 (보호막 · 다음 공격 강화 · 내려앉음은 빼고)
const fskBufs = (e, live) => e.buffs.filter(b => !['shield', 'ncrit', 'nmul', 'ground'].includes(b.stat) && (b.to === 'party' || live.some(x => x.id === b.to)));
function fSkillPick(f, foes, live, dm, e) {
  const L = monSkills(f); if (!L.length || !f.mcd) return null;
  const allies = foes.filter(o => o.hp > 0);
  let best = null, bp = 0;
  for (const s of L) {
    if ((f.mcd[s.id] || 0) > 0) continue;
    let pr = 0;
    if (s.kind === 'hit') pr = s.tg === 'low' ? (dm && live.some(x => x.hp < dm[x.id].maxHp * 0.5) ? 7 : 4) : s.tg === 'mp' ? (live.some(x => x.mp > 30) ? 5 : 0) : 5;   // 빌드 69: 약한 자 노리기 · 마나 태우기
    else if (s.kind === 'drain') pr = f.hp < f.maxHp * 0.7 ? 7 : 4;
    else if (s.kind === 'dispel') pr = e && fskBufs(e, live).length >= 2 ? 7 : 0;               // 빌드 69: 강화 지우기 — 걸린 강화가 둘 넘을 때만
    else if (s.kind === 'taunt') pr = allies.length >= 2 && !(f.ftaunt > 0) ? 6 : 0;   // 도발: 동료를 지킬 때
    else if (s.kind === 'all') pr = live.length >= 2 ? 6 : 3;
    else if (s.kind === 'buff') pr = fHasBuf(f, s.id) ? 0 : 4;
    else if (s.kind === 'rally') pr = allies.length >= 2 && !allies.some(o => fHasBuf(o, s.id)) ? 5 : 0;
    else if (s.kind === 'heal') { const lo = s.self ? f : allies.slice().sort((x, y) => x.hp / x.maxHp - y.hp / y.maxHp)[0]; pr = lo && !lo.giant && lo.hp < lo.maxHp * 0.6 ? 8 : 0; }
    else if (s.kind === 'shield') pr = !(f.shd > 0) && f.hp < f.maxHp * 0.85 ? 6 : 0;
    else if (s.kind === 'summon') pr = allies.length < 4 && (f.nsum || 0) < (s.max || 2) ? 7 : 0;
    if (pr > bp) { bp = pr; best = s; }
  }
  return best;
}
// 차례가 왔을 때 준비된 스킬이 있으면 쓴다 (쓰면 true — 그 차례의 기본 공격 대신)
function fSkill(p, e, f, foes, live, dm) {
  const s = fSkillPick(f, foes, live, dm, e);
  if (!s || rnd() > FIGHT.skUse) return false;
  f.mcd[s.id] = s.cd * (0.9 + rnd() * 0.2);
  ev(e, 'fskill', { s: f.uid, id: s.id, name: s.name, kind: s.kind });
  const O = { skill: 1, ms: 1, magic: !!s.magic, el: mskEl(s, f), sta: mskSta(s, f) || undefined, crit: s.crit || 0, pen: s.pen || 0 };
  if (s.kind === 'hit' || s.kind === 'drain') {
    let tgt = e.taunt ? live.find(x => x.id === e.taunt.aid) || null : null;
    if (!tgt && s.tg === 'low') tgt = live.slice().sort((x, y) => x.hp / dm[x.id].maxHp - y.hp / dm[y.id].maxHp)[0];   // 빌드 69 약한 자 노리기: 가장 다친 모험가
    if (!tgt && s.tg === 'mp') tgt = live.slice().sort((x, y) => (y.mp || 0) - (x.mp || 0))[0];                       // 마나 태우기: MP가 가장 많은 모험가
    if (!tgt) tgt = pickTarget(live, e, dm);
    if (!e.taunt && live.length > 1) tgt = coverOf(e, live, tgt, dm) || tgt;
    for (let h = 0; h < (s.hits || 1); h++) {
      if (!up(tgt)) break;
      const before = tgt.hp, mp0 = tgt.mp || 0;
      const hit = hitAdv(p, e, f, tgt, s.mult, dm, h ? Object.assign({}, O, { hn: h }) : O);
      if (s.kind === 'drain') { const dealt = Math.max(0, before - Math.max(0, tgt.hp)), hv = Math.round(dealt * (s.heal || 0.5) * fHealMul(f)); if (hv > 0 && !f.giant) { f.hp = Math.min(f.maxHp, f.hp + hv); ev(e, 'fheal', { s: f.uid, d: f.uid, v: hv }); } }
      if (s.mp && hit && up(tgt) && mp0 > 0) { tgt.mp = Math.max(0, mp0 - dm[tgt.id].maxMp * s.mp); ev(e, 'mpburn', { s: f.uid, d: tgt.id, v: Math.round(mp0 - tgt.mp) }); }   // 마나 태우기
    }
  } else if (s.kind === 'all' || s.kind === 'dispel') {
    ev(e, 'aoe', { s: f.uid, ms: 1 });
    live.forEach(x => hitAdv(p, e, f, x, s.mult, dm, O));
    if (s.kind === 'dispel') {   // 빌드 69 강화 지우기: 모험가마다 걸린 강화를 n개(나중에 건 것부터) · 파티 전체 강화는 모두
      const gone = new Set(), L = fskBufs(e, live);
      live.forEach(x => L.filter(b => b.to === x.id).slice(-(s.n || 2)).forEach(b => gone.add(b)));
      L.filter(b => b.to === 'party').forEach(b => gone.add(b));
      if (gone.size) { e.buffs = e.buffs.filter(b => !gone.has(b)); ev(e, 'fdispel', { s: f.uid, n: gone.size }); }
    }
  } else if (s.kind === 'taunt') {   // 빌드 69 도발: 그동안 모험가의 한 명 공격 · 스킬은 이 몬스터에게 (frontFoe · lowAwake) + 방어 강화
    f.ftaunt = s.dur || 6;
    f.fbuf = (f.fbuf || []).filter(b => b.sid !== s.id); f.fbuf.push({ sid: s.id, stat: 'def', mul: s.mul || 1.3, t: s.dur || 6 });
    ev(e, 'ftaunt', { s: f.uid, t: f.ftaunt });
  } else if (s.kind === 'buff' || s.kind === 'rally') {
    (s.kind === 'rally' ? foes.filter(o => o.hp > 0) : [f]).forEach(o => { o.fbuf = (o.fbuf || []).filter(b => b.sid !== s.id); o.fbuf.push({ sid: s.id, stat: s.stat, mul: s.mul, t: s.dur }); ev(e, 'fbuff', { s: f.uid, d: o.uid, stat: s.stat }); });
  } else if (s.kind === 'heal') {
    const o = s.self ? f : foes.filter(x => x.hp > 0).sort((x, y) => x.hp / x.maxHp - y.hp / y.maxHp)[0];
    if (o && !o.giant) { const hv = Math.round(o.maxHp * s.pct * (o.fb ? FB_HEAL69 : 1) * fHealMul(o)); o.hp = Math.min(o.maxHp, o.hp + hv); ev(e, 'fheal', { s: f.uid, d: o.uid, v: hv }); }   // 빌드 69: 필드 우두머리는 HP가 몇 배라 회복 몫을 줄인다
  } else if (s.kind === 'shield') {
    const sh0 = Math.max(0, f.shd || 0); f.shd = Math.round(f.maxHp * s.pct * (f.fb ? FB_HEAL69 : 1)); e.fheal = (e.fheal || 0) + Math.max(0, f.shd - sh0); ev(e, 'fbuff', { s: f.uid, d: f.uid, stat: 'shield' });
  } else if (s.kind === 'summon') { f.nsum = (f.nsum || 0) + 1; fSummon(e, f, foes, s.mon, s.n || 1); }
  return true;
}
// 졸개 부르기: 정해진 몬스터, 없으면 그 땅의 몬스터 (한 싸움에 서 있는 몬스터는 다섯까지 · 부른 졸개는 전리품이 없다)
function fSummon(e, f, foes, mons, n) {
  if (f.giant || f.pvp) return 0;
  let pool = (mons || []).filter(id => MONS[id]);
  if (!pool.length) { try { const A = areaDef(e); pool = ((A && A.mons) || []).filter(id => MONS[id] && !MONS[id].boss && id !== f.id); } catch (_) { pool = []; } }
  if (!pool.length) return 0;
  let k = 0;
  for (let i = 0; i < n; i++) {
    if (foes.filter(o => o.hp > 0).length >= FIGHT.foeMax) break;
    const m = foeFrom(pickOne(pool), Math.max(1, f.lv - 2)); m.sum = 1; m.cd = 1 + rnd(); foes.push(m); k++;
  }
  if (k) ev(e, 'fsum', { s: f.uid, n: k, id: pool[0] });
  return k;
}
// 우두머리 단계: HP 50% 분노(공격 속도 ×1.3) · 25% 마지막 발악(광역기 0.3 → 0.5 · 졸개 · 스킬을 서두른다)
function fPhase(e, f, foes) {
  if (!f.boss || f.pvp) return;
  const r = f.hp / f.maxHp;
  if (!f.ph0 && r <= PH0.at && f.hp > 0) {   // 빌드 69: 75% 단계 — 졸개를 부르거나 보호막
    f.ph0 = 1;
    const sm = monSkills(f).find(s => s.kind === 'summon'), n = sm ? fSummon(e, f, foes, sm.mon, PH0.sum) : 0;
    let v = 0; if (!n) { const sh0 = Math.max(0, f.shd || 0); f.shd = sh0 + Math.round(f.maxHp * PH0.shd); v = f.shd - sh0; e.fheal = (e.fheal || 0) + v; }
    ev(e, 'fphase', { s: f.uid, k: 0, n, v });
  }
  if (!f.ph1 && r <= 0.5) { f.ph1 = 1; ev(e, 'fphase', { s: f.uid, k: 1 }); }
  if (!f.ph2 && r <= 0.25) {
    f.ph2 = 1; f.aoe = true;
    if (f.mcd) for (const id in f.mcd) f.mcd[id] = Math.min(f.mcd[id], 1);
    const sm = monSkills(f).find(s => s.kind === 'summon'), n = fSummon(e, f, foes, sm && sm.mon, FIGHT.lastSummon);
    ev(e, 'fphase', { s: f.uid, k: 2, n });
  }
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
  if (e.hpS !== sig) { e.hpS = sig; e.hpW = null; e.noDmg = 0; e.fheal = 0; e.hpB = null; e.noNet = 0; }
  const hpNow = foes.reduce((t, f) => t + Math.max(0, f.hp) + Math.max(0, f.shd || 0), 0);   // 몬스터 보호막이 깎이는 것도 피해로 센다
  const hpAdj = hpNow - (e.fheal || 0);   // 빌드 69: 몬스터가 회복 · 보호막으로 되돌린 몫을 빼고 본다 (회복하는 우두머리를 면역으로 잘못 보지 않게)
  if (e.hpW == null || hpAdj < e.hpW - 0.5) { e.hpW = hpAdj; e.noDmg = 0; } else e.noDmg = (e.noDmg || 0) + dt;
  if (e.hpB == null || hpNow < e.hpB - 0.5) { e.hpB = hpNow; e.noNet = 0; } else e.noNet = (e.noNet || 0) + dt;   // 회복까지 친 HP가 45초 동안 안 줄면 이길 수 없는 싸움
  if ((e.noDmg > 14 || e.noNet > 45) && !e.flee && !foes.some(f => f.pvp)) {
    const live = foes.filter(f => f.hp > 0), bossF = live.find(f => f.boss || f.fb), boss = !!bossF || e.area === 'raid', f0 = bossF || live[0], imm = e.noDmg > 14;
    e.flee = 2.5; e.fleeImm = boss ? 2 : 1; e.noDmg = 0; e.noNet = 0; ev(e, 'immflee', { boss: boss ? 1 : 0, net: imm ? 0 : 1 });
    if (imm) log(`${p.name}의 공격이 ${f0 ? f0.name || MONS[f0.id].name : '적'}에게 통하지 않는다! ${boss ? '넘을 수 없는 상대라 물러난다' : '싸움을 피해 지나간다'}.${f0 && monElNote(f0.id) ? ` (${monElNote(f0.id)})` : ''}`, 'bad');
    else log(`${p.name}은(는) ${f0 ? f0.name || MONS[f0.id].name : '적'}의 회복을 넘지 못한다 — 이길 수 없는 싸움이라 ${boss ? '물러난다' : '싸움을 피해 지나간다'}.`, 'bad');
    HOOKS.toast(`${p.name}: ${imm ? '공격이 통하지 않아' : '이길 수 없는 싸움이라'} ${boss ? '돌아옵니다' : '싸움을 피해 지나갑니다'}`);
  }
  e.buffs.forEach(b => { b.t -= dt; });
  e.buffs = e.buffs.filter(b => b.t > 0 && !(b.stat === 'shield' && b.hp <= 0));   // 다 깨진 보호막은 걷는다
  if (e.taunt) { e.taunt.t -= dt; if (e.taunt.t <= 0) e.taunt = null; }
  e.gcd = e.gcd || {}; e.rg = e.rg || {};
  for (const a of team) {
    if (!up(a)) continue;
    const d = dm[a.id], st = e.sta && e.sta[a.id];
    a.mp = Math.min(d.maxMp, a.mp + d.maxMp * 0.02 * d.mpRegen * dt);
    a.mp = Math.min(d.maxMp, a.mp + (d.mpFlat || 0) * dt);
    // 재생: 1초마다 걸린 만큼 회복 (저주면 멈춘다)
    const rg = st && st.curse ? 0 : buffAdd(e, a.id, 'regen');
    if (rg) { e.rg[a.id] = (e.rg[a.id] || 0) + dt; if (e.rg[a.id] >= 1) { e.rg[a.id] -= 1; if (a.hp < d.maxHp) { const h = Math.max(1, Math.round(rg * (1 + d.rheal + buffAdd(e, a.id, 'rheal')))); a.hp = Math.min(d.maxHp, a.hp + h); ev(e, 'heal', { s: 0, d: a.id, v: h, rg: 1 }); } } }
    if (isHard(st)) continue;   // 기절 · 수면 · 빙결 · 석화: 모든 대기시간이 멈춘다
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
    if (f.dot) { f.dots = f.dots || {}; f.dots[f.dot.sid || 'dot'] = Object.assign({ acc: f.dotT || 0 }, f.dot); f.dot = null; }   // 옛 저장: 지속 피해 한 칸 → 스킬마다
    if (f.dots) { for (const k in f.dots) { const o = f.dots[k]; o.acc = (o.acc || 0) + dt; o.t -= dt; if (o.acc >= 1) { const v = Math.max(1, Math.round(o.dps * o.acc * red(f.def * (o.magic ? 0.15 : 0.3)))); f.hp -= v; o.acc = 0; ev(e, 'hit', { s: 0, d: f.uid, v, k: o.magic ? 'curse' : 'poison', dot: 1, by: o.by || 0, sid: o.sid }); } if (o.t <= 0) delete f.dots[k]; } if (!Object.keys(f.dots).length) f.dots = null; }
    if (f.slow > 0) f.slow -= dt;
    tickFoeSta(e, f, dt);
    fTick(e, f, dt);
    if (f.hp <= 0) continue;
    fPhase(e, f, foes);
    f.cd -= dt * (f.sta && f.sta.chill ? 0.67 : 1) * fBuf(f, 'spd') * (f.ph1 ? FIGHT.rage : 1);   // 질풍 · 우두머리 분노
    if (f.cd > 0) continue;
    f.cd = 1 / f.spd * (0.9 + rnd() * 0.25) * (f.slow > 0 ? 1.6 : 1);
    const fs = f.sta;
    if (fs && (fs.para || isHard(fs))) continue;
    if (fs && fs.fear && rnd() < FIGHT.fearSkip) { ev(e, 'ffear', { s: f.uid }); continue; }   // 공포: 차례를 건너뛴다
    const live = team.filter(up);
    if (!live.length) break;
    if (fs && (fs.charm || (fs.confuse && rnd() < FIGHT.confuse))) { foeAllyHit(e, f, foes); continue; }   // 매혹 · 혼란: 같은 편을 친다
    if (f.heal && !(fs && fs.shock) && rnd() < 0.3) { const ally = foes.filter(x => x.hp > 0).sort((x, y) => x.hp / x.maxHp - y.hp / y.maxHp)[0]; if (ally && ally.hp < ally.maxHp * 0.75) { const h = Math.round(f.heal * (0.9 + rnd() * 0.2) * fHealMul(ally)); ally.hp = Math.min(ally.maxHp, ally.hp + h); ev(e, 'fheal', { s: f.uid, d: ally.uid, v: h }); continue; } }
    if (!(fs && fs.shock) && fSkill(p, e, f, foes, live, dm)) continue;   // 몬스터 스킬 (감전이면 못 쓴다)
    if ((MONS[f.id].aoe || f.aoe) && !(fs && fs.shock) && rnd() < (f.ph2 ? FIGHT.lastAoe : 0.3)) { ev(e, 'aoe', { s: f.uid }); live.forEach(x => hitAdv(p, e, f, x, 0.7, dm, { skill: 1, aoe: 1 })); continue; }   // 광역기: 스킬이라 회피가 안 든다
    let tgt = null;
    if (e.taunt) tgt = live.find(x => x.id === e.taunt.aid) || null;
    if (!tgt) { const pool = live.filter(x => !((dm[x.id].baImm || TR(x).baImm) && !(buffAdd(e, x.id, 'ground') > 0))); tgt = pickTarget(pool.length ? pool : live, e, dm); }   // 기본 공격 면역(하늘에 뜬 용기수 …)은 혼자 남았을 때만 맞는다
    if (!e.taunt && live.length > 1) tgt = coverOf(e, live, tgt, dm) || tgt;
    const nh = f.pvp ? 1 : MONS[f.id].hits || 1;   // 빌드 69 몬스터 연타 (data-monup69.js): 대마다 회피 · 피해 ×HITS_MUL, 상태이상 · 반격은 한 번만
    if (nh > 1) { const once = {}; for (let h = 0; h < nh && up(tgt); h++) hitAdv(p, e, f, tgt, HITS_MUL[nh] || 1 / nh, dm, { hn: h, once }); }
    else hitAdv(p, e, f, tgt, 1, dm);
  }
  for (let i = foes.length - 1; i >= 0; i--) if (foes[i].hp <= 0) { const f = foes[i]; foes.splice(i, 1); kill(p, e, f); }
  if (!foes.length) { e.cd = {}; e.buffs = []; e.taunt = null; e.subst = null; e.fc = null; ev(e, 'clear', {}); }
}
// 몬스터가 모험가를 친다. o: { skill 스킬(회피 안 듦 · 눈멀면 20% 빗나감) · aoe 광역기 · ms 몬스터 스킬 · magic · el 속성 · sta 상태이상 · crit }
function hitAdv(p, e, f, x, mult, dm, o) {
  if (!up(x)) return false;
  o = o || {};
  const d = dm[x.id], m = MONS[f.id], fs = f.sta, blind = !!(fs && fs.blind), magic = o.magic != null ? !!o.magic : !!m.magic;
  if (!o.skill && !o.ms && !o.aoe && buffAdd(e, x.id, 'deflect') > 0) { ev(e, 'miss', { s: f.uid, d: x.id, df: 1 }); return false; }   // 튕겨내기(닌자): 기본 공격을 모두 튕겨 낸다
  const hn = o.hn ? { hn: o.hn } : {};   // 빌드 69 몬스터 연타: 몇 번째 한 대인지 (화면이 한 대씩 늦게 그린다)
  if (o.skill ? blind && rnd() < FIGHT.blind : rnd() < Math.min(CAP.eva, d.eva + buffAdd(e, x.id, 'eva')) + (blind ? FIGHT.blind : 0)) { ev(e, 'miss', Object.assign({ s: f.uid, d: x.id, bl: blind ? 1 : 0 }, hn)); return false; }   // 회피는 기본 공격에만 (빌드 69: 강화를 더해도 50%까지)
  const el = o.el || (magic || o.aoe ? fAtkEl(f) : 'none'), fam = elFam(el), xs = e.sta && e.sta[x.id];
  const def = d.def * buffMul(e, x.id, 'def') * (magic ? 0.5 : 1) * (1 - (o.pen || 0));   // 빌드 69: 몬스터 스킬 「꿰뚫기」는 방어를 덜 본다
  const crit = rnd() < (f.boss ? 0.08 : 0.04) + (o.crit || 0);
  const pet0 = petOfParty(p), guard = Math.min(CAP.guard, TQ(x, 'guard') + relic('guard') + buffAdd(e, x.id, 'guard') + (pet0 && pet0.trait === 'loyal' ? 0.04 : 0));
  const blk = rnd() < Math.min(CAP.block, (d.block || 0) + buffAdd(e, x.id, 'block') + (o.skill || o.ms || o.aoe ? 0 : d.bblock || 0));   // 예리함 룬(방어구): 기본 공격만 막는다 (빌드 69: 모두 더해 50%까지)
  const resist = (magic ? 1 - (d.mres || 0) : 1) * (fam !== 'none' ? 1 - ((d.res && d.res[fam]) || 0) : 1);   // 마법 저항 · 속성 저항
  const cut = Math.max(CAP.dmgFloor, (1 - guard) * resist * (1 - (d.msDmg || 0)));   // 빌드 69: 받는 피해 감소 · 저항 · 수호진의 다이아몬드를 곱해도 원래의 20% 아래로는 안 내려간다 (막기 1/4은 따로)
  let v = Math.max(1, Math.round(f.atk * fBuf(f, 'atk') * (fs && fs.weak ? 0.8 : 1) * mult * (0.85 + rnd() * 0.3) * red(def) * (crit ? 1.6 : 1) * (blk ? 0.25 : 1) * cut));
  if (xs && xs.freeze && fam === 'fire') { v = Math.round(v * FIGHT.thaw); delete xs.freeze; ev(e, 'stoff', { d: x.id, k: 'freeze', side: 'a' }); }   // 빙결: 불에 깨지며 ×1.3
  if (xs) wakeOnHit(e, xs, x.id, 'a');
  // 보호막이 먼저 깎인다
  let sh = 0;
  const v0 = v;   // 빌드 69 오팔 반사: 보호막이 막기 전 피해로 센다
  for (const b of e.buffs) { if (v <= 0) break; if (b.stat === 'shield' && b.to === x.id && b.hp > 0) { const ab = Math.min(b.hp, v); b.hp -= ab; v -= ab; sh += ab; } }
  if (sh) ev(e, 'shield', { s: f.uid, d: x.id, v: sh });
  if (v <= 0) { msReflect(e, f, x, d, v0); return true; }
  if (x.hp - v <= 0 && (d.subst || TR(x).subst) && !(e.subst && e.subst[x.id])) { (e.subst || (e.subst = {}))[x.id] = 1; x.hp = Math.max(x.hp, Math.round(d.maxHp * 0.3)); ev(e, 'subst', { d: x.id, s: f.uid }); return true; }   // 쓰러질 한 방을 싸움마다 한 번 피한다 (통나무 바꾸기 …)
  let endure = 0;
  if (x.hp - v <= 0 && x.hp > 1 && d.msEnd && !(e.msEnd && e.msEnd[x.id])) { (e.msEnd || (e.msEnd = {}))[x.id] = 1; if (rnd() < d.msEnd) { v = Math.ceil(x.hp) - 1; endure = 1; } }   // 빌드 69 불멸의 호박: 쓰러질 한 방을 HP 1로 (싸움마다 한 번)
  x.hp -= v;
  ev(e, 'hurt', Object.assign({ s: f.uid, d: x.id, v, c: crit, k: magic ? 'magic' : '', blk: blk ? 1 : 0 }, o.ms ? { ms: 1 } : {}, fam !== 'none' ? { el } : {}, hn));
  if (endure) ev(e, 'endure', { d: x.id, s: f.uid });
  msReflect(e, f, x, d, v0);
  if (x.hp <= 0) { down(p, e, x, f); return true; }
  if (!(o.once && o.once.sta)) {   // 빌드 69 연타: 한 번 칠 때 상태이상은 처음 들어간 한 대만
    if (o.once) o.once.sta = 1;
    const ms = o.sta !== undefined ? o.sta : (m.sta || f.inflict);
    if (ms && rnd() < ms.p) inflictAdv(e, x, ms, f.atk);
    if (o.sta === undefined && m.sta2 && rnd() < m.sta2.p) inflictAdv(e, x, m.sta2, f.atk);   // 빌드 69: 우두머리 · 던전 주인은 맞힐 때 거는 상태이상이 둘 (data-monup69.js)
  }
  const st = e.sta && e.sta[x.id];
  if (!(o.once && o.once.ctr) && !(st && (st.para || st.charm || isHard(st))) && rnd() < Math.min(CAP.counter, (d.counter || 0) + buffAdd(e, x.id, 'counter'))) {
    if (o.once) o.once.ctr = 1;   // 연타에는 한 번만 되받아친다
    const cv = hitFoe(e, f, d.atk * buffMul(e, x.id, 'atk') * 0.8, rnd() < d.crit, false, x, 'none');
    ev(e, 'hit', Object.assign({ s: x.id, d: f.uid, v: cv, c: false, k: 'melee', ctr: 1 }, hitTag()));
  }
  return true;   // 빌드 69: 맞았으면 참 (빗나감 · 튕김은 거짓 — 마나 태우기 같은 스킬이 본다)
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
  const xp = Math.round(f.lv * 3 * (f.fb ? 8 : f.boss ? 15 : f.pvp ? 4 : 1) * (f.sum ? 0.5 : 1) * (f.rare ? RARE.exp : f.nest ? 1.5 : 1) * (1 + (spn('elves') >= 2 ? 0.1 : 0) + (spn('elves') >= 3 ? 0.15 : 0) + relic('exp') + petHome('exp') + (foodFx(e).exp || 0)) * harvest);
  if (f.rare && !f.pvp) rareDown(p, e, f);
  team.forEach(a => { if (addExp(a, xp)) { ev(e, 'lvl', { d: a.id }); log(`${a.name}이(가) Lv${a.lv}이 되었다.`, 'good'); } });
  ev(e, 'kill', { d: f.uid, id: f.id, sc: f.sc || 0, adv: f.adv || null });
  petKill(p, e, f, xp);
  if (f.pvp) return;   // 투기장: 전리품 없음
  if (f.sum) return;   // 우두머리가 부른 졸개: 경험치 절반 · 전리품 없음 (빌드 63)
  kqKill(f.id);
  const luck = Math.max(0, ...team.map(a => TQ(a, 'luck'))), hunt = Math.max(0, ...team.map(a => TQ(a, 'drop')));   // 보물 사냥꾼의 운, 괴물사냥꾼의 손질
  const pet = petOfParty(p), petLuck = (pet ? (PETS[pet.kind].luck || 0) + (pet.trait === 'lucky' ? 0.08 : 0) : 0) + petHome('luck');
  const dropMul = (1 + (spn('elves') >= 1 ? 0.1 : 0) + relic('drop') + luck + hunt + petLuck + (dexRare(f.id) ? RARE.drop : 0) + (foodFx(e).luck || 0)) * harvest, fbm = f.fb ? 3 : f.nest || f.rare ? 2 : 1;
  for (const [it, ch, q] of m.drops) { const ht = ITEMS[it] && ITEMS[it].herb ? herbTier(it) : -1; if (rnd() < Math.min(1, ch * dropMul * fbm * (ht >= 0 ? HERB_DROP_MUL[ht] : 1))) loot(p, e, it, (q || 1) * (f.fb ? 2 : 1)); }   // 빌드 65: 몬스터가 떨어뜨리는 약초도 등급마다 1/6 · 1/60 · 1/600
  if (e.area === 'field') {   // 약초 줍기 (빌드 65: 예전 12% → 하급 2% · 중급 0.2% · 최상급 0.02%, 우두머리 ×10 — 약초는 재배소에서 기른다)
    const hs = F.herbs || ['herb'], hb = harvest * (f.fb || f.boss ? HERB_BOSS : 1);
    for (let t = 0; t < HERB_PICK.length; t++) { const L = hs.filter(h => herbTier(h) === t); if (L.length && rnd() < HERB_PICK[t] * hb) loot(p, e, pickOne(L), 1); }
  }
  const ap = 1 + rlv('appraise') * 0.25;
  const inD = e.area === 'dungeon';
  const gt = F.treasure ? Math.min(GTIERS.length - 1, raidTier(e.lvo || 10)) : F.tier;   // 보물 던전은 파티 레벨에 맞는 단계
  { const gk = f.fb ? 'fb' : f.boss ? 'boss' : 0; if (rnd() < (gk ? GEAR_DROP[gk] : inD ? GEAR_DROP.dungeon : GEAR_DROP.field) * ap) lootGear(p, e, makeGear(dropBase(gt), gt, rollGrade(gt, gk))); }   // 빌드 63 다섯째 묶음: 드랍 줄임 · 레어도는 rollGrade
  { const ea = elemArrowOf(f.id); if (ea && rnd() < (f.boss || f.fb ? 0.3 : 0.012) * ap) lootGear(p, e, makeGear(ea, gt, 0)); }   // 속성 화살: 그 속성 몬스터한테서
  // 스킬북: 빌드 63부터 모든 몬스터가 스킬북 단계를 떨어뜨린다 — 확률은 예전 그대로(bookRate), 어느 책인지는 그 땅의 단계로(우두머리 · 주인은 한 줄 위) · 감정 연구 · 전리품 운이 확률을 올린다
  if (rnd() < Math.min(1, bookRate(f, e.area) * ap * (1 + luck + hunt + petLuck) * (1 + (foodFx(e).book || 0)))) { const tb = tierBookFor(F.treasure ? raidTier(e.lvo || 10) : F.tier != null ? F.tier : tierOfLv(f.lv), f.boss || f.fb); if (tb) loot(p, e, tb, 1); }   // 꽝이면 없음
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
function msGot(p, e, from) {   // 빌드 69: 마석 하나 — 짐이 차도 잃지 않게 e.bag에 바로 (11-14 사용자 「마석은 지하미궁에서만 · 확률 극악」 — 지하미궁 층 보스가 부를 것, 지금은 부르는 곳 없음)
  const id = msItem(); addTo(e.bag, id, 1); ev(e, 'loot', { id });
  log(`${p.name}이(가) ${from ? from + '에게서 ' : ''}마석 「${ITEMS[id].name}」을(를) 얻었다!`, 'good'); HOOKS.toast(`마석 · ${ITEMS[id].name}`);
  return id;
}
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
        const v = Math.round(potionHeal(use) * healMul(e, low.id));   // 저주: 받는 회복 절반
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
  unloadBag(p, e.bag, e.gbag, e.sup);   // 빌드 63: 메인 창고가 차면 창고 1~10으로, 그래도 빈 칸이 없으면 못 가져온다 (store.js) — 남은 보급품도
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
  if (p.raidOnly) raidDissolve(p);   // 빌드 69: 옛 저장의 레이드대는 돌아오면 푼다
  if (trimParty(p)) log(`${p.name}은(는) 인원이 넘쳐 레벨이 낮은 모험가를 대기로 돌렸다. (짐꾼 계열을 빼고 ${PARTY_FIGHTERS}명까지)`);
  if (!S.flags.firstReturn) { S.flags.firstReturn = 1; queueModal({ title: '첫 원정', body: STORY.firstReturn }); }
  if (typeof achvTick === 'function') achvTick();
  changed();
}
function leave(a, why) {
  const p = partyOf(a.id);
  if (p) p.members = p.members.filter(id => id !== a.id);
  SLOTS.forEach(([s]) => { if (a.eq[s]) { stashGear(a.eq[s]); a.eq[s] = null; } });   // 떠난 모험가의 장비 (넘치면 창고 1~10, 그래도 없으면 잃는다)
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
    const gold = Math.round((DUNGEON_GOLD[F.tier] || 3000) * chestMul(p)), fame = 60 + F.tier * 25;
    S.gold += gold; S.fame += fame; S.stats.earned += gold; S.stats.dungeons = (S.stats.dungeons || 0) + 1;
    team.forEach(a => { a.pf = (a.pf || 0) + 20; a.dungeons = (a.dungeons || 0) + 1; });
    // 보물 상자: 영웅 장비(높은 단계 던전이면 아주 드물게 그 위)와 장비 한 점, 스킬북 두 권, 주인의 혼 둘, 중급 룬 둘. 그리고 유물 (빌드 63 다섯째 묶음: 정해진 전설 장비는 뺐다)
    e.gbag.push(makeGear(dropBase(F.tier), F.tier, Math.max(3, rollGrade(F.tier, 'chest'))), makeGear(dropBase(F.tier), F.tier, Math.max(1, rollGrade(F.tier, 'chest'))));
    const b1 = randomBook(F.lv, F.lv + 16, true), b2 = randomBook(F.lv, F.lv + 20, true);
    if (b1) addTo(e.bag, b1, 1); if (b2) addTo(e.bag, b2, 1);
    addTo(e.bag, 'soul_' + F.tier, 2);
    addTo(e.bag, runeId(pickOne(RUNE_IDS), 1), 1); addTo(e.bag, runeId(pickOne(RUNE_IDS), 1), 1);
    const RL = RELICS[e.field], newRelic = RL && !(S.relics || []).includes(e.field);
    if (newRelic) (S.relics = S.relics || []).push(e.field);
    log(`${p.name}이(가) ${F.dungeon.name}의 주인 ${MONS[F.dungeon.boss].name}을(를) 쓰러뜨렸다! 보물 ${g$(gold)}, 명성 +${fame}${newRelic ? `, 유물 「${RL.name}」` : ''}`, 'good');
    queueModal({ title: `${F.dungeon.name} 공략`, body: (STORY[e.field] || []).concat([`보물 상자에서 ${g$(gold)}과 영웅 장비, 장비 한 점, 스킬북, ${ITEMS['soul_' + F.tier].name} 둘, 룬을 찾았다. 명성 +${fame}. 함께 싸운 모험가들의 개인 명성도 크게 올랐다.`], newRelic ? [`유물 「${RL.name}」을(를) 얻었다. ${RL.desc}. 상단 창의 유물에서 볼 수 있다.`] : []) });
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
  const gold = Math.round((2500 + L * 220) * (0.9 + rnd() * 0.4) * chestMul(p) / 10) * 10;
  S.gold += gold; S.stats.earned += gold; S.fame += 6; S.stats.tmaps = (S.stats.tmaps || 0) + 1;
  team.forEach(a => { a.pf = (a.pf || 0) + 6; });
  const got = [g$(gold), '명성 +6'];
  addTo(e.bag, 'gold_dust', 3); got.push('황금 가루 3');
  const gt = Math.min(GTIERS.length - 1, raidTier(L)), g = makeGear(dropBase(gt), gt, Math.max(3, rollGrade(gt, 'chest'))); e.gbag.push(g); got.push(`${QUALITY[g.q].name} ${gearName(g)}`);   // 영웅 (예전 30% 전설)
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
// 빌드 69: 레이드 원정대(같은 e.grp — e.rg는 재생 누적이 쓴다) — 가장 느린 파티 빠르기로 같이 걸어간다
const raidGroup = g => (g && S ? S.parties.filter(q => q.exp && q.exp.grp === g).sort((a, b) => (a.exp.grpi || 0) - (b.exp.grpi || 0)) : []);
function raidGrpV(p, e) { let v = moveOf(p); if (e.grp) for (const q of raidGroup(e.grp)) if (q !== p && q.exp.mode === 'advance' && !q.exp.fought) v = Math.min(v, moveOf(q)); return v; }
const raidHp = L => Math.round(600 * (25 + 18 * L + 1.15 * L * L) * DIFF.hp / 1000) * 1000;
function giantFoe(id) {
  const R = RAIDS[id], rec = raidRec(id), f = foeFrom(R.mon, R.lv + 4);
  Object.assign(f, { maxHp: rec.max, hp: rec.hp, giant: id, boss: true, aoe: true, name: R.name, atk: f.atk * (RAID69.hp[id] ? RAID69.atk : 0.55), spd: Math.min(f.spd, 0.8) });   // 파티 전체를 자주 치니 한 방은 약하게 (빌드 69: Lv150+ 레이드는 RAID69.atk)
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
  const v = (e.mode === 'advance' ? raidGrpV(p, e) : moveOf(p)) * (e.mode === 'return' ? 1.15 : 1);
  if (e.mode === 'advance') {
    if (!rec || rec.done) { raidLeave(p, e, 'over'); return; }
    e.pos = Math.min(STAGE_LEN * 0.6, e.pos + v * dt);
    if (e.pos >= STAGE_LEN * 0.6) { e.foes = [giantFoe(e.raid)]; e.fought = 1; e.cd = {}; e.buffs = []; e.taunt = null; ev(e, 'spawn', { boss: true, name: RAIDS[e.raid].name }); }
  } else {
    e.pos -= v * dt;
    if (e.pos <= 0) arrive(p);
  }
}
