---
layout: post
tags: [가리사니, 기타]
---

> 이 문서는 예전 가리사니 사이트에서 작성된 문서 입니다.
현재 상황과 맞지 않을 수 있습니다.


http://www.postgresql.org/docs/9.4/static/functions-json.html

의외로 상당히 간단합니다.

# json_to_recordset(json)

``` sql
select
	*
from json_to_recordset('[{"a":1,"b":"foo"},{"a":"2","c":"bar"}]') as x(a int, b text);
```