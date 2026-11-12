/* ───────── 빌드 63: 창고 여럿 · 창고 정리 · 직업별 장비 칸 · 대장간 합성 · 스킬북 펼치기 (data-store.js) ───────── */

/* ── 창고 상태 ── */
function whState() {
  if (!S.wh || S.wh.length !== WH_N) { const old = S.wh || []; S.wh = Array.from({ length: WH_N }, (_, i) => old[i] || { inv: {}, gear: [] }); }
  return S.wh;
}
const whOpenN = () => WH_OPEN[Math.max(0, Math.min(WH_OPEN.length - 1, S.rank || 0))];
const bagOf = i => (i < 0 ? S.inv : whState()[i].inv);
const gearOf = i => (i < 0 ? S.gear : whState()[i].gear);
const kindsOf = bag => Object.keys(bag).filter(k => ITEMS[k] && bag[k] > 0).length;
const whUsed = i => kindsOf(bagOf(i)) + gearOf(i).length;
const whCap = i => (i < 0 ? WH_MAIN_CAP + (S.whPlus || 0) : WH_CAP);   // 왕실 창고 증서만큼 메인이 넓어진다
const whFree = i => whCap(i) - whUsed(i);
const whName = i => (i < 0 ? '메인 창고' : `창고 ${i + 1}`);
// 상단 전용 물건 그림 (10×10, ICON_PX 글자)
Object.assign(ICON_PX, {
  compass: ["....kk....", "...k..k...", "..kkbbkk..", ".kbppppbk.", "kbppppGrbk", "kbpppkrpbk", "kbppGkppbk", "kbpGppppbk", ".kbbppbbk.", "..kkkkkk.."],
  coin: ["..........", "...kkkk...", "..kllll#k.", ".kll##l#dk", ".kl#dd##dk", ".kl#d###dk", ".k##dd##dk", "..k#####k.", "...kddkk..", ".........."],
  charm: ["....kk....", "...k..k...", "....kk....", "...kbbk...", "..kb##bk..", ".kb#pp#bk.", ".kb#pw#bk.", "..kb##bk..", "...kbbk...", "....kk...."],
  bait: ["......k...", ".....kGk..", "...kkkGk..", "..kll#kk..", ".kl###dk..", ".k####dk..", "..k##dk.b.", "...kdk.bsb", "...kGk..b.", "....k....."],
  flag: [".kk.......", ".kwkkkkkk.", ".kwk####kk", ".kwkbbbb#k", ".kwk####k.", ".kwkd##kk.", ".kwkkkk.k.", ".kwk......", ".kwk......", ".kkk......"],
  laurel: ["..........", ".k......k.", "k#k....k#k", "k#lk..kl#k", ".k#lk.k##k", ".k##kk##k.", "..k##d#k..", "..kkbbkk..", "..kb..bk..", "..kk..kk.."],
  deed: ["..........", ".kkkkkkkk.", "kpppppppsk", "kpggggppsk", "kpppppppsk", "kpgggg#psk", "kppppp#rrk", ".kkkkk#rrk", "......k##k", ".......kk."],
  seal: ["...kkkk...", "..k####k..", ".k#lbb#dk.", ".k#bbbbdk.", ".k#dbbddk.", "..kddddk..", "...k##k...", "..k#kk#k..", "..k#k.k#k.", "..kk...kk."],
  dew: ["....kk....", "...kGGk...", "...k##k...", "..k#ll#k..", ".k#l####k.", ".k#l###dk.", ".k#####dk.", "..k###dk..", "...kddk...", "....kk...."],
  catalyst: ["...kwwk...", "...kwwk...", "....kk....", "...ksGk...", "..ksGGsk..", ".ks####sk.", ".ks#ll#sk.", ".ks###dsk.", "..kssssk..", "...kkkk..."],
  bell: ["....kk....", "...kwwk...", "...k##k...", "..k#l##k..", "..k#l##k..", ".k#l####k.", ".k######k.", "kddddddddk", ".kkk##kkk.", "....kk...."]
});
// 메인 창고 자리 (사용자 「넘치면 못 얻게」): 사기 · 제작 · 장비 빼기 같은 일은 자리가 없으면 막는다
// 같은 물건이 있으면 쌓이고, 새 종류 · 장비 한 점은 빈 칸 하나. freed = 이 일로 다 써서 비는 칸 수
function roomItem(k, freed) { return (S.inv[k] || 0) > 0 || whFree(-1) + (freed || 0) > 0; }
function roomGear(n, freed) { return whFree(-1) + (freed || 0) >= (n == null ? 1 : n); }
function freedBy(need) { return Object.entries(need || {}).filter(([k, q]) => (S.inv[k] || 0) > 0 && (S.inv[k] || 0) <= q).length; }
// 받을 수밖에 없는 것(원정 짐 · 보상 · 떠난 모험가의 장비 · 경매 낙찰 · 수거소)은 메인 → 열린 창고 1~10 → 그래도 자리가 없으면 못 가져온다
// (사용자 11-11 13:03 「드랍된 걸 못 가지고 옴」 — 길드에 팔아 돈으로 바꾸던 것을 없앴다). quiet면 알림을 부른 쪽이 모아서 낸다
function stashLost(name, q) {
  S.stats.lost = (S.stats.lost || 0) + (q || 1);
  log(`창고마다 빈 칸이 없어 ${name}${q > 1 ? ` ${q}개` : ''}을(를) 못 가져왔다. 창고를 정리해 주세요.`, 'bad');
  HOOKS.toast(`창고가 가득 차서 ${name}을(를) 못 가져왔어요`);
}
function stashItem(k, q, quiet) {
  if (!ITEMS[k] || !(q > 0)) return 'none';
  if ((S.inv[k] || 0) > 0 || whFree(-1) > 0) { addTo(S.inv, k, q); return 'main'; }
  const W = whState();
  for (let i = 0; i < whOpenN(); i++) if ((W[i].inv[k] || 0) > 0 || whFree(i) > 0) { addTo(W[i].inv, k, q); return 'wh' + i; }
  if (!quiet) stashLost(ITEMS[k].name, q); else S.stats.lost = (S.stats.lost || 0) + q;
  return 'lost';
}
function stashGear(g, quiet) {
  if (whFree(-1) > 0) { S.gear.push(g); return 'main'; }
  const W = whState();
  for (let i = 0; i < whOpenN(); i++) if (whFree(i) > 0) { W[i].gear.push(g); return 'wh' + i; }
  if (!quiet) stashLost(`「${gearName(g)}」`, 1); else S.stats.lost = (S.stats.lost || 0) + 1;
  return 'lost';
}
// 원정 짐 풀기 (core.js arrive): 넘친 것은 창고 1~10으로, 그래도 없으면 못 가져온다 — 알림 한 줄씩
function unloadBag(p, bag, gear, sup) {
  const moved = {}, lost = [], AS = S.autoSell || {};
  for (const [k, q] of Object.entries(sup || {})) { if (stashItem(k, q, true) === 'lost') lost.push(ITEMS[k].name); }   // 남은 보급품
  for (const [k, q] of Object.entries(bag)) {
    if (AS[k] != null || S.reqs.some(r => r.item === k)) { addTo(S.inv, k, q); continue; }   // 자동 판매 · 의뢰품은 메인 창고로 (곧 팔거나 전달한다)
    const r = stashItem(k, q, true);
    if (r === 'lost') lost.push(ITEMS[k].name); else if (r.startsWith('wh')) moved[r] = (moved[r] || 0) + 1;
  }
  for (const g of gear) { const r = stashGear(g, true); if (r === 'lost') lost.push(`「${gearName(g)}」`); else if (r.startsWith('wh')) moved[r] = (moved[r] || 0) + 1; }
  const mv = Object.entries(moved).map(([w, n]) => `${whName(+w.slice(2))} ${n}칸`);
  if (mv.length) log(`메인 창고가 가득 차서 ${p.name}의 짐 일부를 ${mv.join(' · ')}에 넣었다.`, 'bad');
  if (lost.length) {
    log(`창고마다 빈 칸이 없어 ${p.name}의 짐 ${lost.length}가지(${lost.slice(0, 4).join(', ')}${lost.length > 4 ? ' …' : ''})를 못 가져왔다. 창고를 정리해 주세요.`, 'bad');
    HOOKS.toast(`창고가 가득 차서 ${lost.length}가지를 못 가져왔어요`);
  }
}
// 옮기기: from · to = -1(메인) 또는 0~9
function whMoveItem(k, q, from, to) {
  if (from === to || !ITEMS[k]) return '';
  if (to >= whOpenN() || from >= whOpenN()) return '아직 열리지 않은 창고예요.';
  const A = bagOf(from), B = bagOf(to), n = Math.min(q, A[k] || 0);
  if (n <= 0) return '';
  if (!((B[k] || 0) > 0) && whFree(to) <= 0) return `${whName(to)}에 빈 칸이 없어요.`;
  addTo(A, k, -n); addTo(B, k, n);
  changed(); return `${ITEMS[k].name} ${n}개를 ${whName(to)}에 옮겼어요.`;
}
function whMoveGear(id, from, to) {
  if (from === to) return '';
  if (to >= whOpenN() || from >= whOpenN()) return '아직 열리지 않은 창고예요.';
  const A = gearOf(from), i = A.findIndex(g => g.id === id);
  if (i < 0) return '';
  if (whFree(to) <= 0) return `${whName(to)}에 빈 칸이 없어요.`;
  const [g] = A.splice(i, 1); gearOf(to).push(g);
  changed(); return `${gearName(g)}을(를) ${whName(to)}에 옮겼어요.`;
}
// 창고 정리: 레어도 높은 것부터 (같으면 값 · 이름)
function whSort(i) { whSortRaw(i); changed(); return `${whName(i)}를 레어도 순서로 정리했어요.`; }
function whSortRaw(i) {
  const bag = bagOf(i), ks = Object.keys(bag).filter(k => ITEMS[k]).sort((a, b) => itemGrade(b) - itemGrade(a) || ITEMS[b].v - ITEMS[a].v || ITEMS[a].name.localeCompare(ITEMS[b].name, 'ko'));
  const vals = ks.map(k => bag[k]); ks.forEach(k => { delete bag[k]; }); ks.forEach((k, j) => { bag[k] = vals[j]; });
  gearOf(i).sort((x, y) => (y.q || 0) - (x.q || 0) || y.t - x.t || gearValue(y) - gearValue(x));
}
// 장비 직업 칸: 그 계열이 낄 수 있는 장비 (여러 계열이 쓰면 그 칸마다)
const WH_JOBS = [['all', '전체'], ['warrior', '전사'], ['archer', '궁수'], ['mage', '마법사'], ['cleric', '성직자'], ['rogue', '도적'], ['porter', '짐꾼'], ['any', '공용']];
const gearFams = g => { const cl = GTYPES[g.base].cls; return cl.includes('all') ? ['any'] : [...new Set(cl.map(c => (CLASSES[c] ? jobBase(c) : c)))]; };
const gearInJob = (g, j) => j === 'all' || gearFams(g).includes(j);
const rq = g => ` rq${Math.max(0, Math.min(GRADE_MAX, g))}`;

