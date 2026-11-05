"""손그림 상징 모음. 각각 (줄들, 팔레트). 글자 1·2·3은 속성 색으로 바꿔 쓰는 자리.
기본 글자(b4.FIX): k 검정 · w 흰 · m/M/n 쇠 · y/Y 금 · t/T 나무 · l/L 가죽 · e/E 뼈 · f/F/d 회색 · r/R 빨강 · g/G 초록 · b/B 파랑 · c 하늘 · p/P 보라 · o 주황 · s/S 살갗 · h 연노랑 · u/U 분홍 · a/A 얼음"""
GOLD = {'y': ('#ffd84a', 6), 'Y': ('#c08a1c', 6)}
DAGGER_UR = (['........w',
              '.......wM',
              '......wM.',
              '.....wM..',
              '...ywM...',
              '....y....',
              '...l.y...',
              '..L......',
              '.y.......'], dict(GOLD))
SKULL = (['..eeee..',
          '.eeeeeE.',
          'eeeeeeeE',
          'ekkeekkE',
          'ekkeekkE',
          '.eeekeE.',
          '..eEeE..',
          '..eEeE..'], {})
HEART = (['.11..11.', '11111111', '1w111112', '.111122.', '..1122..', '...22...'], {'1': ('#ee3448', 13), '2': ('#a8182c', 13)})
CROSS = (['..11..', '..11..', '111111', '111112', '..12..', '..22..'], {})
DROP = (['..1..', '..1..', '.111.', '11112', '1w112', '11122', '.122.'], {})
SNOW = (['...w...', '.w.w.w.', '..wcw..', 'wwcccww', '..wcw..', '.w.w.w.', '...w...'], {'c': ('#bfefff', 1)})
POTION = (['..lll..',
           '..ccc..',
           '.cc1cc.',
           'c11111c',
           'c1w111c',
           'c111112',
           'c111122',
           '.c1222.',
           '..ccc..'], {'c': ('#d8f4ff', 12), 'l': ('#b87a48', 9)})
BOOT = (['hhhh....',
         'llll....',
         'llll....',
         'lllL....',
         'llllll..',
         'lllllll.',
         'lllllllL',
         'LLLLLLLL'], {'h': ('#f4e0b0', 7), 'l': ('#c07a3a', 9), 'L': ('#6a3a1a', 9)})
WING_L = (['......w',
           '....wwf',
           '..wwwff',
           '.wwwfff',
           'wwwfff.',
           '.wfff..',
           '..ff...'], {'f': ('#c8d4f0', 5)})
SHRINE = (['....y....',
           '...yyy...',
           '..yyyyY..',
           '.yyyyyYY.',
           'eeeeeeeeE',
           '.e.e.e.E.',
           '.e.e.e.E.',
           '.e.e.e.E.',
           'eeeeeeeEE'], dict(GOLD))
HAMMER = (['.mmmmmmM.',
           'wmmmmmmMM',
           'mmmmmmmMn',
           '.MMMMMMn.',
           '....tT...',
           '....tT...',
           '....tT...',
           '....lL...',
           '....lL...',
           '....yY...'], dict(GOLD))
SPROUT = (['.......gg',
           '.gg...gGG',
           'gGGg..gG.',
           '.gGGgGG..',
           '....gG...',
           '....gG...',
           '...tttT..'], {'g': ('#7ae05a', 8), 'G': ('#2e9a3e', 8)})
BOMB = (['.......',
         '....tt.',
         '..nnt..',
         '.nddnn.',
         'nddddnn',
         'ndwddnn',
         'nddddnn',
         '.nnnnn.'], {'n': ('#4a4a58', 11), 'd': ('#2a2a34', 11)})
EYE = (['..kkkkk..',
        '.kwwwwwk.',
        'kwww12wwk',
        'kww1322wk',
        'kww2332wk',
        '.kww22wk.',
        '..kkkkk..'], {})
MOON_C = (['..111.', '.11...', '11....', '11....', '11....', '.11...', '..111.'], {})
SUN = (['..1..1..', '...11...', '1.1111.1', '.111111.', '.111111.', '1.1111.1', '...11...', '..1..1..'], {})
BACKPACK = (['...tTtTt...',
             '..tTtTtTt..',
             '..TTTTTTT..',
             '.lllllllll.',
             '.lLLLLLLLl.',
             '.ll.yYy.lL.',
             '.lllllllll.',
             '.lllllllll.',
             '.llfllllfL.',
             '.lLLLLLLLL.',
             '.lL.lllLLL.',
             '.lLLLLLLLL.',
             '..LLLLLLL..'], {'t': ('#e0c08a', 3), 'T': ('#a07a4a', 3), 'l': ('#a8642e', 9), 'L': ('#6a3a1a', 9), 'f': ('#5a3010', 9), 'y': ('#ffd84a', 6), 'Y': ('#c08a1c', 6)})
