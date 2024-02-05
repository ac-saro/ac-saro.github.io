---
layout: post
tags: [가리사니, 기타]
---

> 이 문서는 가리사니 개발자 포럼에 올렸던 글의 백업 파일입니다.
오래된 문서가 많아 현재 상황과 맞지 않을 수 있습니다.


java.lang.UnsupportedOperationException: addView(View, LayoutParams) is not supported in AdapterView

``` java
v = inflator.inflate(R.layout.rows, viewGroup);
```
뷰를 생성하면서 생기는 오류로.
위와 같은 코드에서 발생합니다.

``` java
v = inflator.inflate(R.layout.rows, viewGroup, false);
```
``` java
v = inflator.inflate(R.layout.rows, null);
```
위 처럼 3번째 인자를 주거나 viewGroup에 null을 주시면됩니다.