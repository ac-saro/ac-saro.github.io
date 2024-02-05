---
layout: post
tags: [가리사니, 기타]
---

> 이 문서는 예전 가리사니 사이트에서 작성된 문서 입니다.
현재 상황과 맞지 않을 수 있습니다.


# 자바 Collection 시리즈
- [1. List](/lab?topicId=294)
- [2. Set, Map](/lab?topicId=295)

# 서론
머리 속으로 알고있는 것 보다 문서를 작성해보는 것이 어떨까 생각하여 강의를 작성해 보았습니다.
사실.. 기초강의일 뿐이고, 다 알고 있었다고 생각했는데...
강의를 쓰면서 확실치 않은 부분이 좀 있었습니다.
문서를 봐도 애매한건 JDK 소스 보면서 썼습니다.
(다만, 문서에 나오지 않는 내용은 보증되지 않기 때문에, 참고용으로만 봤습니다.)


# 원시배열
원시배열은 이번 주제와 거리가 있지만 간단하게 설명하고 넘어갑니다.
- 필자는 **리스트와 햇갈리는 걸 방지하기 위해 원시배열이라는 용어를 사용**하였습니다.
[https://docs.oracle.com/javase/8/docs/api/java/util/Arrays.html
- 리스트가 아닌 원시적 형태의 배열!! (리스트가 아닙니다.)
- 고정길이로 선언하며 한번 선언한 크기를 변경할 수 없습니다.
- java.util.Arrays 에서 각종 유틸들을 지원합니다.
- Array계열리스트(연접리스트)등은 내부적으로 이 원시배열을 가지고 있다가 필요할때 재할당을 합니다.
``` java
// 선언
String[] array = new String;
// 배열 -> 리스트
List<String> list = Arrays.asList(array);
// 리스트 -> 배열
String[] array2 = list.toArray(new String[list.size()]);
```


# Vector : 연접리스트, thread-safe
``` java
public class Vector<E> extends AbstractList<E>
	implements List<E>, RandomAccess, Cloneable, Serializable
```
[https://docs.oracle.com/javase/8/docs/api/java/util/Vector.html
- 자바의 초창기 1.0 버전부터 있던 원년맴버?? 입니다.
- 연접 리스트인 동시에 쓰레드에 안전합니다.
- 하지만 쓰레드 세이프가 필요없는 경우 약간의 자원이 낭비됩니다.


# List : 인터페이스
Interface List<E> extends Collection<E>
[https://docs.oracle.com/javase/8/docs/api/java/util/List.html
- 위에서 볼 수 있듯 **인터페이스** 입니다.
- Collection을 상속하고 있고, 때문에 Arrays 아닌 java.util.Collections 을 통해 유틸이 제공됩니다.
[https://docs.oracle.com/javase/8/docs/api/java/util/Collections.html
- 또한 원시배열과 다르게 동적 증감이 가능합니다.
- 연접리스트들은 대부분(필자가 전체를 확인해보지 못했지만 봤을때 전부) capacity 설정을 통해 동적 생성의 단위를 지정해 줄 수 있습니다.

# ArrayList : 연접리스트
``` java
public class ArrayList<E> extends AbstractList<E>
	implements List<E>, RandomAccess, Cloneable, Serializable
```
[https://docs.oracle.com/javase/8/docs/api/java/util/ArrayList.html
- 백터와 유사하지만 (둘다 내부적으로 원시배열을 가지고있음) 쓰레드에 안전하지 않습니다.
- 쓰레드 안전 처리가 없기 때문에 Vector 보다 속도가 빠릅니다.
- 일반적으로 동적으로 할당되며, 쓰레드에 안전할 필요가 없을 때 주로 쓰입니다.

# LinkedList : 연결리스트
``` java
public class LinkedList<E> extends AbstractSequentialList<E>
	implements List<E>, Deque<E>, Cloneable, Serializable
```
[https://docs.oracle.com/javase/8/docs/api/java/util/LinkedList.html
- 내부적으로 Node 라는 클래스를 통해 머리와 꼬리를 연결시켜 연결리스트로 구현되어 있습니다.


# Queue, Deque : 인터페이스
``` java
public interface Queue<E> extends Collection<E>
```
[https://docs.oracle.com/javase/8/docs/api/java/util/Queue.html
``` java
public interface Deque<E> extends Queue<E>
```
[https://docs.oracle.com/javase/8/docs/api/java/util/Deque.html
- poll 계열의 메서드를 사용할 경우 삭제 후 반환
- peek 계열의 메서드를 사용할 경우 그대로 반환합니다.
연접리스트로 사용 예제
``` java
// ArrayDeque 는 Queue 정확히는 Deque를 상속받아 구현되어있다.
// 이런식으로 사용할 경우 구현체 ArrayDeque 에 따라 연접리스트로 활용가능.
// 짐작하겠지만 연접리스트로 큐/데큐를 구현하는것은 효율적인 방법이 아니다.
Queue<String> que = new ArrayDeque<>();
Deque<String> deq = new ArrayDeque<>();
```
연결리스트로 사용 예제
``` java
// 마찬가지로 LinkedList의 경우 Queue(Deque)를 상속받아 구현되어있다.
// 연결리스트 형태로 사용할 수 있다.
Queue<String> que = new LinkedList<>();
Deque<String> deq = new ArrayDeque<>();
```

# BlockingQueue, BlockingDeque : 인터페이스, 블로킹, thread-safe
``` java
public interface BlockingQueue<E> extends Queue<E>
```
[https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/BlockingQueue.html
``` java
public interface BlockingDeque<E> extends BlockingQueue<E>, Deque<E>
```
[https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/BlockingDeque.html
- 쓰레드에서 안전한 큐/데큐입니다.
- 연접 리스트는 Deque를 지원하지 않습니다.
- 필자도 정확한 이유가 적혀있는 공식문서는 찾지 못했지만, 연접리스트가 가변적으로 할당과 해제가 될때 큐/데큐는 비효율적이라서 인 것 같습니다.
- 당장 ArrayBlockingQueue 의 소스를 보더라도 내부적으로 순환큐를 구현해놓고 부족할대 재할당을 하고있습니다.
연접리스트로 사용 예제
``` java
BlockingQueue<String> que = new ArrayBlockingQueue<>(기본크기);
```
연결리스트로 사용 예제
``` java
BlockingQueue<String> que = new LinkedBlockingQueue<>();
BlockingDeque<String> deq = new LinkedBlockingDeque<>();
```

# ConcurrentLinkedQueue, ConcurrentLinkedDeque : 연결리스트, thread-safe
``` java
public class ConcurrentLinkedQueue<E> extends AbstractQueue<E>
	implements Queue<E>, Serializable
```
[https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/ConcurrentLinkedQueue.html
``` java
public class ConcurrentLinkedDeque<E> extends AbstractCollection<E>
	implements Deque<E>, Serializable
```
[https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/ConcurrentLinkedDeque.html
- 블록킹없는 쓰레드세이프 큐/데큐입니다.
- 사실 필자는 쓰레드 세이프가 필요한 큐/데큐를 만들때 이걸 이용합니다. (블로킹은 써보지 않음)
사용 예제
``` java
Queue<String> que = new ConcurrentLinkedQueue<>();
Deque<String> deq = new ConcurrentLinkedDeque<>();
```