CRATE = (['tttttT', 'tTttTT', 'ttTTtT', 'tTttTT', 'TTTTTT'], {'t': ('#d09a5a', 3), 'T': ('#8a5a2a', 3)})
SACK = (['..l..', '.lyl.', 'lllll', 'llllL', 'lllLL', '.LLL.'], {'l': ('#d8b880', 9), 'L': ('#9a7a48', 9), 'y': ('#8a5a2a', 9)})
POT = (['.ooo.', 'ooooO', 'oOOOO', 'ooooO', '.OOO.'], {'o': ('#d0703a', 14), 'O': ('#8a3a1a', 14)})
COIN = (['.yy.', 'yhyY', 'yyYY', '.YY.'], {'y': ('#ffd84a', 6), 'Y': ('#c08a1c', 6), 'h': ('#fff6c8', 1)})
MULE = (['F......F..',
         'FF....FF..',
         '.FF..FF...',
         '..FFFF....',
         '..FFFFF...',
         '.FFkFFFF..',
         '.FFFFFFFF.',
         '..FFFFFFFF',
         '...FFFffff',
         '....Fffkff',
         '.....fffff',
         '......fff.'], {'F': ('#8a6a50', 3), 'f': ('#c8b098', 3), 'k': ('#1a1414', 1)})
WAGON = (['...eeeeeeee...',
          '..eeeeeeeeee..',
          '.eeeeeeeeeeee.',
          '.eEeeEeeEeeEe.',
          '.tttttttttttt.',
          '.TTTTTTTTTTTT.',
          '..dd......dd..',
          '.dffd....dffd.',
          '..dd......dd..'], {'e': ('#f4ecd8', 7), 'E': ('#c8b898', 7), 't': ('#c08a4a', 3), 'T': ('#7a4c22', 3), 'd': ('#4a3020', 3), 'f': ('#c08a4a', 3)})
ARMFLEX = (['........mmm.',
            '.......mwmmM',
            '.......mmmMM',
            '.......mmMMM',
            '........mMM.',
            '........mMM.',
            '...mmm..mMM.',
            '..mwmmm.mMMn',
            '.mmmmmmmmMMn',
            'mmmmmmmmmMMn',
            'mmmmmmmmMMn.',
            'MMMMMMMMnn..'], {})
RUNNER = (['.....ww.',
           '.....ww.',
           '...wwww.',
           '..ww.www',
           '..w.wwf.',
           '....ww..',
           '...www..',
           '..ww.ww.',
           '.ww...ww',
           'ww......'], {'w': ('#ffffff', 7), 'f': ('#c8d0e0', 7)})
MEDITATE = (['....kkkk....',
             '....ssss....',
             '....SssS....',
             '.....ss.....',
             '...bbbbbb...',
             '..bbbbbbbb..',
             '.bb.bbbb.bb.',
             '.s..bbbb..s.',
             'bbbbbbbbbbbb',
             'BBBBBBBBBBBB'], {'s': ('#f4c494', 2), 'S': ('#c88a5a', 2), 'b': ('#5a8ad8', 12), 'B': ('#2e4e94', 12), 'k': ('#3a2a1a', 1)})
HOURGLASS = (['yyyyyyy', '.c111c.', '.c111c.', '..c1c..', '...c...', '..c.c..', '.c.1.c.', '.c111c.', 'yyyyyyy'], {'y': ('#ffd84a', 6), 'c': ('#d8f4ff', 12), '1': ('#ffe0a0', 7)})
KNIGHT = (['....ww...',
           '...wwwww.',
           '..wwkwwww',
           '..wwwwwww',
           '.wwww..ww',
           'wwwww....',
           '.wwwww...',
           '..wwwww..',
           '..wwwww..',
           '.fffffff.',
           'fffffffff'], {'w': ('#f4f0e8', 7), 'f': ('#b8b0a0', 7)})
