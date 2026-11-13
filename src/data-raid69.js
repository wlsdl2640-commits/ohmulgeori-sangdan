/* ───────── 빌드 69: 레이드 개편 · 누구나 Lv200 (11-13 21:22 · 23:06 사용자) ─────────
   「모든 모험가의 lv을 200까지 열어」 → data-rpg.js MAX_LV 200 · data-star.js lvCap (4차만 200이던 것을 모두).
   「모든 레이드는, 풀파티 원정대 4개이상을 투입해야 레이드참여가 되고」 · 「전부 고렙으로 10lv차이씩 두고 넣자」
     → 레이드 Lv150 · 160 · 170 · 180 · 190. 원정대 창 「레이드」 탭에서 전투원(짐꾼 계열 빼고)이 다 찬 파티 넷 이상을 골라 함께 보낸다(qol.js raidLaunch).
       한 파티씩은 못 간다(core.js startExp). 함께 떠난 파티들은 레이드 원정대(e.grp)로 묶여 가장 느린 파티 빠르기로 같이 걸어간다(stepRaid).
   「베이모스는 이제 하늘맵에서 나와」 → 베히모스 레이드 터는 구름섬 하늘(그림 bg 'sky'), 지도에서는 하늘 지도에. 비행장의 레이드 비행선이 파티들을 태워 간다(비행장이 있어야 함).
   레이드대(빌드 36 — S랭크에 열리던 짐꾼 포함 10명 레이드 전용 파티)는 없앴다: 옛 저장의 레이드대는 econ.js raid69()가 풀어 모험가를 대기 중으로 돌린다.
   레이드 원정대 창(사용자 「레이드 원정대 창은 r2로」): 작은 창을 밀어 넘기면 파티마다 한 칸씩 네 칸(view.js drawRaidPip · ui.js pip 넘기기). */
const RAID_LV69 = { kingslime: 150, kaishar: 160, griffon: 170, tempest: 180, behemoth: 190 };
const RAID_MIN_PARTIES = 4;   // 함께 보내야 하는 파티 수 — 전투원이 PARTY_FIGHTERS(4)명 다 찬 파티만 센다 (짐꾼은 있어도 되고 없어도 된다)
const RAID_MAX_PARTIES = 6;   // 일반 파티는 6개까지라 한 번에 많아야 여섯
for (const [id, lv] of Object.entries(RAID_LV69)) {
  const R = RAIDS[id], F = FIELDS['raid_' + id];
  R.lv0 = R.lv; R.lv = lv; F.lv = lv;
}
// 베히모스는 하늘에: 레이드 무대는 구름섬 하늘 · 하늘 지도 · 비행장이 있어야
Object.assign(RAIDS.behemoth, { bg: 'sky', sky: 1, desc: '구름섬 위 하늘을 떠다니는 거대한 고래. 눈이 넷, 지느러미가 수없이 많다. 비행장의 레이드 비행선을 타고 간다.' });
Object.assign(FIELDS.raid_behemoth, { bg: 'sky', skyRaid: 1, desc: RAIDS.behemoth.desc });
FIELDS.raid_behemoth.dungeon.bg = 'sky';
const raidSky = id => !!(RAIDS[id] && RAIDS[id].sky);
// 킹슬라임 새 그림 (11-14 00:42 사용자 「킹슬라임B안」): 평원 초록 슬라임을 키운 꼴 + 머리 위 작은 왕관 + 몸속에 삼킨 장검 · 보물 상자 · 금화
//   그림은 pxraid.js PXRAID.kingslime(= tools/saved/raid69/kingslime.py B, 32×24 반 해상도 → 64×48). 색 · 설명도 초록 슬라임에 맞춘다.
Object.assign(RAIDS.kingslime, { c: '#5fbf5a', desc: '평원의 초록 슬라임이 모두 모여 하나가 된 괴물. 머리에 작은 왕관을 얹었고, 투명한 몸속에 삼킨 장검 · 보물 상자 · 금화가 비친다.' });
Object.assign(FIELDS.raid_kingslime, { desc: RAIDS.kingslime.desc });
Object.assign(MONS.kingslime, { W: 64, H: 48, body: '#5fbf5a', dark: '#3f8f3c' });
// 레이드 HP · 세기 (빌드 69 측정 scratchpad/v88/rhp88.js — 레이드 레벨 파티 넷(3차 Lv150 ~ 190 · 스킬 3단계 · 숙련도 3 · 고급 장비)이 한 번 도전(90초)에
//   예전 식 raidHp(Lv)의 97% · 69% · 63% · 45% · 41%를 깎고 아무도 안 쓰러졌다 → HP를 따로 정하고(한 번에 8% ~ 4%) 한 방 세기도 올린다)
//   다시 잰 값(DIFF.hp 1.22 포함): 레이드 레벨 파티 넷이 한 번에 킹슬라임 6.5% · 카이샤르 5.0% · 대그리핀 4.9% · 템페스트 3.8% · 베히모스 3.7%, 한 방 ×2.0이면 90초에 최대 HP의 12 ~ 26%를 맞는다
const RAID69 = { hp: { kingslime: 2.6e8, kaishar: 2.7e8, griffon: 2.8e8, tempest: 2.9e8, behemoth: 3.0e8 }, atk: 2.0 };
const raidMaxHp = id => (RAID69.hp[id] ? Math.round(RAID69.hp[id] * DIFF.hp / 1e5) * 1e5 : raidHp(RAIDS[id].lv));

STORY.v69c = [
  '모험가는 이제 누구나 Lv200까지 자란다. (4차 전직만 Lv200이던 것을 모두에게 열었다.)',
  `레이드가 바뀌었다: 레이드 몬스터는 모두 Lv150 ~ 190(킹슬라임 150 · 카이샤르 160 · 대그리핀 170 · 템페스트 드래곤 180 · 베히모스 190). 이제 한 파티로는 못 가고, 원정대 창의 「레이드」 탭에서 전투원 넷이 다 찬 파티 ${RAID_MIN_PARTIES}개 이상을 골라 함께 보낸다.`,
  '베히모스는 이제 구름섬 하늘에 나온다 — 하늘 지도에 보이고, 비행장의 레이드 비행선이 파티들을 태워 간다.',
  '레이드 전용 파티 「레이드대」는 없앴다. 레이드대에 있던 모험가는 대기 중으로 돌아왔다.',
  '레이드 원정대가 나가 있으면 작은 원정 창을 옆으로 밀어 레이드 원정대 창(파티마다 한 칸)을 볼 수 있다.'
];
