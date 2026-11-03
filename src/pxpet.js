/* ───────── 펫 새끼 손 도트 (반 해상도 → 두 배, pxmon2.js와 같은 방식) ───────── */
const PXPET = {
  slime: { h: `
..CQQC..
.CQwQwC.
.CCKCKC.
CCCCCCCC
.cccccc.
`, pal: { w: '#ffffff', K: '#2a1e2a' } },
  wolf: { h: `
.KK...K.
.CCCCCC.
.CeCCCKK
CCCCCC..
.CC.CC..
.cc.cc..
`, pal: { e: '#ffe05a', K: '#4a3a30' } },
  spider: { h: `
K......K
.KCCCCK.
.CeCCeC.
KCCCCCCK
.cc..cc.
`, pal: { e: '#ff4a4a', K: '#221e26' } },
  golem: { h: `
.CCCCCC.
.CeCCeC.
.CCCCCC.
CCCMMCCC
CCCMMCCC
.cc..cc.
`, pal: { e: '#f0a040', M: '#e8873a' } },
  griffon: { h: `
...CCC..
..CCeCK.
.CCCCCK.
CCCCCC..
.CC.CC..
.ww.ww..
`, pal: { e: '#2a1e1a', K: '#f0c24a', w: '#f0e8d0' } },
  harpy: { h: `
..HHH...
..HSeS..
KHHHHHK.
.CCCCC..
..C.C...
..w.w...
`, pal: { H: '#c8a888', S: '#f1c9a5', e: '#2a1e2a', K: '#7a9ab8', w: '#f0c24a' } },
  icesprite: { h: `
..CQC...
.CQwQC..
.CCeeC..
..CCC...
.CQQQC..
..ccc...
`, pal: { w: '#ffffff', e: '#ffffff', Q: '#c8f0ff' } },
  scorpion: { h: `
......KK
.....K..
CCCCCK..
CeCCCC..
CCCCCC..
.cc.cc..
`, pal: { e: '#1a1410', K: '#7a3e1a' } },
  sewerrat: { h: `
.KK.KK..
.CCCCCC.
.CeCCCCK
CCCCCC..
.cc.cc..
`, pal: { e: '#ffe05a', K: '#3a2e2a' } },
  kelpie: { h: `
.....QQ.
....CCQC
...CCCe.
.CCCCC..
.CCCCC..
.cc.cc..
`, pal: { Q: '#8ad8f0', e: '#ffffff' } },
  imp: { h: `
K.....K.
.CCCCC..
.CeCeC..
..CCC...
.CCCCC..
.cc.cc..
`, pal: { e: '#ffe05a', K: '#4a1a1a' } },
  vbat: { h: `
CC....CC
CCC.CCCC
.CCeeCC.
..CCCC..
...ww...
`, pal: { e: '#ff4a4a', w: '#ffffff' } }
};
Object.keys(PXPET).forEach(k => {
  const M = PXPET[k], rows = M.h.split('\n').filter(r => r.trim().length), W = Math.max(...rows.map(r => r.length));
  const g = ['.'.repeat(W * 2 + 1)].concat(rows.map(r => '.' + r.padEnd(W, '.').split('').map(ch => ch + ch).join('')).flatMap(r => [r, r])).join('\n');
  PXM['pet_' + k] = { g: '\n' + g + '\n', pal: M.pal || {} };
  const P = PETS[k], m = MONS[P.mon];
  MONS['pet_' + k] = { name: P.name, plan: 'pet', body: m.body || m.skin || '#8a8a8a', dark: m.dark, skin: m.skin, mh: 0, ma: 0, md: 0, spd: 1, pet: k, drops: [] };
});
