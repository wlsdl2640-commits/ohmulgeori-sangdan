"""시안 상자 4 (11-11 17:30 사용자 「필름의 강도를 A랑 B 사이로 해서 넓은 빛 적용해서 보여줘봐」): mkdraft3 위에 RQH 'fsC'
= 필름 결 세기를 A(늘 그대로)와 B(빛 밖 0.35배 ~ 빛 아래 1.25배) 사이 — 빛 밖 0.7배 · 빛이 닿을수록 1.05배까지 — 위에 A의 밝은 넓은 빛을 더한다.
python3 mkdraft4.py <sandbox2 (mkdraft2 · mkdraft3를 한 사본)>"""
import sys, pathlib
SB = pathlib.Path(sys.argv[1]); R = SB / 'src/rarity.js'
s = R.read_text(encoding='utf-8')
old = "    if (mode === 'fsA' || mode === 'fsB') {"
assert s.count(old) == 1
s = s.replace(old, r"""    if (mode === 'fsC') {
      const w = md(x * 2 + y - t * 2, 24) / 24, lum = (c[0] * 0.3 + c[1] * 0.59 + c[2] * 0.11) / 255, lv = 0.12 + 0.5 * lum;
      const hf = pal[Math.floor(w * n) % n], sf = lv > 0.45 ? 0.5 : lv > 0.3 ? (th < 0.5 ? 0.42 : 0.3) : (th < 0.5 ? 0.24 : 0.14);
      const d = Math.abs(x + y + 26 - t * 6.5), k = d < 4 ? 1 : d < 9 ? (th < 0.66 ? 0.7 : 0.45) : d < 15 ? (th < 0.4 ? 0.35 : 0.15) : 0;
      const ss = d < 4 ? 0.45 : d < 9 ? (th < 0.66 ? 0.3 : 0.18) : d < 15 ? (th < 0.4 ? 0.14 : 0.05) : 0;
      let q = rqMix(c, hf, sf * (0.7 + 0.35 * k) * im);   // 필름: A와 B 사이
      if (ss) q = rqMix(q, rqMix(pal[md(((x - y) >> 2) + t, n)], RQ_W, 0.35), ss * im);   // 넓은 빛 (A와 같은 세기)
      P[i] = q; continue;
    }
""" + old)
R.write_text(s, encoding='utf-8'); print('draft4 ok')
