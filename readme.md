# 멀티플레이 게임서버

### 프로젝트 소개

tcp를 이용하여 멀티플레이 게임 서버를 구현하는 프로젝트입니다.

// 나중에 게임 플레이 사진 추가하기

### 디렉토리 구조

```
tcp_mutigame
📦src
 ┣ 📂config
 ┃ ┗ 📜config.js
 ┣ 📂constants
 ┃ ┣ 📜env.js
 ┃ ┗ 📜header.js
 ┣ 📂events
 ┃ ┣ 📜onConnection.js
 ┃ ┣ 📜onData.js
 ┃ ┣ 📜onEnd.js
 ┃ ┗ 📜onError.js
 ┣ 📂init
 ┣ 📂session
 ┃ ┗ 📜session.js
 ┣ 📂utils
 ┗ 📜server.js
```

### 패킷 구조

**바이트 구조**
| 필드 명 | 타입 | 설명 | 크기 |
| ----------- | -------- | -------------------- | ----- |
| totalLength | int | 메세지의 전체 길이 | 4Byte |
| packetType | int | 패킷의 타입 | 1Byte |
| protobuf | protobuf | 프로토콜 버퍼 구조체 | 가변 |

**프로토 버프 구조**

### 라이브러리

- dotenv: 환경변수 파일 .env 파일로부터 환경변수 정보를 읽고, 해당 환경변수를 사용할 수 있게 도와주는 라이브러리입니다.
  - 환경변수 값들은 process.env에 할당됩니다.

**개발 라이브러리**

- prettier: 코드를 일관성 있게 설정한 값으로 자동으로 관리해 주어 코드의 가독성을 도와주는 라이브러리입니다.
- nodemon: 테스트 프로젝트를 실행 중 자동으로 코드가 수정된 것을 인식하여 프로젝트를 재실행하여 개발속도를 높혀주는 라이브러리입니다.
