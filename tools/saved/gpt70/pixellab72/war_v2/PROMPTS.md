# 전사(1차) 다시 만들기 — 픽셀랩 웹 순서 · 동작 코드 (11-25)

기준 그림: `warrior_east_120.png`(동쪽 · 키 105 · 궁수 archer_final_east_120과 같은 크기 · 그림체) · `warrior_west_120.png`(좌우 뒤집음).
GPT 원본 `warrior_gpt_src1.png` → `fit_crisp.py … 105 120`.

## 픽셀랩 웹
1. 새 캐릭터 → 「참조에서 생성」 → 동쪽 칸에 warrior_east_120.png (궁수 때와 같은 설정 · 캐릭터 크기 112).
2. Idle State 동쪽에서 아래 동작을 하나씩. 코드는 짧게, 한 동작에 한 가지 행동만. 같은 코드로 두세 번 돌려 좋은 것을 고른다.
3. ZIP으로 내려받아 주시면 `war_v2/`에 띠로 정리합니다.

## ① 기본 동작
| 이름 | 장 | 코드 |
|---|---|---|
| idle | 17 | Side view facing right. He breathes calmly in a ready stance, shield in front, sword lowered. |
| walk | 17 | Side view facing right. He walks forward in place, shield in front, sword lowered. |
| run | 17 | Side view facing right. He runs forward in place, shield up, sword held low. |
| hurt | 17 | Side view facing right. He gets hit in the chest, flinches backward with a pained face, then recovers to the ready stance. |
| fall | 21 | Side view facing right. He staggers, drops his sword and falls on his back, eyes closed. |
| sit | 17 | Side view facing right. He sits down cross-legged by a campfire, shield resting beside him. |
| sleep | 17 | Side view facing right. He lies on his back asleep, chest rising and falling slowly. |
| dodge | 21 | Side view facing right. He hops one step backward, shield up, then lands in the ready stance. |

## ② 기본 공격 · 스킬 동작 (1차 스킬 12 — 회의 a14)
| 스킬 | 이름 | 장 | 코드 |
|---|---|---|---|
| 밀어 베기 (기본) | slash | 21 | Side view facing right. He steps forward and slashes his sword down diagonally, then returns to the ready stance. |
| 둥근 방패 막기 (기본) | block | 17 | Side view facing right. He raises his round shield high in front and braces his legs, then lowers it. |
| 도발 (기본) | taunt | 21 | Side view facing right. He bangs his sword on his shield and shouts at the enemy, chin up. |
| 발굽 끊기 | lowcut | 21 | Side view facing right. He crouches and swings his sword low along the ground at the enemy's legs. |
| 가로 휩쓸기 | sweep | 21 | Side view facing right. He swings his sword in a wide horizontal arc from back to front. |
| 강철 피부 | — | — | 상시 효과 — 동작 없음(아이콘 · 몸에 잠깐 쇠빛 효과만) |
| 방패 두드리기 | bash | 21 | Side view facing right. He lunges forward and slams his round shield into the enemy. |
| 되치기 | counter | 21 | Side view facing right. He blocks with his shield, then quickly slashes forward with his sword. |
| 자세 고정 | brace | 17 | Side view facing right. He plants his feet wide, lowers his body and holds the shield firmly. |
| 결의 | resolve | 21 | Side view facing right. He raises his sword high above his head and shouts with resolve. |
| 대지 가르기 | earth | 21 | Side view facing right. He lifts his sword overhead with both hands and smashes it down into the ground. |
| 충격파 | quake | 21 | Side view facing right. He jumps up and slams down with his shield and sword, landing hard on the ground. |

- 모든 코드 끝에 공통으로: `No visual effects, no flashes, no other characters.` (효과는 게임에서 따로 그린다)
- ③ 스킬셋(수치 · 자동 사용)은 회의 a14 표 그대로 · ④ 스킬 효과 프레임은 동작이 모인 뒤 궁수 때처럼 코드 도트 효과 시안.
