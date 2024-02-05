---
layout: post
tags: [가리사니, 기타]
---

> 이 문서는 예전 가리사니 사이트에서 작성된 문서 입니다.
현재 상황과 맞지 않을 수 있습니다.


``` java
java.lang.IllegalStateException: The content of the adapter has changed but ListView did not receive a notification.
Make sure the content of your adapter is not modified from a background thread, but only from the UI thread.
 Make sure your adapter calls notifyDataSetChanged() when its content changes.
 [in ListView(2131100424, class android.widget.ListView) with Adapter(class 패키지/클래스경로)]
```

이 오류는 리스트뷰가 불리고 있는 도중 쓰래드를 통해서 리스트 뷰의 불리는 정보를 수정할 때 나는 오류입니다.

``` java
public class 기본클래스
{
	public ArrayList<Node> nodeList= new ArrayList<ScheList.Node>();

	public void draw()
	{
		// 스래드를 통해 nodeList를 수정한다.
	}

	public class NodeAdapter extends BaseAdapter
	{
		@Override
		public int getCount()
		{
			// 여기서 nodeList는 전역으로 지정된 것입니다.
			return nodeList.size();
		}
	}
}
```
대충 구현하자면 위와같은 형태가 됩니다.

// 스래드를 통해 nodeList를 수정한다. 이부분이 도는 도중에 Adapter가 getView나 getCount등 nodeList를 부를 경우 충돌이 일어나 위와 같은 오류가 납니다.

여러가지 해결방법이 있지만 이 구조를 그대로 유지해야하는 경우에는 아래와 같이 해결할 수 있습니다.
``` java
public void draw()
{
	public ArrayList<Node> tmpNodeList= new ArrayList<ScheList.Node>();
	// 스래드를 통해 tmpNodeList를 작업한다.
	// 쓰래드가 종료된 후 핸들러를 통해 nodeList = tmpNodeList 를해준다.
	// 두말하면 잔소리지만 .notifyDataSetChanged();를 써준다.
}
```
위와 같이 해결할 수 있습니다.
데이터량이 많고 쓰레드로 돌아야하는 작업이 매우 많을 때 사용할 수 있는 방법입니다.