---
layout: post
tags: [flutter, windows]
---

> 이 문서는 가리사니 개발자 포럼에 올렸던 글의 백업 파일입니다.
오래된 문서가 많아 현재 상황과 맞지 않을 수 있습니다.

> 이 버그는 2023-02-28 기준이며 현재 해결 되었을 수 있습니다.

```
flutter doctor
```
![설명](/file/forum/42e249da-a06b-4796-aa74-4f1f4e0a59d0.png)

> Windows Version (Unable to confirm if installed Windows version is 10 or greater)

위 오류가 없다면 이 장은 패스하시면 됩니다.


# 서론
필자는 윈도우 11을 사용하고 있는데 위와같은 메시지가 나오며 오류가 난다.

https://github.com/flutter/flutter/issues/117890

공식 깃 허브에 들어가니.. 이미 해당 이슈가 올라와 있다.
이미 커밋된거 같으니 C:/flutter 에가서 pull 로 당겨오자.

![설명](/file/forum/4e947308-6bee-4663-87f0-b995b88252f7.png)

```
git pull
```
![설명](/file/forum/9a2d310d-9e20-427c-9285-8fa60291f255.png)

뭔가 이상하다...

https://github.com/flutter/flutter/issues/117890
- 다시 들어가서 읽어보니.. 아직 stable (현재 브랜치)에 push 하지 않았다.
- 마스터에는 적용한 걸로 보니 급한대로 master 브랜치를 이용하기로 한다.


git checkout master

![설명](/file/forum/5529e061-82a7-4931-bb2e-3ce914464602.png)


```
flutter docker
```
![설명](/file/forum/10d80c09-2322-4ee4-8700-f7125117bb29.png)


Windows 11 버전 문제가 해결되었다.. 
여러분이 사용할 때 이 문제는 해결되었길 바란다.