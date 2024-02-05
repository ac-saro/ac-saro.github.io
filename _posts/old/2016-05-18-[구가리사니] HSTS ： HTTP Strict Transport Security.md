---
layout: post
tags: [가리사니, 기타]
---

> 이 문서는 예전 가리사니 사이트에서 작성된 문서 입니다.
현재 상황과 맞지 않을 수 있습니다.


사이트 전체를 HTTPS 연결을 사용하고 있는 경우.
"이 사이트는 오직 HTTPS 연결만 지원합니다" 라고 알릴 수 있습니다.
이렇게 알려진 경우 브라우저가 해당 설정을 기억하여 http로 접속시 스킵하고 https 로 이동할 수 있으며, http/https 양쪽이 세션을 공유하고 있을때 취약점도 커버 할 수 있습니다.
그 알림을 HTTP Strict Transport Security (이하 HSTS) 라고 부릅니다.

참고
https://https.cio.gov/hsts/
https://en.wikipedia.org/wiki/HTTP_Strict_Transport_Security



# 이 HSTS 를 알리기 위해서는 HTTPS 로 접속시에 "응답헤더"를 통해 아래와 같이 알려야합니다.
Strict-Transport-Security: max-age=31536000
- Strict-Transport-Security : 이 사이트는 HTTPS 로만 운영되는 사이트이다.
- max-age=31536000 : 해당 설정을 31536000초 == (60 * 1440 * 365) == 1년간 유지한다.

추가적으로 많이 쓰는 두개의 옵션을 더 써본다면
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
- includeSubDomains : 현재 도메인의 하위 도메인까지 포함한다.
- preload : 브라우저가 이 설정을 기억하여 http접속시 접속을 하지않고 바로 https를 불러낸다.


# 구현 1
``` java
// 서블릿 기준 - 그냥 헤더 추가하는 것은 php나 asp도 다 비슷하기에..
// 물론 옵션은 위에서 참고바람.
.... (HttpServletRequest req, HttpServletResponse res)
{
	res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
}
```
# 하지만 여기서 문제가 발생!!
"모든 응답에 저렇게 일일히 적용해 줄 수 있는건가"
- 당연히 아닙니다..
- 위 예제는 단순히 이렇게 응답해더를 넘겨주면 된다는 것을 보여주기 위한 예제입니다.


여기서부터는 톰켓 혹은 서블릿 기준으로 설명 합니다.
- 기타 다른 플랫폼은 해당 플랫폼의 필터를 살펴보기 바랍니다.
이 HSTS 설정은 톰켓에서 기본적으로 제공해주는데 (아마도 7에서 추가된걸로 알고있음)
web.xml 에 아래와 같이 추가 가능하다.
``` java
<!-- 이렇게 필터를 등록하고 -->
<filter>
    <filter-name>httpHeaderSecurity</filter-name>
    <filter-class>org.apache.catalina.filters.HttpHeaderSecurityFilter</filter-class>
    <async-supported>true</async-supported>
    <init-param>
	    <param-name>hstsMaxAgeSeconds</param-name>
	    <param-value>31536000</param-value>
	</init-param>
</filter>

<!-- 모든 url 에 적용한다 -->
<filter-mapping>
    <filter-name>httpHeaderSecurity</filter-name>
    <url-pattern>/*</url-pattern>
    <dispatcher>REQUEST</dispatcher>
</filter-mapping>
```
자세한 사항 : https://tomcat.apache.org/tomcat-8.0-doc/config/filter.html#HTTP_Header_Security_Filter
하지만.. 이 글을 쓰는 시점인 2016-05-18 까지 <init-param/> 영역으로 지원해주는 파라미터중에 preload와 관련된게 없는 것을 발견할 수 있다.
- 물론 preload 옵션이 필요없다면 가장 간편한 방법인 이 방법을 사용해도 좋습니다.


# 구현 2
``` java
package core.init;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletResponse;

public class HSTSFilter implements Filter
{
	public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain)
			throws IOException, ServletException
	{
		// 필터적용
		((HttpServletResponse)res)
			.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");

		chain.doFilter(req, res);
	}

	@Override public void destroy() {}
	@Override public void init(FilterConfig arg0) throws ServletException {}
}
```
물론 해당 코드가 http 와 혼용되서 쓰인다면, 시큐어 일때만 예외처리를 해줘야한다.
- 시큐어 일때만 예외처리
``` java
if (req.isSecure())
{
	((HttpServletResponse)res)
			.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
}
```
완료되었다면 web.xml에 적용한다.
``` java
<filter>
	<!-- 필터이름 -->
	<filter-name>HSTSFilter</filter-name>
	<!-- 바로 위 작성한 필터 클래스 전체 경로 -->
	<filter-class>core.init.HSTSFilter</filter-class>
</filter>

<filter-mapping>
	<!-- 바로 위 매핑할 필터이름 -->
	<filter-name>HSTSFilter</filter-name>
	<!-- 모든경로에 -->
	<url-pattern>/*</url-pattern>
	<!-- 요청시 -->
	<dispatcher>REQUEST</dispatcher>
</filter-mapping>
```


# 결과 A+ !!
https://www.ssllabs.com/ssltest/analyze.html?d=saro.me
https://www.ssllabs.com/ssltest/analyze.html?d=gs.saro.me
물론 A+ 을 받고싶다면 아래문서도 참고해주세요 (사이퍼 설정)
[/lab?topicId=198](/lab?topicId=198)
- 참고 위 사이퍼 설정은 필자가 글쓴날인 2016-05-18일 올라온 톰켓 8.0.35 부터 전체가 적용됩니다.
- 그 이하 버전에서는 일부 설정을 무시합니다.


# 추가
- 2016년 07월 07일 추가
- 프리리스트 등록됨
크로미움 : 검색 saro.me
https://chromium.googlesource.com/chromium/src/net/+/master/http/transport_security_state_static.json
