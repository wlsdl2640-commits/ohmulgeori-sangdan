/* ───────── 지도: 필드·던전·레이드를 골라 원정을 보내고, 왕국·단체와 이야기한다 ─────────
   지도 그림은 240×240 논리 픽셀(빌드 66부터 data-mapart.js 그림). 노드는 그 위에 HTML 단추로 얹는다. */
const MAP_W = 240, MAP_H = 240;   // 아래 40칸은 마계
const MAP_NODES = {
  plains:   { x: 84, y: 116, dun: [18, 10] },
  forest:   { x: 44, y: 76,  dun: [20, 12] },
  mountain: { x: 122, y: 58, dun: [20, 8] },
  valley:   { x: 176, y: 94, dun: [18, 12] },
  snow:     { x: 204, y: 40, dun: [-20, 12] },
  desert:   { x: 206, y: 150, dun: [-6, 18] },
  alley:    { x: 92, y: 164 },
  sewer:    { x: 150, y: 176, dun: [20, 0] },
  swamp:    { x: 44, y: 222, dun: [22, -8] },
  barren:   { x: 122, y: 224, dun: [24, -8] },
  castle:   { x: 200, y: 222, dun: [-24, -8] },
  // 북쪽 변경 (빌드 30)
  grave:    { x: 34, y: 112, dun: [-14, 14] },
  volcano:  { x: 158, y: 22, dun: [22, 10] },
  roots:    { x: 76, y: 34, dun: [-22, 8] }
};
// 하늘 지도 (구름섬): 따로 그린 지도 위에 놓인다
const SKY_MAP_W = 240, SKY_MAP_H = 150;
const MAP_NODES_SKY = { sky: { x: 118, y: 84, dun: [26, -14] }, thunder: { x: 196, y: 44, dun: [18, -16] }, ruins: { x: 198, y: 118, dun: [-22, -6] }, stargarden: { x: 50, y: 40, dun: [20, -14] } };
const MAP_KINGS = { inglisia: { x: 22, y: 134 }, frama: { x: 58, y: 186 }, elves: { x: 24, y: 48 }, dwarves: { x: 128, y: 26 }, sarak: { x: 226, y: 178 } };
const MAP_ORGS = {
  city:   { x: 120, y: 148, name: '제도 하르겐 · 모험가 길드', c: '#f0c24a', c2: '#3a2a14', mark: 'G' },
  guild:  { x: 150, y: 192, name: '암살자 길드', c: '#3a3040', c2: '#e04a4a', mark: 'A' }
};
// 레이드 몬스터가 나타나는 자리 (그 필드 근처)
const MAP_RAID = { kingslime: 'plains', kaishar: 'forest', griffon: 'valley', tempest: 'mountain', behemoth: 'snow' };

