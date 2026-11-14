/* 같은 자리 피해 2차 (빌드 69, 11-14): Lv80 기사 · ○ · 마도사 · 사제 파티로 늪지대 900초 두 번. ev83.py h83.js dps92b.js */
(() => {
  const F3 = 'gladiator knight berserker spellblade ranger sniper mhunter huntsman assassin duelist treasure ninja elementalist necromancer sorcerer elemancer priest plaguedoc exorcist'.split(' ');
  const pick = (cls, lv) => { const a = makeAdv({ cls, lv }); return Object.keys(SKILLS).filter(id => { const s = SKILLS[id]; return !s.cut && s.cls && chainOf(cls).some(c => s.cls.includes(c)) && (s.lv || 1) <= lv && canLearn(a, id); }).sort((x, y) => (SKILLS[y].lv || 0) - (SKILLS[x].lv || 0)); };
  const out = [];
  for (const c of F3) {
    let acc = { dealt: 0, bossD: 0, fightT: 0, downs: 0, flv: 0, single: 0 };
    for (let k = 0; k < 2; k++) {
      H.fresh();
      const team = ['knight', c, 'sorcerer', 'priest'].map(x => H.adv(x, 80, { sk: pick(x, 80), slv: 3, sm: 3 }));
      const me = team[1].id; let dealt = 0, bossD = 0, downs = 0, ft = 0;
      const ev0 = ev;
      ev = function (e, t, x) { if (t === 'hit' && x && x.s === me && x.v > 0) { dealt += x.v; const f = e.foes && e.foes.find(o => o.uid === x.d); if (f && (f.boss || f.fb)) bossD += x.v; } if (t === 'down' && x && x.d === me) downs++; return ev0.apply(this, arguments); };
      const r = H.push(team, 'swamp', 1, 900);
      ev = ev0;
      acc.dealt += dealt / 2; acc.bossD += bossD / 2; acc.fightT += r.R.fightT / 2; acc.downs += downs / 2; acc.flv += r.flv / 2;
    }
    out.push([CLASSES[c].name, Math.round(acc.dealt / Math.max(1, acc.fightT)), Math.round(acc.bossD / 1000), acc.downs, acc.flv, Math.round(acc.fightT)]);
  }
  return JSON.stringify(out);
})()
