---
layout: post
tags: [가리사니, 기타]
---

> 이 문서는 가리사니 개발자 포럼에 올렸던 글의 백업 파일입니다.
오래된 문서가 많아 현재 상황과 맞지 않을 수 있습니다.


timestamp 연산을 한다고 했을때, 마이크로초까지 지원되는 데이터를 초정도까지 맞춰 계산하기가 힘든 문제점이 있습니다.

date_trunc를 사용하여 데이터 단위를 내림 할 수 있습니다.
``` sql
-- 실행
date_trunc('hour', timestamp '2001-02-16 20:38:40')
-- 결과 : 38분 40초를 버렸다.
2001-02-16 20:00:00
```


``` sql
-- 단위
microseconds
milliseconds
second
minute
hour
day
week
month
quarter
year
decade
century
millennium
```