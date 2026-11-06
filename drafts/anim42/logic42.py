"""빌드 42 논리 시험: 무기 갈래 · 새 동작 표 · 그림 · 역할 바꾸기 · 기본 공격 고르기 · 쏘는 때와 자리 · 스킬 효과 표(전 직업) · 사건 → 효과 · 그리기 오류 없음."""
import json, sys, pathlib, os
sys.path.insert(0, str(pathlib.Path(__file__).parent.parent / 'sky31'))
import harness
if os.environ.get('SRC42'): harness.SRC = pathlib.Path(os.environ['SRC42'])
from playwright.sync_api import sync_playwright
EXTRA = """
window.OV = { makeAdv, makeGear, SKILLS, SKFX, SK_PAL, SK_HIT2, SK_CAST2, SK_AFTER2, PXS_MOT, PXS_MOT_OF, PXS_MOTW, PXS_MOT_TT, PXS_MOT_HITF, PXS_FAMW, pxsMotT, pxsMotHit, pxsFam, pxsWk, pxsMotFr, pxsAdvSprite, pxsMotOK,
  MOT_POOL, MOT_OWN, MOT_ROLE, MOT_FAMR, MOT_REPEAT, motFam, motPick, motPool, motOn, motCast, motNow, motToHit, motTip, motJy, events, skDraw, V, STORY, CLASSES, PX_WPN, getS: () => S };
"""
JS = r"""() => { const out = {}; const V = window.OV;
  const T = (name, fn) => { try { out[name] = fn(); } catch (e) { out[name] = 'ERR ' + e.message + ' @ ' + (e.stack || '').split('\n').slice(1, 3).join(' | '); } };
  G.newGame('시험'); const S = V.getS();
  const adv = (cls, id, w, off) => { const a = V.makeAdv({ cls, lv: 60 }); a.id = id; if (w) a.eq.weapon = V.makeGear(w, 2, 0); if (off !== undefined) a.eq.off = off ? V.makeGear(off[0], off[1], 0) : null; return a; };
  const MK = new Set(Object.keys(V.PXS_MOT).concat(Object.keys(V.PXS_MOT_OF), Object.keys(V.PXS_MOTW)));
  // 1) 무기 갈래
  T('fam', () => Object.fromEntries([['warrior'], ['archer'], ['sniper'], ['dragoon'], ['knight', 'trident'], ['mage'], ['necromancer'], ['archbishop'], ['cleric'], ['inquisitor'], ['porter'], ['berserker'], ['rogue'], ['assassin'], ['duelist'], ['bard'], ['priest'], ['gladiator', 'gladius']].map(([c, w]) => { const a = adv(c, 5, w); return [c + (w ? ':' + w : ''), V.pxsWk(a) + '/' + V.pxsFam(a)]; })));
  // 2) 새 동작 표
  T('motw', () => { const bad = []; for (const [k, fr] of Object.entries(V.PXS_MOTW)) { if (fr.length !== 8) bad.push(k + ':len'); const TT = V.pxsMotT(k); if (TT.length !== 8) bad.push(k + ':T'); const h = V.pxsMotHit(k); if (h < 1 || h > 7) bad.push(k + ':hit'); }
    return { n: Object.keys(V.PXS_MOTW).length, bad, hitf: V.PXS_MOT_HITF, trident: !!V.PX_WPN.trident }; });
  // 3) 그림: 갈래마다 그 갈래 동작 × 8장
  T('sprites', () => { const px = s => { const c = s.cv.getContext('2d').getImageData(0, 0, s.cv.width, s.cv.height).data; let n = 0; for (let i = 3; i < c.length; i += 4) if (c[i]) n++; return n; };
    const sets = [['archer'], ['sniper'], ['dragoon'], ['knight', 'trident'], ['mage'], ['necromancer'], ['archbishop'], ['cleric'], ['inquisitor'], ['porter'], ['berserker'], ['rogue'], ['assassin'], ['duelist'], ['bard'], ['priest'], ['warrior', 'axe']];
    let n = 0, bad = [], err = [], fx = 0, fxWant = 0;
    for (const [c, w] of sets) { const a = adv(c, 7, w, null), fam = V.pxsFam(a);
      for (const mk of V.MOT_OWN[fam]) for (let f = 0; f < 8; f++) { let s; try { s = V.pxsAdvSprite(a, 'm:' + mk, f); } catch (e) { err.push(c + mk + f + ':' + e.message); continue; }
        n++; if (!s || px(s) < 60) bad.push(c + mk + f); const F = V.pxsMotFr(mk, f); if (F.fx && ['arc', 'streak', 'snap', 'glint', 'cast', 'gather', 'notes', 'dust'].includes(F.fx.k)) { fxWant++; if (s.mfx && s.mfx.back.length + s.mfx.front.length) fx++; } } }
    return { n, bad: bad.slice(0, 6), err: err.slice(0, 3), fx, fxWant }; });
  // 4) 역할 바꾸기: 어느 갈래든 모든 동작 이름이 그 갈래 동작으로
  T('famr', () => { const bad = []; const reps = { sword: adv('warrior', 9, null, null), dagger: adv('rogue', 9), heavy: adv('cleric', 9, null, null), pole: adv('dragoon', 9), staff: adv('mage', 9), bow: adv('archer', 9), lute: adv('bard', 9) };
    for (const [fam, a] of Object.entries(reps)) for (const mk of MK) { const r = V.motFam(a, mk); if (!V.MOT_OWN[fam].includes(r)) bad.push(fam + ':' + mk + '→' + r); }
    return { bad: bad.slice(0, 8), n: MK.size, ex: [V.motFam(reps.bow, 'down'), V.motFam(reps.staff, 'raise'), V.motFam(reps.pole, 'thrust'), V.motFam(reps.heavy, 'thrust'), V.motFam(reps.lute, 'raise'), V.motFam(reps.dagger, 'smash')] }; });
  // 5) 기본 공격 고르기: 갈래 자세 · 잇달아 같은 자세 없음(보통 쏘기·켜기는 됨)
  T('pick', () => { const r = {}; const as = { bow: [adv('archer', 11), 'arrow'], staff: [adv('mage', 12), 'magic'], priest: [adv('priest', 13), 'melee'], heavy: [adv('cleric', 14, null, null), 'melee'], heavyM: [adv('inquisitor', 15), 'magic'], pole: [adv('dragoon', 16), 'melee'], dagger: [adv('rogue', 17), 'melee'], lute: [adv('bard', 18), 'note'], twin: [adv('duelist', 19), 'melee'] };
    for (const [k, [a, kk]] of Object.entries(as)) { const cnt = {}; let rep = 0, last = null; for (let i = 0; i < 300; i++) { const m = V.motPick(a, null, 0, kk); cnt[m] = (cnt[m] || 0) + 1; if (m === last && !V.MOT_REPEAT[m]) rep++; last = m; } r[k] = { cnt, rep }; }
    return r; });
  // 6) 때: 맞히는(쏘는) 장까지
  T('timing', () => { V.V.mot = {}; const t = 100, r = {};
    const one = (a, x, tt) => +V.motOn(a, x, tt).toFixed(3);
    r.bshot = one(adv('archer', 21), { s: 21, d: 5, k: 'arrow', b: 1 }, t);
    V.V.motLast = {}; const ar = adv('archer', 22); V.V.mot = {};
    r.forced = ['bshot', 'smash', 'pjump', 'spushup', 'brapid', 'hack'].map(mk => +V.motToHit({ mk, f0: 0 }).toFixed(3));
    r.chainRapid = +V.motToHit({ mk: 'brapid', f0: 2 }).toFixed(3);
    return r; });
  // 7) 사건 → 효과
  const run = (cls, w, evs, foes) => { S.advs = []; V.V.fx = []; V.V.mot = {}; V.V.skSeen = {}; V.V.lastN = 0; V.V.dir = 1; V.V.jump = {}; V.V.atk = {};
    const a = adv(cls, 81, w), m = adv('cleric', 82, 'mace'), team = [a, m]; S.advs = team.slice();
    const fo = (foes || ['bandit']).map((id, i) => ({ uid: 60 + i, id, hp: 100, maxHp: 100, sc: 0 })), t = 300; let n = 1;
    const ev = []; for (const x of evs(fo)) ev.push(Object.assign({ n: n++ }, x));
    const pos = { a81: [98, 198], a82: [66, 192] }; fo.forEach((f, i) => { pos['f' + f.uid] = [150 + i * 24, 194 - i * 4]; });
    V.events({ foes: fo, ev, evN: n }, pos, t, team, { id: 1, name: '1팀', members: [81, 82] });
    const by = {}; for (const f of V.V.fx) by[f.k] = (by[f.k] || 0) + 1;
    const pick = k => V.V.fx.filter(f => f.k === k).map(f => ({ t: +(f.t0 - t).toFixed(3), x0: f.x0 != null ? Math.round(f.x0) : undefined, y0: f.y0 != null ? Math.round(f.y0) : undefined, d: f.d != null ? +f.d.toFixed(3) : undefined, style: f.style, pre: f.pre, arc: f.arc }));
    return { by, mot: V.V.mot['a81'] ? V.V.mot['a81'].q.map(q => q.mk) : null, arrow: pick('arrow'), orb: pick('orb'), skp: pick('skp'), skh: pick('skh'), slash: pick('slash'), num: pick('num').map(x => x.t), jump: V.V.jump['a81'] != null, skc: V.V.fx.filter(f => f.k === 'skc').map(f => [f.id, f.tg.length]) }; };
  const hit = (sid, k, extra) => fo => fo.map(f => Object.assign({ type: 'hit', s: 81, d: f.uid, v: 30, c: false, k }, sid ? { sid } : { b: 1 }, extra || {}));
  T('ev_arrow', () => { V.V.motLast = { 81: 'bdiag' }; const old = V.motPick; return run('archer', null, hit(null, 'arrow')); });
  T('ev_magic', () => run('mage', null, hit(null, 'magic')));
  T('ev_note', () => run('bard', null, hit(null, 'note')));
  T('ev_rain', () => run('archer', null, fo => [{ type: 'skill', s: 81, id: 'rain' }].concat(hit('rain', 'arrow')(fo)), ['bandit', 'wolf', 'slime']));
  T('ev_fireball', () => run('mage', null, fo => [{ type: 'skill', s: 81, id: 'fireball' }].concat(hit('fireball', 'fire')(fo))));
  T('ev_poison', () => run('archer', null, fo => [{ type: 'skill', s: 81, id: 'poisonarrow' }].concat(fo.map(f => ({ type: 'hit', s: 81, d: f.uid, v: 0, k: 'arrow', dot: 1 })))));
  T('ev_jump', () => run('dragoon', null, fo => [{ type: 'skill', s: 81, id: 'jump' }].concat(hit('jump', 'jump')(fo), hit('jump', 'jump')(fo))));
  T('ev_heal', () => run('priest', null, fo => [{ type: 'skill', s: 81, id: 'massheal' }, { type: 'heal', s: 81, d: 82, v: 50 }]));
  T('ev_heal2', () => run('cleric', 'mace', fo => [{ type: 'skill', s: 81, id: 'bless' }, { type: 'buff', s: 81, id: 'bless', party: true }]));
  T('ev_hack', () => run('rogue', null, fo => [{ type: 'skill', s: 81, id: 'shadow' }].concat(hit('shadow', 'melee')(fo), hit('shadow', 'melee')(fo), hit('shadow', 'melee')(fo))));
  T('ev_song', () => run('bard', null, fo => [{ type: 'skill', s: 81, id: 'ballad' }, { type: 'buff', s: 81, id: 'ballad', party: true }]));
  // 8) 표: 모든 스킬
  T('table', () => { const miss = [], bad = [];
    const HIT0 = ['star', 'wave', 'quake', 'cross', 'pillar', 'stun', 'pierce'], CAST0 = ['barrier', 'dome', 'shout', 'rage', 'taunt', 'heal', 'cure', 'cheer', 'wind', 'counter', 'sand'], AFTER0 = ['dust', 'motes', 'ring', 'embers', 'shards', 'drain'], PROJ = ['arrow', 'orb', 'shard', 'note', 'flask', 'dart', 'junk', 'beam'];
    for (const [id, s] of Object.entries(V.SKILLS)) { if (!s.kind || s.kind === 'passive') continue; const f = V.SKFX[id]; if (!f) { miss.push(id); continue; }
      if (!V.SK_PAL[f.pal]) bad.push(id + ':pal ' + f.pal);
      for (const m of f.mot == null ? [] : Array.isArray(f.mot) ? f.mot : [f.mot]) if (!MK.has(m)) bad.push(id + ':mot ' + m);
      if (['dmg', 'mdmg', 'dot'].includes(s.kind)) { if (!f.hit && s.kind !== 'dot') bad.push(id + ':nohit'); if (f.hit && !HIT0.includes(f.hit) && !V.SK_HIT2[f.hit]) bad.push(id + ':hit ' + f.hit); }
      else if (!f.cast) bad.push(id + ':nocast'); else if (!CAST0.includes(f.cast) && !V.SK_CAST2[f.cast]) bad.push(id + ':cast ' + f.cast);
      if (f.after && !AFTER0.includes(f.after) && !V.SK_AFTER2[f.after]) bad.push(id + ':after ' + f.after);
      if (f.proj && !PROJ.includes(f.proj)) bad.push(id + ':proj ' + f.proj); }
    const hits = {}; for (const f of Object.values(V.SKFX)) if (f.hit) hits[f.hit] = (hits[f.hit] || 0) + 1;
    const casts = {}; for (const f of Object.values(V.SKFX)) if (f.cast) casts[f.cast] = (casts[f.cast] || 0) + 1;
    return { n: Object.keys(V.SKFX).length, miss, bad: bad.slice(0, 10), hits, casts }; });
  // 9) 그리기: 모든 스킬 × 모양 × 때
  T('draw', () => { const c = document.createElement('canvas'); c.width = 240; c.height = 200; const g = c.getContext('2d'); let n = 0, err = [];
    for (const id of Object.keys(V.SKFX)) for (const k of ['skh', 'skw', 'skq', 'skc', 'skp']) for (const e of [0, 0.05, 0.12, 0.25, 0.4, 0.6, 0.9, 1.3]) {
      const f = { k, id, x: 150, y: 180, fy: 194, h: 20, t0: 10, d: 2, big: 1, last: 1, dir: 1, ax: 98, x0: 124, y0: 176, x1: 150, y1: 180, xe: 200, gy: 194, z: 1.25, tg: [[66, 192, 1.25]], pre: 0.2, style: (V.SKFX[id].proj || 'orb') };
      try { V.skDraw(g, f, 10 + e); n++; } catch (er) { err.push(id + k + e + ':' + er.message); } }
    return { n, err: err.slice(0, 4) }; });
  T('story', () => ({ v42: (V.STORY.v42 || []).length, flag: !!V.getS().flags.v42 }));
  return out; }"""
