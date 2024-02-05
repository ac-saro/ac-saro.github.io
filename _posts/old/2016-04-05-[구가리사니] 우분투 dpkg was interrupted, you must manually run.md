---
layout: post
tags: [가리사니, 기타]
---

> 이 문서는 예전 가리사니 사이트에서 작성된 문서 입니다.
현재 상황과 맞지 않을 수 있습니다.


apt-get 을 사용하다 dpkg was interrupted, you must manually run 오류시.

아래 명령어를 실행하여 폴더를 비웁니다.
rm /var/lib/dpkg/updates/*

다시 apt-get 명령을 실행합니다.
