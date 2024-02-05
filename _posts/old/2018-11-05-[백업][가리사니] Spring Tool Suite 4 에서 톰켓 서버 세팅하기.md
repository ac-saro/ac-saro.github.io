---
layout: post
tags: [spring, eclipse, java]
---

> 이 문서는 가리사니 개발자 포럼에 올렸던 글의 백업 파일입니다.
오래된 문서가 많아 현재 상황과 맞지 않을 수 있습니다.


# 서론
[https://spring.io/tools](https://spring.io/tools) 를 보다가 스프링 신버전이 나온 것을 확인하였습니다.
무작정 다운받고 보니, 스프링 부트만 실행되고 레거시 스프링은 실행되지 않았습니다.
확인해보니 서버에 톰켓자체가 사라졌는데요.
(글을 쓰는 시점에서 프로젝트 생성부분도 부트만 존제하고 레거시가 없습니다.)
아직도 부트를 사용하지 않는 환경은 커녕 3.x 를 쓰는 곳 도 많기 때문에 방법을 찾아보았습니다.

# 설치
Help -> Install new software
- Work with 에서 아래와 같은 형식 선택 [날짜 는 버전에 따라 다를 수 있음]
	- 2018-09 - http://download.eclipse.org/releases/2018-09
- 펼치기
- Web, XML, Java EE and OSGi Enterprise Development 를 모두 설치합니다.
	- JST 만 설치하면 Spring 3.x 웹모듈 선택이 안되는 문제가 있습니다.
	- PHP 같이 딱보기에도 전혀상관 없는것은 건너뛰어도 됩니다.

# 확인
이클립스 화면에서 servers 탭을 찾습니다.
(없다면 Window -> Show View -> Other -> servers 검색)
servers 탭에서 으론쪽 클릭 new server
톰켓이 추가된 것 을 확인할 수 있습니다.