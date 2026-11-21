/* ───────── 1차 직업의 포지션 · 직업특성 · 갈무리 · 함정 · 미믹 · 원정대 (빌드 72 · 11-21 11:30 사용자) ─────────
   · 포지션(선 순서): 전사 → 도적 = 전위 / 궁수 → 마법사 = 중위 / 사제 → 짐꾼 = 후위. 계열(1차 직업)이 정하고 전직해도 그대로다. 앞에 설수록 더 노려진다.
   · 직업특성(변하지 않는다 — 2차 · 3차에서 더해질 수 있다):
     전사  수호자: 아군이 받을 공격을 20%로 대신 받고, 받는 기본 공격 피해 −15% (기사 계열은 2티어: 30% · −25%)
     도적  기습: 싸움의 첫 공격은 치명타 · 기본 공격으로 맨 뒤의 적을 노린다 / 자물쇠 따기: 미믹을 만나면 싸우지 않고 보상 / 함정 해제: 함정 지대를 피해 없이 지난다
     궁수  선제 사격: 싸움이 시작되면 먼저 쏜다 / 엄호 사격: 전위가 맞으면(전위가 없으면 자기보다 앞의 중위가 맞으면) 15%로 기본 공격을 한 번 더 / 정밀 사격: 기본 공격이 적의 회피에 빗나가지 않는다
     마법사 최대 마나 3배 / 마나 공급: 마나가 30% 아래인 동료에게 마나를 나눠 준다 / 무영창: 20초마다 재사용 대기 중인 자기 스킬 하나를 바로 되돌린다(기본 재사용 시간이 가장 긴 스킬부터, 같으면 가장 많이 남은 것)
     사제  정화: 치유 스킬을 받은 대상의 약화 하나 해제 / 축복: 자기보다 앞에 선 동료 중 맨 앞 한 명에게 공격력 · 방어력 +15% (그 동료가 쓰러지면 바로 다음 동료에게)
     짐꾼  적재: 운반 무게(지금 값 그대로) / 갈무리: 쓰러진 몬스터에게서 부속품 · 드랍템을 챙긴다 — 짐꾼 계열이 없으면 전리품을 못 챙긴다
   · 값은 모두 J1 표 (사용자가 정하지 않은 숫자는 내 판단) */
