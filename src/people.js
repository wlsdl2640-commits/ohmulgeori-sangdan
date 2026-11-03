/* ───────── 본부 사람들 (비스듬한 입체) ───────── */
// 발밑 가운데가 (0,0). dir 'f' = 앞(화면 오른쪽 아래를 봄), 'b' = 뒤(오른쪽 위를 봄). 왼쪽을 볼 때는 좌우를 뒤집는다.
const TOWN = {
  hair: ['#2b1d16', '#5a3a22', '#8a5a2b', '#c9a04a', '#d8d0c0', '#7a2f22', '#30304a', '#9a9aa4'],
  cloth: ['#a8432f', '#3f6a9a', '#4f8a43', '#8a5a9a', '#c08a3a', '#5a6a7a', '#b86a8a', '#2f7a70', '#9a7a4f', '#6a4a8a', '#c8b890'],
  legs: ['#3a3040', '#4a3a2a', '#2a3a4a', '#5a4a3a', '#3a4a3a', '#6a5a4a']
};
function villager(seed) {
  const r = rng(seed * 7919 + 13), pick = a => a[Math.floor(r() * a.length)], hr = r();
  return { key: 'V' + seed, hair: pick(TOWN.hair), skin: pick(SKINS), body: pick(TOWN.cloth), legs: pick(TOWN.legs), style: Math.floor(r() * 4),
    hat: hr < 0.14 ? 'cap' : hr < 0.24 ? 'straw' : hr < 0.32 ? 'scarf' : null, hatc: pick(TOWN.cloth), bag: r() < 0.35, beard: r() < 0.12, robe: r() < 0.15 ? 1 : 0 };
}
const STAFF = {
  keeper:  { key: 'Skeeper', hair: '#5a3a22', skin: '#f1c9a5', body: '#e8dcb8', legs: '#4a3a2a', apron: '#7a5232', style: 0, mustache: 1 },
  smith:   { key: 'Ssmith', hair: '#2b1d16', skin: '#c68a5e', body: '#a8743e', legs: '#3a3040', apron: '#4a3424', style: 3, hat: 'band', beard: 1 },
  alchem:  { key: 'Salchem', hair: '#c9a04a', skin: '#f1c9a5', body: '#4f7a5a', legs: '#4f7a5a', robe: 1, hat: 'goggle', style: 1, trim: '#c8b890' },
  priest:  { key: 'Spriest', hair: '#d8d0c0', skin: '#e0ac7e', body: '#e8e4d8', legs: '#e8e4d8', robe: 1, trim: '#d9b44a', style: 0 },
  sage:    { key: 'Ssage', hair: '#e8e4dc', skin: '#f1c9a5', body: '#3f2f6a', legs: '#3f2f6a', robe: 1, hat: 'wizard', hatc: '#3f2f6a', beard: 1, trim: '#d9b44a' },
  clerk:   { key: 'Sclerk', hair: '#30304a', skin: '#f1c9a5', body: '#2a3a5a', legs: '#2a2a3a', glasses: 1, tie: 1, style: 0 },
  innkeep: { key: 'Sinn', hair: '#7a2f22', skin: '#e0ac7e', body: '#8a5a9a', legs: '#4a3a2a', apron: '#e8dcb8', style: 1 },
  coach:   { key: 'Scoach', hair: '#5a3a22', skin: '#c68a5e', body: '#a8432f', legs: '#3a3040', style: 2, beard: 1 }
};
// 본부의 작은 모험가: 직업 차림(LOOKS)에서 색과 모자를 고른다
const HAT_OF = { helm: 'helm', great: 'greathelm', winged: 'greathelm', glad: 'bronze', horn: 'horns', dragon: 'dragon', hood: 'hood', hoodup: 'hood', cowl: 'hood', coif: 'hood', coif2: 'hood',
  wizard: 'wizard', mitre: 'wizard', mitre2: 'wizard', crown: 'circlet', bonecrown: 'circlet', circlet: 'circlet', laurel: 'circlet', beak: 'plague', band: 'band', goggles: 'goggle', beret: 'cap', feather: 'cap', tophat: 'cap', widebrim: 'cap' };
