"""새끼 펫 16 시안 (11-17 22:57 사용자 「다음」 — 11:20 정리의 다음 차례: 새끼 펫 16 · 말 7)
옛 새끼 그림(pxpet.js · pxmon3.js PXPET3 — 10칸 남짓 뭉툭 덩어리)을 다 자란 모습(PXU 새 그림)에 맞춘 반 해상도 손그림으로.
A 꼬마(머리가 크고 다리가 짧은 아기) · B 어린(다 자란 모습을 줄인 꼴). 서 있기 두 장(g · g2): 꼬리 · 귀 · 날개 · 숨쉬기.
색은 다 자란 모습의 MONS(body · dark → C Q c d)와 PXU 팔레트 글자를 그대로 빌린다(base · pal).
python3 pets1.py → ../t/pets1.json"""
import json, os

P = {}

# ───────── 슬라임 (다 자람: 왕관 슬라임 pslime) ─────────
P['slime'] = {'base': 'pslime', 'name': '슬라임 새끼', 'pal': {'G': '#f0c040', 'g': '#b08020', 'X': '#ff5a6a'},
  'A': {'label': 'A 물방울 아기', 'desc': '끝이 뾰족한 물방울 꼴 · 큰 눈 · 작은 분홍 입', 'ax': 5, 'ifr': 2.5, 'g': '''
....Q.....
...QQc....
...QwCc...
..QwCCCc..
.QCCCCCCc.
.CkCCCkCc.
.CCCXCCCc.
..cccccc..
''', 'g2': '''
..........
....QQ....
...QwCCc..
..QwCCCCc.
.QCCCCCCCc
.CkCCCkCCc
.CCCXCCCcc
..ccccccc.
'''},
  'B': {'label': 'B 금화 삼킨 아기', 'desc': '몸속에 삼킨 금화 한 닢이 비친다(킹슬라임처럼)', 'ax': 5, 'ifr': 2.5, 'g': '''
..........
....QQ....
..QQwCCc..
.QwCCCCCc.
.CkCCCkCc.
.CCCCGCCc.
.cCCCGgcc.
..cccccc..
''', 'g2': '''
..........
..........
...QQQCc..
.QwwCCCCCc
.CkCCCkCCc
CCCCCGCCcc
.cCCCGgccc
..ccccccc.
'''}}

# ───────── 늑대 (다 자람: wolf) ─────────
P['wolf'] = {'base': 'wolf', 'name': '새끼 늑대', 'pal': {'K': '#14100e', 'w': '#f4f0e4', 'e': '#f0c040'},
  'A': {'label': 'A 솜털 강아지', 'desc': '둥근 귀 · 큰 머리 · 짧은 다리 · 위로 말린 꼬리를 흔든다', 'ax': 6, 'ifr': 4, 'g': '''
......c..c...
.....cCccCc..
.....CCCCCCc.
.....CCeKCCCc
.c...CCCCCCCK
cCc..QCCCCQQ.
.cCQQCCCCCc..
..cCwwCCCCc..
..cC.cC.cCc..
..cc.cc.cc...
''', 'g2': '''
......c..c...
.....cCccCc..
.....CCCCCCc.
.....CCeKCCCc
.....CCCCCCCK
.c...QCCCCQQ.
cCcQQCCCCCc..
.cCCwwCCCCc..
..cC.cC.cCc..
..cc.cc.cc...
'''},
  'B': {'label': 'B 앉은 강아지', 'desc': '엉덩이를 깔고 앉아 고개를 갸웃 · 밝은 주둥이 · 흰 가슴털 · 꼬리를 흔든다', 'ax': 7, 'ifr': 3, 'g': '''
....c....c..
...cCc..cCc.
...cCCCCCCc.
..cCeKCCeKCc
..CCCCwwCCCc
..cCCwKKwCc.
...cCCwwCc..
.c..CwwwwC..
cCc.CwwwwCc.
.cCCCCCCCCc.
..ccc.cc.cc.
''', 'g2': '''
....c....c..
...cCc..cCc.
...cCCCCCCc.
..cCeKCCeKCc
..CCCCwwCCCc
..cCCwKKwCc.
...cCCwwCc..
....CwwwwC..
.c..CwwwwCc.
cCCCCCCCCCc.
.cccc.cc.cc.
'''}}

