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
const WALK_HI = [{ f: [5, 0], b: [-4, 0], bob: 0, sw: -3 }, { f: [1, -2], b: [0, 0], bob: -1, sw: 0 }, { f: [-4, 0], b: [5, 0], bob: 0, sw: 3 }, { f: [0, 0], b: [1, -2], bob: -1, sw: 0 }];
function advJoints(pose, fr, L, wb) {
  const walk = pose === 'walk', W = walk ? WALK_HI[fr % 4] : { f: [3, 0], b: [-3, 0], bob: pose === 'idle' && fr % 2 ? -1 : 0, sw: 0 };
  const atk = pose === 'atk' ? fr % 2 : -1, bob = W.bob, ln = atk === 1 ? 2 : atk === 0 ? -1 : 0, sw = W.sw;
  const J = { bob, ln, atk, walk, sit: pose === 'sit', hip: [ln * 0.5, -16 + bob], neck: [ln, -29 + bob], head: [1 + ln, -36 + bob],
    fS: [3 + ln, -27 + bob], bS: [-3 + ln, -27 + bob], fF: W.f.slice(), bF: W.b.slice(), ang: -1.15, sw };
  J.fH = [6 + ln + sw * 0.6, -17 + bob]; J.bH = [-5 + ln - sw * 0.6, -17 + bob];
  if (L.shield) J.bH = [4 + ln - sw * 0.2, -20 + bob];
  if (J.sit) { Object.assign(J, { hip: [0, -7], neck: [0, -20], head: [1, -27], fS: [3, -18], bS: [-3, -18], fF: [10, 0], bF: [8, 0], fH: [8, -10], bH: [5, -10], ang: -0.25 }); }
  else if (MELEE_W.includes(wb) || wb === 'great' || wb === 'hammer') {
    if (atk === 0) { J.fH = [-1 + ln, -35 + bob]; J.ang = -2.45; }
    else if (atk === 1) { J.fH = [12 + ln, -22 + bob]; J.ang = wb === 'dagger' ? 0.05 : 0.3; }
    else J.ang = wb === 'dagger' ? -0.5 : -1.1;
    if (L.ex && L.ex.includes('twin')) { J.bH = atk === 1 ? [6 + ln, -25 + bob] : [2 + ln - sw * 0.4, -18 + bob]; J.bang = atk === 1 ? -0.6 : -0.7; }
  } else if (wb === 'bow' || wb === 'long') {
    J.fH = [10 + ln, -24 + bob]; J.bH = atk === 0 ? [1 + ln, -24 + bob] : [5 + ln, -24 + bob]; J.ang = -Math.PI / 2;
  } else if (wb === 'staff' || wb === 'skull' || wb === 'crozier') {
    if (atk >= 0) { J.fH = [9 + ln, -27 + bob]; J.ang = atk ? -0.85 : -1.3; } else { J.fH = [7 + ln, -18 + bob]; J.ang = -1.5; }
  } else if (wb === 'lute') { J.fH = [3 + ln, -19 + bob + (atk === 1 ? 1 : 0)]; J.bH = [8 + ln, -26 + bob]; J.ang = -0.55; }
  else if (wb === 'lance') {
    if (atk >= 0) { J.fH = [atk ? 11 + ln : 3 + ln, -22 + bob]; J.ang = 0.04; J.bH = [atk ? 6 + ln : -1 + ln, -21 + bob]; }
    else { J.fH = [6 + ln, -18 + bob]; J.ang = -1.47; }
  }
  const hipF = [J.hip[0] + 2, J.hip[1]], hipB = [J.hip[0] - 2, J.hip[1]];
  J.hipF = hipF; J.hipB = hipB;
  J.fA = [J.fF[0], J.fF[1] - 2.5]; J.bA = [J.bF[0], J.bF[1] - 2.5];
  J.fK = ik2(hipF, J.fA, 7.6, 7.6, J.sit ? 1 : -1); J.bK = ik2(hipB, J.bA, 7.6, 7.6, J.sit ? 1 : -1);
  J.fE = ik2(J.fS, J.fH, 6.2, 6.2, 1); J.bE = ik2(J.bS, J.bH, 6.2, 6.2, 1);
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
    cap(0, 4, 0, g ? -20 : -16, 1.2, 1.1, wood, { tex: TX.grain() });
    const t = g ? -18 : -14;
    poly([[0.5, t + 3], [5, t - 1], [8, t + 1], [9, t + 6], [7.5, t + 10], [4.5, t + 10], [0.5, t + 7]], M, { line: 1 }, 1.8);
    if (g) poly([[-0.5, t + 3], [-5, t - 1], [-8, t + 1], [-9, t + 6], [-7.5, t + 10], [-4.5, t + 10], [-0.5, t + 7]], M, { line: 1 }, 1.8);
    for (let i = 0; i < 5; i++) { const [[px, py]] = R([[8.2 - i * 0.1, t + 2 + i * 1.6]]); D.shadeAt(px, py, 2); }
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
    const h = wb === 'long' ? 15 : 12, gb = wb === 'long' && L.c2 === '#e8c060', bw = mat(gb ? '#e8c060' : '#7a5232', gb ? 'gold' : 'wood');
    D.add(shCap(x, y - 1, x + 3, y - h * 0.55, 1.2, 1), bw); D.add(shCap(x + 3, y - h * 0.55, x, y - h, 1, 0.8), bw);
    D.add(shCap(x, y + 1, x + 3, y + h * 0.55, 1.2, 1), bw); D.add(shCap(x + 3, y + h * 0.55, x, y + h, 1, 0.8), bw);
    for (let i = -h; i <= h; i++) D.px(x - 1 + (H.pull && Math.abs(i) < h * 0.5 ? -(h * 0.5 - Math.abs(i)) * 0.5 : 0), y + i, '#e8e2d0');
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
  const wb = L.wv && !(['bow', 'lute'].includes(wb0) && !['long'].includes(L.wv)) ? (L.wv === 'long' ? (wb0 === 'bow' ? 'long' : wb0) : L.wv === 'great' ? (['sword', 'axe'].includes(wb0) ? (wb0 === 'axe' ? 'gaxe' : 'great') : wb0) : L.wv === 'hammer' ? (wb0 === 'mace' ? 'hammer' : wb0) : ['skull', 'crozier'].includes(L.wv) ? (wb0 === 'staff' ? L.wv : wb0) : wb0) : wb0;
  if (pose === 'sleep') { sleepHi(D, a, L, lk); return; }
  const J = advJoints(pose, fr, L, wb);
  const skinC = L.skin || lk.skin || SKINS[0], sk = mat(skinC, L.bones ? 'bone' : 'skin'), hr = mat(lk.hair || HAIRS[0], 'hair');
  const c1 = mat(L.c1), c2 = mat(L.c2, /e[0-9a-f]c0|f0c24a|e8c060|d8a84a|e0b040|c9a04a/.test(L.c2) ? 'gold' : 'cloth'), c3 = mat(L.c3 || L.c1);
  const metalC = L.metal || (arm ? ARM_TINT[arm.t] : '#8a8e98'), mt = mat(metalC, 'metal'), gold = mat('#d8a84a', 'gold');
  const wTint = wpn ? WPN_TINT[wpn.t] : '#a8aeb8', boot = mat(BOOT, 'leather'), belt = mat(BELT, 'leather');
  const body = L.body, robe = body === 'robe', plate = body === 'plate' || body === 'scale', style = (a.id || 0) % 3;
  const [hx, hy] = J.head, sw = J.walk ? J.sw : 0;
  const pants = plate ? mt : body === 'bare' ? c1 : body === 'chain' ? mat('#4a4a52') : mat(body === 'coat' ? '#2e2a34' : '#4a3a2e');
  const sleeve = plate || body === 'chain' ? mt : body === 'bare' ? sk : body === 'leather' ? c1 : c1;

  // ── 등 뒤: 망토·화살통·짐 ──
  if (L.cape) {
    const cx = J.neck[0], cy = J.neck[1], fl = J.walk ? 1 + Math.abs(sw) * 0.5 : J.atk === 1 ? 3 : 0;
    D.add(shPoly([[cx - 1, cy], [cx + 2, cy + 1], [cx - 2, cy + 18], [cx - 9 - fl, cy + 25 + (J.sit ? -8 : 0)], [cx - 6, cy + 3]], 2.4), mat(L.cape), { tex: TX.fold(3, 1) });
  }
  if (ex.includes('quiver')) { D.add(shPoly([[-8, -31 + J.bob], [-4, -33 + J.bob], [0, -19 + J.bob], [-4, -17 + J.bob]], 1.6), mat('#6a4a2a', 'leather'), { tex: TX.stripe(4) }); for (let i = 0; i < 3; i++) D.add(shCap(-7 + i * 1.6, -33 + J.bob, -6.4 + i * 1.6, -37 + J.bob, 0.9, 0.9), mat(L.feather || '#e8e2d0', 'cloth'), { cast: false }); }
  if (ex.includes('pack')) { D.add(shBox(-13, -32 + J.bob, 10, 14, 2.5, 2.5), mat('#7a5634', 'leather'), { tex: TX.stripe(5) }); D.add(shCap(-13, -34 + J.bob, -4, -34 + J.bob, 2.2), mat(L.c3 || '#a8432f')); D.add(shBox(-12, -24 + J.bob, 3, 5, 1, 1), mat('#5a6a7a', 'metal')); }
  if (ex.includes('sash')) D.add(shPoly([[-4, -18 + J.bob], [-2, -16 + J.bob], [-12 - Math.abs(sw), -10], [-13 - Math.abs(sw), -12]], 1), c3);
  if (ex.includes('scarf')) D.add(shPoly([[-1, -30 + J.bob], [1, -28 + J.bob], [-9 - Math.abs(sw), -24 + J.bob], [-10 - Math.abs(sw), -27 + J.bob]], 1), c3);

  // ── 뒷팔 (방패·두 번째 무기·책) ──
  const bSleeve = sleeve;
  D.add(shCap(J.bS[0], J.bS[1], J.bE[0], J.bE[1], 2.4, 2.1), bSleeve, { lift: -0.25, tex: body === 'chain' ? TX.chain() : null });
  D.add(shCap(J.bE[0], J.bE[1], J.bH[0], J.bH[1], 2.1, 1.9), plate ? mt : body === 'bare' ? sk : bSleeve, { lift: -0.25 });
  if (ex.includes('twin')) paintWeaponHi(D, wb === 'great' ? 'sword' : wb, J.bH, J.bang != null ? J.bang : -1.0, wTint, L, 'back');
  D.add(shEll(J.bH[0], J.bH[1], 2, 2), plate ? mt : sk, { lift: -0.2 });
  if (ex.includes('book')) D.add(shBox(J.bH[0] - 2, J.bH[1] - 4, 6, 7, 1, 1.4), mat('#3a2a4a', 'leather'), { line: 1 });
  if (ex.includes('bag')) D.add(shBox(J.bH[0] - 3, J.bH[1], 7, 6, 1.5, 2), mat('#5a3a22', 'leather'));

  // ── 다리 ──
  const leg = (H, K, A, F, lift) => {
    D.add(shCap(H[0], H[1], K[0], K[1], 2.7, 2.4), pants, { lift, tex: body === 'chain' ? null : null });
    D.add(shCap(K[0], K[1], A[0], A[1], 2.4, 2.1), plate ? mt : pants, { lift });
    D.add(shBox(F[0] - 2.6, F[1] - 4.2, 6.4, 4.2, 1.6, 1.6), plate ? mt : boot, { lift });
    if (plate) D.add(shEll(K[0] + 0.5, K[1], 2.2, 2), mt, { lift });
  };
  if (!robe) leg(J.hipB, J.bK, J.bA, J.bF, -0.3);
  // 겉옷 자락 (외투·튜닉)
  if (body === 'coat') D.add(shPoly([[J.hip[0] - 6, J.hip[1] - 2], [J.hip[0] + 5, J.hip[1] - 2], [J.hip[0] + 2, J.hip[1] + 9], [J.hip[0] - 9 - Math.abs(sw) * 0.4, J.hip[1] + 10]], 2), c1, { tex: TX.fold(3, 0) });

  // ── 몸통 ──
  const tx = (J.neck[0] + J.hip[0]) / 2, ty = (J.neck[1] + J.hip[1]) / 2 + 0.5;
  if (robe) {
    const hw = J.sit ? 8 : 8.5, bot = J.sit ? -1 : -1;
    D.add(shPoly([[tx - 5.5, J.hip[1] - 4], [tx + 5.5, J.hip[1] - 4], [tx + hw + (J.walk ? sw * 0.3 : 0), bot], [tx - hw - 1 + (J.walk ? sw * 0.3 : 0), bot]], 2.4), c1, { tex: TX.fold(4, 2) });
    D.add(shPoly([[tx - hw - 1 + (J.walk ? sw * 0.3 : 0), bot - 2.5], [tx + hw + (J.walk ? sw * 0.3 : 0), bot - 2.5], [tx + hw + 0.3, bot], [tx - hw - 1.3, bot]], 1), c2, { cast: false });
    D.add(shBox(J.fF[0] - 1, -2.5, 5, 2.5, 1, 1), boot);
  }
  const torsoM = plate ? mt : body === 'chain' ? mt : body === 'bare' ? sk : body === 'leather' ? mat(L.c2, 'leather') : c1;
  D.add(shEll(tx, ty, plate ? 6.8 : 6.3, 7.6), torsoM, { tex: body === 'chain' ? TX.chain() : body === 'scale' ? TX.scale() : body === 'bare' ? null : TX.fold(5, 1), lift: plate ? 0.05 : 0 });
  if (body === 'leather') D.add(shEll(tx + 1, ty - 1, 4.2, 6), c1, { cast: false });
  if (body === 'coat') { D.add(shPoly([[tx - 1, J.neck[1] + 1], [tx + 3, J.neck[1] + 1], [tx + 1, J.hip[1] - 2]], 1), mat('#e8e2d0'), { cast: false }); D.add(shCap(tx + 3.5, J.neck[1] + 1, tx + 2, J.hip[1] - 3, 1, 1), c2, { cast: false }); }
  if (body === 'bare') { D.add(shCap(tx - 4, J.neck[1] + 2, tx + 4, J.hip[1] - 4, 1.2, 1.2), mat(L.c2, 'leather'), { cast: false }); D.shadeAt(tx + 1, ty - 2, -1); D.shadeAt(tx + 2, ty - 2, -1); D.shadeAt(tx + 1, ty + 2, -1); }
  if (plate) { D.add(shPoly([[tx - 6, J.hip[1] - 2], [tx + 6, J.hip[1] - 2], [tx + 7, J.hip[1] + 4], [tx - 7, J.hip[1] + 4]], 1.4), mt, { tex: TX.plates(3) }); if (L.stars) D.add(shEll(tx, ty, 5, 6), mat(L.c1, 'cloth'), { tex: TX.stars(), cast: false }); }
  if (ex.includes('tabard')) { D.add(shPoly([[tx - 2.5, J.neck[1] + 2], [tx + 4, J.neck[1] + 2], [tx + 3.5, J.hip[1] + 5], [tx - 2, J.hip[1] + 5]], 1.2), c1, { tex: TX.fold(3, 1) }); D.add(shPoly([[tx + 0.2, ty - 3], [tx + 1.8, ty - 3], [tx + 1.8, ty + 3], [tx + 0.2, ty + 3]], 0.6), c2, { flat: 3, cast: false }); D.add(shPoly([[tx - 1.4, ty - 1.5], [tx + 3.4, ty - 1.5], [tx + 3.4, ty], [tx - 1.4, ty]], 0.6), c2, { flat: 3, cast: false }); }
  if (ex.includes('holy')) { D.px(tx + 1, ty - 4, '#e0c060', 1, 6); D.px(tx - 1, ty - 2, '#e0c060', 5, 1); }
  if (ex.includes('stole')) { D.add(shCap(tx + 2.5, J.neck[1] + 1, tx + 3, J.hip[1] + 8, 1.1, 1.1), c2, { cast: false }); D.add(shCap(tx - 1, J.neck[1] + 1, tx - 0.5, J.hip[1] + 8, 1.1, 1.1), c2, { cast: false }); }
  // 앞다리
  if (!robe) leg(J.hipF, J.fK, J.fA, J.fF, 0);
  // 허리띠
  if (!robe || J.sit) { D.add(shBox(tx - 6.4, J.hip[1] - 3.2, 12.8, 3, 1, 1), ex.includes('sash') ? c3 : belt, { cast: false }); D.px(tx + 2, J.hip[1] - 2.6, '#f0c860', 2, 2); }
  else { D.add(shBox(tx - 5.6, J.hip[1] - 4, 11.2, 2.4, 1, 1), c2, { cast: false }); }

  // ── 머리 ──
  const head = L.head;
  const hidesHair = ['great', 'winged', 'hood', 'hoodup', 'cowl', 'coif', 'coif2', 'beak', 'dragon', 'glad', 'horn', 'mitre', 'mitre2'].includes(head) || L.bones;
  if (!hidesHair) {
    D.add(shEll(hx - 1.6, hy - 1.2, 7.2, 7), hr, { cast: false, tex: TX.stripe(3) });
    if (style === 1) D.add(shCap(hx - 4, hy, hx - 5.5, hy + 10, 3.4, 2.2), hr, { tex: TX.fold(2, 0) });
  }
  if (['hood', 'hoodup', 'cowl', 'coif', 'coif2'].includes(head)) {
    const hc = head === 'coif' ? mat('#f4f0e6') : head === 'coif2' ? c1 : head === 'cowl' ? c1 : head === 'hoodup' && L.cape ? mat(L.cape) : c1;
    D.add(shEll(hx - 1.5, hy + 0.5, 8.4, 8.6), hc, { tex: TX.fold(4, 0) });
    D.add(shPoly([[hx - 8, hy + 4], [hx + 1, hy + 5], [hx + 4, hy + 9], [hx - 9, hy + 10]], 2), hc);
  }
  D.add(shEll(hx, hy, 6.4, 6.8), sk, { cast: false });
  // 얼굴
  const ey = hy + 0.5, eyeC = L.eyes || '#20141a';
  const face = () => {
    if (L.bones) { D.px(hx + 1, ey - 1, '#1a1020', 2, 3); D.px(hx + 4, ey - 1, '#1a1020', 2, 3); D.px(hx + 1, ey, L.eyes || '#c89aff'); D.px(hx + 4, ey, L.eyes || '#c89aff'); D.px(hx + 2, hy + 4, '#3a3040', 4, 1); D.px(hx + 3, hy + 4, '#e8e4dc'); return; }
    D.px(hx + 1.5, ey, eyeC, 1, 2); D.px(hx + 4.5, ey, eyeC, 1, 2);
    if (L.eyes) { D.px(hx + 1.5, ey, L.eyes, 1, 1); D.px(hx + 4.5, ey, L.eyes, 1, 1); }
    else { D.px(hx + 0.5, ey, '#f4ece0', 1, 1); D.px(hx + 3.5, ey, '#f4ece0', 1, 1); }
    D.px(hx + 4, hy + 4, rgbHex(MATS[sk].rp[1]), 1, 1);
    if (ex.includes('paint')) { D.px(hx + 0.5, ey + 2, '#c0392b', 3, 1); D.px(hx + 4, ey + 2, '#c0392b', 2, 1); }
  };
  if (!['great', 'winged', 'beak', 'dragon'].includes(head)) face();
  // 앞머리
  if (!hidesHair && !['tophat', 'wizard', 'widebrim', 'feather', 'beret'].includes(head)) {
    D.add(shEll(hx - 0.6, hy - 3.6, 7, 4.4), hr, { clip: (px, py) => py < hy - 1.4 + (px - hx) * 0.22, tex: TX.stripe(2) });
    if (style === 2) for (const [sx, sy] of [[-4, -7], [-1, -8], [2, -7.5]]) D.add(shPoly([[hx + sx - 1.6, hy + sy + 3], [hx + sx + 1.6, hy + sy + 3], [hx + sx - 0.5, hy + sy - 1]], 1), hr);
    D.add(shCap(hx - 3.6, hy - 2, hx - 4.2, hy + 3, 1.6, 1.2), hr);
  }
  paintHeadgear(D, head, hx, hy, L, { mt, c1, c2, c3, gold, hr, sk });

  // ── 방패 (앞으로 든다) ──
  if (L.shield && !J.sit) {
    const [sx, sy] = [J.bH[0] + 4, J.bH[1] - 3];
    if (L.shield === 'round') { D.add(shEll(sx, sy, 6.5, 7), mat(metalC, 'gold')); D.add(shEll(sx, sy, 4.6, 5), mat('#7a3a24', 'wood'), { cast: false }); D.add(shEll(sx + 0.3, sy, 1.8, 1.8), mat(metalC, 'gold')); }
    else if (L.shield === 'kite') { D.add(shPoly([[sx - 5.5, sy - 8], [sx + 5.5, sy - 8], [sx + 5, sy + 1], [sx, sy + 11], [sx - 5, sy + 1]], 2.4), mt, { line: 1 }); D.add(shPoly([[sx - 3.8, sy - 6.4], [sx + 3.8, sy - 6.4], [sx + 3.4, sy + 0.6], [sx, sy + 8.4], [sx - 3.4, sy + 0.6]], 1.6), c1, { cast: false }); D.px(sx - 0.5, sy - 5, rgbHex(MATS[c2].rp[3]), 2, 9); D.px(sx - 3, sy - 2, rgbHex(MATS[c2].rp[3]), 7, 2); }
    else { D.add(shBox(sx - 6, sy - 9, 12, 20, 3, 2.6), mat('#e8c060', 'gold'), { line: 1 }); D.add(shBox(sx - 4.4, sy - 7.4, 8.8, 16.8, 2, 2), mat(L.c1 === '#e8e4d8' ? '#3a5aa8' : L.c1), { cast: false }); D.px(sx - 0.5, sy - 6, '#f4e8a0', 2, 13); D.px(sx - 3.5, sy - 2, '#f4e8a0', 8, 2); }
  }
  // ── 어깨 ──
  if (L.sh === 'pauldron') D.add(shEll(J.fS[0] - 0.5, J.fS[1] + 0.5, 4.2, 3.4), plate || body === 'chain' ? mt : L.metal ? mt : mat('#8a98b8', 'metal'), { tex: TX.plates(2) });
  if (L.sh === 'fur') D.add(shEll(J.fS[0] - 1, J.fS[1] + 0.5, 5, 3.6), mat('#8a6a4a', 'fur'), { tex: TX.noise(4, 0.3) });
  if (L.sh === 'spike') { D.add(shEll(J.fS[0] - 0.5, J.fS[1] + 0.5, 4.4, 3.6), mt); D.add(shPoly([[J.fS[0] - 2, J.fS[1] - 2], [J.fS[0] + 1, J.fS[1] - 2], [J.fS[0] - 1, J.fS[1] - 7]], 1), mat('#c8c0c8', 'metal')); }

  // ── 앞팔과 무기 ──
  const fSleeve = sleeve;
  const bowLike = wb === 'bow' || wb === 'long', pre = bowLike || wb === 'lute';
  if (pre) { const W2 = { pull: J.atk === 0 }; paintWeaponHi(D, wb, Object.assign([J.fH[0], J.fH[1]], W2), J.ang, wTint, L); }
  D.add(shCap(J.fS[0], J.fS[1], J.fE[0], J.fE[1], 2.5, 2.2), fSleeve, { tex: body === 'chain' ? TX.chain() : null });
  D.add(shCap(J.fE[0], J.fE[1], J.fH[0], J.fH[1], 2.2, 2), plate ? mt : body === 'bare' || body === 'chain' ? (ex.includes('manica') ? mat(metalC, 'gold') : body === 'chain' ? mt : sk) : fSleeve, { tex: ex.includes('manica') ? TX.plates(2) : null });
  if (body === 'bare' && !ex.includes('manica')) D.add(shCap(J.fE[0] + (J.fH[0] - J.fE[0]) * 0.4, J.fE[1] + (J.fH[1] - J.fE[1]) * 0.4, J.fH[0], J.fH[1], 2.3, 2.1), mat('#6a4a2a', 'leather'));
  if (!pre && !J.sit) paintWeaponHi(D, wb, J.fH, J.ang, wTint, L);
  D.add(shEll(J.fH[0], J.fH[1], 2.1, 2.1), plate ? mt : sk);
  if (J.sit && !pre) paintWeaponHi(D, wb, [J.fH[0] + 2, J.fH[1] + 2], -0.3, wTint, L);
  // 그림자 연기 (그림자 군주)
  if (ex.includes('wisp')) for (const [wx, wy] of [[-9, -20], [-11, -12], [-7, -8]]) D.px(wx + Math.round(Math.sin(fr + wx) * 1), wy + J.bob, '#7a4ab8', 2, 2);
  if (L.stars) for (const [sx, sy] of [[-8, -24], [-6, -14], [-10, -18]]) D.px(sx, sy + J.bob, '#fff4b0', 1, 1);
}

