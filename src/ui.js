/* ───────── 화면 공통 ───────── */
const UI = { stack: [], dirty: true, html: '', winKey: '', chips: '', floors: '', fname: '', hold: false, modal: false, smithT: null };
const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const fmt = n => Math.floor(n).toLocaleString('ko-KR');
const pct = (a, b) => Math.max(0, Math.min(100, Math.round(a / Math.max(1, b) * 100)));

/* 화면용 도트 아이콘 */
const UI_PX = {
  coin:   ['..kkkk..', '.kyyyyk.', 'kyllyydk', 'kylyyydk', 'kylyyydk', 'kyyyyydk', '.kddddk.', '..kkkk..'],
  star:   ['...kk...', '...ff...', '..kffk..', 'kfffffk.', '.kfffk..', '.kfkfk..', 'kfk.kfk.', 'kk...kk.'],
  house:  ['....k....', '...kyk...', '..kyyyk..', '.kyyyyyk.', 'kkkkkkkkk', '.kwwwwwk.', '.kwkkwwk.', '.kwkkwwk.', '.kkkkkkk.'],
  anvil:  ['.........', 'kkkkkkkk.', 'kwwwwwwwk', '.kwwwwwk.', '..kkwkk..', '...kwk...', '..kwwwk..', '.kwwwwwk.', '.kkkkkkk.'],
  person: ['...kkk...', '..kssk...', '..kssk...', '...kk....', '..kttk...', '.kttttk..', 'ktttttk..', '.kt.tk...', '.kk.kk...'],
  sword:  ['.......kk', '......klk', '.....klk.', '....klk..', '.k.klk...', '..kkk....', '..kdk....', '.kdkk....', 'kk.......'],
  box:    ['.kkkkkkk.', 'kbbbbbbbk', 'kbkkkkkbk', 'kbbbbbbbk', 'kbbkkbbbk', 'kbbbbbbbk', 'kbkkkkkbk', 'kbbbbbbbk', '.kkkkkkk.'],
  scroll: ['.kkkkkk..', 'kppppppk.', 'kpkkkkpk.', 'kppppppk.', '.kpkkkpk.', '.kppppppk', '.kpkkkkpk', '.kppppppk', '..kkkkkk.'],
  mag:    ['.kkkk....', 'klwwlk...', 'kwllllk..', 'kwllllk..', 'klllllk..', '.kllllkk.', '..kkkkdkk', '......kdk', '.......kk'],
  map:    ['kkkkkkkkk', 'kpppfpppk', 'kppffpppk', 'kpffppppk', 'kpfpppypk', 'kppppyypk', 'kpppyyppk', 'kppppyppk', 'kkkkkkkkk'],
  menu:   ['.kkkkkkk.', 'kyyyyyyyk', 'kdddddddk', 'kpppppppk', 'kpkkkkppk', 'kpppppppk', 'kpkkkkkpk', 'kpppppppk', '.kkkkkkk.']   // 빌드 63: 메뉴판
};
const UI_PAL = { k: '#0b0d12', y: '#f0b43c', l: '#fff2c0', d: '#9a6a1c', f: '#5fd4c0', w: '#c9c3b8', s: '#f1c9a5', t: '#4a7ac8', b: '#9a6a3c', p: '#e8dcb8' };
function pxURL(name) {
  const pat = UI_PX[name], w = pat[0].length, h = pat.length;
  const [c, x] = mkCanvas(w, h);
  pat.forEach((row, y) => { for (let i = 0; i < w; i++) if (row[i] !== '.') R(x, i, y, 1, 1, UI_PAL[row[i]]); });
  return c.toDataURL();
}
function applyPx() { document.querySelectorAll('img[data-px]').forEach(im => { im.src = pxURL(im.dataset.px); }); }

const POR = {}, POR_W = 46, POR_H = 56;
function portrait(a) {
  const key = advKey(a);
  if (POR[key]) return POR[key];
  const [c, x] = mkCanvas(POR_W, POR_H);
  x.translate(POR_W / 2, POR_H - 2); x.scale(2, 2);
  drawAdvHi(x, a, 0, {});
  return (POR[key] = c.toDataURL());
}
const iconImg = (id, cls = 'ico') => `<img class="${cls}" src="${iconURL(id)}" alt="">`;

