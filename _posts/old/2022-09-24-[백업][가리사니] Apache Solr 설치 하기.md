---
layout: post
tags: [solr]
---

> 이 문서는 가리사니 개발자 포럼에 올렸던 글의 백업 파일입니다.
오래된 문서가 많아 현재 상황과 맞지 않을 수 있습니다.

# 설치 하기

> 최근에는 엘라스틱서치만 보다가.
오랜만에 솔라도 볼겸 한번 설치해 보겠습니다.


- https://solr.apache.org -> Download 메뉴
- Binary releases: solr-9.0.0.tgz 다운로드
- 압축을 풀면 아래와 같이 나오는데 필요한 폴더는 다음과 같습니다.
    ![설명](/file/forum/06c14187-5823-48b5-b2d0-299f56222bbe.png)
- 저 두 폴더를 적당한 곳에 옮겨줍니다.
    ![설명](/file/forum/fc206c81-17e4-49ad-a237-7f3fe7bb375a.png)
   저는 위와 같이 D:/web/solr 로 옮겼습니다.
- 이제 실행해봅시다.
```
# 윈도우
> bin/solr.cmd start
# 리눅스
> bin/solr start
```

![설명](/file/forum/89a90cae-cbd6-48a1-94bc-c349d429b2ba.png)

확인 했다면 종료해 줍니다.
```
# 윈도우
bin/solr.cmd stop -all
# 리눅스
bin/solr stop -all
```
