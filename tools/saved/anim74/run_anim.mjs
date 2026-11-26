// 사제(여) 동작(pri_v1) — anim73/run_anim.mjs에서: 씨앗 · 처음 자세 · 동쪽 · 끝 장은 있을 때만. 픽셀랩 animate_image_pixminimax를 jobs_in.json대로 차례로 돌려 프레임을 받는다(동시에 N개).
// node run_anim.mjs [동시 수=6]   — 토큰은 ~/.claude.json의 pixellab MCP 설정에서 읽어 이 프로세스 안에서만 쓴다(화면 · 파일에 안 남김).
// 결과: <mon>/<row>/00.png … (00 = 입력 첫 장, 01 ~ = 새 장) · jobs_done.json(작업 번호 · 상태) · log.txt
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
const H = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'));
const N = +process.argv[2] || 6;
const cfg = JSON.parse(fs.readFileSync(path.join(os.homedir(), '.claude.json'), 'utf8')).mcpServers.pixellab;
const MCP = cfg.url, AUTH = cfg.headers.Authorization;
const J = JSON.parse(fs.readFileSync(path.join(H, 'jobs_in.json'), 'utf8'));
const DONE_F = path.join(H, 'jobs_done.json');
const done = fs.existsSync(DONE_F) ? JSON.parse(fs.readFileSync(DONE_F, 'utf8')) : {};
const log = s => { const l = `[${new Date().toLocaleTimeString('ko-KR')}] ${s}`; console.log(l); fs.appendFileSync(path.join(H, 'log.txt'), l + '\n'); };
const save = () => fs.writeFileSync(DONE_F, JSON.stringify(done, null, 1));
const sleep = ms => new Promise(r => setTimeout(r, ms));
let sid = null, rid = 1;
async function rpc(method, params, notify = false) {
  const h = { 'Content-Type': 'application/json', Accept: 'application/json, text/event-stream', Authorization: AUTH };
  if (sid) h['Mcp-Session-Id'] = sid;
  const body = notify ? { jsonrpc: '2.0', method, params } : { jsonrpc: '2.0', id: rid++, method, params };
  const r = await fetch(MCP, { method: 'POST', headers: h, body: JSON.stringify(body) });
  if (r.headers.get('mcp-session-id')) sid = r.headers.get('mcp-session-id');
  const t = await r.text();
  if (notify) return null;
  const m = t.match(/^data: (.*)$/m); const j = JSON.parse(m ? m[1] : t);
  if (j.error) throw new Error(JSON.stringify(j.error).slice(0, 300));
  return j.result;
}
async function init() {
  await rpc('initialize', { protocolVersion: '2025-03-26', capabilities: {}, clientInfo: { name: 'por_v1', version: '1' } });
  await rpc('notifications/initialized', {}, true);
}
async function submit(j) {
  const res = await rpc('tools/call', { name: 'animate_image_pixminimax', arguments: {
    description: j.desc, first_frame_url: j.first, ...(j.last ? { last_frame_url: j.last } : {}), frame_count: j.frames, view: 'side', direction: j.dir || 'east', subject_description: j.subject, initial_pose: j.pose, seed: j.seed } });
  const txt = (res.content || []).map(c => c.text || '').join('\n');
  const id = (txt.match(/job_id: ([0-9a-f-]{36})/) || [])[1];
  if (!id) throw new Error('작업 번호 없음: ' + txt.slice(0, 300));
  return id;
}
async function fetchFrames(id, dir, n) {
  fs.mkdirSync(dir, { recursive: true });
  for (let t = 0; t < 120; t++) {   // 최대 20분
    const r = await fetch(`https://api.pixellab.ai/mcp/images/${id}/download?index=0`);
    if (r.status === 200) break;
    if (r.status !== 423) { const tx = await r.text(); throw new Error(`받기 ${r.status} ${tx.slice(0, 200)}`); }
    await sleep(10000);
  }
  for (let i = 0; i <= n; i++) {
    const r = await fetch(`https://api.pixellab.ai/mcp/images/${id}/download?index=${i}`);
    if (r.status !== 200) throw new Error(`장 ${i} 받기 ${r.status}`);
    fs.writeFileSync(path.join(dir, String(i).padStart(2, '0') + '.png'), Buffer.from(await r.arrayBuffer()));
  }
}
async function one(j) {
  const key = `${j.mon}/${j.row}`;
  if (done[key] && done[key].ok) return;
  for (let k = 0; k < 3; k++) {
    try {
      const id = await submit(j); done[key] = { id }; save(); log(`보냄 ${key} ${j.frames}장 ${id}`);
      await fetchFrames(id, path.join(H, j.mon, j.row), j.frames);
      done[key].ok = 1; save(); log(`받음 ${key}`); return;
    } catch (e) {
      log(`!! ${key} 실패 ${k + 1}: ${String(e.message).slice(0, 200)}`);
      if (/limit|concurrent|too many|429|busy/i.test(e.message)) await sleep(60000); else await sleep(5000);
      if (/session|initialize/i.test(e.message)) { sid = null; await init(); }
    }
  }
  done[key] = { ...(done[key] || {}), fail: 1 }; save();
}
(async () => {
  await init();
  const q = J.slice(); let active = 0;
  await new Promise(res => {
    const next = () => {
      if (!q.length && !active) return res();
      while (active < N && q.length) { const j = q.shift(); active++; one(j).finally(() => { active--; next(); }); }
    };
    next();
  });
  const ok = Object.values(done).filter(d => d.ok).length;
  log(`끝 — 받은 동작 ${ok} / ${J.length}`);
})().catch(e => { log('오류 ' + e.message); process.exit(1); });