/* ───────── 상태줄과 화면 위 글씨 ───────── */
function updateHud() {
  $('h-gold').textContent = fmt(S.gold);
  $('h-fame').textContent = fmt(S.fame);
  const p = dateParts(S.t), ph = phaseOf(S.t), hd = $('h-date');
  const html = `<span class="dl">${p.m}월 ${p.d}일 <span class="clk">${clockStr(S.t)}</span> <span class="ph ph-${PHASES[ph].id}">${PHASES[ph].name}</span></span>${hudWeather()}`;   // 시계 아래 날씨
  if (hd.innerHTML !== html) hd.innerHTML = html;
  const dd = S.settleDay - today(), r = $('h-rent');
  r.textContent = `정산 D-${dd}`;
  r.classList.toggle('due', dd <= 3);
  const n = S.reqs.filter(q => reqHave(q) >= q.qty).length, b = $('req-badge'), mb = $('menu-badge');
  b.hidden = !n; b.textContent = n; mb.hidden = !n; mb.textContent = n;   // 접은 메뉴 단추에도 (빌드 63)
}
const WHY = { trade: '교역을 마치고 돌아오는 중', imm: '공격이 통하지 않아 복귀 중', over: '레이드가 끝나 복귀 중', raid: '레이드 몬스터를 쓰러뜨리고 복귀 중', time: '레이드에서 물러나 복귀 중', retreat: '레이드에서 빠져나와 복귀 중', full: '짐이 가득 차 복귀 중', danger: '위험해서 복귀 중', loss: '쓰러진 동료를 들것에 싣고 복귀 중', boss: '던전의 주인을 쓰러뜨리고 복귀 중', ahead: '앞이 너무 위험해 복귀 중', order: '명령을 받고 복귀 중', end: '필드 끝에서 복귀 중', sleep: '잠이 모자라 복귀 중' };
function expStatus(p) {
  const e = p.exp;
  if (!e) return p.members.length ? '상단에서 대기 중' : '파티원이 없어요';
  const F = FIELDS[e.field];
  if (e.area === 'raid' && e.foes.length) return `${RAIDS[e.raid].name}와(과) 싸우는 중! · ${Math.max(0, Math.ceil(RAID_FIGHT - e.rt))}초 · 피해 ${fmt(e.dealt)}`;
  if (e.area === 'raid' && e.mode === 'advance') return `${RAIDS[e.raid].name}에게 다가가는 중`;
  if (e.foes.length) { const fb = e.foes.find(f => f.fb); return fb ? `필드 보스 ${fb.name}와(과) 싸우는 중!` : e.foes.some(f => f.boss) ? '던전의 주인과 싸우는 중!' : e.camp ? '야영지 습격!' : '전투 중'; }
  if (e.camp) { const w = wxNow(e), cf = e.camp.wxf != null ? e.camp.wxf : campWxF(p, w), cft = cf !== 1 ? ` · 날씨 ×${Math.round(cf * 100) / 100}` : '';
    if (e.camp.tent) return e.camp.t > 1.5 ? `${e.camp.tent >= 2 ? '대형 ' : ''}텐트에서 자는 중 (피로 회복 ×${e.camp.tent}${cft})` : '텐트를 치는 중';
    if (campWet(p, w)) return e.camp.t > 1.5 ? `모닥불 없이 젖은 채 노숙 중${cft}` : '비를 피할 곳을 찾는 중';
    return e.camp.t > 1.5 ? `${campWindy(p, w) ? '바람에 흔들리는 ' : ''}모닥불 곁에서 자는 중${cft}` : '모닥불을 피우는 중'; }
  if (e.wait === 'gate') return `${F.dungeon.name} 입구 · 들어갈지 정해 주세요`;
  const tired = teamOf(p).some(a => (a.fat || 0) >= 60), carry = teamOf(p).filter(a => a.down).length;
  if (e.mode === 'return') return (WHY[e.why] || '복귀 중') + (carry && e.why !== 'loss' ? ` · 들것 ${carry}` : '') + (tired ? ' · 지침' : '');
  if (carry) return `들것 ${carry}개를 메고 ${e.area === 'dungeon' ? '던전 탐험' : '전진'} 중`;
  return (e.area === 'dungeon' ? '던전 탐험 중' : '전진 중') + (tired ? ' · 지침' : '');
}
function whereStr(e) {
  const F = FIELDS[e.field];
  if (e.area === 'raid') return `레이드 · ${F.name}`;
  if (e.area === 'wave') return `하르겐 성문 · ${e.wave.cur + 1}/${e.wave.n}번째 무리`;
  if (e.area === 'arena') return '지하 투기장';
  if (e.area === 'trade') return tradeWhere(e);
  return e.area === 'dungeon' ? `${F.dungeon.name} ${e.stage}층` : `${F.name} ${F.no}-${e.stage}`;
}
function updateOverlay() {
  const p = viewParty(), L = $('ov-l'), Rr = $('ov-r'), B = $('ov-b');
  if (!p) { L.textContent = '오물거리 · 상단 앞'; Rr.hidden = true; B.hidden = true; return; }
  const e = p.exp;
  Rr.hidden = true;
  if (!e) { L.textContent = `${p.name} · 상단 앞`; B.hidden = true; return; }
  L.textContent = `${p.name} · ${whereStr(e)}`;
  const w = wxNow(e); if (!w.indoor) L.textContent += ` · ${wxLabel(w)}`;
  // 작은 창 아래 글은 할 일이 있을 때만 (던전 입구에서 기다리는 중)
  B.hidden = e.wait !== 'gate'; if (!B.hidden) B.textContent = '던전 입구 · 눌러서 정하기';
}
function renderChips() {
  const html = S.parties.slice().sort((a, b) => (a.raidOnly ? 1 : 0) - (b.raidOnly ? 1 : 0)).map(p => {   // 레이드대는 맨 끝
    const e = p.exp, cls = !e ? '' : e.foes.length ? 'fight' : e.camp ? 'camp' : e.wait ? 'wait' : e.mode === 'return' ? 'back' : 'go';
    const st = !e ? '대기' : e.area === 'raid' ? '레이드' : e.area === 'trade' ? `교역 ${e.leg === 'back' ? '귀환' : e.stage + '/' + e.dist}` : e.area === 'dungeon' ? `${FIELDS[e.field].treasure ? FIELDS[e.field].dungeon.name : FIELDS[e.field].raid ? '은신처' : '던전'} ${e.stage}층` : `${FIELDS[e.field].no}-${e.stage}`;
    return `<button type="button" class="pchip${S.view === p.id ? ' on' : ''}" data-view="${p.id}"><i class="dot ${cls}"></i>${esc(p.name)} · ${st}</button>`;
  }).join('');
  if (html !== UI.chips) { $('pchips').innerHTML = html; UI.chips = html; }
}

