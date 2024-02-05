---
layout: post
tags: [postgresql, java, hibernate, spring]
---

> 이 문서는 가리사니 개발자 포럼에 올렸던 글의 백업 파일입니다.
오래된 문서가 많아 현재 상황과 맞지 않을 수 있습니다.


요즘 하이버네이트를 하다가 갑자기 마이바티스 생각이 나서 스프링부트와 연동해보았습니다.
예제로 HikariCP, PostgreSQL 을 사용하였습니다.
참고 : http://www.mybatis.org/spring-boot-starter/mybatis-spring-boot-autoconfigure/


# 메이븐 설정
``` xml
<!-- 히카리 CP -->
<dependency>
	<groupId>com.zaxxer</groupId>
	<artifactId>HikariCP</artifactId>
</dependency>
<!-- 포스트그레스큐엘 -->
<dependency>
	<groupId>org.postgresql</groupId>
	<artifactId>postgresql</artifactId>
</dependency>
<!-- 마이바티스 : 이거 하나면 됩니다. -->
<dependency>
	<groupId>org.mybatis.spring.boot</groupId>
	<artifactId>mybatis-spring-boot-starter</artifactId>
	<version>1.1.1</version>
</dependency>
<!-- 롬복 : get set 만들귀 찮아서 추가했습니다. -->
<dependency>
	<groupId>org.projectlombok</groupId>
	<artifactId>lombok</artifactId>
	<version>1.16.8</version>
	<scope>provided</scope>
</dependency>
```


# 커넥션 설정
- 다중 DB 접속이 있다고 생각하고 application.properties 가 아닌 다른 파일로 만들겠습니다.
src/main/resources/hikari_pgsql.properties 파일
``` sh
# 데이터소스 클래스 위치 (드라이버가 아닙니다.!!)
dataSourceClassName=org.postgresql.ds.PGSimpleDataSource
# 접속 url : 기타 설정도 그냥 붙여봤습니다.
dataSource.url=jdbc:postgresql://호스트:포트/데이터베이스?charSet=UTF-8&prepareThreshold=1
dataSource.user=계정
dataSource.password=암호
# 풀사이즈
maximumPoolSize=10
```


# 커넥션
여러개의 연결문이 있다는 생각으로 작성하였습니다.
자세한 내용은 아래 강의를 참고해주세요.
참고 : [/lab?topicId=253](/lab?topicId=253)
``` java
/**
 * 데이터베이스 설정<br>
 * 2016-07-16 박용서 작성
 */
public class DatabaseConfiguration
{

	// 설정을 한 클래스에 몰아 넣기위해 클래스 안에 클래스를 만듬.
	@Configuration
	// 다수의 데이터 연결이 있다면, 규정상 매핑여부와 상관없이 한쪽 @Bean 의 접근자별 @Primary 를 강제로 지정해야함.
	// 자세한건 위 참고 링크를 참조바람.
	@MapperScan
	(
		basePackages ="saro.webtest.mybatis.mapper",
		sqlSessionFactoryRef = "MyBatis_PostgreSQL_DataSource",
		sqlSessionTemplateRef = "MyBatis_PostgreSQL_SqlSessionFactory"
	)
	public static class Mybatis_PostgreSQL
	{
		@Autowired
		ApplicationContext applicationContext;

		@Bean(name = "MyBatis_PostgreSQL_DataSource")
		public DataSource getDataSource() throws IOException
		{
			Properties prop = new Properties();
			prop.load(DataSourceFactory.class.getClassLoader().getResourceAsStream("hikari_pgsql.properties"));
			return new HikariDataSource(new HikariConfig(prop));
		}

		@Bean(name = "MyBatis_PostgreSQL_SqlSessionFactory")
		public SqlSessionFactory getSqlSessionFactory() throws Exception
		{
			SqlSessionFactoryBean sqlSessionFactoryBean = new SqlSessionFactoryBean();
			sqlSessionFactoryBean.setDataSource(getDataSource());
			// xml 매핑을 위한 것임으로 xml을 통한 매핑을 사용하지 않는다면 생략가능.
			// 밑에 xml 예제도 사용할 것임으로 설정
			sqlSessionFactoryBean.setMapperLocations(applicationContext.getResources("classpath:mybatis/mapper/*.xml"));
			return sqlSessionFactoryBean.getObject();
		}

		@Bean(name = "MyBatis_PostgreSQL_SqlSessionTemplate")
		public SqlSessionTemplate getSqlSessionTemplate() throws Exception
		{
			return new SqlSessionTemplate(getSqlSessionFactory());
		}
	}
}
```


