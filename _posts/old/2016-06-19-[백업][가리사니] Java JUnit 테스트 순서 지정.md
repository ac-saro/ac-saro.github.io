---
layout: post
tags: [가리사니, 기타]
---

> 이 문서는 가리사니 개발자 포럼에 올렸던 글의 백업 파일입니다.
오래된 문서가 많아 현재 상황과 맞지 않을 수 있습니다.


# JUnit 4.11 부터는 테스트의 순서를 지정할 수 있습니다.

``` java
public class AppTest extends TestCase
{
	// 기본선언 생략

	// 테스트
	public void test01__이름1() { /* 생략 */ }
	public void test02__이름2()  { /* 생략 */ }
	public void test03__이름3()  { /* 생략 */ }
}
```

위와 같은 코드가 있다면
@FixMethodOrder(MethodSorters.NAME_ASCENDING)
를 추가해서 아래와 같이 사용할 수 있습니다.
``` java
@FixMethodOrder(MethodSorters.NAME_ASCENDING)
public class AppTest extends TestCase
{
	// 기본선언 생략

	// 테스트 : 메소드의 이름 오름차순으로 테스트한다.
	public void test01__이름1() { /* 생략 */ }
	public void test02__이름2()  { /* 생략 */ }
	public void test03__이름3()  { /* 생략 */ }
}
```


# @FixMethodOrder(옵션)
옵션은 아래와 같습니다.
- 공식문서 : http://junit.org/junit4/javadoc/latest/org/junit/runners/MethodSorters.html
MethodSorters.DEFAULT
- 기본값 -> 순서를 보장하지 않는다.
MethodSorters.JVM
- JVM이 반환하는 순서이나, 이 순서는 실행마다 다를 수 있다.
MethodSorters.NAME_ASCENDING
- 각 메소드의 이름 순으로 정렬