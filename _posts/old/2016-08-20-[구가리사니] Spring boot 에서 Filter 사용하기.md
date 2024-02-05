---
layout: post
tags: [가리사니, 기타]
---

> 이 문서는 예전 가리사니 사이트에서 작성된 문서 입니다.
현재 상황과 맞지 않을 수 있습니다.


# Spring boot 서블릿/필터 시리즈
Spring boot에서 Servlet 사용하기
- [/lab?topicId=302](/lab?topicId=302)
Spring boot에서 Filter 사용하기
[/lab?topicId=303](/lab?topicId=303)


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