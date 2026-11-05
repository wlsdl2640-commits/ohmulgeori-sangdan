"""뭉툭 아이콘 3차분."""
N3 = {
'divinity': ("""
.........w..
........w1w.
.........w..
........1111
........2222
......112222
......222222
....11222222
....22222222
..1122222222
..2222222222
112222222222""", 'holy'),
'bloodstrike': ("""
.....12.....
....12......
...12...12..
..12...12...
.12...12...1
12...12...12
....12...12.
...12...12..
..12...12...
......12....
.....12.....
....12......""", 'blood'),
'whirl': ("""
.mm..TT..mm.
mmmm.tT.mmmm
mmmmmtTmmmmm
mmmmMtTMmmmm
mmmMMtTMMmmm
mmMM.tT.MMmm
.MM..tT..MM.
.....tT.....
.....lL.....
.....lL.....
.....lL.....
.....TT.....""", 'steel'),
'bloodthirst': ("""
..rrrrrrrr..
.rrRRRRRRrr.
rrRwwwwwwRrr
rRkwkkkkwkRr
rRkkkkkkkkRr
rRkkkkkkkkRr
rrRRRRRRRRrr
.rrrrrrrrrr.
..rrrrrrrr..
...r....r...
...r........""", 'blood'),
'rampage': ("""
e..........e
ee........ee
.eE.LLLL.Ee.
..ELllllLE..
.LllllllllL.
LlrlllllllrL
.LllllllllL.
..LeeeeeeL..
..ekeeeeke..
..eeeyyeee..
...eeyyee...
....eeee....""", 'blood'),
'frenzy': ("""
.22......22.
2112....2112
21112..21112
.2112..2112.
..22....22..
............
..22....22..
.2112..2112.
21112..21112
2112....2112
.22......22.""", 'blood'),
'bloodfeast': ("""
...LLLLL....
..LlllllL...
.LlolllllL..
.LllllllLL..
.LlllllLLL..
..LLlLLLL...
...LLLLLee..
.......eeEe.
......eeEEe.
.......eEe..
........e...""", 'blood'),
'bloodlust': ("""
....3..3....
2...3333...2
22.3y33y3.22
222333333222
222233332222
.2222332222.
.22.2332.22.
.2...33...2.""", 'evil'),
'bloodmoon': ("""
...111111...
.1111111111.
111122111112
111122111122
111111112212
112211112222
112211111222
111111112222
111111122222
.1112222222.
..22222222..
...222222...""", 'blood'),
'ragnarok': ("""
..o..y..o...
...o.y.o....
....oyo.....
....LoL.....
...LLoLL....
...LLLoL....
..LLLLoLL...
..LLLLLoLL..
.LLLLLLLoLL.
.LLLLLLLLLL.
llllllllllll
LLLLLLLLLLLL""", 'blaze'),
'beastshot': ("""
.LL......LL.
LlL......LlL
.LlLLLLLLlL.
.LllllllllL.
LlkllllllklL
LllllllllllL
LlleeeeeellL
LwleekkeelwL
.wLeeeeeeLw.
..LLLLLLLL..""", 'earth'),
'trap': ("""
m.m.m..m.m.m
mMmMm..mMmMm
Mmmmm..mmmmM
.MmmmM.MmmM.
..MMmmmmMM..
....MnnM....
..nnnnnnnn..
.nMMMMMMMMn.
nnnnnnnnnnnn""", 'steel'),
'wolfcall': ("""
.2........2.
212......212
2112....2112
211222222112
222222222222
2yy222222yy2
222222222222
.22eeeeee22.
.2eekkkkee2.
..eeeeeeee..
...eeeeee...
....eeee....""", 'shadow'),
'camouflage': ("""
...ggggg....
..ggggggg...
.gwkgggggg..
ggkkggggggg.
ggggggggggg.
.GgggggggGg.
..Gg.Gg.Gggg
tttttttttg.g
TTTTTTTTTgg.""", 'heal'),
'instinct': ("""
.........rr.
........rrr.
.......rrr..
....gggrr...
...gggggg...
..ggggggggG.
.gggggggggG.
.yyyyyyyyyy.
GGGGGGGGGGGG
.GGGGGGGGGG.""", 'wood'),
'arrowstorm': ("""
....r.......
.r.rtr....r.
rtr.t....rtr
.t..t.....t.
.t..t....t..
..t.t....t..
..t.t...t...
..t.t...t...
...tt..t....
GGGGGGGGGGGG
GgGgGgGgGgGg""", 'wind'),
'jump': ("""
w....tT....w
w....tT....w
.....tT.....
.w...tT...w.
.....tT.....
....yyyy....
....mmmM....
....mmmM....
.....mM.....
.....mM.....
.....mM.....
......M.....""", 'none'),
'dragonscale': ("""
.2222222222.
211211211212
221221221222
.2112112112.
.2212212212.
211211211212
221221221222
.2112112112.
..22122122..
...211212...
....2222....""", 'earth'),
'gale': ("""
..........mw
.........mmm
..11....tmM.
.1..1..tT...
....1.tT.11.
...1.tT.1..1
....tT.....1
...tT.11....
..tT.1..1...
.tT.....1...
tT..........""", 'wind'),
'skyfall': ("""
m..........m
mm..mmmm..mm
.mmmmmmmmmm.
..mmmmmmmm..
.mmmmmmmmmM.
.mkkkkkkkkM.
.mkrkkkkrkM.
.mkkkkkkkkM.
.mmmmmmmmMM.
..mmMMMMMM..
..mM.MM.MM..""", 'steel'),
'wyvernfall': ("""
...222222...
..21111112..
..21111112..
.2211111122.
.2212212122.
.221.221.22.
.22..22..22.
.ee..ee..ee.
.ee..ee..ee.
..e...e...e.""", 'earth'),
'dragonblood': ("""
.....22.....
.....22.....
....2112....
....2112....
...211112...
..2w111112..
.2w11111112.
.2111111112.
.2111111122.
..21111222..
...222222...""", 'blood'),
'headshot': ("""
.....G......
....GGg.....
...rrGrrr...
..rrrrrrrr..
.rwrrrrrrrR.
tttttttttmmw
.rrrrrrrrRR.
.rrrrrrrRRR.
..rrrrrRRR..
...RRRRRR...""", 'blood'),
'steadyaim': ("""
....mmmm....
..mm....mm..
.m...mm...m.
.m...mm...m.
m....mm....m
mmmmmrrmmmmm
mmmmmrrmmmmm
m....mm....m
.m...mm...m.
.m...mm...m.
..mm....mm..
....mmmm....""", 'steel'),
'longshot': ("""
........rrrr
........rwwr
........rwwr
........rrrr
......m.....
.....mm.....
....t.......
...t........
..w.........
.w..........
w...........""", 'none'),
'piercearrow': ("""
.....mm.....
....mmmM....
...mmmmMM...
..mmwmmMMM..
.mmmmmmMMMM.
....nmMn....
.....tT.....
.....tT.....
.....tT.....
....rtTr....
...rrtTrr...
...r.TT.r...""", 'steel'),
'divinearrow': ("""
..w......yhw
.........yhh
......w.yY..
.......yY..w
..w...yY....
.....yY..w..
....yY......
...yY..w....
.hhY........
.hh.........
h...w.......""", 'light'),
'starfall': ("""
........y...
.......yhy..
....yyyhhhyy
.....yhhhhy.
......yhhy..
.....yy..yy.
....h.......
...h.h......
..h.h.......
.h.h........
h.h.........""", 'light'),
'godseye': ("""
.....yy.....
....yhhY....
....yhhY....
...yhhhhY...
...yhhhhY...
..yhwwwwhY..
..ywbkkbwY..
.yhwwwwwwhY.
.yhhhhhhhhY.
yyyyyyyyyyYY""", 'gold'),
'lastarrow': ("""
..........yw
.........yyy
........yyY.
.......yY...
......yY....
.....yY.....
ww..yY......
wwwyY.......
.wwww.......
..www.......""", 'holy'),
'ballad': ("""
.........TT.
........TTT.
.......tT...
......tT....
..llltT.....
.llllll.....
lllkklll....
llkkkklL....
lllkklLL....
.llllLL.....
..LLLL......""", 'music'),
'lullaby': ("""
....222.....
..2211......
.211........
211.....www.
211.......w.
211......w..
211.....www.
2211........
.22211......
..2222111...
....2222....""", 'music'),
'hymn': ("""
yyy.........
yYyyyy......
yY.w.wyyy...
yY.w.w.w.yy.
yY.w.w.w.w.y
yY.w.w.w.w.y
yY.w.w.w.wy.
yY.w.w.wyy..
yY.w.wyy....
yYyyyy......
yYY.........
YYY.........""", 'heal'),
'marchsong': ("""
.........yy.
........yhhy
y......yhhhy
yyyyyyyyhhhy
yYYYYYYYyhhY
y..yYyY.yYY.
...yY.yY..Y.""", 'gold'),
'warsong': ("""
........eeee
.......eeeeE
.......eekkE
......yyeEE.
.....eeyEE..
....eeEE....
...eeEE.....
..yyEE......
.eeE........
eeE.........
E...........""", 'blood'),
'symphony': ("""
...22222222.
...21111112.
...2......2.
...2......2.
...2......2.
.222....222.
2112...2112.
2112...2112.
.22.....22..""", 'music'),
'requiem': ("""
.....yy.....
....yyyy....
...y1111y...
...111112...
..11111122..
..11111122..
.1111111222.
.1111111222.
111111122222
yyyyyyyyyyyy
.....yy.....
.....YY.....""", 'holy'),
'overture': ("""
.EEEEEEEEEE.
EeeeeeeeeeeE
.EEEEEEEEEE.
.e22e2ee22e.
.e2ee2eee2e.
.eeeeeeeeee.
.e2e22e2e2e.
.e2eeee2eee.
.EEEEEEEEEE.
EeeeeeeeeeeE
.EEEEEEEEEE.""", 'music'),
'encore': ("""
.rr..yy..pp.
rrrr.yy.pppp
rrrryyyypppp
.rr.yyyy.pp.
..G..yy..G..
...G.GG.G...
....GGGG....
...eeeeee...
...erreere..
....eeee....
....erre....""", 'music'),
'grandfinale': ("""
........y...
.......yhy..
......yhwhy.
.......yhy..
......w.y...
.....ww.....
....ww......
...ww.......
..TT........
.TTT........
TTT.........
TT..........""", 'gold'),
'whipcrack': ("""
......llll..
.....l....l.
....l......l
...l.......l
..l.......l.
.TT......l..
TTt....ll...
TT..lll.....
....w.......""", 'wood'),
'horsecare': ("""
..mmmmmmmm..
.mmmMMMMmmm.
mmMM....MMmm
mMk......kMm
mM........Mm
mMk......kMm
mM........Mm
mMk......kMm
MM........MM
nn........nn""", 'steel'),
'gallop': ("""
w...........
.ll......ll.
lLll....llLl
lLLllllllLLl
.LLLLLLLLLL.
..LLtTTtLL..
.....TT.....
....mMMm....
....m..m....
....mmmm....""", 'wood'),
'wheelcrush': ("""
...TTTTTT...
.TTt.tt.tTT.
.Tt.t..t.tT.
Tt...tt...tT
T.t..tt..t.T
TtttyyyytttT
TtttyyyytttT
T.t..tt..t.T
Tt...tt...tT
.Tt.t..t.tT.
.TTt.tt.tTT.
...TTTTTT...""", 'wood'),
'wagonwall': ("""
..eeeeeeee..
.eeEeeEeeEe.
eeEeeEeeEeeE
eeEeeEeeEeeE
tttttttttttT
tTTTTTTTTTTT
TTTTTTTTTTTT
.Mm.....Mm..
MmmM...MmmM.
.MM.....MM..""", 'wood'),
'cargoshield': ("""
..tttTtttT..
.MMMMMMMMMM.
tttTtttTtttT
tttTtttTtttT
tttTtttTtttT
MMMMMMMMMMMM
tttTtttTtttT
tttTtttTtttT
tttTtttTtttT
.MMMMMMMMMM.
..tttTtttT..""", 'wood'),
'stampede': ("""
..tttttttttT
w.tTtTtTtTtT
.wttttttttTT
w.TTTTTTTTTT
.w...MMMM...
w...MmttmM..
....MtTTtM..
....MmttmM..
.....MMMM...""", 'wood'),
'roadlord': ("""
.....TT.....
tttttttttt..
tTTTTTTTTTt.
ttttttttttT.
.....TT.....
..tttttttttt
.tTTTTTTTTTt
..TTTTTTTTTT
.....TT.....
.....TT.....
....GTTG....
...GGGGGG...""", 'wood'),
'convoy': ("""
.....FF.....
....F..F....
...YYYYYY...
..YhhhhhhY..
..YhhyyhhY..
..YhyoryhY..
..YhyrryhY..
..YhhyyhhY..
..YhhhhhhY..
...YYYYYY...
....YYYY....""", 'gold'),
'ambush': ("""
....GGGG....
..GGggggGG..
.GggggggggG.
GggwkggwkggG
GggggggggggG
GgGggGggGggG
.GGGGGGGGGG.
..GG.mm.GG..
.....mm.....""", 'heal'),
'pathfind': ("""
...yyyyyy...
.yyeeeeeeyy.
yyee.rr.eeyy
yee..rr..eey
ye...rr...ey
ye..kkkk..ey
ye...ff...ey
yee..ff..eey
yyee.ff.eeyy
.yyeeeeeeyy.
...yyyyyy...""", 'none'),
'snare': ("""
...tttt.....
..t....t....
.t......t...
.t......t...
..t....t....
...tTTt.....
....TT......
....tt......
....tT......
....tt......
...tTt......
..tt........""", 'wood'),
'campcraft': ("""
.....r......
....roy.....
...royyo....
..royhyor...
..oyhhhyo...
..oyyhyyo...
...ooooo....
.TTttttTTT..
TttTTTTttT..
.TT....TT...""", 'fire'),
'spotweak': ("""
..mmmmm.....
.mcccccm....
mcwcccccm...
mcwcccccm...
mcccccccm...
mccccccMm...
.mcccccm....
..mmmmmMM...
.......MTT..
........TTT.
.........TTT
..........TT""", 'none'),
'volley': ("""
...r.r.r....
..rrrrrrr...
...t.t.t....
..lllllllL..
..lLllllLL..
..lllllllL..
..lLllllLL..
..lllllllL..
...lLlllL...
....LLLL....""", 'wood'),
'farsight': ("""
.........mmm
........mcmm
........mmm.
......yyyY..
.....llllL..
.....lllL...
....yyyY....
...lllL.....
...llL......
..yyY.......
.llL........
lLL.........""", 'gold'),
'mapmaker': ("""
eeeeeeeeeeeE
eeeeeEEeeeeE
eeGGeeeeeeeE
eGGGGeekeeeE
eeGGeekekeeE
eeeeekeeekeE
eeeeeeeeekEE
eebbeeeekeeE
ebbbbeerkreE
eebbeeeerreE
eeeeeeerkreE
EEEEEEEEEEEE""", 'earth'),
'drumbeat': ("""
tT......Tt..
.tT....Tt...
..eeeeeeee..
.eEeeeeeeEe.
rrrrrrrrrrrr
ryrrrrrryrrr
rrryrrrryrrr
rrrrrrrrrrrr
eeeeeeeeeeee
.EEEEEEEEEE.""", 'none'),
'summit': ("""
.....Trr....
.....Trrr...
.....T......
....www.....
...wwwww....
...w1ww11...
..111w1111..
..11121111..
.1112221112.
.1122222222.
122222222223
222222222333""", 'none'),
'poisonblade': ("""
.....mm.....
.....mmm....
....mmm.....
.....mmm....
....mmmg....
.....mmm....
....mmmg....
...YYYYYY.g.
.....tT.....
.....tT.....
.....lL.....
.....YY.....""", 'poison'),
'vanish': ("""
...222222...
.2222222222.
222222222222
222222222222
22kkkkkkkk22
22kwkkkkwk22
22kkkkkkkk22
222222222222
.2222222222.
..2.22.22.2.
...2..2..2..""", 'shadow'),
'throatcut': ("""
..mmmm......
.mmmMMm.....
mm....mM....
m......mM...
r......mM...
r......MM...
......tTT...
.....tTT....
....tTT.....
...TT.TT....
...T...T....
....TTT.....""", 'blood'),
}
