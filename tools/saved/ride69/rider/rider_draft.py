"""해룡기수 기수 그림 시안: python3 rider_draft.py <훅 페이지> <출력.png>
(11-14 19:58 사용자 「해룡기수 기수 그림 — 그리자」) 새 투구 넷(반 해상도 → pxUp) + 조개 견갑 · 해초 망토를 페이지에 잠깐 끼워
실제 게임 그리기(pxAdvSprite · pxsAdvSprite · rideComp)로 찍는다 — 게임 데이터는 안 바꾼다.
  A 산호 뿔 투구 (산호 해룡) · B 조개 투구 + 조개 견갑 (진주 해룡) · C 진주 관 + 해초 망토 (해초 해룡) · D 심해 지느러미 투구 (심해 해룡)"""
import json, base64, sys, io
from playwright.sync_api import sync_playwright
from PIL import Image, ImageDraw, ImageFont
PAGE, OUT = sys.argv[1], sys.argv[2]
HEADS = {   # [앞모습 줄, top, x] , [옆모습 줄, top, x] — 글자: N/M/n 쇠(metal) · x 흰 빛 · X 보석(gem) · R/r 깃(feather) · Z/z 조개빛 · G/g 금 · J/j 머리띠(hc)
  'coralhelm': [["R.R..R.R", ".RR..RR.", "..RNNR..", ".NMMMMN.", "NMxMMMMN", "nNNXXNNn", "N......n", "n......n"], 3, 0,
                [".R.R....", "..RR....", "..RNN...", ".NMMMN..", "NMxMMMN.", "nNXNNNN.", "NN......", "nn......"], 3, -1],
  'shellhelm': [["..RZRZ..", ".ZRZRZR.", "RZRZRZRZ", ".NNXXNN.", "NMMxMMMN", "nNNNNNNn", "N......n", "n......n"], 3, 0,   # 가리비: 세로 골(분홍 R · 크림 Z) + 진주
                ["..RZR...", ".ZRZRZ..", "RZRZRZR.", ".NNXNN..", "NMMxMMN.", "nNNNNNN.", "NN......", "nn......"], 3, -1],
  'pearlcrown': [[".X.XX.X.", "GgGXXGgG"], 1, 0,
                 ["..X.X...", ".GgGXG.."], 1, -1],
  'finhelm': [["..NNNN..", ".NMxMMN.", "NMXMMXMN", "nNNNNNNn", "RN....nR", "Rr....rR", ".r....r."], 2, 0,   # 볼 옆 지느러미 · 빛나는 점
              [".NNNN...", "NMxMMN..", "NMXMXMN.", "nNNNNNN.", "RRN.....", "Rrr.....", ".rr....."], 2, -1],
}
EXS = {   # [앞 줄, x, y, under], [옆 줄, x, y, under] (x · y는 원래 해상도 칸)
  'shellpad': [["ZzZ...ZzZ", "ZZz...zZZ", ".z.....z."], -1, -1, 0, ["ZzZ", "ZZz", ".z."], 7, -1, 0],
  'kelpcape': [[".PPPPPPP.", "PPPPPPPPq", "Pq.....Pq", "Pq.....Pq", "P.q...P.q", "q.q...q.q", "q.......q"], -1, 0, 1,
               ["....PPPq", "...PPPqq", "..PPPPq.", ".PqPPqq.", ".PqPq.q.", "P.qP.q..", "q.q..q..", "q...q..."], -7, 0, 1],
}
BASE = {'body': 'scale', 'pants': '#1c3046', 'wv': 'compbow'}
LOOKS = [   # (이름, 탈것 모습, PXL)
  ('A 산호 뿔 투구', 'A', dict(BASE, head='coralhelm', ex=['pauldron', 'cape'], c1='#1f5a7a', c2='#f0a070', metal='#6ab8c8', feather='#f07a5a', gem='#f6e6c8', cape='#123a52')),
  ('B 조개 투구 · 조개 견갑', 'D', dict(BASE, head='shellhelm', ex=['shellpad', 'cape'], c1='#2a6a8a', c2='#f4e4d0', metal='#7ac0d0', feather='#f0a8a0', gem='#f6e6f0', cape='#3a2a5a', pants='#22304a')),
  ('C 진주 관 · 해초 망토', 'B', dict(BASE, head='pearlcrown', ex=['kelpcape'], c1='#1a4a5a', c2='#e8d8a0', gold='#e0c060', gem='#f8f0f8', cape='#2e6a3a', pants='#1a3a3a')),
  ('D 심해 지느러미 투구', 'C', dict(BASE, head='finhelm', ex=['pauldron', 'cape'], c1='#14243e', c2='#3ac8d8', metal='#3a5a8a', feather='#3ac8d8', gem='#8af0ff', cape='#0c1428', pants='#101c30')),
]
INJ = r"""((HEADS, EXS) => {
  for (const [k, [fr, ft, fx, sr, st, sx]] of Object.entries(HEADS)) { PX_HEAD[k] = H65(fr, ft, fx); PXS_HEAD[k] = H65(sr, st, sx); }
  for (const [k, [fr, fx, fy, fu, sr, sx, sy, su]] of Object.entries(EXS)) { PX_EX[k] = E65(fr, fx, fy, fu); PXS_EX[k] = E65(sr, sx, sy, su); }
  return 'ok';
})"""
DRAW = r"""((L, look) => {
  PXL.seadragoon = L; PXC.clear();
  const a = makeAdv({ cls: 'seadragoon', lv: 170, name: '마리나' }); a.ride = { sea: { look, name: '방울', lv: 30 } }; a.wxt = null;
  const W = 150, Hh = 130;
  const cell = (s, lift, sh) => { const c = document.createElement('canvas'); c.width = W; c.height = Hh; const x = c.getContext('2d'); x.imageSmoothingEnabled = false;
    if (sh) { x.fillStyle = 'rgba(0,0,0,0.25)'; x.fillRect(W / 2 - sh, Hh - 9, sh * 2, 2); }
    x.drawImage(s.cv, W / 2 - s.ax, Hh - 10 - s.ay - (lift || 0)); return c.toDataURL(); };
  const out = [];
  out.push(cell(pxAdvSprite(a, 'idle', 0), 0, 8));
  out.push(cell(pxsAdvSprite(a, 'idle', 0), 0, 8));
  { const s = rideComp(a, 'idle', 0, true); out.push(cell(s, s.lift, 18)); }
  { const s = rideComp(a, 'walk', 1, true); out.push(cell(s, s.lift, 18)); }
  { const s = rideComp(a, 'idle', 0, false); out.push(cell(s, 0, 18)); }
  return out;
})"""
with sync_playwright() as pw:
    br = pw.chromium.launch(); pg = br.new_page(viewport={'width': 412, 'height': 880})
    errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto('file://' + PAGE); pg.wait_for_timeout(800)
    pg.locator('button', has_text='상단 문 열기').first.click(); pg.wait_for_timeout(1000)
    print(pg.evaluate("s => window.__EV(s)", f"{INJ}({json.dumps(HEADS)}, {json.dumps(EXS)})"))
    rowsimg = []
    for lab, lk, L in LOOKS:
        urls = pg.evaluate("s => window.__EV(s)", f"{DRAW}({json.dumps(L)}, {json.dumps(lk)})")
        rowsimg.append((lab, [Image.open(io.BytesIO(base64.b64decode(u.split(',')[1]))).convert('RGBA') for u in urls]))
    print('errors', errs[:3]); br.close()
