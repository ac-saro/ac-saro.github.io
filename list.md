---
title: 목록
layout: page
permalink: /list
---

<ul class="li-4">
{%- for post in site.posts -%}
<li>
  {%- assign date_format = "%Y-%m-%d" -%}
  <a href="{{ post.url | relative_url }}">{{ post.date | date: date_format }} {{ post.title | escape }}</a>
</li>
{%- endfor -%}
</ul>