METRONOME = (['....y....', '....T....', '...tTt...', '..ttyTt..', '..ttyTt..', '.tttyTTt.', '.ttyttTt.', 'tttyTTTTt', 'TTTTTTTTT'], {'t': ('#c08a4a', 3), 'T': ('#7a4c22', 3), 'y': ('#ffd84a', 6)})
FIRSTAID = (['...ll...', '..l..l..', 'wwwwwwww', 'wwwrrwwf', 'wwrrrrwf', 'wwwrrwwf', 'wwwwwwff', 'ffffffff'], {'w': ('#ffffff', 7), 'f': ('#c0c8d4', 7), 'r': ('#e83a3a', 13), 'l': ('#8a94a8', 5)})
BANDAGE = (['..eeee....', '.eeEEee...', 'eeEkkEee..', 'eEk..kEe..', 'eEk..kEeee', 'eeEkkEeeee', '.eeEEee...', '..eeee....'], {'e': ('#f8f4ec', 7), 'E': ('#c8c0b0', 7), 'k': ('#8a7a6a', 7)})
HAND_UP = (['.s.s.s..', '.s.s.s.s', '.s.s.s.s', 'sssssss.', 'sssssss.', '.sssss..', '..sss...', '..SSS...'], {'s': ('#f4c494', 2), 'S': ('#c88a5a', 2)})
DWHAMMER = (['mmmmmmmmmmM', 'mwmmmmmmmMM', 'mmyymmyymMM', 'mmmmmmmmmMn', '.MMMMMMMMn.', '....tT.....', '....tT.....', '....tT.....', '....yY.....', '....tT.....'], {'y': ('#ffd84a', 6)})
TORSO = (['....mmmm....',
          '.mmmmmmmmmm.',
          'mwmmmMMmmmMM',
          'mmmmmMMmmmMM',
          'mmmmmMMmmmMn',
          '.mMMMMMMMMn.',
          '..mmmMMmmn..',
          '..mMMMMMMn..',
          '..mmmMMmmn..',
          '..mMMMMMMn..',
          '...mmMMmn...',
          '...MMMMnn...'], {})
AXE = (['.....tT...',
        '.mm..tT...',
        'wmmm.tT...',
        'wmmmmtT...',
        'wmmmmtT...',
        'wmmmmtT...',
        'wmmm.tT...',
        '.mm..tT...',
        '.....tT...',
        '.....tT...',
        '.....lL...',
        '.....lL...',
        '.....yY...'], dict(GOLD))
TROPHY = (['..yyyyyyyy..',
           'yyyhyyyyyYyy',
           'y.yyyyyyyY.y',
           'y.yyyyyyyY.y',
           '.yyyyyyyyYy.',
           '...yyyyyY...',
           '....yyyY....',
           '.....yY.....',
           '.....yY.....',
           '...yyyyYY...',
           '..YYYYYYYY..'], {'y': ('#ffd84a', 6), 'Y': ('#c08a1c', 6), 'h': ('#fff6c8', 1)})
COLOSSEUM = (['..ssssss....',
              '.sdsdsdsd...',
              'ssssssssssss',
              'sdsdsdsdsdsd',
              'sdsdsdsdsdsd',
              'ssssssssssss',
              'sdsdsdsdsdsd',
              'sdsdsdsdsdsd',
              'SSSSSSSSSSSS'], {'s': ('#e8c890', 7), 'S': ('#a8844a', 7), 'd': ('#5a3a1a', 1)})
TOWER = (['....rr....',
          '....rrr...',
          '....t.....',
          'f.ff.ff.f.'[:10],
          'ffffffffff',
          '.ffffffFF.',
          '.ffffffFF.',
          '.fffddfFF.',
          '.fffddfFF.',
          '.ffffffFF.',
          '.ffffffFF.',
          '.fffddfFF.',
          '.ffdddDFF.',
          'FFFFFFFFFF'], {'f': ('#c4c4cc', 11), 'F': ('#74747e', 11), 'd': ('#2a2a34', 1), 'D': ('#2a2a34', 1), 'r': ('#e83a3a', 13), 't': ('#7a4c22', 3)})
HORSE = (['...FF.......',
          '...FFF......',
          '..kFFFF.....',
          '.kkFFwFF....',
          '.kkFeFwFF...',
          'kkkFFFFwFF..',
          'kkFFFFFFwFF.',
          'kkFFrFFFFwFF',
          'kkFF..rrFFwF',
          'kFF.....FFFF',
          'kF......FkFF',
          '.F.......FF.'], {'F': ('#a8683a', 3), 'k': ('#2a1a10', 1), 'w': ('#f4ecd8', 7), 'e': ('#1a1414', 1), 'r': ('#c83030', 13)})
HAND = (['...s.s...',
         '.s.s.s.s.',
         '.s.s.s.s.',
         '.sssssss.',
         '.sssssss.ss',
         '.ssssssss.',
         '.sssssss..',
         '..sssss...',
         '..SSSSS...'], {'s': ('#f4c494', 2), 'S': ('#c88a5a', 2)})