# ───────── 거미 (다 자람: spider) ─────────
P['spider'] = {'base': 'spider', 'name': '아기 거미', 'pal': {'L': '#7a6684', 'l': '#43364c', 'C': '#4e3e56', 'c': '#2e2436', 'Q': '#6e5a78', 'd': '#1e1622', 'R': '#d03a3a', 'e': '#ff5a4a', 'w': '#f0ece0', 'K': '#14101a'},
  'A': {'label': 'A 동글 아기 거미', 'desc': '동그란 배에 붉은 점 둘 · 커다란 붉은 눈 · 짧은 다리 여섯이 꼼지락', 'ax': 6, 'ifr': 4, 'g': '''
....QQC......
..QQCCCCc....
.QCCRCCCCcQC.
.CCRCCCCCQCCC
.CCCCCCCcCeCe
..cccccccLCCc
..L.L.L.L.cc.
.L..L.L..L.L.
''', 'g2': '''
....QQC......
..QQCCCCc....
.QCCRCCCCcQC.
.CCRCCCCCQCCC
.CCCCCCCcCeCe
..cccccccLCCc
...L.L.L.L.c.
..L.L..L.L.L.
'''},
  'B': {'label': 'B 앞다리 든 아기 거미', 'desc': '솜털 난 배 · 앞다리 둘을 번쩍 들어 인사 · 붉은 눈 넷', 'ax': 5, 'ifr': 3, 'g': '''
...........L.
..QQQC....L..
.QCQCCC..L.L.
QCRCQCCc.QCL.
QCCRCCCcQCCC.
CCCCCCCccCeCe
.cccccc.cCeCw
..L.L.L.L.cc.
.L.L..L..L.L.
''', 'g2': '''
..........L..
..QQQC...L.L.
.QCQCCC..L..L
QCRCQCCc.QCL.
QCCRCCCcQCCC.
CCCCCCCccCeCe
.cccccc.cCeCw
..L.L.L.L.cc.
.L.L..L..L.L.
'''}}

# ───────── 골렘 (다 자람: 수정 골렘 golem_c) ─────────
P['golem'] = {'base': 'golem_c', 'name': '골렘 조각', 'pal': {'K': '#1e1a22', 'X': '#9af2ff', 'x': '#3aa8c8', 'O': '#b8703a', 'Z': '#7ae6f4', 'z': '#2f98b8', 'w': '#eaffff', 'G': '#f0c850'},
  'A': {'label': 'A 조약돌 꼬마 골렘', 'desc': '둥근 돌 몸 하나에 짧은 팔다리 · 이마에 수정 한 조각 · 빛나는 하늘빛 눈', 'ax': 6, 'ifr': 2, 'g': '''
......Z.....
.....ZzZ....
...QQQQQc...
..QCCCCCCc..
..CKXCCKXc..
.QCCCCCCCCc.
QcCCCOCCCcCc
cc.cCCCCcc.c
...QCc.QCc..
...ccc.ccc..
''', 'g2': '''
......Z.....
.....ZzZ....
...QQQQQc...
..QCCCCCCc..
..CKXCCKXc..
.QCCCCCCCCc.
.QCCCOCCCcc.
QccCCCCCccCc
cc.QCc.QCc.c
...ccc.ccc..
'''},
  'B': {'label': 'B 수정 왕관 꼬마 골렘', 'desc': '머리에 하늘빛 수정이 왕관처럼 돋은 돌 꼬마 · 가슴에 작은 핵 · 다 자라면 수정 골렘', 'ax': 6, 'ifr': 2, 'g': '''
.....Z......
..Z..ZzZ..Z.
.ZzZ.ZzZ.ZzZ
.ZzZZXXZZZzz
..QQQQQQQQc.
.QCKXCCKXCc.
.QCCCCCCCCc.
QcCCCXxCCcCc
cc.cCCCCcc.c
..QCc..QCc..
..ccc..ccc..
''', 'g2': '''
.....Z......
..Z..ZzZ..Z.
.ZzZ.ZzZ.ZzZ
.ZzZZXXZZZzz
..QQQQQQQQc.
.QCKXCCKXCc.
.QCCCCCCCCc.
.QCCCxXCCcc.
QccCCCCCccCc
cc.QCc..QCcc
..ccc..ccc..
'''}}

