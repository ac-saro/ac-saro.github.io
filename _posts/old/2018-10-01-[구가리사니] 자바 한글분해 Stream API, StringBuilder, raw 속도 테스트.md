---
layout: post
tags: [가리사니, 기타]
---

> 이 문서는 예전 가리사니 사이트에서 작성된 문서 입니다.
현재 상황과 맞지 않을 수 있습니다.


# 서론
가리사니 리팩토리중 아래 소스를 발견하게 되었습니다.
아래 코드가 쓰이는 곳은 가리사니 글쓰기/수정시 태그 검색에 있어서 도깨비불 현상을 막고 "ㅐ" 와 "ㅔ" 같이 발음상으로 구분되지 않는 코드와 한/영 전환키를 모두 무시하고 찾도록 하기위해 만들어둔 코드입니다.


``` java
/**
 * 한글 처리 임시
 * @author	박용서
 */
public class KoFilter {
    private KoFilter() {
    }

    // 일반 분해
    private final static char[] KO_INIT_S   = { 'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ' }; // 19
    private final static char[] KO_INIT_M = { 'ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ', 'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ' }; // 21
    private final static char[] KO_INIT_E  = { 0, 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ' }; // 28
    // 완전 분해
    private final static char[][] KO_ATOM_S   = { {'ㄱ'}, {'ㄱ', 'ㄱ'}, {'ㄴ'}, {'ㄷ'}, {'ㄷ', 'ㄷ'}, {'ㄹ'}, {'ㅁ'}, {'ㅂ'}, {'ㅂ', 'ㅂ'}, {'ㅅ'}, {'ㅅ', 'ㅅ'}, {'ㅇ'}, {'ㅈ'}, {'ㅈ', 'ㅈ'}, {'ㅊ'}, {'ㅋ'}, {'ㅌ'}, {'ㅍ'}, {'ㅎ'} };
    private final static char[][] KO_ATOM_M = { {'ㅏ'}, {'ㅐ'}, {'ㅑ'}, {'ㅒ'}, {'ㅓ'}, {'ㅔ'}, {'ㅕ'}, {'ㅖ'}, {'ㅗ'}, {'ㅗ', 'ㅏ'}, {'ㅗ', 'ㅐ'}, {'ㅗ', 'ㅣ'}, {'ㅛ'}, {'ㅜ'}, {'ㅜ', 'ㅓ'}, {'ㅜ', 'ㅔ'}, {'ㅜ', 'ㅣ'}, {'ㅠ'}, {'ㅡ'}, {'ㅡ', 'ㅣ'}, {'ㅣ'} };
    private final static char[][] KO_ATOM_E  = { {}, {'ㄱ'}, {'ㄱ', 'ㄱ'}, {'ㄱ', 'ㅅ'}, {'ㄴ'}, {'ㄴ', 'ㅈ'}, {'ㄴ', 'ㅎ'}, {'ㄷ'}, {'ㄹ'}, {'ㄹ', 'ㄱ'}, {'ㄹ', 'ㅁ'}, {'ㄹ', 'ㅂ'}, {'ㄹ', 'ㅅ'}, {'ㄹ', 'ㅌ'}, {'ㄹ', 'ㅍ'}, {'ㄹ', 'ㅎ'}, {'ㅁ'}, {'ㅂ'}, {'ㅂ', 'ㅅ'}, {'ㅅ'}, {'ㅅ', 'ㅅ'}, {'ㅇ'}, {'ㅈ'}, {'ㅊ'}, {'ㅋ'}, {'ㅌ'}, {'ㅍ'}, {'ㅎ'} };
    private final static char[][] KO_ATOM_P  = {
            {'ㄱ'}, {'ㄱ', 'ㄱ'}, {'ㄱ', 'ㅅ'}, {'ㄴ'}, {'ㄴ', 'ㅈ'}, {'ㄴ', 'ㅎ'}, {'ㄷ'}, {'ㄸ'}, {'ㄹ'}, {'ㄹ', 'ㄱ'}, {'ㄹ', 'ㅁ'}, {'ㄹ', 'ㅂ'}, {'ㄹ', 'ㅅ'}, {'ㄹ', 'ㄷ'}, {'ㄹ', 'ㅍ'}, {'ㄹ', 'ㅎ'}, {'ㅁ'}, {'ㅂ'}, {'ㅂ', 'ㅂ'}, {'ㅂ', 'ㅅ'}, {'ㅅ'}, {'ㅅ', 'ㅅ'}, {'ㅇ'}, {'ㅈ'}, {'ㅈ', 'ㅈ'}, {'ㅊ'}, {'ㅋ'}, {'ㅌ'}, {'ㅍ'}, {'ㅎ'},
            {'ㅏ'}, {'ㅐ'}, {'ㅑ'}, {'ㅒ'}, {'ㅓ'}, {'ㅔ'}, {'ㅕ'}, {'ㅖ'}, {'ㅗ'}, {'ㅗ', 'ㅏ'}, {'ㅗ', 'ㅐ'}, {'ㅗ', 'ㅣ'}, {'ㅛ'}, {'ㅜ'}, {'ㅜ', 'ㅓ'}, {'ㅜ', 'ㅔ'}, {'ㅜ', 'ㅣ'}, {'ㅠ'}, {'ㅡ'}, {'ㅡ', 'ㅣ'}, {'ㅣ'}
    };
    // 영어 분해
    private final static char[] KO_ABC_S   = { 'r', 'R', 's', 'e', 'E', 'f', 'a', 'q', 'Q', 't', 'T', 'd', 'w', 'W', 'c', 'z', 'x', 'v', 'g' };
    private final static char[][] KO_ABC_M = { {'k'}, {'o'}, {'i'}, {'O'}, {'j'}, {'p'}, {'u'}, {'P'}, {'h'}, {'h', 'k'}, {'h', 'o'}, {'h', 'l'}, {'y'}, {'n'}, {'n', 'j'}, {'n', 'p'}, {'n', 'l'}, {'b'}, {'m'}, {'m', 'l'}, {'l'} };
    private final static char[][] KO_ABC_E  = { {}, {'r'}, {'R'}, {'r', 't'}, {'s'}, {'s', 'w'}, {'s', 'g'}, {'e'}, {'f'}, {'f', 'r'}, {'f', 'a'}, {'f', 'q'}, {'f', 't'}, {'f', 'x'}, {'f', 'v'}, {'f', 'g'}, {'a'}, {'q'}, {'q', 't'}, {'t'}, {'T'}, {'d'}, {'w'}, {'c'}, {'z'}, {'x'}, {'v'}, {'g'} };
    private final static char[][] KO_ABC_P  = {
            {'r'}, {'R'}, {'r', 't'}, {'s'}, {'s', 'w'}, {'s', 'g'}, {'e'}, {'E'}, {'f'}, {'f', 'r'}, {'f', 'a'}, {'f', 'q'}, {'f', 't'}, {'f', 'x'}, {'f', 'v'}, {'f', 'g'}, {'a'}, {'q'}, {'Q'}, {'q', 't'}, {'t'}, {'T'}, {'d'}, {'w'}, {'W'}, {'c'}, {'z'}, {'x'}, {'v'}, {'g'},
            {'k'}, {'o'}, {'i'}, {'O'}, {'j'}, {'p'}, {'u'}, {'P'}, {'h'}, {'h', 'k'}, {'h', 'o'}, {'h', 'l'}, {'y'}, {'n'}, {'n', 'j'}, {'n', 'p'}, {'n', 'l'}, {'b'}, {'m'}, {'m', 'l'}, {'l'}
    };
    // 영어 분해 : 쌍자음과 중복되는 음절제거 [주석으로 제거부분이 설명되어있다.]
    private final static char[] KO_FABC_S   = { 'r', 'r', 's', 'e', 'e', 'f', 'a', 'q', 'q', 't', 't', 'd', 'w', 'w', 'c', 'z', 'x', 'v', 'g' }; // ㄲ ㄱ / ㄸ ㄷ / ㅃ ㅂ / ㅆ ㅅ
    private final static char[][] KO_FABC_M = { {'k'}, {'p'}, {'i'}, {'P'}, {'j'}, {'p'}, {'u'}, {'P'}, {'h'}, {'h', 'k'}, {'h', 'l'}, {'h', 'l'}, {'y'}, {'n'}, {'n', 'j'}, {'n', 'l'}, {'n', 'l'}, {'b'}, {'m'}, {'m', 'l'}, {'l'} }; // ㅔ ㅐ / ㅖ ㅒ / ㅚ ㅙ ㅞ
    private final static char[][] KO_FABC_E  = { {}, {'r'}, {'R'}, {'r', 't'}, {'s'}, {'s', 'w'}, {'s', 'g'}, {'e'}, {'f'}, {'f', 'r'}, {'f', 'a'}, {'f', 'q'}, {'f', 't'}, {'f', 'x'}, {'f', 'v'}, {'f', 'g'}, {'a'}, {'q'}, {'q', 't'}, {'t'}, {'T'}, {'d'}, {'w'}, {'c'}, {'z'}, {'x'}, {'v'}, {'g'} };
    private final static char[][] KO_FABC_P  = {
            // ㄲ ㄱ / ㄸ ㄷ / ㅃ ㅂ / ㅆ ㅅ | ㅔ ㅐ (po) / ㅖ ㅒ (PO) / ㅚ ㅙ ㅞ (hl ho np)
            {'r'}, {'r'}, {'r', 't'}, {'s'}, {'s', 'w'}, {'s', 'g'}, {'e'}, {'e'}, {'f'}, {'f', 'r'}, {'f', 'a'}, {'f', 'q'}, {'f', 't'}, {'f', 'x'}, {'f', 'v'}, {'f', 'g'}, {'a'}, {'q'}, {'q'}, {'q', 't'}, {'t'}, {'t'}, {'d'}, {'w'}, {'W'}, {'c'}, {'z'}, {'x'}, {'v'}, {'g'},
            {'k'}, {'p'}, {'i'}, {'P'}, {'j'}, {'p'}, {'u'}, {'P'}, {'h'}, {'h', 'k'}, {'h', 'l'}, {'h', 'l'}, {'y'}, {'n'}, {'n', 'j'}, {'h', 'l'}, {'n', 'l'}, {'b'}, {'m'}, {'m', 'l'}, {'l'}
    };
    // 완전 분해 : 쌍자음과 중복되는 음절제거 [주석으로 제거부분이 설명되어있다.]
    private final static char[] KO_FATOM_S   = { 'ㄱ', 'ㄱ', 'ㄴ', 'ㄷ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅂ', 'ㅅ', 'ㅅ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ' }; // ㄲ ㄱ / ㄸ ㄷ / ㅃ ㅂ / ㅆ ㅅ
    private final static char[][] KO_FATOM_M = { {'ㅏ'}, {'ㅔ'}, {'ㅑ'}, {'ㅖ'}, {'ㅓ'}, {'ㅔ'}, {'ㅕ'}, {'ㅖ'}, {'ㅗ'}, {'ㅗ', 'ㅏ'}, {'ㅗ', 'ㅣ'}, {'ㅗ', 'ㅣ'}, {'ㅛ'}, {'ㅜ'}, {'ㅜ', 'ㅓ'}, {'ㅗ', 'ㅣ'}, {'ㅜ', 'ㅣ'}, {'ㅠ'}, {'ㅡ'}, {'ㅡ', 'ㅣ'}, {'ㅣ'} }; // ㅔ ㅐ / ㅖ ㅒ / ㅚ ㅙ ㅞ
    private final static char[][] KO_FATOM_E  = { {}, {'ㄱ'}, {'ㄱ', 'ㄱ'}, {'ㄱ', 'ㅅ'}, {'ㄴ'}, {'ㄴ', 'ㅈ'}, {'ㄴ', 'ㅎ'}, {'ㄷ'}, {'ㄹ'}, {'ㄹ', 'ㄱ'}, {'ㄹ', 'ㅁ'}, {'ㄹ', 'ㅂ'}, {'ㄹ', 'ㅅ'}, {'ㄹ', 'ㅌ'}, {'ㄹ', 'ㅍ'}, {'ㄹ', 'ㅎ'}, {'ㅁ'}, {'ㅂ'}, {'ㅂ', 'ㅅ'}, {'ㅅ'}, {'ㅅ', 'ㅅ'}, {'ㅇ'}, {'ㅈ'}, {'ㅊ'}, {'ㅋ'}, {'ㅌ'}, {'ㅍ'}, {'ㅎ'} };


    // 영어 분해 : 쌍자음과 중복되는 음절제거 [주석으로 제거부분이 설명되어있다.] - 임시
    private final static int[] KO_WABC_S   = { 'r', 'r', 's', 'e', 'e', 'f', 'a', 'q', 'q', 't', 't', 'd', 'w', 'w', 'c', 'z', 'x', 'v', 'g' }; // ㄲ ㄱ / ㄸ ㄷ / ㅃ ㅂ / ㅆ ㅅ
    private final static int[][] KO_WABC_M = { {'k'}, {'p'}, {'i'}, {'P'}, {'j'}, {'p'}, {'u'}, {'P'}, {'h'}, {'h', 'k'}, {'h', 'l'}, {'h', 'l'}, {'y'}, {'n'}, {'n', 'j'}, {'n', 'l'}, {'n', 'l'}, {'b'}, {'m'}, {'m', 'l'}, {'l'} }; // ㅔ ㅐ / ㅖ ㅒ / ㅚ ㅙ ㅞ
    private final static int[][] KO_WABC_E  = { {}, {'r'}, {'R'}, {'r', 't'}, {'s'}, {'s', 'w'}, {'s', 'g'}, {'e'}, {'f'}, {'f', 'r'}, {'f', 'a'}, {'f', 'q'}, {'f', 't'}, {'f', 'x'}, {'f', 'v'}, {'f', 'g'}, {'a'}, {'q'}, {'q', 't'}, {'t'}, {'T'}, {'d'}, {'w'}, {'c'}, {'z'}, {'x'}, {'v'}, {'g'} };
    private final static int[][] KO_WABC_P  = {
            // ㄲ ㄱ / ㄸ ㄷ / ㅃ ㅂ / ㅆ ㅅ | ㅔ ㅐ (po) / ㅖ ㅒ (PO) / ㅚ ㅙ ㅞ (hl ho np)
            {'r'}, {'r'}, {'r', 't'}, {'s'}, {'s', 'w'}, {'s', 'g'}, {'e'}, {'e'}, {'f'}, {'f', 'r'}, {'f', 'a'}, {'f', 'q'}, {'f', 't'}, {'f', 'x'}, {'f', 'v'}, {'f', 'g'}, {'a'}, {'q'}, {'q'}, {'q', 't'}, {'t'}, {'t'}, {'d'}, {'w'}, {'W'}, {'c'}, {'z'}, {'x'}, {'v'}, {'g'},
            {'k'}, {'p'}, {'i'}, {'P'}, {'j'}, {'p'}, {'u'}, {'P'}, {'h'}, {'h', 'k'}, {'h', 'l'}, {'h', 'l'}, {'y'}, {'n'}, {'n', 'j'}, {'h', 'l'}, {'n', 'l'}, {'b'}, {'m'}, {'m', 'l'}, {'l'}
    };

    // 예제와 상관없는 메서드 생략..

    /** 한글부분알파벳으로 변환합니다. [끝소리를 제외하고 비슷한소리제거]<br>에와애 = 에와에 = [dpdhkdp]*/
    public static String toWideAbcOld(String text)
    {
        if (text == null) {
        	return null;
        }

        char ch;
        int ce;
        int chi = 0;
        char[] cha;
        // 한글자당 최대 5글자가 될 수 있다.
        char[] rv = new char[text.length() * 5];
        char[] ts = text.toCharArray();

        for (int i = 0 ; i < ts.length ; i++) {
            ch = ts[i];
            if (ch >= '가' && ch <= '힣') {
                ce = ch - '가';
                rv[chi++] = KO_FABC_S[ce / (588)]; // 21 * 28 : 초성
                cha = KO_FABC_M[(ce = ce % (588)) / 28]; // 21 * 28 : 중성
                for (char c : cha) { rv[chi++] = c; }
                if ((ce = ce % 28) != 0) { // 종성
                    cha = KO_FABC_E[ce];
                    for (char c : cha) { rv[chi++] = c; }
                }
            }
            else if (ch >= 'ㄱ' && ch <= 'ㅣ') { // 자모
                cha = KO_FABC_P[ch - 'ㄱ'];
                for (char c : cha) { rv[chi++] = c; }
            }
            else {
                rv[chi++] = ch;
            }
        }

        return new String(rv, 0, chi);
    }
}
```