/* ── 창고 창 ── */
PANELS.inv = () => {
  whState();
  while (S.shop.slots.length < slotCount()) S.shop.slots.push(null);
  const W = UI.wh != null && UI.wh < whOpenN() ? UI.wh : -1, open = whOpenN();
  const side = `<nav class="whside" aria-label="창고 고르기">${[-1].concat(Array.from({ length: WH_N }, (_, i) => i)).map(i => {
    const lock = i >= open, on = i === W, used = lock ? 0 : whUsed(i), cap = whCap(i), full = used >= cap;
    return `<button type="button" class="whb${on ? ' on' : ''}${lock ? ' lock' : ''}${full ? ' full' : ''}" data-act="whsel" data-i="${i}"${lock ? ` title="${RANKS[whOpenAt(i)] ? RANKS[whOpenAt(i)].name + '랭크에 열려요' : ''}"` : ''}><b>${i < 0 ? '메인' : i + 1}</b><small>${lock ? `${RANKS[whOpenAt(i)] ? RANKS[whOpenAt(i)].name : 'S'}랭크` : `${used}/${cap}`}</small></button>`; }).join('')}</nav>`;
  return `<div class="whwrap">${side}<div class="whmain">${W < 0 ? whMainBody() : whSubBody(W)}</div></div>`;
};
// 고른 칸의 정보창: 창 아래에 붙어 바로 보이고 「닫기」로 접는다 (사용자 11-11 「장비 선택시 정보창 바로 보이게 · 닫기 버튼」)
const whPop = (html, key) => (UI.invPop === key ? `<div class="ipop" role="dialog" aria-label="고른 칸 정보"><div class="ipop-h"><b>고른 칸</b><button type="button" class="btn sm" data-act="invpop">닫기 ✕</button></div>${html}</div>` : '');
const whCapLine = i => { const u = whUsed(i), c = whCap(i); return `<span class="${u > c ? 'red-t' : u >= c ? 'warn' : ''}">${whName(i)} ${u}/${c}칸${u > c ? ' · 넘침 — 새 물건은 다른 창고로 가요' : ''}</span>`; };
const whSortBtn = i => `<button type="button" class="btn sm${UI.whMulti ? ' on' : ''}" data-act="whmulti">여러 개 고르기</button><button type="button" class="btn sm" data-act="whsort" data-i="${i}">창고 정리 (레어도순)</button>`;
function whTabs(tab, count, withStand) {
  return `<div class="tabs inv">${(withStand ? [['stand', '진열대']] : []).concat(INV_CATS).map(([id, n]) => `<button type="button" class="tab${tab === id ? ' on' : ''}" data-act="invtab" data-id="${id}">${n}${count[id] ? `<small>${count[id]}</small>` : ''}</button>`).join('')}</div>`;
}
const whGems = g => (g >= 4 ? '<i class="gem g1"></i>' : '') + (g >= 5 ? '<i class="gem g2"></i>' : '') + (g >= 6 ? '<i class="gem g3"></i>' : '');   // 레어도 보석 (영웅 하나는 ::before)
const whPicked = k => UI.whMulti && (UI.whPick || []).includes(k);
const whCell = (k, inner, q, on, g, extra) => `<button type="button" class="cell${on && !UI.whMulti ? ' on' : ''}${whPicked(k) ? ' pick' : ''}${q === 0 ? ' zero' : ''}${rq(g)}" data-act="invsel" data-id="${k}">${inner}${q != null ? `<b class="qty">${q}</b>` : ''}${extra || ''}${whPicked(k) ? '<i class="pk">✓</i>' : ''}</button>`;
function whPad(cells, min) { const n = Math.max(0, (min || 25) - cells.length) + ((5 - (Math.max(cells.length, min || 25) % 5)) % 5); for (let i = 0; i < n; i++) cells.push(`<span class="cell empty">${rqEmpty(2)}</span>`); return cells; }
function whJobChips(list) {
  const j = UI.invJob || 'all';
  return `<div class="btns whjobs">${WH_JOBS.map(([id, n]) => { const c = list.filter(g => gearInJob(g, id)).length; return `<button type="button" class="btn sm${j === id ? ' on' : ''}" data-act="invjob" data-id="${id}">${n}${c ? ` <small>${c}</small>` : ''}</button>`; }).join('')}</div>`;
}
// 옮길 곳 고르기 줄 (고른 칸의 물건 · 장비)
function whMoveRow(from, kind, id, have, extra) {
  const open = whOpenN(), dests = [-1].concat(Array.from({ length: open }, (_, i) => i)).filter(i => i !== from);
  if (!dests.length) return '';
  const to = dests.includes(UI.whTo) ? UI.whTo : dests[0];
  const chips = dests.map(i => `<button type="button" class="btn sm${i === to ? ' on' : ''}" data-act="whto" data-i="${i}">${i < 0 ? '메인' : i + 1}<small>${whFree(i)}</small></button>`).join('');
  const go = kind === 'gear' ? `<button type="button" class="btn sm gold" data-act="whmvg" data-id="${id}" data-f="${from}" data-t="${to}">${whName(to)}로 옮기기</button>`
    : `<button type="button" class="btn sm gold" data-act="whmv" data-k="${id}" data-q="1" data-f="${from}" data-t="${to}">1개</button>${have >= 10 ? `<button type="button" class="btn sm gold" data-act="whmv" data-k="${id}" data-q="10" data-f="${from}" data-t="${to}">10개</button>` : ''}<button type="button" class="btn sm gold" data-act="whmv" data-k="${id}" data-q="${have}" data-f="${from}" data-t="${to}">모두 옮기기</button>`;
  return `<div class="sec" style="margin-top:6px"><b>옮기기</b><span>숫자는 빈 칸</span></div><div class="btns whto">${chips}</div><div class="btns">${go}${extra || ''}</div>`;
}
// 여러 개 고르기 (사용자 11-11 「다른 창고 옮기는 방법 추가」): 칸을 눌러 고르고 한꺼번에 옮긴다 — 칸을 왼쪽 창고 띠로 끌어 놓아도 된다
function whPickBar(from, keys) {
  if (!UI.whMulti) return '';
  const pick = (UI.whPick || []).filter(k => keys.includes(k)), open = whOpenN(), dests = [-1].concat(Array.from({ length: open }, (_, i) => i)).filter(i => i !== from);
  const to = dests.includes(UI.whTo) ? UI.whTo : dests[0];
  const chips = dests.map(i => `<button type="button" class="btn sm${i === to ? ' on' : ''}" data-act="whto" data-i="${i}">${i < 0 ? '메인' : i + 1}<small>${whFree(i)}</small></button>`).join('');
  return `<div class="card hl whpick"><div class="row sub"><span class="grow">고른 칸 <b>${pick.length}</b> / ${keys.length} · 칸을 눌러 고르거나 빼요</span><button type="button" class="btn sm" data-act="whpickall" data-f="${from}">${pick.length === keys.length && keys.length ? '모두 빼기' : '모두 고르기'}</button></div>
    ${dests.length ? `<div class="btns whto">${chips}</div><div class="btns"><button type="button" class="btn sm gold" data-act="whmvsel" data-f="${from}" data-t="${to}"${pick.length ? '' : ' disabled'}>고른 ${pick.length}칸을 ${whName(to)}로 옮기기</button></div>` : '<div class="sub muted">옮길 다른 창고가 아직 없어요.</div>'}
    <div class="sub muted">칸을 꾹 눌러(마우스는 끌어서) 왼쪽 창고 번호에 놓아도 옮겨져요.</div></div>`;
}
function whMoveKeys(keys, from, to) {
  let moved = 0, left = 0;
  for (const k of keys) {
    let r;
    if (k[0] === 'g' && /^g\d+$/.test(k)) r = whMoveGear(+k.slice(1), from, to);
    else r = whMoveItem(k, (bagOf(from)[k] || 0), from, to);
    if (r && /옮겼어요/.test(r)) moved++; else left++;
  }
  UI.whPick = (UI.whPick || []).filter(k => !keys.includes(k) || left);
  if (!moved) return left ? `${whName(to)}에 빈 칸이 없어요.` : '';
  return `${moved}칸을 ${whName(to)}로 옮겼어요.${left ? ` (${left}칸은 자리가 없어 그대로)` : ''}`;
}
function whGearDetail(g, from) {
  const top = `<div class="row">${gArt(g, 2)}<div class="grow stack"><span>${gearName(g)} ${qTag(g)}${runeDots(g)}</span><span class="sub">${statLine(gearStats(g))}${isAmmo(g) ? ` · ${fmt(ammoMax(g))}${ammoUnit(g)} 담음` : ''}</span>${isUniq(g) ? `<span class="sub">${GTYPES[g.base].name}${twoHand(g) ? ' · 두 손 (부장비를 함께 못 낌)' : ''} — ${esc(uniqDesc(g))}</span>` : ''}${GTYPES[g.base].desc ? `<span class="sub">${GTYPES[g.base].desc}</span>` : ''}<span class="sub muted">${gearWho(g.base)} · Lv${GTIERS[g.t].lv}+ · 무게 ${GTYPES[g.base].w}${fuseCatOf(g) ? ` · 합성 갈래 ${FUSE_CAT[fuseCatOf(g)]}` : ''}</span></div></div>`;
  if (from >= 0) return `<div class="card hl idet">${top}${whMoveRow(from, 'gear', g.id)}</div>`;
  // 빌드 64 (사용자 11-11 19:28 그림): 강화 · 합성 · 재감정 · 룬 새기기는 창고에서 빼고 각 시설에서만 — 팔기는 옮기기 단추 옆으로
  const bonus = (g.q || 0) >= 2 ? `<div class="sub">보너스 옵션: ${statLine(g.bonus || {}) || '없음'} <span class="muted">· 재감정은 마탑에서</span></div>` : '';
  const sell = `<button type="button" class="btn sm" data-act="sellgear" data-id="${g.id}">팔기 ${fmt(Math.round(gearValue(g) * GEAR_SELL))}G</button>`;
  return `<div class="card hl idet">${top}${bonus}${whMoveRow(-1, 'gear', g.id, 0, sell) || `<div class="btns">${sell}</div>`}</div>`;
}
function whMainBody() {
  const tab = UI.invTab || 'mat', rate = guildRate();
  const keys = cat => Object.keys(S.inv).filter(k => ITEMS[k] && S.inv[k] > 0 && itemCat(k) === cat);
  const count = Object.assign(Object.fromEntries(INV_CATS.map(([id]) => [id, id === 'gear' ? S.gear.length : keys(id).length])), { stand: S.shop.slots.filter(Boolean).length });
  const head = `<div class="row sub whhead"><span class="grow">${whCapLine(-1)}</span>${tab !== 'stand' ? whSortBtn(-1) : ''}</div>`;
  if (tab === 'stand') return head + whTabs(tab, count, true) + invStands();
  let cells = [], detail = '', jobs = '';
  const sel = UI.invSel;
  if (tab === 'gear') {
    jobs = whJobChips(S.gear);
    const gear = S.gear.filter(g => gearInJob(g, UI.invJob || 'all'));
    const g = gear.find(x => 'g' + x.id === sel) || null;
    cells = gear.map(x => whCell('g' + x.id, gArt(x, 2), null, g && x.id === g.id, x.q || 0, ''));
    detail = g ? whPop(whGearDetail(g, -1), 'g' + g.id) : gear.length ? '' : '<div class="card"><div class="sub">이 칸에 보관 중인 장비가 없어요. 대장간에서 만들거나 원정에서 주워 와요.</div></div>';
  } else {
    const list = tab === 'sup' ? SUPPLY_IDS.concat(keys('sup').filter(k => !SUPPLY_IDS.includes(k))) : keys(tab);
    const k = list.includes(sel) ? sel : null;
    cells = list.map(x => whCell(x, iArt(x, 2), S.inv[x] || 0, x === k, itemGrade(x)));
    detail = k ? whPop(invDetail(k, rate) + ((S.inv[k] || 0) > 0 ? `<div class="card idet">${whMoveRow(-1, 'item', k, S.inv[k])}</div>` : ''), k) : list.length ? '' : `<div class="card"><div class="sub">${{ mat: '창고가 비어 있어요. 원정을 보내 부속품을 모아 오세요.', herb: '아직 약초가 없어요. 필드에서 싸운 뒤 가끔 주워 와요.', book: '스킬북이 없어요. 몬스터 · 던전 보물 상자 · 도서관 · 투기장 · 암시장 · 왕국 상단에서 스킬북 단계(찢어진 ~ 신비한)를 얻어 펼쳐요.', rune: '룬이 없어요. 필드 보스와 던전에서 떨어져요.', food: '도시락이 없어요. 주방을 지으면 재료로 만들 수 있어요.', trade: '교역품이 없어요. 교역로로 이웃 나라에 가면 특산물을 싸게 사 와요.' }[tab] || ''}</div></div>`;
  }
  const info = { mat: `부속품 ${count.mat}종 · 기준가 ${fmt(keys('mat').reduce((t, k) => t + ITEMS[k].v * S.inv[k], 0))}G어치 · 길드는 ${Math.round(rate * 100)}%에 사요 · 테두리 색 = 레어도(제작에 들어가는 곳)`, herb: `약초 ${count.herb}종 · 처치와 연금술 공방 조제에 써요`, sup: '물약·치료 소모품 · 원정 보급품으로 가져가면 저절로 써요', book: `스킬북 ${count.book}종 · 스킬북 단계(찢어진 · 낡은 · 빛바랜 · 신비한 …)를 펼치면 그 차수 스킬북 하나가 나와요 · 모험가 창 → 스킬에서 배워요`, rune: `룬 ${count.rune}종 · 장비의 룬 칸에 새겨요`, gear: `장비 ${count.gear}점 · 같은 레어도 9점을 대장간에서 합성하면 다음 레어도로`, food: '도시락과 요리 재료 · 주방에서 만들고 원정대 창에서 골라요', trade: `교역품 ${count.trade}종 · 상점에 진열하거나 원하는 나라에 팔면 남아요` }[tab];
  const bulk = tab === 'mat' && bulkMats().length ? `<div class="btns"><button type="button" class="btn sm" data-act="sellallmat">부속품 모두 팔기 · 약 ${g$(bulkMatValue())}</button></div>` : tab === 'gear' && bulkGears().length ? `<div class="btns"><button type="button" class="btn sm" data-act="selllowgear">일반·고급 장비 ${bulkGears().length}점 모두 팔기</button><button type="button" class="btn sm" data-act="autoeqall">모두 자동 장착</button></div>` : '';
  if (UI.whMulti) detail = whPickBar(-1, tab === 'gear' ? S.gear.filter(g => gearInJob(g, UI.invJob || 'all')).map(g => 'g' + g.id) : (tab === 'sup' ? SUPPLY_IDS.concat(keys('sup').filter(k => !SUPPLY_IDS.includes(k))) : keys(tab)).filter(k => (S.inv[k] || 0) > 0));
  return `${head}${whTabs(tab, count, true)}<div class="sub muted">${info || ''}</div>${bulk}${jobs}<div class="igrid ${tab}" data-wh="-1">${whPad(cells).join('')}</div>${detail}`;
}
function whSubBody(i) {
  const W = whState()[i], tab = UI.invTab === 'stand' ? 'mat' : UI.invTab || 'mat';
  const keys = cat => Object.keys(W.inv).filter(k => ITEMS[k] && W.inv[k] > 0 && itemCat(k) === cat);
  const count = Object.fromEntries(INV_CATS.map(([id]) => [id, id === 'gear' ? W.gear.length : keys(id).length]));
  const head = `<div class="row sub whhead"><span class="grow">${whCapLine(i)}</span>${whSortBtn(i)}</div><div class="sub muted">보관용 창고예요. 팔거나 제작 · 배우기에 쓰려면 메인 창고로 옮겨요.</div>`;
  let cells = [], detail = '', jobs = '';
  const sel = UI.invSel;
  if (tab === 'gear') {
    jobs = whJobChips(W.gear);
    const gear = W.gear.filter(g => gearInJob(g, UI.invJob || 'all')), g = gear.find(x => 'g' + x.id === sel) || null;
    cells = gear.map(x => whCell('g' + x.id, gArt(x, 2), null, g && x.id === g.id, x.q || 0, ''));
    detail = g ? whPop(whGearDetail(g, i), 'g' + g.id) : gear.length ? '' : '<div class="card"><div class="sub">이 칸에 보관 중인 장비가 없어요.</div></div>';
  } else {
    const list = keys(tab), k = list.includes(sel) ? sel : null;
    cells = list.map(x => whCell(x, iArt(x, 2), W.inv[x] || 0, x === k, itemGrade(x)));
    detail = k ? whPop(`<div class="card hl idet"><div class="row">${iArt(k, 2)}<div class="grow stack"><span>${ITEMS[k].name} <b class="num">×${W.inv[k]}</b> ${gradeTag(itemGrade(k))}</span>${ITEMS[k].desc ? `<span class="sub">${ITEMS[k].desc}</span>` : ''}<span class="sub muted">기준가 ${ITEMS[k].v}G · 무게 ${ITEMS[k].w}</span></div></div>${whMoveRow(i, 'item', k, W.inv[k])}</div>`, k) : list.length ? '' : `<div class="card"><div class="sub">${whName(i)}의 이 칸은 비어 있어요. 메인 창고에서 물건을 고르고 「옮기기」로 넣어요.</div></div>`;
  }
  if (UI.whMulti) detail = whPickBar(i, tab === 'gear' ? W.gear.filter(g => gearInJob(g, UI.invJob || 'all')).map(g => 'g' + g.id) : keys(tab));
  return `${head}${whTabs(tab, count, false)}${jobs}<div class="igrid ${tab}" data-wh="${i}">${whPad(cells, 20).join('')}</div>${detail}`;
}
/* ── 스킬북 펼치기 ── */
function tierBookBox(k) {
  const t = ITEMS[k].btier, L = BOOK_POOL[t], have = S.inv[k] || 0;
  if (!L.length) return `<div class="sub muted">아직 이 책에서 나올 스킬이 없어요 (${t}차 직업이 생기면 열려요).</div>`;
  const band = BOOK_BAND.map((B, b) => { const n = L.filter(id => BOOK_BAND_OF[id] === b).length; return n ? `${B.n} ${n}개 · 하나에 ${pctTxt(L.filter(id => BOOK_BAND_OF[id] === b).reduce((x, id) => x + BOOK_P[id], 0) / n)}` : ''; }).filter(Boolean).join(' · ');
  return `<div class="sub">나오는 스킬 ${L.length}개 — ${band}</div><div class="btns"><button type="button" class="btn sm gold" data-act="bkopen" data-k="${k}" data-n="1"${have ? '' : ' disabled'}>낱개로 펼치기</button>${have >= 10 ? `<button type="button" class="btn sm gold" data-act="bkopen" data-k="${k}" data-n="10">10권 펼치기</button>` : ''}${have > 1 ? `<button type="button" class="btn sm" data-act="bkopen" data-k="${k}" data-n="${have}">모두 펼치기 (${have})</button>` : ''}</div>`;
}
// n권 펼치기: 한 권마다 메인 창고에 자리가 있어야 한다 (새 스킬북이 들어갈 빈 칸 · 마지막 한 권이면 그 칸이 빈다)
function openTierBook(k, n) {
  const I = ITEMS[k]; if (!I || I.btier == null) return '';
  const t = I.btier; if (!BOOK_POOL[t].length) return '아직 이 책에서 나올 스킬이 없어요.';
  n = Math.min(n || 1, S.inv[k] || 0); if (n <= 0) return '책이 없어요.';
  const got = {}, order = []; let done = 0;
  for (let i = 0; i < n; i++) {
    if (whFree(-1) <= 0 && (S.inv[k] || 0) > 1) break;
    const id = drawBook(t); if (!id) break;
    addTo(S.inv, k, -1); addTo(S.inv, 'book_' + id, 1); done++;
    got[id] = (got[id] || 0) + 1; order.push(id);
    if (S.dex) { S.dex.items = S.dex.items || {}; S.dex.items['book_' + id] = 1; }
  }
  if (!done) return WH_FULL;
  const ids = Object.keys(got).sort((x, y) => BOOK_BAND_OF[y] - BOOK_BAND_OF[x] || SKILLS[x].lv - SKILLS[y].lv);
  const best = ids[0], rare = BOOK_BAND_OF[best] >= 3;
  const rows = ids.map(id => `<div class="li bkres rq${bookGrade(id)}">${iArt('book_' + id, 1)}<div class="grow stack"><span>${SKILLS[id].name}${got[id] > 1 ? ` <b class="num">×${got[id]}</b>` : ''} ${gradeTag(bookGrade(id))}</span><span class="sub muted">${BOOK_BAND[BOOK_BAND_OF[id]].n} ${pctTxt(BOOK_P[id])} · ${clsList(SKILLS[id].cls)} Lv${SKILLS[id].lv}${(S.inv['book_' + id] || 0) > got[id] ? ` · 창고 ${S.inv['book_' + id]}권` : ''}</span></div></div>`).join('');
  log(`${I.name} ${done}권을 펼쳐 ${ids.map(id => SKILLS[id].name + (got[id] > 1 ? ` ×${got[id]}` : '')).join(', ')} 스킬북을 얻었다.`, 'good');
  const left = S.inv[k] || 0, btns = [];
  if (left >= 1) btns.push({ label: `하나 더 펼치기 (${left})`, fn: () => { say(openTierBook(k, 1)); renderPanel(true); saveGame(); } });
  if (left >= 10) btns.push({ label: '10권 더', fn: () => { say(openTierBook(k, 10)); renderPanel(true); saveGame(); } });
  btns.push({ label: '확인', cls: 'gold' });
  openModal(`${I.name} ${done}권을 펼쳤다${rare ? ' — ' + BOOK_BAND[BOOK_BAND_OF[best]].n + '!' : ''}`, `<div class="list">${rows}</div><p class="sub muted">${done < n ? `메인 창고에 빈 칸이 없어 ${done}권만 펼쳤어요. ` : ''}나온 스킬북은 창고 스킬북 칸에 들어갔어요. 모험가 창 → 스킬에서 배우고, 같은 책을 한 권 더 바치면 스킬 단계가 올라요. 남는 책은 도서관에서 합성해요.</p>`, btns);
  changed(); return '';
}
/* ── 도서관: 스킬북 합성 (사용자 「만들기 말고 장비처럼 합성」) — 같은 레어도 스킬북 9권 → 다음 레어도 스킬북 하나 (아주 드물게 두 단계) ── */
const lfState = () => (UI.lfuse = UI.lfuse || { g: 1, ids: [] });
const isBookItem = k => !!(ITEMS[k] && (ITEMS[k].book || ITEMS[k].btier != null));
const lfCands = g => Object.keys(S.inv).filter(k => isBookItem(k) && S.inv[k] > 0 && itemGrade(k) === g);
const lfOut = g => Object.keys(BOOK_W).filter(id => ITEMS['book_' + id] && bookGrade(id) === g);   // 그 레어도로 나올 수 있는 스킬북
function lfClean() {
  const F = lfState(), cnt = {};
  F.ids = F.ids.filter(k => { if (!isBookItem(k) || itemGrade(k) !== F.g) return false; cnt[k] = (cnt[k] || 0) + 1; return cnt[k] <= (S.inv[k] || 0); }).slice(0, LIB_FUSE.n);
  return F;
}
const lfUsed = (F, k) => F.ids.filter(x => x === k).length;
function lfAuto() {   // 가장 낮은 것부터: 기준가 낮은 책 · 많이 가진 책 먼저
  const F = lfClean(), C = lfCands(F.g).sort((x, y) => ITEMS[x].v - ITEMS[y].v || (S.inv[y] || 0) - (S.inv[x] || 0));
  for (const k of C) while (F.ids.length < LIB_FUSE.n && lfUsed(F, k) < (S.inv[k] || 0)) F.ids.push(k);
}
function lfWhy() {
  const F = lfClean(), lib = S.bld.library || 0;
  if (!lib) return '도서관이 필요해요';
  if (lib < LIB_FUSE.lib[F.g]) return `도서관 ${LIB_FUSE.lib[F.g]}단계부터`;
  if (!lfOut(F.g + 1).length) return `${gradeName(F.g + 1)} 스킬북이 아직 없어요`;
  if (F.ids.length < LIB_FUSE.n) return `${LIB_FUSE.n - F.ids.length}권 더 넣어요`;
  if (S.gold < LIB_FUSE.fee[F.g]) return `${fmt(LIB_FUSE.fee[F.g])}G가 필요해요`;
  const cnt = {}; F.ids.forEach(k => { cnt[k] = (cnt[k] || 0) + 1; });
  if (whFree(-1) + freedBy(cnt) <= 0) return '메인 창고에 빈 칸이 없어요';
  return '';
}
function lfPick(g) { const L = lfOut(g), sum = L.reduce((x, id) => x + BOOK_W[id], 0); let r = rnd() * sum; for (const id of L) { r -= BOOK_W[id]; if (r <= 0) return id; } return L[L.length - 1]; }
function lfDo() {
  const why = lfWhy(); if (why) return why;
  const F = lfState(), g = F.g;
  S.gold -= LIB_FUSE.fee[g]; S.stats.spent = (S.stats.spent || 0) + LIB_FUSE.fee[g];
  F.ids.forEach(k => addTo(S.inv, k, -1));
  const cat = (S.fuseCat || 0) > 0; if (cat) S.fuseCat--;   // 드워프 합성 촉매
  const jump = lfOut(g + 2).length && rnd() < (cat ? FUSE_CAT_P : LIB_FUSE.jump), ng = g + (jump ? 2 : 1), id = lfPick(ng);
  addTo(S.inv, 'book_' + id, 1); F.ids = []; S.stats.books = (S.stats.books || 0) + 1;
  if (S.dex) { S.dex.items = S.dex.items || {}; S.dex.items['book_' + id] = 1; }
  log(`도서관에서 ${gradeName(g)} 스킬북 ${LIB_FUSE.n}권을 합성해 ${gradeName(ng)} 「${ITEMS['book_' + id].name}」을(를) 얻었다.${jump ? ' 대성공 — 두 단계 위!' : ''}`, 'good');
  openModal(jump ? '스킬북 합성 대성공!' : '스킬북 합성', `<div class="list"><div class="li bkres rq${ng}">${iArt('book_' + id, 1)}<div class="grow stack"><span>${SKILLS[id].name} ${gradeTag(ng)}</span><span class="sub muted">${clsList(SKILLS[id].cls)} Lv${SKILLS[id].lv} · ${BOOK_BAND[BOOK_BAND_OF[id]].n}</span></div></div></div><p class="sub muted">${gradeName(g)} 스킬북 ${LIB_FUSE.n}권이 하나로 묶였어요.${jump ? ` 아주 드물게(${Math.round(LIB_FUSE.jump * 100)}%) 두 단계 위가 나왔어요!` : ''}</p>`, [{ label: '확인', cls: 'gold' }]);
  changed(); return '';
}
BLD_SUM.library = () => { const n = Object.keys(S.inv).filter(isBookItem).reduce((x, k) => x + (S.inv[k] || 0), 0); return `<div class="sub">창고 스킬북 ${n}권 · 같은 레어도 ${LIB_FUSE.n}권을 합성해요</div>`; };
BLD_BOX.library = () => {
  const F = lfClean(), why = lfWhy(), lib = S.bld.library || 0;
  const chips = QUALITY.slice(0, LIB_FUSE.fee.length).map((Q, g) => { const n = lfCands(g).reduce((x, k) => x + (S.inv[k] || 0), 0); return `<button type="button" class="btn sm q${g}${F.g === g ? ' on' : ''}" data-act="lfg" data-g="${g}"${lib >= LIB_FUSE.lib[g] ? '' : ' disabled'}>${Q.name} <small>${n}</small></button>`; }).join('');   // 스킬북은 신화까지
  const slots = Array.from({ length: LIB_FUSE.n }, (_, i) => { const k = F.ids[i]; return k ? `<button type="button" class="cell${rq(itemGrade(k))}" data-act="lfrm" data-i="${i}" title="빼기">${iArt(k, 2)}</button>` : `<span class="cell empty fslot">${rqEmpty(2)}<b class="fsn">${i + 1}</b></span>`; }).join('');
  const rest = lfCands(F.g).map(k => { const left = (S.inv[k] || 0) - lfUsed(F, k); return left > 0 ? `<button type="button" class="cell${rq(F.g)}" data-act="lfadd" data-k="${k}" title="${esc(ITEMS[k].name)}">${iArt(k, 2)}<b class="qty">${left}</b></button>` : ''; }).filter(Boolean);
  return `<div class="sub muted">같은 레어도 스킬북 ${LIB_FUSE.n}권을 넣으면 <b class="q${F.g + 1}">${gradeName(F.g + 1)}</b> 스킬북 하나가 무작위로 나와요(스킬마다 뽑기 무게대로). 아주 드물게(${Math.round(LIB_FUSE.jump * 100)}%) 두 단계 위가 나와요. 펼치지 않은 스킬북 단계(찢어진 · 낡은 …)도 넣을 수 있어요.</div>
    <div class="btns">${chips}</div>
    <div class="igrid fuse">${slots}</div>
    <div class="btns"><button type="button" class="btn sm" data-act="lfauto"${F.ids.length < LIB_FUSE.n && rest.length ? '' : ' disabled'}>가장 낮은 책 자동으로 넣기</button><button type="button" class="btn sm" data-act="lfclr"${F.ids.length ? '' : ' disabled'}>비우기</button><button type="button" class="btn gold grow" data-act="lfgo"${why ? ' disabled' : ''}>${why || `<span class="col2"><span class="nw">합성하기</span><span class="nw">${fmt(LIB_FUSE.fee[F.g])}G</span></span>`}</button></div>
    <div class="sec"><b>넣을 수 있는 스킬북</b><span>${gradeName(F.g)} · 메인 창고</span></div>
    <div class="igrid book">${whPad(rest, 6).join('')}</div>`;
};

