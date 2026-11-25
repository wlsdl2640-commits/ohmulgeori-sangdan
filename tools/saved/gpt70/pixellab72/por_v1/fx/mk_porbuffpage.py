# 짐꾼 버프 시안 판 — 1MB 안으로 두 장: ../page_porfx_2_buff.html(함성 · 물통) · ../page_porfx_3_buff.html(짐 덜어 주기)
import base64, os
CSS = "body{margin:0;background:#1c1f26;color:#e8e6e0;font-family:system-ui,sans-serif}main{max-width:1240px;margin:0 auto;padding:16px}h3{margin:18px 0 6px;color:#f0c878}p{opacity:.88;margin:4px 0}img{image-rendering:pixelated;border-radius:6px;width:600px}"
D = [('shout', '짐꾼의 함성 — 파티 방어력', '청동빛: 석궁을 치켜들고 외치면 소리 물결이 앞뒤로 · 발밑 고리 → 짐꾼 몸이 청동빛으로 감싸이고 앞의 동료도 → 머리 위 함성 아이콘'),
     ('canteen', '물통 돌리기 — 파티 공격 속도 · 피로 풀기', '물빛: 물통을 내밀면 물방울이 튀고 → 짐꾼 · 동료가 물빛으로 감싸이며 다리 쪽 바람 줄(빨라짐) · 작은 물방울이 오름 → 머리 위 물통 아이콘'),
     ('lighten', '짐 덜어 주기 — 파티 재사용 단축', '연둣빛: 동료의 짐을 받아 드는 동작에 → 몸이 연둣빛으로 감싸이고 깃털 조각이 흩날림(가벼워짐) → 동료도 → 머리 위 아이콘')]
HEAD = "<p>버프는 「몸을 감싸는 빛 + 머리 위 아이콘」 규칙대로(전사 돌격 함성 v5와 같은 길). 짐꾼은 늘 맨 뒤라 동료(전사)가 앞(오른쪽)에 섭니다. 아이콘은 게임 스킬 그림(16×20)을 2배로.</p>"
for name, ks in (('../page_porfx_2_buff.html', D[:2]), ('../page_porfx_3_buff.html', D[2:])):
    o = []
    for k, t, d in ks:
        b = base64.b64encode(open(f'buff/{k}_scene.gif', 'rb').read()).decode(); o.append(f"<h3>{t}</h3><p>{d}</p><img src='data:image/gif;base64,{b}'>")
    open(name, 'w', encoding='utf-8').write(f"<!doctype html><meta charset=utf-8><title>짐꾼 버프 효과 시안</title><style>{CSS}</style><main><h2>짐꾼 1차 버프 효과 — 시안</h2>{HEAD}{''.join(o)}</main>"); print(name, os.path.getsize(name))
