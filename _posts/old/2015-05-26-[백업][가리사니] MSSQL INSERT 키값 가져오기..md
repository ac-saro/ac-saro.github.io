---
layout: post
tags: [가리사니, 기타]
---

> 이 문서는 가리사니 개발자 포럼에 올렸던 글의 백업 파일입니다.
오래된 문서가 많아 현재 상황과 맞지 않을 수 있습니다.


SCOPE_IDENTITY() 를 사용할경우 마지막으로 insert 된 키값을 가져옵니다.

하지만 이건 정말 마지막 하나만 가져오기 때문에 대량으로 insert한 경우에는 또 다른 방법을 사용합니다.

``` sql
DECLARE @임시테이블 TABLE (키값 INT); -- 보통 가져올열

INSERT INTO 테이블명 (열1, 열2, 열3...)
OUTPUT Inserted.키값 INTO @임시테이블(키값)
-- 키값은 자동증가 값이 아닌 정말 INSERT 한 값이라면 선택된걸 가져올 수 있습니다.
SELECT (삽입할열1, 2, 3...) FROM ....
```

이렇게 INSERT ~ OUTPUT을 할 경우 다중 INSERT의 키값을 가져올 수 있습니다.