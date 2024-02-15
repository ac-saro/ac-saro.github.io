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


# 뷰
2장 강의에선 string 으로 뽑았던 메인페이지도 새로 만들어줍니다.
src/main/resources/templates/main.html
``` html
<!DOCTYPE html>
<html xmlns:th="http://www.typeleaf.org">
<head>
	<meta charset="utf-8"/>
	<title>메인페이지</title>
</head>
<body>
<div>

	<a href="/mypage">마이페이지</a><br/>
	<a href="/login">로그인</a><br/>
	<a href="/create">회원가입</a><br/>

</div>
</body>
</html>
```
src/main/resources/templates/create.html
``` html
<!DOCTYPE html>
<html xmlns:th="http://www.typeleaf.org">
<head>
	<meta charset="utf-8"/>
	<title>회원가입</title>
</head>
<body>
<div>

	<form th:action="@{/createProcessing}" method="post">
		<h2>회원가입</h2>

		<!-- 강의를 간결하게 끝내기 위함.. 원래는 가입실패 여부를 자세히 표시해야한다 -->
		<div th:if="${param.error}">
			계정이 중복됩니다.
		</div>

		<input type="text" name="ac" placeholder="계정" required="required"/>
		<input type="password" name="pw" placeholder="암호" required="required"/>
		<input type="submit" value="회원가입"/>
	</form>

</div>
</body>
</html>
```


# 서비스
``` java
@Component
public class AccountService
{
	@Autowired
	AccountRepository accountRepository;

	// 리턴을 저런식으로하면 안됩니다.
	// (무었때문에 가입 실패했는지를 적어주셔야..)
	@Transactional
	public boolean create(String ac, String pw)
	{
		if (accountRepository.findOneByAc(ac) != null)
		{
			return false;
		}

		Account account = new Account();
		account.setAc(ac);
		account.setPw(new BCryptPasswordEncoder().encode(pw));
		account.setRole("NORMAL");
		accountRepository.save(account);

		return true;
	}

	public Account getAccount(String ac)
	{
		return accountRepository.findOneByAc(ac);
	}
}
```


# 컨트롤러
``` java
@RequestMapping("/")
String main()
{
	return "main";
}

@RequestMapping("/create")
String create()
{
	return "create";
}

@Autowired
AccountService accountService;

@RequestMapping("/createProcessing")
String createProcessing(@Param("ac") String ac, @Param("ac") String pw)
{
	if (accountService.create(ac, pw))
	{
		return "redirect:/login";
	}
	else
	{
		return "redirect:/create?error";
	}
}
```


# 권한설정
``` java
@Override
protected void configure(HttpSecurity http) throws Exception
{
	http.authorizeRequests()
		// 회원가입과 처리부분이 추가
		.antMatchers("/login", "/create", "/createProcessing").permitAll()
		.antMatchers("/**").authenticated();

	http
		.formLogin()
		// 로그인 처리 페이지
		.loginProcessingUrl("/loginProcessing")
		// 로그인 페이지
		.loginPage("/login")
		.failureUrl("/login?error");

	http
		.logout()
		// /logout 을 호출할 경우 로그아웃
		.logoutRequestMatcher(new AntPathRequestMatcher("/logout"))
		// 로그아웃이 성공했을 경우 이동할 페이지
		.logoutSuccessUrl("/");
}
```


# 요약 - 결론
회원가입시 암호를 넣을 때 로그인에 적용한 동일한 해시를 적용하시면 됩니다.


# 추신
처음엔 연동부부만 쓰려다가 조금 더 확장하니.... 소스가 난장판이 되었습니다.;;;;;
다듬어서 다시 쓰려고했지만... 요즘 시간이 부족하네요 ㅠㅠ...;;;