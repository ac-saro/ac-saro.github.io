---
layout: post
tags: [가리사니, 기타]
---

> 이 문서는 예전 가리사니 사이트에서 작성된 문서 입니다.
현재 상황과 맞지 않을 수 있습니다.


# 서론
해당 문제는 빌드/테스트 및 디플로이까지 모두 통과 했지만 문제가 발생하는 경우입니다.

# 1. 빌드 소스가 서버에 적용되지 않은 경우
톰켓 server.xml 의 host 에는 autoDeploy 값이 있습니다.
``` java
<Host name="호스트" appBase="베이스" unpackWARs="true" autoDeploy="true"></Host>
```
- 보통 실무에서는 자원문제 때문에 꺼두는 값입니다.
- 때문에 실무에서는 디플로이 이후 was를 재시작합니다.
플로우는 아래와 같습니다.
- 빌드 영역
1. 사용자/서버(예:젠킨스)가 빌드를 실행
2. 디팬던시를 확인 (없으면 새로 받아옵니다.)
3. 빌드시작
4. 테스트 성공
5. was에 배포파일 (war/jar) 전송
- was 영역
1. (war/jar) 전송 받음
2. 명령에 따라 deploy / redeploy 등의 작업을 합니다.
- 즉, 해당 위치에 디플로이 시킴.
- 문제 : autoDeploy 가 꺼져있는 경우 was는 기존 버전을 동작시킴으로 적용되지 않습니다.
- autoDeploy 가 꺼저있는 경우는 was를 재시작 시킵니다.
# 상용서버가 아니라면 autoDeploy 를 켜서 작업하는 것도 나쁘지 않다고 생각합니다.


# 2. 빌드 소스를 찾지 못하거나 잘 못 찾은 경우 (404)
아래와 같이 직접 빌드소스를 잡아줍니다.
``` java
@SpringBootApplication
public class Application extends SpringBootServletInitializer
{
	public static void main(String[] args)
	{
		SpringApplication.run(Application.class, args);
	}

	protected SpringApplicationBuilder configure(SpringApplicationBuilder builder)
	{
		return builder.sources(Application.class);
	}
}
```