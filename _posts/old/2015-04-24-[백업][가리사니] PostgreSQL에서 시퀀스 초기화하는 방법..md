---
layout: post
tags: [postgresql]
---

> 이 문서는 가리사니 개발자 포럼에 올렸던 글의 백업 파일입니다.
오래된 문서가 많아 현재 상황과 맞지 않을 수 있습니다.


PG-SQL에서 시퀀스[자동증가/수열]을 초기화 하려면 다음과 같이입력합니다.

``` sql
ALTER SEQUENCE "시퀀스이름" RESTART WITH 1
```