def chk(c, m):
    print(('ok   ' if c else 'FAIL ') + m[:900]); return c
if __name__ == '__main__':
    p = pathlib.Path(__file__).parent / 'logic42.html'; p.write_text(harness.build_html(EXTRA), encoding='utf-8')
    with sync_playwright() as pw:
        b = pw.chromium.launch(); pg = b.new_page(); errs = []
        pg.on('pageerror', lambda e: errs.append(str(e)))
        pg.goto(p.as_uri()); pg.wait_for_timeout(300)
        R = pg.evaluate(JS); b.close()
    for k, v in R.items():
        if isinstance(v, str) and v.startswith('ERR'): print('ERR', k, v)
    ok = True
    fm = R['fam']; ok &= chk(isinstance(fm, dict) and fm['warrior'] == 'sword/sword' and fm['archer'] == 'bow/bow' and fm['sniper'] == 'long/bow' and fm['dragoon'] == 'lance/pole' and fm['knight:trident'] == 'trident/pole' and fm['mage'] == 'staff/staff'
                         and fm['necromancer'] == 'skull/staff' and fm['archbishop'] == 'crozier/staff' and fm['cleric'] == 'mace/heavy' and fm['inquisitor'] == 'hammer/heavy' and fm['porter'] == 'club/heavy' and fm['berserker'] == 'gaxe/heavy'
                         and fm['rogue'] == 'dagger/dagger' and fm['assassin'] == 'dagger/dagger' and fm['duelist'] == 'sword/sword' and fm['bard'] == 'lute/lute' and fm['gladiator:gladius'] == 'gladius/sword', f'fam {fm}')
    mw = R['motw']; ok &= chk(isinstance(mw, dict) and not mw['bad'] and mw['n'] >= 24 and mw['trident'], f'motw {mw}')
    sp = R['sprites']; ok &= chk(isinstance(sp, dict) and not sp['bad'] and not sp['err'] and sp['n'] > 900 and sp['fx'] == sp['fxWant'], f'sprites {sp}')
    fr = R['famr']; ok &= chk(isinstance(fr, dict) and not fr['bad'] and fr['ex'] == ['bswing', 'sraise', 'pthrust', 'down', 'lraise', 'down'], f'famr {fr}')
    pk = R['pick']; ok &= chk(isinstance(pk, dict) and all(v['rep'] == 0 for v in pk.values()) and set(pk['bow']['cnt']) == {'bshot', 'bdiag', 'bswing'} and pk['bow']['cnt']['bshot'] > pk['bow']['cnt']['bswing']
                         and set(pk['staff']['cnt']) == {'spush', 'sjab', 'sswing'} and set(pk['priest']['cnt']) == {'sjab', 'sswing'} and set(pk['heavyM']['cnt']) == {'spush', 'spushup'} and 'smash' in pk['heavy']['cnt']
                         and set(pk['pole']['cnt']) == {'pthrust', 'pup', 'plow', 'pswing'} and 'hack' in pk['dagger']['cnt'] and set(pk['lute']['cnt']) == {'lstrum', 'lswing'} and 'hack' in pk['twin']['cnt'], f'pick {pk}')
    tm = R['timing']; ok &= chk(isinstance(tm, dict) and tm['forced'] == [0.21, 0.265, 0.35, 0.29, 0.12, 0.13] and tm['chainRapid'] == 0.06, f'timing {tm}')
    ea = R['ev_arrow']; ok &= chk(isinstance(ea, dict) and len(ea['arrow']) == 1 and ea['arrow'][0]['t'] > 0.1 and ea['mot'] and ea['mot'][0] in ('bshot', 'bswing') or (ea['mot'] and ea['mot'][0] == 'bswing' and len(ea['slash']) == 1), f'ev_arrow {ea}')
    em = R['ev_magic']; ok &= chk(isinstance(em, dict) and len(em['orb']) == 1 and em['orb'][0]['t'] > 0.1 and em['mot'][0] in ('spush', 'sjab', 'sswing') and em['orb'][0]['x0'] > 102, f'ev_magic {em}')
    en = R['ev_note']; ok &= chk(isinstance(en, dict) and en['mot'][0] in ('lstrum', 'lswing') and (len(en['orb']) == 1 or en['mot'][0] == 'lswing'), f'ev_note {en}')
    er = R['ev_rain']; ok &= chk(isinstance(er, dict) and er['by'].get('skh') == 3 and len([x for x in er['skp'] if x['style'] == 'arrow']) == 3 and all(x['pre'] == 0.24 for x in er['skh']) and er['mot'] == ['bdiag'] and not er['arrow'], f'ev_rain {er}')
    ef = R['ev_fireball']; ok &= chk(isinstance(ef, dict) and ef['by'].get('skh') == 1 and len(ef['skp']) == 1 and ef['skp'][0]['style'] == 'orb' and ef['mot'] == ['spush'] and not ef['orb'] and abs(ef['skh'][0]['t'] - (ef['skp'][0]['t'] + ef['skp'][0]['d'])) < 1e-6, f'ev_fireball {ef}')
    ep = R['ev_poison']; ok &= chk(isinstance(ep, dict) and ep['mot'] == ['bshot'] and ep['by'].get('skh') == 1 and ep['skp'] and ep['skp'][0]['style'] == 'arrow' and ep['skp'][0]['t'] > 0.1, f'ev_poison {ep}')
    ej = R['ev_jump']; ok &= chk(isinstance(ej, dict) and ej['mot'] == ['pjump', 'pjump'] and not ej['jump'] and ej['by'].get('skh') == 2, f'ev_jump {ej}')
    eh = R['ev_heal']; ok &= chk(isinstance(eh, dict) and eh['mot'] == ['sraise'] and eh['skc'] == [['massheal', 1]], f'ev_heal {eh}')
    eh2 = R['ev_heal2']; ok &= chk(isinstance(eh2, dict) and eh2['mot'] == ['raise'] and eh2['skc'] == [['bless', 1]], f'ev_heal2 {eh2}')
    ek = R['ev_hack']; ok &= chk(isinstance(ek, dict) and ek['mot'] == ['hack', 'hack', 'hack'] and ek['by'].get('skh') == 3, f'ev_hack {ek}')
    es = R['ev_song']; ok &= chk(isinstance(es, dict) and es['mot'] == ['lraise'] and es['skc'] == [['ballad', 1]], f'ev_song {es}')
    tb = R['table']; ok &= chk(isinstance(tb, dict) and not tb['miss'] and not tb['bad'] and tb['n'] >= 260, f'table {tb}')
    dr = R['draw']; ok &= chk(isinstance(dr, dict) and not dr['err'] and dr['n'] > 10000, f'draw {dr}')
    st = R['story']; ok &= chk(st['v42'] >= 3 and st['flag'], f'story {st}')
    print('ALL OK' if ok else 'SOME FAILED', '| errors', errs[:3])
