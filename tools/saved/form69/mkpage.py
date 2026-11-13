"""대형 시안 페이지: play_ev86b.html(빌드 69 + window.__EV)에 새 대형(근접 맨 앞 셋 · 원거리 가운데 · 힐러 뒤 · 짐꾼 맨 뒤)을 덮어쓴 사본"""
import sys
SP = '/tmp/claude-0/-home-claude/4368c869-ae47-5efb-8102-510605121dd4/scratchpad'
s = open(SP + '/v86/play_ev86b.html', encoding='utf-8').read()
old_rank = "const formRank = c => { const C = CLASSES[c]; if (!C) return 2; if (C.row != null) return C.row; return C.act === 'melee' ? 0 : C.act === 'arrow' ? 1 : 2; };"
new_rank = r"""const formRank = c => { const C = CLASSES[c]; if (!C) return 2; if (jobBase(c) === 'porter') return 3; if (C.act === 'heal') return 2; return C.act === 'melee' ? 0 : 1; };
// 대형 시안 (11-13 21:22): 줄 0 맨 앞 근접(셋까지, 넷째부터 가운데 줄 맨 앞) · 1 가운데 원거리 · 2 뒤 힐러 · 3 맨 뒤 짐꾼 계열 · 4 들것. 빈 줄은 앞으로 당긴다
const FORM_X = [124, 97, 71, 46, 22];
const FORM_Y = { 1: [192], 2: [197, 185], 3: [199, 189, 179], 4: [199, 192, 185, 178], 5: [199, 193, 187, 181, 175] };
function formSlots(team) {
  const cols = [[], [], [], [], []];
  team.forEach((a, i) => { let r = a.down ? 4 : formRank(a.cls); if (r === 0 && cols[0].length >= 3) r = 1; cols[r].push(i); });
  cols.forEach(L => L.sort((i, j) => (rideKind(team[i]) ? 1 : 0) - (rideKind(team[j]) ? 1 : 0) || i - j));   // 탈것은 그 줄 맨 뒤 칸(멀리)에
  const out = []; let ci = 0;
  for (let r = 0; r < 5; r++) { const L = cols[r]; if (!L.length) continue; const x0 = FORM_X[ci++], ys = FORM_Y[Math.min(5, L.length)];
    L.forEach((ti, k) => { const y = ys[Math.min(k, ys.length - 1)]; out[ti] = [Math.round(x0 - (199 - y) * 0.7), y]; }); }
  return out;
}"""
assert s.count(old_rank) == 1; s = s.replace(old_rank, new_rank)
old_pos = "  team.forEach((a, i) => { const [x, y] = SLOT_P[Math.min(SLOT_P.length - 1, i)], q = pos['a' + a.id] = [mx(x), y]"
new_pos = "  const FS = formSlots(team); team.forEach((a, i) => { const [x, y] = FS[i], q = pos['a' + a.id] = [mx(x), y]"
assert s.count(old_pos) == 1; s = s.replace(old_pos, new_pos)
old_pet = "  if (pet) pos['aP' + pet.id] = n > 6 ? [mx(8), 199] : [mx(34), 197];"
assert s.count(old_pet) == 1; s = s.replace(old_pet, "  if (pet) pos['aP' + pet.id] = [mx(10), 199];")
open(SP + '/v87/form/play_form.html', 'w', encoding='utf-8').write(s)
print('ok')
