/* 채찍 · 정글칼 시안 장면 (scene42.js에서): 빌드 42 시안 장면: 실제 view.js 길(events → V.mot·V.fx → motNow·motFx·fx)로 모험가 하나의 공격 하나를 그린다.
   패널 = { cls, wpn, off, mk (이 동작으로), k (맞힘 종류), n (몇 번), sid (스킬), foes (적 수), dot } */
window.SC62 = { team: null, e: null, pos: null, force: null };
const _motPick = motPick;
motPick = (a, sid, i, k) => (SC62.force ? (Array.isArray(SC62.force) ? SC62.force[i % SC62.force.length] : SC62.force) : _motPick(a, sid, i, k));
function sc62Setup(r) {
  if (!S) S = blankState();
  V.fx = []; V.mot = {}; V.motLast = {}; V.skSeen = {}; V.flash = {}; V.flash0 = {}; V.atk = {}; V.jump = {}; V.fall = {}; V.lunge = {}; V.lastN = 0; V.dir = 1; V.shake = 0;
  const a = makeAdv({ cls: r.cls, lv: 60, bio: '시안' }); a.id = 900; a.look = { hair: '#5a3a22', skin: '#e0ac7e' };
  if (r.wpn) a.eq.weapon = GTYPES[r.wpn] ? makeGear(r.wpn, r.t || 3, 0) : { base: r.wpn, t: 3, q: 0, plus: 0, uid: 7100 };   // 채찍 · 정글칼은 아직 GTYPES에 없다
  if (r.wpn === 'whip' || r.wpn === 'machete') { a.eq.off = null; a.eq.ammo = null; }
  if (r.off !== undefined) a.eq.off = r.off ? makeGear(r.off[0], r.off[1], 0) : null;
  a.hp = 100;
  const team = [a]; S.advs = team.slice();
  const ids = ['bandit', 'wolf', 'slime'].slice(0, r.foes || 1), foes = ids.map((m, i) => ({ uid: 50 + i, id: m, hp: 100, maxHp: 100, sc: 0 }));
  const pos = { ['a' + a.id]: SLOT_P[r.slot || 0].slice() };
  foeSlots(foes).forEach(([x, y], i) => { pos['f' + foes[i].uid] = [x, y]; });
  Object.assign(V.last, pos);
  SC62.team = team; SC62.e = { foes, ev: [], evN: 0 }; SC62.pos = pos; SC62.r = r; SC62.force = r.mk || null;
}
function sc62Fire(t) {
  const r = SC62.r, a = SC62.team[0], e = SC62.e, ev = []; let n = 1;
  if (r.sid) ev.push({ n: n++, type: 'skill', s: a.id, id: r.sid });
  if (r.cast) ev.push({ n: n++, type: 'buff', s: a.id, id: r.sid, party: true });
  else for (const f of (r.all ? e.foes : e.foes.slice(0, 1))) for (let h = 0; h < (r.n || 1); h++) ev.push(Object.assign({ n: n++, type: 'hit', s: a.id, d: f.uid, v: 40 + h * 7, c: !!r.crit || (h === (r.n || 1) - 1 && (r.n || 1) > 1), k: r.k || 'melee' }, r.sid ? { sid: r.sid } : { b: 1 }, r.dot ? { dot: 1, v: 0, sid: undefined } : {}));
  e.ev = ev; e.evN = n; V.lastN = 0;
  events(e, SC62.pos, t, SC62.team, { id: 1, name: '1팀', members: [a.id] });
}
function sc62Draw(t, Z, crop) {
  const [cx, cy, cw, ch] = crop, c = document.createElement('canvas'); c.width = cw * Z; c.height = ch * Z;
  const g = c.getContext('2d'); g.imageSmoothingEnabled = false; g.scale(Z, Z);
  const sh = V.shake > 0 ? Math.round((Math.sin(t * 97) * 0.5) * V.shake) : 0; V.shake = Math.max(0, V.shake - 0.4);
  g.translate(-cx + sh, -cy);
  R(g, 0, 0, AW, 200, '#8ab8dc'); R(g, 0, 150, AW, 20, '#9cc4a0'); R(g, 0, 168, AW, 14, '#6aa04e'); R(g, 0, 182, AW, 12, '#a88a5c'); R(g, 0, 194, AW, 12, '#5a8a40');
  for (let i = 0; i < 12; i++) R(g, i * 22 + 6, 160, 2, 8, '#8a6a4a');
  const { team, e, pos } = SC62, dir = 1, post = [], draws = [];
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
};
window.SC62_RUN = (r, taus, Z, crop) => { sc62Setup(r); const t0 = 10, out = []; let fired = false;
  for (const tau of taus) { if (!fired && tau >= 0) { sc62Fire(t0); fired = true; } out.push(sc62Draw(t0 + tau, Z, crop)); }
  return out; };
