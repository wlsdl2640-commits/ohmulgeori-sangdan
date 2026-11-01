/* ───────── 화면 공통 ───────── */
const UI = { tab: 'co', dirty: true, html: '', chips: '', hold: false, modal: false };
const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const fmt = n => Math.floor(n).toLocaleString('ko-KR');
const pct = (a, b) => Math.max(0, Math.min(100, Math.round(a / Math.max(1, b) * 100)));

/* 화면용 도트 아이콘 */
const UI_PX = {
  coin:   ['..kkkk..', '.kyyyyk.', 'kyllyydk', 'kylyyydk', 'kylyyydk', 'kyyyyydk', '.kddddk.', '..kkkk..'],
  star:   ['...kk...', '...ff...', '..kffk..', 'kfffffk.', '.kfffk..', '.kfkfk..', 'kfk.kfk.', 'kk...kk.'],
  house:  ['....k....', '...kyk...', '..kyyyk..', '.kyyyyyk.', 'kkkkkkkkk', '.kwwwwwk.', '.kwkkwwk.', '.kwkkwwk.', '.kkkkkkk.'],
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
  const key = [a.cls, a.look && a.look.hair, a.look && a.look.skin, a.hero ? 1 : 0].join('|');
  if (POR[key]) return POR[key];
  const [c, x] = mkCanvas(20, 24);
  x.translate(10, 22);
  drawAdv(x, a, 0, {});
  return (POR[key] = c.toDataURL());
}
const iconImg = (id, cls = 'ico') => `<img class="${cls}" src="${iconURL(id)}" alt="">`;

/* ───────── 상태줄과 화면 위 글씨 ───────── */
function updateHud() {
  $('h-gold').textContent = fmt(S.gold);
  $('h-fame').textContent = fmt(S.fame);
  const p = dateParts(S.t);
  $('h-date').textContent = `${p.m}월 ${p.d}일`;
  const dd = S.settleDay - today(), r = $('h-rent');
  r.textContent = `자릿세 D-${dd}`;
  r.classList.toggle('due', dd <= 3);
  const n = S.reqs.filter(q => (S.inv[q.item] || 0) >= q.qty).length, b = $('req-badge');
  b.hidden = !n; b.textContent = n;
}
function expStatus(p) {
  const e = p.exp;
  if (!e) return p.members.length ? '상단에서 대기 중' : '파티원이 없어요';
  const F = FIELDS[e.field];
  if (e.foes.length) return e.foes.some(f => f.boss) ? '보스와 싸우는 중!' : '전투 중';
  if (e.mode === 'return') return { full: '짐이 가득 차 복귀 중', danger: '위험해서 복귀 중', loss: '동료를 잃고 복귀 중', boss: '보스를 쓰러뜨리고 복귀 중' }[e.why] || '복귀 중';
  if (e.goDungeon) return '전투가 끝나면 던전에 들어가요';
  if (e.c10 && e.area === 'field') return `${F.no}-10 반복 사냥 중 · 던전 입장 가능`;
  return '전진 중';
}
function whereStr(e) {
  const F = FIELDS[e.field];
  return e.area === 'dungeon' ? `${F.dungeon.name} ${e.stage}층` : `${F.name} ${F.no}-${e.stage}`;
}
function updateOverlay() {
  const p = viewParty(), L = $('ov-l'), Rr = $('ov-r'), B = $('ov-b');
  if (!p) { L.textContent = '오물거리 · 상단 앞'; Rr.hidden = true; B.hidden = true; return; }
  const e = p.exp;
  if (!e) { L.textContent = `${p.name} · 오물거리 상단 앞`; Rr.hidden = true; B.hidden = false; B.textContent = p.members.length ? '대기 중 · 원정 탭에서 출발' : '파티원이 없어요'; return; }
  L.textContent = `${p.name} · ${whereStr(e)}`;
  const u = usedOf(p), c = capOf(p);
  Rr.hidden = false; Rr.innerHTML = `짐 <span class="${u >= c ? 'warn' : 'gold'}">${u}/${c}</span>`;
  B.hidden = false; B.textContent = expStatus(p);
}
function renderChips() {
  const html = S.parties.map(p => {
    const e = p.exp, cls = !e ? '' : e.foes.length ? 'fight' : e.mode === 'return' ? 'back' : 'go';
    const st = !e ? '대기' : e.area === 'dungeon' ? `던전 ${e.stage}층` : `${FIELDS[e.field].no}-${e.stage}`;
    return `<button type="button" class="pchip${S.view === p.id ? ' on' : ''}" data-view="${p.id}"><i class="dot ${cls}"></i>${esc(p.name)} · ${st}</button>`;
  }).join('');
  if (html !== UI.chips) { $('pchips').innerHTML = html; UI.chips = html; }
}

/* ───────── 창 ───────── */
function openModal(title, html, btns) {
  UI.modal = true;
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
  setTimeout(() => { if (box.lastChild) box.lastChild.focus(); }, 40);
}
function closeModal() { $('modal').hidden = true; UI.modal = false; setTimeout(pumpModals, 150); }
function pumpModals() {
  if (UI.modal || !S || !S.modals.length || !$('title-scr').hidden) return;
  const m = S.modals.shift();
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
