---
layout: post
tags: [가리사니, 기타]
---

> 이 문서는 예전 가리사니 사이트에서 작성된 문서 입니다.
현재 상황과 맞지 않을 수 있습니다.


오라클 설치 후 JAVA_HOME (혹은 bin) 위치를 넣으려고 할 때 (아마도 버전에 따라 다르지만) 32bit 버전만 가능한 경우가 있습니다.

이미 64bit를 적용시킨 경우 아래와 같은 오류가 나게 되며, 다시 입력 같은 것은 나오지 않습니다.
Unable to find a Java Virtual Machine.
To point to a location of a Java Virtual Machine, please refer to the
Oracle9i JDeveloper Install Guide (jdev\install.html).

해결법
해당 프로그램 폴더에 들어 가셔서 sqldeveloper.conf 파일을 열게되면 JAVA 경로 설정이 나오는데 이부분을 32bit JAVA경로로 수정해주시면 됩니다.