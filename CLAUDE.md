# 오물거리 상단 — 작업 메모 (Claude용)

## 그림 스타일: 「뭉툭 도트」가 기준 (2026-11-03, 사용자 결정)
- 사용자가 고른 최소 수준: **반 해상도로 찍어 2배로 키운 굵은 픽셀 + B4 손질** (3톤 명암, 부위 사이 어두운 선, 쇠·가죽 질감, 왼쪽 위 가장자리 빛, 눈 반짝임). 사용자 말: "뭉툭으로 가자, 내가 원하던 최소 수준이야. 앞으로 잘 기억해 둬."
- 구현: `src/pxa.js`의 `PX_CHUNK = 2`(격자를 `pxChunk`로 반으로 줄여 굽고 2배 확대), `PX_FX = { rim, line, tex }`(B4 손질), `PX_PRI`(줄일 때 눈·입·쇠·나무·금을 우선해 살린다). `pxBake(key, g, pal, ax, ay, pre)`의 `pre`는 이미 반 해상도로 그린 격자(레이드 몬스터)라는 뜻.
- 모험가(앞·옆)·일반 몬스터·레이드 몬스터·초상·영웅 화면 전부 이 방식. 본부(pxhq.js) 작은 사람들은 아직 자체 방식.
- 레이드 몬스터는 `scratchpad/raidpx`의 파이썬 도안(m_*.py → variants2.py B4 → export_js.py)에서 `src/pxraid.js`(PXRAID)로 내보낸다. 수정은 파이썬 쪽에서 하고 다시 내보낼 것.
- 새 그림을 그릴 때는 굵은 픽셀에서 읽히는지(눈 2×2, 무기 2px 폭 이상) 먼저 확인. 1px짜리 선은 사라진다.
- 과정: 시안을 먼저 보여 주고(게임에 적용하지 말고) 고르게 한 뒤 적용. 사용자는 "간단한 2D 도트", 굵고 또렷한 것을 좋아하고, 자동 명암으로 뭉개진 그림("괴상", "조잡")은 싫어한다.

## 그 밖의 결정
- 풍경은 옛 240×128 겹 풍경(scene.js) + 키 큰 숲·원시림·뒷골목(woods.js) + 상단 앞 정면(front.js). 원근 무대(arena.js)는 쓰지 않는다.
- 전투는 옆모습: 파티 왼쪽, 적 오른쪽, 복귀 때 방향을 튼다. 야영은 옛 배치.
- 창 머리는 돌담 + 붉은 리본 제목 + 나무 단추. 모험가 창은 영웅 화면(hero.js).
- 원정 창: 어느 파티에도 없는 모험가만 「대기 중인 모험가」에, 파티원은 카드 안, 「빼기」로만 되돌린다.

## 지하수로 (빌드 15)
- `src/data-under.js`(데이터) + `src/under.js`(투기장·상단·암시장·경매장·왕국 물건·화면). 상태는 `S.under`, 날마다 `underTick()`이 새로 뽑는다. 투기장 상대는 `fakeAdv`→`pvpFoe`로 전투 엔진의 적이 되고(`f.adv`로 모험가 그림), `e.area === 'arena'`는 `stepArena`가 돈다. 검투사 전직은 `GLADIATOR_SCORE`.

## 지도·특성·상태이상·각성 (빌드 16)
- `src/data-trait.js`: TRAITS(30)·STATUS(8)·몬스터/스킬 sta·새 스킬·AWAKEN·AWK_SKILLS. 전투 적용은 core.js(derive의 X(), inflictAdv/inflictFoe/tickSta/cureSta, hitAdv의 막기·반격, basicAct의 연타). 
- `src/map.js`: 지도(MAP_NODES 좌표, mapArt 240×200), 왕국 의뢰 KQUEST/S.kq, 이야기 창(talk). 원정 출발은 지도의 mapGo만. 원정대 창에는 목적지 단추가 없다.
- 의상(COSTUMES)은 사용자 요청으로 제거. 용사 = 각성(a.hero), 라이선스 5단계는 「백금」.

## 도감 (빌드 17)
- `src/dex.js`: `S.dex = { kills, seen, items, gear }`. `foeFrom`이 `dexSeen`, `kill`이 `dexKill`(투기장 제외), `hitFoe`가 30마리 완전 기록 때 피해 +3%. 창은 `PANELS.dex`에 탭(`UI.dexTab`, ACT `dextab`), 상단 창의 `subBtn('dex')`로 연다. 탭을 바꾸면 `winTop().tab`을 바꿔 `renderPanel`의 키가 달라지게 해서 펼친 목록(details) 상태가 탭 사이에 섞이지 않는다.
- 몬스터 공개 단계는 `DEX_K = [1, 5, 15, 30]`. 옛 저장은 `dexMigrate()`(migrateS 끝)에서 가 본 필드 몬스터를 만난 것으로 옮긴다.

## 빌드·배포
- `python3 build.py` → `dist/play.html`(아티팩트), `dist/web/index.html`; APK는 GitHub Actions(빌드 번호 = run number, 태그 `build-N`). 릴리스 조회는 `gh api repos/.../releases/tags/build-N`, 자산은 `-H "Accept: application/octet-stream"`.
- 시험: `scratchpad/v7/t/uitest7.py · fresh7.py · perf7.py`, 영웅 화면 `scratchpad/hero/herotest.py`, 원정 창 `scratchpad/front/exptest.py`, 도감 `scratchpad/front/dextest.py`.
- 커밋 끝에 `Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>` 과 `Claude-Session:` 줄.
