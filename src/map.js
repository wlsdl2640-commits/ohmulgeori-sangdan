/* ───────── 지도: 필드·던전·레이드를 골라 원정을 보내고, 왕국·단체와 이야기한다 ─────────
   지도 그림은 240×200 논리 픽셀(두 배로 굽는다). 노드는 그 위에 HTML 단추로 얹는다. */
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
const MAP_EXTRA = [];   // 지도 그림에 덧그리는 함수들 (world30.js)
const MAP_KINGS = { inglisia: { x: 22, y: 134 }, frama: { x: 58, y: 186 }, elves: { x: 24, y: 48 }, dwarves: { x: 128, y: 26 }, sarak: { x: 226, y: 178 } };
const MAP_ORGS = {
  city:   { x: 120, y: 148, name: '제도 하르겐 · 모험가 길드', c: '#f0c24a', c2: '#3a2a14', mark: 'G' },
  guild:  { x: 150, y: 192, name: '암살자 길드', c: '#3a3040', c2: '#e04a4a', mark: 'A' }
};
// 레이드 몬스터가 나타나는 자리 (그 필드 근처)
const MAP_RAID = { kingslime: 'plains', kaishar: 'forest', griffon: 'valley', tempest: 'mountain', behemoth: 'snow' };

let MAP_CV = null;
function mapArt() {
  if (MAP_CV) return MAP_CV;
  const r = rng(99), [cv, g] = mkCanvas(MAP_W * 2, MAP_H * 2);
  g.scale(2, 2); g.imageSmoothingEnabled = false;
  // 땅과 바다
  R(g, 0, 0, MAP_W, MAP_H, '#6f9a48');
  for (let i = 0; i < 260; i++) R(g, Math.floor(r() * MAP_W), Math.floor(r() * MAP_H), 1 + Math.floor(r() * 2), 1, r() < 0.5 ? '#7aa852' : '#64903e');
  ell(g, 18, 196, 78, 42, '#3a6aa8'); ell(g, 10, 200, 60, 30, '#4a7ab8');
  for (let i = 0; i < 18; i++) { const x = Math.floor(r() * 70), y = 160 + Math.floor(r() * 40); if ((x - 18) ** 2 / (78 ** 2) + (y - 196) ** 2 / (42 ** 2) < 0.9) R(g, x, y, 4, 1, '#8ab8e0'); }
  R(g, 0, 168, 1, 32, '#2a4a80');
  // 숲
  ell(g, 44, 74, 42, 30, '#3f7a3f'); ell(g, 40, 70, 30, 20, '#4a8a46');
  for (let i = 0; i < 60; i++) { const a = r() * Math.PI * 2, rr = Math.sqrt(r()); const x = Math.round(44 + Math.cos(a) * 38 * rr), y = Math.round(74 + Math.sin(a) * 26 * rr); R(g, x - 1, y - 3, 3, 3, '#2e5a2e'); R(g, x, y - 4, 1, 1, '#2e5a2e'); R(g, x, y, 1, 2, '#5a3a22'); if (r() < 0.4) R(g, x - 1, y - 3, 1, 1, '#5a9a52'); }
  // 산
  ell(g, 122, 54, 46, 24, '#7a7a74'); ell(g, 118, 52, 34, 16, '#8a8a84');
  for (const [px, py, h] of [[100, 60, 14], [114, 52, 20], [128, 56, 16], [142, 62, 12], [122, 44, 10], [108, 46, 9]]) { for (let i = 0; i < h; i++) R(g, px - i, py - h + i + 1 + h - h, i * 2 + 1, 1, i < h * 0.35 ? '#f0f0f4' : '#8c8c88'); for (let i = Math.floor(h * 0.35); i < h; i++) R(g, px, py - h + i + 1, i, 1, '#6a6a66'); }
  // 협곡
  ell(g, 176, 92, 34, 22, '#a89a62'); ell(g, 172, 90, 22, 12, '#b8aa70');
  for (let i = 0; i < 10; i++) { const y = 80 + i * 3; R(g, 150 + (i % 3) * 6, y, 20 + (i % 2) * 8, 1, '#c8ba82'); R(g, 182 + (i % 2) * 6, y + 1, 14, 1, '#8a7a46'); }
  // 설산
  ell(g, 204, 40, 34, 28, '#e8f0f8'); ell(g, 200, 36, 22, 16, '#f8fcff');
  for (let i = 0; i < 24; i++) { const a = r() * Math.PI * 2, rr = Math.sqrt(r()); const x = Math.round(204 + Math.cos(a) * 30 * rr), y = Math.round(40 + Math.sin(a) * 24 * rr); R(g, x - 1, y - 2, 3, 2, '#9ab8c8'); R(g, x, y - 3, 1, 1, '#ffffff'); R(g, x, y, 1, 1, '#5a4a3a'); }
  for (const [px, py, h] of [[196, 30, 12], [212, 26, 14]]) for (let i = 0; i < h; i++) R(g, px - i, py + i, i * 2 + 1, 1, i < h * 0.5 ? '#ffffff' : '#c8d8e8');
  // 사막
  ell(g, 206, 150, 38, 30, '#d8c070'); ell(g, 210, 146, 26, 18, '#e8d488');
  for (let i = 0; i < 9; i++) { const y = 128 + i * 5; R(g, 176 + (i % 2) * 10, y, 18 + (i % 3) * 6, 1, '#c0a858'); R(g, 206 + (i % 3) * 5, y + 2, 12, 1, '#f0e0a0'); }
  R(g, 222, 140, 2, 6, '#5a8a4a'); R(g, 220, 138, 6, 2, '#5a8a4a'); R(g, 226, 136, 2, 4, '#5a8a4a');
  // 마계: 남쪽 검은 땅 (늪 · 재의 땅 · 검은 성)
  R(g, 0, 204, MAP_W, 36, '#2a2230');
  for (let x = 0; x < MAP_W; x += 3) { const h = 2 + ((x * 7) % 5); R(g, x, 204 - h, 3, h + 1, '#3a2a3a'); R(g, x, 203 - h, 2, 1, '#5a3a4a'); }
  for (let i = 0; i < 120; i++) R(g, Math.floor(r() * MAP_W), 206 + Math.floor(r() * 32), 1 + Math.floor(r() * 2), 1, r() < 0.5 ? '#342a3c' : '#221c28');
  ell(g, 44, 222, 34, 12, '#1e3a2a'); ell(g, 40, 220, 22, 7, '#2a4a34'); for (let i = 0; i < 16; i++) { const x = 14 + Math.floor(r() * 60), y = 213 + Math.floor(r() * 18); R(g, x, y, 3, 1, '#4a6a4a'); R(g, x + 1, y - 2, 1, 2, '#3a5a3a'); }
  ell(g, 122, 224, 36, 12, '#5a3a32'); ell(g, 118, 222, 22, 6, '#6a4a3a'); for (let i = 0; i < 9; i++) { const x = 90 + i * 8, y = 216 + (i % 3) * 5; R(g, x, y, 5, 1, '#3a2420'); R(g, x + 2, y + 1, 1, 2, '#3a2420'); } R(g, 104, 212, 2, 3, '#f08a30'); R(g, 136, 230, 2, 2, '#f08a30');
  ell(g, 200, 224, 32, 12, '#2e2a3a'); for (const [tx, th, tw] of [[186, 14, 5], [194, 20, 7], [204, 16, 5], [212, 12, 5]]) { R(g, tx, 230 - th, tw, th, '#1a1622'); R(g, tx + 1, 229 - th, tw - 2, 1, '#2e2a3a'); R(g, tx + Math.floor(tw / 2), 226 - th, 1, 3, '#6a1a2a'); } R(g, 186, 230, 32, 2, '#1a1622');
  R(g, 0, 232, 1, 8, '#3a2a3a');
  // 뒷골목·지하수로 (도시 근처 어두운 땅)
  ell(g, 92, 166, 12, 8, '#5a5a5a'); ell(g, 150, 178, 14, 9, '#4a5048'); ell(g, 150, 178, 8, 4, '#2e4a4a');
  MAP_EXTRA.forEach(f => f(g, r));
  // 길
  const road = (x0, y0, x1, y1) => { const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)); for (let i = 0; i <= n; i += 3) { const x = Math.round(x0 + (x1 - x0) * i / n), y = Math.round(y0 + (y1 - y0) * i / n); R(g, x, y, 2, 1, '#8a6a3a'); } };
  road(120, 150, 84, 118); road(84, 118, 44, 78); road(84, 118, 122, 60); road(122, 60, 176, 94); road(176, 94, 204, 42); road(120, 150, 206, 150); road(120, 150, 92, 164); road(120, 150, 150, 176);
  road(84, 118, 22, 134); road(44, 78, 24, 50); road(122, 60, 128, 28); road(206, 150, 226, 178); road(120, 150, 58, 186);
  road(92, 166, 44, 220); road(44, 222, 122, 224); road(122, 224, 200, 222);
  // 도시 하르겐: 성벽과 집들
  R(g, 106, 142, 28, 14, '#8a7a62'); R(g, 106, 142, 28, 1, '#a89a82'); R(g, 106, 155, 28, 1, '#5a4a3a');
  for (const [hx, hy, w] of [[108, 146, 6], [116, 144, 7], [125, 147, 6], [110, 150, 5], [119, 151, 6], [127, 152, 5]]) { R(g, hx, hy, w, 4, '#c8b088'); R(g, hx - 1, hy - 2, w + 2, 2, '#a83a2a'); R(g, hx + 1, hy + 1, 1, 1, '#4a3a2a'); }
  R(g, 119, 136, 2, 7, '#3a3a40'); R(g, 121, 136, 4, 3, '#f0c24a'); R(g, 112, 139, 4, 3, '#6a5a4a'); R(g, 112, 138, 4, 1, '#8a7a6a');
  // 왕국 성
  for (const k of KINGDOM_IDS) { const P = MAP_KINGS[k], D = KINGDOMS[k]; R(g, P.x - 7, P.y - 4, 14, 8, '#9a9088'); R(g, P.x - 7, P.y - 4, 14, 1, '#c8c0b8'); R(g, P.x - 9, P.y - 9, 4, 13, '#a8a098'); R(g, P.x + 5, P.y - 9, 4, 13, '#a8a098'); R(g, P.x - 1, P.y - 12, 3, 16, '#b8b0a8'); R(g, P.x - 2, P.y, 4, 4, '#3a2a1a'); R(g, P.x, P.y - 16, 1, 5, '#4a3a2a'); R(g, P.x + 1, P.y - 16, 5, 3, D.c); R(g, P.x - 9, P.y - 10, 4, 1, D.c); R(g, P.x + 5, P.y - 10, 4, 1, D.c); }
  // 나침반과 테두리
  R(g, 8, 8, 1, 14, '#f0e8c8'); R(g, 2, 14, 13, 1, '#f0e8c8'); R(g, 7, 6, 3, 3, '#e04a4a'); R(g, 6, 24, 5, 1, '#f0e8c8');
  R(g, 0, 0, MAP_W, 2, '#3a2a14'); R(g, 0, MAP_H - 2, MAP_W, 2, '#3a2a14'); R(g, 0, 0, 2, MAP_H, '#3a2a14'); R(g, MAP_W - 2, 0, 2, MAP_H, '#3a2a14');
  return (MAP_CV = cv.toDataURL());
}
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
  if (q.book && ITEMS['book_' + q.book]) addTo(S.inv, 'book_' + q.book, 1);
  st.done.push(q.id); st.cur = null; st.got = 0;
  log(`${KINGDOMS[k].name}의 의뢰를 마쳤다. ${fmt(q.gold)}G, 호감 +12, 명성 +5${q.book ? `, ${ITEMS['book_' + q.book].name}` : ''}`, 'good');
  changed();
  return `보상 ${fmt(q.gold)}G${q.book ? `와 ${ITEMS['book_' + q.book].name}` : ''}을(를) 받았어요.`;
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
  const lines = (w.mode === 'quest' && q) ? [`"${kqText(q)}"`, `"지금까지 ${kqProgress(id)}. ${kqReady(id) ? '다 채웠군. 약속한 것을 주겠소.' : '마치면 다시 오시오.'}"`, `보상: ${fmt(q.gold)}G, 호감 +12, 명성 +5${q.book ? `, ${ITEMS['book_' + q.book].name}` : ''}`]
    : (w.mode === 'quest' && nq) ? [`"부탁이 하나 있소. ${kqText(nq)}"`, `보상: ${fmt(nq.gold)}G, 호감 +12, 명성 +5${nq.book ? `, ${ITEMS['book_' + nq.book].name} (여기서만 구할 수 있는 책)` : ''}`]
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
  mapexp: d => { const p = S.parties.find(x => !x.exp); if (p && isUnlocked(d.f)) { p.dest = d.f; if (d.d === '1') { const cps = checkpoints(d.f); p.start = cps[cps.length - 1]; p.dmode = 'enter'; } UI.expTab = p.id; } UI.destTab = DEMON_IDS.includes(d.f) ? 'demon' : FIELDS[d.f] && FIELDS[d.f].region === 'sky' ? 'sky' : 'base'; menuOpen('exp'); },
  talk: d => openWin('talk', { who: d.id, mode: '' }),
  talkmode: d => { const top = winTop(); if (top && top.id === 'talk') { top.mode = d.m; renderPanel(true); } },
  talknote: () => say('지금은 그 왕국 상단이 와 있지 않아요. 찾아오면 지도나 상단 창의 교역에서 거래해요.'),
  kqok: d => { say(kqAccept(d.id)); const top = winTop(); if (top) top.mode = 'quest'; renderPanel(true); },
  kqdone: d => { say(kqTurnIn(d.id)); const top = winTop(); if (top) top.mode = ''; renderPanel(true); },
  back: () => backWin()
});
