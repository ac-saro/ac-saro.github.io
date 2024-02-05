---
layout: post
tags: [solr, search-engine]
---

> 이 문서는 가리사니 개발자 포럼에 올렸던 글의 백업 파일입니다.
오래된 문서가 많아 현재 상황과 맞지 않을 수 있습니다.

# CRUD
솔라에서는 http를 이용해서 **조회, (삽입/수정), 삭제** 이렇게 3가지 명령을 할 수 있습니다.
데이터의 형식은 xml, json 등 여러가지 방식이 있지만.
가장 인기가 많은 json 방식만 다루도록 하겠습니다.

# UPDATE (삽입, 수정)
솔라에서는 R-DB 기준으로 insert와 update가 합쳐진 형태로, insert만 존재하며, 기본키가 겹칠경우 덮어쓰도록 되어 있습니다.
```
-- commit=true 에 대해선 맨 아래에 설명하도록 하겠습니다.
Content-Type: application/json
method: post
http://host:port/solr/스키마/update?commit=true
```
배열 형태로 여러개의 데이터를 업데이트가 가능합니다.
데이터 1개를 업데이트 하더라도 배열 형태로 씁니다.
```
[
    {
        "topicId":"1",
        "regDt":"2015-04-23T16:37:41Z",`
        "userName":"가리사니",
        "forumId":"lab"
    },
    {
        "topicId":"2",
        "regDt":"2015-04-23T16:52:16Z",
        "userName":"가리사니",
        "forumId":"lab"
    }
]
```

# UPDATE (삭제)
```
Content-Type: application/json
method: post
http://host:port/solr/스키마/update?commit=true
```
(삽입/삭제)와 같은 주소를 이용하기 때문에 헷갈릴 수 있습니다.
다만 루트에 배열 형태 없이 바로 { "delete": [유니크키...] } 형태로 사용합니다.
```
{
    "delete" : [1, 2, 3]
}
```


# SELECT (조회)

![설명](/file/forum/a874704f-950d-4b7e-9395-b5b795beaa61.png)

조회 쪽은 옵션이 많은 대신 매니지 콘솔에서 원하는 쿼리를 쓰고 오른쪽 위를 보면 쿼리문을 알 수 있다.

```
method: get
http://host:port/solr/스키마/select?q=subject:솔라
```
조회 쪽은 옵션이 많기 때문에 다음 글에서 자세하게 다룰 예정입니다.


# Commit
update문에 ~~/update=commit=true 이런 식으로 사용합니다.
개인적으로 커밋은 그냥 true를 쓰는 것을 추천합니다.
데이터베이스의 트랜잭션과 다르게 솔라는 DB의 트랜잭션 같은 개념이 없기 때문에.
커밋과 롤백을 하는 경우 오히려 다른 접속에 영향을 줄 수 있습니다.
(제가 지금 까지 찾아본 바로는 관계형 DB 처럼 트랜잭션영역을 주고 깔끔하게 커밋/롤백이 안되는 것 같습니다.)