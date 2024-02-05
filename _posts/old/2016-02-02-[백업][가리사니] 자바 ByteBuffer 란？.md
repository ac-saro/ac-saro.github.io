---
layout: post
tags: [가리사니, 기타]
---

> 이 문서는 가리사니 개발자 포럼에 올렸던 글의 백업 파일입니다.
오래된 문서가 많아 현재 상황과 맞지 않을 수 있습니다.

# 소켓 / ByteBuffer
- [자바 소켓의 종류 : 블록킹 / 논블로킹 / 비동기 논블로킹](/lab?topicId=175)
- [자바 ByteBuffer 란?](/lab?topicId=176)

# 초기화
``` java
// ByteBuffer 의 위치는 java.nio.ByteBuffer 입니다.
int capacity = 1024;
ByteBuffer buffer1 = ByteBuffer.allocate(capacity);
ByteBuffer buffer2 = ByteBuffer.allocateDirect(capacity);
```
# allocate 와 allocateDirect 는 무슨 차이일까?
allocate 는 자바에서 주로 쓰이는 일반적인 할당입니다.
allocateDirect 같은 경우는 자바의 힙이 아닌 외부(운영체제 시스템)의 할당을 하게 됩니다.
때문에 운영체제 시스템을 이용하는 입출력 (소켓통신의 read / write 등..)에서 중간 개체를 거치지 않아 속도적 이득이 있는 반면, 일반적인 가비지 컬렉터 밖의 범위에 있으며, 할당과 해제시 한 단계 더 거치기 때문에 이러한 동작의 속도는 감소합니다.
자바 문서에서는 운영체제 시스템을 이용하는 입출력이며 할당과 해제가 잘 일어나지 않는 부분에 allocateDirect 를 사용하라고 권고하고 있습니다.
 생성된 객체가 다이렉트인지 아닌지 알기 위해서는 isDirect 를 사용하면 됩니다.
``` java
if (buffer2.isDirect())
{
	// allocateDirect 로 생성된 객체입니다.
}
```

# 주요 포인터 / 반환함수
int capacity ()
- 전체 크기입니다. 처음 allocate / allocateDirect 에 할당된 크기를 반환합니다.
- 이 값은 객체가 소멸할때까지 변하지 않습니다.

int position()
 - 포인터의 시작 포지션 입니다, 첫 생성값은 0 입니다.

int limit()
 - 포인터의 끝, 첫 생생값은 capacity() 와 동일합니다.
``` java
ByteBuffer buf = ByteBuffer.allocate(100);
System.out.println("처음생성");
System.out.println(buf.capacity());
System.out.println(buf.limit());
System.out.println(buf.position());

buf.flip();
System.out.println("flip!!");
System.out.println(buf.capacity());
System.out.println(buf.limit());
System.out.println(buf.position());

/** 출력값
처음생성
100
100
0
flip!!
100
0
0
*/
```

# 주요 메서드
엄밀히 말하면 java.nio.Buffer 의 주요 메서드이지만, java.nio.ByteBuffer 는 java.nio.Buffer 를 상속하고있습니다.
## java.nio.Buffer 주요 메서드
Buffer			clear ()
 - 말그대로 초기화 합니다. 포지션을 0으로 설정.

Buffer			flip ()
 - 포지션을 0 으로 설정하고, 리미트를 현재 내용의 마지막 위치로 압축시킵니다.

boolean		hasRemaining ()
 - 포지션과 리미트가 같지 않은지 확인합니다. (버퍼내 내용이 있으면 true)

Buffer			rewind ()
 - 포지션은 맨 처음으로 초기화합니다. (포지션이 0이 아닐 때 다시 0으로 위치시킵니다.)

## java.nio.ByteBuffer 주요 메서드
abstract ByteBuffer		compact ()
 - 포지션과 리미트를 앞당기고 다음 포지션과 리미트를 설정합니다. (설명이 어렵기 때문에 아래 예제를 보세요!)

static ByteBuffer			wrap (byte [] array)
 - byte []를 ByteBuffer로 만듭니다.
 - 만들어진 ByteBuffer는 byte []에 의존하게 되며 capacity, limit는 byte []의 사이즈와 같습니다.

``` java
public static void main(String[] args)
{
	ByteBuffer buf = ByteBuffer.allocate(30);
	System.out.println("쓰기");
	log(buf);
	buf.put("1234".getBytes());
	log(buf);
	buf.put("5678".getBytes());
	log(buf);
	buf.clear();
	log(buf);
	buf.put("9012".getBytes());
	log(buf);
	buf.compact();
	log(buf);
	System.out.println("다시 쓰기");
	buf.clear();
	buf.put("3456".getBytes());
	log(buf);
	System.out.println("읽기 모드");
	buf.flip();
	log(buf);
	String msg = new String(buf.array(), buf.position(), buf.limit());
	System.out.println("마지막 메시지는 ["+msg+"]!!");
}

public static void log(ByteBuffer buf)
{
	System.out.println(buf.position() + " ~ " + buf.limit() + " [" + new String(buf.array()) + "]");
}
/** 출력값 [설명포함]
쓰기
0 ~ 30 [                              ] : 처음생성됨
4 ~ 30 [1234                          ] : buf.put("1234".getBytes());
8 ~ 30 [12345678                      ] : buf.put("5678".getBytes());
0 ~ 30 [12345678                      ] : buf.clear(); // 글자는 그대로! 정확히 포지션/리미트를 클리어 하는 겁니다.
4 ~ 30 [90125678                      ] : buf.put("9012".getBytes()); // 포지션이 클리어 되었으니 0부터 다시 쓰기를 합니다.
26 ~ 30 [5678                          ] : buf.compact();
							// 그전 4 ~ 30 이선택된 상태! 그렇다면 현재 4~30까지가 선택된 상태가 됩니다.
							// 4 ~ 30을 앞당기면 0 ~ 26 이되며 다음 위치를 선택하기 때문에 26 ~ 30 이 됩니다.
다시 쓰기
4 ~ 30 [3456                          ] : buf.clear(); buf.put("3456".getBytes()); // 포인터 위치를 초기화 한 후 다시 글자를 씁니다.
읽기 모드
0 ~ 4 [3456                          ] : buf.flip(); 리미트를 마지막 포지션으로 포지션을 0으로 바꿈으로써 마지막으로 썼던 버퍼를 읽기 좋은 위치로 세팅합니다.
마지막 메시지는 [3456]!! : buf.flip(); 이 없었다면 마지막 메시지는 [                          ] 가 리드되었을겁니다.
*/
```