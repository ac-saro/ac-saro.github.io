---
layout: post
tags: [가리사니, 기타]
---

> 이 문서는 가리사니 개발자 포럼에 올렸던 글의 백업 파일입니다.
오래된 문서가 많아 현재 상황과 맞지 않을 수 있습니다.

### 서론
#### [git 이력 삭제](https://gs.saro.me/lab?topicId=390) 도중 아래와 같은 오류가 났다.

![설명](/file/forum/ed82ed97-c6c3-4b9f-98cb-7bbc4ace9715.png)

그래서 직접 github에 publickey를 등록해보기로 했다.

#### 1. 키 생성
```
ssh-keygen -t ed25519 -C "이메일주소"
```
![설명](/file/forum/2569c662-3c31-45f7-8dc4-b4eb5048bc0f.png)

위와 같이 공개키가 저장된 위치를 친절하게 알려준다.

![설명](/file/forum/33d7defe-0be6-4929-a373-2e6af7d8257d.png)

공개키 전체를 복사한다.

#### 2. 깃허브에 등록
1. https://github.com 에 접속한다.

![설명](/file/forum/309ea427-ca19-4c26-b425-b39e77a108a8.png)

2. 아까 복사한 퍼블릭키를 붙여넣기한다.


![설명](/file/forum/861fea5b-6cfd-4882-90e2-dc7dd44ff80c.png)

#### 3. 완료.

![설명](/file/forum/f688ced3-dbda-4326-9afc-a733818a7e16.png)

이제 명령이 잘 실행되는 것을 확인 할 수 있다.





### 참고
- https://docs.github.com/en/authentication/troubleshooting-ssh/error-permission-denied-publickey
- https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent
