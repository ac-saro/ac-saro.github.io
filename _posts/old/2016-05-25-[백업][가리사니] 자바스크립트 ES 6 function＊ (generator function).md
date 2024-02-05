---
layout: post
tags: [javascript]
---

> 이 문서는 가리사니 개발자 포럼에 올렸던 글의 백업 파일입니다.
오래된 문서가 많아 현재 상황과 맞지 않을 수 있습니다.



이 문서는 ECMAScript 6 추가 기능을 서술하고 있습니다.

ECMAScript (JavaScript) 6 에 추가된 기능 function* (generator function) 에 대해서 알아보자.
참고 : https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Statements/function*

# generator function 이란?
자바스크립트를 해보왔다면 function 조차도 자료형의 일부처럼 쓸 수 있다는 것을 알고있을것이다.
자바스크립트에서 function은 일급객체에 해당하기 때문이다.
일급객체에 속한 함수를 일급 함수라고 부르며 아래 참고사항을 살펴보자.
- 일급객체 : https://en.wikipedia.org/wiki/First-class_citizen
- 일급함수 : https://en.wikipedia.org/wiki/First-class_function
함수를 이해했다면 generator function은 함수와 달리 iterator 를 반환하고 next를 통해 함수내에서 움직인다.
요즘 많이 들어봤을 듯한 느긋한 계산이다.
- 느긋한계산 : https://en.wikipedia.org/wiki/Lazy_evaluation
- 제네레이터 : https://en.wikipedia.org/wiki/Generator_(computer_programming)
말로하면 어려우니 바로 예제를 보자!!


# javascript 의 일반 함수
그럼 예를들어서 일반적인 함수를 하나 만들어보자.
``` java
// 선언 방법만 다를 뿐 동일한 함수이다.
function func1()
{
	console.log('함수1');
}
var func2 = function()
{
	console.log('함수2');
};

func1();
func2();
console.log('일급 객체이니 변수에 넣어보자');
var varFn1 = func1;
var varFn2 = func2;
console.log('실행');
varFn1();
varFn2();
```
결과
함수1
함수2
일급 객체이니 변수에 넣어보자
실행
함수1
함수2


# generator function
일반적으로 오류라고 느껴지는 코드를 사용해보자.
``` java
// 무한 generator function
function* infinite_gfn()
{
	var seq = 0;
	while (true)
	{
		yield seq++;
	}
}

var gen = infinite_gfn();

for (var i = 0 ; i < 5 ; i++)
{
	console.log(gen.next().value);
}
```
해설
일반적인 함수만 사용해 왔다면 infinite_gfn 의 "while (true)" 에서 한번 놀라고 var gen = infinite_gfn(); 에서 두번 놀랄것이다.
generator function (이하 gfn : 귀찮으니 줄여부르자..) 에서는 일반 함수의 실행에 해당하는 gfn(); 때 실행되지 않는다.
var gen = infinite_gfn(); 즉 이상태에선 gen으로 iterator object 가 반환된다.
즉, 순차적으로 설명하자면.
1. infinite_gfn 를 선언했다.
2. infinite_gfn 를 실행하여 infinite_gfn 에 대한 iterator 를 gen에 반환했다.
3. for 실행 gen.next() 불림
4. gen.next() 는 infinite_gfn 을 yield 지시자 위치까지 실행한다.
5. 즉 yield seq++; 상태에서 yield 의 값 즉 0이 value에 들어가게되며, 함수는 그상태로 멈춘다.
- gen.next()[즉 현재 위치].value
6. gen.next().value 로 yield 의 값 0을 불러 console.log 를 찍는다.
7. for 실행 i = 1 위치
8. 다시 gen.next() 가되면 아까 멈췄던 위치 즉 yield seq++ 에서 다시 함수가 움직이기 시작!
- while (true) 를 통해 yield seq++ 에서 다시 멈추게된다. 이번에는 값이 1인 상태다.
9. gen.next().value 로 yield 의 값 1을 불러 console.log 를 찍는다.
- 이런식으로 5회의 for문 반복 후 종료한다.


# 그럼 예상되는 답안을 맞춰보자.
``` java
// 무한 generator function
function* infinite_gfn()
{
	var msg = '';
	while (true)
	{
		yield msg += '안녕';
		yield msg += '!!';
	}
}

var gen = infinite_gfn();

gen.next();
gen.next();
gen.next();
var val = gen.next().value;
// val의 값음 은 무었일까?
console.log('val의 값은 ' + val + ' 이다.');
```
- 힌트 : yield 를 만나면 멈추는 것이지 yield 는 몇번이고 쓸 수 있다.
- 여기까지 해보았다면 대충 감이 잡혔을 것이다.


# gfn을 이중으로 실행해보자!!
``` java
function* gfn1(no)
{
	yield no + 1;
	yield no + 2;
	yield no + 3;
}

function* gfn2(no)
{
	var tmp = gfn1(no);

	for (val of tmp)
	{
		yield val;
	}

	yield no + 100;
}

var gen = gfn2(100);

for (val of gen)
{
	console.log(val);
}
```
- for (element of array) 는 in 과 달리 프로퍼티가 아닌 iterator 의 값을 차례대로 반환해준다.
- 자바스크립트에 iterator 를 가진 것은 예를들어 배열이 있다.
- 이것또한 6버전에서 추가되었다.
결과
101
102
103
200
해설
(생략)
1. gfn2가 no 즉 100을 인자로 받아 진행된다.
- var gen = gfn2(100); 선언 뒤 for (val of gen) 구간
2. var tmp = gfn1(no); 으로 100을 넘겨주고 gfn1로 향한다.
3. for (val of tmp) 을 통해 gfn1의 모든 yield 를 사용할 때까지 반복한다.
- 그결과 101 102 103 을 반환한다.
4. 마찬가지로 200을 반환하면서 gfn2의 모든 yield 를 반환했으며 더이상 다음 iterator 가 없어 정지한다.


# gfn을 이중으로 실행해보자!! 2 - yield*
- 위 예제를 보면 이중으로 쓸때 매우불편하다고 느겼을 것이다.
- 하지만 yield* 를 사용하면 이 과정을 위임할 수 있다.
``` java
function* gfn1(no)
{
	yield no + 1;
	yield no + 2;
	yield no + 3;
}

function* gfn2(no)
{
	// yield* 가  gfn1 을 위임한다.
	yield* gfn1(no);
	yield no + 100;
}

var gen = gfn2(100);

for (val of gen)
{
	console.log(val);
}
```
해설
위 코드는 그 위 코드와 같은 코드이다.
다만 yield* 을 만난 시점에서 yield* 이 gfn1 를 위임하여 실행한 것이다.


# 기타
오프젝트나 클래스 {}내부에서는 아래와 같은 문법으로 선언하여 사용할 수 있다.
``` java
var temp =
{
	*genFn() { console.log('제네레이터 함수'); yield null; }
};

temp.genFn().next().value;
```
또한 일반적으로 변수에 선언할 때도 function 과 유사하게 선언 가능하다.
``` java
var tempGenFn = function* () { console.log('제네레이터 함수'); yield null; };
tempGenFn().next().value;
```