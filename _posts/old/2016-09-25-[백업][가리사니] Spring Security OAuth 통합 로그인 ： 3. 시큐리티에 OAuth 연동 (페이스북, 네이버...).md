---
layout: post
tags: [가리사니, 기타]
---

> 이 문서는 가리사니 개발자 포럼에 올렸던 글의 백업 파일입니다.
오래된 문서가 많아 현재 상황과 맞지 않을 수 있습니다.


# Spring Security OAuth 통합 로그인 시리즈
- [1. OAuth 소개](/lab?topicId=316)
- [2. 시큐리티와 OAuth 통합 구조 및 시큐리티 작성](/lab?topicId=317)
- [3. 시큐리티에 OAuth 연동 (페이스북, 네이버...)](/lab?topicId=318)
- [4. 추가사항](/lab?topicId=321)


# 서론
2강에서 일반 로그인을 구현했다면 이번장에선 OAuth를 연동해보겠습니다.
스프링에서 제공해주는 OAuth 클라이언트는 "스프링 소셜", "스프링 OAuth SSO", "OAuth2 매뉴얼"이 있는데 "OAuth2 매뉴얼" 을 이용하여 구현합니다.
왜 이 방법을 선택했는지에 대해서는 2장 강의를 참고해주시기 바랍니다.


구조
![](/file/old/166.png)
web.configuration.security.oauth2 부분을 구현해 보겠습니다.


의존성
``` xml
<!-- 스프링 시큐리티 oauth -->
<dependency>
	<groupId>org.springframework.security.oauth</groupId>
	<artifactId>spring-security-oauth2</artifactId>
</dependency>
```

OAuth 프로퍼티 설정
먼저 각 개발자 사이트에서 로그인앱을 만들고 clientId / clientSecret 을 발급받습니다.
페이스북과 네이버는 아래 주소를 그대로 입력하시면 되며 나머지 사이트들도 API 문서를 보시면 쉽게 accessTokenUri / userAuthorizationUri / userInfoUri 를 찾을 수 있습니다.
``` shell
# 페이스북
facebook.client.clientId: 발급받은 클라이언트 아이디
facebook.client.clientSecret: 발급받은 시크릿 키
facebook.client.accessTokenUri: https://graph.facebook.com/oauth/access_token
facebook.client.userAuthorizationUri: https://www.facebook.com/dialog/oauth
facebook.client.tokenName: oauth_token
facebook.client.authenticationScheme: query
facebook.client.clientAuthenticationScheme: form
# 스코프는 제가 임시로 넣어봤습니다. 이런식으로 권한을 추가할 수 있습니다.
facebook.client.scope: public_profile,email,user_birthday
facebook.resource.userInfoUri: https://graph.facebook.com/me

# 네이버
naver.client.clientId: 발급받은 클라이언트 아이디
naver.client.clientSecret: 발급받은 시크릿 키
naver.client.accessTokenUri: https://nid.naver.com/oauth2.0/token
naver.client.userAuthorizationUri: https://nid.naver.com/oauth2.0/authorize
naver.client.tokenName: oauth_token
naver.client.authenticationScheme: query
naver.client.clientAuthenticationScheme: form
naver.resource.userInfoUri: https://openapi.naver.com/v1/nid/me
```
이 강의에선 yaml 을 설명하지 않아 프로퍼티로 하였습니다.
[스프링 yaml 사용](/lab?topicId=322)