// 빌드 66: 지도 그림은 사용자가 고른 시안 A 양피지 고지도 — data-mapart.js MAP_ART(240×240 그대로, 화면은 .map-img image-rendering: pixelated로 키운다)
function mapArt() { return MAP_ART; }
// 왕국 문장: 방패 모양, 왕국 색
const EMB = {};
function emblemURL(id, big) {
  const key = id + (big ? 'b' : '');
  if (EMB[key]) return EMB[key];
  const D = KINGDOMS[id] || MAP_ORGS[id], c = D.c, c2 = D.c2, z = big ? 4 : 2, [cv, g] = mkCanvas(16 * z, 18 * z);
  g.scale(z, z);
  const rows = ['.kkkkkkkkkkkkkk.', 'kBBBBBBBBBBBBBBk', 'kBAAAAAAAAAAAABk', 'kBAAAAAAAAAAAABk', 'kBAAAAAAAAAAAABk', 'kBAAAAAAAAAAAABk', 'kBAAAAAAAAAAAABk', 'kBAAAAAAAAAAAABk', 'kBAAAAAAAAAAAABk', 'kBAAAAAAAAAAAABk', '.kBAAAAAAAAAABk.', '.kBAAAAAAAAAABk.', '..kBAAAAAAAABk..', '...kBAAAAAABk...', '....kBAAAABk....', '.....kBAABk.....', '......kBBk......', '.......kk.......'];
  const pal = { k: '#1a1208', B: c2, A: c };
  rows.forEach((row, y) => { for (let x = 0; x < 16; x++) if (row[x] !== '.') { g.fillStyle = pal[row[x]]; g.fillRect(x, y, 1, 1); } });
  // 가운데 표식: 왕국 종족 머리글자 대신 간단한 문양
  const m = { inglisia: [[7, 4, 2, 8], [5, 6, 6, 2]], frama: [[4, 8, 8, 2], [7, 4, 2, 6], [5, 10, 6, 1]], elves: [[7, 3, 2, 9], [4, 6, 3, 2], [9, 6, 3, 2], [5, 9, 2, 2], [9, 9, 2, 2]], dwarves: [[5, 4, 6, 3], [7, 7, 2, 6]], sarak: [[5, 5, 6, 6], [7, 3, 2, 2]], city: [[6, 4, 4, 4], [5, 9, 6, 2]], guild: [[5, 5, 6, 2], [7, 7, 2, 5]] }[id] || [[6, 6, 4, 4]];
  g.fillStyle = c2; for (const [x, y, w, h] of m) g.fillRect(x, y, w, h);
  return (EMB[key] = cv.toDataURL());
}
// 사절 초상: 왕국 색을 입힌 모험가 흉상
const ENVOY = {};
const ENVOY_LOOK = { inglisia: { cls: 'knight', c1: '#3f6aa8' }, frama: { cls: 'bard', c1: '#a8432f' }, elves: { cls: 'ranger', c1: '#3f8a4a' }, dwarves: { cls: 'warrior', c1: '#7a5a3a' }, sarak: { cls: 'mage', c1: '#c08a3a' }, city: { cls: 'cleric', c1: '#e8e0c8' }, guild: { cls: 'assassin', c1: '#2a2230' } };
function envoyBust(id) {
  if (ENVOY[id]) return ENVOY[id];
  const E = ENVOY_LOOK[id] || ENVOY_LOOK.city, L = Object.assign({}, PXL[E.cls] || PXL.warrior, { c1: E.c1, hc: E.c1 });
  const a = { id: id.length * 7, cls: E.cls, look: { hair: HAIRS[id.length % HAIRS.length], skin: SKINS[id.length % SKINS.length] }, eq: {} };
  const [c, x] = mkCanvas(84, 84);
  x.fillStyle = '#1a1612'; x.fillRect(0, 0, 84, 84);
  x.translate(42, 110); x.scale(2.5, 2.5);
  pxBlit(x, pxAdvSprite(a, 'idle', 0, L));
  return (ENVOY[id] = c.toDataURL());
}

