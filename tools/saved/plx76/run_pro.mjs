// 픽셀랩 create_image_pro 작업을 jobs_in.json대로 보내고 후보 n장을 <key>/NN.png로 받는다. 토큰은 ~/.claude.json pixellab 설정에서 읽어 프로세스 안에서만 쓴다.
// node run_pro.mjs [동시 수=3] [jobs 파일=jobs_in.json]
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
const H = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'));
const N = +process.argv[2] || 3;
const cfg = JSON.parse(fs.readFileSync(path.join(os.homedir(), '.claude.json'), 'utf8')).mcpServers.pixellab;
const MCP = cfg.url, AUTH = cfg.headers.Authorization;
const J = JSON.parse(fs.readFileSync(path.join(H, process.argv[3] || 'jobs_in.json'), 'utf8'));
const DONE_F = path.join(H, (process.argv[3] || 'jobs_in.json').replace('in', 'done'));
const done = fs.existsSync(DONE_F) ? JSON.parse(fs.readFileSync(DONE_F, 'utf8')) : {};
const log = s => { const l = `[${new Date().toLocaleTimeString('ko-KR')}] ${s}`; console.log(l); fs.appendFileSync(path.join(H, 'log.txt'), l + '\n'); };
const save = () => fs.writeFileSync(DONE_F, JSON.stringify(done, null, 1));
const sleep = ms => new Promise(r => setTimeout(r, ms));
let sid = null, rid = 1;
async function rpc(method, params, notify = false) {
  const h = { 'Content-Type': 'application/json', Accept: 'application/json, text/event-stream', Authorization: AUTH };
  if (sid) h['Mcp-Session-Id'] = sid;
  const r = await fetch(MCP, { method: 'POST', headers: h, body: JSON.stringify(notify ? { jsonrpc: '2.0', method, params } : { jsonrpc: '2.0', id: rid++, method, params }) });
  if (r.headers.get('mcp-session-id')) sid = r.headers.get('mcp-session-id');
  const t = await r.text(); if (notify) return null;
  const m = t.match(/^data: (.*)$/m); const j = JSON.parse(m ? m[1] : t);
  if (j.error) throw new Error(JSON.stringify(j.error).slice(0, 300));
  return j.result;
}
const init = async () => { await rpc('initialize', { protocolVersion: '2025-03-26', capabilities: {}, clientInfo: { name: 'plx75', version: '1' } }); await rpc('notifications/initialized', {}, true); };
async function one(j) {
  if (done[j.key] && done[j.key].ok) return;
  for (let k = 0; k < 3; k++) {
    try {
      const res = await rpc('tools/call', { name: j.tool, arguments: j.args });
      const txt = (res.content || []).map(c => c.text || '').join('\n');
      const id = (txt.match(/job_id: ([0-9a-f-]{36})/) || txt.match(/"background_job_id": "([0-9a-f-]{36})"/) || [])[1]; if (!id) throw new Error('작업 번호 없음: ' + txt.slice(0, 300));
      done[j.key] = { id }; save(); log(`보냄 ${j.key} ${id}`);
      let st = 0;
      for (let t = 0; t < 120; t++) { const r = await fetch(`https://api.pixellab.ai/mcp/images/${id}/download?index=0`); st = r.status; if (st === 200) break; if (st !== 423) throw new Error('받기 ' + st + ' ' + (await r.text()).slice(0, 200)); await sleep(10000); }
      if (st === 200) { fs.mkdirSync(path.join(H, j.key), { recursive: true }); for (let i = 0; i < (j.n || 4); i++) { const r = await fetch(`https://api.pixellab.ai/mcp/images/${id}/download?index=${i}`); if (r.status !== 200) break; fs.writeFileSync(path.join(H, j.key, String(i).padStart(2, '0') + '.png'), Buffer.from(await r.arrayBuffer())); } }
      if (st !== 200) throw new Error('시간 초과');
      done[j.key].ok = 1; save(); log(`받음 ${j.key}`); return;
    } catch (e) { log(`!! ${j.key} 실패 ${k + 1}: ${String(e.message).slice(0, 200)}`); await sleep(/limit|concurrent|429/i.test(e.message) ? 60000 : 5000); }
  }
  done[j.key] = { ...(done[j.key] || {}), fail: 1 }; save();
}
(async () => {
  await init(); const q = J.slice(); let active = 0;
  await new Promise(res => { const next = () => { if (!q.length && !active) return res(); while (active < N && q.length) { const j = q.shift(); active++; one(j).finally(() => { active--; next(); }); } }; next(); });
  log(`끝 — ${Object.values(done).filter(d => d.ok).length} / ${J.length}`);
})().catch(e => { log('오류 ' + e.message); process.exit(1); });
