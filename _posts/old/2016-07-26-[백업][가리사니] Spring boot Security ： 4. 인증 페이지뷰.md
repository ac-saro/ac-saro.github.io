---
layout: post
tags: [spring, java]
---

> 이 문서는 가리사니 개발자 포럼에 올렸던 글의 백업 파일입니다.
오래된 문서가 많아 현재 상황과 맞지 않을 수 있습니다.


# Spring boot Security 시리즈
- [1. 설치 및 페이지 설정](/2016/07/24/%EB%B0%B1%EC%97%85-%EA%B0%80%EB%A6%AC%EC%82%AC%EB%8B%88-Spring-boot-Security-1.-%EC%84%A4%EC%B9%98-%EB%B0%8F-%ED%8E%98%EC%9D%B4%EC%A7%80-%EC%84%A4%EC%A0%95.html)
- [2. 인증로직을 만들어보자.](/2016/07/25/%EB%B0%B1%EC%97%85-%EA%B0%80%EB%A6%AC%EC%82%AC%EB%8B%88-Spring-boot-Security-2.-%EC%9D%B8%EC%A6%9D-%EB%A1%9C%EC%A7%81%EC%9D%84-%EB%A7%8C%EB%93%A4%EC%96%B4%EB%B3%B4%EC%9E%90/html)
- [3. 인증로직 - 잠재적 위험](/2016/07/25/%EB%B0%B1%EC%97%85-%EA%B0%80%EB%A6%AC%EC%82%AC%EB%8B%88-Spring-boot-Security-3.-%EC%9D%B8%EC%A6%9D%EB%A1%9C%EC%A7%81-%EC%9E%A0%EC%9E%AC%EC%A0%81-%EC%9C%84%ED%97%98.html)
- [4. 인증 페이지뷰](/2016/07/26/%EB%B0%B1%EC%97%85-%EA%B0%80%EB%A6%AC%EC%82%AC%EB%8B%88-Spring-boot-Security-4.-%EC%9D%B8%EC%A6%9D-%ED%8E%98%EC%9D%B4%EC%A7%80%EB%B7%B0.html)
- [5. 회원가입](/2016/07/26/%EB%B0%B1%EC%97%85-%EA%B0%80%EB%A6%AC%EC%82%AC%EB%8B%88-Spring-boot-Security-5.-%ED%9A%8C%EC%9B%90%EA%B0%80%EC%9E%85.html)
- [부록 : Spring Security login (성공 / 실패) 이벤트 리스너 ](/2016/09/03/%EB%B0%B1%EC%97%85-%EA%B0%80%EB%A6%AC%EC%82%AC%EB%8B%88-Spring-Security-login-(%EC%84%B1%EA%B3%B5-%EC%8B%A4%ED%8C%A8)-%EC%9D%B4%EB%B2%A4%ED%8A%B8-%EB%A6%AC%EC%8A%A4%EB%84%88.html)


# 서론
앞서 2강에서 만든 /login에 뷰를 붙여보도록 하겠습니다.
이 강의에선 뷰로 타임리프를 써보도록하겠습니다.
타임리프 : http://www.thymeleaf.org/


# 메이븐 추가 - 타임리프
``` xml
<dependency>
	<groupId>org.springframework.boot</groupId>
	<artifactId>spring-boot-starter-thymeleaf</artifactId>
</dependency>
<dependency>
	<groupId>org.thymeleaf.extras</groupId>
	<artifactId>thymeleaf-extras-springsecurity4</artifactId>
</dependency>
```


# SecurityConfig 변경
주의 : new BCryptPasswordEncoder() 로 실습을 할 예정임으로 저번강의의 DB 암호는 아래결과로 교체해주세요.
``` java
new BCryptPasswordEncoder().encode("암호");
```
``` java
@Configuration
public class SecurityConfig extends WebSecurityConfigurerAdapter
{
	@Override
	public void configure(WebSecurity web) throws Exception
	{
		// 메인페이지 : css나 js 같은것들도 여기에 포함시켜준다.
		web.ignoring()
			.antMatchers("/");
	}

	@Override
	protected void configure(HttpSecurity http) throws Exception
	{
		http.authorizeRequests()
			.antMatchers("/login").permitAll()
			.antMatchers("/**").authenticated();

		http
			.formLogin()
			// 로그인 처리 페이지 : 지난 강의에선 /login 이였지만
			// 이번엔 직접 작성한 뷰를 보여줄 것이기 때문에 사용자에게
			// login 이라는 화면을 보여주는게 더 깔끔할 것 같아서 교체함!
			.loginProcessingUrl("/loginProcessing")
			// 로그인 페이지
			.loginPage("/login")
			// 로그인 실패 페이지
			.failureUrl("/login?error");

		http
			.logout()
			// /logout 을 호출할 경우 로그아웃
			.logoutRequestMatcher(new AntPathRequestMatcher("/logout"))
			// 로그아웃이 성공했을 경우 이동할 페이지
			.logoutSuccessUrl("/");
	}

	@Configuration
	public static class AuthenticationConfiguration extends GlobalAuthenticationConfigurerAdapter
	{
		@Autowired
		UserDetailsService userDetailsService;

		@Bean
		PasswordEncoder passwordEncoder()
		{
			// 인증에 기본 스프링 해시를 사용하겠습니다.
			return new BCryptPasswordEncoder();
		}

		@Override
		public void init(AuthenticationManagerBuilder auth) throws Exception
		{
			auth.userDetailsService(userDetailsService).passwordEncoder(passwordEncoder());
		}
	}
}
```


# 템플릿
src/main/resources/templates/login.html
``` html
<!DOCTYPE html>
<html xmlns:th="http://www.typeleaf.org">
<head>
	<meta charset="utf-8"/>
	<title>로그인</title>
</head>
<body>
<div>

	<h1>로그인을 해봅시다.!!</h1>

	<form th:action="@{/loginProcessing}" method="post">
		<h2>로그인 폼</h2>

		<!-- 파라미터 error가 있는경우 IF 통과 -->
		<div th:if="${param.error}">
			잘못된 아이디나 암호입니다.
		</div>

		<input type="text" name="username" placeholder="계정" required="required"/>
		<input type="password" name="password" placeholder="암호" required="required"/>
		<input type="submit" value="로그인"/>
	</form>

</div>
</body>
</html>
```


# 컨트롤러
``` java
@RequestMapping("/login")
String login()
{
	// 타임리프의 뷰.
	// 타임리프의 뷰는 기본값으로 resources/templates/<경로>.html 이다.
	// 즉 이렇게하면 resources/templates/login.html 이 불린다.
	return "login";
}
```
정상적으로 실행되셨다면 성공!!