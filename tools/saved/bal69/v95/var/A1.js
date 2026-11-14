// A1 뒷줄 덜 노려짐: 궁수 계열은 몬스터가 고를 몫이 절반
PATCH('pickTarget', "(1 + (i === 0 ? 1 : 0) + tankW(x) * 2)", "(1 + (i === 0 ? 1 : 0) + tankW(x) * 2) * (jobBase(x.cls) === 'archer' ? 0.5 : 1)");
