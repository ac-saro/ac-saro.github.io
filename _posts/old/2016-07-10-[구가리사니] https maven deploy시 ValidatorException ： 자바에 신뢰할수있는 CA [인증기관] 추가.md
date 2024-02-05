---
layout: post
tags: [가리사니, 기타]
---

> 이 문서는 예전 가리사니 사이트에서 작성된 문서 입니다.
현재 상황과 맞지 않을 수 있습니다.


# 서론
최근 사로프로젝트를 SVN -> GIT 작업을 하면서 메이븐 디플로이도 https 로 바꾸었는데 문제가 생겼습니다.
[INFO] ------------------------------------------------------------------------
[INFO] BUILD FAILURE
[INFO] ------------------------------------------------------------------------
....
[INFO] ------------------------------------------------------------------------
[ERROR] Failed to execute goal org.apache.tomcat.maven:tomcat7-maven-plugin:2.2:redeploy (default-cli) on project <프로젝트>: Cannot invoke Tomcat manager: sun.security.validator.ValidatorException: PKIX path building failed: sun.security.provider.certpath.SunCertPathBuilderException: unable to find valid certification path to requested target -> [Help 1]
바로 웹서버 인증서의 CA가 신뢰할 수 없는 기관이라고 판단했기 때문입니다.


# 브라우저에선 잘 작동하는데 왜 신뢰할 수 없는가?
https 통신에선 인증서의 CA(발급기관)이 신뢰할 수 있는 기관인지 확인하는 작업이 있습니다.
문제는 이 신뢰할 수 있는 인증기관(CA)이 플랫폼별로 다릅니다.
인터넷 익스플로러, C# 등은 윈도우 운영체제에서 관리.
JAVA 같은경우 자체적으로 가지고있으며, 기타브라우저는 대부분 브라우저 자체내에서 관리합니다.
사로/가리사니에서 사용하는 startcom CA는 모든 메이저 브라우저에서 신뢰하지만 JAVA에서는 해당 CA를 신뢰하지 않습니다.


# JAVA의 신뢰할 수 있는 CA에 추가하기
- 먼저 CA를 다운받습니다.
- https를 설정해 보신적이 있다면 CA파일도 가지고 있을 것 입니다.
- 커맨드를 관리자 권한으로 실행합니다. (리눅스라면 명령시 sudo)
JAVA_HOME 위치가에가면 다음과 같이 버전 정보가 붙은 폴더가 있습니다.
jdk0.0.0_00 / jre0.0.0_00
메이븐은 JDK 를 사용하기 때문에 JDK의 JRE만 고치면됩니다.
JAVA_HOME /jdk0.0.0_00/bin/keytool 에 다음과 같이 입력합니다.
(당연하지만 keytool은 jre로 들어가도 상관없습니다.)
> keytool -import -alias StartCom-Root-CA -file <CA파일위치> -keystore <JAVA_HOME /jdk0.0.0_00/jre/lib/security/cacerts>
- 별칭은 말그대로 별칭일 뿐임으로 중복되지 않게 아무거나 지어주시면됩니다.
- 이 keytool 이 관리자 권한으로 실행되야합니다.
- 추가가 완료되었다면 이제 메이븐 디플로이시에 정상작동을 확인 할 수 있습니다.


# 윈도우용 배치
``` java
@echo on
cls
:: +++++++++++++++++++++++++++++++++++++++
:: JAVA JDK 에 신뢰할 수 있는 CA(인증기관) 추가
:: Add trust certificate CA in JAVA JDK
:: 2016-07-11 전명 박용서 : create
:: link : [/lab?topicId=269](/lab?topicId=269)
:: +++++++++++++++++++++++++++++++++++++++
:: ##### 사용자 설정 #####
:: ##### Configuration this block #####
::
:: + JDK PATH
set JDK_HOME=C:\Program Files\Java\jdk1.8.0_92\
::
:: + CA FILE PATH
set CA_FILE_PATH=C:\TEST\KEY\PATH\ca.cer
::
:: + CA Alias : unique name (고유이름)
set CA_ALIAS=My-Root-CA
::
:: +++++++++++++++++++++++++++++++++++++++
:: +++++++++++++++++++++++++++++++++++++++
:: ##### 이 줄 아래로 수정하지 마세요. #####
:: ##### Do not edit code under this line. #####
:: +++++++++++++++++++++++++++++++++++++++


set KEYTOOL="%JDK_HOME%bin\keytool.exe"
set CACERTS="%JDK_HOME%jre\lib\security\cacerts"

%KEYTOOL% -import -alias %CA_ALIAS% -file %CA_FILE_PATH% -keystore %CACERTS%

set /p DUMMY = DONE
```