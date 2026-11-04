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
- 버그 원인: ui.js parseSave가 `[1,2,3,4].includes(v.v)`로 판을 검사했는데 빌드 22부터 저장은 v5 → 모든 새 코드가 거부됐다. 이제 econ.js `const SAVE_V = 5`(blankState `v: SAVE_V`)가 기준이고, parseSave는 `v.v > SAVE_V`만 'newer'로, loadFrom은 `v.v < 2 || v.v > SAVE_V`만 거부한다. **저장 판을 올릴 때는 SAVE_V만 올린다(판 목록을 손으로 적지 않는다).**
- 코드 형식: `OHMUL2:` = deflate(CompressionStream) + base64, `OHMUL1:` = base64만(옛 코드·압축 못 하는 브라우저), 맨 JSON도 받는다. ui.js `saveCode()`(async)·`parseSave(txt)`(async, 앞뒤 글·공백·따옴표 무시, 실패하면 `Error(SAVE_ERR 키)`: prefix/b64/zip/nozip/json/shape/newer)·`applySave(v, done)`(loadFrom → saveGame → 화면 갱신, done은 첫 화면에서 게임 시작).
- 창: `openExport()`(요약 `saveSummary(S)`·KB, 복사/공유 navigator.share/파일로 저장 — 앱(isApp)에서는 WebView가 내려받기를 못 해 숨기고, claude.ai 아티팩트 안에서는 `window.claude.use('downloads')`로 저장하므로 아티팩트를 올릴 때 `capabilities: {downloads: true}`를 넣는다; 그 밖에는 Blob 내려받기), `openImport(done)`(#code-in, 붙여 넣기 clipboard.readText, 파일에서 `<input type=file id=code-filein>`, 오류는 #code-err, 게임 중이면 confirmBox). 첫 화면 「저장 코드로 이어하기」도 openImport를 쓴다.
- 백업 슬롯: localStorage `${SAVE_KEY}:slot1..3`에 `{at, name, sum, data}`; `slotInfo/slotSave/slotLoad/slotClear/slotRows`(SLOT_N 3). 설정 창(PANELS.co_set) 「저장 코드」 절 + 「백업 슬롯」 목록, ACT `slotsave/slotload/slotclear`.
- 시험: `scratchpad/skills/savetest.py`(논리, 하네스에 localStorage 폴리필), `scratchpad/skills/saveui.py`(내보내기→불러오기 왕복, 잘린 코드 오류 글, 첫 화면 이어하기는 저장 없는 새 브라우저 컨텍스트에서 — 같은 탭에서 다시 열면 새 문서가 옛 sessionStorage 스냅샷을 봐 시드가 다시 깔리는 플레이크가 있었다).

## 개화석·돌 드랍·레이드 탭·왕국 마차·왕국 스킬북 (빌드 28)
- 특성 돌: data-trait.js `TRAIT_MAX 3`, `innateTraits(a)`, `canBloom(a)`, `bloomTrait(a)`(직업 특성 앞에 끼움), `ITEMS.bloomstone`(use 'bloom'), `STONE_DROP {bloomstone: {fb .06, lord .15, boss .2, raidN [2,1,1,0]}, wizstone: {fb/lord/boss .04, raidP [.2,.1,.06,.04]}}`, `STONE_IDS`, `stonePct`, `stoneFromText(k)`. econ.js `useBloom(aid)`. core.js kill() → `stoneDrops(p, e, f, luck)`(field의 fb/lord, dungeon의 boss만; e.bag에 직접 넣어 짐이 차도 안 잃음). econ.js raidReward가 raidN/raidP 처리. 마법사의 돌 판매 제거: under.js arenaShop·bmRefresh, events.js newMerchant, data-demon.js 보스 drops.
- 화면: panels.js `emptyTraitChips(a, bloom)`(.trait.empty 점선), 모험가 창 특성 머리글 「타고난 n/3」, mact `bloom`; 창고 돌 설명 `stoneFromText`; 레이드 보상 줄에 돌; dex.js 보스 extra 글에 `stoneTxt`.
- 레이드 탭: panels.js `raidCard(r, full, send)` + `raidSendRows(r)`(파티마다 「도전」, ACT `raidgo` → `p.dest = fid; startExp`). 
- 탭 겹침: style.css `.tabs.dest { position: static }`(파티 카드 안 목적지 탭은 고정 안 함), `.tabs.exp z-index 3`.
- 왕국 마차: view.js `COACH_PARK 166`, `COACH_RUN 3.2초`, `coachState(t)`(V.coachK로 방문 시작/끝 감지 → V.coach {k, t0, out}), `drawCoach(w0, X, gy, t, D, moving, lights, dark)`는 112×60 캔버스(V.coachCv)에 원래 크기로 그려 `COACH_Z 1.5`배로 붙인다(원점 COACH_OX 52, COACH_OY 57). townScene에서 행인 뒤·파티 앞에 그린다. 밤에는 등불 light. 캡처 `scratchpad/front/coachshot.py`.
- 왕국 스킬북: data-under.js 10개에 `tier: 2`·위력 상향, 값 `500 + lv*110`; data-rpg.js canLearn이 `s.tier`(jobTier ≥) 검사; econ.js learnSkill 메시지; skillinfo.js skillSpec 끝에 「n차 전직 후 배움」.
- 시험: `scratchpad/skills/stone28.py`(논리), `scratchpad/skills/ui28.py`(화면: 빈 자리·개화·창고·왕국 교역·탭 겹침 elementFromPoint·레이드 탭 출발). 직업 밸런스 측정 `scratchpad/skills/classbal.py`(차수별 Lv18/40/70, DPS·버팀·치유·기준 파티 시간).

## 직업 역할 개편 (빌드 29)
- 장치(core.js): `hitFoe`에 처형 `T.exec`(EXEC_HP 0.3)·표식 `f.sta.mark`(MARK_BONUS 0.2)·연계 `T.combo × e.combo[aid]`; `comboUp`(basicAct 적중)·`comboBreak`(빗나감, inflictAdv stun/para); 보호막 = buff `{stat:'shield', hp, max}`(hitAdv가 먼저 깎고 ev 'shield', 다 깨지면 battle 첫머리에서 걷음); 엄호 = battle의 적 표적 고른 뒤 `TR(x).cover` 확률로 대체(도발 중엔 안 함, HP 25% 아래·기절이면 못 함, ev 'cover'); 재생 = buff `{stat:'regen', add: hps}`를 battle이 1초마다 적용(e.rg 누적, ev heal rg:1); 부활 = cast kind 'revive'(`e.rev[aid]` 싸움당 1회, `x.inj = null`, flee 취소); 성스러운 흡수 `partyDrain`(T.pdrain); 대박 `s.gamble {p, mult}`(ev 'jackpot'); 강화 stat 'crit'(cast·basicAct buffAdd)·'guard'(hitAdv)·'cdr'(skillCdOf 기존).
- 상수 data-rpg.js `COMBO_MAX 5 · EXEC_HP 0.3 · MARK_BONUS 0.2`, `BASIC_MAGIC 2.1`, 화염구 1.8. STATUS에 `mark`(적 전용, tickFoeSta 목록에 포함, 보스도 지속 온전).
- pickSkill 우선순위: revive 12 > heal 10/11 > regen 8/9 > cure 9 > shield 5~8(파티는 2명 이상 보호막 없을 때, 자기는 다쳤거나 보스/2마리↑) > buff 4/7.
- 데이터: data-rpg.js CLASSES 2차·3차 tr(combo/exec/cover/pdrain/guard/tank 0) + desc에 역할 표기, 고유 스킬 블록 전면 교체(새 id: wagonwall·spotweak·holyshield·regenall·starward·encore·resurrect; 3차 첫 고유 Lv55). 기존 id는 모두 유지(저장 호환).
- 화면: view.js ev 'shield'/'cover'/'combo'(3·MAX만)/'revive'/'jackpot' 연출·기록, HP 막대 위 보호막 띠, SKILL_CLS/BUFF_C 추가; skillinfo.js SK_KIND shield/regen/revive, exec·gamble 줄; panels.js TR_TXT combo/exec/cover/pdrain/wagon/scout/tent/drop, 전직 안내에 역할표.
- 시험: `scratchpad/skills/role29.py`(장치 논리), `classbal.py`로 측정(2차 지속≈한방 250~340, 혼합 185~240). 연계는 「맞으면 끊김」으로 하면 근접이 못 쌓아서 빗나감·기절에서만 끊기게 했다.

## 북쪽 변경·구름섬·희귀종·둥지·보물 지도·마구간·도서관·비행장·상단 랭킹 (빌드 30)
- 파일: `data-sky.js`(data-books 뒤: 부속품·몬스터·FIELDS grave/volcano/roots/sky/treasure·GTIERS 4단·RELICS·HORSES·WAGONS.sky·새 PETS 4(goat/wyvern/redhare/pegasus, PET_IDS.push + 알 직접 생성)·BUILDINGS stable/library/airfield·`bookRecipe(sk)`·RARE/NEST/TMAP_DROP/LEAGUE·STORY.v30), `pxmon3.js`(pxpet 뒤: PXM3 반해상도 그림 + HORSE_GRID/HORSE_LOOK → `MONS.horse_k`(plan 'pet') + PXPET3), `sky.js`(demon 뒤: DAY_SKY·TIER_COLORS.push·UNDER_PAL/UNDER_DECOR 확장·buildGrave/Volcano/Roots/Sky·BG_MAKERS 등록), `world30.js`(events 뒤: FLOOR_TXT·마구간·도서관·비행장·랭킹·MAP_EXTRA·skyMapArt·ACT). scene.js의 buildUnder 팔레트를 `UNDER_PAL`/`UNDER_DECOR`로 빼고 `pal.dark`, drawAmbient 끝에 `b.ambientFn(g, scroll, t, T, oy, wrap)` 훅.
- 필드: `FRONTIER_IDS`(frontier: 1, after 체인 barren→grave→volcano→roots), `SKY_IDS`(region 'sky', after roots + `S.bld.airfield`), `FIELDS.treasure`(hidden·raid: 1·treasure: 1, `isUnlocked` = `S.inv.tmap > 0`). TIER_FIELDS 9~12(crest/core/soul·BOSS_COL), DUNGEON_GOLD 4개 push, 대장간 max 10. ALL_FIELDS에 treasure까지(S.fields 자동 생성). 안개 묘지는 rollFoes에서 nightMore ×2.
- 마차(core.js): `isPorter/portersOf/porterOf`, `horseOf(p)`('h:kind' 마구간 말 | 'p:petId' stage≥1 펫 → HORSES 항목 + id/petId/petName), `wagonWhy`(짐꾼 계열 없음·말 없음·goat/fly 불일치), `wagonCap/Spd` = 몸체 × 말 배율 × (1 + plus×WAGON_PLUS) × 마부 × (비행장2 1.2), `wagonFly(p)`, `rigName(p)`(비행 마차 + 날개 펫 = 「그리폰 마차」, +n). WAGONS의 `coach` 플래그는 `horse`(1|'goat'|'fly')로 바뀜. startExp: 짐꾼 계열 2명 이상 거절, sky는 wagonFly 필요, treasure는 tmap 소비 + `e.lvo`(파티 평균 Lv)·`e.chests`. econ.js toggleMember 둘째 짐꾼 거절, `buyWagon`(wagonOpen에 bld 조건, `wagonBack`, 바꾸면 wagonPlus 0, 말 없는 몸체면 unhitch), blankState/newParty에 stable/league/horse/wagonPlus, `migrate6`(SAVE_V 6: 말 끌던 마차에 말 지급, steel엔 진화 산양 펫), `notes30`. data-pet.js `petHitched`·petsAtHome 제외; pet.js setPartyPet/releasePet 거절.
- world30.js 마구간: `S.stable.horses {kind: n}`, `stableHorses/horseFree/horseOpen(lv)`, `buyHorse/sellHorse/hitch(pid, key)/unhitch(p)/enhanceWagon(pid)`(`wagonPlusCost(w, n)` 돈·편자·철광석, 상한 `wagonPlusMax()` = stable+2), `buyShoe`. `BLD_BOX.stable`(UI.stableP 파티 선택 → 몸체·맬 말·펫·강화·말 가게). 도서관: `libBooks`, `craftBook(sk)`(LIB_MAXLV [0,30,55,100]), `buyLibMat`. 비행장: `BLD_BOX.airfield`(파티마다 비행 마차 구매·`skyGo`). panels.js `BLD_BOX/BLD_SUM` 훅, BLD_INNER 추가, bopen에 data-p. ui.js BLD_FLOOR·`FLOOR_TXT` 훅. iso.js FLOOR_INFO/ROOM_C/hqFloors(airfield 맨 위)/가구(hay·trough·fence·bigbooks·lectern·windsock·bollard·flywagon)/`stableScene`(STABLE_SPOT, drawMon horse_k·펫)/wallDecor/hqLights.
- 희귀종: rollFoes 끝에 보스·둥지 아닌 한 마리 `RARE.p`로 `makeRare`(f.rare·이름 「반짝이는 」·hp×3 atk×1.4 def×1.3 eva+.1); spawn ev에 `rare`; kill → xp×5, `rareDown`(dex.js `dexRareKill`, 개화석 e.bag, 명성 +2, S.stats.rares); hitFoe `dexRare(id)` → ×1.15, 드랍 dropMul +.25, fbm 2. view.js 금빛 겹그리기(FLASH '#ffd040' α)·반짝이·callout 'rare'(.call.rare). dex.js monCard에 ★희귀 줄.
- 둥지(events.js): EV_GAP.nest [7,12], `newNest(k)`(best≥5인 열린 TIER_FIELDS, need NEST.need 12, 사흘), `nestAt(fid)`(core.js), rollFoes에서 field·advance일 때 +NEST.extra 마리·`NEST.p`로 `makeNestFoe`(hp×1.6 atk×1.2 f.nest, 머리 위 둥지 표시), kill → `nestKill`(got==need면 상금 `nestReward`·명성·그 필드 알, S.stats.nests). 지도 노드 `evn nest`(하늘 필드는 제외), eventCard.
- 보물 지도: kill → `mapDrops`(field의 fb/lord, TMAP_DROP .04/.08, e.bag.tmap). `floorsOf(e)`(TREASURE_FLOORS 3)를 makeEncs/rollFoes/stageClear가 씀; rollFoes 레벨 `e.lvo + stage - 3`(파티 평균 -2~0), 주인 `lvo + 2`; 장비 드랍 단계도 `raidTier(lvo)`; stageClear 층 넘길 때 `treasureChest`(돈·황금 가루·장비 35%·책 30%, ev 'chest'); dungeonClear → `treasureClear`(돈·황금 가루 3·영웅/전설·책·개화석 50%·돌 10%, S.stats.tmaps, cleared 안 함). 파티 카드 「필드」 탭 끝 `.fbtn.treasure`. 지도를 다 쓰면 「돌아오면 다시 출발」이 멈춘다(econ.js autoDepart).
- 상단 랭킹(world30.js): `S.league {month: settleDay, start{earned,fame,dungeons,rares,tmaps,nests}, rivals[5]{n,c,pw,s}, last, result, title}`, `leagueState()`(month≠settleDay면 `leagueNew`), `leagueScore()`, `leagueStand()`, `leagueDay()`(onNewDay, rival += LEAGUE.base×(1+tier×.6)/MONTH_DAYS×pw), `leagueMonth(lines)`(settle()에서, 등수 보상 LEAGUE.rewards·title), `PANELS.co_league`, 상단 창 subBtn. 
- 지도(map.js): MAP_NODES grave(34,112)/volcano(158,22)/roots(76,34), `MAP_EXTRA[]` 그림 훅(world30.js에서 묘지·화산·세계수·길), `MAP_NODES_SKY`·`SKY_MAP_W/H` 240×150·`skyMapArt()`, `mapNodes(skyMap)`·`mapNodeHtml(..., W, H)`, PANELS.map 탭(UI.mapTab 'land'|'sky', ACT maptab), mapexp가 region sky면 destTab 'sky'. 파티 카드 목적지 탭 「필드/마계/하늘」(SKY_IDS, hidden 필드 제외). style: `.map-wrap.sky`, `.mnode.nest/.front/.skyf`, `.fbtn.front/.skyf/.treasure`, `.call.rare`.
- 알림: barren 던전 첫 공략 → STORY.frontier, roots 첫 공략(비행장 있으면) → STORY.skyOpen, 마구간·도서관·비행장 첫 건설 → STORY.stable/library/airfield(econ.js upgrade). 층 단추가 많아져서 ui.js renderFloors가 지금 층 단추를 옆으로 밀어 보이게 한다.
- 밸런스: 일반 몬스터에는 aoe를 주지 않는다(이프리트·원혼 나무·구름 거인에서 뺐더니 Lv+3 파티가 castle과 비슷하게 50까지 간다). 측정 `scratchpad/sky30/fieldsim.py`.
- 시험: `scratchpad/sky30/load.py`(이전·데이터 일관성·패널 렌더), `logic30.py`(마구간·비행·보물 던전·희귀종·둥지·도서관·랭킹·지도 드랍·migrate6), `ui30.py`(시설·마구간·도서관·비행장·하늘 탭·보물 단추·지도·랭킹·도감·본부 층), `battle30.py`(실제 빌드에서 묘지 원정·보물고 전투), 그림 `sheet.py`/`bgsheet.py`. 전체 `scratchpad/run30.sh`. 하네스 `sky30/harness.py`(build.py 순서대로 src를 넣고 `window.G` 노출).

## 날씨·요리·교역·속성·타입·새 직업·2차 각성·새 섬 (빌드 31)
- 파일(build.py 순서): `data-star.js`(data-sky 뒤: MAX_LV2·lvCap·AWAKEN2·AWK2_SKILLS·heroTag·hallMul·몬스터 21·FIELDS thunder/ruins/stargarden(span 10)·GTIERS 3·STAR_BOSS_NAMES·RELICS·STORY), `data-elem.js`(ELEMS·MTYPES·MON_TAG → `m.ty`/`m.el`·SKILL_EL·STUN_ADD·STUN_BOOKS(+BOOK_MONS/MON_BOOKS)·TYPE_TR·`elemBase/elemMul/skillEl/skillElMul/typeMul/typeKills`·HIT/hitTag·`monElNote`), `data-life.js`(SEASONS·WX_SKY·WX_SKY_P·WX_T·CLIMATE·DUNGEON_CLIMATE·체질 TRAITS·`rollWeak`·ITEMS 재료/교역품·FOODS(`ITEMS.food_id`)·BUILDINGS.kitchen·TRADE(+숨은 `FIELDS.trade_k`)·PARTY_FIGHTERS·STORY.v31), `pxmon4.js`(PXM4), `sky2.js`(DAY_SKY·UNDER_PAL/DECOR spire/sanctum/starthrone·buildThunder/Ruins/Stargarden), `weather.js`·`kitchen.js`·`trade.js`·`qol.js`(world30 뒤).
- 날씨(weather.js): 상태 없이 `S.wx.seed`와 날 번호로 정한다(`hash01`, `wxDay(dn)` 캐시 WXC, `monsoonOf(y)`). `wxClim(e)`(raid·arena 실내, dungeon은 DUNGEON_CLIMATE[bg] fixed 아니면 실내, trade는 TRADE.clim), `wxNow(e, t)` → {sky, wind, T(-2~2), sun, se, …}: 계절 기본 [0,1,-1,-1] → 폭염 2·한파/폭설 -2 → 밤·새벽 -1(폭염 제외) → **[-2,2]로 자른 뒤** 기후 t를 더하고 lo/hi로 자른다. `wxFx(w, a, foodFx)` → stat/move/sk/ba(체질 wxCold/wxHot/wxWet/wxWind, wxColdRes/HotRes, 도시락 coldRes/hotRes). **`derive(a)` = `expMods(deriveBase(a), a)`**: 원정 중(status away)이면 날씨 stat을 atk·matk·def·maxHp에, move, `d.wxSk/d.wxBa`를 넣고 도시락 효과도 얹는다. core: skillCdOf ×wxSk, basicCd ×wxBa, stepCamp ×`campWxF`(c.wxf), arrive에서 clampVitals. HUD `hudWeather()`(`.hv.date` 두 줄), `PANELS.co_wx`, view.js `groundWx`(눈 덮인 땅·젖은 땅, drawLand 뒤)·`drawWeather`(drawAmbient 뒤), 비+텐트 없음이면 모닥불 대신 연기, 강풍이면 작은 불.
- 요리(kitchen.js): `cookWhy/cookFood/buyFoodMat(KITCHEN_BUY)`, `packFood(p)`(startExp에서 `e.food`, p.autoCook), `foodFx(e)`·`foodOf(e)`. 효과 연결: stepExp `ff.fat`(fr)·`ff.sleep`, kill xp `ff.exp`·dropMul `ff.luck`, inflictAdv `ff.sta`, 나머지는 expMods. 원정대 창 `foodPick(p)`(창고에 있거나 지금 만들 수 있는 것만), BLD_BOX/BLD_SUM.kitchen, 본부 주방 층(iso.js stove·pantry·pot, STAFF.cook). 창고 「요리」 탭(itemCat food: `I.dish || I.food`). 짐승 타입 몬스터 drops에 raw_meat 0.3.
- 교역(trade.js): 목적지 `trade_k`(isUnlocked = kingOpen), startExp에서 `tradeWhy`(말이 끄는 마차)·빈 짐 거절 → `tradeSetup`(창고에서 wants 실음 `e.cargo`, e.area 'trade', e.dist, e.leg 'out', e.lvo = max(T.lv, 평균-6)). core 분기: makeEncs/rollFoes(TRADE.mons)/stageClear → `tradeStage` → 끝에서 `tradeAtKingdom`(호감 배율로 다 팔고 p.tradeBuy 예산으로 특산물 e.bag, favor, S.stats.trades, mode 'return'·why 'trade') → arrive에서 `tradeHome`(못 판 짐 반환·교역 보고). usedOf에 cargo. 원정대 창 「교역」 탭(`tradeDestButtons/tradeInfo`, ACT tbud). 교역품은 창고 부속품 탭(I.trade), 일괄 판매 제외.
- 마차 그림(trade.js `drawRig(g, X, gy, t, p, moving, dir)`): fieldScene draws(y 160, field/trade/wave, 던전 제외), 야영 장면, townScene 왼쪽. 끄는 짐승은 `rigAnimalId`(펫 mon 또는 horse_k), 비행 마차는 떠서 난다.
- 속성: hitFoe(…, el, sk) → `elemMul`이 0이면 0을 돌려준다(HIT.imm), 피해에 em × `typeMul`. cast는 `skillEl(s, f, a)`, 기본 공격·반격·펫은 'none'(펫은 PET_FX_EL). dot 스킬은 cast 때 배율을 dps에 굽고 면역이면 안 건다. inflictFoe는 STA_EL(화상=불, 냉기=빙결, 감전=번개, 중독·출혈=무속성) 면역이면 안 건다. pickSkill: 면역이면 pr 0, 약점이면 +2. battle: `e.hpW/e.noDmg` 14초 동안 HP가 안 줄면 e.flee + `e.fleeImm` → 빠져나와 `recall(p, 'imm')`. view.js 「면역」(회색)·「약점」(주황) 숫자, 로그. skillinfo `skElLine`, dex monCard 타입·속성 줄. 철갑 화살 `armor: 1`.
- 새 직업: data-rpg.js CLASSES huntsman/kaijuhunter(tr.vs), elemancer/alchemist(tr.elw·immPierce)와 스킬(own, `vs`·`els`), data-trait JOB_TRAITS(vsBeast·vsKaiju·elw), data-demon req `tkills`([타입, 수], `typeKills`), WEAPON_OF·BIOS·pxa LOOK. panels TR_TXT vs/elw/immPierce.
- 2차 각성: core.js `awaken2Why/awaken2`(soulCount·AWAKEN2), `lvCap(a)`(addExp·hero 경험치 막대·패널), growStats mul 1.35, derive lic ×1.15, skillSlots +1, SKILL_SLOT_LV 120·140, heal `reviveAll`(pickSkill pr 13), panels 전직 탭 카드·mact 'awaken2', heroTag(초월 용사), hall `hallMul`(×3)·h.hero2. 보물 던전 lvo 상한 MAX_LV2.
- 파티 인원(qol.js): `fightersOf`·`partyWhy`(startExp·go 단추·비행장)·`trimParty`(migrate7·arrive), toggleMember 거절. 편성 `S.presets`(save/load/delPreset, presetBox), 반복 `p.repeatLeft/repeatSet`(autoDepart), `autoEquipAll`, `sellAllMats/bulkMats`, `sellLowGear/bulkGears`, `departAll/recallAll`.
- 저장: SAVE_V 7, `migrate7`(S.wx·kitchen·presets·trimParty·체질 33%), `notes31`, blankState flags.v31. 새 업적 trade1/2·cook1/2·hero2·lv150.
- 비행장 창은 `UI.skyDest`(열린 섬 칩) → `skyDestOf()`로 보낸다. 하늘 지도 MAP_NODES_SKY thunder(196,44)/ruins(198,118)/stargarden(50,40), skyMapArt에 섬 셋과 하늘길.
- 고친 버그: 부활(resurrect)이 지난 틱에 쓰러진 동료를 못 찾던 것(battle의 team은 산 사람만 → core.js `TEAM_ALL` WeakMap·`downedOf(e, team)`, maxHp는 derive로), 유물 `hp` 키가 derive에 안 들어가던 것(세계수의 씨앗). 
- 시험: `scratchpad/sky31/logic31.py`(날씨·체질·야영·요리·속성·면역 물러나기·전직·인원·편성·일괄 판매·교역·이전), `ui31.py`(상태줄·날씨 창·교역 탭·도시락·편성·주방·교역 원정·도감·2차 각성·창고), `ui31b.py`(전투 창 큰 그림: 비 오는 교역로·폭설), 밸런스 `fieldsim31.py`(섬 셋 Lv123/133/143)·`classsim31.py`(새 직업), 그림 `sheet31.py`. 전체 `scratchpad/run31.sh`. **고친 뒤에는 `node --check src/*.js`로 문법부터 본다**(하네스는 문법 오류를 잡아도 어디인지 안 알려 준다).

## 빌드·배포
- `python3 build.py` → `dist/play.html`(아티팩트), `dist/web/index.html`; APK는 GitHub Actions(빌드 번호 = run number, 태그 `build-N`). 릴리스 조회는 `gh api repos/.../releases/tags/build-N`, 자산은 `-H "Accept: application/octet-stream"`.
- 시험: `scratchpad/v7/t/uitest7.py · fresh7.py · perf7.py`, 영웅 화면 `scratchpad/hero/herotest.py`, 원정 창 `scratchpad/front/exptest.py`, 도감 `scratchpad/front/dextest.py`, 마계·창고·전직 `scratchpad/demon/demontest.py`(UI)와 `scratchpad/demon/logic.py`(함수 직접 호출).
- 커밋 끝에 그때 세션이 알려 주는 `Co-Authored-By:` 줄(모델 이름은 세션마다 다르다)과 `Claude-Session:` 줄.
