---
layout: post
tags: [가리사니, 기타]
---

> 이 문서는 예전 가리사니 사이트에서 작성된 문서 입니다.
현재 상황과 맞지 않을 수 있습니다.


예전에 Prepared 에 대한 강의를 했던적이 있습니다.
[/lab?topicId=101](/lab?topicId=101)

새로 안 사실인데 JDBC에선 기본값으로 서버사이드의 실행계획이 저장되지 않는다고 하더군요.!

jdbc:postgresql://localhost:포트/디비이름?charSet=UTF-8&prepareThreshold=1
prepareThreshold=1 옵션을 주게될 경우 실행계획 까지 저장된다고 합니다.

https://jdbc.postgresql.org/documentation/publicapi/org/postgresql/PGConnection.html