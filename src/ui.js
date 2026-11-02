/* ───────── 화면 공통 ───────── */
const UI = { stack: [], dirty: true, html: '', winKey: '', chips: '', floors: '', fname: '', hold: false, modal: false, smithT: null, pipBig: false };
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
  scroll: ['.kkkkkk..', 'kppppppk.', 'kpkkkkpk.', 'kppppppk.', '.kpkkkpk.', '.kppppppk', '.kpkkkkpk', '.kppppppk', '..kkkkkk.']
};
const UI_PAL = { k: '#0b0d12', y: '#f0b43c', l: '#fff2c0', d: '#9a6a1c', f: '#5fd4c0', w: '#c9c3b8', s: '#f1c9a5', t: '#4a7ac8', b: '#9a6a3c', p: '#e8dcb8' };
function pxURL(name) {
  const pat = UI_PX[name], w = pat[0].length, h = pat.length;
  const [c, x] = mkCanvas(w, h);
  pat.forEach((row, y) => { for (let i = 0; i < w; i++) if (row[i] !== '.') R(x, i, y, 1, 1, UI_PAL[row[i]]); });
  return c.toDataURL();
}
function applyPx() { document.querySelectorAll('img[data-px]').forEach(im => { im.src = pxURL(im.dataset.px); }); }

const POR = {};
function portrait(a) {
  const key = advKey(a);
  if (POR[key]) return POR[key];
  const [c, x] = mkCanvas(25, 30);
  x.translate(12, 28);
  drawAdv(x, a, 0, {});
  return (POR[key] = c.toDataURL());
}
const iconImg = (id, cls = 'ico') => `<img class="${cls}" src="${iconURL(id)}" alt="">`;

/* ───────── 상태줄과 화면 위 글씨 ───────── */
function updateHud() {
  $('h-gold').textContent = fmt(S.gold);
  $('h-fame').textContent = fmt(S.fame);
  const p = dateParts(S.t), ph = phaseOf(S.t), hd = $('h-date');
  const html = `${p.m}월 ${p.d}일 <span class="clk">${clockStr(S.t)}</span> <span class="ph ph-${PHASES[ph].id}">${PHASES[ph].name}</span>`;
  if (hd.innerHTML !== html) hd.innerHTML = html;
  const dd = S.settleDay - today(), r = $('h-rent');
  r.textContent = `정산 D-${dd}`;
  r.classList.toggle('due', dd <= 3);
  const n = S.reqs.filter(q => reqHave(q) >= q.qty).length, b = $('req-badge');
  b.hidden = !n; b.textContent = n;
}
const WHY = { full: '짐이 가득 차 복귀 중', danger: '위험해서 복귀 중', loss: '쓰러진 동료를 들것에 싣고 복귀 중', boss: '던전의 주인을 쓰러뜨리고 복귀 중', ahead: '앞이 너무 위험해 복귀 중', order: '명령을 받고 복귀 중', end: '필드 끝에서 복귀 중', sleep: '잠이 모자라 복귀 중' };
function expStatus(p) {
  const e = p.exp;
  if (!e) return p.members.length ? '상단에서 대기 중' : '파티원이 없어요';
  const F = FIELDS[e.field];
  if (e.foes.length) { const fb = e.foes.find(f => f.fb); return fb ? `필드 보스 ${fb.name}와(과) 싸우는 중!` : e.foes.some(f => f.boss) ? '던전의 주인과 싸우는 중!' : e.camp ? '야영지 습격!' : '전투 중'; }
  if (e.camp) return e.camp.t > 1.5 ? '모닥불 곁에서 자는 중' : '모닥불을 피우는 중';
  if (e.wait === 'gate') return `${F.dungeon.name} 입구 · 들어갈지 정해 주세요`;
  const tired = teamOf(p).some(a => (a.fat || 0) >= 60), carry = teamOf(p).filter(a => a.down).length;
  if (e.mode === 'return') return (WHY[e.why] || '복귀 중') + (carry && e.why !== 'loss' ? ` · 들것 ${carry}` : '') + (tired ? ' · 지침' : '');
  if (carry) return `들것 ${carry}개를 메고 ${e.area === 'dungeon' ? '던전 탐험' : '전진'} 중`;
  return (e.area === 'dungeon' ? '던전 탐험 중' : '전진 중') + (tired ? ' · 지침' : '');
}
function whereStr(e) {
  const F = FIELDS[e.field];
  return e.area === 'dungeon' ? `${F.dungeon.name} ${e.stage}층` : `${F.name} ${F.no}-${e.stage}`;
}
function updateOverlay() {
  const p = viewParty(), L = $('ov-l'), Rr = $('ov-r'), B = $('ov-b');
  if (!p) { L.textContent = '오물거리 · 상단 앞'; Rr.hidden = true; B.hidden = true; return; }
  const e = p.exp;
  if (!e) { L.textContent = `${p.name} · 오물거리 상단 앞`; Rr.hidden = true; B.hidden = false; B.textContent = p.members.length ? '대기 중 · 원정 메뉴에서 출발' : '파티원이 없어요'; return; }
  L.textContent = `${p.name} · ${whereStr(e)}`;
  const u = usedOf(p), c = capOf(p);
  Rr.hidden = false; Rr.innerHTML = `짐 <span class="${u >= c ? 'warn' : 'gold'}">${u}/${c}</span>`;
  B.hidden = false; B.textContent = expStatus(p);
}
function renderChips() {
  const html = S.parties.map(p => {
    const e = p.exp, cls = !e ? '' : e.foes.length ? 'fight' : e.camp ? 'camp' : e.wait ? 'wait' : e.mode === 'return' ? 'back' : 'go';
    const st = !e ? '대기' : e.area === 'dungeon' ? `${FIELDS[e.field].raid ? '은신처' : '던전'} ${e.stage}층` : `${FIELDS[e.field].no}-${e.stage}`;
    return `<button type="button" class="pchip${S.view === p.id ? ' on' : ''}" data-view="${p.id}"><i class="dot ${cls}"></i>${esc(p.name)} · ${st}</button>`;
  }).join('');
  if (html !== UI.chips) { $('pchips').innerHTML = html; UI.chips = html; }
}

