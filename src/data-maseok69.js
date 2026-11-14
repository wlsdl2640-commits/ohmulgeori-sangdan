/* ───────── 빌드 69: 장비 9칸 · 마석 여덟 (11-13 21:22 · 23:06 · 11-14 00:42 사용자) ─────────
   칸: data-rpg.js runeSlots · msSlots · srcSlots — 레어도마다 한 칸씩 (일반 · 고급 · 희귀 = 룬 1 · 2 · 3 / 영웅 · 전설 · 신화 = 마석 1 · 2 · 3 / 신성 · 우주 · 창조 = 원천물 1 · 2 · 3).
   마석(사용자 「마석은 보석 원형 그대로 · 여러 등급을 없애고 에픽으로 고정 · 호박은 안에 발톱 · 큼지막한 보석」 → 00:42 「마석은 아까 나온 시안2로」):
     영웅 등급 하나뿐. 그림 data-maseokart.js(= tools/saved/stoneart69/export_maseok.py — maseok2.py 시안 2 그대로).
     효과는 모험가가 장비마다 낀 마석을 모두 더하고, 효과마다 상한이 있다(여섯 개 몫 — 같은 마석을 여섯 넘게 껴도 더 오르지 않는다).
     전투: core.js deriveBase(회피 — 11-14 12:18부터 회피 합 50% 안 · 막기 · 반격에 더함 + msDmg · msRefl · msShield · msEnd · msHide) · hitAdv(받는 피해 · 버티기 · 반사) · pickTarget(은신) · ev 'spawn'(싸움 시작 보호막).
   얻는 곳: 11-14 사용자 「마석은, 지하미궁에서만 나옴, 확률 극악」 — 지하미궁(아직 없음) 층 보스만. 그래서 지금은 얻는 곳이 없다
     (11-14 00:42 판의 필드 우두머리 · 주인 · 던전 주인 · 희귀종 · 보물고 · 레이드 보상은 껐다 — core.js msGot은 지하미궁이 부를 것).
   끼우기 · 빼기: 장비 칸 창(panels.js PANELS.rune · econ.js msIn · msOut — 빼는 값 MASEOK_OUT, 빼면 창고로). 마탑 「장비 칸」 목록 · 모험가 창 장비 탭에서 연다.
   원천물은 칸만 보인다 — 원천물 아이템은 아직 없다(강하고 특별한 몬스터에게서 아주 드물게, 새 땅과 함께). */
