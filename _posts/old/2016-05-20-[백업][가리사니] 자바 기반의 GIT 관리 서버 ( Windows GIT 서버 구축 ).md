---
layout: post
tags: [version-control]
---

> 이 문서는 가리사니 개발자 포럼에 올렸던 글의 백업 파일입니다.
오래된 문서가 많아 현재 상황과 맞지 않을 수 있습니다.


# 강의를 파트별로 분리하였습니다.
자바기반 GIT 관리 서버
- [/lab?topicId=233](/lab?topicId=233)
사설 git 관리서버 SCM-Manager 설치
- [/lab?topicId=266](/lab?topicId=266)
사설 git 관리서버 GitBucket 설치
- [/lab?topicId=267](/lab?topicId=267)


# 서론
GIT은 버전관리 소프트웨어로 정말로 버전관리 기능만 있습니다.
(어감이 좋지않아 보충하자면 이건 프로토콜적 종속성을 줄이는 장점입니다.)
즉, 로컬이 아닌 외부에서 사용할 때에는 이를 연동해줄 서버가 필요합니다.
리눅스의 경우는 ssh를 이용하여 구축할 수 있습니다.
윈도우도 cygwin나 iis경유하는 프로그램등을 이용한 방법이 있지만 필자는 개인적으로 유저관리를 자체적으로 가지고 있는 GIT 관리서버들을 추천합니다.
필자가 유저를 별도로 관리하는 GIT 관리도구를 추천하는 이유는 아래와 같습니다.
1. 유저정보를 별도로 가지고 있기 때문에 서버를 옴길 때 기존 운영체제 유저를 다시 작성하거나 복사해야하는 번거로움을 줄일 수 있다.
2. 많은 GIT관리서버는 GIT 기능이외에도 유용한 기능들을 내포하고있다.


# git 설치
윈도우 git 설치
- 접속 : https://git-scm.com
- windows 버전을 다운받습니다.
- 특별히 설정하고 싶은게 없다면, 다음 누르면서 설치하지면됩니다.
리눅스 git 설치
우분투
> sudo apt-get install git-all
페도라
> sudo yum install git-all


# java 설치
- [/wiki?dn=5](/wiki?dn=5)
- 자바설치도 클릭하면 다 설치됩니다
- 리눅스의 경우 오라클/openjdk 등이있어서 방법이 많이 갈라지지만 검색해보시면 git과 마찬가지로 각 운영체제별 패키지 매니지먼트에서 한번에 설치할 수 있습니다.


# git 관리서버
문서를 분리하면서 내용이 확줄어들어 먼가 허전하지만.. 기분탓입니다.
사설 git 관리서버 SCM-Manager 설치
- [/lab?topicId=266](/lab?topicId=266)
사설 git 관리서버 GitBucket 설치
- [/lab?topicId=267](/lab?topicId=267)