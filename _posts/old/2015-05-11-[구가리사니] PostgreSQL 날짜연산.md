---
layout: post
tags: [가리사니, 기타]
---

> 이 문서는 예전 가리사니 사이트에서 작성된 문서 입니다.
현재 상황과 맞지 않을 수 있습니다.

일반적인 DBMS 에서는 add_date() 같은 함수를 사용하거나 직접 숫자로 더하지만 포스트그레스큐엘에선 interval 이라는 자료형을으로 캐스팅하여 날짜를 연산합니다.

``` sql
-- 현재시간에서 10시간 더해서 나옵니다.
select now() + interval '10 hour';

-- 굳이 설명이 필요하진 않지만 반대로 10시간을 뺄 수 있습니다.
select now() - interval '10 hour';
```

사용할 수 있는 단위는 아래와 같습니다.



|이름|
|---|
|microseconds|
|milliseconds|
|second|
|minute|
|hour|
|day|
|week|
|month|
|quarter|
|year|
|decade|
|century|
|millennium|



문법이 특이하다고 생각할 수 있지만 여기서 쓰인 interval(참고 datatype-datetime.html)은 하나의 자료형 입니다.

참고
- http://www.postgresql.org/docs/9.4/static/functions-datetime.html
- https://www.postgresql.org/docs/current/datatype-datetime.html