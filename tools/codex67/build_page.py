"""직업별 장비 도감 페이지 만들기 — python3 build_page.py catalog.json page/gear-codex.html"""
import json, sys, io, base64, re
from fontTools import subset
from fontTools.ttLib import TTFont

cat = json.load(open(sys.argv[1], encoding='utf-8'))
OUT = sys.argv[2]
import pathlib
FONTS = str(pathlib.Path(__file__).resolve().parents[2] / 'fonts') + '/'

CSS = r"""
/* 배치: 위에 계열 탭 · 아래로 직업 카드 — 카드 왼쪽(폰은 위)에 직업 그림, 오른쪽에 칸마다 장비 종류 줄, 줄마다 착용 레벨 순 그림 띠 */
:root {
  --bg: #12141c; --panel: #1b1f2b; --panel2: #232838; --line: #343b52; --fg: #ece5d3; --muted: #9c98a6; --dim: #6c6a78;
  --gold: #e6b450; --ribbon: #a8322c; --drop: #6cc46f; --craft: #e8973a; --arena: #e0584f; --buy: #5ea6e6; --fut: #8b7fd0;
  --font: "Galmuri11", "Apple SD Gothic Neo", "Malgun Gothic", "Noto Sans KR", system-ui, sans-serif;
  --fs0: 12px; --fs1: 13px; --fs2: 15px; --fs3: 18px; --fs4: 24px;
  color-scheme: dark;
}
html { background: var(--bg); }
body { background: var(--bg); color: var(--fg); font-family: var(--font); font-size: var(--fs1); line-height: 1.55;
  padding-left: max(16px, env(safe-area-inset-left, 0px)); padding-right: max(16px, env(safe-area-inset-right, 0px)); padding-block: 0 40px; }
body::before { content: ""; position: fixed; inset: 0 0 auto; height: env(safe-area-inset-top, 0px); z-index: 10; background: var(--bg); }
.wrap { max-width: 1180px; margin: 0 auto; }
header.top { padding-block: 18px 6px; display: grid; gap: 6px; }
h1 { margin: 0; font-size: var(--fs4); font-weight: 700; letter-spacing: 0.02em; text-wrap: balance; color: var(--gold); }
.sum { color: var(--muted); font-size: var(--fs1); }
.bar { position: sticky; top: env(safe-area-inset-top, 0px); z-index: 5; background: var(--bg); padding-block: 8px 8px; border-bottom: 2px solid var(--line); display: grid; gap: 8px; }
.tabs { display: flex; gap: 6px; flex-wrap: wrap; }
.tab { font: inherit; font-size: var(--fs2); color: var(--fg); background: var(--panel2); border: 2px solid var(--line); padding: 4px 12px; cursor: pointer; }
.tab[aria-selected="true"] { background: var(--ribbon); border-color: var(--gold); color: #fff6e0; }
.tab:focus-visible, .it:focus-visible, .jump a:focus-visible, .x:focus-visible { outline: 2px solid var(--gold); outline-offset: 2px; }
.legend { display: flex; flex-wrap: wrap; gap: 4px 14px; font-size: var(--fs0); color: var(--muted); align-items: center; }
.legend span { display: inline-flex; align-items: center; gap: 5px; }
.pip { width: 8px; height: 8px; display: inline-block; }
.pip.d { background: var(--drop); } .pip.c { background: var(--craft); } .pip.a { background: var(--arena); } .pip.b { background: var(--buy); }
.pip.f { border: 1px dashed var(--fut); width: 10px; height: 10px; }
.jump { display: flex; gap: 4px 10px; flex-wrap: wrap; font-size: var(--fs0); }
.jump a { color: var(--muted); text-decoration: none; border-bottom: 1px dotted var(--dim); }
.jump a:hover { color: var(--gold); }
main { display: grid; gap: 14px; padding-top: 14px; }
.job { display: grid; grid-template-columns: 190px minmax(0, 1fr); gap: 16px; background: var(--panel); border: 2px solid var(--line); padding: 14px; scroll-margin-top: 130px; }
.who { display: grid; align-content: start; gap: 8px; }
.spr { background: var(--panel2); border: 2px solid var(--line); display: grid; place-items: end center; min-height: 140px; padding: 10px 6px 6px; }
.spr img { image-rendering: pixelated; max-width: 100%; height: auto; }
.jt { display: grid; gap: 2px; }
.jt b { font-size: var(--fs3); color: var(--fg); }
.jt .t2 { font-size: var(--fs0); color: var(--gold); }
.jt .t3 { font-size: var(--fs0); color: var(--muted); }
.jd { margin: 0; font-size: var(--fs0); color: var(--muted); }
.sprs { display: flex; flex-wrap: wrap; gap: 8px; align-items: end; }
.gear { display: grid; gap: 12px; min-width: 0; }
.slot { display: grid; gap: 6px; min-width: 0; }
.slot > h4 { margin: 0; font-size: var(--fs0); letter-spacing: 0.12em; color: var(--gold); border-bottom: 1px solid var(--line); padding-bottom: 2px; }
.type { display: grid; gap: 3px; min-width: 0; }
.th { display: flex; flex-wrap: wrap; gap: 2px 8px; align-items: baseline; font-size: var(--fs0); color: var(--muted); }
.th b { font-size: var(--fs1); color: var(--fg); }
.tag { font-style: normal; font-size: 11px; padding: 0 5px; border: 1px solid var(--line); color: var(--muted); }
.tag.sig { color: var(--gold); border-color: var(--gold); }
.strip { display: flex; gap: 5px; overflow-x: auto; padding-bottom: 6px; scrollbar-width: thin; }
.it { flex: 0 0 auto; width: 54px; display: grid; justify-items: center; gap: 1px; padding: 3px 2px 2px; background: var(--panel2); border: 1px solid var(--line); color: var(--fg); font: inherit; cursor: pointer; }
.it:hover { border-color: var(--gold); }
.ic { width: 44px; height: 44px; display: grid; place-items: center; background: var(--bg); border: 1px solid #0b0c12; }
.ic img { width: 40px; height: 40px; object-fit: contain; }
.ic img.px { image-rendering: pixelated; }
.lv { font-size: 11px; color: var(--fg); font-variant-numeric: tabular-nums; white-space: nowrap; }
.pp { display: flex; gap: 2px; height: 6px; }
.pp i { width: 6px; height: 6px; display: block; }
.pp i.d { background: var(--drop); } .pp i.c { background: var(--craft); } .pp i.a { background: var(--arena); } .pp i.b { background: var(--buy); }
.it.fut { border-style: dashed; border-color: var(--fut); background: transparent; }
.it.fut .ic img { opacity: 0.55; }
.it.fut .lv { color: var(--fut); }
.note { font-size: var(--fs0); color: var(--dim); margin: 0; }
.sheet-bg { position: fixed; inset: 0; background: rgba(5, 6, 10, 0.6); z-index: 20; }
.sheet { position: fixed; left: 0; right: 0; bottom: 0; z-index: 21; display: grid; justify-items: center;
  padding-left: max(12px, env(safe-area-inset-left, 0px)); padding-right: max(12px, env(safe-area-inset-right, 0px)); padding-bottom: calc(12px + env(safe-area-inset-bottom, 0px)); }
.card { width: min(560px, 100%); background: var(--panel); border: 2px solid var(--gold); padding: 14px; display: grid; gap: 10px; max-height: 70vh; overflow-y: auto; }
.ch { display: grid; grid-template-columns: 92px minmax(0, 1fr) auto; gap: 12px; align-items: start; }
.big { width: 92px; height: 92px; display: grid; place-items: center; background: var(--bg); border: 2px solid var(--line); }
.big img { width: 84px; height: 84px; object-fit: contain; }
.big img.px { image-rendering: pixelated; }
.cn { display: grid; gap: 3px; min-width: 0; }
.cn b { font-size: var(--fs3); }
.cn span { font-size: var(--fs0); color: var(--muted); }
.x { font: inherit; font-size: var(--fs3); line-height: 1; background: var(--panel2); color: var(--fg); border: 2px solid var(--line); width: 34px; height: 34px; cursor: pointer; }
.kv { display: grid; grid-template-columns: 74px minmax(0, 1fr); gap: 4px 10px; font-size: var(--fs1); margin: 0; }
.kv dt { color: var(--gold); font-size: var(--fs0); padding-top: 2px; }
.kv dd { margin: 0; min-width: 0; }
.srcs { display: flex; flex-wrap: wrap; gap: 4px 10px; }
.srcs span { display: inline-flex; gap: 5px; align-items: center; }
@media (max-width: 720px) {
  .job { grid-template-columns: minmax(0, 1fr); gap: 12px; padding: 12px; }
  .who { grid-template-columns: auto minmax(0, 1fr); align-items: end; column-gap: 12px; }
  .spr { min-height: 0; min-width: 96px; }
  .jd { grid-column: 1 / -1; }
}
@media (prefers-reduced-motion: reduce) { * { scroll-behavior: auto !important; } }
"""

