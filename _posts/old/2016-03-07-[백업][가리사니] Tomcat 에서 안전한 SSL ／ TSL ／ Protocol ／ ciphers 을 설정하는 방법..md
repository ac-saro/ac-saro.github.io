---
layout: post
tags: [가리사니, 기타]
---

> 이 문서는 가리사니 개발자 포럼에 올렸던 글의 백업 파일입니다.
오래된 문서가 많아 현재 상황과 맞지 않을 수 있습니다.



참고 :
https://wiki.mozilla.org/Security/Server_Side_TLS
https://www.openssl.org/docs/manmaster/apps/ciphers.html
https://tomcat.apache.org/tomcat-8.0-doc/security-howto.html
https://www.ssllabs.com/ssltest/index.html


톰켓 SSL / TSL 에서 좀 더 안전한 ciphers 을 설정 할 수 있습니다.
기본값으로는 너무 오래된 ciphers들도 포함되어 있기 때문에 직접 선택해주는 것을 권장합니다.
다만 **브라우저 지원을 확인하여 하위 호환을 열어두는 것이 중요**합니다.

# 설정방법
1. 톰켓/conf/server.xml 파일을 오픈.
2. Connector 파일을 열어 아래의 ciphers 같이 추가해줍니다.
3. sslEnabledProtocols 를 더 안전한 TLS 계열만 남겨둡니다.
  (아직도 사용하는 회사는 적을 것 같지만 톰켓 6에서는 sslEnabledProtocols 대신 sslProtocols 를 사용합니다.)
``` java
<Connector port="443" scheme="https" test="기타 값들 생략..."
sslEnabledProtocols="TLSv1,TLSv1.1,TLSv1.2"
ciphers="TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256,TLS...(쉼표로 구분)"
/>
```

위에서도 강조했지만 브라우저의 하위 호환을 어느정도 생각하셔야 합니다.
https://en.wikipedia.org/wiki/Transport_Layer_Security
위 링크의 표와 같이 TLS 만 설정하면 IE 7 부터 지원 할 수 있습니다.

사이퍼(cipher)의 경우는 1년에 한번 정도 아래와 같이 확인하여 교체하는 것을 추천드립니다.
https://www.google.ca/?gws_rd=ssl#q=tomcat+safe+ciphers
https://www.google.ca/?gws_rd=ssl#q=tomcat+disable+weak+ciphers


조사 결과 톰켓 8 의 경우는 아래와 같이 설정하는 것이 적당한 것 같습니다.
``` java
<Connector port="443" scheme="https" test="기타 값들 생략..."
ciphers="TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,
TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,
TLS_DHE_RSA_WITH_AES_256_GCM_SHA384,
TLS_DHE_RSA_WITH_AES_128_GCM_SHA256,
TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA384,
TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA,
TLS_DHE_RSA_WITH_AES_256_CBC_SHA256,
TLS_DHE_RSA_WITH_AES_256_CBC_SHA,
TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256,
TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA,
TLS_DHE_RSA_WITH_AES_128_CBC_SHA256,
TLS_DHE_RSA_WITH_AES_128_CBC_SHA,
TLS_ECDHE_RSA_WITH_3DES_EDE_CBC_SHA,
TLS_DHE_RSA_WITH_3DES_EDE_CBC_SHA,
TLS_RSA_WITH_AES_256_GCM_SHA384,
TLS_RSA_WITH_AES_256_CBC_SHA256,
TLS_RSA_WITH_AES_256_CBC_SHA,
TLS_RSA_WITH_AES_128_GCM_SHA256,
TLS_RSA_WITH_AES_128_CBC_SHA256,
TLS_RSA_WITH_AES_128_CBC_SHA,
TLS_RSA_WITH_3DES_EDE_CBC_SHA"
/>
```

톰켓 문서에도 나와있지만 https://www.ssllabs.com/ssltest/index.html 이 사이트에서 SSL/TLS 의 보안강도를 측정 할 수 있습니다.