---
layout: post
tags: [가리사니, 기타]
---

> 이 문서는 예전 가리사니 사이트에서 작성된 문서 입니다.
현재 상황과 맞지 않을 수 있습니다.


요즘은 대부분의 DBMS가 결과를 JSON으로 출력하는 것을 지원하고 있습니다.
포스트그레스큐엘에서는 json_agg, row_to_json 등을 통해 json 출력이 가능합니다.
\
json_agg 의 경우 결과의 모든 row를 agg(aggregate) 하여 1열 1행의 하나의 스트링으로 출력해주는 것이고 row_to_json 은 한 로우단위로 1열 n행으로 출력 해줍니다.
\
가리사니를 포함해 그동안 json_agg 만 사용해 왔는데요. DBMS에서 aggregate를 실행하기 때문에 혹시 row_to_json 로 출력 후 스트림을 그대로 아웃시키면 속도적으로 얼마나 차이가 있을지 궁금하여 실험을 하게 되었습니다.

# 우선 실험 테이블은 사로에서 가지고 있는 국가정보 테이블입니다.
``` sql
SELECT * FROM "Country"
/*
code | name
AD | Andorra
AE | United Arab Emirates
AF | Afghanistan
AG | Antigua and Barbuda
AI | Anguilla
AL | Albania
...
ZW | Zimbabwe (총 249행)
*/
```
# 1. json_agg 를 사용해보자.
``` sql
SELECT json_agg(j) FROM (SELECT "code" c, "name" n FROM "Country" ORDER BY c) j
```
## 결과
[{"c":"AD","n":"Andorra"},
 {"c":"AE","n":"United Arab Emirates"},
 {"c":"AF","n":"Afghanistan"}...
## 계획
"Aggregate  (cost=11.00..11.01 rows=1 width=38)"
"  ->  Subquery Scan on j  (cost=0.14..10.37 rows=249 width=38)"
"        ->  Index Scan using "Country__code" on "Country"  (cost=0.14..7.88 rows=249 width=14)"

# 2. row_to_json를 사용해보자.
``` sql
SELECT row_to_json(j) FROM (SELECT "code" c, "name" n FROM "Country" ORDER BY c) j
```
## 결과
{"c":"AD","n":"Andorra"}
{"c":"AE","n":"United Arab Emirates"}
{"c":"AF","n":"Afghanistan"}
{"c":"AG","n":"Antigua and Barbuda"}
...
## 계획
"Subquery Scan on j  (cost=0.14..10.99 rows=249 width=38)"
"  ->  Index Scan using "Country__code" on "Country"  (cost=0.14..7.88 rows=249 width=14)"
\
여기까지만 보면 row_to_json가 약간(무시할정도) 나은 것 같아 보이지만. 이것을 자바로 불러와서 출력해 보도록 하였습니다.
\
json_agg, row_to_json 를 각각 3000번씩 여러번 실행시켜본 결과.
json_agg : 1392
json_agg: 1406
row_to_json  : 1672
row_to_json  : 1643

# 결론
json_agg 가 조금더 빠릅니다.
다만 **1/1000초를 다투는 매우 특수한 경우**를 제외하고는 의미 있는 결과는 아닌 것 같습니다.
\
주의할점은 json_agg 경우 결과가 하나도 없을경우 null 이 반환됩니다.
즉 coalesce((json_agg ), '[]') 과 같은 방법으로 null일 경우 빈 json-array가 되도록 처리해주셔야합니다.