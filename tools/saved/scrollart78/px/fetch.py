"""픽셀랩 결과 내려받기 → raw/<이름>_<번호>.png   python fetch.py"""
import os, urllib.request, json
JOBS = {
    's_seal': 'f4974b8c-7513-419c-a2cf-b9fa97faa4b9', 's_open': '1ec1a995-4ab0-4ae6-a7d6-5f49a882d76d',
    's_rods': 'd870fe55-8177-4f34-8e6d-205bc8c1f26f', 's_gold': '0a9a6be4-5e36-43f4-a04a-d28a39cf7830',
    'b_warrior': 'e0057a6e-24ed-46b0-a7ba-f602c2593a24', 'b_archer': '24421128-ab88-4ece-9803-81c9e7f5b34f',
    'b_mage': '96986024-899f-4053-8560-b7423ba441cf', 'b_cleric': 'ca14051b-b249-4d89-ada7-6b55bc4b71f7',
    'b_rogue': '4b13bc5c-ef74-4fc3-8300-5bd810d9f2a1', 'b_porter': 'c0c7b2fb-0c9b-443e-94dc-e22d7138b02e',
    'b_common': 'c3ed2e25-32ce-472d-9b46-1d3b9ef99486',
}
os.makedirs('raw', exist_ok=True)
for name, jid in JOBS.items():
    for i in range(4):
        out = f'raw/{name}_{i}.png'
        if os.path.exists(out): continue
        try:
            req = urllib.request.Request(f'https://api.pixellab.ai/mcp/images/{jid}/download?index={i}', headers={'User-Agent': 'game-asset-fetch'})
            data = urllib.request.urlopen(req, timeout=60).read()
            open(out, 'wb').write(data); print('ok', out, len(data))
        except Exception as ex: print('fail', name, i, ex)
