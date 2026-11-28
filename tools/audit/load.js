// 게임 JS를 build.py와 같은 모양(한 덩어리 · 'use strict' 즉시 실행 함수)으로 node vm에 불러온다 — 화면 없이 데이터만 보려고
const fs = require('fs'), vm = require('vm');
const R = 'D:/work/ohmulgeori-sangdan/';
const py = fs.readFileSync(R + 'build.py', 'utf8'); const m = py.match(/JS\s*=\s*\[([\s\S]*?)\]/);
const files = [...m[1].matchAll(/'([^']+\.js)'/g)].map(x => x[1]);
const P = new Proxy(function () {}, { get: (t, k) => k === Symbol.toPrimitive ? () => 0 : k === 'length' ? 0 : P, apply: () => P, construct: () => P, set: () => true });
const ctx = { console: { log() {}, warn() {}, error() {} }, document: P, localStorage: { getItem: () => null, setItem() {}, removeItem() {} }, navigator: { userAgent: '' }, location: { search: '', hash: '' },
  requestAnimationFrame() {}, setTimeout() {}, setInterval() {}, clearTimeout() {}, clearInterval() {}, Image: function () { return P; }, Audio: function () { return P; }, addEventListener() {}, matchMedia: () => ({ matches: false, addEventListener() {} }), performance: { now: () => 0 }, fetch: () => new Promise(() => {}), URL, Blob: function () {}, OffscreenCanvas: function () { return P; }, ResizeObserver: function () { return P; }, devicePixelRatio: 1, innerWidth: 1280, innerHeight: 720, screen: {}, getComputedStyle: () => P, atob: s => Buffer.from(s, 'base64').toString('binary'), btoa: s => Buffer.from(s, 'binary').toString('base64') };
ctx.window = ctx; ctx.self = ctx; vm.createContext(ctx);
const pre = "const BUILD_NO = 0, REPO = '', TEST_SCOPE = { key: 'x', fields: ['plains','forest','deepforest','rootcave'], classes: ['warrior','rogue','archer','mage','cleric','porter'], label: '' };\nconst inScope = f => !TEST_SCOPE || TEST_SCOPE.fields.includes(f);\n";
const code = "(() => {\n'use strict';\n" + pre + files.map(f => fs.readFileSync(R + 'src/' + f, 'utf8')).join('\n') + "\n;globalThis.__E = x => eval(x);\n})();";
ctx.__err = null;
try { vm.runInContext(code, ctx, { filename: 'game.js' }); } catch (e) { ctx.__err = e; console.error('ERR', e.message, (e.stack || '').split('\n').slice(0, 3).join(' | ')); }
module.exports = ctx;
if (require.main === module) console.log(files.length, 'files', ctx.__E ? Object.keys(ctx.__E('ITEMS')).length + ' items' : 'no E');
