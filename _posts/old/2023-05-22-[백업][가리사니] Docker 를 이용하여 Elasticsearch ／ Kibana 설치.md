---
layout: post
tags: [가리사니, 기타]
---

> 이 문서는 가리사니 개발자 포럼에 올렸던 글의 백업 파일입니다.
오래된 문서가 많아 현재 상황과 맞지 않을 수 있습니다.

# 서론
도커가 나온뒤로는 데몬들을 설치/삭제 하는게 정말 간편해진 것 같다.
그럼 바로 시작해보자.


## 엘라스틱 서치 설치
```
docker run -d --name elasticsearch -p 9200:9200 -p 9300:9300 --restart=always -e "xpack.security.enabled=false" -e "discovery.type=single-node"  docker.elastic.co/elasticsearch/elasticsearch:8.7.0
```
- 참고: https://gs.saro.me/lab?topicId=428

## 키바나 설치
```
docker run -d --name kibana -p 5601:5601 --restart=always docker.elastic.co/kibana/kibana:8.7.1
```
- 접속: http://localhost:5601
![설명](/file/forum/466e85f1-60c8-424e-a8e8-2724496c6813.png)

## 조회하기
- https://anissia.net 의 데이터를 미리 넣어두었다.

![설명](/file/forum/f55c38d4-07ef-49e0-9532-9f294e1b1020.png)

![설명](/file/forum/a808455a-d79e-4754-afd9-5341166b03ab.png)

