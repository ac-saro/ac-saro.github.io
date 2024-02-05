---
layout: post
tags: [elasticsearch, docker]
---

> 이 문서는 가리사니 개발자 포럼에 올렸던 글의 백업 파일입니다.
오래된 문서가 많아 현재 상황과 맞지 않을 수 있습니다.

### 아래 엘라스틱 서치 공식 사이트에 들어가면

https://www.elastic.co/guide/en/elasticsearch/reference/current/docker.html

1. 도커 네트워크를 만들고.
    ```
    docker network create elastic
    ```
1. 도커를 실행하라고 한다. (버전은 홈페이지에서 최신버전으로)
    ```
    docker run --name es01 --net elastic -p 9200:9200 -it docker.elastic.co/elasticsearch/elasticsearch:8.7.0
    ```
1. 물론 필자는 네트워크를 따로 구성하지 않기 때문에 아래와 같이 입력했다.
    ```
    docker run --name es01 -p 9200:9200 -it docker.elastic.co/elasticsearch/elasticsearch:8.7.0
    ```

문제는.. 저걸 그대로 따라하면 ERROR: elasticsearch exited unexpectedly 오류가 발생하면서 실행이 되지 않는다.

### 원인
엘라스틱 서치는 여러 노드간 통신을 하는 기능이 있는데 이 기능이 기본값으로 활성화되어있기 때문이다.
때문에 다른 노드를 찾지 못하고 오류가 나면서 꺼지게 된다.

단순하게 싱글노드 옵션을 주면 해결된다.
```
docker run --name es -p 9200:9200 -p 9300:9300 -it -e "discovery.type=single-node"  docker.elastic.co/elasticsearch/elasticsearch:8.7.0
```
![설명](/file/forum/91baef7b-71e6-49c4-a530-f17ea3380503.png)

### 기타 권장
#### xpack.security.enabled=false
위와 같이 설정하면 ssl(https)가 기본적으로 켜지게 되며, 암호도 설정되어 혼자 사용하거나 내부망일 경우 불편한 경우가 많다 때문에 필자는 "xpack.security.enabled=false" 옵션을 줘서 시큐리티 옵션을 껐다.
(애니시아에서 엘라스틱 서치를 사용하는데 내부망이기 때문에 역시 옵션을 끄고 사용한다.)

#### 자동실행, 이름 변경을 하면 최종적으로 아래 옵션을 권장한다.
(버전만 공식홈페이지에서 최신버전을 가져와서 실행하도록 하자)
```
docker run -d --name elasticsearch -p 9200:9200 -p 9300:9300 --restart=always -e "xpack.security.enabled=false" -e "discovery.type=single-node"  docker.elastic.co/elasticsearch/elasticsearch:8.7.0
```

실행 확인
- http://localhost:9200/

![설명](/file/forum/45493c83-e56f-48ff-bee2-3777d419c552.png)





-- 기타임시: 직접 설치시에는 아래 파일
\config\elasticsearch.yml
```
bootstrap.memory_lock: true
discovery.type: single-node
```