# ───────── 그리핀 (다 자람: griffon) ─────────
P['griffon'] = {'base': 'griffon', 'name': '아기 그리핀', 'pal': {'K': '#1a140e', 'H': '#f4e8c8', 'h': '#c8b48a', 'Y': '#f0c24a', 'y': '#b88a2a', 'F': '#b07e3e', 'f': '#f4e8c8', 'T': '#5a3a1e', 'e': '#ffd040', 'w': '#ffffff', 'G': '#d0a060', 'D': '#8a5a2a'},
  'A': {'label': 'A 솜털 아기 그리핀', 'desc': '병아리 같은 크림빛 솜털 머리 · 큰 눈 · 작은 노란 부리 · 등에 작은 날개 · 사자 몸에 짧은 다리', 'ax': 6, 'ifr': 3, 'g': '''
.......hHh...
......hHHHH..
.......HHHHH.
...ff.HHKHHHY
..fGGfHHHHHYY
.fGGDDhHHHh..
T.GDDDDHHh...
TcQQQCCCCc...
.cCCCCCCCCc..
..cC.cC.cYc..
..cc.cc.Yc...
''', 'g2': '''
.......hHh...
......hHHHH..
..ff...HHHHH.
.fGGf.HHKHHHY
.fGDGfHHHHHYY
..GDDDhHHHh..
T.GDDDDHHh...
TcQQQCCCCc...
.cCCCCCCCCc..
..cC.cC.cYc..
..cc.cc.Yc...
'''},
  'B': {'label': 'B 날개 편 아기 그리핀', 'desc': '작은 날개를 활짝 펴고 날갯짓 연습 · 머리 깃이 삐죽 · 꼬리 끝 술', 'ax': 6, 'ifr': 4, 'g': '''
.ff.....hH...
fGGf...hHHh..
fGDGf..HHHHH.
.GDDGfHHKHHHY
..GDDDhHHHHYY
...GDDDHHHh..
T..QQQCCCh...
TcQCCCCCCc...
.cCCCCCCCCc..
..cC.cC.cYc..
..cc.cc.Yc...
''', 'g2': '''
.............
.......hH....
......hHHh...
.ff....HHHHH.
fGGGfHHHKHHHY
fGDDGGhHHHHYY
.fGDDDDHHHh..
T..QQQCCCh...
TcQCCCCCCc...
.cCCCCCCCCc..
.cC.cC.cYc...
'''}}

# ───────── 하피 (다 자람: harpy) ─────────
P['harpy'] = {'base': 'harpy', 'name': '하피 병아리', 'pal': {'H': '#4a5a8a', 'h': '#2e3a5e', 'S': '#f1c9a5', 's': '#c89a78', 'e': '#e83a5a', 'K': '#1a1418', 'P': '#9ab8d8', 'p': '#5e7ea0', 'q': '#34506e', 'Y': '#e8b040', 'y': '#a87020', 'w': '#f8f0e8', 'F': '#d8c0a0', 'f': '#a88a6a', 'R': '#c83a4a', 'Q': '#f0dcc0', 'W': '#eef6ff', 'V': '#c8dcf0'},
  'A': {'label': 'A 솜털 병아리 하피', 'desc': '동글한 솜털 몸 · 푸른 머리 술 · 작은 날개 팔을 파닥 · 노란 발', 'ax': 6, 'ifr': 3, 'g': '''
....hHHh....
...hHHHHh...
...hSSSSh...
...SKSSKS...
.P.SSssSS.P.
PPqhFFFFhqPP
.PPFFQQFFPP.
..pFFFFFFp..
...fFFFFf...
....Y..Y....
...YY..YY...
''', 'g2': '''
....hHHh....
...hHHHHh...
P..hSSSSh..P
PP.SKSSKS.PP
qPPSSssSSPPq
.qqhFFFFhqq.
...FFQQFF...
..pFFFFFFp..
...fFFFFf...
....Y..Y....
...YY..YY...
'''},
  'B': {'label': 'B 알 껍데기 쓴 하피', 'desc': '머리에 깨진 알 껍데기를 쓴 채 · 껍데기 아래로 삐죽 나온 푸른 머리 · 작은 날개', 'ax': 6, 'ifr': 3, 'pal': {'O': '#f4ecd8', 'o': '#c8b898'}, 'g': '''
....OOOO....
...OOwOOo...
..OoOOoOoo..
..hO.oh.Oh..
...SKSSKS...
.P.SSssSS.P.
PPqhFFFFhqPP
.PPFFQQFFPP.
..pFFFFFFp..
...fFFFFf...
....Y..Y....
...YY..YY...
''', 'g2': '''
....OOOO....
...OOwOOo...
..OoOOoOoo..
P.hO.oh.Oh.P
PP.SKSSKS.PP
qPPSSssSSPPq
.qqhFFFFhqq.
...FFQQFF...
..pFFFFFFp..
...fFFFFf...
....Y..Y....
...YY..YY...
'''}}

