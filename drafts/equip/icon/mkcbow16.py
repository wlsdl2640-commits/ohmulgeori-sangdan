"""컴파운드 보우 16자루 판 → C_cbow16.png"""
from mktype import type_sheet
import cbow16, cbow5
fr = [(cbow5.icon(d)[0].render(), '원형 ' + d['key'], cbow16.STYLE[d['key']], d['desc']) for d in cbow5.FR]
it = [(cbow16.icon(d).render(), 'Lv%d · 원형 %s' % (d['lv'], d['st']), d['name'], d['desc']) for d in cbow16.G]
print(type_sheet('C_cbow16.png', '컴파운드 보우 — 트래커 · 스토커 (2차부터, Lv50 ~ 200)',
                 '원형 시안 2 넷을 네 레벨 묶음마다 한 번씩 · 자루마다 이름 · 재질 · 캠 무늬 · 덧붙이기 · 빛이 다르다. 화살은 궁수 공통 화살. 이름은 제안. 오른쪽 위 = 게임 속 크기',
                 fr, it, ihead='16자루 (네 레벨 묶음마다 A · B · C · D 한 번씩) · 2차 직업부터 쓰니 Lv50 ~ 200'))
