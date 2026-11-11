/* ───────── 도감: 몬스터 · 직업 · 스킬 · 부속품 · 장비 · 소모품 ─────────
   몬스터는 잡을수록 정보가 열린다(1·5·15·30마리). 부속품·장비는 한 번 얻으면 열린다. */
Object.assign(WIN_TITLE, { dex: '도감' });
const DEX_TABS = [['mon', '몬스터'], ['pet', '펫'], ['cls', '직업'], ['skill', '스킬'], ['mat', '부속품'], ['gear', '장비'], ['pot', '소모품']];
const DEX_K = [1, 5, 15, 30];   // 잡은 수에 따라 열리는 단계
function dexState() { if (!S.dex) S.dex = { kills: {}, seen: {}, items: {}, gear: {} }; return S.dex; }
const dexKills = id => (S && S.dex && S.dex.kills[id]) || 0;
function dexSeen(id) { dexState().seen[id] = 1; }
function dexKill(id) { const D = dexState(); D.kills[id] = (D.kills[id] || 0) + 1; }
// 희귀종 기록: 반짝이는 개체를 잡은 수. 하나라도 있으면 그 종에게 피해 +15%, 전리품 +25%
const dexRare = id => (S && S.dex && S.dex.rare && S.dex.rare[id]) || 0;
function dexRareKill(id) { const D = dexState(); D.rare = D.rare || {}; D.rare[id] = (D.rare[id] || 0) + 1; }
// 옛 저장: 가 본 필드의 몬스터는 만난 것으로
function dexMigrate() {
  if (S.dex) return;
  const D = dexState();
  for (const fid of ALL_FIELDS) {
    const fs = S.fields[fid], F = FIELDS[fid]; if (!fs || !(fs.best > 0)) continue;
    F.mons.forEach(id => { if (minStage(MONS[id]) <= fs.best) D.seen[id] = 1; });
    if (F.dungeon && fs.cleared) { F.dungeon.mons.forEach(id => { D.seen[id] = 1; }); D.seen[F.dungeon.boss] = 1; }
  }
  if (S.raid) S.raid.list.forEach(r => { if (r.me > 0 || r.done) D.seen[RAIDS[r.id].mon] = 1; });
  dexScan();
}
// 창고·장비를 훑어 본 것으로 표시
function dexScan() {
  const D = dexState();
  for (const k in S.inv) if (S.inv[k] > 0) D.items[k] = 1;
  S.gear.forEach(g => { D.gear[g.base] = 1; });
  S.advs.forEach(a => { for (const [s] of SLOTS) { const g = a.eq[s]; if (g) D.gear[g.base] = 1; } });
}

/* ───────── 그림 ───────── */
const DEXI = {};
function monIconURL(id, dark) {
  const key = id + (dark ? '|d' : '');
  if (DEXI[key]) return DEXI[key];
  const s = PXU[id] ? pxuSprite(id, 'idle', 0) : pxMonSprite(PXM[id] || PXG[id] ? id : 'rat', 0), W = 56, H = 44, [c, x] = mkCanvas(W, H);   // 새 그림(언데드·평원 …)이 있으면 그것으로
  const fit = Math.min((W - 4) / s.w, (H - 4) / s.h), z = fit >= 1 ? Math.floor(fit) : fit;
  x.imageSmoothingEnabled = false;
  x.translate(W / 2, H - 2); x.scale(z, z); x.drawImage(s.cv, -s.w / 2, -s.h);
  if (dark) { x.setTransform(1, 0, 0, 1, 0, 0); x.globalCompositeOperation = 'source-in'; x.fillStyle = '#2a2a34'; x.fillRect(0, 0, W, H); }
  return (DEXI[key] = c.toDataURL());
}
const CLSA = {};
function clsIconURL(cls) {
  if (!CLSA[cls]) CLSA[cls] = { id: 2, cls, look: { hair: HAIRS[2], skin: SKINS[1] }, eq: { weapon: { base: WEAPON_OF[cls] || WEAPON_OF[jobBase(cls)] || 'sword', t: 2, q: 0 } } };
  return portrait(CLSA[cls]);
}