# ───────── 얼음 정령 (다 자람: icesprite) ─────────
P['icesprite'] = {'base': 'icesprite', 'name': '얼음 정령 새끼', 'pal': {'Q': '#eafcff', 'C': '#9ee2ff', 'c': '#58aee6', 'd': '#2e6cb0', 'w': '#ffffff', 'K': '#142038', 'e': '#16305a', 'B': '#d8f8ff', 'b': '#7ad0f8'},
  'A': {'label': 'A 작은 결정 정령', 'desc': '마름모 결정 몸 하나 · 큰 남빛 눈 · 양옆에 떠 있는 작은 조각 둘', 'ax': 5, 'float': 1, 'g': '''
.....Q.....
....QwC....
...QwQCc...
..QQQQCCc..
c.QeCCeCc.c
C.QQQCCCc.C
d..cCCCcd..
....cCcd...
.....Bd....
.....b.....
.
.
''', 'g2': '''
.....Q.....
....QwC....
...QwQCc...
c.QQQQCCc.c
C.QeCCeCc.C
d.QQQCCCc.d
...cCCCcd..
....cCcd...
.....Bd....
.....b.....
.
.
'''},
  'B': {'label': 'B 눈송이 방울 정령', 'desc': '둥근 얼음 방울 몸 · 머리에 결정 뿔 셋 · 아래로 반짝이는 눈가루', 'ax': 5, 'float': 1, 'g': '''
..Q..Q..Q..
..Qw.Q.wC..
...QQwQC...
..QQwQQCc..
.QQeQQeCcc.
.QQQQQCCcc.
.cQQCCCCcd.
..cCCCCcd..
...ccccd...
....b.B....
...B...b...
.
''', 'g2': '''
..Q..Q..Q..
..Qw.Q.wC..
...QQwQC...
..QQwQQCc..
.QQeQQeCcc.
.QQQQQCCcc.
.cQQCCCCcd.
..cCCCCcd..
...ccccd...
...B..b....
.....b..B..
.
'''}}

# ───────── 전갈 (다 자람: scorpion) ─────────
P['scorpion'] = {'base': 'scorpion', 'name': '아기 전갈', 'pal': {'Q': '#e8a060', 'C': '#c0702e', 'c': '#8a4a1e', 'd': '#5e2e12', 'K': '#1e120c', 'e': '#1e120c', 'Y': '#f2c844', 'y': '#a87a1a', 'w': '#ffffff'},
  'A': {'label': 'A 동글 아기 전갈', 'desc': '다 자란 전갈을 동글게 줄인 꼴 · 마디진 꼬리를 등 위로 세워 노란 독침을 앞으로 · 마디 줄 등딱지 · 집게 둘', 'ax': 6, 'ifr': 3, 'g': '''
...QCcQ.......
..Qc..cQ......
.QCc...cY.....
.Ccd....yK....
.QCc..........
..dQc.......Qc
..CCQCQCQCQQCd
..QCcCcCcCewCc
..ccdcdcdcdc..
...c.c.c.c....
''', 'g2': '''
...QCcQ.......
..Qc..cQ......
.QCc....Y.....
.Ccd....yY....
.QCc.....K....
..dQc.......Qc
..CCQCQCQCQQCd
..QCcCcCcCewCc
..ccdcdcdcdc..
....c.c.c.c...
'''},
  'B': {'label': 'B 집게 든 아기 전갈', 'desc': '집게 둘을 번쩍 치켜든 아기 전갈 · 마디진 꼬리 끝 독침이 반짝', 'ax': 6, 'ifr': 3, 'g': '''
...QCcQ.....Qc
..Qc..cQ...QCd
.QCc...cY..QC.
.Ccd....yK.QC.
.QCc.......QC.
..dQc.....QCc.
..CCQCQCQCQCd.
..QCcCcCcCewc.
..ccdcdcdcdc..
...c.c.c.c....
''', 'g2': '''
...QCcQ....Qc.
..Qc..cQ..QCd.
.QCc....Y.QC..
.Ccd....yYQC..
.QCc.....KQC..
..dQc.....QCc.
..CCQCQCQCQCd.
..QCcCcCcCewc.
..ccdcdcdcdc..
....c.c.c.c...
'''}}

