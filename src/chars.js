/* ───────── 모험가 그림: 직업마다 차림이 다르고, 전직하면 모습이 바뀐다 ─────────
   body 몸통 차림 · head 머리 장식 · cape 망토 · sh 어깨 · shield 방패 · wv 무기 모양 · ex 덧붙이는 것 */
const LOOKS = {
  warrior:     { body: 'chain', c1: '#9b3b2f', c2: '#c9a04a', head: 'helm', sh: 'pauldron', ex: ['tabard'] },
  archer:      { body: 'leather', c1: '#3f7a3a', c2: '#7a5232', head: 'hood', ex: ['quiver'], feather: '#e05a4a' },
  mage:        { body: 'robe', c1: '#5a3d8c', c2: '#e0c060', head: 'wizard', gem: '#8ad8ff' },
  cleric:      { body: 'robe', c1: '#e8e2d4', c2: '#c9a04a', c3: '#4a7ac8', head: 'coif', ex: ['holy'] },
  rogue:       { body: 'leather', c1: '#3a3a46', c2: '#5a4a3a', c3: '#8a2a2a', head: 'cowl', ex: ['scarf'] },
  porter:      { body: 'tunic', c1: '#9a7a4f', c2: '#5a4630', c3: '#c9a04a', head: 'band', ex: ['pack'] },
  gladiator:   { body: 'bare', c1: '#a8432f', c2: '#7a5232', metal: '#c08a3a', head: 'glad', shield: 'round', ex: ['manica'] },
  champion:    { body: 'plate', c1: '#b8322a', c2: '#e8c060', metal: '#d8a84a', head: 'laurel', cape: '#b8322a', sh: 'pauldron', wv: 'great' },
  knight:      { body: 'plate', c1: '#3a5aa8', c2: '#e8e4d8', head: 'great', shield: 'kite', sh: 'pauldron', ex: ['tabard'], plume: '#3a5aa8' },
  paladin:     { body: 'plate', c1: '#e8e4d8', c2: '#e8c060', metal: '#dfe3ec', head: 'winged', shield: 'tower', cape: '#3a5aa8', sh: 'pauldron', glow: '#fff2a0', ex: ['tabard'] },
  berserker:   { body: 'bare', c1: '#5a4030', c2: '#8a6a4a', metal: '#7a7a82', head: 'horn', sh: 'fur', wv: 'great', ex: ['paint'] },
  bloodlord:   { body: 'plate', c1: '#5a1a1a', c2: '#c0392b', metal: '#4a3a44', head: 'horn', sh: 'spike', cape: '#6a1a1a', eyes: '#ff4a3a', wv: 'great' },
  ranger:      { body: 'leather', c1: '#4a6a3a', c2: '#7a5232', head: 'hoodup', cape: '#55663a', ex: ['quiver'] },
  dragoon:     { body: 'scale', c1: '#2f5a6a', c2: '#7ad8c8', metal: '#4a8a9a', head: 'dragon', cape: '#2a3a5a', sh: 'pauldron' },
  sniper:      { body: 'leather', c1: '#4a5248', c2: '#3a3a30', c3: '#6a7a5a', head: 'goggles', ex: ['quiver', 'scarf'], wv: 'long' },
  hawkeye:     { body: 'coat', c1: '#e8e4d8', c2: '#e8c060', head: 'feather', cape: '#c9a04a', ex: ['quiver'], wv: 'long', feather: '#f0c24a' },
  bard:        { body: 'coat', c1: '#b8322a', c2: '#f0c24a', head: 'beret', feather: '#4ab0e0' },
  maestro:     { body: 'coat', c1: '#5a2a7a', c2: '#f0c24a', head: 'beret', cape: '#2a1a3a', feather: '#fff4b0' },
  assassin:    { body: 'leather', c1: '#22222c', c2: '#3a3a46', c3: '#a82a2a', head: 'cowl', ex: ['scarf', 'twin'] },
  shadowlord:  { body: 'coat', c1: '#1e1828', c2: '#7a4ab8', head: 'cowl', c3: '#2a1a3a', cape: '#2a1a3a', eyes: '#c89aff', ex: ['twin', 'wisp'] },
  duelist:     { body: 'coat', c1: '#2a4a8a', c2: '#e8e2d0', c3: '#c0392b', head: 'band', ex: ['twin'] },
  bladedancer: { body: 'coat', c1: '#e8e2d0', c2: '#3aa8a0', c3: '#3aa8a0', head: 'circlet', gem: '#3aa8a0', ex: ['twin', 'sash'] },
  treasure:    { body: 'leather', c1: '#7a5a3a', c2: '#5a4630', c3: '#a8432f', head: 'goggles', ex: ['pack'] },
  masterthief: { body: 'coat', c1: '#6a1a2a', c2: '#e0c060', head: 'tophat', cape: '#1e1828', ex: ['mask'] },
  elementalist: { body: 'robe', c1: '#2f7a5a', c2: '#9ae0b0', head: 'circlet', gem: '#7ae0a0' },
  elementlord: { body: 'robe', c1: '#e8e4f0', c2: '#5ac8f0', head: 'crown', cape: '#3a6a9a', gem: '#f0a040' },
  necromancer: { body: 'robe', c1: '#1e1828', c2: '#7a4ab8', head: 'hoodup', skin: '#d8d0d8', wv: 'skull' },
  lich:        { body: 'robe', c1: '#2a1a3a', c2: '#a87ad8', head: 'bonecrown', skin: '#e8e4dc', bones: 1, eyes: '#c89aff', cape: '#1a1024', wv: 'skull' },
  spellblade:  { body: 'leather', c1: '#3a4a7a', c2: '#8ab8ff', metal: '#8a98b8', head: 'circlet', sh: 'pauldron', glow: '#8ab8ff', gem: '#8ab8ff' },
  arcblade:    { body: 'plate', c1: '#1e2a4a', c2: '#c8d8ff', metal: '#4a5a8a', head: 'circlet', cape: '#141a3a', glow: '#c8d8ff', gem: '#fff4b0', stars: 1 },
  priest:      { body: 'robe', c1: '#f0ece0', c2: '#e0c060', head: 'mitre', ex: ['stole'], gem: '#fff2a0' },
  archbishop:  { body: 'robe', c1: '#f4e8c0', c2: '#e0b040', head: 'mitre2', cape: '#a8322a', ex: ['stole'], wv: 'crozier' },
  plaguedoc:   { body: 'coat', c1: '#24222a', c2: '#3a3640', head: 'beak' },
  physician:   { body: 'coat', c1: '#e8e8ec', c2: '#5a8ab8', head: 'monocle', ex: ['bag'] },
  exorcist:    { body: 'robe', c1: '#26242c', c2: '#e8e4d8', head: 'coif2', ex: ['book'] },
  inquisitor:  { body: 'coat', c1: '#8a1a1a', c2: '#e0c060', head: 'widebrim', cape: '#1e1418', wv: 'hammer' }
};
const ARM_TINT = ['#8a8a92', '#8e9670', '#b4bcc8', '#7a98d0', '#c8e2f2', '#e0b84a'];
const WPN_TINT = ['#a0a4ac', '#a0aa80', '#c4ccd6', '#8ab0e8', '#d8f0ff', '#f0c860'];
const MELEE_W = ['sword', 'axe', 'gaxe', 'club', 'mace', 'dagger'];
const BOOT = '#4a3424', BELT = '#5a3a22', INK = '#1e1418';

