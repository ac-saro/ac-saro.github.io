---
layout: post
tags: [가리사니, 기타]
---

> 이 문서는 예전 가리사니 사이트에서 작성된 문서 입니다.
현재 상황과 맞지 않을 수 있습니다.


CROSS APPLY 는 MSSQL의 기능으로 OUTER JOIN 과 비슷하지만, 상황에 따라 장점이 있는 구문입니다.

예를들어 아래와 같이
``` sql
-- 가나다라
SELECT
	*
FROM [테이블1] a
CROSS APPLY
(
	SELECT
		TOP (a.total_count) *
	FROM [테이블2] b1
	ORDER BY b.col1
) b
```
내부에서 재정렬을 하거나 특이한 속성을 줄 때 유용하며, 상황에 따라서는 가독성도 나아집니다.

당연한 이야기지만 MSSQL이 적당한 플랜을 짜주기 때문에 OUTER JOIN과 같은 플랜이 나올 수있습니다.