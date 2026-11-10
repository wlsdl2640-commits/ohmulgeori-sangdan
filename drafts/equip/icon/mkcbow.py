"""컴파운드 보우 원형 시안 2 판 (11-10 23:40 사용자) → C_frames.png
전용 화살은 23:58 사용자 「화살은 그냥 기본 화살 같이쓰자」로 뺐다(carr.py 시안만 남김).
위: 활 넷 (section_sheet) / 아래: 나무 도르래 활을 크게 — 부위 이름(사용자가 보낸 부위 그림처럼)"""
from PIL import Image, ImageDraw
from mktype import section_sheet, FRM
from sheet import font, icon_img
import cbow5, carr
def items(mod):
    out = []
    for d in mod.FR:
        r = mod.icon(d)
        ic = r[0] if mod is cbow5 else r[1]
        out.append((ic.render(), '원형 ' + d['key'], d['name'], d['desc']))
    return out
def labeled(path_in, path_out):
    top = Image.open(path_in)
    ic, _ = cbow5.FR[0]['fn']()
    z = 18; S = 20 * z
    W = top.width; H = top.height + S + 70
    im = Image.new('RGB', (W, H), (26, 24, 32)); im.paste(top, (0, 0))
    d = ImageDraw.Draw(im)
    y0 = top.height + 10
    d.text((14, y0), '부위 (원형 A를 크게) — 보내 준 부위 그림의 이름대로', font=font(14, True), fill=(240, 196, 90))
    ox, oy = 40, y0 + 34
    d.rectangle([ox - 2, oy - 2, ox + S + 1, oy + S + 1], fill=(54, 48, 40))
    big = icon_img(ic.render(), z); im.paste(big, (ox, oy), big)
    # (칸 x, 칸 y, 이름, 글 놓을 곳 dx, dy)
    marks = [((16, 4), '캠 (바퀴 · 바퀴살 구멍 · 축)', (1, 0)), ((12, 3), '어퍼림 (위 팔)', (1, -1)), ((9, 3), '림 포켓 (팔이 끼는 쇠)', (0, -1)),
             ((8, 6), '라이저 창', (-1, -1)), ((7, 7), '라이저', (-1, 0)), ((8, 8), '핸들 (손잡이)', (-1, 0)), ((10, 8), '화살 받침', (1, 0)),
             ((12, 11), '오늬 자리 (시위에 매는 고리)', (1, 0)), ((14, 9), '스트링 (시위)', (1, 0)), ((11, 9), '케이블', (1, 0)),
             ((7, 11), '케이블 가이드', (1, 1)), ((3, 12), '로워림 (아래 팔)', (-1, 0)), ((4, 16), '캠', (-1, 1))]
    tx = ox + S + 40
    for i, ((cx, cy), name, _) in enumerate(marks):
        ly = oy + 8 + i * (S - 16) / (len(marks) - 1)
        px, py = ox + cx * z + z / 2, oy + cy * z + z / 2
        d.line([(px, py), (tx - 6, ly)], fill=(240, 196, 90), width=1)
        d.ellipse([px - 3, py - 3, px + 3, py + 3], outline=(240, 196, 90))
        d.text((tx, ly - 7), name, font=font(13, True), fill=(240, 228, 200))
    # 게임 속 크기
    gx = tx + 330
    d.text((gx, oy), '게임 속 크기 (두 배 · 한 배)', font=font(12), fill=(168, 156, 140))
    for k, D in enumerate(cbow5.FR):
        g2 = icon_img(D['fn']()[0].render(), 2, (14, 17, 24, 255)); im.paste(g2, (gx + k * 48, oy + 24))
        g1 = icon_img(D['fn']()[0].render(), 1, (14, 17, 24, 255)); im.paste(g1, (gx + k * 48 + 10, oy + 72))
    im.save(path_out); return im.size
if __name__ == '__main__':
    secs = [('컴파운드 보우 — 트래커 · 스토커 주무기 (2차부터, Lv50 ~ 200) · 원형 시안 2 · 화살은 궁수 공통 화살', items(cbow5), FRM, (240, 170, 90))]
    section_sheet('C_frames_top.png', '컴파운드 보우 — 사진 보고 부위를 자세히 (11-10 23:40)',
                  '캠 · 림 · 림 포켓 · 라이저(창) · 핸들 · 화살 받침 · 시위 + 케이블 · 케이블 가이드 + 갈래마다 조준기 · 스태빌라이저 · 손목 끈. 사진 속 게임 활 · 상표 무늬는 베끼지 않았다. 오른쪽 위 = 게임 속 크기',
                  secs, z=7)
    print(labeled('C_frames_top.png', 'C_frames.png'))
