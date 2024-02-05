---
layout: post
tags: [가리사니, 기타]
---

> 이 문서는 예전 가리사니 사이트에서 작성된 문서 입니다.
현재 상황과 맞지 않을 수 있습니다.


# 원문 :
[http://www.zdnet.com/article/mozilla-to-chinas-wosign-well-kill-firefox-trust-in-you-after-mis-issued-github-certs/

# 번역본 :
[http://blog.alyac.co.kr/820

# 요약
- 2016년 이 후 발급된 인증서는 SHA-1 일 경우 안전하지 않음으로 판단.

		WoSign은 SHA-1로 발급하면서 고의로 2015년에 발급한 것처럼 발급하여 우회.

- WoSign은 StartCom(StartSSL)을 인수.

		동일 시스템으로 발급한다고 함.

- 모질라는 1년간 WoSign의 CA 인증을 중단하고 1년 후 개선되면 다시 승인 예정임.

- 모질라의 StartSSL 에 대해선 아직 구체적으로 안나온 것 같습니다..

		하지만 이대로라면 모질라는 StartSSL 에 대한 축출을 제안할 것 같습니다.. (WoSign이 2개의 CA를 운영 : 규정위반)

# 추신
사로, 가리사니는 새로 나온 무료 인증서인 Let's Encrypt 로 갈아탑니다.