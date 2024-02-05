---
layout: post
tags: [가리사니, 기타]
---

> 이 문서는 예전 가리사니 사이트에서 작성된 문서 입니다.
현재 상황과 맞지 않을 수 있습니다.


PostgreSQL DISTINCT

PostgreSQL DISTINCT는 ON 때문에 조금 신기한 모양을 가지고있습니다.
``` sql
-- 정상
SELECT
	DISTINCT ON (a, b)
	a,
	c,
	d
FROM "테이블"
ORDER BY a, b, c DESC
```

하지만 아래와 같은 코드는 속도 때문인지 오류가나면서 실행되지않습니다.
``` sql
-- 오류 : DISTINCT ON () 을 ORDER BY 규칙에 따라 실행하라는 듯한 오류
SELECT
	DISTINCT ON (b)
	a,
	c,
	d
FROM "테이블"
ORDER BY a, b, c DESC
```
