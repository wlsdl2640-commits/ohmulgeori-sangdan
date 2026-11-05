"""전사 기본 스킬 5개 그림 (SVG 100×100). 참고 그림처럼: 움직임(휘두른 자국·충격), 속성 색 빛, 밝은 가운데·어두운 가장자리."""
import math
def P(pts): return ' '.join(f'{x:.1f},{y:.1f}' for x, y in pts)
def star(cx, cy, ro, ri, n, rot=0):
    pts = []
    for i in range(n * 2):
        a = rot + math.pi * i / n; r = ro if i % 2 == 0 else ri
        pts.append((cx + math.cos(a) * r, cy + math.sin(a) * r))
    return P(pts)
def rays(cx, cy, n, r, width, rot=0):
    out = []
    for i in range(n):
        a = rot + 2 * math.pi * i / n
        a1, a2 = a - width / 2, a + width / 2
        out.append(P([(cx, cy), (cx + math.cos(a1) * r, cy + math.sin(a1) * r), (cx + math.cos(a2) * r, cy + math.sin(a2) * r)]))
    return out
def sword(bx, by, tx, ty, w=4.6, guard=12, grip=11, gold=('#fff1a0', '#e0a830', '#8a5a10'), blade=('#ffffff', '#dfe7f4', '#8e9ab0'), ol='#1e0a04'):
    """칼날 밑동(bx,by)에서 끝(tx,ty)으로. 날·코등이·손잡이·자루끝"""
    dx, dy = tx - bx, ty - by; L = math.hypot(dx, dy); ux, uy = dx / L, dy / L; nx, ny = -uy, ux
    tip = 0.8
    px_, py_ = bx + ux * L * tip, by + uy * L * tip
    bl = [(bx + nx * w, by + ny * w), (px_ + nx * w * 0.8, py_ + ny * w * 0.8), (tx, ty), (px_ - nx * w * 0.8, py_ - ny * w * 0.8), (bx - nx * w, by - ny * w)]
    hi = [(bx + nx * w, by + ny * w), (px_ + nx * w * 0.8, py_ + ny * w * 0.8), (tx, ty), (bx + ux * 2, by + uy * 2)]
    cx, cy = bx - ux * 1.6, by - uy * 1.6; t = 2.6
    gd = [(cx + nx * guard + ux * t, cy + ny * guard + uy * t), (cx + nx * guard - ux * t, cy + ny * guard - uy * t),
          (cx - nx * guard - ux * t, cy - ny * guard - uy * t), (cx - nx * guard + ux * t, cy - ny * guard + uy * t)]
    g0x, g0y = cx - ux * t, cy - uy * t; g1x, g1y = cx - ux * (t + grip), cy - uy * (t + grip); gw = 2.6
    gr = [(g0x + nx * gw, g0y + ny * gw), (g1x + nx * gw, g1y + ny * gw), (g1x - nx * gw, g1y - ny * gw), (g0x - nx * gw, g0y - ny * gw)]
    wraps = ''.join(f'<line x1="{g0x - ux * k + nx * gw:.1f}" y1="{g0y - uy * k + ny * gw:.1f}" x2="{g0x - ux * (k + 1.6) - nx * gw:.1f}" y2="{g0y - uy * (k + 1.6) - ny * gw:.1f}" stroke="#3a1e0c" stroke-width="1"/>' for k in (2, 5, 8))
    pmx, pmy = g1x - ux * 2.8, g1y - uy * 2.8
    gid = f'g{int(bx)}{int(by)}'
    return f'''<defs><linearGradient id="bl{gid}" gradientUnits="userSpaceOnUse" x1="{bx - nx * w:.1f}" y1="{by - ny * w:.1f}" x2="{bx + nx * w:.1f}" y2="{by + ny * w:.1f}">
<stop offset="0" stop-color="{blade[0]}"/><stop offset=".48" stop-color="{blade[1]}"/><stop offset=".52" stop-color="{blade[2]}"/><stop offset="1" stop-color="#5a6478"/></linearGradient>
<linearGradient id="gd{gid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="{gold[0]}"/><stop offset=".5" stop-color="{gold[1]}"/><stop offset="1" stop-color="{gold[2]}"/></linearGradient></defs>
<polygon points="{P(bl)}" fill="url(#bl{gid})" stroke="{ol}" stroke-width="1.8" stroke-linejoin="round"/>
<line x1="{bx + ux * 1:.1f}" y1="{by + uy * 1:.1f}" x2="{tx - ux * 6:.1f}" y2="{ty - uy * 6:.1f}" stroke="#ffffff" stroke-width="1" opacity=".9"/>
<polygon points="{P(gr)}" fill="#7a4424" stroke="{ol}" stroke-width="1.6" stroke-linejoin="round"/>{wraps}
<polygon points="{P(gd)}" fill="url(#gd{gid})" stroke="{ol}" stroke-width="1.8" stroke-linejoin="round"/>
<circle cx="{pmx:.1f}" cy="{pmy:.1f}" r="3.4" fill="url(#gd{gid})" stroke="{ol}" stroke-width="1.6"/>
<circle cx="{pmx - 0.9:.1f}" cy="{pmy - 1:.1f}" r="1" fill="#fff8d0"/>'''
HEAD = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">'
GLOW = '<filter id="glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2.4"/></filter><filter id="soft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.1"/></filter>'

