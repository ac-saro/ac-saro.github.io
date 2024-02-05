---
layout: post
tags: [가리사니, 기타]
---

> 이 문서는 예전 가리사니 사이트에서 작성된 문서 입니다.
현재 상황과 맞지 않을 수 있습니다.


VACUUM은 DB에서 불필요한 잉여자원을 회수하는 일종의 최적화 라고 보시면됩니다.
가리사니에서는 아마 쪽지기능에서 생길만한 현상으로 삽입 삭제가 빈번하거나 파일시스템으로 치면 단편화문제들은 야기할 수 있을 만한 일들을 하였을때 이를 정리해주는 조각모음과 유사하다고 보면됩니다.
9.x가 쓰이는 현재버전 기준으로는 다른 대형DBMS와 같이 내부적으로 실행되기 때문에 이 옵션을 끄지않았다면 크게 신경쓰지 않아도되지만, 갑자기 큰 변화가 생긴다거나 해서 속도가 늦어졌을때 사용하시면 유용합니다.

이 구문으로 인해 실행계획이 변경될 수 있습니다.

``` sql
VACUUM [ ( { FULL | FREEZE | VERBOSE | ANALYZE } [, ...] ) ] [ table_name [ (column_name [, ...] ) ] ]
VACUUM [ FULL ] [ FREEZE ] [ VERBOSE ] [ table_name ]
VACUUM [ FULL ] [ FREEZE ] [ VERBOSE ] ANALYZE [ table_name [ (column_name [, ...] ) ] ]
```

``` sql
-- 예를들어 이런식으로 실행하시면됩니다.
VACUUM FULL ANALYZE
```

공식문서 : http://www.postgresql.org/docs/9.4/static/sql-vacuum.html
