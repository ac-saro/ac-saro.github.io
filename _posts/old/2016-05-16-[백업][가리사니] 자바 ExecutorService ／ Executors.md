---
layout: post
tags: [가리사니, 기타]
---

> 이 문서는 가리사니 개발자 포럼에 올렸던 글의 백업 파일입니다.
오래된 문서가 많아 현재 상황과 맞지 않을 수 있습니다.


뭐라도 강의를 올려보고자 !! 오늘도 끄적여보겠습니다.

오늘 주제는 ExecutorService / Executors 입니다.
이펙티브 자바등을 보면 Thread 보다 제어가 가능한 Executors 를 쓰는 것을 권장하고 있습니다.

선언은 아래처럼 하면됩니다.
``` java
// 5개의 병렬쓰래드
ExecutorService executor = Executors.newFixedThreadPool(5);
```
참 단순하죠.. 사실 자바는 쓰래드도 워낙 단순해서..

그럼 newFixedThreadPool / newSingleThreadExecutor 를 알아보겠습니다.


# Executors.newSingleThreadExecutor()
- 단일 쓰래드 쓰래드를 하나씩 실행합니다.
``` java
private static ExecutorService executor = Executors.newSingleThreadExecutor();

public static void main(String[] args) throws Exception
{
	System.out.println("준비");

	executor.submit(new Runnable() {@Override public void run()
	{
		for (int i = 0 ; i < 10 ; i++)
		{
			try { Thread.sleep(1000); } catch (InterruptedException e) { e.printStackTrace(); }
			System.out.println("1번쓰래드 : " + i);
		}
	}});

	System.out.println("1번쓰래드 submit");

	executor.submit(new Runnable() {@Override public void run()
	{
		for (int i = 0 ; i < 10 ; i++)
		{
			try { Thread.sleep(1000); } catch (InterruptedException e) { e.printStackTrace(); }
			System.out.println("2번쓰래드 : " + i);
		}
	}});

	System.out.println("2번쓰래드 submit");
}
```
위와 같은 코드의 경우 아래와 같은 결과가 나오게됩니다.
준비
1번쓰래드 submit
2번쓰래드 submit
1번쓰래드 : 0
1번쓰래드 : 1
1번쓰래드 : 2
1번쓰래드 : 3
1번쓰래드 : 4
1번쓰래드 : 5
1번쓰래드 : 6
1번쓰래드 : 7
1번쓰래드 : 8
1번쓰래드 : 9
2번쓰래드 : 0
2번쓰래드 : 1
2번쓰래드 : 2
2번쓰래드 : 3
2번쓰래드 : 4
2번쓰래드 : 5
2번쓰래드 : 6
2번쓰래드 : 7
2번쓰래드 : 8
2번쓰래드 : 9
하나의 쓰래드씩 순차적으로 실행된 것을 볼 수 있습니다.
하지만 여러개를 동시에 돌리고 싶다면?


# Executors.newFixedThreadPool()
``` java
// 5개의 쓰래드가 동시에 돌아갑니다.
private static ExecutorService executor = Executors.newFixedThreadPool(5);

public static void main(String[] args) throws Exception
{
	System.out.println("준비");

	executor.submit(new Runnable() {@Override public void run()
	{
		for (int i = 0 ; i < 10 ; i++)
		{
			try { Thread.sleep(1000); } catch (InterruptedException e) { e.printStackTrace(); }
			System.out.println("1번쓰래드 : " + i);
		}
	}});

	System.out.println("1번쓰래드 submit");

	executor.submit(new Runnable() {@Override public void run()
	{
		for (int i = 0 ; i < 10 ; i++)
		{
			try { Thread.sleep(1000); } catch (InterruptedException e) { e.printStackTrace(); }
			System.out.println("2번쓰래드 : " + i);
		}
	}});

	System.out.println("2번쓰래드 submit");
}
```
결과는!
준비
1번쓰래드 submit
2번쓰래드 submit
1번쓰래드 : 0
2번쓰래드 : 0
1번쓰래드 : 1
2번쓰래드 : 1
1번쓰래드 : 2
2번쓰래드 : 2
1번쓰래드 : 3
2번쓰래드 : 3
1번쓰래드 : 4
2번쓰래드 : 4
1번쓰래드 : 5
2번쓰래드 : 5
1번쓰래드 : 6
2번쓰래드 : 6
1번쓰래드 : 7
2번쓰래드 : 7
1번쓰래드 : 8
2번쓰래드 : 8
1번쓰래드 : 9
2번쓰래드 : 9