PRAY = (['...ss...',
         '...ss...',
         '..ssSs..',
         '..ssSs..',
         '.sssSss.',
         '.sssSss.',
         'ssssSsss',
         'ssssSsss',
         '.sssSss.',
         '..bbBb..',
         '.bbbbBB.'], {'s': ('#f4c494', 2), 'S': ('#b87a4a', 2), 'b': ('#e8e0f0', 7), 'B': ('#a8a0c0', 7)})
GOBLET = (['yyyyyyyy', 'yrrrrrrY', 'yrhrrrrY', '.yrrrrY.', '..yyYY..', '...yY...', '...yY...', '..yyYY..', '.yyyyYY.'], {'y': ('#ffd84a', 6), 'Y': ('#c08a1c', 6), 'r': ('#c01828', 1), 'h': ('#ff6a6a', 1)})
FANGS = (['..rrrrrrrr..',
          '.rwwwwwwwwr.',
          'rwwkwkkwkwwr',
          'rkkwkkkkwkkr',
          'rkkkkkkkkkkr',
          'rkkwkkkkwkkr',
          'rwwkwkkwkwwr',
          '.rwwwwwwwwr.',
          '..rrrrrrrr..'], {'r': ('#c01828', 13), 'k': ('#3a0408', 1), 'w': ('#fff8f0', 7)})
BAT = (['k.....k', 'kk.k.kk', '.kkkkk.', '..k.k..'], {'k': ('#1a0a10', 1)})
NOTE1 = (['..1..', '..11.', '..1.1', '..1..', '111..', '111..'], {})
NOTE2 = (['..11111', '..1...1', '..1...1', '..1...1', '111.111', '111.111'], {})
LUTE = (['.......tT.',
         '......tT..',
         '.....tT...',
         '....tT....',
         '..oooo....',
         '.oooooo...',
         'ooookooo..',
         'oookkooO..',
         'ooooooOO..',
         '.ooooOO...',
         '..OOOO....'], {'o': ('#e0904a', 3), 'O': ('#9a5a24', 3), 'k': ('#3a1a0a', 1), 't': ('#7a4c22', 3), 'T': ('#4a2a10', 3)})
HARP = (['yy.......',
         'yyy......',
         'y.yy.....',
         'y.w.yy...',
         'y.w.w.yy.',
         'y.w.w.w.Y',
         'y.w.w.w.Y',
         'y.w.w.w.Y',
         'yyyyyyyyY'], {'y': ('#ffd84a', 6), 'Y': ('#c08a1c', 6), 'w': ('#ffffff', 1)})
DRUM = (['w.......w', '.w.....w.', '..w...w..', 'eeeeeeeee', 'rEeeeeeEr', 'rrwrrrwrr', 'rwrwrwrwr', 'rrrrrrrRR', '.RRRRRRR.'], {'e': ('#f4ecd8', 7), 'E': ('#c8b898', 7), 'r': ('#d03a3a', 13), 'R': ('#8a1a1a', 13), 'w': ('#ffd84a', 6)})
TRUMPET = (['..........yy', '.yYy.....yyy', 'yyyyyyyyyyyy', 'yyyyyyyyyyyY', '.......yyyyY', '........YYY.', '.........YY.'], {'y': ('#ffd84a', 6), 'Y': ('#c08a1c', 6)})
CANDLE = (['...h...', '..hwh..', '..hyh..', '...y...', '..eee..', '..eeE..', '..eeE..', '..eeE..', '..eeE..', '.yyyYY.'], {'h': ('#ffc040', 1), 'w': ('#ffffff', 1), 'y': ('#ffd84a', 6), 'Y': ('#c08a1c', 6), 'e': ('#f4ecd8', 7), 'E': ('#c8b898', 7)})
WOLF = (['...........F',
         '..........FF',
         '.........FFF',
         '..F.....FFF.',
         '..FF...FFFF.',
         '..FFF.FFFF..',
         '.FFFFFFFF...',
         '.FFFFeFFF...',
         'FFFFFFFF....',
         'FFFFFFF.....',
         'FFFfFF......',
         'FFffF.......',
         'Fff.........'], {'F': ('#9aa4b8', 5), 'f': ('#e0e8f4', 5), 'e': ('#1a1414', 1)})
BOAR = (['..kk.....kk.',
         '.kFFk...kFFk',
         '.kFFFkkkFFFk',
         'kFFFFFFFFFFk',
         'kFeFFFFFFeFk',
         'kFFFFFFFFFFk',
         '.kFFffffFFk.',
         'wkFfkffkfFkw',
         'w.kFffffFk.w',
         '...kkkkkk...'], {'F': ('#6a4a34', 3), 'f': ('#c89a7a', 2), 'k': ('#2a1a10', 1), 'e': ('#ff4a3a', 1), 'w': ('#fff8f0', 7)})