# 문제점
toWideAbcOld 를 보면 1/1000 초 속도에 집착하던 시절에 만든 코드임이 눈에 보입니다.
자바보단 C언어 코드같은 느낌도나고요....
그래서 가독성을위해 java stream api를 이용하여 작성해보았습니다.

``` java
/** 한글부분알파벳으로 변환합니다. [끝소리를 제외하고 비슷한소리제거]<br>에와애 = 에와에 = [dpdhkdp]*/
public static String toWideAbc(String text)
{
    if (text == null) {
        return null;
    }

    return text.codePoints().flatMap(ch -> {
        if (ch >= '가' && ch <= '힣') {
            int ce = ch - '가';
            int start = KO_WABC_S[ce / (588)]; // 21 * 28 : 초성
            int[] mid = KO_WABC_M[(ce = ce % (588)) / 28]; // 21 * 28 : 중성
            IntStream rv = IntStream.concat(IntStream.of(start), IntStream.of(mid));
            if ((ce = ce % 28) != 0) { // 종성
                return IntStream.concat(rv, IntStream.of(KO_WABC_E[ce]));
            } else {
                return rv;
            }
        } else if (ch >= 'ㄱ' && ch <= 'ㅣ') { // 자모
            return IntStream.of(KO_WABC_P[ch - 'ㄱ']);
        }
        return IntStream.of(ch);
    }).collect(StringBuilder::new, StringBuilder::appendCodePoint, 	StringBuilder::append).toString();
}
```
IntStream.concat(IntStream.of(start), IntStream.of(mid)) 같은 억지적인 요소들이 보입니다.
그리고 퍼포먼스를 돌려본 결과.. 점수가 많이 떨어져서 이번엔 하나를 더 만들어 보도록 하였습니다.

