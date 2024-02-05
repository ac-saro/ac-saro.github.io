---
layout: post
tags: [lwjgl, java]
---

> 이 문서는 가리사니 개발자 포럼에 올렸던 글의 백업 파일입니다.
오래된 문서가 많아 현재 상황과 맞지 않을 수 있습니다.


1. 한글을 인식할 수 있는 폰트로 폰트를 바꿉니다.
2. 유니코드 예외처리를 합니다. (기본값으로.. 아스키코드를 넘어가는 모든 글자는 로드가 되어있지않아 수동으로 로드를 해주셔야합니다.)

org.newdawn.slick.TrueTypeFont 을 사용할 경우.
``` java
TrueTypeFont .drawString(x, y, whatchars, color, startIndex, endIndex);
```
마지막 두인자로 아스키 코드 외 스트링을 로드할 수 있습니다.

org.newdawn.slick.UnicodeFont.UnicodeFont 를 사용할 경우.
``` java
UnicodeFont .addGlyphs(1, 65536);
```
두인자로 아스키 코드 외 스트링을 로드할 수 있습니다.
하지만 저렇게 대량으로 로드할 경우 엄청난 시간과 자원이 들어가니 (필자컴퓨터로 2초정도)
``` java
UnicodeFont .addGlyphs(text);
```
위 함수를 통해서 사용하고싶은 텍스트를 미리 넣어주는 것도 나쁘지않습니다.
또한 유니코드를 쓰기위해선
``` java
UnicodeFont .getEffects().add(new ColorEffect(색상));
```
을 한번 써줘야 쓸 수 있습니다.
- 지정된 이펙트가 1개도 없다며 오류를 냄!

위처럼 하면 각종 폰트를 통해 부드럽게 그림을 텍스트를 넣을 수 있습니다.


추신.
추석에.. 음..;; LWJGL 의 한글 처리가.. 자바의 이점을 살려서 한글 처리좀 쉽게하려고... 한건데.. 안되서 Slick을 해보지만... Slick의 org.newdawn.slick.gui.TextField.TextField 는 폰트를 설정해주더라도 한글입력자체가 안됩니다. (아에 addGlyphs 같은 메서드가 없습니다. 그냥 만들어 써야할거같네요..)
~~시간이 많다면... LWJGL  공들여서 만들거 같긴한데 ㅠㅠ.. 당장 이직해야하는 백수라 ㅠㅠ..;; (내 소중한 하루...)~~
결론!
**LWJGL, Slick 의 성능은 매우 뛰어나지만**.. 한글처리가 좀 부족한 경향이 있어서 ime부터는 ... 단기간 프로젝트(1주 ~ 1개월)를 생각한다면 다른 라이브러리 / 프레임워크를 추천드립니다.