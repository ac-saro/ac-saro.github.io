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


# 알림
여기서부터 예제는 hibernate - PostgreSQL 기반으로 작성됩니다.
다른 부분만 별도로 작성해주시면 다른 플랫폼에서도 그대로 할 수 있습니다.


# DB 설정
사실 role 은 저런식으로 설정하면 안됩니다.!!
다른 테이블을 만들어서 조인하는 식으로해서 여러개의 role을 가지고 있을 수 있게 만들어야하지만 여기서는 예제가 너무 길어지는걸 방지하기 위해 이렇게 쓰도록하겠습니다.
``` sql
CREATE TABLE users
(
  no bigint NOT NULL,
  ac character varying(32) NOT NULL,
  pw character varying(256) NOT NULL,
  -- 원래 별도의 테이블에 만들어서 1:n 조인을 해야한다.
  -- 예제가 너무 길어지는걸 방지하기위해 편의상 이렇게 작성.
  role character varying(32) NOT NULL
);
CREATE SEQUENCE users_no_seq;
-- 엄밀히 설정하려면 대문자나 소문자로 변환해서 유니크를 걸어야하는데 여기서는 생략합니다.
-- 사실 함수 인덱스를 거는거보다 입력시에 무조건 소문자로 치환해주는게 더 바람직.
CREATE INDEX account_ac_uni ON account (ac);
-- 왜 암호를 EN-1234 라고 정했는지는 있다가 설명.
INSERT INTO account (ac, pw, role) VALUES (test', 'EN-1234', 'NORMAL')
```


# 엔티티
``` java
@Entity(name="account")
@Table(name="account")
@Data @Getter @Setter
@ToString
public class Account
{
	@Id
	@SequenceGenerator(name="seq", sequenceName="account_no_seq", allocationSize=1)
    @GeneratedValue(strategy=GenerationType.SEQUENCE, generator="seq")
	long no;

	@Column(unique=true)
	@NotNull
	String ac;
	public void setAc(String ac)
	{
		// 일반적으로 소문자 : pg-sql 같은경우 대소문자를 구분함.
		// 구분하지 않더라도 소문자 입력이 일반적이다.
		this.ac = ac.toLowerCase();
	}

	@Column
	@NotNull
	String pw;

	@Column
	@NotNull
	String role;
}
```


# 리포지토리 / 서비스
아이디로 계정을 찾기위해 findOneByAc 추가함.
``` java
public interface AccountRepository extends JpaRepository<Account, Long>
{
	@Query("SELECT a FROM account a WHERE a.ac = :ac")
	public Account findOneByAc(@Param("ac") String ac);
}
```
``` java
@Component
public class AccountService
{
	@Autowired
	AccountRepository accountRepository;

	public Account getAccount(String ac)
	{
		return accountRepository.findOneByAc(ac);
	}
}
```


# LoginUserDetails
로그인 유저의 객체입니다.
``` java
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.User;

public class LoginUserDetails extends User
{
	private static final long serialVersionUID = 1L;

	@Getter
	private long no;

	public LoginUserDetails(Account account)
	{
		// 일반적으로는 AuthorityUtils.createAuthorityList 에 다수의 룰을 넣고
		// account 테이블과 분리되어 별도의 권한테이블을 join해서 가져와야하지만
		// 예제가 길어지는걸 방지하기위해 이렇게 만들었다.
		super
		(
			account.getAc(),
			account.getPw(),
			AuthorityUtils.createAuthorityList(account.getRole())
		);
		no = account.getNo();
	}
}
```