``` java
public static String toWideAbc2(String text)
{
    if (text == null) {
        return null;
    }

    char[] chs = text.toCharArray();
    // 한글자당 최대 5글자가 될 수 있다.
    StringBuilder sb = new StringBuilder(chs.length * 5);

    for (char ch : chs) {
        if (ch >= '가' && ch <= '힣') {
            int ce = ch - '가';
            sb.append(KO_FABC_S[ce / (588)]); // 21 * 28 : 초성
            sb.append(KO_FABC_M[(ce = ce % (588)) / 28]); // 21 * 28 : 중성
            if ((ce = ce % 28) != 0) {
                sb.append(KO_FABC_E[ce]); // 종성
            }
        } else if (ch >= 'ㄱ' && ch <= 'ㅣ') { // 자모
            sb.append(KO_FABC_P[ch - 'ㄱ']);
        } else {
            sb.append(ch);
        }
    }

    return sb.toString();
}
```


# 메서드

|함수|비고|
|---|---|
|toWideAbcOld()| 원래쓰던코드 |
|toWideAbc()|java stream api 이용 |
|toWideAbc2()| 스트링버퍼 |

``` java
// 기존
/** 한글부분알파벳으로 변환합니다. [끝소리를 제외하고 비슷한소리제거]<br>에와애 = 에와에 = [dpdhkdp]*/
public static String toWideAbcOld(String text)
{
    if (text == null) {
    	return null;
    }

    char ch;
    int ce;
    int chi = 0;
    char[] cha;
    // 한글자당 최대 5글자가 될 수 있다.
    char[] rv = new char[text.length() * 5];
    char[] ts = text.toCharArray();

    for (int i = 0 ; i < ts.length ; i++) {
        ch = ts[i];
        if (ch >= '가' && ch <= '힣') {
            ce = ch - '가';
            rv[chi++] = KO_FABC_S[ce / (588)]; // 21 * 28 : 초성
            cha = KO_FABC_M[(ce = ce % (588)) / 28]; // 21 * 28 : 중성
            for (char c : cha) { rv[chi++] = c; }
            if ((ce = ce % 28) != 0) { // 종성
                cha = KO_FABC_E[ce];
                for (char c : cha) { rv[chi++] = c; }
            }
        }
        else if (ch >= 'ㄱ' && ch <= 'ㅣ') { // 자모
            cha = KO_FABC_P[ch - 'ㄱ'];
            for (char c : cha) { rv[chi++] = c; }
        }
        else {
            rv[chi++] = ch;
        }
    }

    return new String(rv, 0, chi);
}

/** 한글부분알파벳으로 변환합니다. [끝소리를 제외하고 비슷한소리제거]<br>에와애 = 에와에 = [dpdhkdp]*/
public static String toWideAbc(String text)
{
    if (text == null) {
        return null;
    }

    return text.codePoints().flatMap(ch -> {
        if (ch >= '가' && ch <= '힣') {
            int ce = ch - '가';
            int start = KO_WABC_S[ce / (588)]; // 21 * 28 : 초성
            int[] mid = KO_WABC_M[(ce = ce % (588)) / 28]; // 21 * 28 : 중성
            IntStream rv = IntStream.concat(IntStream.of(start), IntStream.of(mid));
            if ((ce = ce % 28) != 0) { // 종성
                return IntStream.concat(rv, IntStream.of(KO_WABC_E[ce]));
            } else {
                return rv;
            }
        } else if (ch >= 'ㄱ' && ch <= 'ㅣ') { // 자모
            return IntStream.of(KO_WABC_P[ch - 'ㄱ']);
        }
        return IntStream.of(ch);
    }).collect(StringBuilder::new, StringBuilder::appendCodePoint, 	StringBuilder::append).toString();
}

/** 한글부분알파벳으로 변환합니다. [끝소리를 제외하고 비슷한소리제거]<br>에와애 = 에와에 = [dpdhkdp]*/
public static String toWideAbc2(String text)
{
    if (text == null) {
        return null;
    }

    char[] chs = text.toCharArray();
    // 한글자당 최대 5글자가 될 수 있다.
    StringBuilder sb = new StringBuilder(chs.length * 5);

    for (char ch : chs) {
        if (ch >= '가' && ch <= '힣') {
            int ce = ch - '가';
            sb.append(KO_FABC_S[ce / (588)]); // 21 * 28 : 초성
            sb.append(KO_FABC_M[(ce = ce % (588)) / 28]); // 21 * 28 : 중성
            if ((ce = ce % 28) != 0) {
                sb.append(KO_FABC_E[ce]); // 종성
            }
        } else if (ch >= 'ㄱ' && ch <= 'ㅣ') { // 자모
            sb.append(KO_FABC_P[ch - 'ㄱ']);
        } else {
            sb.append(ch);
        }
    }

    return sb.toString();
}
```

