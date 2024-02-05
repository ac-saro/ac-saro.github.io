---
layout: post
tags: [가리사니, 기타]
---

> 이 문서는 가리사니 개발자 포럼에 올렸던 글의 백업 파일입니다.
오래된 문서가 많아 현재 상황과 맞지 않을 수 있습니다.


안드로이드 EditText 커서 위치에 텍스트를 삽입 하는 예제입니다.

``` java
/**
EditText의 커서 위치에 단어 넣기<br/>
2015-05-16 전명 박용서 : 작성
*/
public static void insertText(EditText view, String text)
{
	// Math.max 는 에초에 커서가 잡혀있지않을때를 대비해서 넣음.
	int s = Math.max(view.getSelectionStart(), 0);
	int e = Math.max(view.getSelectionEnd(), 0);
	// 역으로 선택된 경우 s가 e보다 클 수 있다 때문에 이렇게 Math.min Math.max를 쓴다.
	view.getText().replace(Math.min(s, e), Math.max(s, e), text, 0, text.length());
}
```