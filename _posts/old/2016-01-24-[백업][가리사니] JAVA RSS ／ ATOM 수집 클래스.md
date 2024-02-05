---
layout: post
tags: [가리사니, 기타]
---

> 이 문서는 가리사니 개발자 포럼에 올렸던 글의 백업 파일입니다.
오래된 문서가 많아 현재 상황과 맞지 않을 수 있습니다.


간단하게 만들어봤습니다.
조금 다듬어서 쓰시면 될 것 같습니다.

``` java
import java.net.URL;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Locale;

import javax.xml.stream.XMLInputFactory;
import javax.xml.stream.XMLStreamReader;

/**
 * 2016-01-23 전명 박용서 : 작성
 * 2016-01-24 전명 박용서 : 구조개선
 * 급하게 만든거라 조금 다듬고 쓰시면 될것 같습니다.
 */
public abstract class FeedReader
{
	/** 시간 포멧 */
	final private SimpleDateFormat DATE_FORMAT = new SimpleDateFormat("EEE, dd MMM yyyy HH:mm:ss", Locale.ENGLISH);
	final private XMLInputFactory XML_FACTORY = XMLInputFactory.newInstance();
	final private int TYPE_RSS = 1;
	final private int TYPE_ATOM = 2;

	/**
	 * 오류를 수집한다
	 * @param url 주소
	 * @param e 익셉션
	 */
	public abstract void onError(FeedInfomation info, Exception e);
	/**
	 * 최종 불러온 갯수
	 * @param url 주소
	 * @param count 갯수
	 */
	public abstract void onFinish(FeedInfomation info, int count);
	/**
	 * 해더를 불러온다.
	 * @param url 주소
	 * @param header 해더정보
	 */
	public abstract void onRssHeader(FeedInfomation info);
	/**
	 * 해더를 불러온다.
	 * @param url 주소
	 * @param header 해더정보
	 */
	public abstract void onAtomHeader(FeedInfomation info);
	/**
	 * 아이템
	 * @param url 주소
	 * @param item 아이템
	 */
	public abstract void onRssItem(FeedInfomation info, HashMap<String, String> item);
	/**
	 * 엔트리
	 * @param url 주소
	 * @param item 아이템(엔트리)
	 */
	public abstract void onAtomItem(FeedInfomation info, HashMap<String, String> item);

	/**
	 * 시간비교
	 * @param lastDate
	 * @param date
	 * @return
	 * @throws Exception
	 */
	private boolean isAfter(long lastDate, String date) throws Exception
	{
		if (date != null)
		{
			date = date.replaceFirst("\\+[\\d]{4}", "").trim();
			return DATE_FORMAT.parse(date).getTime() > lastDate;
		}
		return true;
	}

	/**
	 * 피드를 읽습니다.
	 * @param url
	 */
	public void read(FeedInfomation info)
	{
		read(info, 0);
	}

	/**
	 * 피드를 읽습니다.
	 * lastDate 이후 새롭게 갱신된 데이터만 읽습니다.
	 * @param url
	 * @param lastDate
	 */
	public void read(FeedInfomation info, Date lastDate)
	{
		read(info, lastDate != null ? lastDate.getTime() : 0L);
	}

	/**
	 * 피드를 읽습니다.
	 * lastDate 이후 새롭게 갱신된 데이터만 읽습니다.
	 * @param url
	 * @param lastDate
	 */
	public void read(FeedInfomation info, Calendar lastDate)
	{
		read(info, lastDate != null ? lastDate.getTimeInMillis() : 0L);
	}

	/**
	 * 피드를 읽습니다.
	 * lastDate 이후 새롭게 갱신된 데이터만 읽습니다.
	 * @param url
	 * @param lastDate
	 */
	public void read(FeedInfomation info, long lastDate)
	{
		int count = 0;
		int type = 0;
		boolean isNotChanged = false;
		String unitTagName = null;
		String timeTagName = null;
		String tagName;
		HashMap<String, String> header = info.getHeader();
		try
		{
			XMLStreamReader xml = XML_FACTORY.createXMLStreamReader(new URL(info.getUrl()).openStream(), "utf-8");
			// RSS / ATOM 종류 알아오기
			while(xml.hasNext())
			{
				xml.next();
				if(xml.getEventType() == XMLStreamReader.START_ELEMENT)
				{
					switch (xml.getLocalName().toUpperCase())
					{
						case "RSS" :
							type = TYPE_RSS;
							unitTagName = "item";
							timeTagName = "pubDate";
						break;
						case "FEED" :
							type = TYPE_ATOM;
							unitTagName = "entry";
							timeTagName = "modified";
						break;
						default :
							throw new Exception("is not RSS / ATOM");
					}
					break;
				}
			}
			// 해더 가져오기
			while(xml.hasNext())
			{
				xml.next();
				if(xml.getEventType() == XMLStreamReader.START_ELEMENT)
				{
					if ((!unitTagName.equals((tagName = xml.getLocalName()))))
					{
						try
						{
							String value = xml.getElementText();
							if (timeTagName.equals(tagName))
							{
								if (!isAfter(lastDate, value))
								{
									isNotChanged = true;
								}
							}

							header.put(tagName, value);
						}
						catch (Exception e) {  }
					}
					else
					{
						break;
					}
				}
			}
			switch (type)
			{
				case TYPE_RSS : onRssHeader(info); break;
				case TYPE_ATOM : onAtomHeader(info); break;
			}
			if (isNotChanged)
			{
				onFinish(info, count);
			}
			// 아이템 가져오기
			do
			{
				xml.next();
				if(xml.getEventType() == XMLStreamReader.START_ELEMENT && unitTagName.equals(xml.getLocalName()))
				{
					HashMap<String, String> item = new HashMap<>();
					while(xml.hasNext())
					{
						xml.next();

						if (xml.getEventType() == XMLStreamReader.START_ELEMENT)
						{
							try
							{
								tagName = xml.getLocalName();
								String value = xml.getElementText();

								if (timeTagName.equals(tagName))
								{
									// 끝이나와 더이상 검사할 필요가 없음
									if (!isAfter(lastDate, value))
									{
										onFinish(info, count);
										return;
									}
								}

								item.put(tagName, value);
							}
							catch (Exception e)
							{
								// 급하게 만들어본건데 getElementText 에서 오류가 나는 조건이있습니다.
								// 이부분은 마져 완성해서 사용하시기 바랍니다.
							}
						}
						else if(xml.getEventType() == XMLStreamReader.END_ELEMENT && unitTagName.equals(xml.getLocalName()))
						{
							count++;
							switch (type)
							{
								case TYPE_RSS : onRssItem(info, item); break;
								case TYPE_ATOM : onAtomItem(info, item); break;
							}
							break;
						}
					}
				}
			}
			while (xml.hasNext());

			onFinish(info, count);
		}
		catch (Exception readException)
		{
			onError(info, readException);
		}
	}

	public abstract static class FeedInfomation
	{
		private String url;
		private HashMap<String, String> header = new HashMap<>();

		public String getUrl()
		{
			return url;
		}

		public void setUrl(String url)
		{
			this.url = url;
		}

		public HashMap<String, String> getHeader() {
			return header;
		}
	}
}
```

