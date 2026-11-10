# 장비 개편 시안 원본 (빌드 62 뒤, 2026-11-10~)

세션 작업 폴더 `scratchpad/war/`를 그대로 옮긴 것. 결정 기록은 `DECISIONS.md`.

- `icon/` 장비 그림(20×20) 시안 코드와 판
  - 전사: `g16.py` 글라디우스 · `ls.py` 장검 · `gs.py` 대검 · `rs4.py` 룬소드(보류) · 방패 `rnd.py` · `bk.py` · `cs.py` · `et.py`(공통 `sh.py`)
  - 도적: `dg.py` 단검 · `sk2.py` 암기 · `cdk3.py` 트럼프 카드 · `lp.py` 락핀 — 판 `mkrogue.py`
  - 법사: `stf.py` 스태프 · `wnd.py` 완드 · `orb.py` 오브 · `nec2.py` 네크로노미콘 · `scr.py` 두루마리 · `ofr.py` 공물 · `spr.py` 정령 — 판 `mkmage.py`
  - 2차 직업부터 쓰는 장비 레벨 `lvmap.py`(Lv50 · 60 … 200)
  - 그림 도구: `wic.py`(Ico) · `g4.py`(Sw, 칼 축) · `sh.py`(Sh, 앞모습) · `tilt.py` · `rot45.py` · `cprim.py` · `zoomv.py` · `mktype.py`(판)
  - 돌리기: `cd icon && python3 mkmage.py staff` · `python3 mkrogue.py card` 처럼
- 캐릭터 시안: `war.py 시안.js… 출력.png`(게임 src를 묶어 그림을 찍음, `GAME` 환경 변수 = 게임 폴더)
  - 전사 `war1~3.js` · 도적 `rg1~3.js`(확정 · 보관은 `tools/saved/rogue_skins.json`)
- 사용자가 보낸 참고 그림(ref_*)은 올리지 않았다.