/* ───────── 몬스터 ───────── */
// 몬스터가 나오는 곳과 기준 레벨
function monWhere(id) {
  const out = [];
  for (const fid of ALL_FIELDS) {
    const F = FIELDS[fid];
    if (F.mons.includes(id)) out.push({ fid, where: `${F.name} ${F.no}-${minStage(MONS[id])}~`, lv: fieldLv(F, minStage(MONS[id])) });
    if (F.dungeon && F.dungeon.mons.includes(id)) out.push({ fid, where: F.dungeon.name, lv: dungeonLv(F, 1) });
    if (F.dungeon && F.dungeon.boss === id) out.push({ fid, where: `${F.dungeon.name}의 주인`, lv: F.raid ? F.lv + 14 : dungeonBossLv(F), boss: 1 });
    if (F.bosses) F.bosses.forEach((b, i) => { if (b === id && MONS[id].fb) out.push({ fid, where: `${F.name} ${F.no}-${(i + 1) * 10} ${i === 4 ? '주인' : '우두머리'}`, lv: fieldLv(F, (i + 1) * 10) + 1, fb: i + 1 }); });
  }
  for (const rid of RAID_IDS) if (RAIDS[rid].mon === id) out.push({ fid: 'raid_' + rid, where: `레이드 (${FIELDS[RAIDS[rid].bg].name} 근처)`, lv: RAIDS[rid].lv + 4, raid: rid });
  return out;
}
function dexMonList() {
  const seen = new Set(), order = [];
  const push = id => { if (MONS[id] && !seen.has(id)) { seen.add(id); order.push(id); } };
  for (const fid of ALL_FIELDS) { const F = FIELDS[fid]; F.mons.forEach(push); if (F.bosses) F.bosses.forEach(push); if (F.dungeon) { F.dungeon.mons.forEach(push); push(F.dungeon.boss); } }
  RAID_IDS.forEach(r => push(RAIDS[r].mon));
  return order;
}
function monCard(id) {
  const m = MONS[id], D = dexState(), k = D.kills[id] || 0, seen = !!D.seen[id] || k > 0, where = monWhere(id), lv = where.length ? where[0].lv : 10;
  const lvl = DEX_K.filter(x => k >= x).length;   // 0~4
  if (!seen) return `<div class="li dexm dim"><img class="dexi" src="${monIconURL(id, 1)}" alt=""><div class="grow stack"><span>???</span><span class="sub">${where.length ? esc(where[0].where) : '어딘가'} · 만나면 열려요</span></div></div>`;
  const fbk = where.length && where[0].fb ? where[0].fb : 0, f = fbk ? fieldBoss(FIELDS[where[0].fid], fbk * 10, lv - 1) : foeFrom(id, lv), xp = Math.round(lv * 3 * (fbk ? 8 : m.boss ? 15 : 1));
  const tags = [m.boss && !m.giant ? '<span class="tag gold-t">주인</span>' : '', fbk ? `<span class="tag gold-t">${fbk >= 5 ? '필드의 주인' : '우두머리'}</span>` : '', m.giant ? '<span class="tag red-t">레이드</span>' : '', m.magic ? '<span class="tag">마법</span>' : '', m.aoe ? '<span class="tag">광역</span>' : ''].join('');
  const stats = lvl >= 1 ? `<div class="stats"><span>Lv${lv} 기준</span><span>HP <b>${fmt(f.maxHp)}</b></span><span>공격 <b>${f.atk.toFixed(0)}</b></span><span>방어 <b>${f.def.toFixed(0)}</b></span><span>속도 <b>${m.spd}</b></span>${m.eva ? `<span>회피 <b>${Math.round(m.eva * 100)}%</b></span>` : ''}<span>경험치 <b>${fmt(xp)}</b>${m.boss ? '' : '/마리'}</span></div><div class="sub muted">체력 ×${m.mh} · 공격 ×${m.ma} · 방어 ×${m.md || 0} · 레벨이 오르면 함께 오른다</div>` : `<div class="sub muted">한 마리 잡으면 능력치와 경험치가 열려요.</div>`;
  let drops = '';
  if (lvl >= 2) {
    const rows = (m.drops || []).map(([it, ch, q]) => ITEMS[it] ? `<div class="row sub">${iconImg(it)}<span class="grow">${ITEMS[it].name}${q ? ` ×${q}` : ''}</span><b class="num">${lvl >= 3 ? Math.round(ch * 100) + '%' : '?%'}</b></div>` : '').join('');
    // 빌드 63: 스킬북은 스킬북 단계로 — 그 땅의 단계에 따라 어느 책인지 (우두머리 · 주인은 한 줄 위)
    const bt = where.length && FIELDS[where[0].fid] && FIELDS[where[0].fid].tier != null ? FIELDS[where[0].fid].tier : tierOfLv(lv);
    const mix = m.giant ? [] : tierBookMix(bt, m.boss || fbk), miss = 100 - mix.reduce((x, [, pc]) => x + pc, 0);
    const books = mix.length ? mix.map(([b, pc]) => `<div class="row sub">${iconImg(b)}<span class="grow">${ITEMS[b].name} <span class="muted">· 스킬북 뽑기 때</span></span><b class="num">${lvl >= 3 ? pc + '%' : '?%'}</b></div>`).join('') + (lvl >= 3 ? `<div class="sub muted">스킬북 뽑기는 필드 ${BOOK_RATE.field * 100}% · 던전 ${BOOK_RATE.dungeon * 100}% · 우두머리 ${Math.round(BOOK_RATE.fb * 100)}% · 주인 ${Math.round(BOOK_RATE.boss * 100)}%로 일어나고, 나머지 ${miss}%는 꽝이에요.</div>` : '') : '';
    const SD = STONE_DROP, stoneTxt = kind => `개화석 ${stonePct(SD.bloomstone[kind])}·마법사의 돌 ${stonePct(SD.wizstone[kind])}`;
    const extra = m.giant ? `<div class="sub muted">레이드 등수 보상: ${ITEMS['rp_' + where[0].raid] ? ITEMS['rp_' + where[0].raid].name : '부속품'}, ${ITEMS['rh_' + where[0].raid] ? ITEMS['rh_' + where[0].raid].name : '심장'}, 개화석(1위 ${SD.bloomstone.raidN[0]}·2위 ${SD.bloomstone.raidN[1]}·3위 ${SD.bloomstone.raidN[2]}), 마법사의 돌(1위 ${stonePct(SD.wizstone.raidP[0])}~참가 ${stonePct(SD.wizstone.raidP[3])})</div>` : m.boss && !m.fb ? `<div class="sub muted">던전을 처음 공략하면 보물 상자(장비·스킬북·주인의 혼·룬)와 유물. 주인을 잡을 때마다 ${stoneTxt('boss')}</div>` : `<div class="sub muted">필드에서는 약초 12%${lvl >= 3 ? ', 장비 0.6% (던전 2.5%)' : ''}. 스킬북은 던전 안에서 ${BOOK_RATE.dungeon * 100}%, 우두머리로 나오면 ${Math.round(BOOK_RATE.fb * 100)}%, 주인이면 ${Math.round(BOOK_RATE.boss * 100)}%. 우두머리로 나오면 증표·핵·혼과 ${stoneTxt('fb')}, 필드의 주인이면 ${stoneTxt('lord')}</div>`;
    drops = `<div class="sec" style="margin-top:6px"><b>전리품</b><span>${lvl >= 3 ? '확률' : '15마리부터 확률'}</span></div>${rows || '<div class="sub muted">떨어뜨리는 것 없음</div>'}${books ? `<div class="sub muted" style="margin-top:4px">스킬북</div>${books}` : ''}${extra}`;
  } else drops = `<div class="sub muted">5마리 잡으면 전리품이, 15마리면 확률이 열려요.</div>`;
  const sta = lvl >= 4 ? `<div class="sub ok-t">완전 기록: 이 몬스터에게 주는 피해 +3%${m.sta ? ` · 거는 상태이상: ${STATUS[m.sta.k].name} (${Math.round(m.sta.p * 100)}%)` : ''}</div>` : `<div class="sub muted">30마리 잡으면 완전 기록 (피해 +3%${m.sta ? ', 상태이상 정보' : ''})</div>`;
  const rr = dexRare(id), rareRow = m.boss || m.giant || m.fb ? '' : rr ? `<div class="sub gold-t">★ 희귀종 ${rr}마리 기록: 이 종에게 주는 피해 +${Math.round(RARE.dmg * 100)}% · 전리품 +${Math.round(RARE.drop * 100)}%</div>` : `<div class="sub muted">희귀종(반짝이는 개체, 1/${Math.round(1 / RARE.p)})을 잡으면 이 종에게 피해 +${Math.round(RARE.dmg * 100)}%·전리품 +${Math.round(RARE.drop * 100)}%</div>`;
  return `<details class="card dexm"><summary><span class="row"><img class="dexi" src="${monIconURL(id)}" alt=""><span class="grow stack"><span>${m.name} ${tags}${rr ? ' <span class="tag gold-t">★희귀</span>' : ''}</span><span class="sub">${where.map(w => esc(w.where)).join(' · ') || '?'} · 잡음 <b class="num">${k}</b> · 기록 ${lvl}/4</span></span></span></summary>
    <div class="sub">${monTypes(id).map(t => `<span class="tyt">${MTYPES[t] ? MTYPES[t].name : t}</span>`).join('')} 속성 ${monEls(id).length ? monEls(id).map(elTag).join('·') : '<span class="muted">없음</span>'}${monElNote(id) ? ` <span class="muted">· ${monElNote(id)}</span>` : ''}</div>
    ${monFightRow(id, lvl)}${skinRow(id)}${stats}${drops}${sta}${rareRow}</details>`;
}
// 빌드 63: 공격 속성 · 날아다님 · 몸의 면역 · 몬스터 스킬 · 우두머리 단계
function mskText(s, id) {
  const K = { hit: '한 명', drain: '한 명 · 흡혈', all: '모두', buff: '자기 강화', rally: '동료 모두 강화', heal: s.self ? '자기 회복' : '동료 회복', shield: '보호막', summon: '졸개 부르기' }[s.kind] || '';
  const P = [K], f = { id };
  if (['hit', 'drain', 'all'].includes(s.kind)) { P.push(`×${s.mult}${(s.hits || 1) > 1 ? ' ' + s.hits + '번' : ''}${s.magic ? ' 마법' : ''}`); const el = mskEl(s, f); if (el !== 'none') P.push(elName(el)); }
  const st = mskSta(s, f); if (st && STATUS[st.k]) P.push(`${STATUS[st.k].name} ${Math.round(st.p * 100)}%`);
  if (s.stat) P.push(`${{ atk: '공격', def: '방어', spd: '속도' }[s.stat] || s.stat} ×${s.mul} ${s.dur}초`);
  if (s.pct) P.push(`최대 HP ${Math.round(s.pct * 100)}%`);
  if (s.mon) P.push(s.mon.map(x => (MONS[x] ? MONS[x].name : x)).join('·'));
  P.push(`${s.cd}초마다`);
  return `<div class="row sub"><b>${esc(s.name)}</b><span class="grow muted">${P.filter(Boolean).join(' · ')}</span></div>`;
}
function monFightRow(id, lvl) {
  const m = MONS[id], f = { id }, el = fAtkEl(f), imm = ['undead', 'construct', 'elemental'].some(t => monTypes(id).includes(t));
  const tags = [m.fly ? '<span class="tag">날아다님 · 근접 기본 공격 -30%</span>' : '', imm ? '<span class="tag">중독 · 맹독 · 출혈 면역</span>' : ''].filter(Boolean).join(' ');
  const head = `<div class="sub">공격 속성 ${el !== 'none' ? elTag(el) : '<span class="muted">무속성</span>'}<span class="muted"> · 마법 공격과 광역기에 실린다</span>${tags ? ' ' + tags : ''}</div>`;
  const L = (m.msk || []);
  if (!L.length && !m.boss) return head;
  if (lvl < 2) return head + `<div class="sub muted">5마리 잡으면 스킬이 열려요.</div>`;
  return head + `<div class="sec" style="margin-top:4px"><b>스킬</b><span>${L.length}개</span></div>${L.map(s => mskText(s, id)).join('')}${m.boss || m.giant ? '<div class="sub muted">우두머리: HP 50%에서 분노(공격 속도 ×1.3), 25%에서 마지막 발악(광역기 ↑ · 졸개를 부른다)</div>' : ''}`;
}
// 모습 여럿 (빌드 46: 골렘·바위거인은 만날 때마다 넷 중 하나)
function skinRow(id) {
  const L = typeof PXU_SKIN !== 'undefined' && PXU_SKIN[id]; if (!L) return '';
  return `<div class="sub">모습 ${L.length}가지 <span class="muted">· 만날 때마다 다르다</span></div><div class="row dexskin">${L.map((s, i) => `<span class="stack"><img class="dexi" src="${monIconURL(s)}" alt=""><span class="sub">${esc((PXU_SKIN_NAME[id] || [])[i] || '')}</span></span>`).join('')}</div>`;
}

