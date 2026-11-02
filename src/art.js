/* ───────── 도트 굽기: 그린 그림에 외곽선과 명암을 입혀 저장해 둔다 ───────── */
const SPR = new Map();
function bake(key, w, h, ax, ay, paint, plain) {
  let s = SPR.get(key);
  if (s) return s;
  const [cv, x] = mkCanvas(w, h);
  x.save(); x.translate(ax, ay); paint(x); x.restore();
  if (!plain) {
    const img = x.getImageData(0, 0, w, h), d = img.data, o = new Uint8ClampedArray(d);
    const A = (i, j) => (i < 0 || j < 0 || i >= w || j >= h ? 0 : d[(j * w + i) * 4 + 3]);
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
      const k = (j * w + i) * 4;
      if (!d[k + 3]) {
        if (A(i - 1, j) || A(i + 1, j) || A(i, j - 1) || A(i, j + 1)) { o[k] = 18; o[k + 1] = 13; o[k + 2] = 22; o[k + 3] = 255; }
        continue;
      }
      // 위쪽 가장자리는 밝게, 아래쪽 가장자리는 어둡게
      if (!A(i, j - 1)) for (let c = 0; c < 3; c++) o[k + c] = d[k + c] + (255 - d[k + c]) * 0.2;
      else if (!A(i, j + 1)) for (let c = 0; c < 3; c++) o[k + c] = d[k + c] * 0.74;
    }
    x.putImageData(new ImageData(o, w, h), 0, 0);
  }
  s = { cv, ax, ay };
  SPR.set(key, s);
  if (SPR.size > 1600) SPR.delete(SPR.keys().next().value);
  return s;
}
const blit = (ctx, s) => ctx.drawImage(s.cv, -s.ax, -s.ay);

