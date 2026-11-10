"""법사 계열 무기 · 부장비 판"""
import sys
from mktype import type_sheet, section_sheet, FRM, BIG
def std(mod, path, title, sub, unit='자루', ihead=None):
    fr = [(mod.icon(d)[1].render() if isinstance(mod.icon(d), tuple) else mod.icon(d).render(), '시안 ' + d['key'], mod.STYLE[d['key']], d['desc']) for d in mod.FR]
    it = [((mod.icon(d)[1] if isinstance(mod.icon(d), tuple) else mod.icon(d)).render(), 'Lv%d · 원형 %s' % (d['lv'], d['st']), d['name'], d['desc']) for d in mod.G]
    head = ihead or '16%s (네 레벨 묶음마다 A · B · C · D 한 번씩)' % unit
    if mod.G[0]['lv'] == 50: head += ' · 2차 직업부터 쓰니 Lv50 ~ 200'
    return type_sheet(path, title, sub, fr, it, ihead=head)
def staff():
    import stf
    return std(stf, 'M_staff.png', '스태프 — 마법사 · 마도사 · 대마도사',
               '칼과 같은 규칙: 머리가 오른쪽 위 45° · 자루 · 머리 · 자루 끝이 한 축 위 · 축 대칭. 이름은 제안. 오른쪽 위 작은 그림 = 게임 속 크기')
def wand():
    import wnd
    return std(wnd, 'M_wand.png', '완드 — 정령술사 · 정령왕',
               '스태프보다 짧고 가늘다: 자루 끝 구슬 · 감은 손잡이 · 한 칸 대 · 끝 장식이 한 축 위(오른쪽 위 45°). 정령 속성마다 색. 이름은 제안. 오른쪽 위 = 게임 속 크기')
def orb():
    import orb as o
    return std(o, 'M_orb.png', '오브 — 원소술사 · 연금술사',
               '구슬은 방향이 없어 방패처럼 앞모습 · 좌우 대칭. 구슬 속 빛깔 = 속성(불 · 물 · 바람 · 흙 · 번개 · 빙결 · 빛 · 어둠). 이름은 제안. 오른쪽 위 = 게임 속 크기', unit='개')
def necro():
    import nec2
    return std(nec2, 'M_necro.png', '네크로노미콘 — 네크로맨서 · 리치',
               '정면 책: 왼쪽 등(묶음 띠) · 앞표지(테 · 모서리) · 아래 책장 두 줄 · 뒤표지 아랫단 — 겉표지와 종이가 갈려 보인다. 살가죽 · 뼈 · 송곳니 · 피의 마법진, 피는 책장까지 흘러내린다. 이름은 제안. 오른쪽 위 = 게임 속 크기', unit='권')
def scroll():
    import scr
    return std(scr, 'M_scroll.png', '마법 두루마리 (부장비, 마법서 대신) — 마법사 · 마도사 · 대마도사 · 원소술사',
               '무기처럼 사선(오른쪽 위 45°) · 축 대칭(밀랍 봉인만 한쪽). 원형 셋: 말린 · 봉인 · 축 두루마리(펼친 두루마리는 뺌). 주문 두루마리는 띠 · 축 · 밀랍 빛깔로 속성을 보인다. 이름은 제안. 오른쪽 위 = 게임 속 크기',
               unit='개', ihead='16개 (네 레벨 묶음마다 A · C · D 한 번씩 + 남는 한 자리는 셋을 돌려 씀)')
def offer():
    import ofr
    return std(ofr, 'M_offer.png', '공물 (부장비) — 네크로맨서 · 리치',
               '각종 꼴의 공물: 갈래 넷(해골 · 그릇 · 불 · 뼈)을 네 레벨 묶음마다 하나씩 — 물건마다 꼴이 다르다. 앞모습. 이름은 제안. 오른쪽 위 = 게임 속 크기', unit='개')
def spirit():
    import spr
    return std(spr, 'M_spirit.png', '정령 (부장비) — 정령술사 · 정령왕',
               '앞모습 · 떠 있음 · 좌우 대칭(구름꼴 번개만 한쪽). 꼴 넷(불꽃 · 방울 · 날개 · 바위)을 네 레벨 묶음마다 하나씩 + 번개 정령은 구름꼴. 속성마다 빛깔 · 장식이 다르다. 이름은 제안. 오른쪽 위 = 게임 속 크기',
               unit='마리', ihead='16마리 (네 레벨 묶음마다 A · B · C · D 한 번씩 — Lv80 번개 정령만 B 대신 E 구름꼴)')
if __name__ == '__main__':
    for w in sys.argv[1:] or ['staff']: print(w, globals()[w]())