/* ───────── 창: 메뉴 → 하위 메뉴 → 창, 뒤로 ───────── */
const WIN_TITLE = { co: '상단', fac: '시설', adv: '모험가', exp: '원정대', inv: '창고', req: '의뢰', co_rank: '상단 랭크', co_money: '월말 정산', co_spon: '후원', co_goal: '목표', co_log: '소식', co_set: '설정', co_king: '왕국 교역', co_relic: '유물', raid: '레이드', rune: '룬', battle: '전투' };
const winTop = () => UI.stack[UI.stack.length - 1] || null;
function winTitle(w) {
  if (w.id === 'b') return BUILDINGS[w.b] ? BUILDINGS[w.b].name : '시설';
  if (w.id === 'advd') { const a = S && advById(w.aid); return a ? `${a.name} · ${CLASSES[a.cls].name}` : '모험가'; }
  return WIN_TITLE[w.id] || '';
}
function openWin(id, o) {
  sfx('open');
  UI.stack.push(Object.assign({ id }, o || {}));
  try { history.pushState({ w: UI.stack.length }, ''); } catch (_) {}
  showWin(true);
}
// 뒤로: 브라우저·안드로이드 뒤로 가기와 같은 길로 간다
function backWin() {
  if (!UI.stack.length) return;
  UI.stack.length--;
  try { if (history.state && history.state.w) { UI.skipPop = 1; history.back(); } } catch (_) {}
  showWin(true);
}
// 오른쪽 메뉴: 같은 메뉴를 다시 누르면 닫고, 다른 메뉴면 그 창으로 바꾼다
function menuOpen(id) {
  const d = UI.stack.length;
  if (!d) { openWin(id); return; }
  if (UI.stack[0].id === id) { closeWins(); return; }
  UI.stack = [{ id }];
  try { if (d > 1) { UI.skipPop = 1; history.go(-(d - 1)); } } catch (_) {}
  showWin(true);
}
// 빌드 63: 메뉴판 — 오른쪽 위 「메뉴」 하나를 누르면 일곱 창과 상단 바로 가기가 펼쳐진다
function menuBoard(on) {
  const b = $('menu-board'), open = on == null ? b.hidden : !!on;
  if (b.hidden === !open) return;
  b.hidden = !open; $('menu').classList.toggle('open', open); $('menu-btn').setAttribute('aria-expanded', open ? 'true' : 'false'); $('menu-btn').classList.toggle('open', open);
  sfx(open ? 'open' : 'close');
}
// 메뉴판에서 고르기: 그 창이 이미 맨 아래면 그 창으로 돌아가고(안쪽 창을 닫음), 아니면 바꾼다
function menuGo(id) {
  const d = UI.stack.length;
  if (d > 1 && UI.stack[0].id === id) { UI.stack.length = 1; try { UI.skipPop = 1; history.go(-(d - 1)); } catch (_) {} sfx('open'); showWin(true); return; }
  menuOpen(id);
}
// 상단 창 아래의 창(정산 · 도감 · 설정 …)을 바로: 쌓인 창을 [상단, 그 창]으로 바꾼다 (뒤로 가면 상단 창)
function menuSub(id) {
  const d = UI.stack.length;
  UI.stack = [{ id: 'co' }, { id }];
  try {
    if (d === 0) { history.pushState({ w: 1 }, ''); history.pushState({ w: 2 }, ''); } else if (d === 1) history.pushState({ w: 2 }, ''); else if (d > 2) { UI.skipPop = 1; history.go(-(d - 2)); }
  } catch (_) {}
  sfx('open'); showWin(true);
}
function closeWins() {
  const n = UI.stack.length;
  if (!n) return;
  sfx('close');
  UI.stack.length = 0;
  try { const k = Math.min(n, (history.state && history.state.w) || 0); if (k) { UI.skipPop = 1; history.go(-k); } } catch (_) {}
  showWin(true);
}
window.addEventListener('popstate', e => {
  if (UI.skipPop) { UI.skipPop = 0; return; }
  const n = (e.state && e.state.w) || 0;
  if (UI.modal && $('m-btns').querySelectorAll('button:not(.skipall)').length === 1) { closeModal(); if (UI.stack.length) try { history.pushState({ w: UI.stack.length }, ''); } catch (_) {} return; }
  if (UI.stack.length > n) { UI.stack.length = n; showWin(true); }
});
function showWin(scroll) {
  const top = winTop(), el = $('win'), bt = !!top && top.id === 'battle';
  $('stage').classList.toggle('win-open', !!top);
  document.querySelectorAll('.mtile').forEach(b => b.classList.toggle('on', !!top && UI.stack[0].id === b.dataset.open));
  $('menu-btn').classList.toggle('on', !!top && !bt);
  if (bt !== V.bopen) showBattle(bt);
  if (!top || bt) { el.hidden = true; UI.html = ''; UI.winKey = ''; return; }
  layoutWin();
  el.hidden = false;
  $('win-title').textContent = winTitle(top);
  $('win-path').innerHTML = UI.stack.length > 1 ? UI.stack.map(w => `<span>${esc(winTitle(w))}</span>`).join('') : '';
  if (scroll) $('panel').scrollTop = 0;
  renderPanel(true);
}
// 창은 원정 화면 아래부터 파티 줄 위까지
function layoutWin() {
  const app = $('app').getBoundingClientRect(), pip = $('pip').getBoundingClientRect(), upd = $('upd');
  const below = upd.hidden ? $('chipbar').getBoundingClientRect().top : upd.getBoundingClientRect().top;
  $('app').style.setProperty('--win-top', Math.round(pip.bottom - app.top + 6) + 'px');
  $('app').style.setProperty('--win-bot', Math.round(app.bottom - below) + 'px');
}
// 화면 크기가 바뀌면 원정 창·본부·창 자리를 다시 잡는다
function layoutStage() { sizeView(); sizeHQ(); layoutWin(); }

