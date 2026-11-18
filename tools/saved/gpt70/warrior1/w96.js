/* 전사 1차 참고 판 — 실제 게임 그리기 함수로 생김새 · 동작 · 스킬 그림 · 스킬 효과를 뽑는다 */
window.W96 = (() => {
  const W = {};
  const spr = s => ({ u: s.cv.toDataURL(), w: s.w, h: s.h, ax: s.ax, ay: s.ay, mfx: s.mfx ? { back: s.mfx.back, front: s.mfx.front } : null });
  W.mk = (lv = 1, wt = 0) => {
    const a = makeAdv({ cls: 'warrior', lv }); a.id = 900; a.name = '전사';
    a.look = { hair: '#5a3a22', skin: '#e0ac7e' };
    a.eq.weapon = makeGear('sword', wt, 0); a.eq.off = makeGear('shield', wt, 0);
    return a;
  };
  W.look = (wt = 0) => { const a = W.mk(1, wt), out = { side: {}, front: {} };
    for (const [pose, n] of [['idle', 2], ['walk', 4], ['sit', 1], ['sleep', 1], ['down', 1]]) for (let f = 0; f < n; f++) {
      try { out.side[pose + f] = spr(pxsAdvSprite(a, pose, f)); } catch (err) { out.side[pose + f] = { err: String(err) }; }
      try { out.front[pose + f] = spr(pxAdvSprite(a, pose, f)); } catch (err) { out.front[pose + f] = { err: String(err) }; }
    }
    return out; };
  W.mots = MK => { const a = W.mk(), out = {};
    for (const mk of MK) { out[mk] = { T: motT(mk, 0), hit: pxsMotHit(mk), f: [] };
      for (let f = 0; f < 8; f++) { const s = pxsAdvSprite(a, 'm:' + mk, f), F = pxsMotFr(mk, f); out[mk].f.push(Object.assign(spr(s), { dx: F.dx || 0, jy: F.jy || 0 })); } }
    return out; };
  W.icons = ids => ids.map(id => { const s = SKILLS[id]; return { id, name: s.name, hex: hexURL(skillGlyph(s), s.kind, false, id), cells: skiCells(id) }; });
  // 스킬 하나: 실제 전투 화면 길(drawFrame → fieldScene → events → V.mot · V.fx)로 장면을 찍는다
  W.scene = (id, taus, crop) => {
    drawWeather = () => {}; groundWx = () => {};
    S.t = 0.45 * DAY_SEC + DAY_SEC * 3;
    const mkA = (c, i, w) => { const a = makeAdv({ cls: c, lv: 30 }); a.id = 900 + i; a.status = 'away'; a.wxt = null; a.look = { hair: ['#5a3a22', '#2a2a32', '#c87a3a', '#6a4a2a'][i], skin: '#e0ac7e' }; a.eq.weapon = makeGear(w, 2, 0); return a; };
    const war = mkA('warrior', 0, 'sword'); war.eq.off = makeGear('shield', 2, 0);
    const team = [war, mkA('mage', 1, 'staff'), mkA('cleric', 2, 'mace'), mkA('archer', 3, 'bow')];
    S.advs = team.slice();
    if (!S.parties.length) S.parties.push(newParty('1팀', [])); const p = S.parties[0]; p.members = team.map(a => a.id); S.view = p.id; p.pet = null; p.sup = p.sup || {};
    const s = SKILLS[id], ids = s.tgt === 'all' ? ['rat', 'wolf', 'goblin'] : ['wolf'];
    const foes = ids.map((m, i) => { const f = foeFrom(m, 6); f.uid = 50 + i; f.cd = 99; return f; });
    const e = { field: 'plains', area: 'field', stage: 3, pos: 60, mode: 'advance', encs: [60], ei: 0, foes, next: [], ev: [], evN: 0, buffs: [], cd: {}, scd: {}, gcd: {}, sta: {}, kills: 0, bag: {}, gbag: [], log: [], dots: {}, sup: {} };
    p.exp = e; V.mode = ''; V.fx = []; V.fmot = {}; V.fhit = {}; V.mot = {}; V.motLast = {}; V.skSeen = {}; V.shake = 0;
    const t0 = 100, out = []; let pushed = false;
    const [cx, cy, cw, ch] = crop, c = document.createElement('canvas'); c.width = cw; c.height = ch; const g = c.getContext('2d');
    for (let i = 0; i < 3; i++) { const t = t0 - 0.4 + i * 0.04; drawFrame(Math.round(t * 1000), t); }
    for (const tau of taus) {
      if (!pushed && tau >= 0) { pushed = true; let n = e.evN; const push = (type, d) => e.ev.push(Object.assign({ n: ++n, type }, d));
        push('skill', { s: war.id, id });
        if (s.kind === 'dmg') for (const f of foes) for (let h = 0; h < (s.hits || 1); h++) push('hit', { s: war.id, d: f.uid, v: 80 + h * 13, c: false, k: s.fx || 'melee', sid: id });
        else push('buff', { s: war.id, id, party: s.tgt === 'party' });
        e.evN = n; }
      const t = t0 + tau; drawFrame(Math.round(t * 1000), t);
      g.clearRect(0, 0, cw, ch); g.drawImage(V.off, cx, cy, cw, ch, 0, 0, cw, ch); out.push(c.toDataURL());
    }
    const sk = SKFX[id] || {}, mk = sk.mot || MOT_SKILL[id] || 'down', T = motT(mk, sk.hold || 0);
    let hitAt = 0; for (let i = 0; i < pxsMotHit(mk); i++) hitAt += T[i];
    return { frames: out, hitAt, mk, cast: !['dmg', 'mdmg', 'dot'].includes(s.kind) };
  };
  return W;
})();