function ik2(a, b, l1, l2, bend) {
  const dx = b[0] - a[0], dy = b[1] - a[1], D0 = Math.hypot(dx, dy) || 1e-6, d = Math.min(D0, l1 + l2 - 0.05);
  const p = (l1 * l1 - l2 * l2 + d * d) / (2 * d), q = Math.sqrt(Math.max(0, l1 * l1 - p * p)), ux = dx / D0, uy = dy / D0;
  return [a[0] + ux * p - uy * q * bend, a[1] + uy * p + ux * q * bend];
}
/* 앞모습 자세: 발밑이 (0,0). 화면 오른쪽 손(R)에 무기, 왼쪽 손(L)에 방패·활·두 번째 무기 */
function frontJoints(pose, fr, L, wb) {
  const walk = pose === 'walk', atk = pose === 'atk' ? fr % 2 : -1, sit = pose === 'sit';
  const bob = walk ? (fr % 2 ? -1 : 0) : pose === 'idle' && fr % 2 ? -1 : 0, y = bob;
  const J = { bob, atk, walk, sit, fr };
  J.hipL = [-2.7, -16 + y]; J.hipR = [2.7, -16 + y];
  J.footL = [-3.3, 0]; J.footR = [3.3, 0];
  if (walk && fr % 4 === 0) J.footL = [-3.1, -2.4];
  if (walk && fr % 4 === 2) J.footR = [3.1, -2.4];
  J.torso = [0, -22.4 + y]; J.neck = [0, -29.4 + y]; J.head = [0, -36.3 + y];
  J.sL = [-6.1, -27.2 + y]; J.sR = [6.1, -27.2 + y];
  const sw = walk ? [1.2, 0, -1.2, 0][fr % 4] : 0;
  J.hL = [-7.4, -18.6 + y + sw]; J.hR = [7.4, -18.6 + y - sw];
  J.ang = -1.22; J.angL = -1.92;
  const twin = (L.ex || []).includes('twin');
  if (L.shield) J.hL = [-4.6, -20.4 + y];
  if (sit) {
    Object.assign(J, { hipL: [-2.8, -6], hipR: [2.8, -6], footL: [2.4, -1.6], footR: [-2.4, -1.6], torso: [0, -12.6], neck: [0, -19.6], head: [0, -26.5], sL: [-6.1, -17.4], sR: [6.1, -17.4], hL: [-6.4, -9.4], hR: [6.4, -9.4], ang: -1.35 });
  } else if (MELEE_W.includes(wb) || wb === 'great' || wb === 'hammer') {
    if (atk === 0) { J.hR = [6.6, -34.5 + y]; J.ang = -2.05; if (twin) { J.hL = [-6.6, -34.5 + y]; J.angL = -1.1; } }
    else if (atk === 1) { J.hR = [3.2, -21.5 + y]; J.ang = wb === 'dagger' ? -1.0 : -0.3; if (twin) { J.hL = [-3.2, -21.5 + y]; J.angL = -2.85; } }
    else if (wb === 'dagger') J.ang = -0.75;
  } else if (wb === 'bow' || wb === 'long') {
    J.hL = [-9.2, -23.6 + y]; J.hR = atk === 0 ? [-2.4, -23.6 + y] : [-5.2, -24.2 + y]; J.ang = -Math.PI / 2;
  } else if (wb === 'staff' || wb === 'skull' || wb === 'crozier') {
    if (atk >= 0) { J.hR = [7.2, -27.5 + y]; J.ang = -1.5; } else { J.hR = [8, -19 + y]; J.ang = -1.53; }
  } else if (wb === 'lute') { J.hL = [-3.4, -20.6 + y]; J.hR = [2.6, -21.6 + y + (atk === 1 ? 1 : 0)]; J.ang = -0.72; }
  else if (wb === 'lance') { if (atk >= 0) { J.hR = [6.4, atk ? -27 + y : -23 + y]; J.ang = -1.5; } else { J.hR = [7.8, -19 + y]; J.ang = -1.52; } }
  const kn = (h, f, o) => [(h[0] + f[0]) / 2 + o, (h[1] + f[1] - 2.5) / 2];
  J.ankL = [J.footL[0], J.footL[1] - 2.6]; J.ankR = [J.footR[0], J.footR[1] - 2.6];
  J.kL = sit ? [-6.4, -5] : kn(J.hipL, J.footL, -0.3); J.kR = sit ? [6.4, -5] : kn(J.hipR, J.footR, 0.3);
  J.eL = ik2(J.sL, J.hL, 5.1, 5.1, 1); J.eR = ik2(J.sR, J.hR, 5.1, 5.1, -1);
  return J;
}
// 점들을 (x,y) 기준으로 ang만큼 돌린다. 무기는 손잡이(0,0)에서 위(-y)로 뻗게 그린다
const rotPts = (pts, x, y, ang) => { const c = Math.cos(ang + Math.PI / 2), s = Math.sin(ang + Math.PI / 2); return pts.map(([px, py]) => [x + px * c - py * s, y + px * s + py * c]); };

