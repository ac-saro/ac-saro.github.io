---
layout: post
tags: [java]
---

> 이 문서는 가리사니 개발자 포럼에 올렸던 글의 백업 파일입니다.
오래된 문서가 많아 현재 상황과 맞지 않을 수 있습니다.




# 서론
자바에서 FTP (FTP, SFTP, FTPS)를 사용할 수 있는 유명한 라이브러리인 commons-net(FTP, FTPS), jsch(SFTP)를 공통 인터페이스화 하였습니다.

# 오픈소스
- [https://github.com/saro-lab/commons](https://github.com/saro-lab/commons)

# 준비
## maven
``` xml
<dependency>
  <groupId>me.saro</groupId>
  <artifactId>commons</artifactId>
  <version>3.0.2</version>
</dependency>
```

## gradle
```
compile 'me.saro:commons:3.0.2'
```

# 소스
``` java
public void example() throws IOException {

    String host = "localhost"; // 호스트
    int port = 22; // 포트 : 기본포트(FTP 21, FTPS 990, SFTP 22)
    String user = "testuser"; // 유저이름
    String pass = "test"; // 암호

    String path1 = "C:/test/out"; // 테스트 아웃풋
    String path2 = "C:/test/in"; // 테스트 인풋

    // 기본 디렉토리 생성
    new File(path1).mkdirs();
    new File(path2).mkdirs();

    // 기본 전송 파일 생성
    try (FileOutputStream fos = new FileOutputStream(path1+"/test.dat")) {
        fos.write("the test file".getBytes());
    }

    // FTP.openFTP : FTP
    // FTP.openFTPS : FTPS
    // FTP.openSFTP : SFTP
    try (FTP ftp = FTP.openSFTP(host, port, user, pass)) {

        System.out.println("==================================");
        System.out.println("## 현재위치");
        System.out.println(ftp.path());
        System.out.println("## 디렉토리 목록");
        ftp.listDirectories().forEach(e -> System.out.println(e));
        System.out.println("## 파일 목록");
        ftp.listFiles().forEach(e -> System.out.println(e));
        System.out.println("==================================");

        // 파일전송
        ftp.send(new File(path1+"/test.dat"));
        ftp.send("test-new", new File(path1+"/test.dat"));

        // 디렉토리 만들기
        ftp.mkdir("tmp");

        // 이동
        String pwd = ftp.path();
        ftp.path(pwd+"/tmp");

        System.out.println("==================================");
        System.out.println("## 현재위치");
        System.out.println(ftp.path());
        System.out.println("==================================");

        // 이동
        ftp.path(pwd);

        System.out.println("==================================");
        System.out.println("## 현재위치");
        System.out.println(ftp.path());
        System.out.println("## 디렉토리 목록");
        ftp.listDirectories().forEach(e -> System.out.println(e));
        System.out.println("## 파일 목록");
        ftp.listFiles().forEach(e -> System.out.println(e));
        System.out.println("==================================");

        // 다운로드
        ftp.recv("test.dat", new File(path2+"/test.dat"));
        ftp.recv("tmp", new File(path2+"/tmp")); // is not file, return false; not recv

        // 삭제
        ftp.delete("tmp");
        ftp.delete("test-new");
        ftp.delete("test.dat");

        System.out.println("==================================");
        System.out.println("## 디렉토리 목록");
        ftp.listDirectories().forEach(e -> System.out.println(e));
        System.out.println("## 파일 목록");
        ftp.listFiles().forEach(e -> System.out.println(e));
        System.out.println("==================================");


    } catch (Exception e) {
        e.printStackTrace();
    }
}
```