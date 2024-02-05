---
layout: post
tags: [eclipse, java]
---

> 이 문서는 가리사니 개발자 포럼에 올렸던 글의 백업 파일입니다.
오래된 문서가 많아 현재 상황과 맞지 않을 수 있습니다.


메이븐을 통한 배포시에 아래와 같은 오류가 날경우.
No compiler is provided in this environment. Perhaps you are running on a JRE rather than a JDK?

# 원인
메이븐은 jre가 아닌 jdk를 인식시켜줘야합니다.

# 해결법
- 이클립스의 Window -> Preferences 로 이동.
- 검색창에 Installed JREs 를 검색해서 Installed JREs 로 진입.
- jre 제거.
- Add -> Standard VM -> NEXT -> JRE home 부분의 -> Directory... 클릭
- JDK 의 위치를 찾아준다.
(예 1.8.0_92 버전 윈도우 기준 : C:\Program Files\Java\jdk1.8.0_92)
- Finish
- 방금 추가한걸 체크한다.
- OK
- 이제 이클립스 상단바 ▶(run) 의 ▼ 를 눌러 Run Configurations 클릭
- 오류가 났던 Maven 배포를 선택.
- JRE 탭으로 이동.
- Workspace default JRE (~~~) 선택 -> run