function paintWeaponHi(D, wb, H, ang, tint, L, side) {
  const [x, y] = H, M = mat(tint, wb === 'club' ? 'wood' : tint === '#f0c860' ? 'gold' : 'metal'), wood = mat('#6b4a2e', 'wood'), gold = mat('#d8a84a', 'gold');
  const R = pts => rotPts(pts, x, y, ang), cap = (ax, ay, bx, by, r1, r2, m, o) => { const [[x1, y1], [x2, y2]] = R([[ax, ay], [bx, by]]); D.add(shCap(x1, y1, x2, y2, r1, r2), m, o); };
  const poly = (pts, m, o, bev) => D.add(shPoly(R(pts), bev || 1.6), m, o);
  const glow = L.glow && side !== 'back' ? mat(L.glow, 'glow') : null;
  if (wb === 'sword' || wb === 'great') {
    const g = wb === 'great', len = g ? 24 : 17, hw = g ? 2.4 : 1.6;
    cap(0, 3, 0, -1, 1.1, 1.1, mat('#4a2a1a', 'leather'));
    poly([[-hw, -2], [hw, -2], [hw * 0.8, -len], [0, -len - 3], [-hw * 0.8, -len]], glow || M, { line: 1 }, 1.4);
    if (!glow) for (let i = 4; i < len - 1; i += 1) { const [[px, py]] = R([[0, -i]]); D.shadeAt(px, py, 1); }
    poly([[-4.5, -1.2], [4.5, -1.2], [4.5, -2.8], [-4.5, -2.8]], gold, { cast: false }, 1);
    if (g) cap(0, 4.5, 0, 3, 1.4, 1.4, gold);
  } else if (wb === 'axe' || wb === 'gaxe') {
    const g = wb === 'gaxe';
    // 자루 끝에 좁은 목, 바깥으로 넓게 휜 날 (큰 도끼는 양날 + 위쪽 창끝)
    cap(0, 4, 0, g ? -21 : -16, 1.2, 1.1, wood, { tex: TX.grain() });
    const t = g ? -17 : -13, s = g ? 1.25 : 1;
    const bit = m => [[0.6 * m, t + 0.6], [3.4 * s * m, t + 1.2], [6.6 * s * m, t - 2.6 * s], [8.6 * s * m, t - 1.4 * s], [9.3 * s * m, t + 2.6], [8.6 * s * m, t + 6.6 * s], [6.6 * s * m, t + 8.4 * s], [3.4 * s * m, t + 4.6], [0.6 * m, t + 5.2]];
    poly(bit(1), M, { line: 1 }, 1.5);
    if (g) { poly(bit(-1), M, { line: 1 }, 1.5); poly([[-1, t - 1], [1, t - 1], [0, t - 6]], M, { line: 1 }, 1); }
    for (let i = 0; i <= 7; i++) { const u = i / 7, [[px, py]] = R([[(8.4 + Math.sin(u * Math.PI) * 0.7) * s, t - 1.2 * s + u * 7.6 * s]]); D.shadeAt(px, py, 2); if (g) { const [[qx, qy]] = R([[-(8.4 + Math.sin(u * Math.PI) * 0.7) * s, t - 1.2 * s + u * 7.6 * s]]); D.shadeAt(qx, qy, 2); } }
    const [[cx, cy]] = R([[0, t + 2.9]]); D.add(shEll(cx, cy, 1.4, 1.4), mat('#d8a84a', 'gold'), { cast: false });
  } else if (wb === 'club') {
    cap(0, 3, 0, -12, 1.4, 3, mat('#7a5232', 'wood'), { tex: TX.grain() });
  } else if (wb === 'mace' || wb === 'hammer') {
    cap(0, 4, 0, -11, 1.1, 1.1, wood);
    if (wb === 'hammer') { poly([[-4.5, -10], [5, -10], [5, -16], [-4.5, -16]], M, { line: 1 }, 1.4); poly([[-1, -16], [1, -16], [1, -18], [-1, -18]], gold); }
    else { const [[cx, cy]] = R([[0, -13]]); D.add(shEll(cx, cy, 3.6, 3.6), M); for (const [sx, sy] of [[0, -17.5], [-4, -13], [4, -13], [0, -8.8]]) { const [[px, py]] = R([[sx, sy]]); D.add(shEll(px, py, 1, 1), M); } }
  } else if (wb === 'dagger') {
    cap(0, 2.5, 0, -0.5, 0.9, 0.9, mat('#3a2a1a', 'leather'));
    poly([[-1.2, -1], [1.2, -1], [0.7, -9], [0, -10.5], [-0.7, -9]], glow || M, { line: 1 }, 1);
    poly([[-2.6, -0.6], [2.6, -0.6], [2.6, -1.8], [-2.6, -1.8]], gold, { cast: false }, 1);
  } else if (wb === 'lance') {
    cap(0, 8, 0, -26, 1.1, 1.1, wood, { tex: TX.grain() });
    poly([[-2, -26], [2, -26], [0, -34]], M, { line: 1 }, 1.2);
    poly([[1, -23], [7, -21], [1, -19]], mat(L.c2 || '#c0392b'), { cast: false });
  } else if (wb === 'bow' || wb === 'long') {
    const h = wb === 'long' ? 15 : 12, gb = wb === 'long' && L.c2 === '#e8c060', bw = mat(gb ? '#e8c060' : '#7a5232', gb ? 'gold' : 'wood'), m = H.mir ? -1 : 1;
    D.add(shCap(x, y - 1, x + 3 * m, y - h * 0.55, 1.2, 1), bw); D.add(shCap(x + 3 * m, y - h * 0.55, x, y - h, 1, 0.8), bw);
    D.add(shCap(x, y + 1, x + 3 * m, y + h * 0.55, 1.2, 1), bw); D.add(shCap(x + 3 * m, y + h * 0.55, x, y + h, 1, 0.8), bw);
    for (let i = -h; i <= h; i++) D.px(x - m + (H.pull && Math.abs(i) < h * 0.5 ? -m * (h * 0.5 - Math.abs(i)) * 0.9 : 0), y + i, '#e8e2d0');
  } else if (wb === 'staff' || wb === 'skull' || wb === 'crozier') {
    cap(0, 9, 0, -21, 1.1, 1.1, wb === 'crozier' ? gold : wood, { tex: wb === 'crozier' ? null : TX.grain() });
    const [[tx, ty]] = R([[0, -24]]);
    if (wb === 'skull') { D.add(shEll(tx, ty, 3.4, 3.2), mat('#e8e4dc', 'bone')); D.px(tx - 1, ty, '#1a1020'); D.px(tx + 1, ty, '#1a1020'); D.px(tx, ty + 2, '#4a3a40', 1, 1); if (L.eyes) { D.px(tx - 1, ty, L.eyes); D.px(tx + 1, ty, L.eyes); } }
    else if (wb === 'crozier') { const pts = []; for (let i = 0; i <= 8; i++) { const a = Math.PI * i / 8; pts.push([Math.cos(a + Math.PI) * 3.5 + 3.5, -21 - Math.sin(a) * 4.5]); } for (let i = 0; i < pts.length - 1; i++) cap(pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1], 1, 1, gold); }
    else { D.add(shEll(tx, ty, 2.8, 3.6, ang + Math.PI / 2), mat(L.gem || '#8ad8ff', 'gem')); poly([[-2.6, -20], [2.6, -20], [1.6, -22], [-1.6, -22]], gold); }
  } else if (wb === 'lute') {
    const [[bx, by]] = R([[0, 3]]);
    D.add(shEll(bx, by, 4.6, 6.2, ang + Math.PI / 2), mat('#c07a3e', 'wood'), { line: 1 });
    cap(0, -3, 0, -14, 1.1, 1, mat('#5a3a22', 'wood'));
    poly([[-1.8, -14], [1.8, -14], [2.2, -17], [-1.2, -18]], mat('#3a2010', 'wood'));
    const [[sx2, sy2]] = R([[0, 2]]); D.px(sx2 - 1, sy2 - 1, '#2a1408', 2, 2);
    for (let i = -2; i < 8; i++) { const [[px, py]] = R([[0, -i]]); D.px(px, py, '#e8dcc0'); }
  }
}

