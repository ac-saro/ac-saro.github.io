---
layout: post
tags: [json, javascript]
---

> 이 문서는 가리사니 개발자 포럼에 올렸던 글의 백업 파일입니다.
오래된 문서가 많아 현재 상황과 맞지 않을 수 있습니다.


과연 어떤것이 더 빠를까!!
``` java
var
	str1 =
		'[{"a":1},{"a":1},{"a":1},{"a":1},{"a":1},{"a":1}'+
		',{"a":1},{"a":1},{"a":1},{"a":1},{"a":1},{"a":1},'+
		'{"a":1},{"a":1},{"a":1},{"a":1},{"a":1},{"a":1}]',
	str2 = '328372',
	time,
	// 브라우저가 최적화로 생략할 것 같아서 방어.
	tmp1, tmp2, tmp3, tmp4;

console.log('str1');
time = new Date().getTime();
for (var i = 0 ; i < 100000 ; i++)
{
	tmp1 = JSON.parse(str1);
}
console.log('json : ' + (new Date().getTime() - time));
time = new Date().getTime();
for (var i = 0 ; i < 100000 ; i++)
{
	tmp2 = eval(str1);
}
console.log('eval : ' + (new Date().getTime() - time));

console.log('str2');
time = new Date().getTime();
for (var i = 0 ; i < 100000 ; i++)
{
	tmp3 = JSON.parse(str2);
}
console.log('json : ' + (new Date().getTime() - time));
time = new Date().getTime();
for (var i = 0 ; i < 100000 ; i++)
{
	tmp4 = eval(str2);
}
console.log('eval : ' + (new Date().getTime() - time));

console.log(tmp1, tmp2, tmp3, tmp4);
```
크롬
str1
json : 575
eval : 9749
str2
json : 21
eval : 5613
출력정상

IE 8 / 9 / 10 / 11
- 11을 이용한 모드 즉, 실제 환경에선 다른 값이 나올 수 있음
str1
json : 763 / 598 / 678 / 620
eval : 300 / 260 / 256 / 243
str2
json : 128 / 107 / 99 / 87
eval : 126 / 165 / 98 / 108
출력정상

MS Edge
str1
json : 430
eval : 200
str2
json : 129
eval : 138
출력정상

파이어폭스
- 다운됨.. 스케일을 1/10 으로 줄임
str1
json : 66 * 10
eval : 65 * 10
str2
json : 22 * 10
eval : 9595 * 10
출력정상 (그대로하면 다운됨 1/10 스케일)

오페라
str1
json : 658
eval : 11699
str2
json : 32
eval : 7726
출력정상


# 결론
MS를 제외하고는 JSON의 속도가 압도적이다.
다만 JSON 파서 이용시 문법을 완벽하게 맞춰야한다.
``` java
// 정상코드
var a = eval('({a:1})');
// 오류!! json 규칙에서 이름은 "" 로 감싸야함.
var b = JSON.parse('{a:1}');
// 정상
var c = JSON.parse('{"a":1}');
```
