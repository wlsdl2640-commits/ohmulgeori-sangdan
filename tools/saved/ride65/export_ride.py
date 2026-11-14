"""탈것 그림 → src/data-ride65.js (빌드 65, 사용자 11-12 17:23 「탈것 모습: 늑대 · 와이번 A~D … 전부 추가하고 가장 첫 시안이 기본」)

python3 export_ride.py <출력 data-ride65.js>

t/wolf.json · t/wyv.json(옆모습: 서 있기 둘 · 달리기/날갯짓 넷) · t/front.json(앞모습 둘 + 기수 앞에 오는 머리 덮개 _f) · t/sleep.json(자는 모습 둘)을
게임 데이터 RIDE65[종류][모습]로 묶는다. 격자는 반 해상도(뭉툭 칸) 그대로 — 게임(pxride65.js)이 pxUp으로 두 배 해서 굽는다.
줄 길이가 장마다 다르면 오른쪽을 '.'로 채워 네모로 (pxBake는 첫 줄 길이를 너비로 본다).
손으로 고치지 말고 g/*.py(그림) → t/*.json → 이 파일로 다시 뽑는다.
"""
import json, sys, pathlib

T = pathlib.Path(__file__).parent / 't'
KINDS = {'wolf': ('wolf', 'frontW', 'sleepW'), 'wyv': ('wyv', 'frontY', 'sleepY')}
LOOKS = 'ABCD'
# 게임 안 설명 (시안판 설명에 남은 「받은 그림」 이야기는 뺀다)
DESC = {('wyv', 'D'): '와이번이 아닌 긴 몸의 하늘뱀 용 · S자로 떠 있다 · 흰 갈기 · 금빛 뿔 · 남빛 등줄기 · 작은 지느러미 날개'}


def rows(g):
    r = [x for x in g.split('\n') if x]
    w = max(len(x) for x in r)
    return [x.ljust(w, '.') for x in r]


# 해룡 (빌드 69, 11-14 13:45 사용자 「다 추가하고」 — 해룡기수(용기수 다음 4차)가 탈 해마 꼴 용 넷): ../ride69/seadragon.json
# (seadragon.py → seadragon_fs.py가 옆 · 앞 · 자는 모습을 한 파일에 둔다)
SEA = T.parent.parent / 'ride69' / 'seadragon.json'


def sea_looks():
    D = json.load(open(SEA)); R = {}
    for L in LOOKS:
        S = D['sea' + L]; F, Z = S['front'], S['sleep']
        look = {'name': S['label'].split(' ', 2)[2], 'desc': S['desc'], 'pal': S['pal'], 'float': S['float'],
                'side': {'ax': S['ax'], 'fr': {f: rows(g) for f, g in S['frames'].items()}, 'seat': S['seat']},
                'front': {'ax': F['ax'], 'fr': {f: rows(F['frames'][f]) for f in ('front0', 'front1')},
                          'over': {f: rows(F['frames'][f + '_f']) for f in ('front0', 'front1')}, 'seat': F['seat']},
                'sleep': {'ax': Z['ax'], 'fr': {f: rows(g) for f, g in Z['frames'].items()}}}
        for f in ('front0', 'front1'):
            assert len(look['front']['over'][f]) == len(look['front']['fr'][f]), ('sea', L, f)
        R[L] = look
    return R


def main(out):
    side = {'wolf': json.load(open(T / 'wolf.json')), 'wyv': json.load(open(T / 'wyv.json'))}
    front, sleep = json.load(open(T / 'front.json')), json.load(open(T / 'sleep.json'))
    R = {}
    for kind, (sk, fk, lk) in KINDS.items():
        R[kind] = {}
        for L in LOOKS:
            S, F, Z = side[kind][sk + L], front[fk + L], sleep[lk + L]
            look = {'name': S['label'].split(' ', 1)[1], 'desc': DESC.get((kind, L), S['desc']), 'pal': S['pal']}
            if S.get('float'): look['float'] = S['float']
            look['side'] = {'ax': S['ax'], 'fr': {f: rows(g) for f, g in S['frames'].items()}, 'seat': S['seat']}
            look['front'] = {'ax': F['ax'], 'fr': {f: rows(F['frames'][f]) for f in ('front0', 'front1')},
                             'over': {f: rows(F['frames'][f + '_f']) for f in ('front0', 'front1')},
                             'seat': {f: F['seat'][f] for f in ('front0', 'front1')}}
            look['sleep'] = {'ax': Z['ax'], 'fr': {f: rows(g) for f, g in Z['frames'].items()}}
            for part, P in (('front', F), ('sleep', Z)):
                if P['pal'] != S['pal']: look[part]['pal'] = P['pal']
            # 앞모습 머리 덮개는 몸과 줄 수가 같아야 닻이 맞는다
            for f in ('front0', 'front1'):
                assert len(look['front']['over'][f]) == len(look['front']['fr'][f]), (kind, L, f)
            R[kind][L] = look
    R['sea'] = sea_looks()
    head = ('/* 탈것 그림 (빌드 65 — tools/saved/ride65/export_ride.py로 뽑는다, 손으로 고치지 말 것)\n'
            '   RIDE65[종류 wolf · wyv · sea(해룡, 빌드 69)][모습 A~D] = { name, desc, pal, float?(와이번: 떠 있는 높이, 뭉툭 칸),\n'
            '     side: { ax, fr: { idle0 · idle1 · run0~3: 반 해상도 줄 }, seat: { 장: [x, y] 기수 엉덩이 칸 } },\n'
            '     front: { ax, fr: { front0 · front1 }, over: { 같은 장: 기수 앞에 오는 머리 · 목 }, seat },\n'
            '     sleep: { ax, fr: { sleep0 · sleep1 } } }\n'
            '   A가 기본 모습 (사용자 11-12 17:23 「가장 첫 시안이 기본, 나머지 시안들은 추후 얻는 법」) */\n')
    js = head + 'const RIDE65 = ' + json.dumps(R, ensure_ascii=False, separators=(',', ':')) + ';\n'
    pathlib.Path(out).write_text(js, encoding='utf-8')
    print(out, len(js))


if __name__ == '__main__':
    main(sys.argv[1])
