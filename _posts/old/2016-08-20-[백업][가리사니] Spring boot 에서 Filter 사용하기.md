---
layout: post
tags: [servlet, spring, java]
---

> 이 문서는 가리사니 개발자 포럼에 올렸던 글의 백업 파일입니다.
오래된 문서가 많아 현재 상황과 맞지 않을 수 있습니다.


# Spring boot 서블릿/필터 시리즈
Spring boot에서 Servlet 사용하기
- [/2016/08/20/%EB%B0%B1%EC%97%85-%EA%B0%80%EB%A6%AC%EC%82%AC%EB%8B%88-Spring-boot%EC%97%90%EC%84%9C-Servlet-%EC%82%AC%EC%9A%A9%ED%95%98%EA%B8%B0.html](/2016/08/20/%EB%B0%B1%EC%97%85-%EA%B0%80%EB%A6%AC%EC%82%AC%EB%8B%88-Spring-boot%EC%97%90%EC%84%9C-Servlet-%EC%82%AC%EC%9A%A9%ED%95%98%EA%B8%B0.html)
Spring boot에서 Filter 사용하기
[/2016/08/20/%EB%B0%B1%EC%97%85-%EA%B0%80%EB%A6%AC%EC%82%AC%EB%8B%88-Spring-boot-%EC%97%90%EC%84%9C-Filter-%EC%82%AC%EC%9A%A9%ED%95%98%EA%B8%B0.html](/2016/08/20/%EB%B0%B1%EC%97%85-%EA%B0%80%EB%A6%AC%EC%82%AC%EB%8B%88-Spring-boot-%EC%97%90%EC%84%9C-Filter-%EC%82%AC%EC%9A%A9%ED%95%98%EA%B8%B0.html)


# Bean 등록
스프링부트에서는 web.xml 이 더 이상 사용되지 않아 서블릿이나 필터를 org.springframework.boot.web.servlet 의 RegistrationBean 을 통해 등록해야합니다.
``` java
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FilterConfig
{
	@Bean
	public FilterRegistrationBean getFilterRegistrationBean()
	{
		FilterRegistrationBean registrationBean = new FilterRegistrationBean(new HSTSFilter());
		// registrationBean.addUrlPatterns("/*"); // 서블릿 등록 빈 처럼 패턴을 지정해 줄 수 있다.
		return registrationBean;
	}
}
```


# HelloFilter  예제
``` java
public class HelloFilter implements Filter
{
	public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain)
			throws IOException, ServletException
	{
		// 필터적용
		((HttpServletResponse)res).setHeader("HelloHeader", "test");

		chain.doFilter(req, res);
	}

	@Override
	public void destroy()
	{
	}

	@Override
	public void init(FilterConfig fc) throws ServletException
	{
	}
}
```