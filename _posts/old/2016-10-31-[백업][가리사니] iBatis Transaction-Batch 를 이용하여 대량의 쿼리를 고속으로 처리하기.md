---
layout: post
tags: [spring, java]
---

> 이 문서는 가리사니 개발자 포럼에 올렸던 글의 백업 파일입니다.
오래된 문서가 많아 현재 상황과 맞지 않을 수 있습니다.


필자는 아이바티스를 좋아하지 않고.. (아주 잠깐 마이바티스를 설정 후 실습해 본 것 빼고 써보지도 않았습니다.)
이 글을 쓸 일이 없다고 생각했는데 어쩌다보니...
아이바티스를 사용하는 프로젝트를 맡게 되었습니다.


그래서 처음엔 이렇게 짰습니다..
- 물론 회사에서는 K&R 스타일로 짭니다.
``` java
@Transactional
public boolean 함수명() throws Exception
{
	인설트();

	// 약 2000 여개
	for (모델 : 리스트)
	{
		인설트();
	}
}
```
겨우 2000 개를 insert 하는데 10초 정도 걸리는.. 심각한 속도가 나옵니다.
인터넷을 찾아보니 sql 매핑부분에에 list를 입력받아 처리하는 방법부터 시작하여 여러가지가 나오지만...
그중 transaction과 batch 를 이용한 방법이 눈에 띄었습니다.
안드로이드 sqlite같은 경우 트랜잭션을 걸지 않으면 각 명령마다 트랜잭션이 걸리기 때문에 트랜잭션 범위를 설정해줌으로써 대량작업에 대한 속도를 향상시킬 수 있습니다.


# 아이바티스 Transaction-Batch 처리
- 자바 6 기준으로 작성하여 추억(?)의 기분을 느낄수 있습니다.
``` java
@Autowired
SqlMapClient sqlMapClient;

public boolean 함수명() throws Exception
{
	Exception error = null;

	try
	{
		sqlMapClient.startTransaction();
		sqlMapClient.startBatch();

		인설트();

		// 약 2000 여개
		for (모델 : 리스트)
		{
			인설트();
		}

		sqlMapClient.executeBatch();
		sqlMapClient.commitTransaction();
	}
	catch (Exception e)
	{
		error = e;
	}
	finally
	{
		sqlMapClient.endTransaction();
	}

	if (error != null)
	{
		throw error;
	}
}
```
결과 0.2 초
SQLITE 의 데자뷰..
이쯤되면 프리페이드를 쓴 것과 유사한 속도가 나오는 것 같습니다.


# 왜 빨라진 걸까?
참고주소 (공식문서) :
http://ibatis.apache.org/docs/java/dev/com/ibatis/sqlmap/client/SqlMapClient.html
http://ibatis.apache.org/docs/java/dev/com/ibatis/sqlmap/client/SqlMapTransactionManager.html
http://ibatis.apache.org/docs/java/dev/com/ibatis/sqlmap/engine/impl/SqlMapSessionImpl.html
Transaction
개인적 생각은 안드로이드의 sqlite와 같은 이유로 속도가 저하될 거라고 생각했는데, 문서에 나와있지 않아 트랜잭션과 속도의 상관관계는 잘 모르겠습니다.
(하지만 속도 향상을 떠나서 변경[삽입/삭제/갱신]이 2개 이상 있다면 범위 트랜잭션은 선택이 아니라 강제입니다.!! : 데이터 불일치! -> 롤백!!!!!)
Batch
다행이도 public void startBatch() 에 속도에 관련된 주요한 내용이 있습니다.
- http://ibatis.apache.org/docs/java/dev/com/ibatis/sqlmap/engine/impl/SqlMapSessionImpl.html#startBatch()
데이터베이스에 보내기전 캐싱해두었다가 한번에 보내는 것 같습니다.
그래서 문서에도 나와있듯 1:N 즉, 대량작업일 때 속도 향상의 효과가 있다고 하는 것 같습니다.
마치 PreparedStatement를 연상시킵니다.  (아마 내부적으로 사용할 듯 합니다.)
- [/lab?topicId=101](/lab?topicId=101)