# ───────── 하수도 생쥐 (다 자람: psewerrat) ─────────
P['sewerrat'] = {'base': 'psewerrat', 'name': '하수도 생쥐', 'pal': {'Q': '#8a8278', 'C': '#5e5850', 'c': '#3e3a34', 'S': '#c88a84', 's': '#946058', 'K': '#ff3030', 'w': '#f4ecd0', 'k': '#1a1614'},
  'A': {'label': 'A 동글 아기 생쥐', 'desc': '분홍 속귀가 큰 동그란 귀 둘 · 콩알 같은 몸 · 가는 분홍 꼬리를 살랑', 'ax': 6, 'ifr': 3, 'g': '''
......QQ.QQ.
.....QSScSSc
.....QCCCCCc
.....CCkwCCCS
.s..QCCCCCCs.
s.QQCCCCCCc..
.sCCCCCCCc...
...cS.cS.S...
''', 'g2': '''
......QQ.QQ.
.....QSScSSc
.....QCCCCCc
.....CCkwCCCS
....QCCCCCCs.
..QQCCCCCCc..
ssCCCCCCCc...
...cS.cS.S...
'''},
  'B': {'label': 'B 빵 부스러기 든 생쥐', 'desc': '뒷다리로 서서 앞발로 노란 빵 부스러기를 꼭 쥔 아기 생쥐', 'ax': 6, 'ifr': 2.5, 'pal': {'Y': '#e8c060', 'y': '#a8803a'}, 'g': '''
....QQ..QQ..
...QSSccSSc.
...QCCCCCCc.
...CCkwCkwCc
...cCCCSSCC.
....cCYYyCc.
....QCYyyCc.
s...CCCCCCc.
.s.QCCCCCCc.
..sCCCCCCc..
...cS.cS....
''', 'g2': '''
....QQ..QQ..
...QSSccSSc.
...QCCCCCCc.
...CCkwCkwCc
...cCCCSSCC.
....cCYYyCc.
....QCYyyCc.
....CCCCCCc.
.s.QCCCCCCc.
s.sCCCCCCc..
...cS.cS....
'''}}

# ───────── 켈피 (다 자람: kelpie) ─────────
P['kelpie'] = {'base': 'kelpie', 'name': '켈피 망아지', 'pal': {'M': '#c8ccd4', 'N': '#8a8e98', 'x': '#f4f6fa', 'w': '#ffffff', 'e': '#50c8e0', 'Q': '#ffffff', 'C': '#f0f2f4', 'c': '#a8b4c0', 'K': '#405060', 'S': '#c8d0d8', 's': '#a8b4c0', 'k': '#505860', 'V': '#4a9a3a', 'v': '#2a6a24', 'B': '#80c8f0'},
  'A': {'label': 'A 켈프 갈기 망아지', 'desc': '다리가 긴 흰 망아지 · 목덜미에 짧은 켈프 갈기 · 켈프 꼬리 · 물빛 눈', 'ax': 6, 'ifr': 2.5, 'g': '''
.........k.k..
........VCCQ..
.......VVCCCQ.
.......VCCeCCQ
.......VCCCCCCs
......VVCCc.ss.
......VCCC.....
..QQQQCCCC.....
VQCCCCCCCCc....
vVcCCCCCCCc....
v..cCc..cCc....
...C.....C.....
...C.....C.....
...k.....k.....
''', 'g2': '''
.........k.k..
........VCCQ..
.......VVCCCQ.
.......VCCeCCQ
.......VCCCCCCs
......VVCCc.ss.
......VCCC.....
..QQQQCCCC.....
.QCCCCCCCCc....
VVcCCCCCCCc....
vv.cCc..cCc....
v..C.....C.....
...C.....C.....
...k.....k.....
'''},
  'B': {'label': 'B 물방울 켈피 망아지', 'desc': '켈프 갈기 끝과 꼬리에 맺힌 물방울 · 몸 아래쪽이 물결처럼 푸르스름 · 짧은 다리', 'ax': 6, 'ifr': 2.5, 'g': '''
.........k.k..
........VCCQ..
.......VVCCCQ.
......BVCCeCCQ
.......VCCCCCCs
......VVCCc.ss.
.....BVCCC.....
..QQQQCCCC.....
VQCCCCCCCCc....
vVBCCBCCBCc....
v.BcBc.BcBc....
B..B.....B.....
...k.....k.....
''', 'g2': '''
.........k.k..
........VCCQ..
.......VVCCCQ.
.......VCCeCCQ
......BVCCCCCCs
......VVCCc.ss.
......VCCC.....
.....BQQCC.....
.QQQQCCCCCc....
VVBCCBCCBCc....
vv.cBc.BcBc....
v..B.....B.....
B..k.....k.....
'''}}

