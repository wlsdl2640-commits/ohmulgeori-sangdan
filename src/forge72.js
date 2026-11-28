/* ───────── 대장간 제작: 시간이 걸리는 장비 제작 · 재료 제작 · 대장장이 셋 (빌드 72 · 11-21 15:20 ~ 15:40 사용자) ─────────
   · 장비는 드랍이 없고 제작(과 구매)으로만 얻는다. 제작은 **현실 시간**으로 걸린다(11-21 15:52 사용자 「현실 시간으로 · 게임을 꺼 둬도 지난 시간이 적용되게」 — job.end = Date.now() 밀리초, 배속과 상관없다). 표의 「시간」 1 = 현실 7.5초(FORGE_SEC).
   · 고유 부속품도 장비 제작에 들어간다 — 전부는 아니다(사용자). FORGE_UNIQ[단계][갈래] = [물건, 개수] (단계 0 평원 · 1 원시림 · 2 깊은 숲 · 3 뿌리굴 — 고른 것은 내 안). 안 쓰는 것(들쥐왕의 왕관 · 식충 꽃 꿀 · 독버섯 포자 · 수호령의 종 · 트렌트의 심장 · 에테르 버섯 갓 · 고룡목의 심장 · 라헨의 옹이 …)은 협회 납품 · 판매용.
   · 재료 제작: 원재료(mat72.js MAT_FAM 열둘) → 가공 재료 p_<갈래>_<등급>. 원재료의 등급을 그대로 물려받는다.
   · 에테르 주괴: 주괴 + 에테르 빛가루 + 마정석. 재료로 쓰는 주괴의 등급이 낮을수록 주괴가 더 많이 든다(FORGE.ether — 사용자).
   · 장비 제작: 가공 재료(장비 종류의 재료 몫 GTYPES.mat [쇠, 가죽, 천] → 주괴 · 무두질한 가죽 · 직물 + 종류마다 덧붙임) + 마정석 + 돈. 재료 등급 = 그 장비 단계의 레벨대(Lv 30마다).
   · 레어도는 무작위 + 대장장이 실력 보너스(사용자). 미궁탑 대장간에는 대장장이가 셋 — 실력이 다르고 화면에 알려 준다. 대장장이마다 한 번에 일 하나. 길드 전용 대장간(대장장이 숙련도)은 나중에.
   · 내 판단 · 임시(사용자 확인 전): 시간 표 FORGE.matH · gearH(채팅에 제시한 안) · 대장장이 이름 · 실력 · 삯 배율 · 재료 개수 · 재료 삯 · 묶음 제작(시간은 개수만큼) · 게임 시간이라 배속을 따르고 꺼 두면 멈춤. */