/* ── 대장간 합성: 같은 레어도 · 같은 갈래 9점 → 다음 레어도 무작위 장비 ── */
const fuseState = () => (UI.fuse = UI.fuse || { cat: 'weapon', q: 0, ids: [] });
const fuseCands = (cat, q) => S.gear.filter(g => fuseCatOf(g) === cat && (g.q || 0) === q && !isAmmo(g));
function fuseClean() {
  const F = fuseState(), C = fuseCands(F.cat, F.q).map(g => g.id);
  F.ids = F.ids.filter(id => C.includes(id)).slice(0, FUSE.n);
  return F;
}
function fuseAuto() {   // 가장 낮은 장비부터 (단계 · 룬 · 값이 낮은 것)
  const F = fuseClean(), C = fuseCands(F.cat, F.q).filter(g => !F.ids.includes(g.id)).sort((x, y) => x.t - y.t || (x.runes || []).length - (y.runes || []).length || gearValue(x) - gearValue(y));
  while (F.ids.length < FUSE.n && C.length) F.ids.push(C.shift().id);
}
function fuseWhy() {
  const F = fuseClean();
  if (!S.bld.smithy) return '대장간이 필요해요';
  if (F.q >= GRADE_MAX) return `${gradeName(GRADE_MAX)} 장비는 더 합성할 수 없어요`;
  if (F.ids.length < FUSE.n) return `${FUSE.n - F.ids.length}점 더 넣어요`;
  if (S.gold < FUSE.fee[F.q]) return `${fmt(FUSE.fee[F.q])}G가 필요해요`;
  return '';
}
function fuseDo() {
  const why = fuseWhy(); if (why) return why;
  const F = fuseState(), gs = F.ids.map(id => S.gear.find(g => g.id === id)).filter(Boolean), q = F.q;
  S.gold -= FUSE.fee[q]; S.stats.spent = (S.stats.spent || 0) + FUSE.fee[q];
  for (const g of gs) { const i = S.gear.indexOf(g); if (i >= 0) S.gear.splice(i, 1); }
  const cat = (S.fuseCat || 0) > 0; if (cat) S.fuseCat--;   // 드워프 합성 촉매: 두 단계 위 확률 FUSE_CAT_P
  const jump = q + 2 <= GRADE_MAX && rnd() < (cat ? FUSE_CAT_P : FUSE.jump), nq = Math.min(GRADE_MAX, q + (jump ? 2 : 1)), t = fuseTier(gs);
  let base = dropKind(pickOne(fuseBases(F.cat).filter(b => tierOk(b, t))), t);   // 빌드 64: 그 단계에 있는 종류만
  const g = makeGear(base, t, nq);
  const where = stashGear(g); F.ids = [];
  log(`대장간에서 ${QUALITY[q].name} 장비 ${FUSE.n}점을 합성해 ${QUALITY[nq].name} 「${gearName(g)}」을(를) 얻었다.${jump ? ' 대성공 — 두 단계 위!' : ''}`, 'good');
  queueModal({ title: jump ? '합성 대성공!' : '합성 성공', body: [`${QUALITY[q].name} ${FUSE_CAT[F.cat]} ${FUSE.n}점이 녹아 ${QUALITY[nq].name} ${GTYPES[g.base].name}이(가) 되었다.${jump ? ` 아주 드물게 두 단계(${Math.round(FUSE.jump * 100)}%)를 뛰어올랐다!` : ''}`, `${gearName(g)} · ${statLine(gearStats(g))}`, where === 'main' ? '메인 창고에 넣었어요.' : where === 'lost' ? '창고가 가득 차 못 가져왔어요.' : `${whName(+where.slice(2))}에 넣었어요.`] });
  changed(); return '';
}
function fuseBox() {
  const F = fuseClean(), C = fuseCands(F.cat, F.q), why = fuseWhy(), nq = Math.min(GRADE_MAX, F.q + 1);
  const cats = Object.entries(FUSE_CAT).map(([c, n]) => `<button type="button" class="btn sm${F.cat === c ? ' on' : ''}" data-act="fusecat" data-c="${c}">${n} <small>${S.gear.filter(g => fuseCatOf(g) === c && !isAmmo(g)).length}</small></button>`).join('');
  const qs = QUALITY.slice(0, GRADE_MAX).map((Q, q) => { const n = fuseCands(F.cat, q).length; return `<button type="button" class="btn sm q${q}${F.q === q ? ' on' : ''}" data-act="fuseq" data-q="${q}">${Q.name} <small>${n}</small></button>`; }).join('');
  const slots = Array.from({ length: FUSE.n }, (_, i) => { const g = F.ids[i] != null ? S.gear.find(x => x.id === F.ids[i]) : null; return g ? `<button type="button" class="cell${rq(g.q || 0)}" data-act="fuserm" data-id="${g.id}" title="빼기">${gArt(g, 2)}</button>` : `<span class="cell empty fslot">${rqEmpty(2)}<b class="fsn">${i + 1}</b></span>`; }).join('');
  const rest = C.filter(g => !F.ids.includes(g.id)).map(g => `<button type="button" class="cell${rq(g.q || 0)}" data-act="fuseadd" data-id="${g.id}">${gArt(g, 2)}</button>`);
  const lost = F.ids.map(id => S.gear.find(g => g.id === id)).filter(g => g && (g.runes || []).length).length;
  return `<div class="sub muted">같은 레어도 · 같은 갈래(${Object.values(FUSE_CAT).join(' · ')}) 장비 ${FUSE.n}점을 녹이면 <b class="q${nq}">${QUALITY[nq].name}</b> 장비 하나가 무작위로 나와요. 아주 드물게(${Math.round(FUSE.jump * 100)}%) 두 단계 위가 나와요. 나오는 장비의 단계(Lv 구간)는 넣은 장비 단계의 평균이고, 룬은 사라져요.</div>
    <div class="btns">${cats}</div><div class="btns">${qs}</div>
    <div class="igrid fuse">${slots}</div>
    ${lost ? `<div class="sub red-t">강화나 룬이 있는 장비 ${lost}점이 들어 있어요. 합성하면 사라져요.</div>` : ''}
    <div class="btns"><button type="button" class="btn sm" data-act="fuseauto"${C.length > F.ids.length && F.ids.length < FUSE.n ? '' : ' disabled'}>가장 낮은 장비 자동으로 넣기</button><button type="button" class="btn sm" data-act="fuseclr"${F.ids.length ? '' : ' disabled'}>비우기</button><button type="button" class="btn gold grow" data-act="fusego"${why ? ' disabled' : ''}>${why || `<span class="col2"><span class="nw">합성하기</span><span class="nw">${fmt(FUSE.fee[F.q])}G</span></span>`}</button></div>
    <div class="sec"><b>넣을 수 있는 장비</b><span>${QUALITY[F.q].name} ${FUSE_CAT[F.cat]} ${C.length}점 · 메인 창고</span></div>
    <div class="igrid gear">${whPad(rest, 6).join('')}</div>`;
}

