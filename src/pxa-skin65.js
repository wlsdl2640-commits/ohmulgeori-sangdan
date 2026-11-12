/* ───────── 빌드 65 직업 개편: 새 직업 · 바뀐 직업의 캐릭터 그림 ─────────
   tools/saved/class65/export_skins.py가 rogue_skins.json · archer_skins.json · porter_skins.json(사용자가 고른 시안)에서 뽑는다 — 손으로 고치지 말 것.
   머리 · 덧붙이기는 반 해상도 격자를 pxUp으로 두 배. 대도는 예전 그림 그대로. 탈것(늑대 · 와이번)은 모습을 고른 뒤에. */
const H65 = (rows, top, x) => ({ top: top * 2, x: (x || 0) * 2, g: pxUp(rows).join('\n') });
const E65 = (rows, x, y, under) => Object.assign({ x, y, g: pxUp(rows).join('\n') }, under ? { under: 1 } : {});
Object.assign(PX_HEAD, {
  flatcap: H65(["..JJJJ...", ".JJIJJJj.", "JJJJJJJJj", "jjjjjjjjj"], 1, 0),
  bowler: H65(["...JJJJ...", "..JJIJJJj.", "..JJJJJJj.", "..FFFFFFf.", "JJJJJJJJJj"], 2, -1),
  shinobi: H65(["..JJJJ.....", ".JJIJJj....", "JJIJJJjj...", "FFFFFFFfFF.", "J......j.Ff", "JJJJJJJj..f", ".jJJJJj...."], 1, 0),
  shadow: H65(["..JJJJ.....", ".JJIJJj....", "JJIJJJjj...", "FFFFFFFfFF.", "J......j.FX", "JJJJJJJj..X", ".jJJJJj...."], 1, 0),
  wolfhood: H65([".JJ..JJ.", ".JjJJjJ.", "JJJJJJJJ", "JKJZZJKJ", "JJZKKZJJ", "jzZZZZzj", "J......j", "j......j", "j......j"], 3, 0),
  lensmask: H65(["..JJJJ..", ".JJIJJj.", "JJIJJJjj", "JGGFFGGj", "JXXFFXXj", "JGGFFGGj", ".jFrrFj."], 1, 0),
  pioneer: H65(["...JJJJ...", "..JJIJJj..", "..JJJJJj..", "J.WWWWWW.J", "JJJJJJJJJJ", ".jjjjjjjj."], 3, -1),
  straw: H65(["..AAAAAA..", "..AaAAaA..", "..FFFFFF..", "AAAAAAAAAA", ".aAaAaAaa."], 2, -1)
});
Object.assign(PXS_HEAD, {
  flatcap: H65(["..JJJJ....", ".JJIJJJj..", "JJJJJJJJj.", "jjjjjjjjjj"], 1, 0),
  bowler: H65(["...JJJJ....", "..JJIJJJj..", "..JJJJJJj..", "..FFFFFFf..", "JJJJJJJJJJj"], 2, -1),
  shinobi: H65(["....JJJ...", "...JJIJj..", "..JJJJJJj.", "FfFFFFFFFf", "F.JJJJ....", "f.JJJJJJJ.", "...JJJJJ.."], 1, -2),
  shadow: H65(["....JJJ...", "...JJIJj..", "..JJJJJJj.", "FfFFFFFFFf", "X.JJJJ....", "X.JJJJJJJ.", "...JJJJJ.."], 1, -2),
  wolfhood: H65([".....JJ....", "....JJJJ...", "..JJJJJKJ..", ".JJJJJJJZZ.", "JJJJJJJZZK.", "JJJJjzZZz..", "JJJ........", "JJj........", "Jj........."], 3, -2),
  lensmask: H65(["....JJJ...", "...JJIJj..", "..JJJJJJj.", "..JJGGGG..", "..JJGXXF..", "..JJGGGFF.", "...JJFrr.."], 1, -2),
  pioneer: H65(["....JJJJ...", "...JIJJJj..", "...JJJJJj..", ".J.WWWWWW.J", "JJJJJJJJJJJ", ".jjjjjjjjj."], 3, -1),
  straw: H65(["...AAAAAA..", "...AaAAaA..", "...FFFFFF..", "AAAAAAAAAAA", ".aAaAaAaAa."], 2, -1)
});
Object.assign(PX_EX, {
  kerchief: E65(["FFFFFf", ".FFf.."], 2, 0),
  sscarf: E65(["FFFFFf..", ".....Ff.", "......X.", "......X."], 2, 0),
  bowtie: E65(["FfF"], 6, 0),
  wxbow: E65([".O.", ".O.", "NMN"], 12, 2),
  bcase: E65(["R.", "OO", "Ov", "vv"], 0, 6),
  bedroll: E65(["ZZRZZZZRZZ", "zzRzzzzRzz"], -2, -3, 1),
  susp: E65([".V....V.", ".V....V.", ".V....V."], 0, 0)
});
Object.assign(PXS_EX, {
  kerchief: E65(["FFFFf", "..Ff."], 1, 0),
  sscarf: E65(["....FFFFf", "..FFf....", ".XX......", ".X......."], -7, 0),
  bowtie: E65([".Ff"], 5, 0),
  wxbow: E65([".O.", ".O.", "NMN"], -3, 0, 1),
  bcase: E65([".R", "OO", "Ov", "vv"], 1, 5),
  bedroll: E65(["ZR", "zR"], -3, -3, 1),
  susp: E65(["V...", "V..."], 3, 0)
});
Object.assign(PXL, {
  treasure: { head: "flatcap", body: "coat", ex: ["kerchief"], c1: "#6a5034", c2: "#e8dcc0", c3: "#d8a030", hc: "#6e6a5a", gold: "#c8b080", pants: "#4a4036", boots: "#3a2a1e", hair: "short" },   // 소매치기 — A 헌팅캡
  phantomthief: { head: "bowler", body: "coat", ex: ["bowtie"], c1: "#2f5a42", c2: "#f0ece0", c3: "#b8322a", hc: "#4a3426", gold: "#e0c060", pants: "#2e2a2a", boots: "#1e1a1a", hair: "short" },   // 괴도 — 중절모 도박사
  ninja: { head: "shinobi", body: "leather", c1: "#2e3a6a", c2: "#4a5a8a", c3: "#d8302a", hc: "#2e3a6a", leather: "#3c4c80", gold: "#d8302a", pants: "#283460", boots: "#1c2240", hair: "short" },   // 닌자 — A 남색 시노비
  kageninja: { head: "shadow", body: "leather", c1: "#241c34", c2: "#3a2a50", c3: "#5a3a8a", hc: "#201a2c", leather: "#30264a", gold: "#7a4ab8", gem: "#c89aff", eyes: "#d8b0ff", pants: "#1c1626", boots: "#120e18", hair: "short", ex: ["sscarf"] },   // 카게닌자 — A 그림자 두건
  mhunter: { head: "wolfhood", body: "leather", ex: ["quiver", "fur", "wxbow", "bcase"], c1: "#4a5a3a", c2: "#c8b080", c3: "#8a3a2a", hc: "#8a8a90", leather: "#7a7a80", feather: "#c8322a", pants: "#3e3a2e", boots: "#2e241a", hair: "short", wv: "long", hairc: "#4a3424" },   // 트래커 — A 늑대 가죽 두건
  dslayer: { head: "lensmask", body: "leather", ex: ["quiver", "cape", "wxbow", "bcase"], c1: "#2a2a30", c2: "#4a4a52", c3: "#4a3a2e", hc: "#1e1e24", leather: "#3a3a42", gold: "#c89a40", gem: "#c8ff6a", feather: "#8a2a22", cape: "#2a2420", pants: "#1e1e22", boots: "#141416", hair: "short", wv: "long", hairc: "#1e1a1e" },   // 스토커 — A 유리눈 가면
  caravanmaster: { head: "pioneer", body: "coat", ex: ["kerchief", "bedroll"], c1: "#d8c8a0", c2: "#a8906a", c3: "#c8322a", hc: "#ece0c4", leather: "#7a5232", feather: "#c8322a", pants: "#5a4630", boots: "#4a3020", hairc: "#5a3a22", hair: "short" },   // 캐러밴 마스터 — A 개척민
  conestoga: { head: "straw", body: "leather", ex: ["susp"], c1: "#3a5aa0", c2: "#e8c870", c3: "#2a4a8a", hc: "#e8c870", leather: "#7a5232", pants: "#4a4036", boots: "#3a2a1e", hairc: "#c89a5a", hair: "short" }    // 코네스토가 — B 푸른 짐칸
});