OAuth2 Client 설정
참고 : [https://spring.io/guides/tutorials/spring-boot-oauth2/#_social_login_manual
registration.setOrder(-100); 에 대한 설명을 위 주소에서 참고하세요.
``` java
@Configuration
@EnableOAuth2Client
public class OAuth2ClientConfig
{
	@Autowired
	OAuth2ClientContext oauth2ClientContext;

	// 앞서 전장에서 만들었던 계정 서비스입니다.
	@Autowired
	AccountService accountService;

	@Bean
	@ConfigurationProperties("facebook.client")
	AuthorizationCodeResourceDetails facebook()
	{
		return new AuthorizationCodeResourceDetails();
	}

	@Bean
	@ConfigurationProperties("facebook.resource")
	ResourceServerProperties facebookResource()
	{
		return new ResourceServerProperties();
	}

	@Bean
	@ConfigurationProperties("naver.client")
	AuthorizationCodeResourceDetails naver()
	{
		return new AuthorizationCodeResourceDetails();
	}

	@Bean
	@ConfigurationProperties("naver.resource")
	ResourceServerProperties naverResource()
	{
		return new ResourceServerProperties();
	}

	@Bean
	FilterRegistrationBean oauth2ClientFilterRegistration(OAuth2ClientContextFilter filter)
	{
		FilterRegistrationBean registration = new FilterRegistrationBean();
		registration.setFilter(filter);
		// 스프링 사이트에 의하면 다른 필터보다 우선순위를 올리기위해 -100을 주었다고 나옵니다.
		registration.setOrder(-100);
		return registration;
	}

	@Bean("sso.filter")
	Filter ssoFilter()
	{
		List<Filter> filters = new ArrayList<>();

		// 페이스북
		OAuth2ClientAuthenticationProcessingFilter facebook
			= new OAuth2ClientAuthenticationProcessingFilter("/sign-in/facebook");
		facebook.setRestTemplate(new OAuth2RestTemplate(facebook(), oauth2ClientContext));
		facebook.setTokenServices(new UserTokenServices(facebookResource().getUserInfoUri(), facebook().getClientId()));
		facebook.setAuthenticationSuccessHandler(new OAuth2SuccessHandler("facebook", accountService));
		filters.add(facebook);

		// 네이버
		OAuth2ClientAuthenticationProcessingFilter naver
			= new OAuth2ClientAuthenticationProcessingFilter("/sign-in/naver");
		naver.setRestTemplate(new OAuth2RestTemplate(naver(), oauth2ClientContext));
		naver.setTokenServices(new UserTokenServices(naverResource().getUserInfoUri(), naver().getClientId()));
		naver.setAuthenticationSuccessHandler(new OAuth2SuccessHandler("naver", accountService));
		filters.add(naver);

		CompositeFilter filter = new CompositeFilter();
		filter.setFilters(filters);
		return filter;
	}
}
```
위 주소에서 설정한 "/sign-in/facebook", "/sign-in/naver" 는 각각 OAuth 제공 개발자 사이트에 가서 리다이렉트 허용설정을 해주셔야합니다. (http를 포함하여 전체로 쓰셔야합니다.)
추가설명
@EnableOAuth2Client 를 사용하여 OAuth2 Client 사용을 알립니다.
각종 필터와 필터 등록 빈을 만듭니다.

UserTokenServices
``` java
public class UserTokenServices extends UserInfoTokenServices
{
	public UserTokenServices(String userInfoEndpointUrl, String clientId)
	{
		super(userInfoEndpointUrl, clientId);
		setAuthoritiesExtractor(new OAuth2AuthoritiesExtractor());
	}

	public static class OAuth2AuthoritiesExtractor implements AuthoritiesExtractor
	{
		@Override
		public List<GrantedAuthority> extractAuthorities(Map<String, Object> map)
		{
			return AuthorityUtils.createAuthorityList(RoleType.OAUTH.toString());
		}
	}
}
```
별다른 의미는 없지만 UserInfoTokenServices에서 ROLE 기본값이 ROLE_USER 인 관계로 OAuth로 로그인 했다는 것을 알리기위해 OAUTH : RoleType.OAUTH.toString() 로 바꾸었습니다.

OAuth2SuccessHandler
인증이 성공된 경우!
``` java
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler
{
	final String type;
	final AccountService accountService;

	public OAuth2SuccessHandler(String type, AccountService accountService)
	{
		this.type = type;
		this.accountService = accountService;
	}

	@Override
	public void onAuthenticationSuccess(HttpServletRequest req, HttpServletResponse res, Authentication auth)
			throws IOException, ServletException
	{
		// 연결되어 있는 계정이 있는지 확인합니다.
		// 이전 강의 AccountService.getAccountByOAuthId 참고!!
		Account account = accountService.getAccountByOAuthId(type, auth.getName());

		// 연결되어 있는 계정이 있는경우.
		if (account != null)
		{
			// 기존 인증을 바꿉니다.
			// 이전 강의의 일반 로그인과 동일한 방식으로 로그인한 것으로 간주하여 처리합니다.
			// 기존 인증이 날아가기 때문에 OAUTH ROLE은 증발하며, USER ROLE 이 적용됩니다.
			SecurityContextHolder.getContext().setAuthentication(new UsernamePasswordAuthenticationToken
			(
				new UserDetails(account), null, UserDetails.getAuthorities(account.getRoles()))
			);
			res.sendRedirect("/");
		}
		// 연결된 계정이 없는경우
		else
		{
			// 회원가입 페이지로 보냅니다.
			// ROLE 은 OAUTH 상태입니다.
			res.sendRedirect("/sign-up/oauth");

			// 특별히 추가정보를 받아서 가입해야할 일이없다면,
			// 즉석으로 계정을 생성한 후 성공처리 해준다면 사용자 입장에서 좋을 것 같습니다.
		}
	}
}
```


# 접속 확인
주소/sign-in/facebook 으로 접속합니다.
자동으로 리다이렉트 되고 인증이 성공된 경우
OAuth2SuccessHandler.onAuthenticationSuccess 에 따라 작동하게 됩니다.


# Authentication 확인 해보기
``` java
@RequestMapping(path="/test", produces="text/plain")
@ResponseBody
String test(Authentication authentication)
{
	return authentication;
}
```
/test 에 로그인 전 / 후 OAuth 만 인증된 경우 확인 해보시기 바랍니다.!!


# 추신
하지만 로그인에 너무 많은 문제점들이 있어서!!! 좀 더 정리를 해서 구현해야할 것 같습니다.!!
이제 ROLE 이 OAUTH 일때 OAUTH 추가 회원가입만 만드시면 됩니다.
사이트에서 수집하는 개인정보가 ID 정도만으로도 만족된다면, 즉석에서 게정을 만들어 준 후 접속되게 하는 방법도 괜찮을 것 같습니다.!!