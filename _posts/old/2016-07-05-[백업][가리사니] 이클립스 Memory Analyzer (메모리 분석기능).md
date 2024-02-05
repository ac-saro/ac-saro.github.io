---
layout: post
tags: [eclipse, android, java]
---

> 이 문서는 가리사니 개발자 포럼에 올렸던 글의 백업 파일입니다.
오래된 문서가 많아 현재 상황과 맞지 않을 수 있습니다.


# Memory Analyzer
hprof 파일을 분석해서 메모리 분석, 통계를 내는 기능입니다.
이클립스 Memory Analyzer
- http://www.eclipse.org/mat/downloads.php
- http://wiki.eclipse.org/MemoryAnalyzer/FAQ
HPROF
- http://docs.oracle.com/javase/8/docs/technotes/samples/hprof.html


# 설치
1. 이클립스 열기
2. Help -> install new software
3. <버전> - http://download.eclipse.org/releases/<버전> 선택
4. "memory" 검색
5. Memory Analyzer, Memory Analyzer (Charts) 체크 후 설치


# 아웃 오브 메모리 예제
- 튜토리얼 참고 : http://www.vogella.com/tutorials/EclipseMemoryAnalyzer/article.html
``` java
public static void main(String[] args) throws Exception
{
	List<String> list = new ArrayList<String>();
	while (1 < 2)
	{
		list.add("OutOfMemoryError soon");
	}
}
```
java 실행 vm 옵션으로 아래와 같이 줍니다.
(순서대로 아웃오브 메모리시 힙덤프, 시작메모리 10mb, 최대메모리 20mb)
``` java
-XX:+HeapDumpOnOutOfMemoryError
-Xms10m
-Xmx20m
```
다들 아시겠지만 java <옵션> 같이 쓸수있고 이클립스에서 사용할 때에는
Run Configurations -> Arguments 탭 -> VM Arguments  에 위 옵션을 복사합니다.
실행 결과
java.lang.OutOfMemoryError: Java heap space
Dumping heap to java_pid10820.hprof ...
Heap dump file created [15829270 bytes in 0.025 secs]
Exception in thread "main" java.lang.OutOfMemoryError: Java heap space
	at java.util.Arrays.copyOf(Unknown Source)
	at java.util.Arrays.copyOf(Unknown Source)
	at java.util.ArrayList.grow(Unknown Source)
	at java.util.ArrayList.ensureExplicitCapacity(Unknown Source)
	at java.util.ArrayList.ensureCapacityInternal(Unknown Source)
	at java.util.ArrayList.add(Unknown Source)
	at test.Mat.main(Mat.java:<위치>)
위 결과처럼 java_pid<PID번호>.hprof 파일이 생성 되었을 겁니다.


# 분석기
1. Open Perspective 선택
![](/file/old/133.png)
2. Memory Analyzer 선택
3. File -> Open Heap Dump... -> 생성된 java_pid<PID번호>.hprof 파일선택
![](/file/old/134.png)
또한 Dominator Tree나 Leak Suspects 등의 유용한 기능들을 제공합니다.


# 안드로이드
인텔리j 기반의 현재 안드로이드 스튜디오는 각종 분석도구와 hprof분석 기능을 제공하여 메모리를 분석할 수 있습니다.
굳이 hprof 파일을 MAT로 분석하고 싶다면 "안드로이드SDK경로/platform-tools/hprof-conv 안드로이드.hprof 분석용.hprof" 로 컨버팅하여 볼수있습니다.
아래 동영상에는 두가지 방법 모두가 나와있습니다.
@[Youtube eoUwnKZR6cw]