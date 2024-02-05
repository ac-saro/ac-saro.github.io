---
layout: post
tags: [가리사니, 기타]
---

> 이 문서는 예전 가리사니 사이트에서 작성된 문서 입니다.
현재 상황과 맞지 않을 수 있습니다.


필자는 dean 계열 ( http://dean.edwards.name/packer/ )의 자바스크립트 압축기를 좋아하기 때문에 이 소스를 자바로 구현한 jPacker 를 사용하고 있었습니다.
대표적으로 라온( https://dev.saro.me/raon/#m=home ) 이 있죠 (홍보임!!)

하지만 어떤 상황이나 용량이 많은경우 또 특이한경우 jPacker 는 오류와 함께 작동을 하지 않습니다. 그리고 불행이도... 이번 라온 작업을 추가한 이후로 패킹이 되질 않고 있습니다.

참고로 저건 jPacker 의 오류이지 dean 계열의 오류는 아닙니다.
하지만 jPacker 의 경우 2010년 이후로 새로운 버전이 올라오지 않고 있습니다.

그래서 새로운 자바계열의 YUI Compressor 로 바꾸기로 했습니다.
사이트 : http://yui.github.io/yuicompressor/

사이트에서 jar 파일을 받은 후 설명서대로 실행하면되지만... 필자가 굳이 자바로된 압축기를 찾는 이유는 **라온 같은경우 20여개가 넘는 .js 파일을 하나로 묶어서 소스버전과 압축버전**을 만들게 되는데 매번 수작업으로 하기 힘들기 때문에 이클립스에서 작업하면서 고친 후 실행을 누르면 원하는 폴더들에 모두 적용할 수 있게 하기 위함입니다.
``` java
ArrayList<String> packPath = new ArrayList<String>();
ArrayList<String> unpackPath = new ArrayList<String>();

packPath.add("<경로1>/raon.min.js");
packPath.add("<경로2>/raon.min.js");
packPath.add("<경로3>/raon.min.js");
packPath.add("<경로4>/raon.min.js");
packPath.add("<경로5>/raon_"+VER+".min.js");
unpackPath.add("<경로6>/raon_"+VER+".src.js");
```
(쉬운 설명을 위한 예제입니다.)


# 사용법 예제
``` java
import com.yahoo.platform.yui.compressor.JavaScriptCompressor;
```
``` java
JavaScriptCompressor jsc = new JavaScriptCompressor(new StringReader(unpack), new ErrorReporter()
{
	@Override
	public void warning(String arg0, String arg1, int arg2, String arg3, int arg4)
	{
		// TODO Auto-generated method stub

	}
	@Override
	public EvaluatorException runtimeError(String arg0, String arg1, int arg2, String arg3, int arg4)
	{
		// TODO Auto-generated method stub
		return null;
	}
	@Override
	public void error(String arg0, String arg1, int arg2, String arg3, int arg4)
	{
		// TODO Auto-generated method stub

	}

	Writer sw = (Writer)new StringWriter();
	jsc.compress(sw, linebreak, munge, verbose, preserveAllSemiColons, disableOptimizations);
});
```
JavaScriptCompressor.compress(...) 의 옵션에 대한 설명은 위 사이트 메인에서 확인할 수 있으며 필자가 실험한 결과.
out : 아웃... 설명이 필요하지 않습니다. 하하..;;
linebreak : 몇번째에서 개행을 할것인가 전 -1을 선택했습니다. 사이트에 이에 관련한 문구가 적혀있으니 한번 읽어보세요.
munge : 변수들에 대한 이름을 바꿉니다. 자바스크립트에서 사람들이 흔히 하는 실수인.. 지역변수를 함수내에서 사용한다던지 하는 실수를 하지 않았다면 사용하지 않는것이 용량상 훨씬 더 좋습니다.
verbose : 각종 출력 : 사용하나 하지않나 그냥 출력이 되는것이라... ErrorReporter 를 잘 오버라이드 하셨다면 켜는것을 추천합니다.
preserveAllSemiColons : 세미콜론 모두표시 : false 추천
disableOptimizations : false 추천..... 사실 별로 차이는 안나지만요..
jsc.compress(sw, -1, true, false(오류출력임으로 상관없음), false, false); 가 가장 압축률이 높은 것 같습니다.

# 총평
122116 byte 의 라온 소스를 압축한결과
dean  packer : 43730 byte
yuicompressor : 64206 byte
사실 dean 계열 보다 압축률이 떨어지긴 합니다.
압축된 소스를 보니 변수명치환 기능이 **압축보단 완벽하게 작성하지 않아도 오류가 나지 않도록 하는것을 우선**으로 한 것 같습니다.
dean 계열의 경우 변수명을 바꾸는 옵션을 줄 경우 함수내 변수를 독립적으로 완전히 관리하지 않으면 오류가 발생하기에.. 사람들이 꺼리는 옵션이지만.. yuicompressor 같은 경우 상당히 느슨하게 변경함으로써 문법이 완벽하지 않은 자바스크립트 소스에서도 안전성이 높습니다.
(물론 필자는 자스문법을 관리해가면서 작성했기에 이부분이 단점이지만... 대량의 자바스크립트를 오류없이 압축한다는 점에서 만족합니다.)
~~yuicompressor 쪽에선 dean 에 라이벌 의식을.. 갖고있는지 메인페이지에 dean 에 관련된 것도 나오고 있습니다. 하하하하...~~