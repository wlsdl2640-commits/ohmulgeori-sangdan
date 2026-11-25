// 첫 장 올리기: node up.mjs <png> → upload:… 를 찍는다(토큰은 ~/.claude.json에서 읽어 이 프로세스 안에서만 씀)
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path';
const cfg = JSON.parse(fs.readFileSync(path.join(os.homedir(), '.claude.json'), 'utf8')).mcpServers.pixellab;
let sid = null, rid = 1;
async function rpc(method, params, notify) {
  const h = { 'Content-Type': 'application/json', Accept: 'application/json, text/event-stream', Authorization: cfg.headers.Authorization };
  if (sid) h['Mcp-Session-Id'] = sid;
  const r = await fetch(cfg.url, { method: 'POST', headers: h, body: JSON.stringify(notify ? { jsonrpc: '2.0', method, params } : { jsonrpc: '2.0', id: rid++, method, params }) });
  if (r.headers.get('mcp-session-id')) sid = r.headers.get('mcp-session-id');
  const t = await r.text(); if (notify) return; const m = t.match(/^data: (.*)$/m); return JSON.parse(m ? m[1] : t).result;
}
await rpc('initialize', { protocolVersion: '2025-03-26', capabilities: {}, clientInfo: { name: 'up', version: '1' } }); await rpc('notifications/initialized', {}, true);
const res = await rpc('tools/call', { name: 'get_upload_url', arguments: {} });
const UP = res.content.map(c => c.text).join('\n').match(/https:\/\/api\.pixellab\.ai\/v2\/uploads\/\S+/)[0];
const fd = new FormData(); fd.append('file', new Blob([fs.readFileSync(process.argv[2])], { type: 'image/png' }), 'first.png');
const j = await (await fetch(UP, { method: 'POST', body: fd })).json(); console.log(j.ref);
