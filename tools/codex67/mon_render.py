"""몬스터 · 부속품 · 잡템 그림 — python3 render_mon.py <mon.json> <출력 폴더>"""
import json, sys, io, base64, re, os, pathlib
from fontTools import subset
from fontTools.ttLib import TTFont
from playwright.sync_api import sync_playwright

D = json.load(open(sys.argv[1], encoding='utf-8')); OUT = sys.argv[2]
FONTS = str(pathlib.Path(__file__).resolve().parents[2] / 'fonts') + '/'

CSS = r"""
:root { --bg: #12141c; --panel: #1b1f2b; --panel2: #232838; --line: #343b52; --fg: #ece5d3; --muted: #a5a1ae; --dim: #6c6a78; --gold: #e6b450; --ribbon: #a8322c; color-scheme: dark; }
* { box-sizing: border-box; }
body { margin: 0; background: #0b0c12; font-family: "Galmuri11", "Noto Sans KR", sans-serif; color: var(--fg); }
#card { width: 1080px; background: var(--bg); padding: 30px 32px 26px; display: grid; gap: 18px; }
.eyebrow { font-size: 17px; letter-spacing: 0.14em; color: var(--muted); }
.ttl { display: flex; flex-wrap: wrap; align-items: baseline; gap: 6px 12px; }
.ttl b { font-size: 40px; color: var(--gold); line-height: 1.15; }
.chip { font-size: 16px; padding: 2px 8px; border: 2px solid var(--line); color: var(--muted); }
.desc { font-size: 16px; color: var(--muted); }
.box { background: var(--panel); border: 2px solid var(--line); padding: 12px 14px; display: grid; gap: 8px; }
.row { display: flex; flex-wrap: wrap; gap: 6px 14px; align-items: center; font-size: 15px; }
.row > .lb { color: var(--gold); font-size: 14px; min-width: 120px; }
.it { display: inline-flex; align-items: center; gap: 6px; }
.it img, .dl img, .d img { width: 32px; height: 32px; image-rendering: pixelated; }
.it small { color: var(--muted); font-size: 13px; }
h3 { margin: 6px 0 0; font-size: 22px; color: var(--gold); border-bottom: 2px solid var(--line); padding-bottom: 4px; }
.shared { font-size: 15px; color: var(--muted); }
.mons { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
.mc { background: var(--panel); border: 2px solid var(--line); padding: 12px; display: grid; grid-template-columns: 150px minmax(0, 1fr); gap: 12px; align-content: start; }
.ms { width: 150px; height: 150px; background: var(--panel2); border: 2px solid var(--line); display: grid; place-items: end center; padding-bottom: 6px; }
.ms img { image-rendering: pixelated; }
.mi { display: grid; gap: 6px; align-content: start; min-width: 0; }
.mn { display: flex; flex-wrap: wrap; gap: 4px 8px; align-items: baseline; }
.mn b { font-size: 20px; }
.tag { font-size: 13px; padding: 1px 6px; background: var(--ribbon); color: #fff3df; }
.mt { font-size: 14px; color: var(--muted); }
.sk { display: flex; flex-wrap: wrap; gap: 6px 10px; align-items: end; }
.sk span { display: grid; justify-items: center; gap: 2px; font-size: 12px; color: var(--muted); }
.sk img { image-rendering: pixelated; }
.dl { display: grid; gap: 4px; }
.dl .lb { font-size: 13px; color: var(--gold); margin-top: 2px; }
.d { display: grid; grid-template-columns: 32px minmax(0, 1fr) auto; gap: 8px; align-items: center; font-size: 15px; }
.d .nm { min-width: 0; }
.d .nm small { display: block; font-size: 12px; color: var(--dim); }
.d .pv { font-size: 13px; color: var(--muted); text-align: right; white-space: nowrap; font-variant-numeric: tabular-nums; }
.none { font-size: 14px; color: var(--dim); }
.grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 10px; }
.t { background: var(--panel); border: 2px solid var(--line); padding: 10px; display: grid; grid-template-columns: 56px minmax(0, 1fr); gap: 10px; align-content: start; }
.t .ic { width: 56px; height: 56px; background: var(--panel2); display: grid; place-items: center; }
.t .ic img { width: 50px; height: 50px; image-rendering: pixelated; object-fit: contain; }
.t .tx { display: grid; gap: 3px; min-width: 0; }
.t .nm { font-size: 16px; font-weight: 700; line-height: 1.25; }
.t .gv { font-size: 13px; color: var(--muted); }
.t .sr { font-size: 12px; color: var(--muted); line-height: 1.35; }
.raids { display: grid; gap: 12px; }
.rc { background: var(--panel); border: 2px solid var(--line); padding: 14px; display: grid; grid-template-columns: 200px minmax(0, 1fr); gap: 14px; }
.rc .ms { width: 200px; height: 170px; }
.ft { display: flex; flex-wrap: wrap; gap: 6px 18px; font-size: 14px; color: var(--muted); border-top: 2px solid var(--line); padding-top: 12px; }
"""

