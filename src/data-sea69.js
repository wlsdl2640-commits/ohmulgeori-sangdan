/* ───────── 해룡 · 해룡기수 (빌드 69, 11-14 15:54 사용자 답 — 계획 문서 「물어볼 것 (11-14 오후)」) ─────────
   「해룡 알 얻는 곳 — 1번으로」 · 「해룡 몬스터 · 새끼 펫 그림 — 이대로 하고, 30LV에 해룡의 모습으로」 · 「해룡기수 — 그렇게 넣자」
   · 몬스터 해룡(seadragon): 심해(Lv150 ~ 170 — 아직 없는 땅, 새 땅 차례에 FIELDS.deepsea.mons에 넣는다)의 야생 해룡.
     모습 넷 A 산호 · B 해초 · C 심해 · D 진주 = PXU_SKIN(그림 pxsea69.js ← tools/saved/ride69/seadragon_mon.json, 탈것 몸에서 안장을 뺀 것).
   · 펫 넷(seadragon · seadragon_b · _c · _d): 그 모습의 해룡 알 → 새끼 해룡 → Lv30에 그 모습의 해룡으로 자란다(PET_EVO_LV).
     알은 심해의 해룡이 다른 펫 알과 같은 몫으로 떨어뜨린다(pet.js petKill: 쓰러뜨린 해룡의 모습을 이어받는다) — 심해가 열리기 전에는 얻는 곳이 없다.
   · 해룡기수(seadragoon): 용기수 다음 4차. 4차 공통 + 해룡 펫 Lv30 하나를 보내면 그 해룡이 탈것(RIDE65.sea, 모습 그대로 — econ.js promote).
     떠 있어 기본 공격을 안 맞고(혼자 남으면 풀림) 대형 맨 뒷줄 · 복합궁 · 기마술. 기수 그림 · 스킬 그림은 시안부터(그때까지 용기수 그림을 바다빛으로 · 예전 글리프).
   build.py에서 data-monup69.js 다음 · data-store.js 앞 (스킬북 뽑기 · 레어도 표가 새 스킬과 알을 보게). */

// ── 몬스터
MONS.seadragon = { name: '해룡', plan: 'flyer', body: '#e8724a', dark: '#b44a2a', beak: '#f0e0c8', big: 1, mh: 2.6, ma: 2.3, md: 1.8, spd: 1.0, eva: 0.1, minS: 1,
  sta: { k: 'chill', p: 0.25, d: 5, m: 0 }, drops: [['sea_kelp', 0.3], ['sea_clam', 0.2]] };
Object.assign(MONS.seadragon, { ty: ['dragon'], el: ['water'], fly: 1 });
FLY.push('seadragon');
MON_SK.seadragon = [['bite', '해룡의 이빨'], ['breath', '물기둥', { mult: 0.7 }], ['shield', '거품 막']];
MONS.seadragon.msk = MON_SK.seadragon.map(([tpl, name, o], i) => {
  const s = Object.assign({}, MSK[tpl], o || {}, { id: tpl + i, tpl, name: name || MSK[tpl].name });
  if (s.el === 'self') { s.el = null; s.self = 1; }
  return s;
});
// 모습 넷 (그림 · 이름표는 pxsea69.js) — [모습, id 꼬리, 이름, 알 색]
const SEA_LOOKS = [['A', '', '산호', '#e8724a'], ['B', '_b', '해초', '#8aa040'], ['C', '_c', '심해', '#3e3a8e'], ['D', '_d', '진주', '#ece4f2']];
const seaKind = L => 'seadragon' + (SEA_LOOKS.find(x => x[0] === L) || SEA_LOOKS[0])[1];
const isSeaPet = k => !!(PETS[k] && PETS[k].sea);

// ── 펫 넷 · 알 넷
SEA_LOOKS.forEach(([L, sfx, nm, c]) => {
  const k = 'seadragon' + sfx;
  PETS[k] = { name: `새끼 ${nm} 해룡`, mon: 'seadragon', adult: k, field: 'deepsea', where: '심해', act: 'splash', pow: 1.3, cd: 4, likes: ['sea_mackerel', 'sea_kelp'], home: ['traffic', 0.05],
    evo: `${nm} 해룡`, c, magic: 1, fx: 'water', look: L, sea: 1, desc: `${nm} 해룡의 새끼. 물을 뿜어 모든 적을 적신다(물 속성). Lv30에 ${nm} 해룡으로 자라면 해룡기수(용기수 다음 4차)가 탈 수 있다.` };
  if (!PET_IDS.includes(k)) PET_IDS.push(k);
  ITEMS['egg_' + k] = { name: `${nm} 해룡 알 (?)`, v: 1200 + 160 * 60, w: 2, icon: 'egg', c, egg: k, use: 'egg',
    desc: `사육장에서 ${PET_HATCH_DAYS}일 품으면 판정 — 유정란이고 부화에 성공하면 ${PETS[k].name}이(가) 태어나고, 아니면 요리 재료 「무정란」이 된다. 심해의 ${nm} 해룡이 남긴다. ${PETS[k].desc}` };
});

