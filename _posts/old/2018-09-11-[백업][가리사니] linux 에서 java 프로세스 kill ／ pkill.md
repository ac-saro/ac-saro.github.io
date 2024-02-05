---
layout: post
tags: [가리사니, 기타]
---

> 이 문서는 가리사니 개발자 포럼에 올렸던 글의 백업 파일입니다.
오래된 문서가 많아 현재 상황과 맞지 않을 수 있습니다.


# 일반적인 방법
ps 명령어로 pid 확인 후
kill 명령어로 강제종료
``` bash
# pid 찾기
user@host:/path>$ ps -ef | grep test_bat_2018
tomcat   47365     1  2 10:18 ?        00:00:15 /app/jdk-10.0.2/bin/java -jar ./test_bat_2018-1.0.0.jar
tomcat   48233 47685  0 10:30 pts/1    00:00:00 grep --color=auto test_bat_2018

# kill 실행 - pid 매칭 사용
user@host:/path>$ kill -9 47365

# 결과
user@host:/path>$ ps -ef | grep test_bat_2018
tomcat   48233 47685  0 10:30 pts/1    00:00:00 grep --color=auto test_bat_2018
```

# pkill 을 사용하여 pid 삭제와 프로세스 종료를 한번에 실행
``` bash
# 확인
user@host:/path>$ ps -ef | grep test_bat_2018
tomcat   47365     1  2 10:18 ?        00:00:15 /app/jdk-10.0.2/bin/java -jar ./test_bat_2018-1.0.0.jar
tomcat   48233 47685  0 10:30 pts/1    00:00:00 grep --color=auto test_bat_2018

# kill 실행 - 풀 커맨드라인 패턴매칭 사용
user@host:/path>$ pkill -9 -f test_bat_2018

# 결과
user@host:/path>$ ps -ef | grep test_bat_2018
tomcat   48233 47685  0 10:30 pts/1    00:00:00 grep --color=auto test_bat_2018
```

# shell script 로 작성할 경우
쉘 스크립트로 작성할 방법은 많지만 이름이 확실한경우.
pkill 을 사용하여 작성할 수 있습니다.
-f 옵션 : 풀 커맨드 라인 매칭
[자세한 옵션 및 pkill man 보기](https://linux.die.net/man/1/pkill)
``` bash
# kill 실행
pkill -9 -f test_bat_2018
```
## 주의
풀 커맨드 즉 아래의 **커맨드에 매칭될 경우 강제종료** 되기 때문에 매우 조심히써야합니다.
``` bash
/app/jdk-10.0.2/bin/java -jar ./test_bat_2018-1.0.0.jar
```
또한 커맨드의 **패턴은 Extended Regular(확장 정규식)** 임에 또 한번 유의해야 합니다.