"""손목 석궁 · 볼트 · 볼트통 16 판 → A_xbow16.png · A_bolt16.png · A_bcase16.png"""
from mktype import type_sheet
import xb16, xbow, bolt, bcase
T = {'xbow': (xbow, 'A_xbow16.png', '손목 석궁 — 트래커 · 스토커 부장비 (2차부터, Lv50 ~ 200)', '16개'),
     'bolt': (bolt, 'A_bolt16.png', '볼트 — 트래커 · 스토커 탄약 (화살 칸, 2차부터, Lv50 ~ 200)', '16묶음'),
     'bcase': (bcase, 'A_bcase16.png', '볼트통 — 트래커 · 스토커 (석궁 쓰는 직업의 화살통 자리 · 허리에 찬다 · Lv50 ~ 200)', '16개')}
for k, (mod, path, title, unit) in T.items():
    fr = [(mod.icon(d)[1].render(), '원형 ' + d['key'], d['name'], d['desc']) for d in mod.FR]
    it = [(xb16.icon(k, d)[1].render(), 'Lv%d · 원형 %s' % (d['lv'], d['st']), d['name'], d['desc']) for d in xb16.G[k]]
    print(path, type_sheet(path, title, '원형 넷(A_frames)을 네 레벨 묶음마다 한 번씩 · 이름 · 재질 · 무늬 · 빛이 다르다. 이름은 제안. 오른쪽 위 = 게임 속 크기',
                           fr, it, ihead='%s (네 레벨 묶음마다 A · B · C · D 한 번씩) · 2차 직업부터 쓰니 Lv50 ~ 200' % unit))
