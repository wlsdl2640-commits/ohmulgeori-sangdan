import json
PAL = {'k': '#0b0d12', 'y': '#f0b43c', 'l': '#fff2c0', 'd': '#9a6a1c', 'f': '#5fd4c0', 'w': '#c9c3b8', 's': '#f1c9a5', 't': '#4a7ac8', 'b': '#9a6a3c', 'p': '#e8dcb8',
       'Y': '#ffe08a', 'r': '#c0392b', 'R': '#e8705a', 'q': '#7a2018', 'W': '#f4ecd8', 'v': '#a8a08e', 'B': '#c08a54', 'n': '#5a3a20', 'g': '#8a8e98', 'G': '#d0d4dc',
       'h': '#50545e', 'S': '#c8946a', 'T': '#7aa8f0', 'u': '#2a4a88', 'F': '#a8f0e0', 'P': '#fff6dc', 'o': '#c4ac80', 'e': '#5ac84a', 'E': '#2e7a2a', 'm': '#8a5a32'}
I = {
 # 상단: 빨간 지붕 · 줄무늬 차양 · 문 · 금 간판
 'm_house':  ['.....kk.....', '....kRRk....', '...kRrrrk...', '..kRrrrrrk..', '.kRrrrrrrqk.', 'kkkkkkkkkkkk', 'kWrWrWrWrWrk', 'kkkkkkkkkkkk', '.kWWkkkkWvk.', '.kWWkBnkWvk.', '.kWWkBnkWvk.', '.kkkkkkkkkk.'],
 # 시설: 모루 + 망치
 'm_anvil':  ['.......kk...', '......kBnk..', '.....kBnk...', '..kkkkGkk...', '.kGGGGGGGGk.', 'kGGGGGGGGgk.', '.kggggggghk.', '...kkghkk...', '....kghk....', '...kgGghk...', '..kgggggghk.', '..kkkkkkkk..'],
 # 모험가: 투구 쓴 얼굴 + 파란 옷 + 망토 깃
 'm_person': ['....kkkk....', '...kGGGgk...', '..kGGGGggk..', '..kkkkkkkk..', '..kssssSSk..', '..kskskSSk..', '...kssSSk...', '..kkTttTkk..', '.kTTtttttuk.', '.kTttyytuuk.', '.kTttttttuk.', '..kkkkkkkk..'],
 # 지도: 펼친 지도 (접힌 줄 · 길 · 표시)
 'm_map':    ['kkkkkkkkkkkk', 'kPPPPoPPPPok', 'kPeePoPPfPok', 'kPeEPoPfFPok', 'kPPPPofPPPok', 'kPPPfoPPPPok', 'kPPfPoPPrPok', 'kPfPPoPrRrok', 'kPPPPoPPrPok', 'kPPPPoPPPPok', 'kooookooooook'[:12], 'kkkkkkkkkkkk'],
 # 원정대: 비스듬한 검 + 방패
 'm_sword':  ['.........kk.', '........kGk.', '.......kGgk.', '......kGgk..', '.kkk.kGgk...', 'kTTTkGgk....', 'kTtykgk.....', 'kTyytkyk....', 'kTtttkkyk...', '.kTtuk.knk..', '..kuk...kk..', '...k........'],
 # 창고: 쇠 띠 두른 나무 상자 (금 자물쇠)
 'm_box':    ['.kkkkkkkkkk.', 'kBBBBBBBBBnk', 'kBmmmmmmmmnk', 'kggggggggggk', 'khhhhkkhhhhk', 'kBBBkYykBBnk', 'kBmmkydkmmnk', 'kggggkkggggk', 'kBBBBBBBBBnk', 'kBmmmmmmmmnk', 'kmnnnnnnnnnk', '.kkkkkkkkkk.'],
 # 의뢰: 게시판에 꽂힌 쪽지 (압정)
 'm_scroll': ['kkkkkkkkkkkk', 'kBBBBBBBBBBk', 'kBkkkkkBkkkk'[:12], 'kBkPrPkBkPrk'[:12], 'kBkPPPkBkPPk', 'kBkhhPkBkhhk'[:12], 'kBkPPPkBkPPk', 'kBkhPPkBkkkk'[:12], 'kBkkkkkBBBBk', 'kBBBBBBBBBBk', 'kmmmmmmmmmmk', 'kkkkkkkkkkkk'],
}
C = {   # 바로 가기 칩 아이콘 7×7
 'c_money': ['..kkk..', '.kYyyk.', 'kYlyydk', 'kYyyydk', 'kyyyydk', '.kdddk.', '..kkk..'],
 'c_dex':   ['kkkkkk.', 'krRRrkk', 'krPPPkk', 'krhhPkk', 'krPPPkk', 'krrrrkk', 'kkkkkk.'],
 'c_achv':  ['kkkkkkk', 'kYyyydk', '.kyyyk.', '..kyk..', '..kdk..', '.kyydk.', '.kkkkk.'],
 'c_log':   ['...k...', '..kYk..', '.kYyyk.', '.kyyyk.', 'kYyyydk', 'kkkkkkk', '...kk..'],
 'c_set':   ['.k.k.k.', '.kGGGk.', 'kGhhhgk', '.Gh.hg.', 'kGhhhgk', '.kgggk.', '.k.k.k.'],
}
for d in (I, C):
    for k, rows in d.items():
        n = len(rows[0])
        assert all(len(r) == n for r in rows) and len(rows) == n, (k, [len(r) for r in rows])
print(json.dumps({'I': I, 'C': C, 'PAL': PAL}, ensure_ascii=False))
