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



# 서론 (잡담)
필자가 운영하고 있는 가리사니도 사로를 통해서 페이스북과 네이버 OAuth 처리가 되어있는 것을 확인할 수 있습니다.
다만 이 글을 쓰는 시점으로 가리사니와 사로는 스프링이 아닌 서블릿으로 작성된 사이트이며 1장에서 소개한 구조를 통해 그냥 자바로 끄적끄적 작성한 OAuth 입니다.
이번에 스프링으로 사이트를 리뉴얼하면서 OAuth를 작성하려는데.. 스프링의 OAuth Client를 처음 본 순간 '그냥 생자바로 짜는 것이 10배는 더 간단하겠다' 라고 생각했습니다.
그래서 이 강의를 작성하게 되었습니다.


# 구조
1. 사이트에는 스프링 시큐리티로 작성된 일반적인 로그인이 존재합니다.
	- 스프링 시큐리티 참고 : [/lab?topicId=283](/lab?topicId=283)
	- DB에 일반 Account가 있고 OAuth 테이블과는 1:n 관계입니다.
(하나의 계정에 여러개의 OAuth를 접합시킬 수 있다는 가정하에)
2. OAuth로 로그인을 할 경우 유저ID와 전자우편을 가져옵니다.
	- DB에 유저ID가 등록되지 않은 경우.
		- OAuth 전용 가입페이지로 이동시킵니다. (간단히 생일정도만 적고 가입완료)
	- DB에 유저ID가 등록되어 있는 경우.
		- 해당 유저ID를 기준으로 Account를 찾아내서 위 직접 로그인의 Authentication 로 교체합니다.


# 스프링에서 제공되는 OAuth 로그인
1. 스프링 소셜을 이용하는경우.
- http://projects.spring.io/spring-social/
``` xml
<dependency>
	<groupId>org.springframework.social</groupId>
	<artifactId>spring-social-config</artifactId>
</dependency>
<dependency>
	<groupId>org.springframework.social</groupId>
	<artifactId>spring-social-security</artifactId>
</dependency>
<!-- 페이스북 -->
<dependency>
	<groupId>org.springframework.social</groupId>
	<artifactId>spring-social-facebook</artifactId>
</dependency>
```
페이스북, 트위터, 링크드인등을 제공해줍니다.
장점 : 소셜기능도 매우 간단하게 사용할 수 있습니다.
단점 : 제공해주지 않는 서비스(네이버, 카카오등..)에 대한 구현이 상당한 노가다입니다..... ~~DI가.. 활용되지 못하는 느낌~~
결론 : 필자가 필요한건 단지 인증부 입니다. 이걸 다 구현하면 배보다 배꼽이 더 커질 수 있음으로 패스합니다.
이것으로 구현하실 분들은 org.springframework.social.security.SocialUserDetailsService 를 상속하여 시큐리티와 연계 구현하는 방법이 있습니다.