/* ───────── 모험가 ───────── */
// 걷기 4장: fl·bl = 앞·뒷발 위치, by = 몸이 들썩이는 높이, arm = 팔 흔들기
const WALKF = [
  { fl: 2, bl: -2, by: 0, arm: -1 }, { fl: 0, bl: 0, by: -1, arm: 0, lift: 1 },
  { fl: -2, bl: 2, by: 0, arm: 1 }, { fl: 0, bl: 0, by: -1, arm: 0, lift: 2 }
];
const ROBED = ['mage', 'cleric', 'elementalist', 'necromancer', 'plaguedoc'];
const CRYSTAL = { mage: null, elementalist: '#7ae0a0', necromancer: 'skull' };
function advKey(a) {
  const w = a.eq && a.eq.weapon, ar = a.eq && a.eq.armor, l = a.look || {};
  return [a.cls, l.hair, l.skin, a.hero ? 1 : 0, (a.id || 0) % 3, w ? w.base + w.t : '-', ar ? ar.base + ar.t : '-'].join('|');
}
function paintAdv(x, a, pose, fr) {
  const C = CLASSES[a.cls] || CLASSES.warrior, cls = a.cls;
  const look = a.look || { hair: HAIRS[0], skin: SKINS[0] };
  const P = (px, py, w, h, c) => R(x, px, py, w, h, c);
  const sk = cls === 'necromancer' ? '#d8d0d8' : look.skin, skD = shade(sk, -0.22), hr = look.hair;
  const tu = C.tunic, tuD = shade(tu, -0.3), tuL = shade(tu, 0.2), tr = C.trim;
  const wpn = a.eq && a.eq.weapon, arm = a.eq && a.eq.armor;
  const metal = wpn ? TIER_COLORS[wpn.t] : '#9aa0a8', metalL = shade(metal, 0.4);
  const style = cls === 'elementalist' ? 1 : (a.id || 0) % 3;
  const robe = ROBED.includes(cls);
  if (pose === 'sleep') return paintSleep(P, a, sk, hr, tu, tr);
  const sit = pose === 'sit';
  const W = pose === 'walk' ? WALKF[fr % 4] : { fl: 1, bl: -1, by: 0, arm: 0 };
  const by = sit ? 5 : W.by;
  const pants = robe ? tuD : cls === 'berserker' ? '#4a3424' : shade(tu, -0.45), boot = '#3a2a1e';
  const atk = pose === 'atk' ? fr % 2 : -1;          // 0 = 힘을 모으는 자세, 1 = 내지르는 자세
  const B = y => y + by;                               // 몸통 기준 높이

  // ── 등 뒤: 망토·화살통·짐·방패 ──
  if (a.hero || cls === 'paladin') { const cc = cls === 'paladin' ? '#3a5aa8' : '#b8322a'; const sw = sit ? 0 : W.arm; P(-5, B(-13), 2, sit ? 9 : 10, cc); P(-6 + Math.min(0, sw), B(-6), 2, sit ? 3 : 4, shade(cc, -0.2)); }
  if (cls === 'archer') { P(-5, B(-16), 2, 8, '#7a5634'); P(-5, B(-18), 1, 2, '#e8e2d0'); P(-4, B(-19), 1, 3, '#e8e2d0'); P(-6, B(-17), 1, 1, '#c0392b'); }
  if (cls === 'porter') { P(-10, B(-18), 7, 12, '#7a5634'); P(-10, B(-18), 7, 1, '#9a7a4f'); P(-10, B(-20), 7, 2, '#a8432f'); P(-11, B(-13), 2, 4, '#5a6a7a'); P(-9, B(-11), 5, 1, '#5e4630'); }
  if (cls === 'warrior') { P(-7, B(-14), 4, 7, '#8a2a20'); P(-7, B(-14), 4, 1, '#c9c3b8'); P(-6, B(-11), 2, 2, '#c9a04a'); }
  if (cls === 'gladiator') { P(-8, B(-14), 5, 6, '#b8803a'); P(-7, B(-15), 3, 8, '#b8803a'); P(-6, B(-12), 1, 2, '#e8c070'); }
  if (cls === 'paladin') { P(-8, B(-15), 5, 8, '#e8e4d8'); P(-7, B(-7), 3, 2, '#e8e4d8'); P(-6, B(-14), 1, 7, '#e8c060'); P(-7, B(-12), 3, 1, '#e8c060'); }

  // ── 뒷팔 ──
  const sw = sit ? 0 : W.arm;
  P(-4 + Math.max(0, -sw), B(-12), 1, 4, tuD); P(-4 + Math.max(0, -sw), B(-8), 1, 1, skD);

  // ── 다리 또는 로브 ──
  if (sit) {
    if (robe) { P(-4, -4, 10, 4, tu); P(-4, -1, 10, 1, tuD); P(5, -2, 2, 2, boot); }
    else { P(-2, -3, 7, 2, pants); P(4, -4, 2, 3, pants); P(5, -2, 3, 2, boot); }
  } else if (robe) {
    const hem = tr;
    P(-3, B(-7), 6, 2, tu); P(-4, B(-5), 8, 3, tu); P(-4, -2, 8, 1, tu); P(-4, -1, 8, 1, armTrim(arm, hem));
    P(W.fl > 0 ? 2 : 0, 0, 2, 1, boot); if (W.bl < 0) P(-3, 0, 2, 1, shade(boot, -0.2));
  } else {
    const leg = (hx, off, c, bc, lifted) => {
      const hip = B(-7), foot = lifted ? -2 : -1, mid = Math.round((hip + foot) / 2);
      P(hx + Math.round(off / 2), hip, 2, mid - hip + 1, c);
      P(hx + off, mid, 2, foot - mid, c);
      P(hx + off, foot - 1, 3, 2, bc);
    };
    leg(-2, W.bl, shade(pants, -0.2), shade(boot, -0.25), W.lift === 2);
    leg(0, W.fl, pants, boot, W.lift === 1);
  }

  // ── 몸통 ──
  const tY = B(-13);
  if (cls === 'berserker' && !arm) { P(-3, tY, 6, 6, sk); P(-3, tY, 6, 2, '#7a5a3a'); P(-4, tY - 1, 3, 3, '#8a6a4a'); P(-1, tY + 3, 2, 1, '#c0392b'); }
  else if (cls === 'gladiator' && !arm) { P(-3, tY, 6, 6, sk); P(-3, tY + 1, 6, 1, '#7a5232'); P(1, tY, 1, 6, '#7a5232'); P(-3, tY + 4, 6, 2, '#a8432f'); }
  else { P(-3, tY, 6, 7, tu); P(-3, tY, 6, 1, tr); P(2, tY + 1, 1, 5, tuL); }
  if (arm) paintArmor(P, arm, tY, robe);
  if (cls === 'dragoon') { P(-3, tY + 1, 6, 1, '#4a8a9a'); P(-3, tY + 3, 6, 1, '#4a8a9a'); P(-4, tY - 1, 3, 2, '#2f5a6a'); }
  if (!robe || sit) { P(-3, B(-7), 6, 1, '#4a3020'); P(0, B(-7), 1, 1, '#e0c050'); }
  if (cls === 'cleric') { P(0, tY + 1, 1, 4, tr); P(-1, tY + 2, 3, 1, tr); }
  if (cls === 'necromancer') { P(-1, tY + 2, 3, 1, '#e8e4dc'); P(0, tY + 1, 1, 3, '#e8e4dc'); }

  // ── 머리 ──
  const hy = B(-20);
  P(-3, hy, 6, 7, sk); P(-3, hy + 6, 1, 1, skD);
  P(1, hy + 3, 1, 1, '#1a1410'); P(2, hy + 5, 1, 1, skD); P(-2, hy + 6, 4, 1, skD);
  paintHair(P, cls, style, hy, hr);
  paintHead(P, cls, hy, tu, tuD, tr, sk, hr);

  // ── 앞팔과 무기 ──
  if (sit) { P(2, B(-12), 1, 3, tu); P(3, B(-9), 2, 1, sk); return; }
  paintWeapon(P, a, cls, wpn, metal, metalL, atk, pose, B, W, tu);
}
function armTrim(arm, base) { return arm ? TIER_COLORS[arm.t] : base; }
function paintArmor(P, arm, tY, robe) {
  const c = TIER_COLORS[arm.t], cL = shade(c, 0.35), cD = shade(c, -0.35);
  if (arm.base === 'plate') { P(-3, tY, 6, 6, c); P(-3, tY, 6, 1, cL); P(-1, tY + 2, 3, 1, cD); P(-4, tY - 1, 3, 2, cL); P(1, tY - 1, 3, 2, cL); P(-3, tY + 5, 6, 1, cD); }
  else if (arm.base === 'leather') { P(-3, tY + 1, 6, 5, '#7a5232'); P(-3, tY + 1, 6, 1, c); P(0, tY + 2, 1, 3, '#5a3a22'); P(-2, tY + 3, 1, 1, '#a8743e'); }
  else if (arm.base === 'robe' && !robe) { P(-3, tY, 6, 6, '#5a4a6a'); P(-3, tY, 6, 1, c); }
  else { P(-3, tY, 6, 1, c); P(-3, tY + 6, 6, 1, c); }
}
function paintHair(P, cls, style, hy, hr) {
  const hood = ['archer', 'cleric', 'rogue', 'necromancer', 'paladin', 'plaguedoc'].includes(cls);
  if (hood) return;
  P(-3, hy - 1, 6, 2, hr); P(-3, hy + 1, 2, 3, hr); P(2, hy + 1, 1, 1, hr);
  if (style === 1) { P(-4, hy + 1, 2, 7, hr); P(-4, hy + 8, 1, 1, shade(hr, -0.3)); }
  if (style === 2) { P(-3, hy - 2, 1, 1, hr); P(-1, hy - 3, 1, 2, hr); P(1, hy - 2, 1, 1, hr); }
}
function paintHead(P, cls, hy, tu, tuD, tr, sk, hr) {
  if (cls === 'warrior') { const m = '#9aa4b0'; P(-4, hy - 1, 7, 3, m); P(-4, hy - 1, 7, 1, '#c8d0d8'); P(-4, hy + 2, 1, 4, m); P(2, hy + 2, 1, 2, m); P(-1, hy - 3, 2, 2, '#c0392b'); P(-3, hy - 2, 2, 1, '#c0392b'); }
  if (cls === 'archer') { P(-4, hy - 1, 7, 3, tu); P(-4, hy + 2, 2, 6, tu); P(-5, hy, 1, 3, tu); P(-1, hy - 1, 3, 1, shade(tu, 0.2)); P(2, hy - 2, 1, 2, '#e05a4a'); }
  if (cls === 'mage') { P(-5, hy, 9, 1, tuD); P(-3, hy - 1, 6, 1, tr); P(-2, hy - 2, 5, 1, tu); P(-2, hy - 3, 4, 1, tu); P(-3, hy - 4, 3, 1, tu); P(-4, hy - 5, 2, 1, tu); P(-5, hy - 6, 2, 1, tu); P(-6, hy - 6, 1, 1, tr); }
  if (cls === 'cleric') { P(-4, hy - 1, 7, 3, tu); P(-4, hy + 2, 2, 6, tu); P(-1, hy - 3, 3, 2, tu); P(0, hy - 3, 1, 2, tr); P(-4, hy + 1, 7, 1, tr); }
  if (cls === 'rogue') { const c = '#2a2a34'; P(-4, hy - 1, 7, 3, c); P(-4, hy + 2, 2, 6, c); P(-5, hy + 1, 1, 3, c); P(0, hy + 4, 3, 2, '#3a3a46'); }
  if (cls === 'porter') P(-3, hy + 1, 6, 1, '#c9a04a');
  if (cls === 'gladiator') { const b = '#c08a3a'; P(-4, hy - 1, 7, 3, b); P(-4, hy - 1, 7, 1, '#e8b860'); P(2, hy + 2, 1, 3, b); P(-4, hy + 2, 1, 3, b); P(-4, hy - 3, 7, 2, '#b8322a'); P(-5, hy - 2, 1, 2, '#b8322a'); }
  if (cls === 'elementalist') { P(-3, hy + 1, 6, 1, '#4ab07a'); P(-1, hy, 2, 1, '#9ae0b0'); P(2, hy + 1, 1, 1, '#9ae0b0'); }
  if (cls === 'berserker') { const m = '#7a7a82', h = '#e8e2d0'; P(-4, hy - 1, 7, 3, m); P(-4, hy - 1, 7, 1, '#9a9aa4'); P(-5, hy - 3, 1, 3, h); P(-6, hy - 5, 1, 3, h); P(3, hy - 3, 1, 3, h); P(4, hy - 5, 1, 3, h); P(-1, hy + 5, 4, 2, hr); P(1, hy + 4, 2, 1, '#c0392b'); }
  if (cls === 'dragoon') { const m = '#2f5a6a'; P(-4, hy - 1, 7, 4, m); P(-4, hy - 1, 7, 1, '#4a8a9a'); P(-6, hy - 2, 3, 1, m); P(-7, hy - 3, 2, 1, '#7ad8c8'); P(2, hy + 2, 2, 2, m); P(3, hy + 4, 1, 1, m); P(-4, hy + 3, 1, 3, m); }
  if (cls === 'paladin') { const m = '#e8e4d8'; P(-4, hy - 1, 7, 8, m); P(-4, hy - 1, 7, 1, '#e8c060'); P(0, hy + 3, 3, 1, '#2a2620'); P(1, hy, 1, 6, '#e8c060'); P(-5, hy + 5, 1, 2, m); }
  if (cls === 'plaguedoc') { const c = '#1e1c22'; P(-3, hy, 6, 5, '#2a2620'); P(0, hy + 2, 2, 1, '#8ad8ff'); P(3, hy + 3, 2, 1, '#c8b890'); P(4, hy + 4, 3, 1, '#c8b890'); P(6, hy + 5, 1, 1, '#a89870'); P(-4, hy - 4, 7, 4, c); P(-4, hy - 4, 7, 1, '#3a3640'); P(-6, hy - 1, 11, 1, c); P(-4, hy + 1, 1, 6, c); }
  if (cls === 'necromancer') { const c = '#1e1828'; P(-4, hy - 1, 7, 3, c); P(-4, hy + 2, 2, 6, c); P(-5, hy + 1, 1, 4, c); P(-2, hy + 2, 5, 2, '#3a3048'); P(1, hy + 3, 1, 1, '#c89aff'); P(-4, hy - 1, 7, 1, '#a87ad8'); }
}
// 무기: atk 0 = 모으기, 1 = 휘두르기 (-1 = 들고 있기)
function paintWeapon(P, a, cls, wpn, metal, metalL, atk, pose, B, W, tu) {
  const base = wpn ? wpn.base : WEAPON_OF[cls], wood = '#6b4a2e', woodL = '#8a6a44', hand = (a.look && a.look.skin) || '#f1c9a5';
  const arm = (hx, hy) => { P(2, B(-12), 1, Math.max(1, hy - B(-12)), tu); P(hx, hy, 1, 1, hand); };
  const sway = atk < 0 ? (W.arm || 0) : 0;
  if (base === 'sword' || base === 'axe' || base === 'club' || base === 'mace') {
    if (atk === 0) { arm(1, B(-16)); P(0, B(-24), 2, 8, base === 'club' ? wood : metal); P(-1, B(-16), 4, 1, '#c9a04a'); if (base === 'axe') { P(-3, B(-24), 3, 4, metal); P(-3, B(-24), 1, 4, metalL); } if (base === 'mace') { P(-1, B(-25), 4, 3, metal); } return; }
    if (atk === 1) { arm(5, B(-11)); P(6, B(-12), 9, 2, base === 'club' ? wood : metal); P(6, B(-12), 9, 1, base === 'club' ? woodL : metalL); P(5, B(-13), 1, 4, '#c9a04a'); if (base === 'axe') { P(12, B(-15), 4, 6, metal); P(15, B(-15), 1, 6, metalL); } if (base === 'mace') { P(13, B(-14), 3, 5, metal); } return; }
    arm(3, B(-9 + sway));
    if (base === 'sword') { P(3, B(-11 + sway), 1, 2, wood); P(2, B(-12 + sway), 3, 1, '#c9a04a'); P(3, B(-19 + sway), 2, 7, metal); P(4, B(-19 + sway), 1, 6, metalL); P(3, B(-20 + sway), 1, 1, metalL); }
    if (base === 'axe') { P(4, B(-18 + sway), 1, 10, wood); P(5, B(-19 + sway), 3, 5, metal); P(7, B(-20 + sway), 1, 7, metalL); }
    if (base === 'club') { P(4, B(-17 + sway), 2, 9, wood); P(3, B(-18 + sway), 3, 3, woodL); }
    if (base === 'mace') { P(4, B(-15 + sway), 1, 7, wood); P(3, B(-18 + sway), 3, 3, metal); P(4, B(-19 + sway), 1, 1, metalL); P(2, B(-17 + sway), 1, 1, metalL); P(6, B(-17 + sway), 1, 1, metalL); }
    return;
  }
  if (base === 'dagger') {
    if (atk === 1) { arm(6, B(-10)); P(7, B(-11), 5, 1, metal); P(7, B(-11), 3, 1, metalL); return; }
    arm(4, B(-9 + sway)); P(5, B(-10 + sway), 3, 1, metal); P(-5, B(-9), 2, 1, metal);
    return;
  }
  if (base === 'lance') {
    if (atk >= 0) { arm(atk ? 6 : 3, B(-11)); const x0 = atk ? 0 : -4; P(x0, B(-12), 18, 1, wood); P(x0 + 18, B(-13), 3, 3, metal); P(x0 + 20, B(-12), 2, 1, metalL); P(x0 + 4, B(-13), 2, 1, '#7ad8c8'); return; }
    arm(4, B(-10 + sway)); P(4, B(-25 + sway), 1, 24, wood); P(3, B(-28 + sway), 3, 3, metal); P(4, B(-29 + sway), 1, 1, metalL); P(5, B(-22 + sway), 2, 2, '#7ad8c8');
    return;
  }
  if (base === 'bow') {
    const bx = 5;
    arm(4, B(-12));
    P(bx, B(-18), 1, 2, wood); P(bx + 1, B(-16), 1, 8, wood); P(bx, B(-8), 1, 2, wood); P(bx + 1, B(-16), 1, 1, woodL);
    if (atk === 0) { P(bx - 4, B(-17), 1, 4, '#e8e2d0'); P(bx - 3, B(-13), 1, 4, '#e8e2d0'); P(bx - 4, B(-12), 10, 1, '#d8d0c0'); P(bx + 5, B(-13), 2, 3, metal); P(bx - 5, B(-13), 1, 3, '#c0392b'); }
    else P(bx, B(-16), 1, 8, '#e8e2d0');
    return;
  }
  if (base === 'staff') {
    const cr = CRYSTAL[cls] === undefined ? metal : CRYSTAL[cls] || metal;
    if (atk >= 0) {
      // 지팡이를 앞으로 들어 올린 자세
      arm(5, B(-14));
      for (let i = 0; i < 14; i++) P(4 + Math.floor(i / 4), B(-2 - i), 1, 1, wood);
      if (cr === 'skull') { P(7, B(-20), 4, 3, '#e8e4dc'); P(8, B(-19), 1, 1, '#1a1410'); P(10, B(-19), 1, 1, '#1a1410'); }
      else { P(7, B(-20), 3, 3, cr); P(8, B(-21), 1, 1, '#ffffff'); }
      return;
    }
    arm(4, B(-10 + sway));
    P(4, B(-21), 1, 21, wood); P(4, B(-21), 1, 3, woodL);
    if (cr === 'skull') { P(3, B(-25), 4, 4, '#e8e4dc'); P(4, B(-24), 1, 1, '#1a1410'); P(6, B(-24), 1, 1, '#1a1410'); P(4, B(-22), 2, 1, '#9a9488'); }
    else { P(3, B(-24), 3, 3, cr); P(4, B(-25), 1, 1, '#ffffff'); P(4, B(-23), 1, 1, shade(cr, 0.5)); }
    return;
  }
  arm(3, B(-9 + sway));
}
function paintSleep(P, a, sk, hr, tu, tr) {
  // 침낭 속에서 잔다 (머리가 오른쪽)
  const roll = shade(tu, -0.15);
  P(-9, -4, 15, 4, roll); P(-9, -4, 15, 1, shade(roll, 0.25)); P(-9, -1, 15, 1, shade(roll, -0.3)); P(-2, -4, 1, 4, tr);
  P(-10, -3, 1, 2, shade(roll, -0.2));
  P(6, -6, 5, 5, sk); P(6, -7, 5, 2, hr); P(10, -6, 1, 3, hr); P(8, -4, 2, 1, '#3a2a20');
  P(5, -3, 2, 3, '#e8dcb8');
}
function drawAdv(ctx, a, t, o = {}) {
  let pose = 'idle', fr = 0;
  if (o.sleep) pose = 'sleep';
  else if (o.sit) pose = 'sit';
  else if (o.atk) { pose = 'atk'; fr = o.atkF != null ? o.atkF : 1; }
  else if (o.walk) { pose = 'walk'; fr = Math.floor(t * 8 + (o.ph || 0) * 2) % 4; }
  const key = 'A|' + advKey(a) + '|' + pose + fr + '|' + (FLASH || '');
  const s = bake(key, 40, 36, 18, 31, x => paintAdv(x, a, pose, fr));
  blit(ctx, s);
}