# 1. 강타: 위에서 내려친 칼 + 휘두른 자국(초승달) + 맞은 자리 충격
bash = HEAD + f'''<defs>{GLOW}
<radialGradient id="bg" cx=".36" cy=".66" r=".78"><stop offset="0" stop-color="#ffe7a0"/><stop offset=".2" stop-color="#ff9c30"/><stop offset=".55" stop-color="#c4361a"/><stop offset="1" stop-color="#360604"/></radialGradient>
<linearGradient id="sw" gradientUnits="userSpaceOnUse" x1="8" y1="40" x2="34" y2="46"><stop offset="0" stop-color="#ff7a20" stop-opacity="0"/><stop offset=".55" stop-color="#ffc060" stop-opacity=".85"/><stop offset="1" stop-color="#ffffff"/></linearGradient></defs>
<rect width="100" height="100" fill="url(#bg)"/>
<g fill="#3a0806" opacity=".28">{''.join(f'<polygon points="{r}"/>' for r in rays(33, 71, 9, 90, 0.16, 0.2))}</g>
<g fill="#fff3c0" opacity=".22">{''.join(f'<polygon points="{r}"/>' for r in rays(33, 71, 9, 90, 0.1, 0.55))}</g>
<path d="M 64 8 C 26 9, 9 38, 27 76 C 25 50, 35 27, 64 8 Z" fill="url(#sw)" filter="url(#soft)"/>
<path d="M 64 8 C 32 14, 23 40, 29 72" fill="none" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" opacity=".95"/>
<path d="M 54 9 C 28 15, 17 35, 18 56" fill="none" stroke="#fff3c8" stroke-width="1.1" stroke-linecap="round" opacity=".7"/>
<polygon points="{star(32, 71, 16, 4.5, 8, 0.3)}" fill="#ffd860" filter="url(#glow)" opacity=".95"/>
<polygon points="{star(32, 71, 11, 3.2, 8, 0.7)}" fill="#fffbe8"/>
<circle cx="32" cy="71" r="4.2" fill="#ffffff"/>
<g fill="#4a1a0a" stroke="#1e0a04" stroke-width=".8"><rect x="17" y="62" width="4" height="4" transform="rotate(20 19 64)"/><rect x="20" y="80" width="3.4" height="3.4" transform="rotate(40 21 81)"/><rect x="41" y="82" width="3" height="3" transform="rotate(15 42 83)"/></g>
{sword(68, 40, 33, 70)}
</svg>'''

