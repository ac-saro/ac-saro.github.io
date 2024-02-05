---
layout: post
tags: [가리사니, 기타]
---

> 이 문서는 가리사니 개발자 포럼에 올렸던 글의 백업 파일입니다.
오래된 문서가 많아 현재 상황과 맞지 않을 수 있습니다.


EditText 에 포커스를 주고 싶을때

``` java
EditText et = 생략...
et.requestFocus();
```
코드로 주는방법

``` xml
<EditText
	android:layout_width="fill_parent"
	android:layout_height="wrap_content"
	android:inputType="textEmailAddress">
	<!-- 자동선택옵션 -->
	<requestFocus />
</EditText>
```
xml로 주는방법