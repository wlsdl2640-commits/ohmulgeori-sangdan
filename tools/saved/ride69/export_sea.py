"""해룡 몬스터 · 새끼 펫 그림을 게임 파일로: python3 export_sea.py <src/pxsea69.js>
seadragon_mon.json(seadragon_mon.py)의 야생 해룡 넷 · 새끼 넷을 PXU 항목으로 옮긴다 (빌드 69, 11-14 15:54 사용자 「이대로」).
게임 파일은 손으로 고치지 말고 시안(seadragon.py · seadragon_mon.py)을 고친 뒤 다시 뽑는다."""
import json, os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
M = json.load(open(os.path.join(HERE, 'seadragon_mon.json')))
LOOKS = [('A', '', '산호 해룡'), ('B', '_b', '해초 해룡'), ('C', '_c', '심해 해룡'), ('D', '_d', '진주 해룡')]
T = lambda g: '`\n' + g.strip('\n') + '\n`'
P = lambda pal: json.dumps(pal, ensure_ascii=False, separators=(', ', ': '))
out = ['/* 해룡 몬스터 · 새끼 펫 그림 (빌드 69) — tools/saved/ride69/export_sea.py로 뽑는다(손으로 고치지 말 것).',
       '   야생 해룡 = 탈것 해룡(RIDE65.sea) 몸에서 안장을 뺀 것, 모습 넷은 PXU_SKIN(만날 때마다) · 펫 알이 그 모습을 이어받는다(pet.js petKill).',
       '   새끼 해룡 = 머리 큰 아기 해마 용 (전투에서는 view.js가 줄여 그린다). 몬스터 · 펫 데이터는 data-sea69.js. */',
       'Object.assign(PXU, {']
for L, sfx, nm in LOOKS:
    m = M['mon' + L]
    out.append(f"  seadragon{sfx}: {{   // {nm} (야생)")
    out.append(f"    pal: {P(m['pal'])},")
    out.append(f"    g: {T(m['g'])},")
    out.append(f"    g2: {T(m['g2'])},")
    out.append('    gm: { ' + ', '.join(f"{k}: {T(v)}" for k, v in m['gm'].items()) + ' },')
    out.append(f"    sh: {json.dumps(m['sh'])}, hip: {m['hip']}, ax: {m['ax']}, noArm: 1, still: 1, float: 1, wpn: 'none' }},")
for L, sfx, nm in LOOKS:
    p = M['pet' + L]
    out.append(f"  pet_seadragon{sfx}: {{   // 새끼 {nm}")
    out.append(f"    pal: {P(p['pal'])},")
    out.append(f"    g: {T(p['g'])},")
    out.append(f"    g2: {T(p['g2'])},")
    out.append(f"    sh: [16, 7], hip: 12, ax: {p['ax']}, noArm: 1, still: 1, float: 1, wpn: 'none' }},")
out.append('});')
out.append("Object.assign(PXU_SKIN, { seadragon: ['seadragon', 'seadragon_b', 'seadragon_c', 'seadragon_d'] });")
out.append("Object.assign(PXU_SKIN_NAME, { seadragon: ['산호 해룡', '해초 해룡', '심해 해룡', '진주 해룡'] });")
out.append("pxuLook('seadragon_b', 'seadragon', '해초 해룡'); pxuLook('seadragon_c', 'seadragon', '심해 해룡'); pxuLook('seadragon_d', 'seadragon', '진주 해룡');")
out.append("['', '_b', '_c', '_d'].forEach(sfx => { const k = 'seadragon' + sfx, P = PETS[k], m = MONS.seadragon; MONS['pet_' + k] = { name: P.name, plan: 'pet', body: m.body, dark: m.dark, mh: 0, ma: 0, md: 0, spd: 1, pet: k, drops: [] }; });")
out.append("// 동작: 물기(짐승 물기) · 물 뿜기(부풀었다가 뱉기) — 효과는 물 색 · 거품")
out.append("Object.assign(PXU_ACT, { seadragon: { atk: ['qbite'], mag: ['wspit'], skl: ['wspit'], tk: 1.0, fx: { atk: { pal: 'water', hit: 'bite' }, mag: { pal: 'water', hit: 'burst', p: 'orb' }, skl: { pal: 'water', hit: 'burst', p: 'orb', big: 1, after: 'bubbles' } } } });")
out.append("// 해룡기수 그림: 기수 시안을 고르기 전까지 용기수 그림을 바다빛으로 (청록 비늘 갑옷 · 산호빛 테 · 진주 보석)")
out.append("PXL.seadragoon = Object.assign({}, PXL.dragoon, { c1: '#1f5a7a', c2: '#f0a070', metal: '#6ab8c8', cape: '#123a52', gem: '#f6e6c8', pants: '#1c3046' });")
open(sys.argv[1], 'w', encoding='utf-8').write('\n'.join(out) + '\n')
print('ok', sys.argv[1])
