---
layout: post
tags: [spring, java]
---

> 이 문서는 가리사니 개발자 포럼에 올렸던 글의 백업 파일입니다.
오래된 문서가 많아 현재 상황과 맞지 않을 수 있습니다.


# Spring Security OAuth 통합 로그인 시리즈
- [1. OAuth 소개](/lab?topicId=316)
- [2. 시큐리티와 OAuth 통합 구조 및 시큐리티 작성](/lab?topicId=317)
- [3. 시큐리티에 OAuth 연동 (페이스북, 네이버...)](/lab?topicId=318)
- [4. 추가사항](/lab?topicId=321)

# 서론
이중 로그인 방지
신기하게도 스프링에서는 로그인 상태에서 재인증이 가능합니다.
즉, abc 라는 id 로 로그인 한 상태이지만, 해당 상태로 def 라는 id로 로그인이 가능합니다.
이 때 스프링 사이클에서는 로그아웃을 부르지 않습니다.
- 즉 abc때 기록해둔 세션들이 def에 남아있을 수 있습니다.
- Authentication 외 다른 곳에 세션을 생성하지 않음으로써 어느정도 위험은 줄어들지만 근본적으로 이중 로그인을 막는 것이 맞다고 생각합니다.
불행하게도 필자는 스프링 사이클에 모든 auth에 관련되 미리실행되는 필터를 찾지 못 했습니다.

때문에 OAuth와 일반 인증 둘을 체크하기위해 별도의 필터를 만들었습니다.
- 필자는 리다이렉트보다 없는 페이지로 보여주는 것을 선호하기 때문에 404를 보냈습니다.
- 방법은 각자 고민해보시기 바랍니다.
``` java
public static class DuplicateAuthenticationFilter implements Filter
{
	final String prefixUrl;

	public DuplicateAuthenticationFilter(String prefixUrl)
	{
		this.prefixUrl = prefixUrl;
	}

	@Override
	public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain)
			throws IOException, ServletException
	{
		if ( ((HttpServletRequest)req).getServletPath().startsWith(prefixUrl) )
		{
			Authentication auth = SecurityContextHolder.getContext().getAuthentication();

			// 룰을 하나라도 가지고 있다면 로그인으로 간주
			if (auth != null && !auth.getAuthorities().isEmpty())
			{
				// 404 를 보내준다.
				((HttpServletResponse)res).sendError(404);
				return;
			}
		}
		chain.doFilter(req, res);
	}

	@Override
	public void init(FilterConfig filterConfig) throws ServletException
	{
	}

	@Override
	public void destroy()
	{
	}
}
```
적용
- 필자는 모든 url을 /sign-in 밑으로 넣었습니다.
- 예를들어 /sign-in (일반), /sign-in/facebook (페이스북), /sign-in/naver (네이버)
``` java
@Override
protected void configure(HttpSecurity http) throws Exception
{
	http
		// 각종 설정 생략
		.addFilterBefore(new DuplicateAuthenticationFilter("/sign-in"), BasicAuthenticationFilter.class);
}
```