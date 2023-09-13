---
title: tags
layout: page
permalink: /tags
---



<ul>
{% for post in page.posts %}
  <li><a href="{{ post.url }}">{{ post.title }}</a> ({{ post.date | date_to_string }} | Tags: {{ post | tags }})</li>
{% endfor %}
</ul>

