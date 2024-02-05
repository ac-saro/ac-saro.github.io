---
layout: post
tags: [가리사니, 기타]
---

> 이 문서는 예전 가리사니 사이트에서 작성된 문서 입니다.
현재 상황과 맞지 않을 수 있습니다.


tomcat에서 특정 확장자에 mime-type으로 케릭터셋을 같이 보내려면 생각보다 간단하게..
web.xml에서 아래와 같이 수정하면됩니다.


``` java
<mime-mapping>
	<extension>html</extension>
	<mime-type>text/html; charset=utf-8</mime-type>
</mime-mapping>

<mime-mapping>
	<extension>js</extension>
	<mime-type>text/javascript; charset=utf-8</mime-type>
</mime-mapping>

<mime-mapping>
	<extension>css</extension>
	<mime-type>text/css; charset=utf-8</mime-type>
</mime-mapping>

```

setHeader로 Content-Type 을 text/css; charset=utf-8 로 하는 것 과 같은 효과입니다.