---
layout: post
tags: [가리사니, 기타]
---

> 이 문서는 예전 가리사니 사이트에서 작성된 문서 입니다.
현재 상황과 맞지 않을 수 있습니다.


``` java
<dataConfig>
    <dataSource name="식별자" driver="드라이버" url="접속 프로토콜 주소" user="계정" password="암호"/>
    <document>
        <entity name="식별이름1" query="쿼리문">
			<field column="선택할 컬럼1" name="지정이름1" />
			<field column="선택할 컬럼2" name="지정이름2" />
			<field column="선택할 컬럼n" name="지정이름n" />
        </entity>
		<entity name="식별이름2" query="쿼리문 예) SELECT * FROM '테이블도 함수도 상관없음 반환하면 쿼리면됩니다.'(${dataimporter.request.id})">
			<field column="선택할 컬럼1" name="지정이름1" />
			<field column="선택할 컬럼2" name="지정이름2" />
			<field column="선택할 컬럼n" name="지정이름n" />
        </entity>
    </document>
</dataConfig>
// ${dataimporter.request.id} : 쿼리에서 줄만한 값
```

참고문서
[/lab?topicId=37](/lab?topicId=37)