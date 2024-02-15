---
layout: post
tags: [tomcat, version-control, maven]
---

> 이 문서는 가리사니 개발자 포럼에 올렸던 글의 백업 파일입니다.
오래된 문서가 많아 현재 상황과 맞지 않을 수 있습니다.


사설 git ( [/2016/07/10/%EB%B0%B1%EC%97%85-%EA%B0%80%EB%A6%AC%EC%82%AC%EB%8B%88-%EC%82%AC%EC%84%A4-git-%EA%B4%80%EB%A6%AC%EC%84%9C%EB%B2%84-GitBucket-%EC%84%A4%EC%B9%98.html](/2016/07/10/%EB%B0%B1%EC%97%85-%EA%B0%80%EB%A6%AC%EC%82%AC%EB%8B%88-%EC%82%AC%EC%84%A4-git-%EA%B4%80%EB%A6%AC%EC%84%9C%EB%B2%84-GitBucket-%EC%84%A4%EC%B9%98.html) )에 이어서 사설 시리즈를 달려봅니다...


# 서론 : 사설 리포지토리가 왜 필요한가?
사실 필자는 최근 까지도 메이븐을 사용하지 않고 jar를 직접 추가하는 방식으로 작업을 해왔습니다.
그래서 최근 프로젝트를 전부 메이븐으로 바꾸는데 약간의 문제가 발생하였습니다.
필자가 사용하는 오픈소스중 일부는 현시점에 메이븐에 없거나 ( simplecaptcha-1.2.1.jar ) 메이븐에 있고 버전도 동일하지만 소스가 다른 특이한 경우도 있습니다.
뭐 사실 pom.xml 을 아래와 같이 설정하면 해결되기는 합니다.
``` java
<repositories>
	<!-- 레거시 (현재 MAVEN 지원에 이상이 있는 구 LIB) -->
	<repository>
		<id>legacy-jars</id>
		<name>legacy jars</name>
		<url>file://${project.basedir}/lib</url>
	</repository>
</repositories>
...
<!-- 소스가 file://${project.basedir}/lib/lib-legacy/simplecaptcha/1.2.1/simplecaptcha-1.2.1.jar 에 있는경우. -->
<dependency>
	<groupId>lib-legacy</groupId>
	<artifactId>simplecaptcha</artifactId>
	<version>1.2.1</version>
</dependency>
```
하지만 이렇게 되면 서버에 파일을 포함해야되고.. git을 통해 lib 를 포함하여 전파하는등... 새로운 서버 세팅시나 was를 업데이트 할경우에도 실수하기 쉬운 작업들이 늘어납니다.
사설 리포지토리가 왜 필요한가?
- 회사/단체의 화이트 리스트로 인해 외부 리포지토리에 접속하기 어려운 경우 프록시 역활.
- 특히나 비상시 외부 인터넷이 느리거나 리포지토리가 다운되는등 여러 상황에서도 빠르게 받을 수 있다.
- 현재 메이븐에 올라와 있지 않은 자료들은 효율적으로 관리하기 위하여.
- 한번 **다운로드 받은 디펜던시는 로컬에 저장**되지만 컴퓨터를 포멧하거나 동료가 시작할때 설정을 해야한다.
- 서버에도 동일한 설정들을 해줘야함으로 서버 구조가 복잡할 수록 잔업도 늘어난다.
- 예외 파일로 인한 설정이 줄어들어 전체적인 일관성이 증가한다.


# 넥서스 설치
주소 : http://www.sonatype.org/nexus/
넥서스는 메이븐 외에도 NuGet, npm, Bower등 여러 리포지토리를 지원합니다.
방법 1 : war 파일 설치
was위에 추가로 돌리기 위한 방법으로 war 파일을 다뤄본적이 없다면 방법 2로 설치해주세요.
필자는 이방법으로 설치했기 때문에 이 방법을 중점으로 서술합니다.
다운로드
다운로드에서 아무리 찾아봐도 war 가 없습니다...
구글링 결과 http://www.sonatype.org/downloads/nexus-latest.war 로 받으면 2.x 최신 war 가 다운로드됩니다.
설정 - 실행
수정 : war 파일의 /WEB-INF/classes/nexus.properties
-> nexus-work=<모든 데이터를 저장할 폴더> 예) E:\DATA_SERVER\NEXUS
디플로이!!
접속!!
방법 2 : 독립서버
다운로드
사이트에서 다운로드를 누른 후 다운로드를 받습니다.
이 글의 시점으로 무료버전인 Download Nexus Repository OSS 의 3.x 버전에는 maven이 써있지 않습니다.
 2.x 최신으로 받으시길 바랍니다. 물론 프로 트라이얼버전엔 있지만...
설정 - 실행
수정 : <기본폴더>/nexus-<버전>/conf/nexus.properties
-> nexus-work=<모든 데이터를 저장할 폴더> 예) E:\DATA_SERVER\NEXUS
-> application-port=<원하는포트>
윈도우는 cmd 를 관리자 권한으로 리눅스는 sudo를 포함하여 실행합니다.
> cd <기본폴더>/nexus-<버전>/bin
> nexus install
> nexus start
서비스에 가보시면 nexus 라는 이름으로 설치되어있을겁니다.
접속 : http://localhost:<포트>/nexus


