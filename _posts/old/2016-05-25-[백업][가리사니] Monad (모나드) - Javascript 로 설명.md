---
layout: post
tags: [javascript]
---

> 이 문서는 가리사니 개발자 포럼에 올렸던 글의 백업 파일입니다.
오래된 문서가 많아 현재 상황과 맞지 않을 수 있습니다.



참고
https://curiosity-driven.org/monads-in-javascript
https://en.wikipedia.org/wiki/Monad_(functional_programming)


모나드는 수학적으로 어려운 개념이다보니.. 실무자들도 실습 위주로 알아서 쓰는 경우가 많다고합니다.
~~(영어와 수학만 있다보니 필자가 이해못해서 그런게... 아닐꺼에요.. 그..그렇죠?;;)~~
그러던 중 자바스크립트로 정리된 몇 가지 예제를 발견하고 ~~강의~~해설을 써보게 되었습니다.
원본 : https://curiosity-driven.org/monads-in-javascript


여기서는 [ Identity, Maybe, List, Continuation ] 모나드 만 다루도록 하겠습니다.
- 더 많은 종류는 본문 아래 참고를 확인해주시기 바랍니다.


# Identity 모나드
정의 : Identity 객체 (bind 함수를 포함)
``` java
function Identity(value)
{
	this.value = value;
}
Identity.prototype.bind = function(transform)
{
	return transform(this.value);
};
```
사용 예제
``` java
new Identity(1).bind
(
	value => new Identity(2).bind
	(
		value2 => new Identity(value - value2)
	)
);
```
결과 : Identity {value: -1}
해설
1. Identity 생성
- new Identity(1)
2. 생성된 객체의 bind 함수 실행 -> 람다 파라미터 value -> new Identity(1)의 값 1
- new Identity(1).bind( value => ... );
3. 내부에서 다시 new Identity(2) 실행 다시 바인드
- new Identity(1).bind( value => { new Identity(2).bind( value2 => ... ) } );
- 여기서 value 는 new Identity(1) value2 는 new Identity(2) 이다.
4. new Identity(2).bind 실행
- value (1) - value2 (2) == -1 의 값을 같는  Identity 을 생성
``` java
new Identity(1).bind
(
	value => new Identity(2).bind
	(
		// value2 => new Identity(value - value2) : 계산결과 value - value2 == -1;
		value2 => new Identity(-1)
	)
);
```
5. bind 는 실행 반환만 한다. 즉 상위 객체로 반환값을 연쇄적으로 전달.
- new Identity(-1) 즉 Identity {value: -1} 값이 올라간다.
6. 최종 반환
- 결과 Identity {value: -1}


# Maybe 모나드
``` java
function Just(value)
{
	this.value = value;
}
Just.prototype.bind = function(transform)
{
	return transform(this.value);
};
Just.prototype.toString = function()
{
	return 'Just(' + this.value + ')';
};
// 빈 값을 표현하기 위한.
var Nothing =
{
	bind: function()
	{
		return this;
	},
	toString: function()
	{
		return 'Nothing';
	}
};
```
사용 예제 1
``` java
new Just(5).bind
(
	value => new Just(6).bind
	(
		value2 => new Just(value + value2)
	)
);
```
결과 1 : Identity {value: 11}
해설
- 위 Identity 와 완전히 동일하다.
그럼 왜 Identity 가 아닌 Maybe 일까?
사용 예제 2
``` java
var out = new Just(5).bind
(
	value => Nothing.bind
	(
		value2 => new Just(value + alert(value2))
	)
);
out.toString();
```
결과 2 : "Nothing"
해설
- 얼핏보기엔 Identity 와 똑같아보이지만 Nothing 을 통한 전파를 중지 시키는 예제이다.
- Identity 를 봤다면 같은 구조이기 때문에 순차적으로 처리된다는 것을 알 수 있다.
1. Just에 5값을 넣어서 생성 바인드
- new Just(5).bind( value => ... )
2. 전역객체 Nothing 의 bind 함수 실행 (소스를 보면 프로토타입-new 객체가 아닌 상시 객체이다.)
- new Just(5).bind( value => Nothing.bind( value2 =>  ...) )
3. Nothing.bind 에는 콜이 없다. 다만 this 를 리턴할 뿐이다.
- 때문에 인자로 넣은 value2 => { new Just(value + alert(value2)) } 는 에초에 실행되지 않는다.
- 바로 Maybe 모나드가 Identity 와 다른점이다.
- 즉 문법이 틀리지 않은이상 Nothing.bind 안에 오류가 날만한 함수가 들어있어도.. 람다함수를 인자로 넣었을뿐.
- Nothing.bind 는 람다함수를 실행시키지 않는다.
- 즉 this를 리턴할 뿐이다.
4. Identity 와 마찬가지로 상단으로 반환값 Nothing을 전달한다.
5. out 에 입력 후 toString() 을 통해 출력한다.
- 결과 : "Nothing"
결론
자바스크립트에서 자주있는 단계적 null을 처리할 때 유용한 방법이다.
예를들어 user.dynamicData.nameData.nickname 이 있을때..
``` java
if ( user != null )
{
	if ( user.dynamicData != null )
	{
		if ( user.dynamicData.nameData != null )
		{
			// ....
		}
	}
}
```
위와 같이 예외처리 하는 것이 아닌 도중에 값이 없을때 전파를 중지시켜 값을 얻어 낼 수 있다.