Object.assign(ACT, {
  invsel: d => {
    if (Date.now() - (UI.dragEnd || 0) < 350) return;   // 끌어 놓은 바로 뒤의 누름은 무시
    if (UI.whMulti) { const P = UI.whPick || (UI.whPick = []), i = P.indexOf(d.id); if (i >= 0) P.splice(i, 1); else P.push(d.id); renderPanel(true); return; }
    UI.invSel = d.id; UI.invPop = UI.invPop === d.id ? null : d.id; renderPanel(true);
  },   // 같은 칸을 다시 누르면 닫힌다
  whmulti: () => { UI.whMulti = !UI.whMulti; UI.whPick = []; UI.invPop = null; renderPanel(true); },
  whpickall: d => {
    const from = +d.f, keys = [...document.querySelectorAll('.igrid .cell[data-id]')].map(e => e.dataset.id);
    UI.whPick = (UI.whPick || []).length === keys.length ? [] : keys; renderPanel(true);
  },
  whmvsel: d => { say(whMoveKeys((UI.whPick || []).slice(), +d.f, +d.t)); renderPanel(true); },
  invpop: () => { UI.invPop = null; renderPanel(true); },
  lfg: d => { const F = lfState(); F.g = +d.g; F.ids = []; renderPanel(true); },
  lfadd: d => { const F = lfClean(); if (F.ids.length < LIB_FUSE.n && lfUsed(F, d.k) < (S.inv[d.k] || 0)) F.ids.push(d.k); renderPanel(true); },
  lfrm: d => { const F = lfState(); F.ids.splice(+d.i, 1); renderPanel(true); },
  lfauto: () => { lfAuto(); renderPanel(true); },
  lfclr: () => { lfState().ids = []; renderPanel(true); },
  lfgo: () => { say(lfDo()); renderPanel(true); },
  whsel: d => { const i = +d.i; if (i >= whOpenN()) { say(`${whName(i)}는 ${RANKS[whOpenAt(i)] ? RANKS[whOpenAt(i)].name : 'S'}랭크에 열려요.`); return; } UI.wh = i; UI.invSel = null; UI.whPick = []; if (i >= 0 && UI.invTab === 'stand') UI.invTab = 'mat'; const top = winTop(); if (top) top.tab = 'wh' + i; renderPanel(true); },
  whto: d => { UI.whTo = +d.i; renderPanel(true); },
  whmv: d => { say(whMoveItem(d.k, +d.q, +d.f, +d.t)); renderPanel(true); },
  whmvg: d => { say(whMoveGear(+d.id, +d.f, +d.t)); UI.invSel = null; renderPanel(true); },
  whsort: d => { say(whSort(+d.i)); UI.invSel = null; renderPanel(true); },
  invjob: d => { UI.invJob = d.id; UI.invSel = null; UI.whPick = []; const top = winTop(); if (top) top.tab = 'job' + d.id; renderPanel(true); },
  bkopen: d => { say(openTierBook(d.k, +d.n)); renderPanel(true); },
  fuseopen: d => { const g = S.gear.find(x => x.id === +d.id); if (g) { const F = fuseState(); F.cat = fuseCatOf(g); F.q = g.q || 0; F.ids = [g.id]; } UI.smithTab = 'fuse'; openWin('b', { b: 'smithy', tab: 'fuse' }); },
  fusecat: d => { const F = fuseState(); F.cat = d.c; F.ids = []; renderPanel(true); },
  fuseq: d => { const F = fuseState(); F.q = +d.q; F.ids = []; renderPanel(true); },
  fuseadd: d => { const F = fuseClean(); if (F.ids.length < FUSE.n && !F.ids.includes(+d.id)) F.ids.push(+d.id); renderPanel(true); },
  fuserm: d => { const F = fuseState(); F.ids = F.ids.filter(id => id !== +d.id); renderPanel(true); },
  fuseauto: () => { fuseAuto(); renderPanel(true); },
  fuseclr: () => { fuseState().ids = []; renderPanel(true); },
  fusego: () => { say(fuseDo()); renderPanel(true); }
});
ACT_SFX.bkopen = 'loot'; ACT_SFX.fusego = 'lvl'; ACT_SFX.lfgo = 'lvl';