// 머리 장식
function paintHeadgear(D, head, hx, hy, L, M) {
  const { mt, c1, c2, c3, gold, hr } = M;
  const ink = (x, y, w, h, c) => D.px(x, y, c || INK, w, h);
  if (head === 'helm') {
    D.add(shEll(hx - 0.5, hy - 2.6, 7.4, 6.4), mt, { clip: (px, py) => py < hy - 0.6, tex: TX.plates(3) });
    D.add(shBox(hx - 7.6, hy - 1.8, 15, 2.2, 1, 1), mt, { lift: 0.1 });
    D.add(shBox(hx + 4.2, hy - 1, 1.8, 6, 0.6, 0.8), mt);
  } else if (head === 'great' || head === 'winged') {
    D.add(shBox(hx - 7, hy - 8, 14.5, 16, 4.2, 3.2), mt, { tex: TX.plates(4) });
    ink(hx - 0.5, hy, 8, 1); ink(hx + 2.5, hy + 3, 1, 1); ink(hx + 4.5, hy + 3, 1, 1); ink(hx + 2.5, hy + 5, 1, 1); ink(hx + 4.5, hy + 5, 1, 1);
    D.px(hx + 1.5, hy - 6, rgbHex(MATS[mt].rp[4]), 1, 5);
    if (head === 'winged') for (const s of [-1, 1]) { const bx = hx + (s < 0 ? -6 : 5.5); D.add(shPoly([[bx, hy - 4], [bx + s * 2, hy - 12], [bx + s * 5, hy - 13], [bx + s * 3, hy - 6]], 1.2), mat('#f4f0e6'), { tex: TX.stripe(2) }); }
    if (L.plume) D.add(shPoly([[hx - 2, hy - 8], [hx + 1, hy - 9], [hx - 4, hy - 15], [hx - 9, hy - 13]], 1.4), mat(L.plume), { tex: TX.fold(2, 0) });
  } else if (head === 'glad') {
    D.add(shEll(hx - 0.5, hy - 2.4, 7.6, 6.8), mat(L.metal || '#c08a3a', 'gold'), { clip: (px, py) => py < hy + 1.2 });
    D.add(shBox(hx + 2.5, hy - 1, 4, 7, 1.4, 1.4), mat(L.metal || '#c08a3a', 'gold'));
    D.add(shPoly([[hx - 7, hy - 6], [hx - 3, hy - 11], [hx + 3, hy - 11.5], [hx + 6, hy - 7], [hx + 3, hy - 8.5], [hx - 3, hy - 8]], 1.4), mat('#c0392b'), { tex: TX.fold(2, 0) });
  } else if (head === 'horn') {
    D.add(shEll(hx - 0.5, hy - 2.6, 7.4, 6.2), mt, { clip: (px, py) => py < hy - 0.2 });
    D.add(shBox(hx - 7.4, hy - 1.6, 14.6, 2, 1, 1), mt);
    const bone = mat(L.eyes ? '#3a2a2a' : '#e8e2d0', 'bone');
    D.add(shCap(hx - 5, hy - 5, hx - 9, hy - 10, 2, 1.4), bone); D.add(shCap(hx - 9, hy - 10, hx - 8, hy - 14, 1.4, 0.6), bone);
    D.add(shCap(hx + 4, hy - 6, hx + 7, hy - 11, 2, 1.4), bone); D.add(shCap(hx + 7, hy - 11, hx + 5.5, hy - 15, 1.4, 0.6), bone);
  } else if (head === 'dragon') {
    D.add(shBox(hx - 7, hy - 7, 14, 14, 4, 3), mt, { tex: TX.scale() });
    D.add(shPoly([[hx + 3, hy - 1], [hx + 10, hy + 1], [hx + 9, hy + 3], [hx + 3, hy + 3]], 1.2), mt);
    ink(hx + 1, hy, 6, 1); D.px(hx + 4, hy, L.c2, 1, 1);
    D.add(shCap(hx - 4, hy - 6, hx - 10, hy - 11, 1.8, 0.8), mat(L.c2, 'gem')); D.add(shCap(hx + 1, hy - 7, hx - 2, hy - 13, 1.6, 0.6), mat(L.c2, 'gem'));
  } else if (head === 'hood' || head === 'hoodup') {
    if (head === 'hoodup') { D.add(shEll(hx - 1.4, hy - 2.6, 8, 6.4), L.cape ? mat(L.cape) : c1, { clip: (px, py) => py < hy - 1.2 || px < hx - 2, tex: TX.fold(3, 1) }); D.add(shPoly([[hx - 2, hy - 8], [hx + 2, hy - 7], [hx - 5, hy - 10]], 1), L.cape ? mat(L.cape) : c1); }
    else { D.add(shEll(hx - 1.2, hy - 2.8, 7.8, 5.8), c1, { clip: (px, py) => py < hy - 1.5 + (px - hx) * 0.1, tex: TX.fold(3, 0) }); if (L.feather) D.add(shCap(hx + 2, hy - 7, hx + 6, hy - 11, 1.1, 0.6), mat(L.feather)); }
  } else if (head === 'cowl') {
    D.add(shEll(hx - 1.2, hy - 2.8, 7.8, 5.8), c1, { clip: (px, py) => py < hy - 1.6, tex: TX.fold(3, 0) });
    D.add(shBox(hx - 1, hy + 2, 8, 5, 2, 1.6), mat(L.c3 || '#3a3a46'), { cast: false });
  } else if (head === 'coif' || head === 'coif2') {
    D.add(shEll(hx - 1.2, hy - 2.8, 7.6, 5.6), head === 'coif' ? mat('#f4f0e6') : c1, { clip: (px, py) => py < hy - 1.8 });
    D.add(shBox(hx - 7.6, hy - 3.2, 15, 1.6, 0.6, 0.6), head === 'coif' ? c2 : c2, { cast: false });
  } else if (head === 'wizard') {
    D.add(shEll(hx, hy - 4.6, 11, 2.4), c1, { tex: TX.fold(4, 0) });
    D.add(shPoly([[hx - 6, hy - 5], [hx + 6, hy - 5], [hx + 1, hy - 14], [hx - 5, hy - 21], [hx - 3, hy - 13]], 2), c1, { tex: TX.fold(4, 1) });
    D.add(shBox(hx - 6, hy - 7.6, 12, 2.2, 0.8, 0.8), c2, { cast: false });
    D.px(hx - 5, hy - 21, rgbHex(MATS[c2].rp[3]), 2, 2);
  } else if (head === 'mitre' || head === 'mitre2') {
    const t = head === 'mitre2' ? 18 : 14;
    D.add(shPoly([[hx - 5.4, hy - 4], [hx + 5.4, hy - 4], [hx + 4, hy - t + 5], [hx, hy - t], [hx - 4, hy - t + 5]], 2), mat('#f4f0e6'), { tex: TX.fold(5, 2) });
    D.add(shBox(hx - 5.6, hy - 5.6, 11.2, 2, 0.6, 0.6), c2, { cast: false });
    D.px(hx - 0.5, hy - t + 3, rgbHex(MATS[c2].rp[3]), 1, t - 8); D.px(hx - 2.5, hy - t + 6, rgbHex(MATS[c2].rp[3]), 5, 1);
  } else if (head === 'crown' || head === 'bonecrown') {
    const cm = head === 'crown' ? gold : mat('#e8e4dc', 'bone');
    D.add(shBox(hx - 6, hy - 7, 12, 3.4, 0.6, 1), cm, { cast: false });
    for (const sx of [-5, -1.5, 2, 5]) D.add(shPoly([[hx + sx - 1.4, hy - 6.5], [hx + sx + 1.4, hy - 6.5], [hx + sx, hy - 11]], 0.8), cm);
    if (head === 'crown') { D.px(hx - 1.5, hy - 6, L.gem || '#c0392b', 2, 2); D.px(hx + 3, hy - 6, '#5ac8f0', 1, 1); D.px(hx - 5, hy - 6, '#7ae0a0', 1, 1); }
  } else if (head === 'circlet') {
    D.add(shBox(hx - 6.6, hy - 4.6, 13.4, 1.6, 0.6, 0.6), gold, { cast: false });
    D.px(hx + 2.5, hy - 5, L.gem || '#8ab8ff', 2, 2);
  } else if (head === 'laurel') {
    for (let i = 0; i < 6; i++) D.add(shEll(hx - 6 + i * 2.2, hy - 4.6 - Math.sin(i / 5 * Math.PI) * 1.4, 1.6, 1), mat('#5aa84a'), { cast: false });
  } else if (head === 'band' || head === 'goggles') {
    D.add(shBox(hx - 6.8, hy - 4.4, 13.6, 2.6, 0.8, 0.8), mat(L.c3 || '#c0392b'), { cast: false });
    D.add(shCap(hx - 6.5, hy - 3.2, hx - 10, hy + 1, 1, 0.8), mat(L.c3 || '#c0392b'));
    if (head === 'goggles') { D.add(shEll(hx + 1, hy - 4.4, 2, 2), mat('#8a6a3a', 'metal')); D.add(shEll(hx + 5, hy - 4.4, 2, 2), mat('#8a6a3a', 'metal')); D.px(hx + 0.5, hy - 5, '#9ad8f0', 1, 1); D.px(hx + 4.5, hy - 5, '#9ad8f0', 1, 1); }
  } else if (head === 'beret' || head === 'feather') {
    const bm = head === 'beret' ? c1 : mat('#5a6a3a');
    D.add(shEll(hx + 0.5, hy - 5, 8, 3.6, -0.15), bm, { tex: TX.fold(3, 0) });
    D.add(shCap(hx - 1, hy - 7, hx - 9, hy - 14, 1.6, 0.6), mat(L.feather || '#e05a4a'), { tex: TX.stripe(2) });
  } else if (head === 'tophat') {
    D.add(shEll(hx, hy - 4.4, 9, 1.8), c1);
    D.add(shBox(hx - 5, hy - 15, 10, 11, 1, 1.4), mat('#1e1828'));
    D.add(shBox(hx - 5, hy - 7, 10, 2, 0.4, 0.4), c1, { cast: false });
  } else if (head === 'widebrim') {
    D.add(shEll(hx, hy - 4.2, 11, 2.2), mat('#1e1418'));
    D.add(shBox(hx - 5.4, hy - 12, 10.8, 8, 1.6, 1.6), mat('#1e1418'));
    D.add(shBox(hx - 5.4, hy - 6.6, 10.8, 1.6, 0.4, 0.4), c2, { cast: false }); D.px(hx - 0.5, hy - 7, '#f0d070', 2, 2);
  } else if (head === 'beak') {
    D.add(shEll(hx, hy - 4.6, 10.5, 2.2), mat('#1e1c22'));
    D.add(shBox(hx - 5.6, hy - 12, 11.2, 8, 1.6, 1.6), mat('#1e1c22'));
    D.add(shPoly([[hx + 2, hy - 1], [hx + 12, hy + 4], [hx + 2, hy + 4.5]], 1.2), mat('#d8c8a0', 'bone'));
    D.add(shEll(hx + 2.5, hy, 1.8, 1.8), mat('#8ad8ff', 'gem')); D.add(shEll(hx + 5.6, hy, 1.6, 1.6), mat('#8ad8ff', 'gem'));
  } else if (head === 'monocle') {
    D.add(shEll(hx + 4.5, hy + 1, 1.8, 1.8), mat('#e8c060', 'gold'), { cast: false }); D.px(hx + 4.5, hy + 1, '#cfefff', 1, 1);
  }
  if (head === 'cowl' && L.eyes) { D.px(hx + 1.5, hy + 0.5, L.eyes, 1, 1); D.px(hx + 4.5, hy + 0.5, L.eyes, 1, 1); }
  if ((L.ex || []).includes('mask')) D.px(hx, hy, '#1e1418', 7, 2);
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
const ADV_HW = 72, ADV_HH = 66, ADV_AX = 34, ADV_AY = 60;
function advSprite(a, pose, fr) {
  const key = 'H|' + advKey(a) + '|' + pose + fr + '|' + (FLASH || '');
  return bakeHi(key, ADV_HW, ADV_HH, ADV_AX, ADV_AY, D => paintAdvHi(D, a, pose, fr));
}
