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

## 마계·약초·창고·시설 (빌드 17)
- `src/data-demon.js`: DEMON_IDS(swamp·barren·castle), 몬스터 27종, 부속품, `F.bosses`(10 스테이지마다 정해진 우두머리, core.js `fieldBoss`), `F.after`(앞 땅의 던전 공략 = 잠금 사슬, `isUnlocked`), GTIERS 6·7·8, TIER_FIELDS(장비 단계·보스 부속품·유물을 가진 필드; FIELD_IDS 대신 쓴다), `CLASSES[c].req`(lv·fame·item·arena, econ.js promoWhy). 그림은 `src/pxmon2.js`(반 해상도 격자 → 두 배, 2×2 블록을 짝수 칸에 맞추려고 빈 줄을 하나 앞에 둔다), 풍경은 `src/demon.js`(BG_MAKERS) + scene.js buildUnder의 hut·lab·torture.
- `src/data-herb.js`: 약초(herb: 1, `F.herbs`로 필드에서 줍는다), 치료 소모품(sup: 1, `cure: [상태이상]`, core.js usePotions가 CURE_IDS를 돈다), RECIPES를 약초 바탕으로 다시 씀, 창고 분류 `INV_CATS`/`itemCat`. 약초 아이템 id는 그대로 `herb`, 이름만 히포크리초.
- 창고(`PANELS.inv`): 탭(`UI.invTab`) + 칸 격자(`.igrid .cell`, `UI.invSel`) + 설명 카드(`invDetail`). 원정 출발은 다시 원정대 창(partyCard의 `.fbtn`, 「필드」·「마계」 탭 `UI.destTab`); 지도의 필드 노드는 `mapexp`로 원정대 창을 연다.
- 전직 트리: 마검사 from warrior, 음유시인 from porter, 괴물사냥꾼(mhunter)·드래곤 슬레이어(dslayer) from archer. 옛 저장은 migrateS 끝에서 안 맞는 장비를 창고로 뺀다.
- 마법사의 돌: `ITEMS.wizstone`(use: 'trait'), econ.js `useStone`, 모험가 창 특성 칩의 `data-mact="stone"`. 직업 특성은 data-trait.js `JOB_TRAITS` → `TRAITS['j_'+cls]`(job 표시), 전직(promote)과 옛 저장 이전에서 붙인다. `ROLL_TRAIT_IDS`는 무작위 특성 풀(직업 특성 제외).
- 시설: BUILDINGS max 15·12·8·6·5·8·5·8. `shopStands(lv)`, `craftFee`, 훈련비·연구비·연구 기간 할인은 econ.js.

## 펫·강화·전당·이벤트·소리 (빌드 19)
- 펫: `src/data-pet.js`(PETS 12종, 알 ITEMS egg_*, BUILDINGS.pen), `src/pxpet.js`(새끼 도트, PXM['pet_'+k]와 MONS['pet_'+k]), `src/pet.js`(부화 hatch/penDay, 먹이 feed, 경험치 petExp, 전투 petTick, 처치 petKill·알 드랍, 파티 setPartyPet). 상태 `S.pets`, `S.pen.inc`, `p.pet`. 전투 사건의 펫 출처는 `s: 'P'+id`(view.js A()가 이름을 푼다). 상단에 남은 펫 효과는 `petHome(k)`.
- 장비 강화: `g.plus`, data-rpg.js `plusMul`(+6%/단계)·gearName·gearValue, econ.js `enhance/plusNeed/plusFee/plusRate/gearsAll`, 대장간 창 탭 `UI.smithTab`('enh'), 창고 장비 설명의 `enhopen`. 아이콘 클래스 p4/p7/p10.
- 명예의 전당: `src/hall.js`(HALL_LINE, hallBonus가 traitSum에 더해진다, retire, PANELS.hall). 스승 봉급 할인 `salaryOf`.
- 지도 이벤트: `src/events.js`(S.events, eventsDay, 웨이브 startWave/stepWave/waveEnd — e.area 'wave', FIELDS.wave 가짜 필드(bg front), 축제 festSellMul/festBuyMul, 떠돌이 상인 merchantBuy, eventNodes/eventCard를 map.js가 부른다). `cityDamaged()`는 traffic을 깎는다.
- 자동화: `p.autoBuy`(startExp), `S.autoSell[k] = 남길 수`(arrive → autoSellRun), `S.ledger`(onNewDay 기록, panels.js ledgerBox 그래프).
- 소리: `src/audio.js`(AU, sfx(name), BGM 패턴 32걸음·auTick 스케줄러, bgmThemeNow가 보는 파티로 테마를 고른다). 첫 입력에서 auUnlock. 설정은 localStorage 'paros-audio'. view.js events()와 panels.js bindUI(ACT_SFX)에서 부른다. 시험용 `window.__au()`/`window.__AU`.
- 모험가 창(advDetail)은 탭 `UI.advTab`(sum·stat·job·skill·gear·etc, `data-mact="atab"`). 시험은 먼저 탭을 눌러야 단추가 보인다.
- 전직 조건: data-demon.js `CLASSES[c].req`와 `jobReqWhy/jobReqText`(lv·fame·item·itemAny·kills·dexFull·bld·arenaWins·relics·cleared). 계열 맨 앞 2차는 레벨만. 마도사(sorcerer)→대마도사(archmage) 추가, 마법 버프 stat 'matk' 지원.

