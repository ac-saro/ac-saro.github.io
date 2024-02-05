---
layout: post
tags: [android]
---

> 이 문서는 가리사니 개발자 포럼에 올렸던 글의 백업 파일입니다.
오래된 문서가 많아 현재 상황과 맞지 않을 수 있습니다.


웹뷰에서 tel 프로토콜을 사용하기위해선 shouldOverrideUrlLoading을 오버로딩 해줘야합니다.

``` java
private class ExViewClient extends WebViewClient {
	@Override
	public boolean shouldOverrideUrlLoading(WebView view, String url) {
		if( url.startsWith("http:") || url.startsWith("https:") ) {
			return false;
		}
		// tel일경우 아래와 같이 처리해준다.
		else if (url.startsWith("tel:")) {
			Intent tel = new Intent(Intent.ACTION_DIAL, Uri.parse(url));
			startActivity(tel);
			return true;
		}
		return true;
	}
	...
}
```