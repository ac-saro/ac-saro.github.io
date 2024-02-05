---
layout: post
tags: [가리사니, 기타]
---

> 이 문서는 예전 가리사니 사이트에서 작성된 문서 입니다.
현재 상황과 맞지 않을 수 있습니다.

집에서 운영하는 개인프로젝트에 백업과 개발DB에 싱크할 일이 많아 (프로젝트 초기) 만들어 둔 김에 기록을 위해 올려봅니다.


## 백업

윈도우 기준으로 *SET PGPASSWORD=암호* 를 사용하면 암호입력을 생략할 수 있다.

```
SET PGPASSWORD=암호
"pgsql경로\pg_dump" -U 유저 -d DB명 -f "백업경로.sql"
```
pg_dump 로 백업 했다면 psql로 복원할 수 있다.

## 복원

당연하지만 개인프로젝트 용도로만 쓰자..
회사에서 drop...(어차피 권한도 없을거다.)

```
SET PGPASSWORD=암호
"pgsql경로\pg_dump" -U 유저 -d 운영DB -f "백업경로.sql"
"pgsql경로\dropdb" -U 유저 -f 개발DB
"pgsql경로\createdb" -U 유저 개발DB
"pgsql경로\psql" -U 유저 -d 개발DB -f "백업경로.sql"
```
