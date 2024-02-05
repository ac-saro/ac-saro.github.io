---
layout: post
tags: [java, maven]
---

> 이 문서는 가리사니 개발자 포럼에 올렸던 글의 백업 파일입니다.
오래된 문서가 많아 현재 상황과 맞지 않을 수 있습니다.


좀더 자세한 설명은 아래 주소 참고.
[/lab?topicId=282](/lab?topicId=282)

# 로그백
- 사이트 : http://logback.qos.ch/
- 아직 실무에선 log4j 가 더 많이 쓰이지만 속도적으로 더 우세한 로거


# pom.xml 설정
<properties> 에 아래와 같이 추가합니다.
``` java
<logback.version>1.1.7</logback.version>
```
<dependencies> 에 아래와 같이 추가합니다.
``` java
<dependency>
	<groupId>ch.qos.logback</groupId>
	<artifactId>logback-classic</artifactId>
	<version>${logback.version}</version>
</dependency>
<dependency>
	<groupId>ch.qos.logback</groupId>
	<artifactId>logback-core</artifactId>
	<version>${logback.version}</version>
</dependency>
```
- 변수 logback.version 을 만들고 싶지않다면, 직접 쓰셔도 상관없습니다.
- 다만 직접쓰면 관리가 불편해지지 권장하진 않습니다.


# logback.xml 설정
일반적인 maven 프로젝트를 생성하면 아래처럼 2개의 소스폴더가 있습니다.
src/main/java
src/test/java
리소스로 사용할 소스폴더를 하나 더 만듭니다.
- src/main/resource가 처음부터 있다면 그대로 사용합니다.
- 오른쪽 클릭 -> new -> 소스폴더
- src/main/resource 로 만들어줍니다.
해당 리소스폴더에 logback.xml 를 만듭니다.
- 참고사항 : http://logback.qos.ch/manual/introduction.html
``` java
<?xml version="1.0" encoding="UTF-8"?>
<configuration>

	<appender name="fileAppender" class="ch.qos.logback.core.rolling.RollingFileAppender">
		<rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
			<fileNamePattern>log/%d{yyyy-MM-dd}.log</fileNamePattern>
		</rollingPolicy>
		<encoder>
			<pattern>%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger{35} - %msg%n</pattern>
		</encoder>
	</appender>

	<root level="TRACE">
		<appender-ref ref="fileAppender" />
	</root>

</configuration>
```
<fileNamePattern>log/%d{yyyy-MM-dd}.log</fileNamePattern>
- 실행경로/log/yyyy-MM-dd.log 형식으로 로그파일을 작성
<pattern>%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger{35} - %msg%n</pattern>
- 날짜시간 [쓰래드] 레벨 로거클래스 - 로그
- 예를들어 아래와 같이 출력됨
- 2016-06-20 10:00:00 [main] INFO  maven.start.App - Hello world.


# 실행하기
- 적당한 클래스를 하나 만들어봅니다.
``` java
package maven.start;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import ch.qos.logback.classic.LoggerContext;
import ch.qos.logback.core.util.StatusPrinter;

public class App
{
    public static void main( String[] args )
    {
    	// 로거 이용하기
    	Logger logger = LoggerFactory.getLogger(App.class);
    	logger.debug("Hello debug");
    	logger.trace("Hello trace");
    	logger.info("Hello info");
    	logger.warn("Hello warn");
    	logger.error("Hello error");

        // 로거의 상태를 출력
        LoggerContext lc = (LoggerContext) LoggerFactory.getILoggerFactory();
        StatusPrinter.print(lc);
    }
}
```
실행결과 - 프로젝트/log/날짜.log
2016-06-20 10:11:57 [main] DEBUG maven.start.App - Hello debug
2016-06-20 10:11:57 [main] TRACE maven.start.App - Hello trace
2016-06-20 10:11:57 [main] INFO  maven.start.App - Hello info
2016-06-20 10:11:57 [main] WARN  maven.start.App - Hello warn
2016-06-20 10:11:57 [main] ERROR maven.start.App - Hello error
실행결과 - 커맨드
(각종 설정 상태등이 출력됨)