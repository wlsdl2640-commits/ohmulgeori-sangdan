"""픽셀랩 결과 내려받기 → raw/<이름>_<번호>.png   python fetch.py"""
import os, urllib.request, json
JOBS = {
    's_seal': 'f4974b8c-7513-419c-a2cf-b9fa97faa4b9', 's_open': '1ec1a995-4ab0-4ae6-a7d6-5f49a882d76d',
    's_rods': 'd870fe55-8177-4f34-8e6d-205bc8c1f26f', 's_gold': '0a9a6be4-5e36-43f4-a04a-d28a39cf7830',
    'b_warrior': 'e0057a6e-24ed-46b0-a7ba-f602c2593a24', 'b_archer': '24421128-ab88-4ece-9803-81c9e7f5b34f',
    'b_mage': '96986024-899f-4053-8560-b7423ba441cf', 'b_cleric': 'ca14051b-b249-4d89-ada7-6b55bc4b71f7',
    'b_rogue': '4b13bc5c-ef74-4fc3-8300-5bd810d9f2a1', 'b_porter': 'c0c7b2fb-0c9b-443e-94dc-e22d7138b02e',
    'b_common': 'c3ed2e25-32ce-472d-9b46-1d3b9ef99486',
    # 둘째 (11-27 대표님 고름 뒤): 도적 1 + 열쇠 · 마법사 다시(고리 주문 · 룬) · 강화 주문서 B1 리본 없이 × 확률 상태 다섯
    'b_rogue_key': 'b898a471-8be6-4f07-b495-610203a10247', 'b_rogue_key2': 'e82a980e-0ade-44a3-bb5e-1fb435bed769',
    'b_mage2': '43f2464e-67ba-42cd-892d-e961b20912dd', 'b_mage3': 'a0744a03-577e-4f18-80ce-709b7d070452',
    'e_100': '3f2c2548-8257-4148-9e10-d318634efc82', 'e_80': '09eb465e-b06d-4811-9e46-b57640aa4e49', 'e_60': '3c0ba1c8-b6fc-402c-8f11-33a1488be46d',
    'e_30': '757a3b86-e42d-40d1-98d6-9c9cb8ae0643', 'e_10': '391b24c7-b4c0-4516-9219-a9fd8bd04553',
}
ONE = ('b_rogue_key', 'b_rogue_key2', 'e_100', 'e_80', 'e_60', 'e_30', 'e_10')   # 고치기(edit)는 한 장
os.makedirs('raw', exist_ok=True)
for name, jid in JOBS.items():
    for i in range(1 if name in ONE else 4):
        out = f'raw/{name}_{i}.png'
        if os.path.exists(out): continue
        try:
            req = urllib.request.Request(f'https://api.pixellab.ai/mcp/images/{jid}/download?index={i}', headers={'User-Agent': 'game-asset-fetch'})
            data = urllib.request.urlopen(req, timeout=60).read()
            open(out, 'wb').write(data); print('ok', out, len(data))
        except Exception as ex: print('fail', name, i, ex); break
