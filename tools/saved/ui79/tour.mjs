// 데모 화면 한 바퀴: 첫 화면 · 장소 · 메뉴판 · 모든 창(탭 · 긴 창은 아래로 넘겨 가며) · 전투 → shots/
import { open, sleep } from './cdp.mjs';
import fs from 'node:fs';
const OUT = 'shots'; fs.mkdirSync(OUT, { recursive: true });
const B = await open('file:///C:/Users/wlsdl/AppData/Local/Temp/claude/bf0cecbd3cd9607d/7c79a6ea-5ef1-47ef-8d7e-b2f3accec304/scratchpad/ui79/hook.html');
const L = []; let n = 0;
const E = x => B.ev(`window.__E(${JSON.stringify(x)})`);
async function shot(name, label) { n++; const f = `${OUT}/${String(n).padStart(3, '0')}_${name}.png`; await B.shot(f); L.push([f, label || name]); }
async function win(name, label, code, tabs) {
  try { await E(`S.modals = []; closeModal(); S.modals = []; closeWins(); ${code}`); } catch (e) { console.log('ERR', name, e.message.slice(0, 120)); return; }
  await sleep(450);
  const pages = await B.ev(`(() => { const p = document.getElementById('panel'); return p ? Math.min(4, Math.ceil(p.scrollHeight / p.clientHeight)) : 1; })()`);
  for (let i = 0; i < (pages || 1); i++) {
    await B.ev(`(() => { const p = document.getElementById('panel'); if (p) p.scrollTop = p.clientHeight * ${i} * 0.92; })()`); await sleep(150);
    await shot(name + (i ? '_' + (i + 1) : ''), label + (i ? ` (${i + 1})` : ''));
  }
}
try {
  await shot('title', '첫 화면');
  await B.ev(`document.getElementById('t-sys').click()`); await sleep(600); await shot('title_sys', '첫 화면 · 시스템 설정');
  await B.ev(`(document.querySelector('#t-back')||{click(){}}).click()`); await sleep(300);
  await B.ev(`document.getElementById('t-start').click()`); await sleep(800); await shot('title_new', '첫 화면 · 새 게임');
  await B.ev(`(() => { const i = document.getElementById('t-name'); i.value = '새벽 상단'; i.dispatchEvent(new Event('input', { bubbles: true })); })()`); await sleep(200); await B.ev(`document.getElementById('t-go').click()`); await sleep(3000); await shot('start_modal', '시작 알림');
  // 상태 만들기: 데모 1층 파티 둘 · 시설 · 물건
  console.log(await E(`(() => {
    S.modals = []; closeModal(); S.modals = []; Object.keys(S.flags).forEach(k => { S.flags[k] = S.flags[k] || 1; }); S.gold = 250000; S.rank = 2; S.fame = 300;
    for (const k in BUILDINGS) S.bld[k] = Math.max(S.bld[k] || 0, Math.min(BUILDINGS[k].max, 2));
    const mk = (cls, lv, name) => { const a = makeAdv({ cls, lv, name }); S.advs.push(a); return a; };
    const A = [mk('warrior', 18, '가렌'), mk('archer', 17, '리아'), mk('mage', 16, '세린'), mk('cleric', 16, '노아'), mk('rogue', 15, '케이'), mk('porter', 15, '도르')];
    const p1 = S.parties[0] || newParty('1팀', []); p1.members = [A[0].id, A[1].id, A[2].id, A[3].id];
    if (!S.parties.includes(p1)) S.parties.push(p1);
    for (const k of ['rat_tail', 'wolf_fang', 'boar_hide', 'herb', 'mugwort', 'pot_s', 'bandage', 'f1_ore_chip', 'pf_grain', 'egg_rabbit', 'whetstone', 'hide_0', 'fiber_0', 'wood_0', 'p_hide_0', 'mj_0', 'scr_weapon_atk_60', 'cat_str', 'salt', 'hg_onion', 'mm_boar'].filter(k => ITEMS[k])) S.inv[k] = (S.inv[k] || 0) + 7;
    for (let i = 0; i < 6; i++) S.gear.push(makeGear(dropBase(0), 0, i % 4));
    S.pets = S.pets || []; S.pets.push({ id: nid(), kind: 'rabbit', name: '솜털', lv: 3, exp: 20, aff: 30, q: 1 });
    UI.dirty = true; return S.advs.length + ' advs';
  })()`));
  await E(`closeWins()`); await sleep(500);
  // 장소
  const floors = await E(`Object.values(HQ_ZONES).flatMap(z => z.ids)`);
  for (const f of floors) { try { await E(`S.modals = []; closeModal(); S.modals = []; closeWins(); hqGo(${JSON.stringify(f)}, 1)`); await sleep(700); await shot('place_' + f, '장소 · ' + ((await E(`FLOOR_INFO[${JSON.stringify(f)}] && FLOOR_INFO[${JSON.stringify(f)}].name`)) || f)); } catch (e) { console.log('place', f, e.message.slice(0, 80)); } }
  await E(`S.modals = []; closeModal(); S.modals = []; closeWins(); menuBoard(true)`); await sleep(400); await shot('menu', '메뉴판'); await E(`menuBoard(false)`);
  // 큰 창
  const main = [['co', '길드'], ['fac', '시설'], ['adv', '길드원'], ['map', '지도'], ['exp', '파티'], ['req', '의뢰'], ['achv', '업적'], ['hall', '명예의 전당'], ['assoc', '모험가 협회'], ['gearshop', '협회 장비 상점'], ['potshop', '협회 포션 상점'], ['cook', '요리'], ['port', '항구'], ['raid', '레이드']];
  for (const [id, lb] of main) await win(id, lb, `openWin(${JSON.stringify(id)})`);
  for (const id of ['co_rank', 'co_money', 'co_goal', 'co_king', 'co_league', 'co_log', 'co_relic', 'co_set', 'co_spon', 'co_wx']) await win(id, '길드 · ' + id, `menuSub(${JSON.stringify(id)})`);
  // 창고 탭
  for (const [t, lb] of await E(`INV_CATS`)) await win('inv_' + t, '창고 · ' + lb, `UI.invTab = ${JSON.stringify(t)}; openWin('inv')`);
  await win('inv_pop', '창고 · 칸 정보창', `UI.invTab = 'gear'; openWin('inv'); UI.invPop = 1; UI.invSel = 'g:' + S.gear[0].id; renderPanel(true)`);
  // 모험가 창 탭 (직업마다 하나씩 앞 탭 · 첫 모험가는 모든 탭)
  const tabs = ['sum', 'stat', 'job', 'skill', 'gear', 'etc'];
  for (const t of tabs) await win('advd_' + t, '모험가 창 · ' + t, `UI.advTab = ${JSON.stringify(t)}; openAdv(S.advs[0].id)`);
  for (let i = 1; i < 6; i++) await win('advd_cls' + i, '모험가 창 · 직업 ' + i, `UI.advTab = 'sum'; openAdv(S.advs[${i}].id)`);
  await win('rune', '장비 칸 (룬 · 마석)', `openWin('rune', { gid: (S.advs[0].eq.weapon || S.gear[0]).id, aid: S.advs[0].id })`);
  // 시설 창
  for (const b of await E(`Object.keys(BUILDINGS)`)) await win('b_' + b, '시설 · ' + b, `openWin('b', { b: ${JSON.stringify(b)} })`);
  // 도감 탭
  for (const [t, lb] of await E(`DEX_TABS`)) await win('dex_' + t, '도감 · ' + lb, `UI.dexTab = ${JSON.stringify(t)}; openWin('dex', { tab: ${JSON.stringify(t)} })`);
  // 원정 · 전투
  await E(`closeWins(); const p = S.parties[0]; startExp(p, 'plains'); S.view = p.id; S.speed = 5`); await sleep(9000);
  await shot('field', '필드 (원정 중)');
  await win('battle', '전투 창', `openWin('battle')`);
  await E(`closeWins()`); await sleep(6000); await shot('field2', '필드 (조금 뒤)');
} catch (e) { console.log('STOP', e.message); }
fs.writeFileSync(`${OUT}/list.json`, JSON.stringify(L, null, 1));
console.log('shots', L.length, 'errors', B.errs.length, B.errs.slice(0, 5).map(s => String(s).slice(0, 160)));
B.close(); process.exit(0);