/* ───────── 몬스터 ───────── */
// sc: 필드 보스처럼 몸집을 따로 키울 때
const monSc = (m, sc) => sc || Math.max(1, Math.round(m.scale || 1));
function monH(id, sc) {
  const m = MONS[id], s = monSc(m, sc);
  const h = m.plan === 'quad' ? (m.h || 4) + 5 : m.plan === 'blob' ? (m.nose ? 13 : m.h || 8) : m.plan === 'bug' ? (m.tail ? 15 : 8)
    : m.plan === 'flyer' ? (m.big ? 24 : 17) : m.plan === 'golem' ? (m.small ? 16 : 18) : m.plan === 'worm' ? 23 : m.plan === 'ghost' ? (m.crown ? 21 : 17)
    : { shroom: 12, tree: 18, biped: 14 }[m.plan] || 12;
  return h * s;
}
function monW(id, sc) {
  const m = MONS[id], s = monSc(m, sc);
  const w = m.plan === 'quad' ? (m.len || 8) + 3 : m.plan === 'flyer' ? (m.big ? 20 : 15) : m.plan === 'worm' ? 14 : m.plan === 'tree' ? 13 : m.plan === 'golem' && !m.small ? 16 : m.plan === 'bug' && m.tail ? 15 : 11;
  return w * s;
}
const LOOPS = { flyer: 10, worm: 17, ghost: 20 };   // 계속 움직이는 몸은 여러 장으로 나눠 굽는다
function drawMon(ctx, id, t, o = {}) {
  const m = MONS[id], sc = monSc(m, o.sc);
  const tt = t + (o.ph || 0);
  const fr = Math.floor(tt * 6) % 2, loop = LOOPS[m.plan], q = loop ? Math.floor(tt * 8) % loop : 0;
  const w = (Math.ceil(monW(id, sc) / sc) + 26) * sc, h = (Math.ceil(monH(id, sc) / sc) + 14) * sc;
  const key = 'M|' + id + '|' + fr + '|' + q + '|' + sc + '|' + (FLASH || '');
  const s = bake(key, w, h, Math.round(w / 2), h - 3, x => { if (sc > 1) x.scale(sc, sc); PLANS[m.plan](x, m, fr, q / 8, o); });
  blit(ctx, s);
}

