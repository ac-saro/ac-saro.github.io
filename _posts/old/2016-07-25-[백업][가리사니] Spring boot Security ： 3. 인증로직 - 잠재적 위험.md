---
layout: post
tags: [certificate, spring, java]
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
이전장인 **2. 인증로직을 만들어보자.** 를 하는 도중 돌아가는것을 보기위해서 print 를 찍어보았습니다.
무언가를 잠깐 확인 하고 싶었던 것 이라 logger 가아닌 sysout 을 찍었습니다...
``` java
public static class MyPasswordEncoder implements PasswordEncoder
{
	@Override
	public String encode(CharSequence rawPassword)
	{
		System.out.println("MyPasswordEncoder.encode : " + rawPassword);
		return "EN-" + rawPassword.toString();
	}

	@Override
	public boolean matches(CharSequence rawPassword, String encodedPassword)
	{
		System.out.println("MyPasswordEncoder.matches.rawPassword : [" + rawPassword + "]");
		System.out.println("MyPasswordEncoder.matchesencodedPassword : [" + encodedPassword + "]");
		return encodedPassword.equals(encode(rawPassword));
	}
}
```
그리고 존재하지 않는 계정을 써봤습니다.
예를들어 not / 1234 로 입력해봤습니다.
분명 아래의 로직에서 걸려서 throw 되어야하는 경우로 보여지는데...
``` java
@Override
public UserDetails loadUserByUsername(String ac) throws UsernameNotFoundException
{
	Account account = accountService.getAccount(ac);

	if (account == null)
	{
		// 계정이 존재하지 않음
		throw new UsernameNotFoundException("login fail");
	}

	return new LoginUserDetails(account);
}
```
통과하고 오는겁니다.
MyPasswordEncoder.matches.rawPassword : [1234]
MyPasswordEncoder.matchesencodedPassword : [EN-userNotFoundPassword]
MyPasswordEncoder.encode : 1234
그래서 혹시나하고 계정이 존재하나? 라는 생각에 프린트를 하나더 찍어봤습니다.
``` java
@Override
public UserDetails loadUserByUsername(String ac) throws UsernameNotFoundException
{
	Account account = accountService.getAccount(ac);

	if (account == null)
	{
		// 계정이 존재하지 않음
		System.out.println("loadUserByUsername : not existed user");
		throw new UsernameNotFoundException("login fail");
	}

	return new LoginUserDetails(account);
}
```
# 결과
loadUserByUsername : not existed user
MyPasswordEncoder.matches.rawPassword : [1234]
MyPasswordEncoder.matchesencodedPassword : [EN-userNotFoundPassword]
MyPasswordEncoder.encode : 1234
이게뭐야........ 무서워;;;;


# 문제
유저가 존재하지 않지만 (loadUserByUsername : not existed user) 계속 로직이 진행되어 MyPasswordEncoder 를 호출합니다....
심지어 userNotFoundPassword 라는 기본값을 인코딩해서 말이죠.!!! (스프링 앱이 실행될때 처음 userNotFoundPassword 값을 스스로 인코딩합니다.)
그래서 테스트를 한번 해보았습니다.
``` java
@Override
public boolean matches(CharSequence rawPassword, String encodedPassword)
{
	System.out.println("MyPasswordEncoder.matches.rawPassword : [" + rawPassword + "]");
	System.out.println("MyPasswordEncoder.matchesencodedPassword : [" + encodedPassword + "]");
	//return encodedPassword.equals(encode(rawPassword));
	return true;
}
```
userNotFoundPassword 를 암호로 입력해도되지만, 더 확실히 보기위해 무조건 통과하도록 코드를 짰습니다.
그리고 다시 존재하지 않는 계정으로 입력하였습니다. not / 1234
loadUserByUsername : not existed user
MyPasswordEncoder.matches.rawPassword : [1234]
MyPasswordEncoder.matchesencodedPassword : [EN-userNotFoundPassword]
# 다행히 로그는 이렇게 뜨더라도 통과시켜주진 않습니다.!!
존재하는 계정인 test 와 무작위 암호를 입력했을때는 통과하는 걸로봐서 MyPasswordEncoder.matches 이후에 해당 계정이 존재하는지 다시 확인하는 것 같습니다.
물론 스프링에서 제공해주는 BCryptPasswordEncoder 는 어떤지 디버그레벨로 로그도 찍어보고 디컴파일러로 소스도 봤지만 결과는 같습니다.


