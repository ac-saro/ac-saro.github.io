---
layout: post
tags: [가리사니, 기타]
---

> 이 문서는 가리사니 개발자 포럼에 올렸던 글의 백업 파일입니다.
오래된 문서가 많아 현재 상황과 맞지 않을 수 있습니다.


properties에서 유니코드를 지원하는 Simple Properties Editor를 설치해보도록 하겠습니다.


# 마켓 플레이스 설치
1. Help ->  Install new Software
2. http://download.eclipse.org/releases/<버전> 을 선택합니다.
3. Marketplace Client 를 설치합니다.


# Simple Properties Editor 다운로드
1. Help ->  Eclipse Marketplace...
2. "Simple Properties Editor" 를 검색합니다.
3. 다운로드 (글쓴시점에서 최신버전은 Simple Properties Editor 1.0.5)


# Simple Properties Editor 사용설정
1. Window -> Preferences
2. "File Associations" 를 검색 선택 합니다.
3. "*.properties" 를 선택하고 "SimplePropertiesEditor" 를 Default 로 바꿔줍니다.
- 이제  properties 파일을 열면 유니코드가 깨지지 않고 나옵니다.