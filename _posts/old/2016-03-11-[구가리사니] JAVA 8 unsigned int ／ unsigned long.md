---
layout: post
tags: [가리사니, 기타]
---

> 이 문서는 예전 가리사니 사이트에서 작성된 문서 입니다.
현재 상황과 맞지 않을 수 있습니다.


# 원래 자바엔 언사인드가 없었습니다.
자바의 창시자인 고슬링이 언사인드는 어려운 개념이기 때문에 프로그래밍을 복잡하게 한다고 생각했습니다.
(그래서 자바에 넣지 않기로 한 것 같습니다.)
원문 : http://www.gotw.ca/publications/c_family_interview.htm
Gosling: For me as a language designer, which I don't really count myself as these days, what "simple" really ended up meaning was could I expect J. Random Developer to hold the spec in his head. That definition says that, for instance, Java isn't -- and in fact a lot of these languages end up with a lot of corner cases, things that nobody really understands. Quiz any C developer about unsigned, and pretty soon you discover that almost no C developers actually understand what goes on with unsigned, what unsigned arithmetic is. Things like that made C complex. The language part of Java is, I think, pretty simple. The libraries you have to look up.
(물론 자바에서 언사인드가 아예 없는 것은 아니고 비공식적이지만 char이 unsigned short 입니다. : 찾다 보면 왜 char은 unsigned short 인지에 대한 내용도 있습니다.)


# 자바는 8 버전부터 많은 변화가 일어납니다.
자바에는 엄청난 변화가 불었습니다. (개인적인 생각으로는 언사인드와 다중상속을 반대했던.. 고슬링이 떠나서 그런 것이 아닐까 생각됩니다.)
그래서 자바에 언사인드와 다중상속(인터페이스 디폴트)이 등장하게 된 것이죠.
하지만... 자바에선 원래부터 없던 기능 이여서 그런지 상당히 복잡하게 넣어버렸습니다...
ubyte, ushort, uint, ulong 로만들어주면 안되나요? ㅠㅠ
심지어 byte, short 는 공식적으로 아직까지도 언사인드가 없습니다....


# unsigned 개념이해!!
어떻게 사용하냐에 대한 설명에 앞서 unsigned 를 알아야 할 것 같아 설명을 하겠습니다.
우선 char이 unsigned short 인 것을 설명하겠습니다.
``` java
char c = (char)-1;
System.out.println((int)c);
short s = -1;
System.out.println((int)s);
// short에서 (int)는 의미 없습니다.
// 다만 char과 실험조건을 같게 하기 위해서 넣은 것 뿐입니다.
```
결과
65535 // 언더플로우 발생 최대값 (언사인드)
-1 // 사인드
아하! char 은 unsigned short 라는 것을 알겠는데!! 그럼?? s와 c에 저장된 값은 다른 값인가요?
아닙니다. 같은 값입니다.
``` java
char c = (char)-1;
System.out.println( "0B" + Integer.toString(c, 2) ); // 이진법으로 표시
short s = -1;
System.out.println( "0B" + Integer.toString(Short.toUnsignedInt(s), 2) ); // 이진법으로 표시
```
결과
0B1111111111111111
0B1111111111111111
-1 의 2의 보수는 1....1111111 이 됩니다.
즉 signed의 -1은 unsigned 관점에서 보면 최대값이 되는 겁니다.!!
문명 시리즈에서 간디가 폭력적인 이유가.. 문명 1의 간디의 공격력은 1이 였고 민주주의를 선택하면 공격력이 -2가 되기 때문, 1바이트 unsigned로 지정되어있던 공격력이 255가 되버리고... 그 후 이것은 오마주가 되어.... 그는 전설이...  http://www.geek.com/games/why-gandhi-is-always-a-warmongering-jerk-in-civilization-1608515/ (그만해!!)


# unsigned 를 만들어보자
``` java
int i = Integer.parseUnsignedInt("4294967295");
long l = Long.parseUnsignedLong("18446744073709551615");

System.out.println("i의 값");
System.out.println(i);
System.out.println(Integer.toUnsignedString(i));
System.out.println(Integer.toUnsignedString(i, 2)); // 2진법

System.out.println("l의 값");
System.out.println(l);
System.out.println(Long.toUnsignedString(l));
System.out.println(Long.toUnsignedString(l, 2)); // 2진법
```
결과
i의 값
-1
4294967295
11111111111111111111111111111111
l의 값
-1
18446744073709551615
1111111111111111111111111111111111111111111111111111111111111111


# unsigned 사칙연산?
언사인드를 만들어봤지만 (만드는거 참 너무 어렵다.. 궁시렁... 궁시렁...) 어떻게 연산해야 할지 감이 오지않는다.!!!!
처음 unsigned 개념이해!! 와 간디드립을 눈여겨봤다면 벌써 눈치채셨을 것입니다.
``` java
int i = Integer.parseUnsignedInt("4294967295");

System.out.println(Integer.toUnsignedString(i));

// 덧셈 / 뺄셈 / 곱셈 그냥하더라도 문제가 없다.!!!
i -= 67295;
System.out.println(Integer.toUnsignedString(i));

i += 400;
System.out.println(Integer.toUnsignedString(i));

i = 294967295;
i *= 28;
System.out.println(Integer.toUnsignedString(i));

// 하지만 나눗셈은!!
i = -1; // -1 == Integer.parseUnsignedInt("4294967295");
i /= 2;
System.out.println(Integer.toUnsignedString(i));
```
결과
4294967295
4294900000
4294900400
3964116964
0


# 그래서 자바에서는 3가지를 따로 지원해줍니다.
divideUnsigned 나누기
remainderUnsigned 나머지
compareUnsigned 비교연산
``` java
int i, j;

// 오류!!
i = -1;
i /= 2;
System.out.println(Integer.toUnsignedString(i));

// 대책
i = -1;
i = Integer.divideUnsigned(i, 2); // 나눗셈
System.out.println(Integer.toUnsignedString(i));

i = -1;
i = Integer.remainderUnsigned(i, 30); // 나머지
System.out.println(Integer.toUnsignedString(i));

// 비교연산자 (정렬을 해보신분이라면 compare는 익숙하실 겁니다.)
j = Integer.compareUnsigned(-1, 99999);
System.out.println(j);

// 평소에는?
j = Integer.compare(-1, 99999);
System.out.println(j);
```
결과
0
2147483647
15
1
-1


# 결론!
자바도 특별한 일이 없으면 쓰지 않는 것을 추천하는 것 같습니다.
주로 네트워크 프로그래밍처럼 다른 언어랑 교신하거나 어떠한 이유로 언사인드를 써야 할 때가 아닌 이상, 그냥 int라면 long을 쓰고.. long이라면.... (그만....;;) 음..;;
그렇습니다.!!??
결론은 방금 말한 것 처럼 자바 8에서 가능은 하지만, 네트워크 통신같이 특수한 경우가 아니라면 사용을 자제하는 것이 좋을 것 같습니다.