/* ───────── 직업 ───────── */
function clsCard(c) {
  const C = CLASSES[c], t = jobTier(c), n = S.advs.filter(a => a.cls === c).length, Q = JOB_REQ[t];
  const req = t === 1 ? '선술집에서 고용' : `${CLASSES[C.from].name}에서 전직 · Lv${Q.lv}, ${LICENSE[Q.rank].name} 라이선스, ${fmt(Q.fee)}G${jobReqText(c) ? ` · ${jobReqText(c)}` : ''}`;
  return `<details class="card"><summary><span class="row"><img class="por" src="${clsIconURL(c)}" alt=""><span class="grow stack"><span>${C.name}${tierTag(c)}${n ? ` <span class="tag ok-t">${n}명</span>` : ''}</span><span class="sub">${C.desc}</span></span></span></summary>
    <div class="stats"><span>힘 <b>${C.base.str}</b> +${C.grow.str}/Lv</span><span>체력 <b>${C.base.vit}</b> +${C.grow.vit}/Lv</span><span>민첩 <b>${C.base.agi}</b> +${C.grow.agi}/Lv</span><span>지능 <b>${C.base.int}</b> +${C.grow.int}/Lv</span></div>
    <div class="stats"><span>공격 속도 <b>×${C.spd}</b> (기본 공격 ${Math.round(BASIC_CD / C.spd * 10) / 10}초)</span><span>치명 <b>${Math.round(C.crit * 100)}%</b></span><span>짐 <b>${C.carry}</b></span>${C.salary ? `<span>봉급 <b>${C.salary}G</b></span>` : ''}</div>
    ${trText(c) ? `<div class="sub gold-t">${trText(c)}</div>` : ''}
    ${JOB_TRAITS[c] ? `<div class="sub gold-t">직업 특성 「${JOB_TRAITS[c].name}」 ${JOB_TRAITS[c].desc}</div>` : ''}
    <div class="sub">기본 스킬 「${SKILLS[C.innate] ? SKILLS[C.innate].name : '-'}」 · ${req}</div>
    ${nextJobs(c).length ? `<div class="sub muted">다음 전직: ${nextJobs(c).map(x => CLASSES[x].name).join(' · ')}</div>` : ''}
    ${t === 3 ? `<div class="sub muted">각성하면 「${SKILLS['awk_' + jobBase(c)].name}」</div>` : ''}</details>`;
}

