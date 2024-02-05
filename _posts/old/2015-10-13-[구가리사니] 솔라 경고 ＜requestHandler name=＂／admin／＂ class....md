---
layout: post
tags: [가리사니, 기타]
---

> 이 문서는 예전 가리사니 사이트에서 작성된 문서 입니다.
현재 상황과 맞지 않을 수 있습니다.


<requestHandler name="/admin/" class="solr.admin.AdminHandlers" /> is deprecated . It is not required anymore
라는 경고가 뜰경우.

solrconfig.xml 에서 <requestHandler name="/admin/" class="solr.admin.AdminHandlers" /> 를 지워주시면됩니다.

필자처럼 솔라를 낮은버전부터 쓰고있다가 업데이트한 사람들에게 나타나는 증상입니다.
사유는 말그대로입니다... 더 이상 쓰지않는.


추신.
이로써 솔라 Logging 에 경고/오류 0개를 달성했습니다. 하하하...
(사용자가 많아야 의미가 있을 듯 합니다.... 하하하하)