# 2. 도발: 뿔 투구의 붉은 눈 + 퍼지는 고함 물결 + 붉은 빛살
def helm(cx=50, cy=54):
    return f'''<defs><linearGradient id="hm" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e6ecf6"/><stop offset=".45" stop-color="#8e9ab0"/><stop offset="1" stop-color="#2e3648"/></linearGradient>
<linearGradient id="hn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff6dc"/><stop offset="1" stop-color="#a88c5c"/></linearGradient></defs>
<path d="M {cx - 15} {cy - 10} C {cx - 24} {cy - 14}, {cx - 31} {cy - 26}, {cx - 31} {cy - 38} C {cx - 26} {cy - 30}, {cx - 21} {cy - 24}, {cx - 12} {cy - 19} Z" fill="url(#hn)" stroke="#1a0a06" stroke-width="1.8" stroke-linejoin="round"/>
<path d="M {cx + 15} {cy - 10} C {cx + 24} {cy - 14}, {cx + 31} {cy - 26}, {cx + 31} {cy - 38} C {cx + 26} {cy - 30}, {cx + 21} {cy - 24}, {cx + 12} {cy - 19} Z" fill="url(#hn)" stroke="#1a0a06" stroke-width="1.8" stroke-linejoin="round"/>
<path d="M {cx - 18} {cy + 18} L {cx - 19} {cy - 4} C {cx - 19} {cy - 20}, {cx - 10} {cy - 27}, {cx} {cy - 27} C {cx + 10} {cy - 27}, {cx + 19} {cy - 20}, {cx + 19} {cy - 4} L {cx + 18} {cy + 18} L {cx + 7} {cy + 22} L {cx + 4} {cy + 8} L {cx - 4} {cy + 8} L {cx - 7} {cy + 22} Z" fill="url(#hm)" stroke="#1a0a06" stroke-width="2" stroke-linejoin="round"/>
<path d="M {cx - 15} {cy - 6} L {cx + 15} {cy - 6} L {cx + 15} {cy - 1} L {cx + 3} {cy - 1} L {cx + 3} {cy + 10} L {cx - 3} {cy + 10} L {cx - 3} {cy - 1} L {cx - 15} {cy - 1} Z" fill="#14060a" stroke="#1a0a06" stroke-width="1"/>
<ellipse cx="{cx - 8}" cy="{cy - 3.5}" rx="4.5" ry="2.2" fill="#ff3a1a" filter="url(#glow)"/><ellipse cx="{cx + 8}" cy="{cy - 3.5}" rx="4.5" ry="2.2" fill="#ff3a1a" filter="url(#glow)"/>
<ellipse cx="{cx - 8}" cy="{cy - 3.5}" rx="2.6" ry="1.3" fill="#ffe0a0"/><ellipse cx="{cx + 8}" cy="{cy - 3.5}" rx="2.6" ry="1.3" fill="#ffe0a0"/>
<path d="M {cx - 13} {cy - 19} C {cx - 8} {cy - 23}, {cx - 2} {cy - 24}, {cx + 3} {cy - 24}" fill="none" stroke="#ffffff" stroke-width="1.6" stroke-linecap="round" opacity=".85"/>
<circle cx="{cx - 14}" cy="{cy + 12}" r="1.2" fill="#e6ecf6"/><circle cx="{cx + 14}" cy="{cy + 12}" r="1.2" fill="#8e9ab0"/>'''
def taunt_svg(pips=1):
    return HEAD + f'''<defs>{GLOW}
<radialGradient id="bg" cx=".5" cy=".52" r=".7"><stop offset="0" stop-color="#ffb070"/><stop offset=".3" stop-color="#e83a1a"/><stop offset=".7" stop-color="#7a0a0a"/><stop offset="1" stop-color="#1e0204"/></radialGradient></defs>
<rect width="100" height="100" fill="url(#bg)"/>
<g fill="#1a0204" opacity=".45">{''.join(f'<polygon points="{r}"/>' for r in rays(50, 52, 14, 90, 0.12, 0.1))}</g>
<g fill="none" stroke-linecap="round">
<path d="M 22 34 C 14 44, 14 60, 22 70" stroke="#fff0c0" stroke-width="3" opacity=".9"/><path d="M 14 28 C 3 42, 3 62, 14 76" stroke="#ffb060" stroke-width="2.4" opacity=".6"/>
<path d="M 78 34 C 86 44, 86 60, 78 70" stroke="#fff0c0" stroke-width="3" opacity=".9"/><path d="M 86 28 C 97 42, 97 62, 86 76" stroke="#ffb060" stroke-width="2.4" opacity=".6"/></g>
{helm()}
</svg>'''
taunt = taunt_svg()

