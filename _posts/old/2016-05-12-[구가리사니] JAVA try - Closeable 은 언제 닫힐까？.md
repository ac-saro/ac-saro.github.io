---
layout: post
tags: [가리사니, 기타]
---

> 이 문서는 예전 가리사니 사이트에서 작성된 문서 입니다.
현재 상황과 맞지 않을 수 있습니다.


자바 7에서 추가된 문법으로 try - Closeable 이 있습니다.
~~필자는 이걸 정말로 좋아합니다...;;;;; 자바7에서 처음 나왔을때 만세를 불렀죠..~~


# try - Closeable 는 아래와 같이 사용할 수 있습니다.
- Closeable 을 implements 받은 객체라면 해당 공간이 종료시에 close() 함수를 불러주는 역활을 합니다.
``` java
// 단일
try (TestClose tc = new TestClose()) {}
catch (Exception e) {}
// 여러개일때는 ; 로 구분합니다.
try (TestClose tc1 = new TestClose() ; TestClose tc2 = new TestClose()) {}
catch (Exception e) {}
```


# 여기서 드는 의문은 두가지입니다.
1. close 는 언제 불리는 것일까?
2. catch에서 다시 throw 할때 close 는 안전하게 불리는가?


# close 는 언제 불리는 것일까?
``` java
public static void main(String[] args) throws Exception
{
	try (TestClose tc = new TestClose())
	{
		System.out.println("try body done");
	}
	catch (Exception e)
	{
		System.out.println("exception !!!");
	}
	System.out.println("done");
}

public static class TestClose implements Closeable
{
	@Override
	public void close() throws IOException
	{
		System.out.println("call close");
	}
}
```
결과
try body done
call close (당연히 try body 가 모두 종료된 후 불렸다)
done
예외가 발생한다면!
``` java
try (TestClose tc = new TestClose())
{
	System.out.println("try body start");

	// 0 으로 나누기 throw new 를 사용할 경우 뒤에 done를 넣을 수 없기 때문에 이렇게 사용함.
	int a = 1 / 0;

	System.out.println("try body done");
}
catch (Exception e)
{
	System.out.println("exception !!!");
}
System.out.println("done");
```
의미는 없지만 System.out.println("try body done"); 를 보여주기위해 0나누기로 오류를 내보았다.
결과
try body start
call close 다행이다 catch 이전에 불렸다!
exception !!!
done


# catch에서 다시 throw 할때 close 는 안전하게 불리는가?
위 실험에서 **catch 되기전 close가 불렸음으로 이 실험은 의미가 없**지만 그래도 해보겠습니다.
코드를 짜다보면 catch로 받지만 다시 throw 를 해주는 경우는 아주 흔한일이다.
``` java
try (TestClose tc = new TestClose())
{
	throw new Exception("throw new Excpetion !!!");
}
catch (Exception e)
{
	System.out.println("Exception !!!");
	throw e;
}
```
결과
call close 예상대로 catch 이전에 불렸다!
Exception !!!
Exception in thread "main" java.lang.Exception: throw new Excpetion !!!


# 결론
 try - Closeable 을 사용할 경우.
 try 영역
├ exception 발생시 -> close() -> catch (즉 여기서 다시 throw 를 써도 안전하다.)
└ 일반적으로 바디가 종료된경우 -> close()
즉, try (Closeable) 을 사용할때 catch에서 다시 throw 해줄 경우 혹시나 하는 걱정을 해주지 않아도 된다.