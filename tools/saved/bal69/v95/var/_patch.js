// 변형 도우미: 함수 소스를 바꿔 다시 만든다 (같은 클로저 안 eval)
var PATCH = (name, a, b) => { const src = eval(name).toString(); if (!src.includes(a)) throw new Error('patch miss ' + name + ': ' + a.slice(0, 40)); eval(name + ' = (' + src.replace(a, b) + ')'); };
