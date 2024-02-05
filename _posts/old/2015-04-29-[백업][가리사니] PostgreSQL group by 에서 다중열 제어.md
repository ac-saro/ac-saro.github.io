---
layout: post
tags: [가리사니, 기타]
---

> 이 문서는 가리사니 개발자 포럼에 올렸던 글의 백업 파일입니다.
오래된 문서가 많아 현재 상황과 맞지 않을 수 있습니다.


``` sql
SELECT
	string_agg(비텍스트형태의다중열이름::text, ' '), -- 캐스팅
	string_agg(텍스트형태열이름, ' '), -- 캐스팅이 필요없음
	array_agg(열이름) -- 배열로반환
FROM "테이블이름"
GROUP BY 그룹열
```