function advPerson(a) {
  const L = LOOKS[a.cls] || LOOKS[jobBase(a.cls)] || LOOKS.warrior, l = a.look || {}, hat = HAT_OF[L.head] || null;
  const hc = ['helm', 'horn', 'great', 'winged'].includes(L.head) ? (L.metal || '#9aa4b0') : L.head === 'coif' || L.head === 'mitre' || L.head === 'mitre2' ? '#f4f0e6' : L.head === 'glad' ? '#c08a3a' : ['crown', 'circlet', 'laurel'].includes(L.head) ? (L.gem || '#f0c24a') : L.head === 'hoodup' && L.cape ? L.cape : L.c3 && L.head === 'band' ? L.c3 : L.c1;
  return { key: 'A' + a.cls + (l.hair || '') + (l.skin || '') + ((a.id || 0) % 3) + (a.hero ? 'h' : ''),
    hair: l.hair || HAIRS[0], skin: L.skin || l.skin || SKINS[0], body: L.body === 'plate' || L.body === 'chain' || L.body === 'scale' ? (L.metal || '#9aa4b0') : L.body === 'bare' ? (l.skin || SKINS[0]) : L.c1, legs: shade(L.c1, -0.45), trim: L.c2,
    style: (a.id || 0) % 3, robe: L.body === 'robe' ? 1 : 0, hat, hatc: hc, pack: (L.ex || []).includes('pack'), cape: L.cape || (a.hero ? '#b8322a' : null), glasses: L.head === 'monocle' ? 1 : 0 };
}

