---
layout: post
tags: [가리사니, 기타]
---

> 이 문서는 예전 가리사니 사이트에서 작성된 문서 입니다.
현재 상황과 맞지 않을 수 있습니다.


# SAP JCO 시리즈
- [SAP RFC JCO (java - sapjco3.jar)를 이용한 접근방법](/lab?topicId=347)
- [SAP JCO Manager 라이브러리](/lab?topicId=352)

# 서론
저번에 올린 [SAP RFC JCO (java - sapjco3.jar)를 이용한 접근방법](https://gs.saro.me/lab?topicId=347) 이 생각보다 많이 쓰이는 것 같아 라이브러리를 잘 정리하여 **MAVEN** 에 업로드하였습니다.

# Github 주소
[https://github.com/saro-lab/sap-jco-manager

# 설정 방법
1. 디팬던시를 추가합니다.
    - maven
    ``` xml
    <!-- 최신버전은 위 깃허브 확인 -->
    <dependency>
      <groupId>me.saro</groupId>
      <artifactId>sap-jco-manager</artifactId>
      <version>3.0.14.6</version>
    </dependency>
    ```
    - gradle

    ```
    // 최신버전은 위 깃허브 확인
	compile 'me.saro:sap-jco-manager:3.0.14.6'
    ```
2. sapjco 파일을 추가합니다.
    - 회사에서 지원해준다면 해당 파일을 사용합니다.
        - 이름이 sapjco3 ( jar / so / jnilib / dll ) 입니다.
    - 지원해주는 파일이 없다면 아래에서 파일을 다운로드합니다.
        [http://maven.mit.edu/nexus/content/repositories/public/com/sap/conn/jco/sapjco3/3.0.14/](http://maven.mit.edu/nexus/content/repositories/public/com/sap/conn/jco/sapjco3/3.0.14/)
    - **파일을 추가하기 전에 반드시 이름을 바꿔주셔야합니다. :**
        - sapjco3-3.0.14.jar -> **sapjco3.jar** (필수)
        - sapjco3-3.0.14-linuxx86_64.so -> **sapjco3.so** (리눅스 사용시)
        - sapjco3-3.0.14-darwinintel64.jnilib -> **sapjco3.jnilib** (맥 사용시)
        - sapjco3-3.0.14-ntamd64.dll -> **sapjco3.dll** (윈도우즈 사용시)
    - 파일이 없거나 이름이 다른경우 아래와 같은 오류기 납니다.
      - jar 파일을 sapjco3.jar로 바꾸지않고 추가한경우
        ``` shell
        JCo initialization failed with java.lang.ExceptionInInitializerError:
          Illegal JCo archive "sapjco3-3.0.14.jar".
          It is not allowed to rename or repackage the original archive "sapjco3.jar".
        ```
      - 다음파일들을 추가하지 않거나 이름을 바꾸지 않고 추가한경우.
          sapjco3.so (linux), sapjco3.jnilib (mac), sapjco3.dll (windows)
        ``` shell
          java.lang.UnsatisfiedLinkError: no sapjco3 in java.library.path:
        ```

# 일반 사용 예제
``` java
public void normal() throws JCoException, IOException {
    // 매니저 파일 만들기 (아직 비연결상태)
    // 여기서 값이 틀린경우 다음 함수가져오기중 네트워크 연결에서 오류가 납니다.
    SapManager sap = SapManager
            .builder()
            .set(SapManagerBuilderOption.ASHOST, "host") // AS host
            .set(SapManagerBuilderOption.MSSERV, "9999") // MS port [AS, MS is MSSERV, GW is JCO_GWSERV]
            .set(SapManagerBuilderOption.SYSNR, "01") // system number
            .set(SapManagerBuilderOption.GROUP, "Group Name") // group
            .set(SapManagerBuilderOption.LANG, "KO") // language code
            .set(SapManagerBuilderOption.CLIENT, "100") // client number
            .set(SapManagerBuilderOption.USER, "user") // user
            .set(SapManagerBuilderOption.PASSWD, "password") // password
            .build();

    // 서버에 연결되어 함수를 가져옵니다.
    // 함수가져오기 (SAP 서버에 SAP_RFC_FUNC_NAME 라는 함수가 없으면 오류남)
    SapFunction function = sap.getFunction("SAP_RFC_FUNC_NAME");

    // 파라미터 세팅 (없으면 생략가능)
    function.getImportParameterList().setValue("param1", "text");
    function.getImportParameterList().setValue("param2", 1);
    function.getImportParameterList().setValue("param3", true);

    // 테이블 파라미터 예제 (없으면 생략가능)
    JCoTable requestTableParameter = function.getImportTableParameter("param4");
    List.of("value1", "value2", "value3").forEach(e -> {
        requestTableParameter.appendRow();
        requestTableParameter.setValue("field1", "text");
        requestTableParameter.setValue("field2", e);
        requestTableParameter.setValue("field3", false);
    });

    // 실행 후 결과 가져오기
    SapFunctionResult result = function.execute();

    // 결과 파라미터 예제 (없으면 생략가능)
    result.getExportParameterList().getString("param1");
    result.getExportParameterList().getInt("param2");
    result.getExportParameterList().getDate("param3");

    // 테이블가져오기 예제 (테이블명이 SAP_RESULT_TABLE_NAME 라고 가정했을때)
    List<Map<String, Object>> resultTable = result.getTable("SAP_RESULT_TABLE_NAME");

    // 결과 표시
    System.out.println("print SAP_RESULT_TABLE_NAME");
    resultTable.forEach(row -> {
        System.out.println("=============================================");
        row.forEach( (key, value) -> System.out.println(key + " : " + value) );
    });
}

```
# 멀티쓰레드 예제
- sapjco가 thread-safe 하기 때문에 그냥 사용하시면되지만 쉽게 사용하기 위한 예제입니다.
``` java
public void multipleThread() throws JCoException, IOException {
    // 예를들어 1,2,3,4 번에 해당하는 유저이름을 가져온다.
    List<Integer> userNoList = List.of(1, 2, 3, 4);

    // 연결 : 생략 "일반 사용 예제" 참고
    SapManager sap = null;

    // USER_TABLE 이라는 함수를 실행준비하고 아래와 같이 세팅
    // executeAllThreads(쓰레드 갯수, 처리할리스트, 처리과정)
    // 10개의 쓰레드로 다음과 같은 작업 후 모든 작업이 완료되면 반환
    List<String> userNameList = sap.getFunctionTemplate("USER_TABLE")
            .executeAllThreads(10, userNoList, (function, userNo) -> {

                // 일반적으로 사용
                function.getImportParameterList().setValue("user_no", userNo);
                SapFunctionResult result = function.execute();
                String name = result.getExportParameterList().getString("USER_NAME");

                return name;
            });

    // 결과 표시
    System.out.println("user names");
    System.out.println(userNameList);
}
```
# 커스텀 클래스 예제
- 테이블 결과를 원하는 클래스로 반환
``` java
public void recvTableToCustomClass() throws JCoException, IOException {
    // 연결 : 생략 "일반 사용 예제" 참고
    SapManager sap = null;

    // 함수실행 결과 가져오기
    SapFunction function = sap.getFunction("CALL_ALL_USER_LIST");
    SapFunctionResult result = function.execute();

    // 테이블을 원하는 클래스로 변환
    // (테이블이름, 클래스의 생성구문, 필드 삽입부분)
    List<User> userList = result.getTable("USER_TABLE", User::new, (user, field) -> {
        switch (field.getName()) {
        case "first_name" :
            user.setFirstName(field.getString());
            break;
        case "last_name" :
            user.setLastName(field.getString());
            break;
        case "birth" :
            user.setBirth(new SimpleDateFormat("yyyyMMdd").format(field.getDate()));
            break;
        case "join_date" :
            user.setJoinDate(field.getDate());
            break;
        }
    });

    // 결과
    System.out.println("print user list");
    userList.forEach(System.out::println);
}

// 원하는 클래스
public static class User {
    String firstName;
    String lastName;
    String birth;
    Date joinDate;
    public String getFirstName() {
        return firstName;
    }
    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }
    public String getLastName() {
        return lastName;
    }
    public void setLastName(String lastName) {
        this.lastName = lastName;
    }
    public String getBirth() {
        return birth;
    }
    public void setBirth(String birth) {
        this.birth = birth;
    }
    public Date getJoinDate() {
        return joinDate;
    }
    public void setJoinDate(Date joinDate) {
        this.joinDate = joinDate;
    }
    public String toString() {
        return firstName + " " + lastName + " " + birth + " " + joinDate;
    }
}

```