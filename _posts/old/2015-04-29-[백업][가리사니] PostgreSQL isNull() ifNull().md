---
layout: post
tags: [postgresql]
---

> 이 문서는 가리사니 개발자 포럼에 올렸던 글의 백업 파일입니다.
오래된 문서가 많아 현재 상황과 맞지 않을 수 있습니다.


보통 MSSQL이나 MySQL을 쓰신분들은
isNull이나 ifNull에 익숙하시지만 포스트그레스큐엘에선 coalesce 를 사용합니다.

이름만 다를뿐 사용법은 같습니다.
``` sql
select coalesce(null, 1, 'abc') -- 결과 1
```