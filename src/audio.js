/* ───────── 소리: WebAudio로 만드는 효과음과 지역별 배경음 (파일 없이 즉석에서 합성) ─────────
   첫 터치에서 AudioContext를 깨운다. 설정(효과음·배경음·음량)은 localStorage 'paros-audio'에 둔다. */
const AU = { ctx: null, ok: false, sfx: true, bgm: true, vol: 0.6, theme: null, seq: null, last: {}, timer: null, fade: null };
try { const a = JSON.parse(localStorage.getItem('paros-audio') || '{}'); if (a.sfx != null) AU.sfx = !!a.sfx; if (a.bgm != null) AU.bgm = !!a.bgm; if (a.vol != null) AU.vol = Math.max(0, Math.min(1, +a.vol)); } catch (_) {}
function auSave() { try { localStorage.setItem('paros-audio', JSON.stringify({ sfx: AU.sfx, bgm: AU.bgm, vol: AU.vol })); } catch (_) {} }
function auInit() {
  if (AU.ctx) return true;
  try {
    const C = window.AudioContext || window.webkitAudioContext; if (!C) return false;
    AU.ctx = new C();
    AU.master = AU.ctx.createGain(); AU.master.gain.value = AU.vol; AU.master.connect(AU.ctx.destination);
    AU.sfxG = AU.ctx.createGain(); AU.sfxG.gain.value = 1; AU.sfxG.connect(AU.master);
    AU.bgmG = AU.ctx.createGain(); AU.bgmG.gain.value = 0.7; AU.bgmG.connect(AU.master);
    // 잡음 버퍼 (타격·드럼용)
    const len = AU.ctx.sampleRate * 0.5, buf = AU.ctx.createBuffer(1, len, AU.ctx.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    AU.noise = buf;
    AU.ok = true;
    return true;
  } catch (_) { return false; }
}
function auUnlock() {
  if (!auInit()) return;
  if (AU.ctx.state === 'suspended') AU.ctx.resume().catch(() => {});
  if (!AU.timer) AU.timer = setInterval(auTick, 60);
}
function auSet(k, v) { AU[k] = v; auSave(); if (AU.master) AU.master.gain.value = AU.vol; if (k === 'bgm' && !v) bgmStop(); if (k === 'bgm' && v) { AU.theme = null; } }
document.addEventListener('visibilitychange', () => { if (!AU.ctx) return; if (document.visibilityState === 'hidden') AU.ctx.suspend().catch(() => {}); else AU.ctx.resume().catch(() => {}); });

/* ── 음 하나 ── */
const auF = n => 440 * Math.pow(2, (n - 69) / 12);
function tone(type, f0, t0, dur, vol, f1, dest, curve) {
  const c = AU.ctx, o = c.createOscillator(), g = c.createGain();
  o.type = type; o.frequency.setValueAtTime(f0, t0);
  if (f1) o.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t0 + dur);
  g.gain.setValueAtTime(0.0001, t0); g.gain.linearRampToValueAtTime(vol, t0 + (curve || 0.008));
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  o.connect(g); g.connect(dest || AU.sfxG); o.start(t0); o.stop(t0 + dur + 0.02);
}
function noise(t0, dur, vol, hp, lp, dest) {
  const c = AU.ctx, s = c.createBufferSource(), g = c.createGain(); s.buffer = AU.noise;
  let node = s;
  if (hp) { const f = c.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = hp; node.connect(f); node = f; }
  if (lp) { const f = c.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = lp; node.connect(f); node = f; }
  g.gain.setValueAtTime(vol, t0); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  node.connect(g); g.connect(dest || AU.sfxG); s.start(t0); s.stop(t0 + dur + 0.02);
}
/* ── 효과음 ── */
const SFX = {
  hit:   t => { noise(t, 0.07, 0.5, 800, 5000); tone('square', 160, t, 0.09, 0.25, 60); },
  crit:  t => { noise(t, 0.1, 0.6, 600, 6000); tone('square', 220, t, 0.12, 0.3, 70); tone('sine', 1500, t + 0.02, 0.15, 0.2, 2400); },
  arrow: t => { noise(t, 0.12, 0.35, 1500, 7000); tone('sine', 900, t, 0.1, 0.12, 300); },
  magic: t => { tone('sawtooth', 300, t, 0.25, 0.18, 1200); tone('sine', 600, t + 0.05, 0.2, 0.12, 2400); },
  fire:  t => { noise(t, 0.3, 0.4, 200, 2500); tone('sawtooth', 180, t, 0.3, 0.14, 60); },
  ice:   t => { [1800, 2400, 3200].forEach((f, i) => tone('sine', f, t + i * 0.05, 0.15, 0.16)); noise(t, 0.08, 0.15, 4000, 9000); },
  bolt:  t => { noise(t, 0.18, 0.6, 2000, 9000); tone('square', 80, t, 0.15, 0.2, 40); },
  holy:  t => { [523, 659, 784, 1047].forEach((f, i) => tone('triangle', f, t + i * 0.06, 0.3, 0.14)); },
  dark:  t => { tone('sawtooth', 120, t, 0.35, 0.18, 50); noise(t, 0.25, 0.2, 100, 900); },
  wind:  t => { noise(t, 0.3, 0.35, 500, 3000); tone('sine', 400, t, 0.3, 0.08, 900); },
  heal:  t => { tone('sine', 660, t, 0.18, 0.18); tone('sine', 990, t + 0.1, 0.25, 0.18); },
  pot:   t => { tone('sine', 520, t, 0.1, 0.16); tone('sine', 780, t + 0.08, 0.1, 0.16); tone('sine', 1040, t + 0.16, 0.18, 0.16); },
  buff:  t => { [440, 554, 659].forEach((f, i) => tone('square', f, t + i * 0.06, 0.14, 0.1)); },
  hurt:  t => { noise(t, 0.06, 0.3, 300, 2500); tone('triangle', 200, t, 0.1, 0.18, 90); },
  miss:  t => { noise(t, 0.08, 0.18, 2500, 8000); },
  kill:  t => { tone('square', 400, t, 0.08, 0.15, 300); tone('square', 300, t + 0.08, 0.12, 0.15, 120); noise(t, 0.1, 0.2, 300, 3000); },
  down:  t => { tone('sawtooth', 300, t, 0.4, 0.2, 60); noise(t + 0.1, 0.2, 0.25, 100, 1500); },
  lvl:   t => { [523, 659, 784, 1047].forEach((f, i) => tone('square', f, t + i * 0.09, 0.22, 0.14)); tone('square', 1319, t + 0.36, 0.4, 0.14); },
  loot:  t => { tone('sine', 1200, t, 0.08, 0.14); tone('sine', 1600, t + 0.07, 0.12, 0.14); },
  coin:  t => { tone('sine', 1568, t, 0.08, 0.16); tone('sine', 2093, t + 0.07, 0.16, 0.16); },
  buy:   t => { tone('sine', 1047, t, 0.08, 0.14); tone('sine', 1319, t + 0.07, 0.14, 0.14); },
  ui:    t => { tone('square', 1200, t, 0.035, 0.08, 900); },
  open:  t => { noise(t, 0.09, 0.12, 1000, 6000); tone('sine', 700, t, 0.08, 0.06, 1000); },
  close: t => { tone('sine', 900, t, 0.07, 0.06, 500); },
  win:   t => { [523, 659, 784, 659, 784, 1047].forEach((f, i) => tone('square', f, t + i * 0.1, 0.25, 0.14)); tone('square', 1319, t + 0.6, 0.6, 0.14); },
  lose:  t => { [440, 415, 392, 370].forEach((f, i) => tone('triangle', f, t + i * 0.18, 0.4, 0.16)); },
  boss:  t => { tone('sawtooth', 80, t, 0.6, 0.25, 50); noise(t, 0.4, 0.3, 80, 600); tone('sawtooth', 120, t + 0.3, 0.5, 0.2, 60); },
  hatch: t => { [784, 988, 1175, 1568].forEach((f, i) => tone('sine', f, t + i * 0.08, 0.3, 0.14)); noise(t, 0.08, 0.2, 2000, 8000); },
  mast:  t => { [880, 1109, 1319].forEach((f, i) => tone('triangle', f, t + i * 0.07, 0.3, 0.12)); },
  warn:  t => { tone('square', 440, t, 0.15, 0.14); tone('square', 440, t + 0.2, 0.15, 0.14); },
  forge: t => { noise(t, 0.05, 0.4, 1500, 9000); tone('sine', 2200, t, 0.3, 0.2, 1800); tone('sine', 3300, t + 0.02, 0.2, 0.1); }
};
const SFX_GAP = { hit: 0.05, hurt: 0.05, arrow: 0.06, magic: 0.08, ui: 0.03, heal: 0.08, kill: 0.08 };
function sfx(name) {
  if (!AU.ok || !AU.sfx || !SFX[name]) return;
  const t = AU.ctx.currentTime, gap = SFX_GAP[name] || 0.04;
  if (AU.last[name] && t - AU.last[name] < gap) return;
  AU.last[name] = t;
  try { SFX[name](t); } catch (_) {}
}
const HIT_SFX = { melee: 'hit', jump: 'hit', pet: 'hit', arrow: 'arrow', magic: 'magic', spell: 'magic', fire: 'fire', ice: 'ice', bolt: 'bolt', holy: 'holy', dark: 'dark', wind: 'wind', note: 'buff', poison: null, curse: null, burn: null, bleed: null };

