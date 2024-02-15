---
layout: post
tags: [servlet, java, version-control]
---

> 이 문서는 가리사니 개발자 포럼에 올렸던 글의 백업 파일입니다.
오래된 문서가 많아 현재 상황과 맞지 않을 수 있습니다.


# 강의를 파트별로 분리하였습니다.
자바기반 GIT 관리 서버
- [/2016/05/20/%EB%B0%B1%EC%97%85-%EA%B0%80%EB%A6%AC%EC%82%AC%EB%8B%88-%EC%9E%90%EB%B0%94-%EA%B8%B0%EB%B0%98%EC%9D%98-GIT-%EA%B4%80%EB%A6%AC-%EC%84%9C%EB%B2%84-(-Windows-GIT-%EC%84%9C%EB%B2%84-%EA%B5%AC%EC%B6%95-).html](/2016/05/20/%EB%B0%B1%EC%97%85-%EA%B0%80%EB%A6%AC%EC%82%AC%EB%8B%88-%EC%9E%90%EB%B0%94-%EA%B8%B0%EB%B0%98%EC%9D%98-GIT-%EA%B4%80%EB%A6%AC-%EC%84%9C%EB%B2%84-(-Windows-GIT-%EC%84%9C%EB%B2%84-%EA%B5%AC%EC%B6%95-).html)
사설 git 관리서버 SCM-Manager 설치
- [/2016/07/10/%EB%B0%B1%EC%97%85-%EA%B0%80%EB%A6%AC%EC%82%AC%EB%8B%88-%EC%82%AC%EC%84%A4-git-%EA%B4%80%EB%A6%AC%EC%84%9C%EB%B2%84-SCM-Manager-%EC%84%A4%EC%B9%98.html](/2016/07/10/%EB%B0%B1%EC%97%85-%EA%B0%80%EB%A6%AC%EC%82%AC%EB%8B%88-%EC%82%AC%EC%84%A4-git-%EA%B4%80%EB%A6%AC%EC%84%9C%EB%B2%84-SCM-Manager-%EC%84%A4%EC%B9%98.html)
사설 git 관리서버 GitBucket 설치
- [/2016/07/10/%EB%B0%B1%EC%97%85-%EA%B0%80%EB%A6%AC%EC%82%AC%EB%8B%88-%EC%82%AC%EC%84%A4-git-%EA%B4%80%EB%A6%AC%EC%84%9C%EB%B2%84-GitBucket-%EC%84%A4%EC%B9%98.html](/2016/07/10/%EB%B0%B1%EC%97%85-%EA%B0%80%EB%A6%AC%EC%82%AC%EB%8B%88-%EC%82%AC%EC%84%A4-git-%EA%B4%80%EB%A6%AC%EC%84%9C%EB%B2%84-GitBucket-%EC%84%A4%EC%B9%98.html)
먼저 필요한 git / java 설치는 자바기반 GIT 관리 서버를 참고해주세요.


# GitBucket
- 서블릿으로 추가할 수 있는 war 형태와 스탠드얼론을 모두 제공합니다.
- 소스코드 : https://github.com/gitbucket/gitbucket
- 릴리즈 : https://github.com/gitbucket/gitbucket/releases
- 릴리즈에서 gitbucket.war 를 다운받습니다.
글쓰는 시점에서 최신버전인 4.2.1 에 디플로이 버그가 있어서.. 4.2.0 을 받았습니다.
혹시 이상동작하시면 다른버전을 받으시기 바랍니다.....
방법 1 : 서블릿 (war) 설치 (톰켓기준)
- 필자는 이 방법으로 설치하였기 때문에 이방법을 중점으로 설명합니다.
- 서블릿 컨테이너로 서버를 돌리고있지 않다면 이 방법은 크게 의미가 없으니 2번 방법을 사용하시기 바랍니다.
- 그냥 war를 디플로이시키면 끝나지만..
- 필자는 리포지토리/유저 경로를 바꾸려고하니 먼저 압축을 풀도록 하겠습니다.
- WEB-INF/web.xml 을 열어 아래와 같이 고칩니다.
``` java
<!-- ===================================================================== -->
  <!-- Optional configurations -->
  <!-- ===================================================================== -->
  <-- 주석제거 하고 gitbucket.home 를 작성합니다. -->
  <context-param>
    <param-name>gitbucket.home</param-name>
    <!-- 모든 리포지토리/유저데이터 루트를 설정합니다. -->
    <!-- 필자는 예를 들어서 E:\DATA_SERVER\GIT\.gitbucket 로 설정함 -->
    <param-value>E:\DATA_SERVER\GIT\.gitbucket</param-value>
  </context-param>
```
- 서버에 디플로이 시킵니다.
방법 2 : 독립서버 설치
- 아래와 같이 실행합니다. (끝 : 적당히 서비스를 만드시면.....)
java -jar gitbucket.war --port=<포트번호> --gitbucket.home=<모든리포지토리/유저데이터가 저장될 위치>


# GitBucket  설정
실행되면 설정한 리포지토리/유저데이터 폴더에 아래와 같은 폴더들이 생깁니다.
gitbucket.home 위치
- 리포지토리
repositories : 리포지토리 정보
- 설정 / DB(H2) : 웬만하면 직접 건들지 않는걸 추천합니다.
data.mv.db
data.trace.db
database.conf
gitbucket.conf
즉 운영체제를 이전시 위 디렉토리만 복사하면 유저/그룹/리포지토리정보까지 그대로 복사됩니다.
설정한 위치로 접속합니다.
- 예 : http://localhost:8080/
- 기본 계정/암호 [root / root]
- 사용자 / 그룹 / 리포지토리 등등을 만듭니다.
![](/file/old/136.png)
기본 히스토리들도 쭉나오고...
![](/file/old/137.png)
왼쪽 메뉴보면 위키도!!


# 기본골격 만들기
- 반드시 필요한건 아니지만 IDE등에 연동할때 각 툴체인에 맞는 골격을 미리 커밋 해두면 쓰기 편합니다.
- 물론 오픈소스로 공개할때에는 툴체인을 따로 빼거나 아에 포함시키지 않는 경우가 많습니다.
- 사설 GIT은 주로 오픈소스가 아닌 비공개로 쓰기 때문에.
윈도우
- 설정이 적당한 곳에 폴더를 만듭니다.
- 폴더 -> 오른쪽 클릭 -> Git Bash Here
> git clone <SCM-Manager 에서 만든 주소>
- 생성 된 깃 폴더로 이동 .git 이란 이름의 숨김폴더가 있는 폴더
- 해당 폴더에 기본 프로젝트를 만듭니다.
- 해당폴더 -> 오른족 클릭 -> Git Gui Here -> 전체선택 -> commit -> push
- 초기 세팅이 완료되었다면, 이후 원하는 IDE에서 git으로 불러서 사용하시면됩니다.
(물론 윈도우도 오른쪽 클릭 -> Git Bash Here 누르신후 밑에 리눅스 따라하셔도됩니다.)
리눅스
- 적당한 폴더 이동
> git clone <SCM-Manager 에서 만든 주소>
- 기본적인 초기 파일들을 만듭니다.
> git add .
> git commit -m "변경메시지"
> git push --set-upstream origin master


# 추신
- 적용완료!! 프로젝트 이전완료.
![](/file/old/135.png)