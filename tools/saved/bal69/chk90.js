(() => {
  const out = [], bad = [];
  const ids = new Set();
  for (const fid of Object.keys(FIELDS)) { const F = FIELDS[fid]; if (fid.startsWith('trade_') || fid === 'wave' || fid === 'arena' || fid.startsWith('raid_')) continue;
    [...(F.mons || []), ...(F.bosses || []), ...((F.dungeon && F.dungeon.mons) || []), ...(F.dungeon && F.dungeon.boss ? [F.dungeon.boss] : []), ...((F.dungeon && F.dungeon.guards) || [])].forEach(id => ids.add(id)); }
  const bossy = id => MONS[id].boss || Object.values(FIELDS).some(F => (F.bosses || []).includes(id) && !(F.mons || []).includes(id) && !((F.dungeon && F.dungeon.mons) || []).includes(id));
  let n = 0, cnt = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }, hits = { 2: 0, 3: 0 }, sta = {}, sta2 = 0;
  for (const id of ids) {
    const m = MONS[id]; if (!m) { bad.push('no mon ' + id); continue; } n++;
    if (!m.sta) bad.push('no sta ' + id); else { if (!STATUS[m.sta.k]) bad.push('bad sta ' + id); sta[m.sta.k] = (sta[m.sta.k] || 0) + 1; }
    if (m.sta2) { sta2++; if (!STATUS[m.sta2.k]) bad.push('bad sta2 ' + id); sta[m.sta2.k] = (sta[m.sta2.k] || 0) + 1; }
    const L = m.msk || []; cnt[L.length] = (cnt[L.length] || 0) + 1;
    if (bossy(id) && L.length < 4) bad.push(`boss ${id} skills ${L.length}`);
    if (!bossy(id) && L.length < 2) bad.push(`mon ${id} skills ${L.length}`);
    if (bossy(id) && !m.sta2) bad.push('boss no sta2 ' + id);
    L.forEach(s => { if (!s.kind || !s.name) bad.push('bad skill ' + id + ' ' + s.tpl); const st = mskSta(s, { id }); if (st && !STATUS[st.k]) bad.push('bad skill sta ' + id + s.id); });
    if (m.hits) hits[m.hits]++;
    const names = L.map(s => s.name); if (new Set(names).size !== names.length) bad.push('dup skill name ' + id + ' ' + names.join(','));
  }
  out.push(`몬스터 ${n} · 스킬 수 ${JSON.stringify(cnt)} · 연타 ${JSON.stringify(hits)} · 상태이상 둘 ${sta2}`);
  out.push('상태이상: ' + Object.entries(sta).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${STATUS[k].name} ${v}`).join(' · '));
  out.push('문제: ' + (bad.length ? bad.join(' | ') : '없음'));
  // 상한
  H.fresh();
  const rows = [];
  for (const [cls, lv, q] of [['warrior', 12, 1], ['knight', 60, 2], ['hawkeye', 150, 4], ['archmage', 150, 4], ['shadowlord', 200, 5], ['paladin', 150, 4]]) {
    const a = H.adv(cls, lv, { q }), d = derive(a);
    rows.push(`${CLASSES[cls].name} Lv${lv}: 회피 ${(d.eva * 100).toFixed(1)}% 치명 ${(d.crit * 100).toFixed(1)}% 넘침 ${(d.critOver * 100).toFixed(0)}% 치명피해 +${(d.critDmg * 100).toFixed(0)}% 막기 ${(d.block * 100).toFixed(0)}% 반격 ${(d.counter * 100).toFixed(0)}% 마저 ${(d.mres * 100).toFixed(0)}% 공속 ×${d.spd.toFixed(2)} 이동 ${d.move.toFixed(1)}`);
  }
  out.push(rows.join('\n'));
  return out.join('\n');
})()