/* ───────── 장소 판 (아래 가운데 이름 · 양옆 금빛 화살표 · 위치 점) ───────── */
function floorInfo(f) {
  if (f.id === 'shop') { const sd = S.sold.day === today() ? S.sold : { n: 0, g: 0 }; return `진열대 ${slotCount()}칸 · 오늘 ${sd.n}개 ${fmt(sd.g)}G 판매`; }
  if (f.id === 'tavern') { const n = hqWhere().tav.length; return `찾아온 모험가 ${S.cands.length}명${n ? ` · 쉬는 모험가 ${n}명` : ' · 이틀마다 새 얼굴'}`; }
  if (f.id === 'inn') return `방 ${living().length}/${beds()} · 자는 모험가 ${hqWhere().inn.size}명`;
  if (f.id === 'temple') return `환자 ${patients().length}명 · 치유사 ${healers().length}/${healerSlots()}`;
  if (f.id === 'pen') return `펫 ${S.pets.length}/${penCap()} · 품는 알 ${(S.pen && S.pen.inc.length) || 0}`;
  if (f.id === 'training') { const ph = phaseOf(S.t); return ph === 0 || ph === 3 ? '밤에는 쉬어요' : `훈련하는 모험가 ${hqWhere().train.length}명`; }
  if (f.id === 'alchemy') return `회복 물약 ${(S.inv.pot_s || 0) + (S.inv.pot_m || 0) + (S.inv.pot_l || 0)}개 · 마나 물약 ${(S.inv.mp_s || 0) + (S.inv.mp_m || 0)}개`;
  if (f.id === 'tower') return S.research.cur ? `연구 중: ${RESEARCH[S.research.cur.k].name}` : '연구를 쉬고 있어요';
  if (f.id === 'smithy') return `보관 중인 장비 ${S.gear.length}개`;
  if (typeof FLOOR_TXT !== 'undefined' && FLOOR_TXT[f.id]) return FLOOR_TXT[f.id]();
  return '';
}
function renderFloors() {
  if (!S) return;
  const L = hqPlaces(), i = Math.max(0, L.findIndex(f => f.key === HQ.cur)), cur = L[i], prev = L[i - 1], next = L[i + 1];
  const nav = (f, cls) => f ? `<button type="button" class="pnav ${cls}${f.under ? ' ug' : ''}" data-go="${f.key}" aria-label="${esc(f.name)}(으)로"><i class="parr" style="background-image:url(${Q_ARROW})"></i><span class="pn">${esc(f.name)}</span></button>`
    : `<button type="button" class="pnav ${cls}" disabled aria-hidden="true"><i class="parr" style="background-image:url(${Q_ARROW})"></i><span class="pn">&nbsp;</span></button>`;
  const dots = L.map((f, j) => `<i class="${f.under ? 'u' : ''}${j === i ? ' on' : ''}"></i>`).join('');
  const html = nav(prev, 'prev') + `<button type="button" class="ptab${cur.under ? ' ug' : ''}" data-pwin="${cur.id}" aria-label="${esc(cur.name)} 창 열기"><span class="pnm">${esc(cur.name)}</span><small>${esc(floorInfo(cur))}</small><span class="pdots" aria-hidden="true">${dots}</span></button>` + nav(next, 'next');
  if (html !== UI.pbar) { $('placebar').innerHTML = html; UI.pbar = html; }
}
// 본부 화면을 눌렀을 때: 가구·사람 → 창
function hqOpen(h) {
  if (!h) return;
  if (h.adv) { openAdv(h.adv); return; }
  const w = h.win;
  if (!w) return;
  if (w === 'guest') { UI.advCat = 'guest'; openWin('adv'); return; }
  if (w.startsWith('b:')) openWin('b', { b: w.slice(2) }); else openWin(w);
}
const BLD_FLOOR = { shop: 'shop0', inn: 'inn0', temple: 'temple0', training: 'training0', alchemy: 'alchemy0', tower: 'tower0', smithy: 'smithy0', pen: 'pen0', stable: 'stable0', library: 'library0', airfield: 'airfield0', kitchen: 'kitchen0', salvage: 'salvage0' };

