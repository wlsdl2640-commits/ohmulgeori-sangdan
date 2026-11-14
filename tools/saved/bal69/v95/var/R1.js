// R1 그림자 몸놀림: 회피 강화가 걸린 동안에는 몬스터 스킬 · 광역기도 그 강화 몫만큼 피한다 (상한 50%)
PATCH('hitAdv', "if (o.skill ? blind && rnd() < FIGHT.blind : ", "if (o.skill ? (blind && rnd() < FIGHT.blind) || rnd() < Math.min(CAP.eva, buffAdd(e, x.id, 'eva')) : ");