# ───────── 임프 (다 자람: imp) ─────────
P['imp'] = {'base': 'imp', 'name': '임프 새끼', 'pal': {'H': '#6a161c', 'L': '#8e262c', 'h': '#3a0a10', 'm': '#140406', 'K': '#140406', 'e': '#ffc020', 'w': '#ffffff', 'Z': '#2c2a32', 'z': '#9a96a2', 'k': '#2a0c0c', 'O': '#ffe27a', 'o': '#ff7a20', 'x': '#fff6c0', 'V': '#3a2a22', 'v': '#1e1410', 'C': '#c42a26', 'c': '#7e1418'},
  'A': {'label': 'A 두건 쓴 꼬마 임프', 'desc': '작은 뿔 둘이 솟은 붉은 두건 · 어둠 속 노란 눈 둘 · 뾰족 이 · 짧은 망토 자락', 'ax': 5, 'ifr': 2, 'g': '''
..z.....z..
..zZ...Zz..
...ZHHHZ...
..HHLLHHH..
.HLHmmmmHH.
.HHmemmemH.
.HHmmwwmmH.
.HHHmmmmHHh
HLHHHHHHHHh
HLHHHHHHHhh
.hHHhHHhHh.
..kk...kk..
''', 'g2': '''
..z.....z..
..zZ...Zz..
...ZHHHZ...
..HHLLHHH..
.HLHmmmmHH.
.HHmmmmmmH.
.HHmemmemH.
.HHHmwwmHHh
HLHHHHHHHHh
HLHHHHHHHhh
.hHHhHHhHh.
..kk...kk..
'''},
  'B': {'label': 'B 불씨 든 꼬마 임프', 'desc': '두건 쓴 꼬마 임프가 손바닥에 작은 불씨를 띄운다 · 갈래 꼬리', 'ax': 5, 'ifr': 3, 'g': '''
..z.....z...
..zZ...Zz...
...ZHHHZ.....
..HHLLHHH.o..
.HLHmmmmHHoOo
.HHmemmemHOxO
.HHmmwwmmHoOo
.HHHmmmmHHCc.
HLHHHHHHHHc..
HLHHHHHHHhh..
.hHHhHHhHh.c.
..kk...kk.cC.
''', 'g2': '''
..z.....z...
..zZ...Zz...
...ZHHHZ..o..
..HHLLHHH.Oo.
.HLHmmmmHoxOo
.HHmemmemHOOo
.HHmmwwmmH.o.
.HHHmmmmHHCc.
HLHHHHHHHHc..
HLHHHHHHHhh..
.hHHhHHhHh..c
..kk...kk..cC
'''}}

# ───────── 흡혈 박쥐 (다 자람: vbat) ─────────
P['vbat'] = {'base': 'vbat', 'name': '아기 박쥐', 'pal': {'C': '#5a3e4a', 'Q': '#7e5a68', 'c': '#3a2430', 'A': '#5a3e4a', 'a': '#3a2430', 'P': '#a02a40', 'q': '#62162a', 'R': '#5a1424', 'r': '#3e0c18', 'F': '#2e1820', 'f': '#2e1820', 'S': '#e07080', 'e': '#ff3a30', 'w': '#ffffff', 'm': '#1a0a10', 'K': '#160a10'},
  'A': {'label': 'A 동글 아기 박쥐', 'desc': '솜털 공 같은 몸 · 분홍 속귀 큰 귀 · 작은 송곳니 둘 · 붉은 날개를 파닥', 'ax': 6, 'float': 1, 'ifr': 4, 'g': '''
...A.....A...
...AA...AA...
...ASQCQSA...
..AQQCCCCCA..
P.CeCCCCCeC.P
PPCCCwCwCCCPP
PqPCCCCCCCPqP
q.qPcCCCcPq.q
....cccc.....
....K..K.....
.
.
''', 'g2': '''
P..A.....A..P
Pq.AA...AA.qP
qPPASQCQSAPPq
.qPQQCCCCCPq.
..CeCCCCCeC..
..CCCwCwCCC..
...CCCCCCC...
....cCCCc....
....cccc.....
....K..K.....
.
.
'''},
  'B': {'label': 'B 날개 망토 아기 박쥐', 'desc': '붉은 날개로 몸을 망토처럼 감싸고 얼굴만 빼꼼 · 큰 귀 · 송곳니', 'ax': 6, 'float': 1, 'ifr': 2, 'g': '''
...A.....A...
...AA...AA...
...ASQCQSA...
..AQQCCCCCA..
..CeCCCCCeC..
..PCCwCwCCP..
.PPPCCCCCPPq.
.PPPPPPPPPqq.
.qPPPPPPPPqq.
.qqPPqPPqPqq.
..q.q.q.q.q..
.
''', 'g2': '''
...A.....A...
...AA...AA...
...ASQCQSA...
..AQQCCCCCA..
..CCCCCCCCC..
..PeCwCweCP..
.PPPCCCCCPPq.
.PPPPPPPPPqq.
.qPPPPPPPPqq.
.qqPPqPPqPqq.
..q.q.q.q.q..
.
'''}}

