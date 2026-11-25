# 라비린토스 폰트 키트 v1.1 (2026-11-25 확정)

먼저 `preview/00_kit_overview.png`를 열어 보세요. 이 키트의 CSS·스프라이트를 크롬이 실제로 그린 화면이에요.

## 확정 규칙
| 용도 | 글꼴·크기 | 쓰는 법 |
|---|---|---|
| 제목·스토리 대사·버튼 | Galmuri14 **15px** (넓은 칸 가는체) | `.t15` + 색 클래스 |
| 일반 본문·선택지·수치 라벨 | Galmuri11 **12px** (가는체) | `.t12` + 색 클래스 |
| 강조 문구(화면이 복잡한 곳) | 위와 같음 + 테두리 각인 | `.heavy` 추가 |
| 영어·러시아처럼 획이 단순한 큰 강조 | 합성 굵게 | `.bold-synth` 추가 |
| 강화 결과 도장 | 깔끔한 굵게 + 테두리 + 윗면 빛 (그림) | `stamps/` |
| UI 숫자 (골드·확률·능력치) | B2 금박 11px (그림) | `sprites/b2-ui` |
| 데미지 숫자 | B2 각인 11px (그림) | `sprites/b2-fx` |
| 강화 창 큰 수치 | B2 각인 2배 (그림) | `sprites/b2-big` |
| 문장 속 숫자 ("7층", "B7") | 글꼴 숫자 그대로 | — |

- **글자 크기는 12px·15px만.** 픽셀 폰트는 원래 크기에서만 선명해요. 지금 `src/style.css`의 9·10·11·13·14·16·18px 글자는 크롬에서 점이 번져요(11px은 글자 점의 96%가 번짐, `preview/13_font_a1.png` ④). 12px 또는 15px로 정리해 주세요.
- 가는체 = 테두리 없이 1px 그림자 + 줄마다 같은 세로 그라데이션. 굵은 각인(`.heavy`)은 강조할 때만.
- 깔끔한 굵게(획 사이 1px 틈을 막지 않는 굵게)와 윗면 빛은 CSS로 못 그려요 → 도장·큰 숫자는 그림으로 넣었어요.

## 색 9종 + 흑적
| 클래스 | 이름 | 쓰임새 | 그라데이션 (위→아래) | 그림자/테두리 |
|---|---|---|---|---|
| `.c-gold` | ①금박 | 제목·강화 성공·보상·UI 숫자 | #fff6c4 → #ffd65e → #e2a02e → #966016 | #3a0808 |
| `.c-ivory` | ②상아 | 본문 대화·설명 (기본 글자) | #fffbee → #f2e2b6 → #ceb078 | #341e0e |
| `.c-silver` | ③은박 | 시스템 안내·메뉴·강화 보존 | #ffffff → #dce2ee → #aab2c6 → #707892 | #101422 |
| `.c-bronze` | ④청동 | NPC·캐릭터 이름표·보조 제목 | #ffd6aa → #e2985c → #965228 | #281006 |
| `.c-white` | ⑤백색 | 툴팁·버튼·읽기 편한 모드 | #ffffff → #dedede | #140c08 |
| `.c-parch` | ⑥양피지 음각 | 책·편지·퀘스트 문서 (`.parch-bg` 종이 위) | #4a2e16 → #2e1a0a | 아래 밝은선 #fcf0d4 |
| `.c-iron` | ⑦흑철 | 강화 실패 제목·도장·잠김 | #848492 → #4e4e5a → #22222a | #b0b0be |
| `.c-iron-body` | ⑦흑철 본문용 | 실패 안내 본문 | #ceced8 → #9292a0 | #121218 |
| `.c-crimson` | ⑧진홍 | 위험·**강화 파괴(확정)**·보스·받은 피해 | #ffc4b4 → #ff6048 → #d62820 → #820c0c | #280000 |
| `.c-blackred` | 흑적 | 파괴 대안 | #605454 → #302424 → #120a0a | #dc3020 |
| `.c-prism` | ⑨프리즘 | 전설·+30 달성·랭킹 1위·특별 보상 | 무지개 가로 그라데이션 | #240e3c |