# 3. 철벽: 큰 쇠 방패 + 파란 빛 결계 + 튕겨 나가는 화살과 불꽃
ironwall = HEAD + f'''<defs>{GLOW}
<radialGradient id="bg" cx=".5" cy=".45" r=".72"><stop offset="0" stop-color="#f0fbff"/><stop offset=".22" stop-color="#7ac8ff"/><stop offset=".6" stop-color="#1f4aa8"/><stop offset="1" stop-color="#050a26"/></radialGradient>
<linearGradient id="sh" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset=".35" stop-color="#c4d0e4"/><stop offset=".7" stop-color="#6a7896"/><stop offset="1" stop-color="#2a3250"/></linearGradient>
<linearGradient id="rim" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8090b0"/><stop offset="1" stop-color="#2a3048"/></linearGradient>
<linearGradient id="au" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff1a0"/><stop offset=".5" stop-color="#e0a830"/><stop offset="1" stop-color="#8a5a10"/></linearGradient></defs>
<rect width="100" height="100" fill="url(#bg)"/>
<g fill="#ffffff" opacity=".35">{''.join(f'<polygon points="{r}"/>' for r in rays(50, 46, 8, 70, 0.14, 0.39))}</g>
<path d="M 50 8 L 84 26 L 84 64 L 50 90 L 16 64 L 16 26 Z" fill="none" stroke="#bfe8ff" stroke-width="2" opacity=".7" filter="url(#soft)"/>
<path d="M 50 14 L 79 29 L 79 61 L 50 84 L 21 61 L 21 29 Z" fill="#9ad8ff" opacity=".12"/>
<path d="M 30 22 L 70 22 C 72 22, 73 23, 73 25 L 73 56 C 73 70, 62 79, 50 86 C 38 79, 27 70, 27 56 L 27 25 C 27 23, 28 22, 30 22 Z" fill="url(#rim)" stroke="#0e1226" stroke-width="2"/>
<path d="M 33 27 L 67 27 L 67 55 C 67 66, 59 73, 50 79 C 41 73, 33 66, 33 55 Z" fill="url(#sh)" stroke="#1a2038" stroke-width="1.2"/>
<path d="M 42 36 L 42 32 L 45 32 L 45 34 L 48 34 L 48 32 L 52 32 L 52 34 L 55 34 L 55 32 L 58 32 L 58 36 L 56 37 L 56 50 L 44 50 L 44 37 Z" fill="url(#au)" stroke="#3a2406" stroke-width="1.2" stroke-linejoin="round"/>
<rect x="48" y="42" width="4" height="8" fill="#3a2406"/>
<g fill="#e8eef8" stroke="#1a2038" stroke-width=".8"><circle cx="31" cy="26" r="1.6"/><circle cx="69" cy="26" r="1.6"/><circle cx="30" cy="50" r="1.6"/><circle cx="70" cy="50" r="1.6"/><circle cx="50" cy="83" r="1.6"/></g>
<path d="M 35 29 L 52 29" stroke="#ffffff" stroke-width="1.4" stroke-linecap="round" opacity=".9"/>
<g transform="rotate(-35 82 18)"><rect x="70" y="17" width="16" height="2" fill="#a87a48" stroke="#2a1206" stroke-width=".6"/><polygon points="86,15 91,18 86,21" fill="#d0d8e4" stroke="#2a1206" stroke-width=".6"/><polygon points="70,15 73,18 70,21 67,18" fill="#e04040"/></g>
<polygon points="{star(76, 30, 7, 1.8, 6, 0.2)}" fill="#ffffff" filter="url(#soft)"/>
<g transform="rotate(200 16 60)"><rect x="6" y="59" width="14" height="2" fill="#a87a48" stroke="#2a1206" stroke-width=".6"/><polygon points="20,57 25,60 20,63" fill="#d0d8e4" stroke="#2a1206" stroke-width=".6"/></g>
<polygon points="{star(25, 56, 6, 1.6, 6, 0.5)}" fill="#ffffff" filter="url(#soft)"/>
</svg>'''