JS = r"""
(() => {
const D = JSON.parse(document.getElementById('cat').textContent);
const URL_ = [];
const iu = i => { if (URL_[i]) return URL_[i]; const du = D.icons[i], c = du.indexOf(','), mime = du.slice(5, du.indexOf(';')), bin = atob(du.slice(c + 1)), u8 = new Uint8Array(bin.length); for (let k = 0; k < bin.length; k++) u8[k] = bin.charCodeAt(k); return (URL_[i] = URL.createObjectURL(new Blob([u8], { type: mime }))); };
const px = i => !D.icons[i].startsWith('data:image/webp');
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));
const SLOTN = Object.fromEntries(D.slots);
const SRC = { d: '몬스터가 떨어뜨림', c: '대장간에서 만듦', a: '투기장 상단(코인)', b: '대장간에서 삼' };
const TIER = ['', '1차', '2차', '3차', '4차'];
const typeNote = (T, sig) => {
  const tags = [];
  if (sig) tags.push(`<i class="tag sig">${sig}</i>`);
  if (T.two) tags.push('<i class="tag">두 손</i>');
  if (T.arena) tags.push('<i class="tag">투기장 상단 전용</i>');
  if (T.ammo) tags.push('<i class="tag">쓰는 만큼 줄어듦</i>');
  if (T.ladder) tags.push('<i class="tag">그림마다 착용 레벨</i>');
  return tags.join(' ');
};
const tile = (b, e, k) => {
  const pips = e.on ? [...e.s].map(s => `<i class="${s}"></i>`).join('') : '';
  const lv = e.lv != null ? 'Lv' + e.lv : '다음';
  return `<button type="button" class="it${e.on ? '' : ' fut'}" data-b="${b}" data-k="${k}" aria-label="${esc(e.n)} ${lv}"><span class="ic"><img class="${px(e.i) ? 'px' : ''}" src="${iu(e.i)}" alt=""></span><span class="lv">${lv}</span><span class="pp">${pips}</span></button>`;
};
const typeBlock = (b, sig) => {
  const T = D.types[b];
  const fut = T.ladder && T.n === 16 ? '<p class="note">Lv160 ~ 200 그림은 아직 없어요.</p>' : '';
  return `<div class="type"><div class="th"><b>${esc(T.name)}</b><span>${esc(T.who)}</span>${typeNote(T, sig)}</div><div class="strip">${T.list.map((e, k) => tile(b, e, k)).join('')}</div>${fut}</div>`;
};
const slotsBlock = (slots, sigs) => slots.map(([s, L]) => `<div class="slot"><h4>${esc(SLOTN[s] || s)}</h4>${L.map(b => typeBlock(b, sigs[b])).join('')}</div>`).join('');
const jobCard = c => {
  const J = D.jobs[c], sc = J.iw > 60 ? 2 : 3;
  const sigs = {}; if (J.sig[0]) sigs[J.sig[0]] = '대표 무기'; if (J.sig[1]) sigs[J.sig[1]] = '대표 부장비';
  return `<section class="job" id="job-${c}"><div class="who"><div class="spr"><img src="${iu(J.img)}" width="${J.iw * sc}" height="${J.ih * sc}" alt="${esc(J.name)}"></div>
    <div class="jt"><b>${esc(J.name)}</b><span class="t2">${TIER[J.tier] || ''} · Lv${J.lv}부터</span>${J.parent ? `<span class="t3">${esc(J.parent)}에서 전직</span>` : `<span class="t3">${esc(J.line)} 계열 첫 직업</span>`}</div>
    ${J.desc ? `<p class="jd">${esc(J.desc)}</p>` : ''}</div><div class="gear">${slotsBlock(J.slots, sigs)}</div></section>`;
};
const commonCard = () => {
  const firsts = D.lines.map(L => L.jobs[0]);
  const imgs = firsts.map(c => { const J = D.jobs[c]; return `<img src="${iu(J.img)}" width="${J.iw * 2}" height="${J.ih * 2}" alt="${esc(J.name)}" title="${esc(J.name)}">`; }).join('');
  return `<section class="job" id="job-common"><div class="who"><div class="spr sprs">${imgs}</div><div class="jt"><b>공용 장비</b><span class="t2">모든 직업 · Lv1부터</span><span class="t3">직업 카드에는 빼고 여기에만 모았어요</span></div></div><div class="gear">${slotsBlock(D.common, {})}</div></section>`;
};
const TABS = D.lines.map(L => [L.id, L.name]).concat([['common', '공용']]);
const tabsEl = document.getElementById('tabs'), main = document.getElementById('main'), jump = document.getElementById('jump');
tabsEl.innerHTML = TABS.map(([id, n]) => `<button type="button" class="tab" role="tab" id="tab-${id}" data-id="${id}" aria-selected="false">${esc(n)}</button>`).join('');
function show(id) {
  if (!TABS.some(t => t[0] === id)) id = TABS[0][0];
  tabsEl.querySelectorAll('.tab').forEach(b => b.setAttribute('aria-selected', b.dataset.id === id ? 'true' : 'false'));
  if (id === 'common') { main.innerHTML = commonCard(); jump.innerHTML = ''; }
  else { const L = D.lines.find(x => x.id === id); main.innerHTML = L.jobs.map(jobCard).join(''); jump.innerHTML = L.jobs.map(c => `<a href="#job-${c}" data-job="${c}">${esc(D.jobs[c].name)}</a>`).join(''); }
}
tabsEl.addEventListener('click', ev => { const b = ev.target.closest('.tab'); if (!b) return; if (location.hash !== '#' + b.dataset.id) location.hash = b.dataset.id; else show(b.dataset.id); window.scrollTo({ top: 0 }); });
jump.addEventListener('click', ev => { const a = ev.target.closest('a'); if (!a) return; ev.preventDefault(); const el = document.getElementById('job-' + a.dataset.job); if (el) el.scrollIntoView({ block: 'start' }); });
window.addEventListener('hashchange', () => show(location.hash.slice(1)));
show(location.hash.slice(1));
// 정보 창
const bg = document.getElementById('sheet-bg'), sheet = document.getElementById('sheet'), body = document.getElementById('sheet-body');
let lastFocus = null;
function openInfo(b, k) {
  const T = D.types[b], e = T.list[k]; lastFocus = document.activeElement;
  const where = e.on ? (e.s ? `<div class="srcs">${[...e.s].map(s => `<span><i class="pip ${s}"></i>${SRC[s]}</span>`).join('')}</div>` : '아직 얻을 곳이 없어요') : '<span><i class="pip f"></i> 그 레벨 땅이 생기면 나와요 (그림만 먼저 있음)</span>';
  const rows = [['착용 레벨', e.lv != null ? `Lv${e.lv}부터` : '다음 단계 땅이 생기면'], ['단계', e.tn ? esc(e.tn) + ' 단계' : '—'], ['능력치', e.st ? esc(e.st) + ' <span style="color:var(--dim)">(일반 등급)</span>' : '—'], ['얻는 곳', where], ['입는 직업', esc(T.who)], ['칸 · 무게', `${esc(SLOTN[T.slot] || T.slot)} · 무게 ${T.w}${T.two ? ' · 두 손' : ''}`]];
  const desc = e.d || T.desc;
  body.innerHTML = `<div class="ch"><div class="big"><img class="${px(e.i) ? 'px' : ''}" src="${iu(e.i)}" alt=""></div><div class="cn"><b>${esc(e.n)}</b><span>${esc(T.name)}</span></div><button type="button" class="x" id="sheet-x" aria-label="닫기">✕</button></div>
    <dl class="kv">${rows.map(([k2, v]) => `<dt>${k2}</dt><dd>${v}</dd>`).join('')}${desc ? `<dt>설명</dt><dd>${esc(desc)}</dd>` : ''}</dl>`;
  bg.hidden = false; sheet.hidden = false; document.getElementById('sheet-x').focus();
}
function closeInfo() { bg.hidden = true; sheet.hidden = true; if (lastFocus) lastFocus.focus(); }
main.addEventListener('click', ev => { const t = ev.target.closest('.it'); if (t) openInfo(t.dataset.b, +t.dataset.k); });
bg.addEventListener('click', closeInfo);
sheet.addEventListener('click', ev => { if (ev.target.closest('#sheet-x') || ev.target === sheet) closeInfo(); });
document.addEventListener('keydown', ev => { if (ev.key === 'Escape' && !sheet.hidden) closeInfo(); });
})();
"""

