"""채찍 16 · 정글칼 16 판 → P_whip16.png · P_mach16.png"""
from mktype import type_sheet
import wm16, whip2, machete
fw = [(whip2.icon(d).render(), '원형 ' + d['key'], d['name'], d['desc']) for d in whip2.FR]
iw = [(wm16.icon(d).render(), 'Lv%d · 원형 %s' % (d['lv'], d['st']), d['name'], d['desc']) for d in wm16.GW]
print(type_sheet('P_whip16.png', '채찍 — 마부 · 코네스토가 · 캐러밴마스터 (2차부터, Lv50 ~ 200)',
                 '원형 넷 모두(00:49 「채찍은 전부 넣고」) · 네 레벨 묶음마다 한 번씩 · 이름 · 재질 · 빛이 다르다. 이름은 제안. 오른쪽 위 = 게임 속 크기',
                 fw, iw, ihead='16자루 (네 레벨 묶음마다 A · B · C · D 한 번씩) · 2차 직업부터 쓰니 Lv50 ~ 200'))
fm = [(machete.icon(d)[1].render(), '원형 ' + d['key'], d['name'], d['desc']) for d in machete.FR if d['key'] in 'ABC']
im = [(wm16.icon(d).render(), 'Lv%d · 원형 %s' % (d['lv'], d['st']), d['name'], d['desc']) for d in wm16.GM]
print(type_sheet('P_mach16.png', '정글칼 — 정찰가 · 탐험가 (2차부터, Lv50 ~ 200)',
                 '원형 셋(00:49 「쿠크리는 ABC로만」 — D 톱날은 뺌) · 이름 · 재질 · 빛이 다르다. 이름은 제안. 오른쪽 위 = 게임 속 크기',
                 fm, im, ihead='16자루 (네 레벨 묶음마다 A · B · C 한 번씩 + 남는 한 자리는 A → B → C → A 차례로) · Lv50 ~ 200'))
