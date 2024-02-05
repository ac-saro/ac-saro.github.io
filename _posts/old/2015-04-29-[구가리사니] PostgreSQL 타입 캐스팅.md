---
layout: post
tags: [가리사니, 기타]
---

> 이 문서는 예전 가리사니 사이트에서 작성된 문서 입니다.
현재 상황과 맞지 않을 수 있습니다.


PostgreSQL 에선 ::를 통하여 타입캐스팅을 하게됩니다.

``` sql
'1'::int
'1'::bigint
'2011-11-11'::date
'{abc : 1, def : "abcde"}'::json
'{1,3,4,5}'::int[]
```