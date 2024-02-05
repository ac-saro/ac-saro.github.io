---
layout: post
tags: [가리사니, 기타]
---

> 이 문서는 예전 가리사니 사이트에서 작성된 문서 입니다.
현재 상황과 맞지 않을 수 있습니다.


이전에 이미 Logback 에 대해서 올린적이 있지만 지금보니.. 아무것도 설명하지 않아 스프링과 연동겸 내용을 보충하려고합니다.
이전글 : [/lab?topicId=251](/lab?topicId=251) (내용중복)


# 메이븐 설정
``` java
<logback.version>1.1.7</logback.version>
```
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


# logback.xml 설정 예제
- src/main/resource/logback.xml
- 이것은 예제이며 다음문단에서 설명합니다.
``` java
<?xml version="1.0" encoding="utf-8"?>
<configuration>

	<!-- 출력설정 -->
	<appender name="console" class="ch.qos.logback.core.ConsoleAppender">
		<layout class="ch.qos.logback.classic.PatternLayout">
			<Pattern>
				%d{yyyy-MM-dd HH:mm:ss} %-5level %logger{36} - %msg%n
			</Pattern>
		</layout>
	</appender>

	<!-- 하이버네이트 -->
	<logger name="org.hibernate.SQL" level="DEBUG">
		<appender-ref ref="console" />
	</logger>
	<!-- 하이버네이트 -->
	<logger name="org.hibernate.type" level="TRACE">
		<appender-ref ref="console" />
	</logger>
	<!-- 하이버네이트 -->
	<logger name="org.hibernate.type.BasicTypeRegistry" level="DEBUG">
		<appender-ref ref="console" />
	</logger>
	<!-- 히카리CP -->
	<logger name="com.zaxxer.hikari" level="INFO">
		<appender-ref ref="console" />
	</logger>
	<!-- 스프링 -->
	<logger name="org.springframework" level="INFO" additivity="false">
		<appender-ref ref="console" />
	</logger>

</configuration>
```


# <appender/>
appender 는 출력설정입니다.
``` java
<appender name="appender이름" class="Appender클래스">
	...
</appender>
```
예를들어 파일같은경우는 class에 파일을 지원하는 ch.qos.logback.core.rolling.RollingFileAppender 을 사용
``` java
<appender name="fileAppender" class="ch.qos.logback.core.rolling.RollingFileAppender">
	<rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
		<fileNamePattern>log/%d{yyyy-MM-dd}.log</fileNamePattern>
	</rollingPolicy>
	<encoder>
		<pattern>%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger{35} - %msg%n</pattern>
	</encoder>
</appender>
```
콘솔같은 경우는 위 에제처럼 ch.qos.logback.core.ConsoleAppender 을 사용합니다.
그외에도 여러가지를 지원하지만 워낙 많아서 그때그때 필요한걸 검색해보는 쪽을 추천합니다.
필자의 경우는 보통 파일/콘솔/DB정도밖엔.. DB는 ch.qos.logback.classic.db.DBAppender 를 사용하며 검색해보시면 다양한 옵션들이 있습니다.


# <logger/>
주의 : 순서의 영향을 받습니다. 반드시 appender-ref 의 값에 나오는 <appender/> 보다 뒤쪽에 작성해주셔야합니다....;;;;;
name
대상의 이름으로 스프링같은경우는 org.springframework 입니다.
level
ALL : TRACE와 같음 나중에 확장을 위한것으로 보임.
TRACE : TRACE, DEBUG, INFO, WARN, ERROR
DEBUG : DEBUG, INFO, WARN, ERROR
INFO : INFO, WARN, ERROR
WARN : WARN, ERROR
ERROR : ERROR
OFF : 출력하지 않음
- 주의 할점은.. hikari 같은경우는 INFO쯤을 주시는걸... 권장합니다. DEBUG 만 줘도.. 다른 로그들이 묻힐겁니다...
additivity
예를 들어 <logger name="org.springframework" level="INFO" additivity="false"> 일때
org.springframework 이내 모든 로그를 추가할때는 기본값인 additivity="true"이나
정확히 org.springframework 만 추가하고 그 하위를 로그로 찍고 싶지 않을때에는 additivity="false" 를 사용합니다.
<appender-ref/>
웬지 설명이 필요없을 것 같지만 <appender-ref ref="console" /> 라면 appender[name="console"]을 찾아 로그를 추가합니다.
다중으로 여러개를 사용할 수 있습니다.