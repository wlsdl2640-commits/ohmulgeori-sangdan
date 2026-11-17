// 새끼 펫 · 말 새 그림 확인 (시험 묶음 아님): ev83.py 같은 훅 페이지 도구로 돌린다 — 결과 한 줄씩
(() => {
  const out = [], bad = [];
  const PICK = { wolf: 'wolf', spider: 'spider', golem: 'golem_c', griffon: 'griffon', harpy: 'harpy', icesprite: 'icesprite', scorpion: 'scorpion', sewerrat: 'psewerrat', kelpie: 'kelpie', imp: 'imp', vbat: 'vbat', goat: 'alpgoat', wyvern: 'wyvern', redhare: 'redhare', pegasus: 'pegasus' };
  const HS = ['old', 'donkey', 'gray', 'black', 'white', 'war', 'noble'];
  if (PXU.pet_slime) bad.push('slime should keep old art');
  for (const [k, b] of Object.entries(PICK)) {
    const id = 'pet_' + k;
    if (!PXU[id]) { bad.push('no PXU ' + id); continue; }
    if (MONS[id].body !== MONS[b].body || MONS[id].dark !== MONS[b].dark) bad.push('color ' + id);
    if (MONS[id].plan !== 'pet' || (MONS[id].drops || []).length) bad.push('label ' + id);
    const s0 = pxuSprite(id, 'idle', 0), s1 = pxuSprite(id, 'idle', 1);
    out.push(`${id} ${s0.w}x${s0.h} ${s1.w}x${s1.h} fit26 ${monFit(id, 26).toFixed(2)} pen ${Math.min(1, monFit(id, 26)).toFixed(2)}`);
  }
  for (const k of HS) { const id = 'horse_' + k; if (!PXU[id]) { bad.push('no PXU ' + id); continue; } const s = pxuSprite(id, 'idle', 0); out.push(`${id} ${s.w}x${s.h} wagon ${monFit(id, 44).toFixed(2)} back ${monBack(id)}`); }
  // 아이콘 · 펫 칸 · 도감
  for (const k of Object.keys(PETS)) { try { petQURL({ kind: k, q: 0 }); monIconURL('pet_' + k); } catch (e) { bad.push('icon ' + k + ' ' + e.message); } }
  for (const k of HS) { try { monIconURL('horse_' + k); } catch (e) { bad.push('hicon ' + k + ' ' + e.message); } }
  // 전투 · 원정(마차) 그리기
  const team = ['paladin', 'archbishop', 'coachman'].map((c, i) => { const a = makeAdv({ cls: c, lv: 60 }); a.id = 900 + i; a.status = 'away'; return a; });
  S.advs = S.advs.concat(team); const p = S.parties[0]; const keep = { m: p.members, pet: p.pet, w: p.wagon, h: p.horse, e: p.exp };
  p.members = team.map(a => a.id); S.view = p.id;
  let n = 0;
  for (const k of Object.keys(PETS)) {
    S.pets = [{ id: 777, kind: k, stage: 0, name: 'x', lv: 3, exp: 0, q: 0 }]; p.pet = 777;
    p.exp = { field: 'plains', area: 'field', stage: 3, pos: 60, mode: 'advance', encs: [60], ei: 0, foes: [foeFrom('wolf', 20)], next: [], ev: [], evN: 0, buffs: [], cd: {}, scd: {}, gcd: {}, sta: {}, kills: 0, bag: {}, gbag: [], log: [], dots: {} };
    try { for (let i = 0; i < 3; i++) drawFrame(20000 + i * 50, 20 + i * 0.05); n++; } catch (e) { bad.push('battle ' + k + ' ' + e.message); }
  }
  p.pet = null; S.pets = [];
  for (const k of HS) {
    p.wagon = 'wagon'; p.horse = 'h:' + k;
    p.exp = { field: 'plains', area: 'field', stage: 3, pos: 60, mode: 'advance', encs: [60], ei: 0, foes: [], next: [], ev: [], evN: 0, buffs: [], cd: {}, scd: {}, gcd: {}, sta: {}, kills: 0, bag: {}, gbag: [], log: [], dots: {} };
    try { for (let i = 0; i < 3; i++) drawFrame(30000 + i * 50, 30 + i * 0.05); n++; } catch (e) { bad.push('wagon ' + k + ' ' + e.message); }
  }
  Object.assign(p, { members: keep.m, pet: keep.pet, wagon: keep.w, horse: keep.h, exp: keep.e });
  out.push('drawn ' + n);
  return out.join('\n') + '\nBAD ' + JSON.stringify(bad);
})()