/* ───────── 마차 ───────── */
// 오른쪽으로 끌려간다. (0,0) = 수레 맨 뒤 바닥, 동물은 앞(오른쪽)
const WAGON_W = { cart: 24, donkey: 34, wagon: 46, caravan: 58, steel: 54 };
function wheel(P, cx, r, fr, c) {
  const cy = -r;
  for (let i = -r; i <= r; i++) { const k = Math.round(Math.sqrt(r * r - i * i)); P(cx + i, cy - k, 1, 1, c); P(cx + i, cy + k, 1, 1, c); P(cx - k, cy + i, 1, 1, c); P(cx + k, cy + i, 1, 1, c); }
  const sp = shade(c, 0.25);
  if (fr % 2) { for (let i = 1; i < r; i++) { P(cx + i, cy + i, 1, 1, sp); P(cx - i, cy - i, 1, 1, sp); P(cx + i, cy - i, 1, 1, sp); P(cx - i, cy + i, 1, 1, sp); } }
  else { P(cx - r + 1, cy, 2 * r - 1, 1, sp); P(cx, cy - r + 1, 1, 2 * r - 1, sp); }
  P(cx, cy, 1, 1, '#3a2a1e');
}
function beast(P, x0, kind, fr, alt) {
  const leg = (lx, h, c) => P(lx, -h, 1, h - ((lx + fr) % 2 ? 1 : 0), c);
  if (kind === 'donkey') {
    const b = '#8a8078', d = '#5e5650';
    P(x0, -9, 10, 5, b); P(x0, -5, 10, 1, d); P(x0 + 9, -12, 2, 4, b); P(x0 + 10, -13, 4, 3, b); P(x0 + 13, -12, 1, 2, '#c8c0b8');
    P(x0 + 10, -16, 1, 3, b); P(x0 + 11, -15, 1, 2, d); P(x0 + 12, -12, 1, 1, '#1a1410'); P(x0 - 1, -8, 1, 3, d);
    [x0 + 1, x0 + 3, x0 + 7, x0 + 9].forEach(l => leg(l, 4, d));
  } else if (kind === 'horse') {
    const b = alt ? '#5a3a22' : '#7a4a2a', d = shade(b, -0.35), mane = '#2e1c12';
    P(x0, -12, 13, 6, b); P(x0, -12, 13, 1, shade(b, 0.2)); P(x0 + 12, -16, 3, 6, b); P(x0 + 13, -18, 5, 3, b); P(x0 + 17, -17, 1, 2, shade(b, 0.3));
    P(x0 + 11, -17, 2, 6, mane); P(x0 + 13, -19, 1, 1, mane); P(x0 + 15, -17, 1, 1, '#1a1410'); P(x0 - 2, -11, 2, 6, mane);
    [x0 + 1, x0 + 3, x0 + 9, x0 + 11].forEach(l => leg(l, 6, d)); P(x0 + 2, -9, 9, 1, '#a8432f');
  } else if (kind === 'goat') {
    const b = '#e8e4dc', d = '#a8a49c';
    P(x0, -9, 10, 5, b); P(x0 + 9, -12, 2, 4, b); P(x0 + 10, -13, 4, 3, b); P(x0 + 12, -11, 1, 2, d);
    P(x0 + 9, -15, 1, 2, '#9a8a6a'); P(x0 + 8, -16, 1, 2, '#9a8a6a'); P(x0 + 12, -12, 1, 1, '#1a1410'); P(x0 + 13, -10, 1, 2, d);
    [x0 + 1, x0 + 3, x0 + 7, x0 + 9].forEach(l => leg(l, 4, d));
  }
}
function paintWagon(x, kind, fr) {
  const P = (px, py, w, h, c) => R(x, px, py, w, h, c);
  const wood = '#8a5a32', woodD = '#5e3c22', woodL = '#a8743e', cv = '#e8dcb8', cvD = '#c8b890', iron = '#5a5e68';
  if (kind === 'cart') {
    P(0, -11, 14, 6, wood); P(0, -11, 14, 1, woodL); P(1, -9, 12, 1, woodD); P(2, -14, 4, 3, '#7a5634'); P(7, -13, 5, 2, '#a8432f');
    P(14, -9, 9, 1, woodD); P(22, -10, 1, 2, woodD); wheel(P, 7, 3, fr, '#4a3420');
  } else if (kind === 'donkey') {
    P(0, -12, 15, 7, wood); P(0, -12, 15, 1, woodL); P(0, -9, 15, 1, woodD); P(2, -15, 5, 3, '#7a5634'); P(8, -14, 5, 2, '#5a6a7a');
    P(15, -9, 5, 1, woodD); wheel(P, 7, 4, fr, '#4a3420'); beast(P, 20, 'donkey', fr);
  } else if (kind === 'wagon') {
    P(0, -13, 24, 7, wood); P(0, -13, 24, 1, woodL); P(0, -9, 24, 1, woodD);
    P(1, -23, 22, 10, cv); P(3, -24, 18, 1, cv); for (let i = 3; i < 22; i += 5) P(i, -23, 1, 10, cvD); P(0, -14, 24, 1, cvD);
    P(24, -10, 6, 1, woodD); wheel(P, 5, 4, fr, '#4a3420'); wheel(P, 19, 4, fr + 1, '#4a3420'); beast(P, 30, 'horse', fr);
  } else if (kind === 'caravan') {
    P(0, -14, 32, 8, wood); P(0, -14, 32, 1, woodL); P(0, -10, 32, 1, woodD);
    P(1, -26, 30, 12, '#d8c8a0'); P(3, -27, 26, 1, '#d8c8a0'); for (let i = 3; i < 31; i += 6) P(i, -26, 1, 12, '#b8a880'); P(12, -22, 8, 4, '#a8432f'); P(15, -21, 2, 2, '#f0c24a');
    P(32, -10, 6, 1, woodD); wheel(P, 6, 5, fr, '#4a3420'); wheel(P, 25, 5, fr + 1, '#4a3420'); beast(P, 37, 'horse', fr, 1); beast(P, 41, 'horse', fr + 1);
  } else if (kind === 'steel') {
    P(0, -15, 30, 9, iron); P(0, -15, 30, 1, '#8a8e98'); P(0, -7, 30, 1, '#3a3e48');
    for (let i = 2; i < 30; i += 5) { P(i, -13, 1, 1, '#c8ccd4'); P(i, -9, 1, 1, '#c8ccd4'); }
    P(4, -22, 18, 7, '#6a6e78'); P(4, -22, 18, 1, '#9a9ea8'); P(24, -21, 3, 6, '#3a3e48'); P(24, -23, 3, 2, '#e8873a');
    P(30, -10, 6, 1, '#3a3e48'); wheel(P, 6, 5, fr, '#2a2e36'); wheel(P, 23, 5, fr + 1, '#2a2e36'); beast(P, 36, 'goat', fr); beast(P, 44, 'goat', fr + 1);
  }
}
function drawWagon(ctx, kind, t, moving) {
  const fr = moving ? Math.floor(t * 8) % 2 : 0;
  const w = WAGON_W[kind] + 8;
  blit(ctx, bake('W|' + kind + fr + '|' + (FLASH || ''), w, 34, 3, 31, x => paintWagon(x, kind, fr)));
}

