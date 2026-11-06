/* 빌드 42 스킬 시안: 실제 view.js 길로 스킬 하나 (skill → hit·heal·buff 사건). 파티 [시전자, 성직자, 궁수] · 적 1~3 */
window.SS = { team: null, e: null, pos: null };
function ssSetup(id, cls, wpn) {
  if (!S) S = blankState();
  V.fx = []; V.mot = {}; V.motLast = {}; V.skSeen = {}; V.flash = {}; V.flash0 = {}; V.atk = {}; V.jump = {}; V.fall = {}; V.lunge = {}; V.lastN = 0; V.dir = 1; V.shake = 0;
  const mk = (c, i, w) => { const a = makeAdv({ cls: c, lv: 60 }); a.id = 900 + i; a.look = { hair: ['#5a3a22', '#2a2a32', '#c87a3a'][i % 3], skin: '#e0ac7e' }; if (w) a.eq.weapon = makeGear(w, 4, 0); a.hp = 100; return a; };
  const a = mk(cls, 0, wpn), b = mk('cleric', 1), c = mk('archer', 2);
  const team = [a, b, c]; S.advs = team.slice();
  const s = SKILLS[id], all = s && s.tgt === 'all', ids = all ? ['bandit', 'wolf', 'slime'] : ['bandit'];
  const foes = ids.map((m, i) => ({ uid: 50 + i, id: m, hp: 100, maxHp: 100, sc: 0 }));
  const pos = {}; team.forEach((x, i) => { pos['a' + x.id] = SLOT_P[i].slice(); });
  foeSlots(foes).forEach(([x, y], i) => { pos['f' + foes[i].uid] = [x, y]; });
  Object.assign(V.last, pos);
  SS.team = team; SS.e = { foes, ev: [], evN: 0 }; SS.pos = pos; SS.id = id;
}
function ssCast(t) {
  const id = SS.id, s = SKILLS[id], a = SS.team[0], e = SS.e, ev = []; let n = 1;
  ev.push({ n: n++, type: 'skill', s: a.id, id });
  const tg = s.tgt === 'all' ? e.foes : [e.foes[0]];
  if (s.kind === 'dmg' || s.kind === 'mdmg') { const magic = s.kind === 'mdmg'; for (const f of tg) for (let h = 0; h < (s.hits || 1); h++) ev.push({ n: n++, type: 'hit', s: a.id, d: f.uid, v: 80 + h * 13, c: h === (s.hits || 1) - 1 && (s.hits || 1) > 1, k: s.fx || (magic ? 'magic' : CLASSES[a.cls].act === 'arrow' ? 'arrow' : 'melee'), sid: id }); }
  else if (s.kind === 'dot') for (const f of tg) ev.push({ n: n++, type: 'hit', s: a.id, d: f.uid, v: 0, k: s.fx || 'melee', dot: 1 });
  else if (s.kind === 'heal' || s.kind === 'regen') (s.tgt === 'party' ? SS.team : [SS.team[1]]).forEach(m => ev.push({ n: n++, type: 'heal', s: a.id, d: m.id, v: 120 }));
  else if (s.kind === 'revive') ev.push({ n: n++, type: 'revive', s: a.id, d: SS.team[2].id });
  else ev.push({ n: n++, type: 'buff', s: a.id, id, party: s.tgt === 'party' });
  e.ev = ev; e.evN = n; V.lastN = 0;
  events(e, SS.pos, t, SS.team, { id: 1, name: '1팀', members: SS.team.map(x => x.id) });
}
function ssDraw(t, Z, crop) {
  const [cx, cy, cw, ch] = crop, c = document.createElement('canvas'); c.width = cw * Z; c.height = ch * Z;
  const g = c.getContext('2d'); g.imageSmoothingEnabled = false; g.scale(Z, Z);
  const sh = V.shake > 0 ? Math.round((Math.sin(t * 97) * 0.5) * V.shake) : 0; V.shake = Math.max(0, V.shake - 0.4);
  g.translate(-cx + sh, -cy);
  R(g, 0, 0, AW, 200, '#8ab8dc'); R(g, 0, 150, AW, 20, '#9cc4a0'); R(g, 0, 168, AW, 14, '#6aa04e'); R(g, 0, 182, AW, 12, '#a88a5c'); R(g, 0, 194, AW, 12, '#5a8a40');
  for (let i = 0; i < 12; i++) R(g, i * 22 + 6, 160, 2, 8, '#8a6a4a');
  const { team, e, pos } = SS, dir = 1, post = [], draws = [];
  e.foes.forEach((f, i) => { const [x, y] = pos['f' + f.uid], z = zAt(y);
    draws.push({ y, f: g2 => { g2.save(); g2.translate(x, y); shadowAt(g2, 0, 0, Math.min(46, eW(f) * 0.45 * z / ZE)); g2.scale(-dir, 1);
      FLASH = (V.flash['f' + f.uid] || 0) > t && (V.flash0['f' + f.uid] || 0) <= t ? '#ffffff' : null; drawMon(g2, f.id, t, { ph: i * 0.37, sc: f.sc, z }); FLASH = null; g2.restore(); } }); });
  team.forEach((a, i) => { const [x0, y0] = pos['a' + a.id], z = zAt(y0);
    const at = V.atk['a' + a.id], lunging = at && t - at < 0.26, atkF = lunging ? (t - at < 0.08 ? 0 : 1) : 0, melee = CLASSES[a.cls].act === 'melee';
    const jt = V.jump['a' + a.id], jy = jt && t >= jt && t - jt < 0.4 ? -Math.round(Math.sin((t - jt) / 0.4 * Math.PI) * 14) : 0;
    const mo = motNow(a, t), mF = mo && pxsMotFr(mo.mk, mo.f), msk = mo && mo.sk && SKFX[mo.sk], dashK = msk && msk.dash && mo.f >= 3 && mo.f <= 6 ? 1.8 : 1;
    const mjy = mo ? Math.round(motJy(mo) * 2 * z) : 0;
    const dx = ((mo ? mF.dx * 2 * z * dashK : lunging && melee && atkF ? 8 : 0) + (jy ? 10 : 0)) * dir, y = y0 + jy + mjy;
    if (mo) post.push(g2 => motFx(g2, a, mo, x0 + ((jy ? 10 : 0) + (dashK > 1 ? mF.dx * 2 * z * (dashK - 1) : 0)) * dir, y, z, dir, t));
    draws.push({ y: y0, f: g2 => { shadowAt(g2, x0 + dx, y0, (jy || mjy < -4 ? 7 : SHADOW_R) * z / ZS); if (msk) skGhosts(g2, a, mo, msk, x0 + dx, y, z, dir, t);
      g2.save(); g2.translate(x0 + dx, y); g2.scale(dir, 1); drawAdv(g2, a, t, { ph: i * 0.5, atk: lunging && !mo, atkF, mot: mo, z, side: 1 }); g2.restore(); } });
  });
  draws.sort((p, q) => p.y - q.y).forEach(d => d.f(g));
  for (const f of post) f(g);
  fx(g, t);
  return c.toDataURL();
}
window.SS_RUN = (id, cls, wpn, taus, Z, crop) => { ssSetup(id, cls, wpn); const t0 = 10, out = []; let cast = false;
  for (const tau of taus) { if (!cast && tau >= 0) { ssCast(t0); cast = true; } out.push(ssDraw(t0 + tau, Z, crop)); }
  return out; };
window.SS_INFO = () => ({ n: Object.keys(SKFX).length, auto: Object.values(SKFX).filter(x => x.auto).length });
