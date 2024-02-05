---
layout: post
tags: [가리사니, 기타]
---

> 이 문서는 가리사니 개발자 포럼에 올렸던 글의 백업 파일입니다.
오래된 문서가 많아 현재 상황과 맞지 않을 수 있습니다.



> 이글의 출처는 다음과 같습니다.
>
http://blog.arzz.com/411


AUTO_INCREMENT는 SQL의 표준이 아닌 비표준 속성으로 제가 알고있기로는 Mysql과 SQLite3에서만 원하는 결과를 얻을 수 있는 속성입니다. 오라클이라던지 다른 DBMS는 보통 sequence 를 이용하여, 자동증가하는 고유값을 이용하죠.

다들 아시겠지만, Mysql에서는 테이블을 생성할때, CREATE TABLENAME (IDX INT(11) AUTO_INCREMENT PRIMARY KEY ... 이렇게 주고 생성하면, 자동으로 증가하는 고유필드를 만들 수 있습니다.

그런데, SQLite3도 Mysql 과 비슷한 AUTO_INCREMENT 속성을 지원하긴 하지만, 쿼리문이 약간 틀립니다.
SQLite3에서 사용하려면, 필드의 타입을 Integer로 주고, Primary Key속성만 주면 원하는 결과를 얻을 수 있습니다.
Integer타입의 필드에 고유값 속성만 주면 알아서 AUTO_INCREMENT속성을 준것과 같이 동작한다는 말이죠. ^^;

``` sql
CREATE TABLENAME (IDX INTEGER PRIMARY KEY, TITLE VARCHAR(10));
-- 위의 쿼리로 테이블을 생성한뒤에,
INSERT INTO TABLENAME (TITLE) VALUES (테스트');
-- 위의 쿼리로 데이터를 삽입합니다.
```

``` sql
SELECT * FROM TABLENAME; -- 으로 확인하시면 아래처럼 자동으로 증가된 값이 들어가있음을 확인할 수 있습니다.

1|테스트
```