---
layout: post
tags: [servlet, spring]
---

> 이 문서는 가리사니 개발자 포럼에 올렸던 글의 백업 파일입니다.
오래된 문서가 많아 현재 상황과 맞지 않을 수 있습니다.


서블릿에서 스프링을 옴겨가면서 다른 것들을 찾고있는중입니다..
(너무 단순한거라 글쓰기 뭐하지만.. 필기의 습관..;; 하하하..;;)

서블릿 같은경우 web.xml 을 통해 아래와 같이 지정하는것이 일반적 입니다.
``` java
<error-page>
	<error-code>404</error-code>
	<location>/error/404</location>
</error-page>
<error-page>
	<error-code>405</error-code>
	<location>/error/code</location>
</error-page>
<error-page>
	<error-code>500</error-code>
	<location>/error/code</location>
</error-page>
<error-page>
	<exception-type>java.lang.Throwable</exception-type>
	<location>/error/code</location>
</error-page>
```

스프링부트에서는 아래처럼 지정 할 수 있습니다.
``` java
import org.springframework.boot.autoconfigure.web.ServerProperties;
import org.springframework.boot.context.embedded.ConfigurableEmbeddedServletContainer;
import org.springframework.boot.web.servlet.ErrorPage;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;

@Configuration
public class ErrorConfiguration extends ServerProperties
{
	@Override
	public void customize(ConfigurableEmbeddedServletContainer container)
	{
		super.customize(container);
		container.addErrorPages(new ErrorPage(HttpStatus.NOT_FOUND, "/error/404"));
		container.addErrorPages(new ErrorPage(HttpStatus.INTERNAL_SERVER_ERROR, "/error/500"));
		container.addErrorPages(new ErrorPage("/error/code"));
	}
}
```