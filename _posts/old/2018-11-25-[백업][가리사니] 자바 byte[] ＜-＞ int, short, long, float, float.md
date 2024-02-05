---
layout: post
tags: [가리사니, 기타]
---

> 이 문서는 가리사니 개발자 포럼에 올렸던 글의 백업 파일입니다.
오래된 문서가 많아 현재 상황과 맞지 않을 수 있습니다.



# 오픈소스
- [https://github.com/saro-lab/commons](https://github.com/saro-lab/commons)

# 준비
## maven
``` xml
<dependency>
  <groupId>me.saro</groupId>
  <artifactId>commons</artifactId>
  <version>3.0.2</version>
</dependency>
```

## gradle
```
compile 'me.saro:commons:3.0.2'
```

``` java
// byte -> byte[]
Bytes.toBytes(long) : byte[]
// short -> byte[]
Bytes.toBytes(short) : byte[]
// int -> byte[]
Bytes.toBytes(int) : byte[]
// float -> byte[]
Bytes.toBytes(float) : byte[]
// double -> byte[]
Bytes.toBytes(double) : byte[]


// byte[] -> short
Bytes.toShort(byte[]) : short
// byte[] -> int
Bytes.toInt(byte[]) : int
// byte[] -> long
Bytes.toLong(byte[]) : long
// byte[] -> float
Bytes.toFloat(byte[]) : float
// byte[] -> double
Bytes.toDouble(byte[]) : double


// - using offset
// byte[] -> short
Bytes.toShort(byte[], int) : short
// byte[] -> int
Bytes.toInt(byte[], int) : int
// byte[] -> long
Bytes.toLong(byte[], int) : long
// byte[] -> float
Bytes.toFloat(byte[], int) : float
// byte[] -> double
Bytes.toDouble(byte[], int) : double
```

# 테스트
``` java
public class BytesTest {

    @Test
    public void shortTest() {
        assertEquals(Bytes.toHex(Bytes.toBytes((short)32)), "0020");
        assertEquals(Bytes.toHex(Bytes.toBytes((short)Short.parseShort("-1"))), "ffff");
        assertEquals(Bytes.toShort(Bytes.toBytes((short)123)), (short)123);
    }

    @Test
    public void intTest() {
        assertEquals(Bytes.toHex(Bytes.toBytes((int)32)), "00000020");
        assertEquals(Bytes.toHex(Bytes.toBytes((int)-1)), "ffffffff");
        assertEquals(Bytes.toInt(Bytes.toBytes(8080)), 8080);
    }

    @Test
    public void longTest() {
        assertEquals(Bytes.toHex(Bytes.toBytes((long)32)), "0000000000000020");
        assertEquals(Bytes.toHex(Bytes.toBytes(-1L)), "ffffffffffffffff");
        assertEquals(Bytes.toLong(Bytes.toBytes(324L)), 324L);
    }

    @Test
    public void floatTest() {
        float value = 32;
        byte[] bytes = Bytes.toBytes(value);
        float rocv = Bytes.toFloat(bytes);
        assertEquals(value, rocv);
    }

    @Test
    public void dobuleTest() {
        double value = 32;
        byte[] bytes = Bytes.toBytes(value);
        double rocv = Bytes.toDouble(bytes);
        assertEquals(value, rocv);
    }
}
```