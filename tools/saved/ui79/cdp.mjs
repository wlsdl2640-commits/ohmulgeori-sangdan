// 작은 Chrome DevTools 드라이버 (설치 없이 — Node 내장 WebSocket · fetch)
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
export async function open(url, { w = 412, h = 900, dpr = 2, port = 9333 } = {}) {
  const prof = fs.mkdtempSync(path.join(os.tmpdir(), 'cdp-'));
  const ch = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${prof}`, '--no-first-run', '--disable-gpu', '--hide-scrollbars', '--mute-audio', 'about:blank'], { stdio: 'ignore' });
  let list;
  for (let i = 0; i < 60; i++) { try { list = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json(); if (list.length) break; } catch (_) {} await sleep(250); }
  const pg = list.find(t => t.type === 'page');
  const ws = new WebSocket(pg.webSocketDebuggerUrl); await new Promise(r => ws.addEventListener('open', r, { once: true }));
  let id = 0; const wait = new Map(), errs = [];
  ws.addEventListener('message', ev => { const m = JSON.parse(ev.data); if (m.id && wait.has(m.id)) { wait.get(m.id)(m); wait.delete(m.id); } if (m.method === 'Runtime.exceptionThrown') errs.push(m.params.exceptionDetails.exception ? m.params.exceptionDetails.exception.description : m.params.exceptionDetails.text); });
  const send = (method, params = {}) => new Promise(r => { const i = ++id; wait.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
  await send('Runtime.enable'); await send('Page.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: dpr, mobile: false });
  await send('Page.navigate', { url }); await sleep(2500);
  const ev = async expr => { const r = await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true }); if (r.result && r.result.exceptionDetails) throw new Error(r.result.exceptionDetails.exception ? r.result.exceptionDetails.exception.description : JSON.stringify(r.result.exceptionDetails)); return r.result && r.result.result ? r.result.result.value : undefined; };
  const shot = async file => { const r = await send('Page.captureScreenshot', { format: 'png' }); fs.writeFileSync(file, Buffer.from(r.result.data, 'base64')); };
  const close = () => { try { ws.close(); } catch (_) {} ch.kill(); };
  return { ev, shot, close, errs, send };
}
export const sleep = ms => new Promise(r => setTimeout(r, ms));
