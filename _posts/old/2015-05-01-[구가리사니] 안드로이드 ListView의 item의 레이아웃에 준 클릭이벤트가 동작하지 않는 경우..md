---
layout: post
tags: [가리사니, 기타]
---

> 이 문서는 예전 가리사니 사이트에서 작성된 문서 입니다.
현재 상황과 맞지 않을 수 있습니다.


원래 안드로이드 ListView 의 setOnItemClickListener() 나, 어뎁터의 _"리스트 레이아웃"_에 직접 클릭이벤트를 주는경우. 이 이벤트가 작동하지 않는경우가 있습니다.
주석 : 후자인 어뎁터뷰에 직접 클릭이벤트를 주는 행위는 권장하지 않는행위로 되도록 피하는 것이 좋지만.. 반드시 내부를 클릭하게 작업해야하는경우가 있습니다.

다시 본론으로 돌아와서 이러한 클릭이벤트가 동작하지 않을경우에는
``` java
@Override
public View getView(final int p, View v, ViewGroup vg)
{
	if (v == null)
	{
		v = ((LayoutInflater)ctx.getSystemService(Context.LAYOUT_INFLATER_SERVICE))
			.inflate(R.layout.레이아웃이름, vg, false)
	}
}
```
저 레이아웃의 xml에 들어가서 최상단에 다음과 같은 속성을 추가해주면 됩니다.
``` java
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:orientation="vertical" >
    <!-- ... 생략 ... -->
</LinearLayout>
```
android:clickable="false" 추가
``` java
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:clickable="false"  # 이 부분이 추가됨
    android:orientation="vertical" >
    <!-- ... 생략 ... -->
</LinearLayout>
```
