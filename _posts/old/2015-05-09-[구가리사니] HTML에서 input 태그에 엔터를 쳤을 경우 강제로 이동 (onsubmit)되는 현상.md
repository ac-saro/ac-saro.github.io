---
layout: post
tags: [가리사니, 기타]
---

> 이 문서는 예전 가리사니 사이트에서 작성된 문서 입니다.
현재 상황과 맞지 않을 수 있습니다.


예전에는 상식과도 같은 거였지만.. 요즘은 비동기를 많이 써서 그런지 종종 모르는사람이 많아 놀랐던 팁입니다.

브라우저마다 규칙이 약간 다르긴하지만 어떠한 폼안에서 input 태그가 1개일 경우. 엔터등이 인식되었을때 자동으로 서브밋 하도록 되어있습니다. 요즘은 ajax등 비동기 방식이 많이 쓰이다보니 폼을 생략하는 경우가 많아 모르시는 분들이 많은 것 같아 올립니다.

``` java
<!-- a에서 엔터를 친다. : 이동이라는 alert가 뜬다. -->
<form onsubmit="alert('이동'); return false;">
	<input type="text" id="a"/>
</form>
```
위와 같은 현상이 일어나는 이유는 form안에 1개의 input 태그가 있으면 브라우저가 엔터를 첬을대 전송을 요청한걸로 인식하기 때문입니다.


``` java
<!-- b에서 엔터를 친다. : 아무일도 일어나지 않는다. -->
<form onsubmit="alert('이동'); return false;">
	<input type="text" id="a"/>
	<input type="text" id="b"/>
</form>
```


이걸로 모든게 해결된거 같지만.. 새로운 사실을 알게되었습니다.
필자는 submit버튼을 쓰지 않기 때문에 몰랐던 사실인데 submit버튼이 있을 경우 input의 갯수와 상관없이 최상단의 submit버튼을 눌러 전송합니다.
``` java
<!-- 아무 input[text]에서 엔터를 친다. : 이동이 뜬다. -->
<form onsubmit="alert('이동'); return false;">
	<input type="submit" />
	<input type="text" id="a"/>
	<input type="text" id="b"/>
</form>
```


submit버튼을 막더라도 input이 1개이면 IE8에선 전송합니다.
``` java
<!-- input[text]에서 엔터를 친다. : IE8, IE호환성모드 에선 이동이 된다. -->
<form onsubmit="alert('이동'); return false;">
	<input type="submit" onclick="return false;" />
	<input type="text" id="a"/>
</form>
```


해결법
사실 이러한 현상은 피하는게 좋지만 피할 수 없다면 아래와 같이 form이 시작되는 최상단에 _보이지 않는 input[type=text],  보이지도 동작하지도 않는 submit버튼_을 넣으면 자동으로 작동되지 않게 할 수 있습니다.
``` java
<!-- b에서 엔터를 친다. : 아무일도 일어나지 않는다. -->
<form onsubmit="alert('이동'); return false;">
	<!-- 이것은 자동이동을 막기위함이다. -->
	<div style="display:none">
		<input type="submit" onclick="return false;" />
		<input type="text"/>
	</div>

	<input type="text" id="b"/>
</form>
```