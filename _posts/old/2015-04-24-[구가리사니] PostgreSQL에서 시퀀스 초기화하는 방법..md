---
layout: post
tags: [가리사니, 기타]
---

> 이 문서는 예전 가리사니 사이트에서 작성된 문서 입니다.
현재 상황과 맞지 않을 수 있습니다.


PG-SQL에서 시퀀스[자동증가/수열]을 초기화 하려면 다음과 같이입력합니다.

``` sql
ALTER SEQUENCE "시퀀스이름" RESTART WITH 1
```