---
layout: post
tags: [가리사니, 기타]
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
먼저 필요한 git / java 설치는 자바기반 GIT 관리 서버를 참고해주세요.


# SCM-Manager
- 서블릿으로 추가할 수 있는 war 형태와 스탠드얼론을 모두 제공합니다.
- 접속 : https://www.scm-manager.org
- 다운로드에 가시면 SCM-Server / SCM-WebApp 이렇게 두가지가 보일겁니다.
SCM-Server : 스탠드얼론(독립서버)
SCM-WebApp : war
방법 1 : 서블릿 (war) 설치 (톰켓기준)
- 위 사이트에서 SCM-WebApp 를 다운받습니다.
- 톰켓 war 디플로이 참고 : [/lab?topicId=217](/lab?topicId=217)
- 서블릿 서버를 운영중인 사람에겐 이방법이 더 편합니다. (필자도 이방법을 사용함)
방법 2 : 독립서버 설치
- 위 사이트에서 SCM-Server 를 다운받습니다.
- 사용할 곳에 압축을 해제합니다. [앞으로 서비스 기본 폴더가됩니다.]
- jetty를 기본적으로 포함하고 있으며 conf폴더에 가셔서 server-config.xml를 엽니다.
- <SystemProperty name="jetty.port" default="8080" /> 에서 포트를 설정해줍니다.
- cmd 를 연후 압축푼폴더/bin폴더로 이동하여 아래와 같이 입력
> scm-server.bat install
- 서비스 (윈도우키 + R 이후 services.msc 입력) 에서 scm-server 를 실행합니다.
- http://localhost:포트번호 가 접속위치입니다.


# SCM-Manager 설정
- 컴퓨터에서 앞으로 git의 루트로 사용할 곳을 만듭니다. (예 D:/git_root )
- 관리 사이트 접속 (방법2는 마지막 http://localhost:포트번호) : 방법1은.. 직접 올리셨기에.. 아실거라 믿습니다....
- 기본 계정/암호 [scmadmin / scmadmin]
- 왼쪽탭 -> Config -> Repository Types
- Mercurial Settings / Subversion Settings 는 각각 Disabled 체크 후 Save
- 위에서 폴더를 생성한 git 루트 경로를 Git Settings의 Repository directory에 입력 (예 D:/git_root ) Save
- 왼쪽탭 -> main -> Repositories
- add 를 누른 후 name(예를들어서 abc), type(git 위에서 Disabled 시켰다면 git밖에없음)를 입력 후 Ok
- 탐색기로 <Repository directory>/<name>에 가보시면 git 폴더가 생성된게 보일겁니다.
- 예를들어 [Repository directory == D:/git_root] [name == abc] 라면 D:/git_root/abc 가 생성되어 있을겁니다.
- 왼쪽탭 -> Security 에서 Users 나 Groups 를 설정합니다.
- 왼족탭 -> main -> Repositories 에가셔서 레파지토리 하나를 선택한 후 permissions 탭에서 그룹을 추가해주시면됩니다.


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
리눅스
- 적당한 폴더 이동
> git clone <SCM-Manager 에서 만든 주소>
- 기본적인 초기 파일들을 만듭니다.
> git commit -am "변경메시지"
> git push