/* ───────── 야영: 천막과 모닥불 ───────── */
function drawTent(ctx) {
  blit(ctx, bake('tent', 30, 20, 14, 18, x => {
    const c = '#c8a868', l = '#e0c88a', d = '#8a6a3a';
    for (let i = 0; i < 12; i++) { R(x, -i, -12 + i, i + 1, 1, i % 4 === 0 ? d : l); R(x, 1, -12 + i, i, 1, i % 4 === 0 ? d : c); }
    for (let i = 0; i < 6; i++) R(x, -i, -6 + i, i * 2 + 1, 1, '#2a1d14');
    R(x, 0, -14, 1, 3, '#5e3c22'); R(x, -13, -1, 27, 1, d);
  }));
}
function drawFire(ctx, x, y, t, big) {
  // 돌과 장작
  R(ctx, x - 6, y - 1, 2, 1, '#6a6670'); R(ctx, x + 5, y - 1, 2, 1, '#6a6670'); R(ctx, x - 4, y, 9, 1, '#4a4650');
  R(ctx, x - 5, y - 2, 11, 1, '#5e3c22'); R(ctx, x - 4, y - 3, 3, 1, '#7a5232'); R(ctx, x + 2, y - 3, 3, 1, '#7a5232');
  const f = Math.floor(t * 10) % 4, s = big ? 1.4 : 1;
  const cols = [[-2, 5, '#c0392b'], [-1, 8, '#f08a3c'], [0, 10, '#f7c04a'], [1, 7, '#f08a3c'], [2, 4, '#c0392b']];
  cols.forEach(([dx, h, c], i) => {
    const hh = Math.round((h + ((i + f) % 3) - 1) * s);
    R(ctx, x + dx, y - 3 - hh, 1, hh, c);
  });
  R(ctx, x - 1, y - 5, 3, 2, '#fff2c0');
  for (let i = 0; i < 5; i++) {
    const k = ((t * 0.9 + i * 0.37) % 1), sx = x + Math.round(Math.sin(i * 7 + t * 3) * 3), sy = y - 8 - Math.round(k * 20);
    if (k < 0.8) R(ctx, sx, sy, 1, 1, k < 0.4 ? '#f7e04a' : '#f08a3c');
  }
}
function drawZ(ctx, x, y, t, ph) {
  for (let i = 0; i < 2; i++) {
    const k = ((t * 0.5 + ph + i * 0.5) % 1), zx = x + Math.round(k * 6), zy = y - Math.round(k * 12);
    if (k > 0.9) continue;
    const c = 'rgba(232,240,255,' + (1 - k).toFixed(2) + ')';
    R(ctx, zx, zy, 3, 1, c); R(ctx, zx + 1, zy + 1, 1, 1, c); R(ctx, zx, zy + 2, 3, 1, c);
  }
}

