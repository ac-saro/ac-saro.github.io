---
layout: post
tags: [가리사니, 기타]
---

> 이 문서는 예전 가리사니 사이트에서 작성된 문서 입니다.
현재 상황과 맞지 않을 수 있습니다.


# 공식 문서
https://github.com/spring-projects/spring-framework/wiki/What's-New-in-the-Spring-Framework#whats-new-in-spring-framework-5x
- 그냥 주소만 올리기 뭐해서 내용을 카피했습니다.


# JDK 8+9 and Java EE 7 Baseline
Entire framework codebase based on Java 8 source code level now.
Java EE 7 API level required in Spring's corresponding modules now.
Full compatibility with JDK 9 as of July 2016.


# Removed Packages, Classes and Methods
Package mock.staticmock removed from spring-aspects module.
Packages web.view.tiles2 and orm.hibernate3/hibernate4 dropped.
Dropped support: Portlet, Velocity, JasperReports, XMLBeans, JDO, Guava.
Many deprecated classes and methods removed across the codebase.


# Core Container Improvements
JDK 8+ enhancements
JDK 9 preparations
XML configuration namespaces streamlined towards unversioned schemas.
Resource abstraction provides isFile indicator for defensive getFile access.


# General Web Improvements
Unified support for media type resolution through MediaTypeFactory delegate.
Full Servlet 3.1 signature support in Spring-provided Filter implementations.
Support for Protobuf 3.0 (currently beta 4).


# Reactive Programming Model
spring-core DataBuffer and Encoder/Decoder abstractions with non-blocking semantics.
spring-web HTTP message codec implementations with JSON (Jackson) and XML (JAXB) support.
New spring-web-reactive module with reactive support for the @Controller programming model adapting Reactive Streams to Servlet 3.1 containers as well as non-Servlet runtimes such as Netty and Undertow.
New WebClient with reactive support on the client side.
For more details refer to the chapter "Web Reactive Framework" in the reference docs.


# Testing Improvements
Complete support for JUnit 5's Jupiter programming and extension models in the Spring TestContext Framework.
New before and after test execution callbacks in the Spring TestContext Framework with support for TestNG, JUnit 5, and JUnit 4 via the SpringRunner (but not via JUnit 4 rules).
XMLUnit support upgraded to 2.2