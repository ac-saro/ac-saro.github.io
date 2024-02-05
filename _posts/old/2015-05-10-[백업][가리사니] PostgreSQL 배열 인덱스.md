---
layout: post
tags: [postgresql]
---

> 이 문서는 가리사니 개발자 포럼에 올렸던 글의 백업 파일입니다.
오래된 문서가 많아 현재 상황과 맞지 않을 수 있습니다.


PostgreSQL 배열 인덱스

참고문서 :
	http://www.postgresql.org/docs/current/static/functions-array.html
	http://www.postgresql.org/docs/current/static/indexes-types.html

PostgreSQL 에선 배열의 인덱스를 지원하며 이는 Gin 타입의 인덱스를 써야한다.

``` sql
CREATE TABLE "Table" ("nos" int[]);
INSERT INTO "Table" VALUES ({10, 15, 20}');
INSERT INTO "Table" VALUES ({10, 20, 30}');

CREATE INDEX "Table__nos" on "Table" USING GIN ("nos");

SELECT * FROM "Table" WHERE "nos" @> ARRAY[20];
```