// 옛 저장: 창고 1~10을 만들고 메인 창고를 한 번 레어도 순서로 정리해 둔다 (예전엔 창이 값 순서로 보여 줬다) · 알림
function notes63b() {
  whState();
  if (!S.flags.wh63) { S.flags.wh63 = 1; whSortRaw(-1); }
  if (!S.flags.v63b) { S.flags.v63b = 1; if (today() > 1 || S.advs.some(a => a.lv > 2)) S.modals.push({ title: '창고 · 합성 · 스킬북 단계', body: STORY.v63b }); }
}

function notes63c() {   // 빌드 63 다섯째 묶음: 장비 드랍 · 레어도 알림
  if (!S.flags.v63c) { S.flags.v63c = 1; if (today() > 1 || S.advs.some(a => a.lv > 2)) S.modals.push({ title: '장비 드랍 · 레어도', body: STORY.v63c }); }
}

/* ───────── 상단 전용 물건 쓰기 (빌드 63) ───────── */
function exclWhy(k) {
  const X = EXCL[k]; if (!X) return '쓸 수 없는 물건이에요.';
  if (!((S.inv[k] || 0) > 0)) return '메인 창고에 없어요.';
  const P = X.perm || {};
  if (P.whPlus && (S.whPlus || 0) >= P.max) return `메인 창고는 ${WH_MAIN_CAP + P.max}칸까지 넓힐 수 있어요.`;
  if (P.salePlus && (S.salePlus || 0) >= P.max - 1e-9) return `진열대 판매 값은 +${Math.round(P.max * 100)}%까지예요.`;
  return '';
}
function useExcl(k) {
  const why = exclWhy(k); if (why) return why;
  const X = EXCL[k], P = X.perm || {}; addTo(S.inv, k, -1);
  let msg;
  if (X.bst) { S.boost = S.boost || {}; S.boost[k] = (S.boost[k] || 0) + X.bst.n; msg = `${X.name}을(를) 꺼냈다 — 다음 원정 ${S.boost[k]}번 · ${foodFxText(X.bst.fx)}`; }
  else if (P.whPlus) { S.whPlus = Math.min(P.max, (S.whPlus || 0) + P.whPlus); msg = `${X.name}을(를) 썼다 — 메인 창고 ${whCap(-1)}칸`; }
  else if (P.salePlus) { S.salePlus = Math.min(P.max, Math.round(((S.salePlus || 0) + P.salePlus) * 1000) / 1000); msg = `${X.name}을(를) 걸었다 — 진열대 판매 값 +${Math.round(S.salePlus * 100)}%`; }
  else if (P.fuseCat) { S.fuseCat = (S.fuseCat || 0) + P.fuseCat; msg = `${X.name}을(를) 대장간에 두었다 — 다음 합성 ${S.fuseCat}번, 두 단계 위 ${Math.round(FUSE_CAT_P * 100)}%`; }
  log(msg, 'good'); changed(); return msg;
}
// 원정을 떠날 때(core.js startExp): 쌓아 둔 원정 휴대품을 하나씩 쓰고 효과를 e.bst에 (foodFx가 도시락과 합친다)
function boostStart(e) {
  const B = S.boost || {}, fx = {}, ids = [];
  for (const [k, n] of Object.entries(B)) {
    if (!(n > 0) || !EXCL[k] || !EXCL[k].bst) { delete B[k]; continue; }
    for (const [f, v] of Object.entries(EXCL[k].bst.fx)) fx[f] = (fx[f] || 0) + v;
    ids.push(k); B[k] = n - 1; if (!B[k]) delete B[k];
  }
  if (ids.length) { e.bst = fx; e.bstIds = ids; }
}
const boostLine = () => Object.entries(S.boost || {}).filter(([k, n]) => n > 0 && EXCL[k]).map(([k, n]) => `${EXCL[k].name} ${n}번`).join(' · ');
const exclEffText = k => { const X = EXCL[k]; if (!X) return ''; if (X.bst) return `원정 ${X.bst.n}번 · ${foodFxText(X.bst.fx)}`; const P = X.perm; return P.whPlus ? `메인 창고 +${P.whPlus}칸 (지금 ${whCap(-1)}칸 · 최대 ${WH_MAIN_CAP + P.max})` : P.salePlus ? `진열대 판매 값 +${Math.round(P.salePlus * 100)}% (지금 +${Math.round((S.salePlus || 0) * 100)}% · 최대 +${Math.round(P.max * 100)}%)` : `다음 합성 한 번 두 단계 위 ${Math.round(FUSE_CAT_P * 100)}% (쌓인 촉매 ${S.fuseCat || 0})`; };
Object.assign(ACT, { useexcl: d => { say(useExcl(d.it)); renderPanel(true); } });
ACT_SFX.useexcl = 'loot';

