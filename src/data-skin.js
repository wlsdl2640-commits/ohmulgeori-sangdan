/* 스킬 숙련도: 원정에서 스킬을 쓴 횟수로 오른다. 한 단계마다 위력 +3% (5단계 +15%) */
const SM_STEPS = [0, 60, 180, 440, 960, 1920];
const SM_MAX = SM_STEPS.length - 1;
function smUses(a, id) { return (a.sm && a.sm[id]) || 0; }
function smLv(a, id) { const n = smUses(a, id); let lv = 0; while (lv < SM_MAX && n >= SM_STEPS[lv + 1]) lv++; return lv; }
function smMul(a, id) { return 1 + 0.03 * smLv(a, id); }