/* ───────── 창: 메뉴 → 하위 메뉴 → 창, 뒤로 ───────── */
const WIN_TITLE = { co: '상단', fac: '시설', adv: '모험가', exp: '원정', inv: '창고', req: '의뢰', co_rank: '상단 랭크', co_money: '월말 정산', co_spon: '후원', co_goal: '목표', co_log: '소식', co_set: '설정' };
const winTop = () => UI.stack[UI.stack.length - 1] || null;
function winTitle(w) {
  if (w.id === 'b') return BUILDINGS[w.b] ? BUILDINGS[w.b].name : '시설';
  if (w.id === 'advd') { const a = S && advById(w.aid); return a ? `${a.name} · ${CLASSES[a.cls].name}` : '모험가'; }
  return WIN_TITLE[w.id] || '';
}
function openWin(id, o) {
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
function closeWins() {
  const n = UI.stack.length;
  if (!n) return;
  UI.stack.length = 0;
  try { const k = Math.min(n, (history.state && history.state.w) || 0); if (k) { UI.skipPop = 1; history.go(-k); } } catch (_) {}
  showWin(true);
}
window.addEventListener('popstate', e => {
  if (UI.skipPop) { UI.skipPop = 0; return; }
  const n = (e.state && e.state.w) || 0;
  if (UI.modal && $('m-btns').children.length === 1) { closeModal(); if (UI.stack.length) try { history.pushState({ w: UI.stack.length }, ''); } catch (_) {} return; }
  if (UI.stack.length > n) { UI.stack.length = n; showWin(true); }
});
function showWin(scroll) {
  const top = winTop(), el = $('win');
  $('stage').classList.toggle('win-open', !!top);
  document.querySelectorAll('.mbtn').forEach(b => b.classList.toggle('on', !!top && UI.stack[0].id === b.dataset.open));
  if (!top) { el.hidden = true; UI.html = ''; UI.winKey = ''; return; }
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
function setPip(big) {
  UI.pipBig = !!big;
  $('pip').classList.toggle('big', UI.pipBig);
  try { localStorage.setItem('ohmul:pip', UI.pipBig ? '1' : '0'); } catch (_) {}
  layoutStage();
}
// 원정 창 크기가 바뀌면 메뉴·본부·창 자리를 다시 잡는다
function layoutStage() {
  const st = $('stage'), pip = $('pip');
  st.classList.toggle('pipbig', UI.pipBig);
  st.style.setProperty('--pip-b', Math.round(pip.getBoundingClientRect().bottom - st.getBoundingClientRect().top) + 'px');
  sizeView(); sizeHQ(); layoutWin();
}

/* ───────── 층 버튼과 층 이름 ───────── */
function floorInfo(f) {
  if (f.id === 'shop') { const sd = S.sold.day === today() ? S.sold : { n: 0, g: 0 }; return `진열대 ${slotCount()}칸 · 오늘 ${sd.n}개 ${fmt(sd.g)}G 판매`; }
  if (f.id === 'inn') return `방 ${living().length}/${beds()} · 자는 모험가 ${living().filter(a => a.status === 'idle' && ((a.sleep || 0) > 2 || isNight())).length}명`;
  if (f.id === 'temple') return `환자 ${patients().length}명 · 치유사 ${healers().length}/${healerSlots()}`;
  if (f.id === 'training') return isNight() ? '밤에는 쉬어요' : `훈련하는 모험가 ${Math.min(6, living().filter(a => a.status === 'idle' && !a.inj && !a.post && (a.sleep || 0) <= 2).length)}명`;
  if (f.id === 'alchemy') return `회복 물약 ${(S.inv.pot_s || 0) + (S.inv.pot_m || 0) + (S.inv.pot_l || 0)}개 · 마나 물약 ${(S.inv.mp_s || 0) + (S.inv.mp_m || 0)}개`;
  if (f.id === 'tower') return S.research.cur ? `연구 중: ${RESEARCH[S.research.cur.k].name}` : '연구를 쉬고 있어요';
  if (f.id === 'smithy') return `보관 중인 장비 ${S.gear.length}개`;
  if (f.id === 'bank') return `거래 ${S.bank.deps.length + S.bank.loans.length}/${bankCap()}건`;
  return '';
}
function renderFloors() {
  if (!S) return;
  const L = hqFloors().reverse(), cur = hqFloor(HQ.cur);   // 아래층부터 왼쪽에
  const html = L.map(f => `<button type="button" class="fl${f.key === cur.key ? ' on' : ''}${f.under ? ' ug' : ''}" data-floor="${f.key}" aria-label="${f.label} ${esc(f.name)}"${f.key === cur.key ? ' aria-current="true"' : ''}>${f.id === 'tower' ? '탑' : f.label}</button>`).join('');
  if (html !== UI.floors) { $('floors').innerHTML = html; UI.floors = html; }
  const fn = `<b>${cur.label}</b>${esc(cur.name)}<small>${esc(floorInfo(cur))}</small>`;
  if (fn !== UI.fname) { $('floor-name').innerHTML = fn; UI.fname = fn; }
}
// 본부 화면을 눌렀을 때: 가구·사람 → 창
function hqOpen(h) {
  if (!h) return;
  if (h.adv) { openAdv(h.adv); return; }
  const w = h.win;
  if (!w) return;
  if (w.startsWith('b:')) openWin('b', { b: w.slice(2) }); else openWin(w);
}
const BLD_FLOOR = { shop: 'shop0', inn: 'inn0', temple: 'temple0', training: 'training0', alchemy: 'alchemy0', tower: 'tower0', smithy: 'smithy0', bank: 'bank0' };

/* ───────── 배속 ───────── */
function renderSpeed() {
  const cur = (S && S.speed) || 1;
  $('speed').querySelectorAll('[data-speed]').forEach(b => { const on = +b.dataset.speed === cur; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); });
}
function setSpeed(n) {
  if (!S || !SPEEDS.includes(n)) return;
  S.speed = n;
  renderSpeed(); saveGame();
}

/* ───────── 저장 코드 ───────── */
function b64(u8) { let s = ''; for (let i = 0; i < u8.length; i += 8192) s += String.fromCharCode.apply(null, u8.subarray(i, i + 8192)); return btoa(s); }
function unb64(b) { const s = atob(b), u = new Uint8Array(s.length); for (let i = 0; i < s.length; i++) u[i] = s.charCodeAt(i); return u; }
function saveCode() { saveGame(); return 'OHMUL1:' + b64(new TextEncoder().encode(JSON.stringify(S))); }
function parseSave(txt) {
  txt = (txt || '').trim();
  const raw = txt.startsWith('OHMUL1:') ? new TextDecoder().decode(unb64(txt.slice(7).replace(/\s+/g, ''))) : txt;
  const v = JSON.parse(raw);
  if (!v || !Array.isArray(v.advs) || ![1, 2, 3, 4].includes(v.v)) throw new Error('bad save');
  return v;
}
async function copyText(el) {
  try { await navigator.clipboard.writeText(el.value); return true; } catch (_) {}
  try { el.focus(); el.select(); return document.execCommand('copy'); } catch (_) { return false; }
}
function openExport() {
  openModal('저장 코드', `<p>아래 코드를 복사해 메모장이나 메신저 나에게 보내기 등에 보관하세요. 다른 기기나 새로 설치한 앱에서 「저장 코드로 불러오기」에 붙여 넣으면 지금 진행 상황이 그대로 옮겨져요.</p>
    <textarea class="code" id="code-out" readonly rows="5">${saveCode()}</textarea>
    <div class="btns"><button type="button" class="btn sm gold" id="code-copy">복사하기</button></div>`, [{ label: '닫기' }]);
  $('code-copy').onclick = async () => { say((await copyText($('code-out'))) ? '저장 코드를 복사했어요' : '코드를 길게 눌러 직접 복사해 주세요'); };
}
// done: 불러온 뒤 할 일 (첫 화면에서 부를 때 게임을 시작한다)
function openImport(done) {
  openModal('저장 코드로 불러오기', `<p>복사해 둔 저장 코드를 붙여 넣으세요. 지금 이 기기의 진행 상황은 불러온 저장으로 바뀌어요.</p>
    <textarea class="code" id="code-in" rows="5" placeholder="OHMUL1:..."></textarea>
    <p class="sub red-t" id="code-err" hidden>저장 코드가 올바르지 않아요. 처음부터 끝까지 빠짐없이 붙여 넣었는지 확인해 주세요.</p>
    <div class="btns"><button type="button" class="btn sm gold" id="code-load">불러오기</button></div>`, [{ label: '닫기' }]);
  $('code-load').onclick = () => {
    let v;
    try { v = parseSave($('code-in').value); } catch (_) { $('code-err').hidden = false; return; }
    const apply = () => {
      v.lastSeen = Date.now();
      if (!loadFrom(v)) { say('저장을 불러오지 못했어요'); return; }
      saveGame();
      UI.html = ''; UI.chips = ''; V.mode = '';
      if (done) done(); else { renderPanel(true); renderChips(); updateHud(); renderSpeed(); }
      say('저장을 불러왔어요');
    };
    if (S) confirmBox('저장 불러오기', '지금 진행 상황을 이 저장으로 바꿀까요? 되돌릴 수 없어요.', '불러오기', apply, true);
    else { closeModal(); apply(); }
  };
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
  openModal(m.title, (m.body || []).map(t => `<p>${esc(t)}</p>`).join(''));
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
  const [off, g] = mkCanvas(VW, VH);
  const cast = [
    { cls: 'warrior', look: { hair: '#5a3a22', skin: '#e0ac7e' } },
    { cls: 'archer', look: { hair: '#c9a04a', skin: '#f1c9a5' } },
    { cls: 'cleric', look: { hair: '#2b1d16', skin: '#c68a5e' } },
    { cls: 'mage', look: { hair: '#d8d0c0', skin: '#f1c9a5' } }
  ];
  const draw = now => {
    if ($('title-scr').hidden) return;
    const r = cv.getBoundingClientRect(), dpr = window.devicePixelRatio || 1;
    const w = Math.max(VW, Math.round(r.width * dpr)), h = Math.max(VH, Math.round(r.height * dpr));
    if (cv.width !== w) { cv.width = w; cv.height = h; }
    drawBg(g, 'town', 0, now / 1000);
    cast.forEach((a, i) => { g.save(); g.translate(56 + i * 34 + (i >= 2 ? 26 : 0), GY); g.scale(i < 2 ? 1 : -1, 1); drawAdv(g, a, now / 1000, {}); g.restore(); });
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(off, 0, 0, VW, VH, 0, 0, cv.width, cv.height);
    titleRaf = requestAnimationFrame(draw);
  };
  cancelAnimationFrame(titleRaf);
  titleRaf = requestAnimationFrame(draw);
}
