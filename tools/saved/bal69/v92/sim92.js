/* 조합 밀기 (빌드 69, 11-14 15:54 사용자 「여러 2차, 3차 직업들을 다 하나씩 조합해보고 벨런스 봐줘, 같은 직업 여럿 넣어서도 가능한 수 전부」)
   window.SW = { lv, fid, st, secs, slv, sm, combos: [[직업, …], …] } — 직업마다 모험가를 한 번 만들어(H.adv: 그 레벨 고급 장비 · 숙련 · 스킬은 그 계열에서 배울 수 있는 것을 높은 레벨부터 칸 수만큼)
   조합마다 복사해 H.push로 그 땅을 처음(st)부터 민다 → [{ c, flv, cl, w, t, tk, dn }] */
(() => {
  const W = window.SW, out = [];
  const pick = (cls, lv) => { const a = makeAdv({ cls, lv }); return Object.keys(SKILLS).filter(id => { const s = SKILLS[id]; return !s.cut && s.cls && chainOf(cls).some(c => s.cls.includes(c)) && (s.lv || 1) <= lv && canLearn(a, id); }).sort((x, y) => (SKILLS[y].lv || 0) - (SKILLS[x].lv || 0)); };
  H.fresh();
  const base = {};
  for (const c of [...new Set(W.combos.flat())]) base[c] = JSON.stringify(H.adv(c, W.lv, { sk: pick(c, W.lv), slv: W.slv, sm: W.sm }));
  for (const combo of W.combos) {
    H.fresh();
    const team = combo.map(c => { const a = JSON.parse(base[c]); a.id = nid(); S.advs.push(a); return a; });
    const r = H.push(team, W.fid, W.st, W.secs);
    out.push({ c: combo, flv: r.flv, cl: r.cleared ? 1 : 0, w: r.wiped ? 1 : 0, t: r.t, tk: Math.round(r.R.taken), dn: r.R.downs });
  }
  return JSON.stringify(out);
})()
