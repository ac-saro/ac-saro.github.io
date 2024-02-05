---
layout: post
tags: [가리사니, 기타]
---

> 이 문서는 가리사니 개발자 포럼에 올렸던 글의 백업 파일입니다.
오래된 문서가 많아 현재 상황과 맞지 않을 수 있습니다.


출처 : http://www.postgresql.org/docs/9.4/static/datatype.html 공식페이지
포스트 그레스큐엘은 큐브리드와 같이 자료형에 unsigned가 없습니다.
int는 c언어의 int
float, double 도 마찬가지로 기억하시면 편합니다.

다만 큐브리드와 다르게 char의 경우는 DB설정의 지정된 타입에 길이를 뜻하게됩니다.
예를들어서 DB의 캐릭터셋을 UTF-8의 경우 char(3) 에 '가나다'를 넣을 수 있습니다.
MySQL이나 마리아DB에서도 char은 DBMS에서 지정한 캐릭터셋의 영향을 받습니다.
(MySQL이나 마리아의 경우 기본 char의 UTF-8 이 3바이트로 지정되어있음으로 3바이트 이상의 캐릭터를 쓰려면 설정에서 늘려주셔야합니다.)

큐브리드에서 오시는 분들이 like문에대해서 걱정하신다면 그냥 like문으로 쓰면됩니다.
char을 무조건 1바이트로 인식하는 db에서는 설정없이 like문을 쓸경우 비교순서가 이상해질 수 있습니다.

``` sql
bigint	int8	signed eight-byte integer
bigserial	serial8	autoincrementing eight-byte integer
bit [ (n) ]	 	fixed-length bit string
bit varying [ (n) ]	varbit	variable-length bit string
boolean	bool	logical Boolean (true/false)
box	 	rectangular box on a plane
bytea	 	binary data ("byte array")
character [ (n) ]	char [ (n) ]	fixed-length character string
character varying [ (n) ]	varchar [ (n) ]	variable-length character string
cidr	 	IPv4 or IPv6 network address
circle	 	circle on a plane
date	 	calendar date (year, month, day)
double precision	float8	double precision floating-point number (8 bytes)
inet	 	IPv4 or IPv6 host address
integer	int, int4	signed four-byte integer
interval [ fields ] [ (p) ]	 	time span
json	 	textual JSON data
jsonb	 	binary JSON data, decomposed
line	 	infinite line on a plane
lseg	 	line segment on a plane
macaddr	 	MAC (Media Access Control) address
money	 	currency amount
numeric [ (p, s) ]	decimal [ (p, s) ]	exact numeric of selectable precision
path	 	geometric path on a plane
pg_lsn	 	PostgreSQL Log Sequence Number
point	 	geometric point on a plane
polygon	 	closed geometric path on a plane
real	float4	single precision floating-point number (4 bytes)
smallint	int2	signed two-byte integer
smallserial	serial2	autoincrementing two-byte integer
serial	serial4	autoincrementing four-byte integer
text	 	variable-length character string
time [ (p) ] [ without time zone ]	 	time of day (no time zone)
time [ (p) ] with time zone	timetz	time of day, including time zone
timestamp [ (p) ] [ without time zone ]	 	date and time (no time zone)
timestamp [ (p) ] with time zone	timestamptz	date and time, including time zone
tsquery	 	text search query
tsvector	 	text search document
txid_snapshot	 	user-level transaction ID snapshot
uuid	 	universally unique identifier
xml	 	XML data
```