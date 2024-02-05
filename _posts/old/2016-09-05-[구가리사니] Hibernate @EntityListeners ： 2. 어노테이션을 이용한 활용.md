---
layout: post
tags: [가리사니, 기타]
---

> 이 문서는 예전 가리사니 사이트에서 작성된 문서 입니다.
현재 상황과 맞지 않을 수 있습니다.


Hibernate @EntityListeners 시리즈
- javax.persistence.EntityListeners 는 하이버네이트 전용이 아닌,
- javax persistence 규격 이지만 이 강의에서는 하이버네이트를 기준으로 설명합니다.
1. 리스너를 통해 자동으로 값 삽입하기
- [/lab?topicId=312](/lab?topicId=312)
2. 어노테이션을 이용한 활용
- [/lab?topicId=313](/lab?topicId=313)


# 서론
1장에선 Listener 를 만들어서 활용했습니다.
아래와 같이 엔티티가 많아질수록 콜백이 배로 증가하는 문제가 있습니다.
``` java
public class PublicListener
{
	@PreUpdate
	// Account 클래스에서 작동.
	void onUpdate(Account account)
	{
		account.setLastDate(new Date());
	}

	@PreUpdate
	// User 클래스에서 작동.
	void onUpdate(User user)
	{
		user.setLastDate(new Date());
	}

	// ... 생략 이런식으로 수십개가 있다고 생각해봅시다.

	@PreUpdate
	// 이젠 너무많아서 중복소스의 세상이 되었!!..;;
	void onUpdate(ManyManyClass manyManyClass)
	{
		manyManyClass.setLastDate(new Date());
	}
}
```
그래서 어노테이션을 활용해 보도록 하겠습니다.


# 어노테이션
먼저 옵션종류를 만들고
``` java
public enum ColumnSaveOptionType
{
	CREATED_DATE,
	MODIFIED_DATE,
	ONLY_UPPER_CASE,
	ONLY_LOWER_CASE
}
```
나중 확장을 위해 배열(다중옵션)형태로 하였습니다.
``` java
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
public @interface ColumnSaveOption
{
	ColumnSaveOptionType[] value() default {};
}
```


# 리스너
``` java
import java.lang.reflect.Field;
import java.util.Date;

import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;

import db.hn.listener.annotation.ColumnSaveOption;

public class ColumnSaveOptionListener
{
	@PrePersist @PreUpdate
	// 이런 식으로 Object 를 파라미터로 지정한 경우 모든 엔티티가 적용됩니다.
	void prePersist(Object object) throws IllegalArgumentException, IllegalAccessException
	{
		for (Field field : object.getClass().getDeclaredFields())
		{
			ColumnSaveOption saveOption = field.getAnnotation(ColumnSaveOption.class);
			if (saveOption != null)
			{
				field.setAccessible(true);

				for (ColumnSaveOptionType type : saveOption.value())
				{
					applyOption(object, field, type);
				}
			}
		}
	}

	/**
	 * 옵션 적용
	 * @param object 대상객체
	 * @param field 필드
	 * @param type 옵션타입
	 * @throws IllegalArgumentException
	 * @throws IllegalAccessException
	 */
	void applyOption(Object object, Field field, ColumnSaveOptionType type)
		throws IllegalArgumentException, IllegalAccessException
	{
		switch (type)
		{
			// 날짜 생성 : 네이밍만봐도 별도 주석이 필요 없지만.. 강의글이니!!
			case CREATED_DATE :
				if (field.get(object) != null)
				{
					break;
				}
			// 날짜 갱신
			case MODIFIED_DATE :
				field.set(object, new Date());
			break;

			// 대문자
			case ONLY_UPPER_CASE :
			{
				String text = (String)field.get(object);
				if (text != null)
				{
					field.set(object, text.toUpperCase());
				}
			}
			break;

			// 소문자
			case ONLY_LOWER_CASE :
			{
				String text = (String)field.get(object);
				if (text != null)
				{
					field.set(object, text.toLowerCase());
				}
			}
			break;
		}
	}
}
```


# 적용 예제
ONLY_LOWER_CASE 는 좀 애매하지만, 이런 식으로 쓸 수 있습니다.
``` java
@Entity(name="account")
@Table(name="account")
// 이런식으로 ColumnSaveOptionListener 를 정의합니다.
@EntityListeners(ColumnSaveOptionListener.class)
@Data @Getter @Setter @ToString
public class Account
{
	@Id
	@Column(name="sn", nullable=false, unique=true)
	@SequenceGenerator(name="account_sn_seq", sequenceName="account_sn_seq", allocationSize=1)
	@GeneratedValue(strategy=GenerationType.SEQUENCE, generator="account_sn_seq")
	long sn;

	@ColumnSaveOption(ColumnSaveOptionType.ONLY_LOWER_CASE)
	@Column(name="mail", nullable=false, length=64, unique=true)
	String mail;

	@Column(name="auth", nullable=false, length=128)
	String auth;

	@Column(name="auth_type", nullable=false, length=1)
	String authType;

	@ColumnSaveOption(ColumnSaveOptionType.ONLY_LOWER_CASE)
	@Column(name="country", nullable=false, length=3)
	String country;

	@ColumnSaveOption(ColumnSaveOptionType.ONLY_LOWER_CASE)
	@Column(name="lang", nullable=false, length=3)
	String lang;

	@Column(name="birthday", nullable=false)
	Date birthday;

	@ColumnSaveOption(ColumnSaveOptionType.CREATED_DATE)
	@Column(name="join_date", nullable=false)
	Date joinDate;

	@ColumnSaveOption(ColumnSaveOptionType.MODIFIED_DATE)
	@Column(name = "last_date", nullable = false)
	Date lastDate;

	@OneToMany(mappedBy="sn", fetch = FetchType.LAZY)
	List<AccountRole> roles;
}
```