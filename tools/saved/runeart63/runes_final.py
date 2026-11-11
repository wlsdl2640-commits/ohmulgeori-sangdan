"""빌드 64 룬 개편 — 게임에 넣은 룬 그림 (19종 × 하급 · 중급 · 상급 · 최상급). export_itemart.py · sheet_final.py가 쓴다.
하급 ~ 상급은 빌드 63 그림 그대로(공방 = 수호 돌 + 공격 검 문양, 새 6종 = runes_ext 그림), 화염은 돌 모양까지 새로(불꽃 돌 + 불꽃 · 모든 등급).
최상급 문양(고른 것): 강인 C 엄지 띠 + 접힌 금 · 금빛(옆 주먹 팔, 11-12 02:08 「C ㄱ」) · 마력 C 마법진 · 신속 D 번개 화살 · 마나 C 마나 결정 · 폭풍 B 바람 세 줄 ·
냉기 합침 2 · 생명 C 두 겹 하트 · 나머지는 make_top 기본"""
import os
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import runes as R            # noqa: E402
import runes_ext as X        # noqa: E402
import glyph_alts as G       # noqa: E402
# 게임 룬 id(data-gear.js RUNES 차례) → 그림 키 (runes_ext MERGED · 색도 MERGED)
RUNE_ART = {'str': 'str', 'int': 'int', 'atk': 'atkdef', 'matk': 'matk', 'crit': 'crit', 'eva': 'eva', 'haste': 'haste', 'time': 'time',
            'flash': 'flash', 'heal': 'heal', 'hp': 'hp', 'mana': 'mana', 'fire': 'fireres', 'cold': 'coldres', 'bolt': 'boltres',
            'wind': 'windatk', 'earth': 'earthres', 'holy': 'darkres', 'dark': 'darkatk'}
TOP_PICK = {'str': lambda: G.variant10('str', G.STR_PICK), 'matk': lambda: G.chosen('matk'), 'haste': lambda: G.chosen('haste'), 'mana': lambda: G.chosen('mana'),
            'wind': lambda: G.chosen('windatk'), 'cold': lambda: G.ice_mix(G.ICE_PICK), 'hp': lambda: G.variant3('hp', G.HP_PICK)}


def final(gid, lv):
    ak = RUNE_ART[gid]
    if gid == 'fire': return G.fire_pick(lv)                       # 화염: 불꽃 돌 + 불꽃 (모든 등급)
    if lv == 3 and gid in TOP_PICK: return TOP_PICK[gid]()
    return X.make(ak, G.COL[ak], lv)                               # 하급 ~ 상급 = 빌드 63 그림 · 최상급 기본 = make_top
