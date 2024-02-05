---
layout: post
tags: [가리사니, 기타]
---

> 이 문서는 예전 가리사니 사이트에서 작성된 문서 입니다.
현재 상황과 맞지 않을 수 있습니다.


PG-SQL에서는 테이블의 형태를 Json으로 반환 할 수 있습니다.

``` sql
-- 단순히 조회해보기
SELECT row_to_json(별칭) FROM
(
	SELECT 컬럼 FROM "테이블" .....
) 별칭;

-- 반환할때
return (row_to_json(별칭) FROM
(
	SELECT 컬럼 FROM "테이블" .....
) 별칭);
```

컬럼타입이 json[배열포함]일경우엔 자동으로 json의 내부 array형태를 만들어서 반환하게됩니다.