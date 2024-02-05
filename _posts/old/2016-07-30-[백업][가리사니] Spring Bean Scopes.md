---
layout: post
tags: [spring, java]
---

> 이 문서는 가리사니 개발자 포럼에 올렸던 글의 백업 파일입니다.
오래된 문서가 많아 현재 상황과 맞지 않을 수 있습니다.


# 참고
스프링 빈 스코프 관련 공식 문서입니다.
http://docs.spring.io/spring/docs/current/spring-framework-reference/html/beans.html#beans-factory-scopes


# 스프링 빈은 기본적으로 다음과 같은 스코프가 있습니다.
singleton : 싱글톤 (기본값)
스프링의 컨테이너 단위(제어역전을 실행하는 주체기준) 당 1개의 객체만 만듭니다.

prototype : 프로토타입
객체를 정의 할때 마다 새로운 객체를 만듭니다. (한번 정의된 것은 그대로 쓰고 새로 정의하면 새롭게 하나를 만듬)

request : 리쿼스트 (http 요청) - ApplicationContext 범위 내에서만 유효
HTTP 요청과 생명주기를 함께합니다.
(요청이 오면 새롭게 만들어지고 요청이 끝나면 소멸)

session : 세션 - ApplicationContext 범위 내에서만 유효
session과 생명주기를 함께합니다.
- 참고 : [/lab?topicId=278](/lab?topicId=278)

globalSession : 전역세션 - ApplicationContext 범위 내에서만 유효 / 일반적으로 Portlet(포틀릿:Web-Portlet) 문맥에서 유효
global HTTP Session과 생명주기를 함께합니다.

application : 어플리케이션 - ApplicationContext 범위 내에서만 유효
ServletContext 생명주기를 함께합니다.
싱글톤과 유사해 보이지만 (스프링의 컨테이너 단위)가 아닌 (서블릿 컨텍스트) 단위 입니다.
예를들어 톰켓을 사용한다면 싱글톤은 스프링의 제어단위 주기이며, 어플리케이션은 톰켓의 주기와 같습니다.

websocket : 웹소켓- ApplicationContext 범위 내에서만 유효
WebSocket과 생명주기를 함께합니다.

Custom
http://docs.spring.io/spring/docs/current/spring-framework-reference/html/beans.html#beans-factory-scopes-custom


# 추신
- 강의를 올리려고 했는데 현재 작업하는게 있어서.. 갑자기 생각난 팁으로.....