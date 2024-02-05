---
layout: post
tags: [javascript, typescript, front-end]
---

> 이 문서는 가리사니 개발자 포럼에 올렸던 글의 백업 파일입니다.
오래된 문서가 많아 현재 상황과 맞지 않을 수 있습니다.

# 라이브러리 만들어서 공유합니다.

# Scroll-Loader
- A library that automatically calls loading when scrolling down
- Compatible with JavaScript, TypeScript, Vue.js, React, Svelte...
- Must use ES6 or higher

## Package

- https://www.npmjs.com/package/scroll-loader

```
"scroll-loader": "^1.0.5"
```

## Options
| name      | desc            | default value            |
|-----------|-----------------|--------------------------|
| target    | watching target | document.documentElement |
| sparePage | spare page      | 0.8                      |


![areas.png](https://raw.githubusercontent.com/saro-lab/scroll-loader/master/document/areas.png)

#### sparePage
- ex) scroll area height 1000px
  - sparePage: 0.2 = spare size is 200px
  - sparePage: 0.8 = spare size is 800px
  - sparePage: 1 = spare size is 1000px

## Methods
### watch(onWatch: boolean = true): void
- start watching scroll
- scroll event detection -> pause watching and call scrollCallback(...)

### onNeedNextPage(scrollCallback: (ScrollLoader) => void): ScrollLoader
- register watching callback

### destroy(): void
- destroy event and deactivate the instance


![flow.png](https://raw.githubusercontent.com/saro-lab/scroll-loader/master/document/flow.png)

## Example
``` js
// import
import scrollLoader from "scroll-loader";

// create instance
const sl = scrollLoader({
    sparePage: 1.8
});

// page
let page = 0;
let list = [];

// load list example
function loadList() {
    fetch(`/my/api/page/${page}`).then(pageData => {
        list = [...list, ...pageData.list];
        if (!pageData.isLastPage) {
            // resume the paused scroll event.
            sl.watch();
        }
    });
}

// callback for need to next page
sl.onNeedNextPage(() => {
  // if scrolling is performed as much as the reload condition, 
  // it is called only once and the event is paused.
  page++;
  loadList();
});

// destroy instance
onDestroyCallbackExampleInYourframework(() => {
    // remove the scroll event.
    // this instance is no longer available.
    sl.destroy();
});
```

## Code applied to the site
- https://github.com/anissia-net/anissia-web/blob/master/src/page/site/captionRecent.vue