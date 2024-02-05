---
layout: post
tags: [가리사니, 기타]
---

> 이 문서는 예전 가리사니 사이트에서 작성된 문서 입니다.
현재 상황과 맞지 않을 수 있습니다.

# 스키마 생성

> 예제 스키마 이름은 아래와 같습니다.

|스키마 이름|설명|
|---|---|
|prod_gs_forum|상용_가리사니_포럼|

#### 스키마 *이름* 대신 *prod_gs_forum* 로 설명합니다.


- 복사: server/solr/configsets/_default/conf -> server/solr/conf
- 이름변경: conf -> prod_gs_forum 
    
![설명](/file/forum/d053b56e-b102-4197-8b3e-08ad713a1c93.png)

- core.properties 파일을 새로 만들고 아래와 같이 입력합니다.
```
config=solrconfig.xml
dataDir=data
name=prod_gs_forum
schema=managed-schema.xml
```
![설명](/file/forum/ec59ca2d-bbad-40ad-8c87-019301273b2a.png)


# 스키마 필드 편집
- 열기: server/solr/prod_gs_forum/managed-schema.xml
- 주석도 많고 굉장히 복잡하지만 prod_gs_forum 에 적용하고 싶은 데이터는 아래와 같은 모양입니다.
    
![설명](/file/forum/bafc6e34-5b6e-40bc-b866-84d281962891.png)



|필드명|설명|저장여부(N은 인덱싱만)|
|---|---|---|
|forum_id|포럼ID|N|
|topic_id|토픽ID (고유값)|Y|
|subject|제목|N|
|tags|태그|N|
|content|내용|N|
|user_name|작성자|N|
|reg_dt|등록일|N|

그렇다면 managed-schema.xml 는 다음과 같이 편집 될 수 있습니다.
- _version_ 은 기본값이다.
- uniqueKey 는 plong 타입을 사용할 수 없어 string 으로 지정하였다.
```
<?xml version="1.0" encoding="UTF-8" ?>
<schema name="default-config" version="1.6">
	
	<uniqueKey>topic_id</uniqueKey>
	
	<field name="_version_" type="plong" indexed="false" stored="false"/>
	
	<field name="forum_id" type="string" indexed="true" stored="false" required="true" multiValued="false" />
	<field name="topic_id" type="string" indexed="true" stored="true" required="true" multiValued="false" />
	<field name="subject" type="text_ko" indexed="true" stored="false" required="true" multiValued="false" />
	<field name="tags" type="text_ws" indexed="true" stored="false" required="false" multiValued="false" />
	<field name="content" type="text_ko" indexed="true" stored="false" required="true" multiValued="false" />
	<field name="user_name" type="string" indexed="true" stored="false" required="true" multiValued="false" />
	<field name="reg_dt" type="pdate" indexed="true" stored="false" required="true" multiValued="false" />
	
	<fieldType name="string" class="solr.StrField" sortMissingLast="true" docValues="true" />
	<fieldType name="strings" class="solr.StrField" sortMissingLast="true" multiValued="true" docValues="true" />
	<fieldType name="boolean" class="solr.BoolField" sortMissingLast="true"/>
	<fieldType name="booleans" class="solr.BoolField" sortMissingLast="true" multiValued="true"/>
	<fieldType name="pint" class="solr.IntPointField" docValues="true"/>
	<fieldType name="pfloat" class="solr.FloatPointField" docValues="true"/>
	<fieldType name="plong" class="solr.LongPointField" docValues="true"/>
	<fieldType name="pdouble" class="solr.DoublePointField" docValues="true"/>
	<fieldType name="pints" class="solr.IntPointField" docValues="true" multiValued="true"/>
	<fieldType name="pfloats" class="solr.FloatPointField" docValues="true" multiValued="true"/>
	<fieldType name="plongs" class="solr.LongPointField" docValues="true" multiValued="true"/>
	<fieldType name="pdoubles" class="solr.DoublePointField" docValues="true" multiValued="true"/>
	<fieldType name="random" class="solr.RandomSortField" indexed="true"/>
	<fieldType name="ignored" stored="false" indexed="false" multiValued="true" class="solr.StrField" />
	<fieldType name="pdate" class="solr.DatePointField" docValues="true"/>
	<fieldType name="pdates" class="solr.DatePointField" docValues="true" multiValued="true"/>
	<fieldType name="binary" class="solr.BinaryField"/>
	<fieldType name="rank" class="solr.RankField"/>
	<fieldType name="text_general" class="solr.TextField" positionIncrementGap="100" multiValued="true">
      <analyzer type="index">
        <tokenizer name="standard"/>
        <filter name="stop" ignoreCase="true" words="stopwords.txt" />
        <filter name="lowercase"/>
      </analyzer>
      <analyzer type="query">
        <tokenizer name="standard"/>
        <filter name="stop" ignoreCase="true" words="stopwords.txt" />
        <filter name="synonymGraph" synonyms="synonyms.txt" ignoreCase="true" expand="true"/>
        <filter name="lowercase"/>
      </analyzer>
    </fieldType>
	<fieldType name="text_ws" class="solr.TextField" positionIncrementGap="100">
		<analyzer>
			<tokenizer name="whitespace"/>
		</analyzer>
	</fieldType>
	<fieldType name="text_ko" class="solr.TextField" positionIncrementGap="100">
		<analyzer>
			<tokenizer name="korean" decompoundMode="discard" outputUnknownUnigrams="false"/>
			<filter name="koreanPartOfSpeechStop" />
			<filter name="koreanReadingForm" />
			<filter name="lowercase" />
		</analyzer>
	</fieldType>
	
</schema>
```


