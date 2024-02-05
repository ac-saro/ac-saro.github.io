---
layout: post
tags: [가리사니, 기타]
---

> 이 문서는 가리사니 개발자 포럼에 올렸던 글의 백업 파일입니다.
오래된 문서가 많아 현재 상황과 맞지 않을 수 있습니다.


약10년 전만해도 Statement, PreparedStatement, CallableStatement 의 속도에 대한 의견은 다음과 같았습니다.

Statement
- 단일일때 빠르다.
PreparedStatement, CallableStatement
- 연속적으로 써야 빠르다. (처음 생성할때 여러가지 준비된 작업을 하기에 연속적으로 쓰지않는경우 Statement보다 느리다)
- 약 60 번정도 연속적으로 써야 Statement 보다 빠르다.


몇년전부터 ORM 가 다양하게 쓰이면서, 제가 만든 라이브러리인 뫼의 새롭게 고칠점이 없는지 구글링을 하던 중 요즘은 단일로 쓰더라도 Statement와 PreparedStatement, CallableStatement사이의 속도차이가 나지 않기 때문에 인젝션을 하나하나 막을 생각이 없다면 연속적으로 부르지 않을 경우에도 PreparedStatement, CallableStatement를 쓰라고 나와있었습니다.

약 10년전쯤에 직접 테스트한 결과물을 문서화해 보관하고 있지않은 상태라 다시 실험을 해보기로 했습니다.

``` java
// JDK 8, pg-sql 9.4로 테스트하였습니다.

s = System.currentTimeMillis();
for (int i =  0 ; i < 1000 ; i++)
{
	rs = st.executeQuery("SELECT * FROM test WHERE tn = "+Integer.toString(i));
}
out.println("결과1 : " + (System.currentTimeMillis() - s));

s = System.currentTimeMillis();
PreparedStatement ps = conn.prepareStatement("SELECT * FROM test WHERE tn = ?");
for (int i =  0 ; i < 1000 ; i++)
{
	ps.setLong(1, i);
	rs =ps.executeQuery();
}
out.println("결과2 : " + (System.currentTimeMillis() - s));

s = System.currentTimeMillis();
CallableStatement cs = conn.prepareCall("SELECT * FROM test WHERE tn = ?");
for (int i =  0 ; i < 1000 ; i++)
{
	cs.setLong(1, i);
	rs =cs.executeQuery();
}
out.println("결과3 : " + (System.currentTimeMillis() - s));
```
결과1 : 159
결과2 : 87
결과3 : 86
역시 연속적인 사용에 있어서는 PreparedStatement, CallableStatement가 압도적으로 빠른 것을 확인할 수 있습니다.


## 그렇다면 이제 논란이 됐던 **비연속적인 사용**을 해보도록 하겠습니다.
``` java
// JDK 8, pg-sql 9.4로 테스트하였습니다.

s = System.currentTimeMillis();
for (int i =  0 ; i < 1000 ; i++)
{
	rs = st.executeQuery("SELECT * FROM test WHERE tn = "+Integer.toString(i));
}
out.println("결과1 : " + (System.currentTimeMillis() - s));

s = System.currentTimeMillis();
for (int i =  0 ; i < 1000 ; i++)
{
	PreparedStatement ps = conn.prepareStatement("SELECT * FROM test WHERE tn = ?"); // 비 연속적 사용을 위해 매번 생성
	ps.setLong(1, i);
	rs =ps.executeQuery();
}
out.println("결과2 : " + (System.currentTimeMillis() - s));

s = System.currentTimeMillis();
for (int i =  0 ; i < 1000 ; i++)
{
	CallableStatement cs = conn.prepareCall("SELECT * FROM test WHERE tn = ?"); // 비 연속적 사용을 위해 매번 생성
	cs.setLong(1, i);
	rs =cs.executeQuery();
}
out.println("결과3 : " + (System.currentTimeMillis() - s));
```
결과1 : 161
결과2 : 163
결과3 : 172
이정도는 측정 오차치 정도밖에 되지않음으로 매번 PreparedStatement, CallableStatement를 불러서 사용하더라도 크게 차이가 없습니다.


## 결론
현재(2015년)에선 더 빠른 속도로 매번 다른 구문을 실행하기위해 PreparedStatement, CallableStatement 대신 Statement를 쓸 필요가 없어졌습니다.
다만 예제에서도 볼수있듯 PreparedStatement, CallableStatement로 속도적 이득을 보기위해선 파라미터값만 다른 구문을 연속적으로 실행해야합니다.
예를들어 https://gs.saro.me 의 게시판 메인부분을 스테틱 CallableStatement로 만들어 매번 재사용하는 것 처럼 사용하시면 속도적 이득이 있지만,
매번 불러 사용하게될경우 Statement 보다 빠르지 않다는것은 10년전과 동일합니다.
매번 SQL 인젝션을 처리해주는것이 부담스러운 사람은 무조건 PreparedStatement, CallableStatement을 사용해주시는 것이 좋습니다.
인젝션 처리가 부담스럽지 않은 사람들도 PreparedStatement, CallableStatement를 쓰는것이 Statement를 쓰는것과 별반 차이가 없습니다.


추신
사로 - 뫼 프레임워크.... 대대적으로 손봐야겠네요.... 하하하하...;;;