/* ───────── 배속 ───────── */
function renderSpeed() {
  const cur = (S && S.speed) || 1, b = $('speed');
  b.textContent = cur + '×';
  b.classList.toggle('fast', cur > 1);
  b.setAttribute('aria-label', `게임 속도 ${cur}배. 누르면 바꿔요`);
}
function setSpeed(n) {
  if (!S || !SPEEDS.includes(n)) return;
  S.speed = n;
  renderSpeed(); saveGame();
}

/* ───────── 저장 코드 ─────────
   OHMUL2: deflate 압축 + base64 (짧다). OHMUL1: base64만 (압축을 못 하는 브라우저). 맨 JSON도 받는다. */
function b64(u8) { let s = ''; for (let i = 0; i < u8.length; i += 8192) s += String.fromCharCode.apply(null, u8.subarray(i, i + 8192)); return btoa(s); }
function unb64(b) { const s = atob(b), u = new Uint8Array(s.length); for (let i = 0; i < s.length; i++) u[i] = s.charCodeAt(i); return u; }
const canZip = () => typeof CompressionStream !== 'undefined' && typeof DecompressionStream !== 'undefined';
// 쓰기 쪽 약속은 읽기 쪽이 실패하면 함께 거부되므로(잘린 코드) 따로 삼킨다 — 안 그러면 unhandledrejection
const pipeU8 = (st, u8) => { const w = st.writable.getWriter(); w.write(u8).catch(() => {}); w.close().catch(() => {}); return new Response(st.readable).arrayBuffer().then(b => new Uint8Array(b)); };
const zipU8 = u8 => pipeU8(new CompressionStream('deflate'), u8);
const unzipU8 = u8 => pipeU8(new DecompressionStream('deflate'), u8);
async function saveCode() {
  saveGame();
  const u8 = new TextEncoder().encode(JSON.stringify(S));
  if (canZip()) { try { return 'OHMUL2:' + b64(await zipU8(u8)); } catch (_) {} }
  return 'OHMUL1:' + b64(u8);
}
const SAVE_ERR = { prefix: '저장 코드가 아니에요. 「OHMUL1:」이나 「OHMUL2:」로 시작하는 코드를 통째로 붙여 넣어 주세요.', b64: '코드에 다른 글자가 섞였거나 일부가 빠졌어요. 처음부터 끝까지 빠짐없이 붙여 넣었는지 확인해 주세요.', zip: '코드가 중간에 잘렸어요. 끝까지 전부 복사했는지 확인해 주세요.', nozip: '이 브라우저는 압축 저장 코드를 풀 수 없어요. 최신 브라우저나 앱에서 불러와 주세요.', json: '코드가 깨졌어요. 메신저가 긴 글을 자르지 않았는지 확인해 주세요.', shape: '오물거리 상단의 저장 코드가 아니에요.', newer: '더 새로운 판에서 만든 저장이에요. 앱을 업데이트한 뒤 불러와 주세요.' };
// 저장 코드 → 저장 객체. 못 풀면 Error(SAVE_ERR의 키)
async function parseSave(txt) {
  txt = String(txt || '').trim();
  const m = txt.match(/OHMUL(\d)\s*:\s*([\s\S]*)$/);
  let raw;
  if (m) {
    const body = m[2].replace(/[^A-Za-z0-9+/=]/g, '');
    if (!body) throw new Error('b64');
    let u8;
    try { u8 = unb64(body); } catch (_) { throw new Error('b64'); }
    if (m[1] === '2') { if (!canZip()) throw new Error('nozip'); try { u8 = await unzipU8(u8); } catch (_) { throw new Error('zip'); } }
    raw = new TextDecoder().decode(u8);
  } else if (txt.startsWith('{')) raw = txt;
  else throw new Error('prefix');
  let v;
  try { v = JSON.parse(raw); } catch (_) { throw new Error('json'); }
  if (!v || typeof v !== 'object' || !Array.isArray(v.advs) || !v.parties) throw new Error('shape');
  if (typeof v.v !== 'number' || v.v < 1) throw new Error('shape');
  if (v.v > SAVE_V) throw new Error('newer');
  return v;
}
async function copyText(el) {
  try { await navigator.clipboard.writeText(el.value); return true; } catch (_) {}
  try { el.focus(); el.select(); el.setSelectionRange(0, el.value.length); return document.execCommand('copy'); } catch (_) { return false; }
}
const canShare = () => { try { return !!(navigator.share); } catch (_) { return false; } };
const saveSummary = v => { try { const p = dateParts(v.t || 0); return `${p.m}월 ${p.d}일 · 모험가 ${(v.advs || []).length}명 · ${fmt(Math.round(v.gold || 0))}G · 명성 ${Math.floor(v.fame || 0)}`; } catch (_) { return '저장'; } };
async function openExport() {
  openModal('저장 코드', '<p>코드를 만드는 중…</p>', [{ label: '닫기' }]);
  const code = await saveCode();
  const kb = Math.round(code.length / 1024 * 10) / 10;
  $('m-body').innerHTML = `<p>아래 코드를 복사해 메모장이나 메신저 「나에게 보내기」에 보관하세요. 다른 기기나 새로 설치한 앱에서 「저장 코드로 불러오기」에 통째로 붙여 넣으면 지금 진행 상황이 그대로 옮겨져요.</p>
    <p class="sub muted">${saveSummary(S)} · 코드 ${kb}KB${code.startsWith('OHMUL2') ? ' (압축)' : ''}. 긴 코드는 메신저가 자를 수 있으니 메모장에 보관하는 편이 안전해요.</p>
    <textarea class="code" id="code-out" readonly rows="5">${code}</textarea>
    <div class="btns"><button type="button" class="btn sm gold" id="code-copy">복사하기</button>${canShare() ? '<button type="button" class="btn sm" id="code-share">공유하기</button>' : ''}${isApp() ? '' : '<button type="button" class="btn sm" id="code-file">파일로 저장</button>'}</div>`;
  $('code-copy').onclick = async () => { say((await copyText($('code-out'))) ? '저장 코드를 복사했어요' : '코드를 길게 눌러 전체 선택한 뒤 복사해 주세요'); };
  if ($('code-share')) $('code-share').onclick = async () => { try { await navigator.share({ title: '판타지세계 상단 키우기 저장 코드', text: code }); } catch (_) {} };
  // 설치한 앱의 WebView는 내려받기를 못 해서 파일 단추를 숨긴다 (복사·백업 슬롯을 쓴다)
  if ($('code-file')) $('code-file').onclick = async () => {
    const name = `ohmulgeori-save-${new Date().toISOString().slice(0, 10)}.txt`;
    // claude.ai 아티팩트 뷰어 안에서는 보통 내려받기가 막혀 있어 뷰어의 저장 창(downloads 기능)을 쓴다
    try { if (window.claude && typeof window.claude.use === 'function') { const dl = await window.claude.use('downloads'); if (dl) { await dl.save({ filename: name, data: code }); say('저장 파일을 내려받았어요'); return; } } } catch (e) { if (e && e.code === 'declined') return; }
    try { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([code], { type: 'text/plain' })); a.download = name; document.body.append(a); a.click(); a.remove(); say('저장 파일을 내려받았어요'); } catch (_) { say('파일로 저장할 수 없어요. 코드를 복사해 주세요'); }
  };
}
// 저장 객체를 지금 게임으로 (첫 화면이면 done이 게임을 시작한다)
function applySave(v, done) {
  v.lastSeen = Date.now();
  if (!loadFrom(v)) { say('저장을 불러오지 못했어요'); return false; }
  saveGame();
  UI.html = ''; UI.chips = ''; if (typeof V !== 'undefined') V.mode = '';
  if (done) done(); else { renderPanel(true); renderChips(); updateHud(); renderSpeed(); }
  say('저장을 불러왔어요');
  return true;
}
// done: 불러온 뒤 할 일 (첫 화면에서 부를 때 게임을 시작한다)
function openImport(done) {
  openModal('저장 코드로 불러오기', `<p>복사해 둔 저장 코드를 붙여 넣거나 저장 파일을 고르세요. 지금 이 기기의 진행 상황은 불러온 저장으로 바뀌어요.</p>
    <textarea class="code" id="code-in" rows="5" placeholder="OHMUL2:... 또는 OHMUL1:..."></textarea>
    <p class="sub red-t" id="code-err" hidden></p>
    <div class="btns"><button type="button" class="btn sm gold" id="code-load">불러오기</button><button type="button" class="btn sm" id="code-paste">붙여 넣기</button><label class="btn sm" for="code-filein">파일에서</label><input type="file" id="code-filein" accept=".txt,text/plain,application/json" hidden></div>`, [{ label: '닫기' }]);
  const fail = k => { const el = $('code-err'); el.textContent = SAVE_ERR[k] || SAVE_ERR.json; el.hidden = false; };
  const tryLoad = async txt => {
    let v;
    try { v = await parseSave(txt); } catch (e) { fail(e && e.message); return; }
    $('code-err').hidden = true;
    const go = () => applySave(v, done);
    if (S) confirmBox('저장 불러오기', `지금 진행 상황을 이 저장(${saveSummary(v)})으로 바꿀까요? 되돌릴 수 없어요.`, '불러오기', go, true);
    else { closeModal(); go(); }
  };
  $('code-load').onclick = () => tryLoad($('code-in').value);
  $('code-paste').onclick = async () => { try { const t = await navigator.clipboard.readText(); if (t) { $('code-in').value = t; tryLoad(t); } else say('클립보드가 비어 있어요'); } catch (_) { say('붙여 넣기 권한이 없어요. 칸을 길게 눌러 붙여 넣어 주세요'); } };
  $('code-filein').onchange = async e => { const f = e.target.files && e.target.files[0]; if (!f) return; try { const t = await f.text(); $('code-in').value = t; tryLoad(t); } catch (_) { fail('json'); } };
}