2. OAuth2 SSO(싱글 사인온)
- [https://spring.io/guides/tutorials/spring-boot-oauth2/#_social_login_simple
결론 : 예제에서도 볼 수 있듯 심플용으로 만들어진 것으로 기본적인 것들이 이미 구현되어 있는데 이름에서도 알 수 있듯 간단 구현용이라서 생략하겠습니다.

3. OAuth2 매뉴얼(수동)
``` xml
<dependency>
	<groupId>org.springframework.security.oauth</groupId>
	<artifactId>spring-security-oauth2</artifactId>
</dependency>
```
[https://spring.io/guides/tutorials/spring-boot-oauth2/
소셜과 달리 설정파일을 주입하는 방식으로 설정파일 몇 줄과 코드 몇줄만 추가하면 소셜에선 제공해 주지 않는 네이버나 카카오등도 쉽게 확장할 수 있습니다.


# 구조
![](/file/old/166.png)
Account : 계정
AccountRole : 계정 권한 (계정1 : n 권한) [이 강의에선 쓰이지 않습니다.]
AccountOauthClient : OAuth 계정 연계 (계정1 : n OAuth)
web.configuration.security : 시큐리티 설정
web.configuration.security.direct : 직접 로그인
web.configuration.security.oauth2 : oauth2 로그인


# 직접 로그인 구현
스프링 시큐리티, 하이버네이트를 기준으로 구현됩니다.
주제가 OAuth 연동인만큼 일부분 생략하겠습니다.
스프링 시큐리티 강의는 아래 주소에서 볼 수 있습니다.
- [Spring boot Security 시리즈](/lab?topicId=283)

의존성
``` xml
<!-- 스프링 시큐리티 -->
<dependency>
	<groupId>org.springframework.boot</groupId>
	<artifactId>spring-boot-starter-security</artifactId>
</dependency>
```

룰 타입
- 기본적으로 USER 접속인지 OAUTH 접속인지를 구분합니다.
``` java
public enum RoleType
{
	USER,
	OAUTH
}
```
시큐리티
``` java
@Configuration
public class SecurityConfig extends WebSecurityConfigurerAdapter
{
	@Autowired
	ApplicationContext context;

	@Override
	public void configure(WebSecurity web) throws Exception
	{
		// 메인페이지 : css나 js 같은것들도 여기에 포함시켜준다.
		// web.ignoring().antMatchers("/**");
	}

	@Override
	protected void configure(HttpSecurity http) throws Exception
	{
		http
			// 강의 특성상 전부 허용으로 작업하겠습니다.
			.authorizeRequests()
				.antMatchers("/**")
				.permitAll()
		.and()
			.logout()
				.logoutUrl("/sign-out")
				.logoutSuccessUrl("/")
				.invalidateHttpSession(true)
		.and()
			.formLogin()
				.loginPage("/sign-in")
				.loginProcessingUrl("/sign-in/auth")
				.failureUrl("/sign-in?error=exception")
				.defaultSuccessUrl("/")

		.and()
			// 여기 나오는 sso.filter 빈은 다음장에서 작성합니다.
			// 이 장에서 실행을 확인하시려면 당연히 NPE 오류가 나니 아래 소스에 주석을 걸어주시기 바랍니다.
			.addFilterBefore((Filter)context.getBean("sso.filter"), BasicAuthenticationFilter.class);
	}
}
```
DB 구조
``` java
@Entity(name="account")
@Table(name="account")
@EntityListeners(ColumnSaveOptionListener.class)
@Data @Getter @Setter @ToString
public class Account
{
	@Id
	@Column(name="sn", nullable=false, unique=true)
	@SequenceGenerator(name="account_sn_seq", sequenceName="account_sn_seq", allocationSize=1)
	@GeneratedValue(strategy=GenerationType.SEQUENCE, generator="account_sn_seq")
	long sn;

	@Column(name="mail", nullable=false, length=64, unique=true)
	String mail;

	@Column(name="auth", nullable=false, length=128)
	String auth;

	// 컬럼 생략...

	@OneToMany(mappedBy="sn", fetch = FetchType.LAZY)
	List<AccountRole> roles;
}
```
계정 권한
``` java
@Entity(name="account_role")
@Table
(
	name="account_role",
	uniqueConstraints=@UniqueConstraint(columnNames={"sn", "role"})
)
@Data @Getter @Setter @ToString
public class AccountRole
{
	@Id
	@Column(name="sn", nullable=false)
	long sn;

	@Column(name="role", nullable=false, length=64)
	String role;

	@Column(name="role_date")
	Date roleDate;
}
```
계정 OAuth 연계 정보
``` java
@Entity(name="account_oauth_client")
@Table
(
	name="account_oauth_client",
	uniqueConstraints=@UniqueConstraint(columnNames={"sn", "type"})
)
@Data @Getter @Setter @ToString
public class AccountOauthClient
{
	@Id
	@Column(name="sn", nullable=false)
	long sn;

	@Column(name="type", nullable=false, length=12)
	String type;

	@Column(name="id", nullable=false, length=64)
	String id;
}
```
계정 리포지토리
``` java
public interface AccountRepository extends JpaRepository<Account, Long>
{
	@Query("SELECT a FROM account a LEFT JOIN FETCH a.roles b WHERE a.mail = lower(:mail)")
	public Account findByMail(@Param("mail") String mail);

	@Query("SELECT a FROM account a LEFT JOIN FETCH a.roles b WHERE a.sn = (SELECT sn FROM account_oauth_client WHERE type = :type AND id = :id)")
	public Account findByOAuthId(@Param("type") String type, @Param("id") String id);
}
```
계정 서비스
``` java
@Component
public class AccountService
{
	@Autowired
	AccountRepository accountRepository;

	public List<Account> findAll()
	{
		return accountRepository.findAll();
	}

	public Account getAccountByMail(String mail)
	{
		return accountRepository.findByMail(mail);
	}

	public Account getAccountByOAuthId(String type, String id)
	{
		return accountRepository.findByOAuthId(type, id);
	}
}
```
인증 설정 어뎁터
``` java
@Configuration
public class AuthenticationConfig extends GlobalAuthenticationConfigurerAdapter
{
	@Autowired
	UserDetailsService userDetailsService;

	@Override
	public void init(AuthenticationManagerBuilder auth) throws Exception
	{
		auth.userDetailsService(userDetailsService).passwordEncoder(passwordEncoder());
	}

	@Bean
	PasswordEncoder passwordEncoder()
	{
		// 예제입니다.
		// 본인이 사용하는 패스워드 인코더를 쓰시면됩니다.
		return new SaroPasswordEncoder();
	}
}
```
UserDetails
``` java
@Data
@EqualsAndHashCode(callSuper=false)
public class UserDetails extends User
{
	private static final long serialVersionUID = 1L;

	@Getter
	private long sn;

	public UserDetails(Account account)
	{
		super
		(
			account.getMail(),
			account.getAuth(),
			getAuthorities(account.getRoles())
		);

		sn = account.getSn();
	}

	// 이 부분은 나중에 OAuth에서도 쓰이는 부분입니다.!!
	// 기본적으로 USER : RoleType.USER.toString() 를 주고 계정에 추가 권한을 줍니다.
	public static List<GrantedAuthority> getAuthorities(List<AccountRole> roles)
	{
		List<GrantedAuthority> list = new ArrayList<>(1);

		list.add(new SimpleGrantedAuthority(RoleType.USER.toString()));

		if (roles != null)
		{
			roles.stream().forEach((AccountRole role) ->
			{
				list.add(new SimpleGrantedAuthority(role.getRole()));
			});
		}

		return list;
	}
}
```
UserDetailsService
``` java
@Service
public class UserDetailsService implements org.springframework.security.core.userdetails.UserDetailsService
{
	@Autowired
	AccountService accountService;

	@Override
	public UserDetails loadUserByUsername(String ac) throws UsernameNotFoundException
	{
		Account account = accountService.getAccountByMail(ac);

		if (account == null)
		{
			throw new UsernameNotFoundException("sign-in fail");
		}

		return new UserDetails(account);
	}
}
```


# 추신
스프링 시큐리티를 통해 직접 로그인을 구현해 본신 분이라면 특별한점이 별로 없다는 것을 알 수 있습니다.
- [스프링 시큐리티 참고](/lab?topicId=283)
참고해서 봐야할 부분은 아래와 같습니다.
- UserDetails.getAuthorities() 부분
- SecurityConfig의 .addFilterBefore((Filter)context.getBean("sso.filter"), BasicAuthenticationFilter.class);
- DB 부분
여기 까지 작성했다면 로그인이 잘되는지 뷰를 만들고  .addFilterBefore((Filter)context.getBean("sso.filter"), BasicAuthenticationFilter.class); 부분에 주석을 건 후 실행해 보시기 바랍니다. (물론 완료하고 주석을 해제합니다.)