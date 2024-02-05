---
layout: post
tags: [가리사니, 기타]
---

> 이 문서는 예전 가리사니 사이트에서 작성된 문서 입니다.
현재 상황과 맞지 않을 수 있습니다.


> 이글의 출처는 다음과 같습니다.
>
http://developer.android.com/reference/android/app/ActivityManager.RunningAppProcessInfo.html
``` java
for (RunningAppProcessInfo runningProInfo : runningProcInfo) {
	int pid = runningProInfo.pid;
	Log.e(TAG+"-pid", ""+pid);
}

// RunningAppProcessInfo 의 맴버
public int	importance //	The relative importance level that the system places on this process.
public int	importanceReasonCode //	The reason for importance, if any.
public ComponentName	importanceReasonComponent // For the specified values of importanceReasonCode, this is the name of the component that is being used in this process.
public int 	importanceReasonPid //	For the specified values of importanceReasonCode, this is the process ID of the other process that is a client of this process.
public int lastTrimLevel //	Last memory trim level reported to the process: corresponds to the values supplied toComponentCallbacks2.onTrimMemory(int).
public int	lru //	An additional ordering within a particular importance category, providing finer-grained information about the relative utility of processes within a category.
public int	pid //	The pid of this process; 0 if none
public String[]	pkgList //	All packages that have been loaded into the process.
public String	processName //	The name of the process that this object is associated with
public int	uid //	The user id of this process.
```