/* ───────── 스킬 ───────── */
const KIND_TXT = { dmg: '물리 피해', mdmg: '마법 피해', heal: '치유', buff: '강화', dot: '지속 피해', taunt: '도발', cure: '해제' };
function skillHow(id) {
  const s = SKILLS[id];
  if (s.awk) return '각성';
  if (Object.values(CLASSES).some(C => C.innate === id)) return '직업 기본';
  return bookSrcText(id) || '스킬북';
}
function skillRow(id) {
  const s = SKILLS[id], who = S.advs.filter(a => a.skills.includes(id)).map(a => a.name), book = S.inv['book_' + id] || 0;
  const from = skillHow(id);
  return `<div class="li${who.length ? ' on' : ''}"><div class="grow stack"><span>${s.name} <span class="muted">· Lv${s.lv} · ${costStr(s)}${s.cd ? ` · 재사용 ${s.cd}초` : ''}</span></span><span class="sub">${s.desc}</span><span class="sub">${skillSpecLine(id)}</span><span class="sub muted">${from}${s.cls.includes('all') ? ' · 누구나' : ` · ${s.cls.map(c => CLASSES[c] ? CLASSES[c].name : c).join('·')}`}${who.length ? ` · 배움: ${who.map(esc).join(', ')}` : ''}${book ? ` · 스킬북 ${book}권` : ''}</span></div></div>`;
}
function dexSkills() {
  const groups = [['warrior', '전사 계열'], ['archer', '궁수 계열'], ['mage', '마법사 계열'], ['cleric', '성직자 계열'], ['rogue', '도적 계열'], ['porter', '짐꾼'], ['all', '누구나']];
  const used = new Set();
  const out = groups.map(([g, name]) => {
    const ids = SKILL_IDS.filter(id => !used.has(id) && (g === 'all' ? SKILLS[id].cls.includes('all') : SKILLS[id].cls.some(c => c === g || jobBase(c) === g))).sort((x, y) => SKILLS[x].lv - SKILLS[y].lv);
    ids.forEach(id => used.add(id));
    return `<details class="card"><summary>${name} <span class="muted">${ids.length}개</span></summary><div class="list">${ids.map(skillRow).join('')}</div></details>`;
  });
  return out.join('');
}

