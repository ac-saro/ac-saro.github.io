---
layout: post
tags: [가리사니, 기타]
---

> 이 문서는 가리사니 개발자 포럼에 올렸던 글의 백업 파일입니다.
오래된 문서가 많아 현재 상황과 맞지 않을 수 있습니다.

Tampermonkey
- https://www.tampermonkey.net

개발을 하다보면 개발 콘솔을 열고 여러가지 자바스크립트 작업을 해야 할 때가 있다.
때로는 그런 작업이 반복적으로 일어날 때가 있다.
템퍼몽키는 이러한 반복적 작업을 줄여줄 수 있다.


보통 크롬을 많이 사용하니 크롬 기준으로 설명한다.

### 설치
https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo

### 사용예제
![설명](/file/forum/700ce40b-f3ba-47bc-acc2-bda90c1f33a4.png)
로컬에서 로그인하면 다음과 같은 흰 화면으로 이동 한다고 하자.
(세션 로그인은 되었으나 이동은 불가)
하지만 이게 회사나 단체의 규칙 상 수정할 수 없다고 하자.
그럼 저 리다이렉트인 /abcde로 이동 시켜야 하는데.
이걸 매번 수기로 하기 귀찮다.

![설명](/file/forum/1c8eeb47-383a-448e-b316-4fb8bbff5497.png)
새 스크립트 만들기를 한다.


![설명](/file/forum/c18cd8a7-0d72-49f3-83ed-65e360d02aa0.png)
@name, @match 부분을 맞춰준다.
@match는 와일드카드 사용이 가능하며 그림처럼 사용할 수 있다.

![설명](/file/forum/a1b2b8d6-7ce6-4c3d-a70f-526186dcb5e1.png)
실행하며 아래와 같이 실행할 수 있다.

저 부분을 코딩함으로써 원하는 기능들을 넣을 수 있다.