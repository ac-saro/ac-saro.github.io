---
layout: post
tags: [http, javascript]
---

> 이 문서는 가리사니 개발자 포럼에 올렸던 글의 백업 파일입니다.
오래된 문서가 많아 현재 상황과 맞지 않을 수 있습니다.


# fetch 란?
fetch가 나오기전까진 자바스크립트에서 ajax을 쓰기란 매우 까다롭고 익스플로러랑 기타브라우저가 맞춰저 있지 않다보니 커먼라이브러로 만들어쓰거나 손쉽게 만들어져 있는 제이쿼리를 이용하였습니다.
\
ajax이 처음 나오던 시절엔 사이트 전체에 극히 일부에서 사용하던 기술이었지만, 현재는 극단적으로 말해 [SPA](https://en.wikipedia.org/wiki/Single-page_application) 처럼 ajax의 구성이 대부분인 사이트까지 있습니다.
\
그러다보니 새로운 표준이 필요했고 ES2015 쯤에 아래와 같이 공식 스펙으로 구현되었습니다.
참고: [https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch

# 형태
``` js
fetch(주소:string, 옵션);
```
## 옵션 상세
|속성|이름|테스트3|
|-|-|-|
|method|GET|전송메소드|
|mode|same-origin|no-cors, cors, same-origin|
|cache|default|default, no-cache, reload, force-cache, only-if-cached|
|credentials|omit|include, same-origin, omit|
|headers|없음|전송시 헤더|
|redirect|follow|manual, follow, error|
|referrer|client|no-referrer, client|
|body|없음|http 바디 (Content-Type의 형식과 같아야함)|

# 예제
``` js
// GET
fetch("/test.json") // (/test.json) 호출 (GET)
	.then(e => e.json()) // 비동기
	.then(e => console.log(e)); // 비동기

// 옵션으로 POST
fetch("/test.json", {
		method: "POST" // (/test.json) 호출 (POST)
	}).then(e => e.json()) // 비동기
	.then(e => console.log(e)); // 비동기
```

# 주의사항
fetch는 기존 자바스크립트이 ajax과 달리 credentials 가 기본값으로 omit 입니다.
즉, 쿠키로 세션 ID를 물고 있는 상태에서 옵션없이 fetch를 쓴다면 해당 세션id를 보내지 않을 것이며, 때문에 세션이 적용되지 않습니다.
``` js
// /board/write 통해 글을 쓴다고 가정하고 보낸다.
fetch("/board/write", {
		method: "POST",
		headers: {
            "Content-Type": "application/json; charset=utf-8"
        },
		body: JSON.stringify({title: "제목입니다.", text: "내용입니다."})
	}).then(e => e.json()).then(e => {
		// 비 로그인시 글쓰기가 불가하다고 가정하면,
		// 정상적으로 진행할 수 없습니다.
		// 서버에는 로그인이 되지않은상태 (쿠키에 세션아이디가 없는상태) 로 전달 되었을 것입니다.
	});
```
아래처럼 same-origin 옵션으로 해결할 수 있습니다.
- origin 이란 프로토콜 + 도메인 입니다.
- 즉 https://gs.saro.me/dev 가 있다면 https://gs.saro.me 까지 입니다.
``` js
// /board/write 통해 글을 쓴다고 가정하고 보낸다.
fetch("/board/write", {
		method: "POST",
		headers: {
            "Content-Type": "application/json; charset=utf-8"
        },
        credentials: "same-origin",
		body: JSON.stringify({title: "제목입니다.", text: "내용입니다."})
	}).then(e => e.json()).then(e => {
		// 이제 같은 origin(위 설명참고)에서 동일한 쿠키(세션ID)를 보내도록 조정됩니다.
		// 때문에 로그인 상태가 유지됩니다.
	});
```