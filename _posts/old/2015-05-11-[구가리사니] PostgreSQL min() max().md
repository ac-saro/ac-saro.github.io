---
layout: post
tags: [가리사니, 기타]
---

> 이 문서는 예전 가리사니 사이트에서 작성된 문서 입니다.
현재 상황과 맞지 않을 수 있습니다.


pgsql은 min max 대신 greatest least 를 사용한다.

``` sql
select greatest(3,2) -- 3
select least(3,2) -- 2
```