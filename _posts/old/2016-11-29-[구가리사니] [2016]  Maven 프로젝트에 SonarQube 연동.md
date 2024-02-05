---
layout: post
tags: [가리사니, 기타]
---

> 이 문서는 예전 가리사니 사이트에서 작성된 문서 입니다.
현재 상황과 맞지 않을 수 있습니다.


# Maven 세팅
pom.xml의 <build/> 사이에 아래와 같이 추가해줍니다.
``` xml
<pluginManagement>
	<plugins>
		<plugin>
			<groupId>org.codehaus.mojo</groupId>
			<artifactId>sonar-maven-plugin</artifactId>
		</plugin>
	</plugins>
</pluginManagement>
```
끝.... 매우 간단합니다.;;


# Maven 실행
아래 구문으로 실행시킵니다.
mvn clean verify sonar:sonar
예를들어 호스트나 포트를 별도로 설정하셨다면 아래와 같이 옵션을 줍니다.
(예 localhost, 1234 포트)
mvn clean verify sonar:sonar -Dsonar.host.url=http://localhost:1234

이클립스에선 아래와 같이 세팅하시면 됩니다.
(물론 localhost:9000 는 기본값 임으로 -Dsonar.host.url 옵션을 사용하지 않아도 됩니다.)
![](/file/old/187.png)


# 소나큐브 결과 확인
![](/file/old/188.png)
![](/file/old/189.png)

아래와 같이 이유와 함께 설명하고있습니다.
![](/file/old/191.png)

다만 완벽하게 잡아내는 것은 아니기 때문에 위 그림에서도 이유가 있어서 if를 썼지만 소나큐브는 이해하지 못했고 아래같은 경우는 이것이 매핑이라는 것을 걸러내지 못했습니다.
![](/file/old/192.png)


적절하게 사용한다면 좋지 않은 코드나 중복되는 것 들을 잘 찾아 낼 수 있을 것 같습니다.