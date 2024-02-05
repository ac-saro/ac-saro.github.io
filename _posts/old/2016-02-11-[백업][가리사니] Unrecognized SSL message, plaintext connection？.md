---
layout: post
tags: [가리사니, 기타]
---

> 이 문서는 가리사니 개발자 포럼에 올렸던 글의 백업 파일입니다.
오래된 문서가 많아 현재 상황과 맞지 않을 수 있습니다.


javax.net.ssl.SSLEngine 를 사용한 SSL 통신시에 날 수 있는 오류입니다.
정확히 받은 ByteBuffer를 unwrap 하는 과정에서 문제가 생긴 오류입니다.
``` java
javax.net.ssl.SSLException: Unrecognized SSL message, plaintext connection?
        at sun.security.ssl.EngineInputRecord.bytesInCompletePacket(Unknown Source)
        at sun.security.ssl.SSLEngineImpl.readNetRecord(Unknown Source)
        at sun.security.ssl.SSLEngineImpl.unwrap(Unknown Source)
        at javax.net.ssl.SSLEngine.unwrap(Unknown Source)
```

이 것 때문에 고생 좀 했네요... 하하하...;;

실제 오류는 받은 쪽의 case NEED_UNWRAP: 에서 오류가 발생하지만 보내기 전에 한단계를 누락시켜버렸습니다.
그래서 아래와 같이 NEED_UNWRAP 이 아닌 NEED_WRAP 부분을 고치셔야합니다.
``` java
case NEED_WRAP :
encryptBuffer.clear();
...
res = engine.wrap(hsSendMsg, encryptBuffer);
...
channel.write(encryptBuffer, ......
```

어이없을 정도로 단순하지만 javax.net.ssl.SSLEngine.wrap 이 flip까지 해주는 것은 아니기 때문에 encryptBuffer 에 flip 과정이 필요합니다.
보다 자세한 이유는 바이트 버퍼 [/lab?topicId=176](/lab?topicId=176) 를 참조하세요.
``` java
case NEED_WRAP :
...
res = engine.wrap(hsSendMsg, encryptBuffer);
...
decryptBuffer.flip();
...
channel.write(encryptBuffer, ......
```


# 추신
비동기 논블로킹 시스템콜 SSL 에서 핸드쉐이킹 구현할때 평소에는 시스템콜을 쓰더라도 핸드쉐이킹 구간만큼은 그냥 일반적인 논블록킹 while 처리해주는게.. 정신건강에 매우 좋습니다. 저도.. 이 구간을 구현하다 도데체 이런식으로 프로그래밍을 하는 사람이 있을까 싶어서 아파치의 SSL 웹소켓 오픈소스를 까봤는데... 이 부분 만큼은 그냥 while (논블록킹) 처리를 해버립니다.