JS = r"""
const D = JSON.parse(document.getElementById('dat').textContent);
const URL_ = [];
const iu = i => { if (URL_[i]) return URL_[i]; const du = D.icons[i], c = du.indexOf(','), mime = du.slice(5, du.indexOf(';')), bin = atob(du.slice(c + 1)), u8 = new Uint8Array(bin.length); for (let k = 0; k < bin.length; k++) u8[k] = bin.charCodeAt(k); return (URL_[i] = URL.createObjectURL(new Blob([u8], { type: mime }))); };
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));
const pct = p => (p >= 1 ? '반드시' : p >= 0.1 ? Math.round(p * 100) + '%' : (p * 100).toFixed(p >= 0.01 ? 1 : 2).replace(/\.?0+$/, '') + '%');
const fmt = n => Number(n).toLocaleString('ko-KR');
const sc = (w, h, box) => Math.max(1, Math.floor(Math.min(box / w, box / h)));
const itm = (x, extra) => `<span class="it"><img src="${iu(x.i)}" alt=""><span style="color:${x.gc}">${esc(x.n)}</span>${extra ? `<small>${extra}</small>` : ''}</span>`;
const dline = x => `<div class="d"><img src="${iu(x.i)}" alt=""><span class="nm" style="color:${x.gc}">${esc(x.n)}${x.note ? `<small>${esc(x.note)}</small>` : ''}</span><span class="pv">${x.p != null ? pct(x.p) + ' · ' : ''}${fmt(x.v)}G</span></div>`;
const monCard = m => {
  const s = sc(m.img.w, m.img.h, 136);
  const meta = [m.ty.join(' · '), m.el.length ? '속성 ' + m.el.join(' · ') : '', m.fly ? '날아다님' : ''].filter(Boolean).join(' · ');
  const skins = m.skins.length ? `<div class="sk"><span style="align-self:center">다른 모습</span>${m.skins.map((k, j) => { const z = sc(k.w, k.h, 56); return `<span><img src="${iu(k.i)}" width="${k.w * z}" height="${k.h * z}" alt="">${esc(k.n !== m.n ? k.n : '모습 ' + (j + 2))}</span>`; }).join('')}</div>` : '';
  const drops = m.drops.length ? m.drops.map(dline).join('') : '<div class="none">자기 부속품 없음</div>';
  const ex = m.extra.length ? `<div class="lb">${m.tag && m.tag.includes('던전') ? '던전 주인 보상' : '우두머리 보상'}</div>` + m.extra.map(dline).join('') : '';
  return `<div class="mc"><div class="ms"><img src="${iu(m.img.i)}" width="${m.img.w * s}" height="${m.img.h * s}" alt=""></div><div class="mi"><div class="mn"><b>${esc(m.n)}</b>${m.tag ? `<span class="tag">${esc(m.tag)}</span>` : ''}</div>${meta ? `<div class="mt">${esc(meta)}</div>` : ''}${skins}<div class="dl">${drops}${ex}</div></div></div>`;
};
const foot = (extra, mon = 1) => `<div class="ft"><span>${mon ? '확률은 한 마리를 잡을 때 · ' : ''}값은 길드에 파는 값</span>${extra || ''}<span>판타지상단키우기 빌드 67 작업판</span></div>`;
window.renderField = (i, no) => {
  const F = D.fields[i];
  const bk = (L, w) => L.map(b => itm(b, `${b.w}`)).join('') + `<small style="color:var(--dim)">꽝 ${50 - L.reduce((a, b) => a + b.w, 0) + 50}</small>`;
  const rows = [];
  if (F.herbs.length) rows.push(`<div class="row"><span class="lb">약초 줍기</span>${F.herbs.map(x => itm(x)).join('')}</div>`);
  if (F.eggs.length) rows.push(`<div class="row"><span class="lb">펫 알</span>${F.eggs.map(x => itm(x)).join('')}</div>`);
  rows.push(`<div class="row"><span class="lb">스킬북 (100에서)</span>${bk(F.books)}</div>`);
  rows.push(`<div class="row"><span class="lb">우두머리 · 주인</span>${bk(F.booksB)}</div>`);
  rows.push(`<div class="row"><span class="lb">장비 (이 단계)</span><span>필드 몬스터 0.3% · 던전 몬스터 1.2% · 필드 우두머리 35% · 던전 주인 60%</span></div>`);
  const fb = F.fbEx.length ? `<h3>필드 우두머리 (10 스테이지마다 · 이 땅 몬스터의 큰 개체)</h3><div class="box">${F.fbEx.map(dline).join('')}</div>` : '';
  const groups = F.groups.map(g => `<h3>${esc(g.title)}</h3>${g.shared && g.shared.length ? `<div class="shared">필드와 같은 몬스터: ${esc(g.shared.join(' · '))}</div>` : ''}<div class="mons">${g.mons.map(monCard).join('')}</div>`).join('');
  document.getElementById('card').innerHTML = `<div class="eyebrow">몬스터 · ${no}</div><div class="ttl"><b>${esc(F.n)}</b><span class="chip">${esc(F.tn)} 단계</span><span class="chip">필드 Lv${F.lv}~</span>${F.region === 'sky' ? '<span class="chip">하늘</span>' : ''}${F.hidden ? '<span class="chip">숨은 곳</span>' : ''}</div>${F.desc ? `<div class="desc">${esc(F.desc)}</div>` : ''}
    <div class="box">${rows.join('')}</div>${groups}${fb}${foot('<span>스킬북 줄: 책이 나올 때 단계 책 몫(나머지는 꽝)</span>')}`;
  return Promise.all([...document.images].map(im => im.decode().catch(() => 0)));
};
window.renderRaids = no => {
  const cards = D.raids.map(r => { const s = sc(r.img.w, r.img.h, 156); return `<div class="rc"><div class="ms"><img src="${iu(r.img.i)}" width="${r.img.w * s}" height="${r.img.h * s}" alt=""></div><div class="mi"><div class="mn"><b>${esc(r.n)}</b><span class="tag">레이드 Lv${r.lv}</span></div><div class="mt">${esc(r.desc)}</div><div class="dl">${[r.part, r.heart].filter(Boolean).map(x => dline({ ...x, p: null })).join('')}<div class="none">등수에 따라 부속품 · 심장 · 장비(희귀 이상) · 개화석 · 마법사의 돌 · 스킬북</div></div></div></div>`; }).join('');
  document.getElementById('card').innerHTML = `<div class="eyebrow">몬스터 · ${no}</div><div class="ttl"><b>초대형 레이드</b><span class="chip">달마다 둘이 열림</span></div><div class="raids">${cards}</div>${foot()}`;
  return Promise.all([...document.images].map(im => im.decode().catch(() => 0)));
};
const tile = (x, sub, src) => `<div class="t"><div class="ic"><img src="${iu(x.i)}" alt=""></div><div class="tx"><div class="nm" style="color:${x.gc}">${esc(x.n)}</div><div class="gv">${sub}</div>${src ? `<div class="sr">${esc(src)}</div>` : ''}</div></div>`;
window.renderMisc = (i, no) => {
  const M = D.misc[i];
  document.getElementById('card').innerHTML = `<div class="eyebrow">잡템 · ${no}</div><div class="ttl"><b>${esc(M.title)}</b><span class="chip">${M.items.length}가지</span></div><div class="grid">${M.items.map(x => tile(x, `${esc(x.gn)} · ${fmt(x.v)}G`, x.src)).join('')}</div>${foot('<span>몬스터가 떨어뜨리지 않는 것만 — 몬스터 부속품은 땅마다 그림에</span>', 0)}`;
  return Promise.all([...document.images].map(im => im.decode().catch(() => 0)));
};
window.renderBooks = (i, no) => {
  const B = D.books[i];
  const top = i === 0 ? `<h3>스킬북 단계 (몬스터가 떨어뜨리는 책 — 펼치면 아래 스킬북 하나)</h3><div class="grid">${D.tierBooks.map(x => tile(x, `${esc(x.gn)} · ${fmt(x.v)}G`, x.src)).join('')}</div><h3>${esc(B.title)}</h3>` : '';
  document.getElementById('card').innerHTML = `<div class="eyebrow">스킬북 · ${no}</div><div class="ttl"><b>${esc(i === 0 ? '스킬북 단계 · ' + B.title : B.title)}</b><span class="chip">${B.items.length}권</span></div>${top}<div class="grid">${B.items.map(x => tile(x, `${esc(x.job)} · Lv${x.lv}`, `${x.bt} · ${x.gn} · ${fmt(x.v)}G`)).join('')}</div>${foot('<span>스킬북은 단계 책을 펼쳐서 얻는다 · Lv = 배우는 레벨</span>', 0)}`;
  return Promise.all([...document.images].map(im => im.decode().catch(() => 0)));
};
"""
# 공용(스킬북)을 맨 앞으로
D['books'] = [b for b in D['books'] if b['line'] == 'common'] + [b for b in D['books'] if b['line'] != 'common']
text = json.dumps({k: v for k, v in D.items() if k != 'icons'}, ensure_ascii=False) + CSS + JS + '반드시 확률은 한 마리를 잡을 때 · 값은 길드에 파는 값 판타지상단키우기 빌드 67 작업판 꽝 약초 줍기 펫 알 스킬북 (100에서) 우두머리 · 주인 장비 (이 단계) 필드 몬스터 0.3% · 던전 몬스터 1.2% · 필드 우두머리 35% · 던전 주인 60% 필드와 같은 몬스터: 단계 필드 Lv~ 하늘 숨은 곳 자기 부속품 없음 던전 주인 보상 우두머리 보상 초대형 레이드 달마다 둘이 열림 레이드 등수에 따라 부속품 · 심장 · 장비(희귀 이상) · 개화석 · 마법사의 돌 · 스킬북 잡템 가지 권 몬스터가 떨어뜨리지 않는 것만 — 몬스터 부속품은 땅마다 그림에 스킬북 단계 (몬스터가 떨어뜨리는 책 — 펼치면 아래 스킬북 하나) 스킬북은 단계 책을 펼쳐서 얻는다 · Lv = 배우는 레벨 책이 나올 때 단계 책 몫(나머지는 꽝) 몬스터 · 0123456789%G,.다른 모습'
chars = set(text) | {chr(c) for c in range(0x20, 0x7F)}
def sub(path):
    f = TTFont(path); o = subset.Options(); o.flavor = 'woff2'; o.layout_features = ['*']
    s = subset.Subsetter(options=o); s.populate(text=''.join(sorted(chars))); s.subset(f)
    b = io.BytesIO(); f.flavor = 'woff2'; f.save(b); return base64.b64encode(b.getvalue()).decode()