function paintAdvHi(D, a, pose, fr, Lx) {
  const cls = CLASSES[a.cls] ? a.cls : 'warrior', L = Lx || LOOKS[cls] || LOOKS[jobBase(cls)] || LOOKS.warrior;
  const lk = a.look || {}, wpn = a.eq && a.eq.weapon, arm = a.eq && a.eq.armor, ex = L.ex || [];
  const wb0 = wpn ? wpn.base : (typeof WEAPON_OF !== 'undefined' && WEAPON_OF[cls]) || 'sword';
  const wb = L.wv && !(['bow', 'lute'].includes(wb0) && L.wv !== 'long') ? (L.wv === 'long' ? (wb0 === 'bow' ? 'long' : wb0) : L.wv === 'great' ? (['sword', 'axe'].includes(wb0) ? (wb0 === 'axe' ? 'gaxe' : 'great') : wb0) : L.wv === 'hammer' ? (wb0 === 'mace' ? 'hammer' : wb0) : ['skull', 'crozier'].includes(L.wv) ? (wb0 === 'staff' ? L.wv : wb0) : wb0) : wb0;
  if (pose === 'sleep') { sleepHi(D, a, L, lk); return; }
  const J = frontJoints(pose, fr, L, wb);
  const skinC = L.skin || lk.skin || SKINS[0], sk = mat(skinC, L.bones ? 'bone' : 'skin'), hr = mat(lk.hair || HAIRS[0], 'hair');
  const c1 = mat(L.c1), c2 = mat(L.c2, /e[0-9a-f]c0|f0c24a|e8c060|d8a84a|e0b040|c9a04a/.test(L.c2) ? 'gold' : 'cloth'), c3 = mat(L.c3 || L.c1);
  const metalC = L.metal || (arm ? ARM_TINT[arm.t] : '#8a8e98'), mt = mat(metalC, 'metal'), gold = mat('#d8a84a', 'gold');
  const wTint = wpn ? WPN_TINT[wpn.t] : '#a8aeb8', boot = mat(BOOT, 'leather'), belt = mat(BELT, 'leather');
  const body = L.body, robe = body === 'robe', plate = body === 'plate' || body === 'scale', style = (a.id || 0) % 3;
  const [hx, hy] = J.head, [tx, ty] = J.torso, hipY = J.hipL[1];
  const pants = plate ? mt : body === 'bare' ? c1 : body === 'chain' ? mat('#4a4a52') : mat(body === 'coat' ? '#2e2a34' : '#4a3a2e');
  const sleeve = plate || body === 'chain' ? mt : body === 'bare' ? sk : c1;
  const twin = ex.includes('twin'), head = L.head;
  const hidesHair = ['great', 'winged', 'hood', 'hoodup', 'cowl', 'coif', 'coif2', 'beak', 'dragon', 'glad', 'horn', 'mitre', 'mitre2'].includes(head) || L.bones;

  // ── 등 뒤: 망토·짐·화살통·긴 머리 ──
  if (L.cape) { const fl = J.atk === 1 ? 1 : J.walk ? (J.fr % 2) : 0; D.add(shPoly([[tx - 5.4, J.neck[1] + 1.4], [tx + 5.4, J.neck[1] + 1.4], [tx + 9 + fl, J.sit ? -1 : -1.5], [tx, J.sit ? -0.5 : -0.5], [tx - 9 - fl, J.sit ? -1 : -1.5]], 2), mat(L.cape), { lift: -0.2 }); }
  if (ex.includes('pack')) { D.add(shBox(tx - 8.6, J.neck[1] - 4, 17.2, 15, 3, 2.4), mat('#7a5634', 'leather')); D.add(shCap(tx - 7.8, J.neck[1] - 4.6, tx + 7.8, J.neck[1] - 4.6, 2.2), mat(L.c3 || '#a8432f')); }
  if (ex.includes('quiver')) { D.add(shPoly([[tx + 3.2, J.neck[1] - 6.4], [tx + 7.4, J.neck[1] - 5.6], [tx + 8.6, J.neck[1] + 5], [tx + 5, J.neck[1] + 5]], 1.2), mat('#6a4a2a', 'leather')); for (let i = 0; i < 3; i++) D.add(shCap(tx + 3.8 + i * 1.4, J.neck[1] - 6.6, tx + 4 + i * 1.5, J.neck[1] - 9.6, 0.8, 0.6), mat(L.feather || '#e8e2d0'), { cast: false }); }
  if (!hidesHair && style === 1) D.add(shBox(hx - 7, hy - 2, 14, 12.6, 3, 1.8), hr);
  if (['hood', 'hoodup', 'cowl', 'coif', 'coif2'].includes(head)) {
    const hc = head === 'coif' ? mat('#f4f0e6') : head === 'hoodup' && L.cape ? mat(L.cape) : c1;
    D.add(shEll(hx, hy + 0.6, 8.6, 8.6), hc);
    D.add(shPoly([[hx - 8.4, hy + 3], [hx + 8.4, hy + 3], [hx + 9.4, hy + 9.6], [hx - 9.4, hy + 9.6]], 2), hc);
  }

  // ── 다리 ──
  const leg = (H, K, A, F) => {
    D.add(shCap(H[0], H[1], K[0], K[1], 2.7, 2.4), pants);
    D.add(shCap(K[0], K[1], A[0], A[1], 2.4, 2.1), plate ? mt : pants);
    D.add(shBox(F[0] - 2.7, F[1] - 4.3, 5.4, 4.3, 1.5, 1.5), plate ? mt : boot);
    if (plate) D.add(shEll(K[0], K[1], 2.1, 1.9), mt);
  };
  if (!robe) { leg(J.hipL, J.kL, J.ankL, J.footL); leg(J.hipR, J.kR, J.ankR, J.footR); }
  // 옷자락
  if (robe) {
    const bot = -1, w = J.sit ? 9 : 8.4;
    D.add(shPoly([[tx - 5.8, hipY - 4], [tx + 5.8, hipY - 4], [tx + w, bot], [tx - w, bot]], 2.4), c1, { tex: TX.fold(5, 2) });
    D.add(shPoly([[tx - w, bot - 2.4], [tx + w, bot - 2.4], [tx + w + 0.3, bot], [tx - w - 0.3, bot]], 0.8), c2, { cast: false });
    D.add(shBox(J.footL[0] - 2.4, -2.4, 4.4, 2.4, 1, 1), boot); D.add(shBox(J.footR[0] - 2, -2.4, 4.4, 2.4, 1, 1), boot);
  }
  if (body === 'coat') { D.add(shPoly([[tx - 6.2, hipY - 3], [tx - 1, hipY - 1], [tx - 2, hipY + 9], [tx - 8.8, hipY + 8]], 1.6), c1); D.add(shPoly([[tx + 6.2, hipY - 3], [tx + 1, hipY - 1], [tx + 2, hipY + 9], [tx + 8.8, hipY + 8]], 1.6), c1); }

  // ── 몸통 ──
  const torsoM = plate || body === 'chain' ? mt : body === 'bare' ? sk : body === 'leather' ? c1 : c1;
  D.add(shEll(tx, ty, plate ? 7 : 6.5, 7.6), torsoM, { tex: body === 'chain' ? TX.chain() : body === 'scale' ? TX.scale() : null });
  if (plate) { D.px(tx - 0.5, ty - 5, rgbHex(MATS[mt].rp[4]), 1, 7); D.add(shBox(tx - 6.4, hipY - 2.4, 12.8, 5.2, 1.6, 1.4), mt, { tex: TX.plates(3) }); if (L.stars) D.add(shEll(tx, ty - 1, 4, 4.6), mat(L.c1), { cast: false }); }
  if (body === 'leather') { D.add(shPoly([[tx - 6, ty - 6], [tx - 1.2, ty - 6.4], [tx - 1.6, hipY - 2], [tx - 6.2, hipY - 2]], 1.4), mat(L.c2, 'leather')); D.add(shPoly([[tx + 6, ty - 6], [tx + 1.2, ty - 6.4], [tx + 1.6, hipY - 2], [tx + 6.2, hipY - 2]], 1.4), mat(L.c2, 'leather')); }
  if (body === 'coat') { D.add(shPoly([[tx - 1.8, J.neck[1] + 1], [tx + 1.8, J.neck[1] + 1], [tx + 1.6, hipY - 2], [tx - 1.6, hipY - 2]], 0.8), mat('#e8e2d0'), { cast: false }); D.add(shCap(tx - 2.6, J.neck[1] + 1.4, tx - 1.8, hipY - 3, 0.9), c2, { cast: false }); D.add(shCap(tx + 2.6, J.neck[1] + 1.4, tx + 1.8, hipY - 3, 0.9), c2, { cast: false }); }
  if (robe) { D.add(shCap(tx, J.neck[1] + 1.6, tx, hipY - 3, 0.8), c2, { cast: false }); D.add(shEll(tx, J.neck[1] + 1.4, 3.6, 1.6), c2, { cast: false }); }
  if (body === 'bare') { D.add(shCap(tx - 5, J.neck[1] + 2, tx + 4.6, hipY - 4, 1.1), mat(L.c2, 'leather'), { cast: false }); D.px(tx - 2.6, ty - 2, rgbHex(MATS[sk].rp[1]), 2, 1); D.px(tx + 1.6, ty - 2, rgbHex(MATS[sk].rp[1]), 2, 1); }
  if (ex.includes('tabard')) { D.add(shPoly([[tx - 3.2, J.neck[1] + 2], [tx + 3.2, J.neck[1] + 2], [tx + 3.4, hipY + 6], [tx - 3.4, hipY + 6]], 1), c1, { lift: 0.1 }); D.px(tx - 0.5, ty - 3.5, rgbHex(MATS[c2].rp[3]), 2, 7); D.px(tx - 2.5, ty - 1.5, rgbHex(MATS[c2].rp[3]), 6, 2); }
  if (ex.includes('holy')) { D.px(tx - 0.5, ty - 4, '#e0c060', 1, 6); D.px(tx - 2.5, ty - 2, '#e0c060', 5, 1); }
  if (ex.includes('stole')) { D.add(shCap(tx - 2.4, J.neck[1] + 1.5, tx - 2.6, hipY + 8, 1), c2, { cast: false }); D.add(shCap(tx + 2.4, J.neck[1] + 1.5, tx + 2.6, hipY + 8, 1), c2, { cast: false }); }
  if (!robe || J.sit) { D.add(shBox(tx - 6.4, hipY - 3.4, 12.8, 2.8, 1, 1), ex.includes('sash') ? c3 : belt, { cast: false }); D.px(tx - 1, hipY - 2.8, '#f0c860', 2, 2); }
  if (ex.includes('sash')) D.add(shPoly([[tx + 3, hipY - 2], [tx + 5, hipY - 1.4], [tx + 6.6, hipY + 7], [tx + 4.6, hipY + 7]], 0.8), c3);

  // ── 팔: 왼쪽(방패·활) · 오른쪽(무기) ──
  const arm2 = (S0, E, H, side) => {
    const wide = robe ? 1 : 0;
    D.add(shCap(S0[0], S0[1], E[0], E[1], 2.5, 2.2), sleeve, { tex: body === 'chain' ? TX.chain() : null });
    D.add(shCap(E[0], E[1], H[0], H[1], 2.2, 2 + wide * 1.2), plate ? mt : body === 'bare' ? (ex.includes('manica') && side > 0 ? mat(metalC, 'gold') : sk) : sleeve, { tex: ex.includes('manica') && side > 0 ? TX.plates(2) : null });
    if (body === 'bare' && !(ex.includes('manica') && side > 0)) D.add(shCap(E[0] + (H[0] - E[0]) * 0.45, E[1] + (H[1] - E[1]) * 0.45, H[0], H[1], 2.3, 2.1), mat('#6a4a2a', 'leather'));
  };
  const bowLike = wb === 'bow' || wb === 'long';
  arm2(J.sL, J.eL, J.hL, -1);
  if (bowLike) paintWeaponHi(D, wb, Object.assign([J.hL[0], J.hL[1]], { pull: J.atk === 0, mir: 1 }), J.ang, wTint, L);
  if (twin) paintWeaponHi(D, wb === 'great' ? 'sword' : wb, J.hL, J.angL, wTint, L, 'back');
  D.add(shEll(J.hL[0], J.hL[1], 2.1, 2.1), plate ? mt : sk);
  if (ex.includes('book')) D.add(shBox(J.hL[0] - 3, J.hL[1] - 3, 6, 7, 1, 1.2), mat('#3a2a4a', 'leather'), { line: 1 });
  if (ex.includes('bag')) D.add(shBox(J.hL[0] - 3.4, J.hL[1], 7, 6, 1.5, 2), mat('#5a3a22', 'leather'));
  if (L.shield && !J.sit) {
    const sx = J.hL[0] - 0.4, sy = J.hL[1] - 1.6;
    if (L.shield === 'round') { D.add(shEll(sx, sy, 6.4, 6.8), mat(metalC, 'gold')); D.add(shEll(sx, sy, 4.6, 4.9), mat('#7a3a24', 'wood'), { cast: false }); D.add(shEll(sx, sy, 1.8, 1.8), mat(metalC, 'gold')); }
    else if (L.shield === 'kite') { D.add(shPoly([[sx - 5.6, sy - 7.6], [sx + 5.6, sy - 7.6], [sx + 5.2, sy + 1.4], [sx, sy + 10.6], [sx - 5.2, sy + 1.4]], 2.2), mt, { line: 1 }); D.add(shPoly([[sx - 4, sy - 6], [sx + 4, sy - 6], [sx + 3.6, sy + 1], [sx, sy + 8.4], [sx - 3.6, sy + 1]], 1.6), c1, { cast: false }); D.px(sx - 0.5, sy - 4.6, rgbHex(MATS[c2].rp[3]), 2, 9); D.px(sx - 3, sy - 1.6, rgbHex(MATS[c2].rp[3]), 7, 2); }
    else { D.add(shBox(sx - 6, sy - 9, 12, 20, 3, 2.6), mat('#e8c060', 'gold'), { line: 1 }); D.add(shBox(sx - 4.4, sy - 7.4, 8.8, 16.8, 2, 2), mat(L.c1 === '#e8e4d8' ? '#3a5aa8' : L.c1), { cast: false }); D.px(sx - 0.5, sy - 6, '#f4e8a0', 2, 13); D.px(sx - 3.5, sy - 2, '#f4e8a0', 8, 2); }
  }

  // ── 머리 ──
  if (!hidesHair) { D.add(shEll(hx - 6.6, hy + 1, 1.3, 1.8), sk); D.add(shEll(hx + 6.6, hy + 1, 1.3, 1.8), sk); D.add(shEll(hx, hy - 1.2, 7.2, 7), hr, { cast: false }); }
  D.add(shEll(hx, hy, 6.4, 6.8), sk, { cast: false });
  const ey = hy + 0.6, eyeC = L.eyes || '#22161c';
  if (L.bones) { D.px(hx - 3.4, ey - 1, '#1a1020', 3, 3); D.px(hx + 0.6, ey - 1, '#1a1020', 3, 3); D.px(hx - 2.4, ey, L.eyes || '#c89aff'); D.px(hx + 1.6, ey, L.eyes || '#c89aff'); D.px(hx - 2, hy + 4, '#3a3040', 4, 1); D.px(hx - 1, hy + 4, '#e8e4dc'); D.px(hx + 1, hy + 4, '#e8e4dc'); }
  else if (!['great', 'winged', 'beak', 'dragon'].includes(head)) {
    D.px(hx - 2.6, ey, eyeC, 1, 2); D.px(hx + 1.8, ey, eyeC, 1, 2);
    if (!L.eyes) { D.px(hx - 3.6, ey, '#f4ece0', 1, 1); D.px(hx + 2.8, ey, '#f4ece0', 1, 1); }
    D.px(hx - 0.5, hy + 4.2, rgbHex(MATS[sk].rp[1]), 2, 1);
    if (ex.includes('paint')) { D.px(hx - 4, ey + 2.4, '#c0392b', 2, 1); D.px(hx + 2.4, ey + 2.4, '#c0392b', 2, 1); }
  }
  if (!hidesHair && !['tophat', 'wizard', 'widebrim', 'beret', 'feather'].includes(head)) {
    D.add(shEll(hx, hy - 3.6, 7, 4.2), hr, { clip: (px, py) => py < hy - 2 + Math.abs(px - hx - 1.2) * 0.35 });
    if (style === 2) [[-3.6, -7.6], [0, -8.4], [3.4, -7.6]].forEach(([sx, sy2]) => D.add(shPoly([[hx + sx - 1.8, hy + sy2 + 3], [hx + sx + 1.8, hy + sy2 + 3], [hx + sx + 0.6, hy + sy2 - 1.2]], 1), hr));
    D.add(shCap(hx - 6, hy - 2.4, hx - 6.2, hy + 3, 1.5, 1.1), hr); D.add(shCap(hx + 6, hy - 2.4, hx + 6.2, hy + 3, 1.5, 1.1), hr);
  }
  paintHeadFront(D, head, hx, hy, L, { mt, c1, c2, c3, gold, hr, sk });

  // ── 어깨 ──
  for (const S0 of [J.sL, J.sR]) {
    if (L.sh === 'pauldron') D.add(shEll(S0[0], S0[1] + 0.4, 3.8, 3.2), plate || body === 'chain' || L.metal ? mt : mat('#8a98b8', 'metal'), { tex: TX.plates(3) });
    if (L.sh === 'fur') D.add(shEll(S0[0], S0[1] + 0.4, 4.4, 3.4), mat('#8a6a4a', 'fur'));
    if (L.sh === 'spike') { D.add(shEll(S0[0], S0[1] + 0.4, 4, 3.4), mt); D.add(shPoly([[S0[0] - 1.6, S0[1] - 2], [S0[0] + 1.6, S0[1] - 2], [S0[0] + Math.sign(S0[0]) * 1.4, S0[1] - 6.4]], 0.8), mat('#c8c0c8', 'metal')); }
  }
  // ── 오른팔과 무기 ──
  const pre = wb === 'lute';
  if (pre) paintWeaponHi(D, wb, J.hL, J.ang, wTint, L);
  arm2(J.sR, J.eR, J.hR, 1);
  if (!bowLike && !pre) paintWeaponHi(D, wb, J.hR, J.ang, wTint, L);
  D.add(shEll(J.hR[0], J.hR[1], 2.1, 2.1), plate ? mt : sk);
  if (ex.includes('scarf')) { D.add(shBox(hx - 5, J.neck[1] - 1, 10, 3, 1.4, 1.2), c3, { cast: false }); D.add(shPoly([[hx + 2.4, J.neck[1] + 1], [hx + 4.6, J.neck[1] + 1], [hx + 5.6, J.neck[1] + 7], [hx + 3.4, J.neck[1] + 7]], 0.8), c3); }
  if (ex.includes('wisp')) for (const [wx, wy] of [[-10, -22], [10, -14], [-9, -8]]) D.px(wx, wy + J.bob - (fr % 2), '#9a6ad8', 2, 2);
  if (L.stars) for (const [sx, sy] of [[-10, -26], [9, -30], [-8, -12]]) D.px(sx, sy + J.bob, '#fff4b0', 1, 1);
}

