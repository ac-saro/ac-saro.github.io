---
layout: post
tags: [가리사니, 기타]
---

> 이 문서는 가리사니 개발자 포럼에 올렸던 글의 백업 파일입니다.
오래된 문서가 많아 현재 상황과 맞지 않을 수 있습니다.


Hibernate Tools 를 이용하면 상당한 노가다를 자랑하는 도메인과 리포지토리등을 자동으로 생성 할 수 있습니다.
아쉽게도 이클립스만 지원하는 것 같습니다.


# 설치
다운로드 주소 찾기
접속 : http://hibernate.org/tools/
다운로드 -> JBoss Tools (플러그인) -> Update Site
이클립스 네온버전 기준으로 사이트는 아래와 같습니다.
http://download.jboss.org/jbosstools/neon/stable/updates/
이클립스 적용
이클립스 -> help -> Install New Software...
Work With에 위 update 사이트를 붙여넣기 합니다. (위 사이트는 네온 버전 기준의 사이트)
Hibernate Tools 를 검색하여 내려받습니다.


# 연결설정
Open Perspective 열기
- 이클립스 상단 오른쪽 아이콘들 중 탐색기 모양에 + 표시되어있는 것.
- 혹은 Window -> Perspective -> Open Perspective -> Other...
Hibernate 선택
Hibernate Configurations 탭 -> Add Configuration
+ main 탭
- 이름 / 프로젝트 선택
- 타입 : 어노테이션, jpa
-+ 방법1 : Database connection 에서 미리 만든 커넥션을 선택한다.
-- Open Perspective 열기 -> Database Development -> 연결을 만들기
-- 돌아와서 다시 Hibernate Configurations 탭 -> Add Configuration 하시면 연결에 있습니다.
-+ 방법2 : 프로퍼티나 컨피그레이션 파일중 하나를 선택하여 setup 을 누른다.
-- 컨피그레이션 파일로 진행하겠습니다. setup을 누르고 위치를 지정 후 정보를 입력하고 확인.
-- 확인을 누르면 아래와 같은 파일이 생성됩니다. : 저장위치/이름.cfg.xml
-- 드라이버 위치나 프로토콜등 설정이 맞는지 확인합니다.
-- 필자는 포스트그레스큐엘기준으로 작성하였으며 어떤 db의 경우 driver_class, dialect 부분이 잘못나오는 경우가 있다고합니다.
-- 해당 부분은 (본인이 알고있거나) 구글링해서 찾아보시고 고쳐주시면됩니다.
``` java
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE hibernate-configuration PUBLIC
		"-//Hibernate/Hibernate Configuration DTD 3.0//EN"
		"http://www.hibernate.org/dtd/hibernate-configuration-3.0.dtd">
<hibernate-configuration>
    <session-factory>
        <property name="hibernate.connection.driver_class">org.postgresql.Driver</property>
        <property name="hibernate.connection.url">jdbc:postgresql://호스트:포트/db이름</property>
        <property name="hibernate.connection.username">유저</property>
        <property name="hibernate.connection.password">암호</property>
        <property name="hibernate.dialect">org.hibernate.dialect.PostgreSQLDialect</property>
    </session-factory>
</hibernate-configuration>
```


# 코드생성
조금 특이한 하이버네이트 ▶ (Run) ▼ 클릭 : Hivernate Code Genetation Configurations 클릭
Output Directory : 필자의 경우는 \프로젝트명\src\main\java
Reverse engineer from JDBC Connection 체크
Package 에서 도메인으로 두고 있는 패키지를 입력합니다. : 필자는 자동생성이 (처음이라) 겁나서 test.domain 이라고 적었습니다...
reveng.xml 의 setup을 누른후 경로를 지정해준후 다음
Database schema 부분이 나오면 Refresh 를 누른 후 복사할 것들을 지정하고 Finish
Exports 탭으로 이동 : 필요한 것들을 선택합니다. : 필자의 경우 EJB3 어노테이션(@Column)등.. Domain code를 선택했습니다. -> Run


# 결과
생각만큼 깔끔하게 만들어지지는 않지만 대략 이퀄에 해시코드까지 만들어줍니다.!!
pg-sql 에선 좀 특이한 자료형이 많아서 그런지 매칭이 안되어 Serializable 로 만들어지는 경우도 많습니다.;;
아직 아무래도 직접 만드는걸 따라가진 못하는 것 같습니다. (조만간 제가 만들어봐야겠네요...)