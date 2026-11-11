// 판타지상단키우기 — PC 판 (일렉트론)
// 게임은 game/index.html(웹 판 dist/web과 같은 파일)을 창 하나에 그대로 띄운다. tools/pc_build.py가 싼다.
// 저장: 웹 판과 같은 localStorage(열쇠 paros-sangdan:v1)를 file:// 출처에 둔다. 저장 폴더는 판이 바뀌어도
// 같은 곳(%APPDATA%\ohmulgeori-sangdan-pc)이라 새 판 폴더로 바꿔도 이어진다.
// 창 크기 · 위치 · 확대 배율은 같은 폴더의 window.json에 남긴다.
'use strict';
const { app, BrowserWindow, shell, Menu, screen } = require('electron');
const path = require('path');
const fs = require('fs');

app.setPath('userData', path.join(app.getPath('appData'), 'ohmulgeori-sangdan-pc'));
Menu.setApplicationMenu(null);   // 메뉴 막대 없음(다시 불러오기 · 개발자 도구 단축키도 같이 빠진다)

const GAME = path.join(__dirname, 'game', 'index.html');
const STATE = () => path.join(app.getPath('userData'), 'window.json');
const ZOOMS = [0.5, 0.67, 0.75, 0.8, 0.9, 1, 1.1, 1.25, 1.5, 1.75, 2, 2.5, 3];
let win = null;

const external = (url) => { if (/^https?:\/\//i.test(url)) shell.openExternal(url); };
function readState() { try { return JSON.parse(fs.readFileSync(STATE(), 'utf8')) || {}; } catch (_) { return {}; } }
function writeState() {
  if (!win || win.isDestroyed()) return;
  try { fs.writeFileSync(STATE(), JSON.stringify({ bounds: win.getNormalBounds(), max: win.isMaximized(), zoom: win.webContents.getZoomFactor() })); } catch (_) {}
}
// 모니터를 뗐거나 해상도가 바뀌어 남긴 자리가 화면 밖이면 버린다
function onScreen(b) {
  return !!b && b.width >= 300 && b.height >= 400 && screen.getAllDisplays().some(({ workArea: a }) =>
    b.x < a.x + a.width - 80 && b.x + b.width > a.x + 80 && b.y >= a.y - 20 && b.y < a.y + a.height - 80);
}
function zoomStep(dir) {
  const wc = win.webContents, z = wc.getZoomFactor();
  const next = dir === 0 ? 1 : dir > 0 ? (ZOOMS.find(v => v > z + 0.001) || ZOOMS[ZOOMS.length - 1]) : ([...ZOOMS].reverse().find(v => v < z - 0.001) || ZOOMS[0]);
  wc.setZoomFactor(next);
}

function createWindow() {
  const st = readState(), wa = screen.getPrimaryDisplay().workArea;
  // 게임 화면은 폭 480 기둥(폰 판과 같다) — 처음엔 세로로 긴 창. 늘리거나 최대화하면 기둥은 가운데에 선다.
  const H = Math.max(560, Math.min(980, wa.height - 40)), W = Math.max(360, Math.min(560, wa.width - 40));
  const b = onScreen(st.bounds) ? st.bounds : null;
  const zoom = ZOOMS.find(v => Math.abs(v - (+st.zoom || 0)) < 0.01) || 1;
  win = new BrowserWindow({
    ...(b ? { x: b.x, y: b.y, width: b.width, height: b.height } : { width: W, height: H, center: true }),
    minWidth: 360, minHeight: 560,
    backgroundColor: '#0b0d12', title: '판타지상단키우기',
    icon: path.join(__dirname, 'icon.png'), autoHideMenuBar: true, show: false,
    webPreferences: { contextIsolation: true, nodeIntegration: false, sandbox: true, spellcheck: false, zoomFactor: zoom }
  });
  if (st.max) win.maximize();
  win.once('ready-to-show', () => win.show());
  const wc = win.webContents;
  wc.setWindowOpenHandler(({ url }) => { external(url); return { action: 'deny' }; });   // 바깥 주소는 기본 브라우저로
  wc.on('will-navigate', (e, url) => { if (!url.startsWith('file:')) { e.preventDefault(); external(url); } });
  wc.on('before-input-event', (e, input) => {
    if (input.type !== 'keyDown') return;
    const ctrl = input.control || input.meta, k = input.key;
    if (k === 'F11') { win.setFullScreen(!win.isFullScreen()); e.preventDefault(); }
    else if (k === 'Escape' && win.isFullScreen()) { win.setFullScreen(false); e.preventDefault(); }
    else if (ctrl && (k === '=' || k === '+')) { zoomStep(1); e.preventDefault(); }
    else if (ctrl && (k === '-' || k === '_')) { zoomStep(-1); e.preventDefault(); }
    else if (ctrl && k === '0') { zoomStep(0); e.preventDefault(); }
    else if (k === 'F5' || (ctrl && (k === 'r' || k === 'R'))) e.preventDefault();   // 다시 불러오기 막기(진행 중 저장 꼬임 방지)
  });
  wc.on('zoom-changed', (e, dir) => zoomStep(dir === 'in' ? 1 : -1));   // Ctrl + 마우스 휠
  let lastCrash = 0;   // 화면 쪽이 죽으면 한 번 다시 띄운다(10초 안에 또 죽으면 그대로 둔다)
  wc.on('render-process-gone', (e, d) => { if (d.reason !== 'clean-exit' && Date.now() - lastCrash > 10000) { lastCrash = Date.now(); wc.reload(); } });
  win.on('page-title-updated', (e) => e.preventDefault());
  win.on('close', writeState);
  win.on('closed', () => { win = null; });
  win.loadFile(GAME);
}

if (!app.requestSingleInstanceLock()) app.quit();   // 두 창이 같은 저장을 번갈아 덮어쓰지 않게 하나만
else {
  app.on('second-instance', () => { if (win) { if (win.isMinimized()) win.restore(); win.focus(); } });
  app.whenReady().then(createWindow);
  app.on('window-all-closed', () => app.quit());
}
