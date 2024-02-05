---
layout: post
tags: [spring, java]
---

> 이 문서는 가리사니 개발자 포럼에 올렸던 글의 백업 파일입니다.
오래된 문서가 많아 현재 상황과 맞지 않을 수 있습니다.


# Spring boot Security 시리즈
- [1. 설치 및 페이지 설정](/lab?topicId=283)
- [2. 인증로직을 만들어보자.](/lab?topicId=284)
- [3. 인증로직 - 잠재적 위험](/lab?topicId=285)
- [4. 인증 페이지뷰](/lab?topicId=286)
- [5. 회원가입](/lab?topicId=287)
- [부록 : Spring Security login (성공 / 실패) 이벤트 리스너 ](/lab?topicId=311)


# 서론
사실 필자는 스프링 부트 시큐리티가 유용한지 잘 모르겠습니다.
아직 안써봐서 그런지도 모르죠.. 하하... 그래서!!
직접 써본 후 체감하고 판단하기 위해서 설치해보았습니다.
(과연.. 생각이 바뀔것인가.!!)


# 메이븐 설정
``` xml
<dependency>
	<groupId>org.springframework.boot</groupId>
	<artifactId>spring-boot-starter-security</artifactId>
</dependency>
```
앱을 다시 실행하면 기본값으로 작동하며, 사이트 전체가 잠겨(인증필수 페이지로 변함)버립니다.


# 사이트 페이지를 비인증으로 만들어보자.
설정 클래스를 만듭니다.
이름은 SecurityConfig 로 하겠습니다.
앞으로 SecurityConfig 를 계속 고처나갈 겁니다.
``` java
@Configuration
public class SecurityConfig extends WebSecurityConfigurerAdapter
{
	@Override
	public void configure(WebSecurity web) throws Exception
	{
		web.ignoring().antMatchers("/**");
	}
}
```
앱을 실행하면 모든 페이지가 풀려있습니다.


# 부분별로 인증페이지를 줘보자.
대부분의 사이트는 개인정보에 접근하는 계정정보, 결제이력, 글쓰기등 회원과 관련된 부분이 아니라면 기본적으로 로그인이 필요없습니다.
하지만 스프링 시큐리티 같은경우는 기본적으로 모두 인증페이지이며 일부를 열어주는 형태로 되어있습니다.
물론 **스프링 시큐리티 같은 작업방법이 프로그래머가 신규 인증 페이지를 만들고 추가를 깜박하더라도 보안상으로는 더 좋은 방법**입니다.
하지만 반대의 경우도 실습을 해보겠습니다.
우선 /mypage 라는 간단한 페이지를 만들고 아래의 예제를 따라해봅니다.
``` java
// 적당한 컨트롤러에!!
@ResponseBody
@RequestMapping(path="/mypage", produces="text/plain")
public String mypage()
{
	return "is mypage !!";
}
```
``` java
@Configuration
public class SecurityConfig extends WebSecurityConfigurerAdapter
{
	@Override
	public void configure(WebSecurity web) throws Exception
	{
		web.ignoring().antMatchers("/**");
	}
	@Override
	protected void configure(HttpSecurity http) throws Exception
	{
		http.authorizeRequests()
			.antMatchers("/mypage").authenticated();
	}
}
```
하지만 /mypage 에 너무나도 잘 접속됩니다....
web.ignoring() 의 우선순위가 더 높은 것 같습니다.
``` java
@Configuration
public class SecurityConfig extends WebSecurityConfigurerAdapter
{
	@Override
	public void configure(WebSecurity web) throws Exception
	{
		// web.ignoring().antMatchers("/**");
	}
	@Override
	protected void configure(HttpSecurity http) throws Exception
	{
		http.authorizeRequests()
			.antMatchers("/**").permitAll()
			.antMatchers("/mypage").authenticated();
	}
}
```
이번엔 어떨까요? 역시나 /mypage 에 잘 들어가집니다.
설마...... 순서를 바꿔보겠습니다.
``` java
@Configuration
public class SecurityConfig extends WebSecurityConfigurerAdapter
{
	@Override
	protected void configure(HttpSecurity http) throws Exception
	{
		http.authorizeRequests()
			.antMatchers("/mypage").authenticated()
			.antMatchers("/**").permitAll();
	}
}
```
드디어 일반페이지는 접속이 되고 /mypage 는 권한이 없어 접근되지 않습니다.
먼저 설정된 값이 기억되고 두번째 이후 설정은 무시되는건가??
https://docs.spring.io/spring-security/site/docs/current/apidocs/org/springframework/security/config/annotation/web/builders/HttpSecurity.html#authorizeRequests--
스프링 문서를 보니 역시 그렇게 써있습니다.
예를들어 허가를 .antMatchers("/**") 이런식으로 내주면 /mypage 도 허가가 된것이고 그뒤에 .antMatchers("/mypage").authenticated() 을 사용하더라도 두번째 속성은 무시됩니다.
즉, 먼저 정해진 값은 불변됩니다.


# 이번장의 요점!!
비인증 범위에 인증범위까지 설정한 후 다시 인증을 설정하더라도 두번째 설정은 무시됩니다.
즉!! 인증범위는 리소스 (css, js...) 를 제외하곤 가장 마지막에 인증을 풀어 주도록 설정하는 것이 좋을 것 같습니다.
사실 더 좋은 방법은 HttpSecurity통한 인증/비인증 범위를 설정하는게 아닌 WebSecurity를 통한 인증범위만 골라주는 것이 더 좋은 것 같습니다.
``` java
@Configuration
public class SecurityConfig extends WebSecurityConfigurerAdapter
{
	@Override
	public void configure(WebSecurity web) throws Exception
	{
		// 예를들어 이런식으로 인증할것들을 풀어주는겁니다. (주로 리소스)
		web.ignoring().antMatchers("/css/**", "/script/**", "/");
	}
	@Override
	protected void configure(HttpSecurity http) throws Exception
	{
		// 여기에선 리소스외에 페이지의 인증/비인증/인증권한등을 설정하는게 좋은것 같습니다.
		http.authorizeRequests()
			// 어드민 권한으로만 접근할 수 있는 경로.
			.antMatchers("/admin/**").access("ROLE_ADMIN");
	}
}
```