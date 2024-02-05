---
layout: post
tags: [가리사니, 기타]
---

> 이 문서는 예전 가리사니 사이트에서 작성된 문서 입니다.
현재 상황과 맞지 않을 수 있습니다.



> 이글의 출처는 다음과 같습니다.
>
http://blog.arzz.com/401


NSString에 담긴 한글을 초성, 중성, 종성으로 분리하기 위하여, wchar_t 형태로 변경하려고 삽질했던 경험담을 올려봅니다.

일단, wchar_t로 변경하려고 했던 이유는 유니코드를 이용하여, 유니코드 코드값(?)연산을 이용하여 분리하려고 했었는데요.

젤 문제가 되었던것이 NSString을, wchar_t로 바꾸기가 너무 힘들었다는 점이죠.
결론은, 굳이 저같은 삽질을 하지 않더라도, NSString자체가 유니코드를 사용하는 변수로, 그냥 NSString의 변수를 바로 연산하여도 되더라 이말입니다. = _= 젝일슨.

유니코드 연산법에 대한 PHP코드는 옛날에 적어두었던 글을 링크해둡니다.

``` java
- (NSString *)GetUTF8String:(NSString *)str {
	NSArray *cho = [[NSArray alloc] initWithObjects:@"ㄱ",@"ㄲ",@"ㄴ",@"ㄷ",@"ㄸ",@"ㄹ",@"ㅁ",@"ㅂ",@"ㅃ",@"ㅅ",@" ㅆ",@"ㅇ",@"ㅈ",@"ㅉ",@"ㅊ",@"ㅋ",@"ㅌ",@"ㅍ",@"ㅎ",nil];
	NSArray *jung = [[NSArray alloc] initWithObjects:@"ㅏ",@"ㅐ",@"ㅑ",@"ㅒ",@"ㅓ",@"ㅔ",@"ㅕ",@"ㅖ",@"ㅗ",@"ㅘ",@" ㅙ",@"ㅚ",@"ㅛ",@"ㅜ",@"ㅝ",@"ㅞ",@"ㅟ",@"ㅠ",@"ㅡ",@"ㅢ",@"ㅣ",nil];
	NSArray *jong = [[NSArray alloc] initWithObjects:@"",@"ㄱ",@"ㄲ",@"ㄳ",@"ㄴ",@"ㄵ",@"ㄶ",@"ㄷ",@"ㄹ",@"ㄺ",@"ㄻ",@" ㄼ",@"ㄽ",@"ㄾ",@"ㄿ",@"ㅀ",@"ㅁ",@"ㅂ",@"ㅄ",@"ㅅ",@"ㅆ",@"ㅇ",@"ㅈ",@"ㅊ",@"ㅋ",@" ㅌ",@"ㅍ",@"ㅎ",nil];

	NSString *returnText = @"";
	for (int i=0;i<[str length];i++) {
		NSInteger code = [str characterAtIndex:i];
		if (code >= 44032 && code <= 55203) { // 한글영역에 대해서만 처리
			NSInteger UniCode = code - 44032; // 한글 시작영역을 제거
			NSInteger choIndex = UniCode/21/28; // 초성
			NSInteger jungIndex = UniCode%(21*28)/28; // 중성
			NSInteger jongIndex = UniCode%28; // 종성

			returnText = [NSString stringWithFormat:@"%@%@%@%@", returnText, [cho objectAtIndex:choIndex], [jung objectAtIndex:jungIndex], [cho objectAtIndex:jongIndex]];
		}
	}
	return returnText;
}
```

이렇게 해두고, NSLog([GetUTF8String:@"알쯔"]); 라고 하면 ㅇㅏㄹㅉㅡ 가 리턴됩니다.
Objective-C는 아직 공부중인 언어라 문법으로 적어둔게 거지같을 수 도 있고 release 안한 변수도 보이고 뭐 그렇습니다. 걍 참고용으로만 사용하세요.