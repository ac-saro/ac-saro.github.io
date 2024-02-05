---
layout: post
tags: [가리사니, 기타]
---

> 이 문서는 가리사니 개발자 포럼에 올렸던 글의 백업 파일입니다.
오래된 문서가 많아 현재 상황과 맞지 않을 수 있습니다.

```
flutter docker
```
![설명](/file/forum/10d80c09-2322-4ee4-8700-f7125117bb29.png)


https://developer.android.com/studio/command-line


![설명](/file/forum/1fc62e4b-3195-4bf9-874c-9d5b3ee07a1e.png)

안드로이드 스튜디오에서 SDK설치 위치를 알아보자.

![설명](/file/forum/08c9018f-83c0-4f05-8799-f6c42d86e779.png)

```
이동
필자의경우 SDK의 설치위치는 C:\Users\saro\AppData\Local\Android\Sdk 이다.
commandlinetools-win-9477386_latest\cmdline-tools -> SKD설치위치\cmdline-tools
```
sdkmanager --install "cmdline-tools;latest" --sdk_root=SDK설치위치


```
flutter doctor --android-licenses
```

```
flutter doctor
```

![설명](/file/forum/6d162689-262f-4219-89ed-05b2c74bd6db.png)

드디어 flutter 설정이 완료되었다.

그럼 본격 프로젝트를 만들어보자.