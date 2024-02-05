---
layout: post
tags: [가리사니, 기타]
---

> 이 문서는 예전 가리사니 사이트에서 작성된 문서 입니다.
현재 상황과 맞지 않을 수 있습니다.


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