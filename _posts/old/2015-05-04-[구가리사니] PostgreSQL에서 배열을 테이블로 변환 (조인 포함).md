---
layout: post
tags: [가리사니, 기타]
---

> 이 문서는 예전 가리사니 사이트에서 작성된 문서 입니다.
현재 상황과 맞지 않을 수 있습니다.


``` sql
-- 예를 들어 다음과 같이 unnest을 사용하면 테이블이됩니다.
SELECT
	*
FROM unnest(ARRAY[1,2])

-- 조금더 응용하면 이런식으로 조인을 할수있습니다.
SELECT
	*
FROM unnest(ARRAY[1,2]) a
LEFT JOIN "테이블" b
ON a.a = b.조인할컬럼
```