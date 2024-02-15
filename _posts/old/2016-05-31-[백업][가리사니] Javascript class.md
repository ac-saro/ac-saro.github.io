---
layout: post
tags: [javascript]
---

> 이 문서는 가리사니 개발자 포럼에 올렸던 글의 백업 파일입니다.
오래된 문서가 많아 현재 상황과 맞지 않을 수 있습니다.



이 문서는 ECMAScript 6 추가 기능을 서술하고 있습니다.


모질라 문서
- 모질라 문서 : https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Operators/class

참고사항
- ES 6 추가기능 : [/2016/05/25/%EB%B0%B1%EC%97%85-%EA%B0%80%EB%A6%AC%EC%82%AC%EB%8B%88-%EC%9E%90%EB%B0%94%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8-ES6-%EC%B6%94%EA%B0%80-%EA%B8%B0%EB%8A%A5%EB%93%A4.html](/2016/05/25/%EB%B0%B1%EC%97%85-%EA%B0%80%EB%A6%AC%EC%82%AC%EB%8B%88-%EC%9E%90%EB%B0%94%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8-ES6-%EC%B6%94%EA%B0%80-%EA%B8%B0%EB%8A%A5%EB%93%A4.html)
- 제네레이터 펑션 : [/2016/05/25/%EB%B0%B1%EC%97%85-%EA%B0%80%EB%A6%AC%EC%82%AC%EB%8B%88-%EC%9E%90%EB%B0%94%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8-ES-6-function-(generator-function).html](/2016/05/25/%EB%B0%B1%EC%97%85-%EA%B0%80%EB%A6%AC%EC%82%AC%EB%8B%88-%EC%9E%90%EB%B0%94%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8-ES-6-function-(generator-function).html)

# 일반적인 클래스와 상속
``` java
// class 이름
class Saro
{
	// 생성자
	constructor()
	{
		console.log('사로 생성자');
		// 프로토타입 생성자함수 처럼 동적 this 로 사용.
		this.host = 'saro.me';
	}

	// === 함수 / 함수 제네레이터와 / 프로퍼티
	// === 이 3가지는 ES 6에서 굳이 클래스가 아니더라도 이렇게 표현할 수 있는 식이 추가됨.
	// === 위 참고사항의 : ES 6 추가기능 참고.
	// 제네레이터 펑션  : 여기서 다루지 않음 : 위 참고사항 참고
	* genFunc() { /* ... */ }
	// get set 프로퍼티 : 여기서는 사용만함, 설명은 위 참고사항.
	get propertyValue()
	{
		return '호스트 : ' + this.host;
	}
	set propertyValue(host)
	{
		console.log('호스트는 바꿀수 없습니다.');
	}
	// 함수 표현
	getHost()
	{
		return this.host;
	}

	// 아래에서 상속받았을때 실험.
	getThis()
	{
		return this;
	}

	// 스테틱 함수의 경우 이렇게 사용한다.
	static staticFunction()
	{
		console.log('스테틱 함수입니다.');
	}

	out()
	{
		console.log('사로 : ' + this.host);
	}
};

// class 이름 extends 상속 : 많은 언어들의 상속과 같은 문법.
class Garisani extends Saro
{
	// 생성자
	constructor()
	{
		// 생성자의 super 는 this 가 불리기 전에 해야한다.
		super();
		console.log('가리사니 생성자');
		this.host = 'gs.saro.me';
	}

	// out 오버라이드
	// param을 쓴 이유는 인자의 길이가 동적인 자바스크립트엔
	// 오버로딩이 없다는 것을 설명하기 위함.
	out(param)
	{
		console.log('가리사니 : ' + this.host);
		console.log('상위 메서드를 불러볼까?');
		// 일반적으로도 수퍼를 사용할 수 있다.
		super.out();
	}
};

console.log('Saro 생성준비');
var saro = new Saro();
console.log('Garisani생성준비');

// super 가 불려서 saro의 생성자가 작동한 것을 볼 수 있다.
var gs = new Garisani();
console.log('모두 생성 완료');

// 출력
saro.out();
// gs.out 생성을 보면 자스엔 오버로딩이 없다는걸 보여주기위함.
// 여기서는 파라미터를 쓰지않았지만 자스에선 파라미터가 arguments 개념이다.
gs.out();

// 당연하지만 자바스크립트 상속은 스테틱도 상속한다.
Garisani .staticFunction();

console.log('각 클래스의 이름 : 덮어쓰기를 할 수 없다.');
console.log(Saro.name);
console.log(Garisani.name);

console.log('프로퍼티 기능');
console.log(saro.propertyValue);
console.log(gs.propertyValue);
gs.propertyValue = "123"; // 입력불가
console.log(gs.propertyValue);

console.log('this 를 리턴하는 함수를 상속 받으면 this 도 자동치환된다.');
gs.getThis().out();
```
# 실행결과 뭔가 이상한 점들을 발견하지 않았는가?
부모객체와 맴버변수를 공유한다.
- 보통 언어에선 부모와 맴버변수를 공유하지 않는다.
- 잘 생각해보면 자바스크립트는 var 가 만능자료형이다.
맴버변수를 공유하다보니 낯선 결과가 보인다.
- gs.out(); 실행부분을 보자 super.out(); 이 공유된 맴버번수 host를.. 부르는 특이함을 볼 수 있다...
- 마찬가지로 get set 프로퍼티도 공유된 결과를 보인다.
오버라이딩은 되지만 오버로딩은 되지 않는다.
- 자스에선 파라미터가 arguments 개념이다.
- 즉, 파라미터가 달라져도 함수 이름으로만 부르며, 이 특성은 클래스에서도 달라지지 않는다.
접근자 설정이 없다.
- 위 예제를 보면 클래스가 아닌 프로토타입의 확장처럼 느껴진다.
- 추가 : 어떤 분께서 언어에 따라 클래스에 접근자가 기능이 없는 경우도 있다고한다. - 자스의 특징이 아님.