# LoginUserDetailsService
- 인증 과정으로 유저가 입력한 id 에 해당하는 정보를 불러와 LoginUserDetails 에 바인딩하여 반환합니다.
``` java
@Service
public class LoginUserDetailsService implements UserDetailsService
{
	@Autowired
	AccountService accountService;

	// 필자의 경우 기존 해시 시스템이 좀 다르기 때문에
	// 이부분을 적용한다면 암호가 구형시스템이라면 바꿔주는 부분이 필요.
	// @Autowired
	// private HttpServletRequest request;

	@Override
	public UserDetails loadUserByUsername(String ac) throws UsernameNotFoundException
	{
		// 기존해시와 신규해시가 다를경우 이런식으로 받아 처리할 수 있음.
		// 위 @Autowired HttpServletRequest request;
		// request 처리

		Account account = accountService.getAccount(ac);

		if (account == null)
		{
			// 계정이 존재하지 않음
			throw new UsernameNotFoundException("login fail");
		}

		return new LoginUserDetails(account);
	}
}
```


# SecurityConfig
이전장에서 설정했던 객체입니다.
로그인 과정과 패스워드 인코더를 추가하였습니다.
``` java
@Configuration
public class SecurityConfig extends WebSecurityConfigurerAdapter
{
	@Override
	public void configure(WebSecurity web) throws Exception
	{
		// 메인페이지 : css나 js 같은것들도 여기에 포함시켜준다.
		web.ignoring().antMatchers("/");
	}

	@Override
	protected void configure(HttpSecurity http) throws Exception
	{
		http
			.authorizeRequests()
				// 위 ignoring 을 제외한 전체가 기본 인증페이지
				.antMatchers("/**").authenticated();

		http
			.formLogin()
			// 로그인 페이지 : 컨트롤러 매핑을 하지 않으면 기본 제공되는 로그인 페이지가 뜬다.
			.loginProcessingUrl("/login");

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
			// 스프링에서 제공하는 기본 암호 인코더
			// return new BCryptPasswordEncoder();
			// 커스텀 인코더를 사용하고있다.
			return new MyPasswordEncoder();
		}

		@Override
		public void init(AuthenticationManagerBuilder auth) throws Exception
		{
			auth.userDetailsService(userDetailsService).passwordEncoder(passwordEncoder());
		}
	}

	// 암호 인코더 커스텀 설정
	public static class MyPasswordEncoder implements PasswordEncoder
	{
		@Override
		public String encode(CharSequence rawPassword)
		{
			// 여기서는 이렇게 처리하였지만 예를들어 sha-2 / sha-3 같은 해시를 접목시킬 수 있다.
			// 여기서는 간단히 EN-을 붙여 확인하는 용도!
			return "EN-" + rawPassword.toString();
		}

		@Override
		public boolean matches(CharSequence rawPassword, String encodedPassword)
		{
			// rawPassword 현재 들어온 값 | encodedPassword 매칭되는 계정에 있는 값
			return encodedPassword.equals(encode(rawPassword));
		}
	}
}
```


# 컨트롤러
``` java
@ResponseBody
@RequestMapping(path="/", produces="text/html")
public String index()
{
	return
		"index page<br/><a href=\"/mypage\">mypage</a>";
}

@ResponseBody
@RequestMapping(path="/mypage", produces="text/html")
public String mypage(@AuthenticationPrincipal LoginUserDetails userDetails)
{
	return
		"is mypage !!<br/>" +
		userDetails.getNo() + " : " + userDetails.getUsername() +
		"<br/><a href=\"/logout\">logout</a>";
}
```


# 실행
인덱스 페이지에선 인덱스 화면이 보이고, /mypage 로 이동할경우 자동으로 /login 으로 이동(SecurityConfig 참고)합니다.
현재 이 예제에선 login을 만들어주지 않았기 때문에 스프링에서 제공하는 기본 로그인이 나옵니다.
로그인이 완료되었다면 /mypage 로 들어갔을때 인증된 상태로 동작하며,  /logout 으로 이동하면 로그아웃된 후 인덱스 페이지로 이동합니다.
다만, 암호 인코더 커스텀 설정은 주석대로 sha-2 이상의 강력한 해시를 사용하거나 스프링에서 기본적으로 제공하는 BCryptPasswordEncoder 를 써야합니다.