# 결론
결론부터 말씀드리면 지금은 userNotFoundPassword 를 예외 처리하지 않더라도 전혀 문제가 없습니다.
하지만 이건 잠재적인 구조 오류 같습니다.
누군가 실수로 스프링 코드에 이부분을 잘못 커밋한 경우 null 계정으로 로그인을 시도하다 다른 오류들을 끌어 들일 수 있다고 생각합니다.


# 추신
제가 잠시(?) 보안과였다가 프로그래밍이 더 나은 것 같아 몇 달만에 전과한 관계로 BCryptPasswordEncoder 의 솔트가 궁금해졌습니다.
역시 예상대로 인것 같습니다.
솔트를 섞어 해시한뒤 솔트값을 어떤형태로든 끼워넣는 것 같습니다.
``` java
BCryptPasswordEncoder en = new BCryptPasswordEncoder();
en.matches("userNotFoundPassword", "$2a$10$FZAX65mJfIVTALxAUU4YH.mWU35.cIU8kXIxvwO2anYQ0yGOirRJe"); // == true
en.matches("userNotFoundPassword", "$2a$10$2cYJbhEMcZaAqlkPGhyk6eTjFmhDNiinFn8csGIOe6UNJrfJI/TJa"); // == true
```
즉, 보안적으로 솔트서버를 별도로 두고 매번 값을 가져와서 합쳐 확인하는 극단적인 형태가 아닌 솔트를 같이 첨부하는 형태인 것 같습니다.
사실 이정도만 해도 레인보우 테이블은 어느정도 피할 수 있습니다.
(완성된 테이블에서 해시로 빼오는것이 아닌 패스워드표(레인보우테이블)을 보고 해킹한 DB에서 각각 솔트를 뽑아내서 다시 인코딩해서 공객해야함으로 암호를 뽑아내는데 훨씬 많은 시간자원이 듭니다.)


# 추신2 : 로그
유저 : not (존재하지 않는 유저)
암호 : userNotFoundPassword
MyPasswordEncoder 로 실행한 경우
loadUserByUsername : not existed user
MyPasswordEncoder.matches.rawPassword : [userNotFoundPassword]
MyPasswordEncoder.matchesencodedPassword : [EN-userNotFoundPassword]
2016-07-25 05:29:34 DEBUG o.s.s.a.d.DaoAuthenticationProvider - User 'not' not found
2016-07-25 05:29:34 DEBUG o.s.s.w.a.UsernamePasswordAuthenticationFilter - Authentication request failed: org.springframework.security.authentication.BadCredentialsException: Bad credentials
2016-07-25 05:29:34 DEBUG o.s.s.w.a.UsernamePasswordAuthenticationFilter - Updated SecurityContextHolder to contain null Authentication
2016-07-25 05:29:34 DEBUG o.s.s.w.a.UsernamePasswordAuthenticationFilter - Delegating to authentication failure handler org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler@557ff8e5
2016-07-25 05:29:34 DEBUG o.s.s.w.a.SimpleUrlAuthenticationFailureHandler - Redirecting to /loginForm?error
2016-07-25 05:29:34 DEBUG o.s.s.web.DefaultRedirectStrategy - Redirecting to '/loginForm?error'
BCryptPasswordEncoder로 실행한 경우
loadUserByUsername : not existed user
2016-07-25 06:02:13 DEBUG o.s.s.a.d.DaoAuthenticationProvider - User 'not' not found
2016-07-25 06:02:13 DEBUG o.s.s.w.a.UsernamePasswordAuthenticationFilter - Authentication request failed: org.springframework.security.authentication.BadCredentialsException: Bad credentials
2016-07-25 06:02:13 DEBUG o.s.s.w.a.UsernamePasswordAuthenticationFilter - Updated SecurityContextHolder to contain null Authentication
2016-07-25 06:02:13 DEBUG o.s.s.w.a.UsernamePasswordAuthenticationFilter - Delegating to authentication failure handler org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler@7e19a415
2016-07-25 06:02:13 DEBUG o.s.s.w.a.SimpleUrlAuthenticationFailureHandler - Redirecting to /loginForm?error
2016-07-25 06:02:13 DEBUG o.s.s.web.DefaultRedirectStrategy - Redirecting to '/loginForm?error'