# ───────── 산양 (다 자람: 아이벡스 alpgoat) ─────────
P['goat'] = {'base': 'alpgoat', 'name': '아기 산양', 'pal': {'Q': '#fbf4e6', 'C': '#e2d4ba', 'c': '#b49e7e', 'd': '#7e6a52', 'K': '#2a2420', 'e': '#2a1e1a', 'n': '#4a3a30', 'w': '#ffffff', 'H': '#a08c68', 'h': '#5e4e38'},
  'A': {'label': 'A 뿔 돋은 아기 산양', 'desc': '이마에 짧은 뿔이 막 돋은 크림빛 아기 산양 · 옆으로 뻗은 귀 · 긴 주둥이 · 짧은 꼬리를 쫑긋', 'ax': 6, 'ifr': 3, 'g': '''
..........h...
.........hH...
........cCCQ..
.......QcCeCQ.
.........CCCCc
.Q.......cCCdn
.QcQQQQQCCCc..
..QQQCCCCCcd..
..CCCCCCCccd..
..cC.cC.cC.cC.
..cC.cC.cC.cC.
..KK.KK.KK.KK.
''', 'g2': '''
..........h...
.........hH...
........cCCQ..
.......QcCeCQ.
.........CCCCc
.........cCCdn
QQcQQQQQCCCc..
.QQQQCCCCCcd..
..CCCCCCCccd..
..cC.cC.cC.cC.
..cC.cC.cC.cC.
..KK.KK.KK.KK.
'''},
  'B': {'label': 'B 수염 난 아기 산양', 'desc': '뒤로 휘기 시작한 작은 마디 뿔 · 턱 밑 흰 수염 한 가닥 · 바위 위에 선 듯 네 발을 모음', 'ax': 6, 'ifr': 2.5, 'g': '''
.......hHh....
......h...h...
........cCCQ..
.......QcCeCQ.
.........CCCCc
.Q.......cCCdn
.QcQQQQQCCCcw.
..QQQCCCCCcdw.
..CCCCCCCccd..
...cCcC.cCcC..
...cCcC.cCcC..
...KKKK.KKKK..
''', 'g2': '''
.......hHh....
......h...h...
........cCCQ..
.......QcCeCQ.
.........CCCCc
.........cCCdn
QQcQQQQQCCCcw.
.QQQQCCCCCcd.w
..CCCCCCCccd..
...cCcC.cCcC..
...cCcC.cCcC..
...KKKK.KKKK..
'''}}

# ───────── 와이번 (다 자람: wyvern) ─────────
P['wyvern'] = {'base': 'wyvern', 'name': '아기 와이번', 'pal': {'K': '#101a12', 'P': '#9ac878', 'p': '#5a8a4a', 'S': '#e0d8a8', 's': '#b0a878', 'Z': '#e8e2d0', 'z': '#a8a290', 'e': '#ffd040', 'w': '#f8f4e8', 'R': '#c84a3a'},
  'A': {'label': 'A 통통 아기 와이번', 'desc': '머리가 큰 통통한 초록 아기 용 · 등에 작은 날개 · 뿔 두 개가 콩알만큼 · 크림빛 배', 'ax': 6, 'ifr': 3, 'g': '''
........Z.Z..
.......cCCCc.
...PP..CCeKCC
..PpPPcCCCCCK
.PpPPCCCCCwww
....cCCCCCc..
.cc.CSSSSCc..
cC.CCSSSCCc..
c..cCc.cCc...
...KKc.KKc...
''', 'g2': '''
........Z.Z..
..PP...cCCCc.
.PpPP..CCeKCC
PpPPPPcCCCCCK
....PCCCCCwww
....cCCCCCc..
.cc.CSSSSCc..
cC.CCSSSCCc..
c..cCc.cCc...
...KKc.KKc...
'''},
  'B': {'label': 'B 날갯짓하는 아기 와이번', 'desc': '날개를 크게 펴고 퍼덕여 살짝 떠오르는 아기 와이번 · 뾰족 꼬리', 'ax': 6, 'ifr': 4, 'g': '''
.cP.........
cPpP...Z.Z..
cPpPP.cCCCc.
.cPpPPCCeKCC
..cPpPCCCCCK
...cPCCCCwww
....CSSSCc..
.ccCCSSSCc..
cC.cCc.cCc..
c..KK..KK...
''', 'g2': '''
............
.......Z.Z..
......cCCCc.
.....cCCeKCC
cPPPPPCCCCCK
cPpPpPPCCwww
.cPPpPSSCc..
.ccCCSSSCc..
cC.cCc.cCc..
c..KK..KK...
'''}}