# 속도 테스트
``` java
@Test
public void temp() throws Exception {

	String text = "안녕하세요. 가리사니 개발자 공간 입니다. abcde 1234 !@#$";

	long t;
	String a = KoFilter.toWideAbc(text);
	String b = KoFilter.toWideAbcOld(text);
	String c = KoFilter.toWideAbc2(text);
	System.out.println(a);
	System.out.println(b);
	System.out.println(c);
	System.out.println(a.equals(b));
	System.out.println(a.equals(c));

	System.out.println("0회전 : [무시하는 데이터] 처음실행하면 속도가 느림 ");

	t = System.currentTimeMillis();
	for (int i = 0 ; i < 100 ; i++) {
		KoFilter.toWideAbc(text);
	}
	System.out.println("a : " + (System.currentTimeMillis() - t));

	t = System.currentTimeMillis();
	for (int i = 0 ; i < 100 ; i++) {
		KoFilter.toWideAbcOld(text);
	}
	System.out.println("b : " + (System.currentTimeMillis() - t));

	t = System.currentTimeMillis();
	for (int i = 0 ; i < 100 ; i++) {
		KoFilter.toWideAbc2(text);
	}
	System.out.println("c : " + (System.currentTimeMillis() - t));

	System.out.println("1회전");

	t = System.currentTimeMillis();
	for (int i = 0 ; i < 100000 ; i++) {
		KoFilter.toWideAbc(text);
	}
	System.out.println("a : " + (System.currentTimeMillis() - t));

	t = System.currentTimeMillis();
	for (int i = 0 ; i < 100000 ; i++) {
		KoFilter.toWideAbcOld(text);
	}
	System.out.println("b : " + (System.currentTimeMillis() - t));

	t = System.currentTimeMillis();
	for (int i = 0 ; i < 100000 ; i++) {
		KoFilter.toWideAbc2(text);
	}
	System.out.println("c : " + (System.currentTimeMillis() - t));

	System.out.println("2회전");

	t = System.currentTimeMillis();
	for (int i = 0 ; i < 100000 ; i++) {
		KoFilter.toWideAbc(text);
	}
	System.out.println("a : " + (System.currentTimeMillis() - t));

	t = System.currentTimeMillis();
	for (int i = 0 ; i < 100000 ; i++) {
		KoFilter.toWideAbcOld(text);
	}
	System.out.println("b : " + (System.currentTimeMillis() - t));

	t = System.currentTimeMillis();
	for (int i = 0 ; i < 100000 ; i++) {
		KoFilter.toWideAbc2(text);
	}
	System.out.println("c : " + (System.currentTimeMillis() - t));
}
```

