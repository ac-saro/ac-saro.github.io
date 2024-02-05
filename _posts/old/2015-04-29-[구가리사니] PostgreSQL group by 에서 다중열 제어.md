---
layout: post
tags: [가리사니, 기타]
---

> 이 문서는 예전 가리사니 사이트에서 작성된 문서 입니다.
현재 상황과 맞지 않을 수 있습니다.


``` sql
SELECT
	string_agg(비텍스트형태의다중열이름::text, ' '), -- 캐스팅
	string_agg(텍스트형태열이름, ' '), -- 캐스팅이 필요없음
	array_agg(열이름) -- 배열로반환
FROM "테이블이름"
GROUP BY 그룹열
```