# 4. 휩쓸기: 앞쪽을 가로로 크게 베는 둥근 자국 + 칼
sweep = HEAD + f'''<defs>{GLOW}
<radialGradient id="bg" cx=".5" cy=".55" r=".75"><stop offset="0" stop-color="#fff0b8"/><stop offset=".25" stop-color="#ffa63a"/><stop offset=".62" stop-color="#b8361a"/><stop offset="1" stop-color="#300804"/></radialGradient>
<linearGradient id="ar" gradientUnits="userSpaceOnUse" x1="10" y1="50" x2="90" y2="50"><stop offset="0" stop-color="#ffffff" stop-opacity="0"/><stop offset=".35" stop-color="#ffd080" stop-opacity=".7"/><stop offset=".8" stop-color="#ffffff"/><stop offset="1" stop-color="#ffffff"/></linearGradient></defs>
<rect width="100" height="100" fill="url(#bg)"/>
<g fill="#3a0806" opacity=".22">{''.join(f'<polygon points="{r}"/>' for r in rays(50, 56, 12, 80, 0.13, 0))}</g>
<g transform="rotate(-10 50 58)">
<path d="M 10 56 C 12 32, 88 28, 90 54 C 84 40, 18 40, 10 56 Z" fill="#ffe0a0" opacity=".45" filter="url(#soft)"/>
<path d="M 90 58 C 88 84, 14 86, 8 58 C 18 76, 82 76, 90 58 Z" fill="url(#ar)" filter="url(#soft)"/>
<path d="M 90 58 C 86 80, 16 82, 8 58 C 20 72, 80 72, 90 58 Z" fill="url(#ar)"/>
<path d="M 8 58 C 20 74, 80 74, 90 58" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round"/>
<path d="M 16 52 C 28 62, 72 64, 86 52" fill="none" stroke="#fff3c8" stroke-width="1.2" stroke-linecap="round" opacity=".8"/>
</g>
<g stroke="#ffe8b0" stroke-width="1.4" stroke-linecap="round" opacity=".75"><line x1="10" y1="40" x2="22" y2="38"/><line x1="8" y1="48" x2="18" y2="47"/><line x1="78" y1="36" x2="90" y2="34"/></g>
{sword(64, 60, 18, 66, w=4.2, guard=10, grip=10)}
<polygon points="{star(84, 54, 9, 2.4, 6, 0.1)}" fill="#ffffff" filter="url(#soft)"/>
<polygon points="{star(22, 70, 7, 2, 6, 0.4)}" fill="#fff6d0" filter="url(#soft)"/><polygon points="{star(52, 78, 6, 1.8, 6, 0.7)}" fill="#fff6d0" filter="url(#soft)"/>
</svg>'''

