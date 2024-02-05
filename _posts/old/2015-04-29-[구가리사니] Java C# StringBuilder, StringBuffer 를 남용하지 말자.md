---
layout: post
tags: [가리사니, 기타]
---

> 이 문서는 예전 가리사니 사이트에서 작성된 문서 입니다.
현재 상황과 맞지 않을 수 있습니다.


Java, C# 을 사용하시는 프로그래머 같은경우 StringBuilder, StringBuffer [줄여서 sb]를 제대로 쓰지 않는경우들이 있습니다.

첫번째는 귀찮아서 입니다.
``` java
StringBuilder sb = new StringBuilder();
while (...)
{
	sb.append(a + b + c);
	// 이렇게 할경우 a, b, c를 더하기 위해 메모리를 계속할당함으로 스트링빌더의 이점을 상당히 잃어버리게됩니다.
}
```

두번째는 습관식으로
``` java
StringBuilder sb = new StringBuilder();
return sb.append(a).append(b).toString();
// 겨우 두번정도 더하는 정도라면 그냥 스트링을 더하는게 스트링빌더로 대량의 메모리를 확보하는 것보다 빠릅니다.
```

세번째 복합적으로 [습관적 + 귀찮아서]
sb류는 길이가 충분히 길고 그 길이를 모를 때 쓰는 것이 좋습니다.
``` java
String txt = '가나다라';
StringBuilder sb = new StringBuilder();
// 초성으로 바꾸자
sb.append(초성테이블[txt.charAt(0)....]....); // 좋지 않은 예제.

예를들어 초성같은 경우는 결과물의 길이가 들어오는 텍스트의 길이와 같습니다.
char[] ca = txt.to캐릭터배열();
//
for (...) { .. 작업}
new String(ca);
// 이런식으로 길이를 알고있다면 치환식으로 작업하는게 더빠릅니다.
```