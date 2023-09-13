---
title: 태그
layout: page
permalink: /tags
---


{% if page.tags %}
    {% for tag in page.tags %}
        {% if site.data.tags contains tag %}
            <span class="tag">{{ tag }}</span>
        {% endif %}
    {% endfor %}
{% endif %}
