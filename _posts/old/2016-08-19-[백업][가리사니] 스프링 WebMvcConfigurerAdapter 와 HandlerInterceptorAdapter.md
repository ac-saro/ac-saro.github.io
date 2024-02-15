---
layout: post
tags: [spring, java]
---

> 이 문서는 가리사니 개발자 포럼에 올렸던 글의 백업 파일입니다.
오래된 문서가 많아 현재 상황과 맞지 않을 수 있습니다.


# 서론
최근에 서버와 클라이언트 양쪽에 템플릿 엔진이 있는 것들을 찾아보다가 스프링 부트에 기본적으로 있는 mustache 가 있다는 것을 알았습니다.
- [mustache 문법 + 스프링 연동](/2016/07/27/%EB%B0%B1%EC%97%85-%EA%B0%80%EB%A6%AC%EC%82%AC%EB%8B%88-mustache-%EB%AC%B8%EB%B2%95-+-%EC%8A%A4%ED%94%84%EB%A7%81-%EC%97%B0%EB%8F%99.html)
문제는 i18n이나 시큐리티, session 같은 경우 타임리프나 JSTL 처럼 사용할만한 방법이 없어 찾아보던 중 HandlerInterceptorAdapter를 사용해 보았습니다.
- 물론 모델이 매번 넣어주는 방법도 있겠지만 유지보수도 안좋고 자원도 심하게 망가짐으로...


# WebMvcConfigurerAdapter
## preHandle
- [HandlerInterceptorAdapter](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/web/servlet/handler/HandlerInterceptorAdapter.html)
- DispatcherServlet 이 컨트롤을 호출하기 전에 호출.
- false 가 리턴된경우 더 이상 전파가 중지되며 현재 상태로 종료됨
(preHandle 가 일종의 서블릿처럼 쓰이고 더이상 전파가 안된다고 보면됨 : 컨트롤에 가지않음)
## postHandle
- 컨틀롤러가 불린 후 불립니다.
- 때문에 ModelAndView 객체를 가지고 있으면 추가적으로 작업할 수 있습니다.
## afterCompletion
- DispatcherServlet 의 모든 작업이 끝나고 전달될 때 불립니다.
- postHandle 와 달리 실행도중 오류가 나더라도 반환이 됩니다.
좀 더 정확히 preHandle true 리턴 이 후 부터 컨트롤, 호스트, 렌더등... 최종 필터를 통해 나가기 전까지 오류여부에 상관없이 반환됩니다.
(일반적으로 오류가 없다면 가장 마지막에 반환됩니다.)
- 때문에 파라미터는 Exception 을 포함합니다.


# 예제 : HandlerInterceptorAdapter
- postHandle 를 이용하여 message를 매칭시키는 예제를 사용해 보도록 하겠습니다.
``` java
@Component
public class MessageInterceptor extends HandlerInterceptorAdapter
{
	@Autowired
	MessageSource messageSource;

	@Autowired
	LocaleResolver localeResolver;

	// 필자가 필요한건 ModelAndView 가 만들어진 후.
	@Override
	public void postHandle (
		HttpServletRequest request, HttpServletResponse response,
		Object handler, ModelAndView modelAndView
	) throws Exception {
		// 객체가 있는지 확인한다.
		if (modelAndView != null) {
			final Locale locale = localeResolver.resolveLocale(req);
			modelAndView.addObject("message", new Mustache.Lambda() {
				// 예를들어 "message" 로 입력한 경우 message 로시작된것들을 찾는다.
				// mustache 기준으로 {{message.*}} 로 되어있는 것을 찾는다.
				public void execute(Template.Fragment frag, Writer out) throws IOException {
					// frag.execute()는 찾는 값을 가져온다.
					// 예를들어 message.abc 를 찾았다면, 기준점으로 뒤에있는 abc 를 반환한다.
					// messageSource 아래 별도 설명 i18n 문서 참고.
					out.write(messageSource.getMessage(frag.execute(), null, locale));
				}
			});
		}

		super.postHandle(request, response, handler, modelAndView);
	}
}
```
위 예제는 뷰안에 위치한 "message" 하위의 모든 attr을 찾아 frag.execute() 를 통해 attr의 이름을 확인 하고 out.write 를 통해 값을 써주게 됩니다.
i18n / messageSource / localeResolver 는 아래 문서를 참고해주세요.
- [스프링 i18n (다국어) : 2. Locale Resolver](/2016/07/29/%EB%B0%B1%EC%97%85-%EA%B0%80%EB%A6%AC%EC%82%AC%EB%8B%88-%EC%8A%A4%ED%94%84%EB%A7%81-i18n-(%EB%8B%A4%EA%B5%AD%EC%96%B4)-2.-Locale-Resolver.html)


# 예제 : WebMvcConfigurerAdapter
따로 설명이 필요없을 것 같습니다.
작성한 MessageInterceptor 를 포함하여 줍니다.
``` java
@Configuration
public class WebMvcConfig extends WebMvcConfigurerAdapter {
	@Autowired
	MessageInterceptor messageInterceptor;

	@Override
	public void addInterceptors(InterceptorRegistry registry) {
		registry.addInterceptor(messageInterceptor);
	}
}
```