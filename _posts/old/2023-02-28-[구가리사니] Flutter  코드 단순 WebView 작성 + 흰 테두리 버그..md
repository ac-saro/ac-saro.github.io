---
layout: post
tags: [가리사니, 기타]
---

> 이 문서는 예전 가리사니 사이트에서 작성된 문서 입니다.
현재 상황과 맞지 않을 수 있습니다.

## 참고 소스

https://github.com/anissia-net/schedule-mobile

New Flutter Project
![설명](/file/forum/a5748fa8-b2dd-4ce7-90d4-8be8b15f3b9b.png)

New Flutter Project 눌렀는데 왜 자바 코틀린이 나오는 걸까??
![설명](/file/forum/949f5d1c-b9b9-42be-b614-1486a26ddf45.png)

왼쪽 메뉴에서 Flutter 선택 후 아까 Flutter 를 옴긴 path 를 잡아주고
![설명](/file/forum/777f957b-ae54-49c6-9461-d4b4586b1b95.png)

적당히 입력 후 create 해주자.
![설명](/file/forum/3d220453-780e-4bc1-b31f-fa9d50ad9718.png)

필자는 단순 웹뷰를 만들 것이기 때문에 아래와 같이 작성하였다.

## pubspec.yaml (flutter의 maven 듯 하다)
```
dependencies:
  flutter:
    sdk: flutter
  webview_flutter: ^4.0.5
  url_launcher: ^6.1.10
```
webview_flutter : 웹뷰
url_launcher : 새 브라우저 열어주는 라이브러리
(필자는 모든 링크를 브라우저로 열게 만들 것이기 때문에 넣었다 반드시 필요한 건 아니다.)


## scheduleView.dart
```
import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:webview_flutter/webview_flutter.dart';

class ScheduleView extends StatefulWidget {
  @override
  ScheduleViewState createState() => ScheduleViewState();
}

class ScheduleViewState extends State<ScheduleView> {
  late final WebViewController controller = WebViewController()
    ..setJavaScriptMode(JavaScriptMode.unrestricted)
    ..loadRequest(Uri.parse('https://anissia.net/schedule/2015'))
    ..setNavigationDelegate(NavigationDelegate(
      onNavigationRequest: (navigation) {
        launchUrl(Uri.parse(navigation.url), mode: LaunchMode.externalApplication);
        return NavigationDecision.prevent;
      },
    ));

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        toolbarHeight: 0,
      ),
      body: Builder(builder: (BuildContext context) {
        return WebViewWidget(controller: controller);
      }),
    );
  }
}
```

## main.dart
```
import 'package:flutter/material.dart';
import 'package:schedule/scheduleView.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: '애니 편성표',
      home: ScheduleView(),
    );
  }
}
```

이렇게 잘 실행되는 것을 확인 후 실제 폰에서 돌려보는데..


아래처럼 뭔가 오른쪽과 아래에 흰선이 보인다.
(흰선이 안보인다면 오른쪽 위 다크모드를 켜보자.)
![설명](/file/forum/7236809d-55cf-4bd1-bde7-5a3961102bc0.png)

결국 이 현상은 AppBar의 버그 였으며..
해결 방법이 없기 때문에 AppBar를 없에고 아래처럼 status bar 만큼 패딩을 줬다.

```
class ScheduleViewState extends State<ScheduleView> {
  late final WebViewController controller = WebViewController()
    ..setJavaScriptMode(JavaScriptMode.unrestricted)
    ..loadRequest(Uri.parse('https://anissia.net/schedule/2015'))
    ..setNavigationDelegate(NavigationDelegate(
      onNavigationRequest: (navigation) {
        launchUrl(Uri.parse(navigation.url), mode: LaunchMode.externalApplication);
        return NavigationDecision.prevent;
      },
    ));

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.fromLTRB(0, MediaQuery.of(context).padding.top, 0, 0),
      child: WebViewWidget(controller: controller),
    );
  }
}
```

해결된 모습.
![설명](/file/forum/a0d3818d-b028-4552-873b-603e99bcc9c8.png)

이렇게 간단한 웹뷰 앱을 완성했다.