/* ───────── 왕국 의뢰 ───────── */
const KQUEST = {
  inglisia: [{ id: 'in1', type: 'deliver', it: 'wolf_pelt', n: 15, gold: 1200 }, { id: 'in2', type: 'hunt', mon: 'kobold', n: 25, gold: 2600 }, { id: 'in3', type: 'deliver', it: 'golem_core', n: 4, gold: 5000, book: 'kn_wall' }],
  frama:    [{ id: 'fr1', type: 'deliver', it: 'spider_silk', n: 12, gold: 1300 }, { id: 'fr2', type: 'hunt', mon: 'harpy', n: 20, gold: 2800 }, { id: 'fr3', type: 'deliver', it: 'worm_pearl', n: 2, gold: 6000, book: 'fr_song' }],
  elves:    [{ id: 'el1', type: 'deliver', it: 'herb', n: 20, gold: 1000 }, { id: 'el2', type: 'hunt', mon: 'spider', n: 25, gold: 2200 }, { id: 'el3', type: 'deliver', it: 'elder_heart', n: 1, gold: 5500, book: 'el_breath' }],
  dwarves:  [{ id: 'dw1', type: 'deliver', it: 'iron_ore', n: 15, gold: 1400 }, { id: 'dw2', type: 'hunt', mon: 'golem', n: 15, gold: 3200 }, { id: 'dw3', type: 'deliver', it: 'frost_crystal', n: 3, gold: 6500, book: 'dw_smash' }],
  sarak:    [{ id: 'sa1', type: 'deliver', it: 'scorpion_stinger', n: 10, gold: 1600 }, { id: 'sa2', type: 'hunt', mon: 'antlion', n: 15, gold: 3400 }, { id: 'sa3', type: 'deliver', it: 'sandworm_hide', n: 4, gold: 7000, book: 'sa_mirage' }]
};
const kqState = k => { S.kq = S.kq || {}; return S.kq[k] || (S.kq[k] = { cur: null, got: 0, done: [] }); };
const kqNext = k => (KQUEST[k] || []).find(q => !kqState(k).done.includes(q.id)) || null;
const kqOf = k => { const st = kqState(k); return st.cur ? KQUEST[k].find(q => q.id === st.cur) : null; };
function kqText(q) { return q.type === 'deliver' ? `${ITEMS[q.it].name} ${q.n}개를 가져다주시오.` : `${MONS[q.mon].name}을(를) ${q.n}마리 처치해 주시오.`; }
function kqProgress(k) { const q = kqOf(k); if (!q) return ''; const st = kqState(k); return q.type === 'deliver' ? `${Math.min(q.n, S.inv[q.it] || 0)}/${q.n}` : `${Math.min(q.n, st.got)}/${q.n}`; }
function kqReady(k) { const q = kqOf(k); if (!q) return false; const st = kqState(k); return q.type === 'deliver' ? (S.inv[q.it] || 0) >= q.n : st.got >= q.n; }
function kqAccept(k) {
  const st = kqState(k), q = kqNext(k);
  if (!q || st.cur) return '';
  st.cur = q.id; st.got = 0;
  log(`${KINGDOMS[k].name}의 의뢰를 받았다: ${kqText(q)}`);
  changed();
  return '의뢰를 받았어요.';
}
function kqTurnIn(k) {
  const q = kqOf(k), st = kqState(k);
  if (!q || !kqReady(k)) return '아직 다 채우지 못했어요.';
  if (q.type === 'deliver') addTo(S.inv, q.it, -q.n);
  S.gold += q.gold; S.stats.earned += q.gold; S.fame += 5;
  S.king.favor[k] = favorOf(k) + 12;
  // 빌드 63: 스킬북은 몬스터 드랍으로만 — 왕국 의뢰는 돈 · 호감 · 명성만
  st.done.push(q.id); st.cur = null; st.got = 0;
  log(`${KINGDOMS[k].name}의 의뢰를 마쳤다. ${fmt(q.gold)}G, 호감 +12, 명성 +5`, 'good');
  changed();
  return `보상 ${fmt(q.gold)}G을(를) 받았어요.`;
}
// 처치 의뢰 진행 (kill에서 부른다)
function kqKill(id) { if (!S.kq) return; for (const k in S.kq) { const q = kqOf(k); if (q && q.type === 'hunt' && q.mon === id) S.kq[k].got++; } }

