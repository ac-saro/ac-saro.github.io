---
layout: post
tags: [가리사니, 기타]
---

> 이 문서는 예전 가리사니 사이트에서 작성된 문서 입니다.
현재 상황과 맞지 않을 수 있습니다.


Access-Control-Allow-Origin을 사용하면 다른 도메인으로 Ajax을 할 수 있습니다.
기존까지는 자바스크립트를 로드하고 로드된 자바스크립트가 함수를 부르는 jsonp방식을 주로 써왔지만. 목적 페이지에서 Access-Control-Allow-Origin를 지원한다면 이러한 방법을 쓰지않고 결과를 가져올 수 있게 되었습니다.

하. 지. 만 이렇게 좋은방법이 있다면 왜 다들 쓰지 않는걸까요?

국내 브라우저 환경상 지원되지 않는 사람들이 많아서 입니다.
이기술은 익스 8에서부터 지원하기 시작햇지만 제대로 지원한건 익스 10부터입니다.

Access-Control-Allow-Origin 지원브라우저 목록
IE8+ (제한적), IE10+ (일반적)
Firefox 3.6+
Safari 4.0+
Chrome 6+
Opera 12.1+

어떻게 하면되는가?
해더에 아래 4가지를 추가해줍니다.
``` java
# 설명
Access-Control-Allow-Origin: 허용할주소 * 허용
Access-Control-Allow-Methods: 허용할 메서드
Access-Control-Allow-Headers: 허용할 해더
Access-Control-Max-Age: 설정 재발급까지 유지시간.

# 예제
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: POST, GET
Access-Control-Allow-Headers: *
Access-Control-Max-Age: 1728000
```

지금 당장 실무에 적용하긴 힘들지만 미리 적용해 두거나 알아두시는거 정도는 나쁘지 않을 것 같습니다.