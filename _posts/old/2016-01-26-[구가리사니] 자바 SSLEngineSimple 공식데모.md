---
layout: post
tags: [가리사니, 기타]
---

> 이 문서는 예전 가리사니 사이트에서 작성된 문서 입니다.
현재 상황과 맞지 않을 수 있습니다.


자바 논블록킹 SSL 구현을 위해 검색엔진을 조사하던 중 대부분 자바 1.4이하 기술이나 데모가 정상적으로 동작하지 않거나 잡다한 오류들이 너무 많아서... 찾던 중 드디어 정상 동작하는 것을 찾았습니다.
다만 최종 논블록킹 SSL이 아닌 논블록킹 SSL을 구현하는데 필요한 SSLEngine에 대한 데모입니다.

https://docs.oracle.com/javase/8/docs/technotes/guides/security/jsse/samples/sslengine/SSLEngineSimpleDemo.java

참고!
https://docs.oracle.com/javase/8/docs/api/javax/net/ssl/SSLEngine.html

# 주의점
위에서 언급한 것 과 같이 SSLEngine의 쓰임새에 대한 예제이기 때문에 **실제 통신은 하지 않**는 것 같습니다..
키스토어는 직접 만들어서 사용하시면 되고요.
소스 내리다 보면 아래와 같이 써있는 낚시가 있습니다.
``` java
char[] passphrase = "passphrase".toCharArray();
```
조용히 아래와 같이 바꾸주시기 바랍니다.
``` java
char[] passphrase = passwd.toCharArray();
```
먼가... 전역으로 선언해 놓고.... 소스 가서 실수한 듯 합니다...;;

# 추신
이렇게 오늘도 삽질을 하고..
이번 주 수요일까진 완벽하게 동작하도록 만들어봐야겠네요.