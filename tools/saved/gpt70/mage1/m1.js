/* 마법사 1차 참고 판 — 실제 게임 그리기 함수로 지금 그림(뭉툭 도트)의 생김새 · 동작을 뽑는다 (전사 때 ../warrior1/w96.js와 같은 길) */
window.M1 = (() => {
  const W = {};
  const spr = s => ({ u: s.cv.toDataURL(), w: s.w, h: s.h, ax: s.ax, ay: s.ay });
  W.mk = () => { const a = makeAdv({ cls: 'mage', lv: 1 }); a.id = 901; a.name = '마법사'; a.look = { hair: '#5a3a22', skin: '#e0ac7e' }; a.traits = []; a.eq.weapon = makeGear('staff', 0, 0); a.eq.off = null; return a; };
  W.look = () => { const a = W.mk(), out = { side: {}, front: {} };
    for (const [pose, n] of [['idle', 2], ['walk', 4], ['sit', 1], ['sleep', 1], ['down', 1]]) for (let f = 0; f < n; f++) {
      try { out.side[pose + f] = spr(pxsAdvSprite(a, pose, f)); } catch (err) { out.side[pose + f] = { err: String(err) }; }
      try { out.front[pose + f] = spr(pxAdvSprite(a, pose, f)); } catch (err) { out.front[pose + f] = { err: String(err) }; }
    }
    return out; };
  W.mots = () => { const a = W.mk(), fam = pxsFam(a), MK = Array.from(new Set([...(MOT_OWN[fam] || []), ...(MOT_POOL[fam] || [])])), out = { fam, mk: {} };
    for (const mk of MK) { const T = pxsMotT(mk); out.mk[mk] = { T, hit: pxsMotHit(mk), f: [] };
      for (let f = 0; f < T.length; f++) { const s = pxsAdvSprite(a, 'm:' + mk, f), F = pxsMotFr(mk, f); out.mk[mk].f.push(Object.assign(spr(s), { dx: F.dx || 0, jy: F.jy || 0 })); } }
    return out; };
  W.info = () => { const a = W.mk(), L = (typeof PXL !== 'undefined' && PXL.mage) || {}; return { cls: CLASSES.mage.name, desc: CLASSES.mage.desc, wpn: gearName(a.eq.weapon), look: L, pool: MOT_POOL[pxsFam(a)], own: MOT_OWN[pxsFam(a)], poolK: (typeof MOT_POOL_K !== 'undefined' ? MOT_POOL_K[pxsFam(a)] : null) }; };
  return W;
})();
