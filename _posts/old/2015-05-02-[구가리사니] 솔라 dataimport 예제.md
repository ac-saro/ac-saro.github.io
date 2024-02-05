---
layout: post
tags: [가리사니, 기타]
---

> 이 문서는 예전 가리사니 사이트에서 작성된 문서 입니다.
현재 상황과 맞지 않을 수 있습니다.


dataimport 예제입니다.

``` java
[주소]
# 호스트:포트/solr/코어이름/dataimport

[인자]
# clean
	true : 코어이름에 속한 모든 데이터를 초기화한다. - 정말 문제있을때만 쓰는옵션입니다.
	false : 기존 데이터에 삽입 수정.
# entity
	엔티티 이름 db-data-config에서 선택한 값
# id
	data-config 에서 사용할 id
```

참고문서 db-data-config
[/lab?topicId=36](/lab?topicId=36)