// ── 해룡기수
CLASSES.seadragoon = SP({ name: '해룡기수', tier: 4, from: 'dragoon', carry: 14, base: { str: 12, vit: 10, agi: 12, int: 3 }, grow: { str: 2.3, vit: 1.9, agi: 2.3, int: 0.4 }, spd: 1.1, crit: 0.12, salary: 380,
  act: 'arrow', row: 2, innate: 'tidalshot', tunic: '#1f4a6a', trim: '#f0a070', tr: { pet: 0.5, combo: 0.08, baImm: 1 }, req: { petSea: PET_EVO_LV },
  desc: '해룡을 타고 공중을 헤엄치며 복합궁으로 쏜다(4차). 동료가 서 있는 동안 기본 공격에 맞지 않는다(해일 뒤 2초는 맞는다). 물 속성 피해 +15%, 연계 +8%.' });
(JOB_TREE.dragoon = JOB_TREE.dragoon || []).includes('seadragoon') || JOB_TREE.dragoon.push('seadragoon');
JOB_PARENT.seadragoon = 'dragoon';
if (!ALL_CLASS_IDS.includes('seadragoon')) ALL_CLASS_IDS.push('seadragoon');
JOB_TRAITS.seadragoon = { name: '해룡의 비늘', desc: '물 속성 피해 +15% · 화상 피해 −30%', el_water: 0.15, resBurn: 0.3 };
TRAITS.j_seadragoon = Object.assign({ job: 'seadragoon' }, JOB_TRAITS.seadragoon);
BIOS.seadragoon = ['바다 왕국의 배를 따라온 해룡과 함께 자랐다고 한다.'];
const seaMount = lv => (typeof S !== 'undefined' && S && S.pets ? petsAtHome().filter(x => isSeaPet(x.kind) && x.lv >= lv).sort((x, y) => x.lv - y.lv)[0] : null) || null;   // 가장 낮은 레벨부터 (파티 · 마차에 맨 펫은 빼고)

// ── 스킬 여섯 (배우는 레벨 150 고유 · 158 · 166 · 176 · 186 · 196 — 수치는 스킬 1단계, 모두 물 속성)
SK65('tidalshot', { name: '물살 화살', cls: ['seadragoon'], lv: 1, cost: { mp: 10 }, cd: 7, kind: 'dmg', mult: 1.8, hits: 3, tgt: 'pierce', el: 'water', fx: 'arrow',
  desc: '해룡이 뿜은 물살을 타고 화살 세 발 — 맨 앞 적과 그 뒤 적까지 꿰뚫는다. 물 속성.' });
SK65('bubbleprison', { name: '거품 감옥', cls: ['seadragoon'], lv: 158, cost: { mp: 24 }, cd: 18, kind: 'dmg', mult: 0.6, tgt: 'strong', el: 'water', fx: 'arrow', sta: { k: 'sleep', p: 1, d: 4, m: 0 },
  desc: '가장 센 적을 거품에 가둬 4초 동안 아무것도 못 하게 한다(맞으면 터진다 — 수면과 같음, 우두머리는 절반). 물 속성.' });
SK65('deepblood', { name: '깊은 바다의 피', cls: ['seadragoon'], lv: 166, passive: { crit: 0.06, spdPct: 0.1, el_water: 0.2 },
  desc: '치명타 6%p, 공격 속도 10%, 물 속성 피해 20%가 오른다.' });
SK65('tsunami', { name: '해일', cls: ['seadragoon'], lv: 176, cost: { mp: 40 }, cd: 20, kind: 'dmg', mult: 1.6, hits: 2, tgt: 'all', el: 'water', fx: 'arrow', sta: { k: 'chill', p: 0.3, d: 5, m: 0 },
  after: { stat: 'ground', add: 1, dur: 2, tgt: 'self' }, desc: '해룡이 해일을 일으켜 모든 적을 두 번 친다. 느려지게(냉기) 할 수 있다. 내려온 2초 동안은 기본 공격을 맞는다. 물 속성.' });
SK65('abyssroar', { name: '심해의 포효', cls: ['seadragoon'], lv: 186, cost: { mp: 36 }, cd: 30, kind: 'dmg', mult: 0.4, tgt: 'all', el: 'water', fx: 'arrow', sta: { k: 'fear', p: 0.3, d: 3, m: 0 },
  after: { stat: 'atk', mult: 1.15, dur: 10, tgt: 'party' }, after2: { stat: 'guard', add: 0.1, dur: 10, tgt: 'party' },
  desc: '해룡이 깊은 바다의 포효를 지른다 — 모든 적을 겁먹게 할 수 있고(30%, 3초), 10초 동안 파티의 공격력 +15% · 받는 피해 −10%.' });
SK65('searoyal', { name: '해룡왕의 화살', cls: ['seadragoon'], lv: 196, cost: { mp: 60 }, cd: 24, kind: 'dmg', mult: 9.0, boss: 1.3, tgt: 'strong', el: 'water', fx: 'arrow',
  desc: '하늘에서 물기둥과 함께 거대한 화살 한 발 — 가장 센 적에게 꽂힌다. 우두머리에게 1.3배. 물 속성.' });

STORY.v69f = [
  '해룡이 생겼다 — 심해(새 땅, 곧 열린다)를 헤엄치는 해마 꼴 용. 모습은 넷(산호 · 해초 · 심해 · 진주), 쓰러뜨리면 드물게 그 모습의 알을 남긴다.',
  '해룡 알을 사육장에서 깨워 Lv30까지 키우면 해룡으로 자란다. 해룡 펫 Lv30이 있으면 용기수가 4차 「해룡기수」로 전직할 수 있다 — 그 해룡이 탈것이 된다.'
];