# 테이블 구조
- 데이터는 적당히 넣어주세요.
- point 는 사실 의미없지만.. 조회시 where 조건을 줘보기위해 추가 해봤습니다.
``` sql
CREATE TABLE account
(
	no bigserial NOT NULL,
  	name character varying(16) NOT NULL,
  	point integer NOT NULL DEFAULT 0
);
```


# 엔티티
- 예를들어 saro.webtest.mybatis.entity에 작성하겠습니다.
``` java
@Data
@Getter @Setter
public class Account
{
	long no;
	String name;

	public String toString()
	{
		return no+ " : " + name;
	}
}
```


# 매퍼
위 @MapperScan 에서 설정한 경로인 saro.webtest.mybatis.mapper 안에 작성해주세요.
``` java
@Mapper
public interface AccountMepper
{
	@Select("SELECT * FROM account WHERE point > #{point} ORDER BY 1 DESC")
    List<Account> listOverPoint(@Param("point") int point);
}
```


# 실행
``` java
@SpringBootApplication
public class App implements CommandLineRunner
{
	Logger logger = LoggerFactory.getLogger(App.class);

	@Autowired
	AccountMepper accountMepper;

	public static void main(String[] args)
	{
		SpringApplication.run(App.class, args);
	}

	@Override
	public void run(String... args) throws Exception
	{
		logger.info("준비");

		int point = 0;

		// 일반적으로 AccountMepper 한단계 더 거쳐써야 제어나 패턴에 정상적인 방법이지만, 빠른 예제를 위해.
		accountMepper.listOverPoint(point).stream().forEach( ac -> logger.info(ac.toString()) );
	}
}
```
정상적으로 실행됬다면 이번엔 xml mapper를 사용해보겠습니다.


# xml mpper
- 위 sqlSessionFactoryBean.setMapperLocations 에서 설정한 classpath:mybatis/mapper/*.xml 에 아래작성합니다.
- 즉, 프로젝트/src/main/resources/mapper/xmlAccountMapper.xml 로 작성해보겠습니다.
``` java
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="mybatis.account">
	<!-- 좀전에 작성한 객체로 리턴합니다. -->
	<!-- 좀전엔 내림차순이였다면 구분을위해 오름차순으로 정렬해보겠습니다. -->
	<select id="listOverPoint" resultType="saro.webtest.mybatis.entity.Account">
		SELECT * FROM account WHERE point > #{point} ORDER BY 1 ASC
	</select>
</mapper>
```


# AccountDao
``` java
@Component
public class AccountDao
{
	@Autowired
	@Qualifier("MyBatis_PostgreSQL_SqlSessionTemplate")
	SqlSessionTemplate sqlSessionTemplate;

	public List<Account> listOverPoint(int point)
	{
		Map<String, Object> param = new HashMap<>();
		param.put("point", point);
		return sqlSessionTemplate.selectList("mybatis.account.listOverPoint", param);
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
	AccountMepper accountMepper;

	@Autowired
	AccountDao accountDao;

	public static void main(String[] args)
	{
		SpringApplication.run(App.class, args);
	}

	@Override
	public void run(String... args) throws Exception
	{
		int point = 0;

		logger.info("어노테이션 매퍼 사용 : 내림차순으로 정렬함");
		accountMepper.listOverPoint(point ).stream().forEach( ac -> logger.info(ac.toString()) );

		logger.info("XML 매퍼 사용 : 오름차순으로 정렬함");
		accountDao.listOverPoint(ap).stream().forEach( ac -> logger.info(ac.toString()) );
	}
}
```