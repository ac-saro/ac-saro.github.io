---
layout: post
tags: [spring, java, hibernate]
---

> 이 문서는 가리사니 개발자 포럼에 올렸던 글의 백업 파일입니다.
오래된 문서가 많아 현재 상황과 맞지 않을 수 있습니다.


Hibernate EntityListeners 시리즈
- javax.persistence.EntityListeners 는 하이버네이트 전용이 아닌,
- javax persistence 규격 이지만 이 강의에서는 하이버네이트를 기준으로 설명합니다.
1. 리스너를 통해 자동으로 값 삽입하기
- [/2016/09/05/%EB%B0%B1%EC%97%85-%EA%B0%80%EB%A6%AC%EC%82%AC%EB%8B%88-Hibernate-EntityListeners-1.-%EB%A6%AC%EC%8A%A4%EB%84%88%EB%A5%BC-%ED%86%B5%ED%95%B4-%EC%9E%90%EB%8F%99%EC%9C%BC%EB%A1%9C-%EA%B0%92-%EC%82%BD%EC%9E%85%ED%95%98%EA%B8%B0.html](/2016/09/05/%EB%B0%B1%EC%97%85-%EA%B0%80%EB%A6%AC%EC%82%AC%EB%8B%88-Hibernate-EntityListeners-1.-%EB%A6%AC%EC%8A%A4%EB%84%88%EB%A5%BC-%ED%86%B5%ED%95%B4-%EC%9E%90%EB%8F%99%EC%9C%BC%EB%A1%9C-%EA%B0%92-%EC%82%BD%EC%9E%85%ED%95%98%EA%B8%B0.html)
2. 어노테이션을 이용한 활용
- [/2016/09/05/%EB%B0%B1%EC%97%85-%EA%B0%80%EB%A6%AC%EC%82%AC%EB%8B%88-Hibernate-@EntityListeners-2.-%EC%96%B4%EB%85%B8%ED%85%8C%EC%9D%B4%EC%85%98%EC%9D%84-%EC%9D%B4%EC%9A%A9%ED%95%9C-%ED%99%9C%EC%9A%A9.html](/2016/09/05/%EB%B0%B1%EC%97%85-%EA%B0%80%EB%A6%AC%EC%82%AC%EB%8B%88-Hibernate-@EntityListeners-2.-%EC%96%B4%EB%85%B8%ED%85%8C%EC%9D%B4%EC%85%98%EC%9D%84-%EC%9D%B4%EC%9A%A9%ED%95%9C-%ED%99%9C%EC%9A%A9.html)


# 서론
하이버네이트를 사용하다가 Entity를 통해 자동으로 값을 넣어주고 싶었습니다.
``` java
@Entity(name="account")
@Table(name="account")
@Data @Getter @Setter @ToString
public class Account {
	@Id
	@Column(name="sn", nullable=false, unique=true)
	@SequenceGenerator(name="account_sn_seq", sequenceName="account_sn_seq", allocationSize=1)
	@GeneratedValue(strategy=GenerationType.SEQUENCE, generator="account_sn_seq")
	long sn;

	// 자동으로 랜덤값 삽입
	@Column(name = "test_random", nullable = false)
	Date testRandom;
}
```


# Entity Listener 란?
엔티티를 DB에 적용하기 이전 이후에 커스텀 콜백을 요청할 수 있는 어노테이션 입니다.
예를들어 아래와같이 업데이트 이전에 Account.lastDate 를 교체해 줄 수 있습니다.
``` java
public class AccountListener {
	// 업데이트 이전
	@PreUpdate
	// Account 클래스에서 작동.
	void onUpdate(Account account) {
		account.setTestRandom(Long.MAX_VALUE * Math.random());
	}
}
```
그리고 Account 클래스는 다음과 같이 추가해줍니다.
``` java
// {} 를 사용하여 복수개의 클래스를 지정 할 수 있습니다.
@EntityListeners(AccountListener.class)
// 생략
public class Account {
	// 생략
}
```
이렇게하면 update 가 일어나기 전에 Account.lastDate 를 현재시간으로 바꾸어 주게 됩니다.


# Entity Listener / 콜백옵션
## @PrePersist
manager persist 의해 처음 호출될 때 실행됩니다.

## @PostPersist
manager persist 에 의해 실행되고 불립니다.
SQL INSERT 이후에 대응될 수 있습니다.

## @PostLoad
로드 이후에 불립니다.
SQL SELECT 이후에 대응될 수 있습니다.

## @PreUpdate
SQL UPDATE 이전에 불립니다.

## @PostUpdate
SQL UPDATE 이후에 불립니다.

## @PreRemove
SQL DELETE 이전에 불립니다.

## @PostRemove
SQL DELETE 이후에 불립니다.