// 머리 장식 (앞모습, 좌우 대칭)
function paintHeadFront(D, head, hx, hy, L, M) {
  const { mt, c1, c2, c3, gold, hr } = M;
  const ink = (x, y, w, h, c) => D.px(x, y, c || INK, w, h);
  const hood = (m, deep) => D.add(shEll(hx, hy - 0.6, 8.2, 8.4), m, { clip: (px, py) => ((px - hx) / 5.6) ** 2 + ((py - hy - (deep ? 1.6 : 1)) / (deep ? 5.6 : 6.2)) ** 2 > 1 && py < hy + 6 });
  if (head === 'helm') {
    D.add(shEll(hx, hy - 2.4, 7.4, 6.6), mt, { clip: (px, py) => py < hy - 0.4 });
    D.add(shBox(hx - 7.6, hy - 1.8, 15.2, 2.3, 1, 1), mt, { lift: 0.1 });
    D.add(shBox(hx - 0.8, hy - 0.8, 1.6, 4.8, 0.6, 0.8), mt);
    D.px(hx - 3, hy - 7, rgbHex(MATS[mt].rp[4]), 2, 2);
  } else if (head === 'great' || head === 'winged') {
    D.add(shBox(hx - 7.2, hy - 8.4, 14.4, 16.4, 4.4, 3.2), mt);
    ink(hx - 5, hy, 10, 1.2); ink(hx - 0.5, hy, 1, 5); D.px(hx - 5, hy - 1, rgbHex(MATS[mt].rp[4]), 2, 1);
    D.px(hx - 3, hy + 3, INK, 1, 1); D.px(hx + 2, hy + 3, INK, 1, 1);
    if (head === 'winged') for (const s of [-1, 1]) { const bx = hx + s * 6.6; D.add(shPoly([[bx, hy - 3], [bx + s * 2.4, hy - 11], [bx + s * 5.6, hy - 12.4], [bx + s * 3.4, hy - 5]], 1.1), mat('#f4f0e6')); }
    if (L.plume) D.add(shPoly([[hx - 1.6, hy - 8.4], [hx + 1.6, hy - 8.4], [hx + 3, hy - 14], [hx, hy - 16.6], [hx - 2.4, hy - 13.4]], 1.2), mat(L.plume));
  } else if (head === 'glad') {
    const br = mat(L.metal || '#c08a3a', 'gold');
    D.add(shEll(hx, hy - 2.2, 7.6, 6.8), br, { clip: (px, py) => py < hy + 0.6 });
    D.add(shBox(hx - 7.4, hy - 1, 3.4, 7, 1.2, 1.2), br); D.add(shBox(hx + 4, hy - 1, 3.4, 7, 1.2, 1.2), br);
    D.add(shPoly([[hx - 1.8, hy - 8], [hx + 1.8, hy - 8], [hx + 4.2, hy - 12.4], [hx, hy - 14.6], [hx - 4.2, hy - 12.4]], 1.2), mat('#c0392b'));
  } else if (head === 'horn') {
    D.add(shEll(hx, hy - 2.4, 7.4, 6.4), mt, { clip: (px, py) => py < hy - 0.2 });
    D.add(shBox(hx - 7.4, hy - 1.6, 14.8, 2.1, 1, 1), mt);
    const bone = mat(L.eyes ? '#3a2a2a' : '#e8e2d0', 'bone');
    for (const s of [-1, 1]) { D.add(shCap(hx + s * 5.6, hy - 4.4, hx + s * 9.8, hy - 8.4, 1.9, 1.3), bone); D.add(shCap(hx + s * 9.8, hy - 8.4, hx + s * 9, hy - 13, 1.3, 0.5), bone); }
  } else if (head === 'dragon') {
    D.add(shBox(hx - 7, hy - 7.6, 14, 15, 4, 3), mt, { tex: TX.scale() });
    ink(hx - 4.6, hy + 0.2, 9.2, 1.4); D.px(hx - 3, hy + 0.2, L.c2, 1, 1); D.px(hx + 2, hy + 0.2, L.c2, 1, 1);
    for (const s of [-1, 1]) D.add(shCap(hx + s * 4, hy - 6.6, hx + s * 8.4, hy - 12.6, 1.7, 0.6), mat(L.c2, 'gem'));
    D.add(shPoly([[hx - 1.6, hy - 7.6], [hx + 1.6, hy - 7.6], [hx, hy - 12]], 0.8), mat(L.c2, 'gem'));
  } else if (head === 'hood') { hood(c1, false); if (L.feather) D.add(shCap(hx + 3.4, hy - 6.4, hx + 7, hy - 11, 1, 0.5), mat(L.feather)); }
  else if (head === 'hoodup') { hood(L.cape ? mat(L.cape) : c1, true); D.add(shPoly([[hx - 2.4, hy - 7.6], [hx + 2.4, hy - 7.6], [hx, hy - 11.4]], 1), L.cape ? mat(L.cape) : c1); }
  else if (head === 'cowl') { hood(c1, false); D.add(shBox(hx - 5, hy + 1.6, 10, 5.2, 2, 1.6), mat(L.c3 || '#3a3a46'), { cast: false }); if (L.eyes) { D.px(hx - 2.6, hy + 0.4, L.eyes, 1, 1); D.px(hx + 1.8, hy + 0.4, L.eyes, 1, 1); } }
  else if (head === 'coif') { hood(mat('#f4f0e6'), false); D.add(shBox(hx - 5.6, hy - 5, 11.2, 1.6, 0.6, 0.6), c2, { cast: false }); }
  else if (head === 'coif2') { hood(c1, false); D.add(shBox(hx - 5.6, hy - 5, 11.2, 1.6, 0.6, 0.6), c2, { cast: false }); }
  else if (head === 'wizard') {
    D.add(shEll(hx, hy - 4.6, 10.6, 2.4), c1);
    D.add(shPoly([[hx - 5.8, hy - 5], [hx + 5.8, hy - 5], [hx + 2.2, hy - 13.4], [hx + 6, hy - 19.4], [hx - 1.4, hy - 13.6]], 2), c1);
    D.add(shBox(hx - 5.8, hy - 7.6, 11.6, 2.2, 0.8, 0.8), c2, { cast: false });
    D.px(hx + 5, hy - 20, rgbHex(MATS[c2].rp[3]), 2, 2);
  } else if (head === 'mitre' || head === 'mitre2') {
    const t = head === 'mitre2' ? 18 : 14, wm = mat('#f4f0e6');
    D.add(shPoly([[hx - 5.6, hy - 4], [hx + 5.6, hy - 4], [hx + 4.4, hy - t + 5], [hx, hy - t], [hx - 4.4, hy - t + 5]], 2), wm);
    D.add(shBox(hx - 5.8, hy - 5.8, 11.6, 2, 0.6, 0.6), c2, { cast: false });
    D.px(hx - 0.5, hy - t + 3, rgbHex(MATS[c2].rp[3]), 1, t - 8); D.px(hx - 2.5, hy - t + 6, rgbHex(MATS[c2].rp[3]), 5, 1);
  } else if (head === 'crown' || head === 'bonecrown') {
    const cm = head === 'crown' ? gold : mat('#e8e4dc', 'bone');
    D.add(shBox(hx - 6, hy - 7.4, 12, 3.4, 0.6, 1), cm, { cast: false });
    for (const sx of [-4.6, -1.5, 1.5, 4.6]) D.add(shPoly([[hx + sx - 1.4, hy - 7], [hx + sx + 1.4, hy - 7], [hx + sx, hy - 11.4]], 0.8), cm);
    if (head === 'crown') { D.px(hx - 1, hy - 6.6, L.gem || '#c0392b', 2, 2); D.px(hx - 4.4, hy - 6.4, '#5ac8f0', 1, 1); D.px(hx + 3.6, hy - 6.4, '#7ae0a0', 1, 1); }
  } else if (head === 'circlet') {
    D.add(shBox(hx - 6.8, hy - 5, 13.6, 1.6, 0.6, 0.6), gold, { cast: false });
    D.px(hx - 1, hy - 5.4, L.gem || '#8ab8ff', 2, 2);
  } else if (head === 'laurel') {
    for (let i = 0; i < 7; i++) { const u = i / 6, x = hx - 6.4 + u * 12.8; D.add(shEll(x, hy - 5 - Math.sin(u * Math.PI) * 1.6, 1.5, 0.9, (u - 0.5) * 1.2), mat('#5aa84a'), { cast: false }); }
  } else if (head === 'band' || head === 'goggles') {
    const bm = mat(L.c3 || '#c0392b');
    D.add(shBox(hx - 7, hy - 4.6, 14, 2.6, 0.8, 0.8), bm, { cast: false });
    D.add(shCap(hx + 6.6, hy - 3.4, hx + 9.6, hy + 1.6, 1, 0.8), bm);
    if (head === 'goggles') for (const s of [-1, 1]) { D.add(shEll(hx + s * 2.6, hy - 4.6, 2.2, 2), mat('#8a6a3a', 'metal')); D.px(hx + s * 2.6 - 1, hy - 5.4, '#9ad8f0', 2, 1); }
  } else if (head === 'beret' || head === 'feather') {
    const bm = head === 'beret' ? c1 : mat('#5a6a3a');
    D.add(shEll(hx + 1, hy - 5.2, 8.2, 3.6, 0.12), bm);
    D.add(shCap(hx - 3.6, hy - 6.8, hx - 9.4, hy - 13, 1.5, 0.5), mat(L.feather || '#e05a4a'));
  } else if (head === 'tophat') {
    D.add(shEll(hx, hy - 4.6, 9, 1.9), mat('#1e1828'));
    D.add(shBox(hx - 5, hy - 15.4, 10, 11, 1, 1.4), mat('#1e1828'));
    D.add(shBox(hx - 5, hy - 7.4, 10, 2, 0.4, 0.4), c1, { cast: false });
  } else if (head === 'widebrim') {
    D.add(shEll(hx, hy - 4.4, 11.4, 2.3), mat('#1e1418'));
    D.add(shBox(hx - 5.4, hy - 12.4, 10.8, 8.2, 1.6, 1.6), mat('#1e1418'));
    D.add(shBox(hx - 5.4, hy - 6.8, 10.8, 1.6, 0.4, 0.4), c2, { cast: false }); D.px(hx - 1, hy - 7.2, '#f0d070', 2, 2);
  } else if (head === 'beak') {
    D.add(shEll(hx, hy - 4.6, 10.8, 2.3), mat('#1e1c22'));
    D.add(shBox(hx - 5.6, hy - 12.4, 11.2, 8.2, 1.6, 1.6), mat('#1e1c22'));
    for (const s of [-1, 1]) D.add(shEll(hx + s * 2.6, hy + 0.2, 2, 2), mat('#8ad8ff', 'gem'));
    D.add(shPoly([[hx - 2.2, hy + 1.6], [hx + 2.2, hy + 1.6], [hx + 0.4, hy + 9.4]], 1), mat('#d8c8a0', 'bone'));
  } else if (head === 'monocle') {
    D.add(shEll(hx + 1.8, hy + 1.2, 2.1, 2.1), mat('#e8c060', 'gold'), { cast: false }); D.px(hx + 1.8, hy + 1, '#cfefff', 1, 1); D.px(hx + 1.8, hy + 0.6, '#22161c', 1, 2);
  }
  if ((L.ex || []).includes('mask')) { D.px(hx - 5, hy, '#1e1418', 10, 2.4); D.px(hx - 3, hy + 0.6, '#f0e6d8', 1, 1); D.px(hx + 1.6, hy + 0.6, '#f0e6d8', 1, 1); }
}
// 침낭에서 잔다 (머리가 오른쪽)
function sleepHi(D, a, L, lk) {
  const roll = mat(L.cape || L.c1), sk = mat(L.skin || lk.skin || SKINS[0], L.bones ? 'bone' : 'skin');
  D.add(shBox(-18, -9, 30, 9, 4, 3), roll, { tex: TX.fold(5, 0) });
  D.add(shBox(-18, -9, 9, 9, 3, 2), mat('#e8dcb8'), { cast: false });
  D.add(shEll(14, -6, 5.5, 5.5), sk);
  D.add(shEll(15, -9, 6, 3.6), mat(lk.hair || HAIRS[0], 'hair'), { clip: (px, py) => py < -7 });
  D.px(16, -6, '#3a2a20', 2, 1);
}
// 모험가 굽기: 두 배 해상도, 발밑이 (34, 58)
const ADV_HW = 64, ADV_HH = 64, ADV_AX = 32, ADV_AY = 60;
// z: 배율 (무대 앞줄은 크게). 모양을 그 배율로 다시 찍으니 도트가 뭉개지지 않는다
function advSprite(a, pose, fr, z = 1) {
  const key = 'H|' + advKey(a) + '|' + pose + fr + '|' + z + '|' + (FLASH || '');
  return bakeHi(key, Math.ceil(ADV_HW * z), Math.ceil(ADV_HH * z), Math.round(ADV_AX * z), Math.round(ADV_AY * z), D => { D.sc = z; paintAdvHi(D, a, pose, fr); });
}
