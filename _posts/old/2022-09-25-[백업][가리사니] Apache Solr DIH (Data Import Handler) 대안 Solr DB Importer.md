---
layout: post
tags: [가리사니, 기타]
---

> 이 문서는 가리사니 개발자 포럼에 올렸던 글의 백업 파일입니다.
오래된 문서가 많아 현재 상황과 맞지 않을 수 있습니다.

# DIH 란?
Data Import Handler (이하 DIH) 는 data를 solr에 주입 시켜주는 기능으로 주로 Database 의 SELECT 쿼리를 사용하여 solr에 기본 데이터를 주입해 줄 수 있었습니다.
하지만 Apache Solr 9.0 부터는 기본 기능에서 제외 되었습니다.
때문에 빠른 노젓기(?)를 위해 바로 대안을 만들었습니다.

# Solr DB Importer
https://github.com/saro-lab/solr-db-importer

# 사용법
- 다운로드 [solr-db-importer-1.0.jar](https://github.com/saro-lab/solr-db-importer/releases/download/1.0/solr-db-importer-1.0.jar)
  ```
  java -jar solr-db-importer-1.0.jar
  ```
  - 아래 DB에 해당하는 예제 설정파일이 자동생성됩니다.
    - mariadb
    - oracle
    - mssql
    - mysql
    - postgresql
    - h2

- 예제파일을 가지고 db-import.xml 를 만듭니다.
  ```
  # examples에 있는 마리아 DB를 이동시켜 db-import.xml 생성
  cp ./examples/db-import-mariadb.xml ./db-import.xml
  ```
- db-import.xml 을 알맞게 수정합니다.
  ```
  <conf>
    <driver>org.mariadb.jdbc.Driver</driver>
    <jdbcUrl>jdbc:mariadb://localhost:3306/dbname</jdbcUrl>
    <username>username</username>
    <password>password</password>
    <bulkExecuteRowCount>1000</bulkExecuteRowCount>
    <solrSchemaUrl>http://localhost:8983/solr/schema_name</solrSchemaUrl>
    <select><![CDATA[
        SELECT
            text_sn as id,
            title as subject,
            reg_dt
        FROM test_table
        WHERE text_sn > 0
    ]]></select>
  </conf>
  ```
- 다시 실행합니다.
  ```
  java -jar solr-db-importer-1.0.jar
  ```

이렇게 하면 DIH 를 사용하지 않고 초기 데이터를 넣을 수 있습니다.
