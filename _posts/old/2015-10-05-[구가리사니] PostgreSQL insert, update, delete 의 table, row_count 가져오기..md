---
layout: post
tags: [가리사니, 기타]
---

> 이 문서는 예전 가리사니 사이트에서 작성된 문서 입니다.
현재 상황과 맞지 않을 수 있습니다.


``` sql
WITH 테이블변수명 AS
(
	DELETE FROM 테이블
		WHERE 조건
		RETURNING 리턴할컬럼명 -- *는 전부다 리턴
) SELECT 가져올컬럼 FROM 테이블변수명;
```
예를들어 아래와 같이 쓸 수 있습니다.
``` sql
-- -------------------------------------------------------------------------------
-- 역활 : 가리사니 하루한번 도는 배치 새벽 4시
-- 2015-10-05 : 작성
-- -------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION "bat_date_04_00"
() RETURNS void AS $$
DECLARE
	__count bigint;
	__log text;
BEGIN

	__log = '';

	-- 어제이전 조회수 기록 삭제
	WITH __delete_table AS
	(
		-- RETURNING true AS t : 사실상 갯수만 받아오면 되기 때문에 1바이트짜리 아무거나 리턴!
		DELETE FROM "SilHit" WHERE date < current_date RETURNING true AS t
	) SELECT count(*) INTO __count FROM __delete_table;

	__log = __log || __count || '개의 조회수 데이터를 삭제하였습니다.';

	-- 여러가지 배치 생략

	-- 로그 남기기
	PERFORM log_sys_add('BAT', __log, NULL);

END;
$$ LANGUAGE 'plpgsql'
```

위와 같은 방법으로 insert 나 update 도 RETURNING 을 통해 실행 객체를 가져올 수 있습니다.

참고 : http://engineering.tilt.com/7-postgresql-data-migration-hacks/