/* ───────── 백업 슬롯: 이 기기에 저장 셋 ───────── */
const SLOT_N = 3;
const slotKey = i => `${SAVE_KEY}:slot${i}`;
function slotInfo(i) { try { const raw = localStorage.getItem(slotKey(i)); if (!raw) return null; const o = JSON.parse(raw); return { at: o.at, sum: o.sum, name: o.name }; } catch (_) { return null; } }
function slotSave(i) {
  if (!S) return '';
  saveGame();
  try { localStorage.setItem(slotKey(i), JSON.stringify({ at: Date.now(), name: S.company || '', sum: saveSummary(S), data: JSON.stringify(S) })); } catch (_) { return '저장 공간이 모자라요. 다른 슬롯을 비우거나 저장 코드를 파일로 보관해 주세요.'; }
  return '';
}
function slotLoad(i) {
  let v;
  try { const o = JSON.parse(localStorage.getItem(slotKey(i)) || 'null'); v = o && JSON.parse(o.data); } catch (_) { v = null; }
  if (!v || !Array.isArray(v.advs)) return '슬롯이 비어 있거나 깨졌어요.';
  return applySave(v) ? '' : '불러오지 못했어요.';
}
function slotClear(i) { try { localStorage.removeItem(slotKey(i)); } catch (_) {} }
const slotWhen = t => { const d = new Date(t); return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`; };
function slotRows() {
  let out = '';
  // 찬 슬롯은 글이 길어 세로로(.col): 이름·요약 위, 단추 줄 아래
  for (let i = 1; i <= SLOT_N; i++) { const o = slotInfo(i); out += `<div class="li${o ? ' col' : ''}"><div class="grow stack"><span>슬롯 ${i} ${o ? `<span class="muted">· ${slotWhen(o.at)}에 저장</span>` : '<span class="muted">· 비어 있음</span>'}</span>${o ? `<span class="sub">${esc(o.name || '')} · ${esc(o.sum || '')}</span>` : ''}</div><div class="btns"><button type="button" class="btn sm${o ? '' : ' gold'}" data-act="slotsave" data-i="${i}">${o ? '덮어쓰기' : '저장'}</button>${o ? `<button type="button" class="btn sm gold" data-act="slotload" data-i="${i}">불러오기</button><button type="button" class="btn sm" data-act="slotclear" data-i="${i}">비우기</button>` : ''}</div></div>`; }
  return out;
}

/* ───────── 앱 업데이트 알림 (설치한 앱에서만) ───────── */
const isApp = () => { try { return !!(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform()); } catch (_) { return false; } };
async function checkUpdate(manual) {
  if (!isApp() || !BUILD_NO) { if (manual) say('업데이트 확인은 설치한 앱에서만 할 수 있어요'); return; }
  try {
    const r = await fetch(`https://api.github.com/repos/${REPO}/releases/latest`, { headers: { Accept: 'application/vnd.github+json' }, cache: 'no-store' });
    if (!r.ok) throw new Error(String(r.status));
    const j = await r.json(), n = +String(j.tag_name || '').replace(/\D/g, '') || 0;
    if (n > BUILD_NO) {
      const a = (j.assets || []).find(x => /\.apk$/.test(x.name));
      showUpdate(j.name || j.tag_name, a ? a.browser_download_url : j.html_url);
    } else if (manual) say('지금이 최신 버전이에요');
  } catch (_) { if (manual) say('업데이트를 확인하지 못했어요. 인터넷 연결을 확인해 주세요'); }
}
function showUpdate(name, url) {
  const el = $('upd');
  el.innerHTML = `<span class="grow">새 버전 <b>${esc(name)}</b>이(가) 나왔어요. 받아서 설치하면 덮어쓰기로 업데이트되고 저장은 그대로 남아요.</span><a class="btn sm gold" href="${esc(url)}">받기</a><button type="button" class="btn sm" id="upd-x">닫기</button>`;
  el.hidden = false;
  $('upd-x').onclick = () => { el.hidden = true; };
}