## 스킬 수치·기본 공격 5초·스킬북 드랍표·라이선스 (빌드 22)
- 전투 타이밍(core.js battle): 기본 공격은 `e.cd[a.id]`(= `basicCd(a,d,e)` = `BASIC_CD 5 ÷ (d.spd × 강화 'spd')`, 피해 ×`BASIC_MULT 2.5`/마법 `BASIC_MAGIC 2.3`, 사건에 `b: 1`), 스킬은 `e.scd[a.id][id]`(= `skillCdOf(a,d,id,e)` = `s.cd × (1 − min(0.5, d.cdr + 강화 'cdr')) × (1 − 0.02×숙련)`)가 돌면 `pickSkill`로 바로 나가고 스킬 사이는 `e.gcd[a.id]`(CAST_GAP 0.9). 기절은 모든 대기시간을 멈춘다. 상수는 data-rpg.js 맨 위. 옛 저장의 e.gcd는 battle이 만든다.
- 공격 속도·재사용 감소: `derive().spd`(직업 × 민첩 × (1+지속 spdPct+특성+룬 G.spdPct)), `derive().cdr`(지속 cdr+특성+룬, 상한 CDR_MAX). 룬 haste/time(data-gear.js RUNES, st 'spdPct'/'cdr' — statLine이 %로 보여 준다), 특성 tactician, 공용 스킬북 haste/tactics/rhythm, 강화 스킬의 `haste:`는 cast가 `sid + '#h'`로 'spd' 강화를 하나 더 민다.
- 스킬 설명은 `src/skillinfo.js`: `skillSpec(id, a?)`(문자열 배열)·`skillSpecLine`·`basicSpec(a)`·`speedBreakdown(a)`·`bookFromText(id)`. panels.js 스킬 탭(기본 공격 줄 `.li.basic`)·능력치 탭·창고 스킬북·왕국 물건, dex.js skillRow·monCard, events.js 상인, under.js 투기장 상단·암시장이 쓴다. 새 스킬 필드를 더하면 skillSpec에 줄을 더할 것.
- 스킬북 드랍표 `src/data-books.js`: `BOOK_MONS`(스킬 → 몬스터 id들), `MON_BOOKS`, `monBooks(id)`, `bookRate(f, area)`(BOOK_RATE field .004·dungeon .008·fb .08·boss .25). core.js kill()이 randomBook 대신 이것을 돈다(던전 보물 상자는 아직 randomBook). 새 스킬북을 만들면 여기에도 넣어야 한다(sktest가 빠진 책을 잡는다).
- 라이선스: data-biz.js `LICENSE_UP`(lv·pf·fee·kills·bosses·dungeons)과 `licReqs(a)`; econ.js licenseUp과 panels.js 라이선스 줄이 같은 표를 본다. `a.bosses`(kill: fb/boss, 레이드 처치)·`a.dungeons`(던전 첫 공략·길드 토벌·레이드 처치)는 econ.js migrateSkillIds가 옛 저장에 어림해 넣는다.
- 겹치던 스킬 id: mage meteor ↔ sorcerer **meteorfall**, knight rally ↔ warrior **resolve**(TRAIT_SKILLS), bard hymn(치유의 세레나데) ↔ cleric/archer **chant**. migrateSkillIds가 저장을 옮긴다. 새 스킬 id는 `scratchpad/dupcheck.js`로 겹침을 확인할 것.
- 시험: `scratchpad/skills/sktest.py`(수치·쿨·드랍표·라이선스·이전), `scratchpad/skills/balance.py`(전투 시간·피해 비교, `OLD=1`이면 git HEAD 판).