n_jobs = len(cat['jobs']); n_types = len(cat['types']); n_ent = sum(len(t['list']) for t in cat['types'].values())
n_on = sum(1 for t in cat['types'].values() for e in t['list'] if e.get('on'))
HTML_TOP = f"""<title>판타지상단키우기 장비 도감</title>
<meta name="claude:viewport-fit-sides" content="cover">
"""
MARKUP = f"""<div class="wrap">
<header class="top">
  <h1>판타지상단키우기 장비 도감</h1>
  <div class="sum">직업 {n_jobs}개 · 장비 종류 {n_types}가지 · 그림 {n_ent:,}칸(지금 얻을 수 있는 것 {n_on:,}칸) · 빌드 67 작업판(아직 APK 아님) · 그림을 누르면 정보</div>
</header>
<div class="bar">
  <div class="tabs" id="tabs" role="tablist" aria-label="직업 계열"></div>
  <div class="legend"><span><i class="pip d"></i>몬스터가 떨어뜨림</span><span><i class="pip c"></i>대장간에서 만듦</span><span><i class="pip a"></i>투기장 상단</span><span><i class="pip b"></i>대장간에서 삼</span><span><i class="pip f"></i>그림만 있음(그 레벨 땅이 생기면)</span><span>능력치는 일반 등급</span></div>
  <nav class="jump" id="jump" aria-label="직업 바로 가기"></nav>
</div>
<main id="main"></main>
</div>
<div class="sheet-bg" id="sheet-bg" hidden></div>
<div class="sheet" id="sheet" role="dialog" aria-modal="true" aria-label="장비 정보" hidden><div class="card" id="sheet-body"></div></div>
"""

