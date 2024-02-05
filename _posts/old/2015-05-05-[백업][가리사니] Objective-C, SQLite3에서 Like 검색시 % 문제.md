---
layout: post
tags: [ios, objective-c, sqlite]
---

> 이 문서는 가리사니 개발자 포럼에 올렸던 글의 백업 파일입니다.
오래된 문서가 많아 현재 상황과 맞지 않을 수 있습니다.



> 이글의 출처는 다음과 같습니다.
>
http://blog.arzz.com/403


SQLite3 에서 WHERE FIELD LIKE '%KEYWORD%' 의 쿼리문을 날리기 위한 방법입니다.
Objective-C 에서는 % 가 특별한 문자로 인식되는데다가, 쿼리문을 bind 해서 처리하려니 이것저것 걸리는 것이 많더군요.

일단, 키워드를 % 로 감싸주는 방법입니다.
``` java
NSString *keyword = @"keyword";
NSString *wildcardKeyword = [NSString stringWithFormat:@"%@%%", keyword];
// 위의 방법은 키워드%가 되겠습니다.
NSString *wildcardKeyword = [NSString stringWithFormat:@"%%%@%%", keyword];
// 위의 방법은 %키워드%가 되겠습니다.
```

적당히 와일드카드 검색을 위한 키워드의 조작이 끝났으면, 쿼리문을 작성합니다.

``` sql
const char  *query = "SELECT * FROM TABLE WHERE FIELD1 LIKE ?001 OR FIELD2 LIKE ?002";
```

여기서 ?001과, ?002에 키워드를 바인딩할겁니다. ?001, ?002 양쪽에 '(콤마)가 없음을 유의하세요.

``` java
sqlite3_stmt *stmt;
if (sqlite3_prepare_v2(database, query, -1, &stmt, nil) == SQLITE_OK) {
    sqlite3_bind_text(stmt, 1, [wildcardKeyword UTF8String],  -1, SQLITE_STATIC);
    sqlite3_bind_text(stmt, 2, [wildcardKeyword UTF8String],  -1, SQLITE_STATIC);
    // 이하생략
```

하면 할수록 오묘한 언어입니다. 크윽 ㅠ _ㅠ