/* ───────── 부속품 · 소모품 ───────── */
const ITEM_FROM = {};
function itemFrom(it) {
  if (ITEM_FROM[it]) return ITEM_FROM[it];
  const out = [];
  for (const id in MONS) for (const d of MONS[id].drops || []) if (d[0] === it) out.push(`${MONS[id].name} ${Math.round(d[1] * 100)}%`);
  if (it === 'herb') out.push('필드에서 싸운 뒤 12%');
  return (ITEM_FROM[it] = out);
}
function matRow(it) {
  const I = ITEMS[it], known = !!dexState().items[it] || (S.inv[it] || 0) > 0;
  if (!known) return `<div class="li dim">${iconImg(it)}<div class="grow stack"><span>???</span><span class="sub muted">${itemFrom(it).length ? '몬스터 전리품' : I.boss ? '필드 보스·던전' : I.raid ? '레이드 보상' : '어딘가에서'} · 얻으면 열려요</span></div></div>`;
  const wants = KINGDOM_IDS.filter(k => KINGDOMS[k].wants.includes(it)).map(k => KINGDOMS[k].name.replace(/ .*/, ''));
  const mats = GTIERS.map((T, i) => (T.mats.includes(it) ? T.name : '')).filter(Boolean);
  return `<div class="li">${iconImg(it)}<div class="grow stack"><span>${I.name} <span class="muted">· ${I.v}G · 무게 ${I.w}</span>${(S.inv[it] || 0) ? ` <span class="tag ok-t">${S.inv[it]}</span>` : ''}</span><span class="sub">${itemFrom(it).join(', ') || (I.boss === 1 ? '우두머리(필드 보스)' : I.boss === 2 ? '필드의 주인' : I.boss === 3 ? '던전 주인·주인을 다시 잡을 때' : I.raid ? '레이드 등수 보상' : '')}</span>${mats.length || wants.length ? `<span class="sub muted">${mats.length ? `장비 재료(${mats.join('·')})` : ''}${mats.length && wants.length ? ' · ' : ''}${wants.length ? `사는 왕국: ${wants.join(', ')}` : ''}</span>` : ''}</div></div>`;
}
function dexMats() {
  const ids = Object.keys(ITEMS).filter(it => { const I = ITEMS[it]; return !I.book && I.btier == null && !I.potion && !I.heal && !I.mana && !I.sup && !I.herb && !it.startsWith('rune_') && !I.runeKind; });   // 스킬북 단계(빌드 63)는 부속품 도감에서 뺀다
  const g1 = ids.filter(it => !ITEMS[it].boss && !ITEMS[it].raid), g2 = ids.filter(it => ITEMS[it].boss), g3 = ids.filter(it => ITEMS[it].raid);
  const known = ids.filter(it => dexState().items[it] || (S.inv[it] || 0) > 0).length;
  const herbs = HERB_IDS.map(it => { const I = ITEMS[it], known = !!dexState().items[it] || (S.inv[it] || 0) > 0, uses = RECIPES.filter(r => r.need[it]).map(r => ITEMS[r.out].name);
    return `<div class="li${known ? '' : ' dim'}">${iconImg(it)}<div class="grow stack"><span>${known ? I.name : '???'} <span class="muted">· ${I.v}G</span>${(S.inv[it] || 0) ? ` <span class="tag ok-t">${S.inv[it]}</span>` : ''}</span><span class="sub">${known ? I.desc || '' : '주우면 열려요'}</span><span class="sub muted">자라는 곳: ${herbFields(it).join(', ') || '상점'}${known && uses.length ? ` · 조제: ${uses.join(', ')}` : ''}</span></div></div>`; }).join('');
  return `<div class="sub muted">${known}/${ids.length} 얻어 봄</div><details class="card" open><summary>몬스터 부속품 <span class="muted">${g1.length}</span></summary><div class="list">${g1.map(matRow).join('')}</div></details><details class="card"><summary>보스 부속품 <span class="muted">${g2.length}</span></summary><div class="list">${g2.map(matRow).join('')}</div></details><details class="card"><summary>레이드 보상 <span class="muted">${g3.length}</span></summary><div class="list">${g3.map(matRow).join('')}</div></details><details class="card"><summary>약초 <span class="muted">${HERB_IDS.length} · 필드에서 싸운 뒤 줍는다</span></summary><div class="list">${herbs}</div></details>`;
}
function dexPots() {
  const ids = SUPPLY_IDS;
  const rows = ids.map(it => { const I = ITEMS[it], r = RECIPES.find(x => x.out === it); return `<div class="li">${iconImg(it)}<div class="grow stack"><span>${I.name} <span class="muted">· ${I.buy ? `사는 값 ${I.buy}G` : `${I.v}G`}</span>${(S.inv[it] || 0) ? ` <span class="tag ok-t">${S.inv[it]}</span>` : ''}</span><span class="sub">${I.heal ? `HP ${Math.round(potionHeal(it))} 회복 (기본 ${I.heal})` : I.mana ? `MP ${I.mana} 회복` : `${cureName(I.cure)} 치료 · ${I.desc || ''}`} · 보급품으로 가져가면 저절로 써요</span>${r ? `<span class="sub muted">조제: ${Object.entries(r.need).map(([m, n]) => `${ITEMS[m].name} ${n}`).join(' · ')} · ${r.fee}G${r.lv > 1 ? ' · 공방 2단계' : ''}</span>` : ''}</div></div>`; }).join('');
  const runes = RUNE_IDS.map(k => `<div class="li">${iconImg(runeId(k, 0))}<div class="grow stack"><span>${RUNES[k].name}의 룬 <span class="muted">· 하급·중급·상급</span></span><span class="sub">${RUNES[k].desc || '장비 룬 칸에 새긴다'}</span></div></div>`).join('');
  return `<div class="list">${rows}</div><div class="sec"><b>룬</b><span>대장간에서 장비에 새겨요</span></div><div class="list">${runes}</div>`;
}

