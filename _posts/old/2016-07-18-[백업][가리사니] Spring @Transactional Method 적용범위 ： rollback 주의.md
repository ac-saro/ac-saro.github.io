---
layout: post
tags: [가리사니, 기타]
---

> 이 문서는 가리사니 개발자 포럼에 올렸던 글의 백업 파일입니다.
오래된 문서가 많아 현재 상황과 맞지 않을 수 있습니다.


# 서론
항상 SQL 이나 jdbc의 트랜잭션을 사용해오다가 이번에 서블릿에서 스프링으로 갈아타면서 Transactional 을 사용해 보았습니다.
Transactional에 대해서 찾아보던 중 자동생성된 객체의 처음으로 불린 메서드의 트랜잭션 상태를 유지한다는글을 보고 테스트해보았습니다.
예제 : Spring Boot, PostgreSQL, MyBatis


# 테이블 구조
``` sql
-- 유저 (예제로 급하게만들다보니 전체적인 네이밍이 망한...;;)
CREATE TABLE users
(
  no bigint NOT NULL,
  name character varying(64) NOT NULL
);
CREATE SEQUENCE users_no_seq;
-- 유저 데이터
CREATE TABLE user_data
(
  no bigint NOT NULL,
  name character varying(12) NOT NULL,
  value character varying(12) NOT NULL
);
CREATE UNIQUE INDEX user_data_uni ON user_data USING btree (no, name)
```


# 매퍼
``` java
@Mapper
public interface UsersMapper
{
	@Insert("INSERT INTO users (no, name) VALUES (o}, #{name})")
	long addUser(@Param("no") long no, @Param("name") String name);

	@Select("SELECT nextval('users_no_seq')")
	long getKey();
}
```
``` java
@Mapper
public interface UserDataMapper
{
	@Insert("INSERT INTO user_data (no, name, value) VALUES (o}, #{name}, #{value})")
	long addData(@Param("no") long no, @Param("name") String name, @Param("value") String value);
}
```


# 서비스
``` java
@Component
public class UserDemoService
{
	SimpleDateFormat SDF = new SimpleDateFormat("yyyy-MM-dd");

	@Autowired
	UsersMapper usersMapper;

	@Autowired
	UserDataMapper userDataMapper;

	@Transactional
	public long addUser(String name)
	{
		long no = usersMapper.getKey();
		String join_date = SDF.format(new Date());
		usersMapper.addUser(no, name);
		userDataMapper.addData(no, "join_date", join_date);
		return no;
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
	UserDemoService userService;

	@Override
	public void run(String... args) throws Exception
	{
		logger.info("유저추가 : " + userService.addUser("abc"));
	}

	public static void main(String[] args)
	{
		SpringApplication.run(App.class, args);
	}
}
```
실행결과
1;"abc"
1;"join_date";"2016-07-18"


# 오류를 내보자!!
SQL 오류
``` java
// UserDemoService 클래스
@Transactional
public long addUser(String name)
{
	long no = usersMapper.getKey();
	String join_date = SDF.format(new Date());
	usersMapper.addUser(no, name);
	userDataMapper.addData(no, "NULL 을 넣어도 되겠지만 (NOT NULL 이라..) 그냥 글자수를 많이 써보자.!!", join_date);
	return no;
}
```
``` java
// App 클래스 run
logger.info("유저추가 : " + userService.addUser("SQL 오류!"));
```
결과 : 양 테이블 모두 롤백 되었고 키는 롤백되지 않았습니다.
(하지만 pg-sql의 키는 트랜잭션과 무관하게 지나간다.. : 그럼으로 이후 생략.)
자바 오류
``` java
// UserDemoService 클래스
@Transactional
public long addUser(String name)
{
	long no = usersMapper.getKey();
	String join_date = SDF.format(new Date());
	usersMapper.addUser(no, name);
	userDataMapper.addData(no, "join_date", join_date);
	int error = 0 / 0; // 자바오류를 내보았다.!!
	return no;
}
```
``` java
// App 클래스 run
logger.info("유저추가 : " + userService.addUser("자바 오류!"));
```
결과 : 동일
(신기하다.. 제어역전을 매퍼가 이벤트만 날리는걸 받을 줄 알았는데 throws 도없는 자바 런타임익셉션을!!)


# 하지만 문제는 다음!! (트랜잭션 메서드를 직접 호출하지 않았다!)
``` java
// UserDemoService 클래스
public long addUser(String name)
{
	return proxyAddUser(name);
}

@Transactional
public long proxyAddUser(String name)
{
	long no = usersMapper.getKey();
	String join_date = SDF.format(new Date());
	usersMapper.addUser(no, name);
	userDataMapper.addData(no, "join_date", join_date);
	int err = 0 / 0; // 오류!!
	return no;
}
```
``` java
// App 클래스 run
logger.info("유저추가 : " + userService.addUser("트랜잭션 테스트"));
```
결과
4;"트랜잭션 테스트"
4;"join_date";"2016-07-18"
해설
테스트가 아닌 서비스 였다면, 불안정한 데이터를 넣어 잠재적인 버그를 만들어낸 것입니다.!!
그냥 볼때는 문제 없어보이는 코드이지만.. 스프링에서 Transactional 은 인스턴스에서 처음으로 부르는 메서드의 속성(클래스의 속성 포함)을 따라가게 되어 있습니다.
- 호출될때의 메서드/클래스의 트랜잭셔널 어노테이션을 긁어서 보관하면서 다른 메서드(해당 객체 내 메서드)로 넘어가는 것을 확인하지 않고 그상태를 그대로 유지하는 것 같습니다.
그래서 아래와 같이 적용해 보았습니다.
``` java
// UserDemoService 클래스
@Transactional
public long addUser(String name)
{
	return proxyAddUser(name);
}

// @Transactional 있으나 없으나 이 함수를 부른 addUser 의 속성을 따라가게된다.
private long proxyAddUser(String name)
{
	long no = usersMapper.getKey();
	String join_date = SDF.format(new Date());
	usersMapper.addUser(no, name);
	userDataMapper.addData(no, "join_date", join_date);
	int err = 0 / 0; // 오류!!
	return no;
}
```
``` java
// App 클래스 run
logger.info("유저추가 : " + userService.addUser("트랜잭션 테스트2"));
```
결과
롤백되었다!!