const J1 = {
  cover: [0.2, 0.3], baGuard: [0.15, 0.25], coverShot: 0.15, mpMul: 3,
  feed: { at: 0.3, amt: 0.1, keep: 0.4, cd: 3 }, chant: 20, bless: 1.15, posW: [2, 1, 0.5],
  harv: 1.0, noPorter: { time: 2, rate: 0.3 },          // 사체 하나를 갈무리하는 초 · 짐꾼 계열이 없으면 시간 두 배 · 드랍률 30% (11-21 11:44 사용자)
  trap: { p: 0.06, lo: 0.1, hi: 0.3, hold: 3 },         // 함정 지대: 싸움 자리마다 6% · 최대 체력의 10 ~ 30% · 해제하면 3초 멈춤
  mimic: { p: 0.03, gold: 60, gear: 0.35, hold: 2 }
};
// 약초 군락지 (11-21 13:41 사용자): 약초는 드랍품이 아니다 — 이동 중 싸움 자리에서 소형 10% · 중형 5% · 대형 1%로 군락지를 만나고, 짐꾼 계열(약초꾼)이 그 앞에서 하나씩 캔다
const HERB72 = { on: true, sizes: [['대형', 0.01, 7, 13], ['중형', 0.05, 3, 7], ['소형', 0.10, 1, 3]], per: 0.8, tierW: [1, 0.3, 0.1] };
function herbColony(F, e) {
  let r = rnd(); const S0 = HERB72.sizes.find(z => (r -= z[1]) < 0); if (!S0) return null;
  const hs = herbCands(F.herbs && F.herbs.length ? F : { herbs: ['herb'] }, e); if (!hs.length) return null;   // herb72.js: 피는 약초 · 밤에만 · 구간 조건
  let w = hs.reduce((t, h) => t + herbW(h), 0) * rnd(), id = hs[0];
  for (const h of hs) { w -= herbW(h); if (w < 0) { id = h; break; } }
  return { id, size: S0[0], n: S0[2] + Math.floor(rnd() * (S0[3] - S0[2] + 1)), got: 0 };
}
const J1_ORDER = { warrior: 0, rogue: 1, archer: 2, mage: 3, cleric: 4, porter: 5 };
const POS_NAME = ['전위', '중위', '후위'];
const j1Line = a => jobBase(a.cls);
const j1Ord = a => { const o = J1_ORDER[j1Line(a)]; return o == null ? 3 : o; };
const posOf = a => Math.floor(j1Ord(a) / 2);
const j1Tier = a => (chainOf(a.cls).includes('knight') ? 1 : 0);
const j1Cover = a => Math.max(TR(a).cover || 0, j1Line(a) === 'warrior' ? J1.cover[j1Tier(a)] : 0);
const j1BaGuard = a => (j1Line(a) === 'warrior' ? J1.baGuard[j1Tier(a)] : 0);
const JOB1_TXT = {
  warrior: [['수호자', '아군이 받을 공격을 20% 확률로 대신 받는다 · 받는 기본 공격 피해 −15%']],
  rogue: [['기습', '싸움의 첫 공격은 치명타 · 기본 공격으로 맨 뒤의 적을 노린다'], ['자물쇠 따기', '미믹을 만나면 싸우지 않고 바로 보상을 얻는다'], ['함정 해제', '함정 지대를 피해 없이 지난다']],
  archer: [['선제 사격', '싸움이 시작되면 먼저 쏜다'], ['엄호 사격', '전위가 맞으면 15% 확률로 기본 공격을 한 번 더 (전위가 없으면 앞의 중위가 맞을 때)'], ['정밀 사격', '기본 공격이 적의 회피에 빗나가지 않는다']],
  mage: [['마나 공급', '최대 마나 3배 · 마나가 30% 아래인 동료에게 마나를 나눠 준다'], ['무영창', '20초마다 재사용 대기 중인 자기 스킬 하나를 바로 되돌린다 (재사용 시간이 가장 긴 스킬부터)']],
  cleric: [['정화', '치유 스킬을 받은 대상의 약화 하나를 푼다'], ['축복', '앞에 선 동료 중 맨 앞 한 명의 공격력 · 방어력 +15% (쓰러지면 다음 동료에게)']],
  porter: [['적재', '운반할 수 있는 무게가 크다'], ['약초꾼', '다음 스테이지로 가는 길에 만난 약초 군락지에서 약초를 캔다 (짐꾼 계열이 없으면 지나친다)'], ['갈무리', '쓰러진 몬스터에게서 마정석과 부속품을 챙긴다 (짐꾼 계열이 없으면 아무것도 못 챙긴다)']]
};
function job1Traits(a) { const L = (JOB1_TXT[j1Line(a)] || []).map(x => x.slice()); if (j1Line(a) === 'warrior' && j1Tier(a)) L[0] = ['수호자 2', `아군이 받을 공격을 ${Math.round(j1Cover(a) * 100)}% 확률로 대신 받는다 · 받는 기본 공격 피해 −25%`]; return L; }
const job1Html = a => `<div class="sub"><span class="tag gold-t">${POS_NAME[posOf(a)]}</span> ${job1Traits(a).map(([n, d]) => `<b>${n}</b> <span class="muted">${d}</span>`).join('<br>')}</div>`;
// 궁수 엄호 사격 (hitAdv 끝)
function j1CoverShot(p, e, x, dm) {
  if (e.j1cs) return; const team = teamOf(p).filter(up), foes = e.foes.filter(f => f.hp > 0); if (!foes.length) return;
  const front = team.some(a => posOf(a) === 0);
  for (const a of team) {
    if (a === x || j1Line(a) !== 'archer' || !dm[a.id]) continue;
    if (!(posOf(x) === 0 || (!front && posOf(x) === 1 && j1Ord(x) <= j1Ord(a) && team.indexOf(x) < team.indexOf(a)))) continue;
    const st = e.sta && e.sta[a.id]; if (st && (st.para || isHard(st))) continue;
    if (rnd() < J1.coverShot) { e.j1cs = 1; try { basicAct(e, a, dm[a.id], team, dm, foes); } finally { e.j1cs = 0; } }
  }
}
// 싸움 틱마다: 사제의 축복
function j1Bless(e, team) {
  for (const c of team) {
    if (j1Line(c) !== 'cleric' || !up(c)) continue;
    const sid = 'j1bless' + c.id, tg = team.find(x => up(x) && x !== c && j1Ord(x) < 4), cur = e.buffs.find(b => b.sid === sid);
    if (cur && tg && cur.to === tg.id) continue;
    e.buffs = e.buffs.filter(b => b.sid !== sid);
    if (tg) { e.buffs.push({ stat: 'atk', mult: J1.bless, to: tg.id, t: 9999, sid }, { stat: 'def', mult: J1.bless, to: tg.id, t: 9999, sid }, { stat: 'matk', mult: J1.bless, to: tg.id, t: 9999, sid }); }
  }
}
// 길드원 차례마다: 마법사의 마나 공급 · 무영창
function j1Tick(e, a, d, team, dm, dt, sc) {
  if (j1Line(a) !== 'mage') return; const T = e.j1 || (e.j1 = {});
  T['f' + a.id] = (T['f' + a.id] || 0) + dt;
  if (T['f' + a.id] >= J1.feed.cd && a.mp > d.maxMp * J1.feed.keep) {
    const tg = team.filter(x => x !== a && up(x) && dm[x.id] && x.mp <= dm[x.id].maxMp * J1.feed.at).sort((x, y) => x.mp / dm[x.id].maxMp - y.mp / dm[y.id].maxMp)[0];
    if (tg) { T['f' + a.id] = 0; const v = Math.min(d.maxMp * J1.feed.amt, dm[tg.id].maxMp - tg.mp); tg.mp += v; a.mp -= v; }
  }
  T['c' + a.id] = (T['c' + a.id] || 0) + dt;
  if (T['c' + a.id] >= J1.chant) {
    const k = Object.keys(sc).filter(s => sc[s] > 0 && SKILLS[s]).sort((x, y) => (SKILLS[y].cd || 0) - (SKILLS[x].cd || 0) || sc[y] - sc[x])[0];
    if (k) { T['c' + a.id] = 0; sc[k] = 0; }   // 되돌릴 스킬이 없으면 차 있는 채로 기다린다
  }
}
// 사제의 정화: 치유 스킬을 받은(체력이 오른) 대상의 약화 하나 해제
function j1Cast(e, a, d, sk, team, dm, foes) {
  const on = j1Line(a) === 'cleric' && SKILLS[sk] && SKILLS[sk].kind === 'heal', h0 = on ? team.map(x => x.hp) : null;
  cast(e, a, d, sk, team, dm, foes);
  if (on) team.forEach((x, i) => { if (up(x) && x.hp > h0[i]) cureOne(e, x); });
}
// 갈무리: 싸움 중에 쓰러진 몬스터의 전리품은 사체에 남는다(e.kq → e.corpses) — 싸움이 끝나면 짐꾼 계열이 하나씩 챙긴다
const harvOn = e => e.area === 'field' || e.area === 'dungeon' || e.area === 'trade';
function harvOpen(e) { e.kq = harvOn(e) ? { items: [], gear: [] } : null; }
function harvClose(e) { const C = e.kq; e.kq = null; if (C && (C.items.length || C.gear.length)) (e.corpses = e.corpses || []).push(C); }
// 걷기 전에: 함정 · 자물쇠로 멈춰 있는 시간과 갈무리. 참이면 이번 틱은 걷지 않는다
function j1Hold(p, e, team, dt) {
  if (e.note) { e.note.t -= dt; if (e.note.t <= 0) e.note = null; }
  if (e.hold > 0) { e.hold -= dt; return true; }
  if (e.herbJob) {   // 약초꾼: 군락지 앞에서 하나씩 캔다
    const H = e.herbJob; e.note = { t: 0.6, txt: `${H.size} 군락지 · ${ITEMS[H.id].name} 채취 중 (${H.got}/${H.n})` }; e.hv2 = (e.hv2 || 0) + dt;
    if (e.hv2 >= HERB72.per) { e.hv2 = 0; loot(p, e, H.id, 1); H.got++; if (H.got >= H.n) { log(`${p.name}: ${H.size} 군락지에서 ${ITEMS[H.id].name} ${H.n}개를 캤다.`, 'good'); e.herbJob = null; } }
    return true;
  }
  if (!e.corpses || !e.corpses.length) return false;
  // 11-21 14:59 사용자 「짐꾼 없는 파티는 갈무리를 못 해서 부속품 자체를 못 얻음」(마정석도) — 11:44의 두 배 시간 · 30%는 없앰
  if (!team.some(isPorter)) { e.corpses = []; if (!e.noHarv) { e.noHarv = 1; log(`${p.name}에는 갈무리할 짐꾼이 없어 쓰러뜨린 몬스터의 부속품을 두고 간다.`, 'bad'); HOOKS.toast(`${p.name}: 짐꾼이 없어 부속품을 못 챙겨요`); } return false; }
  const por = team.some(isPorter), NP = J1.noPorter;
  e.note = { t: 0.6, txt: por ? '갈무리 중' : '서툰 갈무리 중' }; e.hv = (e.hv || 0) + dt;
  if (e.hv >= J1.harv * (por ? 1 : NP.time)) { e.hv = 0; const C = e.corpses.shift();
    for (const [it, q] of C.items) { let n = q; if (!por && !ITEMS[it].mj) { n = 0; for (let i = 0; i < q; i++) if (rnd() < NP.rate) n++; } if (n > 0) loot(p, e, it, n); }
    for (const g of C.gear) if (por || rnd() < NP.rate) lootGear(p, e, g);
    herbBloom(p, e, C, team); }   // 갈무리가 끝난 바로 뒤: 핏빛꽃 · 충혼초 (herb72.js)
  return true;
}
// 싸움 자리에 닿았을 때 (core.js stepExp — spawn 대신): 함정 지대 · 미믹 · 보통 싸움
function j1Enc(p, e) {
  const team = teamOf(p).filter(a => !a.down), F = FIELDS[e.field], plain = (e.area === 'field' || e.area === 'dungeon') && e.mode === 'advance' && !(e.next && e.next.some(f => f.boss || f.fb || f.rare || f.nest));
  if (plain) {
    const r = rnd(), rogue = team.find(a => j1Line(a) === 'rogue');
    if (r < J1.trap.p) {
      e.next = null;
      if (rogue) { e.hold = J1.trap.hold; e.note = { t: J1.trap.hold, txt: '함정 해제 중' }; log(`${p.name}: 함정 지대가 있었지만, ${CLASSES[rogue.cls].name} ${rogue.name}이(가) 함정을 능숙하게 해제했다.`, 'good'); HOOKS.toast(`${p.name}: ${rogue.name}이(가) 함정을 해제했다`); }
      else { let worst = 0; team.forEach(a => { const mh = derive(a).maxHp, k = J1.trap.lo + rnd() * (J1.trap.hi - J1.trap.lo); worst = Math.max(worst, k); a.hp = Math.max(1, Math.round(a.hp - mh * k)); });
        e.hold = 1.5; e.note = { t: 1.5, txt: '함정에 걸렸다!' }; log(`${p.name}이(가) 함정 지대에 걸려 모두 다쳤다. (최대 체력의 ${Math.round(worst * 100)}%까지)`, 'bad'); HOOKS.toast(`${p.name}: 함정에 걸렸다!`); }
      changed(); return;
    }
    if (r < J1.trap.p + J1.mimic.p && MONS.mimic) {
      const lv = fieldLv(F, e.stage);
      if (rogue) { e.next = null; e.hold = J1.mimic.hold; e.note = { t: J1.mimic.hold, txt: '자물쇠 따는 중' }; const got = j1MimicReward(p, e, lv); log(`${p.name}: 미믹이 길을 막았지만, ${CLASSES[rogue.cls].name} ${rogue.name}이(가) 자물쇠를 따 버렸다. ${got}`, 'good'); HOOKS.toast(`${p.name}: 미믹의 자물쇠를 땄다`); changed(); return; }
      const f = foeFrom('mimic', lv); f.mimic = 1; e.next = [f];
    }
  }
  spawn(p, e);
  for (const a of team) if (j1Line(a) === 'archer') e.cd[a.id] = 0.05;   // 선제 사격
}
// 약초 군락지: 스테이지에서 다음 스테이지로 걸어가는 길에만 나온다 (11-21 14:59 사용자 「1-1에서 1-2로 걸어가는 중에만」 — core.js stageClear 끝)
function herbWalk(p, e) {
  const F = FIELDS[e.field]; if (!HERB72.on || !F || e.mode !== 'advance' || e.herbJob || !(e.area === 'field' || (F.herbs && F.herbs.length))) return;
  const H = herbColony(F, e); if (!H) return; const team = teamOf(p).filter(a => !a.down);
  if (team.some(isPorter)) { e.herbJob = H; HOOKS.toast(`${p.name}: ${ITEMS[H.id].name} ${H.size} 군락지 발견`); }
  else if (!e.noHerb) { e.noHerb = 1; log(`${p.name}: ${ITEMS[H.id].name} 군락지를 지나쳤다. 약초꾼(짐꾼 계열)이 있어야 캘 수 있다.`, 'bad'); }
}
function j1MimicReward(p, e, lv) {
  const g = Math.round(lv * J1.mimic.gold * (0.8 + rnd() * 0.5)); S.gold += g; S.stats.earned += g; let txt = `${g$(g)}`;
  const F = FIELDS[e.field];
  if (GEAR_DROP_ON && rnd() < J1.mimic.gear) { const kq = e.kq; e.kq = null; const gr = makeGear(dropBase(F.tier || 0), F.tier || 0, rnd() < 0.3 ? 1 : 0); lootGear(p, e, gr); e.kq = kq; txt += ` · 「${gearName(gr)}」`; }
  return txt;
}
/* ───────── 원정대: 더 멀리 가기 위한 큰 파티 (전투원 10 + 짐꾼 2 = 12명) ───────── */
const BIG = { fighters: 10, porters: 2, potions: 100, food: 100 };
const bigParty = () => S.parties.find(p => p.big) || null;
const porterCap = p => (p && p.big ? BIG.porters : 1);
const bigPotions = () => Object.keys(ITEMS).filter(k => ITEMS[k].heal && ITEMS[k].heal >= ITEMS.pot_l.heal).reduce((n, k) => n + (S.inv[k] || 0), 0);
const bigFood = () => Object.keys(ITEMS).filter(k => ITEMS[k].food || ITEMS[k].dish).reduce((n, k) => n + (S.inv[k] || 0), 0);
function bigChecks(p) {
  const ps = portersOf(p), kinds = new Set(ps.map(a => a.cls));
  return [
    [`상급 이상 회복 물약 ${BIG.potions}개 (지금 ${bigPotions()}개)`, bigPotions() >= BIG.potions],
    [`음식 ${BIG.food}개 (지금 ${bigFood()}개)`, bigFood() >= BIG.food],
    [`짐꾼 계열 ${BIG.porters}명 (지금 ${ps.length}명)`, ps.length === BIG.porters],
    ['두 짐꾼의 직업이 서로 달라야 한다', ps.length === BIG.porters && kinds.size === ps.length],
    ['짐꾼 중 한 명은 코네스토가', ps.some(a => chainOf(a.cls).includes('conestoga'))],
    [`전투원 ${BIG.fighters}명까지 (지금 ${fightersOf(p).length}명)`, fightersOf(p).length >= 1 && fightersOf(p).length <= BIG.fighters]
  ];
}
const bigWhy = p => { const bad = bigChecks(p).find(c => !c[1]); return bad ? `원정대 조건: ${bad[0]}` : ''; };
function bigCreate() { if (bigParty()) return; const p = newParty('원정대', []); p.big = true; S.parties.push(p); changed(); }
