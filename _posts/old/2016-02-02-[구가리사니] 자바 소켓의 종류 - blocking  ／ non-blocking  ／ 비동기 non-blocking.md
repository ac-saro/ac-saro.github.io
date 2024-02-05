---
layout: post
tags: [가리사니, 기타]
---

> 이 문서는 예전 가리사니 사이트에서 작성된 문서 입니다.
현재 상황과 맞지 않을 수 있습니다.

# 소켓 / ByteBuffer
- [자바 소켓의 종류 : blocking / non-blocking / 비동기 non-blocking](/lab?topicId=175)
- [자바 ByteBuffer 란?](/lab?topicId=176)

# 자바에서의 소켓 구현방법
## 1. 일반적인 소켓 : blocking + Thread
 일반적으로 소켓을 배울 때 처음 접하는 방식으로 **blocking** 방식이라고 합니다.
 **blocking + Thread** 라고 쓴 이유는 1:1 접속이 아닌 이상 서버는 accept이 있을 때 마다 새로운 Thread를 생성해야합니다. (아래 두가지의 방식도 Thread를 적절히 분배하여 사용하지만 blocking 방식의 경우는 필수이기 때문에 강조하였습니다.)
 구현이 매우 쉽다는 장점이 있지만... 접속자가 1000명쯤 된다면 read 상태에서 blocking이 걸려 있더라도 cpu는 시분할 처리를 하면서 1000개의 read 상태의 Thread를 아무 의미없이 돌게(CPU 컨텍스트 스위칭) 됩니다.
 즉 사람이 많아질 경우 극악의 방식이 됩니다.
 다만 개발 시간이 단축되는 장점이 있기 때문에 소수의 사람이 접속하는 시스템을 만들 때 도움이 됩니다.

## 2. non-blocking 방식
 java.nio.channels 에 있는 SocketChannel 등을 이용하여 만드는 방식입니다. nio 는 non-blocking IO의 약자로 accept이나 read등이 blocking 되지않고 그냥 지나가는 방식입니다. 때문에 여러 접속자가 있어도 하나의 Thread로 일괄적으로 read가 가능합니다. 다만 while 문을 통과하는 read나 accept으로 인해 접속자가 없더라도 CPU 점유율이 매우 많이 올라가게 되고 이를 제어하기 위해 sleep 등을 쓰게 된다면 그만큼 효율성이 떨어지게 됩니다.
 난이도도 어려우며 접속자가 별로 없을 경우 오히려 효율이 떨어질 수 있습니다.

## 3. 비동기 non-blocking 방식
java.nio.channels 에 있는 AsynchronousSocketChannel 등을 이용하여 만드는 방식입니다.
CompletionHandler을 이용하여 콜백을 받을 수 있습니다. 즉 non-blocking처럼 while 으로 받는 형식이 아니기 때문에(그렇게 받을 수도 있긴 하지만, 그럴경우 위 논blocking 방식도 가능합니다.) CPU점유율을 직접 저어해야 하는 단점이 줄어듭니다.
다만 이 방식은 **운영체제의 시스템콜**을 부르는 방식이기 때문에 코딩을 잘못 할 경우 블루스크린등.. 심각한 오류가 날 확률이 있습니다. 아마 윈도우의 경우는 IOCP를 이용하여 구현된 객체가 아닐까 추측해봅니다.
기본값으로 사용할 경우 운영체제 기본값 Thread 갯수만큼 생성하게 됩니다.
때문에 단일 Thread를 테스트 하고싶으신분은.
``` java
AsynchronousChannelGroup asynchronousChannelGroup = AsynchronousChannelGroup.withFixedThreadPool(1, Executors.defaultThreadFactory());
asynchronousServerSocketChannel = AsynchronousServerSocketChannel.open(asynchronousChannelGroup);
```
위와 같이 오픈하셔야합니다.
``` java
System.out.println("TID : " + Thread.currentThread().getId());
```
위와 같이 현재 Thread번호를 테스트 해보시기 바랍니다.