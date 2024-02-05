---
layout: post
tags: [가리사니, 기타]
---

> 이 문서는 예전 가리사니 사이트에서 작성된 문서 입니다.
현재 상황과 맞지 않을 수 있습니다.


# Spring boot Security 시리즈
- [1. 설치 및 페이지 설정](/lab?topicId=283)
- [2. 인증로직을 만들어보자.](/lab?topicId=284)
- [3. 인증로직 - 잠재적 위험](/lab?topicId=285)
- [4. 인증 페이지뷰](/lab?topicId=286)
- [5. 회원가입](/lab?topicId=287)
- [부록 : Spring Security login (성공 / 실패) 이벤트 리스너 ](/lab?topicId=311)


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