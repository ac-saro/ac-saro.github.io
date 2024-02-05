---
layout: post
tags: [가리사니, 기타]
---

> 이 문서는 가리사니 개발자 포럼에 올렸던 글의 백업 파일입니다.
오래된 문서가 많아 현재 상황과 맞지 않을 수 있습니다.


자바에서 나는 오류입니다.

``` java
ArrayList<String> arr[] = new ArrayList<String>()[];
```
자바에서는 Arrays, [](Generic Arrays)를 동시에 선언할 수 없습니다.

``` java
ArrayList<ArrayList<String>> arr;
String[][] arr;
```
위와 같은 형식으로 맞춰서 선언하셔야합니다.

ArrayList <=> Array 변환은 아래주소를 참조해주세요.
깨진링크 임시