/* ───────── 장비 ───────── */
function dexGear() {
  const D = dexState();
  const tiers = `<div class="card"><div class="h">단계</div>${GTIERS.map((T, i) => `<div class="stack sub" style="margin-bottom:4px"><span><b style="color:${TIER_COLORS[i]}">${T.name}</b> · Lv${T.lv}~ · 힘 ×${T.p}</span><span class="muted">재료 ${T.mats.map(m => ITEMS[m].name).join(' · ')}</span></div>`).join('')}</div>`;
  const quals = `<div class="card"><div class="h">등급</div><div class="row wrap">${QUALITY.map((q, i) => `<span class="tag" style="color:${q.c}">${q.name} ×${q.m} · 룬 ${i}칸</span>`).join(' ')}</div><div class="sub muted">희귀부터 보너스 능력치가 붙고, 등급이 높을수록 여러 개·더 크게.</div></div>`;
  const rows = Object.keys(GTYPES).map(b => { const G = GTYPES[b], known = !!D.gear[b];
    const st = Object.entries(G.st).map(([k, v]) => `${STAT_NAMES[k] || k} ${PCT_STATS.includes(k) ? `+${(v * 100).toFixed(1)}%` : `+${v}`}/단계힘`).join(', ');
    return `<div class="li${known ? '' : ' dim'}">${gImg({ base: b, t: 0, q: 0, runes: [] })}<div class="grow stack"><span>${known ? G.name : '???'} <span class="muted">· ${SLOTS.find(s => s[0] === G.slot)[1]} · 무게 ${G.w}${G.arena ? ' · <span class="gold-t">투기장 전용</span>' : ''}</span></span><span class="sub">${known ? st : '한 번 얻으면 열려요'}</span><span class="sub muted">${G.cls.includes('all') ? '누구나' : G.cls.map(c => CLASSES[c] ? CLASSES[c].name : c).join('·')} · 재료 단단 ${G.mat[0]}·질긴 ${G.mat[1]}·마력 ${G.mat[2]}</span></div></div>`; }).join('');
  return tiers + quals + `<div class="sec"><b>장비 종류</b><span>${Object.keys(D.gear).length}/${Object.keys(GTYPES).length} 얻어 봄</span></div><div class="list">${rows}</div>`;
}