# 글꼴: 이 쪽에 쓰는 글자만 남긴다 (갈무리 — SIL OFL 1.1)
text = json.dumps({k: v for k, v in cat.items() if k != 'icons'}, ensure_ascii=False) + MARKUP + JS + CSS
chars = set(text) | {chr(c) for c in range(0x20, 0x7F)}
def sub(path):
    f = TTFont(path); o = subset.Options(); o.flavor = 'woff2'; o.layout_features = ['*']
    s = subset.Subsetter(options=o); s.populate(text=''.join(sorted(chars))); s.subset(f)
    b = io.BytesIO(); f.flavor = 'woff2'; f.save(b); return base64.b64encode(b.getvalue()).decode()
faces = ''.join('@font-face{font-family:"Galmuri11";font-weight:%d;font-style:normal;font-display:swap;src:url(data:font/woff2;base64,%s) format("woff2")}\n' % (w, sub(FONTS + f)) for f, w in [('Galmuri11.woff2', 400), ('Galmuri11-Bold.woff2', 700)])

data = json.dumps(cat, ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/')
page = HTML_TOP + '<style>\n' + faces + CSS + '</style>\n' + MARKUP + '<script type="application/json" id="cat">' + data + '</script>\n<script>' + JS + '</script>\n'
open(OUT, 'w', encoding='utf-8').write(page)
print('page', OUT, len(page.encode('utf-8')) // 1024, 'KB')
