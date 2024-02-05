---
layout: post
tags: [java, maven]
---

> 이 문서는 가리사니 개발자 포럼에 올렸던 글의 백업 파일입니다.
오래된 문서가 많아 현재 상황과 맞지 않을 수 있습니다.


보통 서블릿이나 스프링등에서 메이븐을 사용하신다면, 서버에 메이븐 디플로이 할때 별도의 작업없이 서버쪽도 적용되기 때문에 별 문제가 없지만,
최근 단일 파일로 뽑아야할 일이 생겨 추가된 dependency 의 jar를 포함하여 빌드해야할 일이 생겼습니다.


# 아래와같이 빌드를 구성해주시면됩니다.
``` xml
<build>
	<plugins>
		<!-- dependency 들을 모두 포함하기위한 -->
		<plugin>
			<artifactId>maven-assembly-plugin</artifactId>
			<version>2.6</version>
			<configuration>

				<descriptorRefs>
					<descriptorRef>jar-with-dependencies</descriptorRef>
				</descriptorRefs>

				<!-- 이건 그냥 jar의 메인 클래스 지정하는것입니다. -->
				<!-- 그냥 올려봤습니다... -->
				<archive>
					<manifest>
						<mainClass>패키지를 포함한 클래스 전체이름</mainClass>
					</manifest>
				</archive>
			</configuration>

			<executions>
				<execution>
					<id>make-assembly</id>
					<phase>package</phase>
					<goals>
						<goal>single</goal>
					</goals>
				</execution>
			</executions>
		</plugin>

		<!-- 자바 버전을 1.8로 / 문자셋을 utf-8로 고정하기 위한 -->
		<plugin>
			<groupId>org.apache.maven.plugins</groupId>
			<artifactId>maven-compiler-plugin</artifactId>
			<configuration>
				<source>1.8</source>
				<target>1.8</target>
				<encoding>UTF-8</encoding>
			</configuration>
		</plugin>
	</plugins>

</build>
```

# 같이보기
 - [로컬 디스크의 jar를 메이븐에 포함하기](/lab?topicId=250)