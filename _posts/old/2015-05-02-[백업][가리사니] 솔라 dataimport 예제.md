---
layout: post
tags: [solr]
---

> 이 문서는 가리사니 개발자 포럼에 올렸던 글의 백업 파일입니다.
오래된 문서가 많아 현재 상황과 맞지 않을 수 있습니다.


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
[/2015/05/02/%EB%B0%B1%EC%97%85-%EA%B0%80%EB%A6%AC%EC%82%AC%EB%8B%88-%EC%86%94%EB%9D%BC%EC%97%90%EC%84%9C-db-data-config.xml-%EC%84%A4%EC%A0%95%EB%B2%95.html](/2015/05/02/%EB%B0%B1%EC%97%85-%EA%B0%80%EB%A6%AC%EC%82%AC%EB%8B%88-%EC%86%94%EB%9D%BC%EC%97%90%EC%84%9C-db-data-config.xml-%EC%84%A4%EC%A0%95%EB%B2%95.html)