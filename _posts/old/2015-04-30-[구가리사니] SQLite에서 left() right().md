---
layout: post
tags: [가리사니, 기타]
---

> 이 문서는 예전 가리사니 사이트에서 작성된 문서 입니다.
현재 상황과 맞지 않을 수 있습니다.


http://www.sqlite.org/lang_corefunc.html

불행하게도.. sqlite에선 left(), right() 대신 substr()을 쓰라고 합니다.
``` sql
substr(X,Y,Z)
substr(X,Y)
```

그나저나 상당히 특이하게 작동하네요..
~~ 나의 substring은 그러지 않아....~~
``` sql
SELECT substr('gs.saro.me', 4);
 -> 'saro.me'
SELECT substr('가리사니 개발자 공간', 6, 3);
 -> '개발자'
SELECT substr('가리사니 개발자공간', 1, 4);
 -> '가리사니'
SELECT substr('가리사니 개발자공간', -2, 2);
 -> '공간'
```