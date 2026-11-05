"""뭉툭 아이콘 1차 표본 (스킬 id → (12×12 칸, 팔레트)). 바깥 테두리는 굽기에서 붙인다."""
N1 = {
'bash': ("""
.mmmmmmmmmM.
mwmYmmmmYmMn
mmmYmmmmYMMn
MMMYMMMMYMnn
.nnnnTtnnnn.
.....tT.....
.....tT.....
.....tT.....
....kllk....
.....lL.....
.....lL.....
.....TT.....""", 'none'),
'taunt': ("""
..ssssssss..
.ssssssssssS
sksssssssskS
sskkssssskkS
sswksssskwsS
sssssssssssS
sssRRRRRRssS
ssRwwwwwwRsS
ssRRRrrRRRsS
.sRRRRRRRRS.
..SssssssS..
...SSSSSS...""", 'none'),
'ironwall': ("""
mm..mmmm..mm
mM..mMMm..mM
mmmmmmmmmmmM
nnnnnnnnnnnn
mmmnmmmmmnmM
nnnnnnnnnnnn
mnmmmmnmmmmM
nnnnnnnnnnnn
mmmnmmmmmnmM
nnnnnnnnnnnn
MnMMMMnMMMMn
nnnnnnnnnnnn""", 'steel'),
'fireball': ("""
....r..r....
...ro.ror...
..roorooor..
.roooyyooor.
rooyyhhyyoor
rooyhwwhyoor
rooyhhhhyoor
roooyyyyooor
.rooooooooR.
..RooooooR..
...RRRRRR...
............""", 'fire'),
'icelance': ("""
..........wc
.........wcc
........wccb
.......wccbb
......wccbb.
.....mcbbb..
....mM.bb...
...mM.......
..mM........
.mM.........
mM..........
M...........""", 'ice'),
'chain': ("""
....yyyyy...
....hyyyY...
...hyyyY....
...hyyY.....
..hyyyyyyy..
..yyyyyyyY..
.....yyyY...
....yyyY..y.
...yyyY..yY.
..yyY...yY..
.yY.....Y...
y...........""", 'thunder'),
'heal': ("""
.ss.ss.ss...
.ss.ss.ss.ss
.ss.ss.ss.ss
.ssssssssss.
..ssssssssS.
ss.ssgsssSS.
sss.gggssSS.
.sssggg.sSS.
..sssgssSS..
...ssssSS...
...SSSSSS...
............""", 'heal'),
'holy': ("""
.....yy.....
..y..yy..y..
...y.hh.y...
....hwwh....
yy.hwwwwh.yy
yyhwwwwwwhyy
...hwwwwh...
....hwwh....
...y.hh.y...
..y..yy..y..
.....yy.....
............""", 'holy'),
'backstab': ("""
..........mw
.........mwm
........mwM.
.......mwM..
......mwM...
.....mwM....
..Y.mwM.....
..YYwM......
...YYY......
..TlYYY.....
.TlT..Y.....
TT..........""", 'none'),
'venom': ("""
....kkkk....
....tTTt....
.....mm.....
....mggm....
...mgggGm...
..mgwggggm..
.mggwgggGGm.
.mgggggggGm.
.mGgggggGGm.
..mGGGGGGm..
...mmmmmm...
............""", 'poison'),
'aimed': ("""
...TT.......
..Tt.m......
.Tt...m.....
.Tt....m....
Tt.....mr...
Tt..kkkkkkwm
Tt..rr..mr..
Tt.....m....
.Tt...m.....
.Tt..m......
..Ttm.......
...TT.......""", 'none'),
'rain': ("""
m..m..m..m..
.T..T..T..T.
..T..T..T..T
...r..r..r..
............
.m..m..m..m.
..T..T..T..T
...T..T..T..
....r..r..r.
............
GGGGGGGGGGGG
GgGgGgGgGgGg""", 'none'),
'throwjunk': ("""
............
tttttttttT..
tTTTTTTTTT.w
tTtttttTtT..
tT.tttT.tTw.
tTt.tT.ttT..
tTtt..tttT.w
tTt.tT.ttT..
tT.tttT.tTw.
tTtttttTtT..
tTTTTTTTTT..
TTTTTTTTTT..""", 'wood'),
'sturdy': ("""
...eEeEeE...
..eeEeEeEe..
...kkkkkk...
..lllllllL..
.lllllllllL.
.llllyylllL.
.LLLLyyLLLL.
LlLlllllLlLL
LlLlllllLlLL
LlLlllllLlLL
LLLLLLLLLLLL
.LLLLLLLLLL.""", 'wood'),
'sprint': ("""
..........w.
.lllll...w..
.lLLLl......
.llllL..w...
.lllll......
.llllll..ww.
.lllllllll..
.llllllllll.
.LLLLLLLLLL.
............
.nnnnnnnnnn.
............""", 'wind'),
'roar': ("""
..oooooooo..
.oooyyyyooo.
ooyyyyyyyyoo
oykkyyyykkyo
oyyyyyyyyyyo
oyyyykkyyyyo
ooyyRRRRyyoo
ooyRwwwwRyoo
.ooyRRRRyoo.
.oooyyyyooo.
..oooooooo..
...oooooo...""", 'none'),
'deadeye': ("""
.FF......FF.
.FfF....FfF.
.FffFFFFffF.
FffffffffffF
FkkkkffkkkkF
kyyykffkyyyk
kykykffkykyk
kyyykYYkyyyk
FkkkfYYfkkkF
.FfffffffF..
.FFfFFfFFF..
..FFFFFFFF..""", 'shadow'),
'assassinate': ("""
..eeeeeeee..
.eeeeeeeeeE.
eeeeeeeeeeeE
eekkkeekkkeE
eekrkeekrkeE
eekkkeekkkEE
eeeeeEEeeeEE
.eeeeEEeeeE.
..eEeEeEeE..
..ekekekeE..
...EEEEEE...
............""", 'none'),
'dragonfall': ("""
r.........r.
rr........rr
.rr.oooo.rr.
..rooooooor.
..oyoooyoo..
.oowkooowko.
.ooooooooooR
.ooRRRRRRooR
..oRwRRwRoR.
...oooooooR.
....RRRRRR..
............""", 'blaze'),
'grandcaravan': ("""
.yy.........
yyyY........
yYyy..yY....
.yYy.yyyY...
.yyYyyyyyY..
.yyyyyyyyyY.
..yyyyyyyyY.
..yYYYYYYyY.
..yY.....yY.
..yY.....yY.
..yY.....yY.
..YY.....YY.""", 'gold'),
'finale': ("""
..yyyyyyyy..
yy.yhyyyyY.Y
Yy.hyyyyyY.Y
.Y.yyyyyYY.Y
..YyyyyyYYY.
...YyyyyYY..
....YyyYY...
.....yY.....
....yyYY....
...yyyyYY...
..YYYYYYYY..
..YYYYYYYY..""", 'gold'),
'resurrect': ("""
....yyyy....
...yhyyyY...
..yy....yY..
..yY....yY..
..yY....yY..
...yY..yY...
yyyyyyyyyyyY
yhhhhyyyyyYY
YYYYYyYYYYYY
.....yY.....
.....yY.....
.....YY.....""", 'gold'),
'quarantine': ("""
...dddddd...
..dddddddd..
dddddddddddd
.FFFFFFFF...
.FccFFFFF...
.FcwFFFFFFF.
.FFFFFFFFFFF
.FFFFFFFFFFF
..FFFFFFFFF.
...FFFFF....
...FFFFF....
............""", 'none'),
'grace': ("""
............
.ww.........
wwww..www...
.wwwwwwwww..
..wwwwwwwwwy
.wwwwwwwwwk.
wwwwwwwwww..
.ffwwwwwf...
...wwwff....
..Gk........
..g.........
............""", 'holy'),
}