/* ── 배경음: 16분음표 32걸음 패턴 ── */
const NOTE = { c: 0, d: 2, e: 4, f: 5, g: 7, a: 9, b: 11 };
function parseSeq(s) {   // "c4 . e4 - g4" → [midi|null|'-' ...]
  return s.trim().split(/\s+/).map(tk => { if (tk === '.') return null; if (tk === '-') return '-'; const m = /^([a-g])(#|b)?(\d)$/.exec(tk); if (!m) return null; return 12 * (+m[3] + 1) + NOTE[m[1]] + (m[2] === '#' ? 1 : m[2] === 'b' ? -1 : 0); });
}
const BGM = {
  town:    { bpm: 96,  lead: 'e5 . g5 . a5 - g5 . e5 . d5 . c5 - d5 e5 . . g5 . e5 - d5 . c5 . d5 . e5 - - .', bass: 'c3 . . . g2 . . . a2 . . . f2 . . . c3 . . . g2 . . . f2 . . . g2 . . .', arp: 'c4 e4 g4 e4 g3 b3 d4 b3 a3 c4 e4 c4 f3 a3 c4 a3 c4 e4 g4 e4 g3 b3 d4 b3 f3 a3 c4 a3 g3 b3 d4 b3', drum: 'k . h . . . h . k . h . . . h . k . h . . . h . k . h . s . h .', lw: 'triangle', vol: 0.6 },
  field:   { bpm: 124, arp: 'g3 . d4 . g3 . d4 . e3 . b3 . c3 . g3 . g3 . d4 . g3 . d4 . c3 . g3 . d3 . a3 .', lead: 'g4 a4 b4 d5 . b4 a4 g4 e4 g4 a4 . b4 . a4 g4 g4 a4 b4 d5 . e5 d5 b4 a4 . g4 . a4 b4 a4 .', bass: 'g2 . g2 . d2 . d2 . e2 . e2 . c2 . c2 . g2 . g2 . d2 . d2 . c2 . c2 . d2 . d2 .', drum: 'k . h . s . h . k . h . s . h . k . h . s . h . k . h . s . h h', lw: 'square', vol: 0.6 },
  dungeon: { bpm: 100, lead: 'a4 . . . c5 . b4 . . . e4 . . . d4 . a4 . . . g4 . f4 . . . e4 . . . . .', bass: 'a2 . . a2 . . a2 . f2 . . f2 . . e2 . a2 . . a2 . . a2 . d2 . . d2 . . e2 .', arp: 'a3 . e4 . a3 . e4 . f3 . c4 . f3 . c4 . a3 . e4 . a3 . e4 . d3 . a3 . e3 . b3 .', drum: 'k . . . h . . . k . . . h . h . k . . . h . . . k . . s . . h .', lw: 'triangle', vol: 0.55 },
  boss:    { bpm: 150, lead: 'd5 . d5 f5 . d5 . c5 a4 . a4 c5 . a4 . g4 d5 . d5 f5 . g5 . a5 c5 . a4 g4 . f4 . e4', bass: 'd2 d2 d3 d2 d2 d2 d3 d2 bb1 bb1 bb2 bb1 c2 c2 c3 c2 d2 d2 d3 d2 d2 d2 d3 d2 a1 a1 a2 a1 c2 c2 c3 c2', drum: 'k . k . s . k . k . k . s . h . k . k . s . k . k . k . s . s s', lw: 'square', vol: 0.62 },
  arena:   { bpm: 136, lead: 'e5 . g5 e5 . b4 . d5 e5 . g5 . a5 . g5 . e5 . g5 e5 . b4 . d5 e5 . d5 . b4 . a4 .', bass: 'e2 . e2 e2 . b1 . . c2 . c2 c2 . d2 . . e2 . e2 e2 . b1 . . a1 . a1 a1 . b1 . .', drum: 'k . h . s . h . k . h . s . h h k . h . s . h . k . h . s . h h', lw: 'square', vol: 0.6 },
  demon:   { bpm: 112, lead: 'e4 f4 . e4 . . b4 . . a4 . g4 f4 . e4 . e4 f4 . g4 . . a4 . . g4 . c5 b4 . a4 .', bass: 'e2 . . . e2 . . f2 . . . e2 . . d2 . e2 . . . e2 . . f2 . . . g2 . . a2 .', drum: 'k . . . k . . h k . . . k . s . k . . . k . . h k . . . k . s s', lw: 'sawtooth', vol: 0.55 }
};
Object.values(BGM).forEach(B => { B.L = parseSeq(B.lead); B.B = parseSeq(B.bass); B.A = B.arp ? parseSeq(B.arp) : null; B.D = B.drum.trim().split(/\s+/); });
function bgmThemeNow() {
  if (!AU.bgm) return null;
  if (typeof S === 'undefined' || !S) return 'town';
  const p = typeof viewParty === 'function' ? viewParty() : null;
  if (!p || !p.exp) return 'town';
  const e = p.exp;
  if (e.area === 'raid' || e.area === 'wave') return 'boss';
  if (e.area === 'arena') return 'arena';
  if (e.foes && e.foes.some(f => f.boss)) return 'boss';
  if (e.area === 'dungeon') return 'dungeon';
  return FIELDS[e.field] && FIELDS[e.field].demon ? 'demon' : 'field';
}
function bgmStop() { AU.seq = null; AU.theme = null; }
function auTick() {
  if (!AU.ok || !AU.ctx || AU.ctx.state !== 'running') return;
  const want = bgmThemeNow();
  if (want !== AU.theme) {
    AU.theme = want;
    if (want) { AU.seq = { B: BGM[want], step: 0, next: AU.ctx.currentTime + 0.1 }; AU.bgmG.gain.cancelScheduledValues(AU.ctx.currentTime); AU.bgmG.gain.setValueAtTime(0.0001, AU.ctx.currentTime); AU.bgmG.gain.exponentialRampToValueAtTime(BGM[want].vol, AU.ctx.currentTime + 0.8); }
    else AU.seq = null;
  }
  const q = AU.seq; if (!q) return;
  const B = q.B, dt = 60 / B.bpm / 4;
  while (q.next < AU.ctx.currentTime + 0.18) {
    const i = q.step % 32, t = q.next;
    const n = B.L[i]; if (typeof n === 'number') { let len = 1; for (let j = i + 1; j < 32 && B.L[j] === '-'; j++) len++; tone(B.lw, auF(n), t, dt * len * 0.95, 0.2, 0, AU.bgmG, 0.01); }
    const b = B.B[i]; if (typeof b === 'number') tone('triangle', auF(b), t, dt * 0.9, 0.3, 0, AU.bgmG, 0.01);
    const ar = B.A && B.A[i]; if (typeof ar === 'number') tone('square', auF(ar), t, dt * 0.6, 0.07, 0, AU.bgmG, 0.005);
    const d = B.D[i];
    if (d === 'k') tone('sine', 130, t, 0.11, 0.5, 45, AU.bgmG, 0.004);
    else if (d === 's') noise(t, 0.1, 0.18, 900, 6000, AU.bgmG);
    else if (d === 'h') noise(t, 0.035, 0.08, 5000, 12000, AU.bgmG);
    q.step++; q.next += dt;
  }
}
