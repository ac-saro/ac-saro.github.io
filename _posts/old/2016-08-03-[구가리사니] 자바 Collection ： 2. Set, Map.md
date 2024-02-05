---
layout: post
tags: [가리사니, 기타]
---

> 이 문서는 예전 가리사니 사이트에서 작성된 문서 입니다.
현재 상황과 맞지 않을 수 있습니다.


# 자바 Collection 시리즈
- [1. List](/lab?topicId=294)
- [2. Set, Map](/lab?topicId=295)

# Map : 인터페이스
``` java
public interface Map<K,V>
```
[https://docs.oracle.com/javase/8/docs/api/java/util/Map.html
- 맵의 형태로 데이터를 저장한다.


# HashMap
``` java
public class HashMap<K,V> extends AbstractMap<K,V>
	implements Map<K,V>, Cloneable, Serializable
```
[https://docs.oracle.com/javase/8/docs/api/java/util/HashMap.html
- 대표적으로 많이 사용하는 MAP
- 키탐색시 데이터베이스의 해시조인과 유사한 방식으로 찾습니다.
(소스코드를 보니 Hash를 매칭 후 이퀄을 이용해 동일한지 확인합니다.)
- 아래와 같은 3가지 객체를 가지고있다.
- 쓰레드 안전을 위해 Collections.synchronizedMap를 사용할 수 있지만 쓰레드에 안전한 자료형을 쓰는것도 하나의 방법입니다.
``` java
Set<K> keySet;
Collection<V> values;
Set<Map.Entry<K,V>> entrySet
```

# WeakHashMap
``` java
public class WeakHashMap<K,V> extends AbstractMap<K,V>
	implements Map<K,V>
```
[https://docs.oracle.com/javase/8/docs/api/java/util/WeakHashMap.html
- 콜백에 대한 명시적 제거가 없는경우 HashMap 같은경우는 메모리 누수의 원인이 될수있습니다.
- WeakHashMap는 약한 참조로 이부분이 해결된 객체입니다.

# Hashtable : thread-safe
``` java
public class Hashtable<K,V> extends Dictionary<K,V>
	implements Map<K,V>, Cloneable, Serializable
```
[https://docs.oracle.com/javase/8/docs/api/java/util/Hashtable.html
- 쓰래드 안전이 보장된다.
- 다만 문서에서도 쓰레드안전과 높은 동시성을 원한다면 ConcurrentHashMap를 쓸 것을 권장하고 있다...

# ConcurrentHashMap : thread-safe
``` java
public class ConcurrentHashMap<K,V> extends AbstractMap<K,V>
	implements ConcurrentMap<K,V>, Serializable
```
[https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/ConcurrentHashMap.html
- 쓰레드에서 안전한 해시맵입니다.
- 다중 쓰래드에서 별도의 쓰레드 안전 처리없이 사용할 수 있습니다.
- 필자는 여러 쓰래드에서 HashMap에 접근해야하는 경우라면 이 클래스를 추천합니다.


# TreeMap
``` java
public class TreeMap<K,V> extends AbstractMap<K,V>
	implements NavigableMap<K,V>, Cloneable, Serializable
```
[https://docs.oracle.com/javase/8/docs/api/java/util/TreeMap.html
- 입력시 Entry 를 통해 key를 정렬하여 가지고 있습니다.


# Set : 인터페이스
``` java
public interface Set<E> extends Collection<E>
```
- List와 달리 순서를 보장하지 않으며, 중복을 허용하지 않음.
- 구현체로는 HashSet, LinkedHashSet, TreeSet 가 있다.
# HashSet
- 내부적으로 HashMap을 가지고 Key 탐색을 합니다.
- Key를 순서대로 보관하지 않습니다.
LinkedHashSet : 입력순서
- Key를 입력순서대로 보관합니다.
TreeSet  : 키의 정렬(Comparable) 순서
- 내부적으로 TreeMap을 가지고 Key 탐색을 합니다.
- 키를 트리노드로 정렬하여 가지고 있습니다.