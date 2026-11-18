// 변종 시안의 바탕 그림 뽑기 (시험 묶음 아님): 훅 페이지(dist/play.html에 window.__EV를 넣은 사본)에서 이 식을 eval → JSON 한 줄 → t/px_base_lab1.json
// PXU[id] 그대로 + _act(그 몬스터 동작 갈래, 모습 id면 기본 id 것) + _mon(MONS 몸 색). 다른 몬스터를 바탕으로 쓰려면 아래 목록에 id를 더한다.
(() => JSON.stringify(Object.fromEntries(['rat', 'sewerrat', 'golem', 'golem_b', 'golem_c'].map(id => [id, Object.assign({}, PXU[id], { _act: PXU_ACT[id] || PXU_ACT[id.replace(/_[bc]$/, '')] || null, _mon: { body: MONS[id] ? MONS[id].body : null, dark: MONS[id] ? MONS[id].dark : null, skin: MONS[id] ? MONS[id].skin : null } })]))))()
