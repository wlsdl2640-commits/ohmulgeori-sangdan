"""스킬 307개 → (물건, 덧그림, 팔레트[, 점]). 물건은 스킬마다 하나씩만 쓴다 (도발 1·2만 같이 쓰고 점으로 가른다)."""
SPEC = {
# 전사 기본
'bash': ('hammer', 'spark', 'none'), 'taunt': ('face', 'excl', 'none', 1), 'ironwall': ('tower', 'upB', 'steel'),
'sweep': ('arc', 'ring', 'none'), 'berserk': ('axe', 'flame', 'blood'), 'earthsplit': ('fissure', 'down', 'earth'),
'warcry': ('warbanner', 'upR', 'blood'), 'guardian': ('shield', 'heart', 'steel'), 'titanblow': ('gauntlet', 'spark', 'steel'),
'kn_charge': ('warhorse', 'wind', 'steel'), 'kn_wall': ('crestshield', 'shield', 'water'), 'ar_roar': ('gladhelm', 'upR', 'gold'),
'resolve': ('oathsword', 'shield', 'steel'), 'awk_warrior': ('herosword', 'star', 'gold'), 'awk2_warrior': ('worldsplit', 'spark', 'gold'),
'ironskin': ('chestplate', 'shield', 'steel'), 'dw_smash': ('anvil', 'spark', 'steel'), 'shockwave': ('impact', 'ring', 'earth'),
'dw_grit': ('pickaxe', 'upB', 'steel'), 'ar_phalanx': ('spearwall', 'shield', 'steel'), 'ar_combo': ('flail', 'x3', 'blood'),
'ar_finish': ('fist', 'excl', 'none'),
# 궁수 기본
'aimed': ('bow', 'target', 'none'), 'double': ('arrows2', 'x2', 'none'), 'poisonarrow': ('arrow', 'poison', 'poison'),
'rain': ('arrowrain', 'down', 'none'), 'piercing': ('arrowpierce', 'target', 'steel'), 'eagleeye': ('eagle', 'target', 'gold'),
'tripleshot': ('arrows3', 'x3', 'none'), 'stormarrows': ('arrowcyclone', 'wind', 'wind'), 'el_arrow': ('icearrow', 'snow', 'ice'),
'flasharrow': ('flasharrow', 'spark', 'light'), 'awk_archer': ('cometarrow', 'star', 'blaze'), 'awk2_archer': ('heavenbow', 'wing', 'holy'),
# 마법사 기본
'fireball': ('orb', 'flame', 'fire'), 'icelance': ('icicle', 'snow', 'ice'), 'chain': ('chainbolt', 'chain', 'thunder'),
'burst': ('manaburst', 'spark', 'arcane'), 'meteor': ('comet', 'spark', 'blaze'), 'manashield': ('bubble', 'shield', 'arcane'),
'blizzard': ('snowflake', 'wind', 'ice'), 'arcane': ('spellbook', 'star', 'arcane'), 'sa_mirage': ('palm', 'flame', 'fire'),
'iceprison': ('icecube', 'chain', 'ice'), 'thunderclap': ('bolt', 'excl', 'thunder'), 'awk_mage': ('firepillar', 'up', 'blaze'),
'awk2_mage': ('crackedstar', 'star', 'blaze'), 'sa_curse': ('lamp', 'ghost', 'dark'), 'weaken': ('brokensword', 'down', 'dark'),
# 성직자 기본
'heal': ('hand', 'plus', 'heal'), 'bless': ('halo', 'upR', 'holy'), 'massheal': ('heart', 'ring', 'heal'),
'holy': ('sun', 'star', 'holy'), 'sanctuary': ('temple', 'shield', 'holy'), 'greatheal': ('bigcross', 'up', 'heal'),
'smite': ('beam', 'cross', 'holy'), 'revival': ('sprout', 'heart', 'heal'), 'cure': ('herb', 'drop', 'heal'),
'holyhammer': ('mace', 'cross', 'holy'), 'awk_cleric': ('holycross', 'plus', 'holy'), 'awk2_cleric': ('heavengate', 'star', 'holy'),
'chant': ('lyre', 'note', 'heal'), 'fr_song': ('shell', 'note', 'water'), 'el_breath': ('leaf', 'wind', 'heal'),
# 도적 기본
'backstab': ('dagger', 'drop', 'none'), 'smoke': ('cloud', 'wing', 'shadow'), 'venom': ('vial', 'poison', 'poison'),
'shadow': ('shuriken', 'x3', 'dark'), 'quickstep': ('footprints', 'wind', 'none'), 'deadlyvenom': ('snake', 'poison', 'poison'),
'blades': ('sawblade', 'x2', 'steel'), 'vital': ('bullseye', 'drop', 'blood'), 'parasting': ('needle', 'spark', 'thunder'),
'voltstab': ('rapier', 'spark', 'thunder'), 'awk_rogue': ('guillotine', 'ghost', 'dark'), 'awk2_rogue': ('kunai', 'x2', 'shadow'),
'ar_sand': ('sand', 'wing', 'earth'), 'riposte': ('scorpion', 'excl', 'blood'), 'fr_wit': ('abacus', 'wing', 'gold'),
# 짐꾼 기본
'throwjunk': ('crate', 'spark', 'wood'), 'shout': ('mouth', 'upB', 'none'), 'sturdy': ('backpack', 'shield', 'wood'),
'packmule': ('mule', 'upB', 'wood'), 'shieldbag': ('roundshield', 'shield', 'wood'), 'avalanche': ('boxpile', 'down', 'wood'),
'awk_porter': ('globepack', 'upR', 'gold'), 'awk2_porter': ('flagship', 'star', 'gold'),
# 공용
'firstaid': ('medkit', 'plus', 'heal'), 'sprint': ('boot', 'wind', 'wind'), 'meditate': ('lotus', 'drop', 'water'),
'toughness': ('muscle', 'upB', 'none'), 'focus': ('cairn', 'ring', 'none'), 'secondwind': ('canteen', 'up', 'water'),
'haste': ('hourglass', 'upB', 'thunder'), 'tactics': ('chess', 'clock', 'steel'), 'rhythm': ('metronome', 'note', 'music'),
'ar_cheer': ('confetti', 'heart', 'music'), 'bandage': ('bandage', 'plus', 'heal'),
# 검투사·챔피언
'arena': ('trident', 'x2', 'steel'), 'parry': ('buckler', 'wing', 'steel'), 'roar': ('lion', 'upR', 'none'),
'execute': ('cleaver', 'x3', 'blood'), 'spinslash': ('spin', 'ring', 'none'),
'glory': ('laurel', 'x3', 'gold'), 'crowd': ('firework', 'upR', 'none'), 'finale': ('trophy', 'star', 'gold'), 'colosseum': ('colosseum', 'ring', 'earth'),
# 기사·성기사
'shieldbash': ('shieldbash', 'spark', 'steel'), 'provoke': ('face', 'excl', 'none', 2), 'fortress': ('castle', 'upB', 'shadow'),
'rally': ('beacon', 'shield', 'fire'), 'lancecharge': ('lance', 'wind', 'steel'),
'holystrike': ('wingsword', 'cross', 'holy'), 'guard': ('knighthelm', 'excl', 'holy'), 'layhands': ('cuphands', 'plus', 'holy'),
'judgment': ('gavel', 'excl', 'holy'), 'aegis': ('aegis', 'shield', 'holy'), 'devotion': ('rosary', 'heart', 'holy'), 'divinity': ('heavenstairs', 'star', 'holy'),
# 광전사·피의 군주
'bloodstrike': ('slashmark', 'drop', 'blood'), 'whirl': ('axe2', 'swirl', 'steel'), 'bloodthirst': ('fang', 'heart', 'blood'),
'rampage': ('bull', 'upR', 'blood'), 'frenzy': ('angervein', 'flame', 'blood'),
'bloodfeast': ('meat', 'heart', 'blood'), 'bloodlust': ('bat', 'drop', 'evil'), 'bloodmoon': ('fullmoon', 'upR', 'blood'), 'ragnarok': ('volcano', 'spark', 'blaze'),
# 레인저·용기병
'beastshot': ('boar', 'x2', 'earth'), 'trap': ('beartrap', 'drop', 'steel'), 'wolfcall': ('wolfhead', 'x2', 'shadow'),
'camouflage': ('chameleon', 'wing', 'heal'), 'instinct': ('huntercap', 'excl', 'wood'), 'arrowstorm': ('arrowfan', 'x2', 'wind'),
'jump': ('spearDown', 'wing', 'none'), 'dragonscale': ('scale', 'shield', 'earth'), 'gale': ('spear', 'wind', 'wind'),
'skyfall': ('dragoonhelm', 'down', 'steel'), 'wyvernfall': ('wing', 'down', 'earth'), 'dragonblood': ('drop', 'heart', 'blood'),
'dragonfall': ('dragon', 'flame', 'blaze'),
# 저격수·매의 눈
'headshot': ('appleshot', 'excl', 'blood'), 'steadyaim': ('crosshair', 'upR', 'steel'), 'longshot': ('longbow', 'target', 'none'),
'piercearrow': ('arrowbig', 'spark', 'steel'), 'deadeye': ('owl', 'target', 'shadow'),
'divinearrow': ('arrowglow', 'star', 'light'), 'starfall': ('shootingstar', 'down', 'light'), 'godseye': ('providence', 'ring', 'gold'),
'lastarrow': ('wingedarrow', 'cross', 'holy'),
# 음유시인·악장
'ballad': ('lute', 'upR', 'music'), 'lullaby': ('moon', 'swirl', 'music'), 'hymn': ('harp', 'plus', 'heal'),
'marchsong': ('trumpet', 'wing', 'gold'), 'warsong': ('horn', 'upR', 'blood'),
'symphony': ('notes', 'star', 'music'), 'requiem': ('bell', 'cross', 'holy'), 'overture': ('scroll', 'heart', 'music'),
'encore': ('bouquet', 'clock', 'music'), 'grandfinale': ('baton', 'star', 'gold'),
# 마부·대상단장
'whipcrack': ('whip', 'spark', 'wood'), 'horsecare': ('horseshoe', 'heart', 'steel'), 'gallop': ('saddle', 'wind', 'wood'),
'wheelcrush': ('wheel', 'spark', 'wood'), 'wagonwall': ('wagon', 'shield', 'wood'), 'cargoshield': ('barrel', 'shield', 'wood'),
'stampede': ('cart', 'wind', 'wood'), 'roadlord': ('signpost', 'star', 'wood'), 'convoy': ('lantern', 'shield', 'gold'),
'grandcaravan': ('camel', 'upR', 'gold'),
# 정찰병·개척자
'ambush': ('bush', 'excl', 'heal'), 'pathfind': ('compass', 'star', 'none'), 'snare': ('noose', 'drop', 'wood'),
'campcraft': ('campfire', 'heart', 'fire'), 'spotweak': ('magnifier', 'excl', 'none'), 'volley': ('quiver', 'x2', 'wood'),
'farsight': ('spyglass', 'target', 'gold'), 'mapmaker': ('map', 'star', 'earth'), 'drumbeat': ('drum', 'upR', 'none'),
'summit': ('mountain', 'x2', 'none'),
# 암살자·그림자 군주
'assassinate': ('skull', 'target', 'none'), 'poisonblade': ('kris', 'poison', 'poison'), 'vanish': ('mask', 'wing', 'shadow'),
'throatcut': ('karambit', 'drop', 'blood'), 'shadowclone': ('twin', 'x3', 'shadow'), 'killer': ('raven', 'target', 'shadow'),
'shadowstep': ('portal', 'swirl', 'dark'), 'nightfall': ('curtain', 'wing', 'dark'), 'shadowstorm': ('tornado', 'x2', 'dark'),
'soulreap': ('scythe', 'ghost', 'evil'), 'darkness': ('crown', 'upR', 'dark'), 'eclipse': ('eclipse', 'ring', 'dark'),
# 결투가·검무희
'twinslash': ('twinblades', 'x2', 'steel'), 'crossslash': ('crosscut', 'excl', 'none'), 'parrying': ('deflect', 'wing', 'steel'),
'blitz': ('dash', 'x3', 'wind'), 'twinstorm': ('xswords', 'swirl', 'wind'),
'bladewaltz': ('ribbonblade', 'x3', 'music'), 'swordrain': ('swordrain', 'down', 'steel'), 'dancemaster': ('balletshoe', 'wing', 'music'),
'thousandcut': ('sakura', 'x3', 'music'),
# 보물 사냥꾼·대도
'pilfer': ('grabhand', 'excl', 'gold'), 'lockpick': ('lockpick', 'star', 'steel'), 'smokebomb': ('bomb', 'wing', 'shadow'),
'goldrush': ('coins', 'down', 'gold'), 'jackpot': ('chest', 'star', 'gold'),
'grandheist': ('tophat', 'star', 'shadow'), 'phantom': ('cape', 'x2', 'dark'), 'fortune': ('clover', 'star', 'heal'), 'heist': ('moneybag', 'excl', 'gold'),
# 정령사·정령왕
'windspirit': ('feather', 'wind', 'wind'), 'earthward': ('menhir', 'shield', 'earth'), 'firespirit': ('salamander', 'x3', 'fire'),
'waterspirit': ('fountain', 'plus', 'water'), 'storm': ('stormcloud', 'spark', 'storm'),
'spiritking': ('scepter', 'spark', 'storm'), 'spiritlink': ('linkrings', 'heart', 'storm'), 'elemental': ('quad', 'spark', 'none'),
'genesis': ('galaxy', 'star', 'none'),
# 강령술사·리치
'drain': ('tentacle', 'heart', 'dark'), 'curse': ('voodoo', 'drop', 'dark'), 'bonewall': ('ribcage', 'shield', 'none'),
'raise': ('bonehand', 'x3', 'none'), 'deathwave': ('rotflower', 'poison', 'evil'),
'soulrend': ('ghost', 'x2', 'evil'), 'lichmind': ('phylactery', 'star', 'evil'), 'deathplague': ('flies', 'poison', 'evil'),
'apocalypse': ('tombstone', 'ghost', 'evil'),
# 괴수 사냥꾼·용 사냥꾼·사냥꾼·거대 괴수 사냥꾼
'huntmark': ('xmark', 'target', 'blood'), 'trapnet': ('net', 'chain', 'wood'), 'biggame': ('tusk', 'excl', 'none'),
'skinning': ('pelt', 'upR', 'earth'), 'volleytrap': ('spiketrap', 'x2', 'steel'),
'dragonpierce': ('dragonskull', 'target', 'earth'), 'wyrmbane': ('dragoneye', 'ring', 'gold'), 'slayrain': ('arrowcloud', 'x2', 'none'),
'dragonheart': ('heartarrow', 'excl', 'blood'),
'trackshot': ('pawprint', 'target', 'earth'), 'snaretrap': ('cage', 'chain', 'wood'), 'houndpack': ('dog', 'x3', 'earth'),
'wildsense': ('antler', 'excl', 'earth'), 'driveshot': ('bird', 'x2', 'wind'),
'giantslayer': ('crossbow', 'target', 'steel'), 'harpoon': ('harpoon', 'excl', 'steel'), 'anatomy': ('fishbone', 'star', 'none'),
'quaketrap': ('stonespikes', 'x2', 'earth'), 'titanfall': ('stonehead', 'down', 'earth'),
# 술사·대마법사·원소술사
'arcanebolt': ('missile', 'spark', 'arcane'), 'manaward': ('hexwall', 'shield', 'arcane'), 'meteorfall': ('meteors', 'flame', 'blaze'),
'arcanefocus': ('crystal', 'up', 'arcane'), 'disintegrate': ('pixelcube', 'x2', 'arcane'),
'arcanestorm': ('vortex', 'spark', 'arcane'), 'amplify': ('staff', 'upR', 'arcane'), 'gravity': ('blackhole', 'down', 'dark'),
'ultima': ('omega', 'star', 'light'),
'prism': ('prism', 'spark', 'light'), 'tidalwave': ('wave', 'snow', 'water'), 'stonefist': ('rockfist', 'excl', 'earth'),
'elemfocus': ('elemwheel', 'up', 'none'), 'thundercall': ('strike', 'x2', 'thunder'),
# 연금술사·마검사·성검사
'transmute': ('ingot', 'spark', 'gold'), 'frostflask': ('tube', 'snow', 'ice'), 'flashbang': ('firecracker', 'excl', 'light'),
'blazeflask': ('molotov', 'flame', 'blaze'), 'magnumopus': ('redstone', 'star', 'blood'),
'flameblade': ('flamesword', 'flame', 'fire'), 'frostblade': ('icesword', 'snow', 'ice'), 'thunderblade': ('voltsword', 'spark', 'thunder'),
'arcaneguard': ('runecircle', 'shield', 'arcane'), 'spellsword': ('sword', 'swirl', 'arcane'),
'starblade': ('starsword', 'star', 'light'), 'manaburst': ('chainbreak', 'upR', 'arcane'), 'starward': ('constellation', 'shield', 'light'),
'dimension': ('rift', 'x2', 'dark'), 'swordsaint': ('katana', 'spark', 'storm'),
# 사제·대주교
'prayer': ('prayhands', 'plus', 'holy'), 'grace': ('dove', 'upR', 'holy'), 'restore': ('sunflower', 'plus', 'heal'),
'purify': ('candle', 'cross', 'holy'), 'holyshield': ('dome', 'shield', 'holy'), 'sacredsong': ('lily', 'heart', 'heal'),
'miracle': ('rainbow', 'plus', 'none'), 'holyland': ('holymount', 'shield', 'holy'), 'archangel': ('angel', 'star', 'holy'),
'resurrect': ('ankh', 'heart', 'gold'), 'dawnlight': ('sunrise', 'plus', 'holy'),
# 역병 의사·명의
'miasma': ('erlenmeyer', 'poison', 'poison'), 'remedy': ('mortar', 'clock', 'heal'), 'quarantine': ('beakmask', 'shield', 'none'),
'vaccine': ('syringe', 'shield', 'heal'), 'panacea': ('pill', 'plus', 'heal'), 'epidemic': ('germ', 'x2', 'poison'),
'elixir': ('elixir', 'heart', 'gold'), 'cureall': ('caduceus', 'plus', 'heal'), 'surgeon': ('scalpel', 'star', 'steel'),
'regenall': ('cauldron', 'clock', 'heal'), 'blackdeath': ('rat', 'poison', 'evil'),
# 퇴마사·이단 심문관
'banish': ('talisman', 'ghost', 'holy'), 'sealing': ('sealjar', 'chain', 'holy'), 'holywater': ('holyflask', 'drop', 'water'),
'wardcircle': ('shimenawa', 'shield', 'holy'), 'exorcism': ('censer', 'ghost', 'holy'),
'verdict': ('decree', 'excl', 'holy'), 'pyre': ('stake', 'flame', 'blaze'), 'inquisition': ('torch', 'excl', 'fire'),
'lastjudgment': ('balance', 'star', 'holy'),
}