faces = ''.join('@font-face{font-family:"Galmuri11";font-weight:%d;font-style:normal;src:url(data:font/woff2;base64,%s) format("woff2")}\n' % (w, sub(FONTS + f)) for f, w in [('Galmuri11.woff2', 400), ('Galmuri11-Bold.woff2', 700)])
data = json.dumps(D, ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/')
html = '<!doctype html><html><head><meta charset="utf-8"><style>' + faces + CSS + '</style></head><body><div id="card"></div><script type="application/json" id="dat">' + data + '</script><script>' + JS + '</script></body></html>'
os.makedirs(OUT, exist_ok=True)
page = os.path.join(OUT, '..', 'mon_cards.html'); open(page, 'w', encoding='utf-8').write(html)
safe = lambda s: re.sub(r'[\\/:*?"<>| ·()]+', '_', s).strip('_')
jobs = [('renderField', i, f"몬스터_{i + 1:02d}_{safe(F['n'])}") for i, F in enumerate(D['fields'])]
jobs.append(('renderRaids', None, f"몬스터_{len(D['fields']) + 1:02d}_초대형_레이드"))
jobs += [('renderMisc', i, f"잡템_{i + 1:02d}_{safe(M['title'])}") for i, M in enumerate(D['misc'])]
jobs += [('renderBooks', i, f"스킬북_{i + 1:02d}_{safe(('단계_' if i == 0 else '') + B['title'])}") for i, B in enumerate(D['books'])]
files = []
with sync_playwright() as pw:
    br = pw.chromium.launch(); pg = br.new_page(viewport={'width': 1080, 'height': 1200}, device_scale_factor=1)
    errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto('file://' + os.path.abspath(page)); pg.wait_for_timeout(800)
    for fn, i, name in jobs:
        no = name.split('_')[1]
        if fn == 'renderRaids': pg.evaluate("no => window.renderRaids(no)", no)
        else: pg.evaluate(f"([i, no]) => window.{fn}(i, no)", [i, no])
        pg.wait_for_timeout(60)
        path = os.path.join(OUT, name + '.png'); pg.locator('#card').screenshot(path=path); files.append(path)
    print('errors', errs); br.close()
print(len(files), 'files')