/* ───────── 창 ───────── */
function openModal(title, html, btns) {
  sfx('open');
  UI.modal = true;
  $('m-body').onclick = null;
  $('m-title').textContent = title;
  $('m-body').innerHTML = html;
  const box = $('m-btns');
  box.textContent = '';
  (btns || [{ label: '확인', cls: 'gold' }]).forEach(b => {
    const el = document.createElement('button');
    el.type = 'button'; el.className = 'btn ' + (b.cls || ''); el.textContent = b.label;
    el.onclick = () => { closeModal(); if (b.fn) b.fn(); };
    box.append(el);
  });
  $('modal').hidden = false;
  $('m-box').scrollTop = 0;
  setTimeout(() => { if (box.lastChild) box.lastChild.focus({ preventScroll: true }); }, 40);
}
function closeModal() { $('modal').hidden = true; $('m-body').onclick = null; UI.modal = false; setTimeout(pumpModals, 150); }
function pumpModals() {
  if (UI.modal || !S || !S.modals.length || !$('title-scr').hidden) return;
  const m = S.modals.shift();
  if (m.gate) {
    // 던전 입구: 아직 기다리고 있을 때만 묻는다
    const p = S.parties.find(x => x.id === m.gate);
    if (!p || !p.exp || p.exp.wait !== 'gate') { setTimeout(pumpModals, 50); return; }
    openModal(m.title, (m.body || []).map(t => `<p>${esc(t)}</p>`).join(''), [{ label: '지나가기', fn: () => { gateChoice(p, 'skip'); renderPanel(true); } }, { label: '들어가기', cls: 'gold', fn: () => { gateChoice(p, 'enter'); S.view = p.id; renderPanel(true); renderChips(); } }]);
    return;
  }
  const rest = S.modals.filter(x => !x.gate).length;   // 뒤에 기다리는 알림 (던전 입구 질문은 남긴다)
  const btns = [{ label: '확인', cls: 'gold' }];
  if (rest >= 1) btns.unshift({ label: `모두 넘기기 (${rest + 1})`, cls: 'skipall', fn: () => { S.modals = S.modals.filter(x => x.gate); } });
  openModal(m.title, (m.body || []).map(t => `<p>${esc(t)}</p>`).join(''), btns);
}
function confirmBox(title, text, ok, fn, danger) {
  openModal(title, `<p>${esc(text)}</p>`, [{ label: '취소' }, { label: ok, cls: danger ? 'red' : 'gold', fn }]);
}
function toast(msg) {
  const box = $('toasts'), d = document.createElement('div');
  d.className = 'toast'; d.textContent = msg;
  box.append(d);
  while (box.children.length > 3) box.firstChild.remove();
  setTimeout(() => d.remove(), 2600);
}
const say = msg => { if (msg) toast(msg); };