# 사용예제
``` java
import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.HashMap;
import java.util.Map;

public class MainTest
{
	public static Feed feed = new Feed();

	public static void main(String[] args) throws Exception
	{
		// 직접 유효한 주소를 넣어서 써보세요.
		// Feed를 확장하여 원하는 형태로 사용가능합니다.
		feed.read(new FeedInfo("http://j.saro.me/rss", 1));
		//feed.read(new FeedInfo("http://blog.colcol.net/rss", 1));
	}

	/**
	 * 상속 예제
	 */
	public static class FeedInfo extends FeedReader.FeedInfomation
	{
		public FeedInfo() {}
		public FeedInfo(String url, int uniqueId)
		{
			setUrl(url);
			setUniqueId(uniqueId);
		}

		private int uniqueId;

		public int getUniqueId() {
			return uniqueId;
		}

		public void setUniqueId(int uniqueId) {
			this.uniqueId = uniqueId;
		}
	}

	public static class Feed extends FeedReader
	{

		@Override
		public void onError(FeedInfomation info, Exception e)
		{
			errorPrint(e);
		}

		@Override
		public void onFinish (FeedInfomation info, int count)
		{
			System.out.println(count + " -> " + ((FeedInfo)info).getUrl());
		}

		@Override
		public void onRssHeader(FeedInfomation info)
		{
			System.out.println("RSS 해더");
			System.out.println(((FeedInfo)info).getUrl());
			for (Map.Entry<String,String> node : info.getHeader().entrySet())
			{
				System.out.print(node.getKey());
				System.out.print(" : ");
				System.out.println(node.getValue());
			}
		}

		@Override
		public void onAtomHeader(FeedInfomation info)
		{
			System.out.println("ATOM 해더");
			System.out.println(((FeedInfo)info).getUrl());
			for (Map.Entry<String,String> node : info.getHeader().entrySet())
			{
				System.out.print(node.getKey());
				System.out.print(" : ");
				System.out.println(node.getValue());
			}
		}

		@Override
		public void onRssItem(FeedInfomation info, HashMap<String, String> item)
		{
			System.out.println("아이템시작 RSS---");
			for (Map.Entry<String,String> node : item.entrySet())
			{
				System.out.print(node.getKey());
				System.out.print(" : ");
				System.out.println(node.getValue());
			}
		}

		@Override
		public void onAtomItem(FeedInfomation info, HashMap<String, String> item)
		{
			System.out.println("아이템시작 ATOM---");
			for (Map.Entry<String,String> node : item.entrySet())
			{
				System.out.print(node.getKey());
				System.out.print(" : ");
				System.out.println(node.getValue());
			}
		}
	}

	/**
	 * 오류보기
	 * @param e
	 * @return
	 */
	public static void errorPrint(Exception e)
	{
		if (e == null) { System.out.println("NULL"); }

		try (StringWriter sw = new StringWriter() ; PrintWriter pw = new PrintWriter(sw))
		{
			e.printStackTrace(pw);
			pw.flush();
			sw.flush();
			System.out.println("오류\n" + sw.toString());
		}
		catch (Exception ex) { System.out.println("그만해!!"); }
	}
}
```
