---
layout: post
tags: [가리사니, 기타]
---

> 이 문서는 예전 가리사니 사이트에서 작성된 문서 입니다.
현재 상황과 맞지 않을 수 있습니다.


사용자가 원하는 테이블 열을 반환하고 싶을때
``` sql
CREATE OR REPLACE FUNCTION "함수이름"
(
	name type -- 인자
) RETURNS TABLE (col1 type1, col2 type2) AS $$ -- 동적 테이블
BEGIN
	return query 쿼리문<예) SELECT col1, col2 FROM ... >
END;
$$ LANGUAGE 'plpgsql'
```

테이블을 통체로 반환할때
``` sql
CREATE OR REPLACE FUNCTION "함수이름"
(
	name type -- 인자
) RETURNS "테이블이름" AS $$ -- 자료형
BEGIN
	return query 쿼리문<예) SELECT * FROM "테이블이름" ... >
END;
$$ LANGUAGE 'plpgsql'
```