/* ───────── 지도 화면 ───────── */
Object.assign(WIN_TITLE, { map: '지도', talk: '이야기' });
function mapNodeHtml(kind, id, x, y, cls, inner, label, W = MAP_W, H = MAP_H) {
  return `<button type="button" class="mnode ${cls}" style="left:${(x / W * 100).toFixed(2)}%;top:${(y / H * 100).toFixed(2)}%" data-act="mapsel" data-k="${kind}" data-id="${id}">${inner}<span class="ml">${label}</span></button>`;
}
function mapNodes(skyMap) {
  const sel = UI.mapSel || {}, out = [], NODES = skyMap ? MAP_NODES_SKY : MAP_NODES, W = skyMap ? SKY_MAP_W : MAP_W, H = skyMap ? SKY_MAP_H : MAP_H;
  for (const fid of ALL_FIELDS) {
    const N = NODES[fid]; if (!N) continue;
    const F = FIELDS[fid], ok = isUnlocked(fid), fs = S.fields[fid] || {}, on = sel.k === 'field' && sel.id === fid;
    out.push(mapNodeHtml('field', fid, N.x, N.y, `fld${ok ? '' : ' lock'}${on ? ' on' : ''}${F.raid ? ' raid' : ''}${F.frontier ? ' front' : ''}${F.region === 'sky' ? ' skyf' : ''}`, `<i class="mn">${F.raid ? '!' : F.no}</i>`, F.name, W, H));
    if (N.dun && F.dungeon && (fs.found || fs.cleared)) out.push(mapNodeHtml('dungeon', fid, N.x + N.dun[0], N.y + N.dun[1], `dun${fs.cleared ? ' done' : ''}${sel.k === 'dungeon' && sel.id === fid ? ' on' : ''}`, `<i class="mn">${fs.cleared ? '★' : '▣'}</i>`, F.dungeon.name, W, H));
  }
  if (skyMap) {   // 하늘 지도: 구름섬 둥지
    for (const ev0 of evActive('nest')) { const A = MAP_NODES_SKY[ev0.at]; if (A) out.push(mapNodeHtml('event', ev0.id, A.x + 16, A.y - 12, `evn nest${sel.k === 'event' && sel.id === ev0.id ? ' on' : ''}`, '<i class="mn">◉</i>', `둥지 ${ev0.got}/${ev0.need}`, W, H)); }
    return out.join('');
  }
  if (S.raid) for (const r of S.raid.list) { if (r.done) continue; const R = RAIDS[r.id], N = MAP_NODES[MAP_RAID[r.id] || 'plains']; out.push(mapNodeHtml('raid', r.id, N.x - 16, N.y - 14, `rd${sel.k === 'raid' && sel.id === r.id ? ' on' : ''}`, `<i class="mn" style="background:${R.c}">☠</i>`, R.name)); }
  for (const k of KINGDOM_IDS) { const P = MAP_KINGS[k], open = kingOpen(k); out.push(mapNodeHtml('king', k, P.x, P.y + 10, `kg${open ? '' : ' lock'}${sel.k === 'king' && sel.id === k ? ' on' : ''}`, `<img src="${emblemURL(k)}" alt="">`, KINGDOMS[k].name.replace(/ .*/, ''))); }
  for (const o in MAP_ORGS) { const P = MAP_ORGS[o]; if (o === 'guild' && !underOpen()) continue; out.push(mapNodeHtml('org', o, P.x, P.y, `og${sel.k === 'org' && sel.id === o ? ' on' : ''}`, `<img src="${emblemURL(o)}" alt="">`, o === 'city' ? '하르겐' : '암살자 길드')); }
  out.push(eventNodes(sel));
  return out.join('');
}
function mapDetail() {
  const sel = UI.mapSel;
  if (!sel) { const evs = evState().filter(x => !x.done); return `<div class="card"><div class="sub">필드·던전·레이드를 누르면 어떤 곳인지 볼 수 있어요. 원정은 원정대 창에서 보내요. 왕국과 단체를 누르면 이야기할 수 있어요.</div>${evs.length ? `<div class="sub gold-t">지금 지도 위: ${evs.map(x => x.type === 'wave' ? `⚔ 몬스터 웨이브 (D-${Math.max(0, x.arrive - today())})` : x.type === 'fest' ? `★ ${KINGDOMS[x.k].name} 축제` : x.type === 'nest' ? `◉ ${FIELDS[x.at].name} 둥지 ${x.got}/${x.need}` : '$ 떠돌이 상인').join(' · ')}</div>` : ''}</div>`; }
  if (sel.k === 'king' || sel.k === 'org') return talkCard(sel.id);
  if (sel.k === 'event') return eventCard(+sel.id);
  // 원정 목적지
  let fid = sel.id, F, title, sub, dungeon = sel.k === 'dungeon';
  if (sel.k === 'raid') { fid = 'raid_' + sel.id; F = FIELDS[fid]; const R = RAIDS[sel.id], r = raidRec(sel.id); title = `레이드 · ${R.name}`; sub = `Lv${R.lv} · 남은 HP ${pct(r.hp, r.max)}% · ${R.desc}`; }
  else { F = FIELDS[fid]; const fs = S.fields[fid]; const nb = [1, 2, 3, 4, 5].filter(k => fs.boss && fs.boss[k]).length; title = dungeon ? F.dungeon.name : F.name; sub = dungeon ? `${fs.cleared ? '공략 완료 · 다시 들어가면 주인이 기다린다' : '한 번만 공략할 수 있다'} · 몬스터 Lv${dungeonLv(F, 1)}~${dungeonLv(F, DUNGEON_FLOORS)}, 주인 Lv${dungeonBossLv(F)}` : F.raid ? '암살자 길드 토벌 · Lv28+ 권장' : `Lv${F.lv}~${fieldLv(F, FIELD_STAGES)} · 최고 ${F.no}-${fs.best || 0} · ${fs.cleared ? '던전★' : fs.found ? '던전 열림' : `보스 ${nb}/5`} · ${F.desc}`; }
  const ok = isUnlocked(fid);
  const why = !ok ? (F.unlock || (F.giant ? '이번 달에는 열리지 않은 레이드' : `상단 ${RANKS[Math.min(F.no - 1, RANKS.length - 1)].name}랭크에 열려요`)) : '';
  const note = ok && F.region === 'sky' ? '비행 마차에 그리폰·와이번·페가수스를 맨 파티만 갈 수 있어요. 비행장 창에서도 보낼 수 있어요.' : '';
  const mons = !F.giant && F.mons.length ? `<div class="sub muted">몬스터: ${(dungeon ? F.dungeon.mons : F.mons).map(id => MONS[id].name).join(', ')}${dungeon ? ` · 주인 ${MONS[F.dungeon.boss].name}` : F.bosses ? ` · 우두머리 ${F.bosses.map(id => MONS[id].name).filter((v, i, a) => a.indexOf(v) === i).join(', ')}` : ''}</div>` : '';
  return `<div class="card hl"><div class="h">${esc(title)}</div><div class="sub">${sub}</div>${mons}</div>
    ${why ? `<div class="sub red-t">${esc(why)}</div>` : ''}${note ? `<div class="sub gold-t">${esc(note)}</div>` : ''}
    <button type="button" class="btn gold block" data-act="mapexp" data-f="${fid}" data-d="${dungeon ? 1 : 0}"${ok ? '' : ' disabled'}>원정대 창에서 보내기</button>`;
}
function talkCard(id) {
  const K = KINGDOMS[id], O = MAP_ORGS[id], name = K ? K.name : O.name, open = K ? kingOpen(id) : true;
  const f = K ? favorOf(id) : 0, t = K ? favorTier(f) : 0;
  const v = S.king && S.king.visit && S.king.visit.k === id;
  const q = K ? kqOf(id) : null, nq = K ? kqNext(id) : null;
  return `<div class="card hl"><div class="row"><img class="emb" src="${emblemURL(id, 1)}" alt=""><div class="grow"><div class="h">${esc(name)}</div><div class="sub">${K ? `${K.race} · ${FAVOR[t].name} (호감 ${Math.round(f)})${v ? ' · <span class="gold-t">상단 방문 중</span>' : ''}` : id === 'city' ? '제국의 수도. 모험가 길드와 상단 길드가 있다.' : '지하수로의 주인. 7번가의 자릿세를 받는다.'}</div></div></div>
    ${K ? `<div class="sub">${K.desc}</div>` : ''}
    ${K && !open ? `<div class="sub muted">${FIELDS[K.need] ? FIELDS[K.need].name + '이(가) 열리면 찾아와요.' : ''}</div>` : ''}
    ${K && q ? `<div class="sub">의뢰 진행: ${kqText(q)} <b class="num">${kqProgress(id)}</b></div>` : K && nq ? `<div class="sub muted">받을 수 있는 의뢰가 있어요.</div>` : K ? '<div class="sub ok-t">모든 의뢰를 마쳤어요.</div>' : ''}
    <div class="btns"><button type="button" class="btn sm gold" data-act="talk" data-id="${id}">이야기하기</button>${K && v ? `<button type="button" class="btn sm" data-act="sub" data-id="co_king">교역</button>` : ''}${K && open ? `<button type="button" class="btn sm" data-act="tradego" data-k="${id}">교역로로 가기 · ${TRADE[id].dist}구간</button>` : ''}</div></div>`;
}
// 지도 창: 대륙 / 하늘 탭. 하늘 지도는 세계수 던전을 공략하면 보인다 (구름섬은 비행장까지 지어야 간다)
PANELS.map = () => {
  const skyOpen = !!(S.fields.roots && S.fields.roots.cleared) || (S.bld.airfield || 0) > 0;
  let tab = UI.mapTab || 'land'; if (tab === 'sky' && !skyOpen) tab = 'land';
  const sel = UI.mapSel; if (sel && sel.k === 'field' && FIELDS[sel.id] && FIELDS[sel.id].region === 'sky') tab = 'sky';
  const bar = `<div class="tabs"><button type="button" class="tab${tab === 'land' ? ' on' : ''}" data-act="maptab" data-t="land">대륙</button><button type="button" class="tab${tab === 'sky' ? ' on' : ''}" data-act="maptab" data-t="sky">${SKY_NAME}${skyOpen ? '' : ' <small>잠김</small>'}</button></div>`;
  if (tab === 'sky') return `${bar}<div class="map-wrap sky"><img class="map-img" src="${skyMapArt()}" alt="하늘 지도">${mapNodes(true)}</div>${mapDetail()}`;
  return `${bar}<div class="map-wrap"><img class="map-img" src="${mapArt()}" alt="세계 지도">${mapNodes()}</div>${mapDetail()}`;
};
// 이야기 창: 문장과 초상, 선택지
function talkLines(id) {
  const K = KINGDOMS[id];
  if (!K) return id === 'city' ? ['"어서 오시오, 상단 주인. 모험가 길드는 라이선스 심사와 명예의 벽을 맡고 있소."', '"라이선스는 모험가 창에서, 3차 직업의 끝에 선 이는 각성으로 용사가 될 수 있다오."'] : ['"……자릿세는 달마다. 토벌하고 싶으면 뒷골목으로 오시오."', '"투기장과 암시장도 우리 손안이지. 코인은 흘러 흘러 결국 이리 온다."'];
  const t = favorTier(favorOf(id));
  const greet = { inglisia: ['"기사 왕국 잉그리시아의 사절이오."', '"군대는 가죽과 철을 먹고 자라지. 좋은 물건이면 값은 치르겠소."'], frama: ['"프라마의 상인이라오. 남쪽 바다에서 왔소."', '"보석, 비단, 깃털. 반짝이는 것이라면 뭐든."'], elves: ['"실바레아의 순찰자다. 세계수가 그대를 지켜보고 있다."', '"숲의 재료는 숲으로 돌아와야 한다. 값은 넉넉히 주지."'], dwarves: ['"브론하임의 대장장이다. 광석 냄새가 나는군."', '"핵과 광석이라면 자루째 사겠다. 술도 한잔하고."'], sarak: ['"사라크의 상인이오. 모래바다 너머에서."', '"진귀한 것엔 값을 따지지 않소. 술탄의 이름으로."'] }[id];
  const mood = t >= 3 ? '"동맹의 벗이여, 무엇이든 말하시오."' : t >= 2 ? '"그대 상단은 믿을 만하지."' : t >= 1 ? '"거래는 거래. 서로 손해는 보지 맙시다."' : '"……아직 그대를 잘 모르오. 지켜보겠소."';
  return greet.concat([mood]);
}
PANELS.talk = w => {
  const id = w.who, K = KINGDOMS[id], O = MAP_ORGS[id], name = K ? K.name : O.name;
  const q = K ? kqOf(id) : null, nq = K ? kqNext(id) : null, v = S.king && S.king.visit && S.king.visit.k === id;
  const lines = (w.mode === 'quest' && q) ? [`"${kqText(q)}"`, `"지금까지 ${kqProgress(id)}. ${kqReady(id) ? '다 채웠군. 약속한 것을 주겠소.' : '마치면 다시 오시오.'}"`, `보상: ${fmt(q.gold)}G, 호감 +12, 명성 +5`]
    : (w.mode === 'quest' && nq) ? [`"부탁이 하나 있소. ${kqText(nq)}"`, `보상: ${fmt(nq.gold)}G, 호감 +12, 명성 +5`]
    : w.mode === 'quest' ? ['"지금은 부탁할 일이 없소. 고맙소."'] : talkLines(id);
  const btns = w.mode === 'quest'
    ? (q ? (kqReady(id) ? `<button type="button" class="btn gold" data-act="kqdone" data-id="${id}">납품하기</button>` : `<button type="button" class="btn" data-act="talkmode" data-id="${id}" data-m="">알겠소</button>`) : nq ? `<button type="button" class="btn gold" data-act="kqok" data-id="${id}">수락</button><button type="button" class="btn" data-act="talkmode" data-id="${id}" data-m="">나중에</button>` : `<button type="button" class="btn" data-act="talkmode" data-id="${id}" data-m="">알겠소</button>`)
    : `${K ? `<button type="button" class="btn gold" data-act="talkmode" data-id="${id}" data-m="quest">의뢰${q ? ' (진행 중)' : nq ? '' : ' (없음)'}</button>` : ''}${K ? `<button type="button" class="btn" data-act="${v ? 'sub' : 'talknote'}" data-id="${v ? 'co_king' : id}">거래${v ? '' : ' (방문 중 아님)'}</button>` : ''}${id === 'guild' ? `<button type="button" class="btn" data-act="sub" data-id="ag">길드 본부</button>` : ''}${id === 'city' ? `<button type="button" class="btn" data-act="sub" data-id="co_rank">상단 랭크</button>` : ''}<button type="button" class="btn" data-act="back">돌아가기</button>`;
  return `<div class="talk"><div class="talk-top"><div class="talk-por"><img src="${envoyBust(id)}" alt=""></div><div class="grow"><img class="emb big" src="${emblemURL(id, 1)}" alt=""><div class="h">${esc(name)}</div>${K ? `<div class="sub">${K.race} · ${FAVOR[favorTier(favorOf(id))].name}</div>` : ''}</div></div>
    <div class="talk-box">${lines.map(l => `<p>${esc(l)}</p>`).join('')}</div>
    <div class="btns talk-btns">${btns}</div></div>`;
};
function mapGo(pid, fid, dungeon) {
  const p = findP(pid); if (!p) return '';
  if (dungeon) { const cps = checkpoints(fid); p.start = cps[cps.length - 1]; p.dmode = 'enter'; }
  p.dest = fid;
  const m = startExp(p, fid);
  if (m) return m;
  S.view = p.id; renderChips();
  return '';
}
Object.assign(ACT, {
  mapsel: d => { UI.mapSel = { k: d.k, id: d.id }; renderPanel(true); },
  maptab: d => { UI.mapTab = d.t; UI.mapSel = null; renderPanel(true); },
  mapparty: d => { UI.mapP = +d.id; renderPanel(true); },
  mapgo: d => { const m = mapGo(+d.p, d.f, d.d === '1'); if (m) say(m); else { say(`${findP(+d.p).name} 출발!`); showWin(false); } },
  mapexp: d => { const p = S.parties.find(x => !x.exp && !x.raidOnly); if (p && isUnlocked(d.f)) { p.dest = d.f; if (d.d === '1') { const cps = checkpoints(d.f); p.start = cps[cps.length - 1]; p.dmode = 'enter'; } UI.expTab = p.id; } UI.destTab = DEMON_IDS.includes(d.f) ? 'demon' : FIELDS[d.f] && FIELDS[d.f].region === 'sky' ? 'sky' : 'base'; menuOpen('exp'); },
  talk: d => openWin('talk', { who: d.id, mode: '' }),
  talkmode: d => { const top = winTop(); if (top && top.id === 'talk') { top.mode = d.m; renderPanel(true); } },
  talknote: () => say('지금은 그 왕국 상단이 와 있지 않아요. 찾아오면 지도나 상단 창의 교역에서 거래해요.'),
  kqok: d => { say(kqAccept(d.id)); const top = winTop(); if (top) top.mode = 'quest'; renderPanel(true); },
  kqdone: d => { say(kqTurnIn(d.id)); const top = winTop(); if (top) top.mode = ''; renderPanel(true); },
  back: () => backWin()
});