/* ───────── 들것: 쓰러진 동료를 싣고 간다 ───────── */
function drawStretcher(ctx, a, t, moving) {
  const by = moving ? Math.round(Math.sin(t * 9) * 0.6) : 0;
  ctx.save(); ctx.translate(0, by);
  R(ctx, -12, -4, 25, 1, '#6b4a2e'); R(ctx, -13, -4, 1, 1, '#8a6a44'); R(ctx, 13, -4, 1, 1, '#8a6a44');
  R(ctx, -9, -5, 19, 2, '#d8cdb0'); R(ctx, -9, -3, 19, 1, '#a89a7a');
  R(ctx, -8, -1, 1, 3, '#5e3c22'); R(ctx, 8, -1, 1, 3, '#5e3c22');
  ctx.translate(0, -3);
  drawAdv(ctx, a, t, { sleep: 1 });
  ctx.restore();
  R(ctx, -1, -15 + by, 3, 1, '#e0503f'); R(ctx, 0, -16 + by, 1, 3, '#e0503f');
}

/* ───────── 던전 입구 (필드 위에 서 있다) ───────── */
function paintGate(x, kind, cleared) {
  const P = (px, py, w, h, c) => R(x, px, py, w, h, c), dark = '#120e14';
  if (kind === 'cellar') {          // 버려진 곡물 창고
    P(-18, -24, 36, 24, '#7a5634'); for (let i = -18; i < 18; i += 4) P(i, -24, 1, 24, '#5e4028');
    for (let i = 0; i < 10; i++) P(-21 + i, -24 - i, 42 - i * 2, 1, i % 3 ? '#8a3020' : '#6a2418');
    P(-7, -17, 14, 17, dark); P(-7, -17, 14, 1, '#4a3020'); P(-9, -19, 18, 2, '#5e4028');
    P(13, -5, 6, 5, '#d8b050'); P(-19, -4, 5, 4, '#d8b050');
  } else if (kind === 'cave') {     // 썩은 뿌리 동굴
    ell(x, 0, -10, 22, 12, '#4a4038'); ell(x, -2, -14, 16, 8, '#5a5048'); ell(x, 0, -5, 9, 7, dark);
    for (const [rx, ry, l] of [[-18, -16, 10], [-10, -22, 8], [8, -21, 12], [16, -14, 9]]) { P(rx, ry, 1, l, '#6b4a2e'); P(rx + 1, ry + l - 1, 2, 1, '#6b4a2e'); }
    P(-6, -20, 3, 3, '#3f7a3a'); P(5, -19, 4, 2, '#3f7a3a');
  } else if (kind === 'mine') {     // 버려진 드워프 갱도
    ell(x, 0, -12, 24, 14, '#4e4a56'); P(-10, -20, 20, 20, dark); P(-12, -22, 4, 22, '#6b4a2e'); P(8, -22, 4, 22, '#6b4a2e'); P(-14, -24, 28, 3, '#7a5634'); P(-14, -24, 28, 1, '#9a7a4f');
    P(-8, -3, 16, 1, '#8a8a90'); P(-8, -1, 16, 1, '#8a8a90'); P(-2, -26, 4, 2, '#c9a04a');
  } else if (kind === 'nest') {     // 와이번 둥지
    ell(x, 0, -14, 22, 16, '#6a6070'); ell(x, 0, -6, 10, 8, dark);
    for (let i = -16; i < 16; i += 3) P(i, -28 + Math.abs(i) / 3, 4, 1, '#7a5634');
    P(-14, -2, 4, 2, '#f0e8d8'); P(10, -3, 3, 3, '#f0e8d8'); P(12, -5, 1, 2, '#f0e8d8');
  } else if (kind === 'icetemple') { // 얼어붙은 신전
    P(-20, -4, 40, 4, '#a8c8dc'); P(-16, -26, 5, 22, '#c8e4f4'); P(11, -26, 5, 22, '#c8e4f4'); P(-15, -26, 1, 22, '#ffffff'); P(12, -26, 1, 22, '#ffffff');
    for (let i = 0; i < 7; i++) P(-20 + i * 2, -27 - i, 40 - i * 4, 1, '#e8f6ff');
    P(-8, -20, 16, 16, '#1a2a4a'); P(-8, -20, 16, 1, '#4a7898'); P(-1, -32, 2, 3, '#8ad8ff');
  } else if (kind === 'tomb') {     // 모래에 묻힌 왕릉
    for (let i = 0; i < 22; i++) P(-22 + i, -i - 1, 44 - i * 2, 1, i % 4 ? '#c89858' : '#b8884a');
    P(-6, -14, 12, 14, dark); P(-8, -16, 16, 2, '#d8c098'); P(-8, -14, 2, 14, '#d8c098'); P(6, -14, 2, 14, '#d8c098');
    P(-3, -19, 6, 2, '#f0c24a'); P(-1, -21, 2, 2, '#f0c24a');
  }
  if (cleared === 2) {              // 1-50의 주인이 지키는 동안은 봉인되어 있다
    for (let i = 0; i < 14; i++) { P(-8 + i, -18 + i, 2, 1, '#8a8e98'); P(5 - i, -18 + i, 2, 1, '#8a8e98'); }
    P(-3, -12, 6, 6, '#6a2a8a'); P(-2, -11, 4, 4, '#b86af0'); P(-1, -10, 2, 2, '#f0d8ff');
  } else if (cleared) {             // 공략한 던전은 판자로 막혔다
    P(-9, -18, 18, 2, '#9a7a4f'); P(-9, -10, 18, 2, '#9a7a4f'); P(-8, -18, 2, 18, '#7a5634'); P(6, -18, 2, 18, '#7a5634');
    for (let i = 0; i < 12; i++) { P(-7 + i, -17 + i, 2, 1, '#8a6a44'); P(5 - i, -17 + i, 2, 1, '#8a6a44'); }
  }
}
function drawGate(ctx, kind, cleared) {
  blit(ctx, bake('G|' + kind + (+cleared || 0), 54, 44, 27, 41, x => paintGate(x, kind, cleared)));
}
