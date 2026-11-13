/* 레이드 원정대 창 시안 — 게임 안 eval. 시뮬레이션을 멈추고 fieldScene을 갈아 끼워 네 파티를 한 무대에 그린다 (시안 전용, 게임 코드 아님) */
(() => {
  const M = window.RMOCK = window.RMOCK || {};
  const COMPS = [
    ['knight', 'berserker', 'sniper', 'priest', 'coachman'],
    ['gladiator', 'assassin', 'archmage', 'archbishop', 'conestoga'],
    ['champion', 'duelist', 'hawkeye', 'plaguedoc', 'bard'],
    ['paladin', 'ninja', 'sorcerer', 'physician', 'caravanmaster'],
  ];
  M.PCOL = ['#f0c24a', '#4ad0c8', '#ff7a9a', '#b08aff'];
  M.setup = () => {
    S.gold = 9e7; S.rank = 5; S.fame = 99999; Object.assign(S.flags, { v65: 1, v64: 1, v63: 1, v63b: 1, v63c: 1, wh63: 1, v67: 1, v68: 1, v68b: 1, v69: 1, v69b: 1 });
    ALL_FIELDS.forEach(f => { if (S.fields[f]) { S.fields[f].cleared = true; S.fields[f].found = true; S.fields[f].best = 40; } });
    S.advs = [];
    M.lanes = COMPS.map(list => list.map(cls => { const a = makeAdv({ cls, lv: 150, name: CLASSES[cls].name }); a.wxt = null; S.advs.push(a); return a; }));
    S.parties = M.lanes.map((L, i) => newParty(`${i + 1}파티`, L.map(a => a.id)));
    S.parties.forEach(formParty);
    S.view = S.parties[0].id;
    // 1파티: 평범한 원정 (원정대 창)
    const p = S.parties[0]; startExp(p, 'desert');
    step = () => {};
    const e = p.exp; e.foes = []; e.next = null; e.encs = [9999]; e.ei = 0; e.pos = 40; e.mode = 'advance';
    S.t = Math.floor(S.t / DAY_SEC) * DAY_SEC + DAY_SEC * 0.45;
    M.fieldExp = e; M.realScene = fieldScene;
    return S.parties.map(q => q.members.length);
  };
  // 레이드 무대: 거인 오른쪽 · 네 파티를 네 줄(가까운 줄이 1파티)로, 줄 안에서는 앞(근접)이 오른쪽
  M.LY = [199, 187, 175, 163];
  M.raidScene = function (w, t, p, e, lights, post, dark, bg) {
    const draws = [], f = e.foes[0], z = giantZ(f), gx = AW - monW(f.id) * z / 2 - 8, gy = 194;
    draws.push({ y: gy, f: g => { g.save(); g.translate(gx, gy); shadowAt(g, 0, 0, Math.min(46, eW(f) * 0.45 * z / ZE)); g.scale(-1, 1); drawMon(g, f.id, t, { ph: 0, z }); g.restore(); } });
    const only = M.only;
    M.lanes.forEach((L, li) => {
      if (only != null && only !== li) return;
      const order = L.slice().sort((a, b) => formRank(a.cls) - formRank(b.cls));
      const y = only != null ? null : M.LY[li];
      const pos = only != null ? formSlots(order) : order.map((a, k) => [Math.round(146 - k * 20 - li * 16), y]);
      order.forEach((a, k) => {
        const [x, yy] = pos[k], zz = zAt(yy), melee = CLASSES[a.cls].act === 'melee', hit = (k + li) % 3 === 0;
        draws.push({ y: yy, f: g => { shadowAt(g, x, yy, (rideKind(a) ? rideShadow(a) : SHADOW_R) * zz / ZS); g.save(); g.translate(x + (hit && melee ? 4 : 0), yy); drawAdv(g, a, t, { walk: false, ph: k * 0.5 + li, atk: hit ? 1 : 0, atkF: hit ? 1 : 0, z: zz, side: 1 }); g.restore(); } });
        if (only != null) post.push(g => { bar(g, x, yy + 3, 18, 0.55 + 0.4 * (((k * 7 + li * 3) % 10) / 10), '#e0503f'); });
      });
      if (only == null) { const fx = Math.round(146 - 4 * 20 - li * 16) - 14, fy = M.LY[li], hp = [0.86, 0.64, 0.92, 0.48][li];   // 줄 끝 깃발: 파티 번호 + 파티 HP 막대 하나
        post.push(g => { R(g, fx, fy - 24, 1, 24, '#3a2a1a'); R(g, fx + 1, fy - 24, 8, 6, M.PCOL[li]); R(g, fx + 1, fy - 18, 4, 1, M.PCOL[li]); drawNum(g, fx + 5, fy - 23, String(li + 1), '#1a1410');
          R(g, fx - 2, fy + 2, 26, 3, '#1a1410'); R(g, fx - 1.5, fy + 2.5, 25 * hp, 2, '#e0503f'); }); }
    });
    if (M.nums) post.push(g => { drawNum(g, 170, 150, '12,480', '#ffd040'); drawNum(g, 196, 132, '8,312', '#ffffff'); drawNum(g, 160, 120, '24,906', '#ffd040'); });
    draws.sort((a, b) => a.y - b.y).forEach(d => d.f(w));
  };
  M.raid = () => {
    S.raid = { list: [newRaid('kingslime')], from: today() };
    const p = S.parties[0], e = newExp('raid_kingslime', {}, 1);
    e.foes = [giantFoe('kingslime')]; e.mode = 'advance'; e.pos = STAGE_LEN * 0.6; e.fought = 1; e.rt = 22; e.dealt = 4.1e6;
    e.foes[0].hp = e.foes[0].maxHp * 0.62;
    p.exp = e; M.raidExp = e; fieldScene = M.raidScene; M.nums = 1;
    return [e.area, e.raid, e.foes[0].name];
  };
  M.field = () => { const p = S.parties[0]; p.exp = M.fieldExp; fieldScene = M.realScene; M.only = null; };
  M.solo = i => { M.only = i; M.nums = 0; };
})();
