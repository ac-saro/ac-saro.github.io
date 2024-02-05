---
title: 태그
layout: page
permalink: /tags
---

{% assign rawtags = "" %}
{% for post in site.posts %}
{% assign ttags = post.tags | join:'|' | append:'|' %}
{% assign rawtags = rawtags | append:ttags %}
{% endfor %}
{% assign rawtags = rawtags | split:'|' | sort %}
{% assign tags = "" %}
{% for tag in rawtags %}
{% if tag != "" %}
{% if tags == "" %}
{% assign tags = tag | split:'|' %}
{% endif %}
{% unless tags contains tag %}
{% assign tags = tags | join:'|' | append:'|' | append:tag | split:'|' %}
{% endunless %}
{% endif %}
{% endfor %}
<div style="font-weight: bold;font-size:20px;">
    {% for tag in tags %}
        <a href="#{{ tag | slugify }}" style="display: inline-block; margin: 2px 6px">{{ tag }}</a> 
    {% endfor %}
</div>
<div class="hr-line">
{% for tag in tags %}
<div id="{{ tag | slugify }}" style="font-weight: bold;font-size:20px;">{{ tag }}</div>
<ul>
  {% for post in site.posts %}
  {% if post.tags contains tag %}
  <li>
      <a href="{{ post.url | prepend: site.baseurl }}">
        {{ post.title }}
      </a>
  </li>
  {% endif %}
  {% endfor %}
</ul>
{% endfor %}
</div>