z = 3; cw, ch = 150 * z, 130 * z
def crop(im, pad=2):
    bb = im.getbbox(); return im.crop((bb[0] - pad, bb[1] - pad, bb[2] + pad, bb[3] + pad)) if bb else im
FS = ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc', 26, index=2)
FT = ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc', 30, index=2)
FR = ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc', 20, index=2)
heads = ['앞모습', '옆모습', '해룡을 탐 (서 있기)', '해룡을 탐 (달리기)', '해룡을 탐 (앞)']
sheet = Image.new('RGB', (cw * 5 + 40, (ch + 40) * len(rowsimg) + 120), (40, 44, 56)); d = ImageDraw.Draw(sheet)
d.text((20, 12), '해룡기수 기수 그림 시안 — 실제 게임 그리기 (투구 · 견갑 · 망토만 새로, 몸은 비늘 갑옷)', font=FT, fill=(240, 196, 90))
d.text((20, 52), '지금 게임은 용기수 그림을 바다빛으로 바꾼 것. 탈것은 시안마다 다른 해룡 모습(산호 · 진주 · 해초 · 심해)으로 짝지었다 — 어느 투구든 어느 해룡과도 탄다.', font=FR, fill=(170, 165, 155))
for i, h in enumerate(heads): d.text((20 + i * cw + 10, 86), h, font=FS, fill=(220, 214, 200))
for r, (lab, ims) in enumerate(rowsimg):
    y = 120 + r * (ch + 40)
    d.text((24, y), lab, font=FS, fill=(240, 196, 90))
    for i, im in enumerate(ims):
        if i < 2:
            c = crop(im); k = min(7, (ch - 10) // c.height, (cw - 20) // c.width); big = c.resize((c.width * k, c.height * k), Image.NEAREST)
            sheet.paste(big, (20 + i * cw + (cw - big.width) // 2, y + 30 + ch - big.height), big)
        else:
            big = im.resize((150 * z, 130 * z), Image.NEAREST)
            sheet.paste(big, (20 + i * cw, y + 30), big)
sheet.save(OUT); print(sheet.size)