# 스키마 데이터 입력

- 이제 data-import 를 작성하려고 했는데...
- solr 9 에서 data-import 가 제거 되었습니다..
  (사실 방향성 자체는 이것이 맞습니다. 데모 만들기 귀찮을 뿐.)
- 조금 귀찮아 졌지만 아래처럼 직접 작성했습니다.
- 원하면 서드파티로 설치 가능하며 키워드는 solr 9 DIH 라고 검색하시면 될 것입니다.
```
@GetMapping("/solr/data-import")
fun dataImport() {
    dataSource.connection.use { conn ->
        conn.prepareStatement("SELECT * FROM forum_topic ORDER BY topic_id").use { pstmt ->
            pstmt.executeQuery().use { rs ->
                val list = mutableListOf<String>()

                while (rs.next()) {
                    list.add(objectMapper.writeValueAsString(mapOf<String, Any>(
                        "forum_id" to rs.getString("forum_id"),
                        "topic_id" to rs.getLong("topic_id"),
                        "subject" to rs.getString("subject"),
                        "tags" to rs.getString("tags"),
                        "content" to rs.getString("content"),
                        "user_name" to rs.getString("user_name"),
                        "reg_dt" to rs.getTimestamp("reg_dt").toInstant().toString(),
                    )))

                    // 100개씩 모아서 보내기
                    if (list.size >= 1000) {
                        flush(list)
                    }
                }

                flush(list)
            }
        }
    }
}

fun flush(list: MutableList<String>) {
    if (list.isEmpty()) {
        return
    }

    val headers = HttpHeaders()
    headers.contentType = MediaType.APPLICATION_JSON

    val url = "http://localhost:8983/solr/prod_gs_forum/update?commit=true"
    val data = list.joinToString(",", "[", "]")

    val rest: String? = restTemplate.postForObject(url, HttpEntity<String>(data, headers), String::class.java)

    println(rest)

    list.clear()
}
```
- 이렇게 실행 시킨 후 아래와 같이 검색을 해보았다.



![설명](/file/forum/dd751738-dfb7-4557-87cc-fb252ba9661a.png)


# 참고
- https://solr.apache.org/guide/
