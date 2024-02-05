---
layout: post
tags: [가리사니, 기타]
---

> 이 문서는 가리사니 개발자 포럼에 올렸던 글의 백업 파일입니다.
오래된 문서가 많아 현재 상황과 맞지 않을 수 있습니다.


가리사니의 속도 개선 좀 할겸 만들어둔 라온 자바스크립트 라이브러리 속도개선을 하려는 도중 갑자기 생각난것중에..  for 문이 빠를까 some 이 빠를까.. 라는 의문이 들기 시작했습니다.
보통은 for가 더 빠를 것 같지만.. 스크립트다보니.. for는 스크립트에의해.. some은 네이티브에 의해 처리된다는 것을 생각해봤을때 some이 더 빠를 수 있을 것 같아 실험해보았습니다.

# 추가 : 2015-10-04
Array.prototype.some 외에도
Array.prototype.reduce 를 추가하였습니다.

# 코드
``` java
// 기본값 세팅
var a = [];
var t = 0;
for (var i = 1 ; i <= 1000000 ; i++) { a.push(i); }

// for의 시간측정
t = new Date().getTime();
for (var i = 0 ; i < a.length ; i++)
{
	if (a[i] == 1000000) {  console.log('done'); }
}
console.log('f1-time : ' + (new Date().getTime() - t));

// for의 시간측정 : 내부가 비어있을때.
t = new Date().getTime();
for (var i = 0 ; i < a.length ; i++) {}
console.log('f2-time : ' + (new Date().getTime() - t));


// some의 시간측정 : done를 넣은건 함수를 인자로 넣다보니.. 혹시 쓰레드로 돌지 않을까 라는 생각에 넣어본겁니다.
// 자바스크립트에선 new 하는것들은 죄다 쓰레드로 돌고, 몇몇 네이티브는 쓰레드로 돌아서... 혹시나 하는 마음에....
t = new Date().getTime();
a.some(function(e)
{
	if (e == 1000000) {  console.log('done'); }
});
console.log('s1-time : ' + (new Date().getTime() - t));

// some의 시간측정 : 내부가 비어있을때.
t = new Date().getTime();
a.some(function(e){});
console.log('s2-time : ' + (new Date().getTime() - t));


// reduce의 시간측정 : done를 넣은건 some과 마찬가지..이유.
t = new Date().getTime();
a.reduce(function(d, e)
{
	if (e == 1000000) {  console.log('done'); }
});
console.log('r1-time : ' + (new Date().getTime() - t));

// reduce의 시간측정 : 내부가 비어있을때.
t = new Date().getTime();
a.reduce(function(d, e){});
console.log('r2-time : ' + (new Date().getTime() - t));
```


# 결과
done
f1-time : 1238
f2-time : 831
done
s1-time : 17
s2-time : 15
done
r1-time : 26
r2-time : 14


# 결론
역시 네이티브가 빠릅니다.!!
다만 some / reduce 는 IE9 부터 지원됩니다.

some / reduce 의 속도차이는.. 무의미합니다.
다만 동작의 차이라고 볼 수 있는데요.
``` java
Array.prototype.some -> function(nowVal:현재값, idx:인덱스, array:전체배열)
{
	//return false; 를 사용할 경우 정지함.
}
Array.prototype.reduce-> function(lastReturnValue:마지막리턴값, nowVal:현재값, idx:인덱스, array:전체배열)
{
	// return 값; 이렇게 쓸경우 마지막 값이 다음 콜백의 첫번째 인자로 반환됨.
	// lastReturnValue : 최초의 값이나 리턴이 없을 경우 undefined 가 리턴됨.
	// ┗ 물론 ([1,2,3]).reduce(functin, 최초의값); 이런식으로 최초의 값을 줄 수있다.
}
```


# 추신
라이브러리에 for를 some로 고칠 수 있는 부분들을 조금 손봐야겠네요.
IE8 이하에서 some의 대체 코드를 만들경우 for를 이용해서 만들기에 약간의 속도저하는 있지만..
사실상 제 서비스에서 IE8이하의 사용자는 적습니다. 하하하... (사실 사람이 적습니다....)
- 후기..
열심히 많이 고쳐놨는데.. 사실 효과는 없네요...
가리사니 실행추적을하니 html decoding과 insertPrev 쪽에서 가장 많이 잡아먹는거 같네요..
(둘다 네이티브 코드라... 더이상 빠르게 할수가 없네요... : 아에 다른방법을 찾지 않는이상..)
정말 초대량으로 써야 아주 약간 차이나는 정도인듯합니다.