# 넥서스 설정
접속 되셨다면 login 합니다.
기본계정암호 : admin / admin123
사이드 메뉴 -> Administration -> Support Tools
workingDirectory	<경로> 가 잘 설정되어잇는지 확인합니다.
필자는 E:\DATA_SERVER\NEXUS 로 설정하였고 실제 들어가보면 다음과 같이 나옵니다.
- 나중에 서버를 교체하거나 백업할때 해당 폴더 이전해주시면됩니다.
![](/file/old/145.png)
- 사이드 메뉴 -> Views/Repositories -> Repositories
- Central 선택 -> 아래탭 -> Browser Remote 확인
- 아래와 같이 여러 목록들이 있는걸 확인할 수 있습니다.
- 탭 Configuration 선택 -> Download Remote Indexes -> True 로 선택 후 -> Save
- 탭 Browser index로 이동
- (Central) 하나만 떡하니 있습니다...
- 그림과 같이 Update Index 를 누릅니다.
![](/file/old/146.png)
- 한 5분정도 기다렸다가... 아래 Refresh 를 누룹니다.
Central 밑으로 상당한 목록이 뜰겁니다.
- 설정에 등록된 https://repo1.maven.org/maven2/ 의 인덱스 클론
- 탭 Browser Storage로 이동
Central 밑에 카탈로그.xml 밖에없습니다. 즉, 인덱스를 가져온거지 클론을 가져온게 아닙니다.
확인해보자
메이븐 프로젝트를 하나 열어서 pom.xml에 다음과 같이 추가합니다.
- 위 리포지토리 path의 public 을 추가합니다. (호스트/content/groups/public/)
``` java
<repositories>
	<repository>
		<id>적당한아이디</id>
		<name>적당한이름</name>
		<!-- central 이 아닌 public 이다.!! public 이 모두 대행한다 -->
		<url>호스트/content/groups/public/ 예)http://localhost:8081/content/groups/public/</url>
		<releases><enabled>true</enabled></releases>
		<snapshots><enabled>true</enabled></snapshots>
	</repository>
</repositories>
...
<dependencies>
	<!-- 디팬더시에 지금까지 없던걸 추가합니다. -->
	<!-- (현재 내 로컬 리포지토리에 없는걸 다운로드받는다!!) : 한번 다운받은건 로컬이 기억하고있어서 다시 다운받지 않음으로 -->
	<!-- 때문에 필자는 간단히 junit의 버전을 바꿔보았습니다. -->
	<dependency>
		<groupId>junit</groupId>
		<artifactId>junit</artifactId>
		<version>4.10</version>
		<scope>test</scope>
	</dependency>
</dependencies>
```
다운로드가 완료된 후 확인해보면 이렇게 스토리지에도 복사된 것을 확인할 수 있습니다.
![](/file/old/147.png)


# 넥서스 3rd party 업데이트
서론에서 말했던 simplecaptcha-1.2.1.jar 을 업데이트 해보겠습니다.
- 사이드 메뉴 -> Views/Repositories -> Repositories -> 3rd party -> Artifact Upload 탭
- GAV Definition -> GAV Parameters 선택
- Select Artifact(s) to Upload... 클릭 파일선택
그림처럼 적당히 작업한 후 Upload -> Artifact upload finished successfully
![](/file/old/148.png)
pom.xml 에 추가해봅니다.
- 물론 작성한대로 추가합니다.
- 작성한 것이 기억나지 않을 경우 리포 -> 3rd party 선택 -> Browse Index 가면 있습니다.
- 리포지토리는 아까 public 을 추가하셨다면 별도로 추가할 필요가 없습니다. public 이 대행.
``` java
<dependency>
  <groupId>ext.jars</groupId>
  <artifactId>simplecaptcha</artifactId>
  <version>1.2.1</version>
</dependency>
```
Maven Dependencies 에 제대로 추가 되었다면 완료!!


# 기타
미러설정
- 참고 : https://maven.apache.org/guides/mini/guide-mirror-settings.html
pom.xml 에서 리포지토리 설정을 하지않아도 가져오게 하려면 settings.xml 을 수정해야합니다.
<로컬리포지토리위치> : 별도로 설정하지 않았다면 "<사용자계정>/.m2/" 입니다. : 이클립스 설정에서도 확인가능
<로컬리포지토리위치>/settings.xml (없으면생성)
``` java
<?xml version="1.0" encoding="UTF-8"?>
<settings xmlns="http://maven.apache.org/SETTINGS/1.0.0"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xsi:schemaLocation="http://maven.apache.org/SETTINGS/1.0.0 http://maven.apache.org/xsd/settings-1.0.0.xsd">
	<mirrors>
		<mirror>
			<id>적당한아이디</id>
			<name>적당한이름</name>
			<url>호스트/content/groups/public/</url>
			<mirrorOf>*</mirrorOf>
		</mirror>
	</mirrors>
</settings>
```
로컬 리포지토리 초기화 + 미러를 통해 새로 가져오기
- 메이븐과 관련된 모든 프로그램을 종료
- <로컬리포지토리위치>/repository 내 모든 내용을 삭제.
- 다시 프로그램들을 켜고 가져옵니다.
- Nexus -> 사이드 메뉴 -> Views/Repositories -> Repositories
- Central -> 탭 Browser Storage에 가시면 새로 가져온 것들이 확인되면 성공!