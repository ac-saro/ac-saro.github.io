---
layout: post
tags: [postgresql]
---

> 이 문서는 가리사니 개발자 포럼에 올렸던 글의 백업 파일입니다.
오래된 문서가 많아 현재 상황과 맞지 않을 수 있습니다.


PostgreSQL 배열형 자료형을 스트링으로 변환반환
``` sql
-- 예제 1
SELECT array_to_string(열이름, '구분자');

-- 예제 2
SELECT
	array_to_string(열이름, '구분자')
FROM "테이블이름"
...
```
같은거지만 보기좋으라고 두번썼습니다.
~~제가 보기 좋으려고요..~~