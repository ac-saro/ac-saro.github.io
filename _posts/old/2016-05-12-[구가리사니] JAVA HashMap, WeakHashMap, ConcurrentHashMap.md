---
layout: post
tags: [가리사니, 기타]
---

> 이 문서는 예전 가리사니 사이트에서 작성된 문서 입니다.
현재 상황과 맞지 않을 수 있습니다.


HashMap, WeakHashMap 의 사용 용도에 대해서 알아봅시다.

# 공통점
KEY / VALUE 를 한쌍으로 사용할 수 있는 해시맵

# HashMap
- https://docs.oracle.com/javase/8/docs/api/java/util/HashMap.html
- 일반적으로 사용하는 매서드이지만 특수 목적이 있다면 아래두가지를 참조해보자.
- HashMap / ConcurrentHashMap 는 사용후에 그대로 두면 메모리 누수의 원인이 된다.

# ConcurrentHashMap
- http://docs.oracle.com/javase/8/docs/api/java/util/concurrent/ConcurrentHashMap.html
- 쓰래드에서 사용하더라도 안전하다 Thread-Safe
- compute 메서드 사용시 돈의 입출금 같은 것을 할 때 쓰래드를 신경쓰지않아도 메서드가 끝날때까지 동시에 접근이 불가능하다.
- 위 장점으로 인해 NULL 값일 때 별도처리라던지 여러가지 연산들은 쓰래드 예외처리 없이 할 수 있다.

# WeakHashMap
- https://docs.oracle.com/javase/8/docs/api/java/util/WeakHashMap.html
- 따로 관리를 하지 않아도 GC가 사용하지 않으면 회수해간다.
- 즉, 메모리 누수에 대한 걱정이 없다.
- 위 장점으로 인해 데이터가 안전하게 보존될 수 없는 단점이 생긴다.
- 값의 유지가 안전하지 않아도 상관없거나 잠깐 쓰고 더이상 쓰지 않는경우 유용하다.