/* ───────── 첫 화면 ───────── */
let titleRaf = 0;
function showTitle() {
  $('title-scr').hidden = false;
  $('t-sub').textContent = `${WORLD.continent} 대륙 · ${WORLD.empire} · 제도 ${WORLD.capital}`;
  $('t-intro').innerHTML = STORY.intro.map(t => `<p>${esc(t)}</p>`).join('');
  const cv = $('title-cv'), ctx = cv.getContext('2d');
  const [off, g] = mkCanvas(AW * HI, AH * HI);
  g.setTransform(HI, 0, 0, HI, 0, 0);
  const cast = [
    { cls: 'warrior', look: { hair: '#5a3a22', skin: '#e0ac7e' } },
    { cls: 'archer', look: { hair: '#c9a04a', skin: '#f1c9a5' } },
    { cls: 'cleric', look: { hair: '#2b1d16', skin: '#c68a5e' } },
    { cls: 'mage', look: { hair: '#d8d0c0', skin: '#f1c9a5' } }
  ];
  const draw = now => {
    if ($('title-scr').hidden) return;
    const r = cv.getBoundingClientRect(), dpr = window.devicePixelRatio || 1;
    const w = Math.max(AW * HI, Math.round(r.width * dpr)), h = Math.max(PIP_H * HI, Math.round(r.height * dpr));
    if (cv.width !== w) { cv.width = w; cv.height = h; }
    drawStill(g, 'town', cast, now / 1000);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(off, 0, PIP_Y * HI, AW * HI, PIP_H * HI, 0, 0, cv.width, cv.height);
    titleRaf = requestAnimationFrame(draw);
  };
  cancelAnimationFrame(titleRaf);
  titleRaf = requestAnimationFrame(draw);
}
