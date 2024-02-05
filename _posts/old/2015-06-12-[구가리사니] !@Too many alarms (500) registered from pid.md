---
layout: post
tags: [가리사니, 기타]
---

> 이 문서는 예전 가리사니 사이트에서 작성된 문서 입니다.
현재 상황과 맞지 않을 수 있습니다.


안드로이드에서 다음과 같은 오류가 날경우에 PendingIntent를 확인해봅니다.

``` java
intent.putExtra("id", 아이디); // 정확히는 알수없지만 req코드<번호>라고 써둔부분이 동작하지 않을 수 있다.
PendingIntent sender = PendingIntent.getBroadcast(context, 번호, intent, PendingIntent.FLAG_UPDATE_CURRENT); // 이런식으로 플래그를 줘보자.
```

FLAG_CANCEL_CURRENT : 이전에 생성을 취소하고 새롭게 만듭니다.
FLAG_NO_CREATE : 이미 생성되어있다면 재사용합니다.
FLAG_ONE_SHOT : 일회용 입니다.
FLAG_UPDATE_CURRENT : 이미 생성되어있다면 업데이트 합니다.