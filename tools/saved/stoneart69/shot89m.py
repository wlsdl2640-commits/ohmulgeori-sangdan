"""마석 · 장비 9칸 화면 (빌드 69 실제 게임): python3 shot89m.py <훅 페이지> <출력 폴더>"""
import sys, os, json
from playwright.sync_api import sync_playwright
page, out = sys.argv[1], sys.argv[2]; os.makedirs(out, exist_ok=True)
H83 = open('/tmp/claude-0/-home-claude/4368c869-ae47-5efb-8102-510605121dd4/scratchpad/v83/h83.js', encoding='utf-8').read()
SETUP = H83 + r'''
;(() => {
  H.fresh(); S.rank = 6; S.bld.tower = 5; Object.keys(S.flags).forEach(k => { S.flags[k] = S.flags[k] || 1; }); S.flags.v69d = 1;
  const a = H.adv('paladin', 150, { q: 4 }); a.name = '레오나';
  const w = a.eq.weapon; w.q = 6; w.runes = ['rune_fire_2', 'rune_haste_1', 'rune_power_2'].filter(k => ITEMS[k]); while (w.runes.length < 3) w.runes.push(Object.keys(ITEMS).find(k => ITEMS[k].rune && ITEMS[k].rune[1] === 2));
  w.ms = ['ms_garn', 'ms_opal', 'ms_amber'];
  const ar = a.eq.armor; ar.q = 5; ar.ms = ['ms_dia', 'ms_aqua']; ar.runes = [Object.keys(ITEMS).find(k => ITEMS[k].rune && ITEMS[k].rune[1] === 1)];
  if (a.eq.legs) { a.eq.legs.q = 3; a.eq.legs.ms = ['ms_obsid']; }
  MASEOK_IDS.forEach((k, i) => { S.inv['ms_' + k] = [3, 2, 1, 4, 2, 1, 2, 5][i]; });
  Object.keys(ITEMS).filter(k => ITEMS[k].rune).slice(0, 6).forEach((k, i) => { S.inv[k] = 1 + i; });
  const g2 = makeGear('sword', 12, 4); g2.ms = ['ms_moon']; S.gear.push(g2);
  const g3 = makeGear('belt', 12, 2); S.gear.push(g3);
  const b = H.adv('gladiator', 150, { q: 4 }); b.name = '카이';
  const c = H.adv('archbishop', 150, { q: 4 }); c.name = '세라';
  const p = newParty('1팀', [a.id, b.id, c.id]); S.parties = [p]; p.sup = {}; p.safe = false;
  S.modals = []; S.view = p.id; UI.dirty = true;
  return JSON.stringify({ a: a.id, w: w.id, g3: g3.id });
})()
'''
with sync_playwright() as pw:
    br = pw.chromium.launch(); pg = br.new_page(viewport={'width': 412, 'height': 880}, device_scale_factor=2)
    errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto('file://' + os.path.abspath(page)); pg.wait_for_timeout(900)
    pg.locator('button', has_text='상단 문 열기').first.click(); pg.wait_for_timeout(1200)
    def skip():
        for _ in range(20):
            sk = pg.locator('.skipall')
            if sk.count() and sk.first.is_visible(): sk.first.click(); pg.wait_for_timeout(150); continue
            mb = pg.locator('#m-btns button')
            if mb.count() and mb.first.is_visible(): mb.last.click(); pg.wait_for_timeout(150); continue
            break
    skip()
    EV = lambda code: pg.evaluate("s => window.__EV(s)", code)
    ids = json.loads(EV(SETUP)); EV("S.modals = []; 'ok'"); pg.wait_for_timeout(300); skip()
    # 1) 장비 칸 창
    EV(f"openWin('rune', {{ gid: {ids['w']} }}); 'ok'"); pg.wait_for_timeout(700)
    pg.screenshot(path=f'{out}/1_slotwin.png')
    EV("(() => { document.getElementById('panel').scrollTop = 99999; return 'ok'; })()"); pg.wait_for_timeout(300)
    pg.screenshot(path=f'{out}/1b_slotwin_bottom.png')
    # 1c) 희귀 장비(마석 칸 없음)
    EV(f"closeWins(); openWin('rune', {{ gid: {ids['g3']} }}); 'ok'"); pg.wait_for_timeout(600)
    pg.screenshot(path=f'{out}/1c_slotwin_rare.png')
    # 2) 창고 룬·마석 칸 + 정보창
    EV("closeWins(); UI.invTab = 'rune'; UI.invSel = null; menuGo('inv'); 'ok'"); pg.wait_for_timeout(700)
    pg.screenshot(path=f'{out}/2_inv.png')
    pg.locator('.cell[data-id="ms_amber"]').first.click(); pg.wait_for_timeout(500)
    pg.screenshot(path=f'{out}/2b_inv_pop.png')
    # 2c) 장비 칸 정보창 (마석을 끼운 칼)
    EV("UI.invTab = 'gear'; UI.invSel = null; renderPanel(true); 'ok'"); pg.wait_for_timeout(500)
    cell = pg.locator('.cell[data-act="invsel"]').first
    if cell.count(): cell.click(); pg.wait_for_timeout(500)
    pg.screenshot(path=f'{out}/2c_inv_gear.png')
    # 3) 모험가 장비 탭 · 능력치
    EV(f"closeWins(); UI.advTab = 'gear'; openAdv({ids['a']}); 'ok'"); pg.wait_for_timeout(800)
    EV("(() => { const el = document.querySelector('#panel .li.col'); if (el) el.scrollIntoView(); return 'ok'; })()"); pg.wait_for_timeout(300)
    pg.screenshot(path=f'{out}/3_adv_gear.png')
    EV(f"UI.advTab = 'stat'; renderPanel(true); 'ok'"); pg.wait_for_timeout(500)
    EV("(() => { const el = [...document.querySelectorAll('#panel span')].find(x => /받는 피해/.test(x.textContent)); if (el) el.scrollIntoView({ block: 'center' }); return 'ok'; })()"); pg.wait_for_timeout(300)
    pg.screenshot(path=f'{out}/3b_adv_stat.png')
    # 4) 마탑
    EV("closeWins(); openWin('b', { b: 'tower' }); 'ok'"); pg.wait_for_timeout(800)
    EV("(() => { const d = [...document.querySelectorAll('details.card')].find(x => /장비 칸/.test(x.textContent)); if (d) { d.open = true; d.scrollIntoView(); } return d ? 'open' : 'none'; })()"); pg.wait_for_timeout(400)
    pg.screenshot(path=f'{out}/4_tower.png')
    # 5) 알림
    EV("closeWins(); S.flags.v69d = 0; SLOT69 = { n: 4, g: 2 }; notes69d(); 'ok'"); pg.wait_for_timeout(200)
    EV("pumpModals(); 'ok'"); pg.wait_for_timeout(600)
    pg.screenshot(path=f'{out}/5_notice.png')
    skip(); EV("S.modals = []; 'ok'")
    # 6) 싸움: 반사 · 버티기 · 보호막 (버티기는 보여 주려고 이 찍기에서만 확률을 높인다)
    print(EV(r"""(() => { const p = S.parties[0]; MASEOK.amber.v = 0.5; MASEOK.amber.cap = 0.9;
      p.exp = newExp('volcano', {}, 30); teamOf(p).forEach(a => { a.status = 'away'; refillAmmo(a); });
      S.t = Math.floor(S.t / DAY_SEC) * DAY_SEC + DAY_SEC * 0.45;
      for (let i = 0; i < 4000 && !p.exp.foes.length; i++) step(0.05);
      p.exp.foes.forEach(f => { f.atk *= 6; });
      for (let i = 0; i < 20; i++) step(0.05);
      S.view = p.id; openBattle(); return p.exp.foes.map(f => f.id).join(',') + ' · 마석 보호막 ' + p.exp.ev.filter(x => x.type === 'shield' && x.ms).length + ' · 반사 ' + p.exp.ev.filter(x => x.k === 'reflect').length; })()"""))
    pg.wait_for_timeout(500)
    for i in range(4):
        EV("for (let i = 0; i < 8; i++) step(0.05); 'ok'"); pg.wait_for_timeout(420)
        pg.screenshot(path=f'{out}/6_battle_{i}.png')
    print(EV("JSON.stringify(S.parties[0].exp ? S.parties[0].exp.ev.filter(x => x.k === 'reflect' || x.type === 'endure' || (x.type === 'shield' && x.ms)).map(x => x.type + (x.k ? ':' + x.k : '') + ':' + (x.v || '')).slice(-12) : 'none')"))
    print('errors:', errs[:5]); br.close()
