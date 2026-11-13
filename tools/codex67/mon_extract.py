"""몬스터 · 부속품 · 잡템 자료 뽑기 — python3 extract_mon.py <훅 play.html> <mon.json>"""
import json, sys
from playwright.sync_api import sync_playwright
JS = r"""(() => {
  const out = { icons: [], fields: [], raids: [], misc: [], books: [] };
  const IM = new Map(); const icon = u => { if (!u) return -1; if (!IM.has(u)) { IM.set(u, out.icons.length); out.icons.push(u); } return IM.get(u); };
  const Q = g => ({ gn: QUALITY[g] ? QUALITY[g].name : '', gc: QUALITY[g] ? QUALITY[g].c : '#ccc' });
  const it = k => { const I = ITEMS[k]; if (!I) return null; const g = itemGrade(k); return { k, i: icon(iconURL(k)), n: I.name, v: I.v || 0, g, ...Q(g) }; };
  const cvURL = s => { if (s.cv && s.cv.toDataURL) return s.cv.toDataURL(); const [c, x] = mkCanvas(s.w, s.h); x.drawImage(s.cv, 0, 0); return c.toDataURL(); };
  const spr = id => { const s = PXU[id] ? pxuSprite(id, 'idle', 0) : pxMonSprite(PXM[id] || PXG[id] ? id : 'rat', 0); return { i: icon(cvURL(s)), w: s.w, h: s.h }; };
  const tyN = t => (typeof MTYPES !== 'undefined' && MTYPES[t] && MTYPES[t].name) || t;
  const elN = e => (typeof ELEMS !== 'undefined' && ELEMS[e] && ELEMS[e].name) || e;
  const mon = (id, extra, tag) => { const M = MONS[id]; if (!M) return null;
    const sk = (typeof PXU_SKIN !== 'undefined' && PXU_SKIN[id]) ? PXU_SKIN[id].filter(x => x !== id && MONS[x] || (x !== id && PXU[x])) : [];
    return { id, n: M.name, tag: tag || '', img: spr(id), skins: sk.map(x => ({ ...spr(x), n: (typeof PXU_SKIN_NAME !== 'undefined' && PXU_SKIN_NAME[x]) || (MONS[x] && MONS[x].name) || x })),
      ty: (M.ty || []).map(tyN), el: (M.el || []).map(elN), fly: typeof isFly === 'function' && isFly(id) ? 1 : 0,
      drops: (M.drops || []).map(([k, p]) => { const x = it(k); return x ? { ...x, p } : null; }).filter(Boolean), extra: extra || [] };
  };
  const ex = (k, p, note) => { const x = it(k); return x ? { ...x, p, note: note || '' } : null; };
  const runeEx = (p, note) => { const x = it('rune_str_0'); return { ...x, n: '룬 (무작위)', p, note: note || '' }; };
  for (const f of ALL_FIELDS) {
    const F = FIELDS[f]; if (!F || f.startsWith('raid_') || f.startsWith('trade_')) continue;
    const t = F.tier || 0, tf = TIER_FIELDS.includes(f);
    const groups = [];
    if ((F.mons || []).length) groups.push({ title: '필드 몬스터', mons: F.mons.map(id => mon(id)).filter(Boolean) });
    if (F.bosses && F.bosses.length) groups.push({ title: '필드 우두머리 (10 스테이지마다)', mons: F.bosses.map((id, i) => mon(id, tf ? (i < 4 ? [ex('crest_' + t, 1, '1~2개'), runeEx(0.25), ex('bloomstone', STONE_DROP.bloomstone.fb), ex('wizstone', STONE_DROP.wizstone.fb), ex('tmap', TMAP_DROP.fb)] : [ex('core_' + t, 1), ex('crest_' + t, 1, '2개'), ex('soul_' + t, 0.12, '던전 공략 뒤'), runeEx(0.5), ex('bloomstone', STONE_DROP.bloomstone.lord), ex('wizstone', STONE_DROP.wizstone.lord), ex('tmap', TMAP_DROP.lord)]).filter(Boolean) : [], i < 4 ? `1-${(i + 1) * 10} 우두머리` : `1-50 ${F.name}의 주인`)).filter(Boolean) });
    const D = F.dungeon;
    if (D) {
      const fm = new Set(F.mons || []);
      const dm = (D.mons || []).filter(id => !fm.has(id)).map(id => mon(id, [], '던전')).filter(Boolean);
      const shared = (D.mons || []).filter(id => fm.has(id)).map(id => (MONS[id] || {}).name).filter(Boolean);
      const boss = mon(D.boss, [tf ? ex('soul_' + t, 1, '첫 공략 2개') : null, runeEx(1, '희귀 이상'), ex('bloomstone', STONE_DROP.bloomstone.boss), ex('wizstone', STONE_DROP.wizstone.boss)].filter(Boolean), '던전 주인');
      const guards = (D.guards || []).filter((x, i, a) => a.indexOf(x) === i).map(id => mon(id, [], '경비')).filter(Boolean);
      groups.push({ title: '던전 · ' + D.name, shared, mons: [...dm, ...guards, boss].filter(Boolean) });
    }
    const herbs = [...new Set(F.herbs || [])].map(it).filter(Boolean);
    const eggs = Object.keys(PETS).filter(k => PETS[k].field === f && ITEMS['egg_' + k]).map(k => it('egg_' + k));
    const books = tierBookMix(t, false).map(([k, w]) => ({ ...it(k), w })), booksB = tierBookMix(t, true).map(([k, w]) => ({ ...it(k), w }));   // 스킬북이 나올 때의 몫(합 50 · 나머지는 꽝) — 우두머리 · 주인은 한 줄 위
    const fbEx = tf && !(F.bosses && F.bosses.length) ? [ex('crest_' + t, 1, '1-10 ~ 1-40 우두머리 · 1~2개'), ex('core_' + t, 1, '1-50 주인'), ex('soul_' + t, 0.12, '1-50 주인 · 던전 공략 뒤'), runeEx(0.25, '우두머리 25% · 주인 50%'), ex('bloomstone', STONE_DROP.bloomstone.fb, '우두머리 · 주인 15%'), ex('wizstone', STONE_DROP.wizstone.fb), ex('tmap', TMAP_DROP.fb, '우두머리 · 주인 8%')].filter(Boolean) : [];
    out.fields.push({ id: f, n: F.name, tn: GTIERS[t] ? GTIERS[t].name : '', lv: F.lv, region: F.region || (F.frontier ? 'frontier' : ''), desc: F.desc || '', hidden: F.hidden ? 1 : 0, tf: tf ? 1 : 0, herbs, eggs, books, booksB, fbEx, groups });
  }
  for (const id of RAID_IDS) { const R = RAIDS[id]; out.raids.push({ id, n: R.name, lv: R.lv, desc: R.desc, img: spr(R.mon), part: it('rp_' + id), heart: it('rh_' + id) }); }
  // ── 잡템: 몬스터가 떨어뜨리지 않는 것 ──
  const dropped = new Set(Object.values(MONS).flatMap(m => (m.drops || []).map(d => d[0])));
  const fname = f => (FIELDS[f] ? FIELDS[f].name : f);
  const herbFrom = k => ALL_FIELDS.filter(f => (FIELDS[f].herbs || []).includes(k)).map(fname);
  const kname = x => (typeof KINGDOMS !== 'undefined' && KINGDOMS[x] ? KINGDOMS[x].name : x);
  const src = k => { const I = ITEMS[k];
    if (I.herb) { const fs = herbFrom(k); return (fs.length ? fs.join(' · ') + '에서 줍기' : '몬스터 · 땅에서 줍기') + ' · 재배소'; }
    if (I.veg) return (typeof VEG_FROM !== 'undefined' && VEG_FROM[k] === 'hargen' ? '하르겐 시장(주방)' : kname(typeof VEG_FROM !== 'undefined' ? VEG_FROM[k] : '') + ' 상단') + ' · 재배소';
    if (I.sea) return '항구에 온 배';
    if (['flour', 'spice', 'honey'].includes(k)) return '하르겐 시장(주방)';
    if (k === 'egg_none') return '사육장 (무정란 · 부화 실패)';
    if (k.startsWith('food_')) { let need = ''; try { const F2 = FOODS[k.slice(5)]; if (F2 && F2.need) need = needTxt(F2.need); } catch (e) {} return '주방 요리' + (need ? ' · ' + need : ''); }
    if (I.egg) { const pk = k.slice(4), P = PETS[pk]; return (P && P.field ? fname(P.field) + ' 몬스터' : '몬스터') + ' · 떠돌이 상인'; }
    if (I.excl) return (EXCL_SHOP[EXCL[k].shop] || '') + (I.desc ? ' · ' + I.desc : '');
    if (k === 'bloomstone') return '우두머리 · 주인 · 던전 주인 · 레이드 · 희귀종';
    if (k === 'wizstone') return '우두머리 · 주인 · 던전 주인 · 레이드';
    if (k === 'tmap') return '우두머리 4% · 주인 8%';
    if (k.startsWith('rune_')) return '우두머리 · 던전 · 마탑에서 합치기';
    if (I.trade) return '교역 원정 (왕국 특산물)';
    if (k === 'horseshoe') return '마구간에서 삼';
    if (['parchment', 'ink'].includes(k)) return '도서관에서 삼 (스킬북 합성 재료)';
    if (typeof RECIPES !== 'undefined' && RECIPES[k]) return '연금술 조제' + (I.buy ? ' · 상점' : '');
    if (I.buy) return '상점';
    if (k === 'horseshoe') return '마구간';
    if (['parchment', 'ink'].includes(k)) return '도서관 재료';
    return '';
  };
  const skip = k => dropped.has(k) || /^(crest|core|soul)_\d+$/.test(k) || /^r[ph]_/.test(k) || k.startsWith('rcp_') || k.startsWith('book_') || k.startsWith('bk_') || !ITEMS[k].name;
  const keys = Object.keys(ITEMS).filter(k => !skip(k));
  const G = [['herb', '약초', k => ITEMS[k].herb], ['ing', '식재료', k => ITEMS[k].veg || ITEMS[k].sea || ['flour', 'spice', 'honey', 'egg_none'].includes(k)], ['dish', '요리', k => k.startsWith('food_')],
    ['sup', '물약 · 치료약', k => itemCat(k) === 'sup' && !ITEMS[k].egg && !ITEMS[k].excl && !STONE_IDS.includes(k) && k !== 'tmap'], ['special', '특성 돌 · 보물 지도 · 상단 전용 물건', k => STONE_IDS.includes(k) || k === 'tmap' || ITEMS[k].excl],
    ['egg', '알', k => ITEMS[k].egg], ['rune', '룬', k => k.startsWith('rune_')], ['etc', '기타 재료 · 교역품', () => true]];
  const used = new Set();
  for (const [id, title, fn] of G) { const L = keys.filter(k => !used.has(k) && fn(k)); L.forEach(k => used.add(k)); out.misc.push({ id, title, items: L.map(k => ({ ...it(k), src: src(k) })) }); }
  // ── 스킬북: 단계 책 + 직업 계열마다 ──
  const tb = BOOK_TIERS.map(b => b.id).filter(k => ITEMS[k]);
  out.tierBooks = tb.map(k => ({ ...it(k), src: '모든 몬스터 · 보물 상자 · 도서관 합성' }));
  const LN = Object.fromEntries(ADV_CATS);
  const byLine = {};
  Object.keys(ITEMS).filter(k => k.startsWith('book_')).forEach(k => { const s = SKILLS[ITEMS[k].book]; if (!s) return; const c = (s.cls || []).find(x => CLASSES[x]); const L = c ? jobBase(c) : 'common'; const bt = skillBookTier(ITEMS[k].book);
    (byLine[L] = byLine[L] || []).push({ ...it(k), sk: s.name, job: c ? (s.cls || []).filter(x => CLASSES[x]).map(x => CLASSES[x].name).join(' · ') : '공용', lv: s.lv || 0, bt: bt >= 0 && BOOK_TIERS[bt] ? BOOK_TIERS[bt].name : '배울 직업 없음' }); });
  Object.values(byLine).forEach(L => L.sort((a, b) => a.lv - b.lv));
  out.books = ['warrior', 'archer', 'mage', 'cleric', 'rogue', 'porter', 'common'].filter(L => byLine[L]).map(L => ({ line: L, title: (LN[L] ? LN[L] + ' 계열' : '공용') + ' 스킬북', items: byLine[L] }));
  return JSON.stringify(out);
})()"""
with sync_playwright() as pw:
    br = pw.chromium.launch(); pg = br.new_page(); errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto('file://' + sys.argv[1]); pg.wait_for_timeout(700)
    pg.locator('button', has_text='상단 문 열기').first.click(); pg.wait_for_timeout(900)
    s = pg.evaluate("s => window.__EV(s)", JS); br.close()
open(sys.argv[2], 'w', encoding='utf-8').write(s)
d = json.loads(s)
print('errors', errs, 'icons', len(d['icons']), sum(len(u) for u in d['icons']) // 1024, 'KB')
for F in d['fields']: print(F['id'], F['n'], F['tn'], F['lv'], 'herbs', len(F['herbs']), 'eggs', len(F['eggs']), 'books', [(b['n'], b['w']) for b in F['books']], [(g['title'], len(g['mons'])) for g in F['groups']])
print('raids', [(r['n'], r['part']['n'] if r['part'] else None) for r in d['raids']])
print('misc', [(m['title'], len(m['items'])) for m in d['misc']])
print('tierBooks', len(d['tierBooks']), 'books', [(b['title'], len(b['items'])) for b in d['books']])
print('etc', [x['n'] + ':' + x['src'] for x in d['misc'][-1]['items']])