const MASEOK = {
  moon:  { name: '환영의 문스톤',       kind: '회피',      v: 0.02, cap: 0.12, c: '#9cbede', eff: '회피 +2%p (기본 공격을 비껴감 · 회피는 모두 더해 50%까지)', capT: '회피 +12%p',           desc: '둥근 알 위쪽을 푸른 빛 결이 가로지른다. 노리는 눈을 흐려 기본 공격을 비껴가게 한다.' },
  sapph: { name: '결계의 사파이어',     kind: '막기',      v: 0.02, cap: 0.12, c: '#3a64d8', eff: '막을 확률 +2%p (막으면 피해 1/4)',         capT: '막을 확률 +12%p',      desc: '쿠션 컷 위에 결계 고리가 떠 있다. 막아 낸 한 방은 4분의 1만 들어온다.' },
  garn:  { name: '역류의 가넷',         kind: '반격',      v: 0.03, cap: 0.18, c: '#a81e32', eff: '반격 확률 +3%p',                          capT: '반격 확률 +18%p',      desc: '세모꼴 가넷 가운데에 거꾸로 선 작은 세모 — 맞은 만큼 되받아친다.' },
  dia:   { name: '수호진의 다이아몬드', kind: '피해 감소', v: 0.02, cap: 0.12, c: '#bcd2ec', eff: '받는 피해 −2%',                           capT: '받는 피해 −12%',       desc: '옆에서 본 브릴리언트 컷. 다섯 면에 새긴 수호진이 받는 피해를 깎는다.' },
  opal:  { name: '거울 마법의 오팔',    kind: '반사',      v: 0.04, cap: 0.24, c: '#bcb2d8', eff: '받은 피해의 4%를 때린 적에게 되돌려 줌',   capT: '반사 24%',             desc: '달걀꼴 알에 무지갯빛 점이 가득하다. 받은 피해의 일부를 거울처럼 되돌린다.' },
  aqua:  { name: '방벽의 아쿠아마린',   kind: '보호막',    v: 0.03, cap: 0.18, c: '#58c8c4', eff: '싸움을 시작할 때 최대 HP 3% 보호막',      capT: '보호막 최대 HP 18%',   desc: '긴 팔각으로 깎은 돌에 세로 빛줄. 싸움이 시작되면 물빛 방벽이 몸을 감싼다.' },
  amber: { name: '불멸의 호박',         kind: '버티기',    v: 0.08, cap: 0.48, c: '#e08a1c', eff: '쓰러질 한 방을 HP 1로 버틸 확률 8% (싸움마다 한 번)', capT: '버틸 확률 48%', desc: '속이 비치는 호박 안에 짐승 발톱이 갇혀 있다. 쓰러질 한 방을 한 번 버티게 한다.' },
  obsid: { name: '은신의 흑요석',       kind: '은신',      v: 0.05, cap: 0.30, c: '#5a4a8a', eff: '적에게 노려질 확률 −5%',                  capT: '노려질 확률 −30%',     desc: '끝이 뾰족한 흑요석 속에 보랏빛 연기 한 줄기 — 적의 눈길이 비껴간다.' }
};
const MASEOK_IDS = Object.keys(MASEOK);
const MASEOK_V = 2500;      // 기준가 (길드에 팔면 그 몫)
const MASEOK_OUT = 10000;   // 장비에서 빼는 값 (빼면 창고로)
MASEOK_IDS.forEach(k => { const M = MASEOK[k]; ITEMS['ms_' + k] = { name: M.name, v: MASEOK_V, w: 1, icon: 'gem', c: M.c, maseok: k, g: 3, desc: M.desc }; });   // g 3 = 영웅 (레어도 고정)
const MASEOK_DROP = { lab: 0.003 };   // 지하미궁 층 보스 하나에 (「확률 극악」 — 숫자는 지하미궁을 넣을 때 사용자와 정한다, 0.3%는 자리만)
const msItem = () => 'ms_' + pickOne(MASEOK_IDS);
const msKey = id => (ITEMS[id] && ITEMS[id].maseok) || null;
function msCounts(a) {   // 모험가가 끼운 장비의 마석 수 (효과마다)
  const c = {};
  for (const [slot] of SLOTS) { const g = a.eq && a.eq[slot]; if (!g || !g.ms || !g.ms.length) continue; for (const id of g.ms) { const k = msKey(id); if (k) c[k] = (c[k] || 0) + 1; } }
  return c;
}
const msVal = (c, k) => Math.min(MASEOK[k].cap, (c[k] || 0) * MASEOK[k].v);
const msPct = v => Math.round(v * 1000) / 10 + '%';
const msEffTxt = k => `${MASEOK[k].kind} — 한 개: ${MASEOK[k].eff} · 합쳐서 ${MASEOK[k].capT}까지`;
const slot9Txt = q => { const g = { base: 'sword', q }; return [['룬', runeSlots(g)], ['마석', msSlots(g)], ['원천물', srcSlots(g)]].filter(x => x[1]).map(([n, v]) => `${n} ${v}칸`).join(' · '); };
STORY.v69d = [
  '장비 칸이 바뀌었다 — 레어도마다 한 칸씩 열려 모두 9칸이다: 일반 · 고급 · 희귀 = 룬 1 · 2 · 3칸, 영웅 · 전설 · 신화 = 마석 1 · 2 · 3칸, 신성 · 우주 · 창조 = 원천물 1 · 2 · 3칸. 룬은 이제 3칸까지(일반 장비에도 한 칸).',
  '새 아이템 「마석」 여덟 가지(모두 영웅 등급): 환영의 문스톤(회피) · 결계의 사파이어(막기) · 역류의 가넷(반격) · 수호진의 다이아몬드(받는 피해 −) · 거울 마법의 오팔(반사) · 방벽의 아쿠아마린(싸움 시작 보호막) · 불멸의 호박(버티기) · 은신의 흑요석(은신). 한 모험가가 낀 마석을 모두 더하되, 효과마다 여섯 개 몫까지만 오른다.',
  `마석은 지하미궁(하르겐 지하 깊은 곳 — 아직 열리지 않았다)에서만 아주 드물게 나온다. 마탑의 「장비 칸」 목록이나 모험가 창 장비 탭에서 끼운다(빼는 값 ${MASEOK_OUT.toLocaleString('ko-KR')}G, 빼면 창고로).`,
  '원천물 칸은 신성 장비부터 보인다 — 원천물은 아직 없다(강하고 특별한 몬스터가 아주 드물게 남길 예정).',
  '대형이 바뀌었다: 근접은 맨 앞(셋까지 — 넷째부터는 가운데 줄 맨 앞), 원거리 · 마법은 가운데, 힐러는 그 뒤, 짐꾼 계열(음유시인 · 정찰가 · 마부 …)은 늘 맨 뒤. 줄 사이도 넓어졌다.',
  '킹슬라임이 평원의 초록 슬라임을 크게 키운 모습으로 바뀌었다 — 머리에 작은 왕관, 몸속에 삼킨 장검 · 보물 상자 · 금화.',
  '암살자 길드 자릿세에 그달 상점(진열대) 판매액의 3%가 더해진다 — 300G + 명성 25마다 50G + 판매액의 3%.'
];