function paintPerson(x, p, dir, pose, fr) {
  const P = (px, py, w, h, c) => R(x, px, py, w, h, c);
  const back = dir === 'b', sit = pose === 'sit', walk = pose === 'walk';
  const sk = p.skin, skD = shade(sk, -0.22), hr = p.hair, hrD = shade(hr, -0.3);
  const bd = p.body, bdD = shade(bd, -0.3), bdL = shade(bd, 0.16), lg = p.legs || '#3a3040', shoe = '#2a1d14';
  const f = walk ? fr % 4 : 0, oy = sit ? 3 : walk && f % 2 ? -1 : 0;
  const Y = y => y + oy;
  // 등 뒤에 오는 것 (앞모습일 때)
  if (!back && p.cape) P(-5, Y(-10), 2, 9 - (sit ? 3 : 0), p.cape);
  if (!back && p.pack) { P(-7, Y(-15), 3, 10, '#7a5634'); P(-7, Y(-16), 3, 1, '#a8432f'); }
  // 다리
  if (sit) { P(-2, -4, 6, 2, lg); P(3, -4, 2, 3, lg); P(3, -1, 3, 1, shoe); }
  else if (p.robe) {
    const s1 = f === 1 ? 1 : f === 3 ? -1 : 0;
    P(-2 + s1, -1, 2, 1, shoe); P(1 - s1, -1, 2, 1, shoe);
  } else {
    const bl = f === 1 ? -1 : f === 3 ? 1 : 0, fl = -bl, bL = f === 3 ? -1 : 0, fL = f === 1 ? -1 : 0;
    P(-2 + bl, -4 + bL, 2, 3, shade(lg, -0.15)); P(-2 + bl, -1 + bL, 2, 1, shoe);
    P(1 + fl, -4 + fL, 2, 3, lg); P(1 + fl, -1 + fL, 2, 1, shoe);
  }
  // 몸통
  if (p.robe) {
    const h = sit ? 6 : 9;
    P(-3, Y(-10), 6, h, bd); P(1, Y(-10), 2, h, bdD); P(-3, Y(-10) + h - 1, 6, 1, p.trim || bdD);
  } else {
    P(-3, Y(-10), 6, 6, bd); P(1, Y(-10), 2, 6, bdD);
    P(-3, Y(-6), 6, 1, '#4a3020');
  }
  if (!back) {
    P(-2, Y(-10), 4, 1, p.trim || bdL);
    if (p.apron) { P(-2, Y(-9), 4, 6 - (sit ? 2 : 0), p.apron); P(-2, Y(-9), 4, 1, shade(p.apron, 0.2)); }
    if (p.tie) { P(-1, Y(-10), 3, 2, '#e8e2d0'); P(0, Y(-9), 1, 3, '#a8432f'); }
    if (p.bag) { P(2, Y(-10), 1, 3, '#6a4a2a'); P(3, Y(-7), 2, 3, '#8a6a44'); }
  } else {
    if (p.cape) P(-4, Y(-10), 8, 9 - (sit ? 3 : 0), p.cape);
    if (p.pack) { P(-4, Y(-15), 8, 10, '#7a5634'); P(-4, Y(-16), 8, 2, '#a8432f'); P(-3, Y(-11), 6, 1, '#5e4630'); }
  }
  // 팔 (자세에 따라)
  const sw = walk ? (f === 1 ? 1 : f === 3 ? -1 : 0) : 0;
  P(-4, Y(-10) + sw, 1, 4, bdD); P(-4, Y(-6) + sw, 1, 1, skD);
  if (pose === 'hammer') {
    if (fr % 2 === 0) { P(3, Y(-14), 1, 5, bd); P(3, Y(-15), 1, 1, sk); P(1, Y(-18), 5, 3, '#6a6e78'); P(1, Y(-18), 5, 1, '#9aa0a8'); P(3, Y(-15), 1, 3, '#7a5634'); }
    else { P(3, Y(-9), 3, 1, bd); P(6, Y(-9), 1, 1, sk); P(6, Y(-10), 1, 3, '#7a5634'); P(5, Y(-8), 4, 3, '#6a6e78'); }
  } else if (pose === 'stir') {
    const k = fr % 2; P(3, Y(-9), 2, 1, bd); P(5, Y(-9), 1, 1, sk); P(5 + k, Y(-12), 1, 6, '#8a6a44');
  } else if (pose === 'pray') { P(1, Y(-9), 3, 1, bd); P(3, Y(-10), 1, 2, sk); }
  else if (pose === 'read') { P(1, Y(-8), 5, 3, '#a8432f'); P(2, Y(-8), 3, 1, '#e8dcb8'); P(3, Y(-9), 1, 1, sk); }
  else if (pose === 'pay') { P(3, Y(-9), 3, 1, bd); P(6, Y(-9), 1, 1, sk); P(6, Y(-10), 2, 2, '#f0c24a'); }
  else if (pose === 'carry') { P(3, Y(-11), 1, 3, bd); P(3, Y(-12), 1, 1, sk); }
  else { P(3, Y(-10) - sw, 1, 4, bd); P(3, Y(-6) - sw, 1, 1, sk); }
  // 머리
  P(-3, Y(-18), 6, 1, sk); P(-4, Y(-17), 8, 5, sk); P(-3, Y(-12), 6, 1, sk); P(-2, Y(-12), 5, 1, skD);
  if (back) {
    P(-4, Y(-18), 8, 6, hr); P(-3, Y(-19), 6, 1, hr); P(-3, Y(-12), 6, 1, hrD);
    if (p.style === 1) { P(-4, Y(-12), 8, 3, hr); P(-3, Y(-9), 6, 1, hrD); }
  } else {
    P(-4, Y(-18), 8, 2, hr); P(-3, Y(-19), 6, 1, hr); P(-4, Y(-16), 2, 3, hr); P(-1, Y(-16), 4, 1, hr);
    if (p.style === 1) { P(-5, Y(-16), 2, 7, hr); P(-5, Y(-10), 1, 1, hrD); }
    if (p.style === 2) { P(-3, Y(-20), 1, 1, hr); P(-1, Y(-20), 1, 1, hr); P(1, Y(-20), 1, 1, hr); P(-5, Y(-17), 1, 1, hr); }
    if (p.style === 3) { P(-4, Y(-18), 8, 1, hrD); }
    P(0, Y(-14), 1, 2, '#2a1d14'); P(2, Y(-14), 1, 2, '#2a1d14'); P(3, Y(-12), 1, 1, '#e89a8a');
    if (p.beard) { P(-1, Y(-12), 5, 2, hr); P(0, Y(-10), 3, 1, hrD); }
    if (p.mustache) P(0, Y(-12), 3, 1, hrD);
    if (p.glasses) { P(-1, Y(-14), 5, 1, '#2a2a3a'); P(0, Y(-14), 1, 1, '#bfe8ff'); P(2, Y(-14), 1, 1, '#bfe8ff'); }
  }
  // 모자
  const hc = p.hatc || '#a8432f';
  switch (p.hat) {
    case 'cap': P(-4, Y(-20), 8, 2, hc); P(back ? -6 : 2, Y(-18), 4, 1, shade(hc, -0.25)); break;
    case 'straw': P(-6, Y(-18), 12, 1, '#c8a050'); P(-3, Y(-20), 6, 2, '#e0c070'); P(-3, Y(-19), 6, 1, '#a8432f'); break;
    case 'scarf': P(-4, Y(-20), 8, 3, hc); P(-5, Y(-17), 1, 4, hc); break;
    case 'band': P(-4, Y(-17), 8, 1, '#c0392b'); P(-5, Y(-16), 1, 2, '#c0392b'); break;
    case 'goggle': P(-4, Y(-17), 8, 1, '#5a4a3a'); if (!back) { P(0, Y(-17), 1, 1, '#8ad8ff'); P(2, Y(-17), 1, 1, '#8ad8ff'); } break;
    case 'wizard': P(-5, Y(-19), 10, 1, shade(hc, -0.2)); P(-3, Y(-20), 6, 1, hc); P(-2, Y(-21), 5, 1, hc); P(-2, Y(-22), 4, 1, hc); P(-3, Y(-23), 3, 1, hc); P(-4, Y(-24), 2, 1, hc); P(-3, Y(-20), 6, 1, p.trim || '#d9b44a'); break;
    case 'hood': P(-4, Y(-20), 8, 3, hc); P(-5, Y(-18), 1, 6, hc); if (back) P(-4, Y(-18), 8, 7, hc); else P(3, Y(-17), 1, 3, hc); break;
    case 'helm': P(-4, Y(-20), 8, 3, hc); P(-4, Y(-20), 8, 1, shade(hc, 0.3)); P(-1, Y(-22), 2, 2, '#c0392b'); if (!back) P(3, Y(-17), 1, 3, hc); break;
    case 'bronze': P(-4, Y(-20), 8, 3, hc); P(-3, Y(-22), 6, 2, '#b8322a'); if (!back) P(3, Y(-17), 1, 3, hc); break;
    case 'horns': P(-4, Y(-20), 8, 2, hc); P(-5, Y(-22), 1, 2, '#e8e2d0'); P(-6, Y(-23), 1, 1, '#e8e2d0'); P(4, Y(-22), 1, 2, '#e8e2d0'); P(5, Y(-23), 1, 1, '#e8e2d0'); break;
    case 'dragon': P(-4, Y(-20), 8, 3, hc); P(-3, Y(-22), 5, 2, '#7ad8c8'); if (!back) P(1, Y(-16), 3, 1, '#2a3a40'); break;
    case 'greathelm': P(-4, Y(-20), 8, 8, hc); P(0, Y(-20), 1, 4, '#e8c060'); if (!back) P(0, Y(-15), 3, 1, '#2a2620'); break;
    case 'circlet': P(-4, Y(-17), 8, 1, hc); P(2, Y(-18), 1, 1, '#c8ffd8'); break;
    case 'plague': P(-6, Y(-18), 12, 1, hc); P(-4, Y(-22), 8, 4, hc); P(-4, Y(-22), 8, 1, '#3a3640'); if (!back) { P(-3, Y(-17), 6, 4, '#2a2620'); P(0, Y(-15), 2, 1, '#8ad8ff'); P(3, Y(-14), 2, 1, '#c8b890'); P(4, Y(-13), 3, 1, '#c8b890'); } break;
  }
}
// 사람 그리기: flip이면 왼쪽을 본다
function drawPerson(ctx, p, dir, pose, fr, flip) {
  const s = bake('P|' + (p.key || p.hair + p.body) + '|' + dir + pose + fr + '|' + (FLASH || ''), 26, 32, 13, 28, x => paintPerson(x, p, dir, pose, fr));
  if (flip) { ctx.save(); ctx.scale(-1, 1); blit(ctx, s); ctx.restore(); } else blit(ctx, s);
}
// 침대에서 자는 모습 (머리와 이불만)
function drawSleeper(ctx, p, t, ph) {
  blit(ctx, bake('Z|' + (p.key || p.hair) , 16, 12, 8, 9, x => {
    R(x, -3, -6, 6, 5, p.skin); R(x, -4, -7, 8, 2, p.hair); R(x, -4, -5, 2, 3, p.hair); R(x, 0, -4, 2, 1, '#3a2a20');
    if (p.hat && p.hat !== 'band' && p.hat !== 'goggle' && p.hat !== 'circlet') R(x, -4, -8, 8, 2, p.hatc || '#a8432f');
  }, true));
}
