---
layout: post
tags: [가리사니, 기타]
---

> 이 문서는 예전 가리사니 사이트에서 작성된 문서 입니다.
현재 상황과 맞지 않을 수 있습니다.

이번에 RSS 리더를 직접 만들어 보았습니다.
jackson의 xml -> map 보다 조금 더 빠른 속도를 내며, 스트림 중간에 멈출 수 있습니다.

# 깃 허브 주소
- https://github.com/saro-lab/rss-stream-reader

## Kotlin Example
```
// reader is thread-safe
val reader = RssStreamReader.Builder().build()
```
```
// normal
val rss = reader.url("https://test/rss.xml")

// print
println(rss)
println("- items")
rss.items.forEach(::println)
```
```
// stream stop
val rss = reader.url("https://test/rss.xml") { item, channel ->
    if (lastLink == item.link) {
        // The RSS feed stream has been stopped because the RSS feed items are duplicated.
        return@url false
    }
    true
}
```

## Java Example
```
// reader is thread-safe
RssStreamReader reader = new RssStreamReader.Builder().build();
```
```
// normal
var rss = reader.url("https://test/rss.xml");

// print
System.out.println(rss);
System.out.println("- items");
rss.getItems().stream().forEach(System.out::println);
```
```
// stream stop
var rss = reader.url("https://test/rss.xml", (item, channel) -> {
    if (lastLink.equals(item.getLink())) {
        // The RSS feed stream has been stopped because the RSS feed items are duplicated.
        return false;
    }
    return true;
});
```
