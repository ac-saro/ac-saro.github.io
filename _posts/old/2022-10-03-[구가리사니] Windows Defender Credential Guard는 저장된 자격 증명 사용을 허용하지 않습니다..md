---
layout: post
tags: [가리사니, 기타]
---

> 이 문서는 예전 가리사니 사이트에서 작성된 문서 입니다.
현재 상황과 맞지 않을 수 있습니다.

# 증상
Windows 11 22H2 업데이트 이후 MSTSC (원격 데스크톱)시 아래 메시지

- Windows Defender Credential Guard는 저장된 자격 증명 사용을 허용하지 않습니다.
- Windows Defender Credential Guard does not allow using saved credentials.

![설명](/file/forum/64ee9439-efc1-4bf5-a5bd-4f6ebde920fe.png)


# 해결법

1. 레지스트리 편집기 실행
    1. HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\DeviceGuard
        1. DWORD (값:0) EnableVirtualizationBasedSecurity 추가
        1. DWORD (값:0) RequirePlatformSecurityFeatures 추가
    1. HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Lsa
        1. DWORD (값:0) LsaCfgFlags 추가
1. 자격 증명 관리자 이동
    1. 기존 자격 증명 제거 
    1. TERMSRV/(호스트/이름) 식으로 시작.
1. 컴퓨터 부팅
1. 원격 접속 (다시 저장)

아마도 Windows 11 22H2 업데이트의 버그 같은 느낌이라 그냥 기다리면 고쳐질 것 같기도 합니다.


# 참고
https://learn.microsoft.com/en-us/answers/questions/1021785/windows-11-22h2-can39t-use-saved-credential.html