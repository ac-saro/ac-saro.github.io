---
layout: post
tags: [tomcat, certificate]
---

> 이 문서는 가리사니 개발자 포럼에 올렸던 글의 백업 파일입니다.
오래된 문서가 많아 현재 상황과 맞지 않을 수 있습니다.


필자는 위 가리사니 사이트 처럼 HTTPS를 사용하여 톰켓에 인증서를 세팅해줘야하는데.
5년전엔 고생좀하다가 적용했던걸로 기억합니다. (APR)

문제가 되는부분은 톰켓에서 SSL이 안되요.! 라는 질문을 많이 받아 볼 수 있는데요.
이유는 일반적으로 APR / NIO계열 ( NIO / NIO2 이하 NIO) 는 **server.xml에서 인증서를 세팅하는 부분이 조금 다**릅니다.

APR과 NIO의 인증서 세팅부분이 다른건 APR은 OpenSSL NIO는 Java SSL을 기반으로 사용해서 그런 것 같습니다.


# APR 방식 세팅법
``` java
<Connector
	protocol="org.apache.coyote.http11.Http11AprProtocol 생략시 기본값"
	port="443"
	scheme="https"
	secure="true"
	SSLEnabled="true"
	SSLCACertificateFile="CA인증서"
	SSLCertificateChainFile="체인인증서"
	SSLCertificateFile="도메인인증서"
	SSLCertificateKeyFile="KEY파일"
	SSLPassword="암호"
/>
```

# NIO 방식 세팅법
``` java
<Connector
	protocol="org.apache.coyote.http11.Http11NioProtocol"
	port="443"
	scheme="https"
	secure="true"
	SSLEnabled="true"
	keystoreFile="키스토어"
	keystorePass="암호"
	keystoreType="키타입 주로 PKCS12"
/>
```

# NIO2 방식 세팅법
``` java
<Connector
	protocol="org.apache.coyote.http11.Http11Nio2Protocol"
	이하동일
/>
```

NIO방식으로 쓰려면 일반 인증서들을 키스토어 형태로 바꾸셔야합니다.
아래 링크로 가시면 OPENSSL을 통한 예제가 있습니다.
[/lab?topicId=122](/lab?topicId=122)