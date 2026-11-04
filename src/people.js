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
  coach:   { key: 'Scoach', hair: '#5a3a22', skin: '#c68a5e', body: '#a8432f', legs: '#3a3040', style: 2, beard: 1 },
  cook:    { key: 'Scook', hair: '#3a2a1a', skin: '#f1c9a5', body: '#f4f0e4', legs: '#4a3a2a', apron: '#e8e2d0', style: 0, hat: 'band', mustache: 1 },
  // 빌드 34: 던전 수거소 (장부 담당 · 수거꾼 셋)
  sorter:  { key: 'Ssorter', hair: '#4a3020', skin: '#e0ac7e', body: '#7a6a4a', legs: '#3a3040', apron: '#c8b890', glasses: 1, style: 1 },
  salvor:  { key: 'Ssalv1', hair: '#3a2a1a', skin: '#c68a5e', body: '#5a6a3a', legs: '#3a3a2a', style: 2, hat: 'cap', hatc: '#8a6a3a', bag: 1 },
  salvor2: { key: 'Ssalv2', hair: '#8a5a2a', skin: '#f1c9a5', body: '#6a4a3a', legs: '#2a2a3a', style: 0, hat: 'scarf', hatc: '#a8432f', bag: 1 },
  salvor3: { key: 'Ssalv3', hair: '#2a2a2a', skin: '#e0ac7e', body: '#3f5a7a', legs: '#3a3040', style: 3, beard: 1, bag: 1 }
};
// 본부의 작은 모험가: 직업 차림(PXL)에서 색과 모자를 고른다
const HAT_OF = { helm: 'helm', great: 'greathelm', winged: 'greathelm', glad: 'bronze', horn: 'horns', dragon: 'dragon', hood: 'hood', hoodup: 'hood', cowl: 'hood', coif: 'hood', coif2: 'hood',
  wizard: 'wizard', mitre: 'wizard', mitre2: 'wizard', crown: 'circlet', bonecrown: 'circlet', circlet: 'circlet', laurel: 'circlet', beak: 'plague', band: 'band', goggles: 'goggle', beret: 'cap', feather: 'cap', tophat: 'cap', widebrim: 'cap' };
function advPerson(a) {
  const L = advLook(a), l = a.look || {}, hat = HAT_OF[L.head] || null;
  const hc = ['helm', 'horn', 'great', 'winged'].includes(L.head) ? (L.metal || '#9aa4b0') : L.head === 'coif' || L.head === 'mitre' || L.head === 'mitre2' ? '#f4f0e6' : L.head === 'glad' ? '#c08a3a' : ['crown', 'circlet', 'laurel'].includes(L.head) ? (L.gem || '#f0c24a') : L.head === 'hoodup' && L.cape ? L.cape : L.c3 && L.head === 'band' ? L.c3 : L.c1;
  return { key: 'A' + a.cls + (l.hair || '') + (l.skin || '') + ((a.id || 0) % 3) + (a.hero ? 'h' : ''),
    hair: l.hair || HAIRS[0], skin: L.skin || l.skin || SKINS[0], body: L.body === 'plate' || L.body === 'chain' || L.body === 'scale' ? (L.metal || '#9aa4b0') : L.body === 'bare' ? (l.skin || SKINS[0]) : L.c1, legs: shade(L.c1, -0.45), trim: L.c2,
    style: (a.id || 0) % 3, robe: L.body === 'robe' ? 1 : 0, hat, hatc: hc, pack: (L.ex || []).includes('pack'), cape: L.cape || (a.hero ? '#b8322a' : null), glasses: L.head === 'monocle' ? 1 : 0 };
}

// 그리기는 pxhq.js (drawPerson · drawSleeper)
