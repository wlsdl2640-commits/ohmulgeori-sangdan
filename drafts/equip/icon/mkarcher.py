"""궁수 계열 원형 시안 판 (11-10 22:3x): 단궁 · 복합궁 · 장궁 · 대궁 · 손목 석궁 · 볼트 · 볼트통"""
import sys
from mktype import section_sheet, FRM
import bowf, xbow, bolt, bcase
WHO = {'short': '단궁 — 궁수 · 정찰가 · 탐험가 (1차부터, Lv1 ~ 150)', 'comp': '복합궁 — 레인저 (2차부터, Lv50 ~ 200)',
       'long': '장궁 — 저격수 · 신궁 (Lv50 ~ 200)', 'great': '대궁 — 사냥꾼 · 괴수사냥꾼 (Lv50 ~ 200)'}
def frames():
    secs = []
    for kind in ('short', 'comp', 'long', 'great'):
        it = []
        for d in bowf.FR:
            if d['kind'] != kind: continue
            s, ic = bowf.icon(d); it.append((ic.render(), '원형 ' + d['key'], d['name'], d['desc']))
        secs.append((WHO[kind], it, FRM, (240, 170, 90)))
    for mod, title in ((xbow, '손목 석궁 — 괴물사냥꾼 · 드래곤 슬레이어 (Lv50 ~ 200) · 손목에 찬다'),
                       (bolt, '볼트 (석궁 탄약 · 화살 칸) — 석궁 쓰는 직업'),
                       (bcase, '볼트통 (석궁 쓰는 직업의 화살통 자리) — 허리에 찬다(초소형 가방 자리)')):
        it = []
        for d in mod.FR:
            s, ic = mod.icon(d); it.append((ic.render(), '원형 ' + d['key'], d['name'], d['desc']))
        secs.append((title, it, FRM, (240, 170, 90)))
    return section_sheet('A_frames.png', '궁수 계열 무기 · 탄약 · 부장비 — 원형 시안 2 (단궁 짧게 · 대궁 크고 길게 · 볼트통 안으로)',
        '활: 시위(가는 흰 줄)는 축 위, 활대는 왼쪽 위로 휜다 · 위아래 팔 대칭. 석궁 · 볼트는 칼처럼 머리가 오른쪽 위. 볼트통은 앞모습. 창(용기병)은 나중에 전사 쪽으로 — 여기선 뺐다. 오른쪽 위 = 게임 속 크기', secs)
if __name__ == '__main__':
    print(frames())