const FORGE = {
  matH: [1, 2, 4, 8, 12, 24], gearH: [4, 8, 24, 48, 72, 120], etherH: 6,
  raw: { hide: 3, rscale: 3, dscale: 3, fscale: 3, feather: 3, moss: 3, fiber: 3, web: 3, shell: 3, ore: 3, bone: 2, wood: 2 },   // 가공 재료 하나에 드는 원재료
  matFee: [10, 30, 100, 350, 1200, 4000],
  ether: { ingot: [6, 5, 4, 3, 2, 1], dust: 3, mj: 2 },   // 에테르 주괴 하나: 그 등급 주괴 n개 + 에테르 빛가루 3 + 그 등급 마정석 2
  mj: 2
};
const SMITHS = [
  { id: 'doran', name: '도란', title: '수습 대장장이', star: 1, bonus: 0, fee: 1, desc: '삯이 싸다. 품질은 운에 맡긴다.' },
  { id: 'helga', name: '헬가', title: '숙련 대장장이', star: 2, bonus: 0.12, fee: 1.6, desc: '고급 · 희귀 품질이 더 잘 나온다.' },
  { id: 'baldric', name: '발드릭', title: '명장', star: 3, bonus: 0.28, fee: 2.6, desc: '가장 솜씨가 좋다. 희귀가 잘 나오고 드물게 영웅도 나온다.' }
];
const HOUR_SEC = DAY_SEC / 24, FORGE_SEC = 7.5;   // 표의 1 = 현실 7.5초 (예전 게임 1시간과 같은 길이)
const FORGE_UNIQ = {
  0: { melee: ['wolf_fang', 1], bow: ['rabbit_horn', 1], staff: ['rabbit_horn', 1], shield: ['aboar_plate', 1], heavy: ['aboar_plate', 1], leather: ['boar_hide', 1], cloth: ['scare_straw', 3], acc: ['boar_tusk', 1], belt: ['rat_tail', 2] },
  1: { melee: ['beetle_horn', 1], bow: ['vine_thorn', 1], staff: ['stump_ring', 1], shield: ['beetle_shell', 1], heavy: ['beetle_shell', 1], leather: ['bark', 1], cloth: ['spot_cap', 1], acc: ['moss_core', 1], ammo: ['vine_thorn', 1], belt: ['bark', 1] },
  2: { melee: ['root_fang', 1], bow: ['moth_scale', 1], staff: ['ether_crystal', 1], shield: ['old_heartwood', 1], heavy: ['beetle_shell', 2], leather: ['moss_hide', 1], cloth: ['moth_scale', 1], acc: ['ether_crystal', 1], ammo: ['root_fang', 1], belt: ['moss_hide', 1] },
  3: { staff: ['mandrake_root', 1], cloth: ['rot_petal', 1], acc: ['dryad_tear', 1] }
};
function forgeCat(base) {
  const T = GTYPES[base], M = T.mat || [1, 1, 0]; if (T.ammo) return 'ammo'; if (typeof SHIELDS !== 'undefined' && SHIELDS.includes(base)) return 'shield';
  if (T.slot === 'weapon') return T.bow || base === 'bow' || T.icon === 'bow' ? 'bow' : T.icon === 'staff' ? 'staff' : 'melee';
  if (T.slot === 'belt') return 'belt'; if (T.slot === 'acc' || T.slot === 'ear') return 'acc';
  return M[2] > M[1] && M[2] >= M[0] ? 'cloth' : M[0] >= 3 ? 'heavy' : 'leather';
}
const realTxt = h => { const s = Math.round(h * FORGE_SEC); return s < 60 ? `${s}초` : s % 60 ? `${Math.floor(s / 60)}분 ${s % 60}초` : `${s / 60}분`; };
const forgeState = () => { if (!S.forge) S.forge = { jobs: [] }; return S.forge; };
const forgeJobOf = i => forgeState().jobs.find(j => j.sm === i) || null;
const forgeSel = () => { let i = UI.forgeSm | 0; if (i < 0 || i >= SMITHS.length) i = 0; return i; };
const hoursTxt = h => realTxt(h);   // 현실 시간으로 보인다
const gearGrade = t => Math.max(0, Math.min(5, Math.floor((GTIERS[t] ? GTIERS[t].lv : 1) / 30)));
// 장비 한 점의 재료
function forgeNeed(base, t) {
  const T = GTYPES[base], g = gearGrade(t), M = T.mat || [1, 1, 0], n = {}, add = (k, q) => { if (q > 0) n[`p_${k}_${g}`] = (n[`p_${k}_${g}`] || 0) + q; };
  const wood = T.bow || base === 'bow' || T.icon === 'staff' || T.icon === 'bow';
  const U = FORGE_UNIQ[t] && FORGE_UNIQ[t][forgeCat(base)]; if (U && ITEMS[U[0]]) n[U[0]] = U[1];   // 고유 부속품 (그 단계 땅의 몬스터 것)
  if (T.ammo) { add('wood', 1); add('feather', 1); n['mj_' + g] = 1; return n; }
  add(wood ? 'wood' : 'ore', M[0]); add('hide', M[1]); add('fiber', M[2]);
  if (T.bow || base === 'bow' || T.icon === 'bow') add(g === 0 ? 'fiber' : 'web', 1);   // 11-28 대표님: 0단계 활시위는 거미실 대신 짚 섬유(1층에 거미가 없다)
  else if (T.slot === 'weapon' && !wood) add('bone', 1);
  if (typeof SHIELDS !== 'undefined' && SHIELDS.includes(base)) add('wood', 1);
  n['mj_' + g] = FORGE.mj; return n;
}
const forgeGearH = t => FORGE.gearH[gearGrade(t)];
const forgeGearFee = (t, sm) => Math.round(smithFee(t, 0) * SMITHS[sm].fee / 10) * 10;
function forgeGearWhy(base, t, lv, sm) {
  if (!GTYPES[base] || !smithTierOk(base, t, lv)) return '그 단계에는 없는 장비예요.';
  if (S.bld.smithy < smithLv(t, 0)) return `대장간 Lv${smithLv(t, 0)}이 있어야 해요.`;
  if (forgeJobOf(sm)) return `${SMITHS[sm].name}은(는) 지금 다른 일을 하고 있어요.`;
  const need = forgeNeed(base, t), miss = Object.entries(need).find(([k, q]) => (S.inv[k] || 0) < q);
  if (miss) return `${ITEMS[miss[0]].name}이(가) 모자라요 (${S.inv[miss[0]] || 0}/${miss[1]}).`;
  if (S.gold < forgeGearFee(t, sm)) return '돈이 모자라요.';
  return '';
}
function forgeStart(job, need, fee) {
  Object.entries(need).forEach(([k, q]) => addTo(S.inv, k, -q)); S.gold -= fee; S.stats.spent = (S.stats.spent || 0) + fee;
  job.t0 = Date.now(); job.end = job.t0 + job.h * FORGE_SEC * 1000; job.rt = 1; forgeState().jobs.push(job); changed();
}
function forgeGear(base, t, lv) {
  const sm = forgeSel(), w = forgeGearWhy(base, t, lv, sm); if (w) return w;
  const g = { base, t, q: 0, lv }, cat = typeof catSel === 'function' ? catSel() : '', need = forgeNeed(base, t); if (cat) need[cat] = (need[cat] || 0) + 1;   // 빌드 78: 촉매 (scroll78.js)
  forgeStart({ sm, kind: 'gear', base, t, lv: lv || 0, h: forgeGearH(t), name: gearName(g), cat }, need, forgeGearFee(t, sm));
  return `${SMITHS[sm].name}에게 ${gearName(g)} 제작을 맡겼다. (${hoursTxt(forgeGearH(t))})`;
}
// 재료 제작
const forgeMatMax = (k, g) => Math.floor((S.inv[`${k}_${g}`] || 0) / FORGE.raw[k]);
function forgeMatWhy(k, g, n, sm) {
  if (!S.bld.smithy) return '대장간이 있어야 해요.'; if (forgeJobOf(sm)) return `${SMITHS[sm].name}은(는) 지금 다른 일을 하고 있어요.`;
  if (n < 1 || forgeMatMax(k, g) < n) return `${ITEMS[`${k}_${g}`].name}이(가) 모자라요.`;
  if (S.gold < FORGE.matFee[g] * n) return '돈이 모자라요.'; return '';
}
function forgeMat(k, g, n) {
  const sm = forgeSel(), w = forgeMatWhy(k, g, n, sm); if (w) return w; const out = `p_${k}_${g}`;
  forgeStart({ sm, kind: 'mat', out, n, h: FORGE.matH[g] * n, name: `${ITEMS[out].name} ${n}개` }, { [`${k}_${g}`]: FORGE.raw[k] * n }, FORGE.matFee[g] * n);
  return `${SMITHS[sm].name}에게 ${ITEMS[out].name} ${n}개를 맡겼다. (${hoursTxt(FORGE.matH[g] * n)})`;
}
const etherNeed = (g, n) => ({ [`p_ore_${g}`]: FORGE.ether.ingot[g] * n, ether_dust: FORGE.ether.dust * n, ['mj_' + g]: FORGE.ether.mj * n });
function forgeEtherWhy(g, n, sm) {
  if (forgeJobOf(sm)) return `${SMITHS[sm].name}은(는) 지금 다른 일을 하고 있어요.`;
  const miss = Object.entries(etherNeed(g, n)).find(([k, q]) => (S.inv[k] || 0) < q); if (miss) return `${ITEMS[miss[0]].name}이(가) 모자라요 (${S.inv[miss[0]] || 0}/${miss[1]}).`; return '';
}
function forgeEther(g, n) {
  const sm = forgeSel(), w = forgeEtherWhy(g, n, sm); if (w) return w;
  forgeStart({ sm, kind: 'mat', out: 'ether_ingot', n, h: FORGE.etherH * n, name: `에테르 주괴 ${n}개` }, etherNeed(g, n), 0);
  return `${SMITHS[sm].name}에게 에테르 주괴 ${n}개를 맡겼다. (${hoursTxt(FORGE.etherH * n)})`;
}
// 다 된 일 받기 (econ.js stepWorld가 틱마다)
function forgeTick() {
  if (!S || !S.forge || !S.forge.jobs.length) return;
  for (const j of S.forge.jobs.slice()) {
    if (j.rt && Date.now() < j.end) continue; const sm = SMITHS[j.sm] || SMITHS[0];
    if (j.kind === 'gear') {
      if (!roomGear(1)) { if (!j.warn) { j.warn = 1; HOOKS.toast('창고가 꽉 차서 다 만든 장비를 못 받아요'); } continue; }
      const bq = sm.bonus + 0.02 * (S.bld.smithy || 0) + (relic('smith') ? 0.05 : 0), g = makeGear(j.base, j.t, rollQuality(j.cat ? bq * CAT78_Q + 0.02 : bq), j.lv); if (j.cat) catBonus(g, j.cat); S.gear.push(g);   // 빌드 78: 촉매 — 희귀 이상 조금 더 · 그 능력치
      log(`${sm.title} ${sm.name}이(가) ${QUALITY[g.q].name} 「${gearName(g)}」을(를) 완성했다.`, g.q ? 'good' : ''); HOOKS.toast(`${sm.name}: ${QUALITY[g.q].name} ${gearName(g)} 완성`);
    } else {
      if (!roomItem(j.out)) { if (!j.warn) { j.warn = 1; HOOKS.toast('창고가 꽉 차서 다 만든 재료를 못 받아요'); } continue; }
      addTo(S.inv, j.out, j.n); log(`${sm.name}이(가) ${ITEMS[j.out].name} ${j.n}개를 완성했다.`, 'good'); HOOKS.toast(`${sm.name}: ${ITEMS[j.out].name} ${j.n}개 완성`);
    }
    S.forge.jobs.splice(S.forge.jobs.indexOf(j), 1); changed();
  }
}
// 화면: 대장장이 셋 (고르기 · 실력 · 하는 일)
function forgeSmithBox() {
  const sel = forgeSel();
  return `<div class="smiths">${SMITHS.map((s, i) => { const j = forgeJobOf(i), left = j ? Math.max(0, (j.end - Date.now()) / 1000 / FORGE_SEC) : 0, pc = j ? Math.max(0, Math.min(100, (Date.now() - j.t0) / Math.max(1, j.end - j.t0) * 100)) : 0;
    return `<button type="button" class="smith${i === sel ? ' on' : ''}" data-act="forgesm" data-i="${i}"><b>${s.name}</b><small>${s.title}</small><span class="stars">${'★'.repeat(s.star)}${'☆'.repeat(3 - s.star)}</span><small class="muted">삯 ×${s.fee}</small>${j ? `<span class="job"><i style="width:${pc.toFixed(0)}%"></i></span><small class="gold-t">${esc(j.name)} · ${hoursTxt(left)} 남음</small>` : '<small class="ok-t">쉬는 중</small>'}</button>`; }).join('')}</div>
    <div class="sub muted">${SMITHS[sel].title} ${SMITHS[sel].name}: ${SMITHS[sel].desc} 대장장이마다 한 번에 일 하나를 맡아요.</div>`;
}
function forgeMatBox() {
  const sm = forgeSel(), busy = !!forgeJobOf(sm), rows = [];
  for (const k of MAT_FAMS) for (let g = 0; g < 6; g++) {
    const raw = `${k}_${g}`, out = `p_${k}_${g}`, have = S.inv[raw] || 0; if (!have && !(S.inv[out] > 0)) continue; const mx = forgeMatMax(k, g);
    const btn = n => `<button type="button" class="btn sm${n > 1 ? '' : ' gold'}" data-act="forgemat" data-k="${k}" data-g="${g}" data-n="${n}"${busy || mx < n || S.gold < FORGE.matFee[g] * n ? ' disabled' : ''}>${n}개</button>`;
    rows.push(`<div class="li">${iconImg(out)}<div class="grow stack"><span>${ITEMS[out].name} <b class="num">×${S.inv[out] || 0}</b></span><span class="sub">${iconImg(raw)} ${ITEMS[raw].name} <span class="${have >= FORGE.raw[k] ? '' : 'red-t'}">${have}/${FORGE.raw[k]}</span> · ${fmt(FORGE.matFee[g])}G · 개당 ${hoursTxt(FORGE.matH[g])}</span></div><div class="btns">${btn(1)}${mx >= 5 ? btn(5) : ''}${mx >= 10 ? btn(10) : ''}</div></div>`);
  }
  const eth = [0, 1, 2, 3, 4, 5].filter(g => (S.inv[`p_ore_${g}`] || 0) > 0).map(g => { const nd = etherNeed(g, 1), w = forgeEtherWhy(g, 1, sm);
    return `<div class="li">${iconImg('ether_ingot')}<div class="grow stack"><span>에테르 주괴 <span class="muted">· ${MJ_GRADES[g]} 주괴로</span></span><span class="sub">${needStr(nd)} · ${hoursTxt(FORGE.etherH)}</span></div><button type="button" class="btn sm gold" data-act="forgeether" data-g="${g}"${w ? ' disabled' : ''}>만들기</button></div>`; }).join('');
  return `<div class="sec" style="margin-top:6px"><b>재료 제작</b><span>원재료를 가공해요 · 등급은 그대로</span></div><div class="list">${rows.join('') || '<div class="li"><span class="sub">가공할 원재료가 없어요. 짐꾼이 갈무리해 온 가죽 · 뼈 · 광물 같은 재료가 여기 나와요.</span></div>'}</div>
    <div class="sec"><b>에테르 주괴</b><span>가진 ${S.inv.ether_ingot || 0}개 · 낮은 등급 주괴일수록 많이 들어요</span></div><div class="list">${eth || '<div class="li"><span class="sub">주괴가 있어야 해요. (광물 → 주괴 → 에테르 주괴)</span></div>'}</div>`;
}
Object.assign(ACT, {
  forgesm: d => { UI.forgeSm = +d.i; },
  forgemat: d => say(forgeMat(d.k, +d.g, +d.n)),
  forgeether: d => say(forgeEther(+d.g, 1)),
  smith: d => say(forgeGear(d.b, +d.t, +d.lv || 0))
});