# 그렇다면 프로토타입 처럼 함수만 호출하면 따로 바인딩을 해줘야하나?
- 바로 위 설명처럼 자바스크립트는 함수나 변수가, 다 같은 변수특성을 갖는다.
``` java
// gs.saro.me
console.log(gs.getHost());

var isMethod = gs.getHost;
// 오류발생 : 그냥 프로토타입처럼 함수만 떨어져나왔다..
console.log(isMethod());
```
그렇다.. 프로토타입과 동일 특성을 갖는다..
``` java
var temp;
// 성공 - gs.saro.me
temp = gs.getHost
console.log(temp.bind(gs)());

// 성공 - saro.me
temp = gs.getHost
console.log(temp.bind(saro)());

// 동적으로
temp = gs.getHost
console.log(temp.bind({ host : '동적값을 넣어보았다.' })());
```
saro 를 넣어도 성공한다.. 메서드라기보단 함수이다.
즉, 함수를 인자로 전달할대는 바인드 방식을 그대로 이용해야한다.


# 그럼 동적 프로토타입도 그대로 작동할까?
``` java
Saro.prototype.out = function()
{
	console.log('사로 클래스의 out을 프로토타입으로 덮어버림');
};

// 출력
saro.out();
gs.out();
```
결과
사로 클래스의 out을 프로토타입으로 덮어버림
가리사니 : gs.saro.me
상위 메서드를 불러볼까?
사로 클래스의 out을 프로토타입으로 덮어버림
충격과 공포....
- 선언된 클래스의 함수(이제 메서드라고 부르긴...)도 프로토타입을 통해서 동적으로 덮을 수 있다.


# 분석
- 프로토타입을 기반으로 만들어진 클래스 유사한 것 같다.
- 상속을 받고 super 로 상위 클래스에 접근 할 수 있다는 점이 프로토타입과의 다른 특징.


# 익명 클래스, 지역 클래스 생성방법
윗 부분에 있어야할 거같지만, 혼란스러움을 피하기 위해 여기에 작성되었다.
``` java
var namespace = {};

// 이런식으로 변수 내부에 클래스를 만들 수 있다.
// 이때보면 class의 이름이 생략된 것을 볼 수 있다.
// 이렇게 이름이 생략된 클래스를 익명 클래스 라고한다.
namespace.ClassA = class
{
}

// 똑같이 변수에 넣지만 이번엔 이름이 있는 클래스를 만들어보았다.
namespace.ClassB = class ClassNameIsB
{
}

// 그렇다면 클래스 이름은?
// 좀전에 만든 클래스의 이름들과 같이보자.
console.log(Saro.name); // "Saro"
console.log(Garisani.name); // "Garisani"
console.log(namespace.ClassA.name); // ""
console.log(namespace.ClassB.name); // "ClassNameIsB"
```