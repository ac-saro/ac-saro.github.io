---
layout: post
tags: [가리사니, 기타]
---

> 이 문서는 가리사니 개발자 포럼에 올렸던 글의 백업 파일입니다.
오래된 문서가 많아 현재 상황과 맞지 않을 수 있습니다.


# 서론
Spring @Transactional Method 적용범위 : rollback 주의
- [/lab?topicId=275](/lab?topicId=275)
위 강의를 쓰면서 당연히 될거 같았지만.. 트랜잭션시 서로 다른 종류의 DB를 조작할때 오류시 전부 롤백이 되는지 확인하기위해서 실험을 해보았습니다.
환경 : Spring Boot, PostgreSQL, Solr, HikariCP, Hibernate (저번강의에선 MyBatis 였지만 이번엔 하이버네이트)


# 스프링 부트 1.4.x 부터는 솔라 설정법이 조금 달라집니다.
참고 : [/lab?topicId=296](/lab?topicId=296)


# 결론
**한쪽에서 오류시 나머지 한쪽도 정상적으로 롤백**됩니다.!!
갑자기 왜 결론부터 말씀드리냐면.. 이번 예제 소스는 조금 깁니다...
(중간에 삽질해서 실험하는데 오래걸렸네요.. 벌써 새벽.... 오늘도 코딩하다.. 이력서 넣는 시간을 놓혀 버렸..;;;)


# 메이븐 추가
``` java
<!-- 히카리 CP -->
<dependency>
	<groupId>com.zaxxer</groupId>
	<artifactId>HikariCP</artifactId>
</dependency>
<!-- PG-SQL -->
<dependency>
	<groupId>org.postgresql</groupId>
	<artifactId>postgresql</artifactId>
</dependency>
<!-- 롬복 -->
<dependency>
	<groupId>org.projectlombok</groupId>
	<artifactId>lombok</artifactId>
	<version>1.16.8</version>
	<scope>provided</scope>
</dependency>
<!-- 하이버네이트 -->
<dependency>
	<groupId>org.hibernate</groupId>
	<artifactId>hibernate-jpamodelgen</artifactId>
	<version>5.2.1.Final</version>
</dependency>
<!-- 솔라 -->
<dependency>
	<groupId>org.springframework.data</groupId>
	<artifactId>spring-data-solr</artifactId>
	<version>1.5.4.RELEASE</version>
</dependency>
<!-- JPA -->
<dependency>
	<groupId>org.springframework.boot</groupId>
	<artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>
```


# 연결설정
<프로젝트>/src/main/resources/database.properties
``` java
# 히카리 - PostgreSQL
hikari.gs.jdbcUrl: jdbc:postgresql://호스트:포트/데이터베이스?charSet=UTF-8&prepareThreshold=1
hikari.gs.username: 계정
hikari.gs.password: 암호
hikari.gs.maximumPoolSize: 10
# 솔라
solr.gs.host: http://호스트:포트/solr
```
테이터베이스 연결설정
``` java
/**
 * 데이터베이스 설정<br>
 * 2016-07-16 박용서 작성 :
 */
public class DatabaseConfiguration
{
	/**
	 * 가리사니 (PostgreSQL) 히카리 데이터소스
	 */
	@Configuration
	@ConfigurationProperties(prefix = "hikari.gs", locations="classpath:database.properties")
	public static class GsHikariDataSource extends HikariConfig
	{
		@Bean(name = "GsHikariDataSource")
		public DataSource getDataSource()
		{
			System.out.println("데이터 소스 생성");
			return new HikariDataSource(this);
		}
	}

	/**
	 * 가리사니 (PostgreSQL) 하이버네이트
	 */
	@Configuration
	@EnableJpaRepositories
	(
		basePackages = "db.hn.gs.repositories",
		entityManagerFactoryRef = "GsHibernateFactoryBean",
		transactionManagerRef = "GsHibernateTransactionManager"
	)
	public static class GsHibernate
	{
		@Autowired
		@Qualifier("GsHikariDataSource")
		DataSource dataSource;

		@Bean(name = "GsHibernateFactoryBean")
		public LocalContainerEntityManagerFactoryBean getFactoryBean(EntityManagerFactoryBuilder builder)
		{
			return builder.dataSource(dataSource).packages("db.hn.gs.entities").build();
		}

		@Bean(name = "GsHibernateTransactionManager")
		public PlatformTransactionManager getTransactionManager(EntityManagerFactoryBuilder builder)
		{
			return new JpaTransactionManager(getFactoryBean(builder).getObject());
		}
	}

	@Configuration
	@EnableSolrRepositories
	(
		basePackages="db.solr.gs.repositories",
		solrServerRef="GsSolr",
		solrTemplateRef="GsSolrTemplate",
		multicoreSupport=true
	)
	@PropertySource("classpath:database.properties")
	public static class GsSolrConfig
	{
		@Value("${solr.gs.host}")
	    String host;

		@Bean(name = "GsSolr")
	    public SolrServer getSolrServer()
		{
	        return new HttpSolrServer(host);
	    }

		@Bean(name = "GsSolrTemplate")
	    public SolrTemplate getSolrTemplate()
		{
	        return new SolrTemplate(getSolrServer());
	    }
	}
}
```
서비스 컨포넌트를 스캔
``` java
@Configuration
@ComponentScan(basePackages="db.service")
public class SerivceScan
{
	// 단순히 스캔시킬려고 만들어둔것으로 적당한 위치가 떠오르지 않아 일단 따로 빼둠.
}
```


