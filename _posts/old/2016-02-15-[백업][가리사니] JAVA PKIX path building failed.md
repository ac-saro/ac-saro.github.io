---
layout: post
tags: [certificate]
---

> 이 문서는 가리사니 개발자 포럼에 올렸던 글의 백업 파일입니다.
오래된 문서가 많아 현재 상황과 맞지 않을 수 있습니다.


``` java
javax.net.ssl.SSLHandshakeException: sun.security.validator.ValidatorException: PKIX path building failed: sun.security.provider.certpath.SunCertPathBuilderException: unable to find valid certification path to requested target
	at sun.security.ssl.Alerts.getSSLException(Unknown Source)
	at sun.security.ssl.SSLSocketImpl.fatal(Unknown Source)
	at sun.security.ssl.Handshaker.fatalSE(Unknown Source)
	at sun.security.ssl.Handshaker.fatalSE(Unknown Source)
	at sun.security.ssl.ClientHandshaker.serverCertificate(Unknown Source)
	at sun.security.ssl.ClientHandshaker.processMessage(Unknown Source)
	at sun.security.ssl.Handshaker.processLoop(Unknown Source)
	at sun.security.ssl.Handshaker.process_record(Unknown Source)
	at sun.security.ssl.SSLSocketImpl.readRecord(Unknown Source)
	at sun.security.ssl.SSLSocketImpl.performInitialHandshake(Unknown Source)
	at sun.security.ssl.SSLSocketImpl.startHandshake(Unknown Source)
	at sun.security.ssl.SSLSocketImpl.startHandshake(Unknown Source)
	at sun.net.www.protocol.https.HttpsClient.afterConnect(Unknown Source)
	at sun.net.www.protocol.https.AbstractDelegateHttpsURLConnection.connect(Unknown Source)
	at sun.net.www.protocol.https.HttpsURLConnectionImpl.connect(Unknown Source)
```

인터넷에 보면 위 오류가 날 경우 아래와 같은 코드로 해결하라고 합니다.
``` java
private static TrustManager[] getTrust()
{
	return new TrustManager[] { new X509TrustManager()
	{
		public java.security.cert.X509Certificate[] getAcceptedIssuers() { return null; }
		public void checkClientTrusted(java.security.cert.X509Certificate[] certs, String authType) {}
		public void checkServerTrusted(java.security.cert.X509Certificate[] certs, String authType) {}
	}};
}
```

# 하. 지. 만.
그냥 봐도 알 수 있듯이 오류가 날 수 없는 빈 TrustManager[] 를 만들어 모든 인증서를 신뢰해버리게 만드는 방법입니다.
즉, 중간자(해커)가 마음먹고 중간자 공격을 하면 중간 도청을 할 수 있습니다.
이 문제를 해결 하기 위해서는 일단 위 오류가 왜 생기는지 알아야 합니다.

# 왜 이런 오류가 생기는 걸까?
우리가 SSL/TLS(이하 SSL) 사이트를 접속할 때 신뢰할 수 있는 기관의 정보가 저장된 장소는 그 사이트를 이용하는 브라우저(IE나 사파리 처럼 운영체제에 보관하고 브라우저가 꺼내쓰는 경우가 있지만 브라우저라고 표현하겠습니다.)에 있습니다.
때문에 브라우저마다 신뢰할 수 있는 기관이 조금씩 다른 부분이 있으며, 많은 브라우저에서 신뢰할 수 있는 기관으로 등록된 기관일 수록 인증서 발급비가 비싼편입니다.
(이 문제는 예를들어 익스 11이나 크롬등에는 신뢰할 수 있는 기관으로 등록되어있는데 익스 7에는 그렇게 등록되어있지 않다면.. 더 많은 사람이 이용할 수 없기에)
문제는 이 기관의 정보가 브라우저마다 다르다는 점입니다. 그리고 **자바 또한 신뢰할 수 있는 인증기관 리스트를 별도**로 보관하고 있습니다.

## 즉 문제가 생기는 경우는 두 가지 경우가 있습니다.
1. 애초에 신뢰할 수 있는 기관을 통해 발급 된 인증서가 아니다. (이 경우도 해결법을 아래에 적어두었습니다.)
2. 대중적으로는 신뢰할 수 있는 기관이지만 자바엔 그 기관이 등록되어 있지 않다.

1번의 경우에는 그렇다고 하지만.. 2번의 경우에는 조금 골치 아픈 경우입니다.
예를들어 StartSSL 이 2번의 경우에 속합니다.

