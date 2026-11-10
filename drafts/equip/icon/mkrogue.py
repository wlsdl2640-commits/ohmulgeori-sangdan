"""도적 계열 무기 판: 단검(R_dagger) · 암기(R_shuriken) · 트럼프 카드 덱(R_card) · 락핀(R_lockpick)"""
import dg, sk2, cdk3 as cdk, cd, lp
from mktype import type_sheet, section_sheet, FRM, BIG
def dagger():
    frames = []
    for d in dg.FR:
        s, ic = dg.icon(d)
        frames.append((ic.render(), '시안 ' + d['key'], dg.STYLE[d['key']], d['desc']))
    items = []
    for d in dg.G:
        s, ic = dg.icon(d)
        items.append((ic.render(), 'Lv%d · 원형 %s' % (d['lv'], d['st']), d['name'], d['desc']))
    return type_sheet('R_dagger.png', '단검 — 도적 · 암살자 · 그림자 군주 · 쌍검사/검무사(두 자루) · 닌자 · 카게닌자',
        '칼과 같은 규칙: 부품이 모두 칼 가운데 줄 위 · 덧붙임 없음. 옛 D 고리(쿠나이 닮음) → D 휜 날 · E 주먹. 네 레벨 묶음마다 A·B·C 한 번 + 넷째 자리 D·E 번갈아. 오른쪽 위 작은 그림 = 게임 속 크기',
        frames, items, ihead='16자루 (네 레벨 묶음마다 A · B · C 한 번씩 + 넷째 자리 D 휜 날 · E 주먹 번갈아)')
def shuriken():
    fr = [(sk2.icon(d).render(), '원형 ' + d['key'], sk2.STYLE[d['key']], d['desc']) for d in sk2.FR]
    it = [(sk2.icon(d).render(), 'Lv%d · 원형 %s' % (d['lv'], d['st']), d['name'], d['desc']) for d in sk2.G]
    sp = [(sk2.icon(d).render(), '%s 속성 · 특별' % d['el'], d['name'], d['eff'] + '. ' + d['desc']) for d in sk2.SP]
    return section_sheet('R_shuriken.png', '암기 (표창 칸) — 표창 · 쿠나이 · 침 · 차크람 · 속성 특별 암기',
        '침 → 「침 셋」(가는 한 칸 쇠침 셋, 11-10 19:29 고름). 원형 8개를 16칸에 두 번씩. 앞 그림은 거울 대칭(바람개비 꼴 · 위아래좌우 십자 꼴은 안 씀). 오른쪽 위 = 게임 속 크기',
        [('원형 8', fr, FRM, (240, 170, 90)), ('16개 (10레벨마다)', it, BIG, (150, 142, 128)),
         ('특별 암기 — 속성 · 상태이상 (속성 화살처럼 따로 만들거나 몬스터에게서 얻는 것)', sp, BIG, (120, 190, 255))])
def card():
    fr = [(cdk.icon(d).render(), '덱 ' + d['key'], cdk.DECK[d['key']], d['desc']) for d in cdk.FR]
    it = [(cdk.icon(d).render(), 'Lv%d · 덱 %s' % (d['lv'], d['st']), d['name'], '[%s] %s' % (cdk.FACEN[d['face']], d['desc'])) for d in cdk.G]
    old = [d for d in cd.G if d['st'] in ('A', 'B')]
    sk = [(d['fn']()[0].icon(d['fn']()[1]).render(), '예전 %s' % ('한 장' if d['st'] == 'A' else '세 장'), d['name'], '스킬 그림 후보 — ' + d['desc']) for d in old]
    return section_sheet('R_card.png', '트럼프 카드 덱 — 소매치기 · 대도 (부장비: 락핀)',
        '칼처럼 45°로 눕힌 카드 한 벌 · 뒤 카드 두 장이 아래로 비쳐 두께 2칸. 테 · 보석 띠 · 안 그림 모두 카드와 같이 눕는다(그림 위쪽 = 오른쪽 위). 앞면: 무늬 · 화려한 테 · 큰 그림 · 테 + 그림. 오른쪽 위 = 게임 속 크기',
        [('덱 원형 4 (틀)', fr, FRM, (240, 170, 90)),
         ('16벌 (네 레벨 묶음마다 A · B · C · D 덱 한 번씩 · 2차 직업부터 쓰니 Lv50 ~ 200)', it, BIG, (150, 142, 128)),
         ('스킬 그림으로 돌릴 예전 한 장 · 세 장 그림', sk, BIG, (120, 190, 255))])
def lockpick():
    fr = [(lp.icon(d)[1].render(), '시안 ' + d['key'], lp.STYLE[d['key']], d['desc']) for d in lp.FR]
    it = [(lp.icon(d)[1].render(), 'Lv%d · 원형 %s' % (d['lv'], d['st']), d['name'], d['desc']) for d in lp.G]
    return type_sheet('R_lockpick.png', '락핀(자물쇠 따개) — 소매치기 · 대도 부장비',
        '칼과 같은 규칙: 끝이 오른쪽 위 45° · 손잡이 · 머리가 축 위. 칼보다 훨씬 가늘다(쇠침 한 칸). 이름은 제안. 오른쪽 위 작은 그림 = 게임 속 크기',
        fr, it, ihead='16개 (네 레벨 묶음마다 A · B · C · D 한 번씩 · 2차 직업부터 쓰니 Lv50 ~ 200)')
if __name__ == '__main__':
    import sys
    want = sys.argv[1:] or ['dagger', 'shuriken', 'card', 'lockpick']
    for w in want: print(w, globals()[w]())
