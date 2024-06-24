---
layout: post
tags: [spring, jpa, hibernate]
title: 하이버네이트 6.5에서 @GenericGenerator 디프리케이트
---



```java
class PostChildNoSequenceGenerator: SequenceStyleGenerator() {
    override fun determineIncrementSize(params: Properties?): Int = 1
    override fun generate(session: SharedSessionContractImplementor, obj: Any): Any {
        val id = (session.getEntityPersister(null, obj).getIdentifier(obj, session) as Post.Key).postChildNo
        return if (id == -1L) super.generate(session, obj) else id
    }
}
```

@IdGeneratorType( 생성자에서 쓸수없다..


작성중

https://github.com/saro-lab/jwt