# 5. 광폭화: 두 팔을 치켜든 전사의 검은 실루엣 + 붉은 테두리 빛 + 이글거리는 불길
BODY = "50,90 41,90 42,72 37,62 34,55 28,57 21,56 16,51 15,44 16,36 17,30 17,25 21,22 26,23 28,27 27,33 25,41 27,46 32,46 37,43 42,41 45,40 50,40 55,40 58,41 63,43 68,46 73,46 75,41 73,33 72,27 74,23 79,22 83,25 83,30 84,36 85,44 84,51 79,56 72,57 66,55 63,62 58,72 59,90 50,90"
berserk = HEAD + f'''<defs>{GLOW}
<radialGradient id="bg" cx=".5" cy=".46" r=".72"><stop offset="0" stop-color="#ffd070"/><stop offset=".25" stop-color="#ff5a1a"/><stop offset=".6" stop-color="#9a0a0a"/><stop offset="1" stop-color="#1a0202"/></radialGradient>
<linearGradient id="fl" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#ff3a0a"/><stop offset=".6" stop-color="#ff9a20"/><stop offset="1" stop-color="#fff0a0"/></linearGradient></defs>
<rect width="100" height="100" fill="url(#bg)"/>
<g fill="#1a0202" opacity=".5">{''.join(f'<polygon points="{r}"/>' for r in rays(50, 46, 16, 90, 0.1, 0.05))}</g>
<path d="M 12 92 C 8 70, 8 52, 12 40 C 14 50, 16 52, 18 50 C 10 34, 14 20, 22 12 C 22 22, 26 26, 30 26 C 30 16, 36 8, 44 4 C 42 14, 46 20, 50 22 C 54 20, 58 14, 56 4 C 64 8, 70 16, 70 26 C 74 26, 78 22, 78 12 C 86 20, 90 34, 82 50 C 84 52, 86 50, 88 40 C 92 52, 92 70, 88 92 Z" fill="url(#fl)" opacity=".85" filter="url(#soft)"/>
<g transform="translate(50 58) scale(.82) translate(-50 -56)"><polygon points="{BODY}" fill="none" stroke="#ff8a2a" stroke-width="3.2" stroke-linejoin="round" filter="url(#soft)"/>
<polygon points="{BODY}" fill="#1c0606" stroke="#000000" stroke-width="1" stroke-linejoin="round"/>
<circle cx="50" cy="32" r="8.6" fill="none" stroke="#ff8a2a" stroke-width="3" filter="url(#soft)"/>
<path d="M 41.5 32 C 41 24, 45 22, 50 22 C 55 22, 59 24, 58.5 32 L 61 24 L 57 25 L 59 19 L 54 22 L 53 16 L 50 21 L 47 16 L 46 22 L 41 19 L 43 25 L 39 24 Z" fill="#1c0606"/>
<circle cx="50" cy="32" r="8.6" fill="#1c0606"/>
<path d="M 44 30 L 48.5 32.4 L 47.8 33.6 L 43.6 31.4 Z" fill="#ffffff"/><path d="M 56 30 L 51.5 32.4 L 52.2 33.6 L 56.4 31.4 Z" fill="#ffffff"/>
<path d="M 46.5 36 C 48 35.4, 52 35.4, 53.5 36 C 53.5 38.8, 52 40.4, 50 40.6 C 48 40.4, 46.5 38.8, 46.5 36 Z" fill="#ff4a10"/>
<path d="M 46.8 36 L 53.2 36 L 52.4 37 L 51 36.4 L 50 37.2 L 49 36.4 L 47.6 37 Z" fill="#ffffff"/>
<g stroke="#ff5a1a" stroke-width=".9" opacity=".8" fill="none"><path d="M 40 52 L 43 58 L 41 64"/><path d="M 60 52 L 57 58 L 59 64"/><path d="M 22 44 L 24 50"/><path d="M 78 44 L 76 50"/></g>
</g>
<g fill="#ffd070" opacity=".9"><circle cx="14" cy="30" r="1.3"/><circle cx="86" cy="34" r="1.1"/><circle cx="32" cy="12" r="1"/><circle cx="68" cy="10" r="1.2"/></g>
</svg>'''
ICONS = {'bash': ('강타', 'dmg', bash), 'taunt': ('도발 1', 'taunt', taunt), 'ironwall': ('철벽', 'buff', ironwall), 'sweep': ('휩쓸기', 'dmg', sweep), 'berserk': ('광폭화', 'buff', berserk)}

PIPS = {'taunt': 1}