## 스킬 레벨·설정·전투 통계·업적·세트·재감정 (빌드 23)
- 스킬 레벨: `a.sl[id]`(1~SK_LV_MAX 5), data-rpg.js `skLv/skLvMul/skillNeedsBook/skillUpCost(id, lv)`, econ.js `skillUpWhy/skillUp/skillToggle`. 전투 적용: core.js cast의 `M = smMul × skLvMul`, buff mult/add/haste에 `L`, passives()에 `× skLvMul`, skillCdOf에 `(1 − 0.04×(lv−1))`. skillinfo.js skillSpec이 `L`을 계수에 곱해 보여 준다.
- 자동 사용: `a.skoff[id]`(pickSkill이 건너뜀), `a.skpri[id]`(pr +3). 모험가 창 스킬 탭 단추 `data-mact="skup|skoff|skpri"`. 잊으면 sl/skoff/skpri도 지운다.
- 전투 통계: core.js `ev()`가 `bstat(e, who, k, v, sid)`로 `e.stats[who] = {dealt, taken, healed, kills, sk}`를 쌓는다. 출처는 hit 사건의 `sid`(스킬 id) 또는 `b`(basic)/`ctr`/`pet`/`k:'pet'`(companion)/`dot`; 지속 피해·상태이상 틱은 `by/sid`를 들고 다닌다(f.dot.by, f.sta[k].by, inflictFoe의 by/sid 인자). 처치는 `e.lastHit[uid]`. 그리기는 skillinfo.js `bstatRows(stats, names)`; 전투 창 `#bw-stats`(V.bstats, renderBattle이 `box.dataset.h`로 기록/통계를 바꿔 그린다), 원정대 카드는 `p.last.stats/names`(arrive가 넣는다).
- 업적 `src/achv.js`: `ACHV`(id·cat·need·get()·rw{gold,fame,item}), `achvTick()`(arrive·onNewDay·panels 클릭 핸들러에서 부른다), `S.achv[id] = 날짜+1`, PANELS.achv, 상단 창 subBtn('achv'). 카운터 `S.stats.bosses`(kill)·`S.stats.raids`(stepRaid)·`S.stats.waves`(waveEnd).
- 세트 효과: data-gear.js `SET_BONUS`·`setInfo(a)`·`setBonusText`; core.js derive가 `P`에 더한다. 재감정: `REAPPRAISE`, core.js `rollBonus(t, q)`(makeGear도 쓴다, ×0.8~1.3 무작위), econ.js `reappraiseWhy/reappraise`, 창고 장비 설명 ACT `reapp`.
- 같은 이름 스킬: taunt '도발 1', provoke '도발 2', ar_cheer '관중의 응원', awk_cleric '신의 기적'. 새 스킬 이름은 `scratchpad/datamod2.js` 방식으로 겹침 확인.
- 시험: `scratchpad/skills/sk2test.py`(논리), `scratchpad/skills/ui23.py`(화면·캡처).

## 의뢰 자동 전달·알림 넘기기 (빌드 24)
- econ.js `autoReqOn()`(S.autoReq !== false, 기본 켬)·`autoFulfill()`(arrive에서 autoSellRun 앞, onNewDay의 genReq 뒤)·`fulfill(id, auto)`(auto면 `reqGearCheap`한 장비만)·`reqGearPick`(싼 장비부터). 의뢰 창 ACT `autoreq`.
- ui.js pumpModals: 뒤에 gate 아닌 알림이 더 있으면 `모두 넘기기 (n)` 단추(.skipall)가 `S.modals`에서 gate 아닌 것을 지운다. 뒤로 가기의 1단추 판정은 `.skipall`을 뺀다. 시험 `scratchpad/skills/reqtest.py`·`reqtest_ui.py`.

