---
layout: post
tags: [가리사니, 기타]
---

> 이 문서는 예전 가리사니 사이트에서 작성된 문서 입니다.
현재 상황과 맞지 않을 수 있습니다.


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