/* ───────── 의상(코스튬)과 스킬 숙련도 ─────────
   의상은 한 번 사면 상단의 모든 모험가가 입을 수 있다. pal은 직업 도안의 색만 바꾸고, head가 있으면 머리 장식까지 바꾼다. */
const COSTUMES = {
  night:   { name: '밤그림자', price: 1500,  desc: '검푸른 천에 은빛 장식. 밤 원정에 잘 어울려요.',
    pal: { c1: '#2c2a44', c2: '#9aa0c0', c3: '#c8ccdc', hc: '#242236', metal: '#8a92a8', cape: '#1c1a2c', pants: '#2a2838', boots: '#1e1c28', leather: '#3a3448', gold: '#c0c8d8' } },
  crimson: { name: '진홍',     price: 2500,  desc: '붉은 천에 금실 자수. 상단의 자랑.',
    pal: { c1: '#a82a2a', c2: '#f2c444', c3: '#ffd86a', hc: '#8a2020', metal: '#d8b45a', cape: '#6a1818', pants: '#4a2a2a', boots: '#3a2020', leather: '#6a3a2a' } },
  forest:  { name: '숲지기',   price: 2500,  desc: '이끼빛 옷. 숲에서는 눈에 잘 띄지 않아요.',
    pal: { c1: '#4a7a3a', c2: '#a8884a', c3: '#d8c070', hc: '#3a6a30', metal: '#8a9a7a', cape: '#2e4e26', pants: '#4e4634', boots: '#4a3220', leather: '#6a4e30' } },
  pumpkin: { name: '호박 머리', price: 4000,  desc: '속을 파낸 호박을 뒤집어썼어요. 밤에 보면 조금 무서워요.', head: 'pumpkin',
    pal: { hc: '#e8862a', c1: '#3a4a2a', c2: '#5a8a3a', c3: '#c8a040', cape: '#2a3620', pants: '#3a3428', boots: '#2a2420', leather: '#5a4428' } },
  white:   { name: '백야',     price: 6000,  desc: '눈처럼 흰 옷에 금빛 장식. 때가 잘 타요.',
    pal: { c1: '#f0ece0', c2: '#f2c444', c3: '#f8e0a0', hc: '#f4f0e6', metal: '#e0e0ea', cape: '#e8e4d8', pants: '#d8d4c8', boots: '#a08a5a', leather: '#c8b080', gold: '#f8d860' } },
  bones:   { name: '해골 가면', price: 8000,  desc: '뼈로 만든 가면과 검은 옷. 적이 먼저 움찔해요.', head: 'bones',
    pal: { c1: '#3a3a40', c2: '#c8c0a8', c3: '#8a3030', hc: '#f4f0e6', metal: '#8a8a90', cape: '#1e1e26', pants: '#2a2a30', boots: '#1e1e22', leather: '#4a4448', gold: '#c8c0a8' } },
  royal:   { name: '왕실 예복', price: 12000, desc: '왕궁에서 내린 보라 예복과 금관. 왕국 상인 자격.', head: 'crown',
    pal: { c1: '#6a3aa8', c2: '#f2c444', c3: '#ffe08a', hc: '#f2c444', metal: '#f2c444', cape: '#a82a3a', pants: '#3a2a4a', boots: '#4a3220', leather: '#8a6a3a', gold: '#f8d860' } }
};
const COSTUME_IDS = Object.keys(COSTUMES);

/* 스킬 숙련도: 원정에서 스킬을 쓴 횟수로 오른다. 한 단계마다 위력 +3% (5단계 +15%) */
const SM_STEPS = [0, 60, 180, 440, 960, 1920];
const SM_MAX = SM_STEPS.length - 1;
function smUses(a, id) { return (a.sm && a.sm[id]) || 0; }
function smLv(a, id) { const n = smUses(a, id); let lv = 0; while (lv < SM_MAX && n >= SM_STEPS[lv + 1]) lv++; return lv; }
function smMul(a, id) { return 1 + 0.03 * smLv(a, id); }
