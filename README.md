# team-collaboration-tool_FE
---
## **협업의민족**
<img width="520" height="520" alt="협업의민족_로고" src="https://github.com/user-attachments/assets/60a3a1a6-b19f-4320-b497-c692a1db7e2b" />

---
## **팀원**
| <img src="https://avatars.githubusercontent.com/u/165632972?v=4" width="150" height="150"/> | <img src="https://avatars.githubusercontent.com/u/165864773?v=4" width="150" height="150"/>  | <img src="https://avatars.githubusercontent.com/u/162142840?v=4" width="150" height="150"/> | <img src="https://avatars.githubusercontent.com/u/95535080?v=4" width="150" height="150"/> | <img src="https://avatars.githubusercontent.com/u/202252163?v=4" width="150" height="150"/> | <img src="https://avatars.githubusercontent.com/u/162234767?v=4" width="150" height="150"/> | <img src="https://avatars.githubusercontent.com/u/184063721?v=4" width="150" height="150"/> |
|:-------------------------------------------------------------------------------------------:|:-------------------------------------------------------------------------------------------:|:-------------------------------------------------------------------------------------------:|:-------------------------------------------------------------------------------------------:|:-------------------------------------------------------------------------------------------:|:-------------------------------------------------------------------------------------------:|:-------------------------------------------------------------------------------------------:|
|                                             PM / Leader                                              |                                             FE                                              |                                             FE                                             |                                             FE                                             |                                             BE                                              |                                             BE                                              |                                             BE                                              |
|                     Park Han Bi<br/>[@Hanbi21](https://github.com/Hanbi21)                     |                  Kim Ga Yeong<br/>[@kayeong97](https://github.com/kayeong97)                   |                      Ryu Seung Hyun<br/>[@RSH0770](https://github.com/RSH0770)                      |           Shin Hyeon Woo<br/>[@LENA2610](https://github.com/LENA2610)           |           Kang Jae Ho<br/>[@crongcrongcrong](https://github.com/crongcrongcrong)           |           Son Seung Woo<br/>[@thstmddn321](https://github.com/thstmddn321)            |           Jeon Jun Hwan<br/>[Junhwan-npc](https://github.com/Junhwan-npc)           |

<br>

---
## **Commit Message 규칙**

| 메시지 타입 | 설명 |
| :--- | :--- |
| **feat** |	➕ 새로운 기능 추가 |
| **fix** |	🪳 버그 수정 |
| **docs** |	📒문서 변경 |
| **style** |	✅ 코드 포맷팅, 세미콜론 누락 등 코드 변경이 없는 경우 |
| **revert** | ⏪ 이전 커밋으로 되돌릴 때 사용 |
| **chore**|	🔧 빌드 프로세스 또는 보조 도구 수정 (라이브러리 추가 등) |
| **refactor** |	🎛️ 코드 리팩토링 (기능 변경 없음) |

---
## 프로젝트 개요
* **주제:** 팀플을 위한 협업 툴
* **기술 스택:** React, CSS
* **배포 URL**: {LMS 참조}
    > ※ 서버 문제로 접속이 안 될 경우, 아래 '로컬 실행 가이드'를 참고해 주시기 바랍니다.

## 로컬 실행 가이드 (Local Installation)
배포된 서버 접속이 불가능할 경우, 아래 절차에 따라 로컬 환경에서 실행할 수 있습니다.

### 사전 요구 사항 (Prerequisites)
* **Node.js** (v16.0.0 이상 권장)가 설치되어 있어야 합니다.
* 터미널(CMD, PowerShell, iTerm 등) 사용이 필요합니다.

### 실행 단계 (Step-by-Step)

**1. 프로젝트 폴더로 이동**
압축을 푼 폴더(또는 클론한 폴더) 내부로 터미널 경로를 이동합니다.
```bash
cd [team-collaboration-tool_FE]
```

**2. 의존성 패키지 설치**
아래 명령어로 필요한 라이브러리를 설치합니다.
```bash
npm i
```

**3. .env 파일 추가**
백엔드 주소를 담아둔 .env 파일을 추가합니다.
```bash
# team-collaboration-tool_FE의 루트 디렉터리에서 아래 명령어를 실행합니다.
vi .env
# vi 실행 후 LMS에 첨부된 내용을 참고해서 .env 파일 내용으로 넣어주세요.
```

**4. 개발 서버 실행**
설치가 완료되면 아래 명령어로 로컬 서버를 실행합니다.
```bash
npm run dev
```

---
## 팀원 및 역할
---
### 김가영
- 로그인, 회원가입, 설정, 프로젝트 설정 구현
- 로그인, 회원가입, 설정, 프로젝트 설정, TopNavBar API 연결
- github 형상 관리

### 류승현

- Vite를 활용한 초기 개발 환경 구축 및 디렉터리 구조 표준화
- react-router-dom과 Outlet을 활용한 중첩 라우팅 및 레이아웃 구조 설계
- TopNavBar, LeftNavBar, BottomNavBar와 Calendar.jsx 구현
- Git Flow 전략을 도입해 형상 관리를 위한 브랜치 전략 및 커밋 컨벤션 수립
- AWS 서버 배포 및 관리

### 신현우
- 시간조율표 생성 및 목록창 개발
- 그리드표 드래그 기능 개발
- 게시판 내 기능들(작성, 조회, 수정, 삭제 등 상호작용) 개발

