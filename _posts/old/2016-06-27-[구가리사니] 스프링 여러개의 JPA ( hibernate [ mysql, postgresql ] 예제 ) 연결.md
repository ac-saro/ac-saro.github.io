---
layout: post
tags: [가리사니, 기타]
---

> 이 문서는 예전 가리사니 사이트에서 작성된 문서 입니다.
현재 상황과 맞지 않을 수 있습니다.


# 1. pom.xml 설정
mysql, postgresql, hibernate, maven을 예제로 써보겠습니다.
``` xml
<dependency>
	<groupId>mysql</groupId>
	<artifactId>mysql-connector-java</artifactId>
</dependency>

<dependency>
	<groupId>org.postgresql</groupId>
	<artifactId>postgresql</artifactId>
	<version>9.4-1205-jdbc42</version>
</dependency>

<dependency>
	<groupId>org.hibernate</groupId>
	<artifactId>hibernate-jpamodelgen</artifactId>
</dependency>
```


# 2. application.properties 설정
여기서는 아래와 같은 이름으로 설정해보겠습니다.
conn_pgsql_test : postgresql
conn_mysql_test : mysql
``` shell
spring.conn_mysql_test.driverClassName=com.mysql.jdbc.Driver
spring.conn_mysql_test.url=jdbc:mysql://<호스트>:<포트>/<db명>?useSSL=true&useUnicode=yes&characterEncoding=utf-8
spring.conn_mysql_test.username=<계정>
spring.conn_mysql_test.password=<암호>

spring.conn_pgsql_test.driverClassName=org.postgresql.Driver
spring.conn_pgsql_test.url=jdbc:postgresql://<호스트>:<포트>/<db명>?charSet=utf-8&prepareThreshold=1
spring.conn_pgsql_test.username=<계정>
spring.conn_pgsql_test.password=<암호>
```


# 3. 연결 설정
설정파일을 빨리 찾을 수 있도록 클래스를 2개로 각각 만들었습니다.
두개 이상의 데이터베이스 설정시 기본으로 사용될 Bean 에다가 @Primary 를 설정해줘야합니다. (필수사항)
대응할 도메인과 리포지토리의 패키지 위치를 적어줍니다.
``` java
@Configuration
@EnableJpaRepositories
(
	basePackages = "com.web.repository.pgsql",
	entityManagerFactoryRef = "pgsqlFactoryBean",
	transactionManagerRef = "pgsqlTransactionManager"
)
public class JdbcPgsqlConfig
{
	@Primary
	@Bean(name = "pgsqlDataSource")
	@ConfigurationProperties(prefix = "spring.conn_pgsql_test")
	public DataSource getDataSource()
	{
		return DataSourceBuilder.create().build();
	}

	@Primary
	@Bean(name = "pgsqlFactoryBean")
	public LocalContainerEntityManagerFactoryBean getFactoryBean(EntityManagerFactoryBuilder builder)
	{
		return builder.dataSource(getDataSource()).packages("com.web.domain.pgsql").build();
	}

	@Primary
	@Bean(name = "pgsqlTransactionManager")
	PlatformTransactionManager getTransactionManager(EntityManagerFactoryBuilder builder)
	{
		return new JpaTransactionManager(getFactoryBean(builder).getObject());
	}
}
```
``` java
@Configuration
@EnableJpaRepositories
(
	basePackages = "com.web.repository.mysql",
	entityManagerFactoryRef = "mysqlFactoryBean",
	transactionManagerRef = "mysqlTransactionManager"
)
public class JdbcMysqlConfig
{
	@Bean(name = "mysqlDataSource")
	@ConfigurationProperties(prefix = "spring.conn_mysql_test")
	public DataSource getDataSource()
	{
		return DataSourceBuilder.create().build();
	}

	@Bean(name = "mysqlFactoryBean")
	public LocalContainerEntityManagerFactoryBean getFactoryBean(EntityManagerFactoryBuilder builder)
	{
		return builder.dataSource(getDataSource()).packages("com.web.domain.mysql").build();
	}

	@Bean(name = "mysqlTransactionManager")
	PlatformTransactionManager getTransactionManager(EntityManagerFactoryBuilder builder)
	{
		return new JpaTransactionManager(getFactoryBean(builder).getObject());
	}
}
```


# 아래처럼 만들어주시면 알아서 주입됩니다.!!
com.web.domain.mysql 패키지에는 mysql 엔티티
com.web.repository.mysql 패키지에는 mysql jpa리포지토리
적당한 데이터를 만들어서 테스트 해보시면 패키지 경로에 따라 서로다른 데이터소스에 주입되어 작동 할 겁니다.!!