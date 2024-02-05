---
layout: post
tags: [가리사니, 기타]
---

> 이 문서는 예전 가리사니 사이트에서 작성된 문서 입니다.
현재 상황과 맞지 않을 수 있습니다.



출처 : https://tomcat.apache.org/tomcat-8.0-doc/config/http.html


필자는 예전부터 APR이 우수하다고 하여... APR에대해서 자세히 찾아보진 않았습니다.
APR이 속도면에서 우수하고 인증서옵션이 간결해서.. 사용하고있었습니다...;;;;

아래 표를 보니 NIO2를 써보고싶어지는군요.!!

그럼 톰켓사이트에 나오는 저 비교를 보도록하겠습니다.

|  | BIO | NIO | NIO2 | APR |
| ------- | ------- | ------- | ------- | ------- |
| Classname | Http11Protocol | Http11NioProtocol	|	Http11Nio2Protocol	|	Http11AprProtocol |
| Tomcat Version	 | 		3.x onwards			 | 6.x onwards		 | 	8.x onwards		 | 		5.5.x onwards |
| Support Polling	 | 		NO				 | 		YES				 | 		YES			 | 				YES |
| Polling Size			 | 	N/A				 | 		maxConnections	 | 	maxConnections		 | 	maxConnections |
| Read HTTP Request	 | 	Blocking		 | 		Non Blocking	 | 		Non Blocking			 | 	Blocking |
| Read HTTP Body		 | 	Blocking		 | 		Sim Blocking		 | 	Blocking		 | 			Blocking |
| Write HTTP Response	 | 	Blocking		 | 		Sim Blocking	 | 		Blocking	 | 				Blocking |
| Wait for next Request	 | 	Blocking		 | 		Non Blocking	 | 		Non Blocking	 | 			Non Blocking |
| SSL Support			 | 	Java SSL			 | 	Java SSL		 | 		Java SSL			 | 		OpenSSL |
| SSL Handshake		 | 	Blocking			 | 	Non	blocking	 | 	Non blocking			 | 	Blocking |
| Max Connections		 | 	maxConnections	 | 	maxConnections	 | 	maxConnections	 | 		maxConnections |


추신.
가리사니에 테이블 기능을 만들던지 해야지..;;;