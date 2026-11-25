/* B2 금박 각인 숫자 스프라이트 — 사용법
   await B2.load('b2-ui', 'gold', 'labyrinth_font_kit/sprites');   // 종류: b2-ui(본문 줄 안 숫자) · b2-fx(데미지) · b2-big(강화 큰 수치)
   el.appendChild(B2.html('b2-ui', 'gold', '12,000'));             // DOM으로
   B2.draw(ctx, 'b2-big', 'gold', '+19 → +20', x, y);               // canvas로 (ctx.imageSmoothingEnabled = false)
   색: gold ivory silver bronze white parch iron iron_body crimson blackred prism
   지원 글자: 0-9 + − × , . : % ★ ▲ ▼ → 와 공백 ('-'는 '−'로, 'x'는 '×'로 바꿔 줌) */
(function () {
  const cache = {};
  const norm = s => String(s).replace(/-/g, '−').replace(/x/g, '×');
  async function load(kind, color, base = 'labyrinth_font_kit/sprites') {
    const key = kind + '/' + color; if (cache[key]) return cache[key];
    const meta = cache[kind] || (cache[kind] = await (await fetch(`${base}/${kind}/${kind}.json`)).json());
    const img = new Image(); img.src = `${base}/${kind}/${color}.png`; await img.decode();
    return (cache[key] = { meta, img, url: img.src });
  }
  function html(kind, color, text) {
    const f = cache[kind + '/' + color]; if (!f) throw new Error('B2.load 먼저: ' + kind + '/' + color);
    const { meta, url } = f, p = meta.pad, span = document.createElement('span');
    span.style.cssText = `display:inline-block;position:relative;height:${meta.glyph_height}px;vertical-align:-1px;image-rendering:pixelated`;
    let x = 0;
    for (const ch of norm(text)) {
      if (ch === ' ') { x += meta.space_advance; continue; }
      const g = meta.glyphs[ch]; if (!g) continue;
      const i = document.createElement('i');
      i.style.cssText = `position:absolute;left:${x - p}px;top:${-p}px;width:${g.w}px;height:${g.h}px;background:url(${url}) -${g.x}px -${g.y}px no-repeat`;
      span.appendChild(i); x += g.advance;
    }
    span.style.width = x + 'px'; return span;
  }
  function draw(ctx, kind, color, text, x, y) {
    const { meta, img } = cache[kind + '/' + color], p = meta.pad;
    for (const ch of norm(text)) {
      if (ch === ' ') { x += meta.space_advance; continue; }
      const g = meta.glyphs[ch]; if (!g) continue;
      ctx.drawImage(img, g.x, g.y, g.w, g.h, Math.round(x - p), Math.round(y - p), g.w, g.h); x += g.advance;
    }
    return x;
  }
  window.B2 = { load, html, draw };
})();
