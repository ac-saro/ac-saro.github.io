---
layout: post
tags: [가리사니, 기타]
---

> 이 문서는 가리사니 개발자 포럼에 올렸던 글의 백업 파일입니다.
오래된 문서가 많아 현재 상황과 맞지 않을 수 있습니다.


@Query 에 옵션으로 nativeQuery=true 로 바꿔주면 사용할 수 있습니다.
``` java
public interface FnRepository extends JpaRepository<User, Long> {
	// nativeQuery=true 를 사용.
	@Query(value="SELECT now()", nativeQuery=true)
	public String now();

	// 역시 nativeQuery 의 특징은 아니지만 이런식으로 받아올 수도있다.
	// { Object[]{no, name}, Object[]{no, name},... Object[]{no, name} } 처럼 입력됨.
	@Query(value="SELECT no, name FROM data_function()", nativeQuery=true)
	public List<Object[]> datas();
}
```


# 출력
``` java
@Autowired
FnRepository fnRepository;

@ResponseBody
@RequestMapping(path="/now", produces="text/plain")
public String now(HttpServletResponse res) {
	return fnRepository.now();
}

@RequestMapping(path="/datas", produces="text/json")
public void user(HttpServletResponse res) throws IOException {
	Writer out = res.getWriter();

	for (Object[] data: fnRepository.datas()) {
		for (Object value : data) {
			out.write(value.toString());
			out.write("\r\n");
		}
	}
}
```