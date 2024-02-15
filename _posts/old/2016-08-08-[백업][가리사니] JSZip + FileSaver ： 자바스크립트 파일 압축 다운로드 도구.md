---
layout: post
tags: [javascript]
---

> 이 문서는 가리사니 개발자 포럼에 올렸던 글의 백업 파일입니다.
오래된 문서가 많아 현재 상황과 맞지 않을 수 있습니다.


얼마전 Hibernate Tools 을 통해서 쿼리 -> Domain 변환에 대해서 설명했습니다.
[/2016/08/05/%EB%B0%B1%EC%97%85-%EA%B0%80%EB%A6%AC%EC%82%AC%EB%8B%88-Hibernate-Tools-%EB%A5%BC-%ED%86%B5%ED%95%9C-%EB%8F%84%EB%A9%94%EC%9D%B8-%EB%A6%AC%ED%8F%AC%EC%A7%80%ED%86%A0%EB%A6%AC-%EC%9E%90%EB%8F%99%EC%83%9D%EC%84%B1.html](/2016/08/05/%EB%B0%B1%EC%97%85-%EA%B0%80%EB%A6%AC%EC%82%AC%EB%8B%88-Hibernate-Tools-%EB%A5%BC-%ED%86%B5%ED%95%9C-%EB%8F%84%EB%A9%94%EC%9D%B8-%EB%A6%AC%ED%8F%AC%EC%A7%80%ED%86%A0%EB%A6%AC-%EC%9E%90%EB%8F%99%EC%83%9D%EC%84%B1.html)
하지만 결과가 별로 마음에 들지 않았습니다.
직접 쿼리문을 domain과 리포지토리로 바꿔 줄 수 있는 것을 생각하던 중 자바스크립트로 처리해서 zip으로 내려받으면 어떨까 싶어서 찾아보던중 js zip 이라는 것을 알게되었습니다.


# JSZip
아래사이트에서 download JSZip 을 눌러 다운로드받습니다.
dist -> jszip.js
http://stuk.github.io/jszip/


# 예제
``` java
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<title>test js zip</title>
<!-- 방금전 다운로드 받은 jszip.min.js 파일 -->
<script async type="text/javascript" src="./jszip.min.js" charset="utf-8"></script>
<script async type="text/javascript" charset="utf-8">
function getZip()
{
	var zip = new JSZip();
	zip.file("text1.txt", "Hello test 1");
	zip.file("text2.txt", "Hello text 2");
	zip.generateAsync({type:"base64"})
	.then(function(base64)
	{
		location.href="data:application/zip;base64," + base64;
	});
}
</script>
</head>
<body>
	<input type="button" value="다운로드" onclick="getZip();"/>
</body>
</html>
```
다만 이렇게 할경우 파일 이름을 지정할 수 없으니 FileSaver.js를 사용하라고 나옵니다.
- http://stuk.github.io/jszip/documentation/howto/write_zip.html


# FileSaver.js
https://github.com/eligrey/FileSaver.js
FileSaver.min.js 를 다운받습니다.
``` java
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<title>test js zip</title>
<script async type="text/javascript" src="./jszip.min.js" charset="utf-8"></script>
<script async type="text/javascript" src="./FileSaver.min.js" charset="utf-8"></script>
<script async type="text/javascript" charset="utf-8">
function getZip()
{
	var zip = new JSZip();
	zip.file("text1.txt", "Hello test 1");
	zip.file("text2.txt", "Hello text 2");
	zip.generateAsync({type:"blob"})
	.then(function(blob)
	{
		saveAs(blob, "hello.zip");
	});
}
</script>
</head>
<body>
	<input type="button" value="다운로드" onclick="getZip();"/>
</body>
</html>
```