---
layout: post
tags: [가리사니, 기타]
---

> 이 문서는 예전 가리사니 사이트에서 작성된 문서 입니다.
현재 상황과 맞지 않을 수 있습니다.


구글 애널리틱스 에서는 **기본값으로** 해시 / 해시뱅 을 추적하지 않습니다.
때문에 가리사니 같이 #를 통해 움직이는 사이트 같은경우.
어떤 문서를 열람했는지 표시되지않습니다.

아래 코드는 **구글 애널리틱스에서 표시되는 기본값**이며 보면  ga('send', ...) 을 통해 수집한다는 사실을 알 수 있습니다.
``` java
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', '추적아이디', 'auto');
  ga('send', 'pageview'); // 바로 이부분!
```

위 ga('send', 'pageview'); 부분에 데이터를 넣어주면됩니다.

``` java
ga('send', 'pageview',
{
	'page': location.pathname + location.search  + location.hash
});
```
페이지 이동없이 경로만 바뀌는 가리사니에서 위 코드의 location.pathname + location.search 는 의미가 없기 때문에 바꿔보도록 하겠습니다.

그럼 가리사니에서 쓰는 코드를 적어보겠습니다.
``` java
// - ga('create', '추적아이디', 'auto'); 위 코드 까지는 편한 곳에 넣어 먼저 실행한 후
// - 아래 코드는 onload(최초1회)와 onhashchange 안에 넣어주시기 바랍니다.

ga('create', '추적아이디', 'auto'); // 생성!
// ga('send', 'pageview', { 'page':  location.hash }); - error : 경로 형식이 이상.
ga('send', 'pageview', { 'page':  '/' + location.hash }); // 경로 형식 올바름.
```
여기서 주의할점은 위 page는 반드시 **웹경로 형식에 맞아야** 합니다.
아마도 애널리틱스 내에서 페이지에 경로를 분석해서 처리해주는 로직 때문에.. 경로형식이 아닌경우 미리 오류를 내는 것 같습니다.

이렇게 적용하고나서 구글 애널리틱스의 실시간에 가셔서 사이트 해시로드와 함께 확인해보시면 경로가 제대로 추적되는 것을 알 수 있습니다.