# ───────── 적토마 (다 자람: redhare) ─────────
P['redhare'] = {'base': 'redhare', 'name': '적토마 망아지', 'pal': {'C': '#c83a28', 'Q': '#ee6a4a', 'c': '#8a2016', 'K': '#3a1a12', 'R': '#e8401a', 'O': '#ffa030', 'Y': '#ffe070', 'e': '#ffd040', 'k': '#2a0a06', 'w': '#ffffff'},
  'A': {'label': 'A 불씨 갈기 망아지', 'desc': '다리가 긴 붉은 망아지 · 목덜미에 작은 불씨 갈기 · 꼬리 끝에 불꽃', 'ax': 6, 'ifr': 3, 'g': '''
.........K.K..
........OCCQ..
.......ROCCCQ.
.......OCCeCCQ
......R.CCCCCCc
.......OCCc.cc.
......ROCC.....
..QQQQCCCC.....
OQCCCCCCCCc....
RYcCCCCCCCc....
R..cCc..cCc....
...C.....C.....
...C.....C.....
...k.....k.....
''', 'g2': '''
........R.....
........OCCQ..
.......YOCCCQ.
......R.CCeCCQ
.......OCCCCCCc
......ROCCc.cc.
.......OCC.....
..QQQQCCCC.....
.QCCCCCCCCc....
OYcCCCCCCCc....
RR.cCc..cCc....
R..C.....C.....
...C.....C.....
...k.....k.....
'''},
  'B': {'label': 'B 불꽃 망아지', 'desc': '갈기와 꼬리가 길게 타오르는 망아지 · 발굽에 불티', 'ax': 6, 'ifr': 3, 'g': '''
........R.K.K.
.......R.OCCQ.
......R.ROCCCQ
.......ROYCeCCQ
......R.OCCCCCCc
.......ROCCc.cc.
......R.OCC.....
..QQQQCCCCC.....
QQCCCCCCCCCc....
RYcCCCCCCCCc....
RRO.cCc..cCc....
.R..C.....C.....
....C.....C.....
....O.....O.....
''', 'g2': '''
.......R..K.K.
......R..OCCQ.
.......RROCCCQ
......R.OYCeCCQ
.......ROCCCCCCc
......R.OCCc.cc.
.......ROCC.....
..QQQQCCCCC.....
.QCCCCCCCCCc....
RYcCCCCCCCCc....
ROR.cCc..cCc....
R...C.....C.....
....C.....C.....
....Y.....Y.....
'''}}

# ───────── 페가수스 (다 자람: pegasus) ─────────
P['pegasus'] = {'base': 'pegasus', 'name': '페가수스 망아지', 'pal': {'C': '#f4f6fa', 'Q': '#ffffff', 'c': '#b4bcd0', 'K': '#8a94b0', 'W': '#ffffff', 'w': '#ccd6ea', 'V': '#a8b6d4', 'L': '#ffffff', 'M': '#a8d4ff', 'm': '#6aa0e0', 'e': '#1a2240', 'k': '#3a4258'},
  'A': {'label': 'A 작은 날개 망아지', 'desc': '다리가 긴 흰 망아지 · 등에 작은 깃 날개 · 하늘빛 갈기 술 · 하늘빛 꼬리', 'ax': 6, 'ifr': 3, 'g': '''
.........k.k..
........MCCQ..
...WW..MMCCCQ.
..WVWW.MCCeCCQ
..wVVWWMCCCCCCc
...wwVWMCCc.cc.
......MCCC.....
..QQQQCCCC.....
MQCCCCCCCCc....
mMcCCCCCCCc....
m..cCc..cCc....
...C.....C.....
...C.....C.....
...k.....k.....
''', 'g2': '''
.........k.k..
.WW.....MCCQ..
WVWW...MMCCCQ.
wVVWW..MCCeCCQ
.wVVWW.MCCCCCCc
..wwVWWMCCc.cc.
......MCCC.....
..QQQQCCCC.....
.QCCCCCCCCc....
MMcCCCCCCCc....
mm.cCc..cCc....
m..C.....C.....
...C.....C.....
...k.....k.....
'''},
  'B': {'label': 'B 날개 접은 망아지', 'desc': '깃 날개를 옆구리에 접고 다소곳이 선 망아지 · 앞머리 술이 이마에', 'ax': 6, 'ifr': 2, 'g': '''
.........k.k..
........MmCQ..
.......MMMCCQ.
.......MCCeCCQ
.......MCCCCCCc
......MMCCc.cc.
......MCCC.....
..QQQQCCCC.....
MQCWWWWVCCc....
mMcwVVVwCCc....
m..cwwwcCCc....
...C.....C.....
...C.....C.....
...k.....k.....
''', 'g2': '''
.........k.k..
........MmCQ..
.......MMMCCQ.
.......MCCeCCQ
.......MCCCCCCc
......MMCCc.cc.
......MCCC.....
..QQQQCCCC.....
.QCWWWWVCCc....
MMcwVVVwCCc....
mm.cwwwcCCc....
m..C.....C.....
...C.....C.....
...k.....k.....
'''}}

out = {'pets': P}
dst = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 't', 'pets1.json')
json.dump(out, open(dst, 'w'), ensure_ascii=False, indent=0); print('ok', dst, len(P))
