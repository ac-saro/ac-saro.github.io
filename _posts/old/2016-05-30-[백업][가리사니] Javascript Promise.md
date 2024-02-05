---
layout: post
tags: [가리사니, 기타]
---

> 이 문서는 가리사니 개발자 포럼에 올렸던 글의 백업 파일입니다.
오래된 문서가 많아 현재 상황과 맞지 않을 수 있습니다.



이 문서는 ECMAScript 6 추가 기능을 서술하고 있습니다.


ECMAScript (JavaScript) 6 에 추가된 기능 Promise 에 대해서 알아보자.
참고 : https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Promise


# 생성구문
``` java
new Promise(executor);
```
executor 는 function(resolve, reject) { ... } 형태의 함수(바인딩 여부와 관계없는 콜백 함수의 형태) 입니다.


# 예제 1
``` java
// promise 실행 함수
function execPromise(seq)
{
	// 짝수 성공 / 홀수 실패
	var p = new Promise(function(resolve, reject)
	{
		// 이 안에서 비동기 적으로 실행되더라도 상관없다.
		// 때문에 0 ~ 3초 사이 랜덤하게 실행시켜보았다.
		window.setTimeout(function()
		{
			// 짝수인 경우
			if (seq % 2 == 0)
			{
				resolve(seq);
			}
			// 홀수인 경우
			else
			{
				reject(seq);
			}
		}, (Math.random() * 3000));
	});

	// then, catch 등은 자기자신을 반환하기 때문에 이렇게 사용할 수 있다.
	// 결과에 해당하면 반환되고 아니면 반환되지 않는다.
	p.then(function(val)
	{
		console.log('성공 : ' + val);
	}).catch(function(val)
	{
		console.log('실패 : ' + val);
	});

	return p;
}

// promise 실행
for (var i = 1 ; i <= 10 ; i++)
{
	execPromise(i);
}
```
결과
- 순서는 랜덤하게 하였음으로 어떻게 나올지 알수 없다.
- 랜덤하게 하지 않더라도 비동기, 즉 순서보장을 하지 않는다.
실패 : 7
실패 : 3
성공 : 10
성공 : 4
실패 : 5
실패 : 9
성공 : 6
성공 : 2
성공 : 8
실패 : 1


# 예제 2
그렇다면 Promise.all 에대해서 알아보자.
- while ( 실행결과성공 ) 처럼 반복하다가 모두 성공하면 then (전체 Promise 값 배열) 하나라도 실패하면 catch (실패 Promise 값) 을 반환한다.
- 즉 모두 성공할 경우 모든 Promise 가 반환될때까지 기다리지만, 하나라도 실패한 경우 실행->반환을 기다리지 않고 바로 콜백한다.
``` java
var promises;

// 방금전 예제를 all로 검사해보자.
promises = [];
for (var i = 1 ; i <= 10 ; i++)
{
	promises.push(execPromise(i));
}
// 도중에 실패를 감지하고 멈춘다.
Promise.all(promises).then(function(values)
{
	console.log('모두성공', values);
}).catch(function(value)
{
	console.log('실패가 있음', value);
});

// 모두 성공하는 예제
promises = [];
for (var i = 1 ; i <= 10 ; i++)
{
	promises.push(execPromise(i * 2));
}
// 실패가 없음으로 모든 promises 가 완료될때까지 기다렸다가 성공 값을 반환한다.
Promise.all(promises).then(function(values)
{
	console.log('모두성공', values);
}).catch(function(value)
{
	console.log('실패가 있음', value);
});
```


# 예제 3
그렇다면 Promise.race에대해서 알아보자.
- race는 성공 실패 여부를 떠나 단 하나라도 실행되면 바로 콜백한다.
``` java
var promises;

// 처음 예제
promises = [];
for (var i = 1 ; i <= 10 ; i++)
{
	promises.push(execPromise(i));
}
// 성공/실패와 관련없이 하나라도 콜백한다.
Promise.race(promises).then(function(value)
{
	console.log('하나의 작업이 끝남 : 성공', value);
}).catch(function(value)
{
	console.log('하나의 작업이 끝남 : 실패', value);
});
```


# 예제 4
무조건 성공이나 실패로 값을 전달하는 Promise 도 있다.
``` java
// 값을 실패로 전달
Promise.reject(1).then(function(value)
{
	console.log('성공', value);
}).catch(function(value)
{
	console.log('실패', value);
});

// 값을 성공으로 전달
Promise.resolve(2).then(function(value)
{
	console.log('성공', value);
}).catch(function(value)
{
	console.log('실패', value);
});
```


# 주의
프로미스는 아래의 3가지 상태를 가지게 된다.
대기 pending : 아직 실행되지 않음.
성공 fulfilled : 성공
실패 rejected : 실패
그리고 이 3가지 상태에 모두 속하지 않은 경우 정체 라고한다.
정체 settled :
- 실행은 되었으나 성공도 실패도 아님
- executor 가 어떤 함수도 호출하지 않음.
- 정체가 생기지 않도록 예외 처리를 해줘야한다.