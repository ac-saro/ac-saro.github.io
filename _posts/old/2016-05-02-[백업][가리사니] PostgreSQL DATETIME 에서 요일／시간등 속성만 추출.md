---
layout: post
tags: [가리사니, 기타]
---

> 이 문서는 가리사니 개발자 포럼에 올렸던 글의 백업 파일입니다.
오래된 문서가 많아 현재 상황과 맞지 않을 수 있습니다.



출처 :
http://www.postgresql.org/docs/9.5/static/functions-datetime.html



## EXTRACT
SELECT EXTRACT(속성 FROM 시간);


예를 들어 현재(now) 의 요일을 가져오는 경우라면.
``` sql
SELECT EXTRACT(DOW FROM now());
```


# 각종 속성들
# day
월에서의 day 1 - 31 사이의 값을 가져옴.
``` sql
SELECT EXTRACT(DAY FROM TIMESTAMP '2001-02-16 20:38:40');
Result: 16
```
다만 아래와 같이 INTERVAL '40 days 1 minute' 같은 속성이라면 40이 반환됨.
``` sql
SELECT EXTRACT(DAY FROM INTERVAL '40 days 1 minute');
Result: 40
```

# decade
10 단위의 연 (예 2010년이라면 201 이 반환)
``` sql
SELECT EXTRACT(DECADE FROM TIMESTAMP '2001-02-16 20:38:40');
Result: 200
```

# dow
요일 0 ~ 6 (0은 일요일)
``` sql
SELECT EXTRACT(DOW FROM TIMESTAMP '2001-02-16 20:38:40');
Result: 5
```

# hour
시간
``` sql
SELECT EXTRACT(HOUR FROM TIMESTAMP '2001-02-16 20:38:40');
Result: 20
```

# epoch
유닉스 시간
- 1970-01-01 00:00:00 부터 1초당 1씩 증가
- PG-SQL 에서는 1 초 이하는 소수점으로 표시합니다.
- 9.5 윈도우 버전 기준으로 소수점 5자리 까지 표시됩니다. (10만분의 1초 : 다만 아래설명)
- PG-SQL에서 모든 시간단위는 백만분의 1초라고 가정하고 프로그래밍 하셔야합니다.
``` java
SELECT EXTRACT(EPOCH FROM TIMESTAMP WITH TIME ZONE '2001-02-16 20:38:40.12-08');
Result: 982384720.12
```
예를들어 자바나 자바스크립트등에서 나오는 유닉스 타임 1/1000 을 구하고싶다면
아래 코드처럼 입력해주시면 됩니다.
``` java
SELECT (EXTRACT(epoch FROM now()) * 1000)::bigint;
```


그 밖에 많은 설정들은 위 출처(공식문서) 사이트를 확인해주세요.!