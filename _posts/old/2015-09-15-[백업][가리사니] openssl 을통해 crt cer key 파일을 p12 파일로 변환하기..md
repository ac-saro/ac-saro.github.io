---
layout: post
tags: [certificate]
---

> 이 문서는 가리사니 개발자 포럼에 올렸던 글의 백업 파일입니다.
오래된 문서가 많아 현재 상황과 맞지 않을 수 있습니다.


# openssl이 없는경우
먼저 openssl을 다운받습니다.
http://openssl.org/
[윈도 10 실행파일을 위해 사람들이 추천하는 아래 사이트에서 받았습니다.]
https://slproweb.com/products/Win32OpenSSL.html
제가 받은버전 : Win64 OpenSSL v1.0.2d Light : 글을 쓴 시점에서 가장 최신버전


# openssl을 이용하여 Certificate 형식을 PKCS12 형식으로 바꾸는 예제입니다.
준비물 (형식만 맞다면 확장자는 특별히 일치하지 않아도됩니다.)
도메인인증서.crt
도메인키.key
CA파일.cer
체인인증서.cer

``` java
openssl
pkcs12 -export -in 도메인인증서.crt -inkey 도메인키.key -out 출력할키스토어.p12 -name saro.me -CAfile CA파일.cer -caname root -certfile 체인인증서.cer
```