# 결과
dkssudgktpdy. rkfltksl rpqkfwk rhdrks dlqslek. abcde 1234 !@#$
dkssudgktpdy. rkfltksl rpqkfwk rhdrks dlqslek. abcde 1234 !@#$
dkssudgktpdy. rkfltksl rpqkfwk rhdrks dlqslek. abcde 1234 !@#$
true
true
0회전 : [무시하는 데이터] 처음실행하면 속도가 느림
a : 6
b : 0
c : 1
1회전
a : 550
b : 36
c : 64
2회전
a : 430
b : 29
c : 44

# 결과정리
|함수|1회전 처리시간|2회전 처리시간|비고|
|---|---|---|---|
|toWideAbc()|550ms|430ms| java stream api 이용 |
|toWideAbcOld()|36ms|29ms| 원래쓰던코드 |
|toWideAbc2()|64ms|44ms| 스트링버퍼 |

# 결론
예전 같았으면 소스가독성과 상관없이 속도가 빠른 toWideAbcOld() 를 선택하지 않았을까 생각합니다.
\
이 테스트의 경우는 "안녕하세요. 가리사니 개발자 공간 입니다. abcde 1234 !@#$" 라는 글자 변경을 무려 10만번 반복하여 테스트결과 가장 느린것도 0.5초라는 결론이 나왔기 때문에 사용빈도가 낮고 가독성 차이가 크다면 굳이 toWideAbcOld() 를 고집하지 않아도 된다고 생각합니다.
\
하지만 스트림을 통해만든 toWideAbc() 는 toWideAbcOld(), toWideAbc2() 에 비해 가독성이 뛰어나다고 할 수 없으며 스트림에 맞추기위해 IntStream.concat(IntStream.of(start), IntStream.of(mid)) 같은 억지 요소들도 들어가게 됩니다.
\
그래서 toWideAbc() 는 제외 toWideAbcOld(), toWideAbc2() 중에  선택을 합니다.
\
그러나 필자는 이미 다 구현한데다가 공격수준으로 호출할 자동완성용으로 쓸 것 이기 때문에
toWideAbcOld 를 아래와 같이 약간 수정하는 것으로 결론내렸습니다.
``` java
/**
 * 한글부분알파벳으로 변환합니다. [끝소리를 제외하고 비슷한소리제거]
 * <br>
 * 에와애 = 에와에 = [dpdhkdp]
 */
public static String toWideAbc(String text) {
    if (text == null) {
        return null;
    }

    int tmp;
    int charsIndex = 0;
    char[] chars;
    // 한글자당 최대 5글자가 될 수 있다.
    char[] buffer = new char[text.length() * 5];

    for (char ch : text.toCharArray()) {
        if (ch >= '가' && ch <= '힣') {
            tmp = ch - '가'; // 한글의 시작부분을 구함
            buffer[charsIndex++] = KO_FABC_S[tmp / (588)]; // 21 * 28 : 초성을 구함
            chars = KO_FABC_M[(tmp = tmp % (588)) / 28]; // 21 * 28 : 중성을 구함
            for (char c : chars) { buffer[charsIndex++] = c; }
            // 종성을 구함
            if ((tmp = tmp % 28) != 0) {
                chars = KO_FABC_E[tmp];
                for (char c : chars) { buffer[charsIndex++] = c; }
            }
        } else if (ch >= 'ㄱ' && ch <= 'ㅣ') { // 자모 처리
            chars = KO_FABC_P[ch - 'ㄱ'];
            for (char c : chars) { buffer[charsIndex++] = c; }
        } else {
            buffer[charsIndex++] = ch;
        }
    }

    return new String(buffer, 0, charsIndex);
}
```
for (int i = 0 ; i < ts.length ; i++)
for (char ch : text.toCharArray())
같은 소소한 변화는 있지만 테스트상 속도에 변화를 주지는 않았습니다.