---
layout: post
tags: [가리사니, 기타]
---

> 이 문서는 가리사니 개발자 포럼에 올렸던 글의 백업 파일입니다.
오래된 문서가 많아 현재 상황과 맞지 않을 수 있습니다.


DB 의 예제파일을 가지고 만드셨다면 conf 폴더의 elevate.xml 의 내용을 다음 처럼 주석으로 해주시면 됩니다.
예제 파일은 정말 예제파일이 들어있으니 그대로 쓰기보단 참고만 하시는 것이 좋습니다.
``` java
<elevate>
<!--
 <query text="foo bar">
  <doc id="1" />
  <doc id="2" />
  <doc id="3" />
 </query>

 <query text="ipod">
   <doc id="MA147LL/A" />  <!-- put the actual ipod at the top
   <doc id="IW-02" exclude="true" /> <!-- exclude this cable
 </query>
-->
</elevate>
```