BEARTRAP = (['m.m.m..m.m.m', 'mmmmm..mmmmm', 'mMMMMmmMMMMm', '.mMMMMMMMMm.', '..nnnnnnnn..', '...nnMMnn...', 'nnnnnnnnnnnn'], {})
PAW = (['.11...11.', '1111.1111', '.11...11.', '11.....11', '111...111', '...111...', '..11111..', '.1111111.', '.1111111.', '..11111..'], {})
SPEAR_DN = (['....yY....', '....tT....', '....tT....', '....tT....', '....tT....', '....tT....', '....tT....', '...yyYY...', '...mmMM...', '...wmMM...', '....mM....', '....wM....', '.....M....'], dict(GOLD))
WYVERN = (['F..............F',
           'Fp............pF',
           '.Fpp...FF...ppF.',
           '.Fppp.FFFF.pppF.',
           '..FpppFFFFpppF..',
           '...FppFFFFppF...',
           '....FFFFFFFF....',
           '......FFFF......',
           '......FFFF......',
           '.......FF.......',
           '......FrrF......',
           '.......FF.......'], {'F': ('#4a2a4a', 10), 'p': ('#b05a7a', 10), 'r': ('#ffd040', 1)})
SCOPE_EYE = (['...kkkk...', '.kk1111kk.', 'k1111k111k', 'k111kkk11k', 'kkkkk2kkkk', 'k111kkk11k', 'k1111k111k', '.kk1111kk.', '...kkkk...'], {})
TRI_EYE = (['......y......', '.....yyy.....', '....yy.yy....', '...yykkkyy...', '..yykwe1kyy..', '..yyk111kyy..', '.yyy.kkk.yyy.', 'yyyyyyyyyyyyy'], {'y': ('#ffd84a', 6), 'k': ('#1a1414', 1), 'e': ('#ffffff', 1), '1': ('#3a8ad0', 1), 'w': ('#ffffff', 1)})
HORSESHOE = (['.mmm..mmm.', 'mmMM..MMmm', 'mM......Mm', 'mM......Mm', 'mM......Mm', 'mM......Mm', '.mM....Mm.', '.mmM..Mmm.', '..mmmmmm..', '...MMMM...'], {})
WHEEL = (['...tttt...', '.ttTtTtTt.', '.t.tTTt.t.', 'tT.tTTt.Tt', 'ttttyyTTTt', 'tTTTyyTTTT', 'tT.tTTt.TT', '.t.tTTt.T.', '.TTTtTTTT.', '...TTTT...'], {'t': ('#c08a4a', 3), 'T': ('#7a4c22', 3), 'y': ('#ffd84a', 6)})
SPYGLASS = (['..........yy', '.........yccY', '........yYcY.', '.......lLYY..', '......lLl....', '.....lLl.....', '....yYl......', '...yYY.......', '..lLl........', '.lLl.........', 'lLl..........'], {'y': ('#ffd84a', 6), 'Y': ('#c08a1c', 6), 'l': ('#a8642e', 9), 'L': ('#6a3a1a', 9), 'c': ('#bff0ff', 1)})
COMPASS = (['...yyyy...', '.yyeeeeyy.', '.yeeereeY.', 'yeeerreeeY', 'yeeerweeeY', 'yeeewbeeeY', 'yeeebbeeeY', '.yeeebeeY.', '.yYeeeeYY.', '...YYYY...'], {'y': ('#ffd84a', 6), 'Y': ('#c08a1c', 6), 'e': ('#f4ecd8', 7), 'r': ('#e83a3a', 1), 'b': ('#3a4a8a', 1), 'w': ('#ffffff', 1)})
NOOSE = (['....tT....', '....tT....', '....tT....', '...tttT...', '..tT..tT..', '.tT....tT.', '.tT....tT.', '.tT....tT.', '..tT..tT..', '...tTtT...'], {'t': ('#d8b070', 3), 'T': ('#8a6a3a', 3)})
TENT = (['......y.......', '.....eE.......', '....eeEE......', '...eeekEE.....', '..eeekkkEE....', '.eeeekkkEEE...', 'eeeeekkkEEEE..'], {'e': ('#e8c890', 7), 'E': ('#a8844a', 7), 'k': ('#2a1a10', 1), 'y': ('#e83a3a', 13)})
MAGNIFY = (['..mmmm....', '.mcccMm...', 'mcwccccM..', 'mccccccM..', 'mccccccM..', '.mcccMMM..', '..MMMMtT..', '......tT..', '.......tT.', '........tT'], {'c': ('#bfe8ff', 1), 'w': ('#ffffff', 1), 't': ('#7a4c22', 3), 'T': ('#4a2a10', 3)})
MAPSCROLL = (['tTttttttttT', 'teeeeeeeeeT', 'teekeeeeeeT', 'tee.k.eerreT'[:11], 'teeeee.reeT', 'teeegee.eeT', 'teeggeeeeeT', 'teeeeeeeeeT', 'tTttttttttT'], {'t': ('#c08a4a', 3), 'T': ('#7a4c22', 3), 'e': ('#f0e0b8', 7), 'k': ('#8a6a3a', 7), 'r': ('#e83a3a', 1), 'g': ('#6ab04a', 8)})
TDRUM = (['eeeeeeeeee', 'eEeeeeeeEe', 'lrlrlrlrlr', 'rlrlrlrlrl', 'llrllrllrL', 'lrlrlrlrlL', 'rlrlrlrlrL', 'lLLLLLLLLL', '.LLLLLLLL.'], {'e': ('#f0e0c0', 7), 'E': ('#c8b080', 7), 'l': ('#b86a34', 9), 'L': ('#6a3a1a', 9), 'r': ('#e8d0a0', 7)})
HOOD = (['....kkkk....', '...kkkkkk...', '..kkkkkkkk..', '.kkkqqqqkkk.', '.kkqqqqqqkk.', 'kkkqrqqrqkkk', 'kkkqqqqqqkkk', 'kkkkqqqqkkkk', 'kkkkkkkkkkkk', '.kkkkkkkkkk.'], {'k': ('#2a2438', 10), 'q': ('#0a080e', 1), 'r': ('#ff3a3a', 1)})
KRIS = (['.........w', '........wM', '.......wM.', '......Mw..', '.....wM...', '....Mw....', '..ywM.....', '...y......', '..l.y.....', '.L........', 'y.........'], {'y': ('#ffd84a', 6), 'w': ('#c0f0a0', 5), 'M': ('#5a9a3a', 5), 'l': ('#7a2a8a', 9), 'L': ('#4a1a5a', 9)})
NINJA = (['...kkk....', '..kkkkk...', '..kqrqk...', '..kkkkk...', '.kkkkkkk..', 'kk.kkk.kk.', 'k..kkk..k.', '...kkk....', '..kk.kk...', '..k...k...', '.kk...kk..'], {'k': ('#2a2040', 1), 'q': ('#0a080e', 1), 'r': ('#ff3a3a', 1)})
MASK = (['..kkkkkkkk..', '.kkkkkkkkkk.', 'kkkkkkkkkkkk', 'ksssssssssk.'[:12], 'kswrsssrwsk.'[:12], 'ksssssssssk.'[:12], 'kkkkkkkkkkkk', 'kkkkkkkkkkkk', '.kkkkkkkkkk.', '..kkkkkkkk..'], {'k': ('#2a2030', 10), 's': ('#e8c090', 2), 'w': ('#ffffff', 1), 'r': ('#e83a3a', 1)})
SCYTHE = (['..wmmmm.....', '.wmmmmmMm...', 'wmM....tMm..', 'm......t.Mm.', '.......t..M.', '......t.....', '......t.....', '.....t......', '.....t......', '....t.......', '....t.......', '...t........', '...T........'], {'t': ('#5a3a2a', 3), 'T': ('#3a2010', 3)})
CROWN_D = (['q...qq...q', 'p...pp...p', 'pp.pppp.pp', 'pppppppppp', 'pppprrpppP', 'pppprrpppP', 'PPPPPPPPPP'], {'p': ('#7a4ab0', 10), 'P': ('#3a1a6a', 10), 'q': ('#c0a0ff', 1), 'r': ('#ff3a6a', 1)})
FOOT = (['.11.', '1111', '1111', '.11.', '....', '.11.', '.11.'], {})
WHIP = (['ll..........', 'lL..........', '.lL.........', '.lL.........', '..tT........', '...t.....ttt', '...t...tt...', '....t.t.....', '.....t......'], {'l': ('#7a4a2a', 9), 'L': ('#4a2a10', 9), 't': ('#a8743a', 3), 'T': ('#6a4a2a', 3)})
RAPIER = (['..........w', '.........wM', '........wM.', '.......wM..', '......wM...', '.....wM....', '...yyM.....', '..y.y......', '.y.yy......', '..l........', '.y.........'], dict(GOLD))
DANCESHOE = (['......uu..', '.....u..u.', '....u...u.', '...uuuuu..', '..uUUUUUu.', '.uUUUUUUU.', 'uUUUUUUUU.', 'UUUUUUUU..'], {'u': ('#ffb0d0', 16), 'U': ('#d0508a', 16)})
PADLOCK = (['..mmmmm...', '.mM...Mm..', '.m.....m..', '.m.....m..', 'yyyyyyyyY.', 'yhyyyyyYY.', 'yyyykyyYY.', 'yyyykyyYY.', 'yyyyyyyYY.', 'YYYYYYYYY.'], {'y': ('#ffd84a', 6), 'Y': ('#c08a1c', 6), 'h': ('#fff6c8', 1), 'k': ('#1a1414', 1)})
CHEST = (['.tttttttttt.', 'tTTTTTTTTTTt', 'tttttyyttttt', 'TTTTTyyTTTTT', 'ttttttttttTT', 'tttttttttTTT', 'TTTTTTTTTTTT'], {'t': ('#c08a4a', 3), 'T': ('#7a4c22', 3), 'y': ('#ffd84a', 6)})
GLOVE = (['......cc..', '.....cwcc.', '......cc..', '.kk.kk....', '.kk.kk.k..', 'kkkkkkkkk.', 'kkkkkkkk..', 'kkkkkkkk..', '.kkkkkk...', '.kkkkkk...', '.qqqqqq...'], {'k': ('#2a2438', 9), 'q': ('#5a4a7a', 9), 'c': ('#9ae8ff', 1), 'w': ('#ffffff', 1)})
TOPHAT = (['...kkkkkk...', '...kkkkkk...', '...kkkkkk...', '...rrrrrr...', 'kkkkkkkkkkkk', '............', '..kkkkkkkk..', '.kkwkkkkwkk.', '..kkk..kkk..'], {'k': ('#1e1a26', 1), 'r': ('#c01828', 1), 'w': ('#ffffff', 1)})
CLOVER = (['..gg..gg..', '.gGGggGGg.', '.gGgggGGg.', '..gggggg..', 'gggg..gggg', 'gGGg..gGGg', 'gGgg..ggGg', '.gg.tt.gg.', '.....t....', '....t.....'], {'g': ('#6ad04a', 8), 'G': ('#3a9a2a', 8), 't': ('#3a7a2a', 8)})
DIAMOND = (['..cccccc..', '.cwccccaa.', 'cwcccaaaAA', '.ccaaaaAA.', '..caaaAA..', '...aaAA...', '....aA....'], {'c': ('#e0f8ff', 12), 'a': ('#8ad8ff', 12), 'A': ('#3a8ad0', 12), 'w': ('#ffffff', 1)})
VOODOO = (['...lll...', '..lllll..', '..lklkl..', '..lllll..', '...lll...', 'lllllllll', '.lllllll.', '..lllll..', '..lllll..', '..ll.ll..', '.lll.lll.'], {'l': ('#c8a070', 9), 'k': ('#2a1a10', 1)})
GHOST = (['...wwww...', '..wwwwww..', '.wwwwwwww.', '.wkkwwkkw.', '.wkkwwkkw.', '.wwwwwwww.', '.wwwwwwww.', '.wwwwwwww.', '.ww.ww.ww.', '.w...w..w.'], {'w': ('#d8f0ff', 7), 'k': ('#1a2a4a', 1)})
LEAF = (['....gg', '..gggG', '.ggggG', 'gggGG.', 'ggGG..', 'G.....'], {'g': ('#7ad05a', 8), 'G': ('#3a8a2a', 8)})
CLAW = (['k...k...k.', 'k..k...k..', '.k.k..k...', '.kkkkkk...', '..kkkkkk.k', '..kkkkkkk.', '...kkkkk..', '...kkkk...', '...kkkk...'], {'k': ('#3a2450', 10)})
BULLHEAD = (['e..........e', 'ee........ee', '.eeFFFFFFee.', '..FFFFFFFF..', '.FFrFFFFrFF.', '.FFFFFFFFFF.', '..FFFFFFFF..', '..FFffffFF..', '...fkffkf...', '....ffff....'], {'e': ('#f0e0c0', 7), 'F': ('#6a3a2a', 3), 'f': ('#a8785a', 3), 'r': ('#ff4a3a', 1), 'k': ('#1a1414', 1)})
PELT = (['l.........l', 'lll.....lll', '.lllllllll.', '..lLlllLl..', '..llllLll..', '..lLlllll..', '..lllLlLl..', '.lllllllll.', 'lll.....lll', 'l.........l'], {'l': ('#c08a5a', 9), 'L': ('#7a4a2a', 9)})
DRAGONSKULL = (['e.........e.', 'ee.......ee.', '.eeeeeeeee..', '.eekkeeeeee.', 'eeekkeeeeeee', 'eeeeeeeeeeeE', '.eeeeeEeEeEE', '..eEeEeEeE..', '...E.E.E....'], {'e': ('#f0e8d8', 7), 'E': ('#b0a080', 7), 'k': ('#ff6a1a', 1)})
DOGHEAD = (['..FF......', '.FFFF.....', 'FFFFFFF...', 'FFFeFFFF..', 'LFFFFFFFFk', 'LLFFFFFFFF', 'LLFFFFfff.', '.LFFFrr...', '..FFF.....'], {'F': ('#b07a4a', 3), 'L': ('#6a4022', 3), 'f': ('#e0c8a8', 3), 'e': ('#1a1414', 1), 'k': ('#1a1414', 1), 'r': ('#e83a5a', 1)})
KAIJU = (['....k.k.k.......', '...kkkkkkk......', '..kkkkkkkkk.....', '..kkrkkkkkkk....', '.kkkkkkkkkkkk...', '.kkk..kkkkkkkk..', 'kkk...kkkkkkkkk.', 'kk....kkkkkkkkkk', '.....kkkkkkkkkkk', '....kkkk...kkkk.', '....kkk.....kkk.'], {'k': ('#1e1a2a', 1), 'r': ('#ff4a1a', 1)})
HARPOON = (['............w', '..........wwM', '...........mM', '.........wmM.', '........MmM..', '.......tM.M..', '......t......', '.....t.......', '....t........', '...t.........', '..m..........', '.m.m.........', 'm...m........'], {'t': ('#8a5a2a', 3)})
TNT = (['.t..t..t..', '.t..t..t..', 'rrRrrRrrRr', 'rrRrrRrrRR', 'yyyyyyyyyy', 'rrRrrRrrRR', 'rrRrrRrrRR', 'RRRRRRRRRR'], {'r': ('#e8483a', 13), 'R': ('#9a2020', 13), 'y': ('#f4ecd8', 7), 't': ('#3a2a1a', 1)})
CRYSTALBALL = (['..pppppp..', '.pzpppppp.', 'pzwzppppPp', 'pzzpppppPP', 'pppppppPPP', 'ppppppPPPP', '.pppPPPPP.', '..PPPPPP..', '..yyyyYY..', '.yyyyyyYY.'], {'p': ('#b070ff', 10), 'P': ('#5a2a9a', 10), 'z': ('#f0e0ff', 10), 'w': ('#ffffff', 1), 'y': ('#ffd84a', 6), 'Y': ('#c08a1c', 6)})
STAFF = (['...cc...', '..cwcc..', '..cccC..', '...cC...', '..yyYY..', '...tT...', '...tT...', '...tT...', '...tT...', '...tT...', '...tT...', '...tT...'], {'c': ('#9ae8ff', 12), 'C': ('#3a8ad0', 12), 'w': ('#ffffff', 1), 'y': ('#ffd84a', 6), 'Y': ('#c08a1c', 6)})
INGOT = (['...yyyyyy...', '..yhyyyyyY..', '.yyyyyyyyYY.', 'YYYYYYYYYYYY'], {'y': ('#e0e8f0', 5), 'Y': ('#8a94a8', 5), 'h': ('#ffffff', 1)})
FLASK = (['...ll...', '...cc...', '...cc...', '..c11c..', '.c1111c.', 'c111111c', 'c1w1111c', 'c111112c', '.c1122c.', '..cccc..'], {'c': ('#d8f4ff', 12), 'l': ('#b87a48', 9)})
GRENADE = (['....mm..', '...m..m.', '..nnnn..', '.nnnnnn.', 'nnwnnnnn', 'nnnnnnnN', 'nnnnnnNN', '.nnnnNN.', '..NNNN..'], {'n': ('#7a8a6a', 11), 'N': ('#3a4a2a', 11), 'w': ('#c8d8b8', 1)})
STONEFIST = (['..ff.ff.ff..', '.fFffFffFff.', '.fFffFffFfF.', '.ffffffffff.', 'ffwfffffffFF', 'fffffffffFFF', 'FFFFfffffFF.', '..FFFFFFFF..', '...ffffFF...', '...ffffFF...'], {'f': ('#a89a88', 11), 'F': ('#6a5e50', 11), 'w': ('#d8d0c0', 11)})
