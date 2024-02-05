---
layout: post
tags: [jsp, tomcat]
---

> 이 문서는 가리사니 개발자 포럼에 올렸던 글의 백업 파일입니다.
오래된 문서가 많아 현재 상황과 맞지 않을 수 있습니다.


톰켓의 conf폴더의 server.xml문서를 열면.

Connector 노드에
compression, compressionMinSize, noCompressionUserAgents, compressableMimeType 노드를 추가합니다.

compression : 값 on, off
압축전송기능 사용여부를 설정합니다. 당연히 이 기능을 쓰기위해선 on으로 설정해야합니다.

compressionMinSize : 정수
byte단위로 몇 이상 크기부터 압축할지를 결정합니다.
너무 작은 크기를 압축하면 오히려 서버의 자원낭비가 될 수 있습니다.
(물론 작은크기에서 압출률도 별로 의미가 없습니다.)

noCompressionUserAgents : 문자열
압축을 사용하지 않을 유저에이전트(브라우저)를 설정합니다.
브라우저가 아닌, 유저에이전트입니다. 예를들어 모질라라고 적을경우
유저에이전트에 모질라가 있는 모든 브라우저 (익스, 파폭, 크롬, 사파리등...) 전부 압축전송이 작동하지 않습니다.

compressableMimeType : 문자열
압축을 사용할 파일분류를 설정합니다.


예제 : 가리사니 개발자 공간의 실제설정 추가된부분
``` java
<Connector
	[... 기타 SSL / 리플리케이션 / 세션공유설정 : 길이상 생략.]

	port="443"
	scheme="https"
	secure="true"
	URIEncoding="UTF-8"
	compression="on"
	compressionMinSize="2048"
	noCompressionUserAgents="gozilla, traviata"
	compressableMimeType="text/html,text/xml"
/>
```