# 테이터베이스 기본테이블
PostgreSQL
``` sql
CREATE TABLE users
(
  no bigint NOT NULL,
  name character varying(64) NOT NULL
);
CREATE SEQUENCE users_no_seq;
```
솔라 - managed-schema
- 이 실험에선 한글 형태소를 쓸 필요가 없음으로 기본 text 자료형이 있는상태에서 사용하셔도됩니다.
- 한글형태소 : http://cafe.naver.com/korlucene 에서 다운로드
- 스키마 이름은 gs_test
``` java
<?xml version="1.0" encoding="UTF-8"?>
<schema version="1.6">

	<field name="_version_" type="long" indexed="true" stored="true" />
	<field name="no" type="tlong" indexed="true" stored="true" />
	<field name="name" type="ko" indexed="true" stored="true" />

	<uniqueKey>no</uniqueKey>
	<defaultSearchField>name</defaultSearchField>

	<fieldType name="long" class="solr.TrieLongField" precisionStep="0" positionIncrementGap="0" />
	<fieldType name="tlong" class="solr.TrieLongField" precisionStep="8" positionIncrementGap="0" />

	<fieldType name="ko" class="solr.TextField" positionIncrementGap="100" autoGeneratePhraseQueries="false">
		<analyzer>
			<filter class="solr.LowerCaseFilterFactory" />
			<tokenizer class="org.apache.lucene.analysis.ko.KoreanTokenizerFactory" />
			<filter class="solr.LengthFilterFactory" min="1" max="50" />
			<filter class="org.apache.lucene.analysis.ko.KoreanFilterFactory" hasOrigin="true" hasCNoun="true" />
			<filter class="org.apache.lucene.analysis.ko.WordSegmentFilterFactory" hasOrijin="true" />
			<filter class="org.apache.lucene.analysis.ko.HanjaMappingFilterFactory" />
			<filter class="org.apache.lucene.analysis.ko.PunctuationDelimitFilterFactory" />
			<filter class="solr.StopFilterFactory" ignoreCase="true" words="stopwords.txt" />
		</analyzer>
	</fieldType>

</schema>
```


# JPA 엔티티
``` java
package db.solr.gs.entities;

import org.apache.solr.client.solrj.beans.Field;
import org.springframework.data.annotation.Id;
import org.springframework.data.solr.core.mapping.SolrDocument;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@SolrDocument(solrCoreName = "gs_test")
@Getter @Setter
public class GsTest
{
	@Id
	@Field
	private long no;

	@Field
	private String name;

	public String toString()
	{
		return no + " : " + name;
	}
}
```
``` java
package db.hn.gs.entities;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name="users")
@Data @Getter @Setter
public class User
{
	@Id
	@SequenceGenerator(name="seq", sequenceName="users_user_seq", allocationSize=1)
    @GeneratedValue(strategy=GenerationType.SEQUENCE, generator="seq")
	long no;

	@Column
	String name;

	public String toString()
	{
		return no + " : " + name;
	}
}
```


# JPA 리포지토리
``` java
package db.solr.gs.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.solr.repository.Query;
import org.springframework.data.solr.repository.SolrCrudRepository;

import db.solr.gs.entities.GsTest;

public interface GsTestRepository extends SolrCrudRepository<GsTest, String>
{
	@Query(value = "*:*", filters = { "" })
	Page<GsTest> findAll();
}
```
``` java
package db.hn.gs.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import db.hn.gs.entities.User;

public interface UsersRepository extends JpaRepository<User, Long>
{
}
```


# 서비스
- 만들고나서 든 생각이지만.. 구조적으로 한단계를 더 거치는게 맞지 않을까 생각됩니다.....
``` java
package db.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import db.hn.gs.entities.User;
import db.hn.gs.repositories.UsersRepository;
import db.solr.gs.entities.GsTest;
import db.solr.gs.repositories.GsTestRepository;

@Component
public class UserTestService
{
	@Autowired
	UsersRepository usersRepository;

	@Autowired
	GsTestRepository gsTestRepository;

	@Transactional
	public void addUser(String name)
	{
		User user = new User();
		user.setName(name);
		User saveUser = usersRepository.save(user);

		GsTest test = new GsTest();
		test.setNo(saveUser.getNo());
		test.setName(saveUser.getName());
		gsTestRepository.save(test);
	}

	@Transactional(readOnly=true)
	public void allPrint()
	{
		System.out.println("pg-sql users");
		usersRepository.findAll().forEach(System.out::println);
		System.out.println("solr users");
		gsTestRepository.findAll().forEach(System.out::println);
	}
}
```


# 실행
``` java
@SpringBootApplication
public class App implements CommandLineRunner
{
	Logger logger = LoggerFactory.getLogger(App.class);

	@Autowired
	UserTestService userTestService;

	@Override
	public void run(String... args) throws Exception
	{
		logger.info("유저입력!!");
		userTestService.addUser("가리사니");
		userTestService.addUser("개발자공간");
		logger.info("출력!!");
		userTestService.allPrint();
	}

	public static void main(String[] args)
	{
		SpringApplication.run(App.class, args);
	}
}
```
결과
날짜  INFO ~~ --- [           main] saro.web.App                             : 유저입력!!
날짜  INFO ~~ --- [           main] saro.web.App                             : 출력!!
pg-sql users
1 : 가리사니
2 : 개발자공간
solr users
1 : 가리사니
2 : 개발자공간


# 고의로 오류를 내보자!!
UserTestService 클래스
``` java
@Transactional
public void addUser(String name)
{
	User user = new User();
	user.setName(name);
	User saveUser = usersRepository.save(user);

	GsTest test = new GsTest();
	test.setNo(saveUser.getNo());
	test.setName(saveUser.getName());
	gsTestRepository.save(test);

	// 오류내기!!
	int error = 0 / 0;
}
```
결과
PostgreSQL 특성상 SEQUENCE 는 롤백되지 않기 때문에 SEQUENCE 만 1 증가한 상태이며, 나머지 양쪽 모두 롤백되었습니다.