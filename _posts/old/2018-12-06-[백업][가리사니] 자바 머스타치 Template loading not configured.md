---
layout: post
tags: [java, spring]
---

> 이 문서는 가리사니 개발자 포럼에 올렸던 글의 백업 파일입니다.
오래된 문서가 많아 현재 상황과 맞지 않을 수 있습니다.


작성중
``` java
@Configuration
public class WebConfiguration implements WebMvcConfigurer {
    @Autowired ApplicationContext context;

    @Override
    public void configureViewResolvers(ViewResolverRegistry registry) {

        var compiler = Mustache.compiler().withLoader((name) -> new StringReader(Converter.toString(
            WebConfiguration.class.getResource("/templates/" + name + ".html").openStream(), "UTF-8"
        )));

        MustacheViewResolver resolver = new MustacheViewResolver(compiler);

        resolver.setCharset("UTF-8");
        resolver.setContentType("text/html;charset=UTF-8");
        resolver.setPrefix("classpath:/templates/");
        resolver.setSuffix(".html");
        resolver.setCache(true);
        resolver.setCacheLimit(8192);

        registry.viewResolver(resolver);
    }
}
```