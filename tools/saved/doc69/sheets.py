"""빌드 69 설명 문서 그림 — 실제 게임 그리기로 직업 · 스킬 · 몬스터 · 아이템 판을 찍는다 (11-16 사용자 「아이템, 직업, 몬스터등은 이미지도 만들어서 넣어줘」)
   python3 sheets.py <훅 페이지(tools/saved/bal69/mkpage.py)> <출력 폴더> → jobs.png · skills.png · mons.png · items.png
   게임 함수(rideComp · pxuSprite · drawMon · iArt · skIco · mastIco)로 그린 것을 페이지 위에 판으로 놓고 그 칸만 찍는다(DPR 2)."""
import json, sys, os
from playwright.sync_api import sync_playwright
PAGE, OUT = sys.argv[1], sys.argv[2]; os.makedirs(OUT, exist_ok=True)
JS = r"""(() => {
  const old = document.getElementById('doc69'); if (old) old.remove();
  const box = document.createElement('div'); box.id = 'doc69';
  box.style.cssText = 'position:absolute;left:0;top:0;z-index:99999;width:880px;background:#14161c;padding:0;font-family:inherit';
  document.body.appendChild(box);
  const st = document.createElement('style'); st.textContent = `
    #doc69 .d69s{display:block;background:#23262f;margin:0 0 8px;padding:14px 16px 16px;width:880px;box-sizing:border-box}
    #doc69 .d69t{display:block;color:#ffd77a;font-size:17px;margin:0 0 12px;letter-spacing:.5px}
    #doc69 .d69g{display:flex;flex-wrap:wrap;gap:12px 14px;align-items:flex-end}
    #doc69 .d69c{display:flex;flex-direction:column;align-items:center;min-width:92px;max-width:200px}
    #doc69 .d69i{display:flex;align-items:flex-end;justify-content:center;min-height:40px}
    #doc69 .d69n{color:#f2f2f2;font-size:13px;margin-top:6px;text-align:center;line-height:1.3}
    #doc69 .d69u{color:#9aa3b5;font-size:11px;text-align:center;line-height:1.3}
    #doc69 .skico{width:48px;height:48px;image-rendering:pixelated}`;
  document.head.appendChild(st);
  const sec = (id, title) => { const d = document.createElement('div'); d.className = 'd69s'; d.id = id; d.innerHTML = `<div class="d69t">${title}</div><div class="d69g"></div>`; box.appendChild(d); return d.querySelector('.d69g'); };
  const card = (g, im, n, s) => { const c = document.createElement('div'); c.className = 'd69c'; c.innerHTML = `<div class="d69i">${im}</div><div class="d69n">${n}</div>${s ? `<div class="d69u">${s}</div>` : ''}`; g.appendChild(c); };
  const img = (cv, w, h, z) => `<img src="${cv.toDataURL()}" style="width:${w * z}px;height:${h * z}px;image-rendering:pixelated">`;
  const trim = cv => { const g = cv.getContext('2d'), d = g.getImageData(0, 0, cv.width, cv.height).data; let x0 = cv.width, y0 = cv.height, x1 = -1, y1 = -1;
    for (let y = 0; y < cv.height; y++) for (let x = 0; x < cv.width; x++) if (d[(y * cv.width + x) * 4 + 3] > 0) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
    const o = document.createElement('canvas'); o.width = x1 - x0 + 1; o.height = y1 - y0 + 1; o.getContext('2d').drawImage(cv, -x0, -y0); return o; };
  const mon = (id, W, H) => { const c = document.createElement('canvas'); c.width = W; c.height = H; const x = c.getContext('2d'); x.imageSmoothingEnabled = false; x.translate(W / 2, H - 10); drawMon(x, id, 0, { z: 1 }); return trim(c); };
  const LOOKS = [['A', '산호'], ['B', '해초'], ['C', '심해'], ['D', '진주']];
  // 직업: 해룡기수 (탈것 해룡 넷 — 옆 · 앞)
  let g = sec('jobs', '새 4차 직업 · 해룡기수 (용기수 다음) — 탈것 해룡 모습 넷');
  const a = makeAdv({ cls: 'seadragoon', lv: 150, name: '해룡기수' });
  for (const [L, nm] of LOOKS) { a.ride = { sea: { look: L, name: nm + ' 해룡', lv: 30 } }; const s = rideComp(a, 'idle', 0, true); card(g, img(s.cv, s.w, s.h, 3), `${nm} 해룡`, '옆모습 (전투)'); }
  for (const [L, nm] of LOOKS) { a.ride = { sea: { look: L, name: nm + ' 해룡', lv: 30 } }; const s = rideComp(a, 'idle', 0, false); card(g, img(s.cv, s.w, s.h, 3), `${nm} 해룡`, '앞모습 (상단 · 영웅 창)'); }
  // 스킬 · 숙련 그림
  g = sec('skills', '새 스킬 · 숙련 그림');
  for (const id of ['tidalshot', 'bubbleprison', 'deepblood', 'tsunami', 'abyssroar', 'searoyal']) card(g, skIco(id), SKILLS[id].name, '해룡기수');
  for (const id of ['medkit', 'shieldbag', 'rations', 'pioneerwit']) card(g, skIco(id), SKILLS[id].name, id === 'rations' || id === 'pioneerwit' ? '코네스토가' : '짐꾼 공통');
  for (let t = 1; t <= 4; t++) card(g, mastIco('divine', t), `신성력 ${MAST_TIERS[t - 1] ? MAST_TIERS[t - 1].name : t}`, '숙련 · 성직자 계열 · 성기사');
  // 몬스터
  g = sec('mons', '새 몬스터 · 새 그림');
  card(g, (() => { const c = mon('raidgriffon', 260, 190); return img(c, c.width, c.height, 2); })(), '천둥새', '레이드 Lv170 (예전 대그리핀)');
  card(g, (() => { const c = mon('kingslime', 220, 170); return img(c, c.width, c.height, 2); })(), '킹슬라임', '레이드 Lv150 · 새 그림');
  for (const [id, nm] of [['seadragon', '산호'], ['seadragon_b', '해초'], ['seadragon_c', '심해'], ['seadragon_d', '진주']]) { const s = pxuSprite(id, 'idle', 0); card(g, img(s.cv, s.w, s.h, 2), `${nm} 해룡`, '심해 Lv150 ~ 170 몬스터'); }
  for (const [id, nm] of [['pet_seadragon', '산호'], ['pet_seadragon_b', '해초'], ['pet_seadragon_c', '심해'], ['pet_seadragon_d', '진주']]) { const s = pxuSprite(id, 'idle', 0); card(g, img(s.cv, s.w, s.h, 3), `새끼 ${nm} 해룡`, '펫 (Lv30에 해룡으로)'); }
  // 아이템
  g = sec('items', '새 아이템');
  for (const k of Object.keys(MASEOK)) card(g, iArt('ms_' + k, 2), ITEMS['ms_' + k].name, '마석 · ' + MASEOK[k].kind);
  for (const k of ['mp_s', 'mp_m', 'mp_l', 'mp_x']) card(g, iArt(k, 2), ITEMS[k].name, `MP ${ITEMS[k].mana.toLocaleString('ko-KR')}${k === 'mp_l' || k === 'mp_x' ? ' · 새' : ''}`);
  for (const [L, nm] of LOOKS) { const k = 'egg_' + seaKind(L); card(g, iArt(k, 2), `${nm} 해룡 알`, '심해에서'); }
  for (const k of ['rp_griffon', 'rh_griffon']) card(g, iArt(k, 2), ITEMS[k].name, '천둥새 레이드');
  return [...box.querySelectorAll('.d69s')].map(e => e.id).join(',');
})()"""
with sync_playwright() as pw:
    br = pw.chromium.launch(); pg = br.new_page(viewport={'width': 900, 'height': 1400}, device_scale_factor=2)
    errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto('file://' + PAGE); pg.wait_for_timeout(900)
    pg.locator('button', has_text='문 열기').first.click(); pg.wait_for_timeout(1200)
    for _ in range(20):
        sk = pg.locator('.skipall')
        if sk.count() and sk.first.is_visible(): sk.first.click(); pg.wait_for_timeout(150); continue
        mb = pg.locator('#m-btns button')
        if mb.count() and mb.first.is_visible(): mb.last.click(); pg.wait_for_timeout(150); continue
        break
    ids = pg.evaluate("s => window.__EV(s)", JS); pg.wait_for_timeout(600)
    for i in ids.split(','):
        pg.locator('#' + i).screenshot(path=f'{OUT}/{i}.png')
    print(ids, 'errors', errs[:3]); br.close()
