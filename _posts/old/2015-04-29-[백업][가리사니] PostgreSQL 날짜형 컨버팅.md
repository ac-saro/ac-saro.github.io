---
layout: post
tags: [가리사니, 기타]
---

> 이 문서는 가리사니 개발자 포럼에 올렸던 글의 백업 파일입니다.
오래된 문서가 많아 현재 상황과 맞지 않을 수 있습니다.

공식사이트 : http://www.postgresql.org/docs/8.1/static/functions-formatting.html


``` sql
SELECT to_char(now(), 'YYYY-MM-DD HH24:MI:SS.MS');
-- 출력 : 2015-04-29 01:32:11.321 (현재시간 이 출력과 같다고 가정할 때.)

SELECT to_timestamp('2015-04-29 01:32:11.321', 'YYYY-MM-DD HH24:MI:SS.MS');
-- 출력 : 2015-04-29 01:32:11.321 이 sql 메니지 툴에 맞게 출력 (MS까지 모두 삽입됨.)

SELECT to_char(to_timestamp('2015-04-29 01:32:11.321', 'YYYY-MM-DD HH24:MI:SS.MS'), 'YYYY-MM-DD HH24:MI:SS.MS');
-- 출력 : 2015-04-29 01:32:11.321

-- 주의 to_date 사용시 진짜 date 만들어간다.
SELECT to_char(to_date('2015-04-29 01:32:11.321', 'YYYY-MM-DD HH24:MI:SS.MS'), 'YYYY-MM-DD HH24:MI:SS.MS');
-- 출력 : 2015-04-29 00:00:00.000
```

# 높은 빈도
|포멧|설명|
|-|-|
|YYYY | year (4 and more digits)|
|MM | month number (01-12)|
|DD | day of month (01-31)|
|HH24 | hour of day (00-23)|
|MI | minute (00-59)|
|SS | second (00-59)|
|MS | millisecond (000-999)|
|D | day of week (1-7; Sunday is 1)|

# 전체
|포멧|설명|
|-|-|
|HH | hour of day (01-12)|
|HH12 | hour of day (01-12)|
|HH24 | hour of day (00-23)|
|MI | minute (00-59)|
|SS | second (00-59)|
|MS | millisecond (000-999)|
|US | microsecond (000000-999999)|
|SSSS | seconds past midnight (0-86399)|
|AM or A.M. or PM or P.M. | meridian indicator (uppercase)|
|am or a.m. or pm or p.m. | meridian indicator (lowercase)|
|Y,YYY | year (4 and more digits) with comma|
|YYYY | year (4 and more digits)|
|YYY | last 3 digits of year|
|YY | last 2 digits of year|
|Y | last digit of year|
|IYYY | ISO year (4 and more digits)|
|IYY | last 3 digits of ISO year|
|IY | last 2 digits of ISO year|
|I | last digits of ISO year|
|BC or B.C. or AD or A.D. | era indicator (uppercase)|
|bc or b.c. or ad or a.d. | era indicator (lowercase)|
|MONTH | full uppercase month name (blank-padded to 9 chars)|
|Month | full mixed-case month name (blank-padded to 9 chars)|
|month | full lowercase month name (blank-padded to 9 chars)|
|MON | abbreviated uppercase month name (3 chars)|
|Mon | abbreviated mixed-case month name (3 chars)|
|mon | abbreviated lowercase month name (3 chars)|
|MM | month number (01-12)|
|DAY | full uppercase day name (blank-padded to 9 chars)|
|Day | full mixed-case day name (blank-padded to 9 chars)|
|day | full lowercase day name (blank-padded to 9 chars)|
|DY | abbreviated uppercase day name (3 chars)|
|Dy | abbreviated mixed-case day name (3 chars)|
|dy | abbreviated lowercase day name (3 chars)|
|DDD | day of year (001-366)|
|DD | day of month (01-31)|
|D | day of week (1-7; Sunday is 1)|
|W | week of month (1-5) (The first week starts on the first day of the month.)|
|WW | week number of year (1-53) (The first week starts on the first day of the year.)|
|IW | ISO week number of year (The first Thursday of the new year is in week 1.)|
|CC | century (2 digits)|
|J | Julian Day (days since January 1, 4712 BC)|
|Q | quarter|
|RM | month in Roman numerals (I-XII; I=January) (uppercase)|
|rm | month in Roman numerals (i-xii; i=January) (lowercase)|
|TZ | time-zone name (uppercase)|
|tz | time-zone name (lowercase)|