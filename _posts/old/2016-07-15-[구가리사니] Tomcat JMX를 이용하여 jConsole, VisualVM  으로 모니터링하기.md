---
layout: post
tags: [가리사니, 기타]
---

> 이 문서는 예전 가리사니 사이트에서 작성된 문서 입니다.
현재 상황과 맞지 않을 수 있습니다.


# 서론
톰켓 버전업 이후로부터 슬슬 CPU 점유율이 올라가는 것 같아 모니터링을 해보기위해 jmx 를 설치해 보았습니다.


# JMX 란?
참고 : https://en.wikipedia.org/wiki/Java_Management_Extensions
Java Management Extensions 의 약자로 각종 프로그램/장치 등을 모니터링/관리 하기 위한 API 입니다.


# 톰켓에 JMX 설정
# 설치가 아닌 설정인 이유는 tomcat 8.0.x 로 테스트 해본 결과 이미 톰켓에 포함되어 있기 때문에, 톰켓사이트에서 JMX Remote jar를 받아서 lib에 넣을 필요가 없습니다.
참고 : http://tomcat.apache.org/tomcat-9.0-doc/monitoring.html
리눅스
- > 톰켓폴더/bin/setenv.sh 생성
``` java
export CATALINA_OPTS="-Dcom.sun.management.jmxremote \
-Dcom.sun.management.jmxremote.port=<사용할포트> \
-Dcom.sun.management.jmxremote.authenticate=false \
-Dcom.sun.management.jmxremote.ssl=false"
```
윈도우
방법 1
- 톰켓폴더/bin/Tomcat8w.exe 열기 -> Java 탭 -> Java Options: 빈줄공백없이 이어서 입력
``` java
-Dcom.sun.management.jmxremote
-Dcom.sun.management.jmxremote.port=<사용할포트>
-Dcom.sun.management.jmxremote.ssl=false
-Dcom.sun.management.jmxremote.authenticate=false
```
방법 2
톰켓 문서대로 톰켓폴더/bin/setenv.bat에 넣으면 안되는 것 같습니다....
톰켓폴더/bin/catalina.bat 을 열어 CATALINA_OPTS 가 쓰이기전 (잘모르겠으면 최상단) 에 아래와 같이 추가합니다.
``` java
set CATALINA_OPTS=-Dcom.sun.management.jmxremote ^
-Dcom.sun.management.jmxremote.port=<사용할포트> ^
-Dcom.sun.management.jmxremote.authenticate=false ^
-Dcom.sun.management.jmxremote.ssl=false
```


# 톰켓 실행
톰켓을 재시작 했다면 방화벽에서 사용할 포트를 열어줍니다.
현재 예제는 암호 설정을 하지 않았기 때문에 허용할 IP를 지정하여 방화벽을 열어주시기 바랍니다.
암호 설정법은 아래 추가로 적어두었습니다.


# jconsole
JAVA_HOME/jdk1.8.0_92/bin 으로 이동 jconsole 을 실행시킵니다.
Remote Process: 에 호스트:<설정한포트> 를 입력 해줍니다.


# Java VisualVM
jconsole 로는 나오는 정보가 좀 부족한것 같아 Java VisualVM 을 실행시켜보도록 하겠습니다.
JAVA_HOME/jdk1.8.0_92/bin 으로 이동 jvisualvm 을 실행시킵니다.
File -> Add JMX Connection... ->  호스트:<설정한포트> 를 입력 해줍니다.
여러가지 정보가 나오지만 jconsole 에서 나왔던 일부 정보들은 나오지않습니다.
메뉴 -> Tool -> Plugins
![](/file/old/149.png)
모두다 추가해보겠습니다. 하하하....;;;
![](/file/old/150.png)
완료!


# 암호설정
참고 : http://tomcat.apache.org/tomcat-9.0-doc/monitoring.html
암호를 설정하시려면 아까 옵션에서
-Dcom.sun.management.jmxremote.authenticate=false 를 true 로 바꿔주고 아래 2개 옵션을 추가해주시기 바랍니다.
-Dcom.sun.management.jmxremote.password.file=암호파일경로
-Dcom.sun.management.jmxremote.access.file=엑세스파일경로
암호파일
monitorRole <암호>
controlRole <암호>
엑세스파일
monitorRole readonly
controlRole readwrite
