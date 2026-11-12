# 탈것 그림 (빌드 65) — 랑기수 늑대 · 용기수 와이번

- 사용자 11-12 17:23 「탈것 모습: 늑대 · 와이번 A~D … 이건 전부 추가하고 가장 첫 시안이 기본이고, 나머지 시안들은 추후 얻는 법 넣을 예정이니 일단 게임 안에 넣어 둬」.
- 시안 결정은 `DECISIONS.md`(11-10 탈것 시안). 받은 참고 그림은 저장소에 넣지 않았다(분위기만 따름).
- 그림: `g/wolf.py` · `g/wyv.py`(옆모습 — 서 있기 둘 · 달리기/날갯짓 넷 · 기수 엉덩이 칸 seat) · `g/front.py`(앞모습 + 기수 앞에 오는 머리 덮개 `_f`) · `g/sleep.py`(자는 모습 둘) → `t/*.json`.
- 게임 데이터: `python3 export_ride.py ../../src/data-ride65.js` → `RIDE65[wolf|wyv][A~D]`. 손으로 고치지 말고 여기서 다시 뽑는다. 게임 쪽 합치기 · 그리기는 `src/pxride65.js`.
- 판(시안 때 모습): `t/s_wolf.png` · `t/s_wyv.png` · `t/s_front_sleep.png`. `t/ride.js`는 시안판 도구(게임 pxride65.js의 처음 꼴).
