---
layout: post
tags: [가리사니, 기타]
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