## 원정대 탭·대형·마부·정찰가 (빌드 25)
- 원정대 창 `PANELS.exp`: `UI.expTab`(파티 id | 'raid'), 탭 `.tabs.exp`(ACT `exptab`, `newparty`가 새 파티 탭으로). 파티 탭은 `partyCard(p)` 하나 + 그 안의 `freeList(p)`(이 파티에 「넣기」). map.js `mapexp`가 `UI.expTab`을 맞춘다.
- 대형: core.js `formRank(cls)`(CLASSES[c].row 우선, 없으면 act melee 0 · arrow 1 · 그 밖 2; porter·bard·maestro·coachman·caravanmaster는 row 2)·`formParty(p)`가 p.members를 안정 정렬. startExp·startArena(under.js)·startWave(events.js)에서 부른다. SLOT_P[0]이 맨 앞, pickTarget이 index 0에 가중치.
- 마부: core.js `coachOf(p)`(TR.wagon > 0인 가장 큰 사람)·`wagonOwned/wagonWhy/wagonOf`(WAGONS[w].coach면 마부 없을 때 null)·`wagonCap`(×(1+TR.wagon))·`wagonSpd`(×(1+TR.wagonSpd)). capOf/moveOf가 쓴다. 전직 조건 `req.wagon`(어느 파티든 coach 마차), 정찰가 `req.trips`(a.trips).
- 정찰가: `scoutMove(p)`(moveOf에 ×(1+)), `tentOf(p)`(TR.tent 최대) → startCamp가 `e.camp.tent`에 넣고 stepCamp가 피로 회복 ×tent, HP ×1.25, 밤습격 확률 ×0.5. view.js 야영 장면은 tent면 큰 텐트(drawTentHi ×1.7) + 나란히 눕기 + `lanternHi`; expStatus·camp 로그 글도 바뀐다.
- 새 직업 데이터: data-rpg.js CLASSES(coachman·caravanmaster·scout·pathfinder, bow cls), SKILLS(whipcrack…summit), econ.js WEAPON_OF, pxa.js PXL, data.js BIOS, data-trait.js JOB_TRAITS, data-demon.js req. 시험 `scratchpad/skills/portertest.py`·`ui25.py`, 도트 시트 `scratchpad/px/t_porter2.js`.

## 저장 코드·백업 슬롯 (빌드 26)
- 버그 원인: ui.js parseSave가 `[1,2,3,4].includes(v.v)`로 판을 검사했는데 빌드 22부터 저장은 v5 → 모든 새 코드가 거부됐다. 이제 econ.js `const SAVE_V = 5`(blankState `v: SAVE_V`)가 기준이고, `v.v > SAVE_V`만 'newer'로 막는다. **저장 판을 올릴 때는 SAVE_V만 올린다.**
- 코드 형식: `OHMUL2:` = deflate(CompressionStream) + base64, `OHMUL1:` = base64만(옛 코드·압축 못 하는 브라우저), 맨 JSON도 받는다. ui.js `saveCode()`(async)·`parseSave(txt)`(async, 앞뒤 글·공백·따옴표 무시, 실패하면 `Error(SAVE_ERR 키)`: prefix/b64/zip/nozip/json/shape/newer)·`applySave(v, done)`(loadFrom → saveGame → 화면 갱신, done은 첫 화면에서 게임 시작).
- 창: `openExport()`(요약 `saveSummary(S)`·KB, 복사/공유 navigator.share/파일로 저장 Blob), `openImport(done)`(#code-in, 붙여 넣기 clipboard.readText, 파일에서 `<input type=file id=code-filein>`, 오류는 #code-err, 게임 중이면 confirmBox). 첫 화면 「저장 코드로 이어하기」도 openImport를 쓴다.
- 백업 슬롯: localStorage `${SAVE_KEY}:slot1..3`에 `{at, name, sum, data}`; `slotInfo/slotSave/slotLoad/slotClear/slotRows`(SLOT_N 3). 설정 창(PANELS.co_set) 「저장 코드」 절 + 「백업 슬롯」 목록, ACT `slotsave/slotload/slotclear`.
- 시험: `scratchpad/skills/savetest.py`(논리, 하네스에 localStorage 폴리필), `scratchpad/skills/saveui.py`(내보내기→불러오기 왕복, 잘린 코드 오류 글, 첫 화면 이어하기; pagehide 자동 저장 때문에 init 스크립트에서 sessionStorage 'wipe'로 지운다).

## 빌드·배포
- `python3 build.py` → `dist/play.html`(아티팩트), `dist/web/index.html`; APK는 GitHub Actions(빌드 번호 = run number, 태그 `build-N`). 릴리스 조회는 `gh api repos/.../releases/tags/build-N`, 자산은 `-H "Accept: application/octet-stream"`.
- 시험: `scratchpad/v7/t/uitest7.py · fresh7.py · perf7.py`, 영웅 화면 `scratchpad/hero/herotest.py`, 원정 창 `scratchpad/front/exptest.py`, 도감 `scratchpad/front/dextest.py`, 마계·창고·전직 `scratchpad/demon/demontest.py`(UI)와 `scratchpad/demon/logic.py`(함수 직접 호출).
- 커밋 끝에 `Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>` 과 `Claude-Session:` 줄.
