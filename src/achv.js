/* ───────── 업적: 영구 목표. 채우면 돈·명성·물건을 받는다 (상단 창 → 업적) ─────────
   get()은 지금 값, need는 목표. 원정에서 돌아올 때·날이 바뀔 때·창에서 무언가를 할 때 achvTick()이 확인한다. */
Object.assign(WIN_TITLE, { achv: '업적' });
const maxLv = () => Math.max(0, ...S.advs.map(a => a.lv));
const anyGear = f => gearsAll().some(x => f(x.g));
const ACHV = [
  // 사냥
  { id: 'kill1', cat: '사냥', name: '첫 사냥', desc: '몬스터 100마리 처치', need: 100, get: () => S.stats.kills || 0, rw: { gold: 500 } },
  { id: 'kill2', cat: '사냥', name: '사냥꾼', desc: '몬스터 1,000마리 처치', need: 1000, get: () => S.stats.kills || 0, rw: { gold: 2000, fame: 5 } },
  { id: 'kill3', cat: '사냥', name: '학살자', desc: '몬스터 10,000마리 처치', need: 10000, get: () => S.stats.kills || 0, rw: { gold: 10000, fame: 20, item: ['wizstone', 1] } },
  { id: 'kill4', cat: '사냥', name: '몬스터의 악몽', desc: '몬스터 50,000마리 처치', need: 50000, get: () => S.stats.kills || 0, rw: { gold: 50000, fame: 50, item: ['wizstone', 2] } },
  { id: 'boss1', cat: '사냥', name: '우두머리 사냥', desc: '우두머리·주인 10마리 처치', need: 10, get: () => S.stats.bosses || 0, rw: { gold: 1500, fame: 5 } },
  { id: 'boss2', cat: '사냥', name: '우두머리의 천적', desc: '우두머리·주인 100마리 처치', need: 100, get: () => S.stats.bosses || 0, rw: { gold: 8000, fame: 15, item: ['rune_atk_1', 1] } },
  { id: 'boss3', cat: '사냥', name: '왕 사냥꾼', desc: '우두머리·주인 500마리 처치', need: 500, get: () => S.stats.bosses || 0, rw: { gold: 30000, fame: 30, item: ['wizstone', 1] } },
  { id: 'dun1', cat: '사냥', name: '첫 공략', desc: '던전 1곳 공략', need: 1, get: () => S.stats.dungeons || 0, rw: { gold: 3000, fame: 10 } },
  { id: 'dun2', cat: '사냥', name: '던전 탐험가', desc: '던전 3곳 공략', need: 3, get: () => S.stats.dungeons || 0, rw: { gold: 8000, fame: 15, item: ['rune_hp_1', 1] } },
  { id: 'dun3', cat: '사냥', name: '봉인을 찾는 자', desc: '던전 6곳 공략', need: 6, get: () => S.stats.dungeons || 0, rw: { gold: 20000, fame: 25, item: ['wizstone', 1] } },
  { id: 'dun4', cat: '사냥', name: '마계의 정복자', desc: '던전 9곳 공략', need: 9, get: () => S.stats.dungeons || 0, rw: { gold: 60000, fame: 40, item: ['wizstone', 2] } },
  { id: 'raid1', cat: '사냥', name: '거인 사냥', desc: '레이드 몬스터 1마리 처치', need: 1, get: () => S.stats.raids || 0, rw: { gold: 5000, fame: 15 } },
  { id: 'raid2', cat: '사냥', name: '거인들의 공포', desc: '레이드 몬스터 5마리 처치', need: 5, get: () => S.stats.raids || 0, rw: { gold: 25000, fame: 30, item: ['rune_crit_1', 1] } },
  { id: 'wave1', cat: '사냥', name: '성문의 수호자', desc: '몬스터 웨이브 방어 1번', need: 1, get: () => S.stats.waves || 0, rw: { gold: 3000, fame: 10 } },
  { id: 'wave2', cat: '사냥', name: '하르겐의 방패', desc: '몬스터 웨이브 방어 5번', need: 5, get: () => S.stats.waves || 0, rw: { gold: 15000, fame: 25, item: ['rune_def_1', 1] } },
  // 장사
  { id: 'earn1', cat: '장사', name: '첫 금화 자루', desc: '누적 수입 10,000G', need: 10000, get: () => S.stats.earned || 0, rw: { gold: 1000 } },
  { id: 'earn2', cat: '장사', name: '이름난 상인', desc: '누적 수입 100,000G', need: 100000, get: () => S.stats.earned || 0, rw: { gold: 5000, fame: 10 } },
  { id: 'earn3', cat: '장사', name: '금고가 넘친다', desc: '누적 수입 1,000,000G', need: 1000000, get: () => S.stats.earned || 0, rw: { gold: 30000, fame: 20, item: ['wizstone', 1] } },
  { id: 'earn4', cat: '장사', name: '제국의 큰손', desc: '누적 수입 10,000,000G', need: 10000000, get: () => S.stats.earned || 0, rw: { gold: 200000, fame: 50, item: ['wizstone', 2] } },
  { id: 'sale1', cat: '장사', name: '단골 손님', desc: '진열대에서 100개 판매', need: 100, get: () => S.stats.sales || 0, rw: { gold: 800 } },
  { id: 'sale2', cat: '장사', name: '장사 잘되는 집', desc: '진열대에서 1,000개 판매', need: 1000, get: () => S.stats.sales || 0, rw: { gold: 5000, fame: 10 } },
  { id: 'sale3', cat: '장사', name: '오물거리의 명물', desc: '진열대에서 10,000개 판매', need: 10000, get: () => S.stats.sales || 0, rw: { gold: 40000, fame: 30, item: ['wizstone', 1] } },
  { id: 'req1', cat: '장사', name: '믿을 만한 상단', desc: '의뢰 10개 완료', need: 10, get: () => S.stats.reqs || 0, rw: { gold: 1500, fame: 5 } },
  { id: 'req2', cat: '장사', name: '의뢰 전문', desc: '의뢰 50개 완료', need: 50, get: () => S.stats.reqs || 0, rw: { gold: 6000, fame: 15 } },
  { id: 'req3', cat: '장사', name: '왕국이 찾는 상단', desc: '의뢰 200개 완료', need: 200, get: () => S.stats.reqs || 0, rw: { gold: 25000, fame: 30, item: ['rune_matk_1', 1] } },
  { id: 'fame1', cat: '장사', name: '소문난 상단', desc: '상단 명성 1,000', need: 1000, get: () => Math.floor(S.fame), rw: { gold: 5000 } },
  { id: 'fame2', cat: '장사', name: '제국이 아는 이름', desc: '상단 명성 5,000', need: 5000, get: () => Math.floor(S.fame), rw: { gold: 30000, item: ['wizstone', 1] } },
  { id: 'rankC', cat: '장사', name: '큰 상단', desc: '상단 C랭크', need: 3, get: () => S.rank || 0, rw: { gold: 5000, fame: 10 } },
  { id: 'rankS', cat: '장사', name: '전설의 상단', desc: '상단 S랭크', need: 6, get: () => S.rank || 0, rw: { gold: 100000, fame: 50, item: ['wizstone', 2] } },
  // 모험가
  { id: 'lv30', cat: '모험가', name: '한몫하는 모험가', desc: '모험가 Lv30', need: 30, get: maxLv, rw: { gold: 2000 } },
  { id: 'lv60', cat: '모험가', name: '베테랑', desc: '모험가 Lv60', need: 60, get: maxLv, rw: { gold: 8000, fame: 10 } },
  { id: 'lv100', cat: '모험가', name: '전설의 모험가', desc: '모험가 Lv100', need: 100, get: maxLv, rw: { gold: 30000, fame: 30, item: ['wizstone', 1] } },
  { id: 'advs', cat: '모험가', name: '북적이는 여관', desc: '모험가 8명', need: 8, get: () => S.advs.length, rw: { gold: 3000, fame: 5 } },
  { id: 'job2', cat: '모험가', name: '첫 전직', desc: '2차 직업 모험가 1명', need: 1, get: () => S.advs.filter(a => jobTier(a.cls) >= 2).length, rw: { gold: 3000, fame: 10 } },
  { id: 'job3', cat: '모험가', name: '정점에 선 자', desc: '3차 직업 모험가 1명', need: 1, get: () => S.advs.filter(a => jobTier(a.cls) >= 3).length, rw: { gold: 10000, fame: 20 } },
  { id: 'hero', cat: '모험가', name: '용사의 탄생', desc: '각성한 용사 1명', need: 1, get: () => S.advs.filter(a => a.hero).length, rw: { gold: 30000, fame: 30, item: ['wizstone', 1] } },
  { id: 'lic', cat: '모험가', name: '백금 라이선스', desc: '백금 라이선스 모험가 1명', need: 1, get: () => S.advs.filter(a => (a.rank || 0) >= LICENSE.length - 1).length, rw: { gold: 20000, fame: 20 } },
  { id: 'sklv5', cat: '모험가', name: '스킬의 달인', desc: '스킬 하나를 Lv5까지', need: 1, get: () => S.advs.filter(a => a.sl && Object.values(a.sl).some(v => v >= SK_LV_MAX)).length, rw: { gold: 5000, fame: 10 } },
  { id: 'hall1', cat: '모험가', name: '첫 동상', desc: '명예의 전당 동상 1개', need: 1, get: () => (S.hall || []).length, rw: { gold: 20000, fame: 20 } },
  { id: 'arena1', cat: '모험가', name: '모래판의 신참', desc: '투기장 10승', need: 10, get: () => (S.under && S.under.arena && S.under.arena.wins) || 0, rw: { gold: 2000 } },
  { id: 'arena2', cat: '모험가', name: '투기장의 별', desc: '투기장 100승', need: 100, get: () => (S.under && S.under.arena && S.under.arena.wins) || 0, rw: { gold: 15000, fame: 20, item: ['rune_eva_1', 1] } },
  // 살림
  { id: 'pet1', cat: '살림', name: '첫 펫', desc: '펫 1마리 부화', need: 1, get: () => (S.pets || []).length + (S.dex && S.dex.pets ? Object.keys(S.dex.pets).length : 0), rw: { gold: 2000 } },
  { id: 'pet2', cat: '살림', name: '다 컸구나', desc: '펫 진화 1마리', need: 1, get: () => (S.pets || []).filter(x => x.stage).length, rw: { gold: 8000, fame: 10 } },
  { id: 'plus10', cat: '살림', name: '빛나는 장비', desc: '장비 +10 강화', need: 1, get: () => (anyGear(g => (g.plus || 0) >= 10) ? 1 : 0), rw: { gold: 10000, fame: 15 } },
  { id: 'legend', cat: '살림', name: '전설을 손에', desc: '전설 등급 이상 장비 1점', need: 1, get: () => (anyGear(g => (g.q || 0) >= 4) ? 1 : 0), rw: { gold: 5000 } },
  { id: 'dex1', cat: '살림', name: '도감 수집가', desc: '몬스터 완전 기록 10종', need: 10, get: () => Object.values((S.dex && S.dex.kills) || {}).filter(n => n >= DEX_K[3]).length, rw: { gold: 5000, fame: 10 } },
  { id: 'dex2', cat: '살림', name: '몬스터 박사', desc: '몬스터 완전 기록 30종', need: 30, get: () => Object.values((S.dex && S.dex.kills) || {}).filter(n => n >= DEX_K[3]).length, rw: { gold: 20000, fame: 20, item: ['wizstone', 1] } },
  { id: 'bld', cat: '살림', name: '번듯한 상단', desc: '시설 단계 합 20', need: 20, get: () => Object.values(S.bld || {}).reduce((s, v) => s + (v || 0), 0), rw: { gold: 5000, fame: 10 } },
  { id: 'bld2', cat: '살림', name: '하르겐의 랜드마크', desc: '시설 단계 합 50', need: 50, get: () => Object.values(S.bld || {}).reduce((s, v) => s + (v || 0), 0), rw: { gold: 40000, fame: 30, item: ['wizstone', 1] } },
  // 빌드 31
  { id: 'trade1', cat: '장사', name: '첫 교역', desc: '교역로로 이웃 나라에 한 번 다녀오기', need: 1, get: () => S.stats.trades || 0, rw: { gold: 3000, fame: 5 } },
  { id: 'trade2', cat: '장사', name: '대상단', desc: '교역 20번', need: 20, get: () => S.stats.trades || 0, rw: { gold: 30000, fame: 20 } },
  { id: 'cook1', cat: '살림', name: '첫 도시락', desc: '주방에서 요리 10번', need: 10, get: () => S.stats.cooked || 0, rw: { gold: 2000 } },
  { id: 'cook2', cat: '살림', name: '상단의 요리사', desc: '주방에서 요리 200번', need: 200, get: () => S.stats.cooked || 0, rw: { gold: 15000, fame: 10 } },
  { id: 'hero2', cat: '모험가', name: '한계를 넘어', desc: '2차 각성한 초월 용사 1명', need: 1, get: () => S.advs.filter(a => a.hero2).length + ((S.hall || []).filter(h => h.hero2).length), rw: { gold: 50000, fame: 50, item: ['wizstone', 1] } },
  { id: 'lv150', cat: '모험가', name: '별에 닿다', desc: '모험가 Lv150', need: 1, get: () => (S.advs.some(a => a.lv >= 150) || (S.hall || []).some(h => h.lv >= 150) ? 1 : 0), rw: { gold: 100000, fame: 80, item: ['bloomstone', 1] } }
];
const ACHV_CATS = ['사냥', '장사', '모험가', '살림'];
const achvDone = () => Object.keys(S.achv || {}).length;
function achvCur(A) { try { return Math.min(A.need, A.get() || 0); } catch (_) { return 0; } }
function achvGrant(A) {
  const R = A.rw, got = [];
  if (R.gold) { S.gold += R.gold; S.stats.earned += R.gold; got.push(`${fmt(R.gold)}G`); }
  if (R.fame) { S.fame += R.fame; got.push(`명성 +${R.fame}`); }
  if (R.item && ITEMS[R.item[0]]) { addTo(S.inv, R.item[0], R.item[1]); got.push(`${ITEMS[R.item[0]].name} ${R.item[1]}개`); }
  log(`업적 「${A.name}」 달성! ${A.desc} · 보상 ${got.join(', ')}`, 'good');
  HOOKS.toast(`업적 달성 · ${A.name}`);
}
// 채운 업적이 있으면 보상을 주고 수를 돌려준다
function achvTick() {
  if (!S) return 0;
  S.achv = S.achv || {};
  let n = 0;
  for (const A of ACHV) { if (S.achv[A.id]) continue; if (achvCur(A) >= A.need) { S.achv[A.id] = today() + 1; achvGrant(A); n++; } }   // 날짜 +1을 적어 0일에도 참이 되게
  if (n) changed();
  return n;
}
const rwText = R => [R.gold ? `${fmt(R.gold)}G` : '', R.fame ? `명성 +${R.fame}` : '', R.item && ITEMS[R.item[0]] ? `${ITEMS[R.item[0]].name} ${R.item[1]}` : ''].filter(Boolean).join(' · ');
PANELS.achv = () => {
  S.achv = S.achv || {};
  const groups = ACHV_CATS.map(cat => {
    const list = ACHV.filter(A => A.cat === cat), done = list.filter(A => S.achv[A.id]).length;
    const rows = list.map(A => { const ok = !!S.achv[A.id], cur = ok ? A.need : achvCur(A), pc = Math.round(cur / A.need * 100);
      return `<div class="li col achv${ok ? ' ok' : ''}"><div class="row"><div class="grow stack"><span>${ok ? '<span class="tag ok-t">달성</span> ' : ''}${A.name} <span class="muted">· ${A.desc}</span></span><span class="sub ${ok ? 'muted' : ''}">보상 ${rwText(A.rw)}${ok ? ` · ${dayLabel(S.achv[A.id] - 1)}` : ''}</span></div><b class="num">${ok ? '' : `${fmt(cur)}/${fmt(A.need)}`}</b></div><div class="bar"><i style="width:${pc}%"></i></div></div>`; }).join('');
    return `<details class="card"${done < list.length ? ' open' : ''}><summary>${cat} <span class="muted">${done}/${list.length}</span></summary><div class="list">${rows}</div></details>`;
  });
  return `<div class="card hl"><div class="h">업적 <small>${achvDone()}/${ACHV.length}</small></div><div class="sub">상단을 키우며 자연히 채워지는 목표예요. 채우면 돈·명성·마법사의 돌·룬을 받아요. 원정에서 돌아올 때, 날이 바뀔 때, 창에서 무언가를 할 때 확인해요.</div></div>${groups.join('')}`;
};
