---
layout: post
tags: [postgresql]
---

> 이 문서는 가리사니 개발자 포럼에 올렸던 글의 백업 파일입니다.
오래된 문서가 많아 현재 상황과 맞지 않을 수 있습니다.


pgsql은 min max 대신 greatest least 를 사용한다.

``` sql
select greatest(3,2) -- 3
select least(3,2) -- 2
```