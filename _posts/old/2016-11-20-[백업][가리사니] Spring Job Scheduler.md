---
layout: post
tags: [spring, java, cron]
---

> 이 문서는 가리사니 개발자 포럼에 올렸던 글의 백업 파일입니다.
오래된 문서가 많아 현재 상황과 맞지 않을 수 있습니다.


# 크론 / 스케줄러 (배치) 시리즈
- [Job Scheduler 크론 (Cron) 과 크론 표현식](/2016/11/20/%EB%B0%B1%EC%97%85-%EA%B0%80%EB%A6%AC%EC%82%AC%EB%8B%88-Job-Scheduler-%ED%81%AC%EB%A1%A0-(Cron)-%EA%B3%BC-%ED%81%AC%EB%A1%A0-%ED%91%9C%ED%98%84%EC%8B%9D.html)
- [Spring Job Scheduler](/2016/11/20/%EB%B0%B1%EC%97%85-%EA%B0%80%EB%A6%AC%EC%82%AC%EB%8B%88-Spring-Job-Scheduler.html)

# 서론
스프링에 잡 스케줄링을 하는 방법에 대해서 설명해보겠습니다.
우선 용어정리와 크론 표현식에 대해서 알아보고 싶다면 아래 링크를 참고해주세요.
- [Job Scheduler 크론 (Cron) 과 크론 표현식](/2016/11/20/%EB%B0%B1%EC%97%85-%EA%B0%80%EB%A6%AC%EC%82%AC%EB%8B%88-Job-Scheduler-%ED%81%AC%EB%A1%A0-(Cron)-%EA%B3%BC-%ED%81%AC%EB%A1%A0-%ED%91%9C%ED%98%84%EC%8B%9D.html)


# 스프링에서 잡 스케줄러 종류
스프링에서 사용할 수 있는 잡 스케줄러는 스프링 스케줄러와 쿼츠가 있습니다.
스프링 스케줄러 : [https://spring.io/guides/gs/scheduling-tasks/
쿼츠 스케줄러 : [http://www.quartz-scheduler.org/
둘에대한 특별한 장/단점을 찾지 못하여 편하게 쓸 수 있는 스프링 스케줄러로 설명을 하겠습니다.


# 스프링 스케줄러 예제
- @EnableScheduling 로 스케줄러를 사용한다고 선언합니다.
``` java
@Configuration
@EnableScheduling
class SchedulingConfiguration {
}
```
- 잡을 만들어보겠습니다.
``` java
@Service
public class TSchedule {
	@Scheduled(cron="0/10 * * * * ?")
	public void execute() {
		System.out.println("10초마다 출력");
	}
}
```
- 결과 : 10초마다 "10초마다 출력"이 표시됩니다.


# 실무 이용시 팁
### 1. 잡(배치)를 직접 실행해야하는 경우.
- 일반적으로 배치가 돌다가 오류가 났는데, 급하게 다시 돌려야하는 배치의 경우입니다.
@Service 를 붙여 만들었기 때문에 단순히 @Autowired 로 사용합니다.
``` java
@Autowired TSchedule tSchedule;

@RequestMapping("/admin/job/TSchedule")
String tSchedule() {
	tSchedule.execute();
	// ... 생략
}
```
바로 @Autowired 하여 동일하게 실행시킬 수 있습니다.
### 2. 개발하는 배치를 제외하고는 돌릴 수 없거나(환경부재) 돌리면 안되는 경우.
개발서버에선 해당 잡을 받아줄 연계장치가 없거나 쓸대없이 돌면 안되는 경우가 있습니다. (특히 로컬)
이런경우는 아래와 같이 처리할 수 있습니다.
##### 2-1. 모든 잡 스케줄러 제거 (덮어쓰기)
``` java
@Configuration
@EnableScheduling
class SchedulingConfiguration implements SchedulingConfigurer {
	@Override
	public void configureTasks(ScheduledTaskRegistrar taskRegistrar) {
		if (로컬? 개발서버?) {
			// set 을통해 기존 설정을 모두 날려버렸습니다.
			taskRegistrar.setCronTasksList(Collections.emptyList());
		}
	}
}
```
그리고 직접 실행합니다.
다만 개발중에도 몇분에 한번씩 돌아야하는 경우가 있습니다.
##### 2-2. 수동으로 추가하기 (덮어쓰기)
- 물론 제대로 하려면 이 부분은 별도로 빼둬야할 것 같습니다.
``` java
@Configuration
@EnableScheduling
class SchedulingConfiguration implements SchedulingConfigurer {
	@Autowired TSchedule tSchedule;

	@Override
	public void configureTasks(ScheduledTaskRegistrar taskRegistrar) {
		if (로컬? 개발서버?) {
			// 리스트 생성
			List<CronTask> list = new ArrayList<>();

			// @Autowired tSchedule 를 직접 넣어주고 시간도 재설정
			// 물론 리플렉션을 통해 시간을 가져올 수도있지만 보통 로컬에서
			// 따로 돌릴 정도면 기존의 시간을 쓰지않는 경우가 대부분이라
			// 이렇게 설정했습니다.
			list.add(new CronTask(() -> tSchedule.execute(), "0/5 * * * * ?"));

			// 모든 스케줄 덮어쓰기
			taskRegistrar.setCronTasksList(list);
		}
	}
}
```