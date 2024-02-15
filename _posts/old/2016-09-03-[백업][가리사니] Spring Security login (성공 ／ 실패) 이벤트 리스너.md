---
layout: post
tags: [security, spring, java]
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
스프링 시큐리티에서 로그인 성공 실패 이벤트 리스너 입니다.
참고 :
[http://docs.spring.io/spring-security/site/docs/current/apidocs/org/springframework/security/authentication/event/package-summary.html](http://docs.spring.io/spring-security/site/docs/current/apidocs/org/springframework/security/authentication/event/package-summary.html)


# 성공
- 성공하는 경우는 보통 접속 로그를 남기고 마지막 접속날짜등을 갱신합니다.
- 너무 오랜만에 접속한 경우 본인 확인 이메일을 보내주거나 이메일 인증을 다시합니다.
``` java
@Service
public class SignInSuccess implements ApplicationListener<AuthenticationSuccessEvent>
{
	Logger logger = LoggerFactory.getLogger(SignInSuccess.class);

	@Override
	public void onApplicationEvent(AuthenticationSuccessEvent event)
	{
		String account = ((UserDetails)(event.getAuthentication().getPrincipal())).getUsername();
		logger.info("임시 : 접속성공 : " + account);
		// 마지막 접속날짜라던지 여러가지.. 입력
	}
}
```


# 실패
- 실패하는 경우는 주로 실패 횟수에 따라 캡차를 걸거나 접속을 차단합니다.
- 또한 보안이 중요한 서비스라면 지속적인 실패에 대해 이메일을 보내줍니다.
- 필자같은경우는 좀 특이한데 암호 해시체계를 변경하면서 여기서 처리해줬습니다.
(접속 성공자에 한하여 변경된 체계[솔트/솔트포함결과]를 새롭게 적용 : SHA3-512(암호원문) -> SHA3-512(암호원문 + 계정 SALT [계정마다 별도로 주어짐]))
``` java
@Service
public class SignInFailure implements ApplicationListener<AuthenticationFailureBadCredentialsEvent>
{
	Logger logger = LoggerFactory.getLogger(SignInFailure.class);

	@Override
	public void onApplicationEvent(AuthenticationFailureBadCredentialsEvent event)
	{
		String account = (String)event.getAuthentication().getPrincipal();
		String password = (String)event.getAuthentication().getCredentials();
		logger.info("임시 : 접속실패 : " + account + " / " + password);
		// 임시라서 패스워드를 저렇게 처리했지만...
		// 여기서 오는 패스워드는 인코딩 전 패스워드이기 때문에 보안상 해싱을 하거나 별도의 처리를 해줘야합니다.
		// 여러번 실패할경우 캡차라던지 접속 제한을 걸어야함.
		// 해외 어떤 서비스들은 접속실패시 비밀번호가 변경 이전 비밀번호의 경우 변경되기 이전이라고
		// 알려주는 경우도 있지만.. 보안상 추천하지 않는 방법.
	}
}
```
여기서 캐스트에 사용하는 UserDetails 은 org.springframework.security.core.userdetails.User 를 상속받아 구현한 클래스 입니다.