/* 끌어 놓기 (사용자 11-11 「다른 창고 옮기는 방법 추가」): 칸을 왼쪽 창고 띠(.whb)에 놓으면 그 창고로 옮긴다.
   마우스 · 펜은 6px 넘게 끌면, 손가락은 0.35초 꾹 누르면 시작 (그 전에 움직이면 그냥 스크롤). 여러 개 고르기 중이면 고른 칸을 모두 */
const WHD = { on: false, keys: [], from: -1, ghost: null, timer: 0, sx: 0, sy: 0, over: null, cand: null };
function whdCell(t) { const c = t && t.closest ? t.closest('.igrid[data-wh] .cell[data-id]') : null; const box = document.getElementById('panel-in'); return c && box && box.contains(c) ? c : null; }
function whdStart(cell, x, y) {
  const grid = cell.closest('.igrid[data-wh]'); if (!grid) return;
  const key = cell.dataset.id;
  WHD.on = true; WHD.from = +grid.dataset.wh; WHD.keys = UI.whMulti && (UI.whPick || []).includes(key) ? UI.whPick.slice() : [key];
  const g = document.createElement('div'); g.className = 'drag-ghost';
  const img = cell.querySelector('.rqa, img'); if (img) g.appendChild(img.cloneNode(true));
  if (WHD.keys.length > 1) { const b = document.createElement('b'); b.textContent = WHD.keys.length; g.appendChild(b); }
  document.body.appendChild(g); WHD.ghost = g; cell.classList.add('dragging');
  document.querySelectorAll('.whb:not(.lock)').forEach(b => { if (+b.dataset.i !== WHD.from) b.classList.add('droppable'); });
  whdMove(x, y);
  try { if (navigator.vibrate) navigator.vibrate(12); } catch (_) { /* 진동 없음 */ }
}
function whdMove(x, y) {
  if (!WHD.ghost) return;
  WHD.ghost.style.transform = `translate(${Math.round(x - 24)}px, ${Math.round(y - 24)}px)`;
  const el = document.elementFromPoint(x, y), b = el && el.closest ? el.closest('.whb') : null;
  const ok = b && !b.classList.contains('lock') && +b.dataset.i !== WHD.from ? b : null;
  if (WHD.over && WHD.over !== ok) WHD.over.classList.remove('drop');
  WHD.over = ok; if (ok) ok.classList.add('drop');
}
function whdEnd(drop) {
  clearTimeout(WHD.timer); WHD.timer = 0; WHD.cand = null;
  if (!WHD.on) return;
  const to = drop && WHD.over ? +WHD.over.dataset.i : null;
  if (WHD.ghost) WHD.ghost.remove();
  WHD.ghost = null; WHD.on = false; WHD.over = null; UI.dragEnd = Date.now();
  document.querySelectorAll('.whb.drop, .whb.droppable').forEach(b => b.classList.remove('drop', 'droppable'));
  document.querySelectorAll('.cell.dragging').forEach(c => c.classList.remove('dragging'));
  if (to != null) { say(whMoveKeys(WHD.keys, WHD.from, to)); sfx('ui'); renderPanel(true); }
}
document.addEventListener('pointerdown', ev => {
  if (ev.pointerType === 'touch' || ev.button !== 0) return;
  const c = whdCell(ev.target); if (!c) return;
  WHD.cand = c; WHD.sx = ev.clientX; WHD.sy = ev.clientY;
});
document.addEventListener('pointermove', ev => {
  if (ev.pointerType === 'touch') return;
  if (WHD.on) { whdMove(ev.clientX, ev.clientY); return; }
  if (WHD.cand && Math.hypot(ev.clientX - WHD.sx, ev.clientY - WHD.sy) > 6) { const c = WHD.cand; WHD.cand = null; whdStart(c, ev.clientX, ev.clientY); }
});
document.addEventListener('pointerup', ev => { if (ev.pointerType === 'touch') return; if (WHD.on) whdEnd(true); else WHD.cand = null; });
document.addEventListener('touchstart', ev => {
  if (ev.touches.length !== 1) { whdEnd(false); return; }
  const c = whdCell(ev.target); if (!c) return;
  const t = ev.touches[0]; WHD.sx = t.clientX; WHD.sy = t.clientY;
  clearTimeout(WHD.timer); WHD.timer = setTimeout(() => { WHD.timer = 0; whdStart(c, WHD.sx, WHD.sy); }, 350);
}, { passive: true });
document.addEventListener('touchmove', ev => {
  const t = ev.touches[0]; if (!t) return;
  if (WHD.on) { ev.preventDefault(); whdMove(t.clientX, t.clientY); return; }
  if (WHD.timer && Math.hypot(t.clientX - WHD.sx, t.clientY - WHD.sy) > 8) { clearTimeout(WHD.timer); WHD.timer = 0; }
}, { passive: false });
document.addEventListener('touchend', ev => { if (WHD.on) { ev.preventDefault(); whdEnd(true); } else { clearTimeout(WHD.timer); WHD.timer = 0; } }, { passive: false });
document.addEventListener('touchcancel', () => whdEnd(false));
document.addEventListener('contextmenu', ev => { if (whdCell(ev.target)) ev.preventDefault(); });
