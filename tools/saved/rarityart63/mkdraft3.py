"""시안 상자 3 (11-11 17:18 사용자 「필름이랑 넓은 빛을 합쳐봐」): mkdraft2 위에 빛 방식 둘을 더한다.
window.RQH = 'fsA'(필름 + 넓은 빛을 더함: 칸 전체 필름 결 위로 밝은 넓은 빛이 지나감) | 'fsB'(넓은 빛이 닿는 곳에서 필름 결이 살아남: 평소엔 옅은 필름, 빛 아래에서 진하게 반짝)
python3 mkdraft3.py <sandbox2 (mkdraft2를 한 사본)>"""
import sys, pathlib
SB = pathlib.Path(sys.argv[1]); R = SB / 'src/rarity.js'
s = R.read_text(encoding='utf-8')
old = "    if (mode === 'wave') {   // 좁은 빛 띠가 칸 전체에 12칸마다, 모두 함께 오른쪽 아래로"
assert s.count(old) == 1
s = s.replace(old, r"""    if (mode === 'fsA' || mode === 'fsB') {
      const w = md(x * 2 + y - t * 2, 24) / 24, lum = (c[0] * 0.3 + c[1] * 0.59 + c[2] * 0.11) / 255, lv = 0.12 + 0.5 * lum;
      const hf = pal[Math.floor(w * n) % n], sf = lv > 0.45 ? 0.5 : lv > 0.3 ? (th < 0.5 ? 0.42 : 0.3) : (th < 0.5 ? 0.24 : 0.14);   // 필름 결
      const d = Math.abs(x + y + 26 - t * 6.5);   // 넓은 빛 덩어리 (칸 대각선을 한 번 지나간다)
      if (mode === 'fsA') {   // 더하기: 필름 결 위에 밝은 넓은 빛
        const ss = d < 4 ? 0.45 : d < 9 ? (th < 0.66 ? 0.3 : 0.18) : d < 15 ? (th < 0.4 ? 0.14 : 0.05) : 0;
        let q = rqMix(c, hf, sf * im);
        if (ss) q = rqMix(q, rqMix(pal[md(((x - y) >> 2) + t, n)], RQ_W, 0.35), ss * im);
        P[i] = q; continue;
      }
      const k = d < 4 ? 1 : d < 9 ? (th < 0.66 ? 0.7 : 0.45) : d < 15 ? (th < 0.4 ? 0.35 : 0.15) : 0.08;   // fsB: 빛이 닿는 만큼 필름이 진해진다
      let q = rqMix(c, hf, Math.min(0.75, sf * (0.35 + 0.9 * k)) * im);
      if (k >= 1) q = rqMix(q, RQ_W, 0.14 * im);
      P[i] = q; continue;
    }
""" + old)
R.write_text(s, encoding='utf-8'); print('draft3 ok')