# List 모나드
function* (제네레이터 함수) 에대한 설명은 아래 강의를 참조하세요.
- [/2016/05/25/%EB%B0%B1%EC%97%85-%EA%B0%80%EB%A6%AC%EC%82%AC%EB%8B%88-%EC%9E%90%EB%B0%94%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8-ES-6-function-(generator-function).html](/2016/05/25/%EB%B0%B1%EC%97%85-%EA%B0%80%EB%A6%AC%EC%82%AC%EB%8B%88-%EC%9E%90%EB%B0%94%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8-ES-6-function-(generator-function).html)
for ( of ) 에대한 설명은 아래 강의를 참조하세요.
- [/2016/05/25/%EB%B0%B1%EC%97%85-%EA%B0%80%EB%A6%AC%EC%82%AC%EB%8B%88-%EC%9E%90%EB%B0%94%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8-ES6-%EC%B6%94%EA%B0%80-%EA%B8%B0%EB%8A%A5%EB%93%A4.html](/2016/05/25/%EB%B0%B1%EC%97%85-%EA%B0%80%EB%A6%AC%EC%82%AC%EB%8B%88-%EC%9E%90%EB%B0%94%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8-ES6-%EC%B6%94%EA%B0%80-%EA%B8%B0%EB%8A%A5%EB%93%A4.html)
list 모나드는 재귀를 루프 형태로 바꿔주면서 느긋한연산이 가능하게 해줍니다.
사용 예제
``` java
function* bind(list, transform)
{
	for (var item of list)
	{
		yield* transform(item);
	}
}
var result = bind([1, 2, 3], function (element)
{
    return bind([10, 20, 30], function* (element2)
    {
        yield element + element2;
    });
});
for (var item of result)
{
    console.log(item);
}
```
해설
1. var result = bind([1, 2, 3], function (element) { ... });
- bind 실행 [1,2,3]과 함께 함수를 넘김
2. function (element) { ... } -> return bind([10, 20, 30], function* (element2)
- 넘긴 함수는 [10, 20, 30]과 함께 클로저로 받은 element 와 인자였던 [10, 20, 30]를 조합.
3. function* bind(list, transform)
- [10, 20, 30] + 1, [10, 20, 30] + 2, [10, 20, 30] + 3 을 반복한다.
- 물론 yield* 로 인해 한번에 하나씩만 반환하지만 for (var item of list) 실행된다.
- 쉽게 생각하면 2중 loop 라고 생각하면된다.
- yield* 가 3번씩 [10, 20, 30] 다시 3번 [1, 2, 3] 총 9번 호출된다.
기타 : 이해가 되지않는다면 먼저 위에서말한 제네레이터 함수를 참고하자!
- [/2016/05/25/%EB%B0%B1%EC%97%85-%EA%B0%80%EB%A6%AC%EC%82%AC%EB%8B%88-%EC%9E%90%EB%B0%94%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8-ES-6-function-(generator-function).html](/2016/05/25/%EB%B0%B1%EC%97%85-%EA%B0%80%EB%A6%AC%EC%82%AC%EB%8B%88-%EC%9E%90%EB%B0%94%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8-ES-6-function-(generator-function).html)
결과 :
11
21
31
12
22
32
13
23
33


# Continuation 모나드
이것을 이해하기 위해선 먼저 Promise 를 알아야한다.
- 참고 : [/2016/05/30/%EB%B0%B1%EC%97%85-%EA%B0%80%EB%A6%AC%EC%82%AC%EB%8B%88-Javascript-Promise.html](/2016/05/30/%EB%B0%B1%EC%97%85-%EA%B0%80%EB%A6%AC%EC%82%AC%EB%8B%88-Javascript-Promise.html)
사용예제
``` java
var p = Promise.resolve(5).then(function(value1)
{
	return Promise.resolve(10).then(function(value2)
	{
		return value1 + value2;
	});
});

p.then(function(value)
{
    console.log(value);
});
```
1. 무조건 성공하는 Promise.resolve(5) 에서
2. 다시 무조건 성공하는 Promise.resolve(10) 를 작성
3. Promise 는 바로 상태를 p에 저장하고 실행후 비동기적으로 상태를 바꾼다.
4. p.then(function(value) 를 통해 실행이 완료되면 값을 가져온다.


# 모나드의 구성
위 예제를 해봤다면 다 비슷한 구성이라는 것을 알 수 있다.
unit / bind 로 구성된다.
unit 의 경우는 타입을 래핑하는 역활을 한다.
생성자일 경우는 생성자이며 생성자가 아닐경우는 정적 메서드 팩토리에 속하게 된다.
- https://en.wikipedia.org/wiki/Type_constructor
bind 는 상태값이 없는 순수함수를 바인딩 해주는 역활을한다.
여기서 바인딩이란 **파라미터를 받아 반환을 연결 해주는 람다**를 바인딩(심어주는것이다.) 하는 것이다.
- 그리고 필요할때 바인딩이 된 함수가 실행되는 것이다.


# 참고
참고 : https://en.wikipedia.org/wiki/Monad_(functional_programming)
모나드의 종류
Identity monad
State monads
Writer monad
Continuation monad
I/O monad
Maybe monad
List monad
등...
코모나드의 종류
Identity comonad
Product comonad
Function comonad
Costate comonad
등...