function dexSub() {
  const D = dexState(), ids = dexMonList(), seen = ids.filter(id => D.seen[id] || D.kills[id]).length, full = ids.filter(id => (D.kills[id] || 0) >= DEX_K[3]).length;
  return `몬스터 ${seen}/${ids.length} 만남 · 완전 기록 ${full} · 직업·스킬·부속품·장비`;
}
/* ───────── 펫 ───────── */
function dexPets() {
  const D = dexState(), known = D.pets || {};
  const rows = PET_IDS.map(k => { const P = PETS[k], seen = !!known[k] || (S.pets || []).some(x => x.kind === k), own = (S.pets || []).filter(x => x.kind === k).length, egg = S.inv['egg_' + k] || 0;
    return `<div class="li${seen ? '' : ' dim'}"><img class="dexi" src="${monIconURL('pet_' + k, !seen)}" alt=""><div class="grow stack"><span>${seen ? P.name : '???'}${own ? ` <span class="tag ok-t">${own}마리</span>` : ''}${egg ? ` <span class="tag">알 ${egg}</span>` : ''}</span><span class="sub">${seen ? `${PET_ACT_NAME[P.act]} · ${P.desc}` : '알을 부화시키면 열려요'}</span><span class="sub muted">알: ${FIELDS[P.field] ? FIELDS[P.field].name : '?'}의 우두머리·던전 주인${seen ? ` · 진화 ${P.evo} · 상단에 두면 ${petHomeText(k)} · 먹이 ${P.likes.map(it => ITEMS[it].name).join('·')}` : ''}</span></div></div>`; }).join('');
  return `<div class="sub muted">${PET_IDS.filter(k => known[k] || (S.pets || []).some(x => x.kind === k)).length}/${PET_IDS.length} 길러 봄 · 파티마다 한 마리 · Lv${PET_EVO_LV} 진화 · 호감도가 차면 특성</div><div class="list">${rows}</div>`;
}
/* ───────── 창 ───────── */
PANELS.dex = () => {
  dexScan();
  const tab = UI.dexTab || 'mon', D = dexState();
  const bar = `<div class="tabs">${DEX_TABS.map(([id, n]) => `<button type="button" class="tab${tab === id ? ' on' : ''}" data-act="dextab" data-id="${id}">${n}</button>`).join('')}</div>`;
  let body = '';
  if (tab === 'mon') { const ids = dexMonList(), seen = ids.filter(id => D.seen[id] || D.kills[id]).length, full = ids.filter(id => (D.kills[id] || 0) >= 30).length; body = `<div class="sub muted">만남 ${seen}/${ids.length} · 완전 기록 ${full}/${ids.length} · 잡을수록 능력치·경험치·전리품·확률이 열려요</div>${ids.map(monCard).join('')}`; }
  else if (tab === 'cls') { const tiers = [1, 2, 3]; body = tiers.map(t => `<div class="sec"><b>${t}차 직업</b><span>${Object.keys(CLASSES).filter(c => jobTier(c) === t).length}개</span></div>` + Object.keys(CLASSES).filter(c => jobTier(c) === t).map(clsCard).join('')).join(''); }
  else if (tab === 'pet') body = dexPets();
  else if (tab === 'skill') body = dexSkills();
  else if (tab === 'mat') body = dexMats();
  else if (tab === 'gear') body = dexGear();
  else body = dexPots();
  return bar + body;
};
Object.assign(ACT, { dextab: d => { UI.dexTab = d.id; const top = winTop(); if (top) top.tab = d.id; renderPanel(true); $('panel') && ($('panel').scrollTop = 0); } });