2016년 02월 15일 기준 StartSSL 는 아래와 같은 브라우저(거의 대부분의 메이저 브라우저)를 지원해주지만 (참고:https://forum.startcom.org/viewtopic.php?f=15&t=1802)
Operating Systems:
Microsoft Windows - Windows XP+ (2001-10-25). Support started on 2009-09-21, but since then it works even on a fresh Windows XP without any updates (http://technet.microsoft.com/en-us/libr ... 51157.aspx)
Apple Mac OS - Mac OS X 10.5 Leopard+ (2007-10-26)
Linux - No system root store (https://wiki.mozilla.org/NSS_Shared_DB_And_LINUX)
Web browsers:
Mozilla Firefox - 2.0+ (2006-10-24) based on Mozilla Gecko 1.8.1+ (https://bugzilla.mozilla.org/show_bug.cgi?id=338552, http://www.mozilla.org/projects/securit ... /#StartCom)
Microsoft Internet Explorer - depends on OS
Apple Safari - depends on OS
Google Chrome/Chromium/Iron/RockMelt/Flock - depends on OS (on Linux it uses the Mozilla NSS, so yes http://code.google.com/p/chromium/wiki/ ... Management)
Opera - 9.5+ (2008-06-12) since then it accesses the online root store where the certificate was added on 2010-07-28.
Ephiphany - 2.16+ (2006-09-25) based on Mozilla Gecko 1.8.1+
Camino: - 1.5+ (2007-06-05) based on Mozilla Gecko 1.8.1+
K-Meleon 1.1+ (2007-05-22) based on Mozilla Gecko 1.8.1+
SeaMonkey - 1.1+ (2007-01-18) based on Mozilla Gecko 1.8.1+
Flock - 0.9+ (2007-07-10) based on Mozilla Gecko 1.8.1+
Netscape Navigator - 9.0 (2007-10-15) based on Mozilla Gecko 1.8.1+
Sleipnir - ??? based on Trident or Gecko
Lunarscape - ??? based on Trident, WebKit or Gecko
Avant Browser - depends on OS (based on Internet Explorer)
SlimBrowser - depends on OS (based on Internet Explorer)
Maxthon/MyIE2 - depends on OS (based on Internet Explorer)
GreenBrowser - depends on OS (based on Internet Explorer)
Konqueror - 2006-08-02 and version 3.5.4+
...
Java Runtime Environment (JRE) - No
JAVA는 이를 지원해주고 있지않습니다.
따라서 자바에서는 오류가 나게 됩니다.


# 이와 같은 경우 해결법은 두가지가 있습니다.
1. $JAVA_HOME/jre/lib/security/ 경로 내에 존재하는 cacerts 에 인증기관의 루트CA를 추가해준다.
참고 : https://jinahya.wordpress.com/2013/04/28/installing-the-startcom-ca-certifcate-into-the-local-jdk/
하지만 이 경우 자바가 업그레이드 되거나 서버끼리 통신하기에 중간자를 차단해야하는 특수한 경우가 아닌 **일반 사용자를 대상으로 배포할 경우** 문제가 생깁니다.
2. 루트CA를 jks같이 인식가능한 포멧으로 변환하고  TrustManager[]를 만들어 줍니다.
루트CA를 클라이언트에 같이 배포하는 방식이 됩니다.
예를들면 이런식으로 만들 수 있습니다.
``` java
KeyStore keyStore = KeyStore.getInstance("JKS"); // 지원하는 다른 타입이 있을 수 있다면 해당 타입으로 변환시켜도 됩니다.
TrustManagerFactory trustManagerFactory = TrustManagerFactory.getInstance("SunX509");
trustStore.load(new FileInputStream("루트CA 경로"), "암호");
trustManagerFactory.init(trustStore);

TrustManager[] trustManager = trustManagerFactory.getTrustManagers();
// 이렇게 만들어진 것을 위 무조건 통과하는 방식이 쓰였던 방식처럼 아래와 같이 넣어주시면됩니다.
sslContext.init(null, trustManager, null);
```
이렇게 해결!


# 애초에 신뢰할 수 있는 기관을 통해 발급 된 인증서가 아닌경우.
위에서 1번으로 설명한 방법입니다.
SSL을 만들겠다고 무조건 비싼 돈 주고 인증서를 살 수도 없고.... 이 경우에는 직접 루트CA를 만들어주면됩니다.
참고 : https://docs.oracle.com/cd/E19509-01/820-3503/6nf1il6er/index.html
위에 나온 것 과 같이 RootCA를 만들어 준 후 바로 위 TrustManager[] 를 만드는 소스와 같이 넣어주면됩니다.
이렇게 해결!
보다 자세한 트러스트 만드는법은 [/lab?topicId=182](/lab?topicId=182) 를 참조해주세요.