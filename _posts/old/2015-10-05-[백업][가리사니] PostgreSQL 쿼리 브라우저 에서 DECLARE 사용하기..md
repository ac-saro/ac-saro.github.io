---
layout: post
tags: [postgresql]
---

> 이 문서는 가리사니 개발자 포럼에 올렸던 글의 백업 파일입니다.
오래된 문서가 많아 현재 상황과 맞지 않을 수 있습니다.


pg-sql 에서는 쿼리브라우저에서 그냥 DECLARE 를 사용시 작동하지 않습니다.
때문에 아래와 같이 정확히 영역을 잡아서 사용하셔야 합니다.

``` sql
DO $$
DECLARE __count bigint;
BEGIN
	-- query ....
END $$;
```

다만 do ~ end 사이에서 SELECT 를 할수 없기 때문에 내부적으로 테이블을 만들어서 기록하는등의 매우 불편한 방법을 써야합니다.