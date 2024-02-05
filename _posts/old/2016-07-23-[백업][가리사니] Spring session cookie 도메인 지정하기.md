---
layout: post
tags: [가리사니, 기타]
---

> 이 문서는 가리사니 개발자 포럼에 올렸던 글의 백업 파일입니다.
오래된 문서가 많아 현재 상황과 맞지 않을 수 있습니다.


서블릿을 사용했을 때에는 톰켓의 context 의 sessionCookieDomain 을 통해서 도메인을 지정했습니다.
이전 강의에서도 잠깐 등장한적이 있는 org.springframework.session.web.http.CookieSerializer 을 통해서도 세션 쿠키 도메인을 지정할 수 있습니다.

``` java
@Bean
public CookieSerializer cookieSerializer()
{
	DefaultCookieSerializer serializer = new DefaultCookieSerializer();
	...
	serializer.setDomainNamePattern("[^\\.]+\\.[a-z]+$");
	...
	return serializer;
}
```
바로 DefaultCookieSerializer.setDomainNamePattern 을 통해서 지정 할 수 있습니다.
http://docs.spring.io/spring-session/docs/current/reference/html5/guides/custom-cookie.html

정규식에 도메인이름을 매칭시키고 매칭되는 부분이 있다면 해당 이름으로 매칭되지 않는다면 현재 들어온 호스트로 지정하게 됩니다.

즉 "[^\\.]+\\.[a-z]+$" 이런식으로 설정하게된다면
saro.me -> [saro.me] -> saro.me
gs.saro.me -> gs.[saro.me] -> saro.me
3.ab3c.saro.me -> 3.ab3c.[saro.me] -> saro.me
localhost -> 매칭불가 -> localhost
127.0.0.1 -> 매칭불가 -> 127.0.0.1

즉 도메인을 지정해줘야하는 상황에서도 정규식으로 조금만 생각해보면 서비스 서버와 로컬 테스트(localhost)를 별도로 지정하지 않고 테스트 할 수 있습니다.