스프라이트 색 이름: gold ivory silver bronze white parch iron iron_body crimson blackred prism (`palette.json`에 같은 값)

## 파일
- `fonts/` Galmuri11·Galmuri11-Bold·Galmuri14 (갈무리 2.40.3), FusionPixel12-SC·TC (중국어 보충, 하나로 합친 파일), **LabyrinthCyrillic15** (15px 러시아·우크라이나 74자, 새로 그림), `LICENSES/`
- `css/labyrinth-type.css` 글꼴 등록·크기·색·굵기 클래스 전부
- `js/b2-numbers.js` B2 숫자 스프라이트를 DOM(`B2.html`)이나 canvas(`B2.draw`)로 그리는 도우미
- `sprites/b2-ui|b2-fx|b2-big|b2-big-smooth/<색>.png` + 같은 폴더의 `.json` (글자 위치표, 모든 색이 같은 배치)
  - 글자 41자: `0-9 + − × ÷ % . , : / ( ) [ ] ! ? ~ # ' " … · ★ ☆ ♥ ◆ ▲ ▼ ← → ↑ ↓`
  - `b2-big-smooth` = 큰 숫자의 계단을 다듬은 버전(대각선·곡선만 다듬고 +, − 등 직선 기호는 그대로). `b2-big`과 둘 중 하나 선택 (`preview/21_b2_symbols_full.png`)
- `stamps/<언어>_<success|keep|fail|destroy|destroy-alt>.png` 12개 언어 (KO EN JA ZH-S ZH-T FR IT DE ES RU PL PT-BR)
- `preview/` 00 = 키트 전체 미리보기, 13~19 = 결정 과정 시트, `kit_preview.html` = 미리보기 원본 페이지(로컬 서버로 열기)

## 적용 예시
```html
<link rel="stylesheet" href="(키트 위치)/css/labyrinth-type.css">
<div class="t15 c-bronze">감정사</div>
<div class="t15 c-ivory">길드 마스터님, 지하 7층에서 낡은 마도서를 찾았어요.</div>
<div class="t12 c-crimson">보호 부적 없음 · 파괴될 수 있어요</div>
<div lang="zh-Hant" class="t15 c-gold">鐵匠鋪 · 裝備強化</div>   <!-- 번체는 lang="zh-Hant", 간체가 기본 -->
```
B2 숫자: `await B2.load('b2-ui','gold', '(키트 위치)/sprites'); el.appendChild(B2.html('b2-ui','gold','12,000'))`

## 아직 남은 일
- ~~15px 러시아·우크라이나 글자~~ → v1.1에서 완료 (`LabyrinthCyrillic15.woff2`, CSS `.t15`에 연결됨, 크롬에서 74자 모두 도트 일치 확인)
- 15px 간체 보충: Galmuri14에 간체 상용자 3,755자 중 1,385자가 없어요 → Ark Pixel Font 16px(OFL, GitHub `TakWolf/ark-pixel-font` 릴리스)을 집 PC에서 받아 보충. 그전까지는 12px로 대신 그림.
- ~~B2 기호 추가·큰 숫자 다듬기~~ → v1.1에서 완료 (41자, `b2-big-smooth`). &·@는 숫자 표시에 안 써서 제외(본문 글꼴에 있음).
- 일본어·중국어 줄바꿈: CSS `line-break: strict` 적용함. 실제 화면에서 확인 필요.
- 번역 전 필수: 소스 150개 파일에 하드코딩된 한글(주석 포함 약 21만 자)을 문자열 표로 분리(i18n).
- 데모 언어 11개(인터페이스+자막): 영어, 일본어, 간체, 번체, 프랑스어, 이탈리아어, 독일어, 스페인어(스페인), 러시아어, 폴란드어, 포르투갈어(브라질). 한국어는 원문, 한국 출시는 나중.

## 라이선스
Galmuri·Fusion Pixel 모두 SIL OFL 1.1 — 게임에 넣기·고치기 가능, 폰트만 따로 판매 금지, `fonts/LICENSES/`를 함께 배포.
