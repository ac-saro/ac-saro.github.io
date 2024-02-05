---
layout: post
tags: [jsp, spring, java]
---

> 이 문서는 가리사니 개발자 포럼에 올렸던 글의 백업 파일입니다.
오래된 문서가 많아 현재 상황과 맞지 않을 수 있습니다.



참고
http://docs.spring.io/autorepo/docs/spring/3.2.x/spring-framework-reference/html/mvc.html
http://stackoverflow.com/questions/20704023/in-a-mvc-architecture-can-the-view-access-the-model
http://www.devmanuals.com/tutorials/java/struts/struts2/MVC1vsMVC2.html
http://www.tutorialspoint.com/spring/spring_web_mvc_framework.htm

MVC 는 프로그래밍 아키텍처이지만 이 강의는 JavaEE 중점으로 작성되었습니다.



# MVC 패턴
![](/file/old/131.gif)
View
- HTML등 최종 템플릿 엔진에 의해 보여질 말그대로 뷰.
- 컨트롤러에의해 모델과 최종 랜더되어 유저에게 전송될 코드가된다.
Model
- DB에 직접적으로 걸치는 부분.
- 비즈니스로직 또한 모델에 속한다.
Controller
- 요청을 받아 해당하는 모델을 불러와 뷰로 보낸다.


# MVC 패턴의 흐름
![](/file/old/132.gif)
1. 브라우저로부터 요청을 받는다.
- 스프링이라면 많은 부분이 DispatcherServlet 가 전체를 관통하는 통로로써 역활.
2. 해당하는 컨트롤러 실행 (생성되지 않았다면 생성 후 실행)
3. 해당하는 모델을 가져온다.
- 그림에서 생략된부분 대부분의 모델은 DB로부터 데이터를 가져와서 조합.
4. 뷰를 참조하여 렌더
5. 최종 결과물을 요청한 브라우저에 응답(반환)한다.