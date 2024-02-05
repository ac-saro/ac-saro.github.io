---
layout: post
tags: [가리사니, 기타]
---

> 이 문서는 예전 가리사니 사이트에서 작성된 문서 입니다.
현재 상황과 맞지 않을 수 있습니다.


가리사니의 소스보기를 누르면 meta 태그에 다음과 같은 코드가 들어있습니다.
``` java
<meta property="og:title" content="가리사니"/>
<meta property="og:url" content="https://gs.saro.me/"/>
<meta property="og:image" content="http://gs.saro.me/gs/og-image.png"/>
<meta property="og:description" content="가리사니 개발자공간"/>
```

위 태그는 페이스북이나 카카오톡 같이 일부 서비스에서 사이트 링크를 할 경우 해당 사이트의 이미지 제목 간단설명이 같이 나오는 경우를 보신 적이 있을겁니다.

![](/file/old/44.png)
예) 페이스북에 가리사니를 올릴 때 나오는 이미지 입니다.
특별히 설명을 하지 않더라도 위 이미지에서 og:title, og:url, og:image 의 쓰임새는 바로 알 수 있습니다.

또한 저 3가지 말고도 여러가지 속성이 있으며 http://ogp.me/ (공식사이트) 에서 확인 가능합니다.

# 주의사항
1. 특정 서비스에서 og:image 의 프로토콜이 https: 인경우 인식하지 못하니 되도록 http: 를 사용해야합니다.
2. 페이스북같은경우는 og: 를 적용하더라도 적용되는데 약간의 시간이 필요합니다. (기존의 값이 캐싱됨)
 - 다만 http://developers.facebook.com/tools/lint/ 에 들어가서 직접 갱신할 경우 몇분내로 페이스북에 적용되게 됩니다.
3. 일부 서비스는 og: 가 아닌 다른 방법으로 이를 확인합니다. (예:트위터)
 - 트위터에 가리사니 링크 올릴사람이 없을거같아.. 트위터는 뺐습니다. 하하하...;;;